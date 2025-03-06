
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash, Edit, Plus, Check, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

interface PrayerTime {
  id: string;
  location: string;
  type: string;
  day: string;
  time: string;
}

const PrayerTimesManager = () => {
  const [prayerTimes, setPrayerTimes] = useState<PrayerTime[]>([
    { id: "1", location: "בית הכנסת החדש", type: "שחרית", day: "רגיל", time: "אין מניין קבוע" },
    { id: "2", location: "בית הכנסת החדש", type: "מנחה", day: "רגיל", time: "13:30" },
    { id: "3", location: "בית הכנסת החדש", type: "מנחה", day: "רגיל", time: "15:45" },
    { id: "4", location: "בית הכנסת החדש", type: "ערבית", day: "רגיל", time: "18:00" },
    { id: "5", location: "מקומות אחרים", type: "שחרית", day: "ימים ב׳-ה׳", time: "6:50 - בית הכנסת תלפיות" },
    { id: "6", location: "מקומות אחרים", type: "שחרית", day: "ראש חודש וצומות", time: "6:40" },
  ]);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentPrayer, setCurrentPrayer] = useState<PrayerTime | null>(null);
  const [formData, setFormData] = useState({
    location: "בית הכנסת החדש",
    type: "שחרית",
    day: "רגיל",
    time: "",
  });

  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleAddPrayer = () => {
    const newPrayer = {
      id: Date.now().toString(),
      ...formData,
    };

    setPrayerTimes([...prayerTimes, newPrayer]);
    setIsAddDialogOpen(false);
    toast({
      title: "נוסף בהצלחה",
      description: "זמן התפילה נוסף בהצלחה",
    });

    // Reset form data
    setFormData({
      location: "בית הכנסת החדש",
      type: "שחרית",
      day: "רגיל",
      time: "",
    });
  };

  const handleEditPrayer = () => {
    if (!currentPrayer) return;
    
    const updatedPrayerTimes = prayerTimes.map((prayer) => 
      prayer.id === currentPrayer.id ? { ...prayer, ...formData } : prayer
    );
    
    setPrayerTimes(updatedPrayerTimes);
    setIsEditDialogOpen(false);
    setCurrentPrayer(null);
    toast({
      title: "עודכן בהצלחה",
      description: "זמן התפילה עודכן בהצלחה",
    });
  };

  const handleDeletePrayer = (id: string) => {
    setPrayerTimes(prayerTimes.filter((prayer) => prayer.id !== id));
    toast({
      title: "נמחק בהצלחה",
      description: "זמן התפילה נמחק בהצלחה",
    });
  };

  const openEditDialog = (prayer: PrayerTime) => {
    setCurrentPrayer(prayer);
    setFormData({
      location: prayer.location,
      type: prayer.type,
      day: prayer.day,
      time: prayer.time,
    });
    setIsEditDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">ניהול זמני תפילות</h2>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="ml-2 h-4 w-4" /> הוסף זמן תפילה
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {prayerTimes.map((prayer) => (
          <Card key={prayer.id} className="overflow-hidden">
            <CardHeader className="bg-primary-dark text-accent p-3">
              <CardTitle className="text-lg flex justify-between items-center">
                <span>{prayer.location} - {prayer.type}</span>
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => openEditDialog(prayer)}
                    className="h-8 w-8 p-0"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDeletePrayer(prayer.id)}
                    className="h-8 w-8 p-0"
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-semibold">יום:</span>
                  <span>{prayer.day}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">שעה:</span>
                  <span>{prayer.time}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add Prayer Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>הוספת זמן תפילה חדש</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label>מיקום</label>
              <Select
                defaultValue={formData.location}
                onValueChange={(value) => handleSelectChange("location", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="בחר מיקום" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="בית הכנסת החדש">בית הכנסת החדש</SelectItem>
                  <SelectItem value="מקומות אחרים">מקומות אחרים</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label>סוג תפילה</label>
              <Select
                defaultValue={formData.type}
                onValueChange={(value) => handleSelectChange("type", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="בחר סוג תפילה" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="שחרית">שחרית</SelectItem>
                  <SelectItem value="מנחה">מנחה</SelectItem>
                  <SelectItem value="ערבית">ערבית</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label>יום</label>
              <Input
                name="day"
                value={formData.day}
                onChange={handleInputChange}
                placeholder="לדוגמה: רגיל, ימים א'-ה', שבת"
              />
            </div>
            
            <div className="space-y-2">
              <label>שעה</label>
              <Input
                name="time"
                value={formData.time}
                onChange={handleInputChange}
                placeholder="לדוגמה: 18:00 או תיאור כגון 'שעה לפני שקיעה'"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsAddDialogOpen(false)}
            >
              <X className="ml-2 h-4 w-4" /> ביטול
            </Button>
            <Button onClick={handleAddPrayer}>
              <Check className="ml-2 h-4 w-4" /> הוסף
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Prayer Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>עריכת זמן תפילה</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label>מיקום</label>
              <Select
                value={formData.location}
                onValueChange={(value) => handleSelectChange("location", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="בחר מיקום" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="בית הכנסת החדש">בית הכנסת החדש</SelectItem>
                  <SelectItem value="מקומות אחרים">מקומות אחרים</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label>סוג תפילה</label>
              <Select
                value={formData.type}
                onValueChange={(value) => handleSelectChange("type", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="בחר סוג תפילה" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="שחרית">שחרית</SelectItem>
                  <SelectItem value="מנחה">מנחה</SelectItem>
                  <SelectItem value="ערבית">ערבית</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label>יום</label>
              <Input
                name="day"
                value={formData.day}
                onChange={handleInputChange}
                placeholder="לדוגמה: רגיל, ימים א'-ה', שבת"
              />
            </div>
            
            <div className="space-y-2">
              <label>שעה</label>
              <Input
                name="time"
                value={formData.time}
                onChange={handleInputChange}
                placeholder="לדוגמה: 18:00 או תיאור כגון 'שעה לפני שקיעה'"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              <X className="ml-2 h-4 w-4" /> ביטול
            </Button>
            <Button onClick={handleEditPrayer}>
              <Check className="ml-2 h-4 w-4" /> שמור שינויים
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PrayerTimesManager;
