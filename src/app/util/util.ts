export function perfNow(): string {
  return (performance.now() / 1000).toFixed(3);
}

export function isEmptyObj(obj: any): boolean {
  for (let tmp in obj) {
    return false;
  }
  return true;
}

export function hasData(obj: any): boolean {
  for (let tmp in obj) {
    return true;
  }
  return false;
}

export function deepCopy(obj: any): any {
  return JSON.parse(JSON.stringify(obj));
}

export function renameArrayElement(array: any[], oldName: string, newName: string): any[] {
  return array.map(item => (item === oldName ? newName : item));
}

export function equalArray(a: any[] | undefined | null, b: any[] | undefined | null): boolean {
  if (!a && !b) return true;
  if (!a || !b) return false;
  if (a.length !== b.length) return false;

  return a.every((v, i) => v === b[i]);
}

export function uniqueCount(array: any[]): number {
  const set: Set<any> = new Set(array);
  return set.size;
}

export function dateStr(
  date: Date | null | undefined,
  locale: string | null | undefined = undefined
): string {
  if (!date) return '';
  if (!locale) locale = navigator.language;

  return date.toLocaleDateString(locale, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
}
