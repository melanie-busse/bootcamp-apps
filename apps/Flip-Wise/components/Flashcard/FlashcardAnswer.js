import styled from "styled-components";

export default function FlashcardAnswer({ answer }) {
  return (
    <AnswerSection>
      <AnswerLabel>Answer</AnswerLabel>
      <AnswerValue>{answer}</AnswerValue>
    </AnswerSection>
  );
}

const AnswerSection = styled.div`
  margin-top: 30px;
`;

const AnswerLabel = styled.span`
  font-size: 1rem;
  color: #fff;
  font-style: italic;
  display: block;
  margin-bottom: 0.3rem;
`;

const AnswerValue = styled.p`
  font-size: 1.6rem;
  color: #fff;
  margin: 0;
  font-family: "Caveat", cursive;
`;
