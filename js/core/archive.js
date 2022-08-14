class archive{

    list = [];
    parent = null;

    init(parent){
        this.parent = parent;
    }

    drawList(){
        $('#prophet_archive_list').html(app.tpl('prophet_archive_list_tpl', this.list));
    }

    add(){
        let key = prompt('请输入监测点的key');
        //检查这个 key 是否有效
        $.post(this.parent.api,{
            archive_key: key,
            action: 'archive_get',
        },(rsp)=>{
            if(rsp.status===1){
                if(this.checkExist(key)){
                    alert('监测点已存在');
                    return false;
                }
                this.list.push({
                    key: key,
                    name: rsp.data,
                });
                this.parent.settings.archive = this.list;
                this.parent.set();
            }else{
                alert('无效的监测点.');
            }
        },'json');
    }

    delete(key){
        for(let i=0;i<this.list.length;i++){
            if(this.list[i].key===key){
                this.list.splice(i,1);
                this.parent.set();
                return true;
            }
        }
        return false;
    }

    checkExist(key){
        for(let i=0;i<this.list.length;i++){
            if(this.list[i].key===key){
                return true;
            }
        }
        return false;
    }
}