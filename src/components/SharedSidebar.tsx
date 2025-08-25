import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  Book,
  Users,
  UserCheck,
  Settings,
  Building2,
  LogOut,
  User2,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import logo from "@/assets/images/LOGO-NOTEXT.png";

const SharedSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  return (
    <Sidebar collapsible="icon" className="border-r">
      <div className="flex items-center justify-center p-4 group-data-[collapsible=icon]:hidden">
        <img src={logo} alt="VocalBorn Logo" className="h-20 w-auto" />
      </div>
      <SidebarHeader className="">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/admin" className="font-semibold">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Building2 className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">VocalBorn</span>
                  <span className="truncate text-xs text-muted-foreground">
                    後台管理系統
                  </span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>管理功能</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  tooltip="課程管理"
                  className={
                    isActive("/admin/courses") ? "bg-gray-200" : ""
                  }
                >
                  <a href="/admin/courses">
                    <Book />
                    <span>課程管理</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  tooltip="使用者管理"
                  className={
                    isActive("/admin/users") ? "bg-gray-200" : ""
                  }
                >
                  <a href="/admin/users">
                    <Users />
                    <span>使用者管理</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  tooltip="治療師管理"
                  className={
                    isActive("/admin/therapists") ? "bg-gray-200" : ""
                  }
                >
                  <a href="/admin/therapists">
                    <UserCheck />
                    <span>治療師管理</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup className="mt-auto">
          <div className="flex flex-col ">
            <DropdownMenu>
              <DropdownMenuTrigger>
                <div className="flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left hover:bg-gray-100 group-data-[collapsible=icon]:hidden">
                  <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-gray-200">
                    <User2 className="h-5 w-5 text-gray-500" />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight ">
                    <span className="truncate font-medium">
                      {user?.name || "使用者名稱"}
                    </span>
                    <span className="text-muted-foreground truncate text-xs">
                      {user?.email || "user@example.com"}
                    </span>
                  </div>
                </div>
                <div className="hidden group-data-[collapsible=icon]:flex h-8 w-8 rounded-md hover:bg-gray-100">
                    <div className="items-center justify-center p-2 ">
                      <User2 className="h-4 w-4 text-gray-500" />
                    </div>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {user && (
                  <>
                    <div className="px-2 py-1.5">
                      <p className="text-sm font-medium">{user.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                    <DropdownMenuSeparator />
                  </>
                )}
                <DropdownMenuItem asChild>
                  <a
                    href="/admin/profile"
                    className="flex items-center"
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    <span>個人資料設定</span>
                  </a>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="flex items-center text-red-600"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>登出</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default SharedSidebar;
