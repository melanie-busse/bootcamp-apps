import styled from "styled-components";

export default function Headline({ headline }) {
  return (
    <HeadlineContainer>
      <StyledHeadline>{headline}</StyledHeadline>
    </HeadlineContainer>
  );
}

const HeadlineContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
`;

const StyledHeadline = styled.h2`
  font-size: 5rem;
  margin-top: 0;
  font-family: "Caveat", cursive;
`;
