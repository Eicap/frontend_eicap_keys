import { create } from 'zustand'

export interface BreadcrumbItem {
  label: string
  path: string
}

interface BreadcrumbStore {
  breadcrumbs: BreadcrumbItem[]
  setBreadcrumbs: (breadcrumbs: BreadcrumbItem[]) => void
  clearBreadcrumbs: () => void
}

export const useBreadcrumbStore = create<BreadcrumbStore>((set) => ({
  breadcrumbs: [],
  
  setBreadcrumbs: (breadcrumbs: BreadcrumbItem[]) => {
    set({ breadcrumbs })
  },
  
  clearBreadcrumbs: () => {
    set({ breadcrumbs: [] })
  },
}))
