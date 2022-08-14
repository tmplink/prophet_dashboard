class nav_main{
    current = null

    init(){
        //获取 service
        let params = app.getUrlVars(window.location.href);
        switch (params.service) {
            case 'dashboard':
                this.dashboard();
                break;
            case 'global':
                this.global();
                break;
            case 'network':
                this.network();
                break;
            case 'archive_traffic':
                this.archiveTraffic();
                break;
            case 'archive_usage':
                this.archiveUsage();
                break;
            default:
                this.dashboard();
                break;
        }
    }

    active(title){
        $('.navbar-collapse').collapse('hide');
        if(this.current!==title){
            $('#nav_'+this.current).removeClass('active');
            $('#nav_'+title).addClass('active');
            this.current=title;
        }
        //初始化链接
        app.linkRebind();
    }

    dashboard(){
        $('#admin_content').html(app.getFile('/tpl/dashboard.html'));
        prophet.archive.drawList();
        this.active('dashboard');
    }

    global(){
        $('#admin_content').html(app.getFile('/tpl/global.html'));
        this.active('global');
    }

    network(){
        $('#admin_content').html(app.getFile('/tpl/network.html'));
        prophet.realtime.drawNetWork();
        this.active('network');
    }

    archiveTraffic(){
        $('#admin_content').html(app.getFile('/tpl/archive_traffic.html'));
        this.active('archive_traffic');
    }

    archiveUsage(){
        $('#admin_content').html(app.getFile('/tpl/archive_usage.html'));
        this.active('archive_usage');
    }
}