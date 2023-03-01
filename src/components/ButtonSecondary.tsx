import styled from "styled-components";
import { textLgBlack } from "@/lib/typography";

export const Base = styled.button`
  ${textLgBlack}
  background-color: white;
  color: black;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: ${(p) => p.theme.scale.two} ${(p) => p.theme.scale.six};
  min-height: 3rem;
  border-radius: ${(p) => p.theme.scale.eight};
  width: 20rem;
  border: 3px solid black;
  :hover {
    background-color: ${(p) => p.theme.colors.primary[100]};
  }

  :disabled {
    color: ${(p) => p.theme.colors.gray[100]};
  }
`;
