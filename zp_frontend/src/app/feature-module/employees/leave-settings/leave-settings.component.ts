import { Component, OnInit } from '@angular/core';
import { routes } from 'src/app/core/helpers/routes/routes';
import { LeaveService } from '../services/leave.service';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToasterService } from 'src/app/core/services/toaster/toaster.service';


@Component({
  selector: 'app-leave-settings',
  templateUrl: './leave-settings.component.html',
  styleUrls: ['./leave-settings.component.scss'],
})
export class LeaveSettingsComponent implements OnInit {
  leaves: any[] = [];
  editable: boolean[] = [];
  isEditing: boolean[] = [];

  editLeaveType!: FormGroup;

  constructor(
    private leaveService: LeaveService,
    private formBuilder: FormBuilder,
    private toaster: ToasterService
  ) {}

  ngOnInit() {
    this.getAllLeaves();
  }

  public routes = routes;


  createLeaveFormGroup(leave: any, isEditable: boolean): FormGroup {
    return this.formBuilder.group({
      id: [leave.id],
      minDays: [{ value: leave.minDays, disabled: !isEditable }, [Validators.required, Validators.min(1),Validators.max(30), Validators.pattern("^[0-9]*$")]],
      maxDays: [{ value: leave.maxDays, disabled: !isEditable }, [Validators.required, Validators.min(1),Validators.max(30), Validators.pattern("^[0-9]*$")]]
    });
  }
  
  

  get leaveForms(): FormArray {
    return this.editLeaveType?.get('leaves') as FormArray;
  }

  toFormGroup(control: AbstractControl): FormGroup {
    return control as FormGroup;
  }
  toggleEdit(index: number) {
    if (this.isEditing[index]) {
      this.cancelEdit(index);
    } else {
      this.enableEdit(index);
    }
  }
  
  enableEdit(index: number) {
    if (this.leaveForms) {
      this.isEditing[index] = true;
      this.editable[index] = true;
      const leaveFormGroup = this.leaveForms.at(index) as FormGroup;
      leaveFormGroup.get('minDays')?.enable();
      leaveFormGroup.get('maxDays')?.enable();
    }
  }
  
  cancelEdit(index: number) {
    if (this.leaveForms) {
      this.isEditing[index] = false;
      this.editable[index] = false;
      const leaveFormGroup = this.leaveForms.at(index) as FormGroup;
      leaveFormGroup.get('minDays')?.disable();
      leaveFormGroup.get('maxDays')?.disable();
    }
  }
  

  saveChanges(leave: any) {
    if (this.editLeaveType) {
      for (let i = 0; i < this.leaveForms.length; i++) {
        const leaveForm = this.leaveForms.at(i);
        if (leaveForm.value.id === leave.id) {
          if (leaveForm.valid) {
            this.leaveService.editLeaveType(leaveForm.value).subscribe(
              (res) => {
                this.toaster.typeSuccess('Leave Type Edited', 'Success');
                this.getAllLeaves();
              }
            );
          }
          break; // Break the loop once we find the correct form
        }
      }
    }
  }
  

  getAllLeaves() {
    this.leaveService.getLeavesTypes().subscribe((res: any) => {
      this.leaves = res;
      this.editable = new Array(this.leaves.length).fill(false);
      this.isEditing = new Array(this.leaves.length).fill(false);
      this.editLeaveType = this.formBuilder.group({
        leaves: this.formBuilder.array(this.leaves.map((leave: any,index:number) => this.createLeaveFormGroup(leave,this.editable[index])))
      });
    });
  }
}