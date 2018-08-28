import {TestBed, inject, async} from '@angular/core/testing';

import { Test3Service } from './test3.service';
import {Test1Service} from './test1.service';

describe('Test3Service', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        Test3Service,
        Test1Service
      ]
    });
  });

  it('should be created', inject([Test3Service], (service: Test3Service) => {
    expect(service).toBeTruthy();
  }));

  /*it('set TestService1.state1 and TestService1.state2', inject([Test1Service], (test1Service: Test1Service) => {
    // console.log('test3 test1Service.state1: ', test1Service.state1);
    // console.log('test3 test1Service.state2: ', test1Service.state2);

    test1Service.state1 = 'state1 from test3Service';
    test1Service.state2 = 'state2 from test3Service';
  }));*/
});
