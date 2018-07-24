import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {EncryptionComponent} from './encryption/encryption.component';
import {ExchangeKeyRequest} from './model/exchange-key-request';

@Injectable({
  providedIn: 'root'
})
export class EncryptionService {

  constructor(public http: HttpClient) { }

  generateKeyPair(): PromiseLike<CryptoKeyPair | CryptoKey> {
    return window.crypto.subtle.generateKey({
      name: 'RSA-OAEP',
      modulusLength: 2048,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: {name: 'SHA-256'}
    }, true, ['encrypt', 'decrypt']);
  }

  exchangeHttpRequest(keyRequest: ExchangeKeyRequest): Observable<any> {
    const headers: HttpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: 'cb-jwt-token'
    })
    return this.http.post(EncryptionComponent.EXCHANGE_URL, keyRequest, {headers: headers});
  }

  pubKeyToByteArrayAsString(keyPair: CryptoKeyPair): PromiseLike<string> {
    return window.crypto.subtle.exportKey('spki', keyPair.publicKey)
      .then((pubKeyArray: ArrayBuffer) => { console.log(); return this.arrayBufferToBase64String(pubKeyArray); });
  }

  pubKeyToByteArray(keyPair: CryptoKeyPair): PromiseLike<ArrayBuffer> {
    return window.crypto.subtle.exportKey('spki', keyPair.publicKey);
  }

  publicToPem(keyPair: CryptoKeyPair): PromiseLike<string> {
    return window.crypto.subtle.exportKey('spki', keyPair.publicKey)
      .then(spki => { console.log(spki); return this.convertBinaryToPem(spki, 'PUBLIC KEY'); });
  }

  base64StringToArrayBuffer(b64str: string, decoded = false): ArrayBuffer {
    const byteStr = decoded ? b64str : atob(b64str);
    const bytes = new Uint8Array(byteStr.length);
    for (let i = 0; i < byteStr.length; i++) {
      bytes[i] = byteStr.charCodeAt(i);
    }
    return <ArrayBuffer>bytes.buffer;
  }

  convertPemToBinary(pem: string): ArrayBuffer {
    const lines = pem.split('\n');
    let encoded = '';
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].trim().length > 0 &&
        lines[i].indexOf('-----BEGIN RSA PRIVATE KEY-----') < 0 &&
        lines[i].indexOf('-----BEGIN RSA PUBLIC KEY-----') < 0 &&
        lines[i].indexOf('-----BEGIN PUBLIC KEY-----') < 0 &&
        lines[i].indexOf('-----END PUBLIC KEY-----') < 0 &&
        lines[i].indexOf('-----BEGIN PRIVATE KEY-----') < 0 &&
        lines[i].indexOf('-----END PRIVATE KEY-----') < 0 &&
        lines[i].indexOf('-----END RSA PRIVATE KEY-----') < 0 &&
        lines[i].indexOf('-----END RSA PUBLIC KEY-----') < 0) {
        encoded += lines[i].trim();
      }
    }
    return this.base64StringToArrayBuffer(encoded);
  }

  arrayBufferToBase64String(arrayBuffer: ArrayBuffer): string {
    const byteArray = new Uint8Array(arrayBuffer);
    let byteString = '';
    for (let i = 0; i < byteArray.byteLength; i++) {
      byteString += String.fromCharCode(byteArray[i]);
    }
    return btoa(byteString);
  }

  convertBinaryToPem(binaryData: ArrayBuffer, label: string): string {
    const base64Cert = this.arrayBufferToBase64String(binaryData);
    let pemCert = '-----BEGIN ' + label + '-----\r\n';
    let nextIndex = 0;
    while (nextIndex < base64Cert.length) {
      if (nextIndex + 64 <= base64Cert.length) {
        pemCert += base64Cert.substr(nextIndex, 64) + '\r\n';
      } else {
        pemCert += base64Cert.substr(nextIndex) + '\r\n';
      }
      nextIndex += 64;
    }
    pemCert += '-----END ' + label + '-----\r\n';
    return pemCert;
  }

  importAESKey(aesKey: any): PromiseLike<CryptoKey> {
    return window.crypto.subtle.importKey('raw', aesKey,
      'AES-CTR', true, ['encrypt', 'decrypt']);
  }

  decryptAESbyRSA(privateKey: CryptoKey, encAES: string) {
    return window.crypto.subtle
      .decrypt('RSA-OAEP', privateKey, this.base64StringToArrayBuffer(encAES));
  }

  /*publicToPem(keyPair: CryptoKeyPair): PromiseLike<string> {
    return window.crypto.subtle.exportKey('spki', keyPair.publicKey).then(spki => convertBinaryToPem(spki, 'PUBLIC KEY'));
  }
  privateToPem(keyPair: CryptoKeyPair): PromiseLike<string> {
    return window.crypto.subtle.exportKey('pkcs8', keyPair.privateKey).then(pkcs8 => convertBinaryToPem(pkcs8, 'PRIVATE KEY'));
  }
  private httpHandler<T>(token: string, method: string, url: string, errorMsg: string, body?: any): Promise<T> {
    return new Promise((resolve, reject) => {
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: token
        })
      };
      if (method === 'post' || method === 'put') {
        (<any>this.http)[method](url, body, httpOptions)
          .pipe(timeout(20000)).pipe(take(1)).subscribe(resolve, reject.bind(undefined, errorMsg));
      } else {
        (<any>this.http)[method](url, httpOptions)
          .pipe(timeout(20000)).pipe(take(1)).subscribe(resolve, reject.bind(undefined, errorMsg));
      }
    });
  }
  private getNewKeyPair(): PromiseLike<CryptoKeyPair> {
    if (!environment.production) {
      return Promise.all([
        window.crypto.subtle.importKey('pkcs8', convertPemToBinary(`-----BEGIN PRIVATE KEY-----
MIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCj5z5afUhS9cjE
koGkk2O0fSjhsqjrwEAEAaUP+1wVFTgE5tzb+nKGDAO8NA6gcoQYmUwT7CX+0nC4
LbfcLS0nQ4Qyg8IdxC4HJB3m9EktwIxDJpbDhSKfHvOwfuwmCtP1amYnt6tAioz1
RB00QxWkhfhIOf3LrGCrohZLcf+UXN761N0FqOG0cEyyAt65Atv2ODnV9YCW+l9n
7yHfzcwsRmm/l3jrRI4XhjL/VDE9fGyPjv3tfzSz0IwvlUljYWhp6pdHDVA8W+hL
p0WOYjQcT6chUNB6de9oBwyPs4ajEVSYcE1YeMHsUJS/dO8fjUU8b9c97A/6br9R
b7SAFpndAgMBAAECggEAAKLHxuWYB3xdHkgcOSV6PEvFAhUlmx6IkQtplsWInqtR
p5E2t6LB2XvH8u23xc8T7J2Bok0m+5VY6xoATdoeA/o609BXizKE5DGzbP8zHnqS
ALuwV4tXbksaMmvXojEmD9xtD4fiofI3qEbunxKIjbYYV71j2uutB1VuZTYIwgxV
lvf6vYDl/7kGKjf1Kpge5WmqzU6QKtH4g7x6cpQ11ygaRA4L0Q4dI/hByWmNvUME
ABuoEUoX05gCoyfbGF91t6VBpei511pHkKPZBaTfIOEdqut8oi2MSKeq9hbes1BD
+9dNLRiEi0c0CpV5X5qvdIp3vZIa18PaGnGhiKL60QKBgQDjq8tzcxyUtg/cpdbq
JEE+xF3VAv2K/kj5FaG0x1rvVGDpXC4GQYpZ0u62bVdMTy4mdoGjQ6SbLpDOSdRo
oVQNv6tXyWNFvlRw+7KZvG3O/Un5yFGM6Xb371vILbX1N+O617oM0VUedSRZxndg
aiz01lEHc5MxYD7G5uF79Md8rQKBgQC4TDK8Z94biMzKbDShNZGLimUgokVDfuDj
uMKK/hxaFR85PpknC3cMqeL/Cvl4HyJ2TcFo0HUKGm6UsyoYqVP/Ly6XLLyrAtDs
8mdK6nqKH4gFafVkoKvv95XA+jMk/ngP9Ed6RoDi2lp6HfpT+opKohuB+FDmydF0
uFpjkheH8QKBgAQwhx/qwF3kM8qFqrzISgMTrf5bfbrvDvy2bzFaccvxq47fyWEI
F7mrbgUhYfffhSPkDmKovgC1DKkfJq9+OIPAQTDuXctMw1UI7LJziznB43ibPRTw
vuW1G+VFIhIPIzuu+Jd/yqcy1KZqRowZqBYhU4BlmhHQiZczbHbRfFJJAoGAQlw9
kJWd5jA1/VVFBh8xzxsAGuYTJqCS/axTcJTbRJyCZ6xgnSyFq2uorskW1ufvEsYg
tEsLOZ4W3zg8GjEua55jmk+jh7g13nvSMamIgh+kbL6ge6FXB8sQgzIUJGf0d1ow
OpkUY5rYJUySDJcUIJeKbBwrlU5qOyr+cQfzrSECgYBa3vxZ4H3pfjWMdffewnNS
iTjCwsV9sQtHIPOUhZQzVPOCKTJPlVh4S7mMddtcPGQoxsi+FyV755kMsTbXUGfp
578fmbOU6G13V+KtLIckVGdCJcPL++9EvYmlDwRSb96Mgc5I/GF2ObqdeEP8FgKm
HdVxQ2R1fPPhbZAeffLjMw==
-----END PRIVATE KEY-----`), {
          name: 'RSA-OAEP',
          hash: {name: 'SHA-256'}
        }, true, ['decrypt']),
        window.crypto.subtle.importKey('spki', convertPemToBinary(`-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAo+c+Wn1IUvXIxJKBpJNj
tH0o4bKo68BABAGlD/tcFRU4BObc2/pyhgwDvDQOoHKEGJlME+wl/tJwuC233C0t
J0OEMoPCHcQuByQd5vRJLcCMQyaWw4Uinx7zsH7sJgrT9WpmJ7erQIqM9UQdNEMV
pIX4SDn9y6xgq6IWS3H/lFze+tTdBajhtHBMsgLeuQLb9jg51fWAlvpfZ+8h383M
LEZpv5d460SOF4Yy/1QxPXxsj4797X80s9CML5VJY2FoaeqXRw1QPFvoS6dFjmI0
HE+nIVDQenXvaAcMj7OGoxFUmHBNWHjB7FCUv3TvH41FPG/XPewP+m6/UW+0gBaZ
3QIDAQAB
-----END PUBLIC KEY-----`), {
          name: 'RSA-OAEP',
          hash: {name: 'SHA-256'}
        }, true, ['encrypt'])
      ]).then(keyArray => ({
        publicKey: keyArray[1],
        privateKey: keyArray[0]
      }));
    } else {
      return window.crypto.subtle.generateKey({
        name: 'RSA-OAEP',
        modulusLength: 2048,
        publicExponent: new Uint8Array([1, 0, 1]),
        hash: {name: 'SHA-256'}
      }, true, ['encrypt', 'decrypt']);
    }
  }
  private unwrapKey(wrappedAes: ArrayBuffer): PromiseLike<CryptoKey> {
    // if (!environment.production) {
    // mock should return this value :)
    // return window.crypto.subtle.importKey('raw', base64StringToArrayBuffer('NJ0kjxOJcRjI1h/oe7iUXg=='),
    // 'AES-CTR', true, ['encrypt', 'decrypt']);
    // } else {
    return window.crypto.subtle.importKey('raw', wrappedAes,
      'AES-CTR', true, ['encrypt', 'decrypt']);
    // }
  }
  /!**
   * Returns a key after negotiation with the server.
   * @param {string} token The auth token
   * @param {string[]} attributeIds The attributes for which a key exists
   *!/
  getSymmetricKeysFromServer(token: string, attributeIds: string[]): PromiseLike<CryptoKey> {
    // TODO: ciphers?
    return this.getNewKeyPair().then(key => {
      return this.publicToPem(key).then(publicPem => {
        return <any>this.httpHandler(token, 'post', environment.exchangeEndpoint, 'CRYPTO ERROR', {
          attributeIds: attributeIds,
          publicKey: publicPem
        }).then((wrappedKeys: { keys: string[] }) => {
          return Promise.all(wrappedKeys.keys.map(wrappedKey => window.crypto.subtle
            .decrypt('RSA-OAEP', key.privateKey, base64StringToArrayBuffer(wrappedKey))
            .then(this.unwrapKey.bind(this))));
        });
      });
    });
  }
  getAttributeById(token: string, attributeId: string): Promise<Attribute> {
    return new Promise<Attribute>((resolve, reject) => {
      this.getSymmetricKeysFromServer(token, [attributeId]).then(aesKeys => {
        this.httpHandler<Attribute>(token, 'get', environment.attributeEndpoint + '/' + attributeId, 'ATTR ERROR').then(attribute => {
          window.crypto.subtle.decrypt({
            name: 'AES-CTR',
            length: 128,
            counter: environment.counter
          }, aesKeys[0], base64StringToArrayBuffer(attribute.encAttributeValue)).then(value => {
            const subject = JSON.parse(atob(arrayBufferToBase64String(value)));
            Object.getOwnPropertyNames(subject).forEach(key => {
              attribute[key] = subject[key];
            });
            resolve(attribute);
          }, reject.bind(undefined, 'attributes.noFetch'));
        }, reject);
      }, reject.bind(undefined, 'attributes.noFetch'));
    });
  }
  createAttribute(token: string, body: Attribute): Promise<Attribute> {
    return new Promise<Attribute>((resolve, reject) => {
      this.getSymmetricKeysFromServer(token, [body.id]).then(aesKeys => {
        const subject: { [id: string]: string } = {};
        Object.getOwnPropertyNames(body).filter(n => ATTRIBUTE_KEYS.indexOf(n) === -1).forEach(key => {
          subject[key] = body[key];
        });
        window.crypto.subtle.encrypt({
          name: 'AES-CTR',
          length: 128,
          counter: environment.counter
        }, aesKeys[0], base64StringToArrayBuffer(JSON.stringify(subject), true)).then(value => {
          body['cbc:encAttributeValue'] = arrayBufferToBase64String(value);
          this.httpHandler(token, 'post', environment.attributeEndpoint + body.id, 'ATTR ERROR', body).then(resolve, reject);
        }, reject.bind(undefined, 'attributes.noPut'));
      }, reject.bind(undefined, 'attributes.noPut'));
    });
  }
  updateAttribute(token: string, body: Attribute): Promise<Attribute> {
    return new Promise<Attribute>((resolve, reject) => {
      this.getSymmetricKeysFromServer(token, [body.id]).then(aesKeys => {
        const subject: { [id: string]: string } = {};
        Object.getOwnPropertyNames(body).filter(n => ATTRIBUTE_KEYS.indexOf(n) === -1).forEach(key => {
          subject[key] = body[key];
        });
        window.crypto.subtle.encrypt({
          name: 'AES-CTR',
          length: 128,
          counter: environment.counter
        }, aesKeys[0], base64StringToArrayBuffer(JSON.stringify(subject), true)).then(value => {
          body['cbc:encAttributeValue'] = arrayBufferToBase64String(value);
          this.httpHandler(token, 'put', environment.attributeEndpoint + body.id, 'ATTR ERROR', body).then(resolve, reject);
        }, reject.bind(undefined, 'attributes.noPut'));
      }, reject.bind(undefined, 'attributes.noPut'));
    });
  }
*/
}
