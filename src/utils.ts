function objectToString(o: any) {
  return Object.prototype.toString.call(o);
}

export function isArray(value: any): value is Array<any> {
  return typeof value === 'object' && objectToString(value).slice(8, -1) === 'Array';
}