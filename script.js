const scenes=[...document.querySelectorAll('.scene')];
const progress=document.getElementById('progress');
const photo=document.getElementById('speaker-photo');
const placeholder=document.getElementById('photo-placeholder');
const audio=document.getElementById('bumper-audio');
const audioButton=document.getElementById('audio-toggle');
const soundLabel=document.getElementById('sound-label');
const soundUi=document.querySelector('.sound-ui');
const selector=document.getElementById('selector-screen');
const bumperScreen=document.getElementById('bumper-screen');
const backButton=document.getElementById('back-button');
const speakerName=document.getElementById('speaker-name');
const speakerRole=document.getElementById('speaker-role');

const speakers=[
  {
    name:'Dr. Riyan Harbi<br>Valdiansyah',
    role:'S.E., M.Ak, Cert DA<br>CEO &amp; Founder — Fast Consulting',
    photo:'fotonarsum.png',
    alt:'Foto Dr. Riyan Harbi Valdiansyah'
  },
  {
    name:'Irfan Sulaiman<br>Suhaeri',
    role:'S.E., CA, CPA., CPSAK., CSA., ASEAN CPA., GARP SCR, IFRS FSA., ProDipSust., ACCA<br>Associate Director — KPMG Siddharta Advisory Indonesia',
    photo:'narsum2.png',
    alt:'Foto Irfan Sulaiman Suhaeri'
  }
];

const durations=[3600,3400,3400,8500];
const cycleLength=durations.reduce((sum,value)=>sum+value,0);
let cycleStart=0;
let activeIndex=-1;
let rafId=0;
let currentSpeaker=null;

function showScene(index){
  if(index===activeIndex)return;
  activeIndex=index;
  scenes.forEach((scene,i)=>{
    scene.classList.remove('active');
    void scene.offsetWidth;
    if(i===index)scene.classList.add('active');
  });
}
function animate(now){
  const elapsed=(now-cycleStart)%cycleLength;
  let total=0,sceneIndex=0;
  for(let i=0;i<durations.length;i++){
    total+=durations[i];
    if(elapsed<total){sceneIndex=i;break;}
  }
  showScene(sceneIndex);
  progress.style.width=(elapsed/cycleLength*100)+'%';
  rafId=requestAnimationFrame(animate);
}
function startBumper(){
  cancelAnimationFrame(rafId);
  cycleStart=performance.now();
  activeIndex=-1;
  rafId=requestAnimationFrame(animate);
}
function setSoundState(isPlaying){
  audioButton.setAttribute('aria-label',isPlaying?'Matikan suara':'Aktifkan suara');
  soundLabel.textContent=isPlaying?'SOUND ON':'SOUND OFF';
  soundUi.classList.toggle('playing',isPlaying);
}
function setPhoto(src,alt){
  photo.style.display='none';
  placeholder.style.display='flex';
  photo.alt=alt;
  photo.onload=()=>{photo.style.display='block';placeholder.style.display='none';};
  photo.onerror=()=>{photo.style.display='none';placeholder.style.display='flex';};
  photo.src=src;
}
async function tryAutoplay(){
  try{
    audio.volume=1;
    await audio.play();
    setSoundState(true);
  }catch(error){
    setSoundState(false);
    soundLabel.textContent='KLIK ♫ UNTUK SOUND';
  }
}
function openSpeaker(index){
  const speaker=speakers[index];
  if(!speaker)return;
  currentSpeaker=index;
  speakerName.innerHTML=speaker.name;
  speakerRole.innerHTML=speaker.role;
  setPhoto(speaker.photo,speaker.alt);
  selector.classList.remove('active');
  bumperScreen.classList.add('active');
  bumperScreen.setAttribute('aria-hidden','false');
  progress.style.width='0%';
  startBumper();
  tryAutoplay();
}
function returnToSelector(){
  cancelAnimationFrame(rafId);
  audio.pause();
  audio.currentTime=0;
  setSoundState(false);
  bumperScreen.classList.remove('active');
  bumperScreen.setAttribute('aria-hidden','true');
  selector.classList.add('active');
  currentSpeaker=null;
}
document.querySelectorAll('[data-speaker]').forEach(button=>{
  button.addEventListener('click',()=>openSpeaker(Number(button.dataset.speaker)));
});
backButton.addEventListener('click',returnToSelector);
audio.addEventListener('play',()=>setSoundState(true));
audio.addEventListener('pause',()=>setSoundState(false));
audio.addEventListener('error',()=>{
  soundLabel.textContent='AUDIO TIDAK DAPAT DIMUAT';
  soundUi.classList.remove('playing');
});
audioButton.addEventListener('click',async()=>{
  try{
    if(audio.paused){await audio.play();setSoundState(true);}
    else{audio.pause();setSoundState(false);}
  }catch(error){soundLabel.textContent='AUDIO GAGAL DIPUTAR';}
});

// Gold dust particles behind both the selector and bumper scenes.
const canvas=document.getElementById('particles');
const ctx=canvas.getContext('2d');
let width=0,height=0,dpr=1,particles=[];
function resizeCanvas(){
  dpr=Math.min(window.devicePixelRatio||1,2);
  width=window.innerWidth;height=window.innerHeight;
  canvas.width=width*dpr;canvas.height=height*dpr;
  ctx.setTransform(dpr,0,0,dpr,0,0);
  const count=Math.min(105,Math.round(width*height/12500));
  particles=Array.from({length:count},()=>({
    x:Math.random()*width,y:Math.random()*height,
    r:Math.random()*1.7+.35,speed:Math.random()*.35+.08,
    alpha:Math.random()*.55+.12,phase:Math.random()*Math.PI*2,
    drift:(Math.random()-.5)*.25
  }));
}
function drawParticles(time){
  ctx.clearRect(0,0,width,height);
  for(const p of particles){
    p.y-=p.speed;p.x+=p.drift+Math.sin(time*.00045+p.phase)*.12;
    if(p.y<-5){p.y=height+5;p.x=Math.random()*width;}
    if(p.x<-5)p.x=width+5;
    if(p.x>width+5)p.x=-5;
    const shimmer=p.alpha*(.65+.35*Math.sin(time*.0015+p.phase));
    ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
    ctx.fillStyle='rgba(238,207,142,'+shimmer+')';ctx.fill();
  }
  requestAnimationFrame(drawParticles);
}
window.addEventListener('resize',resizeCanvas);
resizeCanvas();
requestAnimationFrame(drawParticles);
audio.load();
