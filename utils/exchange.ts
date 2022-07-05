import { getContractInstance } from "./contract";

export const depositETH = async (amount: number) => {
	const contract = getContractInstance();
	if (!contract) {
		throw new Error("Can't connect to smart contract");
	}

	try {
		const result = await contract.methods.deposit().send({
			from: process.env.NEXT_PUBLIC_MY_WALLET_ADDRESS || "",
		});
		console.log(result);
	} catch (error) {
		throw error;
	}
};

export const withdrawETH = async (amount: number) => {
	const contract = getContractInstance();
	if (!contract) {
		throw new Error("Can't connect to smart contract");
	}

	try {
		const result = await contract.methods.withdraw(amount).send({
			from: process.env.NEXT_PUBLIC_MY_WALLET_ADDRESS || "",
		});
		console.log(result);
	} catch (error) {
		throw error;
	}
};
