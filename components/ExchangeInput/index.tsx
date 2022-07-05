import { ChangeEvent, useState } from "react";
import styles from "./style.module.css";

interface ComponentProps {
	isDeposit?: boolean;
	onSubmit: (amount: number) => void;
	maximum?: number;
}

const ExchangeInput = ({ onSubmit, isDeposit = false, maximum }: ComponentProps) => {
	const [isLoading, setIsLoading] = useState(false);
	const [amount, setAmount] = useState("");
	const [errorMessages, setErrorMessages] = useState("");

	const onAmountChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
		const inputAmount = e.target.value;

		setAmount(inputAmount);
		if (!Number(inputAmount) || Number(inputAmount) < 0) {
			if (maximum && Number(inputAmount) > maximum) {
				setErrorMessages("Amount exceed maximum");
			} else {
				setErrorMessages("Amount must be a positive number");
			}
		} else {
			setErrorMessages("");
		}
	};

	const onSubmitHandler = async () => {
		if (errorMessages || !Number(amount) || Number(amount) < 0) {
			return;
		}
		try {
			setIsLoading(true);
			await onSubmit(Number(amount));
		} catch (error) {
			console.log(error);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div>
			<input
				type="text"
				value={amount}
				onChange={onAmountChangeHandler}
				placeholder="Input amount here"
				className={styles.input}
			/>
			{errorMessages && <p className={styles["error-message"]}>{errorMessages}</p>}
			<button onClick={onSubmitHandler} className={styles["submit-btn"]} disabled={isLoading}>
				{isDeposit ? "Deposit" : "Withdraw"} ETH
			</button>
		</div>
	);
};

export default ExchangeInput;
