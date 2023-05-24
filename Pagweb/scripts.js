const pagar = document.getElementById('btnPagar')
pagar.addEventListener

function validateInputs() {
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
      console.log("Realizando pago");

      //-----------------------------------------------------------------------------------------------------------------------------------------------------------------
      //Aqui se activara el pago
      //-----------------------------------------------------------------------------------------------------------------------------------------------------------------
      
      createPaymentObject(name, email, parseFloat(ID), reason, sede, parseFloat(amount));
    }
}

function isValidEmail(email) {
    // Basic email validation regex
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function createPaymentObject(name, email, ID, reason, sede, amount) {
    // Create a payment object using the values from the form
    var payment = {
      name: name,
      email: email,
      ID:ID,
      reason:reason,
      sede:sede,
      amount: amount
    };

    // Perform further actions with the payment object
    console.log(payment);
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

