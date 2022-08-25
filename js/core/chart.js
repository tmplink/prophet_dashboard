class Pchart {
    
    byteRanges = [0, 10485760, 10485760 * 2, 10485760 * 3, 10485760 * 4, 10485760 * 5, 104857600, 104857600 * 2, 104857600 * 5, 1073741824]
    packagesRanges = [0, 5000, 10000, 15000, 20000, 25000, 50000, 100000, 200000, 500000, 1000000, 2000000, 5000000, 10000000]

    init() {
        byteRanges = [0, 10485760, 10485760 * 2, 10485760 * 3, 10485760 * 4, 10485760 * 5, 104857600, 104857600 * 2, 104857600 * 5, 1073741824]
    }

    /**
     * 为实时网络统计图绘制图表
     * @param {*} id | Interface
     * @param {*} data | Traffic Data
     */
    realtimeForNetworkOfBytes(id,data){
        new ApexCharts(document.getElementById('chart-revenue-bg'), {
            chart: {
              type: "area",
              fontFamily: 'inherit',
              height: 40.0,
              sparkline: {
                enabled: true
              },
              animations: {
                enabled: false
              },
            },
            dataLabels: {
              enabled: false,
            },
            fill: {
              opacity: .16,
              type: 'solid'
            },
            stroke: {
              width: 2,
              lineCap: "round",
              curve: "smooth",
            },
            series: [{
              name: "Profits",
              data: [37, 35, 44, 28, 36, 24, 65, 31, 37, 39, 62, 51, 35, 41, 35, 27, 93, 53, 61, 27, 54, 43, 19, 46, 39, 62, 51, 35, 41, 67]
            }],
            grid: {
              strokeDashArray: 4,
            },
            xaxis: {
              labels: {
                padding: 0,
              },
              tooltip: {
                enabled: false
              },
              axisBorder: {
                show: false,
              },
              type: 'datetime',
            },
            yaxis: {
              labels: {
                padding: 4,
                formatter: function (value) {
                    return value + "$";
                  }
              },
            },
            labels: [
              '2020-06-20', '2020-06-21', '2020-06-22', '2020-06-23', '2020-06-24', '2020-06-25', '2020-06-26', '2020-06-27', '2020-06-28', '2020-06-29', '2020-06-30', '2020-07-01', '2020-07-02', '2020-07-03', '2020-07-04', '2020-07-05', '2020-07-06', '2020-07-07', '2020-07-08', '2020-07-09', '2020-07-10', '2020-07-11', '2020-07-12', '2020-07-13', '2020-07-14', '2020-07-15', '2020-07-16', '2020-07-17', '2020-07-18', '2020-07-19'
            ],
            colors: ["#206bc4"],
            legend: {
              show: false,
            },
          }).render();
    }

    //格式化为 KB, MB, GB
    formatYset(bytes) {
        if (bytes < 1) {
            return '0';
        }

        var s = ['B', 'K', 'M', 'G', 'T', 'P'];
        var e = Math.floor(Math.log(bytes) / Math.log(1024));
        var value = ((bytes / Math.pow(1024, Math.floor(e))).toFixed(2));
        e = (e < 0) ? (-e) : e;
        //取整
        value = Math.ceil(value);
        value += ' ' + s[e];
        return value;
    }

    //格式化为 K, M, G
    formatYsetPackages(packages) {
        if (packages < 1) {
            return '0';
        }

        var s = ['', 'K', 'M', 'G'];
        var e = Math.floor(Math.log(packages) / Math.log(1000));
        var value = ((packages / Math.pow(1000, Math.floor(e))).toFixed(2));
        e = (e < 0) ? (-e) : e;
        //取整
        value = Math.ceil(value);
        value += ' ' + s[e];
        return value;
    }
};