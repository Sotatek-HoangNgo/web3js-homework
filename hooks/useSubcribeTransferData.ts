import { useEffect } from "react";
import { getContractInstance } from "~/utils/contract";

export default function useSubcribeTransferData(
	eventHandler: (data: any) => void,
	lastblock: number,
) {
	const subscribeTransferEvent = async () => {
		const contractor = getContractInstance();
		if (!contractor) {
			return null;
		}

		contractor.events.Transfer({ from: lastblock }).on("data", eventHandler);
	};

	useEffect(() => {
		if (lastblock === 0) {
			return;
		}

		subscribeTransferEvent();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [lastblock]);
}
