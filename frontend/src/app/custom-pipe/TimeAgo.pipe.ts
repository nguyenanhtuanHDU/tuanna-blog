import { Pipe, PipeTransform } from '@angular/core';
import { formatDistanceToNow } from "date-fns";

@Pipe({
  name: 'TimeAgo'
})
export class TimeAgo implements PipeTransform {
  transform(time: any, args?: any): any {
    let timeRes;
    if (time) {
      timeRes = formatDistanceToNow(new Date(time), { addSuffix: true, includeSeconds: true });
    }
    return timeRes
  }
}
