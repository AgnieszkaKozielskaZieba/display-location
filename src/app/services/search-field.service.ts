import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { LocationResponse } from '../models/location-response';

@Injectable({
  providedIn: 'root'
})
export class SearchFieldService {
  public newLocationSelected: Subject<LocationResponse> = new Subject<LocationResponse>();
}
