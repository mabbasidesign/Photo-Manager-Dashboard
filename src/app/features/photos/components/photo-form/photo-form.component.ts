import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PhotoPayload } from '../../../../core/models/photo.model';

@Component({
  selector: 'app-photo-form',
  imports: [CommonModule, FormsModule],
  templateUrl: './photo-form.component.html',
  styleUrl: './photo-form.component.css'
})
export class PhotoFormComponent {
  @Input({ required: true }) form!: PhotoPayload;
  @Input() editingPhotoId: number | null = null;
  @Input() saving = false;
  @Input() loading = false;

  @Output() submitPressed = new EventEmitter<void>();
  @Output() cancelPressed = new EventEmitter<void>();
  @Output() refreshPressed = new EventEmitter<void>();
}
