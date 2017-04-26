function delete_appointment(id){
    $.ajax({
        type: 'POST',
        url: '/appointments/delete_appointment',
        contentType:"application/json",
        data: JSON.stringify({"id":id})
    }).done(function(table){
        update_table(table);}
    ).fail(function(err){
        console.log(err);
    });
}
function update_table(table){
    document.getElementById("appointment_table").innerHTML = table;
}
function browse_appointments(){
    $.ajax({
        type: 'POST',
        url: '/appointments/browse_appointments',
        contentType:"application/json",
        data: JSON.stringify({"id": document.getElementById('id').value})
    }).done(function(table){
        update_table(table);}
    ).fail(function(err){
        console.log(err);
    });
}