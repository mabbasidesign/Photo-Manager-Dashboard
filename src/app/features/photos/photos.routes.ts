import { Routes } from '@angular/router';
import { PhotosPageComponent } from './pages/photos-page/photos-page.component';

export const PHOTOS_ROUTES: Routes = [
  {
    path: '',
    component: PhotosPageComponent,
    data: { mode: 'list' }
  },
  {
    path: 'new',
    component: PhotosPageComponent,
    data: { mode: 'create' }
  },
  {
    path: ':id/edit',
    component: PhotosPageComponent,
    data: { mode: 'edit' }
  }
];
