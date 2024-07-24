let langOption = document.querySelectorAll('select'),
    fromText = document.querySelector('.fromText'),
    transText = document.querySelector('.toTranslate'),
    fromVoice = document.querySelector('.from-voice'),
    toVoice = document.querySelector('.to-voice'),
    btn = document.querySelector('.bx-transfer'),
    cpyBtn = document.querySelector('.bx-copy'),
    countValue = document.querySelector('.code_length'),
    startRecording = document.querySelector('.start-recording');

// Initialize SpeechRecognition
let SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition = new SpeechRecognition();

recognition.onstart = function() {
    console.log('Voice recognition started. Speak into the microphone.');
};

recognition.onresult = function(event) {
    let transcript = event.results[0][0].transcript;
    fromText.value = transcript;
};

startRecording.addEventListener('click', () => {
    recognition.start();
});

// Existing functionality for translation, speech synthesis, etc.

langOption.forEach((get, con) => {
    for(let countryCode in language) {
        let selected;
        if(con == 0 && countryCode == 'en-GB') {
            selected = 'selected';
        } else if(con == 1 && countryCode == 'bn-IN') {
            selected = 'selected';
        }
        let option = `<option value="${countryCode}" ${selected}>${language[countryCode]}</option>`;
        get.insertAdjacentHTML('beforeend', option);
    }
});

fromText.addEventListener('input', function() {
    let content = fromText.value.trim(); // Remove leading and trailing whitespace
    let fromContent = langOption[0].value;
    let transContent = langOption[1].value;

    if (content === "") {
        transText.value = ""; // Clear the translated text if input is empty
        return; // Do not proceed with the API call
    }

    let transLINK = `https://api.mymemory.translated.net/get?q=${content}&langpair=${fromContent}|${transContent}`;

    fetch(transLINK)
        .then(response => response.json())
        .then(data => {
            if (data.responseData) {
                transText.value = data.responseData.translatedText || ""; // Update translated text
            } else {
                transText.value = ""; // Clear the output if no response data
            }
        })
        .catch(error => {
            console.error('Error:', error);
            transText.value = ""; // Clear the output on error
        });
});



fromVoice.addEventListener('click', function() {
    let fromTalk = new SpeechSynthesisUtterance(fromText.value);
    fromTalk.lang = langOption[0].value;
    speechSynthesis.speak(fromTalk);
});

toVoice.addEventListener('click', function() {
    let toTalk = new SpeechSynthesisUtterance(transText.value);
    toTalk.lang = langOption[1].value;
    speechSynthesis.speak(toTalk);
});

cpyBtn.addEventListener('click', function() {
    navigator.clipboard.writeText(transText.value);
});

fromText.addEventListener('keyup', function() {
    countValue.innerHTML = `${fromText.value.length}/5,000`;
});

btn.addEventListener('click', function() {
    let tempText = fromText.value;
    fromText.value = transText.value;
    transText.value = tempText;

    let tempOpt = langOption[0].value;
    langOption[0].value = langOption[1].value;
    langOption[1].value = tempOpt;
});

