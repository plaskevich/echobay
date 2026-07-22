import styled from 'styled-components';

import { Skeleton } from '@/components/common/Skeleton';

export function ChatListItemSkeleton() {
  return (
    <Row aria-hidden="true">
      <Skeleton width="40px" height="40px" radius="full" />
      <Content>
        <Skeleton width="60%" height="0.95rem" />
        <Skeleton width="85%" height="0.85rem" />
      </Content>
    </Row>
  );
}

const Row = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: 0.875rem 1.25rem;
  border-bottom: 1px solid ${({ theme }) => theme.border.primary};
`;

const Content = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;
