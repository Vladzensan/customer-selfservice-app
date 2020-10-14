import { LightningElement, track, wire } from 'lwc';
import getDishes from '@salesforce/apex/MenuController.getDishes';

export default class MenuComponent extends LightningElement {
    searchBarIsVisible = true;
    filters = {};
    pageNumber = 1;

    pageSize;
 
    totalItemCount = 0;

    @wire(getDishes, { filters: '$filters', pageNumber: '$pageNumber' }) dishes;
    selectedDish;

    handleSelected(event) {
            this.selectedDish = this.dishes.data.records.find((dish) => dish.Id === event.detail.dishId);
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