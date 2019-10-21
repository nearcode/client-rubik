'use strict'

var setting;

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]")
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search)
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "))
}

/**
 * param 将要转为URL参数字符串的对象
 * key URL参数字符串的前缀
 * encode true/false 是否进行URL编码,默认为true
 *
 * return URL参数字符串
 */
function urlEncode(param, key, encode) {
    if (param == null) return '';
    var paramStr = '';
    var t = typeof (param);
    if (t == 'string' || t == 'number' || t == 'boolean') {
        paramStr += '&' + key + '=' + ((encode == null || encode) ? encodeURIComponent(param) : param);
    } else {
        for (var i in param) {
            var k = key == null ? i : key + (param instanceof Array ? '[' + i + ']' : '.' + i);
            paramStr += urlEncode(param[i], k, encode);
        }
    }
    return paramStr;
};

function addHistory(ticker) {
    for (var prop in window.subscribers) {
        if (window.subscribers.hasOwnProperty(prop)) {
            window.subscribers[prop](ticker)
        }
    }
}

function getOverrides(e) {
    var t = {
        white: {
            up: "#03c087",
            down: "#ef5555",
            bg: "#fbfbfb",
            grid: "#f7f8fa",
            cross: "#23283D",
            border: "#9194a4",
            text: "#9194a4",
            areatop: "rgba(71, 78, 112, 0.1)",
            areadown: "rgba(71, 78, 112, 0.02)",
            line: "#737375"
        },
        black: {
            up: "#589065",
            down: "#ae4e54",
            bg: "#181B2A",
            grid: "#1f2943",
            cross: "#9194A3",
            border: "#4e5b85",
            text: "#61688A",
            areatop: "rgba(122, 152, 247, .1)",
            areadown: "rgba(122, 152, 247, .02)",
            line: "#737375"
        },
        mobile: {
            up: "#03C087",
            down: "#E76D42",
            bg: "#ffffff",
            grid: "#f7f8fa",
            cross: "#23283D",
            border: "#C5CFD5",
            text: "#8C9FAD",
            areatop: "rgba(71, 78, 112, 0.1)",
            areadown: "rgba(71, 78, 112, 0.02)",
            showLegend: !0
        }
    }[e];
    return {
        volumePaneSize: "small",
        "scalesProperties.lineColor": t.text,
        "scalesProperties.textColor": t.text,
        "paneProperties.background": t.bg,
        "paneProperties.vertGridProperties.color": t.grid,
        "paneProperties.horzGridProperties.color": t.grid,
        "paneProperties.crossHairProperties.color": t.cross,
        "paneProperties.legendProperties.showLegend": !!t.showLegend,
        "paneProperties.legendProperties.showStudyArguments": !0,
        "paneProperties.legendProperties.showStudyTitles": !0,
        "paneProperties.legendProperties.showStudyValues": !0,
        "paneProperties.legendProperties.showSeriesTitle": !0,
        "paneProperties.legendProperties.showSeriesOHLC": !0,
        "mainSeriesProperties.candleStyle.upColor": t.up,
        "mainSeriesProperties.candleStyle.downColor": t.down,
        "mainSeriesProperties.candleStyle.drawWick": !0,
        "mainSeriesProperties.candleStyle.drawBorder": !0,
        "mainSeriesProperties.candleStyle.borderColor": t.border,
        "mainSeriesProperties.candleStyle.borderUpColor": t.up,
        "mainSeriesProperties.candleStyle.borderDownColor": t.down,
        "mainSeriesProperties.candleStyle.wickUpColor": t.up,
        "mainSeriesProperties.candleStyle.wickDownColor": t.down,
        "mainSeriesProperties.candleStyle.barColorsOnPrevClose": !1,
        "mainSeriesProperties.hollowCandleStyle.upColor": t.up,
        "mainSeriesProperties.hollowCandleStyle.downColor": t.down,
        "mainSeriesProperties.hollowCandleStyle.drawWick": !0,
        "mainSeriesProperties.hollowCandleStyle.drawBorder": !0,
        "mainSeriesProperties.hollowCandleStyle.borderColor": t.border,
        "mainSeriesProperties.hollowCandleStyle.borderUpColor": t.up,
        "mainSeriesProperties.hollowCandleStyle.borderDownColor": t.down,
        "mainSeriesProperties.hollowCandleStyle.wickColor": t.line,
        "mainSeriesProperties.haStyle.upColor": t.up,
        "mainSeriesProperties.haStyle.downColor": t.down,
        "mainSeriesProperties.haStyle.drawWick": !0,
        "mainSeriesProperties.haStyle.drawBorder": !0,
        "mainSeriesProperties.haStyle.borderColor": t.border,
        "mainSeriesProperties.haStyle.borderUpColor": t.up,
        "mainSeriesProperties.haStyle.borderDownColor": t.down,
        "mainSeriesProperties.haStyle.wickColor": t.border,
        "mainSeriesProperties.haStyle.barColorsOnPrevClose": !1,
        "mainSeriesProperties.barStyle.upColor": t.up,
        "mainSeriesProperties.barStyle.downColor": t.down,
        "mainSeriesProperties.barStyle.barColorsOnPrevClose": !1,
        "mainSeriesProperties.barStyle.dontDrawOpen": !1,
        "mainSeriesProperties.lineStyle.color": t.border,
        "mainSeriesProperties.lineStyle.linewidth": 1,
        "mainSeriesProperties.lineStyle.priceSource": "close",
        "mainSeriesProperties.areaStyle.color1": t.areatop,
        "mainSeriesProperties.areaStyle.color2": t.areadown,
        "mainSeriesProperties.areaStyle.linecolor": t.border,
        "mainSeriesProperties.areaStyle.linewidth": 1,
        "mainSeriesProperties.areaStyle.priceSource": "close"
    }
}

function getStudiesOverrides(e) {
    var t = {
        white: {
            c0: "#eb4d5c",
            c1: "#53b987",
            t: 70,
            v: !1
        },
        black: {
            c0: "#fd8b8b",
            c1: "#3cb595",
            t: 70,
            v: !1
        }
    }[e];
    return {
        "volume.volume.color.0": t.c0,
        "volume.volume.color.1": t.c1,
        "volume.volume.transparency": t.t,
        "volume.options.showStudyArguments": t.v
    }
}

var datafeed = {
    onReady: function (cbk) {
        setTimeout(function () {
            cbk({
                supported_resolutions: [1, 5, 30, 60, 'D'],
                supports_time: true
            })
        }, 0)
    },
    resolveSymbol: function (symbolName, s) {
        setTimeout(function () {
            s(setting.symbolInfo)
        }, 0)
    },
    getBars: function (symbolInfo, resolution, from, to, onHistoryCallback) {
        // console.log(resolution)
        var xhr = new XMLHttpRequest()
        if (resolution === 'D') {
            resolution = 1440
        } else {
            resolution = Number(resolution)
        }
        xhr.onreadystatechange = function onStateChange() {
            if (this.readyState === 4 && this.status === 200) {
                try {
                    var tick = JSON.parse(this.responseText).data;
                    if (tick) {
                        var i = 0
                        var bars = []
                        for (i = 0; i < tick.length; i++) {
                            if (tick[i][1]) {
                                bars.push({
                                    open: tick[i][2],
                                    high: tick[i][3],
                                    low: tick[i][4],
                                    close: tick[i][5],
                                    volume: tick[i][1],
                                    time: tick[i][0] * 1000
                                })
                            }
                        }
                        if (bars.length) {
                            var last = bars[bars.length - 1]
                            if (window['lastTick' + resolution]) {
                                if (window['lastTick' + resolution].time <= last.time) {
                                    window['lastTick' + resolution] = last
                                }
                            } else {
                                window['lastTick' + resolution] = last
                            }
                        }
                        onHistoryCallback(bars, {noData: !bars.length})
                    }
                } catch (err) {
                    console.error(err) // eslint-disable-line no-console
                }
            }
        }
        xhr.open('GET', setting.restAPIURL + '?' + urlEncode({
            nonce: (new Date()).getTime() % 429496729,
            request: 'ticks',
            market: setting.market,
            pair: setting.market,
            start_time: from,
            end_time: to,
            interval: resolution * 60
        }), true)
        xhr.setRequestHeader('Content-type', 'application/json')
        xhr.send()
    },
    subscribeBars: function (symbolInfo, resolution, onRealtimeCallback, subscriberUID) {
        // console.log(resolution)
        if (resolution === 'D') {
            resolution = 1440
        } else {
            resolution = Number(resolution)
        }
        window.subscribers[subscriberUID] = function (tick) {
            var last = window['lastTick' + resolution]
            if (!last) {
                return
            }
            var t1 = Math.floor(tick.time)
            t1 = t1 - t1 % (resolution * 60000)
            var p = Number(tick.last)
            if (t1 > last.time) {
                var t = {
                    open: p,
                    high: p,
                    low: p,
                    close: p,
                    volume: tick.volume - window.tickTotalVolume,
                    time: t1
                }
                onRealtimeCallback(t)
                window['lastTick' + resolution] = t
            } else {
                var t = {
                    open: last.open,
                    high: Math.max(last.high, p),
                    low: Math.min(last.low, p),
                    close: p,
                    volume: window.tickTotalVolume ? (last.volume + tick.volume - window.tickTotalVolume) : last.volume,
                    time: last.time
                }
                onRealtimeCallback(t)
                window['lastTick' + resolution] = t
            }
        }
    },
    unsubscribeBars: function (subscriberUID) {
        delete window.subscribers[subscriberUID]
    }
}

function init(datas, color) {
    setting = datas
    window.subscribers = {};
    window.tickTotalVolume = null
    // var api = new WebSocket(datas.wsURL.url, datas.wsURL.protocol)
    // api.onerror = function () {
    // TODO reload iframe
    // }
    // api.onclose = function () {
    // TODO reload iframe
    // }
    // api.onopen = function () {
    // api.send(JSON.stringify({
    //   request: 'inst_tick',
    //   inst_id: datas.instId,
    //   subscribe: true
    // }))
    // }
    //     var arr=[
    //         [1541232000000, 72.014, 3.941, 3.982, 3.941, 3.982],
    //         [1541232000000, 72.014, 3.941, 3.982, 3.941, 3.982],
    //         [1541232000000, 72.014, 3.941, 3.982, 3.941, 3.982],
    //         [1541242800000, 104.089, 3.928, 3.928, 3.882, 3.913],
    //         [1541232000000, 72.014, 3.941, 3.982, 3.941, 3.982],
    //         [1541232000000, 72.014, 3.941, 3.982, 3.941, 3.524],
    //         [1541232000000, 72.014, 3.941, 3.982, 3.941, 3.982],
    //         [1541232000000, 72.014, 3.941, 3.982, 3.941, 3.982],
    //         [1541232000000, 72.014, 3.941, 3.982, 3.941, 3.982],
    //         [1541232000000, 72.014, 3.941, 3.982, 3.941, 3.982],
    //         [1541232000000, 72.014, 3.941, 3.982, 3.941, 3.982]
    //     ]
    var tick = {
        "high24": "3837.55000000",
        "highest_buy": "3772.24000000",
        "inst_id": 852379, "last": "3772.24000000",
        "low24": "3633.19000000", "lowest_sell": "3790.85000000",
        "nonce": 14857053, "prev_trans_id": 10696534133,
        "price_change_24": "0.02488419", "reply": "inst_tick", "status": ["OK"],
        "timestamp": 1546420543476730, "trans_id": 10696534148,
        "volume": "529.52523986", "volume24": "0.61903374",
        "volume24_quote": "2322.79495960",
        "volume_quote": "3347990.15145587"
    }
    // var t1=window.setInterval(function (args) {
    //     console.log("ready");
    //     // var tick = JSON.parse(tick)
    //     tick.volume = Number(tick.volume)
    //     // if (tick.volume !== window.tickTotalVolume) {
    //     // console.log(window.subscribers)
    //
    //
    //         window.tickTotalVolume = Number(tick.volume)
    //     // }
    // }, 1000);


    // api.onmessage = function (event) {
    // var tick = JSON.parse(event.data)
    // tick.volume = Number(tick.volume)
    // if (tick.volume !== window.tickTotalVolume) {
    //   for (var prop in window.subscribers) {
    //     if (window.subscribers.hasOwnProperty(prop)) {
    //       window.subscribers[prop](tick)
    //     }
    //   }
    //   window.tickTotalVolume = Number(tick.volume)
    // }
    // }

    var lang = localStorage.lang == 'cn' ? 'zh' : (localStorage.lang || 'zh');
    var config = {
        // autosize: true,
        fullscreen: false,
        symbol: datas.symbol,
        interval: 60,
        timezone: datas.timezone,
        height: 367.2,
        width: '100%',
        container_id: "trade_main",
        loading_screen: {backgroundColor: "#4b617b"},
        overides: getOverrides('white'),
        studies_overrides: getStudiesOverrides('white'),
        datafeed: datafeed,
        library_path: "/static/tradingview/",
        custom_css_url: color.url,
        locale: lang,
        drawings_access: {type: 'black', tools: [{name: "Regression Trend"}]},
        disabled_features: [
            "use_localstorage_for_settings",
            "border_around_the_chart",
            "volume_force_overlay",
            "pane_context_menu",
            "header_symbol_search",
            "symbol_search_hot_key",
            "header_undo_redo",
            "header_compare",
            "header_chart_type",
            "header_screenshot",
            'header_interval_dialog_button'
        ],
        enabled_features: [
            'dont_show_boolean_study_arguments',
            'hide_last_na_study_output'
        ],
        charts_storage_url: 'http://saveload.tradingview.com',
        charts_storage_api_version: "1.1",
        client_id: 'tradingview.com',
        user_id: 'public_user_id',
        toolbar_bg: '#fbfbfb',
        time_frames: [
            {
                text: '1m',
                resolution: "240",
                title: lang === 'zh' ? '月' : '1 Month',
                description: lang === 'zh' ? '近一月的K线走势' : 'Ticks in one month'
            },
            {
                text: '7d',
                resolution: "30",
                title: lang === 'zh' ? '周' : '1 Week',
                description: lang === 'zh' ? '近一周的K线走势' : 'Ticks in one month'
            },
            {
                text: '1d',
                resolution: "5",
                title: lang === 'zh' ? '日' : '1 Day',
                description: lang === 'zh' ? '今日K线走势' : 'Ticks in one day'
            },
            {
                text: '6h',
                resolution: "1",
                title: lang === 'zh' ? '6小时' : '6 Hours',
                description: lang === 'zh' ? '近6小时K线走势' : 'Ticks in 6 hours'
            }
        ],
    }
    if (window.innerWidth < 756)
        datas.mode = 'mobile';
    if (datas.mode === 'mobile') {
        config.preset = 'mobile'
    }
    localStorage.setItem('candle-theme', datas.theme)
    window.tvWidget = new TradingView.widget(config);
    window.tvWidget.onChartReady(function () {
        // var e = ["#965fc4", "#84aad5", "#55b263", "#b7248a"];
        // [5, 10, 30, 60].forEach(function (t, n) {
        //     window.tvWidget.chart().createStudy("Moving Average", !1, !1, [t], null, {
        //         "plot.color.0": e[n],
        //         // precision: 8
        //     })
        // });
    })
}

export default {
    init: init,
    addHistory: addHistory
}
