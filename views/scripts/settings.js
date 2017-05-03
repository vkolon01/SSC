$(document).ready(function(){
    $.ajax({
        type:'POST',
        url: "/settings/",
        contentType:"application/json"
        }).done(function(list){
            document.getElementById("working_hours_settings").innerHTML = list;}
        ).fail(function(err){
            console.log(err);
        });

});

function update_mail_delivery_time(data){
    $.ajax({
        type:'POST',
        url: "/settings/change_mail_delivery_time",
        contentType:"application/json",
        data: JSON.stringify(data)
    }).done(function(time){
        console.log(time)
        document.getElementById("email_delivery_time_settings").innerHTML = time;}
    ).fail(function(err){
        console.log(err);
    });
}

function update_working_day(data){
    $.ajax({
        type: 'POST',
        url: '/settings/change_working_hours',
        contentType:"application/json",
        data: JSON.stringify(data)
    }).done(function(list){
        document.getElementById("working_hours_settings").innerHTML = list;}
    ).fail(function(err){
        console.log(err);
    });
}