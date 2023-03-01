import { css } from "styled-components";

export const noScrollbars = css`
  ::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`;

export const card = css`
  background-color: white;
  border-radius: ${(p) => p.theme.scale.eight};
  border: ${(p) => p.theme.scale.one} solid black;
  overflow: hidden;
`;

export const FADE_IN_ANIMATION = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.75 },
} as const;
