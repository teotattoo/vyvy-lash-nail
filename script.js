const menuBtn=document.querySelector('.menu-btn');
const menu=document.querySelector('.menu');
menuBtn?.addEventListener('click',()=>{const open=menu.classList.toggle('open');menuBtn.setAttribute('aria-expanded',open)});
menu?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>menu.classList.remove('open')));
let lang='nl';
const langBtn=document.getElementById('langBtn');
const t=(obj,key)=>obj?.[`${key}_${lang}`] ?? obj?.[key] ?? '';
function applyStaticLanguage(){
  document.documentElement.lang=lang;
  document.querySelectorAll('[data-nl]').forEach(el=>el.textContent=el.dataset[lang]);
  if(langBtn) langBtn.textContent=lang==='nl'?'EN':'NL';
}
let siteData=null;
function bookingUrl(){
  const b=siteData.business;
  return `https://wa.me/${b.phone_link.replace(/\D/g,'')}?text=${encodeURIComponent(b.booking_message)}`;
}
function renderSite(){
  if(!siteData) return;
  const b=siteData.business;
  document.title=`${b.name} | Leeuwarden`;
  document.querySelectorAll('[data-business-name]').forEach(el=>el.textContent=b.name);
  document.querySelectorAll('[data-address]').forEach(el=>el.textContent=b.address);
  document.querySelectorAll('[data-phone-display]').forEach(el=>el.textContent=b.phone_display);
  document.querySelectorAll('a[data-phone-link]').forEach(el=>el.href=`tel:${b.phone_link}`);
  document.querySelectorAll('a[data-map-link]').forEach(el=>el.href=`https://maps.google.com/?q=${encodeURIComponent(b.address)}`);
  document.querySelectorAll('[data-instagram]').forEach(el=>el.textContent=`@${b.instagram}`);
  document.querySelectorAll('a[data-instagram-link]').forEach(el=>el.href=`https://instagram.com/${b.instagram}`);
  document.querySelectorAll('a[data-booking-link]').forEach(el=>el.href=bookingUrl());
  document.querySelectorAll('a[data-whatsapp-link]').forEach(el=>el.href=`https://wa.me/${b.phone_link.replace(/\D/g,'')}`);
  const intro=siteData.intro;
  document.getElementById('introEyebrow').textContent=t(intro,'eyebrow');
  document.getElementById('introTitle').textContent=t(intro,'title');
  document.getElementById('introText').textContent=t(intro,'text');
  document.getElementById('serviceGrid').innerHTML=siteData.services.map((s,i)=>`<article class="service-card" id="${i===0?'lashes':i===2?'nails':''}"><img src="${s.image}" alt="${t(s,'title')}"><div><h3>${t(s,'title')}</h3><p>${t(s,'text').replace(/\n/g,'<br>')}</p></div></article>`).join('');
  const makePrices=(items)=>items.map(item=>`<li><span>${item.name}</span><strong>${item.price}</strong></li>`).join('');
  document.getElementById('lashesPrices').innerHTML=makePrices(siteData.prices.lashes);
  document.getElementById('nailsPrices').innerHTML=makePrices(siteData.prices.nails);
  document.getElementById('priceNote').textContent=t(siteData.prices,'note');
  document.getElementById('galleryGrid').innerHTML=siteData.gallery.map(g=>`<img src="${g.image}" alt="${g.alt}">`).join('');
  document.getElementById('aboutTitle').textContent=t(siteData.about,'title');
  document.getElementById('aboutText').textContent=t(siteData.about,'text');
  document.querySelector('.about-image').style.backgroundImage=`url('${siteData.about.image}')`;
}
langBtn?.addEventListener('click',()=>{lang=lang==='nl'?'en':'nl';applyStaticLanguage();renderSite()});
fetch('/content/site.json',{cache:'no-store'}).then(r=>{if(!r.ok) throw new Error('Inhoud kon niet worden geladen');return r.json()}).then(data=>{siteData=data;renderSite()}).catch(console.error);
applyStaticLanguage();
document.getElementById('year').textContent=new Date().getFullYear();
if(window.netlifyIdentity){window.netlifyIdentity.on('init',user=>{if(!user)window.netlifyIdentity.on('login',()=>document.location.href='/admin/')})}
