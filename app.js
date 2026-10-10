// بستان الحروف - منطق الأنشطة
const LETTERS = [
  {ch:'أ', name:'ألِف', ex:'أسد', emoji:'🦁'},
  {ch:'ب', name:'بـاء', ex:'باب', emoji:'🚪'},
  {ch:'ت', name:'تـاء', ex:'تفاح', emoji:'🍎'},
  {ch:'ث', name:'ثـاء', ex:'ثعلب', emoji:'🦊'},
  {ch:'ج', name:'جيم', ex:'جمل', emoji:'🐪'},
  {ch:'ح', name:'حـاء', ex:'حصان', emoji:'🐴'},
  {ch:'خ', name:'خـاء', ex:'خروف', emoji:'🐑'},
  {ch:'د', name:'دال', ex:'دب', emoji:'🐻'},
  {ch:'ذ', name:'ذال', ex:'ذرة', emoji:'🌽'},
  {ch:'ر', name:'راء', ex:'رجل', emoji:'🧔'},
  {ch:'ز', name:'زاي', ex:'زهرة', emoji:'🌸'},
  {ch:'س', name:'سين', ex:'سمكة', emoji:'🐟'},
  {ch:'ش', name:'شين', ex:'شمس', emoji:'☀️'},
  {ch:'ص', name:'صاد', ex:'صقر', emoji:'🦅'},
  {ch:'ض', name:'ضاد', ex:'ضفدع', emoji:'🐸'},
  {ch:'ط', name:'طاء', ex:'طائرة', emoji:'✈️'},
  {ch:'ظ', name:'ظاء', ex:'ظرف', emoji:'✉️'},
  {ch:'ع', name:'عين', ex:'عصفور', emoji:'🐦'},
  {ch:'غ', name:'غين', ex:'غيمة', emoji:'☁️'},
  {ch:'ف', name:'فاء', ex:'فيل', emoji:'🐘'},
  {ch:'ق', name:'قاف', ex:'قمر', emoji:'🌙'},
  {ch:'ك', name:'كاف', ex:'كتاب', emoji:'📖'},
  {ch:'ل', name:'لام', ex:'ليمون', emoji:'🍋'},
  {ch:'م', name:'ميم', ex:'موز', emoji:'🍌'},
  {ch:'ن', name:'نون', ex:'نجمة', emoji:'⭐'},
  {ch:'ه', name:'هـاء', ex:'هلال', emoji:'🌜'},
  {ch:'و', name:'واو', ex:'وردة', emoji:'🌹'},
  {ch:'ي', name:'يـاء', ex:'يد', emoji:'✋'},
];

const WORDS = [
  {w:'أَسَد', plain:'أسد', emoji:'🦁'},
  {w:'بَاب', plain:'باب', emoji:'🚪'},
  {w:'قَمَر', plain:'قمر', emoji:'🌙'},
  {w:'شَمْس', plain:'شمس', emoji:'☀️'},
  {w:'كِتَاب', plain:'كتاب', emoji:'📖'},
  {w:'مُوز', plain:'موز', emoji:'🍌'},
  {w:'فِيل', plain:'فيل', emoji:'🐘'},
  {w:'وَرْدَة', plain:'وردة', emoji:'🌹'},
  {w:'حِصَان', plain:'حصان', emoji:'🐴'},
  {w:'سَمَكَة', plain:'سمكة', emoji:'🐟'},
  {w:'لَيْمُون', plain:'ليمون', emoji:'🍋'},
  {w:'نَجْمَة', plain:'نجمة', emoji:'⭐'},
];

let stars = parseInt(localStorage.getItem('bustan-stars')||'0');
let currentLetter = LETTERS[1];
let traceAmount = 0;

const $ = s=>document.querySelector(s);
function speak(text){
  try{
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang='ar-SA'; u.rate=.85; u.pitch=1.1;
    speechSynthesis.speak(u);
  }catch(e){}
}
function toast(msg){
  const t=$('#toast'); t.textContent=msg; t.classList.add('show');
  setTimeout(()=>t.classList.remove('show'),2200);
}
function addStar(n=1){
  stars+=n; localStorage.setItem('bustan-stars',stars);
  $('#starsCount').textContent=stars;
  confetti();
  toast(`🎉 أحسنت! رصيدك الآن ${stars} نجمة`);
}
function confetti(){
  const c=$('#confetti'); const icons=['⭐','🎉','🌸','✨','🍎','🦁'];
  for(let i=0;i<24;i++){
    const el=document.createElement('i'); el.textContent=icons[Math.floor(Math.random()*icons.length)];
    el.style.right=Math.random()*100+'vw'; el.style.animationDuration=(1.5+Math.random()*1.5)+'s';
    c.appendChild(el); setTimeout(()=>el.remove(),3000);
  }
}

// nav
$('#starsCount').textContent=stars;
$('#burger').onclick=()=>$('#mobileMenu').classList.toggle('show');
document.querySelectorAll('#mobileMenu a').forEach(a=>a.onclick=()=>$('#mobileMenu').classList.remove('show'));
document.querySelectorAll('.age').forEach(b=>b.onclick=()=>{
  document.querySelectorAll('.age').forEach(x=>x.classList.remove('active')); b.classList.add('active');
  toast(`وضع عمر ${b.dataset.age} سنوات — أنشطة مناسبة وممتعة! 💛`);
});
$('#heroLetter').onclick=()=>speak('باء .. باب');

// ---- letters grid ----
const grid=$('#lettersGrid');
LETTERS.forEach(L=>{
  const b=document.createElement('button'); b.textContent=L.ch; b.title=L.name;
  if(L.ch===currentLetter.ch) b.classList.add('active');
  b.onclick=()=>{ setLetter(L); [...grid.children].forEach(x=>x.classList.remove('active')); b.classList.add('active'); };
  grid.appendChild(b);
});
function setLetter(L){
  currentLetter=L;
  $('#curLetter').textContent=L.ch;
  $('#curName').innerHTML=`${L.name} • مثل <b>${L.ex}</b> ${L.emoji}`;
  $('#heroLetter').textContent=L.ch;
  clearSand(); traceAmount=0; updateTrace();
  speak(`${L.name} .. مثل ${L.ex}`);
}
$('#speakBtn').onclick=()=>speak(`${currentLetter.name} .. ${currentLetter.ch} .. مثل ${currentLetter.ex}`);
$('#curLetter').style.cursor='pointer';
$('#curLetter').onclick=()=>speak(currentLetter.name);

// ---- sand canvas ----
const canvas=$('#sandCanvas'), ctx=canvas.getContext('2d');
function fitCanvas(){
  const r=canvas.getBoundingClientRect();
  canvas.width=r.width*2; canvas.height=360*2;
  ctx.scale(1,1); drawGuide();
}
function drawGuide(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  ctx.fillStyle='rgba(120,70,10,.16)';
  ctx.font=`800 ${canvas.height*0.62}px "Baloo Bhaijaan 2"`;
  ctx.textAlign='center'; ctx.textBaseline='middle';
  ctx.fillText(currentLetter.ch, canvas.width/2, canvas.height*0.56);
  ctx.strokeStyle='rgba(255,255,255,.7)'; ctx.lineWidth=3; ctx.setLineDash([14,12]);
  ctx.beginPath(); ctx.moveTo(0,canvas.height*0.5); ctx.lineTo(canvas.width,canvas.height*0.5); ctx.stroke();
  ctx.setLineDash([]);
  $('#sandHint').style.display='block';
}
function clearSand(){ drawGuide(); }
$('#clearBtn').onclick=()=>{clearSand(); traceAmount=0; updateTrace();};
let drawing=false,last=null;
function pos(e){
  const r=canvas.getBoundingClientRect();
  const t=e.touches?e.touches[0]:e;
  return {x:(t.clientX-r.left)*(canvas.width/r.width), y:(t.clientY-r.top)*(canvas.height/r.height)};
}
canvas.addEventListener('pointerdown',e=>{drawing=true;last=pos(e);$('#sandHint').style.display='none';canvas.setPointerCapture(e.pointerId);draw(last,last);});
canvas.addEventListener('pointermove',e=>{if(!drawing)return;const p=pos(e);draw(last,p);last=p;traceAmount+=1;updateTrace();});
window.addEventListener('pointerup',()=>drawing=false);
function draw(a,b){
  ctx.strokeStyle='#3D405B'; ctx.lineWidth=14; ctx.lineCap='round'; ctx.lineJoin='round';
  ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y); ctx.stroke();
  ctx.strokeStyle='#fff'; ctx.lineWidth=3;
  ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y); ctx.stroke();
}
function updateTrace(){
  const pct=Math.min(100, Math.round(traceAmount/28));
  $('#traceProgress').style.width=pct+'%';
  if(pct>=100) $('#sandHint').textContent='رائع! اضغط ⭐';
}
$('#doneBtn').onclick=()=>{ if(traceAmount<60){toast('تتبع أكثر قليلاً بإصبعك أولاً ✍️');speak('تتبع أكثر قليلا');return;} addStar(1); traceAmount=0; updateTrace(); clearSand(); };
window.addEventListener('resize',fitCanvas);
setTimeout(fitCanvas,300);

// ---- build word ----
let curWord=null, slots=[];
function newWord(){
  curWord=WORDS[Math.floor(Math.random()*WORDS.length)];
  $('#wordEmoji').textContent=curWord.emoji;
  $('#buildFeedback').textContent='رتّب الحروف لتكوّن الكلمة 🌟';
  $('#buildFeedback').style.background='#FFF3C4';
  const chars=[...curWord.plain];
  slots=Array(chars.length).fill('');
  renderSlots();
  const shuffled=[...chars].sort(()=>Math.random()-.5);
  const bank=$('#letterBank'); bank.innerHTML='';
  shuffled.forEach(ch=>{
    const b=document.createElement('button'); b.textContent=ch;
    b.onclick=()=>{
      const idx=slots.findIndex(s=>!s);
      if(idx===-1)return;
      slots[idx]=ch; b.disabled=true; renderSlots(); speak(ch); checkBuild();
    };
    bank.appendChild(b);
  });
  speak(curWord.plain);
}
function renderSlots(){
  const box=$('#wordSlots'); box.innerHTML='';
  slots.forEach((s,i)=>{
    const d=document.createElement('div'); d.className='slot'+(s?' filled':''); d.textContent=s||'·';
    d.onclick=()=>{
      if(!s)return;
      // return letter to bank
      slots[i]='';
      [...$('#letterBank').children].find(b=>b.textContent===s&&b.disabled)?.removeAttribute('disabled');
      // actually re-enable first disabled matching
      const btn=[...$('#letterBank').children].find(b=>b.textContent===s&&b.disabled);
      if(btn) btn.disabled=false;
      renderSlots();
    };
    box.appendChild(d);
  });
}
function checkBuild(){
  if(slots.some(s=>!s))return;
  if(slots.join('')===curWord.plain){
    $('#buildFeedback').textContent=`🎉 صحيح! ${curWord.w} ${curWord.emoji}`;
    $('#buildFeedback').style.background='#D9F0DF';
    speak(curWord.plain); addStar(2);
  }else{
    $('#buildFeedback').textContent='حاول مرة أخرى، أنت قريب! 💪';
    speak('حاول مرة أخرى');
  }
}
$('#nextWordBtn').onclick=newWord;
$('#hearWordBtn').onclick=()=>curWord&&speak(curWord.plain);
$('#resetBuildBtn').onclick=()=>newWord();
newWord();

// ---- flashcards ----
const fg=$('#flashGrid');
WORDS.slice(0,8).forEach(o=>{
  const d=document.createElement('div'); d.className='flash';
  d.innerHTML=`<div class="fe">${o.emoji}</div><div class="fw">${o.w}</div><div class="fh">اضغط لتسمع 🔊</div>`;
  d.onclick=()=>{speak(o.plain);d.classList.add('heard');setTimeout(()=>d.classList.remove('heard'),1200);};
  fg.appendChild(d);
});

// ---- memory game ----
const PAIRS=[
  {ch:'أ',emoji:'🦁'},{ch:'ب',emoji:'🚪'},{ch:'ق',emoji:'🌙'},{ch:'ش',emoji:'☀️'},{ch:'ف',emoji:'🐘'},{ch:'م',emoji:'🍌'},
];
let first=null,lock=false,triesN=0,doneN=0;
function startGame(){
  const mem=$('#memory'); mem.innerHTML=''; first=null;lock=false;triesN=0;doneN=0;
  $('#tries').textContent='0'; $('#pairs').textContent='0 / 6'; $('#gameMsg').textContent='ركّز وتذكّر أماكن البطاقات 🧠';
  let cards=[];
  PAIRS.forEach(p=>{cards.push({k:p.ch,t:'L',...p});cards.push({k:p.ch,t:'E',...p});});
  cards=cards.sort(()=>Math.random()-.5);
  cards.forEach(c=>{
    const d=document.createElement('div'); d.className='mem'; d.innerHTML='<span class="back">🌟</span>';
    d.dataset.k=c.k; d.dataset.t=c.t;
    d.onclick=()=>{
      if(lock||d.classList.contains('open')||d.classList.contains('done'))return;
      d.classList.add('open');
      d.innerHTML=c.t==='L'?c.ch:`<span>${c.emoji}<small>${c.ch}</small></span>`;
      if(c.t==='L')speak(LETTERS.find(l=>l.ch===c.ch)?.name||c.ch);
      if(!first){first=d;return;}
      triesN++; $('#tries').textContent=triesN;
      if(first.dataset.k===d.dataset.k){
        first.classList.add('done');d.classList.add('done');first=null;doneN++;
        $('#pairs').textContent=`${doneN} / 6`;
        $('#gameMsg').textContent='ممتاز! طابق صحيح 🎉';
        speak('أحسنت');
        if(doneN===6){$('#gameMsg').textContent='🏆 فزت بكل البطاقات! أسطورة الذاكرة!';addStar(3);}
      }else{
        lock=true;
        setTimeout(()=>{first.classList.remove('open');d.classList.remove('open');first.innerHTML='<span class="back">🌟</span>';d.innerHTML='<span class="back">🌟</span>';first=null;lock=false;},800);
      }
    };
    mem.appendChild(d);
  });
}
$('#restartGame').onclick=startGame;
startGame();
setLetter(LETTERS[1]);
