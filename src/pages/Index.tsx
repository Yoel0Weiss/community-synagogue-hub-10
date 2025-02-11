
import { Calendar, Clock, BookOpen, Mail, Heart } from "lucide-react";
import { useState } from "react";

const Index = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    { name: "זמני תפילות", icon: Clock, href: "#prayers" },
    { name: "שיעורים", icon: BookOpen, href: "#classes" },
    { name: "אירועים", icon: Calendar, href: "#events" },
    { name: "צור קשר", icon: Mail, href: "#contact" },
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
              href="#contact"
              className="bg-secondary text-white px-6 py-3 rounded-lg hover:bg-secondary-light transition-colors duration-200"
            >
              צור קשר
            </a>
          </div>
        </div>
      </section>

      {/* Prayer Times Section */}
      <section id="prayers" className="py-12 px-4 bg-white">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-text text-center mb-8">
            זמני תפילות
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { day: "שבת", shacharit: "08:30", mincha: "17:30", arvit: "18:30" },
              { day: "ראשון", shacharit: "06:30", mincha: "17:30", arvit: "18:30" },
              { day: "שני", shacharit: "06:30", mincha: "17:30", arvit: "18:30" },
            ].map((time) => (
              <div
                key={time.day}
                className="bg-primary p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <h3 className="text-xl font-bold text-text mb-4">{time.day}</h3>
                <div className="space-y-2">
                  <p className="text-text-light">שחרית: {time.shacharit}</p>
                  <p className="text-text-light">מנחה: {time.mincha}</p>
                  <p className="text-text-light">ערבית: {time.arvit}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-12 px-4">
        <div className="container mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              title: "שיעורים",
              description: "הצטרפו לשיעורי התורה השבועיים שלנו",
              icon: BookOpen,
              href: "#classes",
            },
            {
              title: "אירועים",
              description: "לוח אירועים ופעילויות קהילתיות",
              icon: Calendar,
              href: "#events",
            },
            {
              title: "צור קשר",
              description: "נשמח לעמוד לרשותכם בכל שאלה",
              icon: Mail,
              href: "#contact",
            },
          ].map((item) => (
            <a
              key={item.title}
              href={item.href}
              className="group bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-center gap-4 mb-4">
                <item.icon className="w-6 h-6 text-accent" />
                <h3 className="text-xl font-bold text-text">{item.title}</h3>
              </div>
              <p className="text-text-light">{item.description}</p>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Index;
