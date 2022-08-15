class realtime {
    parent = null;
    networkChart = [];

    init(parent) {
        this.parent = parent;
    }

    drawNetWork() {
        //first, set list of archive
        $('#prophet_realtime_network_list').html(app.tpl('prophet_realtime_network_list_tpl', this.parent.archive.list));
        //then, update chart
        if (this.parent.archive.list.length > 0) {
            for (let i = 0; i < this.parent.archive.list.length; i++) {
                this.updateNetworkChart(this.parent.archive.list[i].key);
            }
        }
    }

    updateNetworkChart(server_key) {
        var post = {
            archive_key: server_key,
            action: 'chart_realtime'
        };
        $.post(this.parent.api, post, (rsp) => {
            if (rsp.status === 0) {
                return false;
            }

            //prepare dataunit
            let units = this.prepareDataUnit(rsp.data);

            //if net not set
            if (units[0].net === undefined) {
                console.log(`Archive[${server_key}]::net not set`);
                //hide card
                $(`#prophet_realtime_network_${server_key}`).remove();
                return false;
            }

            //prepare data
            let netData = this.prepareNetwork(units);
            this.drawLayer(server_key, netData);

            //auto update
            setTimeout(()=>{
                this.updateNetworkChart(server_key);
            },3000);
        }, 'json');
    }

    drawLayer(key, data) {
        let obj = [];
        for (let i in data) {

            let layerIDBytes = `#layer_bytes_${i}_${key}`;
            let layerIDPackets = `#layer_packets_${i}_${key}`;

            //update or create chart
            if (this.networkChart[key] === undefined) {
                //create layer
                obj.push({
                    interface: i,
                    key: key,
                });
                $('#realtime_charts_' + key).html(app.tpl('prophet_realtime_network_chart_tpl', obj));

                this.networkChart[key] = {};
                this.networkChart[key].bytes = this.drawChartForBytes(layerIDBytes, data[i]);
                this.networkChart[key].packets = this.drawChartForPackets(layerIDPackets, data[i]);
            }else{
                this.networkChart[key].bytes.load({
                    columns: [data[i].recv_bytes, data[i].send_bytes]
                });
                this.networkChart[key].packets.load({
                    columns: [data[i].recv_packets, data[i].send_packets]
                });
            }
        }
    }

    drawChartForBytes(domID, data) {
        let opt = {
            data: {},
            axis: {
                y: {
                    padding: {
                        bottom: 0,
                        // left: 20,
                    },
                    show: true,
                    tick: {
                        outer: true,
                        values: chartSettings.byteRanges,
                        format:  (d) => { return chartSettings.chartYset(d); }
                    }
                },
                x: {
                    padding: {
                        left: 0,
                        right: 0
                    }
                }
            },
            tooltip: {
                format: {
                    title: function (x) {
                        if(data.time[x]===0){
                            return '现在';
                        }else{
                            return data.time[x] +'秒前';
                        }
                    },
                    value: function (value, ratio, id) {
                        return bytetoconver(value, true) + '/s';
                    }
                }
            },
            // padding: {
            //     bottom: 0,
            //     left: 0,
            //     right: 0
            // },
            transition: {
                duration: 0
            },
            point: {
                show: false
            }
        };
        opt.axis.x.categories = data.time;
        opt.axis.x.show = false;
        //draw chart
        opt.bindto = domID;
        opt.legend = { show: true };
        opt.data.columns = [data.recv_bytes, data.send_bytes];
        opt.data.names = { data1: 'upload', data2: 'download' };
        opt.data.types = { data1: 'area-spline', data2: 'area-spline' };
        opt.data.groups = [['data1', 'data2']];
        opt.data.type = 'line';
        return c3.generate(opt);
    }

    drawChartForPackets(domID, data) {
        let opt = {
            data: {},
            axis: {
                y: {
                    padding: {
                        bottom: 0,
                        // left: 20,
                    },
                    show: true,
                    tick: {
                        outer: true,
                        values: chartSettings.packagesRanges,
                        format:  (d) => { return chartSettings.chartYsetPackages(d); }
                    }
                },
                x: {
                    padding: {
                        left: 0,
                        right: 0
                    }
                }
            },
            tooltip: {
                format: {
                    title: function (x) {
                        if(data.time[x]===0){
                            return '现在';
                        }else{
                            return data.time[x] +'秒前';
                        }
                    },
                    value: function (value, ratio, id) {
                        return value + '/s';
                    }
                }
            },
            // padding: {
            //     bottom: 0,
            //     left: 0,
            //     right: 0
            // },
            transition: {
                duration: 0
            },
            point: {
                show: false
            }
        };
        opt.axis.x.categories = data.time;
        opt.axis.x.show = false;
        //draw chart
        opt.bindto = domID;
        opt.legend = { show: true };
        opt.data.columns = [data.recv_packets, data.send_packets];
        opt.data.names = { data3: 'recv packets', data4: 'send packets' };
        opt.data.types = { data3: 'area-spline', data4: 'area-spline' };
        opt.data.groups = [['data3', 'data4']];
        opt.data.type = 'line';
        return c3.generate(opt);
    }

    prepareDataUnit(input) {
        let dataGroup = [];
        //可能会有多个网络接口，依次处理
        for (let i = 0; i < input.length; i++) {
            let unit = JSON.parse(input[i].data);
            unit.time = input[i].ctime;
            dataGroup.push(unit);
        }
        return dataGroup;
    }

    prepareNetwork(units) {
        let netData = {};
        let time = 0;

        // 先反转 units，使得时间从旧到新
        units.reverse();

        for (let i = 0; i < units.length; i++) {
            let net = units[i].net;
            for (let j = 0; j < net.length; j++) {
                //接口下的数据是否存在
                if (netData[net[j].interface] === undefined) {
                    netData[net[j].interface] = {
                        recv_bytes: ['data1'],
                        send_bytes: ['data2'],
                        recv_packets: ['data3'],
                        send_packets: ['data4'],
                        time: [],
                    };
                }
                //添加数据
                netData[net[j].interface].recv_bytes.push(net[j].recv_bytes);
                netData[net[j].interface].send_bytes.push(net[j].send_bytes);
                netData[net[j].interface].recv_packets.push(net[j].recv_packets);
                netData[net[j].interface].send_packets.push(net[j].send_packets);
                netData[net[j].interface].time.push(time);
                time = time + 3;
            }
        }

        //反转 time
        for (let key in netData) {
            netData[key].time.reverse();
        }

        return netData;
    }
}