import { useEffect, useState } from "react";

export default function useComponentIsMounted() {
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	return isMounted;
}
