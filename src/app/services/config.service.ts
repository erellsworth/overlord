import { Injectable, signal } from '@angular/core';
import { OverlordConfig } from '../../../interfaces/overlord.config';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { ApiResponse } from '../../../interfaces/misc';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  public config = signal<OverlordConfig>({ contentTypes: {}, fieldTypes: {} });
  private defaultFields = ['editor', 'description', 'tags', 'image'];

  constructor(private http: HttpClient) {}

  public getActiveFields(contentType: string): string[] {
    return (
      this.config().contentTypes[contentType]?.fields || this.defaultFields
    );
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

  public isFieldActive(contentType: string, field: string): boolean {
    const fields = this.config().contentTypes[contentType]?.fields;

    if (!fields) {
      return true;
    }

    return fields.includes(field);
  }
}
