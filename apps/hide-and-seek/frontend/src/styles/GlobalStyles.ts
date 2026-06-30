import { createGlobalStyle, keyframes } from "styled-components";

const blink = keyframes`
  0% { opacity: 1; }
  50% { opacity: 0.4; }
  100% { opacity: 1; }
`;

export const GlobalStyles = createGlobalStyle`
  /* 1. Die globalen Farben (CSS-Variablen) */
  :root {
    --color-floor: #fafafa;
    --color-wall: #555555;
    --color-portal: #a855f7;
    --color-ice: #a5f3fc;
    --color-sand: #fef08a;
    --color-seeker: #f44336;
    --color-hider: #4caf50;
    --color-radar: #a855f7;
    --color-h3: #ff9800;

    /* Allgemeine UI-Farben */
    --color-bg-main: #f0f2f5;
    --color-text: #333333;

    --color-button-bg: #2196f3;
    --color-button-bg-hover: #1976d2;
    --color-button-text: #ffffff;
  }

  /* 2. Basis-Styles */
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background-color: var(--color-bg-main);
    color: var(--color-text);
    line-height: 1.5;
  }

  .radar-blink {
    animation: ${blink} 1s infinite ease-in-out;
  }
`;
