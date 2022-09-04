class dashboard {
    parent = null;
    keyStorage = 'ProPhetDashboardKeys';

    init(parent) {
        this.parent = parent;
    }

    register(){
        //获取密钥
        let key = $('#regsiter_dashboard_key').val();
        $('#regsiter_dashboard_key').addClass('disabled');
        this.get(key,(rsp)=>{
            if(rsp.status===1){
                $('#regsiter_dashboard_key').html('成功');
                
                //记录到已成功登录的仪表盘中
                this.keyAdd(key,rsp.data.name);

                // setTimeout(() => {
                //     app.open('/panel');
                // }, 1000);
            }else{
                alert('失败，请检查密钥是否正常');
            }
        });
    }

    /**
     * 获取仪表盘信息
     */
     get(key,cb){
        $.post(this.parent.api,{
            dashboard_key: key,
            action: 'dashboard_get',
        },(rsp)=>{
            if(cb!==undefined){
                cb(rsp);
            }
        },'json');
    }

    /**
     * 将设置项保存到服务器
     */
     set(key,settings,cb){
        $.post(this.parent.api,{
            dashboard_key: key,
            action: 'dashboard_set',
            data: settings,
        },(rsp)=>{
            if(cb!==undefined){
                cb(rsp);
            }
        },'json');
    }

    list(){

    }

    keyAdd(key,name){
        let dashboardsRaw = localStorage.getItem(this.keyStorage);
        let dashboards = [];

        if(dashboardsRaw!==null){
            dashboards = JSON.parse(dashboardsRaw);
        }

        //重复性检查，如果已经添加这个 key ，就返回。
        if(dashboards.lenght>0){
            for(let i in dashboard){
                dashboard[i].key === key;
                return true;
            }
        }

        dashboards.push([{
            key:key,name:name
        }]);

        localStorage.setItem(JSON.stringify(dashboards));
        return true;
    }

    keyRead(){

    }

}