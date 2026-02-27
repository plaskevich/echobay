import { PiAddressBook, PiEnvelopeSimple, PiLockSimple, PiPalette } from 'react-icons/pi';

import { Sidebar, SidebarItem, SidebarNav, SidebarTitle } from '@/components/layout/SidebarLayout';

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
      <SidebarTitle>Settings</SidebarTitle>
      <SidebarNav>
        {sections.map(({ key, label, icon }) => (
          <SidebarItem
            key={key}
            data-testid={`settings-section-${key}`}
            $active={activeSection === key}
            onClick={() => setActiveSection(key)}
          >
            {icon}
            {label}
          </SidebarItem>
        ))}
      </SidebarNav>
    </Sidebar>
  );
}
