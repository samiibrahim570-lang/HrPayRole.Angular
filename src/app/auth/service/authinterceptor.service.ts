import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AuthService } from './auth.service';
import { catchError, finalize, Observable, tap, throwError } from 'rxjs';
import { LoadingIndicatorService } from 'src/app/shared/service/loading-indicator.service';
import { LicenseService } from './license.service';

@Injectable({
  providedIn: 'root'
})
export class AuthinterceptorService implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
    private indicatorService: LoadingIndicatorService,
    private licenseService: LicenseService,
  ) { }

  canActivate(): boolean {
    const token = this.authService.getToken();
    if (token) {
      this.router.navigate(['Sales/dashboard']);
      return false;
    }
    return true;
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const authToken = this.authService.getToken();
    const clientId = localStorage.getItem('ClientIdentic') || '';

    const modifiedReq = req.clone({
      setHeaders: {
        ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
        ...(clientId ? { ClientId: clientId } : {})
      }
    });

    this.indicatorService.show();

    return next.handle(modifiedReq).pipe(
      tap(event => {
        if (event instanceof HttpResponse) {
          const licenseStatus = event.headers.get('X-License-Status');
          if (licenseStatus) {
            this.licenseService.showLicenseWarning(licenseStatus);
            if (licenseStatus.toLowerCase().includes('expired')) {
              this.authService.logoutPlusExpired();
            }
          }
        }
      }),
      catchError((error: HttpErrorResponse) => {
        const licenseStatus = error.headers?.get('X-License-Status');
        console.log('Error Header: X-License-Status =>', licenseStatus);

        if (licenseStatus && licenseStatus.toLowerCase().includes('expired')) {
          this.authService.logoutPlusExpired();
        } else if (error.status === 401 || error.status === 403) {
          this.authService.logout();
        }

        return throwError(() => error);
      }),

      finalize(() => {
        this.indicatorService.hide();
      })
    );
  }


}
