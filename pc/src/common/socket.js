import Vue from 'vue';
// import config from '@/config';
// import common from '@/common';

// var httpClient = common.http.init(config.diceApiUrl)
let socket;
let socketTimer;
let isReConnect = true;
var arr = [];

class Socket {
	constructor(url, onOpen, onMessage) {
		this.url = url + "?token=" + localStorage.getItem('token')
		this.onopen = onOpen;
		this.onmessage = onMessage;
		this.reConnect = true;
        this.connect()
	}
	connect() {
        this.socket =new WebSocket(this.url);
		this.socket.onclose = (e)=>{
			this.onclose(e);
		};
		this.socket.onopen=()=>{
			//创建心跳包
			this.timer = setInterval(()=>{
				this.send({type:'heartbeat'});
			}, 1000*30);
			this.onopen();
		};
		this.socket.onmessage=(e)=>{
            this.onmessage(e);
        };
		this.socket.onerror=(e)=>{
			this.onerror(e);
		};
	}
	onclose(e) {
		console.error("socket关闭")
		if (!this.reConnect) return;
		if (this.timer) clearInterval(this.timer);
		setTimeout(()=>{
			this.connect();
		}, 1000*3);
	}
	onerror(e) {
		console.error("socket错误")
	}
	send(data) {
		this.socket.send(JSON.stringify(data));
	}
	close() {
		this.reConnect = false;
		if (this.timer)
			clearInterval(this.timer);
		this.socket.close();
	}
}

export default {
	Socket
}
