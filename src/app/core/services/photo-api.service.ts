import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PhotoItem, PhotoPayload } from '../models/photo.model';

@Injectable({ providedIn: 'root' })
export class PhotoApiService {
  private readonly apiUrl = 'https://jsonplaceholder.typicode.com/photos';

  constructor(private readonly http: HttpClient) {}

  getPhotos(limit = 12): Observable<PhotoItem[]> {
    const params = new HttpParams().set('_limit', limit);
    return this.http.get<PhotoItem[]>(this.apiUrl, { params });
  }

  getPhotoById(id: number): Observable<PhotoItem> {
    return this.http.get<PhotoItem>(`${this.apiUrl}/${id}`);
  }

  createPhoto(payload: PhotoPayload): Observable<PhotoItem> {
    return this.http.post<PhotoItem>(this.apiUrl, payload);
  }

  updatePhoto(id: number, payload: PhotoPayload): Observable<PhotoItem> {
    return this.http.put<PhotoItem>(`${this.apiUrl}/${id}`, payload);
  }

  deletePhoto(id: number): Observable<unknown> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
