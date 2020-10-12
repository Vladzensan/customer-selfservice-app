import { LightningElement, wire } from 'lwc';
import getDishes from '@salesforce/apex/MenuController.getDishes';
export default class ContainerComponent extends LightningElement {
    @wire(getDishes) dishes;
}