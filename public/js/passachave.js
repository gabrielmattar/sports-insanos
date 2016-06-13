function passachave(nometime, indice) {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (xhttp.readyState == 4 && xhttp.status == 200) {
      //Encontrar o proximo maluquinho
      var indicenext= Math.floor(Number(indice)/2);
      document.getElementById('-' + indicenext).innerHTML = nometime;
    }
  };
  var indicenext= Math.floor(Number(indice)/2);
  var prox = document.getElementById('-' + indicenext);
  prox.innerHTML = nometime;
  prox.setAttribute("onclick", "passachave('" + nometime + "'," + indicenext + ")");
  prox.id = nometime+indicenext;

  var chavinha = prox.parentNode.parentNode.parentNode.id;
  chavinha -= 1;

  var clickado = document.getElementById(nometime+indice);
  var chave = clickado.parentNode.parentNode.parentNode;
  var campeonato = chave.parentNode;
  var path = campeonato.id + '/' + chavinha + '/' + nometime + '/' + indice;
  xhttp.open("GET", "/avanca/" + path, true);
  xhttp.send();
}
