import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ListService } from 'src/app/service/employee.service';
import { Employee } from 'src/app/model/employees';
import { Department } from 'src/app/model/department';
import { DepartmentService } from 'src/app/service/department.service';
import { FormControl, FormGroup } from '@angular/forms';
import { catchError} from 'rxjs/operators';
import { ADM4vsADN5Service } from 'src/app/service/adm4vs-adn5.service';
import { Router } from '@angular/router';
import { DetailService } from 'src/app/service/detail.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css'],
})
export class UserListComponent implements OnInit {
  // khai báo form
  form = new FormGroup({
    employeeName: new FormControl(''),
    departmentName: new FormControl(''),
  });
  // khai báo 2 list để lưu trữ department và employee
  public listemployees: Employee[] = [];
  public listdepartments: Department[] = [];
  // khai báo các biến để phân trang và sắp xếp
  public pageNumber: number = 1; // Trang hiện tại (được tính từ 1)
  public totalPages: number = 0; // Tổng số trang
  public pageSize: number = 20; // Kích thước trang
  public totalRecords: number = 0; // Tổng số bản ghi
  public orderByColumn: string = ''; // Cột sắp xếp hiện tại
  public orderByDirection: string = ''; // Hướng sắp xếp hiện tại
  defaultSortDirections: { [key: string]: string } = {
    employeeName: 'asc',
    certificationName: 'asc',
    endDate: 'asc'
  };
  constructor(
    public http: HttpClient,
    private listService: ListService,
    private listDepartmentService: DepartmentService,
    private router: Router,
    private service: ADM4vsADN5Service,
    private detailService: DetailService
  ) {}

  hasError = '';
  ngOnInit(): void {
    this.restorePageState();
    this.restorePageNumber();
    this.getListEmployees();
    this.getListdepartments();
  }
  // lấy ra danh sách department
  getListdepartments() {
    this.listDepartmentService.getDepartments().subscribe(
      (response) => {
        this.listdepartments = response.departmentsList;
        if (this.listdepartments.length === 0) {
          this.hasError = '部門を取得できません';
        }
      },
      (error) => {
        this.hasError = '部門を取得できません';
        console.error('API error:', error);
      }
    );
  }
  // chuyển đổi departmentName sang departmentId
  getDepartmentID(departmentName: string) {
    if (departmentName === '') {
      return undefined;
    }
    const department = this.listdepartments.find(
      (dept) => dept.departmentName === departmentName
    );
    return department ? department.departmentId : undefined;
  }
  // sắp xếp theo cột
  sortColumn(column: string) {
    if (column === this.orderByColumn) {
      this.orderByDirection = this.orderByDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.orderByColumn = column;
      this.orderByDirection = this.defaultSortDirections[column];
    }
    // Đặt hướng sắp xếp mặc định cho các cột khác
    Object.keys(this.defaultSortDirections).forEach(key => {
      if (key !== column) {
        this.defaultSortDirections[key] = 'asc';
      }
    });
    this.getListEmployees();
    this.savePageState();
  }

  // lấy danh sách employee
  getListEmployees() {
    const employeeName = this.form.get('employeeName')?.value ?? '';
    const departmentName = this.form.get('departmentName')?.value ?? '';
    const departmentId = this.getDepartmentID(departmentName!);
    const ordEmployeeName =
      this.orderByColumn === 'employeeName' ? this.orderByDirection : '';
    const ordCertificationName =
      this.orderByColumn === 'certificationName' ? this.orderByDirection : '';
    const ordEndDate =
      this.orderByColumn === 'endDate' ? this.orderByDirection : '';
    // Lấy dánh sách employee theo page
    this.listService
      .getAllEmployees(
        employeeName,
        departmentId,
        ordEmployeeName,
        ordCertificationName,
        ordEndDate,
        (this.pageNumber - 1) * this.pageSize,
        this.pageSize
      )
      .pipe(
        catchError((error) => {
          if (this.listemployees.length === 0) {
            this.hasError = '従業員を取得できません';
          }
          console.error('API error:', error);
          return [];
        })
      )
      .subscribe((response) => {
        this.listemployees = response.employees;
        this.totalRecords = response.totalRecords;
        this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
      });
      document.getElementById("employeeName")?.focus()
  }
  // tìm kiếm employee
  search() {
    this.getListEmployees();
    this.savePageState();
  }
  public currentPage: number = this.pageNumber;
  // cập nhật trang hiện tại
  updateCurrentPage() {
    this.currentPage = this.pageNumber;
  }
  // chuyển đến trang mình chọn
  onPageChange(page: number) {
    this.pageNumber = page;
    this.getListEmployees();
    this.updateCurrentPage();
    this.savePageState();
  }
  // về trang trước
  onPrevPage() {
    if (this.pageNumber > 1) {
      this.pageNumber--;
      this.getListEmployees();
      this.updateCurrentPage();
    }
  }
  // đến trang tiếp theo
  onNextPage() {
    if (this.pageNumber < this.totalPages) {
      this.pageNumber++;
      this.getListEmployees();
      this.updateCurrentPage();
    }
  }
  // về lại trang ban đầu
  restorePageNumber() {
    const savedPage = localStorage.getItem('pageNumber');
    if (savedPage) {
      this.pageNumber = parseInt(savedPage, 10);
    }
  }
  // chuyển sang trang ADM004 
  handleAdd() {
    this.router.navigate(['/ADM004']);
    this.service.clearUserData();
    this.service.clearErrorData();
  }
  // Chuyển đến trang ADM003 khi click vào ID nhân viên và lấy dữ liệu từ API
  public onViewEmployeeDetail(employeeId: number) {
    // Kiểm tra xem nhân viên có tồn tại không dựa trên employeeId
    this.detailService.getEmployeeById(employeeId).subscribe({
      next: (response) => {
        if (!response) {
          console.error('Employee not found or invalid data.');
          this.router.navigate(['/error-page']);
        } else {
          // Nhân viên tồn tại, chuyển hướng tới trang ADM003 và chuyển employeeId qua state object của route
          this.router.navigate(['/ADM003'], { state: { employeeId: employeeId } });
          console.log(employeeId);
        }
      },
      error: (error) => {
        // Xử lý lỗi
        console.error('Error while fetching employee info:', error);
        this.router.navigate(['login']); 
      }}
    );
}
  // lưu trạng thái tìm kiếm
  savePageState() {
    const pageState = {
      pageNumber: this.pageNumber,
      employeeName: this.form.get('employeeName')?.value,
      departmentName: this.form.get('departmentName')?.value,
      orderByColumn: this.orderByColumn,
      orderByDirection: this.orderByDirection,
    };
    localStorage.setItem('pageState', JSON.stringify(pageState));
  }
  // Giữ lại các điều kiện search , sort và trang hiện tại
  restorePageState() {
    const pageState = localStorage.getItem('pageState');
    if (pageState) {
      const state = JSON.parse(pageState);
      this.pageNumber = state.pageNumber;
      this.form.get('employeeName')?.setValue(state.employeeName);
      // Chuyển đổi departmentId thành departmentName và gán vào FormControl
      const departmentId = this.getDepartmentID(state.departmentName);
      this.form.get('departmentName')?.setValue(state.departmentName);
      this.orderByColumn = state.orderByColumn;
      this.orderByDirection = state.orderByDirection;
      // Đặt hướng sắp xếp mặc định cho các cột khác
      Object.keys(this.defaultSortDirections).forEach(key => {
        if (key !== this.orderByColumn) {
          this.defaultSortDirections[key] = 'asc';
        }
      });
    }
  }
}
