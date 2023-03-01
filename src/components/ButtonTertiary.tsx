import styled from "styled-components";
import { motion } from "framer-motion";
import {
  spaceMonoLgBlack,
  textLgBlack,
  textLgSemibold,
} from "@/lib/typography";

export const Base = styled(motion.button)`
  ${textLgSemibold};
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: ${(p) => p.theme.scale.four};
  transition: border 0.2s ease-in-out;
  border: 3px solid transparent;
  :disabled {
    opacity: 0.5;
    :hover {
      border: 3px solid transparent;
    }
  }

  :hover {
    background-color: ${(p) => p.theme.colors.gray["100"]};
  }
`;
