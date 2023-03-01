import { useEffect, useMemo } from "react";
import { useAccount, useConnect, useDisconnect, useSigner } from "wagmi";
import { Wallet } from "ethers";
import { create } from "zustand";
import { useXmtp } from "@relaycc/xmtp-hooks";

const useAuthStore = create<{
  burner: Wallet | null;
  setBurner: (burner: Wallet | null) => void;
}>((set) => ({
  burner: null,
  setBurner: (burner) => set({ burner }),
}));

export const useAuth = () => {
  /* **************************************************************************
   * Burner Wallet
   * *************************************************************************/

  const burner = useAuthStore((state) => state.burner);
  const setBurner = useAuthStore((state) => state.setBurner);
  const isBurner = burner !== null;

  /* **************************************************************************
   * IS CONNECTED
   * *************************************************************************/

  const { isConnected: isWagmiConnected } = useAccount();
  const isConnected = isBurner || isWagmiConnected;

  /* **************************************************************************
   * CONNECT
   * *************************************************************************/

  const { connectAsync: wagmiConnect, connectors } = useConnect();

  const connect = useMemo(() => {
    if (isConnected) {
      return null;
    } else {
      const connector = connectors.find((c) => c.id === "metaMask");
      if (connector === undefined) {
        throw new Error("MetaMask not found");
      } else {
        return () => wagmiConnect({ connector });
      }
    }
  }, [isConnected, wagmiConnect, connectors]);

  /* **************************************************************************
   * DISCONNECT
   * *************************************************************************/

  const { disconnect: wagmiDisconnect } = useDisconnect();

  const disconnect = useMemo(() => {
    if (!isConnected) {
      return null;
    } else {
      if (isBurner) {
        return () => setBurner(null);
      } else {
        return () => wagmiDisconnect();
      }
    }
  }, [isConnected, isBurner, setBurner, wagmiDisconnect]);

  /* **************************************************************************
   * SIGNER
   * *************************************************************************/

  const { data: wagmiSigner } = useSigner();

  const signer = useMemo(() => {
    if (isBurner) {
      return burner;
    } else {
      return wagmiSigner;
    }
  }, [isBurner, burner, wagmiSigner]);

  /* **************************************************************************
   * WALLET ADDRESS
   * *************************************************************************/

  const { address: wagmiAddress } = useAccount();

  const address = useMemo(() => {
    if (isBurner) {
      return burner.address;
    } else {
      return wagmiAddress;
    }
  }, [isBurner, burner, wagmiAddress]);

  /* **************************************************************************
   * XMTP AND CACHED XMTP
   * *************************************************************************/

  const cachedXmtpClient = useMemo(() => {
    if (address === undefined) {
      return null;
    } else {
      const key = `relay-xmtp-${address}`;
      const cached = localStorage.getItem(key);
      return cached;
    }
  }, [address]);

  const setCachedXmtpClient = useMemo(() => {
    if (address === undefined) {
      return null;
    } else {
      return (client: string) => {
        const key = `relay-xmtp-${address}`;
        localStorage.setItem(key, client);
      };
    }
  }, [address]);

  const xmtpOpts = useMemo(() => {
    if (cachedXmtpClient === null) {
      return { clientAddress: address, wallet: signer };
    } else {
      return {
        clientAddress: address,
        wallet: null,
        opts: { privateKeyOverride: cachedXmtpClient },
      };
    }
  }, [address, cachedXmtpClient, signer]);

  const {
    client,
    startClient,
    isClientIdle,
    isClientPending,
    isClientSuccess,
    isClientError,
  } = useXmtp(xmtpOpts);

  useEffect(() => {
    if (client?.export === undefined) {
      return;
    } else {
      if (typeof client.export !== "string" || setCachedXmtpClient === null) {
        return;
      } else {
        setCachedXmtpClient(client.export);
      }
    }
  }, [isClientSuccess, client, setCachedXmtpClient]);

  /* **************************************************************************
   * IS SIGNATURE NEEDED
   * *************************************************************************/

  const isSignatureNeeded =
    !isBurner && cachedXmtpClient === null && !isClientSuccess;

  /* **************************************************************************
   * IS AUTHED
   * *************************************************************************/

  const isAuthed = useMemo(() => {
    return isClientSuccess && address === client?.address;
  }, [isClientSuccess, address, client]);

  /* **************************************************************************
   * RETURN
   * *************************************************************************/

  return {
    isAuthed,
    isBurner,
    setBurner,
    connect,
    disconnect,
    isConnected,
    address,
    signer,
    isSignatureNeeded,
    isClientIdle,
    isClientPending,
    isClientSuccess,
    isClientError,
    client,
    startClient,
  };
};
