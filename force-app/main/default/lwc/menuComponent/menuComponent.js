import { LightningElement, track, wire } from 'lwc';
import { publish, subscribe, MessageContext, unsubscribe } from 'lightning/messageService';
import DISH_SELECTED_MESSAGE from '@salesforce/messageChannel/DishSelected__c';
import DISHES_FILTERED_MESSAGE from '@salesforce/messageChannel/DishesFiltered__c';
import getDishes from '@salesforce/apex/MenuController.getDishes';

export default class MenuComponent extends LightningElement {
    searchBarIsVisible = true;
    filters = {};
    pageNumber = 1;
    pageSize;
    totalItemCount = 0;
    selectedDish;

    @wire(getDishes, { filters: '$filters', pageNumber: '$pageNumber' }) dishes;
    @wire(MessageContext) messageContext;

    handleSelected(event) {
        this.selectedDish = this.dishes.data.records.find((dish) => dish.Id === event.detail.dishId);    
        publish(this.messageContext, DISH_SELECTED_MESSAGE, {
            dish: this.selectedDish
        });
    }

    connectedCallback() {
        // Subscribe to ProductsFiltered message
        this.productFilterSubscription = subscribe(
            this.messageContext,
            DISHES_FILTERED_MESSAGE,
            (message) => this.handleFilterChange(message)
        );
    }

    disconnectedCallback() {
        unsubscribe(this.productFilterSubscription);
    }

    handleFilterChange(message) {
        console.log('bef' +JSON.stringify(this.filters));
        this.filters = message.filters;
        console.log('aft' + JSON.stringify(this.filters));
        this.pageNumber = 1;
    }

    handleSearchKeyChange(event) {
        this.filters = {
            searchKey: event.target.value.toLowerCase()
        };
        this.pageNumber = 1;
    }

    handlePreviousPage() {
        this.pageNumber = this.pageNumber - 1;
    }

    handleNextPage() {
        this.pageNumber = this.pageNumber + 1;
    }
}