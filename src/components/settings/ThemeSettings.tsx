import { PiMoon, PiSun } from 'react-icons/pi';
import styled from 'styled-components';

import { useThemeStore } from '@/store/theme-store';

import { Container, Description, SectionTitle } from './styles';

export default function ThemeSettings() {
  const { theme, setTheme } = useThemeStore();

  return (
    <Container>
      <SectionTitle>Theme</SectionTitle>
      <Description>Select the theme for your account</Description>

      <ThemeOptions>
        <ThemeCard $active={theme === 'light'} onClick={() => setTheme('light')}>
          <IconWrapper $active={theme === 'light'}>
            <PiSun size={28} />
          </IconWrapper>
          <ThemeLabel>Light</ThemeLabel>
        </ThemeCard>

        <ThemeCard $active={theme === 'dark'} onClick={() => setTheme('dark')}>
          <IconWrapper $active={theme === 'dark'}>
            <PiMoon size={28} />
          </IconWrapper>
          <ThemeLabel>Dark</ThemeLabel>
        </ThemeCard>
      </ThemeOptions>
    </Container>
  );
}

const ThemeOptions = styled.div`
  display: flex;
  gap: 1rem;
  max-width: 480px;

  @media (max-width: 768px) {
    max-width: none;
  }
`;

const ThemeCard = styled.button<{ $active: boolean }>`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  padding: 1.5rem 1rem;
  border: 2px solid ${({ theme, $active }) => ($active ? theme.primary.main : theme.border.primary)};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  background-color: ${({ theme, $active }) => ($active ? theme.primary.light : theme.background.primary)};
  transition: all 0.2s ease;
  font-family: inherit;
  position: relative;

  &:hover {
    border-color: ${({ theme }) => theme.primary.main};
  }
`;

const IconWrapper = styled.div<{ $active: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  background-color: ${({ theme, $active }) => ($active ? theme.primary.main : theme.background.secondary)};
  color: ${({ theme, $active }) => ($active ? '#fff' : theme.text.primary)};
`;

const ThemeLabel = styled.span`
  font-size: 1rem;
  font-weight: 600;
  color: ${({ theme }) => theme.text.primary};
`;
