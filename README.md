# Клиент для Yandex API на Google Apps script

## Как работает

### Авторизация / Auth

> Может быть полезна, для получения токена авторизации

> Реализована только одна возможность -- авторизация по ссылке.

Добавьте библиотеку `15Nsj-XU8-TTdGvzmRCqK95w1HFFyyw8nip-FvZuub2gDc3aSXliQNo1d` в ваш проект. Для примеров она будет храниться в пространстве `YandexService`.

Скопируйте код проекта Скрипта. Это идентификатор в строке адреса, для проекта с адресом `https://script.google.com/home/projects/123-ABC-456-XYZ/edit` это будет `123-ABC-456-XYZ`.

Реализуйте фабрику, которая будет возвращать настроенный сервис:

```js
function getYandexAuthInstance() {
  const instance = new YandexService.Auth({
    appsScriptProjectId: '{Идентификатор проекта}',
    storage: PropertiesService.getScriptProperties(),
  });
  return instance;
}
```

Получите Redirect URI. Например, вывести в консоль:

```js
// Выводит в консоль Redirect URI для регистрации приложения
function printRedirectUri() {
  const { redirectUri } = getYandexAuthInstance();

  console.log(redirectUri);
}
```

> `<$ https://script.google.com/macros/d/{Идентификатор проекта}/usercallback`

Перейдите по адресу регистрации новго приложения. Введите требуемые данные, укажите полученный Redirect URI.

Сохраните `ClientId` и `ClientSecret`.

Обновите фабрику так:

```js
function getYandexAuthInstance() {
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
  return getYandexAuthInstance().defaultAuthCallbackHandler(e);
}
```

Укажите имя этой функции как свойство `callbackFunctionName`;

```js
function getYandexAuthInstance() {
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
  const { authorizeUri } = getYandexAuthInstance();
  console.log(authorizeUri);
}
```

> `<$ https://oauth.yandex.ru/authorize?state=xxx_yyy_zzz&client_id=ClientID&response_type=code`

Перейдя по ссылке в браузере, вы должны получить сообщение "Авторизация прошла успешно".

Теперь вы можете использовать токен для вызова Yandex API. Вот как взять токен:

```js
// Выводит в консоль токен
function printToken() {
  const { token } = getYandexAuthInstance();
  console.log(token);
}
```

> ```json
> {
>   "access_token": "xxx_yyy_zzz",
>   "expires_in": 31531937,
>   "refresh_token": "1:YYY:ZZZ:XXX",
>   "token_type": "bearer"
> }
> ```

## Как добавить новые возможности

1. Делайте пулреквест
