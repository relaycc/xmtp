import {
  FunctionComponent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import * as ButtonPrimary from "@/components/ButtonPrimary";
import { useAuth } from "@/hooks/useAuth";
import { start } from "repl";
import { AsyncState } from "@/lib/AsyncState";
import { motion } from "framer-motion";
import Image from "next/image";

export const EnableXmtp = ({
  onXmtpEnabled,
}: {
  onXmtpEnabled: () => void;
}) => {
  /* **************************************************************************
   * AUTH
   * *************************************************************************/

  const {
    connect,
    isConnected,
    isClientIdle,
    isClientError,
    isClientPending,
    isClientSuccess,
    isSignatureNeeded,
    startClient,
  } = useAuth();

  /* **************************************************************************
   * NOT CONNECTED -> CONNECTED
   * *************************************************************************/

  const [isConnectedSuccess, setIsConnectedSuccess] = useState(false);

  useEffect(() => {
    if (!isConnected) {
      return;
    } else {
      setTimeout(() => setIsConnectedSuccess(true), 1500);
    }
  }, [isConnected]);

  /* **************************************************************************
   * AUTO AUTH AFTER CONNECTED
   * *************************************************************************/

  const [isInitializedSuccess, setIsInitializedSuccess] = useState(false);

  useEffect(() => {
    if (isSignatureNeeded) {
      return;
    }
    if (!isConnectedSuccess) {
      return;
    }
    startClient && startClient();
    setTimeout(() => setIsInitializedSuccess(true), 1500);
  }, [isSignatureNeeded, isConnectedSuccess, startClient]);

  /* **************************************************************************
   * AUTO LAUNCH AFTER AUTO AUTH
   * *************************************************************************/

  const [launch, setLaunch] = useState<AsyncState<boolean>>({
    id: "idle",
  });

  const isLaunchIdle = launch.id === "idle";
  const isLaunchPending = launch.id === "pending";

  const launchApp = useCallback(() => {
    setLaunch({ id: "pending" });
    setTimeout(() => onXmtpEnabled(), 1500);
  }, [onXmtpEnabled]);

  useEffect(() => {
    if (isSignatureNeeded) {
      return;
    }
    if (!isInitializedSuccess) {
      return;
    }
    launchApp();
  }, [isSignatureNeeded, isInitializedSuccess, launchApp]);

  /* **************************************************************************
   * RENDER
   * *************************************************************************/

  const showClientError = isClientError;
  const showConnectedIdle = !isConnected;
  const showConnectedPending = isConnected && !isConnectedSuccess;
  const showConnectedSuccess = (() => {
    if (!isSignatureNeeded) {
      return false;
    } else {
      return isConnectedSuccess && isClientIdle;
    }
  })();
  const showWaitingForSignature = (() => {
    if (!isSignatureNeeded) {
      return false;
    } else {
      return isClientPending;
    }
  })();
  const showInitializing = (() => {
    if (isSignatureNeeded) {
      return false;
    } else {
      return isConnectedSuccess && !isInitializedSuccess;
    }
  })();
  const showClientSuccess = (() => {
    if (!isSignatureNeeded) {
      return false;
    } else {
      return isClientSuccess && isLaunchIdle;
    }
  })();
  const showLaunchPending = isClientSuccess && isLaunchPending;

  const showFallback =
    !showConnectedIdle &&
    !showConnectedPending &&
    !showConnectedSuccess &&
    !showWaitingForSignature &&
    !showInitializing &&
    !showClientSuccess &&
    !showLaunchPending &&
    !showClientError;

  return (
    <>
      {showFallback && (
        <>
          <ButtonPrimary.Base disabled>Enable XMTP</ButtonPrimary.Base>
          <ButtonPrimary.Base disabled>Launch App</ButtonPrimary.Base>
        </>
      )}
      {showConnectedIdle && (
        <>
          <ButtonPrimary.Base
            onClick={async () => {
              if (connect === null) {
                throw new Error("connect is null");
              } else {
                await connect();
              }
            }}
          >
            Connect A Wallet
          </ButtonPrimary.Base>
          <ButtonPrimary.Base disabled>Enable XMTP</ButtonPrimary.Base>
          <ButtonPrimary.Base disabled>Launch App</ButtonPrimary.Base>
        </>
      )}
      {showConnectedPending && (
        <>
          <ButtonPrimary.Pending>Connecting</ButtonPrimary.Pending>
          <ButtonPrimary.Base disabled>Enable XMTP</ButtonPrimary.Base>
          <ButtonPrimary.Base disabled>Launch App</ButtonPrimary.Base>
        </>
      )}
      {showConnectedSuccess && (
        <>
          <ButtonPrimary.Success>Connected!</ButtonPrimary.Success>
          <ButtonPrimary.Base
            onClick={() => {
              if (startClient === null) {
                throw new Error("startClient is null");
              } else {
                startClient();
              }
            }}
          >
            Enable XMTP
          </ButtonPrimary.Base>
          <ButtonPrimary.Base disabled>Launch App</ButtonPrimary.Base>
        </>
      )}
      {showInitializing && (
        <>
          <ButtonPrimary.Success>Connected!</ButtonPrimary.Success>
          <ButtonPrimary.Pending>Initializing</ButtonPrimary.Pending>
          <ButtonPrimary.Base disabled>Launch App</ButtonPrimary.Base>
        </>
      )}
      {showWaitingForSignature && (
        <>
          <ButtonPrimary.Success>Connected!</ButtonPrimary.Success>
          <ButtonPrimary.Pending>Sign Message</ButtonPrimary.Pending>
          <ButtonPrimary.Base disabled>Launch App</ButtonPrimary.Base>
        </>
      )}
      {showClientSuccess && (
        <>
          <ButtonPrimary.Success>Connected!</ButtonPrimary.Success>
          <ButtonPrimary.Success>XMTP Enabled!</ButtonPrimary.Success>
          <ButtonPrimary.Base onClick={launchApp}>
            Launch App
          </ButtonPrimary.Base>
        </>
      )}
      {showLaunchPending && (
        <>
          <ButtonPrimary.Success>Connected!</ButtonPrimary.Success>
          <ButtonPrimary.Success>XMTP Enabled!</ButtonPrimary.Success>
          <ButtonPrimary.Pending>Launching App</ButtonPrimary.Pending>
        </>
      )}
    </>
  );
};
