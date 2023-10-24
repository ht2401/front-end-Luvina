import { Injectable,Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ADM4vsADN5Service {
  // khai báo biến để lưu trữ
  private userData: any;
  private errorData: any;
  constructor(@Inject(PLATFORM_ID) private platformId: any) { }
  /**
   * Lưu dữ liệu người dùng vào local storage .
   * @param data Dữ liệu người dùng cần lưu trữ.
   */
  setUserData(data: any) {
    this.userData = data;
    if (isPlatformBrowser(this.platformId)) {
      sessionStorage.setItem('userData', JSON.stringify(data));
    }
  }
  /**
   * Lấy dữ liệu người dùng từ local storage (session storage).
   * @returns Dữ liệu người dùng hoặc null nếu không tồn tại.
   */
  getUserData() {
    if (isPlatformBrowser(this.platformId)) {
      const storedData = sessionStorage.getItem('userData');
      return storedData ? JSON.parse(storedData) : null;
    }
    return null;
  }
  /**
   * Xoá dữ liệu người dùng khỏi local storage.
   */
  clearUserData(): void {
    sessionStorage.removeItem('userData');
  }
  /**
   * Lưu dữ liệu lỗi vào local storage (local storage).
   * @param errorData Dữ liệu lỗi cần lưu trữ.
   */
  setErrorData(errorData: any) {
    this.errorData = errorData;
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('errorData', JSON.stringify(errorData));
    }
  }
  /**
   * Lấy dữ liệu lỗi từ local storage (local storage).
   * @returns Dữ liệu lỗi hoặc null nếu không tồn tại.
   */
  getErrorData(): any {
    if (isPlatformBrowser(this.platformId)) {
      const storedErrorData = localStorage.getItem('errorData');
      return storedErrorData ? JSON.parse(storedErrorData) : null;
    }
    return null;
  }
  /**
   * Xoá dữ liệu lỗi khỏi local storage.
   */
  clearErrorData(): void {
    localStorage.removeItem('errorData');
  }
}
