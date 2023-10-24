import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ADM4vsADN5Service } from 'src/app/service/adm4vs-adn5.service';
import { AddemployeeService } from 'src/app/service/addemployee.service';
import { DepartmentService } from 'src/app/service/department.service';
import { CertificationService } from 'src/app/service/certification.service';
import { UpdateemployeeService } from 'src/app/service/updateemployee.service';
@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.css'],
})
export class ConfirmComponent implements OnInit {
  // khai báo các trường dữ liệu
  public employeeLoginId: string = '';
  public departmentName: string = '';
  public employeeName: string = '';
  public employeeNameKana: string = '';
  public employeeBirthDate: string = '';
  public employeeEmail: string = '';
  public employeeTelephone: string = '';
  public employeeLoginPassword: string = '';
  public confirmPassword: string = '';
  public certificationName: string = '';
  public certificationStartDate: string = '';
  public certificationEndDate: string = '';
  public employeeCertificationScore: number = 0;
  public listDepartments: any[] = [];
  public listCertifications: any[] = [];
  public employeeId?: number;
  constructor(
    private service: ADM4vsADN5Service,
    private router: Router,
    private addEmployeeService: AddemployeeService,
    private departmentService: DepartmentService,
    private certificationService: CertificationService,
    private addService: ADM4vsADN5Service,
    private updateEmployee: UpdateemployeeService
  ) {}

  // nhận dữ liệu và list lên màn hình
  ngOnInit() {
    const userData = this.service.getUserData();
    if (userData) {
      this.employeeLoginId = userData.employeeLoginId;
      this.departmentName = userData.departmentName;
      this.employeeName = userData.employeeName;
      this.employeeNameKana = userData.employeeNameKana;
      this.employeeBirthDate = userData.employeeBirthDate;
      this.employeeEmail = userData.employeeEmail;
      this.employeeTelephone = userData.employeeTelephone;
      this.certificationName = userData.certificationName;
      this.certificationStartDate = userData.certificationStartDate;
      this.certificationEndDate = userData.certificationEndDate;
      this.employeeCertificationScore = userData.employeeCertificationScore;
      this.employeeLoginPassword = userData.employeeLoginPassword;
      this.confirmPassword = userData.confirmPassword;
    }
    this.getDepartments();
    this.getCertifications();
  }

  // lấy danh sách department
  private getDepartments() {
    this.departmentService.getDepartments().subscribe({
      next: (data: any) => {
        this.listDepartments = data.departmentsList;
      },
      error: (error) => {
        console.error('Error fetching departments:', error);
      }
    }
    );
  }
  // lấy danh sách certification
  private getCertifications() {
    this.certificationService.getCertifications().subscribe({
      next: (data: any) => {
        this.listCertifications = data.certificationsList;
      },
      error: (error) => {
        console.error('Error fetching certifications:', error);
      }
    }
    );
  }
  // xử lý button cancel và lưu dữ liệu để trả về ADM004
  handleCancel() {
    const state = window.history.state;
    this.employeeId = state.employeeId;
    if(state && state.employeeId) {
        this.router.navigate(['/ADM004'], {state: { employeeId: this.employeeId }});
        this.service.clearErrorData();
      } else {
        this.router.navigate(['/ADM004']);
    this.service.clearErrorData();
      }
  }
  // xử lý button confirm để add employee
  handleConfirm() {
      // Kiểm tra trường certificationId có giá trị hay không
      const certificationId = this.getCertificationId(this.certificationName);
      const hasCertification =
        certificationId !== null && certificationId !== undefined;
      const employee: any = {
        employeeName: this.employeeName,
        employeeBirthDate: this.employeeBirthDate,
        employeeEmail: this.employeeEmail,
        employeeTelephone: this.employeeTelephone,
        employeeNameKana: this.employeeNameKana,
        employeeLoginId: this.employeeLoginId,
        employeeLoginPassword: this.employeeLoginPassword,
        departmentId: this.getDepartmentId(this.departmentName),
        certifications: hasCertification
          ? [
              {
                certificationId: this.getCertificationId(this.certificationName),
                certificationStartDate: this.certificationStartDate,
                certificationEndDate: this.certificationEndDate,
                employeeCertificationScore: this.employeeCertificationScore.toString(),
              },
            ]
          : [],
      };
      const state = window.history.state;
      this.employeeId = state.employeeId;
      if(state && state.employeeId) {
        console.log(JSON.stringify(employee));
      // Gọi API để cập nhật nhân viên
    this.updateEmployee.updateEmployee(state.employeeId, employee).subscribe({
      next: (response) => {
        console.log('Employee updated successfully:', response);
        // Xử lý thành công (nếu cần)
        this.service.clearUserData();
        this.router.navigate(['/ADM006']);
        localStorage.setItem('notificationMessage', 'ユーザの更新が完了しました。');
      },
      error: (error) => {
        this.router.navigate(['login']);
      }
    }
    );
      } else {
        console.log(JSON.stringify(employee));
        console.log('hathangdayne',employee);
        
      this.addEmployeeService.addEmployee(employee).subscribe({
        next: (response) => {
          this.service.clearUserData();
          this.router.navigate(['/ADM006']);
          localStorage.setItem('notificationMessage', 'ユーザの登録が完了しました。');
        },
        error: (error) => {
          console.error('Error adding employee:', error);
          this.addService.setErrorData({
            message: 'アカウント名 は既に存在しています',
          });
          this.router.navigate(['/ADM004']);
        }
      }
      );
      }
    }
  // lấy departmentId từ departmentname
  getDepartmentId(departmentName: string): number | undefined {
    const department = this.listDepartments.find(
      (dep) => dep.departmentName === departmentName
    );
    return department?.departmentId;
  }
  // lấy certificationId từ certificationName
  getCertificationId(certificationName: string): number | undefined {
    const certification = this.listCertifications.find(
      (cert) => cert.certificationName === certificationName
    );
    return certification?.certificationId;
  }
}
