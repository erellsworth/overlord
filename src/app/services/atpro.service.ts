import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiResponse, AtproResult } from '@overlord/types';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ATProService {
  constructor(private http: HttpClient) {}

  public async share(id: number, text: string): Promise<AtproResult | false> {
    try {
      const result = await firstValueFrom(
        this.http.post<ApiResponse<AtproResult>>(`api/atpro/share/${id}`, {
          text,
        }),
      );

      if (result.success) {
        return result.data as AtproResult;
      }

      console.error('Share failed', result);

      return false;
    } catch (e) {
      return false;
    }
  }
}
