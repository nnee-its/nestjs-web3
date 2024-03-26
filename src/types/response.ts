export interface PaginationResponse<T = unknown> {
  data: T[]
  meta: {
    total: number
    page: number
    take: number
    lastPage: number
  }
}
