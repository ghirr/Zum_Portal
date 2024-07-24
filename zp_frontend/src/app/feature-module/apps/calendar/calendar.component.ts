
import { Component, ChangeDetectorRef, OnInit, ViewChild } from '@angular/core';
import { CalendarOptions, DateSelectArg, EventClickArg, EventApi, EventInput  } from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction';
import rrulePlugin from '@fullcalendar/rrule';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
// import { INITIAL_EVENTS, createEventId } from './event-utils';
import { routes } from 'src/app/core/helpers/routes/routes';
import { EventsService } from './services/events.service';
import { ModalService } from 'src/app/Common/commonservices/modal.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { ToasterService } from 'src/app/core/services/toaster/toaster.service';
import { common } from 'src/app/Common/common';
import { AuthService } from '../../authentication/services/auth.service';
import { RRule } from 'rrule';
import { MeetingRoomService } from '../../meeting-rooms/services/meeting-room.service';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {
  public routes = routes;
  country = 'India';
  image=common.profileImage
  calendarVisible = true;
  calendarOptions: CalendarOptions = {
    plugins: [
      interactionPlugin,
      dayGridPlugin,
      timeGridPlugin,
      listPlugin,
      rrulePlugin
    ],
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
    },
    
    initialView: 'dayGridMonth',
    // initialEvents: INITIAL_EVENTS, // alternatively, use the `events` setting to fetch from a feed
    weekends: true,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    
    eventClick: this.handleEventClick.bind(this),
    eventDrop: this.handleEventDrop.bind(this),
    eventResize: this.handleEventResize.bind(this),
    eventsSet: this.handleEvents.bind(this),
    /* you can update a remote database when these fire:
    eventAdd:
    eventChange:
    eventRemove:
    */
  };

  showTimePicker: Array<string> = [];
  zones: Date = new Date();
  setTime: Date = new Date();
  currentEvents: EventApi[] = [];
  eventForm!:FormGroup;
  editEventForm!:FormGroup;
  meetingRoomForm!:FormGroup;
  meetingRooms:any=[];

  invalidDates:any=false;
  invalidHours:any=false;
  isBokkingSubmited=false;
  isEventSubmited=false;
  today=new Date()
  permissions:any=[];
  constructor(private changeDetector: ChangeDetectorRef,private eventService:EventsService,private toaster:ToasterService
             ,public model:ModalService , private formBuilder:FormBuilder,private datePipe: DatePipe,
              private authService:AuthService,private meetingRoomsService:MeetingRoomService) {
  }
  get f() { return this.eventForm.controls}
  get z() { return this.editEventForm.controls}
  get g() { return this.meetingRoomForm.controls}
  ngOnInit(): void {
    this.eventForm=this.formBuilder.group({
      title:['',[Validators.required]],
      description:['',[Validators.required]],
      start_day:['',[Validators.required]],
      end_day:['',[Validators.required]],
    })

    this.editEventForm=this.formBuilder.group({
      id:['',[Validators.required]],
      title:['',[Validators.required]],
      description:['',[Validators.required]]
    })

    this.meetingRoomForm=this.formBuilder.group({
      room:['',[Validators.required]],
      date:['',[Validators.required]],
      purpose:['',[Validators.required]],
    })
    this.getEvents();
    this.getRooms();
    this.permissions=this.authService.getUser().permissions;
  }

  ngOnChange(event:any){
    this.editEventForm.patchValue({
      id:event.id,
      title:event.title,
      description:event.extendedProps.description
    })
  }
  handleCalendarToggle() {
    this.calendarVisible = !this.calendarVisible;
  }

  handleWeekendsToggle() {
    const { calendarOptions } = this;
    calendarOptions.weekends = !calendarOptions.weekends;
  }


  handleEventClick(clickInfo: EventClickArg) {
    if(this.canEditEvent(clickInfo)){
    this.ngOnChange(clickInfo.event)
    this.model.openModel('event-modal')
    }
    else{
        this.toaster.typeInfo('You do not have permission to edit this event', 'Error');
      }
  }

  handleEventDrop(eventDropInfo: any) {
    
    if(this.canEditEvent(eventDropInfo)){
    const updatedEvent = {
      id: eventDropInfo.event.id,
      start: this.model.formatDate(eventDropInfo.event.start),
      end:this.model.formatDate( eventDropInfo.event.end),
      start_hour:this.formatTimeSubmit(eventDropInfo.event.start),
      end_hour:this.formatTimeSubmit(eventDropInfo.event.end)
    };
     this.eventService.dragAndDropEvent(updatedEvent).subscribe();
  }
  else{
      eventDropInfo.revert();
      this.toaster.typeInfo('You do not have permission to edit this event', 'Error');
    }
  }


  handleEventResize(eventResizeInfo: any) {
    if(this.canEditEvent(eventResizeInfo)){
    const updatedEvent = {
      id: eventResizeInfo.event.id,
      start: this.model.formatDate(eventResizeInfo.event.start),
      end: this.model.formatDate(eventResizeInfo.event.end),
      start_hour:this.formatTimeSubmit(eventResizeInfo.event.start),
      end_hour:this.formatTimeSubmit(eventResizeInfo.event.end)
    };
    this.eventService.dragAndDropEvent(updatedEvent).subscribe();

  }
  else{
    eventResizeInfo.revert();
      this.toaster.typeInfo('You do not have permission to edit this event', 'Info');
    }
  }

  handleEvents(events: EventApi[]) {
    this.currentEvents = events;
    this.changeDetector.detectChanges();
  }

  toggleTimePcker(value: string): void {
    if (this.showTimePicker[0] !== value) {
      this.showTimePicker[0] = value;
    } else {
      this.showTimePicker = [];
    }
  }
  formatTime(date: any): any {
    const selectedDate: Date = new Date(date);
    return this.datePipe.transform(selectedDate, 'h:mm a');
  }
  formatTimeSubmit(date: any): any {
    const selectedDate: Date = new Date(date);
    return this.datePipe.transform(selectedDate, 'HH:mm:00');
  }

  getEvents(){
    this.eventService.getEvents().subscribe((events:EventInput[]) => {
      this.calendarOptions.events = events.map((event: any) => ({
        id:event.id,
        title: event.title,
        start: event.start,
        end: event.end,
        description: event.description,
        user: event.user,
        rrule: event.recur?{ freq: RRule.YEARLY,dtstart:event.start }:undefined,
        editable:event.editable==false?false:true,
        extendedProps: {
          editable:event.editable==false?false:true,
      }
      }));
      
    })}

  addEvent(){
    this.isEventSubmited=true;

    if(this.eventForm.value.start_day>this.eventForm.value.end_day){
      this.invalidDates=true
      return
    }
    if(this.zones>this.setTime){
      this.invalidHours=true
      return
    }
    if(this.eventForm.valid){
      let start_day=this.model.formatDate(this.eventForm.value.start_day)
      let end_day=this.model.formatDate(this.eventForm.value.end_day)
      const formData = new FormData()
      formData.append('start_day', start_day)
      formData.append('end_day', end_day)
      formData.append('title', this.eventForm.value.title)
      formData.append('description', this.eventForm.value.description)
      if(start_day==end_day){
        formData.append('start_hour', this.formatTimeSubmit(this.zones))
        formData.append('end_hour', this.formatTimeSubmit(this.setTime))
      }

      this.eventService.addEvent(formData).subscribe((res)=>{
        this.getEvents();
        this.toaster.typeSuccess("Event added","Success")
        this.model.closeModel('add_event');
        this.resetForm()
      },
    (error)=>{
      this.model.closeModel('add_event');
      this.resetForm()
    })
    }
    
  }
  deleteEvent(){
    this.eventService.delete(this.editEventForm.value).subscribe((res)=>{
      this.getEvents();
      this.changeDetector.detectChanges();
      this.toaster.typeSuccess("Event deleted","Success")
      this.model.closeModel('delete_event')
    },
  (error)=>{
      this.model.closeModel('delete_event')
  })
  }

  editEvent(){
    this.isEventSubmited=true;
    if (this.editEventForm.valid){
      this.eventService.editEventDetails(this.editEventForm.value).subscribe((res)=>{
        this.getEvents();
        this.toaster.typeSuccess("Event edited","Success")
        this.isEventSubmited=false;
        this.model.closeModel('edit_event');
      },
    (error)=>{
      this.model.closeModel('edit_event');
    })
    }
  }

   canEditEvent(event: any): boolean {
    return ((event.event.extendedProps.user?.id === this.authService.getUser().id &&
    event.event.extendedProps.editable !== false))
  }

  //            Meeting Rooms            //
  getRooms(){
    this.meetingRoomsService.getMeetingRooms().subscribe((res)=>{
      this.meetingRooms=res;
      this.meetingRoomForm.patchValue({
        room:res[0].id
      })
    })
  }
  bookMeetingRoom(){
    this.isBokkingSubmited=true;
    if(this.zones>this.setTime){
      this.invalidHours=true
      return
    }
    if(this.meetingRoomForm.valid){

      let date=this.model.formatDate(this.meetingRoomForm.value.date)
      const formData = new FormData()
      formData.append('date', date)
      formData.append('room', this.meetingRoomForm.value.room)
      formData.append('purpose', this.meetingRoomForm.value.purpose)
      formData.append('reservation_start', this.formatTimeSubmit(this.zones))
      formData.append('reservation_end', this.formatTimeSubmit(this.setTime))
      
      this.meetingRoomsService.bookMeetingRoom(formData).subscribe((res)=>{
        this.toaster.typeSuccess("Booking with success wait for aprove","Sucess")
        this.model.closeModel('book')
        this.resetForm()
      },
    (error)=>{
      this.model.closeModel('book')
      this.resetForm()
    })

    }
  }

  resetForm(){
    this.isBokkingSubmited=false;
    this.isEventSubmited=false;
    this.invalidDates=false;
    this.invalidHours=false;

    this.eventForm.patchValue({
      title:'',
      description:'',
      start_day:'',
      end_day:'',
    })

    this.meetingRoomForm.patchValue({
      room:this.meetingRooms[0].id,
      date:'',
      purpose:''
    })
  }
}
