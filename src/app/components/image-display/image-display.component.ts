import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { LocationResponse } from 'src/app/models/location-response';
import { SearchFieldService } from 'src/app/services/search-field.service';

@Component({
  selector: 'app-image-display',
  templateUrl: './image-display.component.html',
  styleUrls: ['./image-display.component.sass']
})
export class ImageDisplayComponent implements OnInit, OnDestroy {

  private _subscriptions: Subscription = new Subscription();
  private _isLoading: boolean = false;
  private _isImgLoading: boolean = false;
  private _failedToGetPhoto: boolean = false;
  private _imageBaseUrl: string = 'https://api.nasa.gov/planetary/earth/assets?'
  private _imageKey: string = '&dim=0.1&api_key=KOFKyPuEWFfDdZ0y8lXkhcGLgVeJe52pDCeHO10N'
  private _imgSrc: string = null;
  public get imgSrc(): string {
    return this._imgSrc;
  }
  public get isLoading(): boolean {
    return this._isLoading;
  }
  public get failedToGetPhoto(): boolean {
    return this._failedToGetPhoto;
  }
  public get isImgLoading(): boolean {
    return this._isImgLoading;
  }

  constructor(private _searchFieldService: SearchFieldService, private _http: HttpClient) { }

  ngOnInit(): void {
    this._subscriptions.add(this._searchFieldService.newLocationSelected.subscribe((location: LocationResponse) => {
      this.getNewImage(location);
    }))
  }

  private getNewImage(location: LocationResponse): void {
    this._isLoading = true;
    this._isImgLoading = true;
    this._http.get(`${this._imageBaseUrl}lon=${location.lon}&lat=${location.lat}${this._imageKey}`).subscribe(
      (res: { url: string }) => {
        if (res.url) {
          this._imgSrc = res.url;
          this._failedToGetPhoto = false;
        } else {
          this._failedToGetPhoto = true;
          this._isImgLoading = false;
        }
        this._isLoading = false
      },
      _ => {
        this._failedToGetPhoto = true;
        this._isLoading = false;
        this._isImgLoading = false;
      }
    )
  }

  public imageLoad() {
    this._isImgLoading = false;
  }

  ngOnDestroy(): void {
    this._subscriptions.unsubscribe();
  }
}
