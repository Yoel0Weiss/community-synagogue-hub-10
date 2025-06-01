// src/components/admin/PrayerTimesManager.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash, Edit, Plus, Check, X, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import {
  getPrayerTimes,
  addPrayerTime,
  updatePrayerTime,
  deletePrayerTime,
  PrayerTime, // Use the interface from the API file
  PrayerTimeData // Use the interface for adding/editing data
} from "@/lib/prayerTimeApi"; // Import from the new API file

const PrayerTimesManager = () => {
  // --- State ---
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentPrayer, setCurrentPrayer] = useState<PrayerTime | null>(null); // Still need this to track which item is being edited
  const [formData, setFormData] = useState<PrayerTimeData>({ // Use PrayerTimeData for form
    location: "בית הכנסת החדש",
    type: "שחרית",
    day: "רגיל",
    time: "",
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // --- React Query ---

  // Query to fetch prayer times
  const { data: prayerTimes, isLoading: isLoadingPrayerTimes, isError: isErrorPrayerTimes } = useQuery<PrayerTime[], Error>({
    queryKey: ['prayerTimes', 'admin'],
    queryFn: getPrayerTimes,
    // Initial data can be removed if you don't want placeholders
    // initialData: [] // Start with empty or provide initial placeholders if desired
  });

  // Mutation for adding a prayer time
  const addMutation = useMutation<PrayerTime, Error, PrayerTimeData>({ // Expects PrayerTimeData, returns PrayerTime
    mutationFn: addPrayerTime,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prayerTimes', 'admin'] }); // Refetch data on success
      setIsAddDialogOpen(false);
      toast({ title: "נוסף בהצלחה", description: "זמן התפילה נוסף בהצלחה" });
      // Reset form
      setFormData({ location: "בית הכנסת החדש", type: "שחרית", day: "רגיל", time: "" });
    },
    onError: (error) => {
      console.error("Error adding prayer:", error);
      toast({ title: "שגיאה", description: "אירעה שגיאה בעת הוספת זמן התפילה", variant: "destructive" });
    },
  });

  // Mutation for editing a prayer time
  const editMutation = useMutation<void, Error, { id: string; data: Partial<PrayerTimeData> }>({
    mutationFn: ({ id, data }) => updatePrayerTime(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prayerTimes', 'admin'] });
      setIsEditDialogOpen(false);
      setCurrentPrayer(null);
      toast({ title: "עודכן בהצלחה", description: "זמן התפילה עודכן בהצלחה" });
    },
    onError: (error) => {
      console.error("Error editing prayer:", error);
      toast({ title: "שגיאה", description: "אירעה שגיאה בעת עדכון זמן התפילה", variant: "destructive" });
    },
  });

  // Mutation for deleting a prayer time
  const deleteMutation = useMutation<void, Error, string>({ // Expects the ID string
    mutationFn: deletePrayerTime,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prayerTimes', 'admin'] });
      toast({ title: "נמחק בהצלחה", description: "זמן התפילה נמחק בהצלחה" });
    },
    onError: (error) => {
      console.error("Error deleting prayer:", error);
      toast({ title: "שגיאה", description: "אירעה שגיאה בעת מחיקת זמן התפילה", variant: "destructive" });
    },
  });

  // --- Event Handlers ---

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: keyof PrayerTimeData, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddPrayerSubmit = () => {
    addMutation.mutate(formData); // Call the mutation
  };

  const handleEditPrayerSubmit = () => {
    if (!currentPrayer) return;
    // Pass only the fields present in PrayerTimeData
    const updatedData: PrayerTimeData = {
        location: formData.location,
        type: formData.type,
        day: formData.day,
        time: formData.time
    }
    editMutation.mutate({ id: currentPrayer.id, data: updatedData }); // Call the mutation
  };

  const handleDeletePrayerClick = (id: string) => {
    // Optional: Add a confirmation dialog here
    deleteMutation.mutate(id); // Call the mutation
  };

  const openEditDialog = (prayer: PrayerTime) => {
    setCurrentPrayer(prayer);
    // Set form data based on the selected prayer, defaulting undefined to empty string
    setFormData({
      location: prayer.location ?? "",
      type: prayer.type ?? "",
      day: prayer.day ?? "",
      time: prayer.time ?? "",
    });
    setIsEditDialogOpen(true);
  };

  const closeAddDialog = () => {
      setIsAddDialogOpen(false);
      // Reset form only when closing explicitly or on success
      setFormData({ location: "בית הכנסת החדש", type: "שחרית", day: "רגיל", time: "" });
  }

  const closeEditDialog = () => {
      setIsEditDialogOpen(false);
      setCurrentPrayer(null);
  }


  // --- Render Logic ---

  if (isLoadingPrayerTimes) {
    return <div className="flex justify-center items-center p-8"><Loader2 className="h-8 w-8 animate-spin" /> טוען זמני תפילות...</div>;
  }

  if (isErrorPrayerTimes) {
    return <div className="text-red-600 text-center p-8">שגיאה בטעינת זמני התפילות. בדוק את החיבור או נסה שוב מאוחר יותר.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">ניהול זמני תפילות</h2>
        <Button onClick={() => setIsAddDialogOpen(true)} disabled={addMutation.isPending}>
          {addMutation.isPending ? <Loader2 className="ml-2 h-4 w-4 animate-spin" /> : <Plus className="ml-2 h-4 w-4" />}
           הוסף זמן תפילה
        </Button>
      </div>

      {prayerTimes && prayerTimes.length === 0 && !isLoadingPrayerTimes && (
        <p className="text-center text-muted-foreground">לא נמצאו זמני תפילות. הוסף זמן תפילה חדש.</p>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {prayerTimes?.map((prayer) => (
          <Card key={prayer.id} className="overflow-hidden">
            <CardHeader className="bg-primary-dark text-accent p-3">
              <CardTitle className="text-lg flex justify-between items-center">
                <span>{prayer.location} - {prayer.type}</span>
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => openEditDialog(prayer)}
                    disabled={editMutation.isPending || deleteMutation.isPending}
                    className="h-8 w-8 p-0"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDeletePrayerClick(prayer.id)}
                    disabled={deleteMutation.isPending || editMutation.isPending || deleteMutation.variables === prayer.id} // Disable if this specific item is being deleted
                    className="h-8 w-8 p-0"
                  >
                    {deleteMutation.isPending && deleteMutation.variables === prayer.id ? <Loader2 className="h-4 w-4 animate-spin"/> : <Trash className="h-4 w-4" />}
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
            {/* Form fields remain the same - using formData state */}
             <div className="space-y-2">
              <label>מיקום</label>
              <Select
                value={formData.location} // Controlled component
                onValueChange={(value) => handleSelectChange("location", value)}
                disabled={addMutation.isPending}
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
                value={formData.type} // Controlled component
                onValueChange={(value) => handleSelectChange("type", value)}
                 disabled={addMutation.isPending}
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
                 disabled={addMutation.isPending}
              />
            </div>

            <div className="space-y-2">
              <label>שעה</label>
              <Input
                name="time"
                value={formData.time}
                onChange={handleInputChange}
                placeholder="לדוגמה: 18:00 או תיאור כגון 'שעה לפני שקיעה'"
                 disabled={addMutation.isPending}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={closeAddDialog} // Use dedicated close handler
              disabled={addMutation.isPending}
            >
              <X className="ml-2 h-4 w-4" /> ביטול
            </Button>
            <Button onClick={handleAddPrayerSubmit} disabled={addMutation.isPending}>
              {addMutation.isPending ? <Loader2 className="ml-2 h-4 w-4 animate-spin" /> : <Check className="ml-2 h-4 w-4" />}
               הוסף
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
            {/* Form fields remain the same - using formData state */}
             <div className="space-y-2">
              <label>מיקום</label>
              <Select
                value={formData.location} // Use value for controlled component
                onValueChange={(value) => handleSelectChange("location", value)}
                disabled={editMutation.isPending}
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
                value={formData.type} // Use value for controlled component
                onValueChange={(value) => handleSelectChange("type", value)}
                disabled={editMutation.isPending}
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
                disabled={editMutation.isPending}
              />
            </div>

            <div className="space-y-2">
              <label>שעה</label>
              <Input
                name="time"
                value={formData.time}
                onChange={handleInputChange}
                placeholder="לדוגמה: 18:00 או תיאור כגון 'שעה לפני שקיעה'"
                disabled={editMutation.isPending}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={closeEditDialog} // Use dedicated close handler
              disabled={editMutation.isPending}
            >
              <X className="ml-2 h-4 w-4" /> ביטול
            </Button>
            <Button onClick={handleEditPrayerSubmit} disabled={editMutation.isPending}>
               {editMutation.isPending ? <Loader2 className="ml-2 h-4 w-4 animate-spin" /> : <Check className="ml-2 h-4 w-4" />}
               שמור שינויים
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PrayerTimesManager;
