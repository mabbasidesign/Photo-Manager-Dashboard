import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
	{
		path: '',
		pathMatch: 'full',
		redirectTo: 'photos'
	},
	{
		path: 'login',
		loadComponent: () =>
			import('./features/auth/pages/login-page/login-page.component').then(
				(m) => m.LoginPageComponent
			)
	},
	{
		path: 'photos',
		canActivate: [authGuard],
		loadChildren: () =>
			import('./features/photos/photos.routes').then((m) => m.PHOTOS_ROUTES)
	}
];
