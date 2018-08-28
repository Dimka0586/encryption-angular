import { TestBed, inject } from '@angular/core/testing';

import { AttrServiceService } from './attr-service.service';
import {EncServiceService} from './enc-service.service';
import {HttpClientModule} from '@angular/common/http';

class MockEncService extends EncServiceService {
  httpHandler() {
    console.log('MockEncService->httpHandler');
  }
}


describe('AttrServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [
        {provide: EncServiceService, useClass: MockEncService},
        AttrServiceService]
    });
  });

  it('should be created', inject([AttrServiceService], (service: AttrServiceService) => {
    expect(service).toBeTruthy();
  }));

  it('should test inheritance with spy', inject([EncServiceService, AttrServiceService],
    (encService: EncServiceService, attrService: AttrServiceService) => {
    const httpHandlerSpy = spyOn(MockEncService.prototype, 'httpHandler').and.callThrough();
    attrService.runHttpHandler();
    expect(httpHandlerSpy).toHaveBeenCalled();
    }));
});
