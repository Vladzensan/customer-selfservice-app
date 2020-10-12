import { LightningElement, api } from 'lwc';
import DISH_NAME from '@salesforce/schema/Dish__c.Name';
import DISH_DESCRIPTION from '@salesforce/schema/Dish__c.Description__c';
import DISH_PRICE from '@salesforce/schema/Dish__c.Price__c';


export default class MenuComponent extends LightningElement {
    @api dishes;
    fields = [DISH_NAME, DISH_DESCRIPTION, DISH_PRICE]
}