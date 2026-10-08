(function(){
  var cartas=Array.prototype.slice.call(document.querySelectorAll('[data-url]'));
  if(!cartas.length) return;

  var esTactil=window.matchMedia('(hover: none)').matches;
  if(esTactil) document.body.classList.add('tactil');

  function abrir(c){ c.classList.add('abierta'); }
  function cerrar(c){ c.classList.remove('abierta'); }
  function cerrarOtras(excepto){
    cartas.forEach(function(c){ if(c!==excepto) cerrar(c); });
  }
  function ir(c){ window.location.href=c.getAttribute('data-url'); }

  cartas.forEach(function(c){
    c.addEventListener('keydown',function(e){
      if(e.key!=='Enter' && e.key!==' ' && e.key!=='Spacebar') return;
      e.preventDefault();
      if(esTactil){
        if(c.classList.contains('abierta')){ ir(c); }
        else { cerrarOtras(c); abrir(c); }
      }else{
        ir(c);
      }
    });
  });

  if(esTactil){
    cartas.forEach(function(c){
      c.addEventListener('click',function(){
        if(c.classList.contains('abierta')){ ir(c); return; }
        cerrarOtras(c);
        abrir(c);
      });
    });
    document.addEventListener('click',function(e){
      if(!e.target.closest('.carta')) cerrarOtras();
    });
  }else{
    cartas.forEach(function(c){
      c.addEventListener('mouseenter',function(){ abrir(c); });
      c.addEventListener('mouseleave',function(){ cerrar(c); });
      c.addEventListener('click',function(){ ir(c); });
    });
  }
})();