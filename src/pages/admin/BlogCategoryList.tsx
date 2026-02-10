import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  SearchOutlined,
  ReloadOutlined,
  ExportOutlined,
  EyeOutlined,
  EditOutlined,
  DownOutlined,
  FilterOutlined,
  SortAscendingOutlined,
  TagsOutlined,
} from '@ant-design/icons'
import { blogCategoryService } from '@/services/api/blogCategoryService'
import type {
  BlogCategoryResponse,
  BlogCategoryStatus,
  BlogCategoryListParams,
} from '@/types/blog'

/* ─── constants ─── */
const PAGE_SIZE = 10

const STATUS_OPTIONS: { label: string; value: BlogCategoryStatus | '' }[] = [
  { label: 'All', value: '' },
  { label: 'Active', value: 'ACTIVE' },
  { label: 'Archived', value: 'ARCHIVED' },
]

const SORT_OPTIONS: {
  label: string
  sortBy: string
  sortDir: 'asc' | 'desc'
}[] = [
    { label: 'Latest', sortBy: 'createdAt', sortDir: 'desc' },
    { label: 'Oldest', sortBy: 'createdAt', sortDir: 'asc' },
    { label: 'Name A-Z', sortBy: 'name', sortDir: 'asc' },
    { label: 'Name Z-A', sortBy: 'name', sortDir: 'desc' },
  ]

/* ─── helpers ─── */
const formatDate = (iso: string) => {
  const d = new Date(iso)
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  })
}

/** Generate a two-letter abbreviation from a category name */
const getInitials = (name: string) =>
  name
    .split(/\s+/)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

/* ─── component ─── */
export function BlogCategoryList() {
  const navigate = useNavigate()

  /* ── state ── */
  const [categories, setCategories] = useState<BlogCategoryResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // pagination
  const [currentPage, setCurrentPage] = useState(0) // 0-indexed
  const [totalElements, setTotalElements] = useState(0)
  const [totalPages, setTotalPages] = useState(0)

  // filters
  const [searchQuery, setSearchQuery] = useState('')
  const [appliedSearch, setAppliedSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<BlogCategoryStatus | ''>('')
  const [sortIndex, setSortIndex] = useState(0)

  // dropdown visibility
  const [showStatusDropdown, setShowStatusDropdown] = useState(false)
  const [showSortDropdown, setShowSortDropdown] = useState(false)

  /* ── fetch ── */
  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const sort = SORT_OPTIONS[sortIndex]
      const params: BlogCategoryListParams = {
        page: currentPage,
        size: PAGE_SIZE,
        search: appliedSearch || undefined,
        status: statusFilter || undefined,
        sortBy: sort.sortBy,
        sortDir: sort.sortDir,
      }

      const response = await blogCategoryService.getCategories(params)
      const page = response.data

      setCategories(page.content)
      setTotalElements(page.totalElements)
      setTotalPages(page.totalPages)
    } catch (_err) {
      setError('Unable to load blog categories. Please try again later.')
      setCategories([])
    } finally {
      setLoading(false)
    }
  }, [currentPage, appliedSearch, statusFilter, sortIndex])

  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  /* ── handlers ── */
  const handleSearch = () => {
    setCurrentPage(0)
    setAppliedSearch(searchQuery)
  }

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch()
  }

  const handleStatusChange = (value: BlogCategoryStatus | '') => {
    setStatusFilter(value)
    setCurrentPage(0)
    setShowStatusDropdown(false)
  }

  const handleSortChange = (index: number) => {
    setSortIndex(index)
    setCurrentPage(0)
    setShowSortDropdown(false)
  }

  const handleRefresh = () => {
    fetchCategories()
  }

  const handleExport = () => {
    // Export as CSV (basic implementation)
    const header = 'Category Name,Status,Number of Posts,Created Date\n'
    const rows = categories
      .map(
        (c) =>
          `"${c.name}","${c.status}",${c.postCount},"${formatDate(c.createdAt)}"`
      )
      .join('\n')
    const blob = new Blob([header + rows], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'blog-categories.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  const goToPage = (page: number) => {
    if (page >= 0 && page < totalPages) setCurrentPage(page)
  }

  /* ── pagination logic ── */
  const buildPageNumbers = (): (number | '...')[] => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i)
    const pages: (number | '...')[] = [0]
    if (currentPage > 2) pages.push('...')
    for (
      let i = Math.max(1, currentPage - 1);
      i <= Math.min(totalPages - 2, currentPage + 1);
      i++
    ) {
      pages.push(i)
    }
    if (currentPage < totalPages - 3) pages.push('...')
    pages.push(totalPages - 1)
    return pages
  }

  const startItem = totalElements === 0 ? 0 : currentPage * PAGE_SIZE + 1
  const endItem = Math.min((currentPage + 1) * PAGE_SIZE, totalElements)

  /* ──────────────────── RENDER ──────────────────── */
  return (
    <div className="mx-auto max-w-[1100px]">
      {/* ── Header ── */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Blog Category List
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage and organize your blog topics and sub-categories
          </p>
        </div>
        <button
          id="export-btn"
          onClick={handleExport}
          className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-white px-4 py-2 text-sm font-semibold text-emerald-700 shadow-sm transition-colors hover:bg-emerald-50"
        >
          <ExportOutlined />
          Export
        </button>
      </div>

      {/* ── Filters ── */}
      <div className="mb-5 flex items-center gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <SearchOutlined className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            id="search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearchKeyDown}
            placeholder="Search categories..."
            className="h-10 w-full rounded-lg border border-gray-200 bg-white pl-10 pr-4 text-sm text-gray-700 outline-none transition-shadow placeholder:text-gray-400 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
          />
        </div>

        {/* Status filter */}
        <div className="relative">
          <button
            id="status-filter"
            onClick={() => {
              setShowStatusDropdown(!showStatusDropdown)
              setShowSortDropdown(false)
            }}
            className="flex h-10 items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 text-sm text-gray-600 transition-colors hover:bg-gray-50"
          >
            <FilterOutlined className="text-xs text-gray-400" />
            Status:{' '}
            {STATUS_OPTIONS.find((o) => o.value === statusFilter)?.label}
            <DownOutlined className="text-[10px] text-gray-400" />
          </button>
          {showStatusDropdown && (
            <div className="absolute right-0 top-full z-20 mt-1 w-40 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg">
              {STATUS_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => handleStatusChange(opt.value)}
                  className={`block w-full px-4 py-2 text-left text-sm transition-colors hover:bg-emerald-50 ${statusFilter === opt.value
                    ? 'bg-emerald-50 font-semibold text-emerald-700'
                    : 'text-gray-600'
                    }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Sort */}
        <div className="relative">
          <button
            id="sort-filter"
            onClick={() => {
              setShowSortDropdown(!showSortDropdown)
              setShowStatusDropdown(false)
            }}
            className="flex h-10 items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 text-sm text-gray-600 transition-colors hover:bg-gray-50"
          >
            <SortAscendingOutlined className="text-xs text-gray-400" />
            Sort: {SORT_OPTIONS[sortIndex].label}
            <DownOutlined className="text-[10px] text-gray-400" />
          </button>
          {showSortDropdown && (
            <div className="absolute right-0 top-full z-20 mt-1 w-40 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg">
              {SORT_OPTIONS.map((opt, i) => (
                <button
                  key={opt.label}
                  onClick={() => handleSortChange(i)}
                  className={`block w-full px-4 py-2 text-left text-sm transition-colors hover:bg-emerald-50 ${sortIndex === i
                    ? 'bg-emerald-50 font-semibold text-emerald-700'
                    : 'text-gray-600'
                    }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Refresh */}
        <button
          id="refresh-btn"
          onClick={handleRefresh}
          className="flex h-10 items-center gap-2 rounded-lg bg-emerald-700 px-5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-800"
        >
          <ReloadOutlined />
          Refresh
        </button>
      </div>

      {/* Close dropdowns on outside click */}
      {(showStatusDropdown || showSortDropdown) && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => {
            setShowStatusDropdown(false)
            setShowSortDropdown(false)
          }}
        />
      )}

      {/* ── Table ── */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        {/* Table header */}
        <div className="grid grid-cols-[2fr_1fr_1.2fr_1.2fr_0.8fr] items-center border-b border-gray-100 bg-gray-50/80 px-6 py-3.5">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
            Category Name
          </span>
          <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
            Status
          </span>
          <span className="text-center text-xs font-bold uppercase tracking-wider text-gray-500">
            Number of Posts
          </span>
          <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
            Created Date
          </span>
          <span className="text-right text-xs font-bold uppercase tracking-wider text-gray-500">
            Actions
          </span>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="space-y-0">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="grid grid-cols-[2fr_1fr_1.2fr_1.2fr_0.8fr] items-center border-b border-gray-50 px-6 py-5"
              >
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 animate-pulse rounded-lg bg-gray-200" />
                  <div className="h-4 w-28 animate-pulse rounded bg-gray-200" />
                </div>
                <div className="h-6 w-16 animate-pulse rounded-full bg-gray-200" />
                <div className="mx-auto h-4 w-10 animate-pulse rounded bg-gray-200" />
                <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
                <div className="flex justify-end gap-2">
                  <div className="h-8 w-8 animate-pulse rounded-lg bg-gray-200" />
                  <div className="h-8 w-8 animate-pulse rounded-lg bg-gray-200" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error state */}
        {!loading && error && (
          <div className="flex flex-col items-center justify-center px-6 py-16">
            <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
              <span className="text-2xl text-red-400">⚠</span>
            </div>
            <p className="text-sm font-medium text-gray-700">{error}</p>
            <button
              onClick={handleRefresh}
              className="mt-4 rounded-lg bg-emerald-700 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-800"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && categories.length === 0 && (
          <div className="flex flex-col items-center justify-center px-6 py-16">
            <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
              <TagsOutlined className="text-2xl text-gray-400" />
            </div>
            <p className="text-sm font-medium text-gray-600">
              No blog categories found.
            </p>
            <p className="mt-1 text-xs text-gray-400">
              Try adjusting your search or filters.
            </p>
          </div>
        )}

        {/* Data rows */}
        {!loading &&
          !error &&
          categories.map((cat) => (
            <div
              key={cat.id}
              className="grid grid-cols-[2fr_1fr_1.2fr_1.2fr_0.8fr] items-center border-b border-gray-50 px-6 py-4 transition-colors hover:bg-emerald-50/30"
            >
              {/* Name + icon */}
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-xs font-bold text-emerald-800">
                  {getInitials(cat.name)}
                </div>
                <span className="text-sm font-semibold text-gray-800">
                  {cat.name}
                </span>
              </div>

              {/* Status badge */}
              <div>
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${cat.status === 'ACTIVE'
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-gray-200 text-gray-600'
                    }`}
                >
                  {cat.status === 'ACTIVE' ? 'Active' : 'Archived'}
                </span>
              </div>

              {/* Post count */}
              <div className="text-center text-sm font-medium text-gray-600">
                {cat.postCount}
              </div>

              {/* Created date */}
              <div className="text-sm text-gray-500">
                {formatDate(cat.createdAt)}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-1.5">
                <button
                  id={`view-${cat.id}`}
                  title="View category"
                  onClick={() =>
                    navigate(`/admin/blog-categories/${cat.id}`)
                  }
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-emerald-100 hover:text-emerald-700"
                >
                  <EyeOutlined />
                </button>
                <button
                  id={`edit-${cat.id}`}
                  title="Edit category"
                  onClick={() =>
                    navigate(`/admin/blog-categories/${cat.id}/edit`)
                  }
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-emerald-100 hover:text-emerald-700"
                >
                  <EditOutlined />
                </button>
              </div>
            </div>
          ))}

        {/* ── Pagination ── */}
        {!loading && !error && totalElements > 0 && (
          <div className="flex items-center justify-between px-6 py-4">
            <span className="text-sm text-gray-500">
              Showing {startItem} to {endItem} of {totalElements} results
            </span>

            <div className="flex items-center gap-1">
              {/* Prev */}
              <button
                id="page-prev"
                disabled={currentPage === 0}
                onClick={() => goToPage(currentPage - 1)}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-sm text-gray-500 transition-colors hover:bg-gray-50 disabled:opacity-40"
              >
                ‹
              </button>

              {buildPageNumbers().map((p, i) =>
                p === '...' ? (
                  <span
                    key={`dots-${i}`}
                    className="flex h-8 w-8 items-center justify-center text-sm text-gray-400"
                  >
                    …
                  </span>
                ) : (
                  <button
                    key={p}
                    id={`page-${p}`}
                    onClick={() => goToPage(p)}
                    className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm font-medium transition-colors ${p === currentPage
                      ? 'bg-emerald-700 text-white shadow-sm'
                      : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                  >
                    {p + 1}
                  </button>
                )
              )}

              {/* Next */}
              <button
                id="page-next"
                disabled={currentPage >= totalPages - 1}
                onClick={() => goToPage(currentPage + 1)}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-sm text-gray-500 transition-colors hover:bg-gray-50 disabled:opacity-40"
              >
                ›
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default BlogCategoryList
