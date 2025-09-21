async function loadTop10(){
  const res = await fetch("https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&per_page=10&page=1");
  const data = await res.json();
  const chartsDiv = document.getElementById('charts');
  chartsDiv.innerHTML="";
  data.forEach(coin=>{
    const c = document.createElement('canvas');
    c.className="chart";
    chartsDiv.appendChild(c);
    new Chart(c,{
      type:'line',
      data:{
        labels:Array.from({length:coin.sparkline_in_7d.price.length},(_,i)=>i),
        datasets:[{
          data:coin.sparkline_in_7d.price,
          borderColor:'#0f0',
          backgroundColor:'rgba(0,255,0,0.1)',
          pointRadius:0,
          fill:true
        }]
      },
      options:{
        plugins:{legend:{display:false}},
        scales:{
          x:{display:false,grid:{color:'#033'}},
          y:{display:false,grid:{color:'#033'}}
        }
      }
    });
  });
}
