import { ITools, TSomeObject } from './types';

export class Tools implements ITools {
  multipartUploadFile(
    url: string,
    file: { blob: GoogleAppsScript.Base.Blob; mimeType: string; name: string },
    options?: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions,
  ): GoogleAppsScript.URL_Fetch.HTTPResponse {
    const metadata = {
      name: '### MetaData Yandex API Client ###',
      mimeType: file.mimeType,
    };
    const boundary = Utilities.getUuid();
    // const data = [
    //   '--' + boundary,
    //   'Content-Disposition: form-data; name="metadata"',
    //   'Content-Type: application/json; charset=UTF-8\r\n',
    //   JSON.stringify(metadata),
    //   '--' + boundary,
    //   'Content-Disposition: form-data; name="file"; filename="' + file.name + '"',
    //   'Content-Type: ' + file.mimeType + '\r\n\r\n',
    // ].join('\r\n');
    var data = '--' + boundary + '\r\n';
    data += 'Content-Disposition: form-data; name="metadata"\r\n';
    data += 'Content-Type: application/json; charset=UTF-8\r\n\r\n';
    data += JSON.stringify(metadata) + '\r\n';
    data += '--' + boundary + '\r\n';
    data += 'Content-Disposition: form-data; name="file"; filename="' + file.name + '"\r\n';
    data += 'Content-Type: ' + file.mimeType + '\r\n\r\n';
    const payload = Utilities.newBlob(data)
      .getBytes()
      .concat(file.blob.getBytes())
      .concat(Utilities.newBlob('\r\n--' + boundary + '--').getBytes());
    const _options = Object.assign(
      {
        method: 'post',
        contentType: 'multipart/related; boundary=' + boundary,
        payload: payload,
      },
      options,
    );
    const httpResponse = UrlFetchApp.fetch(url, _options);
    return httpResponse;
  }
  serialize(obj: TSomeObject, prefix?: string): string {
    const str: string[] = [];
    for (const p in obj) {
      if (obj.hasOwnProperty(p)) {
        var k = prefix ? prefix + '[' + p + ']' : p,
          v = obj[p];
        if (v !== null && typeof v === 'object') {
          str.push(this.serialize(v, k));
        } else {
          str.push(encodeURIComponent(k) + '=' + encodeURIComponent(v));
        }
      }
    }
    return str.join('&');
  }
}

// export default { Tools: new Tools() };.ю
