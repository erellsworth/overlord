import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import { ConfigService } from './services/config.service';

export const configResolver: ResolveFn<boolean> = async (
  route: ActivatedRouteSnapshot,
  state,
) => {
  const configService = inject(ConfigService);
  await configService.fetchConfig();
  return true;
};
