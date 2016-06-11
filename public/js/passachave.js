function passachave(nometime) {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (xhttp.readyState == 4 && xhttp.status == 200) {
      document.getElementById(nometime).innerHTML = xhttp.responseText;
    }
  };
  xhttp.open("GET", "http://localhost:5000/avanca", true);
  xhttp.send();
}
