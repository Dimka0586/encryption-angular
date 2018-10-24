import {Service} from './service';

export class Customer {
  constructor(public id: string, public name: string, public type: string, public services: Service[]) {}
}
