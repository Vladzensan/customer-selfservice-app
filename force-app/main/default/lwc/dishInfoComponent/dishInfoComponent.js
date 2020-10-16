import { LightningElement, api, wire } from 'lwc';
import { publish, subscribe, MessageContext, unsubscribe } from 'lightning/messageService';
import DISH_SELECTED_MESSAGE from '@salesforce/messageChannel/DishSelected__c';
import ORDER_ITEM_ADDED from '@salesforce/messageChannel/OrderItemAdded__c';

const MIN_COUNT = 1;
const MAX_COUNT = 10;
export default class DishInfoComponent extends LightningElement {
    @api selectedDish;
    @wire(MessageContext) messageContext;
    dishesCount=1;
    notes='';

    /** Subscription for ProductSelected Ligthning message */
    dishSelectionSubscription;

    connectedCallback() {
        this.dishSelectionSubscription = subscribe(
            this.messageContext,
            DISH_SELECTED_MESSAGE,
            (message) => this.handleDishSelected(message.dish)
        );
    }

    disconnectedCallback() {
        unsubscribe(this.dishSelectionSubscription);
    }

    handleAddToOrderClick(event) {
        var orderItem = {dishCount: this.dishesCount, dishId: this.selectedDish.Id, note: this.notes };
        publish(this.messageContext, ORDER_ITEM_ADDED, {
            orderItem: orderItem
        });
    }

    handleDishSelected(dish) {
        this.selectedDish = dish;
    }

    handleDecrement() {
        if(this.dishesCount - 1 >= MIN_COUNT) {
            this.dishesCount = this.dishesCount - 1;
        }
    }

    handleIncrement()  {
        if(this.dishesCount + 1 <= MAX_COUNT) {
            this.dishesCount = this.dishesCount + 1;
        }
    }

    handleNoteChange(event) {
        this.notes = event.target.value;
    }

}