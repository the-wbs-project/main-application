import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OnboardRecord, OnboardResults } from '../models';

export class OnboardDataService {
  constructor(private readonly http: HttpClient) {}

  getRecordAsync(
    organizationId: string,
    inviteId: string
  ): Observable<OnboardRecord> {
    return this.http.get<OnboardRecord>(
      `api/onboard/${organizationId}/${inviteId}`
    );
  }

  sendResultsAsync(
    organizationId: string,
    inviteId: string,
    results: OnboardResults
  ): Observable<void> {
    return this.http.post<void>(
      `api/onboard/${organizationId}/${inviteId}`,
      results
    );
  }
}
