export const TAG_PAGE_SIZE = 10;

export const TAG_SORT_OPTIONS: {
  label: string;
  sortBy: string;
  sortDir: 'asc' | 'desc';
}[] = [
    { label: 'Latest', sortBy: 'createdAt', sortDir: 'desc' },
    { label: 'Oldest', sortBy: 'createdAt', sortDir: 'asc' },
    { label: 'Name A-Z', sortBy: 'name', sortDir: 'asc' },
    { label: 'Name Z-A', sortBy: 'name', sortDir: 'desc' },
  ];
