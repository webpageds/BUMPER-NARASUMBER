const scenes=[...document.querySelectorAll('.scene')];
const progress=document.getElementById('progress');
const photo=document.getElementById('speaker-photo');
const placeholder=document.getElementById('photo-placeholder');
const audio=document.getElementById('bumper-audio');
const audioButton=document.getElementById('audio-toggle');
const soundLabel=document.getElementById('sound-label');
const soundUi=document.querySelector('.sound-ui');
const selector=document.getElementById('selector-screen');
const customScreen=document.getElementById('custom-screen');
const bumperScreen=document.getElementById('bumper-screen');
const speakerName=document.getElementById('speaker-name');
const speakerRole=document.getElementById('speaker-role');
const combinedLayout=document.getElementById('combined-layout');
const singleLayout=document.getElementById('single-layout');
const customForm=document.getElementById('custom-form');
const customPhotoInput=document.getElementById('custom-photo');
const uploadPreview=document.getElementById('upload-preview');

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
let cycleStart=0,activeIndex=-1,rafId=0,currentObjectUrl=null,customPhotoData=null;

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
  progress.style.width='0%';
  showScene(0);
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
  photo.alt=alt||'Foto narasumber';
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
function switchPanel(panel){
  [selector,customScreen,bumperScreen].forEach(el=>{
    el.classList.remove('active');
    el.setAttribute('aria-hidden','true');
  });
  panel.classList.add('active');
  panel.setAttribute('aria-hidden','false');
}
function openSpeaker(speaker){
  if(!speaker)return;
  combinedLayout.style.display='none';
  singleLayout.style.display='flex';
  speakerName.innerHTML=speaker.name;
  speakerRole.innerHTML=speaker.role;
  setPhoto(speaker.photo,speaker.alt);
  switchPanel(bumperScreen);
  startBumper();
  tryAutoplay();
}
function openCombined(){
  singleLayout.style.display='none';
  combinedLayout.style.display='grid';
  switchPanel(bumperScreen);
  startBumper();
  tryAutoplay();
}
function returnToMenu(){
  cancelAnimationFrame(rafId);
  audio.pause();
  audio.currentTime=0;
  setSoundState(false);
  switchPanel(selector);
}
function escapeHtml(value){
  return String(value).replace(/[&<>"']/g,char=>({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
  }[char]));
}
function makeCustomSpeaker(){
  const name=document.getElementById('custom-name').value.trim();
  const title=document.getElementById('custom-title').value.trim();
  const position=document.getElementById('custom-position').value.trim();
  const company=document.getElementById('custom-company').value.trim();
  if(!name||!position||!company||!customPhotoData)return null;
  const safeName=escapeHtml(name);
  const safeTitle=escapeHtml(title);
  const safePosition=escapeHtml(position);
  const safeCompany=escapeHtml(company);
  return {
    name:safeName,
    role:[safeTitle,safePosition+' — '+safeCompany].filter(Boolean).join('<br>'),
    photo:customPhotoData,
    alt:'Foto '+name
  };
}

document.querySelectorAll('[data-speaker]').forEach(button=>{
  button.addEventListener('click',()=>openSpeaker(speakers[Number(button.dataset.speaker)]));
});
document.getElementById('back-button').addEventListener('click',returnToMenu);
document.getElementById('play-combined').addEventListener('click',openCombined);
document.getElementById('open-custom').addEventListener('click',()=>switchPanel(customScreen));
document.getElementById('custom-back').addEventListener('click',()=>switchPanel(selector));
document.getElementById('cancel-custom').addEventListener('click',()=>switchPanel(selector));

customPhotoInput.addEventListener('change',()=>{
  const file=customPhotoInput.files&&customPhotoInput.files[0];
  customPhotoData=null;
  if(!file){uploadPreview.innerHTML='<span>＋</span><small>UPLOAD FOTO</small>';return;}
  if(!['image/jpeg','image/png','image/webp'].includes(file.type)){
    customPhotoInput.value='';
    alert('Gunakan foto dengan format JPG, PNG, atau WebP.');
    return;
  }
  if(file.size>8*1024*1024){
    customPhotoInput.value='';
    alert('Ukuran foto maksimal 8 MB.');
    return;
  }
  const reader=new FileReader();
  reader.onload=()=>{
    customPhotoData=reader.result;
    uploadPreview.innerHTML='<img src="'+reader.result+'" alt="Preview foto custom"><small>FOTO SIAP DIGUNAKAN</small>';
  };
  reader.onerror=()=>alert('Foto gagal dibaca. Silakan pilih ulang.');
  reader.readAsDataURL(file);
});
customForm.addEventListener('submit',event=>{
  event.preventDefault();
  const speaker=makeCustomSpeaker();
  if(!speaker){
    alert('Lengkapi nama, jabatan, instansi, dan upload foto terlebih dahulu.');
    return;
  }
  openSpeaker(speaker);
});

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

// Animated gold dust in the background.
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
    p.y-=p.speed;
    p.x+=p.drift+Math.sin(time*.00045+p.phase)*.12;
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
