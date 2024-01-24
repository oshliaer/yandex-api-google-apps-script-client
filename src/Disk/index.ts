import { Auth } from '../Auth';
import { UploadFile as IUploadFile } from '../Tools/types';
import { IDiskV1ResourcesUploadRequest, IDiskV1ResourcesUploadResponse, Iv1ResourcesClass } from './types';

export class Disk {
  #auth: Auth;
  constructor(auth: Auth) {
    this.#auth = auth;
  }

  get v1() {
    return { resources: new Resources(this.#auth) };
  }
}

class Resources implements Iv1ResourcesClass {
  #auth: Auth;
  constructor(auth: Auth) {
    this.#auth = auth;
  }
  upload = (params: IDiskV1ResourcesUploadRequest): IDiskV1ResourcesUploadResponse => {
    let url = `https://cloud-api.yandex.net/v1/disk/resources/upload?path=${encodeURIComponent(params.path)}`;
    if (params.overwrite) url += `&overwrite=true`;
    if (params.fields) url += `&fields=${encodeURIComponent(params.fields)}`;

    const httpResponse = UrlFetchApp.fetch(url, {
      method: 'get',
      muteHttpExceptions: true,
      contentType: 'application/json',
      headers: {
        Authorization: `OAuth ${this.#auth.token.access_token}`,
      },
    });

    return JSON.parse(httpResponse.getContentText());
  };

  uploadFile = (params: IDiskV1ResourcesUploadRequest, file: IUploadFile) => {
    const d = this.upload(params);
    return this.#auth.tools.multipartFormDataUploadFile(d.href, file);
  };
}
