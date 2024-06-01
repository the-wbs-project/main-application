import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ChecklistGroup } from '../models';

@Injectable()
export class ChecklistDataService {
  constructor(private readonly http: HttpClient) {}

  getAsync(): Observable<ChecklistGroup[]> {
    return this.http.get<ChecklistGroup[]>('api/checklists');
  }
}
