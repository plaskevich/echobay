import { PiAddressBook, PiEnvelopeSimple, PiLockSimple, PiPalette } from 'react-icons/pi';
import styled from 'styled-components';

export type SettingsSection = 'email' | 'password' | 'shipping' | 'theme';

interface SettingsSidebarProps {
  activeSection: SettingsSection;
  setActiveSection: (section: SettingsSection) => void;
}

const sections: { key: SettingsSection; label: string; icon: React.ReactNode }[] = [
  { key: 'email', label: 'Email Address', icon: <PiEnvelopeSimple size={20} /> },
  { key: 'password', label: 'Password', icon: <PiLockSimple size={20} /> },
  { key: 'shipping', label: 'Shipping Address', icon: <PiAddressBook size={20} /> },
  { key: 'theme', label: 'Theme', icon: <PiPalette size={20} /> },
];

export default function SettingsSidebar({ activeSection, setActiveSection }: SettingsSidebarProps) {
  return (
    <Sidebar>
      <Title>Settings</Title>
      <NavList>
        {sections.map(({ key, label, icon }) => (
          <SidebarButton key={key} $active={activeSection === key} onClick={() => setActiveSection(key)}>
            {icon}
            {label}
          </SidebarButton>
        ))}
      </NavList>
    </Sidebar>
  );
}

const Sidebar = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 300px;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: bold;
  color: ${({ theme }) => theme.text.primary};
  margin: 0 0 1.5rem 1rem;
`;

const NavList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;

  @media (max-width: 768px) {
    flex-direction: row;
    overflow-x: auto;
  }
`;

const SidebarButton = styled.button<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.75rem 1rem;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background-color: ${({ theme }) => theme.background.primary};
  border: none;
  color: ${({ theme, $active }) => ($active ? theme.primary.main : theme.text.primary)};
  font-size: 1rem;
  font-weight: ${({ $active }) => ($active ? 600 : 500)};
  transition: color 0.2s ease-in-out;
  white-space: nowrap;

  &:hover {
    background-color: ${({ theme }) => theme.background.secondary};
  }

  &:active {
    transform: translateY(1px);
  }
`;
