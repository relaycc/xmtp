import { Conversation } from "@relaycc/xmtp-hooks";

export const getConversationKey = (conversation: Conversation) => {
  if (conversation.version === "v1") {
    return conversation.peerAddress;
  } else {
    return `${conversation.peerAddress}-${conversation.context?.conversationId}`;
  }
};
