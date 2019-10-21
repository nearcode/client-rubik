<template>
    <div>
        <div class="times_wrap">
            <el-button class="group_time" :type="select==v.resolution?'primary':''" size="mini" v-for="(v,k) in timesList" :key="k" @click="selectTime(v.resolution)">{{v.title}}</el-button>
        </div>
        <div id="trade_main" class="candle-container" ref="trade_main"></div>
    </div>
</template>

<script>
    import exchange from "@/api/exchange";

    var echarts = require("@/common/echarts.min.js").echarts;
    export default {
        props: ["market"],
        data() {
            let language = 'zh';
            return {
                chart: null,
                select: "60",
                kline:[],
                timesList: [
                //     {
                //     title: "en" == language ? "Time" : "分时",
                //     resolution: "1",
                //     chartType: 3
                // },
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
                    resolution: "1440",
                    chartType: 1
                },
                //     {
                //     title: "en" == language ? "1week" : "周线",
                //     resolution: "1W",
                //     chartType: 1
                // }
                ]
            };
        },
        mounted() {
            if (this.market) {
                this.initChart();
            }
            window.onresize = ()=>{ // 定义窗口大小变更通知事件
                this.chart.resize();
            };

        },
        watch: {
            market(value) {
                if (value) {
                    this.initChart();
                }
            },
            // update(value){
            //     if(value){
            //         this.kline.push(value);
            //         this.updateKline(this.kline);
            //     }
            //     console.log(value)
            // }
        },
        methods: {
            async initChart() {
                this.chart = echarts.init(this.$refs.trade_main);
                var colorList = [
                    "#c23531",
                    "#2f4554",
                    "#61a0a8",
                    "#d48265",
                    "#91c7ae",
                    "#749f83",
                    "#ca8622",
                    "#bda29a",
                    "#6e7074",
                    "#546570",
                    "#c4ccd3"
                ];
                var labelFont = "bold 12px Sans-serif";


                var market = this.market;
                var coin = this.$common.getCoin(market);
                var base = this.$common.getBaseCoin(market);

                var option = {
                    animation: true,
                    color: colorList,
                    title: {
                        show: false
                    },
                    legend: {
                        show: false
                    },
                    // tooltip: {
                    //     //triggerOn: 'none',
                    //     transitionDuration: 0,
                    //     confine: true,
                    //     bordeRadius: 4,
                    //     borderWidth: 1,
                    //     borderColor: '#333',
                    //     backgroundColor: 'rgba(255,255,255,0.9)',
                    //     textStyle: {
                    //         fontSize: 12,
                    //         color: '#333'
                    //     },
                    //     position: function (pos, params, el, elRect, size) {
                    //         var obj = {
                    //             top: 60
                    //         };
                    //         obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 5;
                    //         return obj;
                    //     }
                    // },
                    tooltip: {
                        trigger: "axis",
                        confine: 1,
                        axisPointer: {
                            animation: !1,
                            type: "cross",
                            lineStyle: {
                                // color: "#376df4",
                                width: 2,
                                opacity: 1
                            }
                        },
                        textStyle: {
                            fontSize: 13
                        },
                        formatter: function (param) {
                            var candle = {
                                data: [],
                                axisValue: ""
                            }
                                , ma5 = {};
                            param.forEach(function (value, index) {
                                switch (value.seriesName.toLowerCase()) {
                                    case "kline":
                                        candle = param[index];
                                        break;
                                    case "ma5":
                                        ma5 = param[index];
                                        break;
                                    case "volume":
                                        param[index]
                                }
                            });
                            // console.log(param)
                            var style = "display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;";
                            return '<span style="' + style + ' background-color:#FD1050;"></span>\n\t\t\t\t\t\t\t' + candle.name + ' <hr size=1 style="margin: 3px 0">\n\t\t\t\t\t\t\t' + "数量" + " : " + candle.data[0] + " <br/>\n\t\t\t\t\t\t\tMA5: " + (isNaN(ma5.data) ? ma5.data : ma5.data) + ' <br/>\n\t\t\t\t\t\t\t<span style="' + style + ' background-color:#0CF49B;"></span><strong style="color:#0CF49B">' + "价格" + "(" + base + ")</strong><br>\n\t\t\t\t\t\t\t" + "开盘" + " :  " + candle.data[1] + " <br/>\n\t\t\t\t\t\t\t" + "收盘" + " :  " + candle.data[4] + " <br/>\n\t\t\t\t\t\t\t" + "最高" + " :  " + candle.data[2] + " <br/>\n\t\t\t\t\t\t\t" + "最低" + " :  " + candle.data[3] + " <br/>"
                        }
                    },
                    toolbox: {
                        feature: {
                            restore: {},
                            dataZoom: {
                                yAxisIndex: !1
                            },
                            brush: {
                                type: ["rect", "polygon", "lineX", "lineY", "keep", "clear"]
                            },
                            saveAsImage: {
                                name: market,
                                backgroundColor: "#1a1e21"
                            },
                        },
                        itemSize: 18,
                        itemGap: 15,
                        right: "5%",
                        top: "2%"
                    },
                    axisPointer: {
                        link: [{
                            xAxisIndex: [0, 1]
                        }]
                    },
                    dataZoom: [{
                        type: 'slider',
                        xAxisIndex: [0, 1],
                        realtime: false,
                        start: 50,
                        end: 100,
                        top: 350,
                        height: 20,
                        handleIcon: 'M10.7,11.9H9.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4h1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
                        handleSize: '120%'
                    }, {
                        type: 'inside',
                        xAxisIndex: [0, 1],
                        start: 50,
                        end: 100,
                        top: 380,
                        height: 20
                    }],
                    xAxis: [{
                        type: 'category',
                        boundaryGap: false,
                        axisLine: {
                            lineStyle: {
                                color: '#777'
                            }
                        },
                        axisLabel: {
                            formatter: function (value) {
                                return echarts.format.formatTime('MM-dd', value);
                            }
                        },
                        min: 'dataMin',
                        max: 'dataMax',
                        axisPointer: {
                            show: true
                        }
                    }, {
                        type: 'category',
                        gridIndex: 1,
                        scale: true,
                        boundaryGap: false,
                        splitLine: {
                            show: false
                        },
                        axisLabel: {
                            show: false
                        },
                        axisTick: {
                            show: false
                        },
                        axisLine: {
                            lineStyle: {
                                color: '#777'
                            }
                        },
                        splitNumber: 20,
                        min: 'dataMin',
                        max: 'dataMax',
                        axisPointer: {
                            type: 'shadow',
                            label: {
                                show: false
                            },
                            triggerTooltip: true,
                        }
                    }],
                    yAxis: [{
                        scale: true,
                        splitNumber: 2,
                        axisLine: {
                            lineStyle: {
                                color: '#777'
                            }
                        },
                        splitLine: {
                            show: true
                        },
                        axisTick: {
                            show: false
                        },
                        axisLabel: {
                            inside: true,
                            formatter: '{value}\n'
                        }
                    }, {
                        scale: true,
                        gridIndex: 1,
                        splitNumber: 2,
                        axisLabel: {
                            show: false
                        },
                        axisLine: {
                            show: false
                        },
                        axisTick: {
                            show: false
                        },
                        splitLine: {
                            show: false
                        }
                    }],
                    grid: [{
                        left: 20,
                        right: 20,
                        top: 0,
                        height: 250
                    }, {
                        left: 20,
                        right: 20,
                        height: 40,
                        top: 290
                    }],
                    graphic: [{
                        type: 'group',
                        left: 'center',
                        top: 70,
                        width: 300,
                        bounding: 'raw',
                        children: [{
                            id: 'MA5',
                            type: 'text',
                            style: {
                                fill: colorList[1],
                                font: labelFont
                            },
                            left: 0
                        }, {
                            id: 'MA10',
                            type: 'text',
                            style: {
                                fill: colorList[2],
                                font: labelFont
                            },
                            left: 'center'
                        }, {
                            id: 'MA20',
                            type: 'text',
                            style: {
                                fill: colorList[3],
                                font: labelFont
                            },
                            right: 0
                        }]
                    }],
                    series: [{
                        name: 'Volume',
                        type: 'bar',
                        xAxisIndex: 1,
                        yAxisIndex: 1,
                        itemStyle: {
                            normal: {
                                color: '#7fbe9e'
                            },
                            emphasis: {
                                color: '#140'
                            }
                        },
                    }, {
                        type: 'candlestick',
                        name: '日K',
                        itemStyle: {
                            normal: {
                                color: '#ef232a',
                                color0: '#14b143',
                                borderColor: '#ef232a',
                                borderColor0: '#14b143'
                            },
                            emphasis: {
                                color: 'black',
                                color0: '#444',
                                borderColor: 'black',
                                borderColor0: '#444'
                            }
                        }
                    }, {
                        name: 'MA5',
                        type: 'line',
                        smooth: true,
                        showSymbol: false,
                        lineStyle: {
                            normal: {
                                width: 1
                            }
                        }
                    }, {
                        name: 'MA10',
                        type: 'line',
                        smooth: true,
                        showSymbol: false,
                        lineStyle: {
                            normal: {
                                width: 1
                            }
                        }
                    }, {
                        name: 'MA20',
                        type: 'line',
                        smooth: true,
                        showSymbol: false,
                        lineStyle: {
                            normal: {
                                width: 1
                            }
                        }
                    }]
                };

                this.chart.setOption(option);
                this.chart.on("click", function (params) {
                    if (params.componentType == "line") {
                        // 控制台打印数据的名称
                    }
                    console.log(params);
                });
               this.getKLine();
            },
            selectTime(time){
                if(!time) return;
                this.select=time;
                this.getKLine();
            },
            async getKLine(){
                this.chart.showLoading();
                try {
                    this.kline = await exchange.getKline(this.market, this.select);
                    this.chart.hideLoading();
                    this.updateKline(this.kline);
                } catch (e) {
                    console.log(e);
                }
            },
            calculateMA: function (dayCount, data) {
                var result = [];
                for (var i = 0, len = data.length; i < len; i++) {
                    if (i < dayCount) {
                        result.push("-");
                        continue;
                    }
                    var sum = 0;
                    for (var j = 0; j < dayCount; j++) {
                        sum += data[i - j][2];
                    }
                    result.push((sum / dayCount).toFixed(2));
                }
                return result;
            },
            updateKline(data) {
                // data = data.slice(0, 50);
                let dateList = [];
                let volumeList = [];
                let dataList = [];
                for (let item of data) {
                    dateList.push(this.$tools.date.toString(item[0]));
                    volumeList.push(item[1]);
                    dataList.push([item[3], item[5], item[4], item[2]]);
                }
                var dataMA5 = this.calculateMA(5, dataList);
                var dataMA10 = this.calculateMA(10, dataList);
                var dataMA20 = this.calculateMA(20, dataList);
                this.chart.setOption({
                    xAxis: {
                        data: dateList
                    },
                    series: [{
                        name: "Volume",
                        data: volumeList
                    },
                        {
                            name: "Kline",
                            data: dataList
                        },
                        {
                            name: "MA5",
                            data: dataMA5
                        },
                        {
                            name: "MA10",
                            data: dataMA10
                        },
                        {
                            name: "MA20",
                            data: dataMA20
                        }
                    ]
                });
            }
        },
    };
</script>

<style scoped>
    #trade_main {
        width: 100%;
        height: 370px;
    }
    .times_wrap .group_time:first-child {
        margin: 10px 0 10px 20px;
    }
</style>
