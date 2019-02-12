const ipcRenderer = require('electron').ipcRenderer;

(() => {
  window.addEventListener('load', function() {
    
      var form = document.getElementById('cadastro');
      form.addEventListener('submit', function(event) {
          event.preventDefault();
          event.stopPropagation();
          console.log(JSON.stringify($('#cadastro').serialize()));
        if (form.checkValidity() === true) {
          ipcRenderer.send('form-submission', JSON.stringify($('#cadastro').serializeArray()));
        } 
        form.classList.add('was-validated');
      });
      var cancelar = document.getElementById('btn-cancelar');
      cancelar.addEventListener('click', function(event) {
          window.close();
      });

  });
})()