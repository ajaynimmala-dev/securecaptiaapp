import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';

import { provideRouter } from '@angular/router';

import { provideHttpClient, withInterceptorsFromDi, HTTP_INTERCEPTORS } from '@angular/common/http';

import { routes } from './app.routes';

import { TokenInterceptor } from './interceptor/token-interceptor';
import { CacheInterceptor } from './interceptor/cache.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),

    provideRouter(routes),

    provideHttpClient(withInterceptorsFromDi()),

    TokenInterceptor,

    {
      provide: HTTP_INTERCEPTORS,
      useExisting: TokenInterceptor,
      multi: true,
    },
    CacheInterceptor,
    {
      provide:HTTP_INTERCEPTORS,
      useExisting: CacheInterceptor,
      multi: true,
    }
  ],
};
