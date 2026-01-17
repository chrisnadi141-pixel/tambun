/* =========================
   DATA JADWAL SHOLAT
========================= */

let jadwal = null
let sudahAdzan = {
  Subuh:false,
  Zuhur:false,
  Asar:false,
  Maghrib:false,
  Isya:false
}

const lokasiId = 1203

fetch(`https://api.myquran.com/v2/sholat/jadwal/${lokasiId}/${new Date().toISOString().slice(0,10).replace(/-/g,'/')}`)
.then(r => r.json())
.then(j => {
  jadwal = j.data.jadwal

  jadwalTable.querySelector("tbody").innerHTML = `
  <tr>
    <td>${jadwal.imsak}</td>
    <td>${jadwal.subuh}</td>
    <td>${jadwal.dzuhur}</td>
    <td>${jadwal.ashar}</td>
    <td>${jadwal.maghrib}</td>
    <td>${jadwal.isya}</td>
  </tr>`
})

setInterval(() => {
  if(!jadwal) return

  const now = new Date()
  const today = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  )

  const list = [
    {n:"Subuh",t:jadwal.subuh},
    {n:"Zuhur",t:jadwal.dzuhur},
    {n:"Asar",t:jadwal.ashar},
    {n:"Maghrib",t:jadwal.maghrib},
    {n:"Isya",t:jadwal.isya}
  ]

  let next = null

  list.forEach(j => {
    const [h,m] = j.t.split(":")
    const d = new Date(today.getFullYear(),today.getMonth(),today.getDate(),h,m)
    if(d > now && !next) next = {...j,d}
  })

  if(!next){
    countdown.textContent = "Semua sholat hari ini telah selesai"
    return
  }

  const diff = next.d - now
  const h = Math.floor(diff / 3600000)
  const m = Math.floor((diff % 3600000) / 60000)
  const s = Math.floor((diff % 60000) / 1000)

  countdown.innerHTML =
  `<span style="color:white;font-weight:bold;">
     MENUJU ${next.n.toUpperCase()}
   </span>
   : <span style="color:red;">
     ${h}j ${m}m ${s}d
   </span>`;

  const nowHM =
  `${String(now.getHours()).padStart(2,0)}:${String(now.getMinutes()).padStart(2,0)}`

  if(nowHM === next.t && !sudahAdzan[next.n]){
    adzanAudio.play()
    sudahAdzan[next.n] = true
  }

}, 1000)



