import { Component, OnInit } from '@angular/core';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { TasksService } from '../services/tasks.service';
import { ActivatedRoute } from '@angular/router';
import { ProjectService } from '../services/project.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalService } from 'src/app/Common/commonservices/modal.service';
import { common } from 'src/app/Common/common';
import { ToasterService } from 'src/app/core/services/toaster/toaster.service';
import { AuthService } from '../../authentication/services/auth.service';


@Component({
  selector: 'app-task-board',
  templateUrl: './task-board.component.html',
  styleUrls: ['./task-board.component.scss'],
})
export class TaskBoardComponent implements OnInit {
  public lstCanceled: Array<any> =[] ;
  public lstToDO: Array<any> =[] ;
  public lstCompleted: Array<any> =[];
  public lstInprogress: Array<any> =[] ;
  public lstHold:Array<any> =[];
  public lstReview: Array<any> =[];
  public url = "taskboard";
  public droppedItems: Array<any> = [];

  Project:any;
  scrumMaster:any;
  projectManager:any;
  public lstTeamMembers: Array<any> =[] ;
  addTaskForm!:FormGroup;
  editTaskForm!:FormGroup;
  submitted=false;
  id:any;
  projectProgress:any;
  image=common.profileImage
  permissions:any=[];

  constructor(private tasksService:TasksService,private activatedRoute: ActivatedRoute
              ,private projectService:ProjectService,private formBuilder: FormBuilder,private authService:AuthService,
              private model:ModalService,private toaster:ToasterService){}

  ngOnInit(): void {
    this.permissions=this.authService.getUser().permissions;
    this.addTaskForm=this.formBuilder.group({
      name:['',[Validators.required]],
      description:['',[Validators.required]],
      priority:['Medium',[Validators.required]],
      affectedTo:['',[Validators.required]],
      startdate:[,[Validators.required]],
      enddate:['',[Validators.required]],
      project:'',
      creator:''
    });
    this.editTaskForm=this.formBuilder.group({
      name:['',[Validators.required]],
      description:['',[Validators.required]],
      priority:['',[Validators.required]],
      affectedTo:['',[Validators.required]],
      startdate:[,[Validators.required]],
      enddate:['',[Validators.required]],
      project:'',
      creator:'',
      id:''
    });
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    if(this.id){
      this.getTasks(this.id);
      this.getAllTeam(this.id);
    }
  }

  ngOnchange(task:any):void{
    if(task){
      this.editTaskForm.patchValue({
        id:task.id,
        name:task.name,
        description:task.description,
        priority:task.priority,
        affectedTo:task.affectedTo.id,
        startdate:new Date(task.startdate),
        enddate:new Date(task.enddate),
        creator:task.creator.id
      })
    }
  }
  get f() { return this.addTaskForm.controls; }
  get g() { return this.editTaskForm.controls; }
  //  drap and drop 
  onDrop(event: CdkDragDrop<any[]>,status:any) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      const taskId=event.item.data?.id
      this.tasksService.chnageStatus(taskId,status).subscribe(
        (response) => {
          this.getAllTeam(this.id)
          transferArrayItem(
            event.previousContainer.data,
            event.container.data,
            event.previousIndex,
            event.currentIndex
          );
        },
        (error) => {
          console.error('Error updating task status:', error);
          // Handle error as needed
        }
      );
    }
  }

  getTasks(id:any){
    this.tasksService.getTasksByProjectId(id).subscribe((data)=>{
      this.lstToDO = data.filter((task: { status: string; }) => task.status === "ToDo");
      this.lstInprogress = data.filter((task: { status: string; }) => task.status === "InProgress");
      this.lstReview = data.filter((task: { status: string; }) => task.status === "Review");
      this.lstCompleted = data.filter((task: { status: string; }) => task.status === "Completed");
      this.lstHold = data.filter((task: { status: string; }) => task.status === "OnHold");
      this.lstCanceled = data.filter((task: { status: string; }) => task.status === "Canceled");
    })
  }

  getAllTeam(id:any){
    this.projectService.getAllProjectTeamById(id).subscribe((res)=>{
      this.Project=res.name
      this.projectManager=res.project_manager;
      this.scrumMaster=res.scrum_master;
      this.lstTeamMembers=res.assigned_to;
      this.projectProgress=res.progress;
      this.addTaskForm.patchValue({
        affectedTo:this.lstTeamMembers[0],
        creator:this.projectManager.id,
      })
    })
  }

  resetForm(){
    this.submitted=false;
    this.addTaskForm.patchValue({
      name:'',
      description:'',
      priority:'Medium',
      affectedTo:this.lstTeamMembers[0],
      startdate:'',
      enddate:''
    });
  }
  addTask(){

    this.submitted=true;
    if(this.addTaskForm.invalid){
      return
    }
    this.addTaskForm.value.startdate=this.model.formatDate(this.addTaskForm.value.startdate)
    this.addTaskForm.value.enddate=this.model.formatDate(this.addTaskForm.value.enddate)
    this.addTaskForm.value.project=this.id
    this.tasksService.addTask(this.addTaskForm.value).subscribe((res)=>{
      this.getTasks(this.id);
      this.getAllTeam(this.id);
      this.resetForm();
      this.model.closeModel('add_task_modal')
    },
  (error)=>{
    this.model.closeModel('add_task_modal')
  })
    
  }

  editTask(){

    this.submitted=true;
    if(this.editTaskForm.invalid){
      return
    }
    this.editTaskForm.value.startdate=this.model.formatDate(this.editTaskForm.value.startdate)
    this.editTaskForm.value.enddate=this.model.formatDate(this.editTaskForm.value.enddate)
    this.editTaskForm.value.project=this.id
    
    this.tasksService.editTask(this.editTaskForm.value).subscribe((res)=>{
      this.getTasks(this.id);
      this.resetForm();
      this.toaster.typeSuccess("Task Edited","Success")
      this.model.closeModel('edit_task_modal')
    },
  (error)=>{
    this.model.closeModel('edit_task_modal')
  })
    
  }

  deleteTask(){

    this.tasksService.deleteTask(this.editTaskForm.value.id).subscribe((res)=>{
      this.getTasks(this.id);
      this.getAllTeam(this.id);
      this.resetForm();
      this.toaster.typeSuccess("Task Deleted","Success")
      this.model.closeModel('delete_task')
    },
  (error)=>{
    this.model.closeModel('delete_task')
  })
    
  }

  }





