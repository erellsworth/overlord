import { computed, Injectable, signal } from '@angular/core';
import {
  OverlordConfig,
  OverlordField,
} from '../../../interfaces/overlord.config';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { ApiResponse } from '../../../interfaces/misc';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  public config = signal<OverlordConfig>({ contentTypes: [] });
  public contentTypes = computed(() => {
    return this.config().contentTypes;
  });

  constructor(private http: HttpClient) {}

  public async fetchConfig(): Promise<void> {
    try {
      const result = await firstValueFrom(
        this.http.get<ApiResponse<OverlordConfig>>(`api/config`),
      );

      if (result.success) {
        this.config.set(result.data as OverlordConfig);
      } else {
        console.error('Problem fetching config', result.error);
      }
    } catch (e) {
      console.error('Problem fetching config', e);
    }
  }
}
