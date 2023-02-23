import {
  ComponentProps,
  FunctionComponent,
  useMemo,
  useState,
  useEffect,
  ReactNode,
  RefObject,
} from "react";
import styled, {
  DefaultTheme,
  ThemeProvider,
  createGlobalStyle,
  css,
} from "styled-components";
import { Wallet } from "ethers";
import { inView, InViewOptions } from "@motionone/dom";
import { AlchemyProvider } from "@ethersproject/providers";
import { useAccount, useSigner, useConnect } from "wagmi";

/* ************************************************************************** *
 *
 *
 *
 *
 *
 * PREFLIGHT
 *
 *
 *
 *
 *
 * *************************************************************************/

export const Preflight = createGlobalStyle`
  @font-face {
    font-family: 'Satoshi-Regular';
    src: url('/fonts/Satoshi-Regular.woff2') format('woff2'),
        url('/fonts/Satoshi-Regular.woff') format('woff');
        font-weight: 400;
        font-display: swap;
        font-style: normal;
  }

  @font-face {
  font-family: 'Satoshi-Medium';
  src: url('/fonts/Satoshi-Medium.woff2') format('woff2'),
       url('/fonts/Satoshi-Medium.woff') format('woff');
       font-weight: 500;
       font-display: swap;
       font-style: normal;
  }

  @font-face {
  font-family: 'Satoshi-Bold';
  src: url('/fonts/Satoshi-Bold.woff2') format('woff2'),
       url('/fonts/Satoshi-Bold.woff') format('woff');
       font-weight: 700;
       font-display: swap;
       font-style: normal;
  }

  @font-face {
  font-family: 'Satoshi-Black';
  src: url('/fonts/Satoshi-Black.woff2') format('woff2'),
       url('/fonts/Satoshi-Black.woff') format('woff');
       font-weight: 700;
       font-display: swap;
       font-style: normal;
  }

  *,
  ::before,
  ::after {
    box-sizing: border-box;
    border-width: 0; 
    border-style: solid; 
    border-color: theme('borderColor.DEFAULT', currentColor);
  }

  ::before,
  ::after {
    --tw-content: '';
  }


  html {
    line-height: 1.5;
    -webkit-text-size-adjust: 100%;
    -moz-tab-size: 4;
    tab-size: 4;
    font-family: theme('fontFamily.sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji");
    font-feature-settings: theme('fontFamily.sans[1].fontFeatureSettings', normal);
  }


  body {
    margin: 0;
    line-height: inherit;
  }

  hr {
    height: 0;
    color: inherit;
    border-top-width: 1px;
  }

  abbr:where([title]) {
    text-decoration: underline dotted;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    font-size: inherit;
    font-weight: inherit;
  }

  a {
    color: inherit;
    text-decoration: inherit;
  }

  b,
  strong {
    font-weight: bolder;
  }

  code,
  kbd,
  samp,
  pre {
    font-family: theme('fontFamily.mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace);
    font-size: 1em;
  }

  small {
    font-size: 80%;
  }

  sub,
  sup {
    font-size: 75%;
    line-height: 0;
    position: relative;
    vertical-align: baseline;
  }

  sub {
    bottom: -0.25em;
  }

  sup {
    top: -0.5em;
  }

  table {
    text-indent: 0;
    border-color: inherit;
    border-collapse: collapse;
  }

  button,
  input,
  optgroup,
  select,
  textarea {
    font-family: inherit;
    font-size: 100%;
    font-weight: inherit;
    line-height: inherit;
    color: inherit;
    margin: 0;
    padding: 0;
  }

  button,
  select {
    text-transform: none;
  }

  button,
  [type='button'],
  [type='reset'],
  [type='submit'] {
    -webkit-appearance: button;
    background-color: transparent;
    background-image: none;
  }

  :-moz-focusring {
    outline: auto;
  }

  :-moz-ui-invalid {
    box-shadow: none;
  }

  progress {
    vertical-align: baseline;
  }


  ::-webkit-inner-spin-button,
  ::-webkit-outer-spin-button {
    height: auto;
  }

  [type='search'] {
    -webkit-appearance: textfield;
    outline-offset: -2px;
  }

  ::-webkit-search-decoration {
    -webkit-appearance: none;
  }

  ::-webkit-file-upload-button {
    -webkit-appearance: button;
    font: inherit;
  }


  summary {
    display: list-item;
  }


  blockquote,
  dl,
  dd,
  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  hr,
  figure,
  p,
  pre {
    margin: 0;
  }

  fieldset {
    margin: 0;
    padding: 0;
  }

  legend {
    padding: 0;
  }

  ol,
  ul,
  menu {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  textarea {
    resize: vertical;
  }

  input::placeholder,
  textarea::placeholder {
    opacity: 1;
    color: theme('colors.gray.400', #9ca3af);
  }

  button,
  [role="button"] {
    cursor: pointer;
  }

  :disabled {
    cursor: default;
  }

  img,
  svg,
  video,
  canvas,
  audio,
  iframe,
  embed,
  object {
    display: block;
  }

  img,
  video {
    max-width: 100%;
    height: auto;
  }

  [hidden] {
    display: none;
  }
`;

/* **************************************************************************
 *
 *
 *
 *
 *
 *
 * THEME
 *
 *
 *
 *
 *
 * *************************************************************************/

export const THEME: DefaultTheme = {
  scale: {
    zero: "0rem",
    one: "0.25rem",
    two: "0.5rem",
    three: "0.75rem",
    four: "1rem",
    five: "1.25rem",
    six: "1.5rem",
    seven: "1.75rem",
    eight: "2rem",
    nine: "2.25rem",
    ten: "2.5rem",
    eleven: "2.75rem",
    twelve: "3rem",
    sixteen: "4rem",
    double: "6rem",
    triple: "9rem",
  },
  colors: {
    gray: {
      25: "#FCFCFD",
      50: "#F9FAFB",
      100: "#F2F4F7",
      200: "#EAECF0",
      300: "#D0D5DD",
      400: "#98A2B3",
      500: "#667085",
      600: "#475467",
      700: "#344054",
      800: "#1D2939",
      900: "#101828",
    },
    primary: {
      100: "#DAD8F6",
      200: "#AFABF3",
      300: "#857EEA",
      400: "#5F56DC",
      500: "#4236C7",
      600: "#2B1FAE",
      700: "#1C0F90",
      800: "#0C0171",
      900: "#0C0636",
    },
    secondary: {
      100: "#E1D3F6",
      300: "#A979E9",
      500: "#7235BF",
      700: "#450E81",
      900: "#140822",
    },
    accent: {
      100: "#D8EF00",
      300: "#A7E1E4",
      500: "#79C7C6",
      700: "#589896",
      900: "#264241",
    },
    error: {
      100: "#FEE4E2",
      200: "#FECDCA",
      300: "#FDA29B",
      400: "#F97066",
      500: "#F00438",
      600: "#D92D20",
      700: "#B42318",
      800: "#912018",
      900: "#7A271A",
    },
    warning: {
      25: "#FFFCF5",
      50: "#FFFAEB",
      100: "#FFFAEB",
      200: "#FEDF89",
      300: "#FEC84B",
      400: "#FDB022",
      500: "#F79009",
      600: "#DC6803",
      700: "#B54708",
      800: "#93370D",
      900: "#7A2E0E",
    },
    success: {
      25: "#F6FEF9",
      50: "#ECFDF3",
      100: "#D1FADF",
      200: "#A6F4C5",
      300: "#6CE9A6",
      400: "#32D583",
      500: "#12B76A",
      600: "#039855",
      700: "#027A48",
      800: "#05603A",
      900: "#054F31",
    },
  },
};

/* **************************************************************************
 *
 *
 *
 *
 *
 *
 * TYPOGRAPHY
 *
 *
 *
 *
 *
 * *************************************************************************/

const black = css`
  font-family: "Satoshi-Black";
`;

const bold = css`
  font-family: "Satoshi-Bold";
`;

const regular = css`
  font-family: "Satoshi-Regular";
`;

const medium = css`
  font-family: "Satoshi-Medium";
`;

export const spaceMonoMdSemibold = css`
  font-family: "Space Mono", monospace;
  font-size: 16px;
  line-height: 24px;
  font-weight: 400;
  font-style: normal;
  vertical-align: middle;
`;

export const spaceMonoMdBold = css`
  font-family: "Space Mono", monospace;
  font-size: 20px;
  line-height: 24px;
  font-weight: 700;
  font-style: normal;
  vertical-align: middle;
`;

export const spaceMonoSmBold = css`
  font-family: "Space Mono", monospace;
  font-size: 14px;
  line-height: 20px;
  font-weight: 900;
  font-style: normal;
  vertical-align: middle;
`;

export const spaceMonoXsRegular = css`
  font-family: "Space Mono", monospace;
  font-size: 12px;
  font-weight: 400;
  line-height: 12px;
  font-style: normal;
  vertical-align: middle;
`;

export const spaceMonoLgBlack = css`
  font-family: "Space Mono", monospace;
  font-style: normal;
  font-weight: 900;
  font-size: 24px;
  line-height: 30px;
`;

export const spaceMonoXlBlack = css`
  font-family: "Space Mono", monospace;
  font-style: normal;
  font-weight: 900;
  font-size: 32px;
  line-height: 43.2px;
`;

export const displayXsBold = css`
  font-size: 24px;
  line-height: 32px;
  vertical-align: middle;
  ${bold};
`;

export const textXxlBlack = css`
  ${black};
  font-style: normal;
  font-weight: 900;
  font-size: 40px;
  line-height: 54px;
`;

export const textXlBlack = css`
  ${black};
  font-style: normal;
  font-weight: 900;
  font-size: 32px;
  line-height: 43.2px;
`;

export const textLgBlack = css`
  ${black};
  font-style: normal;
  font-weight: 900;
  font-size: 20px;
  line-height: 30px;
`;

export const textLgSemibold = css`
  font-size: 20px;
  font-weight: 600;
  line-height: 30px;
  font-style: normal;
  vertical-align: middle;
  ${medium};
`;

export const textMdSemiBold = css`
  font-size: 16px;
  line-height: 24px;
  vertical-align: middle;
  ${medium};
`;

export const textMdRegular = css`
  font-size: 16px;
  line-height: 24px;
  vertical-align: middle;
  ${regular};
`;

export const textSmBold = css`
  font-size: 14px;
  line-height: 20px;
  vertical-align: middle;
  ${bold};
`;

export const textSmRegular = css`
  font-size: 14px;
  line-height: 20px;
  vertical-align: middle;
`;

export const textXsMedium = css`
  font-size: 12px;
  line-height: 18px;
  ${medium};
`;

export const textXsRegular = css`
  font-size: 12px;
  line-height: 18px;
  font-style: normal;
  vertical-align: middle;
  ${regular};
`;

/* **************************************************************************
 *
 *
 *
 *
 *
 *
 * THEME PROVIDER
 *
 *
 *
 *
 *
 * *************************************************************************/

export const StyledComponentsThemeProvider: FunctionComponent<{
  children: React.ReactNode;
}> = ({ children }) => {
  return <ThemeProvider theme={THEME}>{children}</ThemeProvider>;
};

/* **************************************************************************
 *
 *
 *
 *
 *
 *
 * ICONS
 *
 *
 *
 *
 *
 * *************************************************************************/
export const Xmtp = styled((props: ComponentProps<"svg">) => (
  <svg
    width="462"
    height="462"
    viewBox="0 0 462 462"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M1 231C1 103.422 104.422 0 232 0C359.495 0 458 101.5 461 230C461 271 447 305.5 412 338C382.424 365.464 332 369.5 295.003 349C268.597 333.767 248.246 301.326 231 277.5L199 326.5H130L195 229.997L132 135H203L231.5 184L259.5 135H331L266 230C266 230 297 277.5 314 296C331 314.5 362 315 382 295C403.989 273.011 408.912 255.502 409 230C409.343 131.294 330.941 52 232 52C133.141 52 53 132.141 53 231C53 329.859 133.141 410 232 410C245.674 410 258.781 408.851 271.5 406L283.5 456.5C265.401 460.558 249.778 462 232 462C104.422 462 1 358.578 1 231Z"
      fill="#010613"
    />
  </svg>
))``;

export const GitHub = styled((props: ComponentProps<"svg">) => (
  <svg
    width="41"
    height="40"
    viewBox="0 0 41 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <g clipPath="url(#clip0_1235_17330)">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M20.1509 0.408203C9.12433 0.408203 0.210449 9.38779 0.210449 20.4968C0.210449 29.3768 5.92188 36.8935 13.8451 39.5539C14.8358 39.7539 15.1986 39.1217 15.1986 38.5898C15.1986 38.1241 15.166 36.5278 15.166 34.8645C9.61902 36.0621 8.46392 32.4698 8.46392 32.4698C7.57249 30.1417 6.25167 29.5433 6.25167 29.5433C4.43616 28.3127 6.38392 28.3127 6.38392 28.3127C8.3978 28.4458 9.45453 30.3747 9.45453 30.3747C11.237 33.4343 14.1092 32.5698 15.2647 32.0376C15.4296 30.7404 15.9582 29.8425 16.5194 29.3437C12.0953 28.878 7.44065 27.1486 7.44065 19.4323C7.44065 17.2372 8.23249 15.4413 9.48718 14.0445C9.28922 13.5458 8.59576 11.4833 9.68555 8.7229C9.68555 8.7229 11.3692 8.19065 15.1656 10.7849C16.7909 10.3452 18.4671 10.1215 20.1509 10.1196C21.8345 10.1196 23.5509 10.3527 25.1358 10.7849C28.9325 8.19065 30.6162 8.7229 30.6162 8.7229C31.706 11.4833 31.0121 13.5458 30.8141 14.0445C32.1019 15.4413 32.8611 17.2372 32.8611 19.4323C32.8611 27.1486 28.2064 28.8445 23.7492 29.3437C24.4758 29.9755 25.1027 31.1727 25.1027 33.0686C25.1027 35.7625 25.07 37.9245 25.07 38.5894C25.07 39.1217 25.4333 39.7539 26.4235 39.5543C34.3468 36.8931 40.0582 29.3768 40.0582 20.4968C40.0909 9.38779 31.1443 0.408203 20.1509 0.408203Z"
        fill="black"
      />
    </g>
    <defs>
      <clipPath id="clip0_1235_17330">
        <rect
          width="40"
          height="39.1837"
          fill="white"
          transform="translate(0.210449 0.408203)"
        />
      </clipPath>
    </defs>
  </svg>
))`
  cursor: pointer;
`;

export const Discord = styled((props: ComponentProps<"svg">) => (
  <svg
    width="46"
    height="36"
    viewBox="0 0 46 36"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M38.4529 3.43124C35.5261 2.06187 32.3967 1.06668 29.1249 0.5C28.7231 1.22646 28.2537 2.20356 27.93 2.98084C24.452 2.4578 21.0061 2.4578 17.5921 2.98084C17.2685 2.20356 16.7884 1.22646 16.383 0.5C13.1077 1.06668 9.97462 2.06553 7.04784 3.43849C1.14449 12.3592 -0.455805 21.0584 0.344346 29.634C4.25976 32.5579 8.05426 34.3341 11.7847 35.4964C12.7058 34.2287 13.5273 32.8812 14.235 31.461C12.8871 30.9489 11.5962 30.3169 10.3765 29.5832C10.7001 29.3434 11.0166 29.0928 11.3224 28.8349C18.762 32.3146 26.8454 32.3146 34.1961 28.8349C34.5055 29.0928 34.822 29.3434 35.142 29.5832C33.9187 30.3205 32.6242 30.9525 31.2764 31.4647C31.9841 32.8812 32.8021 34.2324 33.7267 35.5C37.4607 34.3377 41.2588 32.5616 45.1742 29.634C46.113 19.6926 43.5703 11.0734 38.4529 3.43124ZM15.2485 24.3601C13.0152 24.3601 11.1837 22.2751 11.1837 19.7362C11.1837 17.1973 12.9761 15.1088 15.2485 15.1088C17.521 15.1088 19.3524 17.1937 19.3133 19.7362C19.3168 22.2751 17.521 24.3601 15.2485 24.3601ZM30.27 24.3601C28.0367 24.3601 26.2052 22.2751 26.2052 19.7362C26.2052 17.1973 27.9976 15.1088 30.27 15.1088C32.5424 15.1088 34.3739 17.1937 34.3348 19.7362C34.3348 22.2751 32.5424 24.3601 30.27 24.3601Z"
      fill="black"
    />
  </svg>
))`
  cursor: pointer;
`;

export const Mirror = styled((props: ComponentProps<"svg">) => (
  <svg
    width="31"
    height="40"
    viewBox="0 0 31 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M6.85726 2.94371C1.68829 7.39294 0.759399 10.9519 0.759399 26.3184V40H15.6422H30.5251V25.7232C30.5251 9.53462 29.4535 5.74574 23.8801 2.22247C18.7758 -1.00475 11.0645 -0.677196 6.85726 2.94371Z"
      fill="black"
    />
  </svg>
))`
  cursor: pointer;
`;

export const Relay = styled((props: ComponentProps<"svg">) => (
  <svg
    className={props.className}
    width="149"
    height="135"
    viewBox="0 0 149 135"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M96.3388 41.5005C103.055 42.5157 109.564 44.6017 115.615 47.6784C115.395 42.0031 114.138 31.3416 107.257 20.595C104.184 15.7954 97.8973 6.00139 85.6327 1.86247C77.063 -1.01167 69.714 0.208518 68.306 0.549036C63.5885 1.68419 59.1015 3.61754 55.0404 6.26489C42.2143 14.6481 37.8562 27.6446 36.5662 32.1686C31.4574 46.9485 31.4574 63.006 36.5662 77.7859C42.1044 90.8027 47.2113 101.278 56.7536 110.784C62.6095 108.689 68.0139 105.507 72.6804 101.407C67.6631 96.7901 56.6111 85.2976 52.8756 67.2218C52.4117 64.9679 49.3191 49.0689 55.4351 34.9698C59.0974 26.542 66.894 16.7723 77.2461 18.6654C90.6419 21.1139 95.9482 40.037 96.3388 41.5005Z"
      fill="#101828"
    />
    <path
      d="M148.734 92.9715C149.174 98.3557 148.591 103.774 147.017 108.943C143.542 118.133 136.608 123.574 132.632 126.168C125.911 129.862 118.5 132.143 110.858 132.869C95.3664 134.296 83.5168 128.815 78.6541 126.188C84.6591 122.831 90.0934 118.548 94.756 113.5C99.8239 114.594 105.028 114.926 110.195 114.485C119.509 113.674 128.445 109.62 130.585 99.6967C130.894 97.0383 130.785 94.3482 130.264 91.7229C128.925 85.0909 124.84 79.4683 119.773 75.1024C115.017 71.008 109.446 67.8988 103.688 65.43C99.1426 63.4802 94.4223 61.8181 89.5026 61.1289C84.6521 60.4479 79.6185 60.3182 74.7233 60.2939C73.7032 60.2939 72.6846 60.2939 71.6673 60.2939C65.8247 60.4086 59.9929 60.843 54.1982 61.5951C53.5941 55.5 53.8324 49.3512 54.9062 43.3206C91.5291 37.9534 124.954 47.9379 140.36 71.2553C143.611 76.2091 147.074 83.2708 148.734 92.9715Z"
      fill="#101828"
    />
    <path
      d="M87.4518 116.569C105.739 100.876 111.607 81.1101 113.495 73.6227C108.311 70.2391 102.763 67.4461 96.9534 65.2962C95.5821 71.6566 89.8038 94.7633 68.6235 107.735C63.3464 110.937 57.5828 113.264 51.5573 114.627C45.1568 115.795 38.5965 115.795 32.196 114.627C24.497 112.328 21.555 107.966 20.6679 106.475C15.439 97.6536 19.3495 83.0113 32.196 72.6417C30.489 65.9453 29.7774 59.0357 30.0841 52.1336C17.6502 58.9587 7.93264 69.8138 2.54364 82.8978C1.64028 85.6017 -3.39741 101.44 5.27408 116.029C10.5274 123.351 16.2365 127.287 20.4278 129.48C39.3293 139.383 65.535 134.203 87.4518 116.569Z"
      fill="#101828"
    />
  </svg>
))`
  cursor: pointer;
`;

export const Twitter = styled((props: ComponentProps<"svg">) => (
  <svg
    width="43"
    height="36"
    viewBox="0 0 43 36"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <g clipPath="url(#clip0_1235_17332)">
      <path
        d="M38.2899 9.29966C38.3157 9.67197 38.3157 10.0443 38.3157 10.42C38.3157 21.8687 29.6 35.0726 13.663 35.0726V35.0658C8.95522 35.0726 4.34518 33.7241 0.381958 31.1815C1.06651 31.2638 1.7545 31.305 2.44421 31.3067C6.34567 31.3101 10.1356 30.0011 13.205 27.5905C9.49737 27.5202 6.24616 25.1028 5.11038 21.5736C6.40915 21.8241 7.74738 21.7727 9.02213 21.4244C4.97998 20.6077 2.0719 17.0563 2.0719 12.9318V12.822C3.27631 13.4928 4.62484 13.8651 6.00425 13.9063C2.19715 11.3619 1.02362 6.29722 3.32264 2.33743C7.72164 7.7504 14.2121 11.0411 21.1794 11.3894C20.4812 8.38006 21.4351 5.22664 23.6861 3.1112C27.1758 -0.169182 32.6642 -0.00104505 35.9446 3.48694C37.885 3.10434 39.7448 2.39233 41.4468 1.38351C40.8 3.38914 39.4463 5.09281 37.638 6.17541C39.3554 5.97296 41.0333 5.51315 42.6135 4.81144C41.4502 6.55457 39.985 8.07295 38.2899 9.29966Z"
        fill="black"
      />
    </g>
    <defs>
      <clipPath id="clip0_1235_17332">
        <rect
          width="42.5489"
          height="34.9999"
          fill="white"
          transform="translate(0.210449 0.5)"
        />
      </clipPath>
    </defs>
  </svg>
))`
  cursor: pointer;
`;

export const Logout = styled((props: ComponentProps<"svg">) => (
  <svg
    width="40"
    height="40"
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <rect width="40" height="40" rx="20" fill="#DAD8F6" />
    <path
      d="M17 29H13C12.4696 29 11.9609 28.7893 11.5858 28.4142C11.2107 28.0391 11 27.5304 11 27V13C11 12.4696 11.2107 11.9609 11.5858 11.5858C11.9609 11.2107 12.4696 11 13 11H17M24 25L29 20M29 20L24 15M29 20H17"
      stroke="#000000"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
))`
  cursor: pointer;
  :hover {
    rect {
      transition: fill 150ms ease-out;
      fill: #000000;
    }
  }
  :active {
    rect {
      transition: fill 150ms ease-out;
      fill: #000000;
    }
  }
`;

export const Link = styled((props: ComponentProps<"svg">) => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M26 21V27C26 27.5304 25.7893 28.0391 25.4142 28.4142C25.0391 28.7893 24.5304 29 24 29H13C12.4696 29 11.9609 28.7893 11.5858 28.4142C11.2107 28.0391 11 27.5304 11 27V16C11 15.4696 11.2107 14.9609 11.5858 14.5858C11.9609 14.2107 12.4696 14 13 14H19M23 11H29M29 11V17M29 11L18 22"
      stroke="#101828"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
))`
  cursor: pointer;
  rect {
    :hover {
      transition: fill 150ms ease-out;
      fill: #eaecf0;
    }
    :active {
      transition: fill 150ms ease-out;
      fill: #d0d5dd;
    }
  }
`;

/* **************************************************************************
 *
 *
 *
 *
 *
 *
 * ALCHEMY
 *
 *
 *
 *
 *
 * *************************************************************************/

export const ALCHEMY = new AlchemyProvider(
  "homestead",
  "kmMb00nhQ0SWModX6lJLjXy_pVtiQnjx"
);

/* **************************************************************************
 *
 *
 *
 *
 *
 *
 * VERCEL
 *
 *
 *
 *
 *
 * *************************************************************************/

const VERCEL_URL = process.env.NEXT_PUBLIC_VERCEL_URL;
const VERCEL_ENV = process.env.NEXT_PUBLIC_VERCEL_ENV;

export const IS_PRODUCTION_DEPLOYMENT = VERCEL_ENV === "production";

export const DOMAIN = (() => {
  if (typeof VERCEL_URL !== "string" && IS_PRODUCTION_DEPLOYMENT) {
    throw new Error(
      "VERCEL_URL is not defined but IS_PRODUCTION_DEPLOYMENT is true"
    );
  } else {
    if (typeof VERCEL_URL !== "string") {
      return "localhost:3000";
    } else {
      return "xmtp.relay.cc";
    }
  }
})();

/* **************************************************************************
 *
 *
 *
 *
 *
 *
 * HOOKS
 *
 *
 *
 *
 *
 * *************************************************************************/

export const useWhen = (when: boolean) => {
  const isClient = useIsClient();
  const shouldRenderChildren = when && isClient;
  return useMemo(() => {
    if (!shouldRenderChildren) {
      const component: FunctionComponent<{
        children: ReactNode;
      }> = ({ children }) => {
        return null;
      };
      return component;
    } else {
      const component: FunctionComponent<{
        children: ReactNode;
      }> = ({ children }) => {
        return <>{children}</>;
      };
      return component;
    }
  }, [shouldRenderChildren]);
};

interface UseInViewOpts extends Omit<InViewOptions, "root" | "amount"> {
  root?: RefObject<Element>;
  once?: boolean;
  amount?: "some" | "all" | number;
}

export const useInView = (
  ref: RefObject<Element>,
  { root, margin, amount, once = false }: UseInViewOpts = {}
) => {
  const [isInView, setInView] = useState(false);

  useEffect(() => {
    if (!ref.current || (once && isInView)) return;

    const onEnter = () => {
      setInView(true);

      return once ? undefined : () => setInView(false);
    };

    const options: InViewOptions = {
      root: (root && root.current) || undefined,
      margin,
      amount: amount === "some" ? "any" : amount,
    };

    return inView(ref.current, onEnter, options);
  }, [root, ref, margin, once, amount]);

  return isInView;
};

export const useIsClient = () => {
  const [isClient, setIsClient] = useState<boolean>(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient;
};

export const useWallet = ({ override }: { override?: Wallet | null }) => {
  const { connect, connectors } = useConnect();
  const { isConnected: isWagmiConnected, address } = useAccount();
  const { data: signer } = useSigner();

  const maybeOverrideConnect = (() => {
    if (override === null || override === undefined) {
      return connect;
    } else {
      return () => null;
    }
  })();

  const maybeOverrideAddress = (() => {
    if (override === null || override === undefined) {
      return address;
    } else {
      return override.address;
    }
  })();

  const maybeOverrideSigner = (() => {
    if (override === null || override === undefined) {
      return signer;
    } else {
      return override;
    }
  })();

  // isConnected = true when override is provided corresponds to autConnect:
  // true in the wagmi library. If we want to support autConnect: false, then we
  // need to use state to track the connection status.
  const maybeOverrideIsConnected = (() => {
    if (override === null || override === undefined) {
      return isWagmiConnected;
    } else {
      return true;
    }
  })();

  return {
    address: maybeOverrideAddress,
    signer: maybeOverrideSigner,
    isConnected: maybeOverrideIsConnected,
    connect: maybeOverrideConnect,
    connectors,
  };
};
