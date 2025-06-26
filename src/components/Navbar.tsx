import { Link, useNavigate } from "react-router-dom";
import { UserCircle, Book, Users, LogOut, Settings } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";

export default function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'admin':
        return '管理員';
      case 'therapist':
        return '語言治療師';
      case 'client':
        return '一般用戶';
      default:
        return role;
    }
  };

  return (
    <nav className="border-b">
      <div className="flex h-16 items-center px-4">
        <div className="flex items-center space-x-4">
          <h2 className="text-lg font-semibold">VocalBorn Admin</h2>
        </div>
        
        <div className="flex items-center space-x-6 ml-auto">
          {/* 課程管理 */}
          <Link 
            to="/admin/courses" 
            className="flex items-center space-x-2 text-sm font-medium transition-colors hover:text-primary"
          >
            <Book className="h-4 w-4" />
            <span className="hidden md:inline">課程管理</span>
          </Link>

          {/* 使用者管理 */}
          <Link 
            to="/admin/users" 
            className="flex items-center space-x-2 text-sm font-medium transition-colors hover:text-primary"
          >
            <Users className="h-4 w-4" />
            <span className="hidden md:inline">使用者管理</span>
          </Link>

          {/* 個人資料選單 */}
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center space-x-2 hover:text-primary">
              <UserCircle className="h-6 w-6" />
              {user && (
                <div className="hidden sm:flex flex-col items-start">
                  <span className="text-sm font-medium">{user.name}</span>
                  <span className="text-xs text-muted-foreground">{getRoleDisplayName(user.role)}</span>
                </div>
              )}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {user && (
                <>
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.account_id}</p>
                    <p className="text-xs text-muted-foreground">{getRoleDisplayName(user.role)}</p>
                  </div>
                  <DropdownMenuSeparator />
                </>
              )}
              <DropdownMenuItem asChild>
                <Link to="/admin/profile" className="flex items-center">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>個人資料設定</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="flex items-center text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                <span>登出</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}
