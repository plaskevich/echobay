import { useState } from 'react';

import { InfoMessage } from '@/components/common/Message';
import { SidebarLayout } from '@/components/layout/SidebarLayout';
import SettingsContent from '@/components/settings/SettingsContent';
import SettingsSidebar, { type SettingsSection } from '@/components/settings/SettingsSidebar';
import { useAuthStore } from '@/store/auth-store';

export default function SettingsPage() {
  const { user } = useAuthStore();
  const [activeSection, setActiveSection] = useState<SettingsSection>('email');

  if (!user) {
    return (
      <SidebarLayout>
        <InfoMessage>Please log in to view settings</InfoMessage>
      </SidebarLayout>
    );
  }

  return (
    <SidebarLayout>
      <SettingsSidebar activeSection={activeSection} setActiveSection={setActiveSection} />
      <SettingsContent activeSection={activeSection} />
    </SidebarLayout>
  );
}
