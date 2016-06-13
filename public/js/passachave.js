function passachave(nometime, indice) {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (xhttp.readyState == 4 && xhttp.status == 200) {
      //Encontrar o proximo maluquinho
      document.getElementById().innerHTML = xhttp.responseText;
    }
  };
  var clickado = document.getElementById(nometime+indice);
  var chave = clickado.parentNode.parentNode.parentNode;
  var campeonato = chave.parentNode;
  var path = campeonato.id + '/' + chave.id + '/' + nometime + '/' + indice;
  xhttp.open("GET", "/avanca/" + path, true);
  xhttp.send();
}
