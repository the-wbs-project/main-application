export const sorter = (
  a: string | number,
  b: string | number,
  direction: 'asc' | 'desc' = 'asc'
): number => {
  const x = direction === 'asc' ? -1 : 1;

  return x * (a < b ? -1 : a > b ? 1 : 0);
};
