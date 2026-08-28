import { Link } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';

import { breakpoint } from '@/lib/theme/breakpoints';

export function Logo() {
  return (
    <LogoLink to="/">
      <LogoText>EchoBay</LogoText>
    </LogoLink>
  );
}

const LogoLink = styled(Link)`
  flex-shrink: 0;
  display: flex;
  align-items: center;
`;

const flicker = keyframes`
  0%, 5%    { color: var(--logo-off)}
  6%, 9%    { color: var(--logo-on)}
  10%, 13%  { color: var(--logo-off)}
  14%, 15%  { color: var(--logo-on)}
  16%, 21%  { color: var(--logo-off)}
  22%, 62%  { color: var(--logo-on)}
  64%, 66%  { color: var(--logo-off)}
  68%, 74%  { color: var(--logo-on)}
  76%, 100% { color: var(--logo-off)}
`;

const LogoText = styled.span`
  --logo-off: ${(props) => props.theme.text.muted};
  --logo-on: ${(props) => props.theme.text.primary};
  --logo-glow: none;
  font-family: 'LEDLIGHT', 'Archivo Variable', system-ui, sans-serif;
  font-size: 2.5rem;
  line-height: 1;
  color: var(--logo-off);
  margin-top: 0.3rem;
  animation: ${flicker} 7s ease-in-out infinite;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }

  @media (max-width: ${breakpoint.sm}) {
    font-size: ${({ theme }) => theme.fontSize['3xl']};
  }
`;
