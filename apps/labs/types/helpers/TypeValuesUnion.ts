export type TypeValuesUnion<T extends object> = {
  [k in keyof T]: T[k];
}[keyof T];
