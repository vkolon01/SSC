$(document).ready(function(){
    $.ajax({
        type:'POST',
        url: "/settings/",
        contentType:"application/json"
        }).done(function(list){
            update_list(list);}
        ).fail(function(err){
            console.log(err);
        });
});

function update_working_day(data){
    $.ajax({
        type: 'POST',
        url: '/settings/change_working_hours',
        contentType:"application/json",
        data: JSON.stringify(data)
    }).done(function(list){
        update_list(list);}
    ).fail(function(err){
        console.log(err);
    });
}

function update_list(list){
    document.getElementById("working_hours_settings").innerHTML = list;
}
