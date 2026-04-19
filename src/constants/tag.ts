export const TAG_PAGE_SIZE = 10;

export const TAG_SORT_OPTIONS: {
  label: string;
  sortBy: string;
  sortDir: 'asc' | 'desc';
}[] = [
    { label: 'Mới nhất', sortBy: 'createdAt', sortDir: 'desc' },
    { label: 'Cũ nhất', sortBy: 'createdAt', sortDir: 'asc' },
    { label: 'Tên A-Z', sortBy: 'name', sortDir: 'asc' },
    { label: 'Tên Z-A', sortBy: 'name', sortDir: 'desc' },
  ];
