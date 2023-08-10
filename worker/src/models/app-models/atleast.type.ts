export type AtLeast<T, K extends keyof T> = Partial<T> & Pick<T, K>;
export type AtLeast2<T, K extends keyof T, K2 extends keyof T> = Partial<T> & Pick<T, K> & Pick<T, K2>;
