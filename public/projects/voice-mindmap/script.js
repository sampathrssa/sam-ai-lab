const output = document.getElementById('output');

const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.continuous = false;
recognition.lang = 'en-US';
recognition.interimResults = false;

function startRecognition() {
  recognition.start();
}

recognition.onresult = async function(event) {
  const transcript = event.results[0][0].transcript;
  output.textContent = transcript;

  const response = await fetch('/api/process', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: transcript })
  });

  const { mindmap } = await response.json();
  
  mermaid.initialize({ startOnLoad: false });
  mermaid.render('generated', mindmap, (svgCode) => {
    document.getElementById('graph').innerHTML = svgCode;
  });
};
