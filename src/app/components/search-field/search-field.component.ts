import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatOptionSelectionChange } from '@angular/material/core';
import { LocationResponse } from 'src/app/models/location-response';
import { SearchFieldService } from 'src/app/services/search-field.service';
import { debounceTime, switchMap } from 'rxjs/operators'

@Component({
  selector: 'app-search-field',
  templateUrl: './search-field.component.html',
  styleUrls: ['./search-field.component.sass']
})
export class SearchFieldComponent implements OnInit {

  public myControl = new FormControl();
  private _controlOptions: LocationResponse[] = [];
  public get controlOptions(): LocationResponse[] {
    return this._controlOptions;
  }

  constructor(private _searchFieldService: SearchFieldService, private _http: HttpClient) { }

  ngOnInit(): void {
    this.myControl.valueChanges.pipe(debounceTime(200), switchMap((value: string) => {
      return this._http.get('https://nominatim.openstreetmap.org/search?format=json&q=' + value)
    })).subscribe((res: LocationResponse[]) => {
      this._controlOptions = res
    });
  }

  public onSelectedLocation(event: MatOptionSelectionChange) {
    const selectedLocation: LocationResponse = event.source.value;
    this._searchFieldService.newLocationSelected.next(selectedLocation);
  }

  public displayName(location: LocationResponse) {
    return location && location.display_name ? location.display_name : '';

  }

}
