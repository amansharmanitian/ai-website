const chat = document.getElementById("chat");
const input = document.getElementById("input");

let memory = JSON.parse(localStorage.getItem("chat")) || [];

/* render */
function render(){
  chat.innerHTML = "";
  memory.forEach(m=>{
    const div = document.createElement("div");
    div.className = "msg " + m.role;
    div.innerText = m.text;
    chat.appendChild(div);
  });
}
render();

/* 🔥 REAL AI FUNCTION (plug Gemini here later) */
async function aiResponse(text){

  // fake intelligent response (replace with API later)
  return "🤖 AI: " + text.split("").reverse().join("");
}

/* send */
async function send(){
  const text = input.value;
  if(!text) return;

  memory.push({role:"user", text});
  render();

  input.value = "";

  const reply = await aiResponse(text);

  // typing effect
  let i = 0;
  let msg = "";
  const div = document.createElement("div");
  div.className = "msg ai";
  chat.appendChild(div);

  const interval = setInterval(()=>{
    msg += reply[i];
    div.innerText = msg;
    i++;

    if(i >= reply.length){
      clearInterval(interval);
      memory.push({role:"ai", text:reply});
      localStorage.setItem("chat", JSON.stringify(memory));
    }
  }, 20);
}

/* NEW CHAT */
function newChat(){
  memory = [];
  localStorage.removeItem("chat");
  render();
}

/* DOWNLOAD TXT */
function downloadTXT(){
  let text = memory.map(m => `${m.role}: ${m.text}`).join("\n\n");
  const blob = new Blob([text], {type:"text/plain"});
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "neura_chat.txt";
  a.click();
}

/* DOWNLOAD JSON */
function downloadJSON(){
  const blob = new Blob([JSON.stringify(memory,null,2)], {type:"application/json"});
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "neura_chat.json";
  a.click();
}

/* 🎤 VOICE INPUT */
function startVoice(){
  const speech = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  speech.lang = "en-US";
  speech.start();
  speech.onresult = e => input.value = e.results[0][0].transcript;
}
