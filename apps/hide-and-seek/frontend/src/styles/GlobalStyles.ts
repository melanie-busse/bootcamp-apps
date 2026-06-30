import { createGlobalStyle, keyframes } from "styled-components";

const blink = keyframes`
  0% { opacity: 1; }
  50% { opacity: 0.4; }
  100% { opacity: 1; }
`;

export const GlobalStyles = createGlobalStyle`

  :root {
    --color-floor: #ffffff;
    --color-wall: #444444;      
    --color-ice: #9adeff;
    --color-sand: #fff59d;
    --color-portal: #a855f7;

    --color-seeker: #f44336;
    --color-hider: #4caf50;
    --color-text: #ffffff;       

    --color-button-bg: #2196f3;
    --color-button-text: #ffffff;
    --color-button-bg-hover: #1976d2;
  }
  
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    margin: 0;
    padding: 0;
    background-color: #1e293b;  
    color: var(--color-text);     
    font-family: sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  .radar-blink {
    animation: ${blink} 1s infinite ease-in-out;
  }
`;
