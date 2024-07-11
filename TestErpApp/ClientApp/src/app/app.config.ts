import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import {
    provideHttpClient,
    withInterceptorsFromDi,
} from '@angular/common/http';

export function getBaseUrl() {
    return document.getElementsByTagName('base')[0].href;
}

export const appConfig: ApplicationConfig = {
    providers: [
        provideZoneChangeDetection({ eventCoalescing: true }),
        provideHttpClient(withInterceptorsFromDi()),
        provideRouter(routes),
        {
            provide: 'BASE_URL',
            useFactory: getBaseUrl,
        },
    ],
};
