import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, finalize, throwError } from 'rxjs';
import { ApiErrorService } from '../services/api-error.service';
import { HttpLoadingService } from '../services/http-loading.service';

export const httpStatusInterceptor: HttpInterceptorFn = (request, next) => {
  const loadingService = inject(HttpLoadingService);
  const apiErrorService = inject(ApiErrorService);

  loadingService.requestStarted();

  return next(request).pipe(
    catchError((error: HttpErrorResponse) => {
      apiErrorService.setError(mapHttpError(error));
      return throwError(() => error);
    }),
    finalize(() => {
      loadingService.requestFinished();
    })
  );
};

function mapHttpError(error: HttpErrorResponse): string {
  if (error.status === 0) {
    return 'Network error: unable to reach API server.';
  }

  if (error.status >= 500) {
    return 'Server error: please try again in a moment.';
  }

  if (error.status === 404) {
    return 'Resource not found.';
  }

  if (error.status === 401 || error.status === 403) {
    return 'Authorization error: request was denied.';
  }

  if (error.status >= 400) {
    return 'Request failed. Please verify input and try again.';
  }

  return 'Unexpected error while calling API.';
}
