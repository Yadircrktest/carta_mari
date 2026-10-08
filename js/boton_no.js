(function(){
  var btn=document.getElementById('btnNo');
  if(!btn) return;

  var fija=false;
  var ultimoMovimiento=0;
  var intentos=0;
  var textos=['No','No','¿Seguro?','¿De verdad?','Piénsalo…','Mi amor…'];

  function solapa(a,b){
    return !(a.left>=b.right || a.right<=b.left || a.top>=b.bottom || a.bottom<=b.top);
  }

  function rect(x,y,w,h){
    return {left:x,top:y,right:x+w,bottom:y+h,width:w,height:h};
  }

  function areaSi(){
    var s=document.getElementById('btnSi');
    if(!s) return null;
    var r=s.getBoundingClientRect();
    return rect(r.left-12,r.top-12,r.width+24,r.height+24);
  }

  function candidato(){
    var r=btn.getBoundingClientRect();
    var w=r.width||132,h=r.height||56;
    var pad=14;
    var cx=r.left+r.width/2, cy=r.top+r.height/2;
    var zona=areaSi();

    for(var i=0;i<70;i++){
      var x=pad+Math.random()*(window.innerWidth-w-pad*2);
      var y=pad+Math.random()*(window.innerHeight-h-pad*2);
      var n=rect(x,y,w,h);
      if(zona && solapa(n,zona)) continue;
      var nx=x+w/2, ny=y+h/2;
      if(Math.hypot(nx-cx,ny-cy)<130) continue;
      return {x:x,y:y};
    }
    for(var j=0;j<70;j++){
      var x2=pad+Math.random()*(window.innerWidth-w-pad*2);
      var y2=pad+Math.random()*(window.innerHeight-h-pad*2);
      var n2=rect(x2,y2,w,h);
      if(zona && solapa(n2,zona)) continue;
      return {x:x2,y:y2};
    }
    return {x:pad,y:pad};
  }

  function mover(e){
    if(e){ try{e.preventDefault();}catch(_){} }
    if(Date.now()-ultimoMovimiento<150) return;
    ultimoMovimiento=Date.now();

    var p=candidato();

    if(!fija){
      var actual=btn.getBoundingClientRect();
      btn.style.position='fixed';
      btn.style.left=actual.left+'px';
      btn.style.top=actual.top+'px';
      btn.style.margin='0';
      fija=true;
    }

    btn.style.left=p.x+'px';
    btn.style.top=p.y+'px';

    intentos++;
    if(intentos<textos.length){
      btn.textContent=textos[intentos];
    }
  }

  if(window.PointerEvent){
    btn.addEventListener('pointerdown',mover,{passive:false});
  }else{
    btn.addEventListener('touchstart',mover,{passive:false});
    btn.addEventListener('mousedown',mover);
  }
  btn.addEventListener('mouseenter',mover);
  btn.addEventListener('click',mover);
  btn.addEventListener('contextmenu',function(e){e.preventDefault();mover(e);});
  btn.addEventListener('dragstart',function(e){e.preventDefault();mover(e);});
})();