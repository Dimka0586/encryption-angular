import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class TestSpyService {

  constructor(public http: HttpClient) { }

  method1() {
    console.log('method1');
  }

  method2() {
    this.method1();
  }

  method3() {
    this.method1();
    this.method2();
  }

  httpHandler(): Promise<any> {
    console.log('origin httpHandler');
    return this.http.get('qwe').toPromise();
  }

  getKeys() {
    this.httpHandler();
    return new Promise(resolve => {
      resolve('dataToHttp');
    })
      .then(onloadeddata => { this.httpHandler() })
      .then(response => console.log('respose: ', response))
  }


}
