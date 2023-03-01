import styled from "styled-components";
import { motion } from "framer-motion";
import {
  spaceMonoLgBlack,
  spaceMonoXlBlack,
  textLgBlack,
  textXlBlack,
} from "@/lib/typography";
import { FunctionComponent, ReactNode } from "react";
import Image from "next/image";

export const Base = styled(motion.button)`
  ${textLgBlack}
  color: white;
  background-color: black;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: ${(p) => p.theme.scale.two} ${(p) => p.theme.scale.six};
  min-height: 3rem;
  border-radius: ${(p) => p.theme.scale.eight};
  width: 20rem;
  :hover {
    opacity: 0.7;
  }

  :disabled {
    opacity: 0.5;
    background-color: white;
    color: black;
  }
`;

export const Success = styled(Base)`
  background-color: white;
  color: black;
  display: flex;
  gap: ${(p) => p.theme.scale.four};
`;

const PendingRoot = styled(Base)`
  background-color: white;
  color: black;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: ${(p) => p.theme.scale.four};
`;

export const Pending: FunctionComponent<{ children: ReactNode }> = ({
  children,
}) => {
  return (
    <PendingRoot>
      <div />
      {children}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{
          repeat: Infinity,
          duration: 1,
          repeatDelay: 0,
          ease: "linear",
        }}
      >
        <Image
          style={{ height: "1.5rem", width: "1.5rem" }}
          src="/loader-black.png"
          alt="loader"
          width={24}
          height={24}
        />
      </motion.div>
    </PendingRoot>
  );
};
