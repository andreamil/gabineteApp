const ipcRenderer = require('electron').ipcRenderer;

function sendForm(event) {
    event.preventDefault() // stop the form from submitting
    let firstname = document.getElementById("primeiroNome").value;
    ipcRenderer.send('form-submission', firstname)
}