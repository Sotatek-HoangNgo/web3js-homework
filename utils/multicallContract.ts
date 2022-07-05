import { getWeb3Instance } from "./contract";

const batchMultipleCall = async (requests: any[]) => {
	let counter = 0;
	const web3 = getWeb3Instance();
	const batch = new web3.BatchRequest();
	const responseData: any[] = [];
	const total = requests.length;

	return new Promise(function (resolve, reject) {
		requests.forEach((request, i) => {
			batch.add(
				request((error: any, data: any) => {
					if (error) return reject(error);

					counter++;
					responseData.push({ i, data });
					if (counter === total) resolve(responseData);
				}),
			);
		});

		batch.execute();
	});
};

export default batchMultipleCall;
