import Vue from 'vue';
import config from '@/config';
import common from '@/common';

// var httpClient = common.http.init(config.diceApiUrl)
let socket;
let socketTimer;
let isReConnect = true;
var arr = [];

class WebSocket {
	constructor(url, onOpen, onMessage) {
		this.url = url + "?token=" + uni.getStorageSync("token")
		this.onOpen = onOpen;
		this.onMessage = onMessage;
		this.reConnect = true;
		this.connect()
	}
	connect() {
		this.socket = uni.connectSocket({
			url: this.url,
			protocols: [],
			fail: e => console.log(e),
			success: e => {},
		});
		this.socket.onClose((e)=>{
			this.onClose(e);
		});
		this.socket.onOpen(()=>{
			//创建心跳包
			this.timer = setInterval(()=>{
				this.send({type:'heartbeat'});
			}, 1000*30);
			this.onOpen();
		});
		this.socket.onMessage(this.onMessage);
		this.socket.onError((e)=>{
			this.onError(e);
		});
	}
	onClose(e) {
		console.error("socket关闭")
		if (!this.reConnect) return;
		if (this.timer) clearInterval(this.timer);
		setTimeout(()=>{
			this.connect();
		}, 1000*3);
	}
	onError(e) {
		console.error("socket错误")
	}
	send(data) {
		this.socket.send({data:JSON.stringify(data)});
	}
	close() {
		this.reConnect = false;
		if (this.timer)
			clearInterval(this.timer);
		this.socket.close();
	}
}

export default {
	// async getCoins() {
	// 	return (await httpClient.get("/coins")).data;
	// },
	WebSocket
}
