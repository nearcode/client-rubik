
let prices = {last:new Date().getTime(), data:uni.getStorageSync('prices')};

export default {
	getPrices() {
		if (new Date().getTime() - 3*1000 > prices["last"]) {
			prices.last = new Date().getTime();
			prices.data = uni.getStorageSync('prices');
		}
		return prices.data;
	}
}