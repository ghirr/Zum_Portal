import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from "@angular/forms";
import { ProjectService } from '../services/project.service';
import { CustomerService } from '../../customer/services/customer.service';
import { common } from 'src/app/Common/common';
import { ModalService } from 'src/app/Common/commonservices/modal.service';
import { ToasterService } from 'src/app/core/services/toaster/toaster.service';
import { UserService } from '../../employees/services/user.service';

@Component({
  selector: 'app-project-modal',
  templateUrl: './project-modal.component.html',
  styleUrls: ['./project-modal.component.scss']
})
export class ProjectModalComponent implements OnInit {

  public addProjectForm!: FormGroup;
  public editProjectForm!: FormGroup;
  
  selectedTeamMembers: any[] = [];
  
  @Input() projectData: any;
  @Output() formSubmitted = new EventEmitter();
  fromDate: Date | null = null; // Initialize fromDate to null
  toDate: Date | null = null; // Initialize toDate to null

  image=common.profileImage;

  
  selectedFiles: File[] = [];

  showErrorAlert: boolean = false;
  submitted = false;

  file!: FormControl;

  isLoading = false; // Track form submission status

  filteredCustomers: any=[];
  filteredManagers: any=[];
  filteredTeamMembers: any[] = [];
  filtredScrumMasters: any[] = [];
  errorMessage: string = '';
  minDate = new Date();


  constructor(
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
    public service: UserService,
    private customerService:CustomerService,
    private projectService: ProjectService,
    private toaster: ToasterService,
    private model:ModalService
  ) { }
  ngOnInit(): void {
    this.addProjectForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      manager: ['', Validators.required],
      customer: ['', Validators.required],
      scrum: ['', Validators.required],
      assignedToControl: [[], Validators.required],
      starter_at: ['', Validators.required],
      end_date: ['', Validators.required],
      abbreviation: ['', Validators.required],
      uploaded_files: [[]]
    })

    this.getCustomers();
    this.getTM();

    // Initialize form for editing projects
    this.editProjectForm = this.formBuilder.group({
      name: [{ value: '', disabled: true }, Validators.required],
      description: ['', Validators.required],
      starter_at: ['', Validators.required],
      end_date: ['', Validators.required],
      abbreviation: ['', Validators.required],
      uploaded_files: [[]]
    });

    // If project data is provided, initialize edit form
    if (this.projectData) {
      this.initializeEditForm(this.projectData);
      this.ngOnChanges();
    }

    // Initialize file form control
    this.file = new FormControl();
  }
  initializeEditForm(projectData: any): void {
    // Convert end_date to correct format if it exists
    const endDate = projectData.end_date ? new Date(projectData.end_date) : null;
    const formattedEndDate = endDate ? this.formatDatee(endDate) : null;

    this.editProjectForm = this.formBuilder.group({
      name: [{ value: projectData.name, disabled: true }, Validators.required],
      description: [projectData.description, Validators.required],
      manager: [projectData.manager, Validators.required],
      customer: [projectData.customer, Validators.required],
      assigned_to: [projectData.assigned_to, Validators.required],
      starter_at: [projectData.starter_at ? new Date(projectData.starter_at) : null, Validators.required],
      end_date: [projectData.end_date ? new Date(projectData.end_date) : null, Validators.required],
      abbreviation: [projectData.abbreviation, Validators.required],
      uploaded_files: [[]]
    });
  }

  ngOnChanges(): void {
    if (this.projectData != undefined) {
      this.editProjectForm.patchValue({
        name: this.projectData.name,
        manager: this.projectData.manager,
        customer: this.projectData.customer,
        assigned_to: this.projectData.assigned_to,
        description: this.projectData.description,
        starter_at: this.formatDatee(this.projectData.starter_at),
        end_date: this.model.invertFormatDate(this.projectData.end_date),
        abbreviation: this.projectData.abbreviation
      });
    }
  }

  formatDatee(date: any): string {
    return this.datePipe.transform(date, 'M/d/yy')!;
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


  getCustomers(){
        // Fetch customers and set up filtering
        this.customerService.getCustomers().subscribe(customers => {
          this.filteredCustomers = customers;
          this.addProjectForm.patchValue({
            customer:customers[0]
          })
        });
  }

  getTM() {
    this.service.getUserByRole().subscribe((data:any)=>{
      this.filteredManagers = data.filter((user: { role: string; }) => user.role === "Project Manager");
      this.filtredScrumMasters = data.filter((user: { role: string; }) => user.role === "Scrum Master");
      this.filteredTeamMembers = data.filter((user: { role: string; }) => user.role === "Simple User");
      
    this.addProjectForm.patchValue({
      manager:this.filteredManagers[0],
      scrum:this.filtredScrumMasters[0]
    })
    });
  }


  get f() { return this.addProjectForm.controls; }
  get g() { return this.editProjectForm.controls; }

  addProject() {
    this.isLoading = true;
    this.submitted = true;

    if (this.addProjectForm.invalid) {
      this.isLoading = false;
      return;
    }

    const formattedEndDate = this.model.formatDate(this.addProjectForm.value.end_date);
    const formattedStartDate = this.model.formatDate(this.addProjectForm.value.starter_at);


    // Create FormData object
    const formData = new FormData();

    // Append files to FormData
    this.selectedFiles.forEach(file => {
      formData.append('uploaded_files', file);
    });

    // Append other form fields to FormData
    formData.append('name', this.addProjectForm.get('name')?.value);
    formData.append('description', this.addProjectForm.get('description')?.value);
    formData.append('abbreviation', this.addProjectForm.get('abbreviation')?.value);
    formData.append('starter_at', formattedStartDate);
    formData.append('end_date', formattedEndDate);
    formData.append('project_manager',this.addProjectForm.get('manager')?.value.id);
    formData.append('scrum_master',this.addProjectForm.get('scrum')?.value.id);
    formData.append('customer',this.addProjectForm.get('customer')?.value.id);

    // Append team member IDs to FormData as primary keys
    const selectedTeamMembers = this.addProjectForm.get('assignedToControl')?.value;
    const teamMemberIds: any[] = [];
    if (selectedTeamMembers && selectedTeamMembers.length > 0) {
      for (let i = 0; i < selectedTeamMembers.length; i++) {
        const memberId = selectedTeamMembers[i].id;
        formData.append('assigned_to', memberId);
        teamMemberIds.push(memberId);
      }
    }

    // Send POST request with FormData to the correct endpoint
    this.projectService.addNewProject(formData).subscribe(
     (res) => {
        this.formSubmitted.emit();
        this.onReset();
        this.toaster.typeSuccess("Project Added","Success")
        this.model.closeModel('create_project');
      },
      (error) => {
        this.isLoading = false;
        if (error && error.error && error.error.name && error.error.name[0] === 'project with this name already exists.') {
          this.errorMessage = error.error.name[0];
          this.showErrorAlert = true;
        } else {
          this.model.closeModel('create_project');
      }
    });
  }

  onReset() {
    this.submitted = false;
    this.addProjectForm.reset();
    this.isLoading = false; // Re-enable the button
    this.selectedFiles = [];
    this.addProjectForm.patchValue({
      name: '',
      description: '',
      assignedToControl: [],
      customer:this.filteredCustomers[0],
      manager:this.filteredManagers[0],
      scrum:this.filtredScrumMasters[0],
      starter_at: '',
      end_date: '',
      abbreviation: '',
      uploaded_files: []
    })
  }

  isImageFile(file: File): boolean {
    return file.type.startsWith('image/');
  }


  removeSingleFile(index: number) {
    this.selectedFiles.splice(index, 1);
  }

  deleteProject() {
    this.projectService.deleteProjectById(this.projectData.id).subscribe((res) => {
      this.formSubmitted.emit();
      this.toaster.typeSuccess("Project Deleted","Success")
      this.model.closeModel('delete_project');
    },
      (error) => {
        this.model.closeModel('delete_project');
      })
  }

  editProject() {
    if (this.editProjectForm.valid) {
      const projectId = this.projectData.id;
      const editedProjectData = this.editProjectForm.value;
  
      // For starter_at, directly use toISOString() or adjust accordingly
      editedProjectData.starter_at = this.model.formatDate(editedProjectData.starter_at)

      editedProjectData.end_date = this.model.formatDate(editedProjectData.end_date)
      
      this.projectService.updateProject(projectId, editedProjectData).subscribe(
        (res)=>{
          
      this.formSubmitted.emit();
      this.toaster.typeSuccess("Project Edited","Success")
      this.model.closeModel('edit_project');
      },
    (error)=>{
      this.model.closeModel('edit_project');
    })
    } 
  }

}
