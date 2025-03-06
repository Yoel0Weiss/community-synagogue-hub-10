
import { useState, useEffect } from "react";
import { 
  Calendar, 
  Clock, 
  BookOpen, 
  Heart, 
  Menu, 
  X, 
  ChevronDown, 
  Search, 
  MapPin,
  PhoneCall,
  Mail
} from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const Index = () => {
  // State for UI elements
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeSection, setActiveSection] = useState("prayers");
  const [animatedElements, setAnimatedElements] = useState<HTMLElement[]>([]);

  // Menu items for navigation
  const menuItems = [
    { name: "זמני תפילות", icon: Clock, href: "#prayers" },
    { name: "שיעורים", icon: BookOpen, href: "#classes" },
    { name: "אירועים", icon: Calendar, href: "#events" },
    { name: "תרומות", icon: Heart, href: "#donate" },
    { name: "צור קשר", icon: Mail, href: "#contact" },
  ];

  // Scroll animation effect
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fade-in");
            entry.target.classList.add("opacity-100");
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll(".animate-on-scroll");
    elements.forEach((el) => {
      observer.observe(el);
      setAnimatedElements((prev) => [...prev, el as HTMLElement]);
    });

    return () => {
      animatedElements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  // Search functionality
  const filterContent = (content: string) => {
    if (!searchTerm) return true;
    return content.toLowerCase().includes(searchTerm.toLowerCase());
  };

  // Handle section active state on scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = ["prayers", "classes", "events", "donate", "contact"];
      
      // Find which section is currently in view
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 200 && rect.bottom >= 200) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-accent">
      {/* Navigation */}
      <nav className="fixed w-full bg-primary text-accent z-50 shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center">
              <h1 className="text-2xl md:text-3xl font-bold">בית הכנסת</h1>
            </div>

            {/* Search Bar */}
            <div className="hidden md:flex items-center max-w-xs w-full relative mx-4">
              <Input
                type="text"
                placeholder="חיפוש..."
                className="w-full pr-10 border-none bg-primary-light text-accent focus:ring-2 focus:ring-accent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="w-5 h-5 absolute left-3 text-accent-light" />
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
                {/* Mobile Search */}
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="חיפוש..."
                    className="w-full pr-10 bg-primary-light text-accent border-none"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-accent-light" />
                </div>

                {menuItems.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className={`flex items-center gap-2 py-3 px-4 text-accent hover:bg-primary-light rounded-md transition-colors duration-200 ${
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
              <a href="#contact">צור קשר</a>
            </Button>
          </div>
        </div>
      </section>

      {/* Prayer Times Section */}
      <section id="prayers" className="py-20 px-4 bg-accent">
        <div className="container mx-auto">
          <div className="text-center mb-16 animate-on-scroll opacity-0">
            <h2 className="text-3xl md:text-4xl font-bold text-text mb-4 inline-block border-b-4 border-primary pb-2">
              זמני תפילות
            </h2>
            <p className="text-lg text-text-light max-w-2xl mx-auto">
              הצטרפו אלינו לתפילות בזמנים הבאים, כולם מוזמנים
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* בית הכנסת החדש */}
            <Card className="animate-on-scroll opacity-0 shadow-raised hover:shadow-lg transition-shadow duration-300 overflow-hidden border-t-4 border-t-primary">
              <CardHeader className="bg-gradient-to-r from-primary to-primary-light text-accent">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  <CardTitle className="text-2xl">בית הכנסת החדש</CardTitle>
                </div>
                <CardDescription className="text-accent-light">זמני תפילה עדכניים</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <Tabs defaultValue="shacharit" className="w-full">
                  <TabsList className="w-full grid grid-cols-3 mb-4">
                    <TabsTrigger value="shacharit">שחרית</TabsTrigger>
                    <TabsTrigger value="mincha">מנחה</TabsTrigger>
                    <TabsTrigger value="arvit">ערבית</TabsTrigger>
                  </TabsList>
                  <TabsContent value="shacharit" className="space-y-4">
                    <div className="p-4 bg-accent-light rounded-lg">
                      <p className="text-text-light text-center">כרגע אין מניין קבוע</p>
                    </div>
                  </TabsContent>
                  <TabsContent value="mincha" className="space-y-4">
                    <div className="flex justify-between items-center p-4 bg-accent-light rounded-lg mb-2">
                      <span className="font-medium">13:30</span>
                      <span className="text-text-light">(רגיל)</span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-accent-light rounded-lg">
                      <span className="font-medium">15:45</span>
                      <span className="text-text-light">(רגיל)</span>
                    </div>
                  </TabsContent>
                  <TabsContent value="arvit" className="space-y-4">
                    <div className="flex justify-between items-center p-4 bg-accent-light rounded-lg">
                      <span className="font-medium">18:00</span>
                      <span className="text-text-light"></span>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* מקומות אחרים */}
            <Card className="animate-on-scroll opacity-0 shadow-raised hover:shadow-lg transition-shadow duration-300 overflow-hidden border-t-4 border-t-secondary">
              <CardHeader className="bg-gradient-to-r from-secondary to-secondary-light text-accent">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  <CardTitle className="text-2xl">מקומות אחרים</CardTitle>
                </div>
                <CardDescription className="text-accent-light">תפילות במיקומים נוספים</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <Tabs defaultValue="shacharit" className="w-full">
                  <TabsList className="w-full grid grid-cols-3 mb-4">
                    <TabsTrigger value="shacharit">שחרית</TabsTrigger>
                    <TabsTrigger value="mincha">מנחה</TabsTrigger>
                    <TabsTrigger value="arvit">ערבית</TabsTrigger>
                  </TabsList>
                  <TabsContent value="shacharit" className="space-y-4">
                    <div className="p-4 bg-accent-light rounded-lg mb-2">
                      <div className="flex justify-between">
                        <span className="font-medium">ימים ב׳-ה׳: 6:50</span>
                        <span className="text-text-light">בית הכנסת תלפיות</span>
                      </div>
                    </div>
                    <div className="p-4 bg-accent-light rounded-lg mb-2">
                      <div className="flex justify-between">
                        <span className="font-medium">ראש חודש וצומות: 6:40</span>
                        <span className="text-text-light"></span>
                      </div>
                    </div>
                    <div className="p-4 bg-accent-light rounded-lg">
                      <div className="flex justify-between">
                        <span className="font-medium">ימים א׳, ו׳: 7:30</span>
                        <span className="text-text-light">אם מתקיים מניין</span>
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="mincha" className="space-y-3 max-h-60 overflow-y-auto pr-2">
                    <div className="p-4 bg-accent-light rounded-lg">
                      <div className="flex justify-between">
                        <span className="font-medium">13:15</span>
                        <span className="text-text-light">בית הכנסת תלפיות</span>
                      </div>
                    </div>
                    <div className="p-4 bg-accent-light rounded-lg">
                      <div className="flex justify-between">
                        <span className="font-medium">13:20</span>
                        <span className="text-text-light">בנין קהאלי</span>
                      </div>
                    </div>
                    <div className="p-4 bg-accent-light rounded-lg">
                      <div className="flex justify-between">
                        <span className="font-medium">13:30</span>
                        <span className="text-text-light">מעונות ליברמן 4 קומה 1</span>
                      </div>
                    </div>
                    <div className="p-4 bg-accent-light rounded-lg">
                      <div className="flex justify-between">
                        <span className="font-medium">13:50</span>
                        <span className="text-text-light">חדר תפילה ליד האקווריום (קצר)</span>
                      </div>
                    </div>
                    <div className="p-4 bg-accent-light rounded-lg">
                      <div className="flex justify-between">
                        <span className="font-medium">14:15</span>
                        <span className="text-text-light">במשק</span>
                      </div>
                    </div>
                    <div className="p-4 bg-accent-light rounded-lg">
                      <div className="flex justify-between">
                        <span className="font-medium">15:00</span>
                        <span className="text-text-light">אקדמיה ללשון העברית (קצר)</span>
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="arvit" className="space-y-4">
                    <div className="p-4 bg-accent-light rounded-lg">
                      <div className="flex justify-between">
                        <span className="font-medium">20:00</span>
                        <span className="text-text-light">מול האקווריום - לפי רישום</span>
                      </div>
                      <p className="text-text-muted text-sm mt-2">20:15 כשמתאחר צאה״ב</p>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Classes Section */}
      <section id="classes" className="py-20 px-4 bg-accent-dark">
        <div className="container mx-auto">
          <div className="text-center mb-16 animate-on-scroll opacity-0">
            <h2 className="text-3xl md:text-4xl font-bold text-text mb-4 inline-block border-b-4 border-primary pb-2">
              שיעורים
            </h2>
            <p className="text-lg text-text-light max-w-2xl mx-auto">
              הצטרפו לשיעורים שלנו לעומק בתורה ובמסורת
            </p>
          </div>

          <Card className="max-w-3xl mx-auto animate-on-scroll opacity-0 shadow-raised">
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
          <div className="text-center mb-16 animate-on-scroll opacity-0">
            <h2 className="text-3xl md:text-4xl font-bold text-text mb-4 inline-block border-b-4 border-primary pb-2">
              אירועים
            </h2>
            <p className="text-lg text-text-light max-w-2xl mx-auto">
              הצטרפו אלינו לאירועים הקרובים של הקהילה
            </p>
          </div>

          <Card className="max-w-3xl mx-auto animate-on-scroll opacity-0 shadow-raised">
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
          <div className="text-center mb-16 animate-on-scroll opacity-0">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 inline-block border-b-4 border-accent pb-2">
              תרומות
            </h2>
            <p className="text-lg opacity-90 max-w-2xl mx-auto">
              תרומתכם תסייע בהחזקת בית הכנסת ופעילויותיו
            </p>
          </div>

          <Card className="max-w-3xl mx-auto bg-white animate-on-scroll opacity-0 shadow-raised">
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

      {/* Contact Section */}
      <section id="contact" className="py-20 px-4 bg-accent">
        <div className="container mx-auto">
          <div className="text-center mb-16 animate-on-scroll opacity-0">
            <h2 className="text-3xl md:text-4xl font-bold text-text mb-4 inline-block border-b-4 border-primary pb-2">
              צור קשר
            </h2>
            <p className="text-lg text-text-light max-w-2xl mx-auto">
              נשמח לעמוד לרשותכם בכל שאלה או בקשה
            </p>
          </div>

          <Card className="max-w-3xl mx-auto animate-on-scroll opacity-0 shadow-raised">
            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-bold text-text mb-6">פרטי התקשרות</h3>
                  <div className="space-y-6">
                    <div className="flex items-start">
                      <MapPin className="w-5 h-5 mr-3 text-primary mt-1" />
                      <div>
                        <h4 className="font-medium">כתובת</h4>
                        <p className="text-text-light">רחוב האוניברסיטה 1, ירושלים</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Mail className="w-5 h-5 mr-3 text-primary mt-1" />
                      <div>
                        <h4 className="font-medium">דוא"ל</h4>
                        <p className="text-text-light">contact@synagogue.org.il</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <PhoneCall className="w-5 h-5 mr-3 text-primary mt-1" />
                      <div>
                        <h4 className="font-medium">טלפון</h4>
                        <p className="text-text-light">02-1234567</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-xl font-bold text-text mb-6">שלח הודעה</h3>
                  <form className="space-y-4">
                    <div>
                      <Input 
                        placeholder="שם מלא" 
                        className="w-full" 
                        aria-label="שם מלא"
                      />
                    </div>
                    <div>
                      <Input 
                        type="email" 
                        placeholder="דוא״ל" 
                        className="w-full" 
                        aria-label="דוא״ל"
                      />
                    </div>
                    <div>
                      <Input 
                        type="tel" 
                        placeholder="טלפון" 
                        className="w-full" 
                        aria-label="טלפון"
                      />
                    </div>
                    <div>
                      <textarea 
                        placeholder="הודעה" 
                        className="w-full min-h-[120px] rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" 
                        aria-label="הודעה"
                      />
                    </div>
                    <Button className="w-full">שלח הודעה</Button>
                  </form>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-accent py-12 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
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
            
            <div>
              <h3 className="text-xl font-bold mb-4">שעות פעילות</h3>
              <div className="space-y-2 text-accent-light">
                <p>יום ראשון - חמישי: 07:00 - 22:00</p>
                <p>יום שישי: 07:00 - כניסת שבת</p>
                <p>שבת: לפי זמני התפילות</p>
              </div>
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
