import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PhotoItem } from '../../../../core/models/photo.model';

@Component({
  selector: 'app-photo-list',
  imports: [CommonModule],
  templateUrl: './photo-list.component.html',
  styleUrl: './photo-list.component.css'
})
export class PhotoListComponent {
  @Input({ required: true }) photos: PhotoItem[] = [];
  @Input() loading = false;
  @Input() deletingId: number | null = null;

  @Output() editPressed = new EventEmitter<PhotoItem>();
  @Output() deletePressed = new EventEmitter<PhotoItem>();
}
