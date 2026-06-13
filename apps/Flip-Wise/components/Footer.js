import styled from "styled-components";

export default function Footer() {
  return (
    <StyledFooter>
      <p>© {new Date().getFullYear()} FlipWise — Learn smarter, flip faster - Det er sjovt at lære.</p>
      <Developers>
        Made by Melanie Busse, Hannah Capell & Ramon Isbarn
      </Developers>
    </StyledFooter>
  );
}

const Developers = styled.p`
  margin: 0.25rem 0 0;
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.75);
  font-weight: 400;
  position: relative;
  z-index: 2;
`;

const StyledFooter = styled.footer`
  flex-shrink: 0;
  padding: 1rem 0 1.5rem;
  width: 100%;
  max-width: 1200px;
  height: auto;
  z-index: 1;
  margin: 0 auto;
  overflow: visible;
  text-align: center;
  background-color: #00757f;
  backdrop-filter: blur(10px);
  border: 2pt solid rgba(255, 255, 255, 0.3);
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 80%;
    height: 2px;
    background: #3ecfb2;
    box-shadow: 0 4px 16px rgba(62, 207, 178, 0.35);
  }

  a {
    color: #fff;
    text-decoration: none;
    border-bottom: 1px solid rgba(255, 255, 255, 0.4);
    transition: all 0.3s ease;

    &hover {
      color: #d4f5ee;
      text-shadow: 0 0 8px #3ecfb2;
    }
  }

  p {
    margin: 0.5rem 0 0;
    font-size: 0.875rem;
    color: #ffffff;
    font-weight: 500;
    text-shadow:
      1px 1px 0 #00757f,
      0 0 6px rgba(62, 207, 178, 0.5);
    position: relative;
    z-index: 2;
  }

  @media (max-width: 768px) {
    padding: 1rem;
    height: auto;
    margin: 5px auto;

    p {
      font-size: 0.8rem;
      text-shadow: 0.8px 0.8px 0 #00757f;
    }
  }
`;
