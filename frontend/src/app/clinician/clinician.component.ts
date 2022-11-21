import { Component, OnInit } from '@angular/core';
import { FileUploadService } from '../file-upload.service';
import { ApiService } from '../api.service';


@Component({
  selector: 'clinician',
  templateUrl: './clinician.component.html',
  styleUrls: ['./clinician.component.css']
})
export class ClinicianComponent implements OnInit {

  short_link: string = "";
  loading: boolean = false; // Flag variable
  show_patients: boolean = false;
  file: File|null = null;

  Object = Object;

  patients: any;

  // Inject service 
  constructor(private fileUploadService: FileUploadService, private apiService: ApiService){
  }

  ngOnInit(): void {
    this.display_patient_data();
  }

  // On file Select
  onChange(event: any) {
    this.file = event.target.files[0];
  }

  togglePatients(){
    this.show_patients = !this.show_patients;
  }

  // OnClick of button Upload
  onUpload() {
    this.loading = !this.loading;
    console.log(this.file);
    this.fileUploadService.upload(<File>this.file).subscribe(
      (event: any) => {
        if (typeof (event) === 'object') {

          // Short link via api response
          this.short_link = event.link;

          this.loading = false; // Flag variable 
        }
      }
    );
  }

  display_patient_data(){
    // console.log("service running");
    this.apiService.patientData().subscribe((data)=>{
      // console.log(data);
      this.patients = data;
      console.log(this.patients);
    }), (error:any)=>{
      console.log("Error is ", error);
    }
  }

  dateFormat(date: string){
    return date.split("T")[0];
  }

}
