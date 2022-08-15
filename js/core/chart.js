var chartSettings = {
    byteRanges: [0, 10485760, 10485760 * 2, 10485760 * 3, 10485760 * 4,10485760 * 5,104857600, 104857600 * 2, 104857600 * 5, 1073741824],
    //格式化为 KB, MB, GB
    chartYset: (bytes) => {
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
    },
    packagesRanges: [0, 5000, 10000, 15000, 20000, 25000, 50000, 100000, 200000, 500000, 1000000, 2000000, 5000000, 10000000],
    //格式化为 K, M, G
    chartYsetPackages: (packages) => {
        if (packages < 1) {
            return '0';
        }

        var s = ['','K', 'M', 'G'];
        var e = Math.floor(Math.log(packages) / Math.log(1000));
        var value = ((packages / Math.pow(1000, Math.floor(e))).toFixed(2));
        e = (e < 0) ? (-e) : e;
        //取整
        value = Math.ceil(value);
        value += ' ' + s[e];
        return value;
    }
};