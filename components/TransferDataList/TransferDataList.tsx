import styles from "./TransferDataList.module.css";

interface TransactionData {
	raw: {
		data: string;
	};
	transactionHash: string;
	blockNumber: number;
}

interface ComponentProps {
	data: TransactionData[];
}

const TransferDataList = ({ data }: ComponentProps) => {
	return (
		<div className={styles["table-container"]}>
			<table className={styles.table}>
				<thead>
					<tr>
						<th>No.</th>
						<th>Transaction Hash</th>
						<th>Block Number</th>
						<th>Data</th>
					</tr>
				</thead>
				<tbody>
					{data.length > 0 ? (
						data.map((data: any, index: number) => {
							return (
								<tr key={index}>
									<td>{index + 1}</td>
									<td>{data.transactionHash}</td>
									<td>{data.blockNumber}</td>
									<td>{data.raw.data}</td>
								</tr>
							);
						})
					) : (
						<tr>
							<td colSpan={4} className={styles["empty-cell-message"]}>
								No data
							</td>
						</tr>
					)}
				</tbody>
			</table>
		</div>
	);
};

export default TransferDataList;
