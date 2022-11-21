import { Component, OnInit } from '@angular/core';
import { FileUploadService } from '../file-upload.service';
import { ApiService } from '../api.service';


@Component({
  selector: 'clinician',
  templateUrl: './clinician.component.html',
  styleUrls: ['./clinician.component.css']
})
export class ClinicianComponent implements OnInit {

  shortLink: string = "";
  loading: boolean = false; // Flag variable
  // initialize variable file of type File as empty
  // file: File;
  file: File|null = null;


  // Inject service 
  constructor(private fileUploadService: FileUploadService, private apiService: ApiService){
  }

  ngOnInit(): void {
  }

  // On file Select
  onChange(event: any) {
    this.file = event.target.files[0];
  }

  // OnClick of button Upload
  onUpload() {
    this.loading = !this.loading;
    console.log(this.file);
    this.fileUploadService.upload(<File>this.file).subscribe(
      (event: any) => {
        if (typeof (event) === 'object') {

          // Short link via api response
          this.shortLink = event.link;

          this.loading = false; // Flag variable 
        }
      }
    );
  }

  display_patient_data(){
    this.apiService.patientData().subscribe((data: any)=>{
      // console.log(data);
      console.log(data);
    }), (error: string)=>{
      console.log("nahi aya");
    }
  }

}
