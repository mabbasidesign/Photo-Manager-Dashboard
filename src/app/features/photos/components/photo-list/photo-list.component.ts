import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PhotoItem } from '../../../../core/models/photo.model';

@Component({
  selector: 'app-photo-list',
  imports: [CommonModule],
  templateUrl: './photo-list.component.html',
  styleUrl: './photo-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PhotoListComponent {
  @Input({ required: true }) photos: PhotoItem[] = [];
  @Input() loading = false;
  @Input() deletingId: number | null = null;

  @Output() editPressed = new EventEmitter<PhotoItem>();
  @Output() deletePressed = new EventEmitter<PhotoItem>();

  trackByPhotoId(_: number, photo: PhotoItem): number {
    return photo.id;
  }

  getImageUrl(photo: PhotoItem): string {
    if (this.isUnavailablePlaceholder(photo.url)) {
      return this.getFallbackImageUrl(photo.id);
    }

    return photo.url;
  }

  handleImageError(event: Event, photo: PhotoItem): void {
    const image = event.target as HTMLImageElement | null;
    if (!image) {
      return;
    }

    const fallback = this.getFallbackImageUrl(photo.id);
    if (image.src !== fallback) {
      image.src = fallback;
    }
  }

  private isUnavailablePlaceholder(url: string): boolean {
    return url.includes('via.placeholder.com');
  }

  private getFallbackImageUrl(id: number): string {
    return `https://picsum.photos/seed/photo-${id}/240/240`;
  }
}
