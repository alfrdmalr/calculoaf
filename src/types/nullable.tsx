export type Nullable<T> = {
  [Property in keyof T]: T[Property] | null;
};
