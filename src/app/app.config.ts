import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
} from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Lara from '@primeuix/themes/lara';
import { routes } from './app.routes';
import { ConfigService } from './services/config.service';

const appInit = async () => {
  const configService = inject(ConfigService);
  await configService.fetchConfig();
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideAppInitializer(appInit),
    provideAnimationsAsync(),
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(),
    providePrimeNG({
      theme: {
        preset: Lara,
        options: {
          cssLayer: {
            name: 'primeng',
            order: 'theme, base, primeng',
          },
        },
      },
    }),
  ],
};
