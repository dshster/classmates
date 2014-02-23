### Выпускники.ru, тестовое задание front-end разработчика

##### Общее описание
Необходимо сверстать страницу в соответствии с дизайном. За исключением блоков, описанных ниже, страница статична (только html, css).

Три блока , описанных ниже, должны иметь функционал, обеспечиваемый клиентскими сценариями (скриптами). Использование таких библиотек как require.js и knockout.js (backbone, angular) в клиентских сценариях будет плюсом. 

##### Блок «Ваши однокурсники»
Список однокурсников должен загружаться асинхронно (с помощью ajax запроса). Ответ на асинхронный запрос должен представлять собой json объект с информацией об однокурсниках (ссылка на фото, имя, фамилия; можно использовать одинаковое фото, имя и фамилию для всех однокурсников). При наведении курсора на фото одного однокурсника должна показываться подсказка с его именем и фамилией.


##### Блок «Выбрать дату встречи»
При показе страницы ни один контейнер с датой не выбран (все контейнеры имею серую окраску). По клику пользователя нужный контейнер становится активным. Одновременно может быть выбран только один контейнер. По клику на кнопку «Изменить» в активном контейнере пользователь получает возможность задать дату. Пользователь должен иметь возможность указать число и месяц. Время 19:00 фиксировано, изменять его нельзя. Будет плюсом использование js плагина для удобства указания даты. После указания пользователем даты, дата изменяется в верстке соответствующего контейнера.

##### Блок «Выбрать ресторан»
При показе страницы ни один контейнер с рестораном не выбран (все контейнеры имею серую окраску). По клику пользователя нужный контейнер становится активным. Одновременно может быть выбран только один контейнер. По клику на кнопку «Изменить» в активном контейнере пользователь получает возможность задать цену на человека. Будет плюсом проверка корректности ввода пользователя. После указания пользователем цены, цена изменяется в верстке соответствующего контейнера.
