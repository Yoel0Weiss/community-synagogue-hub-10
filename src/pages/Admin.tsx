
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import PrayerTimesManager from "@/components/admin/PrayerTimesManager";
import EventsManager from "@/components/admin/EventsManager";
import AdminLogin from "@/components/admin/AdminLogin";

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated
    const adminToken = localStorage.getItem("adminToken");
    if (adminToken) {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    setIsAuthenticated(false);
    toast({
      title: "התנתקת בהצלחה",
      description: "יצאת ממערכת הניהול",
    });
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">טוען...</div>;
  }

  if (!isAuthenticated) {
    return <AdminLogin onLoginSuccess={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="min-h-screen bg-accent">
      <header className="bg-primary text-accent p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">לוח בקרה - בית הכנסת</h1>
          <Button variant="outline" onClick={handleLogout}>התנתק</Button>
        </div>
      </header>

      <main className="container mx-auto py-8 px-4">
        <Tabs defaultValue="prayers" className="w-full">
          <TabsList className="mb-8 w-full md:w-auto">
            <TabsTrigger value="prayers">זמני תפילות</TabsTrigger>
            <TabsTrigger value="events">אירועים</TabsTrigger>
          </TabsList>
          <TabsContent value="prayers">
            <PrayerTimesManager />
          </TabsContent>
          <TabsContent value="events">
            <EventsManager />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Admin;
