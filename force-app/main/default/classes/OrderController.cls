public with sharing class OrderController {
    public class OrderItem {
        @AuraEnabled
        public Id ItemId {get; set;}
        @AuraEnabled
        public String Name { get; set; }
        @AuraEnabled
        public String Note { get; set; }
        @AuraEnabled
        public Integer Count { get; set; }
        @AuraEnabled
        public Decimal TotalPrice { get; set; }

    }

    @AuraEnabled
    public static Restaurant_Order__c getCurrentOrder() {
        Id userId = UserInfo.getUserId();
        System.debug('getInfo');

        List<Restaurant_Order__c> orders = [SELECT Id FROM Restaurant_Order__c WHERE Status__c='Open' AND OwnerId =:userId LIMIT 1];
        // add total price

        Restaurant_Order__c order;
        if(orders.isEmpty()) {
            order = new Restaurant_Order__c(Status__c='Open', OwnerId=userId);
            insert order;
        } else {
            order = orders[0];
        }

        return order;
        
    }

    @AuraEnabled(cacheable=true)
    public static List<OrderItem> getItemsById(String orderId){
        List<OrderItem> items = new List<OrderItem>();
        for(OrderDish__c item: [SELECT DishId__r.Name, Dish_Count__c, Note__c, Total_Price__c FROM OrderDish__c WHERE OrderId__c = :orderId]) {
            items.add(buildItem(item));
        }

        return items;
    }

    @AuraEnabled
    public static void addItemsToOrder(String orderId, String dishId, Integer dishCount, string note){
        OrderDish__c item = new OrderDish__c(OrderId__c = orderId, DishId__c= dishId, Dish_Count__c= dishCount, Note__c= note);
        insert item;
    }

    
    public static OrderItem buildItem(OrderDish__c item) {
        OrderItem orderItem = new OrderItem();
        orderItem.ItemId = item.id;
        orderItem.Count = (Integer)item.Dish_Count__c;
        orderItem.Note = item.Note__c;
        orderItem.TotalPrice = item.Total_Price__c;
        orderItem.Name = item.DishId__r.Name;

        return orderItem;
    }
}
