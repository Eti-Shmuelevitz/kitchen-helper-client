import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import './AuthCard.css';

interface AuthCardProps {
  title: string;
  subtitle: string;
  activeTab: 'login' | 'register';
  children: ReactNode;
}

// המסגרת המשותפת למסך הכניסה ולמסך ההרשמה: כרטיס לבן, כותרת ולשוניות
function AuthCard({ title, subtitle, activeTab, children }: AuthCardProps) {
  return (
    <div className="auth-page">
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
  );
}

export default AuthCard;
