
let prices = {last:new Date().getTime(), data:JSON.parse(localStorage.getItem('prices'))};

export default {
	getPrices() {
		if (new Date().getTime() - 3*1000 > prices["last"]) {
			prices.last = new Date().getTime();
			prices.data = JSON.parse(localStorage.getItem('prices'));
		}
		return prices.data;
	}
}