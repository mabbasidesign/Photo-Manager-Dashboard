import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PhotoApiService } from '../../../../core/services/photo-api.service';
import { PhotoItem, PhotoPayload } from '../../../../core/models/photo.model';
import { PhotoFormComponent } from '../../components/photo-form/photo-form.component';
import { PhotoListComponent } from '../../components/photo-list/photo-list.component';

@Component({
  selector: 'app-photos-page',
  imports: [CommonModule, RouterLink, PhotoFormComponent, PhotoListComponent],
  templateUrl: './photos-page.component.html',
  styleUrl: './photos-page.component.css'
})
export class PhotosPageComponent implements OnInit {
  readonly title = 'Photo Manager Dashboard';
  mode: 'list' | 'create' | 'edit' = 'list';
  photos: PhotoItem[] = [];
  loading = false;
  saving = false;
  deletingId: number | null = null;
  feedback = '';

  editingPhotoId: number | null = null;
  form: PhotoPayload = {
    title: '',
    url: '',
    thumbnailUrl: ''
  };

  constructor(
    private readonly photoApiService: PhotoApiService,
    private readonly route: ActivatedRoute,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.route.data.subscribe((data) => {
      this.mode = data['mode'] ?? 'list';
      this.applyModeDefaults();
      this.tryLoadEditRouteData();
    });

    this.route.paramMap.subscribe(() => {
      this.tryLoadEditRouteData();
    });

    this.loadPhotos();
  }

  loadPhotos(): void {
    this.loading = true;
    this.feedback = '';

    this.photoApiService.getPhotos(12).subscribe({
      next: (items) => {
        this.photos = items;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.feedback = 'Failed to load images from the API.';
      }
    });
  }

  editPhoto(photo: PhotoItem): void {
    void this.router.navigate(['/photos', photo.id, 'edit']);
  }

  cancelEdit(): void {
    void this.router.navigate(['/photos']);
  }

  submitForm(): void {
    if (!this.form.title || !this.form.url || !this.form.thumbnailUrl) {
      this.feedback = 'Please fill all fields.';
      return;
    }

    this.saving = true;
    this.feedback = '';

    if (this.editingPhotoId === null) {
      this.createPhoto();
      return;
    }

    this.updatePhoto(this.editingPhotoId);
  }

  deletePhoto(photo: PhotoItem): void {
    this.deletingId = photo.id;
    this.feedback = '';

    this.photoApiService.deletePhoto(photo.id).subscribe({
      next: () => {
        this.photos = this.photos.filter((item) => item.id !== photo.id);
        this.deletingId = null;
        this.feedback = `Deleted image #${photo.id}.`;
      },
      error: () => {
        this.deletingId = null;
        this.feedback = 'Delete failed.';
      }
    });
  }

  private createPhoto(): void {
    this.photoApiService.createPhoto(this.form).subscribe({
      next: (created) => {
        this.photos = [created, ...this.photos];
        this.saving = false;
        this.feedback = `Created image #${created.id}.`;
        this.resetForm();
        void this.router.navigate(['/photos']);
      },
      error: () => {
        this.saving = false;
        this.feedback = 'Create failed.';
      }
    });
  }

  private updatePhoto(id: number): void {
    this.photoApiService.updatePhoto(id, this.form).subscribe({
      next: (updated) => {
        this.photos = this.photos.map((item) =>
          item.id === id ? { ...item, ...updated } : item
        );
        this.saving = false;
        this.feedback = `Updated image #${id}.`;
        this.editingPhotoId = null;
        this.resetForm();
        void this.router.navigate(['/photos']);
      },
      error: () => {
        this.saving = false;
        this.feedback = 'Update failed.';
      }
    });
  }

  private resetForm(): void {
    this.form = {
      title: '',
      url: '',
      thumbnailUrl: ''
    };
  }

  private applyModeDefaults(): void {
    if (this.mode === 'create') {
      this.editingPhotoId = null;
      this.resetForm();
      this.feedback = 'Create mode';
      return;
    }

    if (this.mode === 'list') {
      this.editingPhotoId = null;
      this.resetForm();
    }
  }

  private tryLoadEditRouteData(): void {
    if (this.mode !== 'edit') {
      return;
    }

    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (Number.isNaN(id)) {
      this.feedback = 'Invalid image id for edit route.';
      return;
    }

    this.editingPhotoId = id;
    const localPhoto = this.photos.find((item) => item.id === id);
    if (localPhoto) {
      this.form = {
        title: localPhoto.title,
        url: localPhoto.url,
        thumbnailUrl: localPhoto.thumbnailUrl
      };
      this.feedback = `Editing image #${id}`;
      return;
    }

    this.photoApiService.getPhotoById(id).subscribe({
      next: (photo) => {
        this.form = {
          title: photo.title,
          url: photo.url,
          thumbnailUrl: photo.thumbnailUrl
        };
        this.feedback = `Editing image #${id}`;
      },
      error: () => {
        this.feedback = `Unable to load image #${id} for editing.`;
      }
    });
  }
}
