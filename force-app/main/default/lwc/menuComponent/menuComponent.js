import { LightningElement, api } from 'lwc';

export default class MenuComponent extends LightningElement {
    @api dishes;

    handleSelected(event) {
        try {
        const evt = new CustomEvent('dishselected', {
            // detail contains only primitives
            detail: {dishId: event.detail.dishId}
        });
        // Fire the event from c-tile
        this.dispatchEvent(evt);
        console.log('menu');
    }catch(e) {
        console.log('menu' + e)
    }
    }
}