import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { DepartmentService } from 'src/app/service/department.service';
import { CertificationService } from 'src/app/service/certification.service';
import { Department } from 'src/app/model/department';
import { Certification } from 'src/app/model/certification';
import { ActivatedRoute, Router } from '@angular/router';
import { ADM4vsADN5Service } from 'src/app/service/adm4vs-adn5.service';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { DetailService } from 'src/app/service/detail.service';
import { AppConstants } from 'src/app/app-constans';
@Component({
  selector: 'app-user-add',
  templateUrl: './user-add.component.html',
  styleUrls: ['./user-add.component.css'],
})
export class UserAddComponent implements OnInit {
  // Khai báo biến lưu trữ
  public employee: any;
  public certification?: any;
  public employeeId: number = 0;
  // Focus vào hạng mục đầu tiên khi mới vào trang
  @ViewChild('firstField') firstField!: ElementRef<HTMLInputElement>;
  datepickerConfig: Partial<BsDatepickerConfig>;
  // focus vào ngay hạng mục employeeloginid khi vừa vào trang
  ngAfterViewInit() {
    // Gọi phương thức focus() sau khi view đã được khởi tạo
    this.firstField.nativeElement.focus();
  }
  public isSubmitDisabled = true;
  public isCertificationSelected = false;
  public isPasswordConfirmed = false;
  // khai báo 2 list để lưu trữ department và certification
  public listDepartments: Department[] = [];
  public listCertifications: Certification[] = [];
  // Khai báo biến để hiển thị thông báo lỗi
  public showError = false;
  public errorMessage = '';
  public focus: any;
  // khai báo FormGroup và các FormControl
  public userForm!: FormGroup;
  public employeeLoginIdControl!: FormControl;
  public departmentNameControl!: FormControl;
  public employeeNameControl!: FormControl;
  public katakanaNameControl!: FormControl;
  public employeeBirthDateControl!: FormControl;
  public employeeEmailControl!: FormControl;
  public employeeTelephoneControl!: FormControl;
  public employeeLoginPasswordControl!: FormControl;
  public employeeLoginRePasswordControl!: FormControl;
  public certificationControl!: FormControl;
  public certificationStartDateControl!: FormControl;
  public certificationEndDateControl!: FormControl;
  public employeeCertificationScoreControl!: FormControl;
  // Khai báo các service 
  constructor(
    private departmentService: DepartmentService,
    private certificationService: CertificationService,
    private router: Router,
    private service: ADM4vsADN5Service,
    private route: ActivatedRoute,
    private detailService: DetailService,
    public appConstants: AppConstants
  ) {
    // kiểu date hiển thị
    this.datepickerConfig = {
      dateInputFormat: 'YYYY/MM/DD',
    };
  }
  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      // Lấy thông tin từ state object của route
      const state = window.history.state;
      if (state && state.employeeId) {
        this.employeeId = state.employeeId;
        this.detailService.getEmployeeById(this.employeeId).subscribe(
          (response) => {
            // Lấy dữ liệu nhân viên thành công, gán thông tin vào biến employee
            this.employee = response;
            console.log(response);
            
            if (response?.certifications?.length !== 0) {
              this.certification = response?.certifications[0];
            }
            if (response.certifications.length == 0) {
              this.userForm.get('certification')?.setValue("");
            } 
            // đưa dữ liệu vào form 
            this.userForm.patchValue(this.employee); 
            this.userForm.patchValue(this.certification);
            // tắt validate khi không thay đổi password
            if (this.employeeId && !this.employeeLoginPasswordControl.value) {
              this.employeeLoginPasswordControl.clearValidators();
              this.employeeLoginRePasswordControl.clearValidators();
              this.employeeLoginPasswordControl.updateValueAndValidity();
              this.employeeLoginRePasswordControl.updateValueAndValidity();
            } else {
              // validate password
              this.employeeLoginPasswordControl = new FormControl('', [
                Validators.required,
                Validators.minLength(8),
                Validators.maxLength(50),
              ]);
              // validate confirm password
              this.employeeLoginRePasswordControl = new FormControl('', [
                Validators.required,
                this.matchPasswordValidator(),
              ]);
            }
          },
          (error) => {
            // chuyển về trang error khi sai đường dẫn
            this.router.navigate(['/error-page']);
          }
        );
      } else {
        // Nếu không có dữ liệu trong state, kiểm tra trong localStorage
        const storedEmployeeId = localStorage.getItem('employeeId');
        if (storedEmployeeId) {
          this.employeeId = parseInt(storedEmployeeId, 10);
        }
      }
    });
    // Lấy thông báo lỗi từ service ADM4vsADN5Service nếu có
    const errorData = this.service.getErrorData();
    if (errorData) {
      this.showError = true;
      this.errorMessage = errorData.message;
    }
    this.getDepartments();
    this.getCertifications();
    this.initForm();
    this.checkValidateOnChange()

    this.certificationStartDateControl.valueChanges.subscribe(() => {
      this.certificationEndDateControl.updateValueAndValidity();
  });
    const isCertificationSelected = localStorage.getItem(
      'isCertificationSelected'
    );
    if (isCertificationSelected) {
      this.isCertificationSelected = isCertificationSelected === 'true';
    }
    this.certificationControl.valueChanges.subscribe((value: string) => {
      // Kiểm tra giá trị đã được chọn và cập nhật trạng thái "isCertificationSelected"
      this.isCertificationSelected = !!value;
      // Nếu không có giá trị "certification" được chọn, đặt giá trị rỗng cho các trường dưới
      if (!value) {
        this.userForm.get('certificationStartDate')?.setValue('');
        this.userForm.get('certificationEndDate')?.setValue('');
        this.userForm.get('employeeCertificationScore')?.setValue('');
      }
      // Vô hiệu hóa / kích hoạt các trường dưới tùy thuộc vào giá trị "isCertificationSelected"
      if (this.isCertificationSelected) {
        this.userForm.get('certificationStartDate')?.enable();
        this.userForm.get('certificationEndDate')?.enable();
        this.userForm.get('employeeCertificationScore')?.enable();
      } else {
        this.userForm.get('certificationStartDate')?.disable();
        this.userForm.get('certificationEndDate')?.disable();
        this.userForm.get('employeeCertificationScore')?.disable();
      }
      if (!value) {
        this.userForm.get('certificationStartDate')?.setValue('');
        this.userForm.get('certificationEndDate')?.setValue('');
        this.userForm.get('employeeCertificationScore')?.setValue('');
      }
      // Vô hiệu hóa / kích hoạt các trường dưới tùy thuộc vào giá trị "isCertificationSelected"
      if (this.isCertificationSelected) {
        this.userForm.get('certificationStartDate')?.enable();
        this.userForm.get('certificationEndDate')?.enable();
        this.userForm.get('employeeCertificationScore')?.enable();
      } else {
        this.userForm.get('certificationStartDate')?.disable();
        this.userForm.get('certificationEndDate')?.disable();
        this.userForm.get('employeeCertificationScore')?.disable();
      }
    });
    // Lấy dữ liệu trả về từ trang confirm (nếu có)
    const userData = this.service.getUserData();
    this.userForm.patchValue(userData);
    if (userData) {
      // Kiểm tra nếu "certification" đã được chọn, sau đó thiết lập giá trị cho các trường liên quan
      if (userData.certification) {
        this.userForm.get('certification')?.setValue(userData.certification);
        this.userForm.get('certificationStartDate')?.setValue(userData.certificationStartDate);
        this.userForm.get('certificationEndDate')?.setValue(userData.certificationEndDate);
        this.userForm.get('employeeCertificationScore')?.setValue(userData.employeeCertificationScore);
        this.isCertificationSelected = true;
      } else {
        // Khôi phục trạng thái cho các trường ngày khi không có certification được chọn
        this.isCertificationSelected = false;
        this.userForm.get('certificationStartDate')?.enable();
        this.userForm.get('certificationEndDate')?.enable();
        this.userForm.get('employeeCertificationScore')?.enable();
      }
      userData.birthDate = new Date(userData.birthDate);
      this.userForm.patchValue(userData);
    }
  }
  private initForm() {
    // validate login id
    this.employeeLoginIdControl = new FormControl('', [
      Validators.required,
      Validators.maxLength(50),
      Validators.pattern('^[a-zA-Z_][a-zA-Z0-9_]*$'),
    ]);
    // validate department
    this.departmentNameControl = new FormControl('', [Validators.required]);
    // validate employeeName
    this.employeeNameControl = new FormControl('', [
      Validators.required,
      Validators.maxLength(125),
    ]);
    // validate katakanaName
    this.katakanaNameControl = new FormControl('', [
      Validators.required,
      Validators.maxLength(125),
      this.katakanaValidator(),
    ]);
    // validate birthDate
    this.employeeBirthDateControl = new FormControl('', [
      Validators.required,
      this.birthDateValidator,
    ]);
    // validate email
    this.employeeEmailControl = new FormControl('', [
      Validators.required,
      Validators.maxLength(125),
      Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,3}$/),
    ]);
    // validate phone
    this.employeeTelephoneControl = new FormControl('', [
      Validators.required,
      Validators.pattern('^[0-9]+$'),
      Validators.maxLength(50),
    ]);
    // validate password
    this.employeeLoginPasswordControl = new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      Validators.maxLength(50),
    ]);
    // validate confirm password
    this.employeeLoginRePasswordControl = new FormControl('', [
      Validators.required,
      this.matchPasswordValidator(),
    ]);

    this.certificationControl = new FormControl('');
    // validate certification
    this.certificationStartDateControl = new FormControl(
      { value: '', disabled: true },
      [Validators.required]
    );
    // validate start date
    this.certificationEndDateControl = new FormControl(
      { value: '', disabled: true },
      [Validators.required, this.expirationDateValidator()]
    );
    //validate score
    this.employeeCertificationScoreControl = new FormControl(
      { value: '', disabled: true },
       [Validators.required ,Validators.pattern('^[0-9.]*$')]
    );
    // Khởi tạo FormGroup với các FormControl đã tạo
    this.userForm = new FormGroup({
      employeeLoginId: this.employeeLoginIdControl,
      departmentName: this.departmentNameControl,
      employeeName: this.employeeNameControl,
      employeeNameKana: this.katakanaNameControl,
      employeeBirthDate: this.employeeBirthDateControl,
      employeeEmail: this.employeeEmailControl,
      employeeTelephone: this.employeeTelephoneControl,
      employeeLoginPassword: this.employeeLoginPasswordControl,
      employeeLoginRePassword: this.employeeLoginRePasswordControl,
      certificationName: this.certificationControl,
      certificationStartDate: this.certificationStartDateControl,
      certificationEndDate: this.certificationEndDateControl,
      employeeCertificationScore: this.employeeCertificationScoreControl,
    });
  }
  // validate ------------------------------
  // Xác thực tên katakana
  private katakanaValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const katakanaName = control.value as string;
      const katakanaPattern = /^[\u30A0-\u30FF\uFF66-\uFF9F\s]+$/;
      if (katakanaName && !katakanaPattern.test(katakanaName)) {
        return { invalidKatakana: true };
      }
      return null;
    };
  }
  // Xác thực validate employeeName
  isRequired(controlName: string): boolean {
    const control = this.userForm.get(controlName);
    return (
      control &&
      control.errors &&
      control.errors['required'] &&
      (control.dirty || control.touched)
    );
  }
  // birth date lớn hơn ngày hiện tại
  private birthDateValidator(
    control: AbstractControl
  ): { [key: string]: any } | null {
    const selectedDateValue = new Date(control.value).getTime();
    const currentDateValue = new Date().getTime();
    if (selectedDateValue > currentDateValue) {
      return { invalidBirthDate: true };
    }
    return null;
  }
  // Xác thực re password
  private matchPasswordValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const password = this.employeeLoginPasswordControl.value as string;
      const confirmPassword = control.value as string;
      if (password && password !== confirmPassword) {
        return { passwordMismatch: true };
      }
      return null;
    };
  }
  public checkValidateOnChange(){
    // Kiểm tra xem trường employeeLoginPassword có thay đổi hay không
    // nếu có thì gọi lại validator
    this.employeeLoginPasswordControl.valueChanges.subscribe(() => {
      if (this.employeeLoginPasswordControl.value && this.employeeId) {
        this.employeeLoginRePasswordControl.setValidators([
          Validators.minLength(8),
          Validators.maxLength(50),
          Validators.pattern(/^[a-zA-Z0-9０-９@]*$/),
        ]);
        this.employeeLoginRePasswordControl.setValidators([this.matchPasswordValidator()]);
      }
    });
    // Kiểm tra khi giá trị trường employeeLoginPassword thay đổi
    this.employeeLoginPasswordControl.valueChanges.subscribe(() => {
      this.employeeLoginRePasswordControl.updateValueAndValidity();
    });
  }
  // Xác thực ngày bắt đầu phải bé hơn ngày kết thúc
  private expirationDateValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const certificationDateControl = this.certificationStartDateControl.value as Date;
      const expirationDateControl = control.value as Date;
      if (!expirationDateControl) {
        return { required: true };
      }
      if (certificationDateControl && expirationDateControl <= certificationDateControl) {
        return { invalidExpirationDate: true };
      }
      return null;
    };
  }
  // Lấy danh sách phòng ban
  private getDepartments() {
    this.departmentService.getDepartments().subscribe(
      (data: any) => {
        this.listDepartments = data.departmentsList;
      },
      (error) => {
        console.error('Error fetching departments:', error);
      }
    );
  }
  //Lấy danh sách certification
  private getCertifications() {
    this.certificationService.getCertifications().subscribe(
      (data: any) => {
        this.listCertifications = data.certificationsList;
      },
      (error) => {
        console.error('Error fetching certifications:', error);
      }
    );
  }
  // format date
  formatDate(dateString: string | null): string {
    if (dateString) {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}/${month}/${day}`;
    }
    return '';
  }
  public isFormSubmitted1 = false; // Thêm biến để theo dõi trạng thái form được submit hay chưa
  // phương thức Ok để chuyển dữ liệu sang ADM005
  handleOk() {
    if (this.employeeId) {
      // Kiểm tra xem form đã được submit hay chưa
      this.isFormSubmitted1 = true;
      const password = this.employeeLoginPasswordControl.value as string;
      const confirmPassword = this.employeeLoginRePasswordControl.value as string;
      this.isPasswordConfirmed = password === confirmPassword;
      if (this.userForm.valid && this.isPasswordConfirmed) {
        // Các xử lý khi form hợp lệ 
        const userData = this.userForm.value;
        userData.employeeBirthDate = new Date(userData.employeeBirthDate);
        userData.employeeBirthDate = this.formatDate(userData.employeeBirthDate);
        if(this.certification) {
          userData.certificationStartDate = new Date(userData.certificationStartDate);
          userData.certificationEndDate = new Date(userData.certificationEndDate);
          userData.certificationStartDate = this.formatDate(userData.certificationStartDate);
          userData.certificationEndDate = this.formatDate(userData.certificationEndDate);
        } else {
          userData.certificationStartDate = this.formatDate(userData.certificationStartDate);
          userData.certificationEndDate = this.formatDate(userData.certificationEndDate);
        }
        this.service.setUserData(userData);
        this.router.navigateByUrl('/Confirm', {state: { employeeId: this.employeeId }});
      } else {
        // Đánh dấu các trường là đã chạm để hiển thị thông báo lỗi
        Object.keys(this.userForm.controls).forEach((field) => {
          const control = this.userForm.get(field);
          if (control) {
            control.markAsTouched({ onlySelf: true });
          }
        });
      }
      localStorage.setItem('isCertificationSelected',this.isCertificationSelected.toString());
      this.service.clearUserData;
    } else {
      // Kiểm tra xem form đã được submit hay chưa
      this.isFormSubmitted1 = true;
      const password = this.employeeLoginPasswordControl.value as string;
      const confirmPassword = this.employeeLoginRePasswordControl.value as string;
      this.isPasswordConfirmed = password === confirmPassword;
      if (this.userForm.valid && this.isPasswordConfirmed) {
        // Các xử lý khi form hợp lệ và mật khẩu đã trùng khớp
        const userData = this.userForm.value;
        userData.employeeBirthDate = this.formatDate(userData.employeeBirthDate);
        userData.certificationStartDate = this.formatDate(userData.certificationStartDate);
        userData.certificationEndDate = this.formatDate(userData.certificationEndDate);
        this.service.setUserData(userData);
        this.router.navigateByUrl('/Confirm');
      } else {
        // Đánh dấu các trường là đã chạm để hiển thị thông báo lỗi
        Object.keys(this.userForm.controls).forEach((field) => {
          const control = this.userForm.get(field);
          if (control) {
            control.markAsTouched({ onlySelf: true });
          }
        });
      }
      localStorage.setItem('isCertificationSelected',this.isCertificationSelected.toString());
    }
  }
  // click back
  handleCancel() {
    // trường hợp edit thì về lại ADM003
    if (this.employeeId) {
      this.router.navigate(['/ADM003'], {
        state: { employeeId: this.employeeId },
      });
      this.service.clearUserData();
      this.service.clearErrorData();
    } else {
      // trường hợp add thì về lại ADM002
      this.router.navigate(['/ADM002']);
      this.service.clearUserData();
      this.service.clearErrorData();
    }
  }
  // tương tác giữa các hạng mục của chứng chỉ tiếng Nhật khi edit
  changeCertification(){
    if(this.certification && this.certification.certificationName === this.certificationControl.value){
      this.certificationStartDateControl.setValue(this.certification.certificationStartDate);
      this.certificationEndDateControl.setValue(this.certification.certificationEndDate);
      this.employeeCertificationScoreControl.setValue(this.certification.employeeCertificationScore);
    } else {
      this.certificationStartDateControl.setValue('');
      this.certificationEndDateControl.setValue('');
      this.employeeCertificationScoreControl.setValue('');
    }
  }
}
