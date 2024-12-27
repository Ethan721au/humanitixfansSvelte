export const useTest2 = (initialCart: Cart | undefined) => {
	const testing = $state(initialCart || { lines: [] });
	console.log(testing);
	return initialCart;
};
