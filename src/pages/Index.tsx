
import { Calendar, Clock, BookOpen, Heart } from "lucide-react";
import { useState } from "react";

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
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed w-full bg-white shadow-md z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-secondary">בית הכנסת</h1>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8 flex-row-reverse">
              {menuItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="flex items-center gap-2 text-text hover:text-secondary transition-colors duration-300 font-medium"
                >
                  <span>{item.name}</span>
                  <item.icon className="w-5 h-5" />
                </a>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-secondary"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="תפריט"
            >
              <div className="w-6 h-0.5 bg-current mb-1.5"></div>
              <div className="w-6 h-0.5 bg-current mb-1.5"></div>
              <div className="w-6 h-0.5 bg-current"></div>
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden absolute top-20 left-0 w-full bg-white shadow-lg animate-fade-in">
              <div className="px-4 py-2 space-y-2">
                {menuItems.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="flex items-center gap-2 py-3 text-text hover:text-secondary transition-colors duration-300"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.name}</span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 bg-secondary text-white">
        <div className="container mx-auto text-center animate-fade-up">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            ברוכים הבאים לבית הכנסת שלנו
          </h1>
          <p className="text-xl opacity-90 max-w-2xl mx-auto mb-8 readable-text">
            מקום של תפילה, לימוד וקהילה
          </p>
        </div>
      </section>

      {/* Prayer Times Section */}
      <section id="prayers" className="py-16 px-4 bg-background">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-secondary text-center mb-12">
            זמני תפילות
          </h2>
          <div className="space-y-8 max-w-4xl mx-auto">
            <div className="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
              <h3 className="text-2xl font-bold text-secondary mb-6">שחרית</h3>
              <div className="space-y-3">
                <p className="text-text-light">ימים ב׳-ה׳: 6:50 - בית הכנסת תלפיות</p>
                <p className="text-text-light">ראש חודש וצומות: 6:40</p>
                <p className="text-text-light">ימים א׳, ו׳ (אם מתקיים מניין): 7:30</p>
              </div>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
              <h3 className="text-2xl font-bold text-secondary mb-6">מנחה</h3>
              <div className="space-y-3">
                <p className="text-text-light">13:15 - בית הכנסת תלפיות</p>
                <p className="text-text-light">13:20 - בנין קהאלי</p>
                <p className="text-text-light">13:30 - מעונות ליברמן 4 קומה 1</p>
                <p className="text-text-light">13:30 - בית הכנסת החדש (רגיל)</p>
                <p className="text-text-light">13:50 - חדר תפילה ליד האקווריום (קצר)</p>
                <p className="text-text-light">14:15 - במשק</p>
                <p className="text-text-light">15:00 - אקדמיה ללשון העברית (קצר)</p>
                <p className="text-text-light">15:45 - בית הכנסת החדש (רגיל)</p>
              </div>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
              <h3 className="text-2xl font-bold text-secondary mb-6">ערבית</h3>
              <div className="space-y-3">
                <p className="text-text-light">18:00 - בית הכנסת החדש</p>
                <p className="text-text-light">20:00 - מול האקווריום (20:15 כשמתאחר צאה״ב) - לפי רישום</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Classes Section */}
      <section id="classes" className="py-16 px-4 bg-background-dark">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-secondary text-center mb-12">
            שיעורים
          </h2>
          <div className="bg-white p-8 rounded-lg shadow-sm max-w-2xl mx-auto text-center">
            <p className="text-text-light text-lg">אין שיעורים קבועים כרגע</p>
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section id="events" className="py-16 px-4 bg-background">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-secondary text-center mb-12">
            אירועים
          </h2>
          <div className="bg-white p-8 rounded-lg shadow-sm max-w-2xl mx-auto text-center">
            <p className="text-text-light text-lg">אין אירועים מתוכננים כרגע</p>
          </div>
        </div>
      </section>

      {/* Donations Section */}
      <section id="donate" className="py-16 px-4 bg-background-dark">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-secondary text-center mb-12">
            תרומות
          </h2>
          <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-sm">
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-bold text-secondary mb-6">פרטי חשבון להעברה בנקאית</h3>
                <div className="space-y-3">
                  <p className="text-text-light">בנק: לאומי</p>
                  <p className="text-text-light">סניף: 123</p>
                  <p className="text-text-light">מספר חשבון: 456789</p>
                  <p className="text-text-light">על שם: עמותת בית הכנסת</p>
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-secondary mb-6">יצירת קשר לתרומות</h3>
                <div className="space-y-3">
                  <p className="text-text-light">טלפון: 03-1234567</p>
                  <p className="text-text-light">נייד גבאי: 050-1234567</p>
                </div>
              </div>
              <div className="text-center pt-4">
                <p className="text-text-light italic">
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
