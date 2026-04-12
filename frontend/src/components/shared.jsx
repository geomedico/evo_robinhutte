import { Check, Clock, MapPin, Calendar, ArrowRight, X } from "lucide-react";

/**
 * Reusable Price Card component
 */
export const PriceCard = ({ 
  title, 
  price, 
  isActive = false, 
  variant = "default", // "member" | "external" | "default"
  subtitle = null,
  icon: Icon = null 
}) => {
  const variants = {
    member: {
      border: isActive ? 'border-green-500 bg-green-50' : 'border-gray-200',
      price: 'text-green-600',
      icon: 'text-green-600'
    },
    external: {
      border: isActive ? 'border-amber-500 bg-amber-50' : 'border-gray-200',
      price: 'text-amber-600',
      icon: 'text-amber-600'
    },
    default: {
      border: isActive ? 'border-amber-500 bg-amber-50' : 'border-gray-200',
      price: 'text-gray-900',
      icon: 'text-gray-600'
    }
  };

  const styles = variants[variant] || variants.default;

  return (
    <div className={`p-4 rounded-lg border-2 ${styles.border}`}>
      <div className="flex items-center gap-2 mb-1">
        {Icon && <Icon size={16} className={styles.icon} />}
        <span className="text-sm font-medium text-gray-700">{title}</span>
      </div>
      <p className={`text-2xl font-bold ${styles.price}`}>CHF {price}</p>
      {subtitle && <p className={`text-xs mt-1 ${styles.price}`}>{subtitle}</p>}
    </div>
  );
};

/**
 * Time Block Selector Button
 */
export const TimeBlockButton = ({ 
  value, 
  label, 
  description, 
  isSelected, 
  onClick 
}) => (
  <button 
    type="button" 
    onClick={onClick}
    className={`p-4 border rounded-lg text-left transition-all ${
      isSelected 
        ? 'border-amber-500 bg-amber-50 shadow-sm' 
        : 'border-gray-200 hover:border-gray-300'
    }`}
  >
    <span className="block font-semibold">{label}</span>
    <span className="text-xs text-gray-500">{description}</span>
  </button>
);

/**
 * Event Card Component
 */
export const EventCard = ({ event, index }) => {
  const day = event.date?.split('-')[2] || '01';
  const monthIndex = parseInt(event.date?.split('-')[1] || '1') - 1;
  const months = ['Jan','Feb','Mär','Apr','Mai','Jun','Jul','Aug','Sep','Okt','Nov','Dez'];
  
  return (
    <article 
      key={event.id || `event-${index}`}
      className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all"
    >
      <div className="relative h-48 bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center">
        <Calendar size={48} className="text-amber-500" />
        <div className="absolute top-4 left-4 bg-white rounded-lg px-3 py-2 shadow-lg">
          <span className="block text-2xl font-bold text-amber-600">{day}</span>
          <span className="block text-xs text-gray-500 uppercase">{months[monthIndex]}</span>
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
  );
};

/**
 * Team Member Card Component
 */
export const TeamMemberCard = ({ member, index }) => (
  <div 
    key={member.id || `member-${index}`}
    className="bg-white rounded-2xl p-6 text-center shadow-sm hover:shadow-xl transition-all"
  >
    <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden ring-4 ring-amber-100">
      <img src={member.photo} alt={member.name} className="w-full h-full object-cover" />
    </div>
    <h3 className="text-lg font-semibold text-gray-900">{member.name}</h3>
    <p className="text-amber-600 text-sm mb-4">{member.role}</p>
  </div>
);

/**
 * Booking Summary Row
 */
export const SummaryRow = ({ label, value, bold = false }) => (
  <div className={`flex justify-between ${bold ? 'font-bold text-lg mt-2' : ''}`}>
    <span className="text-gray-600">{label}:</span>
    <span className={bold ? '' : 'font-medium'}>{value}</span>
  </div>
);

/**
 * Alert Banner Component
 */
export const AlertBanner = ({ 
  variant = "info", // "info" | "success" | "warning" | "error"
  icon: Icon = null,
  title,
  children 
}) => {
  const variants = {
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    success: 'bg-green-50 border-green-200 text-green-800',
    warning: 'bg-amber-50 border-amber-200 text-amber-800',
    error: 'bg-red-50 border-red-200 text-red-800'
  };

  const iconColors = {
    info: 'text-blue-600',
    success: 'text-green-600',
    warning: 'text-amber-600',
    error: 'text-red-600'
  };

  return (
    <div className={`border rounded-lg p-4 ${variants[variant]}`}>
      <div className="flex items-start gap-3">
        {Icon && <Icon size={20} className={`mt-0.5 ${iconColors[variant]}`} />}
        <div>
          {title && <p className="font-medium">{title}</p>}
          {children}
        </div>
      </div>
    </div>
  );
};

/**
 * Progress Steps Component
 */
export const ProgressSteps = ({ currentStep, totalSteps }) => (
  <div className="flex gap-2 mb-8">
    {Array.from({ length: totalSteps }, (_, i) => (
      <div 
        key={`step-${i + 1}`}
        className={`flex-1 h-2 rounded-full ${
          i + 1 <= currentStep ? 'bg-amber-500' : 'bg-gray-200'
        }`}
      />
    ))}
  </div>
);

/**
 * Modal Container
 */
export const Modal = ({ isOpen, onClose, title, subtitle, children }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" 
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl max-w-md w-full max-h-[80vh] overflow-auto shadow-2xl" 
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
              {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
              <X size={20} />
            </button>
          </div>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

/**
 * Slot Button for Day Details
 */
export const SlotButton = ({ 
  slot, 
  timeBlock,
  onClick, 
  variant = "default" // "default" | "highlight"
}) => {
  const variants = {
    default: "border-gray-200 hover:border-amber-500 hover:bg-amber-50",
    highlight: "border-2 border-amber-500 bg-amber-50 hover:bg-amber-100",
    secondary: "border-blue-200 bg-blue-50 hover:border-blue-500 hover:bg-blue-100"
  };

  const textColors = {
    default: "text-gray-900",
    highlight: "text-amber-700",
    secondary: "text-blue-700"
  };

  return (
    <button
      onClick={() => onClick(slot.start, timeBlock)}
      className={`flex items-center justify-between p-3 border rounded-lg transition-all text-left ${variants[variant]}`}
    >
      <span className={`font-medium ${textColors[variant]}`}>{slot.label}</span>
      <ArrowRight size={16} className={variant === "secondary" ? "text-blue-500" : "text-amber-500"} />
    </button>
  );
};
