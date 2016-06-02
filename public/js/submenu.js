var tagmenu = document.getElementsByClassName('tag-menu');
var uls = document.getElementsByTagName('ul');

tagmenu[0].addEventListener('click', function(e) {
  for(var i = 0; i < uls.length; i++){
    uls[i].classList.toggle('aparece');
  }
}, false);
