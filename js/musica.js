(function(){
  // ===== CONFIGURAR AQUÍ =====
  var PLAYLIST_ID = 'PLKZDcwltxBWU';
  var ENLACE = 'https://music.youtube.com/playlist?list=PLKZDcwltxBWU';
  var CANCIONES = [
    { id: 'VDFuS4KmkKE', titulo: 'Flor P\u00e1lida - Marc Anthony' },
    { id: 'PQ2CMsUwEdk', titulo: 'Humanos a Marte - Chayanne' },
    { id: 'GEFjJr1lK6c', titulo: 'La Vida en un Beso - Warcry' },
    { id: 'VS79ngaSmP8', titulo: 'Devorando el Coraz\u00f3n - Warcry' },
    { id: 'Hm4lyRVxwBs', titulo: 'La Moza - Maracaibo 15' },
    { id: 'ORrFJ63nlcA', titulo: 'Perfect - Ed Sheeran' },
    { id: '2BdsygDv-So', titulo: 'La Leyenda del Hada y el Mago - Rata Blanca' },
    { id: 'l_ZyDlTfndE', titulo: 'Am\u00e1rrame - Mon Laferte ft. Juanes' },
    { id: 't_M5BS6-H6s', titulo: 'A Dios Le Pido - Juanes' },
    { id: '5L9oTft3UWc', titulo: 'Disfruto - Carla Morrison' },
    { id: 'JRmTFeCqxHE', titulo: 'Canela - Nanpa B\u00e1sico' },
    { id: 'H9y-oKSdA9w', titulo: 'Robarte un Beso - Carlos Vives' },
    { id: 'MjKBxrYhDW8', titulo: 'Vivir Lo Nuestro - India ft. Marc Anthony' },
    { id: 'uvK59wxMDsw', titulo: 'Movimiento de Caderas - Rayo & Toby' },
    { id: 'C2_uDy7Cu_w', titulo: 'Alguien Como T\u00fa - J\u00f3sean Log' }
  ];
  // ============================

  var player = null;
  var apiLista = false;
  var sincronizando = null;
  var indice = 0;
  var barajar = false;
  var errores = 0;

  var barra = document.getElementById('barra');
  var btnPlay = document.getElementById('btnPlay');
  var btnAnterior = document.getElementById('btnAnterior');
  var btnSiguiente = document.getElementById('btnSiguiente');
  var btnAleatorio = document.getElementById('btnAleatorio');
  var tActual = document.getElementById('tiempoActual');
  var tTotal = document.getElementById('tiempoTotal');
  var lista = document.getElementById('lista');
  var tituloEl = document.getElementById('tituloCancion');
  var autorEl = document.getElementById('autorCancion');
  var errorMsg = document.getElementById('errorMsg');
  var enlace = document.querySelector('.reproductor__enlace');

  function contar(){ return CANCIONES.length; }
  function ids(){ return CANCIONES.map(function(c){return c.id;}); }
  function mostrarError(txt){
    errorMsg.textContent = txt;
    errorMsg.hidden = false;
  }
  function ocultarError(){ errorMsg.hidden = true; }

  function pintarLista(){
    lista.innerHTML = '';
    CANCIONES.forEach(function(c,i){
      var li=document.createElement('li');
      li.setAttribute('data-indice',i);
      li.innerHTML = '<span class="num">'+(i+1)+'</span><span>'+c.titulo+'</span>';
      li.addEventListener('click',function(){
        if(!player){ mostrarError('A\u00fan no carga el reproductor. Revisa tu conexi\u00f3n.'); return; }
        pintarActual(i);
        player.playVideoAt(i);
      });
      lista.appendChild(li);
    });
    pintarActual(0);
  }

  function pintarActual(i){
    indice=i;
    var items=lista.children;
    for(var k=0;k<items.length;k++){
      items[k].classList.toggle('actual', k===i);
    }
    if(CANCIONES[i]){
      tituloEl.textContent = CANCIONES[i].titulo;
      autorEl.textContent = '';
    }
  }

  function formatear(seg){
    if(!isFinite(seg)) return '0:00';
    var m=Math.floor(seg/60), s=Math.floor(seg%60);
    return m+':'+(s<10?'0':'')+s;
  }

  function sincronizar(){
    if(!player || !player.getVideoData) return;
    try{
      var idx=player.getPlaylistIndex();
      if(idx>=0 && idx<contar() && idx!==indice) pintarActual(idx);
      var dur=player.getDuration instanceof Function ? player.getDuration() : 0;
      tTotal.textContent = formatear(dur);
    }catch(e){}
  }

  function iniciarTiempo(){
    pararTiempo();
    sincronizando = setInterval(function(){
      if(player && player.getCurrentTime){
        var cur=player.getCurrentTime();
        var dur=player.getDuration() || 0;
        tActual.textContent = formatear(cur);
        var valor = dur>0 ? (cur/dur*100) : 0;
        if(document.activeElement!==barra) barra.value=valor;
      }
    },600);
  }
  function pararTiempo(){ if(sincronizando){clearInterval(sincronizando); sincronizando=null;} }

  function otrasCancion(){
    var n=contar();
    if(n<=1) return 0;
    var x;
    do{ x=Math.floor(Math.random()*n); }while(x===indice);
    return x;
  }

  function avanzar(dir){
    var n=contar();
    if(!n) return;
    var sig=barajar ? otrasCancion() : (indice+dir+n)%n;
    if(player){
      pintarActual(sig);
      player.playVideoAt(sig);
    } else {
      pintarActual(sig);
    }
  }

  function onApiListo(){
    apiLista=true;
    player = new YT.Player('ytPlayer',{
      height:'270',
      width:'480',
      playerVars:{ playsinline:1, rel:0, controls:1, modestbranding:1 },
      events:{
        onReady: function(e){
          ocultarError();
          pintarLista();
          var x=PLAYLIST_ID || (CANCIONES.length ? ids() : '');
          e.target.loadPlaylist({listType:'playlist', list:x, index:0});
          sincronizar();
        },
        onStateChange: function(e){
          var EST=YT.PlayerState;
          if(e.data===EST.PLAYING){
            ocultarError();
            btnPlay.textContent='\u275A\u275A';
            iniciarTiempo();
            sincronizar();
          } else if(e.data===EST.PAUSED || e.data===EST.CUED){
            btnPlay.textContent='\u25B6';
            pararTiempo();
          } else if(e.data===EST.ENDED){
            pararTiempo();
            btnPlay.textContent='\u25B6';
            if(barajar){ avanzar(1); }
          } else if(e.data===EST.BUFFERING){
            sincronizar();
          }
        },
        onError: function(e){
          errores++;
          pararTiempo();
          btnPlay.textContent='\u25B6';
          mostrarError('No se pudo reproducir esta canci\u00f3n (el video restringe la reproducci\u00f3n). Se intenta con la siguiente\u2026');
          if(errores<contar()) avanzar(1);
        }
      }
    });
  }

  btnPlay.addEventListener('click',function(){
    if(!apiLista){ mostrarError('El reproductor todav\u00eda no carga. Revisa tu conexi\u00f3n o usa el enlace de abajo.'); return; }
    if(!player) return;
    var est=player.getPlayerState();
    if(est===1){ player.pauseVideo(); btnPlay.textContent='\u25B6'; }
    else { ocultarError(); player.playVideo(); }
  });
  btnSiguiente.addEventListener('click',function(){ avanzar(1); });
  btnAnterior.addEventListener('click',function(){
    if(player && player.getCurrentTime()>4){ player.seekTo(0,true); return; }
    avanzar(-1);
  });
  btnAleatorio.addEventListener('click',function(){
    barajar=!barajar;
    btnAleatorio.classList.toggle('activo', barajar);
  });
  barra.addEventListener('input',function(){
    if(!player) return;
    var dur=player.getDuration();
    if(dur>0) player.seekTo(barra.value/100*dur,true);
  });

  window.onYouTubeIframeAPIReady = onApiListo;

  pintarLista();

  setTimeout(function(){
    if(!apiLista){
      mostrarError('No se pudo cargar el reproductor de YouTube. Revisa tu conexi\u00f3n o abre la playlist con el enlace de abajo.');
    }
  },8000);

  var tag=document.createElement('script');
  tag.src='https://www.youtube.com/iframe_api';
  var primero=document.getElementsByTagName('script')[0];
  primero.parentNode.insertBefore(tag,primero);
})();