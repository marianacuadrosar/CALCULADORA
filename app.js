const operacion = document.getElementById("operacion");
const valor = document.getElementById("valor");
const botonesNum = document.querySelectorAll(".btn-num");
const botonesFunc = document.querySelectorAll(".btn-funcion");
const igual = document.getElementById("igual");
const ac = document.getElementById("ac");

let operacionActual = "";
let resultado = "";

// Cuando presionamos un número
botonesNum.forEach(boton => {
    boton.addEventListener("click", () => {
        operacionActual += boton.textContent;
        operacion.textContent = operacionActual;
    });
});

// Cuando presionamos una función (+, -, ×, ÷, %)
botonesFunc.forEach(boton => {
    boton.addEventListener("click", () => {
        operacionActual += ` ${boton.textContent} `;
        operacion.textContent = operacionActual;
    });
});

// Botón igual
igual.addEventListener("click", () => {
    try {
        // Reemplazar símbolos por operadores JS
        let expr = operacionActual.replace(/×/g, "*").replace(/÷/g, "/");
        resultado = eval(expr);
        valor.textContent = resultado;
    } catch {
        valor.textContent = "Error";
    }
});

// Botón AC (borrar todo)
ac.addEventListener("click", () => {
    operacionActual = "";
    resultado = "";
    operacion.textContent = "0";
    valor.textContent = "0";
});