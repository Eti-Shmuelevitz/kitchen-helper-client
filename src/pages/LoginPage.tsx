import { useNavigate } from 'react-router-dom';
import { apiRequest } from '../api/api';
import { useAuth } from '../context/AuthContext';
import { useForm } from 'react-hook-form';
import type { LoginResponse } from '../types';
import { useState } from 'react';
import AuthCard from '../components/AuthCard';
import PasswordInput from '../components/PasswordInput';
interface LoginForm {
  email: string;
  password: string| number;
}

function LoginPage() {
  const { register, handleSubmit ,
      formState: { errors, isSubmitting }, } = useForm<LoginForm>();
  const {saveLogin}=useAuth();
    const navigate = useNavigate();
     const [serverError, setServerError] = useState('');
async  function onSubmit(data: LoginForm) {
        setServerError('');
    try {
      const response = await apiRequest<LoginResponse>('/auth/login', {
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
    <AuthCard title="כניסה" subtitle="טוב לראות אותך שוב." activeTab="login">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="auth-field">
          <label>מייל</label>
          <input {...register('email', {required :'צריך למלא מייל', 
            pattern:{value: /@/ , message:'email לא תקין'}
          })} />
          {errors.email && <p className="auth-error">{errors.email.message}</p>}
        </div>

        <div className="auth-field">
          <label>סיסמה</label>
          <PasswordInput {...register('password',{required:'צריך למלא סיסמא'})} />
          {errors.password && <p className="auth-error">{errors.password.message}</p>}
        </div>

        {serverError && <p className="auth-server-error">{serverError}</p>}

        <button type="submit" className="auth-button" disabled={isSubmitting}>
          {isSubmitting ? 'נכנסת...' : 'כניסה'}
        </button>
      </form>
    </AuthCard>
  );
}

export default LoginPage;
