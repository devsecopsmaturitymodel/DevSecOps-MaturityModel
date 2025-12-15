import { isEmptyObj } from '../util/util';
import { Activity } from './activity-store';

export class IgnoreList {
  list: Record<string, Record<string, boolean>> = {};

  add(type: string, id: string) {
    if (!this.list.hasOwnProperty(type)) {
      this.list[type] = {};
    }
    this.list[type][id] = true;
  }

  hasActivity(activity: Activity): boolean {
    if (isEmptyObj(this.list)) return false;

    for (let type in this.list) {
      let id: string = activity[type as keyof Activity].toString();
      if (this.list[type][id]) return true;
    }
    return false;
  }

  isEmpty(): boolean {
    return isEmptyObj(this.list);
  }
}
