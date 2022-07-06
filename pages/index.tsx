import type { NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import {
	getBlockNumber,
	getAccountBallances,
	handlerTransferEventOnLast100Blocks,
	getTokenSymbol,
	getWalletsBalances,
	walletAddresses,
} from "~/utils/contract";
import useSubcribeTransferData from "~/hooks/useSubcribeTransferData";
import styles from "../styles/Home.module.css";
import TransferDataList from "~/components/TransferDataList/TransferDataList";
import { useWeb3React } from "@web3-react/core";
import { connectors } from "~/utils/connectors";
import { NETWORK_NAMES } from "~/constants/networks";
import ExchangeInput from "~/components/ExchangeInput";
import { depositETH, withdrawETH } from "~/utils/exchange";
import WeiToETHConverted, { numberFormater } from "~/utils/WeiToETHConverted";
import WalletsBalance from "~/components/WalletsBalance";

const Home: NextPage = () => {
	const [account, setAccount] = useState("");
	const [walletBalance, setWalletBalance] = useState("0");
	const [tokenSymbol, setTokenSymbol] = useState("");
	const [transferedData, setTransferedData] = useState<any[]>([]);
	const [dataTransferedFromNow, setDataTransferedFromNow] = useState<any[]>([]);
	const [blockNumber, setBlockNumber] = useState(0);
	const [walletsBalance, setWalletsBalance] = useState([]);

	const context = useWeb3React();

	const getUserWalletBallance = async () => {
		const balance = await getAccountBallances(account);

		if (balance === -1) {
			return null;
		}

		setWalletBalance(numberFormater(WeiToETHConverted(Number(balance))));
	};

	const getTransferdBlockData = async () => {
		const blockCount = await getBlockNumber();
		const data = await handlerTransferEventOnLast100Blocks(blockCount);
		setTransferedData(data);
		setBlockNumber(blockCount);
	};

	const onTransferHandler = (transferedData: any) => {
		setDataTransferedFromNow((data) => data.concat(transferedData));
	};

	const get10WalletBalances = async () => {
		const balances = await getWalletsBalances();
		setWalletsBalance(
			(balances as any[]).reduce((wallets: any[], balance: { i: number; data: string }) => {
				wallets[balance.i] = {
					address: walletAddresses[balance.i],
					balance: numberFormater(WeiToETHConverted(Number(balance.data))),
				};
				return wallets;
			}, new Array(10)),
		);
	};

	const getContractTokenSymbol = async () => {
		const symbol = await getTokenSymbol();
		setTokenSymbol(symbol);
	};

	const connectToMetamask = async () => {
		try {
			await context.activate(connectors.Metamask, undefined, true);
		} catch (error: any) {
			console.log(error);
			alert(error.message);
		}
	};

	const connectToWalletConnect = async () => {
		try {
			await context.activate(connectors.WalletConnect, undefined, true);
		} catch (error: any) {
			console.log(error);
			alert(error.message);
		}
	};

	const onDepositHandler = async (amount: number) => {
		try {
			await depositETH(amount);
			await getUserWalletBallance();
		} catch (error: any) {
			console.log(error);
			alert(error.message);
		}
	};

	const onWithdrawHandler = async (amount: number) => {
		try {
			await withdrawETH(amount);
			await getUserWalletBallance();
		} catch (error: any) {
			console.log(error);
			alert(error.message);
		}
	};

	const disconnectWalletHandler = async () => {
		context.deactivate();
		setAccount("");
	};

	useSubcribeTransferData(onTransferHandler, blockNumber);

	useEffect(() => {
		get10WalletBalances();
		getTransferdBlockData();
	}, []);

	useEffect(() => {
		if (context.active) {
			setAccount(context.account as string);
		} else {
			setAccount("");
		}
	}, [context.active]);

	useEffect(() => {
		if (account) {
			getContractTokenSymbol();
			getUserWalletBallance();
		}
	}, [account]);

	return (
		<div className={styles.container}>
			<Head>
				<title>Create Next App</title>
				<meta name="description" content="Generated by create next app" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<main className={styles.main}>
				{account ? (
					<div className={styles["account-container"]}>
						<div className={styles["account-info"]}>
							<p>Your account address: {account}</p>
							<p>Your ETH balance: {walletBalance} ETH</p>
							<p>
								Your WETH balance: {walletBalance} {tokenSymbol}
							</p>
							<p>
								Network:{" "}
								<span style={{ textTransform: "capitalize" }}>
									{NETWORK_NAMES[context.chainId as number]}
								</span>
							</p>
							<ExchangeInput isDeposit onSubmit={onDepositHandler} />
							<ExchangeInput onSubmit={onWithdrawHandler} />
						</div>
						<button onClick={disconnectWalletHandler}>Disconnect wallet</button>
					</div>
				) : (
					<div>
						<button className={styles.btn} onClick={connectToMetamask}>
							Connect with Metamask
						</button>
						<button className={styles.btn} onClick={connectToWalletConnect}>
							Connect with WalletConnect
						</button>
					</div>
				)}
				<h4 className={styles["section-title"]}>Transfer data on last 100 block:</h4>
				<TransferDataList data={transferedData} />
				<h4 className={styles["section-title"]}>Data get by listen to transfer event:</h4>
				<TransferDataList data={dataTransferedFromNow} />
				<h4 className={styles["section-title"]}>Balance of 10 wallet address:</h4>
				<WalletsBalance balances={walletsBalance} />
			</main>
		</div>
	);
};

export default Home;
