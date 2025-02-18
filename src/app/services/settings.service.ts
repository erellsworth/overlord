import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiResponse, SettingInterface } from '@overlord/types';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  constructor(private http: HttpClient) {}

  public async getSetting<T = any>(
    name: string,
    defaultValue?: SettingInterface<T>,
  ): Promise<SettingInterface<T> | false> {
    try {
      const result = await firstValueFrom(
        this.http.get<ApiResponse<SettingInterface<T>>>(`api/settings/${name}`),
      );

      if (result.success) {
        return result.data as SettingInterface<T>;
      }

      return defaultValue || false;
    } catch (e) {
      console.error('Problem getting setting', e);
      return defaultValue || false;
    }
  }

  public async saveSetting(
    setting: SettingInterface,
  ): Promise<SettingInterface | false> {
    console.log('saveSetting', setting);
    try {
      const result = await firstValueFrom(
        this.http.put<ApiResponse<SettingInterface>>('api/settings', setting),
      );

      if (result.success) {
        return result.data as SettingInterface;
      }

      return false;
    } catch (e) {
      console.error('Problem saving setting', e);
      return false;
    }
  }
}
