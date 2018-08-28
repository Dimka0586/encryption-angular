import { Injectable } from '@angular/core';
import {TestSpyService} from './test-spy.service';

@Injectable({
  providedIn: 'root'
})
export class TestSpy2Service {

  constructor(public testSpyService: TestSpyService) { }

  public runGetKeys() {
    this.testSpyService.getKeys();
  }
}
