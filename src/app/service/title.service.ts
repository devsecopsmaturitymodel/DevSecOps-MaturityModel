import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface TitleInfo {
  level?: number;
  dimension?: string;
  subdimension?: string;
}

@Injectable({ providedIn: 'root' })
export class TitleService {
  private titleSubject = new BehaviorSubject<TitleInfo | null>(null);
  public readonly titleInfo$ = this.titleSubject.asObservable();

  constructor() {}

  setTitle(titleInfo: TitleInfo | null): void {
    this.titleSubject.next(titleInfo);
  }

  clearTitle(): void {
    this.titleSubject.next(null);
  }

  formatTitle(titleInfo: TitleInfo | null, defaultTitle: string): string {
    if (!titleInfo) {
      return defaultTitle;
    }

    let parts: string[] = [];

    if (titleInfo.dimension) {
      parts.push(titleInfo.dimension);
    }

    if (titleInfo.level !== undefined) {
      parts.push(`Level ${titleInfo.level}`);
    }

    if (titleInfo.subdimension) {
      parts.push(titleInfo.subdimension);
    }

    return parts.length > 0 ? parts.join(' - ') : defaultTitle;
  }
}
