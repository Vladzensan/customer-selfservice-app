import { LightningElement, api } from 'lwc';

export default class DishTileComponent extends LightningElement {
    @api dish;

    itemClick() {
        try {
        console.log('itemClick');
        const detail = {dishId: this.dish.Id};
         this.dispatchEvent(new CustomEvent('selected', { detail}) );
        } catch(e) {
            console.log(e);
        }
        
    }
}