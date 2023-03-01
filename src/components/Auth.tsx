import { useState, useMemo, FunctionComponent } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { useEffect } from "react";
import * as Layout from "@/components/Layout";
import {
  spaceMonoMdBold,
  spaceMonoLgBlack,
  textMdSemiBold,
  textLgBlack,
} from "@/lib/typography";
import { useIsClient } from "@/hooks/useIsClient";
import * as ButtonPrimary from "@/components/ButtonPrimary";
import * as ButtonSecondary from "@/components/ButtonSecondary";
import { EnableXmtp } from "./EnableXmtp";
import { Wallet } from "ethers";
import { getNumberArray } from "@/lib/getNumberArray";
import Image from "next/image";
import * as Icon from "@/components/Icon";
import { useAuth } from "@/hooks/useAuth";
import { card, FADE_IN_ANIMATION } from "@/lib/styles";

const TWENTY = getNumberArray(20);

export const Auth: FunctionComponent<{
  onAuthed: (app: "xmtp" | "robot demo") => void;
}> = ({ onAuthed }) => {
  /* ************************************************************************
   * STYLES
   * ************************************************************************/

  const { BackgroundOverlay, AnimatedRow, Modal } = Styles;

  /* **************************************************************************
   * SCREENS
   * *************************************************************************/

  const [activeScreen, setActiveScreen] = useState<"AUTH" | "ROBOT DEMO">(
    "AUTH"
  );

  const showAuth = activeScreen === "AUTH";
  const showRobotDemo = activeScreen === "ROBOT DEMO";

  /* **************************************************************************
   * RENDER
   * *************************************************************************/

  return (
    <Layout.Page>
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
      <Modal.Overlay>
        <Modal.Root>
          {showAuth && (
            <AuthContent
              onClickTryRobot={() => setActiveScreen("ROBOT DEMO")}
              onAuthed={onAuthed}
            />
          )}
          {showRobotDemo && <RobotDemoContent />}
        </Modal.Root>
      </Modal.Overlay>
    </Layout.Page>
  );
};

const RobotDemoContent = () => {
  return <div>ROBOT DEMO</div>;
};

const AuthContent: FunctionComponent<{
  onAuthed: (app: "xmtp" | "robot demo") => void;
  onClickTryRobot: () => void;
}> = ({ onAuthed }) => {
  /* ************************************************************************
   * STYLES
   * ************************************************************************/

  const { Modal } = Styles;

  /* ************************************************************************
   * HELPERS
   * ************************************************************************/

  const isClient = useIsClient();

  const { setBurner, isConnected } = useAuth();

  /* ************************************************************************
   * USER FLOWS
   * ************************************************************************/

  const [activeFlow, setActiveFlow] = useState<
    { id: "MENU" } | { id: "ENABLE XMTP" }
  >(isClient && isConnected ? { id: "ENABLE XMTP" } : { id: "MENU" });

  useEffect(() => {
    if (!isConnected) {
      return;
    } else {
      setActiveFlow({ id: "ENABLE XMTP" });
    }
  }, [isConnected]);

  const showMenuFlow = activeFlow.id === "MENU";
  const showEnableXmtpFlow = isClient && activeFlow.id === "ENABLE XMTP";

  return (
    <>
      <Modal.Header.Root>
        <div />
        <Modal.Header.LearnMore>
          a FOSS XMTP client built with ❤️ by relay.cc
        </Modal.Header.LearnMore>
        <a
          href="https://github.com/relaycc/xmtp"
          target="_blank"
          rel="noreferrer"
        >
          <Icon.GitHub />
        </a>
      </Modal.Header.Root>
      <Modal.Row>
        {showMenuFlow && (
          <Modal.Column.Left>
            <ButtonSecondary.Base
              onClick={() => {
                setBurner(Wallet.createRandom());
                setActiveFlow({ id: "ENABLE XMTP" });
              }}
            >
              Launch Demo
            </ButtonSecondary.Base>
            <ButtonSecondary.Base
              onClick={() => {
                onAuthed("robot demo");
              }}
            >
              Try Relay Robot
            </ButtonSecondary.Base>
            <ButtonPrimary.Base
              onClick={() => setActiveFlow({ id: "ENABLE XMTP" })}
            >
              Sign In
            </ButtonPrimary.Base>
          </Modal.Column.Left>
        )}
        {showEnableXmtpFlow && (
          <Modal.Column.Left>
            <EnableXmtp onXmtpEnabled={() => onAuthed} />
          </Modal.Column.Left>
        )}
        <Modal.Column.Right>
          <Image
            onClick={() => null}
            src="/logomark.svg"
            width={256}
            height={256}
            alt="relay logo"
          />
          <Image
            onClick={() => null}
            src="/logotype.svg"
            width={256}
            height={256}
            alt="relay logo"
          />
        </Modal.Column.Right>
      </Modal.Row>
      <Modal.Footer.Root>
        <Modal.Footer.LearnMore
          href="https://relay.cc"
          target="_blank"
          rel="noreferrer"
        >
          relay.cc
        </Modal.Footer.LearnMore>
        <Modal.Footer.LearnMore
          href="https://discord.gg/relaycc"
          target="_blank"
          rel="noreferrer"
        >
          Discord
        </Modal.Footer.LearnMore>
        <Modal.Footer.LearnMore
          href="https://twitter.com/relay_eth"
          target="_blank"
          rel="noreferrer"
        >
          Twitter
        </Modal.Footer.LearnMore>
        <Modal.Footer.LearnMore
          href="https://lenster.xyz/u/relay"
          target="_blank"
          rel="noreferrer"
        >
          Lens
        </Modal.Footer.LearnMore>
        <Modal.Footer.LearnMore
          href="https://xmtp.com"
          target="_blank"
          rel="noreferrer"
        >
          XMTP
        </Modal.Footer.LearnMore>
      </Modal.Footer.Root>
    </>
  );
};

const Styles = (() => {
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
  `;

  const AnimatedRow = styled(motion.div)`
    display: flex;
    min-height: 6rem;
    max-height: 6rem;
    background-color: ${(p) => p.theme.colors.primary["400"]};
  `;

  const Modal = (() => {
    const Overlay = styled(motion.div)`
      display: flex;
      justify-content: center;
      align-items: center;
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
    `;
    const Root = styled(motion.div)`
      ${card};
      display: flex;
      flex-direction: column;
      height: 40rem;
      width: 60rem;
    `;

    const Row = styled(motion.div)`
      display: flex;
      flex-grow: 1;
    `;

    const Column = (() => {
      const Root = styled.div`
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        flex: 1 1 50%;
        padding: ${(p) => p.theme.scale.sixteen};
        gap: ${(p) => p.theme.scale.four};
      `;

      const Left = styled(Root)`
        border-right: 1px solid ${(p) => p.theme.colors.primary["100"]};
      `;

      const Right = styled(Root)``;

      return {
        Left,
        Right,
      };
    })();

    const Header = (() => {
      const Root = styled.div`
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: ${(p) => p.theme.scale.four};
        gap: ${(p) => p.theme.scale.four};
      `;

      const LearnMore = styled.p`
        ${spaceMonoMdBold};
      `;

      return {
        Root,
        LearnMore,
      };
    })();

    const Footer = (() => {
      const Root = styled.div`
        display: flex;
        align-items: center;
        justify-content: space-evenly;
        padding: ${(p) => p.theme.scale.two} ${(p) => p.theme.scale.six};
        min-height: 3rem;
      `;

      const Version = styled.h3`
        ${spaceMonoLgBlack};
        padding: ${(p) => p.theme.scale.two} ${(p) => p.theme.scale.four};
      `;

      const LearnMore = styled.a`
        ${textLgBlack};
        cursor: pointer;
        padding: ${(p) => p.theme.scale.two} ${(p) => p.theme.scale.four};
        :hover {
          text-decoration: underline;
        }
      `;

      return {
        Root,
        Version,
        LearnMore,
      };
    })();

    return {
      Root,
      Overlay,
      Column,
      Header,
      Footer,
      Row,
    };
  })();

  return {
    BackgroundOverlay,
    AnimatedRow,
    Modal,
  };
})();
