import { useState, useMemo, FunctionComponent } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { useEffect } from "react";
import * as Layout from "@/components/Layout";
import { spaceMonoMdBold, spaceMonoLgBlack } from "@/lib/typography";
import { useIsClient } from "@/hooks/useIsClient";
import * as ButtonPrimary from "@/components/ButtonPrimary";
import { EnableXmtp } from "./EnableXmtp";
import { Wallet } from "ethers";
import { getNumberArray } from "@/lib/getNumberArray";
import Image from "next/image";
import * as Icon from "@/components/Icon";
import { useAuth } from "@/hooks/useAuth";
import { card, FADE_IN_ANIMATION } from "@/lib/styles";
import { Avatar } from "./Avatar";
import { truncateAddress } from "@/lib/truncateAddress";

const TWENTY = getNumberArray(20);

export const Relay = ({ onClose }: { onClose: () => void }) => {
  /* ************************************************************************
   * STYLES
   * ************************************************************************/

  const { Modal } = Styles;

  /* ************************************************************************
   * HELPERS
   * ************************************************************************/

  const isClient = useIsClient();

  /* ************************************************************************
   * AUTH
   * ************************************************************************/

  const { address, disconnect } = useAuth();

  /* ************************************************************************
   * USER FLOWS
   * ************************************************************************/

  // const [activeFlow, setActiveFlow] = useState<
  //   { id: "MENU" } | { id: "ENABLE XMTP" }
  // >(isClient && isConnected ? { id: "ENABLE XMTP" } : { id: "MENU" });

  // useEffect(() => {
  //   if (!isConnected) {
  //     return;
  //   } else {
  //     setActiveFlow({ id: "ENABLE XMTP" });
  //   }
  // }, [isConnected]);

  // const showMenuFlow = activeFlow.id === "MENU";
  // const showEnableXmtpFlow = isClient && activeFlow.id === "ENABLE XMTP";

  /* **************************************************************************
   * RENDER
   * *************************************************************************/

  return (
    <Modal.Overlay
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      onClick={onClose}
    >
      <Modal.Root onClick={(e) => e.stopPropagation()}>
        <Modal.Header.Root>
          <Modal.Header.Handle>
            <Image
              onClick={() => null}
              src="/xmtp.svg"
              width={24}
              height={24}
              alt="exit"
            />
            {address}
          </Modal.Header.Handle>
          <Image
            onClick={() => null}
            src="/exit.svg"
            width={24}
            height={24}
            alt="exit"
          />
        </Modal.Header.Root>
        <Modal.Row>
          <Modal.Column.Left>
            <Avatar address={address || ""} size="xxxl" />
            <ButtonPrimary.Base onClick={undefined}>
              Sign Out
            </ButtonPrimary.Base>
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
          <Modal.Footer.LearnMore
            href="https://github.com/relaycc/xmtp"
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </Modal.Footer.LearnMore>
        </Modal.Footer.Root>
      </Modal.Root>
    </Modal.Overlay>
  );
};

const Styles = (() => {
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
      backdrop-filter: blur(3px);
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
        padding-left: ${(p) => p.theme.scale.four};
        padding-right: ${(p) => p.theme.scale.four};
        gap: ${(p) => p.theme.scale.six};
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
        gap: ${(p) => p.theme.scale.one};
      `;

      const LearnMore = styled.p`
        ${spaceMonoMdBold};
      `;

      const Handle = styled.h3`
        ${spaceMonoLgBlack}
        display: flex;
        gap: ${(p) => p.theme.scale.one};
        :hover {
          cursor: pointer;
          text-decoration: underline;
          color: ${(p) => p.theme.colors.primary[500]};
        }
      `;

      return {
        Root,
        LearnMore,
        Handle,
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
        ${spaceMonoLgBlack};
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
    Modal,
  };
})();
