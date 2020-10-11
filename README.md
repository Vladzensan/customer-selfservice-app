# SelfServiceApp
**Необходимо разработать приложение для самообслуживания посетителей ресторана.
Приложение должно состоять из Lightning компонент. В приложении должны отображаться следующие элементы:**
 
## Требования к основным элементам:
 1. **Меню** 
*Это должен быть список из доступных в данном ресторане блюд. Для каждорго блюда должны быть указаны: название, цена, описание блюда. Так же должна быть возможность указывать количество порций и комментарии к блюду.
Для меню должна быть реализована возможность навигации по меню, с помощью фильтров и страниц, с возможностью указания количества отображаемых элементов на странице.
Каждая позиции в меню может быть добавлена в заказ. Меню должно состоять из основной группы и из подпунктов к этой группе. Для тестирования в 1й из подгруп должно быть добавлено более 25 блюд.*
 
 2. **Секция текущий заказ.**
  *В данной секции должна отображаться общая стоимость заказа, которая автоматически пересчитываться при выборе продукта в Меню.
  Кнопка "Make an Order". По нажатии на эту кнопку создается заказ, который хранит в себе информацию о пользователе и выбранных блюдах.
  Кнопка "Order Details". При нажатии показывает детали по текущему заказу - выбранные блюда и количество порций.*
 
 3. **Кнопка "Orders".**
  *По нажатии на эту кнопку должен открываться popup со списком предыдущих заказов и их дополнительной информацией. Так же в этом popup должна быть указана сумма, которая складываеться из суммы уже сделанных заказов. Заказы могут быть отфильтрованы по полям Статус и Дата заказа, 1 из блюд, участвоваших в заказе.*

 4. **Маркетинг команда должна иметь возможность следить за результатами работы приложения. Поэтому необходимо создать отчеты.**
 5. **В приложении должна быть возможность сделать заказ с доставкой на дом.**

 ### Notes:
 - Необходимо создать больше 100 тестовых записей для блюд. 
 - Блюда должны быть разбиты на категории и подкатегории.
 - Когда пользователь делает заказ -  автоматически создается запись со списком выбранных блюд.
 - Компоненты должны быть user friendly и выглядеть красиво.
 - Приложение должно быть добавлено на Community.