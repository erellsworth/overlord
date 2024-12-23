import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
} from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { providePrimeNG } from 'primeng/config';
import Lara from '@primeng/themes/lara';
import { routes } from './app.routes';
import { ConfigService } from './services/config.service';

const appInit = async () => {
  const configService = inject(ConfigService);
  await configService.fetchConfig();
  console.log('done', configService.contentTypes());
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideAppInitializer(appInit),
    provideAnimations(),
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(),
    providePrimeNG({
      theme: {
        preset: Lara,
      },
    }),
  ],
};
