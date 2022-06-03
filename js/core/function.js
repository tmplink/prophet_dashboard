//倒计时函数，将剩余的时间格式化成时分秒并写入到指定的 html 中
function countDown(id, time) {
    let now = time-1;
    let left_time = now;

    let d = '';
    let h = '';
    let m = '';
    let s = '';

    if(now==0){
        return false;
    }
    
    if(now>86400){
        d = Math.floor(now / 86400);
        d = d + ':';
        left_time = left_time % 86400;
    }

    if(left_time>3600){
        h = Math.floor(left_time / 3600);
        h = h < 10 ? "0" + h : h;
        h = h === "0" ? "00" : h;
        h = h + ':';
        left_time = left_time % 3600;
    }

    if(left_time>60){
        m = Math.floor(left_time / 60);
        m = m < 10 ? "0" + m : m;
        m = m === "0" ? "00" : m;
        m = m + ':';
        left_time = left_time % 60;
    }

    if(left_time>0){
        s = left_time; 
        s = s < 10 ? "0" + s : s;
        s = s === "0" ? "00" : s;
    }
    if(left_time===0&&m!==''){
        s = "00";
    }

    let dom =  document.getElementById(id);
    if(dom===null){
        return false;
    }else{
        dom.innerHTML = d + h + m + s;
    }

    if (now > 0) {
        setTimeout(()=>{
            countDown(id, now);
        }, 1000);
    }
}

function bytetoconver(val, label) {
    if (val < 1) {
        return '0 B';
    }

    var s = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
    var e = Math.floor(Math.log(val) / Math.log(1024));
    var value = ((val / Math.pow(1024, Math.floor(e))).toFixed(2));
    e = (e < 0) ? (-e) : e;
    if (label) {
        value += ' ' + s[e];
    }
    return value;
}

function formatTime(s) {
    var day = Math.floor(s / (24 * 3600));
    var hour = Math.floor((s - day * 24 * 3600) / 3600);
    var minute = Math.floor((s - day * 24 * 3600 - hour * 3600) / 60);
    var second = s - day * 24 * 3600 - hour * 3600 - minute * 60;
    if (hour < 10) {
        hour = '0' + hour.toString();
    }
    if (minute < 10) {
        minute = '0' + minute.toString();
    }
    if (second < 10) {
        second = '0' + second.toString();
    }
    return hour + ":" + minute + ":" + second;
}

function get_url_params() {
    var vars = [],
        hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for (var i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}

function get_page_mrid() {
    var params = get_url_params();
    return params.mrid;
}