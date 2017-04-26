function change_phone_number(){
    document.getElementById("phone_number").style.display = "none";
    document.getElementById("edit_phone_number").style.display = "";
}
function change_email(){
    document.getElementById("email_address").style.display = "none";
    document.getElementById("edit_email").style.display = "";
}
function delete_account(){
    if(document.getElementById("confirm_delete").style.display == "none"){
        document.getElementById("confirm_delete").style.display = "";
        document.getElementById("delete").style.display = "none";
    }else{
        document.getElementById("confirm_delete").style.display = "none";
        document.getElementById("delete").style.display = "";
    }
}
function new_appointment(){
    if(document.getElementById("appointment_form").style.display == "none"){
        document.getElementById("appointment_form").style.display = "";
        document.getElementById("new_appointment").style.display = "none";
    }else{
        document.getElementById("appointment_form").style.display = "none";
        document.getElementById("new_appointment").style.display = "";
    }
}