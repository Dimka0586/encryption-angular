import {Attribute} from './attribute';

export class Service {
  constructor(public id: string, public serviceDefinitionId: string, public name: string, public attributes: Attribute[]) { }
}
