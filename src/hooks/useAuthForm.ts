import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

import { signInWithGoogle } from '@/api/auth';
import { type AuthMode, useAuthStore } from '@/store/auth-store';

export interface AuthFormData {
  email: string;
  password: string;
  confirmPassword: string;
}

export function useAuthForm(initialMode: AuthMode = 'login') {
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [serverError, setServerError] = useState('');

  const navigate = useNavigate();
  const { logIn, signUp, isLoading, closeAuthDialog } = useAuthStore();

  const form = useForm<AuthFormData>({
    defaultValues: { email: '', password: '', confirmPassword: '' },
    shouldUnregister: true,
  });

  const switchMode = (next: AuthMode) => {
    setMode(next);
    form.reset();
    setServerError('');
  };

  const toggleMode = () => switchMode(mode === 'login' ? 'signup' : 'login');

  const onSuccess = () => {
    const { authRedirect } = useAuthStore.getState();
    closeAuthDialog();
    if (authRedirect) navigate(authRedirect, { replace: true });
  };

  const onSubmit = async (data: AuthFormData) => {
    setServerError('');

    if (mode === 'signup') {
      const { error } = await signUp(data.email, data.password);
      if (error) {
        setServerError(error.message);
      } else {
        toast.success('Account created successfully!');
        form.reset();
        onSuccess();
      }
    } else {
      const { error } = await logIn(data.email, data.password);
      if (error) {
        setServerError(error.message);
      } else {
        onSuccess();
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
    switchMode,
  };
}
