document.addEventListener('click', desapareceu, false);

var doido = document.getElementById('errolista');

function desapareceu(e){
  doido.classList.add('desce');
}
