import { PaginationResponse } from "src/types/response"

export function paginationResponse<T>(
  data: T[],
  total: number,
  page: number,
  take: number,
): PaginationResponse<T> {
  return {
    data,
    meta: {
      total,
      page,
      take,
      lastPage: Math.ceil(total / take),
    },
  }
}
