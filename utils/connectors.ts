import { InjectedConnector } from "@web3-react/injected-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";

const Metamask = new InjectedConnector({ supportedChainIds: [1, 4] });

const WalletConnect = new WalletConnectConnector({
	supportedChainIds: [1, 4],
	rpc: { 1: `https://mainnet.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_KEY}` },

	bridge: "https://bridge.walletconnect.org",

	qrcode: true,
});

export const connectors = { Metamask, WalletConnect };
