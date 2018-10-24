import { Pipe, PipeTransform } from '@angular/core';

class ObjectProperty {
  constructor(public key: string, public value: ObjectProperty | string | number | boolean) {}
}


@Pipe({
  name: 'searchFilter'
})
export class SearchFilterPipe implements PipeTransform {

  transform(objects: any[], props?: ObjectProperty[]): any {

    let filtered = objects;
    for (const prop of props) {
      if (prop) {
        filtered = (prop.value) ? objects.filter(obj => {
          const sequence = this.buildPropSequence(prop);
          console.log('seq: ', sequence);
          if (sequence.val === undefined || sequence.val === '') {
            return true;
          }
          return this.filterObjects(obj, sequence);
        }) : filtered;
      }
    }
    return filtered;
  }

  buildPropSequence(prop: ObjectProperty, sequence?: {seq: string[], val: string | undefined}): {seq: string[], val: string | undefined} {
    sequence = (sequence) ? sequence : {seq: [], val: undefined};
    const propValueType = typeof prop.value;
    // console.log(propValueType);
    if ((propValueType === 'string')) {
      sequence.seq.push(prop.key);
      sequence.val = <string>prop.value;
      return sequence;
    } else if ((propValueType === 'undefined')) {
      sequence.seq.push(prop.key);
      sequence.val = undefined;
      return sequence;
    } else {
      sequence.seq.push(prop.key);
      this.buildPropSequence(<ObjectProperty>prop.value, sequence);
      return sequence;
    }
  }

  filterObjects(obj: any, sequence: {seq: string[], val: string}): boolean {
    console.log('filter: ', obj, sequence);
    let filteredInside: any[];
      sequence.seq.forEach((propKey, index) => {
      if (obj[propKey] instanceof Array) {
        console.log('ifArray: ', obj[propKey]);
        filteredInside = (<Array<any>>obj[propKey]).filter(obj1 => {
          console.log('obj: ', obj1);
          console.log('before: ', sequence.seq);
          sequence.seq = sequence.seq.slice(index + 1);
          console.log('after: ', sequence.seq);
          return this.filterObjects(obj1, sequence);
        });
        console.log('filtered: ', filteredInside);
        return filteredInside.length > 0;
      } else {
        obj = obj[propKey];
      }

    });

    const equal = (obj === sequence.val) || (filteredInside && filteredInside.length > 0);
    console.log('oobj: ', obj, 'val:', sequence.val, 'equal: ', equal, 'filteredInside: ', filteredInside);
    return equal;
  }

}
