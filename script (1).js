// ====== CONFIG: ubah data di sini ======
var CONFIG={
  wa:"6285895127798", // 085895127798 dalam format internasional
  diskon:[{min:5,persen:15},{min:3,persen:10}], // beli banyak lebih hemat
  request:{dasar:3000,cinematic:0,cepat:2000, // cinematic = biaya tambahan footage cinematic (0 = tanpa tambahan)
    jenis:["Cinematic","Footage biasa"],
    lensa:["16:9","9:16"]},
  klip:[
    {id:1,judul:"CC 201 89 12",kat:"CC 201",dur:"-",lensa:"16:9",harga:2000,warna:"#ff7a18,#af002d",img:"images/klip-1.jpg"},
    {id:2,judul:"CC 201 83 48",kat:"CC 201",dur:"-",lensa:"16:9",harga:2000,warna:"#c0392b,#2c3e50",img:"images/klip-2.jpg"},
    {id:3,judul:"CC 206 13 25",kat:"CC 206",dur:"-",lensa:"16:9",harga:2000,warna:"#2b5876,#4e4376",img:"images/klip-3.jpg"},
    {id:4,judul:"CC 206 SPECIAL",kat:"CC 206",dur:"-",lensa:"16:9",harga:2000,warna:"#6a3093,#a044ff",img:"images/klip-4.jpg"},
    {id:5,judul:"CC 203 SPECIAL",kat:"CC 203",dur:"-",lensa:"16:9",harga:2000,warna:"#11998e,#38ef7d",img:"images/klip-5.jpg"},
    {id:6,judul:"CC 203 02 03",kat:"CC 203",dur:"-",lensa:"16:9",harga:2000,warna:"#134e5e,#71b280",img:"images/klip-6.jpg"},
    {id:7,judul:"Paket Hunting",kat:"Paket",dur:"-",lensa:"16:9",harga:2000,warna:"#f7971e,#cc7a00"},
    {id:8,judul:"Kaur Ciremai",kat:"Lainnya",dur:"-",lensa:"16:9",harga:3000,warna:"#0f2027,#2c5364",img:"images/klip-8.jpg"},
    {id:9,judul:"Plasser",kat:"Lainnya",dur:"-",lensa:"16:9",harga:3000,warna:"#b79891,#94716b",img:"images/klip-9.jpg"},
    {id:10,judul:"Free Footage",kat:"Gratis",dur:"-",lensa:"16:9",harga:0,warna:"#56ab2f,#a8e063"},
    {id:11,judul:"Paket Perjalanan",kat:"Paket",dur:"-",lensa:"16:9",harga:3000,warna:"#e96443,#904e95",img:"images/klip-11.jpg"}
  ]};
var kat=["Semua"],pilih=[],aktif="Semua";
CONFIG.klip.forEach(function(k){if(kat.indexOf(k.kat)<0)kat.push(k.kat)});
function rp(n){return "Rp"+Math.round(n).toLocaleString("id-ID")}
var $=function(id){return document.getElementById(id)};
$("sKlip").textContent=CONFIG.klip.length;

function chips(){
  $("chips").innerHTML="";
  kat.forEach(function(c){
    var b=document.createElement("button");b.className="chip"+(c===aktif?" on":"");b.textContent=c;
    b.onclick=function(){aktif=c;chips();katalog()};$("chips").appendChild(b);
  });
}
function katalog(){
  var q=$("q").value.toLowerCase().trim(),u=$("urut").value;
  var list=CONFIG.klip.filter(function(k){
    return (aktif==="Semua"||k.kat===aktif)&&k.judul.toLowerCase().indexOf(q)>=0;
  });
  if(u==="murah")list.sort(function(a,b){return a.harga-b.harga});
  else if(u==="mahal")list.sort(function(a,b){return b.harga-a.harga});
  else list.sort(function(a,b){return b.id-a.id});
  $("grid").innerHTML=list.length?"":'<div class="none">Tidak ada klip yang cocok. Coba kata kunci lain atau gunakan Request Footage.</div>';
  list.forEach(function(k){
    var on=pilih.indexOf(k.id)>=0,d=document.createElement("div");d.className="clip";
    d.innerHTML='<div class="th" style="background:'+(k.img?'linear-gradient(180deg,rgba(0,0,0,0) 45%,rgba(0,0,0,.65)),url('+k.img+') center/cover':'linear-gradient(135deg,'+k.warna+')')+'"><small>'+k.dur+' · '+k.lensa+'</small>'+k.kat+'</div>'+
      '<div class="bd"><b>'+k.judul+'</b><div class="row"><span class="pr">'+(k.harga?rp(k.harga):"GRATIS")+'</span><button class="add'+(on?" on":"")+'">'+(on?"✓ Dipilih":"+ Keranjang")+'</button></div></div>';
    d.querySelector("button").onclick=function(){
      var i=pilih.indexOf(k.id);if(i>=0)pilih.splice(i,1);else pilih.push(k.id);
      katalog();keranjang();
    };
    $("grid").appendChild(d);
  });
}
function hitungKeranjang(){
  var items=CONFIG.klip.filter(function(k){return pilih.indexOf(k.id)>=0});
  var sub=items.reduce(function(s,k){return s+k.harga},0),p=0;
  for(var i=0;i<CONFIG.diskon.length;i++){if(items.filter(function(k){return k.harga>0}).length>=CONFIG.diskon[i].min){p=CONFIG.diskon[i].persen;break}}
  return {items:items,sub:sub,p:p,total:sub*(1-p/100)};
}
function keranjang(){
  var h=hitungKeranjang();
  $("bar").classList.toggle("show",h.items.length>0);
  $("bInfo").textContent=h.items.length+" klip"+(h.p?" · diskon "+h.p+"%":" · beli 3 klip dapat diskon");
  $("bTot").textContent=rp(h.total);
}
$("bSend").onclick=function(){
  var h=hitungKeranjang();if(!h.items.length)return;
  var t="Halo RelKlip, saya ingin memesan footage:\n"+h.items.map(function(k,i){return (i+1)+". "+k.judul+" ("+k.lensa+") - "+(k.harga?rp(k.harga):"GRATIS")}).join("\n")+
    "\nSubtotal: "+rp(h.sub)+(h.p?"\nDiskon "+h.p+"%: -"+rp(h.sub*h.p/100):"")+"\nTotal: "+rp(h.total);
  window.open("https://wa.me/"+CONFIG.wa+"?text="+encodeURIComponent(t),"_blank");
};
$("q").oninput=katalog;$("urut").onchange=katalog;

// request footage
CONFIG.request.jenis.forEach(function(j){$("shot").add(new Option(j,j))});
CONFIG.request.lensa.forEach(function(r){$("res").add(new Option(r,r))});
function estimasi(){
  var c=CONFIG.request,rows=[["Berburu footage khusus",c.dasar]],t=c.dasar;
  if($("shot").value==="Cinematic"&&c.cinematic>0){rows.push(["Footage cinematic",c.cinematic]);t+=c.cinematic}
  if($("cepat").checked){rows.push(["Pengerjaan cepat",c.cepat]);t+=c.cepat}
  $("rTotal").textContent=rp(t);
  $("rRinci").innerHTML=rows.map(function(r){return "<li><span>"+r[0]+"</span><span>"+rp(r[1])+"</span></li>"}).join("");
  return t;
}
$("shot").onchange=estimasi;$("cepat").onchange=estimasi;estimasi();
function cek(id,err,m){var v=$(id).value.trim();$(err).textContent=v?"":m;return v}
$("fReq").onsubmit=function(e){
  e.preventDefault();
  var n=cek("nama","eNama","Nama wajib diisi"),k=cek("kereta","eKereta","Sebutkan kereta incaranmu");
  if(!(n&&k))return;
  var c=$("cat").value.trim();
  var t="Halo RelKlip, saya ingin request footage khusus.\nNama: "+n+"\nKereta: "+k+"\nJenis footage: "+$("shot").value+"\nUkuran lensa: "+$("res").value+
    "\nPengerjaan cepat: "+($("cepat").checked?"ya":"tidak")+"\nEstimasi: "+rp(estimasi())+(c?"\nCatatan: "+c:"");
  window.open("https://wa.me/"+CONFIG.wa+"?text="+encodeURIComponent(t),"_blank");
};
chips();katalog();keranjang();
