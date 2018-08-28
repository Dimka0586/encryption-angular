import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EncServiceService {

  constructor(public http: HttpClient) { }


  httpHandler() {
    console.log('EncService->httpHandler');
  }
}
