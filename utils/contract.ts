import Web3 from "web3";
import abi from "~/abi/rinkebyABI.json";
import multicallContract from "~/utils/multicallContract";

export const walletAddresses = [
	"0x70c96c78c25fcbd64186a797bb0851be5732402e",
	"0x70c96c78c25fcbd64186a797bb0851be5732402e",
	"0xec042d53e681669e0ea921c376f551530809d136",
	"0xdb73ae2e26ee6346e57b2efb61cc8197dc848ddf",
	"0x1aa6ccfe2484d56c3f85fe2dc10afedf5b494fe3",
	"0x70c96c78c25fcbd64186a797bb0851be5732402e",
	"0x1aa6ccfe2484d56c3f85fe2dc10afedf5b494fe3",
	"0x159feac6f0f119770655172894050f8b64830614",
	"0xb194d98cb872ee26a9a73d774680937114a05167",
	"0xf9acd81d4b97e725bd49165e6f983e44d6d8f11e",
	"0xaf5fd40b05aff3fa89072d8b8082ba69148c0d3b",
];

export function convertWalletToWalletBalanceQuery(contract: any) {
	if (contract) {
		return walletAddresses.map((walletAddress) => {
			return (callback: any) =>
				contract.balanceOf(walletAddress).call.request(
					{
						from: process.env.NEXT_PUBLIC_MY_WALLET_ADDRESS,
					},
					callback,
				);
		});
	}

	return [];
}

export async function getWalletsBalances(contract: any) {
	return await multicallContract(convertWalletToWalletBalanceQuery(contract));
}

export function getWeb3Instance() {
	const web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");
	return web3;
}

export function getContractInstance(
	abiJson: any = abi,
	address: string | undefined = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
) {
	const web3 = getWeb3Instance();
	if (!web3) {
		return null;
	}

	const contract = new web3.eth.Contract(abiJson, address);
	return contract;
}

export async function getAccountBallances(
	walletAddress: string = process.env.NEXT_PUBLIC_MY_WALLET_ADDRESS || "",
	contract: any,
) {
	if (contract) {
		const accountBallance = await contract.balanceOf(walletAddress);
		return accountBallance;
	}

	return -1;
}

export async function getTokenSymbol(contract: any) {
	if (contract) {
		const tokenSymbol = await contract.symbol();
		return tokenSymbol;
	}

	return "";
}

export async function getBlockNumber() {
	const web3 = getWeb3Instance();
	if (!web3) {
		return -1;
	}

	const blockNumber = await web3.eth.getBlockNumber();

	return blockNumber;
}

export async function handlerTransferEventOnLast100Blocks(lastblock: number) {
	if (lastblock === -1) {
		return [];
	}

	const constractConnection = getContractInstance();
	if (!constractConnection) {
		return [];
	}

	const events = await constractConnection.getPastEvents("Transfer", {
		fromBlock: lastblock - 100,
		toBlock: lastblock,
	});
	return events;
}
