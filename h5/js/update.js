import config from '@/config';
import common from '@/common';
import base from '@/api/base';

function hotUpdate(url,note) {
	uni.showModal({
		title: '发现新版本',
		content: note ? note : '是否选择更新',
		success: (showResult) => {
			if (showResult.confirm) {
				plus.nativeUI.showWaiting("更新APP中...");
				uni.downloadFile({
					url: url,
					success: (downloadResult) => {
						plus.nativeUI.closeWaiting();
						//console.log(downloadResult)
						if (downloadResult.statusCode === 200) {
							console.log(downloadResult.tempFilePath)
							plus.runtime.install(downloadResult.tempFilePath, {
								force: false
							}, function() {
								console.log('install success...');
								plus.nativeUI.alert("应用资源更新完成！", function() {
									plus.runtime.restart();
								});
							}, function(e) {
								plus.nativeUI.alert("更新失败[" + e.code + "]：" + e.message);
							});
						} else {
							common.util.showToast('下载更新文件失败')
						}
					},
					fail() {
						plus.nativeUI.closeWaiting();
					},
					complete: () => {

					}
				});
			}
		}
	});
}

function coldUpdate(url, note) {
	// 提醒用户更新
	uni.showModal({
		title: '发现新版本',
		content: note ? note : '是否选择更新',
		success: (showResult) => {
			if (showResult.confirm) {
				plus.runtime.openURL(url);
			}
		}
	})
}
//更新
function update(data) {
	plus.nativeUI.showWaiting("更新APP中...");
	let type;
	switch (plus.os.name) {
		case "Android": // Android平台
			if (!data.androidUpUrl) return false;
			type = data.androidUpUrl.slice(data.androidUpUrl.lastIndexOf(".") + 1);
			//console.log(type)
			if (type == "wgt") { //热更新
				hotUpdate(data.androidUpUrl, data.content);
			} else { //冷更新
				coldUpdate(data.androidUpUrl, data.content);
			}
			break;
		case "iOS": // iOS平台
			if (!data.iosUpUrl) return false;
			type = data.iosUpUrl.slice(data.iosUpUrl.lastIndexOf(".") + 1);
			//console.log(type)
			if (type == "wgt") { //热更新
				hotUpdate(data.iosUpUrl, data.content);
			} else { //冷更新
				coldUpdate(data.iosUpUrl, data.content);
			}
			break;
		default:
			// 其它平台
			break;
	}
	//记录此次时间
	let timestamp = Date.parse(new Date()); //当前日期时间戳
	uni.setStorageSync('autoUpdate', {
		'startTime': timestamp + ''
	})
	plus.nativeUI.closeWaiting();
}

//手工更新
async function handUpdate() {
	let [remoteVer, data] = await checkVersion()
	console.log(remoteVer)
	if (remoteVer == undefined) {
		common.util.showToast('获取新版本号失败');
		console.log('手动更新-获取不到新版本信息');
		return false;
	}
	remoteVer = parseFloat(remoteVer.replace(/\D/g, ""))
	let localVer = await getCurrentVersion();
	localVer = parseFloat(localVer.replace(/\D/g, ""))
	//远程版本大于本地版本，就更新
	if (remoteVer > localVer) {
		// console.log('222')
		// console.log(data)
		update(data);
	}
}

//自动更新
async function autoUpdate() {
	//检查更新时间
	let nowstamp = Date.parse(new Date()); //当前日期时间戳
	let autoUpdate = uni.getStorageSync('autoUpdate');
	let startTime = autoUpdate.startTime
	if (nowstamp - startTime < config.update.expires) {
		return false;
	}

	let [remoteVer, data] = await checkVersion()
	if (data == undefined) {
		console.log('自动更新-获取不到新版本信息')
		return false;
	}
	let auto = data.force;
	//如果不自动更新，退出
	if (!auto) {
		return;
	}
	remoteVer = parseFloat(remoteVer.replace(/\D/g, ""))

	let localVer = await getCurrentVersion();

	localVer = parseFloat(localVer.replace(/\D/g, ""))
	//远程版本大于本地版本，就更新
	if (remoteVer > localVer) {
		update(data);
	}
}

//检测新版本号
function checkVersion() {
	return new Promise(async function(resolve, reject) {
		var data;
		var newVer;
		try {
			let res = await base.updateUrl('EXCHANGE');
			console.log(res)
			data = res.data;
			newVer = data.build
			resolve([newVer, data])
		} catch (e) {
			reject(e);
		}
	})
}

//获取当前版本号
function getCurrentVersion(callback) {
	return new Promise(function(resolve, reject) {
		plus.runtime.getProperty(plus.runtime.appid, function(inf) {
			//wgtVer=inf.version;  
			// console.log("当前应用版本：" + inf.version);
			resolve(inf.version)
		});
	})
}

module.exports = {
	checkVersion,
	getCurrentVersion,
	autoUpdate,
	handUpdate
}