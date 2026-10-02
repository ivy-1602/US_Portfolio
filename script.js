/* Uma Salunke · portfolio  */
(function(){
'use strict';
var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
var hasIO='IntersectionObserver' in window;
var $=function(s,r){return(r||document).querySelector(s)};
var $$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};
var store={get:function(k){try{return sessionStorage.getItem(k)}catch(e){return null}},set:function(k,v){try{sessionStorage.setItem(k,v)}catch(e){}}};

/* ── Name splash ── */
var splash=$('#ww-splash');
if(splash){
var wwForm=$('#ww-form',splash),wwName=$('#ww-name',splash);
document.body.style.overflow='hidden';
var lastName=store.get('ww-visitor-name');
if(wwName&&lastName)wwName.value=lastName;
if(wwName){wwName.focus({preventScroll:true});if(lastName)wwName.select()}
wwForm.addEventListener('submit',function(e){
e.preventDefault();
var name=wwName.value.trim().slice(0,60);
if(!name)return;
store.set('ww-visitor-name',name);
var g=$('#heroGreet');
if(g){g.textContent='hey '+name+', this is';g.hidden=false}
if(window.__addVisitor){try{window.__addVisitor(name).catch(function(){})}catch(err){}}
document.body.style.overflow='';
splash.classList.add('is-gone');
setTimeout(function(){splash.style.display='none'},reduce?0:650);
});
var sc=$('.splash-glitter',splash);
if(sc&&sc.getContext&&!reduce){
var sx=sc.getContext('2d'),sw=0,sh=0,sd=[],scol=['#E15921','#F5F5F0','#D73F00','#FFB36B'],sdpr=Math.min(window.devicePixelRatio||1,2);
var sSize=function(){
sw=sc.offsetWidth;sh=sc.offsetHeight;sc.width=sw*sdpr;sc.height=sh*sdpr;sx.setTransform(sdpr,0,0,sdpr,0,0);sd=[];
for(var i=0,n=Math.round(sw*sh/9000);i<n;i++)sd.push({x:Math.random()*sw,y:Math.random()*sh,r:Math.random()*1.7+.4,c:scol[i%4],p:Math.random()*6.3,s:Math.random()*.03+.01});
};
var sLoop=function(){
sx.clearRect(0,0,sw,sh);
sd.forEach(function(q){q.p+=q.s;sx.globalAlpha=.15+.75*Math.abs(Math.sin(q.p));sx.fillStyle=q.c;sx.beginPath();sx.arc(q.x,q.y,q.r,0,6.3);sx.fill()});
if(!splash.classList.contains('is-gone'))requestAnimationFrame(sLoop);
};
sSize();sLoop();
addEventListener('resize',sSize);
}
}

/* ── Tap-to-expand cards (Beyond the build + Skills) ── */
var accordion=function(cardSel,btnSel,canToggle){
$$(btnSel).forEach(function(btn){
btn.addEventListener('click',function(){
if(canToggle&&!canToggle())return;
var card=btn.closest(cardSel);
var open=!card.classList.contains('open');
$$(cardSel+'.open').forEach(function(c){
c.classList.remove('open');
var b=c.querySelector(btnSel);
if(b)b.setAttribute('aria-expanded','false');
});
if(open){
card.classList.add('open');
btn.setAttribute('aria-expanded','true');
}
});
});
};
accordion('.love','.love-btn');
var wideMQ=matchMedia('(min-width:841px)');
accordion('.spell','.spell-btn',function(){return!wideMQ.matches});
var syncSpells=function(){
$$('.spell').forEach(function(c){
var b=c.querySelector('.spell-btn');
if(wideMQ.matches){
c.classList.remove('open');
b.setAttribute('aria-expanded','true');
b.setAttribute('tabindex','-1');
}else{
b.setAttribute('aria-expanded',String(c.classList.contains('open')));
b.removeAttribute('tabindex');
}
});
};
syncSpells();
if(wideMQ.addEventListener)wideMQ.addEventListener('change',syncSpells);

/* ── Experience: tap to expand on phones ── */
var repMQ=matchMedia('(max-width:560px)');
var repCols=$$('.rep-col');
var repToggle=function(card){
var open=!card.classList.contains('open');
repCols.forEach(function(c){
c.classList.remove('open');
var t=c.querySelector('h3');
if(t)t.setAttribute('aria-expanded','false');
});
if(open){
card.classList.add('open');
card.querySelector('h3').setAttribute('aria-expanded','true');
}
};
repCols.forEach(function(card){
var t=card.querySelector('h3');
card.addEventListener('click',function(e){
if(!repMQ.matches||e.target.closest('a'))return;
repToggle(card);
});
t.addEventListener('keydown',function(e){
if(!repMQ.matches)return;
if(e.key==='Enter'||e.key===' '){e.preventDefault();repToggle(card)}
});
});
var syncRep=function(){
repCols.forEach(function(c){
var t=c.querySelector('h3');
if(repMQ.matches){
t.setAttribute('role','button');
t.setAttribute('tabindex','0');
t.setAttribute('aria-expanded',String(c.classList.contains('open')));
}else{
t.removeAttribute('role');
t.removeAttribute('tabindex');
t.removeAttribute('aria-expanded');
c.classList.remove('open');
}
});
};
syncRep();
if(repMQ.addEventListener)repMQ.addEventListener('change',syncRep);

/* ── Honors: Side A / Side B / Education — smooth tap-to-expand, one open at a time ── */
accordion('.edu','.edu-btn');

/* ── Certifications: year-wise tap-to-expand, one open at a time ── */
accordion('.cert-group','.cert-btn');

/* ── Compact mobile cards → tap opens a popup ── */
var cardMQ=matchMedia('(max-width:560px)');
var modal=document.createElement('div');
modal.className='mobile-detail-modal';
modal.hidden=true;
modal.setAttribute('role','dialog');
modal.setAttribute('aria-modal','true');
modal.setAttribute('aria-labelledby','mdmTitle');
modal.innerHTML='<div class="mobile-detail-modal__panel" tabindex="-1">'+
'<button class="mobile-detail-modal__close" type="button" aria-label="Close">&times;</button>'+
'<h3 class="mobile-detail-modal__title" id="mdmTitle"></h3>'+
'<div class="mobile-detail-modal__body"></div></div>';
document.body.appendChild(modal);
var mPanel=$('.mobile-detail-modal__panel',modal),
mTitle=$('.mobile-detail-modal__title',modal),
mBody=$('.mobile-detail-modal__body',modal),
lastFocus=null;

var closeModal=function(){
if(modal.hidden)return;
modal.hidden=true;
document.body.style.overflow='';
if(lastFocus&&lastFocus.focus)lastFocus.focus();
lastFocus=null;
};
var openModal=function(kind,title,nodes,bg,ink,from){
lastFocus=from||document.activeElement;
modal.setAttribute('data-kind',kind);
mPanel.style.setProperty('--m-bg',bg||'');
mPanel.style.setProperty('--m-ink',ink||'');
mTitle.textContent=title;
mBody.textContent='';
nodes.forEach(function(n){if(n)mBody.appendChild(n.cloneNode(true))});
modal.hidden=false;
document.body.style.overflow='hidden';
mPanel.scrollTop=0;
mPanel.focus();
};
modal.addEventListener('click',function(e){
if(e.target===modal||e.target.closest('.mobile-detail-modal__close'))closeModal();
});
document.addEventListener('keydown',function(e){
if(e.key==='Escape')closeModal();
if(e.key==='Tab'&&!modal.hidden){
var f=$$('button,a[href]',modal);
if(!f.length)return;
var first=f[0],last=f[f.length-1];
if(e.shiftKey&&(document.activeElement===first||document.activeElement===mPanel)){e.preventDefault();last.focus()}
else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}
}
});

var cardHeads=[];
/* sel: cards · headSel: focusable handle inside the card · build(card) → {title,nodes,bg,ink} */
var addPopup=function(sel,headSel,kind,build){
$$(sel).forEach(function(card){
var head=$(headSel,card);
if(!head)return;
cardHeads.push(head);
var open=function(){
var d=build(card);
openModal(kind,d.title,d.nodes,d.bg,d.ink,head);
};
card.addEventListener('click',function(e){
if(!cardMQ.matches||e.target.closest('a'))return;
e.preventDefault();
open();
});
head.addEventListener('keydown',function(e){
if(!cardMQ.matches)return;
if(e.key==='Enter'||e.key===' '){e.preventDefault();open()}
});
});
};
var txt=function(el){return el?el.textContent.trim():''};
var css=function(el,v){return getComputedStyle(el).getPropertyValue(v).trim()};

addPopup('.sleeve','.sleeve-art','sleeve',function(c){
var meta=document.createElement('p');
meta.className='mdm-meta';
meta.textContent=txt($('.cover small',c))+' · '+txt($('.cover em',c));
return{title:txt($('.cover h3',c)),nodes:[meta].concat($$('.sleeve-info > *',c)),
bg:css(c,'--cov')||'#F3E7CF',ink:css(c,'--ink2')||'#440201'};
});
addPopup('.pola','.pola-img','pola',function(c){
var tag=document.createElement('p');
tag.className='mdm-meta';
tag.textContent=txt($('.sticker',c));
return{title:txt($('h3',c)),nodes:[tag,$('p',c),$('.stack',c),$('.pola-date',c),$('.proj-links',c)],bg:'#fff',ink:'#12243b'};
});
var syncCards=function(){
var on=cardMQ.matches;
cardHeads.forEach(function(h){
if(on){h.setAttribute('role','button');h.setAttribute('tabindex','0')}
else{
h.removeAttribute('role');
if(!h.classList.contains('sleeve-art'))h.removeAttribute('tabindex');
}
});
if(!on)closeModal();
};
syncCards();
if(cardMQ.addEventListener)cardMQ.addEventListener('change',syncCards);

/* ── Mobile menu ── */
var burger=$('#burger'),menu=$('#mobMenu');
if(burger&&menu){
var setMenu=function(open){
menu.hidden=!open;
burger.setAttribute('aria-expanded',String(open));
burger.setAttribute('aria-label',open?'Close menu':'Open menu');
document.body.style.overflow=open?'hidden':'';
if(open){
var first=$('a',menu);
if(first)first.focus();
}
};
burger.addEventListener('click',function(){setMenu(menu.hidden)});
$$('a',menu).forEach(function(a){
a.addEventListener('click',function(){setMenu(false)});
});
document.addEventListener('keydown',function(e){
if(e.key==='Escape'&&!menu.hidden){
setMenu(false);
burger.focus();
}
});
var wide=matchMedia('(min-width:981px)');
var onWide=function(e){
if(e.matches&&!menu.hidden)setMenu(false);
};
if(wide.addEventListener)wide.addEventListener('change',onWide);
}

/* ── Now playing chip ── */
var chip=$('#eraChip'),chipName=$('#eraName');
if(chip&&chipName&&hasIO){
var eraObs=new IntersectionObserver(function(entries){
entries.forEach(function(en){
if(!en.isIntersecting)return;
var d=en.target.dataset;
if(!d.era)return;
chipName.textContent=d.era;
if(d.chipBg)chip.style.setProperty('--chip-bg',d.chipBg);
if(d.chipInk)chip.style.setProperty('--chip-ink',d.chipInk);
});
},{rootMargin:'-45% 0px -50% 0px'});
$$('[data-era]').forEach(function(s){eraObs.observe(s)});
}

/* ── Returning visitor greeting ── */
var greet=$('#heroGreet'),visitor=store.get('ww-visitor-name');
if(greet&&visitor){
greet.textContent='hey '+visitor+', this is';
greet.hidden=false;
}

/* ── Hero video ── */
var video=$('.hero-video');
if(video){
var play=function(){
var p=video.play();
if(p&&p.catch)p.catch(function(){});
};
if(reduce){
video.removeAttribute('autoplay');
video.pause();
}else if(hasIO){
new IntersectionObserver(function(en){
if(en[0].isIntersecting)play();
else video.pause();
},{threshold:0.05}).observe(video);
}
}

/* ── Count-up stats ── */
var counters=$$('[data-count]');
if(counters.length&&hasIO&&!reduce){
var countObs=new IntersectionObserver(function(entries){
entries.forEach(function(en){
if(!en.isIntersecting)return;
countObs.unobserve(en.target);
var el=en.target,end=+el.dataset.count,t0=performance.now();
(function tick(t){
var p=Math.min((t-t0)/1100,1);
el.textContent=Math.round(end*(1-Math.pow(1-p,3)));
if(p<1)requestAnimationFrame(tick);
})(t0);
});
},{threshold:0.6});
counters.forEach(function(el){
el.textContent='0';
countObs.observe(el);
});
}

/* ── TTPD letter ── */
var letter=$('#letter');
if(letter&&hasIO&&!reduce){
var lines=$$('.typed',letter).map(function(p){
var text=p.textContent.trim();
var sr=document.createElement('span');
sr.className='sr';
sr.textContent=text;
var vis=document.createElement('span');
vis.setAttribute('aria-hidden','true');
var done=document.createElement('span');
var rest=document.createElement('span');
rest.className='tw-rest';
rest.textContent=text;
vis.appendChild(done);
vis.appendChild(rest);
p.textContent='';
p.appendChild(sr);
p.appendChild(vis);
return{done:done,rest:rest,text:text};
});
var letterObs=new IntersectionObserver(function(en){
if(!en[0].isIntersecting)return;
letterObs.disconnect();
var i=0;
(function nextLine(){
if(i>=lines.length)return;
var line=lines[i],n=0;
line.done.classList.add('caret');
(function type(){
n++;
line.done.textContent=line.text.slice(0,n);
line.rest.textContent=line.text.slice(n);
if(n<line.text.length){
setTimeout(type,14);
return;
}
if(i<lines.length-1)line.done.classList.remove('caret');
i++;
setTimeout(nextLine,250);
})();
})();
},{threshold:0.35});
letterObs.observe(letter);
}

/* ── Glitter ── */
var cv=$('#glitter2');
if(cv&&cv.getContext){
var cx=cv.getContext('2d');
var W=0,H=0,dots=[],raf=0,running=false,resizeTimer=0;
var colors=['#E15921','#8DD3C6','#D3FAF7','#F5F5F0'];
var dpr=Math.min(window.devicePixelRatio||1,2);

var build=function(){
W=cv.offsetWidth;
H=cv.offsetHeight;
cv.width=W*dpr;
cv.height=H*dpr;
cx.setTransform(dpr,0,0,dpr,0,0);
dots=[];
for(var k=0,n=Math.round(W*H/14000);k<n;k++){
dots.push({
x:Math.random()*W,
y:Math.random()*H,
r:Math.random()*1.8+.4,
c:colors[Math.floor(Math.random()*colors.length)],
ph:Math.random()*6.28,
sp:Math.random()*.02+.005
});
}
};

var draw=function(){
cx.clearRect(0,0,W,H);
dots.forEach(function(d){
d.ph+=d.sp;
cx.globalAlpha=.2+.6*Math.abs(Math.sin(d.ph));
cx.fillStyle=d.c;
cx.beginPath();
cx.arc(d.x,d.y,d.r,0,6.28);
cx.fill();
});
};

var loop=function(){
draw();
if(running)raf=requestAnimationFrame(loop);
};

var start=function(){
if(!running&&!reduce){
running=true;
raf=requestAnimationFrame(loop);
}
};

var stop=function(){
running=false;
cancelAnimationFrame(raf);
};

build();
draw();

addEventListener('resize',function(){
clearTimeout(resizeTimer);
resizeTimer=setTimeout(function(){
if(cv.offsetWidth===W&&cv.offsetHeight===H)return;
build();
draw();
},200);
});

if(hasIO&&!reduce){
new IntersectionObserver(function(en){
if(en[0].isIntersecting)start();
else stop();
}).observe(cv);
}
}

/* ── Open to work bar ── */
var bar=$('#ccBar');
if(bar&&store.get('cc-hide')!=='1'){
var root=document.documentElement;
var setBarH=function(){
root.style.setProperty('--bar-h',bar.hidden?'0px':bar.offsetHeight+'px');
};
var showBar=function(){
if(bar.hidden){
bar.hidden=false;
setBarH();
}
};
var hideBar=function(){
bar.hidden=true;
setBarH();
store.set('cc-hide','1');
};
var no=$('#ccNo'),yes=$('#ccYes'),hero=$('#home');
if(no)no.addEventListener('click',hideBar);
if(yes)yes.addEventListener('click',hideBar);
addEventListener('resize',setBarH);

if(hero&&hasIO){
var barObs=new IntersectionObserver(function(en){
if(!en[0].isIntersecting){
showBar();
barObs.disconnect();
}
});
barObs.observe(hero);
}else{
setTimeout(showBar,8000);
}
}

/* ── Language bars ── */
var tracks=$('.tracks');
if(tracks&&hasIO&&!reduce){
tracks.classList.add('pre');
var trackObs=new IntersectionObserver(function(en){
if(!en[0].isIntersecting)return;
trackObs.disconnect();
requestAnimationFrame(function(){
requestAnimationFrame(function(){
tracks.classList.remove('pre');
});
});
},{threshold:0.35});
trackObs.observe(tracks);
}

})();
