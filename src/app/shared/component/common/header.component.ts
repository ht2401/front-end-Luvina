import { Component,OnInit, ElementRef  } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit{
  constructor(
    private router: Router,
    private elementRef: ElementRef
  ) { }

  ngOnInit(): void {
    this.router.events.subscribe(() => {
      this.scrollToTop();
    });
  }  

  logout() {
    sessionStorage.removeItem('access_token');
    localStorage.removeItem('username');
    this.router.navigate(['login']);
    return false;
  }
  scrollToTop() {
    this.elementRef.nativeElement.ownerDocument.documentElement.scrollTop = 0;
  }
}