export type TSomeObject = {
  [key: string]: number | string | boolean | TSomeObject;
};

export interface UploadFile {
  blob: GoogleAppsScript.Base.Blob;
  mimeType: string;
  name: string;
}

export interface ITools {
  multipartRelatedUploadFile: (
    url: string,
    file: UploadFile,
    options?: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions,
  ) => GoogleAppsScript.URL_Fetch.HTTPResponse;
  multipartFormDataUploadFile: (
    url: string,
    file: UploadFile,
    options?: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions,
    metadata?: { [key: string]: string },
  ) => GoogleAppsScript.URL_Fetch.HTTPResponse;
  serialize: (obj: TSomeObject, prefix?: string | undefined) => string;
}
