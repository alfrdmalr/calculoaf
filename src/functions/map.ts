export function map<T, K>(list: Array<T>, fn: (item: T) => K): Array<K> {
  const result = [];  
  for (const element of list) {
    result.push(fn(element));
  }
  return result;
}

export function mapMap<T, V, K>(map: Map<T, V>, fn: (item: V) => K): Map<T, K> {
  const result = new Map<T, K>();
  for (const [key, value] of map) {
    result.set(key, fn(value)); 
  }
  return result;
}
