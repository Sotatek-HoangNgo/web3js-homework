export const numberFormater = (num: number, maxDecimal: number = 18) => {
	return new Intl.NumberFormat("vi-VN", { maximumSignificantDigits: maxDecimal }).format(num);
};

const converter = (wei: number) => {
	return wei / 10 ** 18;
};
export default converter;
