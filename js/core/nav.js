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
            case 'analyzed_traffic':
                this.analyzedTraffic();
                break;
            case 'analyzed_usage':
                this.analyzedUsage();
                break;
            default:
                this.dashboard();
                break;
        }
    }

    active(title){
        $('.navbar-collapse').collapse('hide');
        // $('#admin_content').replaceWith(app.getFile('/tpl/home.html'));
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
        this.active('realtime');
    }

    network(){
        $('#admin_content').html(app.getFile('/tpl/network.html'));
        prophet.realtime.drawNetWork();
        this.active('realtime');
    }

    analyzedTraffic(){
        $('#admin_content').html(app.getFile('/tpl/analyzed_traffic.html'));
        prophet.analyzed.initData();
        prophet.analyzed.drawTraffic();
        this.active('analyzed');
    }

    analyzedUsage(){
        $('#admin_content').html(app.getFile('/tpl/analyzed_usage.html'));
        this.active('analyzed');
    }
}