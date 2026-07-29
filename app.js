const $=s=>document.querySelector(s),$$=s=>document.querySelectorAll(s);let reservation=false,rental=false;
function go(id){const overlay=$('#modal');if(overlay)overlay.hidden=true;$$('.screen').forEach(x=>x.classList.remove('active'));$('#'+id).classList.add('active');location.hash=id;window.scrollTo(0,0)}
$$('[data-go]').forEach(b=>b.onclick=()=>go(b.dataset.go));
function toast(text){const t=$('#toast');t.textContent=text;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2800)}
function modal(title,content){$('#modalTitle').textContent=title;$('#modalContent').innerHTML=content;$('#modal').hidden=false}$('#closeModal').onclick=()=>$('#modal').hidden=true;
$('#theme').onclick=()=>{document.body.classList.toggle('dark');toast('Dark mode structure is ready for expansion')};
$('#topup').onclick=()=>switchUserView('wallet');
const umbrellaCatalog=[
  {id:'sky',icon:'☂',name:'RǪM Sky',type:'Standard',color:'สีฟ้า',fee:'ฟรี',note:'ฟรี 30 นาทีแรก',stock:8,umbrella:'UMB-BL-0142',locker:'07',tone:'sky'},
  {id:'sunset',icon:'☂',name:'RǪM Sunset',type:'Limited',color:'สีคอรัล',fee:'+฿10',note:'สีพิเศษประจำฤดู',stock:4,umbrella:'UMB-CR-0218',locker:'11',tone:'sunset'},
  {id:'midnight',icon:'☂',name:'RǪM Midnight',type:'Premium',color:'สีกรมท่า',fee:'+฿20',note:'โครงแข็งแรง กันลม',stock:6,umbrella:'UMB-NV-0307',locker:'15',tone:'midnight'}
];
function openUmbrellaCatalog(){
  const cards=umbrellaCatalog.map((item,index)=>'<button class="umbrella-option '+(index===0?'selected':'')+'" data-umbrella-choice="'+item.id+'" aria-pressed="'+(index===0?'true':'false')+'"><span class="umbrella-visual '+item.tone+'"><i>'+item.icon+'</i><em>'+item.type+'</em></span><span class="umbrella-info"><b>'+item.name+'</b><small>'+item.color+' · '+item.note+'</small><span><strong>'+item.fee+'</strong><i>เหลือ '+item.stock+' คัน</i></span></span><span class="choice-check">✓</span></button>').join('');
  modal('เลือกร่มที่เข้ากับวันนี้','<div class="umbrella-catalog"><div class="catalog-head"><span>'+selectedStation.name+'</span><b>พร้อมรับที่ตู้ '+selectedStation.locker+'</b><small>เลือกแบบที่ชอบ แล้วระบบจะกันร่มไว้ให้ 30 นาที</small></div><div class="umbrella-options">'+cards+'</div><div id="catalogSummary" class="catalog-summary"><span><small>ร่มที่เลือก</small><b>RǪM Sky · Standard</b></span><strong>ฟรี 30 นาทีแรก</strong></div><button id="confirmUmbrella" class="catalog-confirm" data-selected="sky">ยืนยันจอง RǪM Sky <span>→</span></button><p class="catalog-note">Demo only · ไม่มีการเรียกเก็บเงินจริง</p></div>');
  $$('[data-umbrella-choice]').forEach(card=>card.onclick=()=>{
    const item=umbrellaCatalog.find(x=>x.id===card.dataset.umbrellaChoice);
    $$('[data-umbrella-choice]').forEach(x=>{const selected=x===card;x.classList.toggle('selected',selected);x.setAttribute('aria-pressed',selected)});
    $('#catalogSummary').innerHTML='<span><small>ร่มที่เลือก</small><b>'+item.name+' · '+item.type+'</b></span><strong>'+item.note+'</strong>';
    $('#confirmUmbrella').dataset.selected=item.id;
    $('#confirmUmbrella').innerHTML='ยืนยันจอง '+item.name+' <span>→</span>';
  });
  $('#confirmUmbrella').onclick=()=>confirmUmbrellaReservation($('#confirmUmbrella').dataset.selected);
}
function confirmUmbrellaReservation(id){
  const item=umbrellaCatalog.find(x=>x.id===id)||umbrellaCatalog[0];
  reservation=true;
  $('#userState').innerHTML='<b>Reserved · '+item.name+'</b><p>'+item.umbrella+' · '+item.color+' · ตู้ '+selectedStation.locker+' ช่อง '+item.locker+' · เหลือเวลา 29:59</p><button id="showQr" class="scan">แสดง QR รับร่ม</button>';
  $('#showQr').onclick=()=>modal('QR สำหรับรับร่มเท่านั้น','<div class="qr">▦▦<br>▦▦</div><div class="success"><strong>Locker '+selectedStation.locker+' · ช่อง '+item.locker+'</strong>'+item.name+' · '+item.umbrella+'<br>Token จำลองหมดอายุใน 29:59</div>');
  modal('จองร่มสำเร็จ','<div class="booking-success"><span class="booking-check">✓</span><p>ระบบกันร่มให้คุณแล้ว</p><h3>'+item.name+'</h3><small>'+item.color+' · '+item.umbrella+'</small><div><span>จุดรับ<strong>'+selectedStation.name+' · ตู้ '+selectedStation.locker+'</strong></span><span>ช่องรับ<strong>'+item.locker+'</strong></span><span>ค่าบริการ<strong>'+item.fee+'</strong></span></div><button id="bookingQr" class="catalog-confirm">ดู QR รับร่ม <span>→</span></button></div>');
  $('#bookingQr').onclick=()=>$('#showQr').click();
  toast('จองสำเร็จ: '+item.name+' ถูกกันไว้ให้แล้ว');
}
$('#reserveBtn').onclick=openUmbrellaCatalog;
let adIndex=0,adTimer=null,kioskDispensed=false,kioskReturning=false;
function showAd(index){
  adIndex=(index+3)%3;
  $$('[data-ad-panel]').forEach(panel=>panel.classList.toggle('active',Number(panel.dataset.adPanel)===adIndex));
  $$('[data-ad-slide]').forEach(dot=>dot.classList.toggle('active',Number(dot.dataset.adSlide)===adIndex));
}
function startAds(){
  if(adTimer)clearInterval(adTimer);
  adTimer=setInterval(()=>showAd(adIndex+1),5000);
  $('#adPause').textContent='Ⅱ';$('#adPause').setAttribute('aria-label','หยุดโฆษณา');
}
$$('[data-ad-slide]').forEach(dot=>dot.onclick=()=>{showAd(Number(dot.dataset.adSlide));startAds()});
$('#adNext').onclick=()=>{showAd(adIndex+1);startAds()};
$('#adPause').onclick=()=>{
  if(adTimer){clearInterval(adTimer);adTimer=null;$('#adPause').textContent='▶';$('#adPause').setAttribute('aria-label','เล่นโฆษณา');toast('พักโฆษณาแล้ว')}
  else{startAds();toast('เล่นโฆษณาต่อแล้ว')}
};
startAds();
function log(text){
  const time=new Date().toLocaleTimeString('th-TH',{hour:'2-digit',minute:'2-digit',second:'2-digit'});
  $('#eventLog').innerHTML='<b>› '+text+'</b><br><small>'+time+' · device event</small>';
  toast(text);
}
function setKioskState(title,text,state=''){
  $('#kioskActionTitle').textContent=title;$('#kioskActionText').textContent=text;
  $('#kioskActionPanel').className='kiosk-action-panel '+state;
}
function verifyPickup(){
  kioskDispensed=false;$('#collectBtn').hidden=true;$('#dispenseBay').classList.remove('open');
  $('#slot07').classList.remove('dispensed');$('#slot07').classList.add('assigned');
  $('#slot07').querySelector('span').textContent='☂';$('#slot07').querySelector('i').textContent='ASSIGNED';
  $('#bayStatus').textContent='กำลังตรวจสอบ QR';
  setKioskState('กำลังสแกน QR','กรุณาถือ QR ให้อยู่ในกรอบสแกน','is-scanning');
  log('QR scanner activated');
  setTimeout(()=>{
    setKioskState('ยืนยัน Reservation แล้ว','UMB-BL-0142 · ช่อง 07 พร้อมเปิด','is-verified');
    $('#slot07').classList.add('unlocked');$('#collectBtn').hidden=false;$('#bayStatus').textContent='แตะเปิดช่อง 07 บนหน้าจอ';
    log('QR verified · Slot 07 unlocked');
  },750);
}
function dispenseUmbrella(){
  if(kioskDispensed){log('Slot 07 ถูกจ่ายร่มแล้ว · รอการรับคืน');return}
  kioskDispensed=true;rental=true;$('#collectBtn').hidden=true;
  $('#slot07').classList.remove('assigned','unlocked');$('#slot07').classList.add('dispensed');
  $('#slot07').querySelector('i').textContent='OPEN';$('#dispenseBay').classList.add('open');
  $('#bayStatus').textContent='กรุณาหยิบร่มออกจากช่อง';setKioskState('กำลังจ่ายร่ม','Door sensor: OPEN · Slot 07','is-complete');
  $('#kioskStock').textContent=Math.max(0,Number($('#kioskStock').textContent)-1);
  $('#userState').innerHTML='<b>☂ Active rental · UMB-BL-0142</b><p>ยืมจาก อโศก · ตู้ A-04 · ฟรีอีก 29:59 · ยอดสะสม ฿0</p>';
  log('จ่าย UMB-BL-0142 สำเร็จ · Slot 07');
  setTimeout(()=>{$('#bayStatus').textContent='รับร่มสำเร็จ · ขอบคุณที่ใช้ RǪM';$('#slot07').querySelector('i').textContent='EMPTY'},900);
}
function startKioskReturn(){
  if(kioskReturning)return;kioskReturning=true;$('#returnBay').classList.add('receiving');
  setKioskState('พร้อมรับคืนร่ม','ใส่ร่มลงช่องรับคืนจนสุด','is-scanning');log('Return bay opened · waiting for RFID');
  setTimeout(()=>{
    kioskReturning=false;rental=false;$('#returnBay').classList.remove('receiving');$('#dispenseBay').classList.remove('open');
    $('#kioskStock').textContent=Number($('#kioskStock').textContent)+1;
    setKioskState('คืนร่มสำเร็จ ✓','UMB-BL-0142 · หยุดคิดเงินแล้ว','is-complete');
    $('#bayStatus').textContent='ระบบพร้อมให้บริการ';$('#userState').innerHTML='<b>✓ Returned · Receipt RCP-0142</b><p>อโศก · คืนสำเร็จ · ฿0 ภายในช่วงฟรี</p>';
    log('Presence + RFID confirmed · Return complete');
  },950);
}
const actions={assign:'จัดสรร UMB-BL-0142 ให้ Reservation สำเร็จ',offline:'Offline return queued · sync complete · idempotency verified',duplicate:'Duplicate event ignored · no duplicate capture',wrong:'Exception created · unknown/multiple tag → manual review'};
$$('[data-action]').forEach(button=>button.onclick=()=>{
  const action=button.dataset.action;
  if(action==='scan'){verifyPickup();return}
  if(action==='release'){dispenseUmbrella();return}
  if(action==='return'){startKioskReturn();return}
  if(action==='confirm'){setKioskState('Sensor confirmed','Presence sensor + RFID matched','is-complete');log('Presence sensor confirmed');return}
  log(actions[action]||action);
});
$('#scanBtn').onclick=verifyPickup;
$('#collectBtn').onclick=dispenseUmbrella;
$('#returnBtn').onclick=startKioskReturn;
$('#returnBay').onclick=startKioskReturn;
$$('[data-slot]').forEach(slot=>slot.onclick=()=>{if(slot.dataset.slot==='07'){verifyPickup();return}log(slot.classList.contains('empty')?'ช่อง '+slot.dataset.slot+' ว่าง':'ช่อง '+slot.dataset.slot+' พร้อมใช้งาน')});
$('#reconcile').onclick=()=>{toast('Reconciliation complete: 248 IDs matched, 2 alerts created');$('#feed').insertAdjacentHTML('afterbegin','<div><i>14:36</i><b>RECON-001</b><span>RFID ↔ inventory reconciliation</span><em>✓ Matched</em></div>')};
$('#trackSearch').oninput=e=>{if(e.target.value.toUpperCase().includes('0142'))toast('พบ UMB-BL-0142 · Returned at Siam K-02')};
setInterval(()=>{$('#clock').textContent=new Date().toLocaleTimeString('th-TH',{hour:'2-digit',minute:'2-digit'})},1000);
const weatherScenes=[
  {name:'☀ แดดอ่อน',bg:'radial-gradient(circle at 78% 12%,rgba(255,224,119,.72),transparent 20%),linear-gradient(140deg,#fff8d8 0%,#e4f6ff 50%,#d9f0eb 100%)'},
  {name:'☁ เมฆมาก',bg:'radial-gradient(circle at 25% 15%,rgba(255,255,255,.82),transparent 22%),linear-gradient(145deg,#dce8ee 0%,#b8c9d5 50%,#dbe4df 100%)'},
  {name:'🌦 ฝนปรอย',bg:'repeating-linear-gradient(112deg,transparent 0 22px,rgba(255,255,255,.23) 23px 25px,transparent 26px 48px),linear-gradient(145deg,#8fb0c5 0%,#6f8da3 55%,#a7c1bd 100%)'},
  {name:'⛈ พายุเข้า',bg:'radial-gradient(circle at 78% 18%,rgba(255,255,255,.6),transparent 4%),linear-gradient(145deg,#555e77 0%,#26364d 58%,#65747d 100%)'},
  {name:'🌇 ฟ้าเปิด',bg:'radial-gradient(circle at 82% 18%,rgba(255,187,112,.68),transparent 19%),linear-gradient(145deg,#f8d6bf 0%,#b9dff0 53%,#e7f0d4 100%)'}
];
let weatherIndex=-1,weatherLayer=0;
function showWeather(next){weatherIndex=next;weatherLayer=1-weatherLayer;const scene=weatherScenes[next],layer=$(weatherLayer?'#weatherBgB':'#weatherBgA');layer.style.backgroundImage=scene.bg;$$('.weather-bg').forEach(x=>x.classList.remove('is-visible'));layer.classList.add('is-visible');$('#weatherScene').textContent=scene.name+' · demo weather'}
function rotateWeather(){let next=Math.floor(Math.random()*weatherScenes.length);if(weatherScenes.length>1&&next===weatherIndex)next=(next+1)%weatherScenes.length;showWeather(next)}
rotateWeather();setInterval(rotateWeather,60000);
$$('[data-toast]').forEach(b=>b.onclick=()=>toast(b.dataset.toast));
const userViewTitles={home:'RǪM',stations:'สถานี',wallet:'Wallet',profile:'โปรไฟล์'};
function switchUserView(action){
  $$('[data-user-view]').forEach(view=>view.classList.toggle('active',view.dataset.userView===action));
  $$('[data-bottom-action]').forEach(button=>button.classList.toggle('selected',button.dataset.bottomAction===action));
  const viewTitle=$('#mobileViewTitle');if(viewTitle)viewTitle.textContent=userViewTitles[action]||'RǪM';
  window.scrollTo({top:0,behavior:'smooth'});
}
$$('[data-bottom-action]').forEach(button=>button.onclick=()=>switchUserView(button.dataset.bottomAction));
$$('[data-open-user-view]').forEach(button=>button.onclick=()=>switchUserView(button.dataset.openUserView));
let selectedStation={id:'asok',name:'อโศก · Exit 4',locker:'A-04',stock:18};
const stationData={asok:{id:'asok',name:'อโศก · Exit 4',locker:'A-04',stock:18},siam:{id:'siam',name:'สยาม · ทางออก 2',locker:'S-02',stock:11},nana:{id:'nana',name:'นานา · Exit 1',locker:'N-01',stock:7}};
$$('[data-station-select], [data-station-pin]').forEach(button=>button.onclick=()=>{
  const id=button.dataset.stationSelect||button.dataset.stationPin;
  selectedStation=stationData[id];
  $$('[data-station-select]').forEach(card=>card.classList.toggle('selected',card.dataset.stationSelect===id));
  $$('[data-station-pin]').forEach(pin=>pin.classList.toggle('active',pin.dataset.stationPin===id));
  $('#reserveAtStation').innerHTML='เลือก'+selectedStation.name.split(' · ')[0]+'และดูร่ม <span>→</span>';
  toast('เลือกสถานี '+selectedStation.name+' แล้ว');
});
const reserveAtStation=$('#reserveAtStation');if(reserveAtStation)reserveAtStation.onclick=()=>{
  $('#homeStationName').textContent=selectedStation.name;
  $('#stationStock').textContent='ตู้ '+selectedStation.locker+' · พร้อมยืม '+selectedStation.stock+' คัน';
  openUmbrellaCatalog();
};
function applyTopup(amount){
  const current=Number($('#walletBalance').textContent.replace(',',''));
  const next=current+amount;
  $('#walletBalance').textContent=next.toFixed(2);
  $('#userWalletBalance').textContent='฿'+next.toFixed(2);
  modal('เติมเงินสำเร็จ','<div class="booking-success"><span class="booking-check">✓</span><p>Mock payment completed</p><h3>+฿'+amount.toLocaleString('th-TH')+'</h3><small>ยอดคงเหลือใหม่ ฿'+next.toFixed(2)+'</small></div>');
  toast('Wallet balance updated');
}
$$('[data-topup-amount]').forEach(button=>button.onclick=()=>applyTopup(Number(button.dataset.topupAmount)));
$$('[data-profile-setting]').forEach(button=>button.onclick=()=>{
  const setting=button.dataset.profileSetting,toggle=button.querySelector('.toggle');
  if(toggle){toggle.classList.toggle('on');toast(button.querySelector('b').textContent+(toggle.classList.contains('on')?' เปิดแล้ว':' ปิดแล้ว'));return}
  modal(setting==='language'?'ภาษา':'RǪM Care',setting==='language'?'<div class="success"><strong>ไทย · TH</strong>English · EN พร้อมสำหรับ Demo ถัดไป</div>':'<div class="success"><strong>พร้อมช่วยเหลือ 24 ชั่วโมง</strong>Call center และ Emergency return เป็นข้อมูลจำลอง</div>');
});
$$('[data-admin-action]').forEach(b=>b.onclick=()=>{const action=b.dataset.adminAction;$$('[data-admin-action]').forEach(x=>x.classList.toggle('nav-active',x===b));const target={overview:'.dash-head',revenue:'#revenuePanel',tracking:'.track',feed:'#feed',rebalancing:'#rebalancePanel'}[action];if(target){$(target).scrollIntoView({behavior:'smooth',block:'start'});toast(b.textContent.trim()+' selected')}if(action==='sensors'){modal('Sensor health','<div class="success"><strong>24 / 24 kiosks online</strong>RFID, presence sensor and network gateway are operating normally. Demo data only.</div>')}if(action==='settings'){modal('Demo settings','<div class="success"><strong>Demo settings</strong>Payment, inventory and sensor data are mock only. No real data is stored.</div>')}});
const revenuePeriods={
  today:{gross:8420,net:7986,transactions:184,pending:1240,chart:[820,1120,980,1450,1210,1740,1510],label:'฿8.4K'},
  '7d':{gross:53860,net:51120,transactions:1264,pending:3120,chart:[6240,7180,6890,8140,7560,9240,8610],label:'฿53.9K'},
  '30d':{gross:221480,net:210210,transactions:5290,pending:6900,chart:[28100,30420,29680,32200,31540,35680,33860],label:'฿221K'}
};
function formatBaht(value){return'฿'+value.toLocaleString('th-TH')}
function renderRevenue(period){
  const data=revenuePeriods[period]||revenuePeriods.today,max=Math.max(...data.chart);
  $('#grossRevenue').textContent=formatBaht(data.gross);$('#netRevenue').textContent=formatBaht(data.net);
  $('#transactionCount').textContent=data.transactions.toLocaleString('th-TH');$('#pendingRevenue').textContent=formatBaht(data.pending);$('#chartTotal').textContent=data.label;
  const bars=$$('#revenueChart span');bars.forEach((bar,index)=>{bar.style.height=Math.max(12,Math.round(data.chart[index]/max*88))+'%';bar.dataset.value=data.chart[index].toLocaleString('th-TH')});
  $('#revenueUpdated').textContent='อัปเดตล่าสุด '+new Date().toLocaleTimeString('th-TH',{hour:'2-digit',minute:'2-digit'})+' · Demo data';
}
$('#revenuePeriod').onchange=e=>{renderRevenue(e.target.value);toast('อัปเดตช่วงเวลารายได้แล้ว')};
$$('[data-revenue-filter]').forEach(button=>button.onclick=()=>{
  const filter=button.dataset.revenueFilter,count=[...$$('[data-payment-channel]')].reduce((total,row)=>{const show=filter==='all'||row.dataset.paymentChannel===filter;row.hidden=!show;return total+(show?1:0)},0);
  $$('[data-revenue-filter]').forEach(x=>x.classList.toggle('active',x===button));$('#visibleTransactionCount').textContent=count+' รายการ';
});
$$('[data-transaction-detail]').forEach(button=>button.onclick=()=>{
  const row=button.closest('.finance-row'),id=button.dataset.transactionDetail,parts=row.innerText.split('\n').filter(Boolean);
  modal('รายละเอียด '+id,'<div class="transaction-detail"><div class="success"><strong>'+id+'</strong>'+parts.slice(1,-1).join('<br>')+'</div><p class="muted">Payment gateway, bank reference และข้อมูลผู้ใช้เป็นข้อมูลจำลอง</p></div>');
});
$('#settleRevenue').onclick=()=>{
  const button=$('#settleRevenue');if(button.classList.contains('settlement-running'))return;
  button.classList.add('settlement-running');button.textContent='◌ กำลัง Settlement…';$('#settlementStatus').textContent='กำลังตรวจสอบ 12 transactions';
  setTimeout(()=>{
    button.classList.remove('settlement-running');button.textContent='✓ Settlement complete';$('#pendingRevenue').textContent='฿0';$('#settlementStatus').textContent='All transactions reconciled';$('#settlementStatus').className='up';
    const pending=$('.finance-row em.pending');if(pending){pending.textContent='✓ Settled';pending.className=''}
    $('#feed').insertAdjacentHTML('afterbegin','<div data-finance-event><i>NOW</i><b>SETTLE-842</b><span>12 transactions · ฿1,240 reconciled</span><em>✓ Complete</em></div>');
    toast('Settlement สำเร็จ · 12 transactions matched');
  },900);
};
$('#exportRevenue').onclick=()=>{
  const rows=[['Transaction','Station','Channel','Amount','Status'],...Array.from($$('[data-payment-channel]')).filter(row=>!row.hidden).map(row=>Array.from(row.children).slice(0,5).map(cell=>cell.innerText.replace(/\n/g,' ')))];
  const csv='\uFEFF'+rows.map(row=>row.map(value=>'"'+value.replace(/"/g,'""')+'"').join(',')).join('\r\n'),url=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8'})),link=document.createElement('a');
  link.href=url;link.download='rom-revenue-demo.csv';link.click();setTimeout(()=>URL.revokeObjectURL(url),500);toast('Export CSV สำเร็จ');
};
const scenarioCopy={rain:['WEATHER','ฝนจะตกใน 4 นาที','Demand engine เพิ่มความสำคัญอโศก'],rush:['DEMAND','Rush hour detected','ร่มพร้อมใช้ลดลง 18 → 9 คัน'],return:['RETURN','UMB-BL-0142 returned','Sensor ยืนยัน · inventory synced'],reset:['RESET','กลับสู่ข้อมูลเริ่มต้น','ทุกโมดูลพร้อมเล่นใหม่']};
let autoDemoTimer=null,autoDemoStep=0;
function setScenarioStatus(text,state='is-running'){const el=$('#scenarioStatus');el.textContent=text;el.className='scenario-status '+state}
function renderScenarioTimeline(type){const copy=scenarioCopy[type];$('#scenarioTimeline').innerHTML='<span><b>'+copy[0]+'</b>'+copy[1]+'</span><span><b>SYNC</b>'+copy[2]+'</span><span><b>RESULT</b>User · Kiosk · Operations อัปเดตแล้ว</span>';$('#scenarioProgress').style.width=type==='reset'?'0%':type==='rain'?'34%':type==='rush'?'67%':'100%'}
function flashScenario(){['#user','#kiosk','#admin'].forEach(id=>{const el=$(id);el.classList.remove('scenario-flash');void el.offsetWidth;el.classList.add('scenario-flash')})}
function runScenario(type){if(!scenarioCopy[type])return;renderScenarioTimeline(type);flashScenario();if(type==='rain'){showWeather(2);$('#userWeatherEta').textContent='ฝนใน 4 นาที';setScenarioStatus('● Weather alert');toast('Rain alert propagated to all modules')}if(type==='rush'){showWeather(1);$('#stationStock').textContent='ตู้ A-04 · พร้อมยืม 9 คัน';$('#kioskStock').textContent='9';$('#readyCount').textContent='239';$('#activeCount').textContent='71';setScenarioStatus('● Rush hour');toast('Demand and inventory updated')}if(type==='return'){showWeather(4);$('#stationStock').textContent='ตู้ A-04 · พร้อมยืม 10 คัน';$('#kioskStock').textContent='10';$('#readyCount').textContent='240';$('#activeCount').textContent='70';$('#returnedCount').textContent='185';$('#actionCount').textContent='2';$('#eventLog').innerHTML='› UMB-BL-0142 คืนสำเร็จ<br><small>RFID + presence sensor confirmed</small>';$('#userState').innerHTML='<b>คืนร่มสำเร็จ · UMB-BL-0142</b><p>ค่าบริการ ฿20 · Wallet balance ฿100</p>';$('#feed').insertAdjacentHTML('afterbegin','<div data-sim-event><i>NOW</i><b>UMB-BL-0142</b><span>อโศก · K-01 · auto synced</span><em>✓ Complete</em></div>');setScenarioStatus('● Scenario complete','is-done');toast('Return completed across the system')}if(type==='reset'){showWeather(0);$('#userWeatherEta').textContent='ฝนใน 12 นาที';$('#stationStock').textContent='ตู้ A-04 · พร้อมยืม 18 คัน';$('#kioskStock').textContent='18';$('#readyCount').textContent='248';$('#activeCount').textContent='62';$('#returnedCount').textContent='184';$('#actionCount').textContent='3';$('#eventLog').textContent='รอเริ่ม Demo flow…';$('#userState').innerHTML='<b>เริ่มเดโมได้ทันที</b><p>Payment และ Bank integration เป็นข้อมูลจำลอง</p>';$$('[data-sim-event]').forEach(x=>x.remove());setScenarioStatus('● พร้อมเริ่ม','');toast('Demo reset complete')}}
$$('[data-scenario]').forEach(b=>b.onclick=()=>runScenario(b.dataset.scenario));
$('#autoDemo').onclick=()=>{if(autoDemoTimer){clearInterval(autoDemoTimer);autoDemoTimer=null;$('#autoDemo').textContent='▶ Auto demo';setScenarioStatus('● Auto paused','');return}const steps=['rain','rush','return'];runScenario(steps[autoDemoStep++%steps.length]);autoDemoTimer=setInterval(()=>runScenario(steps[autoDemoStep++%steps.length]),5000);$('#autoDemo').textContent='Ⅱ Pause auto';setScenarioStatus('● Auto running')};
window.addEventListener('hashchange',()=>{const id=location.hash.slice(1)||'home';if($('#'+id))go(id)});
if(location.hash)go(location.hash.slice(1));
