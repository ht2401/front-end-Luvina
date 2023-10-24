import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AddEmployeeDTO } from '../model/addEmployeeDTO';

@Injectable({
  providedIn: 'root'
})
export class DetailService {

  private apiUrl = 'http://localhost:8085/employees';

  constructor(private http: HttpClient) { }
  /**
   * Gọi API để lấy thông tin của nhân viên theo ID.
   * @param employeeId ID của nhân viên cần lấy thông tin.
   * @returns Observable chứa thông tin nhân viên.
   */
  getEmployeeById(employeeId: number) {
    const url = `${this.apiUrl}/${employeeId}`;
    return this.http.get<AddEmployeeDTO>(url);
  }
  /**
   * Gọi API để xóa nhân viên theo ID.
   * @param employeeId ID của nhân viên cần xóa.
   * @returns Observable chứa kết quả xóa.
   */
  deleteEmployeeById(employeeId: number) {
    const url = `${this.apiUrl}/${employeeId}`;
    return this.http.delete(url);
  }
}
