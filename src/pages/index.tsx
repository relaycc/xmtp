import {
  useConversation,
  usePreviews,
  Conversation,
  useXmtp,
} from "@relaycc/xmtp-hooks";
import { uniqueConversationKey } from "@relaycc/xmtp-hooks/lib";
import Image from "next/image";
import { Signer } from "ethers";
import { motion } from "framer-motion";
import { useEffect, useState, useMemo, FunctionComponent, useRef } from "react";
import styled, { css } from "styled-components";
import { Wallet } from "ethers";
import {
  spaceMonoLgBlack,
  textLgBlack,
  textXlBlack,
  spaceMonoMdBold,
  spaceMonoXlBlack,
  textMdRegular,
  textMdSemiBold,
  textXsMedium,
  THEME,
  ALCHEMY,
  useWhen,
  useInView,
  useIsClient,
  GitHub,
  useWallet,
} from "@/lib";
import Blockies from "react-blockies";
import { create } from "zustand";

export default function Page() {
  return <AuthPage.Component />;
}

/* **************************************************************************
 *
 *
 *
 *
 *
 *
 * SHARED STYLES
 *
 *
 *
 *
 *
 * *************************************************************************/

const noScrollbars = css`
  ::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`;

const Shared = (() => {
  const Spinner = ({
    className,
    height,
    width,
    alt,
  }: {
    className: string;
    height: number;
    width: number;
    alt: string;
  }) => {
    return (
      <motion.div
        className={className}
        animate={{ rotate: 360 }}
        transition={{
          repeat: Infinity,
          duration: 1,
          repeatDelay: 0,
          ease: "linear",
        }}
      >
        <Image
          src="/loader-black.png"
          alt={alt}
          width={width}
          height={height}
        />
      </motion.div>
    );
  };

  return {
    Spinner,
  };
})();

/* **************************************************************************
 *
 *
 *
 *
 *
 *
 * LAYOUT
 *
 *
 *
 *
 *
 * *************************************************************************/

export const Layout = (() => {
  const Page = styled(motion.div)`
    ${noScrollbars};
    height: 100vh;
    width: 100vw;
    overflow: hidden;
    display: flex;
    background-color: #f5f5f5;
  `;

  const LeftPanel = styled.div`
    ${noScrollbars};
    display: flex;
    flex-direction: column;
    border-right: 3px solid black;
    overflow: hidden;
    flex: 0 0 25rem;
    max-width: 25rem;
  `;

  const MainPanel = styled.div`
    ${noScrollbars};
    display: flex;
    flex-direction: column;
    overflow: hidden;
    flex: 1 1 auto;
  `;

  const RightPanel = styled.div`
    ${noScrollbars};
    display: flex;
    flex-direction: column;
    overflow: hidden;
    border-left: 3px solid black;
    flex: 0 0 max-content;
    max-width: 30rem;
  `;

  return {
    Page,
    LeftPanel,
    MainPanel,
    RightPanel,
  };
})();

/* **************************************************************************
 *
 *
 *
 *
 *
 *
 * ENABLE XMTP
 *
 *
 *
 *
 *
 * *************************************************************************/

const EnableXmtp = (() => {
  const Component = ({
    autoLaunch,
    burner,
  }: {
    autoLaunch?: boolean;
    burner?: Wallet;
  }) => {
    /* **************************************************************************
     * HELPERS
     * *************************************************************************/

    const isClient = useIsClient();

    /* **************************************************************************
     * WALLET
     * *************************************************************************/

    const {
      address,
      connect,
      connectors,
      isConnected: isWagmiConnected,
      signer,
    } = useWallet({ override: burner });

    const [isConnected, setIsConnected] = useState<boolean>(false);

    const isConnectIdle = isClient && !isWagmiConnected;
    const isConnectPending = isClient && isWagmiConnected && !isConnected;

    // We use this to simulate a connection latency.
    useEffect(() => {
      if (!isWagmiConnected) {
        return;
      } else {
        setTimeout(() => {
          setIsConnected(true);
        }, 2000);
      }
    }, [isWagmiConnected]);

    /* **************************************************************************
     * CACHED XMTP & AUTOCONNECT
     * *************************************************************************/

    const cachedXmtpClient = useMemo(() => {
      if (address === null || address === undefined) {
        return null;
      } else {
        const key = `relay-xmtp-${address}`;
        const cached = localStorage.getItem(key);
        return cached;
      }
    }, [address]);

    const xmtpOpts = useMemo(() => {
      if (cachedXmtpClient === null) {
        return { wallet: signer };
      } else {
        return { wallet: null, opts: { privateKeyOverride: cachedXmtpClient } };
      }
    }, [cachedXmtpClient, signer]);

    /* **************************************************************************
     * XMTP
     * *************************************************************************/

    const {
      isClientIdle,
      isClientError,
      isClientPending,
      isClientSuccess,
      startClient,
      client,
    } = useXmtp(xmtpOpts);

    useEffect(() => {
      if (
        typeof localStorage === "undefined" ||
        !isClientSuccess ||
        client === undefined ||
        client.export === undefined ||
        burner !== undefined
      ) {
        return;
      } else {
        const key = `relay-xmtp-${client.address}`;
        localStorage.setItem(key, client.export);
      }
    }, [isClientSuccess, client, burner]);

    /* **************************************************************************
     * RENDER STATES
     * *************************************************************************/

    const [isAppLaunching, setIsAppLaunching] = useState<boolean>(false);
    const [isAppLaunched, setIsAppLaunched] = useState<boolean>(false);

    const whenConnectIdle = isConnectIdle;
    const whenConnectPending = isConnectPending;
    const whenConnected = isConnected && isClientIdle;
    const whenClientWaitingForSignature =
      isClientPending && cachedXmtpClient === null && burner === undefined;
    const whenClientInitializing =
      isClientPending && (cachedXmtpClient !== null || burner !== undefined);
    const whenClientError = isClientError;
    const whenClientSuccess = isClientSuccess && !isAppLaunching;
    const whenAppLaunching =
      isClientSuccess && isAppLaunching && !isAppLaunched;
    const whenAppLaunched = isClientSuccess && isAppLaunched;
    const whenFallback = !(
      whenConnectIdle ||
      whenConnectPending ||
      whenConnected ||
      whenClientWaitingForSignature ||
      whenClientInitializing ||
      whenClientError ||
      whenClientSuccess ||
      whenAppLaunching ||
      whenAppLaunched
    );

    /* **************************************************************************
     * AUTOLAUNCH
     * *************************************************************************/

    useEffect(() => {
      if (!whenConnected || !autoLaunch || startClient === null) {
        return;
      } else {
        startClient();
      }
    }, [autoLaunch, startClient, whenConnected]);

    useEffect(() => {
      if (!whenClientSuccess || !autoLaunch) {
        return;
      } else {
        setIsAppLaunching(true);
      }
    }, [autoLaunch, whenClientSuccess]);

    useEffect(() => {
      if (!whenAppLaunching) {
        return;
      } else {
        setTimeout(() => {
          setIsAppLaunched(true);
        }, 2000);
      }
    }, [whenAppLaunching]);

    /* **************************************************************************
     * RENDER
     * *************************************************************************/

    return (
      <>
        {whenFallback && (
          <AuthPage.Styles.Modal.Column.Left>
            <AuthPage.Styles.PrimaryButton>
              Connect A Wallet
            </AuthPage.Styles.PrimaryButton>
            <AuthPage.Styles.PrimaryButton disabled>
              Enable XMTP
            </AuthPage.Styles.PrimaryButton>
            <AuthPage.Styles.PrimaryButton disabled>
              Launch App
            </AuthPage.Styles.PrimaryButton>
          </AuthPage.Styles.Modal.Column.Left>
        )}
        {whenConnectIdle && (
          <AuthPage.Styles.Modal.Column.Left>
            <AuthPage.Styles.PrimaryButton
              onClick={() => {
                const metamask = connectors.find(
                  (connector) => connector.id === "metaMask"
                );

                if (metamask === undefined) {
                  throw new Error("Metamask not found");
                } else {
                  connect({ connector: metamask });
                }
              }}
            >
              Connect A Wallet
            </AuthPage.Styles.PrimaryButton>
            <AuthPage.Styles.PrimaryButton disabled>
              Enable XMTP
            </AuthPage.Styles.PrimaryButton>
            <AuthPage.Styles.PrimaryButton disabled>
              Launch App
            </AuthPage.Styles.PrimaryButton>
          </AuthPage.Styles.Modal.Column.Left>
        )}
        {whenConnectPending && (
          <AuthPage.Styles.Modal.Column.Left>
            <AuthPage.Styles.PrimaryButtonPending>
              Connecting...
            </AuthPage.Styles.PrimaryButtonPending>
            <AuthPage.Styles.PrimaryButton disabled>
              Enable XMTP
            </AuthPage.Styles.PrimaryButton>
            <AuthPage.Styles.PrimaryButton disabled>
              Launch App
            </AuthPage.Styles.PrimaryButton>
          </AuthPage.Styles.Modal.Column.Left>
        )}
        {whenConnected && (
          <AuthPage.Styles.Modal.Column.Left>
            <AuthPage.Styles.PrimaryButtonSuccess>
              Connected!
            </AuthPage.Styles.PrimaryButtonSuccess>
            <AuthPage.Styles.PrimaryButton
              onClick={() => {
                if (startClient === null) {
                  throw new Error("startClient is null");
                } else {
                  startClient();
                }
              }}
            >
              Enable XMTP
            </AuthPage.Styles.PrimaryButton>
            <AuthPage.Styles.PrimaryButton disabled>
              Launch App
            </AuthPage.Styles.PrimaryButton>
          </AuthPage.Styles.Modal.Column.Left>
        )}
        {whenClientWaitingForSignature && (
          <AuthPage.Styles.Modal.Column.Left>
            <AuthPage.Styles.PrimaryButtonSuccess>
              Connected!
            </AuthPage.Styles.PrimaryButtonSuccess>
            <AuthPage.Styles.PrimaryButtonPending>
              Sign Message...
            </AuthPage.Styles.PrimaryButtonPending>
            <AuthPage.Styles.PrimaryButton disabled>
              Launch App
            </AuthPage.Styles.PrimaryButton>
          </AuthPage.Styles.Modal.Column.Left>
        )}
        {whenClientInitializing && (
          <AuthPage.Styles.Modal.Column.Left>
            <AuthPage.Styles.PrimaryButtonSuccess>
              Connected!
            </AuthPage.Styles.PrimaryButtonSuccess>
            <AuthPage.Styles.PrimaryButtonPending>
              Initializing...
            </AuthPage.Styles.PrimaryButtonPending>
            <AuthPage.Styles.PrimaryButton disabled>
              Launch App
            </AuthPage.Styles.PrimaryButton>
          </AuthPage.Styles.Modal.Column.Left>
        )}
        {whenClientSuccess && (
          <AuthPage.Styles.Modal.Column.Left>
            <AuthPage.Styles.PrimaryButtonSuccess>
              Connected!
            </AuthPage.Styles.PrimaryButtonSuccess>
            <AuthPage.Styles.PrimaryButtonSuccess>
              XMTP Enabled!
            </AuthPage.Styles.PrimaryButtonSuccess>
            <AuthPage.Styles.PrimaryButton
              onClick={() => {
                setIsAppLaunching(true);
              }}
            >
              Launch App
            </AuthPage.Styles.PrimaryButton>
          </AuthPage.Styles.Modal.Column.Left>
        )}
        {whenAppLaunching && (
          <AuthPage.Styles.Modal.Column.Left>
            <AuthPage.Styles.PrimaryButtonSuccess>
              Connected!
            </AuthPage.Styles.PrimaryButtonSuccess>
            <AuthPage.Styles.PrimaryButtonSuccess>
              XMTP Enabled!
            </AuthPage.Styles.PrimaryButtonSuccess>
            <AuthPage.Styles.PrimaryButtonPending>
              Launching App...
            </AuthPage.Styles.PrimaryButtonPending>
          </AuthPage.Styles.Modal.Column.Left>
        )}
        {whenAppLaunched && (
          <AuthPage.Styles.Modal.Column.Left>
            <AuthPage.Styles.PrimaryButtonSuccess>
              Connected!
            </AuthPage.Styles.PrimaryButtonSuccess>
            <AuthPage.Styles.PrimaryButtonSuccess>
              XMTP Enabled!
            </AuthPage.Styles.PrimaryButtonSuccess>
            <AuthPage.Styles.PrimaryButtonSuccess>
              App Coming Soon!
            </AuthPage.Styles.PrimaryButtonSuccess>
          </AuthPage.Styles.Modal.Column.Left>
        )}
        {whenClientError && (
          <AuthPage.Styles.Modal.Column.Left>
            <AuthPage.Styles.PrimaryButtonSuccess>
              Connected!
            </AuthPage.Styles.PrimaryButtonSuccess>
            <AuthPage.Styles.PrimaryButton
              onClick={() => {
                if (startClient === null) {
                  throw new Error("startClient is null");
                } else {
                  startClient();
                }
              }}
            >
              Try Again...
            </AuthPage.Styles.PrimaryButton>
            <AuthPage.Styles.PrimaryButton disabled>
              Launch App
            </AuthPage.Styles.PrimaryButton>
          </AuthPage.Styles.Modal.Column.Left>
        )}
      </>
    );
  };

  return {
    Component,
  };
})();

/* **************************************************************************
 *
 *
 *
 *
 *
 *
 * AuthPage
 *
 *
 *
 *
 *
 * *************************************************************************/

const AuthPage = (() => {
  const Styles = (() => {
    const Root = Layout.Page;

    const PrimaryButton = styled(motion.button)`
      ${spaceMonoXlBlack}
      color: ${(p) => p.theme.colors.primary["700"]};
      display: flex;
      justify-content: center;
      align-items: center;
      padding: ${(p) => p.theme.scale.zero} ${(p) => p.theme.scale.four};
      min-height: 3rem;
      border-radius: ${(p) => p.theme.scale.twelve};
      transition: border 0.2s ease-in-out;
      border: 3px solid transparent;
      :hover {
        border: 3px solid ${(p) => p.theme.colors.primary["700"]};
      }

      :disabled {
        opacity: 0.5;
        :hover {
          border: 3px solid transparent;
        }
      }
    `;
    const PrimaryButtonSuccess = styled(PrimaryButton)`
      ${spaceMonoLgBlack};
      color: ${(p) => p.theme.colors.success["700"]};
      :hover {
        border: 3px solid transparent;
      }
    `;
    const PrimaryButtonPending = styled(PrimaryButton)`
      ${spaceMonoLgBlack};
      color: ${(p) => p.theme.colors.primary["700"]};
      :hover {
        border: 3px solid transparent;
      }
    `;

    const SecondaryButton = styled(PrimaryButton)`
      ${spaceMonoLgBlack};
      padding: ${(p) => p.theme.scale.two} ${(p) => p.theme.scale.four};
      :hover {
        border: 3px solid black;
      }
    `;

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
        display: flex;
        flex-direction: column;
        height: 40rem;
        width: 60rem;
        background-color: white;
        border-radius: ${(p) => p.theme.scale.twelve};
        border: ${(p) => p.theme.scale.one} solid black;
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

    const Notice = styled.h3`
      ${spaceMonoLgBlack}
      margin: ${(p) => p.theme.scale.two} 0;
      padding: 0;
      line-height: 1;
    `;

    return {
      Root,
      BackgroundOverlay,
      AnimatedRow,
      Modal,
      PrimaryButton,
      SecondaryButton,
      PrimaryButtonSuccess,
      PrimaryButtonPending,
      Notice,
    };
  })();

  const Component = () => {
    /* ************************************************************************
     * STYLES
     * ************************************************************************/

    const { Root, BackgroundOverlay, AnimatedRow, Modal, PrimaryButton } =
      Styles;

    /* ************************************************************************
     * HELPERS
     * ************************************************************************/

    const isClient = useIsClient();

    /* ************************************************************************
     * WALLET, CACHED XMTP, AUTOCONNECT
     * ************************************************************************/

    const { address } = useWallet({});

    const cachedXmtpClient = useMemo(() => {
      if (address === null || address === undefined) {
        return null;
      } else {
        const key = `relay-xmtp-${address}`;
        const cached = localStorage.getItem(key);
        return cached;
      }
    }, [address]);

    /* ************************************************************************
     * USER FLOWS
     * ************************************************************************/

    const [activeFlow, setActiveFlow] = useState<
      | { id: "MENU" }
      | { id: "ENABLE XMTP"; autoLaunch: boolean; burner?: Wallet }
    >({ id: "MENU" });

    // TODO: This shows a flash of the menu before the flow is set.
    useEffect(() => {
      if (!isClient) {
        return;
      } else if (cachedXmtpClient === null) {
        setActiveFlow({ id: "MENU" });
      } else {
        setActiveFlow({ id: "ENABLE XMTP", autoLaunch: true });
      }
    }, [isClient, cachedXmtpClient]);

    const showMenuFlow = activeFlow.id === "MENU";
    const showEnableXmtpFlow = isClient && activeFlow.id === "ENABLE XMTP";

    const setShowMenuFlow = () => setActiveFlow({ id: "MENU" });
    const setShowEnableXmtpFlow = ({
      autoLaunch,
      burner,
    }: {
      autoLaunch: boolean;
      burner?: Wallet;
    }) => setActiveFlow({ id: "ENABLE XMTP", autoLaunch, burner });

    /* **************************************************************************
     * RENDER
     * *************************************************************************/

    return (
      <Root>
        <BackgroundOverlay>
          {ZERO_TO_NINETEEN.map((i) => {
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
                <GitHub />
              </a>
            </Modal.Header.Root>
            <Modal.Row>
              {showMenuFlow && (
                <Modal.Column.Left>
                  <PrimaryButton
                    onClick={() => setShowEnableXmtpFlow({ autoLaunch: false })}
                  >
                    Enable XMTP
                  </PrimaryButton>
                  <PrimaryButton
                    onClick={() =>
                      setShowEnableXmtpFlow({
                        autoLaunch: true,
                        burner: Wallet.createRandom(),
                      })
                    }
                  >
                    Launch Demo
                  </PrimaryButton>
                </Modal.Column.Left>
              )}
              {showEnableXmtpFlow && (
                <EnableXmtp.Component
                  autoLaunch={activeFlow.autoLaunch}
                  burner={activeFlow.burner}
                />
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
          </Modal.Root>
        </Modal.Overlay>
      </Root>
    );
  };

  return {
    Styles,
    Component,
  };
})();

/* **************************************************************************
 *
 *
 *
 *
 *
 *
 * Avatar
 *
 *
 *
 *
 *
 * *************************************************************************/

const useAvatarStore = create<Record<string, AsyncState<string | null>>>(
  () => ({})
);

type Identity<T> = (x: T) => T;

export const useAvatar = ({ address }: { address: string }) => {
  const avatar = useAvatarStore((state) => state[address]) || { id: "idle" };

  const setAvatar = (
    input: AsyncState<string | null> | Identity<AsyncState<string | null>>
  ) => {
    useAvatarStore.setState((state) => {
      return {
        ...state,
        [address]: typeof input === "function" ? input(state[address]) : input,
      };
    });
  };

  return [avatar, setAvatar] as const;
};

export const Avatar: FunctionComponent<{
  address: string;
  onClick?: () => unknown;
  size: "sm" | "md" | "lg" | "xl" | "xxxl";
}> = ({ address, onClick, size }) => {
  const ref = useRef(null);
  const isInView = useInView(ref);
  const [avatar, setAvatar] = useAvatar({ address });
  const [inViewForASecond, setInViewForASecond] = useState(false);
  const [inViewForASecondTimer, setInViewForASecondTimer] =
    useState<NodeJS.Timeout>();

  useEffect(() => {
    if (!isInView) {
      if (inViewForASecondTimer === undefined) {
        return;
      } else {
        clearTimeout(inViewForASecondTimer);
        setInViewForASecondTimer(undefined);
      }
    } else {
      if (inViewForASecondTimer !== undefined) {
        return;
      } else {
        setInViewForASecondTimer(
          setTimeout(() => {
            setInViewForASecond(true);
          }, 2000)
        );
      }
    }
  }, [isInView, inViewForASecondTimer]);

  useEffect(() => {
    if (!inViewForASecond || avatar.id !== "idle") {
      return;
    } else {
      (async () => {
        try {
          setAvatar({ id: "pending" });
          const avatar = await ALCHEMY.getAvatar(address);
          setAvatar({ id: "success", data: avatar });
        } catch (error) {
          setAvatar({ id: "error", error });
        }
      })();
    }
  }, [inViewForASecond, avatar.id, address]);

  const AvatarElement = useMemo(() => {
    switch (size) {
      case "sm":
        return AvatarStyles.Sm;
      case "md":
        return AvatarStyles.Md;
      case "lg":
        return AvatarStyles.Lg;
      case "xl":
        return AvatarStyles.Xl;
      case "xxxl":
        return AvatarStyles.Xxxl;
      default:
        throw new Error("Invalid Avatar size");
    }
  }, [size]);

  const blockie = useMemo(() => {
    switch (size) {
      case "sm":
        return {
          component: AvatarStyles.Blockie.Sm,
          seed: address || "no address",
          size: 10,
          scale: 2.5,
        };
      case "md":
        return {
          component: AvatarStyles.Blockie.Md,
          seed: address || "no address",
          size: 10,
          scale: 4,
        };
      case "lg":
        return {
          component: AvatarStyles.Blockie.Lg,
          seed: address || "no address",
          size: 10,
          scale: 5,
        };
      case "xl":
        return {
          component: AvatarStyles.Blockie.Xl,
          seed: address || "no address",
          size: 10,
          scale: 7.5,
        };
      case "xxxl":
        return {
          component: AvatarStyles.Blockie.Xxxl,
          seed: address || "no address",
          size: 16,
          scale: 16,
        };
      default:
        throw new Error("Invalid Avatar size");
    }
  }, [address, size]);

  const WhenHasAvatar = useWhen(typeof avatar.data === "string");
  const WhenDoesntHaveAvatar = useWhen(typeof avatar.data !== "string");

  return (
    <>
      <WhenDoesntHaveAvatar>
        <div
          ref={ref}
          onClick={onClick}
          style={{
            borderRadius: "50%",
            opacity: avatar.id === "pending" ? 0.2 : 1,
            display: "flex",
          }}
        >
          <blockie.component
            seed={blockie.seed}
            size={blockie.size}
            scale={blockie.scale}
          />
        </div>
      </WhenDoesntHaveAvatar>
      <WhenHasAvatar>
        <AvatarElement
          initial={{ opacity: 0.2 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0 }}
          onClick={onClick}
          src={(() => {
            return avatar.data || "NO ADDRESS";
          })()}
          alt="user"
        />
      </WhenHasAvatar>
    </>
  );
};

/* **************************************************************************
 *
 *
 *
 *
 *
 *
 * Direct Message
 *
 *
 *
 *
 *
 * *************************************************************************/

const DirectMessage = ({
  wallet,
  conversation,
}: {
  wallet?: Signer | null;
  conversation: Conversation;
}) => {
  const convo = useConversation({
    wallet,
    conversation,
  });

  const WhenMessagesIsPending = useWhen(convo.isMessagesPending);
  const WhenMessagesIsSuccess = useWhen(convo.isMessagesSuccess);

  return (
    <Messages.Root>
      <WhenMessagesIsPending>
        <Messages.Pending.Overlay>Loading Messages...</Messages.Pending.Overlay>
        {ZERO_TO_NINETEEN.map((i) => {
          return (
            <Messages.Pending.Item
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.1 }}
              transition={{
                repeat: Infinity,
                delay: 0.2 * (i + 1),
                duration: 1,
                repeatType: "reverse",
              }}
            />
          );
        })}
      </WhenMessagesIsPending>
      <WhenMessagesIsSuccess>
        <Messages.List
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
                    {`${new Date(message.sent).toLocaleDateString()} ${new Date(
                      message.sent
                    ).toLocaleTimeString()}`}
                  </Message.Header.Time>
                </Message.Header.Root>
                <Message.Content>{`${message.content}`}</Message.Content>
              </Message.Root>
            );
          })}
        </Messages.List>
      </WhenMessagesIsSuccess>
    </Messages.Root>
  );
};

/* **************************************************************************
 *
 *
 *
 *
 *
 *
 * CONVERSATION LIST
 *
 *
 *
 *
 *
 * *************************************************************************/

export const ConversationList = {
  Root: styled(motion.ul)`
    ${noScrollbars};
    display: flex;
    flex-direction: column;
    overflow: hidden;
    overflow-y: scroll;
    position: relative;
  `,

  Header: styled.div`
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    padding: ${(p) => p.theme.scale.four};
  `,

  Item: {
    Root: styled.li<{ isActive: boolean }>`
      display: flex;
      align-items: center;
      background-color: ${(p) =>
        p.isActive ? p.theme.colors.gray[300] : "transparent"};

      padding: ${(p) => p.theme.scale.two} ${(p) => p.theme.scale.two};
      /* padding-left: ${(p) => p.theme.scale.two}; */
      gap: ${(p) => p.theme.scale.two};
      :hover {
        background-color: ${(p) => p.theme.colors.gray[200]};
      }
    `,

    Headline: styled.div`
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-grow: 1;
    `,

    Info: styled.div`
      display: flex;
      flex-direction: column;
      cursor: pointer;
    `,

    Time: styled.time`
      ${textXsMedium};
      color: ${(p) => p.theme.colors.gray[500]};
      line-height: 1;
    `,

    PeerAddress: styled.h1`
      ${spaceMonoMdBold};
    `,

    Preview: styled.p`
      ${textMdRegular};
      width: 20rem;
      overflow: hidden;
      overflow-wrap: break-word;
      white-space: nowrap;
      text-overflow: ellipsis;
    `,
  },

  Pending: {
    Overlay: styled.div`
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

export const NewConversation = {
  Root: styled.div`
    display: flex;
    align-items: center;
    min-height: 3rem;
    padding: ${(p) => p.theme.scale.one};
    padding-right: ${(p) => p.theme.scale.eight};
    margin-right: 3px;
    border-bottom: 1px solid ${(p) => p.theme.colors.gray[300]};
    :hover {
      background-color: ${(p) => p.theme.colors.gray[100]};
    }
  `,

  Input: styled.input`
    ${textMdRegular};
    ${noScrollbars}
    display: flex;
    padding: ${(p) => p.theme.scale.zero};
    border: 4px solid transparent;
    background-color: transparent;
    :focus {
      outline: none;
    }
  `,

  Spinner: ({ isActive }: { isActive: boolean }) => {
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
          padding: "0",
          margin: "0",
          height: "32px",
          width: "32px",
        }}
      >
        {isActive && (
          <Image
            style={{ height: "32px", width: "32px" }}
            src="/loader-black.png"
            alt="loader"
            width={32}
            height={32}
          />
        )}
      </motion.div>
    );
  },
};

/* **************************************************************************
 *
 *
 *
 *
 *
 *
 * AVATAR
 *
 *
 *
 *
 *
 * *************************************************************************/

const avatar = css`
  border-radius: 50%;
  overflow: hidden;
  cursor: pointer;
`;

const SIZES = {
  sm: css`
    height: 25px;
    min-width: 25px;
  `,

  md: css`
    height: 40px;
    min-width: 40px;
  `,

  lg: css`
    height: 50px;
    min-width: 50px;
  `,

  xl: css`
    border-radius: 1rem;
    height: 75px;
    min-width: 75px;
  `,

  xxxl: css`
    height: 16rem;
    min-width: 16rem;
  `,
};

export const AvatarStyles = {
  Sm: styled(motion.img)`
    ${avatar};
    ${SIZES.sm};
  `,

  Md: styled(motion.img)`
    ${avatar};
    ${SIZES.md};
  `,

  Lg: styled(motion.img)`
    ${avatar};
    ${SIZES.lg};
  `,
  Xl: styled(motion.img)`
    ${avatar};
    ${SIZES.xl};
  `,

  Xxxl: styled(motion.img)`
    ${avatar};
    ${SIZES.xxxl};
  `,

  Blockie: {
    Sm: styled(Blockies)`
      ${avatar};
      ${SIZES.md};
    `,

    Md: styled(Blockies)`
      ${avatar};
      ${SIZES.md};
    `,

    Lg: styled(Blockies)`
      ${avatar};
      ${SIZES.lg};
    `,

    Xl: styled(Blockies)`
      ${avatar};
      ${SIZES.xl};
    `,

    Xxxl: styled(Blockies)`
      ${avatar};
      ${SIZES.xxxl};
    `,
  },

  Pending: {
    Md: ({ i }: { i: number }) => {
      return (
        <motion.div
          style={{
            minWidth: "40px",
            minHeight: "40px",
            borderRadius: "50%",
            backgroundColor: THEME.colors.primary[400],
          }}
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
          transition={{
            repeat: Infinity,
            delay: 0.1 * (i + 1),
            duration: 0.75,
            repeatType: "reverse",
          }}
        />
      );
    },
  },
};

/* **************************************************************************
 *
 *
 *
 *
 *
 *
 * MENU
 *
 *
 *
 *
 *
 * *************************************************************************/

export const Menu = {
  Closed: {
    Root: styled(motion.ul)`
      ${noScrollbars};
      display: flex;
      flex-direction: column;
      flex-grow: 1;
    `,

    ProfileWrapper: styled.div`
      margin-top: ${(p) => p.theme.scale.four};
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
    `,
  },

  Open: {
    Root: styled(motion.ul)`
      ${noScrollbars};
      display: flex;
      flex-direction: column;
      overflow-y: scroll;
    `,

    Header: styled.div`
      display: flex;
      flex-direction: row;
      align-items: center;
      padding: ${(p) => p.theme.scale.four};
    `,

    PrimaryButton: styled.button`
      ${textLgBlack};
      background-color: ${(p) => p.theme.colors.primary[100]};
      display: flex;
      align-items: center;
      justify-content: center;
      height: ${(p) => p.theme.scale.twelve};
      padding: ${(p) => p.theme.scale.two} ${(p) => p.theme.scale.four};
      margin-top: ${(p) => p.theme.scale.two};
      cursor: pointer;

      :hover {
        background-color: ${(p) => p.theme.colors.primary[200]};
      }
    `,

    Profile: {
      Root: styled.div`
        display: flex;
        flex-direction: column;
        align-items: center;
      `,

      Avatar: styled.div`
        margin-top: -2rem;
        margin-bottom: ${(p) => p.theme.scale.four};
        border: 3px solid black;
        border-radius: 50%;
      `,

      Address: styled.h3`
        ${spaceMonoXlBlack};
        margin: ${(p) => p.theme.scale.four} 0;
      `,
    },

    Auth: {
      Root: styled.div`
        display: flex;
        flex-direction: column;
        align-items: center;
      `,

      Relay: styled.div`
        margin-top: -2rem;
        margin-bottom: ${(p) => p.theme.scale.four};
        border: 3px solid black;
        border-radius: 50%;
      `,
    },
  },

  Link: styled.button`
    ${textMdSemiBold};
    background-color: transparent;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: ${(p) => p.theme.scale.one} ${(p) => p.theme.scale.four};
    cursor: pointer;

    :hover {
      /* ${textLgBlack}; */
      background-color: ${(p) => p.theme.colors.gray[100]};
    }

    :active {
      background-color: ${(p) => p.theme.colors.primary[200]};
    }
  `,

  PrimaryLink: styled.button`
    ${spaceMonoLgBlack};
    background-color: transparent;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: ${(p) => p.theme.scale.one} ${(p) => p.theme.scale.four};
    cursor: pointer;

    :hover {
      background-color: ${(p) => p.theme.colors.gray[100]};
    }

    :active {
      background-color: ${(p) => p.theme.colors.primary[200]};
    }
  `,
};

/* **************************************************************************
 *
 *
 *
 *
 *
 *
 * MESSAGES
 *
 *
 *
 *
 *
 * *************************************************************************/

export const Messages = {
  Root: styled.div`
    ${noScrollbars};
    display: flex;
    flex-direction: column;
    flex: 1 1 auto;
    position: relative;
    overflow: hidden;
  `,

  List: styled(motion.ul)`
    ${noScrollbars};
    display: flex;
    flex-direction: column-reverse;
    /* flex: 1 1 auto; */
    flex-grow: 1;
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

/* **************************************************************************
 *
 *
 *
 *
 *
 *
 * MESSAGE
 *
 *
 *
 *
 *
 * *************************************************************************/

export const Message = {
  Root: styled.li`
    ${noScrollbars};
    border-radius: 4px;
    padding: ${(p) => p.theme.scale.two};
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

/* **************************************************************************
 *
 *
 *
 *
 *
 *
 * HELPERS
 *
 *
 *
 *
 *
 * *************************************************************************/

const ZERO_TO_NINETEEN = (() => {
  const arr = [];
  for (let i = 0; i < 20; i++) {
    arr.push(i);
  }
  return arr;
})();

type AsyncState<T> =
  | {
      id: "idle";
      data?: undefined;
      error?: undefined;
    }
  | {
      id: "pending";
      data?: undefined;
      error?: undefined;
    }
  | {
      id: "success";
      data: T;
      error?: undefined;
    }
  | {
      id: "fetching";
      data: T;
      error?: undefined;
    }
  | {
      id: "error";
      error: unknown;
      data?: undefined;
    };

// type RightPanelState =
//   | {
//       id: "profile";
//     }
//   | {
//       id: "menu";
//     }
//   | {
//       id: "closed";
//     };

// const getDisplayDate = (date: Date, onlyClockTime?: boolean): string => {
//   const time = date.getTime();
//   const midnight = new Date().setHours(0, 0, 0);
//   if (time > midnight || onlyClockTime) {
//     return date.toLocaleString("en-US", { timeStyle: "short" });
//   } else if (time > midnight - 24 * 60 * 60 * 1000) {
//     return "Yesterday";
//   } else if (time > midnight - 24 * 60 * 60 * 1000 * 7) {
//     return date.toLocaleString("en-US", { weekday: "long" });
//   } else {
//     return date.toLocaleString("en-US", { dateStyle: "short" });
//   }
// };

// const truncateAddress = (address: string) => {
//   return `${address.slice(0, 6)}...${address.slice(-4)}`;
// };

// export default function Xmtp() {
//   /* **************************************************************************
//    * HELPERS
//    * *************************************************************************/

//   const isClient = useIsClient();

//   /* **************************************************************************
//    * RIGHT PANEL STATE
//    * *************************************************************************/

//   const [rightPanelState, setRightPanelState] = useState<RightPanelState>({
//     id: "menu",
//   });
//   const whenShowProfile = rightPanelState.id === "profile";
//   const whenShowMenu = rightPanelState.id === "menu";
//   const whenShowClosed = rightPanelState.id === "closed";

//   /* **************************************************************************
//    * LEFT PANEL STATE
//    * *************************************************************************/

//   const [leftPanelState, setLeftPanelState] = useState(false);

//   const WhenLeftPanelIsOpen = useWhen(leftPanelState);
//   const WhenLeftPanelIsClosed = useWhen(!leftPanelState);

//   /* **************************************************************************
//    * PREVIEWS
//    * *************************************************************************/

//   // TODO wallet: null?
//   const { previews, isPreviewsSuccess, isPreviewsPending, isPreviewsError } =
//     usePreviews({
//       wallet: null,
//     });

//   const WhenPreviewsIsPending = useWhen(isPreviewsPending);
//   const WhenPreviewsIsSuccess = useWhen(isPreviewsSuccess);
//   const WhenPreviewsIsError = useWhen(isPreviewsError);

//   /* **************************************************************************
//    * SELECTED/ACTIVE CONVERSATION
//    * *************************************************************************/

//   const [selectedConversation, setSelectedConversation] =
//     useState<Conversation | null>(null);

//   const activeConversation =
//     (isClient && selectedConversation) || previews?.[0] || null;

//   const isActiveConversation = useCallback(
//     (conversation: Conversation) => {
//       if (activeConversation === null) {
//         return false;
//       } else {
//         return (
//           uniqueConversationKey(activeConversation) ===
//           uniqueConversationKey(conversation)
//         );
//       }
//     },
//     [activeConversation]
//   );

//   const hasActiveConversation = activeConversation !== null;

//   /* **************************************************************************
//    * RENDER
//    * *************************************************************************/

//   return (
//     <Layout.Page>
//       <Layout.LeftPanel>
//         <ConversationList.Root>
//           <WhenPreviewsIsPending>
//             <ConversationList.Pending.Overlay>
//               Loading Conversations...
//             </ConversationList.Pending.Overlay>
//             {ZERO_TO_NINETEEN.map((i) => {
//               return (
//                 <ConversationList.Pending.Item
//                   key={i}
//                   initial={{ opacity: 0 }}
//                   animate={{ opacity: 0.2 }}
//                   transition={{
//                     repeat: Infinity,
//                     delay: 0.2 * (i + 1),
//                     duration: 1,
//                     repeatType: "reverse",
//                   }}
//                 />
//               );
//             })}
//           </WhenPreviewsIsPending>
//           <WhenPreviewsIsSuccess>
//             {(previews || []).map((preview, i) => {
//               return (
//                 <ConversationList.Item.Root
//                   isActive={isActiveConversation(preview)}
//                   key={preview.peerAddress + i}
//                   onClick={() => {
//                     setSelectedConversation(preview);
//                   }}
//                 >
//                   <Avatar
//                     key={preview.peerAddress}
//                     address={preview.peerAddress}
//                     size="md"
//                   />
//                   <ConversationList.Item.Info>
//                     <ConversationList.Item.Headline>
//                       <ConversationList.Item.PeerAddress>
//                         {truncateAddress(preview.peerAddress)}
//                       </ConversationList.Item.PeerAddress>
//                       <ConversationList.Item.Time>
//                         {getDisplayDate(preview.preview.sent)}
//                         {/* {`${new Date(
//                           preview.preview.sent
//                         ).toLocaleDateString()} ${new Date(
//                           preview.preview.sent
//                         ).toLocaleTimeString()}`} */}
//                       </ConversationList.Item.Time>
//                     </ConversationList.Item.Headline>
//                     <ConversationList.Item.Preview>
//                       {`${preview.preview.content}`}
//                     </ConversationList.Item.Preview>
//                   </ConversationList.Item.Info>
//                 </ConversationList.Item.Root>
//               );
//             })}
//           </WhenPreviewsIsSuccess>
//         </ConversationList.Root>
//       </Layout.LeftPanel>
//       <Layout.MainPanel>
//         {hasActiveConversation && (
//           <DirectMessage
//             conversation={(() => {
//               if (activeConversation === null) {
//                 throw new Error("activeConversation is null");
//               } else {
//                 return activeConversation;
//               }
//             })()}
//           />
//         )}
//       </Layout.MainPanel>
//       <Layout.RightPanel>
//         {whenShowClosed && (
//           <Menu.Closed.Root>
//             <Menu.Link style={{ marginTop: "auto" }}>Twitter</Menu.Link>
//             <Menu.Link>Lens</Menu.Link>
//             <Menu.Link>GitHub</Menu.Link>
//             <Menu.Link>Discord</Menu.Link>
//             <Menu.Link>Mirror</Menu.Link>
//             <Menu.Link>XMTP</Menu.Link>
//             <Menu.Link>Join</Menu.Link>
//             <Menu.Link>Info</Menu.Link>
//           </Menu.Closed.Root>
//         )}
//         {whenShowProfile && (
//           <Menu.Open.Root>
//             <Menu.Open.Header>
//               <Image
//                 style={{ cursor: "pointer" }}
//                 onClick={() => setRightPanelState({ id: "closed" })}
//                 src="/exit.svg"
//                 width={16}
//                 height={16}
//                 alt="close menu"
//               />
//             </Menu.Open.Header>
//             <Menu.Open.Profile.Root>
//               <Menu.Open.Profile.Avatar>
//                 <Avatar
//                   address={activeConversation?.peerAddress || ""}
//                   size="xxxl"
//                 />
//               </Menu.Open.Profile.Avatar>
//               <Menu.Open.Profile.Address>
//                 {truncateAddress(activeConversation?.peerAddress || "")}
//               </Menu.Open.Profile.Address>
//               <Menu.Link>- View on ENS -</Menu.Link>
//               <Menu.Link>- View on Lenster -</Menu.Link>
//               <Menu.Link>- View on Galxe -</Menu.Link>
//               <Menu.Link>- View on Light -</Menu.Link>
//               <Menu.Link>- View on OpenSea -</Menu.Link>
//               <Menu.Link>- View on Rainbow -</Menu.Link>
//               <Menu.Link>- View on 101 -</Menu.Link>
//               <Menu.Link>- View on WeLook -</Menu.Link>
//               <Menu.Link>- View on Mirror -</Menu.Link>
//               <Menu.Link>- View on Farcaster -</Menu.Link>
//               <Menu.Link>- View on Nimi -</Menu.Link>
//             </Menu.Open.Profile.Root>
//             <Menu.Open.PrimaryButton>Send A Message</Menu.Open.PrimaryButton>
//           </Menu.Open.Root>
//         )}
//         {whenShowMenu && (
//           <Menu.Open.Root>
//             <Menu.Open.Header>
//               <Image
//                 style={{ cursor: "pointer" }}
//                 onClick={() => setRightPanelState({ id: "closed" })}
//                 src="/exit.svg"
//                 width={24}
//                 height={24}
//                 alt="close menu"
//               />
//             </Menu.Open.Header>
//             <Image
//               style={{ margin: "-2rem auto 1rem auto" }}
//               onClick={() => null}
//               src="/logomark.svg"
//               width={176}
//               height={176}
//               alt="relay logo"
//             />
//             <Image
//               style={{ margin: "0 auto 1rem auto" }}
//               onClick={() => null}
//               src="/logotype.svg"
//               width={160}
//               height={160}
//               alt="relay logo"
//             />
//             <Menu.PrimaryLink>Discord</Menu.PrimaryLink>
//             <Menu.PrimaryLink>Lens</Menu.PrimaryLink>
//             <Menu.PrimaryLink>Twitter</Menu.PrimaryLink>
//             <Menu.PrimaryLink>GitHub</Menu.PrimaryLink>
//             <Menu.PrimaryLink>Mirror</Menu.PrimaryLink>
//             <Menu.PrimaryLink>Careers</Menu.PrimaryLink>
//             <Menu.PrimaryLink style={{ marginBottom: "auto" }}>
//               XMTP
//             </Menu.PrimaryLink>
//             <WhenIsConnectIdle>
//               <Menu.Open.PrimaryButton
//                 onClick={() => {
//                   if (openConnectModal === undefined) {
//                     return;
//                   } else {
//                     openConnectModal();
//                   }
//                 }}
//               >
//                 Connect A Wallet
//               </Menu.Open.PrimaryButton>
//             </WhenIsConnectIdle>
//             <WhenIsConnectPending>
//               <Menu.Open.PrimaryButton>Connecting...</Menu.Open.PrimaryButton>
//             </WhenIsConnectPending>
//             <WhenIsConnected>
//               <WhenCachedXmtp>
//                 <WhenIsClientPending>
//                   <Menu.Open.PrimaryButton>
//                     Connected! Starting Relay...
//                   </Menu.Open.PrimaryButton>
//                 </WhenIsClientPending>
//               </WhenCachedXmtp>
//               <WhenNoCachedXmtp>
//                 <WhenIsClientPending>
//                   <Menu.Open.PrimaryButton>
//                     Waiting for Signature...
//                   </Menu.Open.PrimaryButton>
//                 </WhenIsClientPending>
//               </WhenNoCachedXmtp>
//               <WhenIsClientSuccess>
//                 <Menu.Open.PrimaryButton>
//                   {`Sign Out ${truncateAddress(address || "")}`}
//                 </Menu.Open.PrimaryButton>
//               </WhenIsClientSuccess>
//               <WhenIsClientError>
//                 <Menu.Open.PrimaryButton
//                   onClick={() => {
//                     if (startClient === null) {
//                       return;
//                     } else {
//                       startClient();
//                     }
//                   }}
//                 >
//                   Signature Rejected, Try Again
//                 </Menu.Open.PrimaryButton>
//               </WhenIsClientError>
//             </WhenIsConnected>
//           </Menu.Open.Root>
//         )}
//       </Layout.RightPanel>
//     </Layout.Page>
//   );
// }
