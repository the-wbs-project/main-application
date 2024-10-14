import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OnboardingRecord } from '../models';

export class OnboardDataService {
  constructor(private readonly http: HttpClient) {}

  getRecordAsync(
    organizationId: string,
    inviteId: string
  ): Observable<OnboardingRecord> {
    return this.http.get<OnboardingRecord>(
      `api/onboard/record/${organizationId}/${inviteId}`
    );
  }
}
