import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { EncryptionComponent } from './encryption/encryption.component';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {TestSpyService} from './testing/test-spy.service';
import {Test1Service} from './testing/test1.service';
import {Test2Service} from './testing/test2.service';
import {Test3Service} from './testing/test3.service';
import {EncryptionService} from './encryption.service';

@NgModule({
  declarations: [
    AppComponent,
    EncryptionComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  providers: [
    HttpClient,
    TestSpyService,
    Test1Service,
    Test2Service,
    Test3Service, EncryptionService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
