import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { routes } from 'src/app/core/core.index';
import { CustomerService } from '../services/customer.service';
import { environment } from 'src/app/ENVIRONMENTS/environment';
import { common } from 'src/app/Common/common';
import { ToasterService } from 'src/app/core/services/toaster/toaster.service';
import { ModalService } from 'src/app/Common/commonservices/modal.service';
import { ProjectService } from '../../projects/services/project.service';
import { AuthService } from '../../authentication/services/auth.service';

@Component({
  selector: 'app-customer-details',
  templateUrl: './customer-details.component.html',
  styleUrls: ['./customer-details.component.scss']
})
export class CustomerDetailsComponent {

  id:any;
  customer:any;
  projects:any=[];
  files:any=[];
  imageBase=environment.apiUrl;
  public routes = routes;
  isClassAdded = false;
  isHiddenTask = false;

  file:any;

  isTaskCompleted: boolean[] = [false];
  hoveredImage = '/assets/img/edit.png';
  currentImage = '';
  image=common.profileImage;
  permissions:any=[];
  constructor(private AR:ActivatedRoute,private toaster: ToasterService,private model:ModalService,
              private customerService:CustomerService,private projectService:ProjectService,private authService:AuthService){}

  ngOnInit(){
    this.id = this.AR.snapshot.paramMap.get("id")
    this.getCustomer();
    this.getCustomerProject(this.id)
    this.getCustomerFiles(this.id)
    this.permissions=this.authService.getUser().permissions;
  }

  getCustomer(){
    this.customerService.getCustomerById(this.id).subscribe((res)=>{
      this.customer=res;
      
      this.currentImage =this.customer?.customer_photo
      
    })
  }

  getCustomerProject(id:any){
    this.projectService.getProjectsByCustomer(id).subscribe(
      (res)=>{
      this.projects=res
    })
  }
  
  getCustomerFiles(id:any){
    this.customerService.getCustomerFile(id).subscribe((res)=>{
      this.files=res;
      
    })
  }
  
  handleFormSubmission() {
    this.getCustomer();
    this.getCustomerFiles(this.id)
  }
  onHover() {
    this.currentImage = this.hoveredImage;
  }

  onLeave() {
    this.currentImage = this.customer?.customer_photo;
  }
  toggleTaskCompleted(index: number) {
    this.isTaskCompleted[index] = !this.isTaskCompleted[index];
  }

  public isHidden: boolean[] = [false];
  toggleVisibility(index: number) {
    this.isHidden[index] = !this.isHidden[index];
  }
  addClass(){
    this.isClassAdded =!this.isClassAdded
  }
  taskDelete(){
    this.isHiddenTask = !this.isHiddenTask;
  }

  getFileIcon(fileUrl: string): string {
    const extension = this.getFileExtension(fileUrl);
    switch (extension) {
      case 'pdf':
        return 'fa-regular fa-file-pdf';
      case 'doc':
      case 'docx':
        return 'fa-regular fa-file-word';
      case 'xls':
      case 'xlsx':
        return 'fa-regular fa-file-excel';
      case 'ppt':
      case 'pptx':
        return 'fa-regular fa-file-powerpoint';
      case 'png':
      case 'jpg':
      case 'jpeg':
        return 'fa-regular fa-file-image';
      default:
        return 'fa-regular fa-file'; // Default icon
    }
  }

  getFileExtension(fileUrl: string): string {
    const parts = fileUrl.split('.');
    return parts[parts.length - 1].toLowerCase();
  }

  getFileName(fileUrl: string): string {
    const parts = fileUrl.split('/');
    return parts[parts.length - 1];
  }

  passFile(file:any){
    this.file=file;
  }
  deleteFile(){
    this.customerService.deleteCustomerFile(this.file.id).subscribe((res)=>{
      this.getCustomerFiles(this.id)
      this.toaster.typeSuccess("File deleted","Success")
      this.model.closeModel('delete_file')
    },
    (error)=>{
     this.model.closeModel('delete_file')
    })
  }

  downloadFile(file: any): void {
    this.customerService.downloadFile(file).subscribe(
        (data: Blob) => {
            // Create a blob URL for the file data
            const blob = new Blob([data], { type: data.type });
            const url = window.URL.createObjectURL(blob);

            // Create a temporary link element to trigger the download
            const link = document.createElement('a');
            link.href = url;
            link.download = this.getFileName(file); // Set the download attribute to the file name
            link.click();

            // Cleanup: remove the blob URL and the link element
            window.URL.revokeObjectURL(url);
            link.remove();
        }
    );
}


}
