import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DetailService } from 'src/app/service/detail.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-adm003',
  templateUrl: './adm003.component.html',
  styleUrls: ['./adm003.component.css'],
})
export class ADM003Component implements OnInit {
  // khai báo biến để lưu trữ
  public employee: any;
  private loggedInUsername: string | null = null;
  public certification?: {
    certificationId: number;
    certificationName: string;
    certificationStartDate: string;
    certificationEndDate: string;
    employeeCertificationScore: number;
  };
  private employeeId: number = 0;
  public errorMessage: string | null = null;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private detailService: DetailService
  ) {}

  ngOnInit(): void {
    this.loggedInUsername = localStorage.getItem('username');
    this.route.paramMap.subscribe((params) => {
      // Lấy thông tin từ state object của route
      const state = window.history.state;
      if (state && state.employeeId) {
        this.employeeId = state.employeeId;
      } else {
        console.log('No employeeId received from state.');
        // Nếu không có dữ liệu trong state, kiểm tra trong localStorage
        const storedEmployeeId = localStorage.getItem('employeeId');
        if (storedEmployeeId) {
          this.employeeId = parseInt(storedEmployeeId, 10);
          console.log(
            'parseInt(storedEmployeeId, 10) ' + parseInt(storedEmployeeId, 10)
          );
        }
      }
      // Gọi phương thức từ service để lấy thông tin chi tiết của nhân viên
      this.detailService.getEmployeeById(this.employeeId).subscribe(
        (response) => {
          // Lấy dữ liệu nhân viên thành công, gán thông tin vào biến employee
          this.employee = response;
          if (response?.certifications?.length > 0) {
            this.certification = response?.certifications[0];
          }
        },
        (error) => {
          // Xử lý lỗi và cho về ADM007
          this.router.navigate(['/error-page'], {
            state: { errorMessage: 'システムエラーが発生しました。' },
          });
        }
      );
    });
  }
  // back từ ADM003 về lại ADM002
  public goBack(): void {
    this.router.navigate(['/ADM002']);
  }
  // Kiểm tra xem người đăng nhập có phải là nhân viên cần xóa hay không
private isCheckLoggedInUser(username: string | null): boolean {
  return username === this.loggedInUsername;
}
  // Hàm xác nhận xóa nhân viên
  async confirmDelete() {
    if (this.isCheckLoggedInUser(this.employee?.employeeLoginId)) {
      // Hiển thị thông báo lỗi và không tiến hành xóa
      console.error('Không thể xóa nhân viên đang đăng nhập.');
      this.errorMessage = 'ログインしている従業員は削除できません。';
      return;
    }
    const result = await Swal.fire({
      title: '削除しますが、よろしいでしょうか。',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: '消去',
      cancelButtonText: 'キャンセル',
      showCloseButton: true,
    }); 
    if (result.isConfirmed) {
      this.deleteEmployee();
    } else {
      console.log('Xóa nhân viên đã bị hủy.');
    }
  }

  // Hàm xóa nhân viên
  deleteEmployee() {
    this.detailService.deleteEmployeeById(this.employeeId).subscribe({
      next: () => {
        localStorage.setItem('notificationMessage', 'ユーザの削除が完了しました。');
        this.router.navigate(['/ADM006']); 
      },
      error: (error) => {
        // Trường hợp ID đó không tồn tại 
        console.error('Xóa nhân viên thất bại.');
        this.router.navigate(['error page']); 
        // Xử lý khi xóa thất bại và hiển thị thông báo lỗi
        localStorage.setItem('errorMessage', '該当するユーザは存在していません。')
      }
    }
    );
  }  
  // Phương thức Edit
  Edit() {
  // Chuyển đến trang ADM004
  this.router.navigate(['/ADM004'], { state: { employeeId: this.employeeId } });
  }
}
