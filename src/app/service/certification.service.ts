import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

//KHAI BAO content-type
const httpOptions = {
  headers: new HttpHeaders ({
    'Content-Type': 'application/json',
  }),
};
@Injectable({
  providedIn: 'root'
})
export class CertificationService {
  // khai báo đường dẫn API
  private REST_API_SERVER_DEPARTMENTS = "http://localhost:8085/certifications";
  constructor(private httpClient: HttpClient) { }
  /**
   * Lấy danh sách các chứng chỉ từ API.
   * @returns Observable chứa kết quả từ việc lấy danh sách chứng chỉ.
   */
  public getCertifications(): Observable<any> {
    const url = this.REST_API_SERVER_DEPARTMENTS;
    return this.httpClient.get<any>(url, httpOptions).pipe(catchError(this.handleError));
  }
  /**
   * Xử lý lỗi từ HTTP response.
   * @param error Đối tượng HttpErrorResponse chứa thông tin về lỗi.
   * @returns Observable ném ra lỗi để được xử lý ở phía gọi API.
   */
  private handleError(error: HttpErrorResponse){
    if(error.error instanceof ErrorEvent){
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(
        `Backend returned code ${error.status}, `+ `body was: ${error.error}`
      );
    }
    return throwError(error);
  }
}
