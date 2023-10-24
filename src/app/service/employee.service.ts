import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ListService {
  // đường dẫn API
  private REST_API_SERVER_EMPLOYEES = "http://localhost:8085/employees";
  constructor(private httpClient: HttpClient) { }
 /**
   * Gọi API để lấy danh sách nhân viên với phân trang, tìm kiếm, và sắp xếp.
   * @param employeeName Tên nhân viên cần tìm kiếm.
   * @param departmentId ID của phòng ban cần tìm kiếm.
   * @param ordEmployeeName Tên cột để sắp xếp danh sách nhân viên.
   * @param ordCertificationName Tên cột để sắp xếp danh sách chứng chỉ.
   * @param ordEndDate Tên cột để sắp xếp theo ngày kết thúc chứng chỉ.
   * @param offset Vị trí bắt đầu của dữ liệu (phân trang).
   * @param limit Số lượng bản ghi lấy ra (phân trang).
   * @returns Observable chứa kết quả từ việc lấy danh sách nhân viên.
   */  
  getAllEmployees(
    employeeName: string,
    departmentId: number | undefined,
    ordEmployeeName: string,
    ordCertificationName: string,
    ordEndDate: string,
    offset: number,
    limit: number,
  ): Observable<any> {
    let params = new HttpParams()
      .set('employeeName', employeeName)
      .set('departmentId', departmentId !== undefined ? departmentId.toString() : '')
      .set('ordEmployeeName', ordEmployeeName)
      .set('ordCertificationName', ordCertificationName)
      .set('ordEndDate', ordEndDate)
      .set('offset', offset.toString())
      .set('limit', limit.toString())
    return this.httpClient.get<any>(this.REST_API_SERVER_EMPLOYEES, { params }).pipe(
      catchError(this.handleError)
    );
  }
  /**
   * Xử lý lỗi từ HTTP response.
   * @param error Đối tượng HttpErrorResponse chứa thông tin về lỗi.
   * @returns Observable ném ra lỗi để được xử lý ở phía gọi API.
   */
  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(
        `Backend returned code ${error.status}, body was: ${error.error}`
      );
    }
    return throwError('Please try again later.');
  }
}

