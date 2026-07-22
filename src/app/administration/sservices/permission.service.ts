import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { RoleWithUsersResponse } from '../interfaces/permission';
import { ResponseModel, ResponseModelArray } from 'src/app/shared/interface/ResponsemodelArray';
import { PageResponse, Role, UserRegisterResponse } from '../interfaces/pagesWithControl';

@Injectable({
  providedIn: 'root'
})
export class PermissionService {
  private apiUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getAllPagesWithControls(): Observable<ResponseModel<PageResponse[]>> {
    return this.http.get<ResponseModel<PageResponse[]>>(`${this.apiUrl}Pages/getPagesWithControls`);
  }


  saveRoleAndRights(roles: any): Observable<ResponseModel<PageResponse>> {
    return this.http.post<ResponseModel<PageResponse>>(`${this.apiUrl}Role/Create`, roles);
  }


  getPermissionByRoleId(roleId: number): Observable<ResponseModel<Role>> {
    return this.http.get<ResponseModel<Role>>(`${this.apiUrl}Role/GetBy-Id?RoleId=${roleId}`).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Error fetching permissions', error);
        return throwError(() => new Error('Failed to fetch permissions. Please try again.'));
      })
    );
  }

  getAllUsers(): Observable<ResponseModelArray<UserRegisterResponse>> {
    return this.http.get<ResponseModelArray<UserRegisterResponse>>(`${this.apiUrl}ApplicationUser/GetAll`);
  }


  getAllUsersWithRoles(): Observable<ResponseModelArray<RoleWithUsersResponse>> {
    return this.http.get<ResponseModelArray<RoleWithUsersResponse>>(`${this.apiUrl}Role/GetAllWithUsers`);
  }
}
