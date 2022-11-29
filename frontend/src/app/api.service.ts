import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PatientData } from './interfaces/patientdata';
import { VendorData } from './interfaces/vendordata';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
  })
export class ApiService {

  constructor(private http : HttpClient) { }

  getPatientData() {
    return this.http.get<PatientData>('http://localhost:3001/patientData');
  }

  addPatientData(data: PatientData) {
    return this.http.post('http://localhost:3001/patientData', data);
  }

  getVendorData() {
    return this.http.get<VendorData>('http://localhost:3001/vendorData');
  }

  uploadFile(file:File):Observable<any> {
  
    // Create form data
    const formData = new FormData(); 
      
    // Store form name as "file" with file data
    formData.append("file", file, file.name);
    console.log("final",file,file.name,formData);

    // return this.http.get<VendorData>('http://localhost:3001/vendorData');      
    // Make http post request over api
    // with formData as req
    return this.http.post('http://localhost:3001/clinicianData/uploadfile',formData)
  }
  
  uploadFileDetails(clinician_ID:number, vendor_ID: number, file_name: string) {
    const details = {clinician_id: clinician_ID, vendor_id: vendor_ID, file_name: file_name};
    return this.http.post('http://localhost:3001/clinicianData/uploadfiledetails',details);
  }

  getFilesData(clinician_ID:number, vendor_ID: number) {
    const ID = {clinician_id: clinician_ID, vendor_id: vendor_ID}
    console.log(ID)
    return this.http.post('http://localhost:3001/vendorData/getfilesdata', ID);
  }

  // downloadFile(url: string): Observable<Blob> {
  //   return this.http.get(url, {
  //     responseType: 'blob'
  //   })
  // }

  downloadFile(path: string) {
    const file_path = {path: path}
    return this.http.post('http://localhost:3001/vendorData/downloadfiledata', file_path, {responseType: 'blob'});
  }
}