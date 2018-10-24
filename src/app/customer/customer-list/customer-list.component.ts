import { Component, OnInit } from '@angular/core';
import {Customer} from '../../model/customer';
import {Service} from '../../model/service';
import {CustomerExt} from '../../model/customer-ext';
import {Attribute} from '../../model/attribute';

@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.css']
})
export class CustomerListComponent implements OnInit {

  customers = [
    new CustomerExt('cn1', new Customer('c-id1', 'c1', 'person', [new Service('s-id-1', 'sd-id-1', 'Service1', [new Attribute('type1', 'value1')]), new Service('s-id-2', 'sd-id-4', 'Service5', [new Attribute('type1', 'value1')])])),
      new CustomerExt('cn2', new Customer('c-id2', 'c2', 'corporate', [new Service('s-id-2', 'sd-id-2', 'Service2', [new Attribute('type1', 'value1')]), new Service('s-id-1', 'sd-id-1', 'Service6', [new Attribute('type1', 'value1')])])),
        new CustomerExt('cn3', new Customer('c-id3', 'c3', 'corporate', [new Service('s-id-3', 'sd-id-1', 'Service3', [new Attribute('type2', 'value2')]), new Service('s-id-3', 'sd-id-3', 'Service7', [new Attribute('type1', 'value1')])])),
          new CustomerExt('cn4', new Customer('c-id4', 'c4', 'person', [new Service('s-id-4', 'sd-id-1', 'Service4', [new Attribute('type1', 'value3'), new Attribute('type1', 'value1')]), new Service('s-id-4', 'sd-id-2', 'Service8', [new Attribute('type1', 'value1')])]))
  ];

  sdId: string;
  sdIdTmp: string;
  type: string;
  typeTmp: string;

  constructor() { }

  ngOnInit() {
  }

  filter() {
    this.sdId = this.sdIdTmp;
    this.type = this.typeTmp;
  }

}
