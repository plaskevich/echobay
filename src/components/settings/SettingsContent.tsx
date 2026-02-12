import EmailSettings from './EmailSettings';
import PasswordSettings from './PasswordSettings';
import type { SettingsSection } from './SettingsSidebar';
import ShippingSettings from './ShippingSettings';
import ThemeSettings from './ThemeSettings';

interface SettingsContentProps {
  activeSection: SettingsSection;
}

export default function SettingsContent({ activeSection }: SettingsContentProps) {
  switch (activeSection) {
    case 'email':
      return <EmailSettings />;
    case 'password':
      return <PasswordSettings />;
    case 'shipping':
      return <ShippingSettings />;
    case 'theme':
      return <ThemeSettings />;
  }
}
