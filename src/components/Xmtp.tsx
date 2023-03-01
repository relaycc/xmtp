import { FunctionComponent, useEffect, useState } from "react";
import { useIsClient } from "@/hooks/useIsClient";
import {
  usePreviews,
  Conversation as TConversation,
} from "@relaycc/xmtp-hooks";
import styled from "styled-components";
import { useAuth } from "@/hooks/useAuth";
import * as Layout from "@/components/Layout";
import { ConversationList } from "@/components/ConversationList";
import { Conversation } from "./Conversation";
import { Wallet } from "ethers";
import { Profile } from "@/components/Profile";
import { textXlBlack } from "@/lib/typography";
import { Relay } from "@/components/Relay";
import { AnimatePresence } from "framer-motion";

export const Xmtp: FunctionComponent = () => {
  /* **************************************************************************
   * MODAL
   * *************************************************************************/

  const [showRelay, setShowRelay] = useState(false);

  /* **************************************************************************
   * AUTH
   * *************************************************************************/

  const { address } = useAuth();

  /* **************************************************************************
   * HELPERS
   * *************************************************************************/

  const isClient = useIsClient();

  /* **************************************************************************
   * PREVIEWS
   * *************************************************************************/

  const { previews, isPreviewsSuccess } = usePreviews({
    clientAddress: address,
  });

  /* **************************************************************************
   * SELECTED/ACTIVE CONVERSATION
   * *************************************************************************/

  const [selectedConversation, setSelectedConversation] =
    useState<TConversation | null>(null);

  useEffect(() => {
    if (!isPreviewsSuccess || selectedConversation !== null) {
      return;
    } else {
      setSelectedConversation((previews || [])[0] || null);
    }
  }, [isPreviewsSuccess, previews, selectedConversation]);

  /* **************************************************************************
   * SELECTED PROFILE
   * *************************************************************************/

  const [selectedProfile, setSelectedProfile] = useState<string | null>(null);

  /* **************************************************************************
   * RENDER
   * *************************************************************************/

  return (
    <Layout.Page initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <Layout.LeftPanel>
        <ConversationList
          onClickConversation={(conversation) =>
            setSelectedConversation(conversation)
          }
          onClickAvatar={(address) => setSelectedProfile(address)}
          activeConversation={selectedConversation}
          onClickRelay={() => setShowRelay(true)}
        />
      </Layout.LeftPanel>
      <Layout.MainPanel>
        <Conversation
          activeConversation={selectedConversation}
          onClickAvatar={() => {
            if (selectedConversation === null) {
              throw new Error("No active conversation");
            } else {
              setSelectedProfile(selectedConversation.peerAddress);
            }
          }}
        />
      </Layout.MainPanel>
      <Layout.RightPanel>
        <Profile address={selectedProfile} onClickX={() => null} />
      </Layout.RightPanel>
      {showRelay && <Relay onClose={() => setShowRelay(false)} />}
    </Layout.Page>
  );
};

const NoActiveConversation = styled.div`
  ${textXlBlack}
  display: flex;
  justify-content: center;
  align-items: center;
`;

// /* **************************************************************************
//  * RIGHT PANEL STATE
//  * *************************************************************************/

// const [rightPanelState, setRightPanelState] = useState<RightPanelState>({
//   id: "menu",
// });
// const whenShowProfile = rightPanelState.id === "profile";
// const whenShowMenu = rightPanelState.id === "menu";
// const whenShowClosed = rightPanelState.id === "closed";

// /* **************************************************************************
//  * LEFT PANEL STATE
//  * *************************************************************************/

// const [leftPanelState, setLeftPanelState] = useState(false);

// const WhenLeftPanelIsOpen = useWhen(leftPanelState);
// const WhenLeftPanelIsClosed = useWhen(!leftPanelState);

// <ConversationList.Root>
//   <WhenPreviewsIsPending>
//     <ConversationList.Pending.Overlay>
//       Loading Conversations...
//     </ConversationList.Pending.Overlay>
//     {ZERO_TO_NINETEEN.map((i) => {
//       return (
//         <ConversationList.Pending.Item
//           key={i}
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 0.2 }}
//           transition={{
//             repeat: Infinity,
//             delay: 0.2 * (i + 1),
//             duration: 1,
//             repeatType: "reverse",
//           }}
//         />
//       );
//     })}
//   </WhenPreviewsIsPending>
//   <WhenPreviewsIsSuccess>
//     {(previews || []).map((preview, i) => {
//       return (
//         <ConversationList.Item.Root
//           isActive={isActiveConversation(preview)}
//           key={preview.peerAddress + i}
//           onClick={() => {
//             setSelectedConversation(preview);
//           }}
//         >
//           <Avatar
//             key={preview.peerAddress}
//             address={preview.peerAddress}
//             size="md"
//           />
//           <ConversationList.Item.Info>
//             <ConversationList.Item.Headline>
//               <ConversationList.Item.PeerAddress>
//                 {truncateAddress(preview.peerAddress)}
//               </ConversationList.Item.PeerAddress>
//               <ConversationList.Item.Time>
//                 {getDisplayDate(preview.preview.sent)}
//                 {/* {`${new Date(
//                   preview.preview.sent
//                 ).toLocaleDateString()} ${new Date(
//                   preview.preview.sent
//                 ).toLocaleTimeString()}`} */}
//               </ConversationList.Item.Time>
//             </ConversationList.Item.Headline>
//             <ConversationList.Item.Preview>
//               {`${preview.preview.content}`}
//             </ConversationList.Item.Preview>
//           </ConversationList.Item.Info>
//         </ConversationList.Item.Root>
//       );
//     })}
//   </WhenPreviewsIsSuccess>
// </ConversationList.Root>

// <Layout.MainPanel>
//   {hasActiveConversation && (
//     <DirectMessage
//       conversation={(() => {
//         if (activeConversation === null) {
//           throw new Error("activeConversation is null");
//         } else {
//           return activeConversation;
//         }
//       })()}
//     />
//   )}
// </Layout.MainPanel>
// <Layout.RightPanel>
//   {whenShowClosed && (
//     <Menu.Closed.Root>
//       <Menu.Link style={{ marginTop: "auto" }}>Twitter</Menu.Link>
//       <Menu.Link>Lens</Menu.Link>
//       <Menu.Link>GitHub</Menu.Link>
//       <Menu.Link>Discord</Menu.Link>
//       <Menu.Link>Mirror</Menu.Link>
//       <Menu.Link>XMTP</Menu.Link>
//       <Menu.Link>Join</Menu.Link>
//       <Menu.Link>Info</Menu.Link>
//     </Menu.Closed.Root>
//   )}
//   {whenShowProfile && (
//     <Menu.Open.Root>
//       <Menu.Open.Header>
//         <Image
//           style={{ cursor: "pointer" }}
//           onClick={() => setRightPanelState({ id: "closed" })}
//           src="/exit.svg"
//           width={16}
//           height={16}
//           alt="close menu"
//         />
//       </Menu.Open.Header>
//       <Menu.Open.Profile.Root>
//         <Menu.Open.Profile.Avatar>
//           <Avatar
//             address={activeConversation?.peerAddress || ""}
//             size="xxxl"
//           />
//         </Menu.Open.Profile.Avatar>
//         <Menu.Open.Profile.Address>
//           {truncateAddress(activeConversation?.peerAddress || "")}
//         </Menu.Open.Profile.Address>
//         <Menu.Link>- View on ENS -</Menu.Link>
//         <Menu.Link>- View on Lenster -</Menu.Link>
//         <Menu.Link>- View on Galxe -</Menu.Link>
//         <Menu.Link>- View on Light -</Menu.Link>
//         <Menu.Link>- View on OpenSea -</Menu.Link>
//         <Menu.Link>- View on Rainbow -</Menu.Link>
//         <Menu.Link>- View on 101 -</Menu.Link>
//         <Menu.Link>- View on WeLook -</Menu.Link>
//         <Menu.Link>- View on Mirror -</Menu.Link>
//         <Menu.Link>- View on Farcaster -</Menu.Link>
//         <Menu.Link>- View on Nimi -</Menu.Link>
//       </Menu.Open.Profile.Root>
//       <Menu.Open.PrimaryButton>Send A Message</Menu.Open.PrimaryButton>
//     </Menu.Open.Root>
//   )}
//   {whenShowMenu && (
//     <Menu.Open.Root>
//       <Menu.Open.Header>
//         <Image
//           style={{ cursor: "pointer" }}
//           onClick={() => setRightPanelState({ id: "closed" })}
//           src="/exit.svg"
//           width={24}
//           height={24}
//           alt="close menu"
//         />
//       </Menu.Open.Header>
//       <Image
//         style={{ margin: "-2rem auto 1rem auto" }}
//         onClick={() => null}
//         src="/logomark.svg"
//         width={176}
//         height={176}
//         alt="relay logo"
//       />
//       <Image
//         style={{ margin: "0 auto 1rem auto" }}
//         onClick={() => null}
//         src="/logotype.svg"
//         width={160}
//         height={160}
//         alt="relay logo"
//       />
//       <Menu.PrimaryLink>Discord</Menu.PrimaryLink>
//       <Menu.PrimaryLink>Lens</Menu.PrimaryLink>
//       <Menu.PrimaryLink>Twitter</Menu.PrimaryLink>
//       <Menu.PrimaryLink>GitHub</Menu.PrimaryLink>
//       <Menu.PrimaryLink>Mirror</Menu.PrimaryLink>
//       <Menu.PrimaryLink>Careers</Menu.PrimaryLink>
//       <Menu.PrimaryLink style={{ marginBottom: "auto" }}>
//         XMTP
//       </Menu.PrimaryLink>
//       <WhenIsConnectIdle>
//         <Menu.Open.PrimaryButton
//           onClick={() => {
//             if (openConnectModal === undefined) {
//               return;
//             } else {
//               openConnectModal();
//             }
//           }}
//         >
//           Connect A Wallet
//         </Menu.Open.PrimaryButton>
//       </WhenIsConnectIdle>
//       <WhenIsConnectPending>
//         <Menu.Open.PrimaryButton>Connecting...</Menu.Open.PrimaryButton>
//       </WhenIsConnectPending>
//       <WhenIsConnected>
//         <WhenCachedXmtp>
//           <WhenIsClientPending>
//             <Menu.Open.PrimaryButton>
//               Connected! Starting Relay...
//             </Menu.Open.PrimaryButton>
//           </WhenIsClientPending>
//         </WhenCachedXmtp>
//         <WhenNoCachedXmtp>
//           <WhenIsClientPending>
//             <Menu.Open.PrimaryButton>
//               Waiting for Signature...
//             </Menu.Open.PrimaryButton>
//           </WhenIsClientPending>
//         </WhenNoCachedXmtp>
//         <WhenIsClientSuccess>
//           <Menu.Open.PrimaryButton>
//             {`Sign Out ${truncateAddress(address || "")}`}
//           </Menu.Open.PrimaryButton>
//         </WhenIsClientSuccess>
//         <WhenIsClientError>
//           <Menu.Open.PrimaryButton
//             onClick={() => {
//               if (startClient === null) {
//                 return;
//               } else {
//                 startClient();
//               }
//             }}
//           >
//             Signature Rejected, Try Again
//           </Menu.Open.PrimaryButton>
//         </WhenIsClientError>
//       </WhenIsConnected>
//     </Menu.Open.Root>
//   )}
// </Layout.RightPanel>
