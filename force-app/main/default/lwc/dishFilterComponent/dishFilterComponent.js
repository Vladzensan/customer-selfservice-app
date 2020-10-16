import { LightningElement, wire, track } from 'lwc';
import { publish, subscribe, MessageContext } from 'lightning/messageService';
import DISHES_FILTERED_MESSAGE from '@salesforce/messageChannel/DishesFiltered__c';
import getCategories from '@salesforce/apex/MenuController.getCategories';

const DELAY = 350;
export default class DishFilterComponent extends LightningElement {

    searchKey = '';
    maxPrice = 200;

    filters = {
        searchKey: '',
        maxPrice: 200
    };

    mainOptions;
    @track childOptions;

    mainCategory='None';
    childCategory;
    
    delayTimeout;

    formOptions(categories) {
        var categoryOptions = new Array();
        if(categories != undefined) {
            for (var сategory of categories) {
                categoryOptions.push({label:сategory.Name, value:сategory.Id})
            }
        }

        return categoryOptions;
    }

    @wire(getCategories) categories({error, data}) {
        if(data) {
            this.categories.data = data;
            this.categories.error = undefined;
            console.log('wire');
            this.mainOptions = this.formOptions(data);
            this.mainOptions.push({label: 'None', value: 'None'});
        } else {
            this.categories.data = undefined;
            this.categories.error = error;
        }
    };
    @wire(MessageContext) messageContext;

    handleMaxPriceChange(event) {
        const maxPrice = event.target.value;
        this.filters.maxPrice = maxPrice;
        this.delayedFireFilterChangeEvent();
    }

    handleMainCategoryChange(event) {
        if(event.target.value != 'None') {
            var category = this.categories.data.find((cat) => cat.Id === event.target.value);
            this.childOptions = this.formOptions(category.ChildCategories__r);
        } else {
            this.filters= {
                searchKey: '',
                maxPrice: this.filters.maxPrice
            };
            this.childOptions = undefined;
            this.delayedFireFilterChangeEvent();
        }
    }

    handleChildCategoryChange(event) {
        this.filters.categoryId = event.target.value;
        this.delayedFireFilterChangeEvent();
    }


    delayedFireFilterChangeEvent() {
        window.clearTimeout(this.delayTimeout);

        this.delayTimeout = setTimeout(() => {

            publish(this.messageContext, DISHES_FILTERED_MESSAGE, {
                filters: this.filters
            });
        }, DELAY);
    }

}