export function appendHashElement(hash: Record<string, any[]>, key: string, element: any): void {
  if (!hash.hasOwnProperty(key)) {
    hash[key] = [];
  }
  hash[key].push(element);
}
