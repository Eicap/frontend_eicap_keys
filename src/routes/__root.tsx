import { DialogCore } from '@/components/core/dialog.core';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Outlet, createRootRoute } from '@tanstack/react-router'
import { Toaster } from 'sonner'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,           // 5 minutos
      gcTime: 1000 * 60 * 10,             // 10 minutos
      retry: 1,                            // Reintentar 1 vez
      refetchOnWindowFocus: false,         // No refetch al volver a tab
    },
    mutations: {
      retry: 1,
    }
  }
});

export const Route = createRootRoute({
  component: () => (
    <QueryClientProvider client={queryClient}>
      <div className="flex flex-col min-h-screen">
        <main className="flex-1">
          <Outlet />
        </main>
        <DialogCore />
        <Toaster />
      </div>
    </QueryClientProvider>
  ),
})
