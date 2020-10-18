import { LightningElement, api, track, wire } from 'lwc';
import getStatusPicklistValues from '@salesforce/apex/OrderController.getStatusPicklistValues'

export default class OrderFiltersComponent extends LightningElement {
    @api orders;

    @track dateValues = [];
    @track selectedDate;
  
    @track dishValues = [];
    @track selectedDish;
  
    @track statusValues = [];
    @track selectedStatus;

    @track error;
  
    connectedCallback() {
try {
      getStatusPicklistValues() .then(result => {
            this.error=undefined;
            let options = [{label:'--All--', value:'--All--'}];
            console.log('res'+JSON.stringify(result));
            for (var val in result) {
              options.push({
                    label : result[val],
                    value: result[val]
                  });
            }

            this.statusValues = options;
            console.log('data'+JSON.stringify(result));
            console.log('pr'+JSON.stringify(this.statusValues));
            this.selectedStatus = '--All--';
          })
          .catch(error => {
            this.error = error;
            console.log(error);
          });

        }catch(e) {
          console.log('few' + e);
        }
      this.buildDateArray();
      this.buildDishArray();
    }
  
    buildDateArray() {
      this.dateValues = [{label:'--All--', value:'--All--'}];
      const setDates = new Set();
      this.orders.forEach((order) => {
        setDates.add(order.Closed_Date__c);
      })
  
      for (let date of setDates.values()) {
        this.dateValues.push({
          label : date,
          value: date
        });
      }
    }
  
    buildDishArray() {
        console.log(JSON.stringify(this.orders));
      this.dishValues = [{label:'--All--', value:'--All--'}];
      const setDishes = new Set();
      this.orders.forEach((order) => {
        const orderItems = order.OrderDishes__r;
        orderItems.forEach((orderItem) => {
          setDishes.add(orderItem.DishId__r.Name);
        });
      });
  
      const arrayDishes = [...setDishes];
      arrayDishes.sort((firstTitle, secondTitle) => {
        return firstTitle.localeCompare(secondTitle);
      });
  
      arrayDishes.forEach((dishTitle) => {
        this.dishValues.push({
          label: dishTitle,
          value: dishTitle
        })
      });
    }
  
    handleStatusChange(event) {
      this.selectedStatus= event.target.value;
      const selectedEvent = new CustomEvent('statuschange', {
        detail: this.selectedStatus,
      });
      this.dispatchEvent(selectedEvent);
    }
  
    handleDateChange(event) {
      this.selectedDate = event.target.value;
      const selectedEvent = new CustomEvent('datechange', {
        detail: this.selectedDate,
      });
      this.dispatchEvent(selectedEvent);
    }
  
    handleDishChange(event) {
      this.selectedDish = event.target.value;
      const selectedEvent = new CustomEvent('dishchange', {
        detail: this.selectedDish,
      });
      this.dispatchEvent(selectedEvent);
    }
}