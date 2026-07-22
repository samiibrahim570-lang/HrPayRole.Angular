import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { UserRegister, UserRegisterResponse } from '../interfaces/pagesWithControl';
import { ResponseModel, ResponseModelArray, ResponsePaginatedModel } from 'src/app/shared/interface/ResponsemodelArray';
import { formDataGet, GetRolesResponse } from '../interfaces/GetRolesResponse';

@Injectable({
  providedIn: 'root'
})
export class UserregistrationService {
  private apiUrl: string = environment.apiUrl;

  constructor(private http: HttpClient, private router: Router) { }

  UserRegister(user: UserRegister): Observable<ResponseModel<UserRegisterResponse>> {
    return this.http.post<ResponseModel<UserRegisterResponse>>(`${this.apiUrl}ApplicationUser/register`, user);
  }

  updateRegister(globalId: string, payload: UserRegisterResponse): Observable<ResponseModel<UserRegisterResponse>> {
    return this.http.put<ResponseModel<UserRegisterResponse>>(
      `${this.apiUrl}ApplicationUser/updateBy-GlobalId?globalId=${globalId}`,
      payload
    );
  }

  deletecusById(globalId: string | undefined): Observable<ResponseModel<UserRegisterResponse>> {
    return this.http.delete<ResponseModel<UserRegisterResponse>>(`${this.apiUrl}ApplicationUser/deleteBy-GlobalId?globalId=${globalId}`);
  }

  getByGlobalIdApplicationUser(globalId: string): Observable<ResponseModel<UserRegisterResponse>> {
    return this.http.get<ResponseModel<UserRegisterResponse>>(`${this.apiUrl}ApplicationUser/getBy-GlobalId?GlobalId=${globalId}`);
  }

  onGetAllApplicationUser(formData: formDataGet): Observable<ResponsePaginatedModel<UserRegister>> {
    return this.http.post<ResponsePaginatedModel<UserRegister>>(
      `${this.apiUrl}ApplicationUser/search`,
      formData
    );
  }

  getAllUsers(): Observable<ResponseModelArray<UserRegisterResponse>> {
    return this.http.get<ResponseModelArray<UserRegisterResponse>>(`${this.apiUrl}ApplicationUser/GetAll`);
  }

  getAllRoles(): Observable<ResponseModelArray<GetRolesResponse>> {
    return this.http.get<ResponseModelArray<GetRolesResponse>>(`${this.apiUrl}Role/GetAll`);
  }

}
