import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { ResponseModel } from 'src/app/shared/interface/ResponsemodelArray';
import { AuthRequest, AuthResponse } from '../interface/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private permissions: any[] = [];
  // private menuSubject = new BehaviorSubject<NavigationItem[]>([]);
  // menu$ = this.menuSubject.asObservable();
  private apiUrl: string = environment.apiUrl;
  private authTokenKey: string = 'authToken';
  private clientId: string = 'ClientIdentic';
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasToken());

  constructor(private http: HttpClient, private router: Router) { }

  login(authRequest: AuthRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}Auth/login`, authRequest);
  }

  setToken(token: string): void {
    localStorage.setItem(this.authTokenKey, token);
    this.isAuthenticatedSubject.next(true);
  }

  setClient(client: string): void {
    localStorage.setItem(this.clientId, client);
    this.isAuthenticatedSubject.next(true);
  }

  getToken(): string {
    return localStorage.getItem(this.authTokenKey) || '';
  }

  private hasToken(): boolean {
    return !!localStorage.getItem(this.authTokenKey);
  }

  get isAuthenticated$(): Observable<boolean> {
    return this.isAuthenticatedSubject.asObservable();
  }

  isAuthenticated(): boolean {
    return this.hasToken();
  }

  clearAllLocalStorage(): void {
    localStorage.clear();
    this.isAuthenticatedSubject.next(false);
  }

  logout(): void {
    localStorage.removeItem(this.authTokenKey);
    localStorage.removeItem('menu');
    localStorage.removeItem('menuData');
    localStorage.removeItem('loginPerson');
    localStorage.removeItem('userMenuPermissions');
    localStorage.removeItem('glVoucherData');
    localStorage.removeItem('glVoucherFromDate');
    localStorage.removeItem('glVoucherToDate');
    localStorage.removeItem('reportData');
    localStorage.removeItem('glagingVoucherData');
    localStorage.removeItem('ClientIdentic');
    localStorage.removeItem('lookups-Change-Request');
    this.isAuthenticatedSubject.next(false);
    this.router.navigate(['auth/sign-in']);

  }

    logoutPlusExpired(): void {
    localStorage.removeItem(this.authTokenKey);
    localStorage.removeItem('menu');
    localStorage.removeItem('menuData');
    localStorage.removeItem('loginPerson');
    localStorage.removeItem('userMenuPermissions');
    localStorage.removeItem('glVoucherData');
    localStorage.removeItem('glVoucherFromDate');
    localStorage.removeItem('glVoucherToDate');
    localStorage.removeItem('reportData');
    localStorage.removeItem('glagingVoucherData');
    localStorage.removeItem('ClientIdentic');
    this.isAuthenticatedSubject.next(false);
    this.router.navigate(['auth/subscription-expired']);
  }

  // forgotpassword(authRequest: ApplicationUser): Observable<ResponseModel<ApplicationUserResponse>> {
  //   return this.http.post<ResponseModel<ApplicationUserResponse>>(`${this.apiUrl}ForgotPassowrd/forgot-password`, authRequest);
  // }

  // getUserByglobalId(globalId: string): Observable<ResponseModel<UserRegisterResponse>> {
  //   return this.http.get<ResponseModel<UserRegisterResponse>>(`${this.apiUrl}ForgotPassowrd/getBy-GlobalId?globalId=${globalId}`);
  // }

  // updateUserbyglobalid(globalId: string, UserData: UserRegister): Observable<ResponseModel<UserRegisterResponse>> {
  //   return this.http.put<ResponseModel<UserRegisterResponse>>(
  //     `${this.apiUrl}ForgotPassowrd/updateBy-GlobalId?globalId=${globalId}`,
  //     UserData
  //   );
  // }

  // getMenuByRoles(): Observable<ResponseModel<MenuResponse>> {
  //   return this.http.get<ResponseModel<MenuResponse>>(`${this.apiUrl}Role/GetByAssigneeToken`);
  // }

  // setMenu(menu: NavigationItem[]) {
  //   this.menuSubject.next(menu);
  //   localStorage.setItem('menu', JSON.stringify(menu));
  // }

  // loadMenuFromLocalStorage() {
  //   const menu = localStorage.getItem('menu');
  //   if (menu) {
  //     try {
  //       const parsedMenu = JSON.parse(menu) as NavigationItem[];
  //       this.menuSubject.next(parsedMenu);
  //     } catch (error) {
  //       console.error('Error parsing menu from localStorage:', error);
  //     }
  //   }
  // }

  initializePermissions(data: any[]) {
    this.permissions = data;
    localStorage.setItem('userMenuPermissions', JSON.stringify(data));
  }

  getPermissions(): any[] {
    return this.permissions ;
  }

  uploadLicense(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${this.apiUrl}license/upload`, formData);
  }



  private userKey: string = 'loginPerson';
private roleIdKey: string = 'roleId';

setUser(user: any): void {
  localStorage.setItem(this.userKey, JSON.stringify(user));
}

getUser(): any {
  const user = localStorage.getItem(this.userKey);
  return user ? JSON.parse(user) : null;
}

setRoleId(roleId: number | null): void {
  if (roleId !== null && roleId !== undefined) {
    localStorage.setItem(this.roleIdKey, roleId.toString());
  }
}

getRoleId(): number | null {
  const roleId = localStorage.getItem(this.roleIdKey);
  return roleId ? Number(roleId) : null;
}
}
