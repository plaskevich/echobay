import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useLocation, useNavigate } from 'react-router-dom';

import { signInWithGoogle } from '@/api/auth';
import { useAuthStore } from '@/store/auth-store';

type AuthMode = 'login' | 'signup';

export interface AuthFormData {
  email: string;
  password: string;
  confirmPassword: string;
}

export function useAuthForm() {
  const [mode, setMode] = useState<AuthMode>('login');
  const [serverError, setServerError] = useState('');

  const navigate = useNavigate();
  const location = useLocation();
  const { logIn, signUp, isLoading } = useAuthStore();

  const from = (location.state as { from?: Location })?.from?.pathname || '/';

  const form = useForm<AuthFormData>({
    defaultValues: { email: '', password: '', confirmPassword: '' },
    shouldUnregister: true,
  });

  const toggleMode = () => {
    setMode(mode === 'login' ? 'signup' : 'login');
    form.reset();
    setServerError('');
  };

  const onSubmit = async (data: AuthFormData) => {
    setServerError('');

    if (mode === 'signup') {
      const { error } = await signUp(data.email, data.password);
      if (error) {
        setServerError(error.message);
      } else {
        toast.success('Account created successfully!');
        navigate(from, { replace: true });
        form.reset();
      }
    } else {
      const { error } = await logIn(data.email, data.password);
      if (error) {
        setServerError(error.message);
      } else {
        navigate(from, { replace: true });
      }
    }
  };

  const handleGoogleSignIn = async () => {
    setServerError('');
    const { error } = await signInWithGoogle();
    if (error) {
      setServerError(error.message);
    }
  };

  return {
    mode,
    serverError,
    isLoading,
    form,
    onSubmit: form.handleSubmit(onSubmit),
    handleGoogleSignIn,
    toggleMode,
  };
}
