import { TestBed, inject } from '@angular/core/testing';

import { EncServiceService } from './enc-service.service';
import {HttpClientModule} from '@angular/common/http';




describe('EncServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [EncServiceService]
    });
  });

  it('should be created', inject([EncServiceService], (service: EncServiceService) => {
    expect(service).toBeTruthy();
  }));
});
