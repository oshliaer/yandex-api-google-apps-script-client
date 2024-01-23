export interface IDiskV1ResourcesUploadRequest {
  path: string;
  overwrite: boolean;
  fields: string;
}

export interface IDiskV1ResourcesUploadResponse {
  href: string;
  method: string;
  templated: false;
}

export interface Iv1ResourcesClass {}

export interface v1Resources {
  v1: {
    resources: Iv1ResourcesClass;
  };
}
