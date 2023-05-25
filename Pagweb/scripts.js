

function ValidateLogIn() {
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
    console.log(errorMessage);
  } else {
    console.log("Intentando iniciar...");

    

    //-----------------------------------------------------------------------------------------------------------------------------------------------------------------
    //Aqui Log In
    //-----------------------------------------------------------------------------------------------------------------------------------------------------------------

    validateUserID(name, email, parseFloat(ID));
  }
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

  // Set the Azure Function URL
  const url = 'https://paymentapp.azurewebsites.net/api/HttpLogin?code=98jgfag9g4Al6-VAC7RY0Y7V-gKmXfsfRf6t3p310PNwAzFulrIizg==';

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
      if(responseData.ID != 0){
        console.log("Log In Realizado");
        var medios = document.getElementById("tipoPago");
        medios.style.display = "block";
      } else {
        console.log("Log In Fallido, Usuario no existe");
      }

      // Handle the response data as needed
    })
    .catch(error => {
      console.error('An error occurred:', error);
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



//cambio en forma de pago
var change = document.getElementById("tipoPago");
change.addEventListener('change', function cambioFormaPago(){
    var selected = document.getElementById("tipoPago")
    var seltext = selected.options[selected.selectedIndex].text;
    var sectionEJ = document.getElementById("formaDePagoEJ");
    var sectionCred = document.getElementById("formaDePagoCred");
    var sectionPSE = document.getElementById("formaDePagoPSE");
    var panelConsulta = document.getElementById("panelConsulta");



    if (seltext == "Credito") {
        //mostrar para credito
        console.log("entro a credito")
        sectionEJ.style.display = "none";
        sectionCred.style.display = "block";
        sectionPSE.style.display = "none";
        panelConsulta.style.display = "block";

    }else if (seltext == "PSE"){
        //mostrar para PSE
        console.log("entro a PSE")
        sectionEJ.style.display = "none";
        sectionCred.style.display = "none";
        sectionPSE.style.display = "block";
        panelConsulta.style.display = "none";

    }else{
        //mostrar default
        console.log("entro a default")
        sectionEJ.style.display = "block";
        sectionCred.style.display = "none";
        sectionPSE.style.display = "none";
        panelConsulta.style.display = "none";

    }
}, false);

