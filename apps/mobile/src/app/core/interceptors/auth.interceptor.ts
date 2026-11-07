import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { from, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

const PUBLIC_PATHS = ['/auth/login', '/auth/register', '/auth/refresh', '/health'];

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const isPublic = PUBLIC_PATHS.some((path) => req.url.includes(path));

  const token = authService.accessToken();
  const authReq = !isPublic && token ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req;

  return next(authReq).pipe(
    catchError((error: unknown) => {
      const isUnauthorized = error instanceof HttpErrorResponse && error.status === 401;
      if (isPublic || !isUnauthorized) {
        return throwError(() => error);
      }

      return from(authService.tryRefresh()).pipe(
        switchMap((refreshed) => {
          if (!refreshed) {
            return throwError(() => error);
          }
          const retryToken = authService.accessToken();
          const retryReq = req.clone({ setHeaders: { Authorization: `Bearer ${retryToken}` } });
          return next(retryReq);
        }),
      );
    }),
  );
};
