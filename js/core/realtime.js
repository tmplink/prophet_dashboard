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
            if (units[0].net !== undefined) {
                $(`.prophet_realtime_network_${server_key}`).show();
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

            let layerIDBytes = `layer_bytes_${i}_${key}`;
            let layerIDPackets = `layer_packets_${i}_${key}`;

            //update or create chart
            if (this.networkChart[key] === undefined) {
                //create layer
                obj.push({
                    interface: i,
                    key: key,
                });

                $('#realtime_charts_' + key).html(app.tpl('prophet_realtime_network_chart_tpl', obj));

                //update quick view
                let now_download = bytetoconver(data[i].recv_bytes[data[i].recv_bytes.length - 1], true);
                let now_upload = bytetoconver(data[i].send_bytes[data[i].send_bytes.length - 1], true);

                let layerIDdownload = `#layer_bytes_download_${i}_${key}`;
                let layerIDupload = `#layer_bytes_upload_${i}_${key}`;

                $(layerIDdownload).html(now_download+'/s');
                $(layerIDupload).html(now_upload+'/s');

                this.networkChart[key] = 1;
                this.parent.chart.realtimeForNetworkOfBytes(layerIDBytes, data[i].send_bytes,data[i].recv_bytes,data[i].time);
                this.parent.chart.realtimeForNetworkOfPackets(layerIDPackets, data[i].send_packets,data[i].recv_packets,data[i].time);
            }else{
                this.parent.chart.realtimeForNetworkOfBytes(layerIDBytes, data[i].send_bytes,data[i].recv_bytes,data[i].time);
                this.parent.chart.realtimeForNetworkOfPackets(layerIDPackets, data[i].send_packets,data[i].recv_packets,data[i].time);
            }
        }
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

        // 先反转 units，使得时间从旧到新
        units.reverse();

        for (let i = 0; i < units.length; i++) {
            let net = units[i].net;
            for (let j = 0; j < net.length; j++) {
                //接口下的数据是否存在
                if (netData[net[j].interface] === undefined) {
                    netData[net[j].interface] = {
                        recv_bytes: [],
                        send_bytes: [],
                        recv_packets: [],
                        send_packets: [],
                        time: [],
                    };
                }
                //添加数据
                netData[net[j].interface].recv_bytes.push(parseInt(net[j].recv_bytes));
                netData[net[j].interface].send_bytes.push(parseInt(net[j].send_bytes));
                netData[net[j].interface].recv_packets.push(parseInt(net[j].recv_packets));
                netData[net[j].interface].send_packets.push(parseInt(net[j].send_packets));
                netData[net[j].interface].time.push(units[i].time);
            }
        }

        return netData;
    }
}