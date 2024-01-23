import { Disk } from '../Disk';
import { Tools } from '../Tools';
import { ITools } from '../Tools/types';
import { IAuth, TAuthCallbackHandlerParam, TAuthToken } from './types';

export class Auth implements IAuth {
  #appsScriptProjectId: string;
  #clientId: string;
  #clientSecret: string;
  #callbackFunctionName: string;
  #tools: ITools;
  #storage: GoogleAppsScript.Properties.Properties;
  constructor({ appsScriptProjectId, clientId, clientSecret, storage }) {
    this.#appsScriptProjectId = appsScriptProjectId;
    this.#clientId = clientId;
    this.#clientSecret = clientSecret;
    this.#tools = new Tools();
    this.#storage = storage;
  }

  set callbackFunctionName(name: string) {
    this.#callbackFunctionName = name;
  }

  get tools() {
    return this.#tools;
  }

  get redirectUri() {
    return `https://script.google.com/macros/d/${this.#appsScriptProjectId}/usercallback`;
  }

  get authorizeUri() {
    const state = ScriptApp.newStateToken().withMethod(this.#callbackFunctionName).withTimeout(120).createToken();
    const query = this.#tools.serialize({
      state,
      client_id: this.#clientId,
      response_type: 'code',
    });
    return `https://oauth.yandex.ru/authorize?${query}`;
  }

  get token(): TAuthToken {
    const token = this.#storage.getProperty('YANDEX_API_TOKEN');
    if (!token) throw new Error('Токен не найден');
    return JSON.parse(token);
  }

  defaultStoreAuthCallbackToken(token: TAuthToken): void {
    this.#storage.setProperty('YANDEX_API_TOKEN', JSON.stringify(token));
  }

  defaultAuthCallbackHandler(e: TAuthCallbackHandlerParam): GoogleAppsScript.Content.TextOutput {
    try {
      const code = e.parameter.code;

      const httpResponse = UrlFetchApp.fetch('https://oauth.yandex.ru/token', {
        method: 'post',
        muteHttpExceptions: true,
        contentType: 'application/x-www-form-urlencoded',
        payload: `grant_type=authorization_code&code=${code}`,
        headers: {
          Authorization: `Basic ${Utilities.base64Encode(`${this.#clientId}:${this.#clientSecret}`)}`,
        },
      });

      const data = JSON.parse(httpResponse.getContentText());
      if (data.error) {
        throw new Error(`${data.error}\n${data.error_description}`);
      }
      this.defaultStoreAuthCallbackToken(data);
      return ContentService.createTextOutput('Авторизация прошла успешно').setMimeType(ContentService.MimeType.TEXT);
    } catch (error) {
      return ContentService.createTextOutput(`Ошибка получения данных при авторизации\n${error.message}`).setMimeType(
        ContentService.MimeType.TEXT,
      );
    }
  }

  get Disk() {
    return Disk;
  }
}
