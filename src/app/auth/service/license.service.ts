import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LicenseService {


 private hasShownWarning = false;


  showLicenseWarning(message: string): void {
   
  }

  resetWarning(): void {
    this.hasShownWarning = false; 
  }
}
