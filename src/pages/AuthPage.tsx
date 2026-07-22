import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { useLocation } from 'react-router-dom';

import { AuthForm } from '@/components/auth/AuthForm';
import { AuthToggle } from '@/components/auth/AuthToggle';
import { AuthCard, AuthCardTitle, AuthContainer, AuthSubtitle } from '@/components/auth/authLayout';
import { useAuthForm } from '@/hooks/useAuthForm';

export function AuthPage() {
  const location = useLocation();

  useEffect(() => {
    if ((location.state as { passwordReset?: boolean })?.passwordReset) {
      toast.success('Password updated successfully. You can now log in.');
      window.history.replaceState({}, '');
    }
  }, [location.state]);

  const { mode, serverError, isLoading, form, onSubmit, handleGoogleSignIn, toggleMode } = useAuthForm();

  return (
    <AuthContainer>
      <AuthCard>
        <AuthCardTitle>{mode === 'login' ? 'Welcome Back' : 'Create Account'}</AuthCardTitle>
        <AuthSubtitle>{mode === 'login' ? 'Log in to your EchoBay account' : 'Join EchoBay today'}</AuthSubtitle>

        <AuthForm
          mode={mode}
          form={form}
          serverError={serverError}
          isLoading={isLoading}
          onSubmit={onSubmit}
          onGoogleSignIn={handleGoogleSignIn}
        />

        <AuthToggle mode={mode} onToggle={toggleMode} />
      </AuthCard>
    </AuthContainer>
  );
}
