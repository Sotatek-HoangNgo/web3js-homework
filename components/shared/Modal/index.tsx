import { ReactNode } from "react";
import ReactDOM from "react-dom";

import styles from "./style.module.css";

interface ComponentProps {
	onHide: () => void;
	children: ReactNode;
}

const Modal = (props: ComponentProps) => {
	return (
		<>
			{ReactDOM.createPortal(
				<div className={styles["backdrop"]} onClick={props.onHide}></div>,
				document.body,
			)}
			{ReactDOM.createPortal(
				<div className={styles["modal"]}>{props.children}</div>,
				document.body,
			)}
		</>
	);
};

export default Modal;
