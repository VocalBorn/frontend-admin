import { Link } from "react-router-dom";
import { UserCircle, Book, Users, LogOut, Settings } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Navbar() {
  const handleLogout = () => {
    // TODO: 實作登出功能
    console.log("登出");
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
            to="/courses" 
            className="flex items-center space-x-2 text-sm font-medium transition-colors hover:text-primary"
          >
            <Book className="h-4 w-4" />
            <span className="hidden md:inline">課程管理</span>
          </Link>

          {/* 使用者管理 */}
          <Link 
            to="/users" 
            className="flex items-center space-x-2 text-sm font-medium transition-colors hover:text-primary"
          >
            <Users className="h-4 w-4" />
            <span className="hidden md:inline">使用者管理</span>
          </Link>

          {/* 個人資料選單 */}
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center space-x-2 hover:text-primary">
              <UserCircle className="h-6 w-6" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link to="/profile" className="flex items-center">
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
