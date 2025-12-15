import { Activity } from './activity-store';

export interface Sector {
  dimension: string;
  level: number;
  activities: Activity[];
}
