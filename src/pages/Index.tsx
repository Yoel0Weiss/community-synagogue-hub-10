
import { useState, useEffect, useMemo } from "react";
import { 
  Calendar, 
  Clock, 
  BookOpen, 
  Heart, 
  Menu, 
  X, 
  MapPin,
  PhoneCall
} from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

// Import the function to fetch prayer times
import { getPrayerTimes, PrayerTime as RawPrayerTime } from "@/lib/prayerTimeApi"; // Import with alias

// Define a type for the grouped prayer time data structure needed for rendering
interface GroupedPrayerTime {
  id: string; // Can use location name or generate an ID
  location: string;
  shacharit: string[];
  mincha: string[];
  arvit: string[];
  // Add other relevant fields if needed, like a general description for the location
}


const Index = () => {
  // State for UI elements
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("prayers");
  // State to hold prayer times fetched from Firebase (raw data)
  const [rawPrayerTimes, setRawPrayerTimes] = useState<RawPrayerTime[]>([]);
  const [loadingPrayerTimes, setLoadingPrayerTimes] = useState(true); // Loading state
  const [errorFetchingPrayerTimes, setErrorFetchingPrayerTimes] = useState<string | null>(null); // Error state


  // Menu items for navigation
  const menuItems = [
    { name: "זמני תפילות", icon: Clock, href: "#prayers" },
    { name: "שיעורים", icon: BookOpen, href: "#classes" },
    { name: "אירועים", icon: Calendar, href: "#events" },
    { name: "תרומות", icon: Heart, href: "#donate" },
  ];

  // Fix for scroll animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -100px 0px" } // Adjust rootMargin as needed
    );

    const elements = document.querySelectorAll(".animate-on-scroll");
    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  // Handle section active state on scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = ["prayers", "classes", "events", "donate"];

      // Find which section is currently in view
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          // Check if the section is within the viewport, with some offset
          if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // --- useEffect to fetch raw prayer times from Firebase ---
  useEffect(() => {
    const fetchPrayerData = async () => {
      try {
        setLoadingPrayerTimes(true);
        const data = await getPrayerTimes();
        setRawPrayerTimes(data);
        setErrorFetchingPrayerTimes(null);
      } catch (error) {
        console.error("Error fetching prayer times:", error);
        setErrorFetchingPrayerTimes("Failed to load prayer times.");
        setRawPrayerTimes([]);
      } finally {
        setLoadingPrayerTimes(false);
      }
    };

    fetchPrayerData();
  }, []); // Empty dependency array means this runs once on mount
  // --- End of fetch useEffect ---

  // --- Memoized computation to group prayer times ---
  const groupedPrayerTimes = useMemo(() => {
    const grouped: { [key: string]: { location: string; shacharit: string[]; mincha: string[]; arvit: string[]; id: string } } = {};

    rawPrayerTimes.forEach(prayer => {
      // Ensure prayer and its properties are not null or undefined
      if (!prayer || !prayer.location || !prayer.type || !prayer.time) {
          console.warn("Skipping invalid prayer time entry:", prayer);
          return; // Skip this entry if essential data is missing
      }

      if (!grouped[prayer.location]) {
        // Use a simple slug or ID based on location name for a stable key
        const id = prayer.location.replace(/\s+/g, '-').toLowerCase();
        grouped[prayer.location] = {
          id: id,
          location: prayer.location,
          shacharit: [],
          mincha: [],
          arvit: [],
        };
      }

      // Add the time to the correct prayer type array, including the day info
      // Ensure day is treated as a string, defaulting to empty if null/undefined
      const dayInfo = (prayer.day ?? "").trim();
      const timeEntry = `${prayer.time}${dayInfo && dayInfo !== 'רגיל' ? ` (${dayInfo})` : ''}`.trim();

      if (prayer.type === 'שחרית' && timeEntry) {
        grouped[prayer.location].shacharit.push(timeEntry);
      } else if (prayer.type === 'מנחה' && timeEntry) {
        grouped[prayer.location].mincha.push(timeEntry);
      } else if (prayer.type === 'ערבית' && timeEntry) {
        grouped[prayer.location].arvit.push(timeEntry);
      }
    });

    // Sort times within each category if needed (optional)
    Object.values(grouped).forEach(locationData => {
        locationData.shacharit.sort();
        locationData.mincha.sort();
        locationData.arvit.sort();
    });

    // Return as an array
    return Object.values(grouped);

  }, [rawPrayerTimes]); // Recompute when rawPrayerTimes changes
  // --- End of memoized grouping ---


  return (
    <div className="min-h-screen bg-accent">
      {/* Navigation */}
      <nav className="fixed w-full bg-primary text-accent z-50 shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center">
              <h1 className="text-2xl md:text-3xl font-bold">בית הכנסת</h1>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-1 flex-row-reverse">
              {menuItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-2 text-accent px-4 py-2 rounded-md transition-colors duration-200 hover:bg-primary-light ${
                    activeSection === item.href.replace("#", "")
                      ? "bg-primary-light"
                      : ""
                  }`}
                  onClick={() => setActiveSection(item.href.replace("#", ""))}
                >
                  <span>{item.name}</span>
                  <item.icon className="w-4 h-4" />
                </a>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-accent rounded-md hover:bg-primary-light transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? "סגור תפריט" : "פתח תפריט"}
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden absolute top-20 left-0 w-full bg-primary shadow-lg animate-slide-in">
              <div className="px-4 py-4 space-y-4">
                {menuItems.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className={`flex items-center gap-2 py-3 px-4 text-accent hover:bg-primary-light rounded-md transition-colors duration-200 ${'
                      activeSection === item.href.replace("#", "")
                        ? "bg-primary-light"
                        : ""
                    }`}
                    onClick={() => {
                      setIsMenuOpen(false);
                      setActiveSection(item.href.replace("#", ""));
                    }}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 bg-primary text-accent">
        <div className="container mx-auto text-center animate-fade-up">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            ברוכים הבאים לבית הכנסת שלנו
          </h1>
          <p className="text-xl md:text-2xl opacity-90 max-w-2xl mx-auto mb-12 leading-relaxed">
            מקום של תפילה, לימוד וקהילה
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="text-lg">
              <a href="#prayers">זמני תפילה</a>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg bg-transparent border-accent text-accent hover:bg-primary-light">
              <a href="#donate">תרומות</a>
            </Button>
          </div>
        </div>
      </section>

      {/* Prayer Times Section */}
      <section id="prayers" className="py-20 px-4 bg-accent">
        <div className="container mx-auto">
          <div className="text-center mb-16 animate-on-scroll">
            <h2 className="text-3xl md:text-4xl font-bold text-text mb-4 inline-block border-b-4 border-primary pb-2">
              זמני תפילות
            </h2>
            <p className="text-lg text-text-light max-w-2xl mx-auto">
              הצטרפו אלינו לתפילות בזמנים הבאים, כולם מוזמנים
            </p>
          </div>

          {/* --- Conditional rendering based on loading/error state --- */}
          {loadingPrayerTimes && (
            <div className="text-center text-text-light">טוען זמני תפילות...</div>
          )}

          {errorFetchingPrayerTimes && (
            <div className="text-center text-red-500">{errorFetchingPrayerTimes}</div>
          )}

          {!loadingPrayerTimes && !errorFetchingPrayerTimes && groupedPrayerTimes.length === 0 && (
             <div className="text-center text-text-light">אין זמני תפילות זמינים כרגע.</div>
          )}

          {/* --- Render grouped prayer times if loaded --- */}
          {!loadingPrayerTimes && groupedPrayerTimes.length > 0 && (
            <div className="grid md:grid-cols-2 gap-8">
              {/* Map over the grouped prayer times */}
              {groupedPrayerTimes.map((locationData) => (
                <Card key={locationData.id} className={`animate-on-scroll shadow-raised hover:shadow-lg transition-shadow duration-300 overflow-hidden border-t-4 ${locationData.location === 'בית הכנסת החדש' ? 'border-t-primary' : 'border-t-secondary'}`}> {/* Adjust border color based on location */}
                  <CardHeader className={`bg-gradient-to-r ${locationData.location === 'בית הכנסת החדש' ? 'from-primary to-primary-light' : 'from-secondary to-secondary-light'} text-accent`}>
                    <div className="flex items-center gap-2">
                      <Clock className="w-5 h-5" />
                      <CardTitle className="text-2xl">{locationData.location}</CardTitle>
                    </div>
                    {/* You might add a description field to your data */}
                    {/* <CardDescription className="text-accent-light">זמני תפילה עדכניים</CardDescription> */}
                  </CardHeader>
                  <CardContent className="pt-6">
                    <Tabs defaultValue="shacharit" className="w-full">
                      <TabsList className="w-full grid grid-cols-3 mb-4">
                        <TabsTrigger value="shacharit">שחרית</TabsTrigger>
                        <TabsTrigger value="mincha">מנחה</TabsTrigger>
                        <TabsTrigger value="arvit">ערבית</TabsTrigger>
                      </TabsList>
                      <TabsContent value="shacharit" className="space-y-4">
                         {/* Map over Shacharit times from grouped data */}
                        {locationData.shacharit && locationData.shacharit.length > 0 ? (
                           locationData.shacharit.map((time, index) => (
                             <div key={index} className="flex justify-between items-center p-4 bg-accent-light rounded-lg">
                               <span className="font-medium">{time}</span>
                               {/* The day info is already included in the time string during grouping */}
                             </div>
                           ))
                        ) : (
                           <div className="p-4 bg-accent-light rounded-lg">
                             <p className="text-text-light text-center">אין מניין קבוע</p>
                           </div>
                        )}
                      </TabsContent>
                      <TabsContent value="mincha" className="space-y-4">
                         {/* Map over Mincha times from grouped data */}
                         {locationData.mincha && locationData.mincha.length > 0 ? (
                            locationData.mincha.map((time, index) => (
                              <div key={index} className="flex justify-between items-center p-4 bg-accent-light rounded-lg">
                                <span className="font-medium">{time}</span>
                              </div>
                            ))
                         ) : (
                            <div className="p-4 bg-accent-light rounded-lg">
                              <p className="text-text-light text-center">אין מניין קבוע</p>
                            </div>
                         )}
                      </TabsContent>
                      <TabsContent value="arvit" className="space-y-4">
                         {/* Map over Arvit times from grouped data */}
                         {locationData.arvit && locationData.arvit.length > 0 ? (
                            locationData.arvit.map((time, index) => (
                              <div key={index} className="flex justify-between items-center p-4 bg-accent-light rounded-lg">
                                <span className="font-medium">{time}</span>
                              </div>
                            ))
                         ) : (
                            <div className="p-4 bg-accent-light rounded-lg">
                              <p className="text-text-light text-center">אין מניין קבוע</p>
                            </div>
                         )}
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
           {/* --- End of Conditional rendering --- */}

        </div>
      </section>

      {/* Classes Section */}
      <section id="classes" className="py-20 px-4 bg-accent-dark">
        <div className="container mx-auto">
          <div className="text-center mb-16 animate-on-scroll">
            <h2 className="text-3xl md:text-4xl font-bold text-text mb-4 inline-block border-b-4 border-primary pb-2">
              שיעורים
            </h2>
            <p className="text-lg text-text-light max-w-2xl mx-auto">
              הצטרפו לשיעורים שלנו לעומק בתורה ובמסורת
            </p>
          </div>

          <Card className="max-w-3xl mx-auto animate-on-scroll shadow-raised">
            <div className="p-6 text-center">
              <div className="bg-accent p-10 rounded-xl shadow-inner">
                <BookOpen className="w-16 h-16 mx-auto mb-4 text-primary" />
                <p className="text-text-light text-lg">אין שיעורים קבועים כרגע</p>
                <p className="text-text-muted mt-2">עקבו אחר העדכונים לגבי שיעורים חדשים</p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Events Section */}
      <section id="events" className="py-20 px-4 bg-accent">
        <div className="container mx-auto">
          <div className="text-center mb-16 animate-on-scroll">
            <h2 className="text-3xl md:text-4xl font-bold text-text mb-4 inline-block border-b-4 border-primary pb-2">
              אירועים
            </h2>
            <p className="text-lg text-text-light max-w-2xl mx-auto">
              הצטרפו אלינו לאירועים הקרובים של הקהילה
            </p>
          </div>

          <Card className="max-w-3xl mx-auto animate-on-scroll shadow-raised">
            <div className="p-6 text-center">
              <div className="bg-accent-dark p-10 rounded-xl shadow-inner">
                <Calendar className="w-16 h-16 mx-auto mb-4 text-primary" />
                <p className="text-text-light text-lg">אין אירועים מתוכננים כרגע</p>
                <p className="text-text-muted mt-2">עקבו אחר העדכונים לגבי אירועים עתידיים</p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Donations Section */}
      <section id="donate" className="py-20 px-4 bg-gradient-to-b from-secondary to-secondary-dark text-accent">
        <div className="container mx-auto">
          <div className="text-center mb-16 animate-on-scroll">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 inline-block border-b-4 border-accent pb-2">
              תרומות
            </h2>
            <p className="text-lg opacity-90 max-w-2xl mx-auto">
              תרומתכם תסייע בהחזקת בית הכנסת ופעילויותיו
            </p>
          </div>

          <Card className="max-w-3xl mx-auto bg-white animate-on-scroll shadow-raised">
            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold text-text mb-4 flex items-center">
                      <Heart className="w-5 h-5 mr-2 text-secondary" />
                      פרטי חשבון להעברה בנקאית
                    </h3>
                    <div className="space-y-3 bg-accent-light p-4 rounded-lg">
                      <p className="flex justify-between"><span className="font-medium">בנק:</span> <span>לאומי</span></p>
                      <p className="flex justify-between"><span className="font-medium">סניף:</span> <span>123</span></p>
                      <p className="flex justify-between"><span className="font-medium">מספר חשבון:</span> <span>456789</span></p>
                      <p className="flex justify-between"><span className="font-medium">על שם:</span> <span>עמותת בית הכנסת</span></p>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold text-text mb-4 flex items-center">
                      <PhoneCall className="w-5 h-5 mr-2 text-secondary" />
                      יצירת קשר לתרומות
                    </h3>
                    <div className="space-y-3 bg-accent-light p-4 rounded-lg">
                      <p className="flex justify-between"><span className="font-medium">טלפון:</span> <span>03-1234567</span></p>
                      <p className="flex justify-between"><span className="font-medium">נייד גבאי:</span> <span>050-1234567</span></p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-center mt-8 p-4 bg-secondary/10 rounded-lg">
                <p className="text-text-light font-medium">
                  תרומתכם תסייע בהחזקת בית הכנסת ופעילויותיו. תזכו למצוות!
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-accent py-12 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-bold mb-4">בית הכנסת</h3>
              <p className="mb-4 text-accent-light">מקום של תפילה, לימוד וקהילה</p>
              <p className="text-accent-light">© {new Date().getFullYear()} כל הזכויות שמורות</p>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-4">ניווט מהיר</h3>
              <ul className="space-y-2">
                {menuItems.map((item) => (
                  <li key={item.name}>
                    <a href={item.href} className="text-accent-light hover:text-accent flex items-center gap-2">
                      <item.icon className="w-4 h-4" />
                      <span>{item.name}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <Separator className="bg-primary-light opacity-30 my-8" />

          <div className="text-center text-accent-light text-sm">
            <p>בית הכנסת - רחוב האוניברסיטה 1, ירושלים</p>
          </div>
        </div>
      </footer>

      {/* Back to Top Button */}
      <a
        href="#"
        className="fixed bottom-6 left-6 bg-primary text-accent p-3 rounded-full shadow-lg hover:bg-primary-dark transition-colors z-40"
        aria-label="חזרה למעלה"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 15l7-7 7 7"
          />
        </svg>
      </a>
    </div>
  );
};

export default Index;
