import { TestBed, inject } from '@angular/core/testing';

import { Test1Service } from './test1.service';

describe('Test1Service', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [Test1Service]
    });
  });

  it('should be created', inject([Test1Service], (service: Test1Service) => {
    expect(service).toBeTruthy();
  }));

  /*it('set TestService1.state1 and TestService1.state2', inject([Test1Service], (test1Service: Test1Service) => {
    console.log('test1 test1Service.state1: ', test1Service.state1);
    console.log('test1 test1Service.state2: ', test1Service.state2);
    test1Service.state1 = 'state1 from test1Service';
    test1Service.state2 = 'state2 from test1Service';
  }));*/
});
