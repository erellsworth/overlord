import { computed, Injectable, signal } from '@angular/core';
import { ApiResponse, OverlordConfig } from '@overlord/types';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { default as configFile } from '../../../package.json';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  public config = signal<OverlordConfig>({
    contentTypes: [],
    frontEnd: {
      url: '',
      contentRoute: '',
    },
  });
  public contentTypes = computed(() => {
    return this.config().contentTypes;
  });

  public version = signal<string>('');

  constructor(private http: HttpClient) {
    this.version.set(configFile.version);
  }

  public getPermalink(id: number) {
    const { url, contentRoute } = this.config().frontEnd;
    return `${url}${contentRoute}/${id}`;
  }

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
