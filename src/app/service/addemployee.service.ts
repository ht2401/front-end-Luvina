import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AddEmployeeDTO } from '../model/addEmployeeDTO';

@Injectable({
  providedIn: 'root'
})
export class AddemployeeService {
  // đường dẫn API
  private apiUrl = 'http://localhost:8085/employees';
  constructor(private http: HttpClient) {}
  /**
   * Thêm nhân viên mới.
   * @param employee Đối tượng AddEmployeeDTO chứa thông tin nhân viên cần thêm.
   * @returns Observable chứa kết quả từ việc thêm nhân viên.
   */
  public addEmployee(employee: AddEmployeeDTO): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http.post<any>(`${this.apiUrl}/employees`, employee, {
      headers: headers
    }).pipe(
      catchError(error => {
        console.error(error);
        return throwError(error);
      })
    );
  }
}
