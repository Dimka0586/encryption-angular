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
    const pairPromise: PromiseLike<CryptoKeyPair | CryptoKey> = this.es.generateKeyPair();
    pairPromise
      .then(pair => {
        pairKeys = <CryptoKeyPair>pair;
        console.log(pairKeys.publicKey)
        return this.es.pubKeyToByteArrayAsString(pairKeys);
      })
        .then((encodedPubKey: string) => {console.log('encoded: ', encodedPubKey);
                            return this.es.exchangeHttpRequest(new ExchangeKeyRequest('attr1-id', encodedPubKey)).toPromise(); })
          /*.then((aes: any) => { return window.crypto.subtle.importKey('raw', this.es.base64StringToArrayBuffer(aes.generatedKey),
                                                    'AES-CTR', true, ['encrypt', 'decrypt']); })
            .then(val => console.log(val));*/
            .then((aes: any) => { console.log(this.es.base64StringToArrayBuffer(aes['generatedKey'])); return window.crypto.subtle
                            .decrypt('RSA-OAEP', pairKeys.privateKey, this.es.base64StringToArrayBuffer(aes['generatedKey'])); })
            .then(val => console.log(val), error => console.error(error));
    }





}
