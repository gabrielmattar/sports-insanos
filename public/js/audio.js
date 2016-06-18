var AudioContext = window.AudioContext ||
                    window.webkitAudioContext;
var context = new AudioContext();

var musica1 = context.createBufferSource();

var dropbass  = context.createBiquadFilter();
  //Definindo o tipo do filtro como passa baixas
dropbass.type = 'lowpass';
  //Definindo limite do filtro
dropbass.frequency.value = 440;

musica1.path = "../source/got.mp3";


musica1.connect(dropbass);
dropbass.connect(context.destination);


carregaSom(musica1.path, musica1);


dropbass.frequency.value = 5000;


musica1.start();


(function() {
    document.onmousemove = handleMouseMove;
    function handleMouseMove(event) {
        var dot, eventDoc, doc, body, pageX, pageY;

        event = event || window.event; // IE-ism

        // If pageX/Y aren't available and clientX/Y are,
        // calculate pageX/Y - logic taken from jQuery.
        // (This is to support old IE)
        if (event.pageX == null && event.clientX != null) {
            eventDoc = (event.target && event.target.ownerDocument) || document;
            doc = eventDoc.documentElement;
            body = eventDoc.body;

            event.pageX = event.clientX +
              (doc && doc.scrollLeft || body && body.scrollLeft || 0) -
              (doc && doc.clientLeft || body && body.clientLeft || 0);
            event.pageY = event.clientY +
              (doc && doc.scrollTop  || body && body.scrollTop  || 0) -
              (doc && doc.clientTop  || body && body.clientTop  || 0 );
        }
        // Use event.pageX / event.pageY here
        // Interpolar a frequencia entre a minima e metade da fornecida
        var minValue = 300;
        var maxValue = context.sampleRate / 2;
        // Logarithm (base 2) to compute how many octaves fall in the range.
        var numberOfOctaves = Math.log(maxValue / minValue) / Math.LN2;
        // Compute a multiplier from 0 to 1 based on an exponential scale.
        var multiplier = Math.pow(2, numberOfOctaves * ((event.pageY/window.innerHeight) - 1.0));
        // Get back to the frequency value between min and max.
        dropbass.frequency.value = maxValue * multiplier;
    }
})();




//Funcao para carregar novos sons atraves de um caminho
function carregaSom(url, musiquinha) {
  var request = new XMLHttpRequest();
  request.open('GET', url, true);
  request.responseType = 'arraybuffer';

  // Decode asynchronously
  request.onload = function() {
    context.decodeAudioData(request.response, function(buffer) {
      console.log(buffer);
      musiquinha.buffer = buffer;
    });
  }
  request.send();
}
