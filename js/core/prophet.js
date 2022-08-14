class prophet_main{

    api = 'https://vx.link/openapi/service/prophet';
    key = '4d1dfdc34527ab419a0275de9b5b7690';

    isKeyValid = false;
    archive = null;
    realtime = null;
    language = null;
    readyCB = []; 
    readyStatus = false;
    settings = {
        archive: [],
    };

    init(){
        this.archive = new archive();
        this.realtime = new realtime();
        this.archive.init(this);
        this.realtime.init(this);
        this.get();
        this.readyExec();
    }

    ready(cb){
        this.readyCB.push(cb);
    }

    readyExec(){
        if(this.readyStatus){
            for(let i=0;i<this.readyCB.length;i++){
                this.readyCB[i]();
            }
            //remove
            this.readyCB = [];
        }else{
            setTimeout(()=>{
                this.readyExec();
            },1000);
        }
    }

    /**
     * 初始化仪表盘
     */
    get(){
        $.post(this.api,{
            dashboard_key: this.key,
            action: 'dashboard_get',
        },(rsp)=>{
            if(rsp.status===1){
                if(rsp.data!=='None'){
                    this.settings = rsp.data;
                    this.archive.list = rsp.data.archive;
                }else{

                }
                this.isKeyValid = true;
                this.readyStatus = true;
            }else{
                this.isKeyValid = false;
                alert('获取信息失败，密钥可能无效.');
            }
        },'json');
    }

    /**
     * 将设置项保存到服务器
     */
    set(){
        $.post(this.api,{
            dashboard_key: this.key,
            action: 'dashboard_set',
            data: this.settings,
        },(rsp)=>{
            if(rsp.status==1){
                //finish
                console.log('saved');
            }
        },'json');
    }

}