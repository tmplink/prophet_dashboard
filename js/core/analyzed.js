class analyzed{
    list = [];
    parent = null;
    data = null;

    init(parent){
        this.parent = parent;
    }

    initData(){
        if(this.data!==null){
            return false;
        }
        //初始化，下载所有数据
        if (this.parent.archive.list.length > 0) {
            for (let i = 0; i < this.parent.archive.list.length; i++) {
                this.downloadAnalyzedData(this.parent.archive.list[i].key);
            }
        }
    }

    downloadAnalyzedData(server_key){
        var post = {
            archive_key: server_key,
            action: 'chart_analyzed'
        };
        $.post(this.parent.api, post, (rsp) => {
            if (rsp.status === 0) {
                return false;
            }

            //prepare dataunit
            this.data[server_key] = this.prepareDataUnit(rsp.data);

        }, 'json');
    }

    drawTraffic() {
        return false;
        //first, set list of archive
        $('#prophet_realtime_network_list').html(app.tpl('prophet_realtime_network_list_tpl', this.parent.archive.list));
        //then, update chart
        if (this.parent.archive.list.length > 0) {
            for (let i = 0; i < this.parent.archive.list.length; i++) {
                this.updateTrafficChart(this.parent.archive.list[i].key,'daily');
                this.updateTrafficChart(this.parent.archive.list[i].key,'monthly');
            }
        }
    }

    updateTrafficChart(server_key,timeRange) {
        var post = {
            archive_key: server_key,
            range: timeRange,
            action: 'chart_analyzed'
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
            let netData = this.prepareTraffic(units,timeRange);
            this.drawLayer(server_key, netData);

            //auto update
            setTimeout(()=>{
                this.updateNetworkChart(server_key);
            },3000);
        }, 'json');
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

    prepareTraffic(units,timeRange) {
        let netData = {};

        // 先反转 units，使得时间从旧到新
        units.reverse();

        //合并处理最近 30 天的数据        
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
                netData[net[j].interface].recv_total_bytes.push(parseInt(net[j].recv_total_bytes));
                netData[net[j].interface].time.push(units[i].time);
            }
        }

        //根据 timerange 求和
        if(timeRange==='daily'){
            for(let i =0;i<30;i++){
                //初始时间为 30 天前
                let startTime = new Date(new Date(new Date().toLocaleDateString()).getTime() - 31 * 24 * 3600 * 1000);
                let nextTime = new Date(startTime + 86400 * 1000);
                //格式化
                let startTimeText = this.timeFormatForDaily(startTime);
                //求和
                let dailyCount = 0;
                for(let eth in netData){
                    //提取 time 进行对比
                    let unitTime = new Date(netData[eth].time);

                    if(dailyCount===0){
                        dailyCount = netData[eth].recv_total_bytes[0];
                    }else{
                        for(let s=1;s<=netData[eth].recv_total_bytes.length;s++){

                        }
                    }
                }
            }
        }

        return netData;
    }

    timeFormatForDaily(time){
        return time.getFullYear() + '-' + (time.getMonth()+1 < 10 ? '0'+(time.getMonth()+1) : time.getMonth()+1);
    }

}