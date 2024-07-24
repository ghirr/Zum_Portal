import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { UserService } from '../../services/user.service';
import { ActivatedRoute } from '@angular/router';
import { ToasterService } from 'src/app/core/services/toaster/toaster.service';
import { noSpacesValidator } from 'src/app/feature-module/authentication/helpers/no-space-validator';
import { ModalService } from 'src/app/Common/commonservices/modal.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-employee-modal',
  templateUrl: './employee-modal.component.html',
  styleUrls: ['./employee-modal.component.scss']
})
export class EmployeeModalComponent implements OnInit {
  public addEmployeeForm!: FormGroup ;
  public editEmployeeForm!: FormGroup;
  users: any[] = [];
  public generatedEmail: string = ''; 
  public generatedEmailDomain: string = '@zum-it.com';
  public generatedEmailPrefix: string = '';
  roles!: { name: string; value: string; }[];
  @Input() userData: any;
  @Input() selectedUser: any;
  @Input() id: any;
  @Output() formSubmitted = new EventEmitter();
  submitted = false;
  showSuccessAlert: boolean = false;
  showErrorAlert: boolean = false;
  errorMessage: string = '';
  selectedRole:String='';
  permissions:any=[];
  Permissions:Array<string>=[];
  permissionsM:string[][] = [['Read','view'], ['Write','change'], ['Create','add'], ['Delete','delete'], ['Import','import'], ['Export','export']];
  constructor(private formBuilder: FormBuilder, private service: UserService
            , private toaster: ToasterService, private model:ModalService) {
  
   }

   
  get f(){return this.addEmployeeForm.controls;}

  ngOnInit(): void {
    this.addEmployeeForm = this.formBuilder.group({
      firstname: ["", [Validators.required]], 
      lastname: ["", [Validators.required]],
      role: ["", [Validators.required]],
      email: ["", [Validators.required]],
  });
    this.addEmployeeForm.patchValue({email:this.generatedEmailDomain})

    this.editEmployeeForm = this.formBuilder.group({
      firstname: ["", Validators.required],
      lastname: ["", Validators.required],
      role: ["", Validators.required],
      email: ["", [Validators.required, Validators.email]],
    });

    this.service.getAllRoles().subscribe(data => {
      this.roles = data.map((role: any[]) => ({ name: role[0], value: role[1] }));
      this.addEmployeeForm.patchValue({role: this.roles[1].name})
    });
    // Subscribe to value changes of first name and last name to generate email
    this.addEmployeeForm.get('firstname')?.valueChanges.subscribe(() => this.generateEmail());
    this.addEmployeeForm.get('lastname')?.valueChanges.subscribe(() => this.generateEmail());

  }
  ngOnChanges(): void {
  if(this.userData){
    this.editEmployeeForm.patchValue({
      firstname: this.userData.firstname,
      lastname: this.userData.lastname,
      role: this.userData.role,
      email: this.userData.email
    });
}
  }
 

  addNewUser() {
    this.submitted = true;
    if (this.addEmployeeForm.valid) {
      this.service.addUser(this.addEmployeeForm.value).subscribe({
        next: (res) => {
          this.formSubmitted.emit();
          this.toaster.typeSuccess("Employee added","Success")
          this.model.closeModel('add_employee');
          this.resetForm();

        },
        error: (error:HttpErrorResponse) => {
          if (error && error.error && error.error.email) {
            this.errorMessage ='user with this email already exists.';
            this.showErrorAlert = true;
            setTimeout(() => {
              this.showErrorAlert = false;
            }, 7000);
          } else {
            this.model.closeModel('add_employee');
            this.resetForm();
          }
        }
      });
    } 
  }
  resetForm(){
    this.addEmployeeForm.patchValue({firstname:"",lastname:""})
    this.submitted=false
    this.Permissions=[];
  }
  handleAddUserError(error: any) {
    if (error && error.error && error.error.email) {
      this.errorMessage = error.error.email[0]; 
      this.showErrorAlert = true;
    }
  }
  
  deleteUser() {
    this.service.deleteUser(this.userData.id).subscribe(
      (res) => {
        this.formSubmitted.emit();
        this.toaster.typeSuccess("Employee deleted","Succcess")
        this.model.closeModel('delete_employee');
      },
      (error) => {
        this.model.closeModel('delete_employee');
      }
    );
  }
  generateEmail(): void {
    const firstName = this.addEmployeeForm.get('firstname')?.value.trim().replace(/ /g,'_');
    const lastName = this.addEmployeeForm.get('lastname')?.value.trim().replace(/ /g,'_');
    this.generatedEmailPrefix = `${firstName}.${lastName}`;
    this.addEmployeeForm.patchValue({ email: this.generatedEmailPrefix+this.generatedEmailDomain });
  }
  editUser(): void {
    if (this.editEmployeeForm.valid) {
        const editedUserData = this.editEmployeeForm.value;
        this.service.updateUser(this.userData.id, editedUserData).subscribe((res) => {
            this.formSubmitted.emit();
            this.toaster.typeSuccess("Employee edited","Success")
            this.model.closeModel('edit_employee');
        },
      (error)=>{
        this.model.closeModel('edit_employee');

      });
    } 
  }

}
  
