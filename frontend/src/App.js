import "@/App.css";
import { useState } from "react";
import { Mail, Phone, MapPin, Calendar, Users, Home, Heart, ArrowRight, Menu, X, ChevronRight } from "lucide-react";

// EVO Color Palette - basiert auf existierender Seite (warm, familienfreundlich)
// Primary: Dunkelblau/Navy, Accent: Warmes Orange/Gelb, Neutral: Weiss/Grau

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  return (
    <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <div className="flex items-center gap-3" data-testid="logo">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg md:text-xl">E</span>
            </div>
            <div className="hidden sm:block">
              <p className="font-semibold text-gray-900 text-sm md:text-base">Elternvereinigung</p>
              <p className="text-xs text-gray-500">Oberglatt</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8" data-testid="desktop-nav">
            <a href="#start" className="text-gray-600 hover:text-amber-600 transition-colors text-sm font-medium">Start</a>
            <a href="#ueber-uns" className="text-gray-600 hover:text-amber-600 transition-colors text-sm font-medium">Über uns</a>
            <a href="#aktuell" className="text-gray-600 hover:text-amber-600 transition-colors text-sm font-medium">Aktuell</a>
            <a href="#robihuette" className="text-gray-600 hover:text-amber-600 transition-colors text-sm font-medium">Robihütte</a>
            <a href="#kontakt" className="text-gray-600 hover:text-amber-600 transition-colors text-sm font-medium">Kontakt</a>
          </nav>

          {/* CTA Button */}
          <div className="hidden md:block">
            <a 
              href="#mitglied-werden" 
              className="bg-amber-500 hover:bg-amber-600 text-white px-5 py-2.5 rounded-full text-sm font-medium transition-all hover:shadow-lg"
              data-testid="cta-mitglied"
            >
              Mitglied werden
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2" 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            data-testid="mobile-menu-toggle"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 border-t border-gray-100" data-testid="mobile-nav">
            <div className="flex flex-col gap-3">
              <a href="#start" className="text-gray-600 hover:text-amber-600 py-2">Start</a>
              <a href="#ueber-uns" className="text-gray-600 hover:text-amber-600 py-2">Über uns</a>
              <a href="#aktuell" className="text-gray-600 hover:text-amber-600 py-2">Aktuell</a>
              <a href="#robihuette" className="text-gray-600 hover:text-amber-600 py-2">Robihütte</a>
              <a href="#kontakt" className="text-gray-600 hover:text-amber-600 py-2">Kontakt</a>
              <a href="#mitglied-werden" className="bg-amber-500 text-white px-4 py-2 rounded-full text-center mt-2">
                Mitglied werden
              </a>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

const HeroSection = () => {
  return (
    <section id="start" className="relative min-h-[90vh] flex items-center pt-20" data-testid="hero-section">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1609220136736-443140cffec6?w=1920&q=80" 
          alt="Kinder spielen zusammen"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 via-gray-900/60 to-transparent"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-2xl">
          <span className="inline-block text-amber-400 text-sm font-medium tracking-wider uppercase mb-4">
            Willkommen bei der
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight" data-testid="hero-title">
            Elternvereinigung
            <span className="block text-amber-400">Oberglatt</span>
          </h1>
          <p className="text-xl text-gray-200 mb-8 leading-relaxed">
            Gemeinschaft von Eltern für Kinder in Oberglatt. 
            Wir schaffen Räume für Begegnung, Austausch und Mitwirkung.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a 
              href="#mitglied-werden" 
              className="inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-8 py-4 rounded-full text-lg font-medium transition-all hover:shadow-xl hover:scale-105"
              data-testid="hero-cta-primary"
            >
              Mitglied werden
              <ArrowRight size={20} />
            </a>
            <a 
              href="#robihuette" 
              className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/30 px-8 py-4 rounded-full text-lg font-medium transition-all backdrop-blur-sm"
              data-testid="hero-cta-secondary"
            >
              Robihütte mieten
            </a>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center pt-2">
          <div className="w-1.5 h-3 bg-white/70 rounded-full"></div>
        </div>
      </div>
    </section>
  );
};

const MissionSection = () => {
  const values = [
    { icon: Users, title: "Begegnungen", desc: "Anlässe für Familien, Kinder und Jugendliche" },
    { icon: Heart, title: "Gemeinschaft", desc: "Lebendiges Miteinander in unserer Gemeinde" },
    { icon: Home, title: "Zusammenarbeit", desc: "Mit Schulen, Vereinen und der Gemeinde" },
  ];

  return (
    <section className="py-20 bg-white" data-testid="mission-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Wofür wir stehen
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Die Elternvereinigung Oberglatt ist eine Gemeinschaft von Eltern für Kinder.
            Wir setzen uns für ein lebendiges Miteinander ein.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {values.map((value, index) => (
            <div 
              key={index}
              className="group p-8 bg-gray-50 rounded-2xl hover:bg-amber-50 transition-all duration-300 hover:shadow-lg"
              data-testid={`value-card-${index}`}
            >
              <div className="w-14 h-14 bg-amber-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-amber-500 transition-colors">
                <value.icon className="w-7 h-7 text-amber-600 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{value.title}</h3>
              <p className="text-gray-600">{value.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const EventsSection = () => {
  const events = [
    {
      date: "15",
      month: "Feb",
      title: "Kinderclub Nachmittag",
      location: "Robihütte",
      time: "14:00 - 17:00",
      image: "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=400&q=80"
    },
    {
      date: "22",
      month: "Feb",
      title: "Familien-Spielabend",
      location: "Gemeindesaal",
      time: "18:00 - 21:00",
      image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&q=80"
    },
    {
      date: "08",
      month: "Mär",
      title: "Frühlingsmarkt",
      location: "Dorfplatz Oberglatt",
      time: "10:00 - 16:00",
      image: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=400&q=80"
    },
  ];

  return (
    <section id="aktuell" className="py-20 bg-gray-50" data-testid="events-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
          <div>
            <span className="text-amber-600 font-medium text-sm tracking-wider uppercase">Aktuell</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">
              Nächste Anlässe
            </h2>
          </div>
          <a 
            href="#alle-anlaesse" 
            className="inline-flex items-center gap-2 text-amber-600 font-medium mt-4 md:mt-0 hover:gap-3 transition-all"
            data-testid="events-view-all"
          >
            Alle Anlässe
            <ChevronRight size={20} />
          </a>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {events.map((event, index) => (
            <article 
              key={index}
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group"
              data-testid={`event-card-${index}`}
            >
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={event.image} 
                  alt={event.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 bg-white rounded-lg px-3 py-2 shadow-lg">
                  <span className="block text-2xl font-bold text-amber-600">{event.date}</span>
                  <span className="block text-xs text-gray-500 uppercase">{event.month}</span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{event.title}</h3>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <MapPin size={14} />
                    {event.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar size={14} />
                    {event.time}
                  </span>
                </div>
                <a 
                  href="#anmelden" 
                  className="mt-4 inline-flex items-center gap-1 text-amber-600 font-medium text-sm hover:gap-2 transition-all"
                >
                  Anmelden
                  <ArrowRight size={16} />
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

const RobihuetteSection = () => {
  return (
    <section id="robihuette" className="py-20 bg-white" data-testid="robihuette-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Image Side */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=800&q=80" 
                alt="Robihütte Oberglatt"
                className="w-full h-[400px] lg:h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/50 to-transparent"></div>
            </div>
            {/* Floating Card */}
            <div className="absolute -bottom-6 -right-6 bg-amber-500 text-white p-6 rounded-2xl shadow-xl hidden md:block">
              <p className="text-3xl font-bold">CHF 80</p>
              <p className="text-sm opacity-90">ab / 4 Stunden</p>
            </div>
          </div>

          {/* Content Side */}
          <div>
            <span className="text-amber-600 font-medium text-sm tracking-wider uppercase">Robihütte</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-6">
              Dein Ort für unvergessliche Feste
            </h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Die Robihütte der Elternvereinigung Oberglatt ist ein Treffpunkt für Kinder, 
              Familien und die Dorfgemeinschaft. Perfekt für Geburtstage, Familienfeiern 
              und Vereinsanlässe.
            </p>
            
            <ul className="space-y-3 mb-8">
              {[
                "Platz für bis zu 50 Personen",
                "Voll ausgestattete Küche",
                "Grosser Garten mit Spielplatz",
                "Parkplätze vor Ort"
              ].map((item, index) => (
                <li key={index} className="flex items-center gap-3 text-gray-700">
                  <span className="w-5 h-5 bg-amber-100 rounded-full flex items-center justify-center">
                    <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
                  </span>
                  {item}
                </li>
              ))}
            </ul>

            <div className="flex flex-col sm:flex-row gap-4">
              <a 
                href="#reservieren" 
                className="inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-full font-medium transition-all hover:shadow-lg"
                data-testid="robihuette-cta"
              >
                Jetzt reservieren
                <ArrowRight size={18} />
              </a>
              <a 
                href="#mehr-erfahren" 
                className="inline-flex items-center justify-center gap-2 text-amber-600 hover:text-amber-700 px-6 py-3 font-medium"
              >
                Mehr erfahren
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const TeamSection = () => {
  const team = [
    {
      name: "Dominique Knöpfli",
      role: "Präsidentin",
      email: "dominique.knoepfli@elternvereinigung.ch",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&q=80"
    },
    {
      name: "Mélanie Bosshardt",
      role: "Vorstand",
      email: "melanie.bosshardt@elternvereinigung.ch",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&q=80"
    },
    {
      name: "Mirjam Spörri",
      role: "Vorstand",
      email: "mirjam.spoerri@elternvereinigung.ch",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&q=80"
    },
  ];

  return (
    <section id="ueber-uns" className="py-20 bg-gray-50" data-testid="team-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-amber-600 font-medium text-sm tracking-wider uppercase">Über uns</span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-4">
            Der Vorstand
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Engagierte Eltern, die sich für ein lebendiges Miteinander in Oberglatt einsetzen.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {team.map((member, index) => (
            <div 
              key={index}
              className="bg-white rounded-2xl p-6 text-center shadow-sm hover:shadow-xl transition-all duration-300"
              data-testid={`team-card-${index}`}
            >
              <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden ring-4 ring-amber-100">
                <img 
                  src={member.image} 
                  alt={member.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">{member.name}</h3>
              <p className="text-amber-600 text-sm mb-4">{member.role}</p>
              <a 
                href={`mailto:${member.email}`}
                className="inline-flex items-center gap-2 text-gray-500 hover:text-amber-600 text-sm transition-colors"
              >
                <Mail size={16} />
                E-Mail schreiben
              </a>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <a 
            href="#mehr-ueber-uns" 
            className="inline-flex items-center gap-2 text-amber-600 font-medium hover:gap-3 transition-all"
          >
            Mehr über uns erfahren
            <ChevronRight size={20} />
          </a>
        </div>
      </div>
    </section>
  );
};

const CTASection = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-amber-500 to-orange-600" data-testid="cta-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
          Mitmachen bei der EVO
        </h2>
        <p className="text-xl text-white/90 max-w-2xl mx-auto mb-10">
          Die EVO lebt vom Mitmachen. Du entscheidest selbst, wie und wie viel du dich 
          engagieren möchtest – unkompliziert und freiwillig.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a 
            href="#mitglied-werden" 
            className="inline-flex items-center justify-center gap-2 bg-white text-amber-600 px-8 py-4 rounded-full text-lg font-medium hover:bg-gray-100 transition-all hover:shadow-xl"
            data-testid="cta-mitglied-main"
          >
            Mitglied werden
          </a>
          <a 
            href="mailto:info@elternvereinigung.ch?subject=Bei%20Anlässen%20helfen" 
            className="inline-flex items-center justify-center gap-2 bg-white/20 text-white border border-white/30 px-8 py-4 rounded-full text-lg font-medium hover:bg-white/30 transition-all"
          >
            Bei Anlässen helfen
          </a>
          <a 
            href="mailto:info@elternvereinigung.ch?subject=Ideen%20einbringen" 
            className="inline-flex items-center justify-center gap-2 bg-white/20 text-white border border-white/30 px-8 py-4 rounded-full text-lg font-medium hover:bg-white/30 transition-all"
          >
            Ideen einbringen
          </a>
        </div>
      </div>
    </section>
  );
};

const NewsletterSection = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Newsletter angemeldet: ${email}`);
    setEmail("");
  };

  return (
    <section className="py-16 bg-gray-900" data-testid="newsletter-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-gray-800 to-gray-800/50 rounded-2xl p-8 md:p-12">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
                Newsletter abonnieren
              </h3>
              <p className="text-gray-400">
                Bleib informiert über Anlässe, Neuigkeiten und alles rund um die EVO.
              </p>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Deine E-Mail-Adresse"
                className="flex-1 px-5 py-3 rounded-full bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                data-testid="newsletter-input"
                required
              />
              <button
                type="submit"
                className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-full font-medium transition-all whitespace-nowrap"
                data-testid="newsletter-submit"
              >
                Abonnieren
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer id="kontakt" className="bg-gray-900 text-white pt-16 pb-8" data-testid="footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">E</span>
              </div>
              <div>
                <p className="font-semibold">Elternvereinigung</p>
                <p className="text-sm text-gray-400">Oberglatt</p>
              </div>
            </div>
            <p className="text-gray-400 max-w-sm">
              Gemeinschaft von Eltern für Kinder in Oberglatt. 
              Gemeinsam gestalten wir ein lebendiges Miteinander.
            </p>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Kontakt</h4>
            <ul className="space-y-3 text-gray-400">
              <li className="flex items-center gap-2">
                <MapPin size={16} className="text-amber-500" />
                Dicklooweg, 8154 Oberglatt
              </li>
              <li>
                <a href="mailto:info@elternvereinigung.ch" className="flex items-center gap-2 hover:text-amber-400 transition-colors">
                  <Mail size={16} className="text-amber-500" />
                  info@elternvereinigung.ch
                </a>
              </li>
            </ul>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold mb-4">Links</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#impressum" className="hover:text-amber-400 transition-colors">Impressum</a></li>
              <li><a href="#datenschutz" className="hover:text-amber-400 transition-colors">Datenschutz</a></li>
              <li><a href="#agb" className="hover:text-amber-400 transition-colors">AGB</a></li>
              <li><a href="mailto:info@elternvereinigung.ch?subject=Feedback" className="hover:text-amber-400 transition-colors">Feedback geben</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            © 2026 Elternvereinigung Oberglatt. Alle Rechte vorbehalten.
          </p>
          <div className="flex items-center gap-4">
            <a href="#whatsapp" className="w-10 h-10 bg-gray-800 hover:bg-amber-500 rounded-full flex items-center justify-center transition-colors" aria-label="WhatsApp">
              <Phone size={18} />
            </a>
            <a href="#instagram" className="w-10 h-10 bg-gray-800 hover:bg-amber-500 rounded-full flex items-center justify-center transition-colors" aria-label="Instagram">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
            </a>
            <a href="#facebook" className="w-10 h-10 bg-gray-800 hover:bg-amber-500 rounded-full flex items-center justify-center transition-colors" aria-label="Facebook">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

function App() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <HeroSection />
        <MissionSection />
        <EventsSection />
        <RobihuetteSection />
        <TeamSection />
        <CTASection />
        <NewsletterSection />
      </main>
      <Footer />
    </div>
  );
}

export default App;
