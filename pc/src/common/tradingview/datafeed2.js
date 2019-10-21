let config = {};

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

class datafeeds {
    constructor() {
    }

    onReady(cbk) {
        setTimeout(function () {
            cbk({
                supported_resolutions: [1, 5, 30, 60, 'D'],
                supports_time: true
            })
        }, 0)
    }

    resolveSymbol(symbolName, s) {
        setTimeout(() => {
            s(config.symbolInfo)
        }, 0)
    }

    getBars(symbolInfo, resolution, from, to, onHistoryCallback) {
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
                        onHistoryCallback(bars, { noData: !bars.length })
                    }
                } catch (err) {
                    console.error(err) // eslint-disable-line no-console
                }
            }
        }
        xhr.open('GET', config.restAPIURL + '?' + urlEncode({
            nonce: (new Date()).getTime() % 429496729,
            request: 'ticks',
            market: config.market,
            pair: config.market,
            start_time: from,
            end_time: to,
            interval: resolution
        }), true)
        xhr.setRequestHeader('Content-type', 'application/json')
        xhr.send()
    }

    subscribeBars(symbolInfo, resolution, onRealtimeCallback, subscriberUID) {
        console.log(resolution)
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
    }

    unsubscribeBars(subscriberUID) {
        delete window.subscribers[subscriberUID]
    }

}

let Trading = {
    getOverrides: function (e) {
        var t = e;
        return {
            "volumePaneSize": "small", //成交量高度设置，可选值 large, medium, small, tiny
            "symbolWatermarkProperties.color": t.bg,
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
            "mainSeriesProperties.areaStyle.priceSource": "close",
            "paneProperties.topMargin": 12,
            "paneProperties.bottomMargin": 5,



        }
    },
    getTheme: function (theme) {
        return theme == 'white' ? 'Light' : 'Dark';
    },
    getStudiesOverrides: function (e) {

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
    },

    init: function (datas, color) {
        config = datas;
        window.subscribers = {};
        window.tickTotalVolume = null;
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
        };
        var lang = localStorage.lang == 'cn' ? 'zh' : (localStorage.lang || 'zh');

        let theme = localStorage.getItem("theme") || "white";

        let chartType = 1 * (localStorage.getItem("tradingview.chartType") || "1");
        var c = {
            // autosize: true,
            fullscreen: false,//布尔值显示图表是否占用窗口中所有可用的空间。
            symbol: datas.symbol,
            interval: 60,
            timezone: datas.timezone,
            height: 400,
            width: '100%',
            theme: this.getTheme(color.theme),
            container_id: "trade_main", //`id`属性为指定要包含widget的DOM元素id。
            loading_screen: { backgroundColor: color.toolbar_bg },
            overides: this.getOverrides(color),
            overrides: this.getOverrides(color),
            studies_overrides: this.getStudiesOverrides(theme),
            datafeed: new datafeeds(this),
            library_path: "/static/tradingview2/", //默认脚本核心文件存储位置
            custom_css_url: "/static/tradingview2/static/css/index.css",//url应该是到static文件夹的绝对或相对路径
            locale: lang,
            drawings_access: { type: 'black', tools: [{ name: "Regression Trend" }] },
            //禁用
            disabled_features: ["header_symbol_search", "header_saveload", "header_screenshot", "header_chart_type", "header_compare", "header_undo_redo", "timeframes_toolbar", "volume_force_overlay", "header_resolutions", "14851"],
            // 启用
            enabled_features: ["hide_last_na_study_output", "side_toolbar_in_fullscreen_mode"],

            charts_storage_url: 'http://saveload.tradingview.com',
            charts_storage_api_version: "1.1",
            client_id: 'tradingview.com',
            user_id: 'public_user_id',
            toolbar_bg: color.toolbar_bg,//工具栏底色
        };
        this.widgets = new TradingView.widget(c);
        var language = 'zh';
        var n = [
            //     {
            //         //     title: "en" == language ? "Time" : "分时",
            //         //     resolution: "1",
            //         //     chartType: 3
            //         // },
            {
                title: "en" == language ? "1min" : "1分钟",
                resolution: "1",
                chartType: 1
            }, {
                title: "en" == language ? "5min" : "5分钟",
                resolution: "5",
                chartType: 1
            }, {
                title: "en" == language ? "30min" : "30分钟",
                resolution: "30",
                chartType: 1
            }, {
                title: "en" == language ? "1hour" : "1小时",
                resolution: "60",
                chartType: 1
            }, {
                title: "en" == language ? "1day" : "1天",
                resolution: "1D",
                chartType: 1
            }, {
                title: "en" == language ? "1week" : "周线",
                resolution: "1W",
                chartType: 1
            }];
        var self = this;
        this.widgets.onChartReady(function () {
            self.widgets.headerReady().then(function () {
                for (let item of n) {
                    !function (item) {
                        var button = self.widgets.createButton();
                        button.setAttribute('title', item.title);

                        button.addEventListener('click', function (e) {
                            //
                            if (-1 < this.parentNode.className.search("tradingview-active"))
                                return !1;

                            var t = this.parentNode.parentNode.parentNode.children;

                            if (t) {
                                for (let v of t) {
                                    v.className = v.className.replace(/tradingview-active/, "");
                                }
                            }

                            this.parentNode.parentNode.className += " tradingview-active";

                            self.widgets.chart().setResolution(item.resolution, function () {
                            });

                            item.chartType != self.widgets.chart().chartType() && (self.widgets.chart().setChartType(item.chartType))
                            // c(a.chartType))

                            // window.open(this.getAttribute("url"), "_blank")
                        });

                        button.parentNode.parentNode.className += (item.resolution == c.interval && item.chartType == chartType ? " tradingview-active" : "");
                        button.textContent = item.title;

                    }(item)
                }
            })


            var e;
            var l = [];
            e = self.widgets.chart().createStudy("Moving Average", !1, !1, [7], null, {
                "Plot.color": "#0ab2d2"
            });
            l.push(e);
            e = self.widgets.chart().createStudy("Moving Average", !1, !1, [30], null, {
                "Plot.color": "#dc4273"
            });
            l.push(e);
            e = self.widgets.chart().createStudy("Moving Average", !1, !1, [60], null, {
                "plot.color": "#ff8200"
            });
            l.push(e),
                // function (e) {
                //     for (var t = 0; t < e.length; t++)
                //         !function (a) {
                //             self.widgets.createButton().attr("title", a.title).attr("url", a.url ? a.url : "").addClass("mydate " + (a.url ? "senior_link" : "")).text(a.title).on("click", function (e) {
                //                 if ("" == this.getAttribute("url")) {
                //                     if (-1 < this.parentNode.className.search("active"))
                //                         return !1;
                //                     localStorage.setItem("tradingview.resolution", a.resolution),
                //                         localStorage.setItem("tradingview.chartType", a.chartType);
                //                     var t = this.parentNode.parentNode.parentNode.querySelector(".active");
                //                     t.className = t.className.replace(/(\sactive|active\s)/, ""),
                //                         this.parentNode.className += " active",
                //                         self.widgets.chart().setResolution(a.resolution, function () {
                //                         }),
                //                     a.chartType != self.widgets.chart().chartType() && (self.widgets.chart().setChartType(a.chartType))
                //                     // c(a.chartType))
                //                 } else
                //                     window.open(this.getAttribute("url"), "_blank")
                //             }).parent().addClass("my-group" + (a.resolution == c.interval && a.chartType == chartType ? " active" : "")).parent().addClass(a.url ? "senior " + a.cls : "")
                //         }(e[t])
                // }

                (n),
                self.widgets.chart().setChartType(chartType);

            // for (var t = 3 == e ? 0 : 1, a = 0; a < l.length; a++)
            //     self.widgets.chart().getStudyById(l[a]).setVisible(t)
            self.resetTheme(color)
        })
    },
    
    resetTheme: function (e) {
        // console.log()
        // // this.widgets.addCustomCSSFile("/static/tradingview2/static/css/" + e.theme + ".css")
        // this.widgets.applyStudiesOverrides(this.getStudiesOverrides(e.theme));

        let setTheme= (e) =>{
            this.widgets.applyOverrides(this.getOverrides(e))
            this.widgets.changeTheme(this.getTheme(e.theme))
        };
        
        this.widgets.onChartReady(function () {
            setTheme(e)
        })


    },
}
export default Trading