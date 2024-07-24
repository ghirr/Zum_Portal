import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable, map, tap } from 'rxjs';
import { routes } from 'src/app/core/helpers/routes/routes';
import { ProjectService } from '../services/project.service';
import { Validators } from 'ngx-editor';
import { ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
import { common } from 'src/app/Common/common';
import { ModalService } from 'src/app/Common/commonservices/modal.service';
import { CustomerService } from '../../customer/services/customer.service';
import { ToasterService } from 'src/app/core/services/toaster/toaster.service';
import { UserService } from '../../employees/services/user.service';
import { AuthService } from '../../authentication/services/auth.service';


@Component({
  selector: 'app-project-view',
  templateUrl: './project-view.component.html',
  styleUrls: ['./project-view.component.scss'],
})
export class ProjectViewComponent {

  editProjectForm!: FormGroup;
  submitted = false;

  selectedTeamMembers: any[] = [];
  image=common.profileImage

  id: any;
  @Input() projectData: any;
  @Output() formSubmitted = new EventEmitter();

  selectedFiles: File[] = [];
  fileToDelete:any;

  projectManagers: any[] = [];
  projectTeamMembers: any[] = [];

  scrumMasters: any[] = [];
  
  searchMember: any;
  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>();
  public routes = routes;
  public isHidden: boolean[] = [false];
  
  permissions:any=[];

  constructor(private toaster: ToasterService, private formBuilder: FormBuilder, 
              private projectService: ProjectService, private activatedRoute: ActivatedRoute, 
              private authService:AuthService, public service: UserService,
              private model:ModalService,private customerService:CustomerService
  ) { }

  
  get f() { return this.editProjectForm.controls; }
  
  handleFormSubmission(){
    this.getProjectById()
  }
  ngOnInit(): void {
    this.permissions=this.authService.getUser().permissions;
    // Edit Projects Form
    this.editProjectForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      manager: ['', Validators.required],
      customer: ['', Validators.required],
      assigned_to: [[], Validators.required],
      starter_at: ['', Validators.required],
      end_date: ['', [Validators.required]],
      abbreviation: ['', Validators.required],
      uploaded_files: [[]]
    });

    // Extract the id from the route parameters
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    // Check if id is not null or undefined
    if (id) {
      this.id = id;
      // Call getProjectById to fetch project data
      this.getProjectById();
    } else {
      console.error('No project id found in route parameters');
    }
    this.getPC();
    this.getTM('').subscribe((members: any[]) => {
      // Initialize the MatTableDataSource with the full list of members
      this.dataSource = new MatTableDataSource<any>(members);
    });
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

  searchUsers(): void {
    // Call getTM() with the search term
    this.getTM(this.searchMember).subscribe((members: any[]) => {
      // Update the MatTableDataSource with the filtered list of members
      this.dataSource.data = members;
    });
  }
  

  removeSingleFile(index: number) {
    this.selectedFiles.splice(index, 1);
  }

  getPC(){
   this.service.getUserByRole().subscribe((data)=>{
        this.projectManagers = data.filter((user: { role: string; }) => user.role === "Project Manager");
        this.scrumMasters = data.filter((user: { role: string; }) => user.role === "Scrum Master");
        this.projectTeamMembers = data.filter((user: { role: string; }) => user.role === "Simple User");
      });
  }
  assignNewManager(newManagerId: any) {
    const projectId = this.id;
    this.projectService.updateProjectManager(projectId, newManagerId).subscribe(
       (response) => {
        this.getProjectById();
        this.toaster.typeSuccess("Project Manager Updated","Success")
        this.model.closeModel('assign_user');
      },
      (error) => {
        this.model.closeModel('assign_user');
      }
    );
  }
  assignNewScrum(newManagerId: any) {
    const projectId = this.id;
    this.projectService.updateScrumMaster(projectId, newManagerId).subscribe({
      next: (response) => {
        this.toaster.typeSuccess("Scrum Master Updated","Success")
        this.model.closeModel('assign_scrum');
        this.getProjectById();
      },
      error: (error) => {
        this.model.closeModel('assign_scrum');
      }
    });
  }
  onMemberSelected(memberId: number, event: any) {
    if (event.target.checked) {
      this.selectedTeamMembers.push(memberId);
    } else {
      const index = this.selectedTeamMembers.indexOf(memberId);
      if (index !== -1) {
        this.selectedTeamMembers.splice(index, 1);
      }
    }
  }

  assignTeamMembers() {
    const projectId = this.id;
    this.projectService.updateProjectTeam(projectId, this.selectedTeamMembers)
      .subscribe(
        (response) => {
          this.getProjectById();
          this.toaster.typeSuccess("Team Updated","Success")
          this.model.closeModel('assign_Teams');
        },
        (error) => {
          this.model.closeModel('assign_Teams');
        }
      );
  }

  deleteProjectMember(projectId: number, memberId: number): void {
  
      this.projectService.deleteProjectMember(projectId, memberId).subscribe(
          (response) => {
            this.toaster.typeSuccess("Member Deleted","Success")
            this.getProjectById();
          }
      );
  }


getTM(searchTerm: string): Observable<any[]> {
  // Fetch all users with role 'TM' from the service
  return this.service.getUserByRole().pipe(
    map((data: any) => data.filter((user: { role: string; }) =>  user.role === 'Simple User')),
    map((filteredMembers: any[]) => {
      // Filter the results based on the search term
      return filteredMembers.filter(member => 
        member.firstname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.lastname.toLowerCase().includes(searchTerm.toLowerCase())
      );
    })
  );
}


  addFiles(): void {
    if (this.selectedFiles.length > 0) {
      const formData = new FormData();
      for (let index = 0; index < this.selectedFiles.length; index++) {
        
        formData.append('file', this.selectedFiles[index], this.selectedFiles[index].name);
        
      }

      this.projectService.uploadFile(this.projectData?.id, formData).subscribe(
        (response) => {
          this.getProjectById();
          this.toaster.typeSuccess("Files Added","Success")
          this.model.closeModel('addNewFile');
          
        },
        (error) => {
          this.model.closeModel('addNewFile');
        }
      );
    } 
  }

  passFile(file:any){
    this.fileToDelete=file;
  }
  deleteFile() {
    this.projectService.deleteFile(this.fileToDelete).subscribe(
      () => {
        this.projectData.files = this.projectData.files.filter((file: any) => file.id !== this.fileToDelete);
        this.toaster.typeSuccess("File Deleted","Success")
        this.model.closeModel('delete_file')
      },
      (error: any) => {
        this.model.closeModel('delete_file')
      }
    );
  }

  getProjectById() {
    this.selectedTeamMembers=[]
    this.projectService.getProjectById(this.id).subscribe((data) => {
      this.projectData = data;
      for (let index = 0; index < this.projectData.assigned_to.length; index++) {
        this.selectedTeamMembers.push( this.projectData.assigned_to[index].id);
      }
      
    })
  }

  toggleVisibility(index: number) {
    this.isHidden[index] = !this.isHidden[index];
  }

  displayFn(customer: any): string {
    return customer ? customer.name : ''; // Return empty string if customer is undefined
  }

  displayManagerFn(manager: any): string {
    return manager ? `${manager.firstname} ${manager.lastname}` : '';
  }

  onCustomerSelectionChanged(customer: any) {
    this.editProjectForm.get('customer')?.setValue(customer.id);
  }

  onManagerSelectionChanged(selectedManager: any): void {
    if (selectedManager) {
      this.editProjectForm.get('manager')?.setValue(selectedManager.id);
    } 
  }
  editProject() {
    this.projectService.updateProject(this.projectData.id, this.editProjectForm.value).subscribe((res) => {

      this.formSubmitted.emit();
      this.toaster.typeSuccess("Project Edited","Success")
      this.model.closeModel('edit_project');
    },
      (error) => {
        this.model.closeModel('edit_project');
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
  getFileSize(bytes: number): string {
    return this.projectService.getSize(bytes);
  }
  getFileName(filePath: string): string {
    if (!filePath) return ''; // Handle cases where filePath is null or empty
    return filePath.substring(filePath.lastIndexOf('/') + 1);
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

  

}
