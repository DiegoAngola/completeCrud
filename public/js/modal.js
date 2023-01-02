let modal = document.querySelector(".modal-container");
let closeModal = document.querySelector(".close");

//CERRAR MODAL CON BOTÓN
closeModal.onclick = function(){
    modal.style.visibility = "hidden";
    modal.style.opacity = 0;
}

//CERRAR MODAL CON CLICK EN FONDO
modal.onclick = function(){
    modal.style.visibility = "hidden";
    modal.style.opacity = 0;
}

