import { TestBed, inject } from '@angular/core/testing';

import { TestSpyService } from './test-spy.service';
import {HttpModule} from '@angular/http';
import {HttpClient, HttpClientModule} from '@angular/common/http';

describe('TestSpyService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [TestSpyService, HttpClient]
    });
  });

  it('should be created', inject([TestSpyService], (service: TestSpyService) => {
    expect(service).toBeTruthy();
  }));

  /*it('#method3() should run spy method1', inject([TestSpyService], (service: TestSpyService) => {
      // spyOn(service, 'method1').and.callFake(() => console.log('fake method1'));
      spyOn(service, 'httpHandler').and.callFake((par1) => {console.log('fake http'); return new Promise(resolve => { resolve('fake  httpHandler'); })});
      service.getKeys().then(data => console.log('data: ', data));
    })
  );*/




})
