function objectToString(o: any) {
  return Object.prototype.toString.call(o);
}

export function isArray(value: any): value is Array<any> {
  return typeof value === 'object' && objectToString(value).slice(8, -1) === 'Array';
}

export function isObject(value: any): value is Record<string, any> {
  return typeof value === 'object' && objectToString(value).slice(8, -1) === 'Object';
}

export function upperCaseFirstChat(str: string) {
  return str.replace(/( |^)[a-z]/g, (L: string) => L.toUpperCase())
}