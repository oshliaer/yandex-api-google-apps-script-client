export type TAuthToken = {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  token_type: string;
};

export interface TAuthCallbackHandlerParam extends GoogleAppsScript.Events.DoGet {
  parameter: {
    code: string;
    state: string;
  };
  parameters: {
    code: string[];
    state: string[];
  };
}

export interface IAuth {
  token: TAuthToken;
}
