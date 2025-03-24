import { inject, Injectable, signal } from '@angular/core';
import { environment } from '@environment/environment';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';
import { Router } from '@angular/router';

export interface UserInfo {
  id: number;
  email: string;
  token: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly apiUrl = environment.API_URL;
  private readonly httpClient = inject(HttpClient);
  readonly router = inject(Router);

  userInfo = signal<UserInfo | null>(null);

  constructor() {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      this.userInfo.set(JSON.parse(userInfo));
    }
  }

  validateEmail(email: string) {
    return this.httpClient.post(`${this.apiUrl}/login`, { email }).pipe(
      tap((res: any) => {
        if (res.data?.token) {
          this.storeUserInfo(res.data);
        }
      }),
    );
  }

  registerEmail(email: string) {
    return this.httpClient.post(`${this.apiUrl}/register`, { email }).pipe(
      tap((res: any) => {
        if (res.data?.token) {
          this.storeUserInfo(res.data);
        }
      }),
    );
  }

  logout() {
    localStorage.removeItem('userInfo');
    this.userInfo.set(null);
    this.router.navigate(['/']);
  }

  private storeUserInfo(userInfo: UserInfo) {
    localStorage.setItem('userInfo', JSON.stringify(userInfo));
    this.userInfo.set(userInfo);
  }
}
