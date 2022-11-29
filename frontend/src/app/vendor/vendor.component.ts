import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { saveAs } from 'file-saver';

@Component({
  selector: 'vendor',
  templateUrl: './vendor.component.html',
  styleUrls: ['./vendor.component.css']
})
export class VendorComponent implements OnInit {
  files: any
  show_files: boolean = false;
  file_name:string = "";
  file_path:string = "";
  file_folder:string = '/home/ojas/Desktop/sem7/dh302/project/PHI_Project/backend/uploads/';

  Object = Object;

  constructor(private apiService: ApiService) { 
  }

  ngOnInit(): void {
    this.fileData();
  }

  fileData() {
    this.apiService.getFilesData(0,0).subscribe(data => {
      this.files = data;
      console.log(this.files);
    }), (error: any) => {
      console.log("Error is ", error);
    }
  }

  filename(path: string) {
    var split = path.split('/');
    var file_name = split[split.length - 1];
    // var download = {filepath = '/home/ojas/Desktop/sem7/dh302/project/PHI_Project/backend/uploads/' + ''}
    return file_name;

  }

  download(name:string) {
    var path = this.file_folder + name;
    this.apiService.downloadFile(path).subscribe(blob => {
      saveAs(blob, name);
    }), (error: any) => {
      console.log("Error is ", error);
    };
  }

}
