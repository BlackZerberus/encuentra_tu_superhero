$(document).ready(function () {
    //escondemos la card mientras no se busquen datos
  $("#card-section").hide();
  //agregamos el evvento click al boton del formulario
  $("#btn-buscar").on("click", function (e) {
      //prevenimos el comportamiento por defecto
    e.preventDefault();
    //buscamos el id
    buscar($("#id-search").val());
  });
});

//expresion regular 
const SOLO_NUMEROS = /^\d+$/;

//se le da un id 
function buscar(id) {
    //si es numerico se llama a obtenerDatos
  if (SOLO_NUMEROS.test(id)) {
    obtenerDatos(id);
    //sino se le avisa al usuario que solo se permiten numeros
  } else {
    alert("Por favor, solo ingrese numeros!!");
  }
}

//funcion encargada de solicitar y consumir la api
function obtenerDatos(request) {
    //solicitud GET
  $.ajax(`https://superheroapi.com/api.php/10220931243739558/${request}`)
  //si la solicitud sale bien...
    .done(function (response) {
        //nos aseguramos de que exista un heroe valido para la id dada
      if (response.response == "success") {
        $("#card-section").show();
        //llamamos a showHero para mostrar los datos en la card
        showHero(response);
        //sino desplegamos un mensaje advirtiendo lo sucedido
      } else {
        $("#card-section").hide();
        alert(response.response + ": " + response.error);
      }
    })
    //si falla la request se desplegara un alert 
    .fail(function () {
      alert("ha ocurrido un error");
    });
}

function showHero(data) {
  //llenamos la card con los datos del heroe solicitado
  $("#hero-img").attr("src", data.image.url);
  $("#hero-name").text(data.name);
  $("#connections").text(
    `Conexiones: ${data.connections["group-affiliation"]}`
  );
  $("#publisher").text(`Publisher: ${data.biography.publisher}`);
  $("#occupation").text(`Ocupación: ${data.work.occupation}`);
  $("#first").text(`Primera aparición: ${data.biography["first-appearance"]}`);
  $("#h").text(
    `Altura: ${data.appearance.height[0]} / ${data.appearance.height[1]}`
  );
  $("#w").text(
    `Peso: ${data.appearance.weight[0]} / ${data.appearance.weight[1]}`
  );
  $("#alias").text(`Alias: ${data.biography.aliases.toString()}`);

  //generamos el grafico con los datos
  let stats = data.powerstats;
  let chart = new CanvasJS.Chart("chartContainer", {
    exportEnabled: true,
    animationEnabled: true,
    title: {
      text: `Estadisticas de poder para ${data.name}`,
    },
    
    data: [
      {
        type: "pie",
        showInLegend: true,
        toolTipContent: "{name}",
        indexLabel: "{name}",
        dataPoints: [
          {
            y: stats.intelligence,
            name: `Intelligence(${stats.intelligence})`,
          },
          { y: stats.strength, name: `Strength(${stats.strength})` },
          { y: stats.speed, name: `Speed(${stats.speed})` },
          { y: stats.durability, name: `Durability(${stats.durability})` },
          { y: stats.power, name: `Power(${stats.power})` },
          { y: stats.combat, name: `Combat(${stats.combat})` },
        ],
      },
    ],
  });
  chart.render();
}


