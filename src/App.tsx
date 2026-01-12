import { useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';

import { RootLayout } from '@/components/RootLayout';
import { Auth } from '@/components/auth/Auth';
import { CatalogView } from '@/components/catalog/CatalogView';
import { ProfileEditForm } from '@/components/profile/edit/ProfileEditForm';
import { EditItemPage } from '@/pages/EditItemPage';
import { ItemDetailPage } from '@/pages/ItemDetailPage';
import ProfilePage from '@/pages/ProfilePage';
import { useAuthStore } from '@/store/auth-store';
import { useThemeStore } from '@/store/theme-store';

export function App() {
  const themeColors = useThemeStore((state) => state.themeColors);
  const initialize = useAuthStore((state) => state.initialize);

  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <StyledThemeProvider theme={themeColors}>
      <BrowserRouter>
        <Routes>
          <Route element={<RootLayout />}>
            <Route index element={<CatalogView />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/catalog" element={<CatalogView />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/profile/edit" element={<ProfileEditForm />} />
            <Route path="/items/new" element={<EditItemPage mode="create" />} />
            <Route path="/items/:id" element={<ItemDetailPage />} />
            <Route path="/items/:id/edit" element={<EditItemPage mode="edit" />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </StyledThemeProvider>
  );
}
