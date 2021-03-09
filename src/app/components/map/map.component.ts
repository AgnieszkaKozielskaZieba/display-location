import { Component, OnDestroy, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { Subscription } from 'rxjs';
import { LocationResponse } from 'src/app/models/location-response';
import { SearchFieldService } from 'src/app/services/search-field.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.sass']
})
export class MapComponent implements OnInit, OnDestroy {

  private map;
  private _subscriptions: Subscription = new Subscription();
  constructor(private _searchFieldService: SearchFieldService) { }

  ngOnInit(): void {
  }
  ngAfterViewInit(): void {
    this.initMap();
    this._subscriptions.add(this._searchFieldService.newLocationSelected.subscribe((location: LocationResponse) => {
      this.zoomMap(location);
    }))

  }

  private initMap(): void {
    this.map = L.map('map', {
      center: [39.8282, -98.5795],
      zoom: 3
    });

    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });

    tiles.addTo(this.map);

  }

  private zoomMap(selectedLocation): void {
    this.map.fitBounds([
      [selectedLocation.boundingbox[0], selectedLocation.boundingbox[2]],
      [selectedLocation.boundingbox[1], selectedLocation.boundingbox[3]]
    ]);
  }

  ngOnDestroy(): void {
    this._subscriptions.unsubscribe();
  }

}
