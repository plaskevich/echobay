import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';

import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import { ProtectedRoute } from '@/components/ProtectedRoute';
import { RootLayout } from '@/components/RootLayout';
import { ForgotPassword } from '@/components/auth/ForgotPassword';
import { ResetPassword } from '@/components/auth/ResetPassword';
import { ProfileEditForm } from '@/components/profile/edit/ProfileEditForm';
import { AuthPage } from '@/pages/AuthPage';
import { CheckoutPage } from '@/pages/CheckoutPage';
import { EditItemPage } from '@/pages/EditItemPage';
import FavoritesPage from '@/pages/FavoritesPage';
import HomePage from '@/pages/HomePage';
import { ItemDetailPage } from '@/pages/ItemDetailPage';
import MessagesPage from '@/pages/MessagesPage';
import OrdersPage from '@/pages/OrdersPage';
import ProfilePage from '@/pages/ProfilePage';
import SettingsPage from '@/pages/SettingsPage';
import UserProfilePage from '@/pages/UserProfilePage';
import { useAuthStore } from '@/store/auth-store';
import { useThemeStore } from '@/store/theme-store';

export function App() {
  const themeColors = useThemeStore((state) => state.themeColors);
  const initialize = useAuthStore((state) => state.initialize);

  useEffect(() => {
    let cleanup: (() => void) | undefined;

    initialize().then((cleanupFn) => {
      cleanup = cleanupFn;
    });

    return () => {
      cleanup?.();
    };
  }, [initialize]);

  return (
    <StyledThemeProvider theme={themeColors}>
      <BrowserRouter>
        <Routes>
          <Route element={<RootLayout />}>
            <Route index element={<HomePage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/auth/forgot-password" element={<ForgotPassword />} />
            <Route path="/auth/reset-password" element={<ResetPassword />} />
            <Route path="/items/:id" element={<ItemDetailPage />} />
            <Route path="/users/:id" element={<UserProfilePage />} />

            <Route element={<ProtectedRoute />}>
              <Route path="/favorites" element={<FavoritesPage />} />
              <Route path="/messages" element={<MessagesPage />} />
              <Route path="/orders" element={<OrdersPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/profile/edit" element={<ProfileEditForm />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/items/new" element={<EditItemPage mode="create" />} />
              <Route path="/items/:id/edit" element={<EditItemPage mode="edit" />} />
              <Route path="/checkout/:id" element={<CheckoutPage />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: themeColors.background.secondary,
            color: themeColors.text.primary,
            border: `1px solid ${themeColors.border.primary}`,
            borderRadius: themeColors.borderRadius.sm,
            padding: '0.75rem 1rem',
            boxShadow: `0 0.25rem 0.75rem ${themeColors.shadow.medium}`,
          },
          success: {
            iconTheme: {
              primary: themeColors.state.success,
              secondary: themeColors.background.primary,
            },
          },
          error: {
            iconTheme: {
              primary: themeColors.state.error,
              secondary: themeColors.background.primary,
            },
          },
        }}
      />
      <ReactQueryDevtools initialIsOpen={false} />
    </StyledThemeProvider>
  );
}
