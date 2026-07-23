import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

import {
  ResponseModel,
  ResponseModelArray
} from 'src/app/shared/interface/ResponsemodelArray';
import { CreateDepartmentRequest, DepartmentResponse } from '../interface/Department';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {

  private apiUrl = `${environment.apiUrl}Departments`;

  constructor(private http: HttpClient) { }

  getAll(): Observable<ResponseModelArray<DepartmentResponse>> {
    return this.http.get<ResponseModelArray<DepartmentResponse>>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  getById(id: number): Observable<ResponseModel<DepartmentResponse>> {
    return this.http.get<ResponseModel<DepartmentResponse>>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  save(model: CreateDepartmentRequest): Observable<ResponseModel<DepartmentResponse>> {
    return this.http.post<ResponseModel<DepartmentResponse>>(this.apiUrl, model).pipe(
      catchError(this.handleError)
    );
  }

  deactivate(id: number): Observable<ResponseModel<DepartmentResponse>> {
    return this.http.patch<ResponseModel<DepartmentResponse>>(
      `${this.apiUrl}/${id}/deactivate`,
      {}
    ).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    console.error('Department API Error:', error);
    return throwError(() =>
      new Error(error.error?.message || 'Something went wrong.')
    );
  }
}