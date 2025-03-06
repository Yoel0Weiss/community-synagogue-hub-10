
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash, Edit, Plus, Check, X, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
}

const EventsManager = () => {
  const [events, setEvents] = useState<Event[]>([
    { 
      id: "1", 
      title: "ערב לימוד", 
      date: "2024-10-15", 
      time: "20:00", 
      location: "בית הכנסת החדש",
      description: "ערב לימוד מיוחד עם הרב יעקב כהן" 
    }
  ]);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentEvent, setCurrentEvent] = useState<Event | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    time: "",
    location: "",
    description: "",
  });

  const { toast } = useToast();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddEvent = () => {
    const newEvent = {
      id: Date.now().toString(),
      ...formData,
    };

    setEvents([...events, newEvent]);
    setIsAddDialogOpen(false);
    toast({
      title: "נוסף בהצלחה",
      description: "האירוע נוסף בהצלחה",
    });

    // Reset form data
    setFormData({
      title: "",
      date: "",
      time: "",
      location: "",
      description: "",
    });
  };

  const handleEditEvent = () => {
    if (!currentEvent) return;
    
    const updatedEvents = events.map((event) => 
      event.id === currentEvent.id ? { ...event, ...formData } : event
    );
    
    setEvents(updatedEvents);
    setIsEditDialogOpen(false);
    setCurrentEvent(null);
    toast({
      title: "עודכן בהצלחה",
      description: "האירוע עודכן בהצלחה",
    });
  };

  const handleDeleteEvent = (id: string) => {
    setEvents(events.filter((event) => event.id !== id));
    toast({
      title: "נמחק בהצלחה",
      description: "האירוע נמחק בהצלחה",
    });
  };

  const openEditDialog = (event: Event) => {
    setCurrentEvent(event);
    setFormData({
      title: event.title,
      date: event.date,
      time: event.time,
      location: event.location,
      description: event.description,
    });
    setIsEditDialogOpen(true);
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString('he-IL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">ניהול אירועים</h2>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="ml-2 h-4 w-4" /> הוסף אירוע
        </Button>
      </div>

      {events.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center text-text-light">
            <p>אין אירועים מתוכננים כרגע</p>
            <Button 
              variant="outline" 
              onClick={() => setIsAddDialogOpen(true)}
              className="mt-4"
            >
              <Plus className="ml-2 h-4 w-4" /> הוסף אירוע חדש
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {events.map((event) => (
            <Card key={event.id} className="overflow-hidden">
              <CardHeader className="bg-secondary text-accent p-3">
                <CardTitle className="text-lg flex justify-between items-center">
                  <span>{event.title}</span>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => openEditDialog(event)}
                      className="h-8 w-8 p-0"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDeleteEvent(event.id)}
                      className="h-8 w-8 p-0"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 ml-2" />
                    <span>{formatDate(event.date)} | {event.time}</span>
                  </div>
                  <div className="font-semibold mt-2">מיקום: {event.location}</div>
                  <p className="text-text-light mt-2">{event.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add Event Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>הוספת אירוע חדש</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label>כותרת האירוע</label>
              <Input
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="כותרת האירוע"
              />
            </div>
            
            <div className="space-y-2">
              <label>תאריך</label>
              <Input
                name="date"
                type="date"
                value={formData.date}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="space-y-2">
              <label>שעה</label>
              <Input
                name="time"
                value={formData.time}
                onChange={handleInputChange}
                placeholder="לדוגמה: 19:30"
              />
            </div>
            
            <div className="space-y-2">
              <label>מיקום</label>
              <Input
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="מיקום האירוע"
              />
            </div>
            
            <div className="space-y-2">
              <label>תיאור</label>
              <Textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="תיאור מפורט של האירוע"
                rows={4}
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
            <Button onClick={handleAddEvent}>
              <Check className="ml-2 h-4 w-4" /> הוסף
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Event Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>עריכת אירוע</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label>כותרת האירוע</label>
              <Input
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="כותרת האירוע"
              />
            </div>
            
            <div className="space-y-2">
              <label>תאריך</label>
              <Input
                name="date"
                type="date"
                value={formData.date}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="space-y-2">
              <label>שעה</label>
              <Input
                name="time"
                value={formData.time}
                onChange={handleInputChange}
                placeholder="לדוגמה: 19:30"
              />
            </div>
            
            <div className="space-y-2">
              <label>מיקום</label>
              <Input
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="מיקום האירוע"
              />
            </div>
            
            <div className="space-y-2">
              <label>תיאור</label>
              <Textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="תיאור מפורט של האירוע"
                rows={4}
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
            <Button onClick={handleEditEvent}>
              <Check className="ml-2 h-4 w-4" /> שמור שינויים
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EventsManager;
