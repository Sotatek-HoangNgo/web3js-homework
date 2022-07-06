import { useWeb3React } from "@web3-react/core";
import styles from "./style.module.css";

const Header = () => {
	const web3Context = useWeb3React();
	console.log(web3Context);

	return <header className={styles.header}></header>;
};

export default Header;
