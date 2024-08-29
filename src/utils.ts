export function sum(list: number[]): number {
  return list.reduce((acc, value) => acc + value, 0);
}

export function sumBy<T>(list: T[], getValue: (item: T) => number): number {
  return list.reduce((acc, item) => acc + getValue(item), 0);
}
