import { TestBed, inject } from '@angular/core/testing';

import { Test2Service } from './test2.service';
import {Test1Service} from './test1.service';

describe('Test2Service', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        Test2Service,
        Test1Service
      ]
    });
  });

  it('should be created', inject([Test2Service], (service: Test2Service) => {
    expect(service).toBeTruthy();
  }));

  /*it('set TestService1.state1 and TestService1.state2', inject([Test1Service], (test1Service: Test1Service) => {
    console.log('test2 test1Service.state1: ', test1Service.state1);
    console.log('test2 test1Service.state2: ', test1Service.state2);

    test1Service.state1 = 'state1 from test2Service';
    test1Service.state2 = 'state2 from test2Service';
  }));*/
});
