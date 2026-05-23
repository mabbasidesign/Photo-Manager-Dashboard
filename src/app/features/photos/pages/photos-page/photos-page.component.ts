import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PhotoItem, PhotoPayload } from '../../../../core/models/photo.model';
import { PhotoFormComponent } from '../../components/photo-form/photo-form.component';
import { PhotoListComponent } from '../../components/photo-list/photo-list.component';
import { PhotosFacadeService } from '../../data/photos-facade.service';
import { Subscription } from 'rxjs';

type SortOption = 'idDesc' | 'idAsc' | 'titleAsc' | 'titleDesc';

@Component({
  selector: 'app-photos-page',
  imports: [CommonModule, FormsModule, RouterLink, PhotoFormComponent, PhotoListComponent],
  templateUrl: './photos-page.component.html',
  styleUrl: './photos-page.component.css'
})
export class PhotosPageComponent implements OnInit {
  readonly title = 'Photo Manager Dashboard';
  mode: 'list' | 'create' | 'edit' = 'list';
  photos: PhotoItem[] = [];
  filteredPhotos: PhotoItem[] = [];
  pagedPhotos: PhotoItem[] = [];
  loading = false;
  saving = false;
  deletingId: number | null = null;
  feedback = '';

  searchTerm = '';
  sortBy: SortOption = 'idDesc';
  currentPage = 1;
  readonly pageSize = 8;
  totalPages = 1;
  totalItems = 0;

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
        this.recomputeListView();
      })
    );

    this.subscriptions.add(
      this.route.queryParamMap.subscribe((queryParams) => {
        this.searchTerm = queryParams.get('q') ?? '';
        this.sortBy = this.parseSortOption(queryParams.get('sort'));
        this.currentPage = this.parsePage(queryParams.get('page'));
        this.recomputeListView();
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

  onSearchInput(event: Event): void {
    const target = event.target as HTMLInputElement | null;
    this.searchTerm = target?.value ?? '';
    this.currentPage = 1;
    this.updateQueryParams();
    this.recomputeListView();
  }

  onSortChange(event: Event): void {
    const target = event.target as HTMLSelectElement | null;
    this.sortBy = this.parseSortOption(target?.value ?? 'idDesc');
    this.currentPage = 1;
    this.updateQueryParams();
    this.recomputeListView();
  }

  goToPreviousPage(): void {
    if (this.currentPage <= 1) {
      return;
    }

    this.currentPage -= 1;
    this.updateQueryParams();
    this.recomputeListView();
  }

  goToNextPage(): void {
    if (this.currentPage >= this.totalPages) {
      return;
    }

    this.currentPage += 1;
    this.updateQueryParams();
    this.recomputeListView();
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

  private recomputeListView(): void {
    const query = this.searchTerm.trim().toLowerCase();
    let working = [...this.photos];

    if (query) {
      working = working.filter((photo) =>
        photo.title.toLowerCase().includes(query)
      );
    }

    working.sort((a, b) => this.comparePhotos(a, b, this.sortBy));

    this.filteredPhotos = working;
    this.totalItems = working.length;
    this.totalPages = Math.max(1, Math.ceil(this.totalItems / this.pageSize));
    this.currentPage = Math.min(this.currentPage, this.totalPages);

    const start = (this.currentPage - 1) * this.pageSize;
    this.pagedPhotos = working.slice(start, start + this.pageSize);
  }

  private comparePhotos(a: PhotoItem, b: PhotoItem, sortBy: SortOption): number {
    switch (sortBy) {
      case 'idAsc':
        return a.id - b.id;
      case 'titleAsc':
        return a.title.localeCompare(b.title);
      case 'titleDesc':
        return b.title.localeCompare(a.title);
      case 'idDesc':
      default:
        return b.id - a.id;
    }
  }

  private parseSortOption(value: string | null): SortOption {
    if (value === 'idAsc' || value === 'titleAsc' || value === 'titleDesc') {
      return value;
    }

    return 'idDesc';
  }

  private parsePage(value: string | null): number {
    const parsed = Number(value);
    if (!Number.isFinite(parsed) || parsed < 1) {
      return 1;
    }

    return Math.floor(parsed);
  }

  private updateQueryParams(): void {
    void this.router.navigate([], {
      relativeTo: this.route,
      replaceUrl: true,
      queryParams: {
        q: this.searchTerm || null,
        sort: this.sortBy === 'idDesc' ? null : this.sortBy,
        page: this.currentPage === 1 ? null : this.currentPage
      }
    });
  }
}
