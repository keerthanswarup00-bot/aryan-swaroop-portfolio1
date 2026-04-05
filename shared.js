(function(){
  /* ── THEME ── */
  var themeKey='aryan-theme';
  function getStoredTheme(){
    try{return localStorage.getItem(themeKey);}catch(err){return null;}
  }
  function setStoredTheme(theme){
    try{localStorage.setItem(themeKey,theme);}catch(err){}
  }
  function getPreferredTheme(){
    var stored=getStoredTheme();
    if(stored==='light'||stored==='dark') return stored;
    return window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  function applyTheme(theme){
    document.body.classList.toggle('theme-dark',theme==='dark');
    document.documentElement.setAttribute('data-theme',theme);
    document.querySelectorAll('.theme-toggle').forEach(function(btn){
      var dark=theme==='dark';
      btn.setAttribute('aria-pressed',dark?'true':'false');
      btn.setAttribute('aria-label',dark?'Switch to light theme':'Switch to dark theme');
      btn.innerHTML=dark
        ? '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" aria-hidden="true"><circle cx="12" cy="12" r="4.2"></circle><path d="M12 2.5v2.2M12 19.3v2.2M4.9 4.9l1.6 1.6M17.5 17.5l1.6 1.6M2.5 12h2.2M19.3 12h2.2M4.9 19.1l1.6-1.6M17.5 6.5l1.6-1.6"></path></svg>'
        : '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" aria-hidden="true"><path d="M20 15.2A7.9 7.9 0 0 1 8.8 4 8.8 8.8 0 1 0 20 15.2z"></path></svg>';
    });
  }
  document.addEventListener('DOMContentLoaded',function(){
    applyTheme(getPreferredTheme());
    document.querySelectorAll('.theme-toggle').forEach(function(btn){
      btn.addEventListener('click',function(){
        var next=document.body.classList.contains('theme-dark')?'light':'dark';
        setStoredTheme(next);
        applyTheme(next);
      });
    });
  });

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
