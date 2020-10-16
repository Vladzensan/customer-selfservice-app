import { LightningElement, wire, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent'
import { subscribe, MessageContext, unsubscribe } from 'lightning/messageService';
import { deleteRecord } from 'lightning/uiRecordApi';
import getCurrentOrder from '@salesforce/apex/OrderController.getCurrentOrder';
import getItemsByOrderId from '@salesforce/apex/OrderController.getItemsById'
import addItemsToOrder from '@salesforce/apex/OrderController.addItemsToOrder';
import ORDER_ITEM_ADDED from '@salesforce/messageChannel/OrderItemAdded__c';

export default class OrderInfoComponent extends LightningElement {
    @track order;
    @track error;
    @track orderItems;
    orderItemAddedSubscription;

    @wire(MessageContext) messageContext;

    connectedCallback() {
        getCurrentOrder().then(result => {
                this.order = result;
                this.fetchOrderItems(this.order.Id);
            })
            .catch(error => {
                  this.error = error;
            });


        this.orderItemAddedSubscription = subscribe(
            this.messageContext,
            ORDER_ITEM_ADDED,
            (message) => this.handleOrderItemAdded(message)
        );
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


    handleOrderItemAdded(message) {
        var orderItem = message.orderItem;
        addItemsToOrder({orderId: this.order.Id, dishId:orderItem.dishId, dishCount: orderItem.dishCount, note:orderItem.note})
        .then(result => {
            const event = new ShowToastEvent({
                title: 'Success',
                message: 'Dish successfully added to order',
            });
            this.dispatchEvent(event);
            this.fetchOrderItems(this.order.Id);
            console.log(JSON.stringify(this.orderItems));
        })
        .catch(error => {
            this.error = error;
            const event = new ShowToastEvent({
                title: 'Failure',
                message: 'Error occurred while adding dish to order',
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
                    message: 'Order Item deleted',
                    variant: 'success'
                })
            );
            this.fetchOrderItems(this.order.Id);
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

}