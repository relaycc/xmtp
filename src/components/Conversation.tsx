import { Signer } from "ethers";
import styled from "styled-components";
import {
  Conversation as TConversation,
  useConversation,
} from "@relaycc/xmtp-hooks";
import { card, noScrollbars, FADE_IN_ANIMATION } from "@/lib/styles";
import { motion } from "framer-motion";
import {
  textXlBlack,
  spaceMonoMdBold,
  textMdRegular,
  textXsMedium,
  textLgBlack,
  spaceMonoXlBlack,
  textLgSemibold,
  textMdSemiBold,
  spaceMonoLgBlack,
} from "@/lib/typography";
import { getNumberArray } from "@/lib/getNumberArray";
import { Avatar } from "@/components/Avatar";
import { useAuth } from "@/hooks/useAuth";
import Image from "next/image";

export const Conversation = ({
  activeConversation,
  onClickAvatar,
}: {
  activeConversation: TConversation | null;
  onClickAvatar: () => unknown;
}) => {
  const whenHasActiveConversation = activeConversation !== null;
  const whenHasNoActiveConversation = !whenHasActiveConversation;

  return (
    <Styles.Root>
      {whenHasActiveConversation && (
        <ActiveConversation
          conversation={activeConversation}
          onClickAvatar={onClickAvatar}
        />
      )}
      {whenHasNoActiveConversation && <NoActiveConversation />}
    </Styles.Root>
  );
};

const NoActiveConversation = () => {
  return (
    <Styles.Pending {...FADE_IN_ANIMATION}>
      <Styles.PendingSpinner />
      Loading Conversations...
    </Styles.Pending>
  );
};

const ActiveConversation = ({
  conversation,
  onClickAvatar,
}: {
  conversation: TConversation;
  onClickAvatar: () => unknown;
}) => {
  const { address } = useAuth();
  const convo = useConversation({
    clientAddress: address,
    conversation,
  });

  const whenIsMessagesIdle = convo.isMessagesIdle;
  const whenIsMessagesPending = convo.isMessagesPending;
  const whenIsMessagesSuccess = convo.isMessagesSuccess;

  return (
    <>
      {(whenIsMessagesIdle || whenIsMessagesPending) && (
        <Styles.Pending {...FADE_IN_ANIMATION}>
          Loading Messages...
        </Styles.Pending>
      )}
      {whenIsMessagesSuccess && (
        <>
          <Styles.Header>
            <Image src="/xmtp.svg" alt="at" width={24} height={24} />
            <Styles.Handles>
              <Styles.Handle
                onClick={(e) => {
                  e.stopPropagation();
                  onClickAvatar();
                }}
              >
                {conversation.peerAddress}
              </Styles.Handle>
            </Styles.Handles>
          </Styles.Header>
          <MessageList.Root
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            {(convo.messages || []).map((message) => {
              return (
                <Message.Root key={message.id}>
                  <Message.Header.Root>
                    <Message.Header.Address>
                      {message.senderAddress === conversation.peerAddress
                        ? message.senderAddress
                        : "You"}
                    </Message.Header.Address>
                    <Message.Header.Time>
                      {`${new Date(
                        message.sent
                      ).toLocaleDateString()} ${new Date(
                        message.sent
                      ).toLocaleTimeString()}`}
                    </Message.Header.Time>
                  </Message.Header.Root>
                  <Message.Content>{`${message.content}`}</Message.Content>
                </Message.Root>
              );
            })}
          </MessageList.Root>
        </>
      )}
    </>
  );
};

const Styles = (() => {
  const Pending = styled(motion.div)`
    ${noScrollbars};
    ${textXlBlack}
    display: flex;
    flex-direction: column;
    justify-content: center;
    flex-grow: 1;
    align-items: center;
  `;

  const Root = styled(motion.div)`
    ${card}
    ${noScrollbars};
    display: flex;
    flex-direction: column;
    flex-grow: 1;
  `;

  const Header = styled.div`
    ${noScrollbars};
    background-color: ${(p) => p.theme.colors.gray["100"]};
    display: flex;
    flex-direction: row;
    align-items: center;
    flex: 0 0 3rem;
    overflow: hidden;
    padding-left: ${(p) => p.theme.scale.two};
    gap: ${(p) => p.theme.scale.two};
  `;

  const Handles = styled.div`
    ${noScrollbars};
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: ${(p) => p.theme.scale.zero};
  `;

  const Subtitle = styled.h3`
    ${textMdSemiBold};
    :hover {
      cursor: pointer;
      text-decoration: underline;
    }
  `;

  const Handle = styled.button`
    ${spaceMonoLgBlack}
    :hover {
      cursor: pointer;
      text-decoration: underline;
      color: ${(p) => p.theme.colors.primary[500]};
    }
  `;

  const PendingSpinner = () => {
    return (
      <motion.div
        animate={{ rotate: 360 }}
        transition={{
          repeat: Infinity,
          duration: 1.25,
          repeatDelay: 0,
          ease: "linear",
        }}
        style={{
          padding: "0",
          margin: "1rem",
          height: "4rem",
          width: "4rem",
        }}
      >
        <Image
          style={{ height: "4rem", width: "4rem" }}
          src="/loader-black.png"
          alt="loader"
          width={24}
          height={24}
        />
      </motion.div>
    );
  };

  return {
    Root,
    Pending,
    PendingSpinner,
    Header,
    Handles,
    Subtitle,
    Handle,
  };
})();

export const MessageList = {
  Root: styled(motion.ol)`
    ${noScrollbars};
    display: flex;
    flex-direction: column-reverse;
    flex-grow: 1;
    overflow: hidden;
    overflow-y: scroll;
  `,

  Pending: {
    Overlay: styled.div`
      ${noScrollbars};
      ${textXlBlack};
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      text-align: center;
    `,

    Item: styled(motion.div)`
      display: flex;
      min-height: 92px;
      height: 92px;
      background-color: ${(p) => p.theme.colors.primary["400"]};
    `,
  },
};

export const Message = {
  Root: styled.li`
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

// No Conversation Selected
// Bad Address
// Peer Not On Network
// Loading
// Loaded, no Messages
// Loaded, Messages
