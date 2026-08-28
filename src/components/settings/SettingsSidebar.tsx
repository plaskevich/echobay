import styled from 'styled-components';

import { Sidebar, SidebarItem, SidebarNav, SidebarTitle } from '@/components/layout/SidebarLayout';
import { breakpoint } from '@/lib/theme/breakpoints';

export type SettingsSection = 'email' | 'password' | 'shipping';

interface SettingsSidebarProps {
  activeSection: SettingsSection;
  setActiveSection: (section: SettingsSection) => void;
}

const sections: { key: SettingsSection; label: string; shortLabel?: string; icon: React.ReactNode }[] = [
  { key: 'email', label: 'Email Address', shortLabel: 'Email', icon: <i className="hn hn-envelope" /> },
  { key: 'password', label: 'Password', icon: <i className="hn hn-unlock" /> },
  { key: 'shipping', label: 'Shipping Address', shortLabel: 'Shipping', icon: <i className="hn hn-notebook" /> },
];

export default function SettingsSidebar({ activeSection, setActiveSection }: SettingsSidebarProps) {
  return (
    <Sidebar>
      <SidebarTitle>Settings</SidebarTitle>
      <SidebarNav>
        {sections.map(({ key, label, shortLabel, icon }) => (
          <SidebarItem
            key={key}
            data-testid={`settings-section-${key}`}
            $active={activeSection === key}
            onClick={() => setActiveSection(key)}
          >
            {icon}
            <FullLabel>{label}</FullLabel>
            <ShortLabel>{shortLabel ?? label}</ShortLabel>
          </SidebarItem>
        ))}
      </SidebarNav>
    </Sidebar>
  );
}

const FullLabel = styled.span`
  @media (max-width: ${breakpoint.md}) {
    display: none;
  }
`;

const ShortLabel = styled.span`
  display: none;

  @media (max-width: ${breakpoint.md}) {
    display: inline;
  }
`;
