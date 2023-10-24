import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UpdateemployeeService {

  private baseUrl = 'http://localhost:8085/employees'; 

  constructor(private http: HttpClient) {}

  /**
   * Gọi API để cập nhật thông tin nhân viên.
   * @param employeeId ID của nhân viên cần cập nhật thông tin.
   * @param updateEmployeeDTO Đối tượng chứa thông tin cần cập nhật.
   * @returns Observable chứa kết quả từ việc cập nhật nhân viên.
   */
  updateEmployee(employeeId: number, updateEmployeeDTO: any): Observable<any> {
    const url = `${this.baseUrl}/${employeeId}`;
    return this.http.put(url, updateEmployeeDTO);
  }
}
