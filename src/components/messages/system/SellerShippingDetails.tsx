import { Country, State } from 'country-state-city';
import styled from 'styled-components';

import type { MessageMetadata } from '@/api/messages';
import { Button, type ButtonProps } from '@/components/common/Button';

function resolveCountryName(code: string) {
  return Country.getCountryByCode(code)?.name ?? code;
}

function resolveStateName(countryCode: string, stateCode: string) {
  if (!stateCode) return '';
  return State.getStateByCodeAndCountry(stateCode, countryCode)?.name ?? stateCode;
}

interface SellerShippingDetailsProps {
  shippingAddress: NonNullable<MessageMetadata['shipping_address']>;
  orderId: string;
  orderStatus?: string;
  onConfirmShipped?: (orderId: string) => void;
  isUpdating?: boolean;
}

export function SellerShippingDetails({
  shippingAddress,
  orderId,
  orderStatus,
  onConfirmShipped,
  isUpdating,
}: SellerShippingDetailsProps) {
  const canShip = orderStatus === 'confirmed' || orderStatus === 'paid';

  return (
    <>
      <AddressBlock>
        <AddressRow>
          <AddressLabel>Name</AddressLabel>
          <AddressValue>{shippingAddress.fullName}</AddressValue>
        </AddressRow>
        <AddressRow>
          <AddressLabel>Street</AddressLabel>
          <AddressValue>
            {shippingAddress.addressLine1}
            {shippingAddress.addressLine2 && `, ${shippingAddress.addressLine2}`}
          </AddressValue>
        </AddressRow>
        <AddressRow>
          <AddressLabel>City</AddressLabel>
          <AddressValue>{shippingAddress.city}</AddressValue>
        </AddressRow>
        {shippingAddress.state && (
          <AddressRow>
            <AddressLabel>State</AddressLabel>
            <AddressValue>{resolveStateName(shippingAddress.country, shippingAddress.state)}</AddressValue>
          </AddressRow>
        )}
        <AddressRow>
          <AddressLabel>ZIP Code</AddressLabel>
          <AddressValue>{shippingAddress.postalCode}</AddressValue>
        </AddressRow>
        <AddressRow>
          <AddressLabel>Country</AddressLabel>
          <AddressValue>{resolveCountryName(shippingAddress.country)}</AddressValue>
        </AddressRow>
        {shippingAddress.phone && (
          <AddressRow>
            <AddressLabel>Phone</AddressLabel>
            <AddressValue>{shippingAddress.phone}</AddressValue>
          </AddressRow>
        )}
      </AddressBlock>
      {canShip && onConfirmShipped && (
        <ActionButton
          variant="primary"
          size="small"
          onClick={() => onConfirmShipped(orderId)}
          isLoading={isUpdating}
          data-testid="confirm-shipped-button"
        >
          {!isUpdating && <i className="hn hn-people-carry" aria-hidden />}
          Mark as Shipped
        </ActionButton>
      )}
      {orderStatus === 'shipped' && <StatusTag $variant="shipped">Shipped</StatusTag>}
      {orderStatus === 'delivered' && <StatusTag $variant="delivered">Delivered</StatusTag>}
    </>
  );
}

const AddressBlock = styled.div`
  padding: 0.625rem 0.75rem;
  background-color: ${({ theme }) => theme.background.secondary};
  border: 1px solid ${({ theme }) => theme.border.primary};
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const AddressRow = styled.div`
  display: flex;
  gap: 0.5rem;
  font-size: 0.8125rem;
  line-height: 1.5;
`;

const AddressLabel = styled.span`
  color: ${({ theme }) => theme.text.tertiary};
  flex-shrink: 0;
  min-width: 5.5rem;
`;

const AddressValue = styled.span`
  color: ${({ theme }) => theme.text.primary};
`;

export const ActionButton = styled(Button)<ButtonProps>`
  margin-top: 0.5rem;
  align-self: flex-start;
`;

export const StatusTag = styled.span<{ $variant: 'shipped' | 'delivered' }>`
  align-self: flex-start;
  font-size: 0.75rem;
  font-weight: 600;
  color: ${({ theme, $variant }) => ($variant === 'delivered' ? theme.state.success : theme.primary.main)};
`;
