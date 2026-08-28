import styled from 'styled-components';

import { PageTitle } from '@/components/common/PageTitle';

interface FormHeaderProps {
  title: string;
  subtitle?: string;
}

export function FormHeader({ title, subtitle }: FormHeaderProps) {
  return (
    <Header>
      <PageTitle>{title}</PageTitle>
      {subtitle && <Subtitle>{subtitle}</Subtitle>}
    </Header>
  );
}

const Header = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const Subtitle = styled.p`
  font-size: ${({ theme }) => theme.fontSize.base};
  color: ${(props) => props.theme.text.secondary};
  margin: 0;
`;
