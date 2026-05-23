import { CanDeactivateFn } from '@angular/router';
import { PhotosPageComponent } from '../pages/photos-page/photos-page.component';

export const pendingChangesGuard: CanDeactivateFn<PhotosPageComponent> = (
  component
) => component.canDeactivate();
