export const sorter = (a: string | number, b: string | number): number => {
  return a < b ? -1 : a > b ? 1 : 0;
};
