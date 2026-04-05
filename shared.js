(function(){
  /* ── PAGE FADE TRANSITION ── */
  document.addEventListener('DOMContentLoaded',function(){
    // Fade in on load
    requestAnimationFrame(function(){
      document.body.style.transition = 'opacity .35s ease';
      document.body.style.opacity = '1';
    });
  });

  // Fade out on internal link click
  document.addEventListener('click',function(e){
    var link = e.target.closest('a[href]');
    if(!link) return;
    var href = link.getAttribute('href');
    if(!href || href.startsWith('#') || href.startsWith('http') ||
       href.startsWith('mailto') || href.startsWith('tel') ||
       href.startsWith('https') || link.target === '_blank') return;
    e.preventDefault();
    var dest = href;
    document.body.style.transition = 'opacity .25s ease';
    document.body.style.opacity = '0';
    setTimeout(function(){ window.location.href = dest; }, 260);
  });

  /* ── HEADER SCROLL ── */
  var header=document.getElementById('siteHeader');
  if(header){
    window.addEventListener('scroll',function(){
      header.classList.toggle('scrolled',window.scrollY>10);
    },{passive:true});
  }

  /* ── ACTIVE NAV ── */
  document.addEventListener('DOMContentLoaded',function(){
    var links=document.querySelectorAll('.desktop-nav a');
    var path=window.location.pathname.split('/').pop()||'index.html';
    links.forEach(function(l){
      var href=l.getAttribute('href');
      if(href===path||(path===''&&href==='index.html'))l.classList.add('active');
    });
  });

  /* ── MOBILE NAV ── */
  document.addEventListener('DOMContentLoaded',function(){
    var burger=document.getElementById('burger');
    var overlay=document.getElementById('mobOverlay');
    var mobClose=document.getElementById('mobClose');
    function openMob(){if(overlay){overlay.classList.add('open');document.body.classList.add('no-scroll');}}
    function closeMob(){if(overlay){overlay.classList.remove('open');document.body.classList.remove('no-scroll');}}
    if(burger)burger.addEventListener('click',openMob);
    if(mobClose)mobClose.addEventListener('click',closeMob);
    window.closeMob=closeMob;
  });

  /* ── REVEAL ON SCROLL ── */
  document.addEventListener('DOMContentLoaded',function(){
    var els=document.querySelectorAll('.reveal');
    if(!els.length)return;
    var io=new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if(e.isIntersecting){e.target.classList.add('visible');io.unobserve(e.target);}
      });
    },{threshold:0.1,rootMargin:'0px 0px -30px 0px'});
    els.forEach(function(el){io.observe(el);});
  });

  /* ── COUNTER ANIMATION ── */
  function animCount(el){
    var target=parseFloat(el.dataset.target);
    var suffix=el.dataset.suffix||'';
    var prefix=el.dataset.prefix||'';
    var dur=1800;
    var start=null;
    var isFloat=String(target).includes('.');
    function step(ts){
      if(!start)start=ts;
      var p=Math.min((ts-start)/dur,1);
      var ease=1-Math.pow(1-p,3);
      var cur=target*ease;
      el.textContent=prefix+(isFloat?cur.toFixed(1):Math.floor(cur).toLocaleString())+suffix;
      if(p<1)requestAnimationFrame(step);
      else el.textContent=prefix+(isFloat?target.toFixed(1):target.toLocaleString())+suffix;
    }
    requestAnimationFrame(step);
  }
  document.addEventListener('DOMContentLoaded',function(){
    var counters=document.querySelectorAll('.stat-num[data-target]');
    if(!counters.length)return;
    var io=new IntersectionObserver(function(entries){
      entries.forEach(function(e){if(e.isIntersecting){animCount(e.target);io.unobserve(e.target);}});
    },{threshold:0.5});
    counters.forEach(function(c){io.observe(c);});
  });

  /* ── TICKER ── */
  document.addEventListener('DOMContentLoaded',function(){
    var track=document.getElementById('tickerTrack');
    if(!track)return;
    var items=['Brand Identity','Real Estate Branding','3D Visualization','Meta Ads','Print Collateral','Site Hoardings','VR Walkthroughs','WhatsApp Automation','CRM Setup','Brand Strategy','Mascot Design','Packaging','Social Media','Brochure Design','Architectural Renders','Motion Graphics','Lead Generation','Market Research'];
    var all=items.concat(items);
    all.forEach(function(item){
      var div=document.createElement('div');
      div.className='ticker-item';
      div.innerHTML='<span class="ticker-dot"></span><span>'+item+'</span>';
      track.appendChild(div);
    });
  });

  /* ── FAQ ── */
  document.addEventListener('DOMContentLoaded',function(){
    document.querySelectorAll('.faq-trigger').forEach(function(trigger){
      trigger.addEventListener('click',function(){
        var item=trigger.closest('.faq-item');
        var body=item.querySelector('.faq-body');
        var isOpen=item.classList.contains('open');
        document.querySelectorAll('.faq-item.open').forEach(function(o){
          o.classList.remove('open');
          o.querySelector('.faq-body').style.maxHeight='0';
        });
        if(!isOpen){item.classList.add('open');body.style.maxHeight=body.scrollHeight+'px';}
      });
    });
  });

  /* ── WORK FILTER ── */
  document.addEventListener('DOMContentLoaded',function(){
    var btns=document.querySelectorAll('.filter-btn[data-filter]');
    var cards=document.querySelectorAll('.work-card[data-category]');
    if(!btns.length)return;
    btns.forEach(function(btn){
      btn.addEventListener('click',function(){
        btns.forEach(function(b){b.classList.remove('active');});
        btn.classList.add('active');
        var f=btn.dataset.filter;
        cards.forEach(function(card){
          var show=f==='all'||card.dataset.category===f;
          card.style.display=show?'block':'none';
        });
      });
    });
  });

})();
