import type { AppProps } from "next/app";
import { ThemeProvider } from "@/components/ThemeProvider";
import { GlobalStyles } from "@/components/GlobalStyles";
import { configureChains, createClient, WagmiConfig } from "wagmi";
import { mainnet, polygon, optimism, arbitrum } from "wagmi/chains";
import { CoinbaseWalletConnector } from "wagmi/connectors/coinbaseWallet";
import { InjectedConnector } from "wagmi/connectors/injected";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";
import { publicProvider } from "wagmi/providers/public";
const { chains, provider } = configureChains(
  [mainnet, polygon, optimism, arbitrum],
  [publicProvider()]
);

const wagmiClient = createClient({
  autoConnect: true,
  connectors: [
    new MetaMaskConnector({ chains }),
    new CoinbaseWalletConnector({
      chains,
      options: {
        appName: "wagmi",
      },
    }),
    new WalletConnectConnector({
      chains,
      options: {
        qrcode: true,
      },
    }),
    new InjectedConnector({
      chains,
      options: {
        name: "Injected",
        shimDisconnect: true,
      },
    }),
  ],
  provider,
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig client={wagmiClient}>
      <ThemeProvider>
        <GlobalStyles />
        <Component {...pageProps} />
      </ThemeProvider>
    </WagmiConfig>
  );
}
