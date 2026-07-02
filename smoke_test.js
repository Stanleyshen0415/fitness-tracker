// ponytail: 無瀏覽器煙霧測試——DOM 最小樁，把頁面 JS 與斷言併同一 eval 作用域
const fs = require('fs');
const els = {};
function fakeEl(id){
  if(!els[id]) els[id] = {
    style:{}, textContent:'', innerHTML:'', value:'', className:'',
    checked:false, clientWidth:340,
    setAttribute(){}, addEventListener(){}, appendChild(){},
    insertAdjacentHTML(){}, getBoundingClientRect(){return{left:0,width:340}},
    classList:{add(){},remove(){}},
  };
  return els[id];
}
global.document = {
  getElementById: fakeEl,
  querySelector: s=>fakeEl('q:'+s),
  querySelectorAll: ()=>[],
  createElement: ()=>fakeEl('ce'+Math.random()),
};
global.localStorage = { _d:{}, getItem(k){return this._d[k]||null}, setItem(k,v){this._d[k]=v} };
global.navigator = { clipboard:{ writeText:()=>Promise.resolve() } };
global.location = { href:'', reload(){} };
global.alert = ()=>{};

const src = fs.readFileSync('index.html','utf-8').match(/<script>([\s\S]*)<\/script>/)[1];
const tests = `
const A = (w,d)=>dayKeys(w,d).join('+');
console.assert(A(1,1)==='A' && A(1,3)==='B' && A(1,5)==='A', 'W1 一A三B五A');
console.assert(A(2,5)==='B', 'W2 五=B（交替）');
console.assert(A(1,2)==='M' && A(1,6)==='WALK' && A(1,0)==='REST', 'W1 二保養/六走/日休');
console.assert(A(13,1)==='L1' && A(13,3)==='REST' && A(24,5)==='U2', '肌力期上下分化');
console.assert(A(25,1)==='L1+AB1' && A(25,2)==='U1+AR1' && A(30,6)==='LISS', '分化期腹肌/弱點/LISS');
console.assert(isDeload(4)&&isDeload(8)&&!isDeload(5), 'Deload 每4週');
console.assert(PHASE(12)==='基礎鞏固期'&&PHASE(13)==='肌力累積期'&&PHASE(25)==='分化專項期', '階段切換');
for(let w of [1,13,25]){const sc=schedule(w);
  for(let d in sc) sc[d].forEach(k=>{
    console.assert(W[k], '未定義課表鍵 '+k);
    W[k].ex.forEach(i=>console.assert(EX[i],'未定義動作 '+i));
  });}
const mkWeek = ds => { const s=new Date(cfg.start+'T00:00:00'); return Math.floor((new Date(ds+'T00:00:00')-s)/6048e5)+1 };
console.assert(mkWeek('2026-07-06')===1 && mkWeek('2026-07-12')===1 && mkWeek('2026-07-13')===2, '週界線');
console.assert(mkWeek('2026-07-05')===0, '開跑前=第0週');
const s7=[...Array(10)].map((_,i)=>({d:iso(new Date(+new Date('2026-07-06T00:00:00')+i*864e5)),w:70-i*0.1}));
const a=avg7(s7,9); console.assert(Math.abs(a-(70-(3+4+5+6+7+8+9)/7*0.1))<1e-9, 'avg7 取7日窗, got '+a);
logs['2026-07-06']={w:70,s:3,workout:'A',n:'ok, good'};
const c=csv(); console.assert(c.includes('2026-07-06,70,A,3,,ok； good'), 'CSV 行格式+逗號跳脫: '+c);
setSleep(2); console.assert(_sleep===2, 'setSleep 存值');
document.getElementById('inWk').value='13'; renderPlan();
renderToday(); renderTrend();
console.log('ALL SMOKE TESTS PASSED');
`;
eval(src + '\n' + tests);
