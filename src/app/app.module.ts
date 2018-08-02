import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { EncryptionComponent } from './encryption/encryption.component';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {TestSpyService} from './testing/test-spy.service';

@NgModule({
  declarations: [
    AppComponent,
    EncryptionComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  providers: [HttpClient, TestSpyService],
  bootstrap: [AppComponent]
})
export class AppModule { }
