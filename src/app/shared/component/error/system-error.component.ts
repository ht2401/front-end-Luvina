import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-system-error',
  templateUrl: './system-error.component.html',
})
export class SystemErrorComponent {

  // Biến để lưu thông báo từ trang trước đó (ADM003 hoặc ADM005)
  errorMessage: string = '';
  constructor(private router: Router, private route: ActivatedRoute) { }
  ngOnInit() {
    this.errorMessage = localStorage.getItem('errorMessage') || '';
  localStorage.removeItem('errorMessage');
  }
  // về trang ADM002 khi người dùng click nút "OK"
  goToADM002() {
    this.router.navigate(['/ADM002']);
  }
}
