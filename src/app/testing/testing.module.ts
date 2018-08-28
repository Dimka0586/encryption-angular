import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {TestSpyService} from './test-spy.service';
import {HttpClient, HttpClientModule} from '@angular/common/http';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule
  ],
  providers: [TestSpyService, HttpClient],
  declarations: []
})
export class TestingModule { }
