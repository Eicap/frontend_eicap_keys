import { Navigate, createFileRoute, Outlet } from '@tanstack/react-router'
import { useAuthStore } from '@/store/auth'
import { useBreadcrumbStore } from '@/store/breadcrumb'
import { AppSidebar } from '@/components/sidebar/app-sidebar'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { breadcrumb } from '@/constants/breadcrumb'

export const Route = createFileRoute('/_protected')({
  component: ProtectedLayout,
})

function ProtectedLayout() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const breadcrumbs = useBreadcrumbStore((state) => state.breadcrumbs)

  if (!isAuthenticated) {
    return <Navigate to="/" />
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 border-b">
          <div className="flex items-center gap-2 px-4 w-full">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href={breadcrumb.dashboard.path}>
                    {breadcrumb.dashboard.label}
                  </BreadcrumbLink>
                </BreadcrumbItem>

                {breadcrumbs.map(({ label, path }, index) => (
                  <BreadcrumbItem key={path}>
                    <BreadcrumbSeparator />
                    {index === breadcrumbs.length - 1 ? (
                      <BreadcrumbPage>{label}</BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink href={path}>{label}</BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
