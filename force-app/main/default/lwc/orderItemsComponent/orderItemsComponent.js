import { LightningElement, api } from 'lwc';

export default class OrderItemsComponent extends LightningElement {
    @api orderItems;

    actions = [
        { label: 'Delete', name: 'delete' }
    ];

    columns = [
        {label: 'Dish', fieldName: 'Name', hideDefaultActions: true},
        {label: 'Note', fieldName: 'Note', hideDefaultActions: true},
        {label: 'Count', fieldName: 'Count', hideDefaultActions: true},
        {label: 'Price', fieldName: 'TotalPrice', hideDefaultActions: true},
        {type: 'action', typeAttributes: { rowActions: this.actions, menuAlignment: 'right' }}
    ];

    handleDeleteClick(event) {
        const item = JSON.parse(JSON.stringify(event.detail.row));
    
        const deletedEvent = new CustomEvent('deleted', {detail: item.ItemId});
        this.dispatchEvent(deletedEvent);
    }
}