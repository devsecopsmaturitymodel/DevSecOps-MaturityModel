import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ToStringValue',
  pure: true,
  standalone: true,
})
export class ToStringValuePipe implements PipeTransform {
  transform(value: unknown): string {
    return value as string;
  }
}
