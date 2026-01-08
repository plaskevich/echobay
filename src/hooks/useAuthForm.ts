import { useState } from 'react';

import { useNavigate } from '@tanstack/react-router';

import { signInWithGoogle } from '@/lib/auth';
import { useAuthStore } from '@/store/auth-store';

type AuthMode = 'login' | 'signup';

export function useAuthForm() {
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const navigate = useNavigate();
  const { logIn, signUp, isLoading } = useAuthStore();

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setError('');
    setSuccess('');
  };

  const toggleMode = () => {
    setMode(mode === 'login' ? 'signup' : 'login');
    resetForm();
  };

  const validateForm = (): boolean => {
    if (!email || !password) {
      setError('Please fill in all fields');
      return false;
    }

    if (mode === 'signup' && password !== confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateForm()) {
      return;
    }

    if (mode === 'signup') {
      const { error } = await signUp(email, password);
      if (error) {
        setError(error.message);
      } else {
        setSuccess('Account created successfully! Please check your email to verify your account.');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
      }
    } else {
      const { error } = await logIn(email, password);
      if (error) {
        setError(error.message);
      } else {
        navigate({ to: '/' });
      }
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    const { error } = await signInWithGoogle();
    if (error) {
      setError(error.message);
    }
  };

  return {
    mode,
    email,
    password,
    confirmPassword,
    error,
    success,
    isLoading,
    setEmail,
    setPassword,
    setConfirmPassword,
    handleSubmit,
    handleGoogleSignIn,
    toggleMode,
  };
}
