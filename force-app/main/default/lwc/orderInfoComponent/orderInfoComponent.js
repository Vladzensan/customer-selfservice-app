import { LightningElement, wire, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent'
import { subscribe, MessageContext, unsubscribe } from 'lightning/messageService';
import { deleteRecord } from 'lightning/uiRecordApi';
import getCurrentOrder from '@salesforce/apex/OrderController.getCurrentOrder';
import getItemsByOrderId from '@salesforce/apex/OrderController.getItemsById'
import makeOrder from '@salesforce/apex/OrderController.makeOrder'
import addItemsToOrder from '@salesforce/apex/OrderController.addItemsToOrder';
import ORDER_ITEM_ADDED from '@salesforce/messageChannel/OrderItemAdded__c';
import CURRENCY_CODE from '@salesforce/i18n/currency';

// MESSAGES
import ORDER_UPDATE_SUCCESS from '@salesforce/label/c.OrderUpdateSuccess';
import ORDER_UPDATE_FAILURE from '@salesforce/label/c.OrderUpdateFailure';
import MAKE_ORDER_SUCCESS from '@salesforce/label/c.MakeOrderSuccess';
import MAKE_ORDER_NO_ITEMS  from '@salesforce/label/c.MakeOrderNoItems';


export default class OrderInfoComponent extends LightningElement {
    @track order;
    @track error;
    @track orderItems;
    @track hasDelivery=true;
    @track deliveryAddress;
    
    @track isOrdersModal = false;
    orderItemAddedSubscription;
    

    @wire(MessageContext) messageContext;

    connectedCallback() {

        this.orderItemAddedSubscription = subscribe(
            this.messageContext,
            ORDER_ITEM_ADDED,
            (message) => this.handleOrderItemAdded(message)
        );

        this.fetchCurrentOrder();
}


    disconnectedCallback(){
        unsubscribe(this.orderItemAddedSubscription);
    }

    fetchOrderItems(orderId) {
        getItemsByOrderId({orderId:orderId}).then(result => {
            this.orderItems = result;
        })
        .catch(error => {
            this.error = error;
        })
    }

    fetchCurrentOrder() {
        getCurrentOrder().then(result => {
            this.order = result;
            this.fetchOrderItems(this.order.Id);
        })
        .catch(error => {
              this.error = error;
        });
    }


    handleOrderItemAdded(message) {
        var orderItem = message.orderItem;
        addItemsToOrder({orderId: this.order.Id, dishId:orderItem.dishId, dishCount: orderItem.dishCount, note:orderItem.note})
        .then(result => {
            const event = new ShowToastEvent({
                title: 'Success',
                message: ORDER_UPDATE_SUCCESS,
                variant: 'success'
                
            });
            this.dispatchEvent(event);
            this.fetchCurrentOrder();
            console.log(JSON.stringify(this.orderItems));
        })
        .catch(error => {
            this.error = error;
            const event = new ShowToastEvent({
                title: 'Failure',
                message: ORDER_UPDATE_FAILURE,
                variant: 'error'
            });
            this.dispatchEvent(event);
        })
    }

    handleDeletedItem(event) {
        var itemId = event.detail;
        deleteRecord(itemId).then(result => {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success',
                    message: ORDER_UPDATE_SUCCESS,
                    variant: 'success'
                })
            );
            this.fetchCurrentOrder();
        })
        .catch(error => {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Failure',
                    message: error.body.message,
                    variant: 'error'
                })
            );
        })
    }

    handleMakeOrder(event) {
        if(this.order.Total_Price__c > 0) {
            makeOrder({orderId: this.order.Id, deliveryAddress: this.deliveryAddress}).then(result => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: MAKE_ORDER_SUCCESS,
                        variant: 'success'
                    })
                );
                this.deliveryAddress='';
                this.fetchCurrentOrder();
            })
            .catch(error => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Failure',
                        message: error.body.message,
                        variant: 'error'
                    })
                );
            })
        } else {
        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Failure',
                message: MAKE_ORDER_NO_ITEMS,
                variant: 'error'
            })
        );
    }
}


    handleViewAllOrders(event) {
        this.isOrdersModal = true;
    }

    handleDeliveryChange(event) {
        this.hasDelivery = !this.hasDelivery;
    }

    handleAddressChange(event) {
        this.deliveryAddress = event.target.value;
    }

  
    closeModal() {
      this.isOrdersModal = false;
    }

}