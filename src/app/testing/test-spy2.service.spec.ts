import { TestBed, inject } from '@angular/core/testing';

import { TestSpy2Service } from './test-spy2.service';
import {TestSpyService} from './test-spy.service';
import {AppModule} from '../app.module';
import {TestingModule} from './testing.module';

describe('TestSpy2Service', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [TestSpy2Service]
    });
  });

  it('should be created', inject([TestSpy2Service], (service: TestSpy2Service) => {
    expect(service).toBeTruthy();
  }));

  /*it('should be created', inject([TestSpy2Service, TestSpyService], (testSpyService: TestSpyService, testSpy2Service: TestSpy2Service) => {
    testSpy2Service.runGetKeys();
  }));*/
});
