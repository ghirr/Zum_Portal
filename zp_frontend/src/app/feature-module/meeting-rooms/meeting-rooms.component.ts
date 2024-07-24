import { Component, OnInit } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DataService, apiResultFormat, getProvidentFund, routes } from 'src/app/core/core.index';
import {
  FormBuilder,
  FormGroup,
  Validators,
} from "@angular/forms";
import { MeetingRoomService } from './services/meeting-room.service';
import { ModalService } from 'src/app/Common/commonservices/modal.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ToasterService } from 'src/app/core/services/toaster/toaster.service';

@Component({
  selector: 'app-meeting-rooms',
  templateUrl: './meeting-rooms.component.html',
  styleUrls: ['./meeting-rooms.component.scss']
})
export class MeetingRoomsComponent implements OnInit {
  public allMeetingRooms: Array<any> = [];
  public addMeetingRoom!: FormGroup ;
  public editMeetingRoom!: FormGroup ;
  
  errorMessage:any="";
  roomToEdit:any;

  public routes = routes;
  // pagination variables
  public lastIndex = 0;
  public pageSize = 10;
  public totalData = 0;
  public skip = 0;
  public limit: number = this.pageSize;
  public pageIndex = 0;
  public serialNumberArray: Array<number> = [];
  public currentPage = 1;
  public pageNumberArray: Array<number> = [];
  public pageSelection: Array<pageSelection> = [];
  public totalPages = 0;
  //** / pagination variables

  constructor(private meetingRoomService:MeetingRoomService, private formBuilder: FormBuilder,
              private model:ModalService , private toaster:ToasterService
  ) {}

  ngOnInit(): void {
    this.getTableData();

      // Add Provident Form Validation And Getting Values

      this.addMeetingRoom = this.formBuilder.group({
        name: ["", [Validators.required]],
        Absorption_capacity: [10, [Validators.required,Validators.min(5)]],
      });
  
      // Edit Provident Form Validation And Getting Values
  
      this.editMeetingRoom = this.formBuilder.group({
        name: ["", [Validators.required]],
        Absorption_capacity: [10, [Validators.required,Validators.min(5)]],
      });
  }

  private getTableData(): void {
    this.allMeetingRooms = [];
    this.serialNumberArray = [];

    this.meetingRoomService.getMeetingRooms().subscribe((res: any) => {
      this.totalData = res.length;
      res.map((res: any, index: number) => {
        const serialNumber = index + 1;
        if (index >= this.skip && serialNumber <= this.limit) {
          res.MeetingRoomId = serialNumber;
          this.allMeetingRooms.push(res);
          this.serialNumberArray.push(serialNumber);
        }
      });
      this.calculateTotalPages(this.totalData, this.pageSize);
    });

 
  }

  public sortData(sort: Sort) {
    const data = this.allMeetingRooms.slice();

    /* eslint-disable @typescript-eslint/no-explicit-any */
    if (!sort.active || sort.direction === '') {
      this.allMeetingRooms = data;
    } else {
      this.allMeetingRooms = data.sort((a: any, b: any) => {
        const aValue = (a as any)[sort.active];
        const bValue = (b as any)[sort.active];
        return (aValue < bValue ? -1 : 1) * (sort.direction === 'asc' ? 1 : -1);
      });
    }
  }

  public getMoreData(event: string): void {
    if (event === 'next') {
      this.currentPage++;
      this.pageIndex = this.currentPage - 1;
      this.limit += this.pageSize;
      this.skip = this.pageSize * this.pageIndex;
      this.getTableData();
    } else if (event === 'previous') {
      this.currentPage--;
      this.pageIndex = this.currentPage - 1;
      this.limit -= this.pageSize;
      this.skip = this.pageSize * this.pageIndex;
      this.getTableData();
    }
  }

  public moveToPage(pageNumber: number): void {
    this.currentPage = pageNumber;
    this.skip = this.pageSelection[pageNumber - 1].skip;
    this.limit = this.pageSelection[pageNumber - 1].limit;
    if (pageNumber > this.currentPage) {
      this.pageIndex = pageNumber - 1;
    } else if (pageNumber < this.currentPage) {
      this.pageIndex = pageNumber + 1;
    }
    this.getTableData();
  }

  public changePageSize(): void {
    this.pageSelection = [];
    this.limit = this.pageSize;
    this.skip = 0;
    this.currentPage = 1;
    this.getTableData();
  }

  private calculateTotalPages(totalData: number, pageSize: number): void {
    this.pageNumberArray = [];
    this.totalPages = totalData / pageSize;
    if (this.totalPages % 1 !== 0) {
      this.totalPages = Math.trunc(this.totalPages + 1);
    }
    for (let i = 1; i <= this.totalPages; i++) {
      const limit = pageSize * i;
      const skip = limit - pageSize;
      this.pageNumberArray.push(i);
      this.pageSelection.push({ skip: skip, limit: limit });
    }
  }

  resetForm(){
    this.errorMessage=""
    this.addMeetingRoom.patchValue({
      name:"",
      Absorption_capacity:10
    })
  }

  addMeetingRooms(){
    if(this.addMeetingRoom.valid){
    this.meetingRoomService.addMeetingRooms(this.addMeetingRoom.value).subscribe((res)=>{
      this.getTableData();
      this.toaster.typeSuccess("Room Added","Sucess")
      this.model.closeModel("add_mr");
      
    },
  (error:HttpErrorResponse)=>{
    if(error.status==400){
      this.errorMessage="name already exist"
    }
  })
     }
  }

  ngOnChanges(room:any):void{
    this.roomToEdit=room;
    this.editMeetingRoom.patchValue({
      name:room.name,
      Absorption_capacity:room.Absorption_capacity
    })
  }

  editMeetingRooms(){
    if(this.editMeetingRoom.valid){
    this.meetingRoomService.editMeetingRooms(this.editMeetingRoom.value,this.roomToEdit.id).subscribe((res)=>{
      this.getTableData();
      this.toaster.typeSuccess("Room edited","Sucess")
      this.model.closeModel("edit_mr");
      this.resetForm()
    },
  (error)=>{
    if(error.status==400){
      this.errorMessage="name already exist"
    }
  })
     }
  }

  deleteMeetingRoom(){
    this.meetingRoomService.deleteMeetingRooms(this.roomToEdit.id).subscribe((res)=>{
      this.getTableData();
      this.toaster.typeSuccess("Room deleted","Sucess")
      this.model.closeModel('delete_mr');
    },
    (error)=>{
      this.model.closeModel('delete_mr');
    })
  }

}
export interface pageSelection {
  skip: number;
  limit: number;

}