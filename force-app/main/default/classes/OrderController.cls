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

        List<Restaurant_Order__c> orders = [SELECT Id, Total_Price__c, Status__c FROM Restaurant_Order__c WHERE Status__c='Open' AND CustomerId__c =:userId LIMIT 1];

        Restaurant_Order__c order;
        if(orders.isEmpty()) {
            order = new Restaurant_Order__c(Status__c='Open', CustomerId__c=userId, Total_Price__c=0.0);
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

    @AuraEnabled
    public static void makeOrder(String orderId, String deliveryAddress){
        List<Restaurant_Order__c> orders = [SELECT Status__c FROM Restaurant_Order__c WHERE Id= :orderId];

        if(orders.isEmpty()) {
            throw new AuraHandledException('Corrupted order id: ' + orderId);
        } else {
            Restaurant_Order__c order = orders[0];
            order.Status__c = 'Delivery'; // no matter whether we have order delivery or not, status stays the same
            order.Closed_Date__c = Datetime.now();
            if(deliveryAddress != null || String.isBlank(deliveryAddress)) {
                order.Delivery_Address__c = deliveryAddress;
            } 

            update order;
        }
    }

    @AuraEnabled
    public static List<Restaurant_Order__c> getCurrentUserOrders(){
        Id userId = UserInfo.getUserId();

        return [SELECT Status__c, Closed_Date__c, Total_Price__c, (SELECT DishId__r.Name FROM OrderDishes__r) FROM Restaurant_Order__c WHERE CustomerId__c = :userId AND (Status__c='Closed' OR Status__c='Delivery')];
        
    }

    @AuraEnabled(cacheable=true)
    public static List<String> getStatusPicklistValues(){
        Schema.DescribeFieldResult F = Restaurant_Order__C.Status__c.getDescribe();
        Schema.sObjectField T = F.getSObjectField();
        List<PicklistEntry> entries = T.getDescribe().getPicklistValues();
        List<String> values = new List<String>();
        for(PicklistEntry entry: entries) {
            values.add(entry.getLabel());
        }

        return values;
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
