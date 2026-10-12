import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const source = fs.readFileSync(new URL('../demos.js',import.meta.url),'utf8');
function harness({reduced=false,phone=false,paused=false}={}) {
  const events={}, media={}, animations=[];
  const root={classList:{contains:()=>!paused}};
  const document={documentElement:root,hidden:false,querySelector:()=>null,addEventListener:(name,fn)=>events[name]=fn};
  const window={addEventListener:(name,fn)=>events[name]=fn};
  const context={window,document,innerWidth:1440,innerHeight:1000,matchMedia:q=>({matches:q.includes('reduce')?reduced:phone,addEventListener:(name,fn)=>media[q]=fn}),getComputedStyle:()=>({fontSize:'30px',getPropertyValue:()=> 'ease-out'}),MutationObserver:class {constructor(fn){events.mutation=fn}observe(){}}};
  vm.runInNewContext(source,context);
  const element=()=>({style:{},contains:()=>false,getBoundingClientRect:()=>({left:100,top:100,width:120,height:44}),getAnimations(){return animations.filter(a=>a.effect.target===this&&!a.done)},animate(frames,options){const a={effect:{target:this},frames,options,finished:new Promise(()=>{}),finish(){this.done=true},cancel(){this.done=true}};animations.push(a);return a;}});
  return {motion:window.cadenceDemoMotion,element,events,animations,setPaused:()=>{paused=true;events.mutation()},document};
}
test('pause, hidden page and resize settle active motion',()=>{
  for(const action of ['pause','visibilitychange','resize']) {
    const h=harness(), el=h.element(); h.motion.press(el);
    assert.equal(h.animations.length,1);
    if(action==='pause')h.setPaused();else{h.document.hidden=true;h.events[action]()}
    assert.ok(h.animations.every(a=>a.done));
  }
});
test('reduced and paused modes do not start spatial effects',()=>{
  for(const config of [{reduced:true},{paused:true}]){
    const h=harness(config),el=h.element(); h.motion.press(el);h.motion.enter(el);h.motion.select(el,{left:0,top:0,width:100,height:44});
    assert.equal(h.animations.length,0);
  }
});
test('input can settle only its own surface and mobile timing is shorter',()=>{
  const h=harness({phone:true}), a=h.element(),b=h.element();h.motion.press(a);h.motion.press(b);h.motion.finish(a);
  assert.equal(h.animations[0].done,true);assert.equal(h.animations[1].done,undefined);assert.equal(h.animations[0].options.duration,192);
});
test('selection retargeting cancels the previous effect and uses supplied current bounds',()=>{
  const h=harness(),el=h.element();h.motion.select(el,{left:0,top:100,width:60,height:44});h.motion.select(el,{left:70,top:100,width:90,height:44});
  assert.equal(h.animations[0].done,true);assert.match(h.animations[1].frames[0].transform,/translate\(-30px,0px\) scale\(0.75,1\)/);
});
