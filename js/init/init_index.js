prophet.ready(()=>{
    if(prophet.isKeyValid){
        app.open('/panel');
    }else{
        app.open('/register');
    }
});