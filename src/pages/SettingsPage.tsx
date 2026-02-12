import { useState } from 'react';
import styled from 'styled-components';

import { InfoMessage } from '@/components/common/Message';
import SettingsContent from '@/components/settings/SettingsContent';
import SettingsSidebar, { type SettingsSection } from '@/components/settings/SettingsSidebar';
import { useAuthStore } from '@/store/auth-store';

export default function SettingsPage() {
  const { user } = useAuthStore();
  const [activeSection, setActiveSection] = useState<SettingsSection>('email');

  if (!user) {
    return (
      <Container>
        <InfoMessage>Please log in to view settings</InfoMessage>
      </Container>
    );
  }

  return (
    <Container>
      <SettingsSidebar activeSection={activeSection} setActiveSection={setActiveSection} />
      <SettingsContent activeSection={activeSection} />
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  margin: 4rem auto;
  display: flex;
  gap: 4rem;
  align-items: flex-start;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;
