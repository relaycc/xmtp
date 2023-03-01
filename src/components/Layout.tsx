import styled from "styled-components";
import { noScrollbars } from "@/lib/styles";
import { motion } from "framer-motion";

export const Page = styled(motion.div)`
  ${noScrollbars};
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  display: flex;
  background-color: transparent;
  gap: ${(p) => p.theme.scale.twelve};
  padding: ${(p) => p.theme.scale.eight};
`;

export const MainPanel = styled.div`
  ${noScrollbars};
  display: flex;
  flex-direction: column;
  overflow: hidden;
  flex: 1 1 auto;
`;

export const RightPanel = styled.div`
  ${noScrollbars};
  display: flex;
  flex-direction: column;
  overflow: hidden;
  flex: 0 0 26rem;
  max-width: 26rem;
`;

export const LeftPanel = styled.div`
  ${noScrollbars};
  display: flex;
  flex-direction: column;
  flex: 1 0 auto;
  max-width: 26rem;
  overflow: hidden;
`;
