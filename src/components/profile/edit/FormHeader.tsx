import styled from 'styled-components';

import { PageTitle } from '@/components/common/PageTitle';

interface FormHeaderProps {
  title: string;
  subtitle: string;
}

export function FormHeader({ title, subtitle }: FormHeaderProps) {
  return (
    <Header>
      <PageTitle>{title}</PageTitle>
      <Subtitle>{subtitle}</Subtitle>
    </Header>
  );
}

const Header = styled.div`
  margin-bottom: 1.5rem;
`;

const Subtitle = styled.p`
  font-size: 1rem;
  color: ${(props) => props.theme.text.secondary};
  margin: 0;
`;
