import styled from 'styled-components';

interface FormHeaderProps {
  title: string;
  subtitle: string;
}

export function FormHeader({ title, subtitle }: FormHeaderProps) {
  return (
    <Header>
      <Title>{title}</Title>
      <Subtitle>{subtitle}</Subtitle>
    </Header>
  );
}

const Header = styled.div`
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: ${(props) => props.theme.text.primary};
  margin: 0 0 0.5rem 0;
`;

const Subtitle = styled.p`
  font-size: 1rem;
  color: ${(props) => props.theme.text.secondary};
  margin: 0;
`;
