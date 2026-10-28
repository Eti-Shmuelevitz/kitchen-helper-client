import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { apiRequest } from '../api/api';
import { useAuth } from '../context/AuthContext';
import type { LoginResponse } from '../types';
import AuthCard from '../components/AuthCard';
import PasswordInput from '../components/PasswordInput';

interface RegisterForm {
     name: string;
  email: string;
  password: string| number;
  role: 'MANAGER' | 'MEMBER';
  managerCode: string | number;
}




function RegisterPage() {

     const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>({
    defaultValues: { role: 'MEMBER' },
  });
const { saveLogin } = useAuth();
const navigate = useNavigate();
const [serverError, setServerError] = useState('');

const selectedRole = watch('role');
   async function onSubmit(data: RegisterForm) {
        setServerError('');

         try {
      const response = await apiRequest<LoginResponse>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      saveLogin(response.token, response.user);
      navigate('/');
    } catch (error) {
      if (error instanceof Error) {
        setServerError(error.message);
      }
    }
  }

   
  return (
    <AuthCard title="יצירת חשבון חדש" subtitle="כמה פרטים ואפשר להתחיל." activeTab="register">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="auth-field">
          <label>שם</label>
          <input
            {...register('name', {
              required: 'צריך למלא שם',
              minLength: { value: 2, message: 'שם של 2 תווים לפחות' },
            })}
          />
          {errors.name && <p className="auth-error">{errors.name.message}</p>}
        </div>

        <div className="auth-field">
          <label>מייל</label>
          <input
            {...register('email', {
              required: 'צריך למלא מייל',
              pattern: { value: /@/, message: 'המייל לא תקין' },
            })}
          />
          {errors.email && <p className="auth-error">{errors.email.message}</p>}
        </div>

        <div className="auth-field">
          <label>סיסמה</label>
          <PasswordInput
            {...register('password', {
              required: 'צריך למלא סיסמה',
              minLength: { value: 8, message: 'סיסמה של 8 תווים לפחות' },
            })}
          />
          {errors.password ? (
            <p className="auth-error">{errors.password.message}</p>
          ) : (
            <p className="auth-hint">לפחות 8 תווים, עם אות וספרה</p>
          )}
        </div>

        <div className="auth-field">
          <label>אני...</label>
          <div className="role-options">
            <label className={selectedRole === 'MEMBER' ? 'role-option selected' : 'role-option'}>
              <input type="radio" value="MEMBER" {...register('role')} />
              <span className="role-title">בן/בת משפחה</span>
              <span className="role-description">רואה את התפריט, מצביע/ה ועוזר/ת בקניות</span>
            </label>

            <label className={selectedRole === 'MANAGER' ? 'role-option selected' : 'role-option'}>
              <input type="radio" value="MANAGER" {...register('role')} />
              <span className="role-title">אמא</span>
              <span className="role-description">מנהלת מתכונים, תפריט ורשימת קניות</span>
            </label>
          </div>
        </div>

        {selectedRole === 'MANAGER' && (
          <div className="auth-field">
            <label>קוד מנהלת</label>
            <input
              {...register('managerCode', { required: 'צריך למלא קוד מנהלת' })}
            />
            {errors.managerCode && <p className="auth-error">{errors.managerCode.message}</p>}
          </div>
        )}

        {serverError && <p className="auth-server-error">{serverError}</p>}

        <button type="submit" className="auth-button" disabled={isSubmitting}>
          {isSubmitting ? 'נרשמת...' : 'יצירת חשבון'}
        </button>
      </form>
    </AuthCard>
  );
}

export default RegisterPage;
