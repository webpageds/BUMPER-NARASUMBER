const scenes=[...document.querySelectorAll('.scene')];
const progress=document.getElementById('progress');
const photo=document.getElementById('speaker-photo');
const placeholder=document.getElementById('photo-placeholder');
const audio=document.getElementById('bumper-audio');
const audioButton=document.getElementById('audio-toggle');
const soundLabel=document.getElementById('sound-label');
const soundUi=document.querySelector('.sound-ui');

// Timing (ms): text title -> arrival -> welcome -> speaker reveal -> short hold -> repeat.
const durations=[3600,3400,3400,8500];
const cycleLength=durations.reduce((sum,value)=>sum+value,0);
let cycleStart=performance.now();
let activeIndex=-1;
let rafId=0;

function showScene(index){
  if(index===activeIndex)return;
  activeIndex=index;
  scenes.forEach((scene,i)=>{
    scene.classList.remove('active');
    // Restart each scene's entrance animations every time it becomes active.
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

photo.addEventListener('load',()=>{photo.style.display='block';placeholder.style.display='none';});
photo.addEventListener('error',()=>{photo.style.display='none';placeholder.style.display='flex';});

audioButton.addEventListener('click',async()=>{
  try{
    if(audio.paused){
      await audio.play();
      audioButton.setAttribute('aria-label','Matikan suara');
      soundLabel.textContent='SOUND ON';
      soundUi.classList.add('playing');
    }else{
      audio.pause();
      audioButton.setAttribute('aria-label','Aktifkan suara');
      soundLabel.textContent='SOUND OFF';
      soundUi.classList.remove('playing');
    }
  }catch(error){soundLabel.textContent='SOUND BELUM TERSEDIA';}
});

// Canvas particles: slow drifting gold dust and occasional shooting sparks.
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
    r:Math.random()*1.7+.35,
    speed:Math.random()*.35+.08,
    alpha:Math.random()*.55+.12,
    phase:Math.random()*Math.PI*2,
    drift:(Math.random()-.5)*.25
  }));
}
function drawParticles(time){
  ctx.clearRect(0,0,width,height);
  for(const p of particles){
    p.y-=p.speed;p.x+=p.drift+Math.sin(time*.00045+p.phase)*.12;
    if(p.y<-5){p.y=height+5;p.x=Math.random()*width}
    if(p.x<-5)p.x=width+5;if(p.x>width+5)p.x=-5;
    const shimmer=p.alpha*(.65+.35*Math.sin(time*.0015+p.phase));
    ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
    ctx.fillStyle='rgba(238,207,142,'+shimmer+')';ctx.fill();
  }
  requestAnimationFrame(drawParticles);
}
window.addEventListener('resize',resizeCanvas);
resizeCanvas();requestAnimationFrame(drawParticles);
startBumper();
document.addEventListener('visibilitychange',()=>{if(!document.hidden)startBumper();else cancelAnimationFrame(rafId);});
