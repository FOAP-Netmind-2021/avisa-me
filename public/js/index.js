const navToggle = document.querySelector(".nav-toggle");
const navMenu = document.querySelector(".nav-menu");

navToggle.addEventListener("click", () => {
  navMenu.classList.toggle("nav-menu_visible");

  if (navMenu.classList.contains("nav-menu_visible")) {
    navToggle.setAttribute("aria-label", "Cerrar menú");
  } else {
    navToggle.setAttribute("aria-label", "Abrir menú");
  }
});


    /* 
    0.Nombrar bien las variables
    1.Fetch con post (actualizar la estructura del schema, añadir la fecha del post a la nota en el db)
    2.Luego en el post volver a renderizar la vista con la fecha ya añadida o eso y q se desoculte del lado cliente?
    3.Setear las horas para cada region? Porque las 16 aqui no son las 16 en china
    */
