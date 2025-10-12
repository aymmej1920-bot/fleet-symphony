import { ReactNode } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { Bell, Car } from "lucide-react";

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="border-b border-border bg-card sticky top-0 z-10">
            <div className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-3">
                <SidebarTrigger />
                <div className="flex items-center gap-3">
                  <div className="gradient-primary rounded-xl p-2 shadow-glow">
                    <Car className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold">FleetManager Pro</h1>
                    <p className="text-xs text-muted-foreground">Gestion intelligente de flotte</p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-destructive text-[10px] text-white flex items-center justify-center">
                    3
                  </span>
                </Button>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 bg-background">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};
