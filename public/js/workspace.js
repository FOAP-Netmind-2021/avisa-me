/* Botón copiar URL */
const copyUrlBox = document.querySelector("#copyUrlBox");  
const inputURL = document.querySelector("#copyURL");

inputURL.value = window.location.href; // Recogemos la URL del navegador
  
document.querySelector("#copyUrlBtn").addEventListener("click", () => {
    
    // Toggle
    if(copyUrlBox.style.display == "block"){
      copyUrlBox.style.display = "none";
      return;
    }
    copyUrlBox.style.display = "block";
    // Fin del toggle

    inputURL.focus(); // Foco en el input
    inputURL.select(); // Selección del input
    try{
    document.execCommand('copy'); // Copiar al clipboard
    // Ocultar de nuevo
    setTimeout(()=>{
        copyUrlBox.style.display = "none";
    },1500);
    }
    catch(err){
      console.log(err);
    }
  })
















localStorage.setItem('miGato', 'Loki');