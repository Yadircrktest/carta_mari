(function(){
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var capa=document.createElement('div');
  capa.className='capa-corazones';
  capa.setAttribute('aria-hidden','true');
  document.body.appendChild(capa);

  var maxTotal=22;
  var activos=0;

  function crear(){
    if(activos>=maxTotal) return;
    activos++;
    var h=document.createElement('span');
    h.className='corazon';
    h.textContent='\u2665';
    var tam=34+Math.random()*46;
    h.style.left=(Math.random()*100)+'vw';
    h.style.fontSize=tam+'px';
    h.style.animationDuration=(7+Math.random()*7)+'s';
    h.style.opacity=(0.4+Math.random()*0.45);
    h.addEventListener('animationend',function(){
      h.remove();
      activos--;
    });
    capa.appendChild(h);
  }

  for(var i=0;i<10;i++){ setTimeout(crear,i*300); }
  setInterval(crear,700);
})();