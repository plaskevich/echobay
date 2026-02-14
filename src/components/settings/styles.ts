import styled from 'styled-components';

export const Container = styled.div`
  flex: 1;
  width: 100%;
`;

export const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${({ theme }) => theme.text.primary};
  margin: 0 0 0.5rem 0;
`;

export const Description = styled.p`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.text.secondary};
  margin: 0 0 1.5rem 0;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  max-width: 480px;
  margin-top: 3rem;
  width: 100%;

  @media (max-width: 768px) {
    margin-top: 1.5rem;
    max-width: none;
  }
`;

export const ButtonRow = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 1rem;

  @media (max-width: 768px) {
    button {
      width: 100%;
    }
  }
`;

export const Message = styled.p<{ $type: 'success' | 'error' }>`
  font-size: 0.875rem;
  color: ${({ theme, $type }) => ($type === 'success' ? theme.state.success : theme.state.error)};
  margin: 0;
`;

export const FieldRow = styled.div`
  display: flex;
  gap: 1rem;

  > * {
    flex: 1;
  }

  @media (max-width: 480px) {
    flex-direction: column;
  }
`;
