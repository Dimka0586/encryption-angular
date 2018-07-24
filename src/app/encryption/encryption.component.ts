import { Component, OnInit } from '@angular/core';
import {EncryptionService} from '../encryption.service';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ExchangeKeyRequest} from '../model/exchange-key-request';
import {SymmetricKey} from '../model/symmetric-key';

@Component({
  selector: 'app-encryption',
  templateUrl: './encryption.component.html',
  styleUrls: ['./encryption.component.css']
})
export class EncryptionComponent implements OnInit {
  public static EXCHANGE_URL = 'http://localhost:8080/encryption/exchange';

  constructor(public es: EncryptionService, public http: HttpClient) { }

  ngOnInit() {
    let pairKeys: CryptoKeyPair;

    this.es.generateKeyPair()
      .then(pair => { pairKeys = <CryptoKeyPair>pair; return this.es.pubKeyToByteArrayAsString(pairKeys); })
      .then((encPubKey: string) => { return this.es.exchangeHttpRequest(new ExchangeKeyRequest('attr1-id', encPubKey)).toPromise(); })
      .then((encAES: any) => {  console.log('encAES: ', encAES); return this.es.decryptAESbyRSA(pairKeys.privateKey, encAES['generatedKey']); })
      .then((decAES: ArrayBuffer) => { return this.es.importAESKey(decAES); } )
      .then((aes: CryptoKey) => console.log('final aes: ', aes));
    }





}

