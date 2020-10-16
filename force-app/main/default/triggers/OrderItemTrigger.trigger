trigger OrderItemTrigger on OrderDish__c (before insert, before delete) {

    List<Id> orderIds = new List<Id>();
    Set<Id> dishIds = new Set<Id>();

    List<OrderDish__c> items;
    if(trigger.isDelete) {
        items = Trigger.Old;
    } else if (trigger.isInsert) {
        items = Trigger.new;      
    }

    for (OrderDish__c item : items) {
        orderIds.add(item.OrderId__c);
        dishIds.add(item.DishId__c);
    }

    Map<Id, Restaurant_Order__c> orders = new Map<Id, Restaurant_Order__c>([SELECT Total_Price__c FROM Restaurant_Order__c WHERE Id IN :orderIds]);
    Map<Id, Dish__c> dishes = new Map<Id, Dish__c>([SELECT Price__c FROM Dish__c WHERE Id IN :dishIds]);
    
    if(trigger.isDelete) {
        for (OrderDish__c item : Trigger.Old) {
            orders.get(item.OrderId__c).Total_Price__c -= item.Dish_Count__c * dishes.get(item.DishId__c).Price__c;
        }
    } else if (trigger.isInsert) {
        for (OrderDish__c item : Trigger.new) {
            orders.get(item.OrderId__c).Total_Price__c += item.Dish_Count__c * dishes.get(item.DishId__c).Price__c;
        }
    }

    update orders.values();

}