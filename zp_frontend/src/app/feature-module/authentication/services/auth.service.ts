import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/app/ENVIRONMENTS/environment';
import {encryptStorage} from '../../../Common/encryptStorage'
import { Router } from '@angular/router';
import { routes } from 'src/app/core/core.index';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public host = environment.apiUrl+'/auth/';
  private token: any =null;
  private refershtoken: any =null;
  private loggedInUsername: any ='';
    

  constructor(private http: HttpClient,private route:Router) { }

  public login(user: any): Observable<HttpResponse<any>> {
    
    return this.http.post<any>(`${this.host}login/`, user, { observe: 'response' });
  }



  public loadToken() {
      return encryptStorage.getItem('token');
    }


  public getToken(): string {
    return this.token;
  }



  public saveToken(token: string): void {
      this.token = token;
      encryptStorage.setItem('token', token);

    }

    public loadRefreshToken() {
      return encryptStorage.getItem('refershtoken');
    }

  public addUserToLocalCache(user: any): void {
    encryptStorage.setItem('user', JSON.stringify(user));
  }

  public getUser() {
   return encryptStorage.getItem<any>('user')||'';
  }

  public getConnectedUser(){
    const user = encryptStorage.getItem<any>('user') || '';
    return of(user);
  }

  

  public isLoggedIn() {
    let token=this.loadToken()
    
    if (token !== undefined) {
      return true;
    } else {
      return false;
    }
    
    }
/**
 * Logout the user
 */
logout() {
    this.token = null;
    this.loggedInUsername = null;
    encryptStorage.removeItem('user');
    encryptStorage.removeItem('token');
    encryptStorage.removeItem('logintime');
    this.route.navigateByUrl('/authentication/login')
}

  resetPassword(email: string): Observable<any> {
   return this.http.post(`${this.host}resetpassword/`, email);
  }

  updatePassword(id:number,password: string):Observable <any>{
    return this.http.put(`${this.host}updateUserPassword/${id}` ,{'password':password});
    }
}
