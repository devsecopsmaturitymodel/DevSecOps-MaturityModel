import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ToStringValue',
  pure: true,
})
export class ToStringValuePipe implements PipeTransform {
  transform(value: unknown): string {
    return value as string;
  }
}
