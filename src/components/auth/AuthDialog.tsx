import { AuthForm } from '@/components/auth/AuthForm';
import { AuthToggle } from '@/components/auth/AuthToggle';
import { ForgotPasswordForm } from '@/components/auth/ForgotPassword';
import { AuthCardTitle, AuthSubtitle } from '@/components/auth/authLayout';
import { Dialog } from '@/components/common/Dialog';
import { useAuthForm } from '@/hooks/useAuthForm';
import { type AuthMode, useAuthStore } from '@/store/auth-store';

const TITLES: Record<AuthMode, string> = {
  login: 'Welcome Back',
  signup: 'Create Account',
  forgot: 'Reset Password',
};

export function AuthDialog() {
  const isOpen = useAuthStore((state) => state.isAuthDialogOpen);
  return isOpen ? <AuthDialogContent /> : null;
}

function AuthDialogContent() {
  const closeAuthDialog = useAuthStore((state) => state.closeAuthDialog);
  const { mode, serverError, isLoading, form, onSubmit, handleGoogleSignIn, toggleMode, switchMode } = useAuthForm(
    useAuthStore.getState().authDialogMode
  );

  return (
    <Dialog isOpen onClose={closeAuthDialog} ariaLabel={TITLES[mode]}>
      <AuthCardTitle>{TITLES[mode]}</AuthCardTitle>
      {mode === 'forgot' ? (
        <ForgotPasswordForm onBack={() => switchMode('login')} />
      ) : (
        <>
          <AuthSubtitle>{mode === 'login' ? 'Log in to your EchoBay account' : 'Join EchoBay today'}</AuthSubtitle>
          <AuthForm
            mode={mode}
            form={form}
            serverError={serverError}
            isLoading={isLoading}
            onSubmit={onSubmit}
            onGoogleSignIn={handleGoogleSignIn}
            onForgotPassword={() => switchMode('forgot')}
          />
          <AuthToggle mode={mode} onToggle={toggleMode} />
        </>
      )}
    </Dialog>
  );
}
