import { Injectable, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';

export interface TitleInfo {
  level?: number;
  dimension?: string;
  subdimension?: string;
}

@Injectable({ providedIn: 'root' })
export class TitleService {
  readonly titleInfo = signal<TitleInfo | null>(null);
  readonly titleInfo$ = toObservable(this.titleInfo);

  constructor() {}

  setTitle(titleInfo: TitleInfo | null): void {
    this.titleInfo.set(titleInfo);
  }

  clearTitle(): void {
    this.titleInfo.set(null);
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
