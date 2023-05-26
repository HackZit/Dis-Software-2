const btnLogIn = document.getElementById("btnLogIn");
const btnPagarcred = document.getElementById("btnPagar");
const btnPagarDeb = document.getElementById("btnPagarDeb");
const errorDiv = document.getElementById('errorMessage');
function nada(){}

function ValidateLogIn() {

  btnLogIn.innerHTML = "verificando";
  btnLogIn.onclick = nada;
  
  var name = document.getElementById("name").value;
  var email = document.getElementById("email").value;
  var ID = document.getElementById("ID").value;
  var reason = document.getElementById("reason").value;
  var sede = document.getElementById("sede").value;
  var amount = document.getElementById("amount").value;

  var errorMessage = "";

  if (name.trim() === "") {
    errorMessage += "El nombre es requerido.<br>";
  }

  if (email.trim() === "") {
    errorMessage += "El Email es requerido.<br>";
  } else if (!isValidEmail(email)) {
    errorMessage += "El Email es invalido.<br>";
  }

  if (ID.trim() === "") {
    errorMessage += "La identificacion es requerida.<br>";
  } else if (isNaN(parseFloat(ID))) {
    errorMessage += "La identificacion debe ser un numero.<br>";
  }

  if (reason.trim() === "") {
    errorMessage += "El concepto de pago es requerido.<br>";
  }

  if (sede.trim() === "") {
    errorMessage += "La sede es requerida.<br>";
  }

  if (amount.trim() === "") {
    errorMessage += "La cantidad es requerido.<br>";
  } else if (isNaN(parseFloat(amount))) {
    errorMessage += "La cantidad debe ser un numero.<br>";
  } else if (parseFloat(amount) <= 0) {
      errorMessage += "La cantidad debe ser mas que zero.<br>";
  }
  
  if (errorMessage !== "") {
    errorDiv.innerHTML = "Error <br>"+ errorMessage;
    errorDiv.style.display = "inline-block";
    console.log(errorMessage);
    btnLogIn.innerHTML = "Log in";
    btnLogIn.style.backgroundColor = "#fbbf24"
    btnLogIn.onclick = ValidateLogIn;
  } else {
    console.log("Intentando iniciar...");
    errorDiv.style.display = "none";
    errorDiv.innerHTML = errorMessage;
    //-----------------------------------------------------------------------------------------------------------------------------------------------------------------
    //Aqui Log In
    //-----------------------------------------------------------------------------------------------------------------------------------------------------------------

    validateUserID(name, email, parseFloat(ID));
  }
  
}

function CheckSaldo() {
  // Get the value from the input field with ID "ID"
  const idValue = document.getElementById("ID").value;

  // Create the JSON payload to send to the Azure Function
  const payload = {
    ID: idValue
  };

  // Make an HTTP POST request to the Azure Function
  fetch('https://paymentapp.azurewebsites.net/api/HttpSaldo?code=EM7VGSj5vgA5ojnGspONrBFgJUP-PUd5fbh16sRf33t_AzFu7JyTJA==', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  })
  .then(response => {
    if (response.ok) {
      // Request succeeded, parse the response as JSON
      return response.json();
    } else {
      // Request failed, handle the error
      throw new Error('Error: ' + response.status);
    }
  })
  .then(data => {
    // Process the response data
    console.table(data);
    var saldo = document.getElementById("saldoOut");
    var text = "";
    for (let index = 0; index < data.length; index++) {
      var acc = data[index].account;
      var sal = data[index].saldo;
      var tipo = data[index].tipo;
      text = text+acc+"("+tipo+"): $"+sal+"<br>";
    }

    saldo.innerHTML = text;
    // Mostrar tabla de saldos
  })
  .catch(error => {
    // Handle any errors that occurred during the request
    console.error('Error occurred:', error);
  });
}


function validateUserID(name, email, ID) {
  // Create an object with the values
  const data = {
    name: name,
    email: email,
    ID: ID
  };

  // Convert the data object to JSON
  const jsonData = JSON.stringify(data);

  // Set the Azure Function URLs
  const loginUrl = 'https://paymentapp.azurewebsites.net/api/HttpLogin?code=98jgfag9g4Al6-VAC7RY0Y7V-gKmXfsfRf6t3p310PNwAzFulrIizg==';
  const addCardsUrl = 'https://paymentapp.azurewebsites.net/api/httpAddCards?code=p6bc3jE_RX61BAWQoYM72Z0TyGl9Bz807OELj39rKwIMAzFuBjQbNw=='; 

  // Send the JSON data to the Azure Function for user validation
  fetch(loginUrl, {
    method: 'POST',
    body: jsonData,
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(response => {
      if (response.ok) {
        return response.json(); // Parse the response as JSON
      } else {
        throw new Error('Error sending data to Azure Function.');
      }
    })
    .then(responseData => {
      console.log('Response from Azure Function:', responseData);

      //-----------------------------------------------------------------------------------------------------------------------------------------------------------------
      //Log In succsesful
      //-----------------------------------------------------------------------------------------------------------------------------------------------------------------
      if (responseData.identificacion != 0) {
        console.log("Log In Realizado");
        btnLogIn.innerHTML = "Log out";
        btnLogIn.style.backgroundColor = "#fbbf24"
        btnLogIn.onclick = logOut;

        document.getElementById("btnHistory").style.display = "block";
        document.getElementById("panelConsulta").style.display = "block";
        document.getElementById("name").disabled = true;
        document.getElementById("email").disabled = true;
        document.getElementById("ID").disabled = true;
        document.getElementById("reason").disabled = true;
        document.getElementById("sede").disabled = true;
        document.getElementById("amount").disabled = true;


        // Call the Azure Function for adding cards
        fetch(addCardsUrl, {
          method: 'POST',
          body: jsonData,
          headers: {
            'Content-Type': 'application/json'
          }
        })
          .then(response => {
            if (response.ok) {
              return response.json(); // Parse the response as JSON
            } else {
              throw new Error('Error calling httpAddCards Azure Function.');
            }
          })
          .then(cardsData => {
            console.log('Response from httpAddCards Azure Function:', cardsData);
            var dropdown = document.getElementById('dropdown');
            var dropdowndeb = document.getElementById('dropdowndebito');
            dropdowndeb.options.length = 0;
            dropdown.options.length = 0;
            // Handle the response data from httpAddCards function
            // Assuming the response is an array of objects with columns "identificacion", "id", and "nro_tarjeta"
            for (var i = 0; i < cardsData.Credito.data.length; i++) {
              // Crear una nueva opción
              var option = document.createElement('option');
            
              // Asignar el valor y la etiqueta de la opción
              option.value = cardsData.Credito.data[i].value;
              option.text = cardsData.Credito.data[i].label;
            
              // Agregar la opción al dropdown
              dropdown.appendChild(option);
            }

            for (var i = 0; i < cardsData.Debito.data.length; i++) {
              // Crear una nueva opción
              var option = document.createElement('option');
            
              // Asignar el valor y la etiqueta de la opción
              option.value = cardsData.Debito.data[i].value;
              option.text = cardsData.Debito.data[i].label;
            
              // Agregar la opción al dropdown
              dropdowndeb.appendChild(option);
            }


            // Continue with any further logic or UI updates
          })
          .catch(error => {
            console.error('An error occurred while calling httpAddCards Azure Function:', error);
            errorDiv.innerHTML = "Error al iniciar session <br> Intente otra vez";
            errorDiv.style.display = "inline-block";

          });
            
          
        // Logica de botones y modificaciones del front end
        var medios = document.getElementById("tipoPago");
        medios.style.display = "block";

        // ...
      } else {
        console.log("Log In Fallido, Usuario no existe");
        errorDiv.innerHTML = "Error al iniciar session <br>Usuario no existe";
        errorDiv.style.display = "inline-block";
        btnLogIn.innerHTML = "Log in";
        btnLogIn.style.backgroundColor = "#fbbf24"
        btnLogIn.onclick = ValidateLogIn;
        
      }

      // Continue with any further logic or UI updates
    })
    .catch(error => {
      console.error('An error occurred during user validation:', error);
    });
}


function isValidEmail(email) {
    // Basic email validation regex
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function createLogInObject(name, email, ID, reason, sede, amount) {
    // Crea un JSON con los datos del usuario
    var LogIn = {
      name: name,
      email: email,
      ID:ID,
      reason:reason,
      sede:sede,
      amount: amount
    };
    // Perform further actions with the payment object
    console.log(LogIn);
}

function ProcessPayment() {
  // Retrieve the values
  const identificacion = document.getElementById("ID").value;
  const hora = getCurrentTime();
  const fecha = getCurrentDate();
  var cuotas;
  var id;
  var metodo_pago = document.getElementById("tipoPago").value;

  
  if (metodo_pago == "Credito") {
    var cuota = document.getElementById("cuota");
    var cuotas = cuota.options[cuota.selectedIndex].value;
    id = document.getElementById("dropdown").value;

  } else {
    cuotas = 1;
    id = document.getElementById("dropdowndebito").value;
  }
  const estado = 1;
  const sede = document.getElementById("sede").value;
  const razon = document.getElementById("reason").value;
  const amount = document.getElementById("amount").value;

  // Create the JSON payload
  const payload = {
    identificacion,
    hora,
    fecha,
    metodo_pago,
    id,
    cuotas,
    estado,
    sede,
    razon,
    amount
  };

  // Convert the payload to JSON
  const jsonData = JSON.stringify(payload);

  // Set the Azure Function URL
  const url = 'https://paymentapp.azurewebsites.net/api/HttpProcessPayment?code=8coLpwJmh9PlG31a4drFl7wZNXM2aezAMPLPk50i7QlnAzFuKmExtQ==';

  // Send the JSON data to the Azure Function
  fetch(url, {
    method: 'POST',
    body: jsonData,
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(response => {
      if (response.ok) {
        return response.json(); // Parse the response as JSON
      } else {
        throw new Error('Error sending data to Azure Function.');
      }
    })
    .then(responseData => {
      console.log('Response from Azure Function:', responseData);
      // Mover a pestaña de confirmación
      document.getElementById("panelDePago").style.display = "none";
      document.getElementById("panelBueno").style.display = "block";
      var sucout = document.getElementById("succOut");
      var txt = "Ha pagado $"+responseData.amount+" correctamente<br>ID de transaccion:"+responseData.num_tran+"<br> realizado el: "+responseData.fecha+"<br> a la hora: "+responseData.hora
      sucout.innerHTML = txt;
    })
    .catch(error => {
      console.error('An error occurred:', error);
    });
}

function ValidatePayment() {
  // Get the values from the HTML elements
  const identificacion = document.getElementById("ID").value;
  const hora = getCurrentTime();
  const fecha = getCurrentDate();
  const metodo_pago = document.getElementById("tipoPago").value;
  var cuotas;
  var id;

  //disable buttons to combat multiple sends
  btnPagarcred.onclick = nada;
  btnPagarDeb.onclick = nada;
  btnPagarcred.innerHTML = "Procesando pago";
  btnPagarDeb.innerHTML = "Procesando pago";

  if (metodo_pago == "Credito") {
    cuotas = document.getElementById("cuota").value;
    id = document.getElementById("dropdown").value;

  } else {
    cuotas = 1;
    id = document.getElementById("dropdowndebito").value;

  }
  const estado = 1;
  const sede = document.getElementById("sede").value;
  const razon = document.getElementById("reason").value;
  const amount = document.getElementById("amount").value;

  // Create the JSON object
  const payload = {
    identificacion: identificacion,
    hora: hora,
    fecha: fecha,
    metodo_pago: metodo_pago,
    id: id,
    cuotas: cuotas,
    estado: estado,
    sede: sede,
    razon: razon,
    amount: amount
  };

  // Convert the JSON object to a string
  const jsonData = JSON.stringify(payload);

  // Set the Azure Function URL
  const url = "https://paymentapp.azurewebsites.net/api/HttpValidatePayment?code=_VstjfGFXd0IESJd8kDR3pSfZShwHhwsI6bv1D0gHWLSAzFuyWS_gA==";

  // Send the JSON data to the Azure Function
  fetch(url, {
    method: 'POST',
    body: jsonData,
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(response => {
      if (response.ok) {
        return response.json(); // Parse the response as JSON
      } else {
        throw new Error('Error sending data to Azure Function.');
      }
    })
    .then(responseData => {
      console.log('Response from Azure Function:', responseData.length);
      // Handle the response data as needed
      if (Object.keys(responseData).length === 1) {
        console.log("Empezando a procesar pago: ", responseData);
        ProcessPayment();
      } else {
        console.log("Pago rechazado: ", responseData);
        // Mover a pestaña de rechazados
        document.getElementById("panelDePago").style.display = "none";
        document.getElementById("panelFallo").style.display = "block";
      }
    })
    .catch(error => {
      console.error('An error occurred:', error);
    });

  //re enable butons
  btnPagarcred.innerHTML = "Pagar";
  btnPagarDeb.innerHTML = "Pagar";
  btnPagarcred.onclick = ValidatePayment;
  btnPagarDeb.onclick = ValidatePayment;

  
  
}

function HistoryChannel() {
  // Values to send
  const idValue = document.getElementById("ID").value;

  // Create the JSON payload to send to the Azure Function
  const payload = {
    ID: idValue
  };

  // Azure Function URL
  var url = 'https://paymentapp.azurewebsites.net/api/HttpHistory?code=zY0cl_1sxztFreH-65eXXiQDAbWlo7Ft1jNLb0WzRooPAzFuvxmjXg==';

  // Sending data via Fetch API
  fetch(url, {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then(response => {
    if (response.ok) {
      return response.json(); // Parse response as JSON
    } else {
      throw new Error('Error sending data:', response.statusText);
    }
  })
  
  .then(responseData => {
    console.log('Response received:', responseData); // Handle the response data
    // Mover a pestaña de historial
    document.getElementById("panelhistorial").style.display = "block";
    document.getElementById("panelDePago").style.display = "none";
    var hist = document.getElementById("historial");
    var index = histop;
    for (index; index < responseData.length; index++) {

      var divbig = document.createElement("div");
      divbig.style.height = "1.5rem";
      divbig.style.backgroundColor = "#93c5fd";
      divbig.style.borderRadius = "0.75rem";
      divbig.style.gridColumn= "span 2 / span 2";
      divbig.innerHTML = responseData[index].amount;
      hist.appendChild(divbig);

      var divcuota = document.createElement("div");
      divcuota.style.height = "1.5rem";
      divcuota.style.backgroundColor = "#93c5fd";
      divcuota.style.borderRadius = "0.75rem";
      divcuota.innerHTML = responseData[index].cuotas;
      hist.appendChild(divcuota);
      
      var divfecha = document.createElement("div");
      divfecha.style.height = "1.5rem";
      divfecha.style.backgroundColor = "#93c5fd";
      divfecha.style.borderRadius = "0.75rem";
      divfecha.innerHTML = responseData[index].fecha.substring(0,10);
      hist.appendChild(divfecha);

      var divhora = document.createElement("div");
      divhora.style.height = "1.5rem";
      divhora.style.backgroundColor = "#93c5fd";
      divhora.style.borderRadius = "0.75rem";
      divhora.innerHTML = responseData[index].hora.substring(11,16);
      hist.appendChild(divhora);

      var divID = document.createElement("div");
      divID.style.height = "1.5rem";
      divID.style.backgroundColor = "#93c5fd";
      divID.style.borderRadius = "0.75rem";
      divID.innerHTML = responseData[index].identificacion;
      hist.appendChild(divID);

      var divMet = document.createElement("div");
      divMet.style.height = "1.5rem";
      divMet.style.backgroundColor = "#93c5fd";
      divMet.style.borderRadius = "0.75rem";
      divMet.innerHTML = responseData[index].metodo_pago;
      hist.appendChild(divMet);

      var divEst = document.createElement("div");
      divEst.style.height = "1.5rem";
      divEst.style.backgroundColor = "#93c5fd";
      divEst.style.borderRadius = "0.75rem";
      if (responseData[index].estado) {
        divEst.innerHTML = "Confirmado";
      }else{
        divEst.innerHTML = "Error";
      }
      hist.appendChild(divEst);

      var divTrans = document.createElement("div");
      divTrans.style.height = "1.5rem";
      divTrans.style.backgroundColor = "#93c5fd";
      divTrans.style.borderRadius = "0.75rem";
      divTrans.innerHTML = responseData[index].num_tran;
      hist.appendChild(divTrans);

      var divRaz = document.createElement("div");
      divRaz.style.height = "1.5rem";
      divRaz.style.backgroundColor = "#93c5fd";
      divRaz.style.borderRadius = "0.75rem";
      divRaz.innerHTML = responseData[index].razon;
      hist.appendChild(divRaz);

      var divSed = document.createElement("div");
      divSed.style.height = "1.5rem";
      divSed.style.backgroundColor = "#93c5fd";
      divSed.style.borderRadius = "0.75rem";
      divSed.innerHTML = responseData[index].sede;
      hist.appendChild(divSed);
    }
    histop = index;
  })
  .catch(error => {
    console.error('Error sending data:', error);
  });
}

var histop = 0;

function volver(){
  document.getElementById("panelDePago").style.display = "grid";
  document.getElementById("panelBueno").style.display = "none";
  document.getElementById("panelFallo").style.display = "none";
  document.getElementById("panelhistorial").style.display = "none";

}

function getCurrentTime() {
  const now = new Date();
  let hours = now.getHours();
  let minutes = now.getMinutes();
  let ampm = 'AM';

  if (hours > 12) {
    hours -= 12;
    ampm = 'PM';
  }

  hours = addLeadingZero(hours);
  minutes = addLeadingZero(minutes);

  return `${hours}:${minutes} ${ampm}`;
}

function getCurrentDate() {
  const now = new Date();
  const year = now.getFullYear();
  let month = now.getMonth() + 1;
  let day = now.getDate();

  month = addLeadingZero(month);
  day = addLeadingZero(day);

  return `${year}-${month}-${day}`;
}

function addLeadingZero(number) {
  return number < 10 ? `0${number}` : number;
}

function logOut(){

  console.log("Log Out Realizado");
  btnLogIn.innerHTML = "Log in";
  btnLogIn.style.backgroundColor = "#fbbf24"
  btnLogIn.onclick = ValidateLogIn;

  document.getElementById("btnHistory").style.display = "none";
  document.getElementById("panelConsulta").style.display = "none";

  document.getElementById("name").disabled = false;
  document.getElementById("email").disabled = false;
  document.getElementById("ID").disabled = false;
  document.getElementById("reason").disabled = false;
  document.getElementById("sede").disabled = false;
  document.getElementById("amount").disabled = false;

  document.getElementById("name").value = ' ';  
  document.getElementById("email").value = ' ';  
  document.getElementById("ID").value =  ' ';  
  document.getElementById("reason").value =  ' ';  
  document.getElementById("sede").value =  ' ';  
  document.getElementById("amount").value =  ' ';  
  document.getElementById("tipoPago").options[0].selected = true;


}

//cambio en forma de pago
var change = document.getElementById("tipoPago");
change.addEventListener('change', function cambioFormaPago(){
    var selected = document.getElementById("tipoPago")
    var seltext = selected.options[selected.selectedIndex].text;
    var sectionEJ = document.getElementById("formaDePagoEJ");
    var sectionCred = document.getElementById("formaDePagoCred");
    var sectionPSE = document.getElementById("formaDePagoPSE");



    if (seltext == "Credito") {
        //mostrar para credito
        console.log("entro a credito")
        sectionEJ.style.display = "none";
        sectionCred.style.display = "block";
        sectionPSE.style.display = "none";

    }else if (seltext == "PSE"){
        //mostrar para PSE
        console.log("entro a PSE")
        sectionEJ.style.display = "none";
        sectionCred.style.display = "none";
        sectionPSE.style.display = "block";

    }else{
        //mostrar default
        console.log("entro a default")
        sectionEJ.style.display = "block";
        sectionCred.style.display = "none";
        sectionPSE.style.display = "none";

    }
}, false);



