import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import './AuthCard.css';

interface AuthCardProps {
  title: string;
  subtitle: string;
  activeTab: 'login' | 'register';
  children: ReactNode;
}

// גדלים של הבועות שעולות בחלק הסגול
const bubbles = [18, 34, 22, 48, 14, 28, 40, 20, 30, 16, 44, 24];

// המסגרת המשותפת למסך הכניסה ולמסך ההרשמה: חלק סגול, וכרטיס לבן עם כותרת ולשוניות
function AuthCard({ title, subtitle, activeTab, children }: AuthCardProps) {
  return (
    <div className="auth-page">
      <div className="auth-shell">
        <div className="auth-art" aria-hidden="true">
          {bubbles.map((size, index) => (
            <span
              key={index}
              className="bubble"
              style={{
                width: size,
                height: size,
                left: `${6 + index * 7.8}%`,
                animationDuration: `${6 + (index % 4) * 1.7}s`,
                animationDelay: `-${index * 0.9}s`,
              }}
            />
          ))}
          <img className="auth-pot" src="/pot.svg" alt="" />
          <h2 className="auth-art-title">מה מבשלים היום?</h2>
          <p className="auth-art-text">כל המתכונים של הבית, במקום אחד.</p>
        </div>

      <div className="auth-card">
        <h1 className="auth-title">{title}</h1>
        <p className="auth-subtitle">{subtitle}</p>

        <div className="auth-tabs">
          <Link to="/login" className={activeTab === 'login' ? 'auth-tab active' : 'auth-tab'}>
            התחברות
          </Link>
          <Link to="/register" className={activeTab === 'register' ? 'auth-tab active' : 'auth-tab'}>
            הרשמה
          </Link>
        </div>

        {children}
      </div>
      </div>
    </div>
  );
}

export default AuthCard;
