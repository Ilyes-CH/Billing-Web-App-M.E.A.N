import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'white'
})
export class WhitePipe implements PipeTransform {

  transform(input: any): string {
     input.style.color = 'white'
     return input;
  }

}
