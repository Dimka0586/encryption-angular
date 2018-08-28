import { Injectable } from '@angular/core';
import {EncServiceService} from './enc-service.service';

@Injectable({
  providedIn: 'root'
})
export class AttrServiceService {

  constructor(public encService: EncServiceService) { }

  runHttpHandler() {
    this.encService.httpHandler();
  }
}
