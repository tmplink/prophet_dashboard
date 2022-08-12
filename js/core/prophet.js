class prophet_main{

    api = 'https://vx.link/openapi/service/prophet';
    key = '4d1dfdc34527ab419a0275de9b5b7690';

    archive = null;
    language = null;
    settings = {
        archive: [],
    };

    init(){
        this.archive = new archive();
        this.archive.init(this);
        this.get();
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
                }
            }else{
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