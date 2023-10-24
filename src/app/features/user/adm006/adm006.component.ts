import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-adm006',
  templateUrl: './adm006.component.html',
  styleUrls: ['./adm006.component.css']
})
export class ADM006Component {
  // Biến để lưu thông báo từ trang trước đó (ADM003 hoặc ADM005)
  notificationMessage: string = '';
  constructor(private router: Router, private route: ActivatedRoute) { }
  ngOnInit() {
    this.notificationMessage = localStorage.getItem('notificationMessage') || '';
  localStorage.removeItem('notificationMessage');
  }
  // về trang ADM002 khi người dùng click nút "OK"
  goToADM002() {
    this.router.navigate(['/ADM002']);
  }
}
