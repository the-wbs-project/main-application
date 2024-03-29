export const sorter = (
  a: string | number | Date,
  b: string | number | Date,
  direction: 'asc' | 'desc' = 'asc'
): number => {
  if (direction === 'asc') {
    return a < b ? -1 : a > b ? 1 : 0;
  }
  return a < b ? 1 : a > b ? -1 : 0;
};
