import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/app/ENVIRONMENTS/environment';
import { AuthService } from '../../authentication/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class MeetingRoomService {
  host = environment.apiUrl
  constructor(private http: HttpClient,private authService:AuthService) { }
  
    getMeetingRooms(){
      return this.http.get<any[]>(`${this.host}/meetingroom/list-meetingroom/`);
    }

    addMeetingRooms(room:any){
      return this.http.post(`${this.host}/meetingroom/add-meetingroom/`,room);
    }

    editMeetingRooms(room:any,roomId:any){
      return this.http.put(`${this.host}/meetingroom/update-meetingroom/`+roomId,room);
    }

    deleteMeetingRooms(roomId:any){
      return this.http.delete(`${this.host}/meetingroom/delete-meetingroom/`+roomId);
    }

    bookMeetingRoom(reservation:FormData){
      reservation.append('creator',this.authService.getUser().id)
      return this.http.post(`${this.host}/meetingroom/book-room/`,reservation);
    }

    getMeetingRoomsRequests(){
      return this.http.get<any[]>(`${this.host}/meetingroom/requests/`+this.authService.getUser().id);
    }

    setStatusRequestApprovels(request:any){
      return this.http.put<any>(`${this.host}/meetingroom/requests/`+this.authService.getUser().id,request)
    }
}
