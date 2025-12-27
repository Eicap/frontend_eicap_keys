import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'

interface UseTableFiltersOptions {
  initialOffset?: number
  initialLimit?: number
  initialSearchQuery?: string
  initialSearchField?: string
}

export function useTableFilters(options: UseTableFiltersOptions = {}) {
  const [offset, setOffset] = useState(options.initialOffset ?? 0)
  const [limit, setLimit] = useState(options.initialLimit ?? 10)
  const [searchQuery, setSearchQuery] = useState(options.initialSearchQuery ?? '')
  const [searchField, setSearchField] = useState(options.initialSearchField ?? '')
  const queryClient = useQueryClient()

  const resetFilters = () => {
    setOffset(0)
    setLimit(options.initialLimit ?? 10)
    setSearchQuery('')
    setSearchField(options.initialSearchField ?? '')
  }

  const handleOffsetChange = (newOffset: number) => {
    setOffset(Math.max(0, newOffset))
  }

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit)
    setOffset(0) // Reset a offset 0 cuando cambias el límite
  }

  const handleSearchQueryChange = (query: string) => {
    setSearchQuery(query)
    setOffset(0) // Reset a offset 0 cuando cambias la búsqueda
  }

  const handleSearchFieldChange = (field: string) => {
    setSearchField(field)
    setOffset(0) // Reset a offset 0 cuando cambias el campo
  }

  const invalidateQueries = (queryKey: string[]) => {
    queryClient.invalidateQueries({ queryKey })
  }

  return {
    offset,
    limit,
    searchQuery,
    searchField,
    setOffset: handleOffsetChange,
    setLimit: handleLimitChange,
    setSearchQuery: handleSearchQueryChange,
    setSearchField: handleSearchFieldChange,
    resetFilters,
    invalidateQueries,
  }
}
