import styles from "./style.module.css";

interface ComponentProps {
	balances: Array<{
		address: string;
		balance: string;
	}>;
}

const WalletsBalance = ({ balances }: ComponentProps) => {
	return (
		<div className={styles["table-container"]}>
			<table className={styles.table}>
				<thead>
					<tr>
						<th>No.</th>
						<th>Wallet Address</th>
						<th>Balance</th>
					</tr>
				</thead>
				<tbody>
					{balances.length > 0 ? (
						balances.map((data, index: number) => {
							return (
								<tr key={index}>
									<td className={styles["table-cell"]}>{index + 1}</td>
									<td className={styles["table-cell"]}>{data.address}</td>
									<td className={styles["table-cell"]}>{data.balance} ETH</td>
								</tr>
							);
						})
					) : (
						<tr>
							<td colSpan={3} className={styles["empty-cell-message"]}>
								No data
							</td>
						</tr>
					)}
				</tbody>
			</table>
		</div>
	);
};

export default WalletsBalance;
