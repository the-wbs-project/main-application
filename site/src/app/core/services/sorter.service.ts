export const sorter = (
  a: string | number,
  b: string | number,
  direction: 'asc' | 'desc' = 'asc'
): number => {
  if (direction === 'asc') {
    return a < b ? -1 : a > b ? 1 : 0;
  }
  return a < b ? 1 : a > b ? -1 : 0;
};
