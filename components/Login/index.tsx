import { ReactNode, useEffect, useState } from "react";
import { InjectedConnector } from "wagmi/connectors/injected";
import { Connector, useAccount, useConnect, useDisconnect, useSignMessage } from "wagmi";

import Modal from "~/components/shared/Modal";
import styles from "./style.module.css";

interface ComponentProps {
	onLoginSuccess?: (account: string) => void;
	children: ReactNode;
}

const Login = ({ onLoginSuccess, children }: ComponentProps) => {
	const { address: account } = useAccount();
	const { connect, connectors } = useConnect({ connector: new InjectedConnector() });
	const { disconnect } = useDisconnect();

	const [showConnectModal, setShowConnectModal] = useState(false);
	const [isVerified, setIsVerified] = useState(false);
	const { signMessageAsync: signMessage, isLoading: isSigningMessage } = useSignMessage();

	const onShowConnectModalHandler = () => {
		setShowConnectModal(true);
	};

	const onHideConnectModalHandler = () => {
		setShowConnectModal(false);
	};

	const onConnectWallet = (connector: Connector<any>) => {
		return () => connect({ connector });
	};

	const onLoginHandler = async () => {
		try {
			const signedString = await signMessage({
				message: process.env.NEXT_PUBLIC_SIGN_MESSSAGE || "",
			});
			setIsVerified(true);
			onLoginSuccess?.(account || "");
		} catch (error) {
			console.log(error);
		}
	};

	const onLogoutHandler = () => {
		setShowConnectModal(false);
		setIsVerified(false);
		disconnect();
	};

	useEffect(() => {
		if (!account && isVerified) {
			onLogoutHandler();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [account, isVerified]);

	if (!account) {
		if (!showConnectModal) {
			return <button onClick={onShowConnectModalHandler}>Connect wallet</button>;
		}

		return (
			<Modal onHide={onHideConnectModalHandler}>
				<div className={styles.container}>
					{connectors.map((connector) => {
						return (
							<button
								className={styles.btn}
								key={connector.id}
								onClick={onConnectWallet(connector)}>
								Connect with {connector.name}
							</button>
						);
					})}
				</div>
			</Modal>
		);
	}

	if (!isVerified) {
		return (
			<Modal onHide={onHideConnectModalHandler}>
				<div className={styles.container}>
					<p>Your wallet address: {account}</p>
					<button onClick={onLoginHandler} disabled={isSigningMessage}>
						Login
					</button>
				</div>
			</Modal>
		);
	}

	return (
		<div className={styles["container--loged-in"]}>
			{children}
			<button onClick={onLogoutHandler}>Disconnect wallet</button>
		</div>
	);
};

export default Login;
