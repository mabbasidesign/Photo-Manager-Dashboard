import { Routes } from '@angular/router';
import { PhotosPageComponent } from './pages/photos-page/photos-page.component';
import { pendingChangesGuard } from './guards/pending-changes.guard';

export const PHOTOS_ROUTES: Routes = [
  {
    path: '',
    component: PhotosPageComponent,
    data: { mode: 'list' }
  },
  {
    path: 'new',
    component: PhotosPageComponent,
    canDeactivate: [pendingChangesGuard],
    data: { mode: 'create' }
  },
  {
    path: ':id/edit',
    component: PhotosPageComponent,
    canDeactivate: [pendingChangesGuard],
    data: { mode: 'edit' }
  }
];
