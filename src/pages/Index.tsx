
import { Calendar, Clock, BookOpen, Mail, Heart } from "lucide-react";
import { useState } from "react";

const Index = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    { name: "זמני תפילות", icon: Clock, href: "#prayers" },
    { name: "שיעורים", icon: BookOpen, href: "#classes" },
    { name: "אירועים", icon: Calendar, href: "#events" },
    { name: "תרומות", icon: Heart, href: "#donate" },
  ];

  return (
    <div className="min-h-screen bg-primary">
      {/* Navigation */}
      <nav className="fixed w-full bg-white/80 backdrop-blur-md z-50 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-text">בית הכנסת</h1>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8 flex-row-reverse">
              {menuItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="flex items-center gap-2 text-text hover:text-accent transition-colors duration-200"
                >
                  <span>{item.name}</span>
                  <item.icon className="w-4 h-4" />
                </a>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <div className="w-6 h-0.5 bg-text mb-1.5"></div>
              <div className="w-6 h-0.5 bg-text mb-1.5"></div>
              <div className="w-6 h-0.5 bg-text"></div>
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden absolute top-16 left-0 w-full bg-white/95 backdrop-blur-md shadow-lg animate-fade-in">
              <div className="px-4 py-2 space-y-2">
                {menuItems.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="flex items-center gap-2 py-2 text-text hover:text-accent transition-colors duration-200"
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
      <section className="pt-24 pb-12 px-4">
        <div className="container mx-auto text-center animate-fade-up">
          <h1 className="text-4xl md:text-5xl font-bold text-text mb-6">
            ברוכים הבאים לבית הכנסת שלנו
          </h1>
          <p className="text-text-light text-lg max-w-2xl mx-auto mb-8">
            מקום של תפילה, לימוד וקהילה
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="#prayers"
              className="bg-accent text-white px-6 py-3 rounded-lg hover:bg-accent-light transition-colors duration-200"
            >
              זמני תפילות
            </a>
            <a
              href="#donate"
              className="bg-secondary text-white px-6 py-3 rounded-lg hover:bg-secondary-light transition-colors duration-200"
            >
              תרומות
            </a>
          </div>
        </div>
      </section>

      {/* Content Sections */}
      {[
        {
          id: "prayers",
          title: "זמני תפילות",
          content: [
            { day: "שבת", shacharit: "08:30", mincha: "17:30", arvit: "18:30" },
            { day: "ראשון", shacharit: "06:30", mincha: "17:30", arvit: "18:30" },
            { day: "שני", shacharit: "06:30", mincha: "17:30", arvit: "18:30" },
          ],
          type: "prayers"
        },
        {
          id: "classes",
          title: "שיעורים",
          content: [
            { title: "שיעור דף יומי", time: "20:00", rabbi: "הרב ישראל כהן" },
            { title: "הלכה יומית", time: "19:00", rabbi: "הרב דוד לוי" },
            { title: "פרשת השבוע", time: "21:00", rabbi: "הרב יעקב ישראל" },
          ],
          type: "classes"
        },
        {
          id: "events",
          title: "אירועים",
          content: [
            { title: "סעודה שלישית", date: "שבת", time: "17:00" },
            { title: "שמחת בית השואבה", date: "15/10", time: "20:00" },
            { title: "שיעור מיוחד", date: "20/10", time: "19:30" },
          ],
          type: "events"
        }
      ].map((section) => (
        <section key={section.id} id={section.id} className="py-12 px-4 bg-white">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-text text-center mb-8">
              {section.title}
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {section.content.map((item, index) => (
                <div
                  key={index}
                  className="bg-primary p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
                >
                  {section.type === "prayers" ? (
                    <>
                      <h3 className="text-xl font-bold text-text mb-4">{item.day}</h3>
                      <div className="space-y-2">
                        <p className="text-text-light">שחרית: {item.shacharit}</p>
                        <p className="text-text-light">מנחה: {item.mincha}</p>
                        <p className="text-text-light">ערבית: {item.arvit}</p>
                      </div>
                    </>
                  ) : section.type === "classes" ? (
                    <>
                      <h3 className="text-xl font-bold text-text mb-4">{item.title}</h3>
                      <div className="space-y-2">
                        <p className="text-text-light">זמן: {item.time}</p>
                        <p className="text-text-light">מרצה: {item.rabbi}</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <h3 className="text-xl font-bold text-text mb-4">{item.title}</h3>
                      <div className="space-y-2">
                        <p className="text-text-light">תאריך: {item.date}</p>
                        <p className="text-text-light">שעה: {item.time}</p>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* Donations Section */}
      <section id="donate" className="py-12 px-4 bg-white">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-text text-center mb-8">
            תרומות
          </h2>
          <div className="max-w-2xl mx-auto bg-primary p-8 rounded-lg shadow-sm">
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
