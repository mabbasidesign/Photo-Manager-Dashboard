import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PhotoItem, PhotoPayload } from '../../../../core/models/photo.model';
import { PhotoFormComponent } from '../../components/photo-form/photo-form.component';
import { PhotoListComponent } from '../../components/photo-list/photo-list.component';
import { PhotosFacadeService } from '../../data/photos-facade.service';
import { Subscription } from 'rxjs';

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
  private initialFormSnapshot: PhotoPayload = {
    title: '',
    url: '',
    thumbnailUrl: ''
  };
  private readonly subscriptions = new Subscription();

  constructor(
    private readonly photosFacade: PhotosFacadeService,
    private readonly route: ActivatedRoute,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.subscriptions.add(
      this.photosFacade.vm$.subscribe((vm) => {
        this.photos = vm.photos;
        this.loading = vm.loading;
        this.saving = vm.saving;
        this.deletingId = vm.deletingId;
        this.feedback = vm.feedback;
      })
    );

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

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  loadPhotos(): void {
    this.photosFacade.loadPhotos(12);
  }

  editPhoto(photo: PhotoItem): void {
    void this.router.navigate(['/photos', photo.id, 'edit']);
  }

  cancelEdit(): void {
    void this.router.navigate(['/photos']);
  }

  canDeactivate(): boolean {
    if (!this.hasUnsavedChanges()) {
      return true;
    }

    return window.confirm('You have unsaved changes. Leave this page anyway?');
  }

  submitForm(): void {
    if (!this.form.title || !this.form.url || !this.form.thumbnailUrl) {
      this.photosFacade.setFeedback('Please fill all fields.');
      return;
    }

    if (!this.isValidUrl(this.form.url) || !this.isValidUrl(this.form.thumbnailUrl)) {
      this.photosFacade.setFeedback('Please enter valid URLs for Image URL and Thumbnail URL.');
      return;
    }

    if (this.editingPhotoId === null) {
      this.createPhoto();
      return;
    }

    this.updatePhoto(this.editingPhotoId);
  }

  deletePhoto(photo: PhotoItem): void {
    this.photosFacade.deletePhoto(photo);
  }

  private createPhoto(): void {
    this.photosFacade.createPhoto(this.form).subscribe((succeeded) => {
      if (succeeded) {
        this.resetForm();
        void this.router.navigate(['/photos']);
      }
    });
  }

  private updatePhoto(id: number): void {
    this.photosFacade.updatePhoto(id, this.form).subscribe((succeeded) => {
      if (succeeded) {
        this.editingPhotoId = null;
        this.resetForm();
        void this.router.navigate(['/photos']);
      }
    });
  }

  private resetForm(): void {
    this.form = {
      title: '',
      url: '',
      thumbnailUrl: ''
    };
    this.initialFormSnapshot = { ...this.form };
  }

  private applyModeDefaults(): void {
    if (this.mode === 'create') {
      this.editingPhotoId = null;
      this.resetForm();
      this.photosFacade.setFeedback('Create mode');
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
      this.photosFacade.setFeedback('Invalid image id for edit route.');
      return;
    }

    this.editingPhotoId = id;
    const localPhoto = this.photosFacade.findLocalPhotoById(id);
    if (localPhoto) {
      this.form = {
        title: localPhoto.title,
        url: localPhoto.url,
        thumbnailUrl: localPhoto.thumbnailUrl
      };
      this.initialFormSnapshot = { ...this.form };
      this.photosFacade.setFeedback(`Editing image #${id}`);
      return;
    }

    this.photosFacade.getPhotoById(id).subscribe({
      next: (photo) => {
        this.form = {
          title: photo.title,
          url: photo.url,
          thumbnailUrl: photo.thumbnailUrl
        };
        this.initialFormSnapshot = { ...this.form };
        this.photosFacade.setFeedback(`Editing image #${id}`);
      },
      error: () => {
        this.photosFacade.setFeedback(`Unable to load image #${id} for editing.`);
      }
    });
  }

  private hasUnsavedChanges(): boolean {
    if (this.mode === 'list') {
      return false;
    }

    return !this.formsEqual(this.form, this.initialFormSnapshot);
  }

  private formsEqual(a: PhotoPayload, b: PhotoPayload): boolean {
    return (
      a.title === b.title &&
      a.url === b.url &&
      a.thumbnailUrl === b.thumbnailUrl
    );
  }

  private isValidUrl(value: string): boolean {
    try {
      const url = new URL(value);
      return url.protocol === 'http:' || url.protocol === 'https:';
    } catch {
      return false;
    }
  }
}
