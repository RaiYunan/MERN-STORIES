import { Calendar, Home, Inbox, Search, Settings } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Link, useLocation } from "react-router-dom"

const items = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "Library",
    url: "/library",
    icon: Inbox,
  },
  {
    title: "Schedule",
    url: "/schedule",
    icon: Calendar,
  },
  {
    title: "Discover",
    url: "/discover",
    icon: Search,
  },
  {
    title: "Analytics",
    url: "/analytics",
    icon: Settings,
  },
]

const categories = [
  {
    title: "Productivity",
    url: "/productivity",
    icon: Home,
  },
  {
    title: "Learning",
    url: "/learning",
    icon: Inbox,
  },
  {
    title: "Development",
    url: "/development",
    icon: Calendar,
  },
  {
    title: "Finance",
    url: "/finance",
    icon: Search,
  },
  {
    title: "Travel",
    url: "/travel",
    icon: Settings,
  },
]

const AppSideBar = () => {
  const location = useLocation()
  
  const isActive = (path: string) => {
    return location.pathname === path
  }

  return (
    <Sidebar collapsible="icon" className="border-r border-gray-100 mt-16">
      <SidebarContent className="py-6">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const Icon = item.icon
                const active = isActive(item.url)
                
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link 
                        to={item.url}
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                          active 
                            ? "bg-gray-100 text-gray-900" 
                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                        }`}
                      >
                        <Icon className={`h-4 w-4 ${active ? "text-gray-900" : "text-gray-500"}`} />
                        <span className="font-medium">{item.title}</span>
                        {active && (
                          <div className="ml-auto h-1.5 w-1.5 rounded-full bg-gray-900" />
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
            
            <div className="my-6">
              <div className="px-3 mb-2">
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Categories
                </span>
              </div>
              <SidebarMenu>
                {categories.map((item) => {
                  const Icon = item.icon
                  const active = isActive(item.url)
                  
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <Link 
                          to={item.url}
                          className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                            active 
                              ? "bg-gray-100 text-gray-900" 
                              : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                          }`}
                        >
                          <Icon className={`h-4 w-4 ${active ? "text-gray-900" : "text-gray-500"}`} />
                          <span className="font-medium">{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}

export default AppSideBar