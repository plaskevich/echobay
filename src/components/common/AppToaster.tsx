import { Toaster } from 'react-hot-toast';
import styled, { keyframes, useTheme } from 'styled-components';

const ToastIcon = styled.i`
  font-size: ${({ theme }) => theme.fontSize.xl};
  line-height: 1;
  flex-shrink: 0;
`;

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

// Stepped rotation keeps the pixel icon on its grid instead of smearing.
const SpinnerIcon = styled(ToastIcon)`
  animation: ${spin} 1s steps(8) infinite;
`;

export function AppToaster() {
  const theme = useTheme();

  return (
    <Toaster
      position="top-right"
      containerStyle={{ top: '5.5rem' }}
      gutter={8}
      toastOptions={{
        duration: 3000,
        style: {
          borderRadius: 0,
          background: theme.background.primary,
          color: theme.text.primary,
          border: `1px solid ${theme.black.main}`,
          boxShadow: theme.shadow,
          padding: `${theme.spacing.sm} ${theme.spacing.md}`,
          fontSize: theme.fontSize.sm,
          fontWeight: theme.fontWeight.medium,
          maxWidth: '22rem',
        },
        success: {
          icon: <ToastIcon className="hn hn-check-circle-solid" style={{ color: theme.state.success }} aria-hidden />,
        },
        error: {
          icon: <ToastIcon className="hn hn-times-circle-solid" style={{ color: theme.state.error }} aria-hidden />,
        },
        loading: {
          icon: <SpinnerIcon className="hn hn-spinner-third" style={{ color: theme.primary.main }} aria-hidden />,
        },
      }}
    />
  );
}
