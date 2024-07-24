import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { CustomerService } from '../services/customer.service';
import { ModalService } from 'src/app/Common/commonservices/modal.service';
import { ToasterService } from 'src/app/core/services/toaster/toaster.service';
import { common } from 'src/app/Common/common';


@Component({
  selector: 'app-customers-modal',
  templateUrl: './customers-modal.component.html',
  styleUrls: ['./customers-modal.component.scss']
})
export class CustomersModalComponent {
  @Output() formSubmitted = new EventEmitter();
  @Output() formSubmitted2 = new EventEmitter();
  public addCustomerForm!: FormGroup ;
  public editCustomerForm!: FormGroup ;
  @Input() customerData: any;
  imagePreview:any;
  image:any;
  showImage=false;
  submited=false;
  Errorfield='';
  selectedFiles: File[] = [];
  constructor( private formBuilder: FormBuilder , private CustomerService:CustomerService,
                private model:ModalService,private toaster:ToasterService
  ) { 
  }

  ngOnInit(): void {
    
    //Add Customers form
    this.addCustomerForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]],
      email: ['', [Validators.required, Validators.email ,Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]],
      adress: ['', [Validators.required]],
      description: ['', [Validators.required]],
      joining_Date:['',Validators.required],
      image:[],
      uploaded_files: [[]]
    });

    //Edit Customers Form
    this.editCustomerForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]],
      email: ['', [Validators.required, Validators.email ,Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]],
      adress: ['', [Validators.required]],
      description: ['', [Validators.required]],
      projects:['',Validators.required],
      joining_Date:['',Validators.required],
      image:[]
    });

}

ngOnChanges():void{
  if(this.customerData!=undefined){
    this.editCustomerForm.patchValue({
      name: this.customerData.name,
      phone: this.customerData.tel,
      email: this.customerData.email,
      adress: this.customerData.adress,
      description: this.customerData.description,
      projects: this.customerData.numOfProjects,
      joining_Date: this.customerData.joining_Date
    });
    }
    
}


addCustomer() {

  this.submited=true;
  
  
  if(!this.addCustomerForm.valid || this.image==undefined){
    return
  }
  
  let date=this.model.formatDate(this.addCustomerForm.value.joining_Date)
  const formData = new FormData()
  formData.append('name', this.addCustomerForm.value.name)
  formData.append('description', this.addCustomerForm.value.description)
  formData.append('adress', this.addCustomerForm.value.adress)
  formData.append('email', this.addCustomerForm.value.email)
  formData.append('tel', this.addCustomerForm.value.phone)
  formData.append('joining_Date', date)
  formData.append('customer_photo',this.image)
  if(this.selectedFiles.length>0){
  this.selectedFiles.forEach(file => {
    formData.append('uploaded_files', file);
  });
}
  this.CustomerService.addCustomer(formData).subscribe((res)=>{
    this.formSubmitted.emit();
    this.resetForm();
    this.toaster.typeSuccess("Customer added","Success")
    this.model.closeModel('add_client')
  }
  ,(error)=>{
    if(error.error.name){
      this.Errorfield="name"
    }
    if(error.error.email){
      this.Errorfield="email"
    }
    if(error.error.tel){
      this.Errorfield="phone"
    }
    else{
      this.model.closeModel('add_client')
    }
  }
  )


}
onFileSelected(event: any): void {
  const target = event.target as HTMLInputElement;
  const files: FileList = event.target.files;
  for (let i = 0; i < files.length; i++) {
    const file: File = files[i];
    this.selectedFiles.push(file); // Push the File object directly
  }
  
  target.value = '';
}
removeSingleFile(index: number) {
  this.selectedFiles.splice(index, 1);
  
}
editCustomer(){
  this.submited=true;
  if(!this.editCustomerForm.valid){
    return
  }
  const formData = new FormData()
  formData.append('name', this.editCustomerForm.value.name)
  formData.append('description', this.editCustomerForm.value.description)
  formData.append('adress', this.editCustomerForm.value.adress)
  formData.append('email', this.editCustomerForm.value.email)
  formData.append('tel', this.editCustomerForm.value.phone)
  formData.append('joining_Date', this.editCustomerForm.value.joining_Date)
  formData.append('numOfProjects', this.editCustomerForm.value.projects)

  if(this.image!=undefined){
    formData.append('customer_photo',this.image)
  }

  this.CustomerService.editCustomer(this.customerData.id,formData).subscribe((res)=>{
    this.formSubmitted.emit();
    this.resetForm();
    this.toaster.typeSuccess("Customer edited","Success")
    this.model.closeModel('edit_client');
  }
  ,(error)=>{
    if(error.error.name){
      this.Errorfield="name"
    }
    if(error.error.email){
      this.Errorfield="email"
    }
    if(error.error.tel){
      this.Errorfield="phone"
    }
    else{
      this.model.closeModel('edit_client');
    }
  })
}
deleteCustomer() {
    this.CustomerService.deleteCustomer(this.customerData.id).subscribe((res)=>{
      this.formSubmitted.emit();
      this.toaster.typeSuccess("Customer deleted","Success")
      this.model.closeModel('delete_client')
    },
    (error)=>{
      this.model.closeModel('delete_client')
    })
  }


addFiles() {
    if(this.selectedFiles.length>0){
      const formData = new FormData()
      this.selectedFiles.forEach(file => {
        formData.append('file', file);
      });
      this.CustomerService.addCustomerFile(this.customerData?.id,formData).subscribe((res)=>{
        
        this.formSubmitted.emit();
        this.toaster.typeSuccess("File added","Success")
        this.model.closeModel('add_files');
        this.resetForm();
      },(error)=>{
        this.model.closeModel('add_files');
      })
    }
    else{
      this.model.closeModel('add_files');
    }
    
    }
onImageSelected(event: Event) {
  const target = event.target as HTMLInputElement;
  const file: File = (target.files as FileList)[0];
  this.showImage=true;
  this.image=file;
  if(file){
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

}

resetForm() {
  this.addCustomerForm.reset();
  this.image = undefined;
  this.imagePreview = '';
  this.showImage=false;
  this.submited=false;
  this.Errorfield='';
  this.selectedFiles=[];
}
}
