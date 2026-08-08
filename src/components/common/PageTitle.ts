import styled from 'styled-components';

export const PageTitle = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${({ theme }) => theme.text.primary};
  margin: 0;

  @media (max-width: 640px) {
    font-size: 1.5rem;
  }
`;
