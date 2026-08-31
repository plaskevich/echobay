import { useEffect } from 'react';
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';

import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import { ProtectedRoute } from '@/components/ProtectedRoute';
import { RootLayout } from '@/components/RootLayout';
import { ResetPassword } from '@/components/auth/ResetPassword';
import { AppToaster } from '@/components/common/AppToaster';
import { RouteError } from '@/components/common/ErrorPage';
import { ProfileEditForm } from '@/components/profile/edit/ProfileEditForm';
import { theme } from '@/lib/theme/theme';
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

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<RootLayout />}>
      <Route errorElement={<RouteError />}>
        <Route index element={<HomePage />} />
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

        <Route path="*" element={<RouteError />} />
      </Route>
    </Route>
  )
);

export function App() {
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
    <StyledThemeProvider theme={theme}>
      <RouterProvider router={router} />
      <AppToaster />
      {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
    </StyledThemeProvider>
  );
}
