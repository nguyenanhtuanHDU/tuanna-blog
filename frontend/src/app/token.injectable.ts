import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Injectable()
export class tokenInterceptor implements HttpInterceptor {
  constructor(private router: Router) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    this.logApiCall();
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        // this.router.navigate(['/login']);
        if (error.status == 401) {
          this.router.navigate(['/login']);
          Swal.fire(
            'The login session has expired',
            '',
            'warning'
          );
        }
        return throwError(error);
      })
    );
  }

  private logApiCall() {
    console.log('API call is being made');
  }
}
