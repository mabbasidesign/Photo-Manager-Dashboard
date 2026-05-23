import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, combineLatest, finalize, map, of, tap } from 'rxjs';
import { PhotoApiService } from '../../../core/services/photo-api.service';
import { PhotoItem, PhotoPayload } from '../../../core/models/photo.model';

interface PhotosVm {
  photos: PhotoItem[];
  loading: boolean;
  saving: boolean;
  deletingId: number | null;
  feedback: string;
}

@Injectable({ providedIn: 'root' })
export class PhotosFacadeService {
  private readonly photosSubject = new BehaviorSubject<PhotoItem[]>([]);
  private readonly loadingSubject = new BehaviorSubject<boolean>(false);
  private readonly savingSubject = new BehaviorSubject<boolean>(false);
  private readonly deletingIdSubject = new BehaviorSubject<number | null>(null);
  private readonly feedbackSubject = new BehaviorSubject<string>('');

  readonly photos$ = this.photosSubject.asObservable();
  readonly loading$ = this.loadingSubject.asObservable();
  readonly saving$ = this.savingSubject.asObservable();
  readonly deletingId$ = this.deletingIdSubject.asObservable();
  readonly feedback$ = this.feedbackSubject.asObservable();

  readonly vm$ = combineLatest({
    photos: this.photos$,
    loading: this.loading$,
    saving: this.saving$,
    deletingId: this.deletingId$,
    feedback: this.feedback$
  });

  constructor(private readonly photoApiService: PhotoApiService) {}

  loadPhotos(limit = 12): void {
    this.loadingSubject.next(true);
    this.feedbackSubject.next('');

    this.photoApiService.getPhotos(limit).subscribe({
      next: (items) => {
        this.photosSubject.next(items);
        this.loadingSubject.next(false);
      },
      error: () => {
        this.loadingSubject.next(false);
        this.feedbackSubject.next('Failed to load images from the API.');
      }
    });
  }

  setFeedback(message: string): void {
    this.feedbackSubject.next(message);
  }

  clearFeedback(): void {
    this.feedbackSubject.next('');
  }

  createPhoto(payload: PhotoPayload): Observable<boolean> {
    this.savingSubject.next(true);
    this.feedbackSubject.next('');

    return this.photoApiService.createPhoto(payload).pipe(
      tap((created) => {
        this.photosSubject.next([created, ...this.photosSubject.value]);
        this.feedbackSubject.next(`Created image #${created.id}.`);
      }),
      map(() => true),
      catchError(() => {
        this.feedbackSubject.next('Create failed.');
        return of(false);
      }),
      finalize(() => {
        this.savingSubject.next(false);
      })
    );
  }

  updatePhoto(id: number, payload: PhotoPayload): Observable<boolean> {
    this.savingSubject.next(true);
    this.feedbackSubject.next('');

    return this.photoApiService.updatePhoto(id, payload).pipe(
      tap((updated) => {
        this.photosSubject.next(
          this.photosSubject.value.map((item) =>
            item.id === id ? { ...item, ...updated } : item
          )
        );
        this.feedbackSubject.next(`Updated image #${id}.`);
      }),
      map(() => true),
      catchError(() => {
        this.feedbackSubject.next('Update failed.');
        return of(false);
      }),
      finalize(() => {
        this.savingSubject.next(false);
      })
    );
  }

  deletePhoto(photo: PhotoItem): void {
    this.deletingIdSubject.next(photo.id);
    this.feedbackSubject.next('');

    this.photoApiService.deletePhoto(photo.id).subscribe({
      next: () => {
        this.photosSubject.next(
          this.photosSubject.value.filter((item) => item.id !== photo.id)
        );
        this.deletingIdSubject.next(null);
        this.feedbackSubject.next(`Deleted image #${photo.id}.`);
      },
      error: () => {
        this.deletingIdSubject.next(null);
        this.feedbackSubject.next('Delete failed.');
      }
    });
  }

  getPhotoById(id: number): Observable<PhotoItem> {
    return this.photoApiService.getPhotoById(id);
  }

  findLocalPhotoById(id: number): PhotoItem | undefined {
    return this.photosSubject.value.find((item) => item.id === id);
  }
}
