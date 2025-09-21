const output = document.getElementById('output');
const cmd = document.getElementById('command');

const quotes = [
  "There is no spoon.",
  "Wake up, Neo...",
  "The Matrix has you.",
  "Follow the white rabbit.",
  "I can only show you the door."
];

cmd.addEventListener('keydown', e=>{
  if(e.key==='Enter'){
    const val = cmd.value.trim();
    output.innerHTML += "> " + val + "\n";
    if(val==="quote"){
      const q = quotes[Math.floor(Math.random()*quotes.length)];
      output.innerHTML += q + "\n";
    } else if(val==="about"){
      output.innerHTML += "Matrix Crypto Terminal by Farshad 👾\n";
    } else if(val==="crypto"){
      output.innerHTML += "Loading top 10 cryptos...\n";
      loadTop10();
    } else {
      output.innerHTML += "Unknown command\n";
    }
    cmd.value="";
    output.scrollTop = output.scrollHeight;
  }
});
