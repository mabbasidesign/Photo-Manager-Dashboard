import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { httpStatusInterceptor } from './core/interceptors/http-status.interceptor';
import { mockAuthInterceptor } from './core/interceptors/mock-auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(withInterceptors([mockAuthInterceptor, httpStatusInterceptor])),
    provideRouter(routes)
  ]
};
