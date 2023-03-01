import { Xmtp } from "@/components/Xmtp";
import { Auth } from "@/components/Auth";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { motion, useReducedMotion } from "framer-motion";
import { getNumberArray } from "@/lib/getNumberArray";
import { useAuth } from "@/hooks/useAuth";
import { create } from "zustand";
import { useIsClient } from "@/hooks/useIsClient";
import { RobotDemo } from "./RobotDemo";
import { useRouter } from "next/router";

const TWENTY = getNumberArray(20);

const BackgroundOverlay = styled(motion.div)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  z-index: -1;
`;

const AnimatedRow = styled(motion.div)`
  display: flex;
  min-height: 6rem;
  max-height: 6rem;
  background-color: ${(p) => p.theme.colors.primary["400"]};
`;

export const App = () => {
  const showRobot = useRouter().query.robot === "true";
  const { isAuthed } = useAuth();
  const isClient = useIsClient();
  const [activeApp, setActiveApp] = useState<"xmtp" | "auth" | "robot demo">(
    showRobot ? "robot demo" : "auth"
  );

  useEffect(() => {
    if (!isClient) {
      return;
    } else {
      if (!showRobot) {
        return;
      } else {
        setActiveApp("robot demo");
      }
    }
  }, [isClient, showRobot]);

  // useEffect(() => {
  //   if (isAuthed) {
  //     return;
  //   } else {
  //     setActiveApp("auth");
  //   }
  // }, [isAuthed]);

  if (activeApp === "auth") {
    return <Auth onAuthed={(app) => setActiveApp(app)} />;
  } else if (activeApp === "robot demo") {
    return <RobotDemo />;
  } else {
    return (
      <>
        <BackgroundOverlay>
          {TWENTY.map((i) => {
            return (
              <AnimatedRow
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.2 }}
                transition={{
                  repeat: Infinity,
                  delay: 0.2 * i,
                  duration: 1,
                  repeatType: "reverse",
                }}
              />
            );
          })}
        </BackgroundOverlay>
        <Xmtp />
      </>
    );
  }
};
