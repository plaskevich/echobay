import { Fragment } from 'react';
import styled from 'styled-components';

import type { CheckoutStep } from '@/store/checkout-store';

interface CheckoutProgressBarProps {
  currentStep: CheckoutStep;
}

const STEPS: { step: CheckoutStep; label: string }[] = [
  { step: 'shipping', label: 'Shipping' },
  { step: 'payment', label: 'Payment' },
  { step: 'summary', label: 'Summary' },
];

export function CheckoutProgressBar({ currentStep }: CheckoutProgressBarProps) {
  const currentIndex = STEPS.findIndex((s) => s.step === currentStep);

  return (
    <ProgressBar data-testid="checkout-progress-bar">
      {STEPS.map(({ step, label }, i) => (
        <Fragment key={step}>
          {i > 0 && <Arrow className="hn hn-angle-right" aria-hidden />}
          <Step $done={i < currentIndex} $active={i === currentIndex} data-testid={`checkout-step-${step}`}>
            {i < currentIndex ? <i className="hn hn-check" aria-hidden /> : `${i + 1}.`} {label}
          </Step>
        </Fragment>
      ))}
    </ProgressBar>
  );
}

const ProgressBar = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.75rem;
`;

const Arrow = styled.i`
  flex-shrink: 0;
  font-size: 1rem;
  line-height: 1;
  color: ${({ theme }) => theme.text.secondary};

  @media (max-width: 768px) {
    font-size: 0.875rem;
  }
`;

const Step = styled.div<{ $done: boolean; $active: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  flex: 1;
  padding: 0.625rem 0.875rem;
  font-size: 0.875rem;
  font-weight: ${({ $active }) => ($active ? 700 : 600)};
  border: 1px solid
    ${({ theme, $done, $active }) => ($active ? theme.black.main : $done ? theme.black.light : theme.border.primary)};
  background-color: ${({ theme, $done, $active }) =>
    $active ? theme.black.main : $done ? theme.black.light : 'transparent'};
  color: ${({ theme, $done, $active }) => ($active || $done ? theme.text.inverse : theme.text.secondary)};
  opacity: ${({ $done }) => ($done ? 0.75 : 1)};
  transition:
    background-color ${({ theme }) => theme.transition.base},
    border-color ${({ theme }) => theme.transition.base},
    color ${({ theme }) => theme.transition.base};

  @media (max-width: 768px) {
    padding: 0.5rem 0.625rem;
    font-size: 0.75rem;
  }
`;
