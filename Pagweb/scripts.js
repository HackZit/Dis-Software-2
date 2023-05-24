
function validateInputs() {
    var name = document.getElementById("name").value;
    var email = document.getElementById("email").value;
    var amount = document.getElementById("amount").value;

    var errorMessage = "";

    if (name.trim() === "") {
      errorMessage += "Name is required.<br>";
    }

    if (email.trim() === "") {
      errorMessage += "Email is required.<br>";
    } else if (!isValidEmail(email)) {
      errorMessage += "Email is invalid.<br>";
    }

    if (amount.trim() === "") {
      errorMessage += "Amount is required.<br>";
    } else if (isNaN(parseFloat(amount))) {
      errorMessage += "Amount must be a valid number.<br>";
    } else if (parseFloat(amount) <= 0) {
        errorMessage += "Amount must be greater than zero.<br>";
    }

    var errorElement = document.getElementById("errorMessage");
    if (errorMessage !== "") {
      errorElement.innerHTML = errorMessage;
    } else {
      errorElement.innerHTML = "";
      createPaymentObject(name, email, parseFloat(amount));
    }
}

function isValidEmail(email) {
    // Basic email validation regex
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function createPaymentObject(name, email, amount) {
    // Create a payment object using the values from the form
    var payment = {
      name: name,
      email: email,
      amount: amount
    };

    // Perform further actions with the payment object
    console.log(payment);
}



//cambio en forma de pago
var change = document.getElementById("tipoPago");
console.log("change:");
console.log(change);
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

