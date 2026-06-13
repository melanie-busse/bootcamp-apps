import GlobalStyle from "../styles";
import styled from "styled-components";
import Footer from "@/components/Footer";
import Header from "@/components/Header/Header";
import Sidebar from "@/components/Sidebar";
import { SWRConfig } from "swr";
import { SessionProvider } from "next-auth/react";
import { useState } from "react";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  return (
    <>
      <GlobalStyle />
      <SWRConfig
        value={{
          fetcher: (resource, init) =>
            fetch(resource, init).then((res) => res.json()),
        }}
      >
        <SessionProvider session={session}>
          <Header
            onMenuOpen={() => setIsMenuOpen(!isMenuOpen)}
            isOpen={isMenuOpen}
          />
          <ContentWrapper>
            <Sidebar isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
            <StyledMain>
              <Component {...pageProps} />
            </StyledMain>
          </ContentWrapper>
        </SessionProvider>
        <Footer />
      </SWRConfig>
    </>
  );
}

const StyledMain = styled.main`
  position: relative;
  flex: 1;
  margin: 0;
  width: 100%;
  max-width: 1200px;
  min-height: 500px;
  padding: 3rem 2rem;
  z-index: 1;
  overflow: visible;
  background-color: #d4f5ee;
  backdrop-filter: blur(10px);
  border: 2pt solid rgba(255, 255, 255, 0.3);
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);

  @media (max-width: 768px) {
    padding: 1.5rem 1rem;
    margin: 8px auto;
    min-height: auto;
    border-radius: 20px;
  }
`;

const ContentWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  width: 100%;
  max-width: 1200px;
  margin: 10px auto 10px;

  @media (max-width: 768px) {
    flex-direction: column;
    padding: 0 8px;
    min-height: auto;
  }
`;
