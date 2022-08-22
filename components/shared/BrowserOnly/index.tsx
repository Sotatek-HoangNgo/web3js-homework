import React from "react";
import useComponentIsMounted from "~/hooks/useComponentIsMounted";

interface ComponentProps {
	children: React.ReactNode;
}

const BrowserOnly = ({ children }: ComponentProps) => {
	const isMounted = useComponentIsMounted();

	return <React.Fragment>{isMounted ? children : undefined}</React.Fragment>;
};

export default BrowserOnly;
