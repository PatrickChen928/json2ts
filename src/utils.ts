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


export function objIsEqual(obj1: Record<string, any>, obj2: Record<string, any>) {
  for (let key in obj1) {
    if (isObject(obj1[key])) {
      if (!isObject(obj2[key])) {
        return false;
      }
      return objIsEqual(obj1[key], obj2[key]);
    }
    if (isArray(obj1[key])) {
      if (!isArray(obj2[key])) {
        return false;
      }
      // Todo
      return obj1[key].join(',') === obj2[key].join(',');
    }
    if (obj1[key] !== obj2[key]) {
      return false;
    }
  }
  return true;
}

export function stringifyObjAndSort(obj: Record<string, string>) {
  let keys = Object.keys(obj).sort();
  let res = `{`;
  for (let val of keys) {
    res += `${val}:${obj[val]},`;
  }
  res = res.replace(/,$/, '');
  res += '}';
  return res;
}

export function optimizeArray(arrTypes: Array<any>, root: string = '') {
  const optionalKeys: string[] = [];
  const keyCountMap = {};
  let objCount = 0;
  const newTypes = [];
  const typeObj = {};
  for (let i = 0; i < arrTypes.length; i++) {
    const type = arrTypes[i];
    if (isObject(type)) {
      objCount++;
      Object.keys(type).forEach(key => {
        // if (isObject(type[key])) {
        //   optimizeArray
        // }
        typeObj[key] = type[key];
        if (keyCountMap[`${root}>${key}`]) {
          keyCountMap[`${root}>${key}`] += 1;
        } else {
          keyCountMap[`${root}>${key}`] = 1;
        }
      });
    } else {
      newTypes.push(type);
    }
  }
  Object.keys(keyCountMap).forEach(key => {
    if (keyCountMap[key] < objCount) {
      optionalKeys.push(key);
    }
  });
  if (Object.keys(typeObj).length) {
    newTypes.push(typeObj);
  }
  return {
    optionalKeys,
    newTypes
  };
}

export function isOptional(optionalKeys: string[], key: string, parent = '') {
  const newKey = parent + '>' + key;
  for (const optionalKey of optionalKeys) {
    if (newKey === optionalKey) {
      return true;
    }
  }
  return false;
}