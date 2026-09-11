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
const assert=(c,m)=>{if(!c)throw new Error('ASSERT FAILED: '+m)};
const A = (w,d)=>dayKeys(w,d).join('+');
assert(A(0,2)==='REST' && A(0,4)==='REST' && A(0,6)==='REST' && A(0,0)==='SUN', 'W0 前奏：全休、週日量基線');
assert(A(1,2)==='LOW' && A(1,4)==='UPP' && A(1,6)==='SAT' && A(1,0)==='SUN', 'W1 直接上肌力：二下肢／四上肢／六長課／日快走');
assert(A(1,1)==='REST' && A(1,3)==='REST' && A(1,5)==='REST', '一三五 REST（既有 HIIT 套餐、不計 KPI）');
assert(A(8,6)==='SAT' && A(9,6)==='SATGYM', 'W9 起週六換喬山');
assert(W.REST.ex.join()==='db' && G.db && G.db.v.length===2, 'HIIT 套餐日只掛死蟲式卡（替代仰臥起坐、含教學影片）');
assert(W.LOW.ex.slice(0,2).join()==='bd,er' && W.UPP.ex.slice(0,2).join()==='bd,er', '肌力日前兩項＝暖身');
assert(!isDeload(4)&&!isDeload(8)&&!isDeload(9)&&isDeload(13)&&isDeload(17), '前 8 週不減量、W13 起每 4 週');
assert(PHASE(0)==='W0 前奏'&&PHASE(1)==='徒手期'&&PHASE(8)==='徒手期'&&PHASE(9)==='喬山期', '階段切換');
for(let w of [0,1,9]){const sc=schedule(w);
  for(let d in sc) sc[d].forEach(k=>{
    assert(W[k], '未定義課表鍵 '+k);
    W[k].ex.forEach(i=>assert(EX[i],'未定義動作 '+i));
  });}
assert(iso(new Date('2026-07-02T00:30:00'))==='2026-07-02', 'iso 必須用本地時區（UTC 會差一天）：'+iso(new Date('2026-07-02T00:30:00')));
const mkWeek = ds => { const s=new Date(cfg.start+'T00:00:00'); return Math.floor((new Date(ds+'T00:00:00')-s)/6048e5)+1 };
assert(mkWeek('2026-09-14')===1 && mkWeek('2026-09-20')===1 && mkWeek('2026-09-21')===2, '週界線');
assert(mkWeek('2026-09-11')===0, '開跑前＝第 0 週');
const s7=[...Array(10)].map((_,i)=>({d:iso(new Date(+new Date('2026-07-06T00:00:00')+i*864e5)),w:70-i*0.1}));
const a=avg7(s7,9); assert(Math.abs(a-(70-(3+4+5+6+7+8+9)/7*0.1))<1e-9, 'avg7 取7日窗, got '+a);
logs['2026-07-06']={w:70,s:3,c:6.5,workout:'LOW',n:'ok, good'};
const c=csv(); assert(c.startsWith('date,weight_kg,workout,sleep_score,cpap_hours,waist_cm,note,resistance'), 'CSV 表頭含 cpap_hours');
assert(c.includes('2026-07-06,70,LOW,3,6.5,,ok； good'), 'CSV 行格式+cpap+逗號跳脫: '+c);
setSleep(2); assert(_sleep===2, 'setSleep 存值');
// 送出資料（用過去的週二 09-08＝W0 REST、無項目）：組合晨間+cpap、標記 sent、產 adv-uri
VD='2026-09-08';
logs[VD]={w:69.9,s:2,c:5.2,n:'膝OK'};
sendToday();
assert(logs[VD].sent===true, 'sendToday 標記 sent');
assert(location.href.includes('adv-uri') && location.href.includes(encodeURIComponent('健身日誌/健身紀錄log.md')), 'sendToday 產生 adv-uri: '+location.href);
const sent=decodeURIComponent(location.href);
assert(sent.includes('2026-09-08,69.9,REST,2,5.2,,膝OK'), 'sendToday 行含 cpap 欄: '+sent);
assert(morningDone()===true, 'morningDone 判定');
// 每週 4 件必做帳：最低配每 7 天只算 1 次；REST 日打勾不算
const mon=new Date('2026-09-21T00:00:00');
logs['2026-09-22']={done:{sq:true},workout:'LOW',min:true};
logs['2026-09-24']={done:{ip:true},workout:'UPP',min:true};
logs['2026-09-26']={done:{sq:true},workout:'SAT'};
logs['2026-09-27']={done:{walk:true},workout:'SUN'};
logs['2026-09-23']={done:{sq:true},workout:'REST'};
const wd=weekDone(mon); assert(wd.n===3&&wd.minUsed===2, '必做帳：2 最低配只算 1 → 3/4, got '+JSON.stringify(wd));
// 01 共用 helper：某日是否計入必做（不含最低配扣抵）、日期範圍取 logs、門檻常數
assert(mustDone(logs['2026-09-22'])===true && mustDone(logs['2026-09-26'])===true, 'mustDone：必做日有勾（含最低配）→ true');
assert(mustDone(logs['2026-09-23'])===false, 'mustDone：REST 日打勾不算');
assert(mustDone({workout:'LOW',done:{sq:false}})===false && mustDone(undefined)===false, 'mustDone：沒勾／無紀錄 → false');
const rng=logsBetween('2026-09-23','2026-09-26');
assert(rng.map(x=>x[0]).join()==='2026-09-23,2026-09-24,2026-09-26' && rng[1][1]===logs['2026-09-24'], 'logsBetween 含邊界、排序、回 [日期,log]: '+JSON.stringify(rng.map(x=>x[0])));
assert(logsBetween('2030-01-01','2030-01-02').length===0, 'logsBetween 無資料回空');
assert(KPI.MUST_TOTAL===24&&KPI.MUST_PASS===20&&KPI.FUSE_LT===3&&KPI.CPAP_MIN===4&&KPI.W_FROM===1&&KPI.W_TO===6, '門檻常數＝定稿：24／≥20／<3／CPAP 4h／W1–W6');
setMin(false); assert(!logs[VD].min, 'setMin 清除');
// 02 週曆條只亮必做日：本週（含 TD）塞 REST 日打勾＋LOW 日打勾，只有 LOW 那格含 did
{const m=new Date(today);m.setDate(m.getDate()-((dow+6)%7));const k=i=>iso(new Date(+m+i*864e5));
 const bak={};[k(1),k(2)].forEach(d=>bak[d]=logs[d]);
 logs[k(2)]={done:{db:true},workout:'REST'}; logs[k(1)]={done:{sq:true},workout:'LOW',min:true};
 renderStrip(); const cells=document.getElementById('wstrip').innerHTML.split('<div ').slice(1);
 assert(cells.length===7 && cells.filter(c=>c.includes(' did')).length===1 && cells[1].includes(' did') && cells[1].includes('✓ '), '週曆條只有 LOW（最低配）那格亮: '+cells.map(c=>c.includes(' did')?1:0).join(''));
 [k(1),k(2)].forEach(d=>{if(bak[d])logs[d]=bak[d];else delete logs[d]});}
// 03 W1–W6 必做累計磚：cfg.start=2026-09-14 為 W1 週一；W2 沿用上面 weekDone 案例（3 件）
{const put=(d,l)=>logs[d]=l;
 put('2026-09-15',{done:{sq:true},workout:'LOW'}); put('2026-09-17',{done:{ip:true},workout:'UPP',min:true}); put('2026-09-19',{done:{sq:true},workout:'SAT',min:true}); // W1：最低配兩次只算 1 → 2
 ['2026-09-29','2026-10-01','2026-10-03','2026-10-04'].forEach((d,i)=>put(d,{done:{sq:true},workout:['LOW','UPP','SAT','SUN'][i]})); // W3：4
 put('2026-10-06',{done:{db:true},workout:'REST'}); // W4：REST 灌水 → 0
 put('2026-10-13',{done:{sq:true},workout:'LOW'}); // W5：1
 put('2026-10-25',{done:{walk:true},workout:'SUN'}); // W6：1
 put('2026-10-27',{done:{sq:true},workout:'LOW'}); put('2026-09-13',{done:{walk:true},workout:'SUN'}); // W7／W0：不計
 renderTrend();
 assert(document.getElementById('tWk').textContent==='11/24', '累計磚 2+3+4+0+1+1=11/24, got '+document.getElementById('tWk').textContent);
 assert(document.getElementById('tWkD').textContent==='出席率 46%' && document.getElementById('tWkL').textContent==='W1–W6 必做（門檻 20）', '累計磚副標與出席率: '+document.getElementById('tWkL').textContent+' / '+document.getElementById('tWkD').textContent);
 const st=cfg.start; cfg.start='2030-01-07'; renderTrend(); // 今天在 W0：六週全在未來 → 0/24
 assert(document.getElementById('tWk').textContent==='0/24' && document.getElementById('tWkD').textContent==='出席率 0%', 'W0 時累計磚 0/24、0%');
 cfg.start=st;}
VD=TD;
// 導引卡：除有氧/休息外每動作都要有卡+至少1支影片
Object.keys(EX).filter(k=>!['walk','meas'].includes(k)).forEach(k=>{
  assert(G[k]&&G[k].s&&G[k].e&&G[k].r, '缺導引卡: '+k);
  assert(G[k].v.length>=1&&G[k].v.every(x=>x[1].startsWith('https://www.youtube.com/')), '導引卡影片異常: '+k);
});
gOpen.add('mc');
assert(guideHTML('mc').includes('youtube.com')&&guideHTML('mc').includes('步驟'), 'guideHTML 展開含影片與步驟');
assert(guideHTML('walk')==='', '有氧不出導引卡');
assert(cfg.path==='健身日誌/健身紀錄log.md', '日誌預設路徑=資料夾版: '+cfg.path);
Object.keys(EX).forEach(k=>assert(ICMAP[k], '動作缺 icon 對映: '+k));
Object.keys(W).forEach(k=>assert(BANMAP[k], '課表缺 banner 對映: '+k));
document.getElementById('inWk').value='13'; renderPlan();
renderToday(); renderTrend();
console.log('ALL SMOKE TESTS PASSED');
`;
eval(src + '\n' + tests);
