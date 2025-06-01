
// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Trash, Edit, Plus, Check, X, Calendar } from "lucide-react";
// import { useToast } from "@/hooks/use-toast";
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
// import { Textarea } from "@/components/ui/textarea";
// import {
//   useQuery,
//   useMutation,
//   useQueryClient,
// } from "@tanstack/react-query";
// import {
//   getEvents,
//   addEvent,
//   updateEvent,
//   deleteEvent,
//   Event,
//   EventData,
//   Timestamp,
// } from "@/lib/eventsApi";

// const EventsManager = () => {
//   // State for dialogs and form data
//   const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
//   const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
//   const [currentEvent, setCurrentEvent] = useState<Event | null>(null);
//   const [formData, setFormData] = useState({
//     title: "",
//     date: "",
//     time: "",
//     location: "",
//     description: "",
//   });

//   const queryClient = useQueryClient();
//   const { toast } = useToast();

//   // Query to fetch events
//   const { data: events, isLoading, isError } = useQuery<Event[], Error>({
//     queryKey: ["events"],
//     queryFn: getEvents,
//   });

//   // Mutations for adding, updating, and deleting events
//   const addMutation = useMutation<Event, Error, EventData>({
//     mutationFn: addEvent,
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["events"] });
//       setIsAddDialogOpen(false);
//       setFormData({ title: "", description: "", date: "", time: "", location: "" }); // Reset form
//       toast({ title: "נוסף בהצלחה", description: "האירוע נוסף בהצלחה" });
//     },
//     onError: () => {
//       toast({ title: "שגיאה", description: "הוספת האירוע נכשלה", variant: "destructive" });
//     },
//   });

//   const updateMutation = useMutation<void, Error, { id: string; data: Partial<EventData> }>({
//     mutationFn: ({ id, data }) => updateEvent(id, data),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["events"] });
//       setIsEditDialogOpen(false);
//       toast({ title: "עודכן בהצלחה", description: "האירוע עודכן בהצלחה" });
//     },
//     onError: () => {
//       toast({ title: "שגיאה", description: "עדכון האירוע נכשל", variant: "destructive" });
//     },
//   });

//   const deleteMutation = useMutation<void, Error, string>({
//     mutationFn: deleteEvent,
//     onSuccess: () => queryClient.invalidateQueries({ queryKey: ["events"] }),
//     onError: () => toast({ title: "שגיאה", description: "מחיקת האירוע נכשלה", variant: "destructive" }),
//   });

//   const handleInputChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
//   ) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleAddEventSubmit = () => {
//     if (!formData.title || !formData.date || !formData.description) {
//       toast({ title: "שגיאה", description: "יש למלא את כל השדות", variant: "destructive" });
//       return;
//     };

//     const eventData: EventData = {
//       title: formData.title,
//       description: formData.description,
//       // Convert date string to Firestore Timestamp
//       date: Timestamp.fromDate(new Date(formData.date)),
//       time: formData.time,
//       location: formData.location,
//     };

//     addMutation.mutate(eventData);

//     // Reset form data
//     setFormData({
//       title: "",
//       date: "",
//       time: "",
//       location: "",
//       description: "",
//     });

//   };

//   const handleEditEventSubmit = () => {
//     if (!currentEvent) return;

//     const updatedEventData: Partial<EventData> = {
//       title: formData.title,
//       description: formData.description,
//       time: formData.time,
//       location: formData.location,
//     };

//     // Convert date string to Firestore Timestamp if it exists
//     if (formData.date) {
//       updatedEventData.date = Timestamp.fromDate(new Date(formData.date));
//     }

//     updateMutation.mutate({ id: currentEvent.id, data: updatedEventData });
//   };

//   const openEditDialog = (event: Event) => {
//     setCurrentEvent(event);

//     // Convert Firestore Timestamp back to date string for the form
//     const dateString = event.date.toDate().toISOString().split('T')[0]; // YYYY-MM-DD

//     setFormData({
//       title: event.title,
//       date: dateString,
//       time: event.time,
//       location: event.location,
//       description: event.description,
//     });
//     setIsEditDialogOpen(true);
//   };

//   const handleDeleteEventClick = (id: string) => {
//     deleteMutation.mutate(id);
//   };

//   const closeAddDialog = () => {
//     setIsAddDialogOpen(false);
//     setFormData({ title: "", description: "", date: "", time: "", location: "" }); // Reset form
//   };

//   const closeEditDialog = () => {
//     setIsEditDialogOpen(false);
//     setCurrentEvent(null);
//   };

//   // Format date for display
//   const formatDate = (timestamp: Timestamp) => {
//     if (!timestamp) return "";
//     const date = timestamp.toDate(); // Convert Timestamp to JS Date
//     return date.toLocaleDateString('he-IL', {
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric',
//     });
//   };

//   if (isLoading) {
//     return <div className="flex justify-center items-center p-8"><Loader2 className="h-8 w-8 animate-spin" /> טוען אירועים...</div>;
//   }

//   if (isError) {
//     return <div className="text-red-600 text-center p-8">שגיאה בטעינת אירועים. בדוק את החיבור או נסה שוב מאוחר יותר.</div>;
//   }

//   return (
//     <div className="space-y-6">
//       <div className="flex justify-between items-center">
//         <h2 className="text-2xl font-bold">ניהול אירועים</h2>
//         <Button onClick={() => setIsAddDialogOpen(true)} disabled={addMutation.isPending}>
//           {addMutation.isPending ? <Loader2 className="ml-2 h-4 w-4 animate-spin" /> : <Plus className="ml-2 h-4 w-4" />} הוסף אירוע
//         </Button>
//       </div>

//       {events && events.length === 0 && !isLoading ? (
//         <Card>
//           <CardContent className="p-6 text-center text-text-light">
//             <Button 
//               variant="outline" 
//               onClick={() => setIsAddDialogOpen(true)}
//               className="mt-4"
//             >
//               <Plus className="ml-2 h-4 w-4" /> הוסף אירוע חדש
//             </Button>
//             <p>אין אירועים מתוכננים כרגע</p>
//           </CardContent>
//         </Card>
//       ) : (
//         <div className="grid gap-4 md:grid-cols-2">
//           {events?.map((event) => (
//             <Card key={event.id} className="overflow-hidden">
//               <CardHeader className="bg-secondary text-accent p-3">
//                 <CardTitle className="text-lg flex justify-between items-center">
//                   <span>{event.title}</span>
//                   <div className="flex space-x-2">
//                     <Button
//                       size="sm"
//                       variant="ghost"
//                       onClick={() => openEditDialog(event)}
//                       disabled={updateMutation.isPending || deleteMutation.isPending}
//                       className="h-8 w-8 p-0 disabled:opacity-50"
//                     >
//                       <Edit className="h-4 w-4" />
//                     </Button>
//                     <Button
//                       size="sm"
//                       variant="ghost"
//                       onClick={() => handleDeleteEventClick(event.id)}
//                       className="h-8 w-8 p-0"
//                     >
//                       <Trash className="h-4 w-4" />
//                     </Button>
//                   </div>
//                 </CardTitle>
//               </CardHeader>
//               <CardContent className="p-4">
//                 <div className="space-y-2">
//                   <div className="flex items-center">
//                     <Calendar className="h-4 w-4 ml-2" />
//                     <span>{formatDate(event.date)} | {event.time}</span>
//                   </div>
//                   <div className="font-semibold mt-2">מיקום: {event.location}</div>
//                   <p className="text-text-light mt-2">{event.description}</p>
//                 </div>
//               </CardContent>
//             </Card>
//           ))}
//         </div>
//       )}

//       {/* Add Event Dialog */}
//       <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>הוספת אירוע חדש</DialogTitle>
//           </DialogHeader>
//           <div className="space-y-4 py-4">
//             <div className="space-y-2">
//               <label>כותרת האירוע</label>
//               <Input
//                 name="title"
//                 value={formData.title}
//                 onChange={handleInputChange}
//                 placeholder="כותרת האירוע"
//               />
//             </div>
            
//             <div className="space-y-2">
//               <label>תאריך</label>
//               <Input
//                 name="date"
//                 type="date"
//                 value={formData.date}
//                 onChange={handleInputChange}
//               />
//             </div>
            
//             <div className="space-y-2">
//               <label>שעה</label>
//               <Input
//                 name="time"
//                 value={formData.time}
//                 onChange={handleInputChange}
//                 placeholder="לדוגמה: 19:30"
//               />
//             </div>
            
//             <div className="space-y-2">
//               <label>מיקום</label>
//               <Input
//                 name="location"
//                 value={formData.location}
//                 onChange={handleInputChange}
//                 placeholder="מיקום האירוע"
//               />
//             </div>
            
//             <div className="space-y-2">
//               <label>תיאור</label>
//               <Textarea
//                 name="description"
//                 value={formData.description}
//                 onChange={handleInputChange}
//                 placeholder="תיאור מפורט של האירוע"
//                 rows={4}
//               />
//             </div>
//           </div>
          
//           <DialogFooter>
//             <Button
//               variant="outline"
//               onClick={() => setIsAddDialogOpen(false)}
//             >
//               <X className="ml-2 h-4 w-4" /> ביטול
//             </Button>
//             <Button onClick={handleAddEventSubmit} disabled={addMutation.isPending}>
//               <Check className="ml-2 h-4 w-4" /> הוסף
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       {/* Edit Event Dialog */}
//       <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>עריכת אירוע</DialogTitle>
//           </DialogHeader>
//           <div className="space-y-4 py-4">
//             <div className="space-y-2">
//               <label>כותרת האירוע</label>
//               <Input
//                 name="title"
//                 value={formData.title}
//                 onChange={handleInputChange}
//                 placeholder="כותרת האירוע"
//               />
//             </div>
            
//             <div className="space-y-2">
//               <label>תאריך</label>
//               <Input
//                 name="date"
//                 type="date"
//                 value={formData.date}
//                 onChange={handleInputChange}
//               />
//             </div>
            
//             <div className="space-y-2">
//               <label>שעה</label>
//               <Input
//                 name="time"
//                 value={formData.time}
//                 onChange={handleInputChange}
//                 placeholder="לדוגמה: 19:30"
//               />
//             </div>
            
//             <div className="space-y-2">
//               <label>מיקום</label>
//               <Input
//                 name="location"
//                 value={formData.location}
//                 onChange={handleInputChange}
//                 placeholder="מיקום האירוע"
//               />
//             </div>
            
//             <div className="space-y-2">
//               <label>תיאור</label>
//               <Textarea
//                 name="description"
//                 value={formData.description}
//                 onChange={handleInputChange}
//                 placeholder="תיאור מפורט של האירוע"
//                 rows={4}
//               />
//             </div>
//           </div>
          
//           <DialogFooter>
//             <Button
//               variant="outline"
//               onClick={() => setIsEditDialogOpen(false)}
//             >
//               <X className="ml-2 h-4 w-4" /> ביטול
//             </Button>
//             <Button onClick={handleEditEventSubmit} disabled={updateMutation.isPending}>
//               <Check className="ml-2 h-4 w-4" /> שמור שינויים
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// };

// export default EventsManager;
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash, Edit, Plus, Check, X, Calendar, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import {
  getEvents,
  addEvent,
  updateEvent,
  deleteEvent,
  Event,
  EventData,
  Timestamp,
} from "@/lib/eventsApi";

const EventsManager = () => {
  // State for dialogs and form data
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

  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Query to fetch events
  const { data: events, isLoading, isError } = useQuery<Event[], Error>({
    queryKey: ["events"],
    queryFn: getEvents,
  });
  console.log("Events data:", events);

  // Mutations for adding, updating, and deleting events
  const addMutation = useMutation<Event, Error, EventData>({
    mutationFn: addEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      setIsAddDialogOpen(false);
      setFormData({ title: "", description: "", date: "", time: "", location: "" }); // Reset form
      toast({ title: "נוסף בהצלחה", description: "האירוע נוסף בהצלחה" });
    },
    onError: () => {
      toast({ title: "שגיאה", description: "הוספת האירוע נכשלה", variant: "destructive" });
    },
  });

  const updateMutation = useMutation<void, Error, { id: string; data: Partial<EventData> }>({
    mutationFn: ({ id, data }) => updateEvent(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      setIsEditDialogOpen(false);
      toast({ title: "עודכן בהצלחה", description: "האירוע עודכן בהצלחה" });
    },
    onError: () => {
      toast({ title: "שגיאה", description: "עדכון האירוע נכשל", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation<void, Error, string>({
    mutationFn: deleteEvent,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["events"] }),
    onError: () => toast({ title: "שגיאה", description: "מחיקת האירוע נכשלה", variant: "destructive" }),
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddEventSubmit = () => {
    const eventData: EventData = {
      title: formData.title,
      description: formData.description,
      // Convert date string to Firestore Timestamp
      date: Timestamp.fromDate(new Date(formData.date)),
      time: formData.time,
      location: formData.location,
    };

    addMutation.mutate(eventData);
  };

  const handleEditEventSubmit = () => {
    if (!currentEvent) return;

    const updatedEventData: Partial<EventData> = {
      title: formData.title,
      description: formData.description,
      time: formData.time,
      location: formData.location,
    };

    // Convert date string to Firestore Timestamp if it exists
    if (formData.date) {
      updatedEventData.date = Timestamp.fromDate(new Date(formData.date));
    }

    updateMutation.mutate({ id: currentEvent.id, data: updatedEventData });
  };

  const openEditDialog = (event: Event) => {
    setCurrentEvent(event);

    // Convert Firestore Timestamp back to date string for the form
    const dateString = event.date.toDate().toISOString().split('T')[0]; // YYYY-MM-DD

    setFormData({
      title: event.title,
      date: dateString,
      time: event.time,
      location: event.location,
      description: event.description,
    });
    setIsEditDialogOpen(true);
  };

  const handleDeleteEventClick = (id: string) => {
    deleteMutation.mutate(id);
  };

  const closeAddDialog = () => {
    setIsAddDialogOpen(false);
    setFormData({ title: "", description: "", date: "", time: "", location: "" }); // Reset form
  };

  const closeEditDialog = () => {
    setIsEditDialogOpen(false);
    setCurrentEvent(null);
  }

  // Format date for display
  const formatDate = (timestamp: Timestamp) => {
    if (!timestamp) return "";
    const date = timestamp.toDate(); // Convert Timestamp to JS Date
    return date.toLocaleDateString('he-IL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (isLoading) {
    console.log("Loading state");
    return <div className="flex justify-center items-center p-8"><Loader2 className="h-8 w-8 animate-spin" /> טוען אירועים...</div>;
  }

  if (isError) {
    console.log("Error state:", isError);
    return <div className="text-red-600 text-center p-8">שגיאה בטעינת אירועים. בדוק את החיבור או נסה שוב מאוחר יותר.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">ניהול אירועים</h2>
        <Button onClick={() => setIsAddDialogOpen(true)} disabled={addMutation.isPending}>
          {addMutation.isPending ? <Loader2 className="ml-2 h-4 w-4 animate-spin" /> : <Plus className="ml-2 h-4 w-4" />} הוסף אירוע
        </Button>
      </div>

      {events && events.length === 0 && !isLoading ? (
        <Card>
          <CardContent className="p-6 text-center text-text-light">
            <Button 
              variant="outline" 
              onClick={() => setIsAddDialogOpen(true)}
              className="mt-4"
            >
              <Plus className="ml-2 h-4 w-4" /> הוסף אירוע חדש
            </Button>
            <p>אין אירועים מתוכננים כרגע</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {events?.map((event) => (
            <Card key={event.id} className="overflow-hidden">
              <CardHeader className="bg-secondary text-accent p-3">
                <CardTitle className="text-lg flex justify-between items-center">
                  <span>{event.title}</span>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => openEditDialog(event)}
                      disabled={updateMutation.isPending || deleteMutation.isPending}
                      className="h-8 w-8 p-0 disabled:opacity-50"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDeleteEventClick(event.id)}
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
            <Button onClick={handleAddEventSubmit} disabled={addMutation.isPending}>
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
            <Button onClick={handleEditEventSubmit} disabled={updateMutation.isPending}>
              <Check className="ml-2 h-4 w-4" /> שמור שינויים
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EventsManager;
