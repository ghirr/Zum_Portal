import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/app/ENVIRONMENTS/environment';
import { AuthService } from 'src/app/feature-module/authentication/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class EventsService {

  host = environment.apiUrl
  constructor(private http: HttpClient,private authService:AuthService) { }

  
  getEvents(){
    return this.http.get<any[]>(`${this.host}/events/`);
  }

  addEvent(event:FormData){
    event.append('user',this.authService.getUser().id)
    return this.http.post(`${this.host}/events/`,event)
  }

  dragAndDropEvent(event:any){
    return this.http.put(`${this.host}/events/`+event.id,event)
  }

  editEventDetails(event:any){
    return this.http.put(`${this.host}/events/details/`+event.id,event)
  }

  delete(event:any){
    return this.http.delete(`${this.host}/events/`+event.id)
  }
}
