import { InjectionToken } from '@angular/core';

import { environment } from './src/environments/environment.prod';

export let APP_CONFIG = new InjectionToken('app.config');

export interface IAppConfig {
  applicationName: string;
  applicationVersion: string;
  internalApiEndpoint: string;
}

export const AppConfig: IAppConfig = {
  applicationName: "Theos",
  applicationVersion: "1.0.0",
  internalApiEndpoint: environment.apiUrlv1
};
