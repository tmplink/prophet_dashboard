class chart {

  byteRanges = [0, 10485760, 10485760 * 2, 10485760 * 3, 10485760 * 4, 10485760 * 5, 104857600, 104857600 * 2, 104857600 * 5, 1073741824]
  packagesRanges = [0, 5000, 10000, 15000, 20000, 25000, 50000, 100000, 200000, 500000, 1000000, 2000000, 5000000, 10000000]
  chartInstant = {}

  /**
   * 为实时网络统计图绘制图表
   * @param {*} id | Interface
   * @param {*} data | Traffic Data
   */
  realtimeForNetworkOfBytes(id, dataUpload, dataDownload, dateTime) {
    if (this.chartInstant[id] === undefined) {
      this.chartInstant[id] = new ApexCharts(document.getElementById(id), {
        chart: {
          type: "line",
          fontFamily: 'inherit',
          height: 60.0,
          sparkline: {
            enabled: true
          },
          animations: {
            enabled: false
          },
        },
        fill: {
          opacity: 1,
        },
        stroke: {
          width: [2, 1],
          dashArray: [0, 3],
          lineCap: "round",
          curve: "smooth",
        },
        series: [{
          name: "上传",
          data: dataUpload
        }, {
          name: "下载",
          data: dataDownload
        }],
        grid: {
          strokeDashArray: 4,
        },
        xaxis: {
          labels: {
            // padding: 0,
            formatter: (value) => {
              return (value);
            }
          },
          tooltip: {
            enabled: false
          },
          // type: 'datetime',
        },
        yaxis: {
          labels: {
            padding: 4,
            formatter: (value,index) => {
              return this.formatYset(value)+'/s';
            }
          },
        },
        labels: dateTime,
        colors: ["#206bc4", "#a8aeb7"],
        legend: {
          show: false,
        },
      });
      this.chartInstant[id].render()
    } else {
      this.chartInstant[id].updateOptions({
        series: [{
          name: "上传",
          data: dataUpload
        }, {
          name: "下载",
          data: dataDownload
        }],
        labels: dateTime
      });
    }
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