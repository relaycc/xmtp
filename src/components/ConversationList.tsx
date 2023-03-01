import { motion } from "framer-motion";
import styled from "styled-components";
import Image from "next/image";
import { usePreviews, Conversation, useXmtp } from "@relaycc/xmtp-hooks";
import { getNumberArray } from "@/lib/getNumberArray";
import { getDisplayDate } from "@/lib/getDisplayDate";
import { FunctionComponent, useCallback, useEffect, useState } from "react";
import { getConversationKey } from "@/lib/getConversationKey";
import { truncateAddress } from "@/lib/truncateAddress";
import {
  textXsMedium,
  textMdRegular,
  spaceMonoMdBold,
  textLgBlack,
} from "@/lib/typography";
import { noScrollbars, card } from "@/lib/styles";
import { useAuth } from "@/hooks/useAuth";
import * as Icon from "@/components/Icon";
import { ROBOTS } from "@/lib/robots";
import { Avatar } from "./Avatar";

const TWENTY = getNumberArray(20);

export const ConversationList: FunctionComponent<{
  activeConversation: Conversation | null;
  onClickConversation: (conversation: Conversation) => unknown;
  onClickAvatar: (address: string) => unknown;
  onClickRelay: () => unknown;
}> = ({
  activeConversation,
  onClickConversation,
  onClickAvatar,
  onClickRelay,
}) => {
  const { address, disconnect, isBurner } = useAuth();

  const { previews, isPreviewsSuccess, isPreviewsPending } = usePreviews({
    clientAddress: address,
  });

  const { sendMessage } = useXmtp({ clientAddress: address });

  const isActiveConversation = useCallback(
    (conversation: Conversation) => {
      if (activeConversation === null) {
        return false;
      } else {
        return (
          getConversationKey(activeConversation) ===
          getConversationKey(conversation)
        );
      }
    },
    [activeConversation]
  );

  useEffect(() => {
    if (!isPreviewsSuccess || !isBurner || sendMessage === null) {
      return;
    } else {
      Object.values(ROBOTS).forEach(({ peerAddress, display }) => {
        sendMessage({
          conversation: { peerAddress },
          content: `Hi, I'd like to learn more about ${display}`,
        });
      });
    }
  }, [isBurner, isPreviewsSuccess, sendMessage]);

  const whenIsPending = !isBurner && isPreviewsPending;
  const whenIsWaitingForDemoConversations = (() => {
    if (!isBurner) {
      return false;
    } else {
      return (previews || []).length < 1;
    }
  })();
  const whenIsSuccess = isPreviewsSuccess && !whenIsWaitingForDemoConversations;
  const whenIsNoConversations = (() => {
    if (!whenIsSuccess || !isBurner) {
      return false;
    } else {
      if (previews === undefined || previews === null) {
        return true;
      } else if (previews.length === 0) {
        return true;
      } else {
        return false;
      }
    }
  })();

  return (
    <styles.Root>
      <NewConversation onSubmit={(v) => console.log(v)} />
      {whenIsWaitingForDemoConversations && (
        <styles.NoConversations>
          <styles.PendingSpinner />
          Initializing Relay Robots...
        </styles.NoConversations>
      )}
      {whenIsPending && (
        <styles.Pending>
          <styles.PendingSpinner />
          Loading Conversations...
        </styles.Pending>
      )}
      {whenIsNoConversations && (
        <styles.NoConversations>NoConversations Found</styles.NoConversations>
      )}
      {whenIsSuccess && (
        <>
          <styles.List initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {(previews || []).map((preview, i) => {
              return (
                <styles.Item.Root
                  isActive={isActiveConversation(preview)}
                  key={preview.peerAddress + i}
                  onClick={() => onClickConversation(preview)}
                >
                  <styles.Item.Info>
                    <styles.Item.Headline>
                      <styles.Item.PeerAddress
                        onClick={(e) => {
                          e.stopPropagation();
                          onClickAvatar(preview.peerAddress);
                        }}
                      >
                        {truncateAddress(preview.peerAddress)}
                      </styles.Item.PeerAddress>
                      <styles.Item.Time>
                        {getDisplayDate(preview.preview.sent)}
                      </styles.Item.Time>
                    </styles.Item.Headline>
                    <styles.Item.Preview>
                      {`${preview.preview.content}`}
                    </styles.Item.Preview>
                  </styles.Item.Info>
                </styles.Item.Root>
              );
            })}
          </styles.List>
        </>
      )}
      <styles.GoToProfile onClick={onClickRelay}>
        <Avatar address={address || "NO ADDRESS"} size="md" />
        {truncateAddress(address || "NO ADDRESS")}
      </styles.GoToProfile>
    </styles.Root>
  );
};

/* **************************************************************************
 *
 *
 *
 *
 *
 *
 * NEW CONVERSATION
 *
 *
 *
 *
 *
 * *************************************************************************/

export const NewConversation: FunctionComponent<{
  onSubmit: (val: string) => void;
}> = ({ onSubmit }) => {
  const [newConversationInput, setNewConversationInput] = useState<
    string | null
  >(null);

  const [newConversationIsPending, setNewConversationIsPending] =
    useState<boolean>(false);

  const isSubmitReady =
    newConversationInput !== null && newConversationInput.trim().length > 0;

  const whenShowSpinner = newConversationIsPending;
  const whenShowPlus = !newConversationIsPending;

  const handleSubmit = useCallback(() => {
    if (!isSubmitReady) {
      return;
    } else {
      onSubmit(newConversationInput);
      setNewConversationInput(null);
    }
  }, [isSubmitReady, newConversationInput, onSubmit]);

  return (
    <styles.NewConversation
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
    >
      <styles.NewConversationInput
        placeholder="Enter ENS or ETH address..."
        value={newConversationInput || ""}
        onChange={(e) => setNewConversationInput(e.target.value)}
      />
      {whenShowPlus && (
        <styles.NewConversationIcon
          isActive={isSubmitReady}
          onClick={handleSubmit}
        />
      )}
      {whenShowSpinner && <styles.NewConversationSpinner />}
    </styles.NewConversation>
  );
};

/* **************************************************************************
 *
 *
 *
 *
 *
 *
 * Styles
 *
 *
 *
 *
 *
 * *************************************************************************/

const styles = (() => {
  const Root = styled(motion.ul)`
    ${card};
    width: 26rem;
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    position: relative;
  `;

  const Pending = styled.div`
    ${textLgBlack};
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    justify-content: center;
    align-items: center;
  `;

  const NoConversations = styled.div`
    ${textLgBlack};
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    justify-content: center;
    align-items: center;
    padding: ${(p) => p.theme.scale.four};
  `;

  const List = styled(motion.ul)`
    ${noScrollbars};
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    overflow: hidden;
    overflow-y: scroll;
  `;

  const Item = (() => {
    const Root = styled.li<{ isActive: boolean }>`
      display: flex;
      align-items: center;
      background-color: none;

      cursor: pointer;
      gap: ${(p) => p.theme.scale.four};
      padding: ${(p) => p.theme.scale.two} ${(p) => p.theme.scale.four};
      background-color: ${(p) =>
        p.isActive ? p.theme.colors.success[100] : "white"};
      :hover {
        background-color: ${(p) =>
          p.isActive ? p.theme.colors.success[100] : p.theme.colors.gray[100]};
      }
      border-bottom: 1px solid ${(p) => p.theme.colors.gray[200]};
    `;

    const Headline = styled.div`
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-grow: 1;
    `;

    const Info = styled.div`
      display: flex;
      flex-direction: column;
      flex-grow: 1;
    `;

    const Time = styled.time`
      ${textXsMedium};
      color: ${(p) => p.theme.colors.gray[500]};
      line-height: 1;
    `;

    const PeerAddress = styled.button`
      ${spaceMonoMdBold};
      :hover {
        text-decoration: underline;
        color: ${(p) => p.theme.colors.primary[500]};
        cursor: pointer;
      }
    `;

    const Preview = styled.p`
      ${textMdRegular};
      color: ${(p) => p.theme.colors.gray[500]};
      width: 24rem;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow-wrap: break-word;
      overflow: hidden;
      height: 3rem;

      @supports (-webkit-line-clamp: 2) {
        overflow: hidden;
        overflow-wrap: break-word;
        text-overflow: ellipsis;
        white-space: initial;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }

      ${Root}:hover & {
        color: ${(p) => p.theme.colors.gray[900]};
      }
    `;

    return {
      Root,
      Headline,
      Info,
      Time,
      PeerAddress,
      Preview,
    };
  })();

  const GoToProfile = styled.button`
    ${spaceMonoMdBold};
    display: flex;
    align-items: center;
    gap: ${(p) => p.theme.scale.four};
    padding: ${(p) => p.theme.scale.four};
    background-color: ${(p) => p.theme.colors.gray[100]};
    :hover {
      background-color: ${(p) => p.theme.colors.primary[100]};
    }
    :active {
      background-color: ${(p) => p.theme.colors.primary[200]};
    }
  `;

  const NewConversation = styled.form`
    display: flex;
    position: relative;
  `;

  const NewConversationInput = styled.input`
    ${textMdRegular};
    ${noScrollbars}
    display: flex;
    flex-grow: 1;
    padding: ${(p) => p.theme.scale.four} ${(p) => p.theme.scale.four};
    border-bottom: 1px solid ${(p) => p.theme.colors.gray[200]};
    /* background-color: ${(p) => p.theme.colors.gray[100]}; */
    :focus {
      outline: none;
      background-color: white;
      border-bottom: 1px solid ${(p) => p.theme.colors.gray[400]};
    }
  `;

  const NewConversationIcon = styled(Icon.Plus)<{ isActive: boolean }>`
    position: absolute;
    right: ${(p) => p.theme.scale.four};
    top: ${(p) => p.theme.scale.four};
    height: ${(p) => p.theme.scale.six};
    opacity: ${(p) => (p.isActive ? 1 : 0.5)};
  `;

  const NewConversationSpinner = () => {
    return (
      <motion.div
        animate={{ rotate: 360 }}
        transition={{
          repeat: Infinity,
          duration: 1,
          repeatDelay: 0,
          ease: "linear",
        }}
        style={{
          position: "absolute",
          right: "1rem",
          top: "1rem",
          padding: "0",
          margin: "0",
          height: "1.5rem",
          width: "1.5rem",
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
    );
  };

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
    NoConversations,
    Item,
    List,
    GoToProfile,
    NewConversation,
    NewConversationInput,
    NewConversationIcon,
    NewConversationSpinner,
  };
})();
