import { useState, useMemo, FunctionComponent, useCallback } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { useEffect } from "react";
import * as Layout from "@/components/Layout";
import {
  spaceMonoMdBold,
  spaceMonoLgBlack,
  textMdSemiBold,
  textMdRegular,
  textLgBlack,
  textXsMedium,
} from "@/lib/typography";
import { useIsClient } from "@/hooks/useIsClient";
import { EnableXmtp } from "./EnableXmtp";
import { Wallet } from "ethers";
import { getNumberArray } from "@/lib/getNumberArray";
import Image from "next/image";
import * as Icon from "@/components/Icon";
import { useAuth } from "@/hooks/useAuth";
import { card, FADE_IN_ANIMATION, noScrollbars } from "@/lib/styles";
import { truncateAddress } from "@/lib/truncateAddress";
import { Conversation, useConversation } from "@relaycc/xmtp-hooks";
import * as Robots from "@/components/Robots";
import { ROBOTS } from "@/lib/robots";

const TWENTY = getNumberArray(20);

export const RobotDemo: FunctionComponent = () => {
  /* ************************************************************************
   * STYLES
   * ************************************************************************/

  const { BackgroundOverlay, AnimatedRow, Modal } = Styles;

  /* ************************************************************************
   * HELPERS
   * ************************************************************************/

  const isClient = useIsClient();

  const { setBurner, isConnected } = useAuth();

  useEffect(() => {
    const wallet = Wallet.createRandom();
    setBurner(wallet);
  }, [setBurner]);

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
          {showRobotDemo && <Demo />}
          {showAuth && (
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
                <Modal.Column.Left>
                  <EnableXmtp
                    onXmtpEnabled={() => setActiveScreen("ROBOT DEMO")}
                  />
                </Modal.Column.Left>
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
          )}
        </Modal.Root>
      </Modal.Overlay>
    </Layout.Page>
  );
};

const Demo = () => {
  const [activeConversation, setActiveConversation] = useState<{
    peerAddress: string;
  }>(ROBOTS.xmtp);

  return (
    <DemoRoot>
      <DemoList>
        {Object.values(ROBOTS).map(({ peerAddress, display }) => {
          return (
            <DemoItem
              isActive={activeConversation.peerAddress === peerAddress}
              key={peerAddress}
              onClick={() => setActiveConversation({ peerAddress })}
            >
              {(() => {
                switch (display) {
                  case "XMTP":
                    return <Robots.Xmtp />;
                  case "Sushi":
                    return <Robots.SushiSwap />;
                  case "Lit Protocol":
                    return <Robots.Lit />;
                  case "ENS":
                    return <Robots.Ens />;
                  case "Uniswap":
                    return <Robots.Uniswap />;
                  case "Gitcoin":
                    return <Robots.Gitcoin />;
                  case "MetaMask":
                    return <Robots.Metamask />;
                  case "OpenSea":
                    return <Robots.OpenSea />;
                  case "POAP":
                    return <Robots.Poap />;
                  case "Lens":
                    return <Robots.Lens />;
                  case "Alchemy":
                    return <Robots.Alchemy />;
                  case "Sound":
                    return <Robots.Sound />;
                  case "WalletConnect":
                    return <Robots.WalletConnect />;
                  case "Maker DAO":
                    return <Robots.MakerDao />;
                }
              })()}
            </DemoItem>
          );
        })}
      </DemoList>
      <DemoConvo conversation={activeConversation} />
    </DemoRoot>
  );
};

const DemoConvo: FunctionComponent<{ conversation: Conversation }> = ({
  conversation,
}) => {
  const { address } = useAuth();
  const { send, messages, isSending, isMessagesSuccess } = useConversation({
    clientAddress: address,
    conversation,
  });

  const [sendMessageInput, setSendMessageInput] = useState<string | null>(null);

  const isSendReady =
    sendMessageInput !== null &&
    sendMessageInput.trim().length > 0 &&
    send !== null;

  const handleSubmit = useCallback(async () => {
    if (!isSendReady) {
      return;
    } else {
      await send({ content: sendMessageInput });
      setSendMessageInput(null);
    }
  }, [isSendReady, send, sendMessageInput]);

  const hasMessages = (() => {
    return messages !== null && messages !== undefined && messages.length > 0;
  })();
  const notHasMessages = !hasMessages;

  const activeRobot = Object.values(ROBOTS).find(
    (robot) => robot.peerAddress === conversation.peerAddress
  );

  return (
    <DemoConvoRoot>
      {notHasMessages && (
        <DemoNoMessages>
          Ask the Relay Robot a question about{" "}
          <ActiveRobot>{activeRobot?.display}!</ActiveRobot>
        </DemoNoMessages>
      )}
      {hasMessages && (
        <DemoMessages>
          {(messages || []).map((message) => {
            return (
              <Message.Root
                initial={{ maxHeight: 0, opacity: 0 }}
                animate={{ maxHeight: "20rem", opacity: 1 }}
                transition={{ duration: 0.2 }}
                key={message.id}
              >
                <Message.Header.Root>
                  <Message.Header.Address>
                    {message.senderAddress === conversation.peerAddress
                      ? message.senderAddress
                      : "You"}
                  </Message.Header.Address>
                  <Message.Header.Time>
                    {`${new Date(message.sent).toLocaleDateString()} ${new Date(
                      message.sent
                    ).toLocaleTimeString()}`}
                  </Message.Header.Time>
                </Message.Header.Root>
                <Message.Content>{`${message.content}`}</Message.Content>
              </Message.Root>
            );
          })}
        </DemoMessages>
      )}
      <DemoInputRoot
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <DemoInput
          placeholder="Enter text to send a message..."
          value={sendMessageInput || ""}
          onChange={(e) => {
            setSendMessageInput(e.target.value);
          }}
        />
        {isSending && (
          <DemoInputIcon
            animate={{ rotate: 360 }}
            transition={{
              repeat: Infinity,
              duration: 1,
              repeatDelay: 0,
              ease: "linear",
            }}
          >
            <Image
              style={{ height: "2rem", width: "2rem" }}
              src="/loader-black.png"
              alt="loader"
              width={32}
              height={32}
            />
          </DemoInputIcon>
        )}
        {!isSending && (
          <DemoInputIcon>
            <Image
              style={{
                height: "1.5rem",
                width: "1.5rem",
                opacity: isSendReady ? 1 : 0.5,
              }}
              src="/arrow-up.svg"
              alt="send"
              width={32}
              height={32}
            />
          </DemoInputIcon>
        )}
      </DemoInputRoot>
    </DemoConvoRoot>
  );
};

const DemoRoot = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  overflow: hidden;
`;

const DemoList = styled.div`
  ${noScrollbars};
  display: flex;
  flex-direction: row;
  flex: 0 0 5rem;
  justify-content: space-around;
  overflow: hidden;
  overflow-x: scroll;
  padding: 1rem;
  gap: ${(p) => p.theme.scale.two};
`;

const DemoItem = styled.button<{ isActive: boolean }>`
  ${spaceMonoMdBold};
  height: 3rem;
  width: 3rem;
  border-radius: 50%;
  transform: ${(p) => (p.isActive ? "scale(1.15)" : "scale(1)")};
  :hover {
    transform: ${(p) => (p.isActive ? "scale(1.2)" : "scale(1.05)")};
  }
`;

const DemoNoMessages = styled.div`
  ${textLgBlack};
  ${noScrollbars};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex-grow: 1;
  overflow: hidden;
  padding: ${(p) => p.theme.scale.sixteen};
  text-align: center;
`;

const ActiveRobot = styled.span`
  ${textLgBlack}
  color: ${(p) => p.theme.colors.primary[500]};
`;

const DemoMessages = styled.ol`
  ${noScrollbars};
  display: flex;
  flex-direction: column-reverse;
  flex-grow: 1;
  overflow: hidden;
  overflow-y: scroll;
`;

const DemoConvoRoot = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  overflow: hidden;
`;

const DemoInputRoot = styled.form`
  display: flex;
  flex-direction: row;
  margin-top: auto;
  flex: 0 0 4rem;
  position: relative;
`;

const DemoInput = styled.input`
  ${textMdRegular};
  ${noScrollbars}
  display: flex;
  flex-grow: 1;
  border-top: 1px solid ${(p) => p.theme.colors.gray[200]};
  padding-left: ${(p) => p.theme.scale.eight};
  :focus {
    outline: none;
    background-color: white;
    border-top: 1px solid ${(p) => p.theme.colors.gray[400]};
  }
`;

const DemoInputIcon = styled(motion.div)`
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 2rem;
  height: 2rem;
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
`;

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

export const Message = {
  Root: styled(motion.li)`
    ${noScrollbars};
    border-radius: 4px;
    padding: ${(p) => p.theme.scale.two} ${(p) => p.theme.scale.four};
    :hover {
      background-color: ${(p) => p.theme.colors.gray[100]};
    }
  `,

  Header: {
    Root: styled.div`
      display: flex;
      justify-content: space-between;
      align-items: center;
    `,

    Address: styled.h1`
      ${spaceMonoMdBold};
    `,

    Time: styled.h2`
      ${textXsMedium};
      color: ${(p) => p.theme.colors.gray[500]};
    `,
  },

  Content: styled.p`
    ${textMdRegular};
    overflow-wrap: break-word;
  `,
};
