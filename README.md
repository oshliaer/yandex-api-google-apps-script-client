# Клиент для Yandex API на Google Apps script

## Как работает

### Авторизация / Auth

> Может быть полезна, для получения токена авторизации

> Реализована только одна возможность -- авторизация по ссылке.

Добавьте библиотеку `15Nsj-XU8-TTdGvzmRCqK95w1HFFyyw8nip-FvZuub2gDc3aSXliQNo1d` в ваш проект. Для примеров она будет храниться в пространстве `YandexService`.

Скопируйте код проекта Скрипта. Это идентификатор в строке адреса, для проекта с адресом `https://script.google.com/home/projects/123-ABC-456-XYZ/edit` это будет `123-ABC-456-XYZ`.

Реализуйте фабрику, которая будет возвращать настроенный сервис:

```js
function getYAndexAuthInstance() {
  const instance = new YandexService.Auth({
    appsScriptProjectId: '{Идентификатор проекта}',
    storage: PropertiesService.getScriptProperties(),
  });
  return instance;
}
```

Получите Redirect URI. Напрмиер, вывести в консоль:

```js
// Выводит в консоль Redirect URI для регистрации приложения
function printRedirectUri() {
  const { redirectUri } = getYAndexAuthInstance();

  console.log(redirectUri);
}
```

Перейдите по адресу регистрации новго приложения. Введите требуемые данные, укажите полученный Redirect URI.

Сохраните `ClientId` и `ClientSecret`.

Обновите фабрику так:

```js
function getYAndexAuthInstance() {
  const instance = new YandexService.Auth({
    appsScriptProjectId: '{Идентификатор проекта}',
    clientId: '{ClientId}',
    clientSecret: '{ClientSecret}',
    storage: PropertiesService.getScriptProperties(),
  });
  return instance;
}
```

Создайте функцию перехватчика обратной переадресации авторизации. Чтобы сохранить токен, вы можете создать свою функцию. Ее требования:

1. Она должна находиться в глобальном контексте
2. Она должна принимать такой же параметр, как зарегистрированная функция `doGet(e)`

Для примера воспользуемся готовой обвязкой

```js
// Обрабатывает вызова Yandex Redirect Auth
// Сохраняет токен в свойства проекта
function doYandexAuthRedirect(e) {
  return getYAndexAuthInstance().defaultAuthCallbackHandler(e);
}
```

Укажите имя этой функции как свойство `callbackFunctionName`;

```js
function getYAndexAuthInstance() {
  const instance = new YandexService.Auth({
    appsScriptProjectId: '{Идентификатор проекта}',
    clientId: '{ClientId}',
    clientSecret: '{ClientSecret}',
    storage: PropertiesService.getScriptProperties(),
  });
  instance.callbackFunctionName = 'doYandexAuthRedirect'; // Или doYandexAuthRedirect.name
  return instance;
}
```

Настройка завершена. Теперь нужно авторизоваться по ссылке. Ссылку получить можно так:

```js
// Выводит в консоль ссылку для авторизации
function printAuthUri() {
  const { authorizeUri } = getYAndexAuthInstance();
  console.log(authorizeUri);
}
```

Перейдя по ссылке в браузере, вы должны получить сообщение "Авторизация прошла успешно".

Теперь вы можете использовать токен для вызова Yandex API. Вот как взять токен:

```js
// Выводит в консоль токен
function printToken() {
  const { token } = getYAndexAuthInstance();
  console.log(token);
}
```

## Как добавить новые возможности

1. Делайте пулреквест
