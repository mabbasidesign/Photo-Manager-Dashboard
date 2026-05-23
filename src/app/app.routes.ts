import { Routes } from '@angular/router';

export const routes: Routes = [
	{
		path: '',
		pathMatch: 'full',
		redirectTo: 'photos'
	},
	{
		path: 'photos',
		loadChildren: () =>
			import('./features/photos/photos.routes').then((m) => m.PHOTOS_ROUTES)
	}
];
