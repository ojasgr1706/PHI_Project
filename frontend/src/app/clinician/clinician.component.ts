import { Component, OnInit } from '@angular/core';
import { FileUploadService } from '../file-upload.service';
import { ApiService } from '../api.service';
import { PatientData } from '../interfaces/patientdata';
import { VendorData } from '../interfaces/vendordata';
import { UploadFile } from '../interfaces/uploadfile';


@Component({
  selector: 'clinician',
  templateUrl: './clinician.component.html',
  styleUrls: ['./clinician.component.css']
})
export class ClinicianComponent implements OnInit {

  short_link: string = "";
  loading: boolean = false; // Flag variable
  show_patients: boolean = false;
  show_vendors: boolean = false;
  show_add_patients: boolean = false;
  show_add_vendors: boolean = false;
  show_patient: boolean = false;

  uploadfile : UploadFile = {
    file: null,
    clinician_ID: 0,
    vendor_ID: 0
  }

  Object = Object;

  // patients: PatientData|undefined;
  patients: any;
  patient_info: PatientData = {
    patient_id: 0,
    nam: 'Name',
    dob: new Date('1-1-1'),
    phone_num: 0,
    addr: 'Address',
    weight: 0,
    height: 0,
    chicken_pox: false,
    measles: false,
    hepatitis_b: false
  }

  vendors: any;

  // Inject service 
  constructor(private fileUploadService: FileUploadService, private apiService: ApiService) {
  }

  ngOnInit(): void {
    this.patientData();
    this.vendorData();
  }

  // On file Select
  onChange(event: any, clinician_ID: number, vendor_ID: number) {
    this.uploadfile.file = <File>event.target.files[0];
    this.uploadfile.vendor_ID = vendor_ID;
  }

  togglePatients() {
    this.show_patients = !this.show_patients;
    this.show_add_patients = false;
  }

  toggleAddPatients() {
    this.show_add_patients = !this.show_add_patients;
    // this.bin_num = <Binary>this.bin_num;
  }

  toggleVendors() {
    this.show_vendors = !this.show_vendors;
    this.show_add_vendors = false;
  }

  onUpload() {
    console.log(this.uploadfile.file?.name)
    var file_name: string = 'name';
    if (this.uploadfile.file?.name) {
      file_name = this.uploadfile.file?.name;
    }
    this.apiService.uploadFile(<File>this.uploadfile.file).subscribe({})
    this.apiService.uploadFileDetails(this.uploadfile.clinician_ID, this.uploadfile.vendor_ID, file_name).subscribe({})
  }

  patientData() {
    // console.log("service running");
    this.apiService.getPatientData().subscribe(data => {
      this.patients = data;
    }), (error: any) => {
      console.log("Error is ", error);
    }
  }

  addPatient(data: any) {
    // console.log(this.patient_info);

    if (!data.chicken_pox) {
      data.chicken_pox = false;
    }
    if (!data.measles) {
      data.measles = false;
    }
    if (!data.hepatitis_b) {
      data.hepatitis_b = false;
    }
    console.log(data);
    this.apiService.addPatientData(data).subscribe({})
    //   result => {
    //   console.log(result);
    //   // console.log(this.patient_info);
    // })
    // , (error:any)=>{
    //   console.log("Error is ", error);
    // }
  }

  editPatient(data: PatientData) {
    console.log(data);
  }

  vendorData() {
    this.apiService.getVendorData().subscribe(data => {
      this.vendors = data;
    }), (error: any) => {
      console.log("Error is ", error);
    }
  }



  dateFormat(date: string) {
    return date.split("T")[0];
  }

}
