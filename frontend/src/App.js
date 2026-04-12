import { useState, useEffect, createContext, useContext, useCallback, useMemo } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route, Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { 
  Mail, Phone, MapPin, Calendar, Users, Home, Heart, ArrowRight, Menu, X, 
  ChevronRight, ChevronLeft, LogIn, LogOut, User, Clock, Check, AlertCircle
} from "lucide-react";
import { getToken, setToken as saveToken, removeToken, migrateFromLocalStorage } from "./utils/auth";

const API = process.env.REACT_APP_BACKEND_URL + "/api";

// ==================== AUTH CONTEXT ====================
const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => {
    migrateFromLocalStorage(); // One-time migration from localStorage
    return getToken();
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    
    const fetchUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      
      try {
        const res = await axios.get(`${API}/auth/me?token=${token}`);
        if (isMounted) {
          setUser(res.data);
        }
      } catch {
        removeToken();
        if (isMounted) {
          setToken(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    
    fetchUser();
    
    return () => { isMounted = false; };
  }, [token]);

  const login = useCallback(async (email, password) => {
    const res = await axios.post(`${API}/auth/login`, { email, password });
    saveToken(res.data.token);
    setToken(res.data.token);
    setUser(res.data.user);
    return res.data;
  }, []);

  const register = useCallback(async (data) => {
    const res = await axios.post(`${API}/auth/register`, data);
    saveToken(res.data.token);
    setToken(res.data.token);
    setUser(res.data.user);
    return res.data;
  }, []);

  const logout = useCallback(() => {
    removeToken();
    setToken(null);
    setUser(null);
  }, []);

  const value = useMemo(() => ({ 
    user, token, login, register, logout, loading 
  }), [user, token, login, register, logout, loading]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// ==================== LOGO COMPONENT ====================
const EvoLogo = ({ size = "md" }) => {
  const sizes = {
    sm: "h-8",
    md: "h-10 md:h-12",
    lg: "h-14 md:h-16"
  };
  return (
    <img 
      src="https://customer-assets.emergentagent.com/job_elternverein-og/artifacts/io84x5w7_Logo_EVO_Neu_mobile.jpg" 
      alt="Elternvereinigung Oberglatt"
      className={`${sizes[size]} w-auto object-contain`}
    />
  );
};

// ==================== HEADER ====================
const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  
  const isActive = (path) => location.pathname === path;
  
  return (
    <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link to="/" className="flex items-center gap-3" data-testid="logo">
            <EvoLogo size="md" />
          </Link>

          <nav className="hidden md:flex items-center gap-6" data-testid="desktop-nav">
            <Link to="/" className={`text-sm font-medium transition-colors ${isActive('/') ? 'text-amber-600' : 'text-gray-600 hover:text-amber-600'}`}>Start</Link>
            <Link to="/ueber-uns" className={`text-sm font-medium transition-colors ${isActive('/ueber-uns') ? 'text-amber-600' : 'text-gray-600 hover:text-amber-600'}`}>Über uns</Link>
            <Link to="/aktuell" className={`text-sm font-medium transition-colors ${isActive('/aktuell') ? 'text-amber-600' : 'text-gray-600 hover:text-amber-600'}`}>Aktuell</Link>
            <Link to="/robihuette" className={`text-sm font-medium transition-colors ${isActive('/robihuette') ? 'text-amber-600' : 'text-gray-600 hover:text-amber-600'}`}>Robihütte</Link>
            <Link to="/blog" className={`text-sm font-medium transition-colors ${isActive('/blog') ? 'text-amber-600' : 'text-gray-600 hover:text-amber-600'}`}>Blog</Link>
            <Link to="/kontakt" className={`text-sm font-medium transition-colors ${isActive('/kontakt') ? 'text-amber-600' : 'text-gray-600 hover:text-amber-600'}`}>Kontakt</Link>
          </nav>

          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <Link to="/meine-buchungen" className="flex items-center gap-2 text-gray-600 hover:text-amber-600 text-sm">
                  <User size={18} />
                  <span>{user.name}</span>
                </Link>
                <button onClick={logout} className="flex items-center gap-1 text-gray-500 hover:text-red-600 text-sm" data-testid="logout-btn">
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <Link to="/login" className="flex items-center gap-2 text-gray-600 hover:text-amber-600 text-sm" data-testid="login-link">
                <LogIn size={18} />
                <span>Anmelden</span>
              </Link>
            )}
            <Link to="/mitglied-werden" className="bg-amber-500 hover:bg-amber-600 text-white px-5 py-2.5 rounded-full text-sm font-medium transition-all hover:shadow-lg" data-testid="cta-mitglied">
              Mitglied werden
            </Link>
          </div>

          <button className="md:hidden p-2" onClick={() => setIsMenuOpen(!isMenuOpen)} data-testid="mobile-menu-toggle">
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {isMenuOpen && (
          <nav className="md:hidden py-4 border-t border-gray-100">
            <div className="flex flex-col gap-3">
              <Link to="/" className="text-gray-600 hover:text-amber-600 py-2" onClick={() => setIsMenuOpen(false)}>Start</Link>
              <Link to="/ueber-uns" className="text-gray-600 hover:text-amber-600 py-2" onClick={() => setIsMenuOpen(false)}>Über uns</Link>
              <Link to="/aktuell" className="text-gray-600 hover:text-amber-600 py-2" onClick={() => setIsMenuOpen(false)}>Aktuell</Link>
              <Link to="/robihuette" className="text-gray-600 hover:text-amber-600 py-2" onClick={() => setIsMenuOpen(false)}>Robihütte</Link>
              <Link to="/blog" className="text-gray-600 hover:text-amber-600 py-2" onClick={() => setIsMenuOpen(false)}>Blog</Link>
              <Link to="/kontakt" className="text-gray-600 hover:text-amber-600 py-2" onClick={() => setIsMenuOpen(false)}>Kontakt</Link>
              {user ? (
                <>
                  <Link to="/meine-buchungen" className="text-gray-600 hover:text-amber-600 py-2" onClick={() => setIsMenuOpen(false)}>Meine Buchungen</Link>
                  <button onClick={() => { logout(); setIsMenuOpen(false); }} className="text-left text-red-600 py-2">Abmelden</button>
                </>
              ) : (
                <Link to="/login" className="text-amber-600 py-2" onClick={() => setIsMenuOpen(false)}>Anmelden</Link>
              )}
              <Link to="/mitglied-werden" className="bg-amber-500 text-white px-4 py-2 rounded-full text-center mt-2" onClick={() => setIsMenuOpen(false)}>
                Mitglied werden
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

// ==================== FOOTER ====================
const Footer = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleNewsletter = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/newsletter?email=${email}`);
      setSubscribed(true);
      setEmail("");
    } catch (err) {
      alert("Fehler beim Anmelden");
    }
  };

  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Newsletter */}
        <div className="bg-gray-800 rounded-2xl p-8 mb-12">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-2">Newsletter abonnieren</h3>
              <p className="text-gray-400">Bleib informiert über Anlässe und Neuigkeiten.</p>
            </div>
            {subscribed ? (
              <p className="text-green-400 flex items-center gap-2"><Check size={20} /> Erfolgreich angemeldet!</p>
            ) : (
              <form onSubmit={handleNewsletter} className="flex flex-col sm:flex-row gap-3">
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Deine E-Mail" className="flex-1 px-5 py-3 rounded-full bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500" required />
                <button type="submit" className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-full font-medium transition-all">Abonnieren</button>
              </form>
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-8 mb-12">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <img 
                src="https://customer-assets.emergentagent.com/job_elternverein-og/artifacts/io84x5w7_Logo_EVO_Neu_mobile.jpg" 
                alt="Elternvereinigung Oberglatt"
                className="h-12 w-auto object-contain bg-white rounded-lg p-1"
              />
            </div>
            <p className="text-gray-400 max-w-sm">Gemeinschaft von Eltern für Kinder in Oberglatt.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Kontakt</h4>
            <ul className="space-y-3 text-gray-400">
              <li className="flex items-center gap-2"><MapPin size={16} className="text-amber-500" />Dicklooweg, 8154 Oberglatt</li>
              <li><a href="mailto:info@elternvereinigung.ch" className="flex items-center gap-2 hover:text-amber-400"><Mail size={16} className="text-amber-500" />info@elternvereinigung.ch</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Links</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="/impressum" className="hover:text-amber-400">Impressum</Link></li>
              <li><Link to="/datenschutz" className="hover:text-amber-400">Datenschutz</Link></li>
              <li><Link to="/agb" className="hover:text-amber-400">AGB</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">© 2026 Elternvereinigung Oberglatt</p>
          <div className="flex items-center gap-4">
            <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-amber-500 rounded-full flex items-center justify-center transition-colors"><Phone size={18} /></a>
          </div>
        </div>
      </div>
    </footer>
  );
};

// ==================== HOME PAGE ====================
const MISSION_VALUES = [
  { id: "begegnungen", icon: Users, title: "Begegnungen", desc: "Anlässe für Familien, Kinder und Jugendliche" },
  { id: "gemeinschaft", icon: Heart, title: "Gemeinschaft", desc: "Lebendiges Miteinander in unserer Gemeinde" },
  { id: "zusammenarbeit", icon: Home, title: "Zusammenarbeit", desc: "Mit Schulen, Vereinen und der Gemeinde" },
];

const ROBIHUETTE_FEATURES = [
  { id: "capacity", text: "Platz für bis zu 50 Personen" },
  { id: "kitchen", text: "Voll ausgestattete Küche" },
  { id: "garden", text: "Grosser Garten mit Spielplatz" },
  { id: "parking", text: "Parkplätze vor Ort" },
];

const HomePage = () => {
  const [events, setEvents] = useState([]);
  const [team, setTeam] = useState([]);

  useEffect(() => {
    let isMounted = true;
    
    const fetchData = async () => {
      try {
        const [eventsRes, teamRes] = await Promise.all([
          axios.get(`${API}/events?limit=3`),
          axios.get(`${API}/board-members`)
        ]);
        
        if (isMounted) {
          setEvents(eventsRes.data.events || []);
          setTeam(teamRes.data.members || []);
        }
      } catch (err) {
        // Silently handle errors - data will remain empty arrays
      }
    };
    
    fetchData();
    return () => { isMounted = false; };
  }, []);

  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center pt-20">
        <div className="absolute inset-0 z-0">
          <img src="https://images.unsplash.com/photo-1609220136736-443140cffec6?w=1920&q=80" alt="Familie" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 via-gray-900/60 to-transparent"></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-2xl">
            <span className="inline-block text-amber-400 text-sm font-medium tracking-wider uppercase mb-4">Willkommen bei der</span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Elternvereinigung<span className="block text-amber-400">Oberglatt</span>
            </h1>
            <p className="text-xl text-gray-200 mb-8">Gemeinschaft von Eltern für Kinder in Oberglatt. Wir schaffen Räume für Begegnung, Austausch und Mitwirkung.</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/mitglied-werden" className="inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-8 py-4 rounded-full text-lg font-medium transition-all hover:shadow-xl">
                Mitglied werden <ArrowRight size={20} />
              </Link>
              <Link to="/robihuette" className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/30 px-8 py-4 rounded-full text-lg font-medium transition-all backdrop-blur-sm">
                Robihütte mieten
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Wofür wir stehen</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">Die Elternvereinigung Oberglatt ist eine Gemeinschaft von Eltern für Kinder.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {MISSION_VALUES.map((v) => (
              <div key={v.id} className="group p-8 bg-gray-50 rounded-2xl hover:bg-amber-50 transition-all duration-300 hover:shadow-lg">
                <div className="w-14 h-14 bg-amber-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-amber-500 transition-colors">
                  <v.icon className="w-7 h-7 text-amber-600 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{v.title}</h3>
                <p className="text-gray-600">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Events Teaser */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <span className="text-amber-600 font-medium text-sm uppercase">Aktuell</span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">Nächste Anlässe</h2>
            </div>
            <Link to="/aktuell" className="hidden md:flex items-center gap-2 text-amber-600 font-medium hover:gap-3 transition-all">
              Alle Anlässe <ChevronRight size={20} />
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {events.map((event) => (
              <article key={event.id || event.title} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all">
                <div className="relative h-48 bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center">
                  <Calendar size={48} className="text-amber-500" />
                  <div className="absolute top-4 left-4 bg-white rounded-lg px-3 py-2 shadow-lg">
                    <span className="block text-2xl font-bold text-amber-600">{event.date?.split('-')[2]}</span>
                    <span className="block text-xs text-gray-500 uppercase">{['Jan','Feb','Mär','Apr','Mai','Jun','Jul','Aug','Sep','Okt','Nov','Dez'][parseInt(event.date?.split('-')[1])-1]}</span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{event.title}</h3>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1"><MapPin size={14} />{event.location}</span>
                    <span className="flex items-center gap-1"><Clock size={14} />{event.time}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
          <Link to="/aktuell" className="md:hidden mt-6 flex items-center justify-center gap-2 text-amber-600 font-medium">
            Alle Anlässe <ChevronRight size={20} />
          </Link>
        </div>
      </section>

      {/* Robihütte Teaser */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="rounded-2xl overflow-hidden shadow-2xl">
                <img src="https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=800&q=80" alt="Robihütte" className="w-full h-[400px] object-cover" />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-amber-500 text-white p-6 rounded-2xl shadow-xl hidden md:block">
                <p className="text-3xl font-bold">CHF 80</p>
                <p className="text-sm opacity-90">ab / 4 Stunden</p>
              </div>
            </div>
            <div>
              <span className="text-amber-600 font-medium text-sm uppercase">Robihütte</span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-6">Dein Ort für unvergessliche Feste</h2>
              <p className="text-gray-600 mb-6">Die Robihütte ist perfekt für Geburtstage, Familienfeiern und Vereinsanlässe. Platz für bis zu 50 Personen.</p>
              <ul className="space-y-3 mb-8">
                {ROBIHUETTE_FEATURES.map((item) => (
                  <li key={item.id} className="flex items-center gap-3 text-gray-700">
                    <span className="w-5 h-5 bg-amber-100 rounded-full flex items-center justify-center">
                      <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
                    </span>
                    {item.text}
                  </li>
                ))}
              </ul>
              <Link to="/robihuette" className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-full font-medium transition-all hover:shadow-lg">
                Jetzt reservieren <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Team Teaser */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-amber-600 font-medium text-sm uppercase">Über uns</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-4">Der Vorstand</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {team.slice(0,3).map((member) => (
              <div key={member.id || member.email} className="bg-white rounded-2xl p-6 text-center shadow-sm hover:shadow-xl transition-all">
                <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden ring-4 ring-amber-100">
                  <img src={member.photo} alt={member.name} className="w-full h-full object-cover" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{member.name}</h3>
                <p className="text-amber-600 text-sm mb-4">{member.role}</p>
                <a href={`mailto:${member.email}`} className="inline-flex items-center gap-2 text-gray-500 hover:text-amber-600 text-sm">
                  <Mail size={16} />E-Mail schreiben
                </a>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link to="/ueber-uns" className="inline-flex items-center gap-2 text-amber-600 font-medium hover:gap-3 transition-all">
              Mehr über uns <ChevronRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Band */}
      <section className="py-20 bg-gradient-to-br from-amber-500 to-orange-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Mitmachen bei der EVO</h2>
          <p className="text-xl text-white/90 max-w-2xl mx-auto mb-10">Die EVO lebt vom Mitmachen. Du entscheidest selbst, wie und wie viel du dich engagieren möchtest.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/mitglied-werden" className="bg-white text-amber-600 px-8 py-4 rounded-full text-lg font-medium hover:bg-gray-100 transition-all">Mitglied werden</Link>
            <a href="mailto:info@elternvereinigung.ch?subject=Bei%20Anlässen%20helfen" className="bg-white/20 text-white border border-white/30 px-8 py-4 rounded-full text-lg font-medium hover:bg-white/30 transition-all">Bei Anlässen helfen</a>
          </div>
        </div>
      </section>
    </>
  );
};

// ==================== ROBIHÜTTE PAGE ====================
const ROBIHUETTE_AUSSTATTUNG = [
  { id: "max-persons", text: "Max. 50 Personen" },
  { id: "kitchen", text: "Voll ausgestattete Küche" },
  { id: "garden", text: "Grosser Garten" },
  { id: "playground", text: "Spielplatz" },
  { id: "parking", text: "Parkplätze" },
  { id: "toilets", text: "Toiletten" },
];

const RobihuettePage = () => {
  const [pricing, setPricing] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    let isMounted = true;
    axios.get(`${API}/pricing`)
      .then(res => { if (isMounted) setPricing(res.data); })
      .catch(() => {});
    return () => { isMounted = false; };
  }, []);

  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="relative h-[50vh] flex items-center">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=1920&q=80" alt="Robihütte" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-gray-900/30"></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Robihütte mieten</h1>
          <p className="text-xl text-gray-200">Dein Ort für unvergessliche Feste in Oberglatt</p>
        </div>
      </section>

      {/* Info */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Über die Robihütte</h2>
              <p className="text-gray-600 mb-6">
                Die Robihütte der Elternvereinigung Oberglatt ist ein Treffpunkt für Kinder, 
                Familien und die Dorfgemeinschaft. Perfekt für Geburtstage, Familienfeiern und Vereinsanlässe.
              </p>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Ausstattung</h3>
              <ul className="grid grid-cols-2 gap-2 mb-6">
                {ROBIHUETTE_AUSSTATTUNG.map((item) => (
                  <li key={item.id} className="flex items-center gap-2 text-gray-600">
                    <Check size={16} className="text-amber-500" />{item.text}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Preise</h2>
              {pricing && (
                <div className="bg-gray-50 rounded-xl p-6">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-gray-500 border-b">
                        <th className="pb-3">Zeitblock</th>
                        <th className="pb-3">Mitglieder</th>
                        <th className="pb-3">Externe</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pricing.pricing.map((p) => (
                        <tr key={`${p.time_block}-${p.day_label}`} className="border-b last:border-0">
                          <td className="py-2.5">
                            <span className="font-medium">{p.label}</span>
                            {p.day_label && <span className="block text-xs text-gray-500">{p.day_label}</span>}
                          </td>
                          <td className="py-2.5 text-green-600 font-semibold">CHF {p.member_price}</td>
                          <td className="py-2.5">CHF {p.external_price}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="mt-4 pt-4 border-t text-sm text-gray-600 space-y-1">
                    <p>+ {pricing.cleaning.label}: CHF {pricing.cleaning.price}</p>
                    <p>Kaution: CHF {pricing.deposit.amount} ({pricing.deposit.note})</p>
                    {pricing.buffer && <p className="text-xs text-gray-500">Pufferzeit zwischen Buchungen: {pricing.buffer.hours}h</p>}
                    {pricing.max_advance_months && <p className="text-xs text-gray-500">Max. Vorausbuchung: {pricing.max_advance_months} Monate</p>}
                  </div>
                </div>
              )}
              {!user && (
                <p className="mt-4 text-sm text-amber-600 flex items-center gap-2">
                  <AlertCircle size={16} />
                  <Link to="/login" className="underline">Anmelden</Link> für Mitgliederpreise
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Booking CTA */}
      <section className="py-16 bg-amber-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Jetzt reservieren</h2>
          <p className="text-gray-600 mb-8">Wähle dein Datum und buche die Robihütte online.</p>
          <Link to="/robihuette/buchen" className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-8 py-4 rounded-full text-lg font-medium transition-all hover:shadow-xl">
            Zur Buchung <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      {/* Hausordnung */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Hausordnung</h2>
          <div className="bg-gray-50 rounded-xl p-6">
            <ul className="space-y-3 text-gray-600">
              <li>• Die Robihütte wird nur an volljährige Personen vermietet.</li>
              <li>• Maximale Kapazität: 50 Personen.</li>
              <li>• In der gesamten Robihütte gilt absolutes Rauchverbot.</li>
              <li>• Auf dem Spielplatz gilt Hundeverbot.</li>
              <li>• Private Parkplätze in der Umgebung dürfen nicht benutzt werden.</li>
              <li>• Die Untervermietung ist nicht zulässig.</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};

// ==================== DAY DETAILS MODAL ====================
const DayDetailsModal = ({ date, bookings, onClose, onSelectSlot }) => {
  // All possible time slots for 4h bookings
  const SLOTS_4H = [
    { start: "08:00", end: "12:00", label: "08:00 - 12:00" },
    { start: "10:00", end: "14:00", label: "10:00 - 14:00" },
    { start: "12:00", end: "16:00", label: "12:00 - 16:00" },
    { start: "14:00", end: "18:00", label: "14:00 - 18:00" },
    { start: "16:00", end: "20:00", label: "16:00 - 20:00" },
    { start: "18:00", end: "22:00", label: "18:00 - 22:00" },
  ];

  // Time slots for 12h bookings
  const SLOTS_12H = [
    { start: "08:00", end: "20:00", label: "08:00 - 20:00" },
    { start: "09:00", end: "21:00", label: "09:00 - 21:00" },
    { start: "10:00", end: "22:00", label: "10:00 - 22:00" },
  ];

  const BUFFER_HOURS = 1.5;
  const dayBookings = bookings.filter(b => b.booking_date === date);
  const has24hBooking = dayBookings.some(b => b.time_block === "24h");
  const has12hBooking = dayBookings.some(b => b.time_block === "12h");

  // Get duration for a time block
  const getBlockHours = (block) => {
    if (block === "4h") return 4;
    if (block === "12h") return 12;
    return 24;
  };

  // Check if a slot conflicts with existing bookings
  const isSlotBusy = (slotStart, slotHours) => {
    if (has24hBooking) return true;
    
    const slotStartHour = parseInt(slotStart.split(":")[0]);
    const slotEndHour = slotStartHour + slotHours;

    for (const booking of dayBookings) {
      const bookingStartHour = parseInt(booking.start_time.split(":")[0]);
      const bookingHours = getBlockHours(booking.time_block);
      const bookingEndHour = bookingHours === 24 ? 24 : bookingStartHour + bookingHours;
      
      // Check overlap (including buffer)
      if (slotStartHour < (bookingEndHour + BUFFER_HOURS) && (slotEndHour + BUFFER_HOURS) > bookingStartHour) {
        return true;
      }
    }
    return false;
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('de-CH', { 
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' 
    });
  };

  const formatBookingTime = (booking) => {
    const hours = getBlockHours(booking.time_block);
    if (hours === 24) return "Ganztägig (09:00-09:00)";
    const endHour = parseInt(booking.start_time.split(":")[0]) + hours;
    return `${booking.start_time} - ${String(endHour).padStart(2, '0')}:00 (${booking.time_block})`;
  };

  const available4h = SLOTS_4H.filter(slot => !isSlotBusy(slot.start, 4));
  const available12h = !has12hBooking ? SLOTS_12H.filter(slot => !isSlotBusy(slot.start, 12)) : [];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[80vh] overflow-auto shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Tagesübersicht</h3>
              <p className="text-sm text-gray-500">{formatDate(date)}</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Existing bookings */}
          {dayBookings.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                <Calendar size={16} className="text-red-500" />
                Bestehende Buchungen
              </h4>
              <div className="space-y-2">
                {dayBookings.map((booking, idx) => (
                  <div key={idx} className="bg-red-50 border border-red-100 rounded-lg p-3">
                    <div className="flex items-center gap-2">
                      <Clock size={14} className="text-red-500" />
                      <span className="font-medium text-red-700">{formatBookingTime(booking)}</span>
                    </div>
                    <p className="text-sm text-red-600 mt-1">{booking.event_type}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Available 4h slots */}
          {!has24hBooking && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                <Check size={16} className="text-green-500" />
                {available4h.length > 0 ? "Verfügbare 4h Slots" : "Keine 4h Slots frei"}
              </h4>
              {available4h.length > 0 ? (
                <div className="grid grid-cols-2 gap-2">
                  {available4h.map((slot, idx) => (
                    <button
                      key={idx}
                      onClick={() => onSelectSlot(date, slot.start, "4h")}
                      className="flex items-center justify-between p-2.5 border border-gray-200 rounded-lg hover:border-amber-500 hover:bg-amber-50 transition-all text-left text-sm"
                    >
                      <span className="font-medium text-gray-900">{slot.label}</span>
                      <ArrowRight size={14} className="text-amber-500" />
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 bg-gray-50 p-3 rounded-lg">Alle 4h Slots belegt.</p>
              )}
            </div>
          )}

          {/* Available 12h slots */}
          {!has24hBooking && available12h.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Verfügbare 12h Slots</h4>
              <div className="grid grid-cols-1 gap-2">
                {available12h.map((slot, idx) => (
                  <button
                    key={idx}
                    onClick={() => onSelectSlot(date, slot.start, "12h")}
                    className="flex items-center justify-between p-3 border border-blue-200 bg-blue-50 rounded-lg hover:border-blue-500 hover:bg-blue-100 transition-all text-left"
                  >
                    <span className="font-medium text-blue-700">{slot.label}</span>
                    <ArrowRight size={16} className="text-blue-500" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 24h option if day is free */}
          {dayBookings.length === 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">24 Stunden Buchung</h4>
              <button
                onClick={() => onSelectSlot(date, "09:00", "24h")}
                className="w-full flex items-center justify-between p-3 border-2 border-amber-500 bg-amber-50 rounded-lg hover:bg-amber-100 transition-all"
              >
                <div>
                  <span className="font-medium text-amber-700">Ganzer Tag (09:00 - 09:00)</span>
                  <p className="text-sm text-amber-600">Exklusive Nutzung für 24 Stunden</p>
                </div>
                <ArrowRight size={16} className="text-amber-600" />
              </button>
            </div>
          )}

          {/* Fully booked message */}
          {has24hBooking && (
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <p className="text-gray-600">Dieser Tag ist für eine 24h-Buchung reserviert.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ==================== BOOKING CALENDAR COMPONENT ====================
const BookingCalendar = ({ selectedDate, onSelectDate, busyDates, onSelectSlot }) => {
  const [currentMonth, setCurrentMonth] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return new Date(tomorrow.getFullYear(), tomorrow.getMonth(), 1);
  });
  const [showDayModal, setShowDayModal] = useState(null);

  const MONTHS_DE = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];
  const DAYS_DE = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days = [];
    
    // Get the day of week (0=Sunday, but we want 0=Monday)
    let startDay = firstDay.getDay() - 1;
    if (startDay < 0) startDay = 6;
    
    // Add empty cells for days before the first
    for (let i = 0; i < startDay; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i));
    }
    
    return days;
  };

  const formatDateString = (date) => {
    if (!date) return null;
    return date.toISOString().split('T')[0];
  };

  const getDateBookings = (date) => {
    if (!date) return [];
    const dateStr = formatDateString(date);
    return busyDates.filter(b => b.booking_date === dateStr);
  };

  const isDateBusy = (date) => {
    const bookings = getDateBookings(date);
    if (bookings.length === 0) return false;
    // Check if fully booked (24h booking or multiple 4h bookings covering the day)
    if (bookings.some(b => b.time_block === "24h")) return true;
    // For simplicity, if there are bookings, show as partially busy (orange dot)
    return false; // Allow clicking to see details
  };

  const isDatePartiallyBusy = (date) => {
    const bookings = getDateBookings(date);
    if (bookings.length === 0) return false;
    if (bookings.some(b => b.time_block === "24h")) return false;
    return true; // Has some bookings but may have free slots
  };

  const isDateFullyBooked = (date) => {
    const bookings = getDateBookings(date);
    return bookings.some(b => b.time_block === "24h");
  };

  const isDatePast = (date) => {
    if (!date) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return date < tomorrow;
  };

  const isDateSelected = (date) => {
    if (!date || !selectedDate) return false;
    return formatDateString(date) === selectedDate;
  };

  const handleDateClick = (date) => {
    const dateStr = formatDateString(date);
    const bookings = getDateBookings(date);
    
    if (bookings.length > 0) {
      // Show modal with day details
      setShowDayModal(dateStr);
    } else {
      // Free day - select directly
      onSelectDate(dateStr);
    }
  };

  const handleSlotSelect = (date, startTime, timeBlock = "4h") => {
    setShowDayModal(null);
    onSelectSlot(date, startTime, timeBlock);
  };

  const handlePrevMonth = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const minMonth = new Date(tomorrow.getFullYear(), tomorrow.getMonth(), 1);
    const newMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);
    if (newMonth >= minMonth) {
      setCurrentMonth(newMonth);
    }
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const days = getDaysInMonth(currentMonth);
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const canGoPrev = currentMonth > new Date(tomorrow.getFullYear(), tomorrow.getMonth(), 1);

  return (
    <>
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <button 
            onClick={handlePrevMonth} 
            disabled={!canGoPrev}
            className={`p-2 rounded-lg ${canGoPrev ? 'hover:bg-gray-100' : 'opacity-30 cursor-not-allowed'}`}
          >
            <ChevronLeft size={20} />
          </button>
          <h3 className="text-lg font-semibold text-gray-900">
            {MONTHS_DE[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </h3>
          <button onClick={handleNextMonth} className="p-2 rounded-lg hover:bg-gray-100">
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Day headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {DAYS_DE.map(day => (
            <div key={day} className="text-center text-xs font-medium text-gray-500 py-2">{day}</div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1">
          {days.map((date, index) => {
            if (!date) {
              return <div key={`empty-${index}`} className="h-10"></div>;
            }
            
            const isPast = isDatePast(date);
            const isFullyBooked = isDateFullyBooked(date);
            const isPartiallyBusy = isDatePartiallyBusy(date);
            const isSelected = isDateSelected(date);
            const dayNum = date.getDate();
            
            return (
              <button
                key={formatDateString(date)}
                onClick={() => !isPast && handleDateClick(date)}
                disabled={isPast}
                className={`h-10 rounded-lg text-sm font-medium transition-all relative
                  ${isPast ? 'text-gray-300 cursor-not-allowed' : ''}
                  ${isFullyBooked && !isPast ? 'bg-red-100 text-red-400' : ''}
                  ${isPartiallyBusy && !isPast && !isSelected ? 'bg-amber-100 text-amber-700 hover:bg-amber-200' : ''}
                  ${!isPast && !isFullyBooked && !isPartiallyBusy && !isSelected ? 'text-gray-900 hover:bg-amber-50 hover:text-amber-600' : ''}
                  ${isSelected ? 'bg-amber-500 text-white shadow-md' : ''}
                  ${!isPast && (isFullyBooked || isPartiallyBusy) ? 'cursor-pointer' : ''}
                `}
                data-testid={`calendar-day-${dayNum}`}
              >
                {dayNum}
                {isFullyBooked && !isPast && (
                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-red-500 rounded-full"></span>
                )}
                {isPartiallyBusy && !isPast && !isSelected && (
                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-amber-500 rounded-full"></span>
                )}
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-4 mt-4 pt-4 border-t border-gray-100 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-amber-500 rounded"></div>
            <span className="text-gray-600">Ausgewählt</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-amber-100 rounded relative">
              <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-amber-500 rounded-full"></span>
            </div>
            <span className="text-gray-600">Teilweise belegt</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-100 rounded relative">
              <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-red-500 rounded-full"></span>
            </div>
            <span className="text-gray-600">Voll belegt</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-white border border-gray-200 rounded"></div>
            <span className="text-gray-600">Frei</span>
          </div>
        </div>

        <p className="text-xs text-gray-400 mt-3">Klicke auf einen Tag um die verfügbaren Zeiten zu sehen</p>
      </div>

      {/* Day Details Modal */}
      {showDayModal && (
        <DayDetailsModal
          date={showDayModal}
          bookings={busyDates}
          onClose={() => setShowDayModal(null)}
          onSelectSlot={handleSlotSelect}
        />
      )}
    </>
  );
};

// ==================== BOOKING PAGE ====================
const BookingPage = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [memberPrice, setMemberPrice] = useState(null);
  const [externalPrice, setExternalPrice] = useState(null);
  const [busyDates, setBusyDates] = useState([]);
  const [calendarLoading, setCalendarLoading] = useState(true);
  
  const [form, setForm] = useState({
    booking_date: "",
    time_block: "4h",
    start_time: "10:00",
    event_type: "Geburtstag",
    expected_guests: 20,
    cleaning_addon: false,
    special_requests: "",
    // External user fields
    name: "",
    email: "",
    phone: ""
  });

  // Seed bookings and load availability on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        // Seed demo bookings first
        await axios.post(`${API}/bookings/seed`);
        
        // Load current and next month availability
        const today = new Date();
        const currentMonth = today.getMonth() + 1;
        const currentYear = today.getFullYear();
        const nextMonth = currentMonth === 12 ? 1 : currentMonth + 1;
        const nextYear = currentMonth === 12 ? currentYear + 1 : currentYear;
        
        const [curr, next] = await Promise.all([
          axios.get(`${API}/bookings/availability/${currentYear}/${currentMonth}`),
          axios.get(`${API}/bookings/availability/${nextYear}/${nextMonth}`)
        ]);
        
        setBusyDates([...curr.data.bookings, ...next.data.bookings]);
      } catch (err) {
        console.error("Error loading availability:", err);
      } finally {
        setCalendarLoading(false);
      }
    };
    loadData();
  }, []);

  // Load prices for both user types
  useEffect(() => {
    if (form.booking_date && form.time_block) {
      // Get both member and external prices
      axios.post(`${API}/bookings/check-prices?booking_date=${form.booking_date}&time_block=${form.time_block}&cleaning=${form.cleaning_addon}`)
        .then(res => {
          setMemberPrice(res.data.member);
          setExternalPrice(res.data.external);
        })
        .catch(console.error);
    }
  }, [form.booking_date, form.time_block, form.cleaning_addon]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleDateSelect = (dateStr) => {
    setForm(prev => ({ ...prev, booking_date: dateStr }));
    setError("");
  };

  const handleSlotSelect = (dateStr, startTime, timeBlock = "4h") => {
    setForm(prev => ({ 
      ...prev, 
      booking_date: dateStr,
      start_time: startTime,
      time_block: timeBlock
    }));
    setError("");
  };

  const checkAvailability = async () => {
    try {
      const res = await axios.post(`${API}/bookings/check-availability?booking_date=${form.booking_date}&start_time=${form.start_time}&time_block=${form.time_block}`);
      if (!res.data.available) {
        setError(res.data.message);
        return false;
      }
      return true;
    } catch (err) {
      setError("Fehler bei der Verfügbarkeitsprüfung");
      return false;
    }
  };

  const handleNext = async () => {
    setError("");
    if (step === 1) {
      if (!form.booking_date) { setError("Bitte Datum wählen"); return; }
      const available = await checkAvailability();
      if (available) setStep(2);
    } else if (step === 2) {
      if (form.expected_guests < 1) { setError("Bitte Gästeanzahl angeben"); return; }
      setStep(3);
    } else if (step === 3) {
      // Validate external user fields if not logged in
      if (!user) {
        if (!form.name.trim()) { setError("Bitte Name eingeben"); return; }
        if (!form.email.trim()) { setError("Bitte E-Mail eingeben"); return; }
        if (!form.phone.trim()) { setError("Bitte Telefon eingeben"); return; }
      }
      setStep(4);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    try {
      let res;
      if (user) {
        // Registered user booking
        res = await axios.post(`${API}/bookings?token=${token}`, {
          booking_date: form.booking_date,
          time_block: form.time_block,
          start_time: form.start_time,
          event_type: form.event_type,
          expected_guests: form.expected_guests,
          cleaning_addon: form.cleaning_addon,
          special_requests: form.special_requests
        });
      } else {
        // External user booking
        res = await axios.post(`${API}/bookings/external`, {
          booking_date: form.booking_date,
          time_block: form.time_block,
          start_time: form.start_time,
          event_type: form.event_type,
          expected_guests: form.expected_guests,
          cleaning_addon: form.cleaning_addon,
          special_requests: form.special_requests,
          name: form.name,
          email: form.email,
          phone: form.phone
        });
      }
      navigate("/buchung-bestaetigung", { state: { booking: res.data.booking, isExternal: !user } });
    } catch (err) {
      setError(err.response?.data?.detail || "Buchung fehlgeschlagen");
    } finally {
      setLoading(false);
    }
  };

  const currentPrice = user ? memberPrice : externalPrice;
  const totalSteps = user ? 3 : 4;

  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Robihütte buchen</h1>
        <p className="text-gray-600 mb-8">Schritt {step} von {totalSteps}</p>

        {/* Progress */}
        <div className="flex gap-2 mb-8">
          {Array.from({length: totalSteps}, (_, i) => i + 1).map(s => (
            <div key={s} className={`flex-1 h-2 rounded-full ${s <= step ? 'bg-amber-500' : 'bg-gray-200'}`}></div>
          ))}
        </div>

        {/* User status banner */}
        {!user && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <AlertCircle size={20} className="text-blue-600 mt-0.5" />
              <div>
                <p className="text-blue-800 font-medium">Sie buchen als Gast (Externer Preis)</p>
                <p className="text-blue-600 text-sm mt-1">
                  <Link to="/login?redirect=/robihuette/buchen" className="underline">Anmelden</Link> oder{' '}
                  <Link to="/mitglied-werden" className="underline">Mitglied werden</Link> für günstigere Preise!
                </p>
              </div>
            </div>
          </div>
        )}

        {user && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-3">
              <Check size={20} className="text-green-600" />
              <p className="text-green-800 font-medium">Eingeloggt als {user.name} – Mitgliederpreis aktiv!</p>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 flex items-center gap-2">
            <AlertCircle size={20} />{error}
          </div>
        )}

        <div className="bg-white rounded-2xl p-6 shadow-sm">
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Datum & Zeit wählen</h2>
              
              {/* Calendar */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Wähle ein Datum (ab morgen)</label>
                {calendarLoading ? (
                  <div className="h-64 flex items-center justify-center bg-gray-50 rounded-xl">
                    <div className="text-gray-500">Kalender wird geladen...</div>
                  </div>
                ) : (
                  <BookingCalendar 
                    selectedDate={form.booking_date} 
                    onSelectDate={handleDateSelect}
                    onSelectSlot={handleSlotSelect}
                    busyDates={busyDates}
                  />
                )}
                {form.booking_date && (
                  <p className="mt-3 text-sm text-amber-600 font-medium">
                    Ausgewählt: {new Date(form.booking_date).toLocaleDateString('de-CH', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                )}
              </div>

              {/* Time block selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Zeitblock</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: "4h", label: "4 Stunden", desc: "Flexible Startzeit" },
                    { value: "12h", label: "12 Stunden", desc: "Flexible Startzeit" },
                    { value: "24h", label: "24 Stunden", desc: "09:00 - 09:00" }
                  ].map(block => (
                    <button 
                      key={block.value} 
                      type="button" 
                      onClick={() => setForm(prev => ({ ...prev, time_block: block.value, start_time: block.value === "24h" ? "09:00" : prev.start_time }))} 
                      className={`p-4 border rounded-lg text-left transition-all ${form.time_block === block.value ? 'border-amber-500 bg-amber-50 shadow-sm' : 'border-gray-200 hover:border-gray-300'}`}
                    >
                      <span className="block font-semibold">{block.label}</span>
                      <span className="text-xs text-gray-500">{block.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {(form.time_block === "4h" || form.time_block === "12h") && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Startzeit</label>
                  <select name="start_time" value={form.start_time} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500">
                    {form.time_block === "4h" 
                      ? ["08:00","09:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00","18:00"].map(t => (
                          <option key={t} value={t}>{t}</option>
                        ))
                      : ["08:00","09:00","10:00","11:00","12:00"].map(t => (
                          <option key={t} value={t}>{t} - {String(parseInt(t.split(":")[0]) + 12).padStart(2, '0')}:00</option>
                        ))
                    }
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    {form.time_block === "4h" 
                      ? `Endzeit: ${String(parseInt(form.start_time.split(":")[0]) + 4).padStart(2, '0')}:00 (+ 1.5h Puffer)`
                      : `Endzeit: ${String(parseInt(form.start_time.split(":")[0]) + 12).padStart(2, '0')}:00 (+ 1.5h Puffer)`
                    }
                  </p>
                </div>
              )}

              {/* Price comparison */}
              {form.booking_date && memberPrice && externalPrice && (
                <div className="grid grid-cols-2 gap-4">
                  <div className={`p-4 rounded-lg border-2 ${user ? 'border-green-500 bg-green-50' : 'border-gray-200'}`}>
                    <div className="flex items-center gap-2 mb-1">
                      <Users size={16} className="text-green-600" />
                      <span className="text-sm font-medium text-gray-700">Mitglieder</span>
                    </div>
                    <p className="text-2xl font-bold text-green-600">CHF {memberPrice.total}</p>
                    {user && <p className="text-xs text-green-600 mt-1">Ihr Preis!</p>}
                  </div>
                  <div className={`p-4 rounded-lg border-2 ${!user ? 'border-amber-500 bg-amber-50' : 'border-gray-200'}`}>
                    <div className="flex items-center gap-2 mb-1">
                      <User size={16} className="text-amber-600" />
                      <span className="text-sm font-medium text-gray-700">Externe</span>
                    </div>
                    <p className="text-2xl font-bold text-amber-600">CHF {externalPrice.total}</p>
                    {!user && <p className="text-xs text-amber-600 mt-1">Ihr Preis als Gast</p>}
                  </div>
                </div>
              )}
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Event Details</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Art des Anlasses</label>
                <select name="event_type" value={form.event_type} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500">
                  {["Geburtstag", "Familienfeier", "Vereinsanlass", "Firmenanlass", "Anderes"].map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Erwartete Gäste</label>
                <input type="number" name="expected_guests" value={form.expected_guests} onChange={handleChange} min="1" max="50" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500" />
              </div>
              <div className="flex items-center gap-3">
                <input type="checkbox" name="cleaning_addon" checked={form.cleaning_addon} onChange={handleChange} id="cleaning" className="w-5 h-5 text-amber-500 rounded" />
                <label htmlFor="cleaning" className="text-gray-700">Reinigung dazu buchen (+CHF 60)</label>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Besondere Wünsche (optional)</label>
                <textarea name="special_requests" value={form.special_requests} onChange={handleChange} rows="3" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"></textarea>
              </div>
            </div>
          )}

          {step === 3 && !user && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Ihre Kontaktdaten</h2>
              <p className="text-sm text-gray-500">Da Sie nicht angemeldet sind, benötigen wir Ihre Kontaktdaten für die Buchung.</p>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
                <input type="text" name="name" value={form.name} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500" placeholder="Ihr vollständiger Name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">E-Mail *</label>
                <input type="email" name="email" value={form.email} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500" placeholder="ihre@email.ch" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Telefon *</label>
                <input type="tel" name="phone" value={form.phone} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500" placeholder="+41 79 123 45 67" />
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Tipp:</strong> Als Mitglied sparen Sie bis zu CHF {externalPrice && memberPrice ? externalPrice.total - memberPrice.total : 40}! 
                  <Link to="/mitglied-werden" className="underline ml-1">Jetzt Mitglied werden</Link>
                </p>
              </div>
            </div>
          )}

          {((step === 3 && user) || (step === 4 && !user)) && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Zusammenfassung</h2>
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div className="flex justify-between"><span className="text-gray-600">Datum:</span><span className="font-medium">{form.booking_date}</span></div>
                <div className="flex justify-between"><span className="text-gray-600">Zeitblock:</span><span className="font-medium">{form.time_block === "4h" ? `4h ab ${form.start_time}` : "24h (09:00-09:00)"}</span></div>
                <div className="flex justify-between"><span className="text-gray-600">Anlass:</span><span className="font-medium">{form.event_type}</span></div>
                <div className="flex justify-between"><span className="text-gray-600">Gäste:</span><span className="font-medium">{form.expected_guests}</span></div>
                <div className="flex justify-between"><span className="text-gray-600">Reinigung:</span><span className="font-medium">{form.cleaning_addon ? "Ja (+CHF 60)" : "Nein"}</span></div>
                {!user && (
                  <>
                    <div className="border-t pt-3">
                      <div className="flex justify-between"><span className="text-gray-600">Name:</span><span className="font-medium">{form.name}</span></div>
                      <div className="flex justify-between"><span className="text-gray-600">E-Mail:</span><span className="font-medium">{form.email}</span></div>
                      <div className="flex justify-between"><span className="text-gray-600">Telefon:</span><span className="font-medium">{form.phone}</span></div>
                    </div>
                  </>
                )}
                <div className="border-t pt-3 mt-3">
                  <div className="flex justify-between"><span className="text-gray-600">Miete:</span><span>CHF {currentPrice?.rental_price}</span></div>
                  {form.cleaning_addon && <div className="flex justify-between"><span className="text-gray-600">Reinigung:</span><span>CHF {currentPrice?.cleaning_price}</span></div>}
                  <div className="flex justify-between font-bold text-lg mt-2">
                    <span>Total:</span>
                    <span className={user ? "text-green-600" : "text-amber-600"}>CHF {currentPrice?.total}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{user ? "Mitgliederpreis" : "Externer Preis"}</p>
                </div>
              </div>
              <div className="bg-amber-50 p-4 rounded-lg">
                <p className="text-sm text-amber-800"><strong>Hinweis:</strong> Die Kaution von CHF 250 ist bei der Schlüsselübergabe in bar zu bezahlen.</p>
              </div>
              {!user && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-800"><strong>Externe Buchung:</strong> Ihre Anfrage wird geprüft und wir melden uns zur Bestätigung per E-Mail.</p>
                </div>
              )}
              <div className="flex items-start gap-3">
                <input type="checkbox" id="terms" required className="w-5 h-5 text-amber-500 rounded mt-0.5" />
                <label htmlFor="terms" className="text-sm text-gray-600">Ich akzeptiere die Mietbedingungen und die Hausordnung der Robihütte.</label>
              </div>
            </div>
          )}

          <div className="flex justify-between mt-8">
            {step > 1 && (
              <button onClick={() => setStep(step - 1)} className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
                <ChevronLeft size={20} />Zurück
              </button>
            )}
            <div className="ml-auto">
              {step < totalSteps ? (
                <button onClick={handleNext} className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-full font-medium transition-all flex items-center gap-2">
                  Weiter <ChevronRight size={20} />
                </button>
              ) : (
                <button onClick={handleSubmit} disabled={loading} className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-full font-medium transition-all disabled:opacity-50">
                  {loading ? "Wird gebucht..." : (user ? "Jetzt buchen" : "Anfrage senden")}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==================== BOOKING CONFIRMATION ====================
const BookingConfirmation = () => {
  const location = useLocation();
  const booking = location.state?.booking;
  const isExternal = location.state?.isExternal;

  if (!booking) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Keine Buchung gefunden.</p>
          <Link to="/robihuette" className="text-amber-600 underline">Zurück zur Robihütte</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl p-8 shadow-sm text-center">
          <div className={`w-20 h-20 ${isExternal ? 'bg-amber-100' : 'bg-green-100'} rounded-full flex items-center justify-center mx-auto mb-6`}>
            {isExternal ? <Clock size={40} className="text-amber-600" /> : <Check size={40} className="text-green-600" />}
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {isExternal ? "Anfrage gesendet!" : "Buchung bestätigt!"}
          </h1>
          <p className="text-gray-600 mb-6">
            {isExternal 
              ? "Vielen Dank für Ihre Anfrage. Wir prüfen die Verfügbarkeit und melden uns per E-Mail." 
              : "Vielen Dank für Ihre Reservation."
            }
          </p>
          
          <div className="bg-gray-50 rounded-lg p-6 text-left mb-6">
            <p className="text-sm text-gray-500 mb-1">Buchungsnummer</p>
            <p className="text-2xl font-bold text-amber-600 mb-4">{booking.reference_number}</p>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-gray-600">Datum:</span><span>{booking.booking_date}</span></div>
              <div className="flex justify-between"><span className="text-gray-600">Zeit:</span><span>{booking.start_time} - {booking.end_time}</span></div>
              <div className="flex justify-between"><span className="text-gray-600">Total:</span><span className="font-bold">CHF {booking.total_price}</span></div>
              <div className="flex justify-between"><span className="text-gray-600">Status:</span>
                <span className={`px-2 py-0.5 rounded-full text-xs ${isExternal ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}>
                  {isExternal ? "Ausstehend" : "Bestätigt"}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-amber-50 p-4 rounded-lg text-left text-sm text-amber-800 mb-6">
            <strong>Nächste Schritte:</strong>
            <ul className="mt-2 space-y-1">
              {isExternal ? (
                <>
                  <li>• Sie erhalten eine Bestätigung per E-Mail nach Prüfung</li>
                  <li>• Bei Fragen: robihuette@elternvereinigung.ch</li>
                  <li>• Kaution CHF 250 bar bei Schlüsselübergabe mitbringen</li>
                </>
              ) : (
                <>
                  <li>• Sie erhalten eine Bestätigung per E-Mail</li>
                  <li>• Kaution CHF 250 bar bei Schlüsselübergabe mitbringen</li>
                  <li>• Bei Fragen: robihuette@elternvereinigung.ch</li>
                </>
              )}
            </ul>
          </div>

          <div className="flex gap-4 justify-center">
            {!isExternal && <Link to="/meine-buchungen" className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-full font-medium">Meine Buchungen</Link>}
            <Link to="/" className="text-gray-600 hover:text-gray-900 px-6 py-3">Zur Startseite</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==================== MY BOOKINGS ====================
const MyBookingsPage = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { navigate("/login"); return; }
    axios.get(`${API}/bookings/my?token=${token}`)
      .then(res => setBookings(res.data.bookings))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user, token, navigate]);

  if (!user) return null;

  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Meine Buchungen</h1>
        
        {loading ? (
          <p className="text-gray-600">Laden...</p>
        ) : bookings.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center">
            <p className="text-gray-600 mb-4">Noch keine Buchungen vorhanden.</p>
            <Link to="/robihuette/buchen" className="text-amber-600 underline">Jetzt Robihütte buchen</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking, i) => (
              <div key={i} className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-sm text-gray-500">{booking.reference_number}</p>
                    <p className="text-lg font-semibold">{booking.booking_date}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm ${booking.status === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                    {booking.status === 'confirmed' ? 'Bestätigt' : booking.status}
                  </span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div><span className="text-gray-500">Zeit:</span><br/>{booking.start_time} - {booking.end_time}</div>
                  <div><span className="text-gray-500">Anlass:</span><br/>{booking.event_type}</div>
                  <div><span className="text-gray-500">Gäste:</span><br/>{booking.expected_guests}</div>
                  <div><span className="text-gray-500">Total:</span><br/>CHF {booking.total_price}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// ==================== AUTH PAGES ====================
const LoginPage = () => {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const redirect = new URLSearchParams(location.search).get("redirect") || "/";

  useEffect(() => {
    if (user) navigate(redirect);
  }, [user, navigate, redirect]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate(redirect);
    } catch (err) {
      setError(err.response?.data?.detail || "Login fehlgeschlagen");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-20 min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-2xl p-8 shadow-sm">
          <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">Anmelden</h1>
          {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">E-Mail</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Passwort</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500" />
            </div>
            <button type="submit" disabled={loading} className="w-full bg-amber-500 hover:bg-amber-600 text-white py-3 rounded-full font-medium transition-all disabled:opacity-50">
              {loading ? "Wird angemeldet..." : "Anmelden"}
            </button>
          </form>
          <p className="text-center text-gray-600 mt-6 text-sm">
            Noch kein Konto? <Link to="/mitglied-werden" className="text-amber-600 underline">Mitglied werden</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

const RegisterPage = () => {
  const { register, user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "", address: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) navigate("/");
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register(form);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.detail || "Registrierung fehlgeschlagen");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-20 min-h-screen bg-gray-50 flex items-center justify-center py-12">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-2xl p-8 shadow-sm">
          <h1 className="text-2xl font-bold text-gray-900 mb-2 text-center">Mitglied werden</h1>
          <p className="text-gray-600 text-center mb-6">Werde Teil der EVO-Gemeinschaft</p>
          {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
              <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">E-Mail *</label>
              <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Passwort *</label>
              <input type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required minLength="6" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
              <input type="tel" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
              <input type="text" value={form.address} onChange={e => setForm({...form, address: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500" />
            </div>
            <button type="submit" disabled={loading} className="w-full bg-amber-500 hover:bg-amber-600 text-white py-3 rounded-full font-medium transition-all disabled:opacity-50">
              {loading ? "Wird registriert..." : "Mitglied werden"}
            </button>
          </form>
          <p className="text-center text-gray-600 mt-6 text-sm">
            Bereits Mitglied? <Link to="/login" className="text-amber-600 underline">Anmelden</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

// ==================== SIMPLE PAGES ====================
const UeberUnsPage = () => {
  const [team, setTeam] = useState([]);
  useEffect(() => {
    axios.get(`${API}/board-members`).then(res => setTeam(res.data.members)).catch(console.error);
  }, []);

  return (
    <div className="pt-20">
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Über uns</h1>
          
          <div className="prose max-w-none mb-16">
            <h2 className="text-2xl font-bold text-gray-900">Unsere Geschichte</h2>
            <p className="text-gray-600 text-lg">
              Die Elternvereinigung Oberglatt ist seit über 50 Jahren ein fester Bestandteil unserer Gemeinde. 
              Von Generation zu Generation engagieren sich Eltern für Kinder und Jugendliche in Oberglatt.
            </p>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-8">Der Vorstand</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, i) => (
              <div key={i} className="bg-gray-50 rounded-2xl p-6 text-center">
                <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden">
                  <img src={member.photo} alt={member.name} className="w-full h-full object-cover" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">{member.name}</h3>
                <p className="text-amber-600 mb-4">{member.role}</p>
                <a href={`mailto:${member.email}`} className="inline-flex items-center gap-2 text-gray-500 hover:text-amber-600">
                  <Mail size={16} />{member.email}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

const AktuellPage = () => {
  const [events, setEvents] = useState([]);
  useEffect(() => {
    axios.get(`${API}/events?limit=20`).then(res => setEvents(res.data.events)).catch(console.error);
  }, []);

  return (
    <div className="pt-20">
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Aktuell</h1>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Kommende Anlässe</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event, i) => (
              <div key={i} className="bg-gray-50 rounded-xl p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-amber-500 text-white rounded-lg px-3 py-2 text-center">
                    <span className="block text-2xl font-bold">{event.date?.split('-')[2]}</span>
                    <span className="text-xs">{['Jan','Feb','Mär','Apr','Mai','Jun','Jul','Aug','Sep','Okt','Nov','Dez'][parseInt(event.date?.split('-')[1])-1]}</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{event.title}</h3>
                    <p className="text-sm text-gray-500">{event.category}</p>
                  </div>
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                  <p className="flex items-center gap-2"><Clock size={14} />{event.time}</p>
                  <p className="flex items-center gap-2"><MapPin size={14} />{event.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

const BlogPage = () => {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    axios.get(`${API}/blog`).then(res => setPosts(res.data.posts)).catch(console.error);
  }, []);

  return (
    <div className="pt-20">
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Blog / Rückblick</h1>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post, i) => (
              <article key={i} className="bg-gray-50 rounded-2xl overflow-hidden">
                <img src={post.image_url} alt={post.title} className="w-full h-48 object-cover" />
                <div className="p-6">
                  <span className="text-sm text-amber-600">{post.category}</span>
                  <h2 className="text-xl font-semibold text-gray-900 mt-1 mb-2">{post.title}</h2>
                  <p className="text-gray-600 text-sm">{post.content?.substring(0, 100)}...</p>
                  <p className="text-gray-400 text-xs mt-4">{post.created_at}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

const KontaktPage = () => {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/contact`, form);
      setSent(true);
    } catch (err) {
      alert("Fehler beim Senden");
    }
  };

  return (
    <div className="pt-20">
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Kontakt</h1>
          
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Kontaktdaten</h2>
              <div className="space-y-4">
                <p className="flex items-center gap-3 text-gray-600"><MapPin className="text-amber-500" />Dicklooweg, 8154 Oberglatt</p>
                <p className="flex items-center gap-3"><Mail className="text-amber-500" /><a href="mailto:info@elternvereinigung.ch" className="text-amber-600">info@elternvereinigung.ch</a></p>
              </div>
            </div>
            
            <div>
              {sent ? (
                <div className="bg-green-50 text-green-700 p-6 rounded-xl">
                  <Check size={24} className="mb-2" />
                  <p>Nachricht gesendet! Wir melden uns bald.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <input type="text" placeholder="Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required className="w-full px-4 py-3 border border-gray-300 rounded-lg" />
                  <input type="email" placeholder="E-Mail" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required className="w-full px-4 py-3 border border-gray-300 rounded-lg" />
                  <input type="text" placeholder="Betreff" value={form.subject} onChange={e => setForm({...form, subject: e.target.value})} required className="w-full px-4 py-3 border border-gray-300 rounded-lg" />
                  <textarea placeholder="Nachricht" value={form.message} onChange={e => setForm({...form, message: e.target.value})} required rows="4" className="w-full px-4 py-3 border border-gray-300 rounded-lg"></textarea>
                  <button type="submit" className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-full font-medium">Senden</button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

// ==================== APP ====================
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-white">
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/ueber-uns" element={<UeberUnsPage />} />
              <Route path="/aktuell" element={<AktuellPage />} />
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/kontakt" element={<KontaktPage />} />
              <Route path="/robihuette" element={<RobihuettePage />} />
              <Route path="/robihuette/buchen" element={<BookingPage />} />
              <Route path="/buchung-bestaetigung" element={<BookingConfirmation />} />
              <Route path="/meine-buchungen" element={<MyBookingsPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/mitglied-werden" element={<RegisterPage />} />
              <Route path="/impressum" element={<div className="pt-20 p-8"><h1 className="text-3xl font-bold">Impressum</h1><p className="mt-4">Elternvereinigung Oberglatt<br/>Dicklooweg, 8154 Oberglatt<br/>info@elternvereinigung.ch</p></div>} />
              <Route path="/datenschutz" element={<div className="pt-20 p-8"><h1 className="text-3xl font-bold">Datenschutz</h1><p className="mt-4">Datenschutzerklärung gemäss Schweizer DSG.</p></div>} />
              <Route path="/agb" element={<div className="pt-20 p-8"><h1 className="text-3xl font-bold">AGB</h1><p className="mt-4">Allgemeine Geschäftsbedingungen der Elternvereinigung Oberglatt.</p></div>} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
