import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { routes } from 'src/app/core/core.index';
import { UserService } from '../../services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { ProjectService } from 'src/app/feature-module/projects/services/project.service';
import { common } from 'src/app/Common/common';
import { ModalService } from 'src/app/Common/commonservices/modal.service';
import { ToasterService } from 'src/app/core/services/toaster/toaster.service';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from 'src/app/feature-module/authentication/services/auth.service';

@Component({
  selector: 'app-employee-profile',
  templateUrl: './employee-profile.component.html',
  styleUrls: ['./employee-profile.component.scss'],
})
export class EmployeeProfileComponent implements OnInit, OnChanges {
  showSuccessAlert: boolean = false;
  showErrorAlert: boolean = false;

  selectedList14: any[] = [];
  public routes = routes;
  bsValue = new Date();
  @Input() selectedUser: any;
  projects: any[] = [];
  id: any;
  public addEmployeeForm!: FormGroup;
  editProfileInfo !: FormGroup;

  selectedFile!: File;
  imagePreviewUrl: any;
  image: any;
  errorMessage: string = '';
  showFullDescription = false;
  imageProfile = common.profileImage;
  // Inside your component class
  projectDescriptionsVisibility: { [key: number]: boolean } = {};
  assets: any[] = [];
  searchTerm: string = '';
  assignedDate!: Date;
  assetType: string = '';
  userAssets: any[] = [];
  selectedAssetTypes: string[] = [];
  selectedAsset: any = [];
  assetselected: any;
  selectedAssetIds: any[] = [];
  selectedAssetDetails: any;
  addAssetForm!: FormGroup;
  assetTypes: string[] = [];
  editAssetForm!: FormGroup;

  connectedUser:any;

  constructor(private formBuilder: FormBuilder, private service: UserService, private model: ModalService,
    private activatedRoute: ActivatedRoute, private datePipe: DatePipe, private toaster: ToasterService,
    private projectService: ProjectService, private router: Router,private authService:AuthService) { }


  ngOnInit() {
    this.connectedUser=this.authService.getUser()

    this.addEmployeeForm = this.formBuilder.group({
      client: ['', Validators.required]
    });

    this.addAssetForm = this.formBuilder.group({
      asset: ['', Validators.required],
      serial_number: ['', Validators.required],
      brand: ['', Validators.required],
      vendor: ['', Validators.required],
      cost: ['', Validators.required]
    });
    this.editAssetForm = this.formBuilder.group({
      asset: ['', Validators.required],
      serial_number: ['', Validators.required],
      brand: ['', Validators.required],
      vendor: ['', Validators.required],
      cost: ['', Validators.required]
    });
    this.fetchAssetTypes();
    // Get the id from route parameters
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    // Check if id is not null or undefined
    if (this.id) {
      // Call getEmployeeDetails to fetch employee data
      this.getEmployeeDetails();
      this.fetchUserAssets();
      // Fetch projects
      this.loadProjects(this.id);
    } else {
      this.router.navigate([])
    }

    this.loadProjects(this.id);

    this.addEmployeeForm = this.formBuilder.group({
      client: ['', Validators.required]
    });
    this.editProfileInfo = this.formBuilder.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      birthday_date: [''],
      gender: [''],
      address: [''],
      role: ['', Validators.required],
      position: [''],
      joining_date: [Validators.required],
      tel: ['', Validators.pattern(/^[0-9]+$/)],
      manager: [''],
      email: ['', Validators.required],
      id_card: [''],
      passport_no: [''],
      passport_exp_date: [''],
      nationality: [''],
      social_security_number: [''],
      current_type_of_contract: [''],
      current_salary: [''],
      marital_status: [''],
      status: [''],
      bank_name: [''],
      rib: ['']
    });

    this.assignedDate = new Date();
    // Fetch managers
    this.service.getUserByRole().subscribe((data: any) => {
      let managers = data.filter((user: { role: string; }) => user.role === "Talent Management");
      this.selectedList14 = managers.map((manager: any) => ({
        value: manager.id,
        label: `${manager.firstname} ${manager.lastname}`,
        profile_photo: manager.profile_photo || this.imageProfile // Add profile_photo property

      }));
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.getEmployeeDetails()
    if (changes['selectedUser'] && changes['selectedUser'].currentValue) {
      const userId = changes['selectedUser'].currentValue.id;
      this.loadProjects(userId);
    }
  }
  fetchUserAssets() {
    this.service.getUserAssets(this.id).subscribe(
      (assets: any[]) => {
        this.selectedAsset = assets;
        this.initializeForm();
      }
    );
  }


  loadProjects(userId: any) {
    this.projectService.getProjectsByUser(userId).subscribe(
      (projects: any[]) => {
        this.projects = projects;
      }
    );
  }

  getEmployeeDetails() {
    this.service.getUserDetails(this.id).subscribe(
      (employeeDetails) => {
        this.selectedUser = employeeDetails;
        this.initializeForm();
      }
    );
  }

  initializeForm() {
    // Pre-populate form controls with selectedUser data
    this.editProfileInfo.patchValue({
      profile_photo: this.selectedUser?.profile_photo,
      firstname: this.selectedUser?.firstname,
      lastname: this.selectedUser?.lastname,
      birthday_date: this.formatDate(this.selectedUser?.birthday_date),
      gender: this.selectedUser?.gender || "Male",
      address: this.selectedUser?.address,
      role: this.selectedUser?.role,
      position: this.selectedUser?.position,
      joining_date: this.selectedUser?.joining_date,
      tel: this.selectedUser?.tel,
      manager: this.selectedUser?.manager?.id, // Assign manager name here
      email: this.selectedUser?.email,
      id_card: this.selectedUser?.id_card,
      passport_no: this.selectedUser?.passport_no,
      passport_exp_date: this.formatDate(this.selectedUser?.passport_exp_date),
      nationality: this.selectedUser?.nationality,
      social_security_number: this.selectedUser?.social_security_number,
      current_type_of_contract: this.selectedUser?.current_type_of_contract,
      current_salary: this.selectedUser?.current_salary,
      marital_status: this.selectedUser?.marital_status,
      status: this.selectedUser?.status,
      bank_name: this.selectedUser?.bank_name,
      rib: this.selectedUser?.rib
    });

    // Populate the form fields with selected asset data
    this.editAssetForm.patchValue({
      asset: this.assetselected?.asset,
      serial_number: this.assetselected?.serial_number,
      brand: this.assetselected?.brand,
      vendor: this.assetselected?.vendor,
      cost: this.assetselected?.cost
    });
  }

  formatDate(dateString: string): string {
    if (!dateString) {
      return '';
    }
    const date = new Date(dateString);
    return this.datePipe.transform(date, 'yyyy-MM-dd') || '';
  }
  updateUser() {

    if (this.editProfileInfo.valid && this.id) {
      const birthdayValue = this.editProfileInfo.value.birthday_date;
      const birthDate = birthdayValue ? new Date(birthdayValue) : undefined;
      const joiningDateValue = this.editProfileInfo.value.joining_date;
      const joinDate = joiningDateValue ? new Date(joiningDateValue) : undefined;
      const expiryDateValue = this.editProfileInfo.value.passport_exp_date;
      const expDate = expiryDateValue ? new Date(expiryDateValue) : undefined;

      const formattedBirthDate = birthDate ? this.datePipe.transform(birthDate, 'yyyy-MM-dd') || '' : '';
      const formattedJoinDate = joinDate ? this.datePipe.transform(joinDate, 'yyyy-MM-dd') || '' : '';
      const formattedExpiryDate = expDate ? this.datePipe.transform(expDate, 'yyyy-MM-dd') || '' : '';


      const selectedManagerId = this.editProfileInfo?.value?.manager;
      const formData = new FormData();
      formData.append('firstname', this.editProfileInfo.value.firstname)
      formData.append('lastname', this.editProfileInfo.value.lastname)
      formData.append('birthday_date', formattedBirthDate)
      formData.append('email', this.editProfileInfo.value.email)
      formData.append('tel', this.editProfileInfo.value.tel)
      formData.append('joining_date', formattedJoinDate)
      formData.append('address', this.editProfileInfo.value.address)
      formData.append('gender', this.editProfileInfo.value.gender)
      formData.append('role', this.editProfileInfo.value.role)
      formData.append('position', this.editProfileInfo.value.position)
      if (selectedManagerId) {
        formData.append('manager', selectedManagerId)
      }
      formData.append('id_card', this.editProfileInfo.value.id_card)
      formData.append('passport_no', this.editProfileInfo.value.passport_no)
      formData.append('passport_exp_date', formattedExpiryDate)
      formData.append('nationality', this.editProfileInfo.value.nationality)

      formData.append('social_security_number', this.editProfileInfo.value.social_security_number)
      formData.append('current_type_of_contract', this.editProfileInfo.value.current_type_of_contract)
      formData.append('current_salary', this.editProfileInfo.value.current_salary)
      if (this.editProfileInfo.value.marital_status) {
        formData.append('marital_status', this.editProfileInfo.value.marital_status)
      }
      formData.append('status', this.editProfileInfo.value.status)

      formData.append('bank_name', this.editProfileInfo.value.bank_name)
      formData.append('rib', this.editProfileInfo.value.rib)

      if (this.image != undefined) {
        formData.append('profile_photo', this.image)
      }
      this.service.updateEmployeeDetails(this.id, formData).subscribe({
        next: (res) => {
          this.getEmployeeDetails();
          this.toaster.typeSuccess("Profile updated", "Success")
          this.model.closeModel('profile_info');
          this.model.closeModel('personal_info_modal');
          this.model.closeModel('bank_infos');
          this.model.closeModel('emergency_contact_modal');

        },
        error: (error) => {
          this.toaster.typeSuccess("Profile updated", "Success")
          this.model.closeModel('profile_info');
          this.model.closeModel('personal_info_modal');
          this.model.closeModel('bank_infos');
          this.model.closeModel('emergency_contact_modal');
        }
      });
    }
  }
  onImageSelected(event: Event) {
    const target = event.target as HTMLInputElement;
    const file: File = (target.files as FileList)[0];
    this.image = file;
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreviewUrl = reader.result as string;
        target.value = '';
      };
      reader.readAsDataURL(file);
    }

  }

  reset() {
    this.image = undefined;
    this.imagePreviewUrl = undefined;
    this.addAssetForm.patchValue({
      asset: '',
      serial_number: '',
      brand: '',
      vendor: '',
      cost: ''
    })


  }
  getAssetImageUrl(assetType: string): string {
    switch (assetType) {
      case 'Laptop':
        return 'assets/img/laptop.jpg';
      case 'Mouse':
        return 'assets/img/mouse.jpg';
      case 'Phone':
        return 'assets/img/phone.jpg';
      case 'Headset':
        return 'assets/img/headset.jpg';
      case 'SIM Card':
        return 'assets/img/sim-card.jpg';
      // Add more cases for other asset types as needed
      default:
        return 'assets/img/default.jpg'; // Default image URL if asset type is unknown
    }
  }

  passAssetData(asset: any) {
    this.assetselected = asset;
    this.initializeForm()

  }

  addAssetsToUser(): void {
    if (this.addAssetForm.valid) {
      const formData = this.addAssetForm.value;
      const userId = this.id;

      // Call your API service to add assets to the user
      this.service.addAssetsToUser(userId, formData).subscribe(
        (response: any) => {
          this.fetchUserAssets();
          this.reset();
          this.toaster.typeSuccess("Asset added", "Sucess")
          this.model.closeModel('add_asset');
        },
        (error: HttpErrorResponse) => {
          if (error.status == 400) {
            this.errorMessage = "Asset already exists for this user!"
          }
          else {
            this.model.closeModel('add_asset');
          }
        }
      );
    }
  }

  editAsset() {
    if (this.editAssetForm.valid && this.selectedAsset) {
      const assetId = this.assetselected.id;
      const formData = this.editAssetForm.value;
      const userId = this.id;

      this.service.updateAsset(userId, assetId, formData).subscribe(
        (response: any) => {
          this.fetchUserAssets();
          this.toaster.typeSuccess("Asset edited", "Success")
          this.model.closeModel('edit_asset');

        },
        (error: any) => {
          this.model.closeModel('edit_asset');
        }
      );
    }
  }

  deleteAsset() {
    const assetId = this.assetselected.id; // Get the ID of the selected asset
    const userId = this.id;

    this.service.deleteAsset(userId, assetId,).subscribe(
      (response: any) => {
        this.fetchUserAssets();
        this.toaster.typeSuccess("Asset deleted", "Success")
        this.model.closeModel('delete_asset');

      },
      (error: any) => {
        this.model.closeModel('delete_asset');
      }
    );

  }
  fetchAssetTypes(): void {
    this.service.getAssetTypes().subscribe(
      (types: any[]) => {
        this.assetTypes = types.map(type => type[0]);
      }
    );
  }

  showAssetAssignmentDetails(details: any): void {
    this.selectedAssetDetails = details;
  }

}
