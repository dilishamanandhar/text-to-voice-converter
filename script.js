let utterance = null;

// Initialize voice select dropdown
window.addEventListener('DOMContentLoaded', () => {
  populateVoices();
  
  // Some browsers load voices asynchronously
  speechSynthesis.onvoiceschanged = populateVoices;
  
  // Update rate and pitch values
  document.getElementById('rate').addEventListener('input', (e) => {
    document.getElementById('rate-value').textContent = e.target.value + 'x';
  });
  
  document.getElementById('pitch').addEventListener('input', (e) => {
    document.getElementById('pitch-value').textContent = e.target.value + 'x';
  });
});

function populateVoices() {
  const voices = speechSynthesis.getVoices();
  const voiceSelect = document.getElementById('voice-select');
  
  voiceSelect.innerHTML = '';
  
  voices.forEach((voice, index) => {
    const option = document.createElement('option');
    option.value = index;
    option.textContent = `${voice.name} (${voice.lang})`;
    voiceSelect.appendChild(option);
  });
}

function speakText() {
  const text = document.getElementById('text-input').value;
  const status = document.getElementById('status');
  
  if (text.trim() === '') {
    status.textContent = '❌ Please enter some text!';
    status.className = '';
    return;
  }
  
  // Cancel any ongoing speech
  speechSynthesis.cancel();
  
  utterance = new SpeechSynthesisUtterance(text);
  
  // Get selected voice
  const voices = speechSynthesis.getVoices();
  const voiceIndex = document.getElementById('voice-select').value;
  utterance.voice = voices[voiceIndex];
  
  // Get rate and pitch
  utterance.rate = parseFloat(document.getElementById('rate').value);
  utterance.pitch = parseFloat(document.getElementById('pitch').value);
  
  utterance.onstart = () => {
    status.textContent = '🎤 Speaking...';
    status.className = 'speaking';
  };
  
  utterance.onend = () => {
    status.textContent = '✅ Finished!';
    status.className = '';
  };
  
  utterance.onerror = (event) => {
    status.textContent = '❌ Error: ' + event.error;
    status.className = '';
  };
  
  speechSynthesis.speak(utterance);
}

function pauseSpeech() {
  if (speechSynthesis.speaking) {
    speechSynthesis.pause();
    document.getElementById('status').textContent = '⏸ Paused';
    document.getElementById('status').className = 'paused';
  }
}

function resumeSpeech() {
  if (speechSynthesis.paused) {
    speechSynthesis.resume();
    document.getElementById('status').textContent = '🎤 Resuming...';
    document.getElementById('status').className = 'speaking';
  }
}

function stopSpeech() {
  speechSynthesis.cancel();
  document.getElementById('status').textContent = '⏹ Stopped';
  document.getElementById('status').className = '';
}

function clearText() {
  document.getElementById('text-input').value = '';
  document.getElementById('status').textContent = '';
  document.getElementById('status').className = '';
}