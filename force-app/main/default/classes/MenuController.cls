public with sharing class MenuController {
    @AuraEnabled(cacheable=true)
    public static List<Dish__c> getDishes(){
        return [SELECT Name, Description__c, Price__c FROM Dish__c];
    }
}
