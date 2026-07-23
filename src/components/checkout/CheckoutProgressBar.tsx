import styled from 'styled-components';

import type { CheckoutStep } from '@/store/checkout-store';

interface CheckoutProgressBarProps {
  currentStep: CheckoutStep;
}

export function CheckoutProgressBar({ currentStep }: CheckoutProgressBarProps) {
  return (
    <ProgressBar data-testid="checkout-progress-bar">
      <ProgressStep active={currentStep === 'shipping'} completed={currentStep !== 'shipping'}>
        <StepNumber active={currentStep === 'shipping'} completed={currentStep !== 'shipping'}>
          {currentStep !== 'shipping' ? '✓' : '1'}
        </StepNumber>
        <StepLabel data-testid="checkout-step-shipping">Shipping</StepLabel>
      </ProgressStep>
      <ProgressLine>
        <ProgressLineFill $completed={currentStep === 'summary' || currentStep === 'payment'} />
      </ProgressLine>
      <ProgressStep active={currentStep === 'payment'} completed={currentStep === 'summary'}>
        <StepNumber active={currentStep === 'payment'} completed={currentStep === 'summary'}>
          {currentStep === 'summary' ? '✓' : '2'}
        </StepNumber>
        <StepLabel data-testid="checkout-step-payment">Payment</StepLabel>
      </ProgressStep>
      <ProgressLine>
        <ProgressLineFill $completed={currentStep === 'summary'} />
      </ProgressLine>
      <ProgressStep active={currentStep === 'summary'} completed={false}>
        <StepNumber active={currentStep === 'summary'} completed={false}>
          3
        </StepNumber>
        <StepLabel data-testid="checkout-step-summary">Summary</StepLabel>
      </ProgressStep>
    </ProgressBar>
  );
}

const ProgressBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.75rem;
  padding: 0;

  @media (max-width: 768px) {
    padding: 0;
  }
`;

const ProgressStep = styled.div<{ active: boolean; completed: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  min-width: 80px;
  color: ${({ theme, active, completed }) => (active || completed ? theme.text.primary : theme.text.tertiary)};
  transition: color ${({ theme }) => theme.transition.base};
`;

const StepNumber = styled.div<{ active: boolean; completed: boolean }>`
  width: 32px;
  height: 32px;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.875rem;
  background-color: ${({ theme, active, completed }) =>
    active ? 'transparent' : completed ? theme.primary.main : theme.background.secondary};
  color: ${({ theme, active, completed }) => (completed ? '#fff' : active ? theme.primary.main : theme.text.muted)};
  border: 2px solid
    ${({ theme, active, completed }) => (active || completed ? theme.primary.main : theme.border.primary)};
  transform: ${({ active }) => (active ? 'scale(1.08)' : 'scale(1)')};
  box-shadow: ${({ theme, active }) => (active ? `0 0 0 3px ${theme.primary.light}` : '0 0 0 0 transparent')};
  transition:
    background-color ${({ theme }) => theme.transition.base},
    border-color ${({ theme }) => theme.transition.base},
    color ${({ theme }) => theme.transition.base},
    box-shadow ${({ theme }) => theme.transition.slow},
    transform ${({ theme }) => theme.transition.slow};
`;

const StepLabel = styled.div`
  font-size: 0.875rem;
  font-weight: 500;

  @media (max-width: 768px) {
    font-size: 0.75rem;
  }
`;

const ProgressLine = styled.div`
  position: relative;
  flex: 1;
  height: 2px;
  max-width: 120px;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  background-color: ${({ theme }) => theme.border.primary};
  overflow: hidden;

  @media (max-width: 768px) {
    max-width: 60px;
  }
`;

const ProgressLineFill = styled.div<{ $completed: boolean }>`
  position: absolute;
  inset: 0;
  background-color: ${({ theme }) => theme.primary.main};
  transform-origin: left center;
  transform: scaleX(${({ $completed }) => ($completed ? 1 : 0)});
  transition: transform ${({ theme }) => theme.transition.slow};
`;
