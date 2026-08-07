import { Sidebar, SidebarItem, SidebarNav, SidebarTitle } from '@/components/layout/SidebarLayout';

export type SettingsSection = 'email' | 'password' | 'shipping';

interface SettingsSidebarProps {
  activeSection: SettingsSection;
  setActiveSection: (section: SettingsSection) => void;
}

const sections: { key: SettingsSection; label: string; icon: React.ReactNode }[] = [
  { key: 'email', label: 'Email Address', icon: <i className="hn hn-envelope" /> },
  { key: 'password', label: 'Password', icon: <i className="hn hn-unlock" /> },
  { key: 'shipping', label: 'Shipping Address', icon: <i className="hn hn-notebook" /> },
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
