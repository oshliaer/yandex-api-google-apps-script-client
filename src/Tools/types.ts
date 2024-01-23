export type TSomeObject = {
  [key: string]: number | string | boolean | TSomeObject;
};

export interface UploadFile
  { blob: GoogleAppsScript.Base.Blob; mimeType: string; name: string }


export interface ITools {
  multipartUploadFile: (
    url: string,
    file: UploadFile,
    options?: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions,
  ) => GoogleAppsScript.URL_Fetch.HTTPResponse;
  serialize: (obj: TSomeObject, prefix?: string | undefined) => string;
}
