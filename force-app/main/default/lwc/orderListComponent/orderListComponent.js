import { LightningElement, track } from 'lwc';
import getCurrentUserOrders from '@salesforce/apex/OrderController.getCurrentUserOrders'
import CURRENCY_CODE from '@salesforce/i18n/currency';

export default class OrderListComponent extends LightningElement {
    FILTER_ALL = '--All--';

    @track totalPrice;
    @track filteredOrders= [];
  
    orders;
    error;
  
    filterStatus = this.FILTER_ALL;
    filterDate = this.FILTER_ALL;
    filterDish = this.FILTER_ALL;
  
    columns = [
      {label: 'Date', fieldName: 'Closed_Date__c', hideDefaultActions: true},
      {label: 'Status', fieldName: 'Status__c', hideDefaultActions: true},
      {label: 'Price', fieldName: 'Total_Price__c', type: 'currency', typeAttributes: { currencyCode: { fieldName: CURRENCY_CODE }}, cellAttributes: { alignment: 'left' }, hideDefaultActions: true}
    ];
  
    connectedCallback() {
      this.loadOldOrders();
    }
  
    get isEmpty() {
      return this.orders.length == 0;
    }
  
    get isEmptyFilter() {
      return this.filteredOrders.length == 0;
    }
  
    loadOldOrders() {
        getCurrentUserOrders()
      .then(result => {
        this.orders = result;
        this.filterOrders();
        this.solveTotalPrice();
      })
      .catch(error => {
        this.error = error;
        console.log(error);
      });
    }
  
    filterOrders() {
      this.filteredOrders = this.orders;
  
      if(this.filterStatus != this.FILTER_ALL) {
        this.filteredOrders = this.filteredOrders.filter((order) => {
          return order.Status__c == this.filterStatus;
        })
      }
  
      if(this.filterDate != this.FILTER_ALL) {
        this.filteredOrders = this.filteredOrders.filter((order) => {
          return order.Closed_Date__c == this.filterDate;
        })
      }
  
      if(this.filterDish != this.FILTER_ALL) {
        this.filteredOrders = this.filteredOrders.filter((order) => {
          let orderItems = order.OrderDishes__r;
          orderItems = orderItems.filter((orderItem) => {
            return orderItem.DishId__r.Name == this.filterDish;
          });
          return orderItems.length > 0;
        });
      }
    }
  
    solveTotalPrice() {
      let sum = 0.0;
      this.filteredOrders.forEach((order) => {
        sum += +order.Total_Price__c;
      });
      this.totalPrice = sum.toFixed(2);
    }
  
    filterStatusChange(event) {
      this.filterStatus = event.detail;
      this.filterOrders();
      this.solveTotalPrice();
    }
  
    filterDateChange(event) {
      this.filterDate = event.detail;
      this.filterOrders();
      this.solveTotalPrice();
    }
  
    filterDishChange(event) {
      try {
              this.filterDish = event.detail;
      this.filterOrders();
      this.solveTotalPrice();
      }catch(e) {
        console.log(e);
      }
    }
  
    closeModal() {
      const selectedEvent = new CustomEvent('closemodal', {
        detail: false,
      });
      this.dispatchEvent(selectedEvent);
    }
}