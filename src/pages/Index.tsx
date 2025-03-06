import { Calendar, Clock, BookOpen, Mail, Heart, Facebook, Instagram, Youtube } from "lucide-react";
import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const Index = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    { name: "זמני תפילות", icon: Clock, href: "#prayers" },
    { name: "שיעורים", icon: BookOpen, href: "#classes" },
    { name: "אירועים", icon: Calendar, href: "#events" },
    { name: "תרומות", icon: Heart, href: "#donate" },
  ];

  /*
  טמפלייט להוספת אירוע/שיעור/תפילה:
  {
    title: "כותרת האירוע/השיעור/התפילה",
    day: "יום בשבוע",
    time: "שעה",
    location: "מיקום",
  }
  */

  return (
    <div className="min-h-screen bg-accent">
      {/* Navigation */}
      <nav className="fixed w-full bg-primary text-accent z-50 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold">בית הכנסת</h1>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8 flex-row-reverse">
              {menuItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  target={item.isExternal ? "_blank" : undefined}
                  rel={item.isExternal ? "noopener noreferrer" : undefined}
                  className="flex items-center gap-2 text-accent hover:text-accent-light transition-colors duration-200"
                >
                  <span>{item.name}</span>
                  <item.icon className="w-4 h-4" />
                </a>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-accent"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <div className="w-6 h-0.5 bg-current mb-1.5"></div>
              <div className="w-6 h-0.5 bg-current mb-1.5"></div>
              <div className="w-6 h-0.5 bg-current"></div>
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden absolute top-16 left-0 w-full bg-primary shadow-lg animate-fade-in">
              <div className="px-4 py-2 space-y-2">
                {menuItems.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    target={item.isExternal ? "_blank" : undefined}
                    rel={item.isExternal ? "noopener noreferrer" : undefined}
                    className="flex items-center gap-2 py-2 text-accent hover:text-accent-light transition-colors duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <item.icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-12 px-4 bg-primary text-accent">
        <div className="container mx-auto text-center animate-fade-up">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            ברוכים הבאים לבית הכנסת שלנו
          </h1>
          <p className="text-xl opacity-90 max-w-2xl mx-auto mb-8">
            מקום של תפילה, לימוד וקהילה
          </p>
        </div>
      </section>

      {/* Prayer Times Section */}
      <section id="prayers" className="py-12 px-4 bg-accent">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-text text-center mb-8">
            זמני תפילות
          </h2>

          {/* בית הכנסת החדש */}
          <div className="bg-accent-light p-6 rounded-lg shadow-sm mb-8 border-r-4 border-primary">
            <h3 className="text-2xl font-bold text-primary mb-4 flex items-center">
              <Clock className="w-5 h-5 ml-2" />
              בית הכנסת החדש
            </h3>
            <div className="space-y-6">
              <div>
                <h4 className="text-xl font-bold text-text mb-2">שחרית</h4>
                <div className="space-y-2 mr-4">
                  <p className="text-text-light">כרגע אין מניין קבוע</p>
                </div>
              </div>
              
              <div>
                <h4 className="text-xl font-bold text-text mb-2">מנחה</h4>
                <div className="space-y-2 mr-4">
                  <p className="text-text-light">13:30 - (רגיל)</p>
                  <p className="text-text-light">15:45 - (רגיל)</p>
                </div>
              </div>

              <div>
                <h4 className="text-xl font-bold text-text mb-2">ערבית</h4>
                <div className="space-y-2 mr-4">
                  <p className="text-text-light">18:00</p>
                </div>
              </div>
            </div>
          </div>

          {/* מקומות אחרים */}
          <div className="bg-accent-light p-6 rounded-lg shadow-sm transition-all duration-300 hover:shadow-md hover:scale-[1.01]">
            <h3 className="text-2xl font-bold text-secondary mb-4 flex items-center">
              <Clock className="w-5 h-5 ml-2" />
              מקומות אחרים
            </h3>
            
            <Collapsible className="space-y-6">
              <div>
                <h4 className="text-xl font-bold text-text mb-2">שחרית</h4>
                <div className="space-y-2 mr-4">
                  <p className="text-text-light">ימים ב׳-ה׳: 6:50 - בית הכנסת תלפיות</p>
                  <p className="text-text-light">ראש חודש וצומות: 6:40</p>
                  <p className="text-text-light">ימים א׳, ו׳ (אם מתקיים מניין): 7:30</p>
                </div>
              </div>
              
              <CollapsibleTrigger className="w-full text-right text-primary hover:text-primary-dark transition-colors">
                <span className="flex items-center justify-end mt-2">
                  <span className="ml-1">הראה את כל זמני המנחה</span>
                </span>
              </CollapsibleTrigger>
              
              <CollapsibleContent>
                <div>
                  <h4 className="text-xl font-bold text-text mb-2">מנחה</h4>
                  <div className="space-y-2 mr-4">
                    <p className="text-text-light">13:15 - בית הכנסת תלפיות</p>
                    <p className="text-text-light">13:20 - בנין קהאלי</p>
                    <p className="text-text-light">13:30 - מעונות ליברמן 4 קומה 1</p>
                    <p className="text-text-light">13:50 - חדר תפילה ליד האקווריום (קצר)</p>
                    <p className="text-text-light">14:15 - במשק</p>
                    <p className="text-text-light">15:00 - אקדמיה ללשון העברית (קצר)</p>
                  </div>
                </div>
              </CollapsibleContent>

              <div>
                <h4 className="text-xl font-bold text-text mb-2">ערבית</h4>
                <div className="space-y-2 mr-4">
                  <p className="text-text-light">20:00 - מול האקווריום (20:15 כשמתאחר צאה״ב) - לפי רישום</p>
                </div>
              </div>
            </Collapsible>
          </div>
        </div>
      </section>

      {/* Classes Section */}
      <section id="classes" className="py-12 px-4 bg-primary text-accent">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">
            שיעורים
          </h2>
          <div className="bg-accent p-6 rounded-lg shadow-sm transition-all duration-300 hover:shadow-md hover:scale-[1.01] text-center">
            <p className="text-text-light text-lg">אין שיעורים קבועים כרגע</p>
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section id="events" className="py-12 px-4 bg-accent">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-text text-center mb-8">
            אירועים
          </h2>
          <div className="bg-accent-light p-6 rounded-lg shadow-sm transition-all duration-300 hover:shadow-md hover:scale-[1.01] text-center">
            <p className="text-text-light text-lg">אין אירועים מתוכננים כרגע</p>
          </div>
        </div>
      </section>

      {/* Donations Section */}
      <section id="donate" className="py-12 px-4 bg-secondary">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-accent text-center mb-8">
            תרומות
          </h2>
          <div className="max-w-2xl mx-auto bg-accent p-8 rounded-lg shadow-sm transition-all duration-300 hover:shadow-md hover:scale-[1.01]">
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-text mb-4">פרטי חשבון להעברה בנקאית</h3>
                <div className="space-y-2">
                  <p className="text-text-light">בנק: לאומי</p>
                  <p className="text-text-light">סניף: 123</p>
                  <p className="text-text-light">מספר חשבון: 456789</p>
                  <p className="text-text-light">על שם: עמותת בית הכנסת</p>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-text mb-4">יצירת קשר לתרומות</h3>
                <div className="space-y-2">
                  <p className="text-text-light">טלפון: 03-1234567</p>
                  <p className="text-text-light">נייד גבאי: 050-1234567</p>
                </div>
              </div>
              <div className="text-center pt-4">
                <p className="text-text-light">
                  תרומתכם תסייע בהחזקת בית הכנסת ופעילויותיו. תזכו למצוות!
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
