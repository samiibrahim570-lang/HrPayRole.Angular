import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse
} from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { LicenseService } from './license.service';

@Injectable()
export class LicenseInterceptor implements HttpInterceptor {


  constructor(private licenseService: LicenseService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> { 
    return next.handle(req).pipe(
      tap((event) => { 
        if (event instanceof HttpResponse) {
          const allHeaders = event.headers.keys();
          // console.log('All Headers:', allHeaders);

          const licenseStatus = event.headers.get('X-License-Status');
          // console.log('License Status Header:', licenseStatus);

          if (licenseStatus) {
            this.licenseService.showLicenseWarning(licenseStatus);
          }
        }
      })

    );
  }
}
