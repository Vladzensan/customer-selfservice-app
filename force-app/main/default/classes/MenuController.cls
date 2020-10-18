public with sharing class MenuController {
    static Integer PAGE_SIZE = 9;

    public class Filters {
        @AuraEnabled
        public String searchKey { get; set; }
        @AuraEnabled
        public Decimal maxPrice { get; set; }
        @AuraEnabled
        public String categoryId { get; set; }
    }

    @AuraEnabled(cacheable=true)
    public static PagedResult getDishes(Filters filters, Integer pageNumber) {
        String whereClause = '';
        Decimal maxPrice;
        String categoryId;
        List<String> criteria = new List<String>();
        
        if (filters != null) {
            if (!String.isEmpty(filters.searchKey)) {
                String key = '%' + filters.searchKey + '%';
                criteria.add('Name LIKE :key');
            }
            if (filters.maxPrice >= 0) {
                maxPrice = filters.maxPrice;
                criteria.add('Price__c <= :maxPrice');
            }
            if (filters.categoryId != null) {
                categoryId = filters.categoryId;
                criteria.add('Category__c =:categoryId');
            }
            if (criteria.size() > 0) {
                whereClause = 'WHERE ' + String.join(criteria, ' AND ');
            }
        }
        Integer pageSize = MenuController.PAGE_SIZE;
        Integer offset = (pageNumber - 1) * pageSize;
        PagedResult result = new PagedResult();
        result.pageSize = pageSize;
        result.pageNumber = pageNumber;
        result.totalItemCount = Database.countQuery(
            'SELECT count() FROM Dish__c ' + whereClause
        );

        System.debug(whereClause + '');
        result.records = Database.query(
            'SELECT Name, Price__c, Description__c, Category__c, ImageUrl__c FROM Dish__c ' +
            whereClause +
            ' ORDER BY Name LIMIT :pageSize OFFSET :offset'
        );


        return result;
    }

    @AuraEnabled(cacheable=true)
    public static List<Category__c> getCategories(){
        return [SELECT Name, (SELECT Name FROM ChildCategories__r) FROM Category__c WHERE ParentCategoryId__c=null];
    }
}
