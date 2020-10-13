import { LightningElement, wire, track } from 'lwc';
import getDishes from '@salesforce/apex/MenuController.getDishes';

export default class ContainerComponent extends LightningElement {
    @track dishes;
    @track error;
    @wire(getDishes) wiredDishes({ error, data }) {
        if (data) {
            this.dishes = data;
            this.error = undefined;
        } else if (error) {
            this.error = error;
            this.dishes = undefined;
        }
    }
    selectedDish;

    handleDishSelected(event) {
        try {     
            console.log('bitch'); 
            this.selectedDish = this.dishes[0];
        
        }catch(e) {
            console.log(e);
        }
    }

}