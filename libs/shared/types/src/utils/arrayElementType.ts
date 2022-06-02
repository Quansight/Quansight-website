export type ArrayElementType<ArrType> =
  ArrType extends readonly (infer ElementType)[] ? ElementType : never;
