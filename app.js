const operacion = document.getElementById("operacion");
const valor = document.getElementById("valor");
const botonesNum = document.querySelectorAll(".btn-num");
const botonesFunc = document.querySelectorAll(".btn-funcion");
const igual = document.getElementById("igual");
const ac = document.getElementById("ac");
const histList = document.getElementById("hist-list");
const histClear = document.getElementById("hist-clear");
const operacionesDiv = document.getElementById("operaciones");

let ultimaExpresion = ""; // lo que se muestra ARRIBA tras "="

function f6(n){
    if (!Number.isFinite(n)) return "Error";
    const r = Math.round(n * 1e6) / 1e6;                    // redondeo duro
    return Number.isInteger(r) ? String(r) : String(r.toFixed(6)).replace(/\.?0+$/,"");
}

let operacionActual = "";
let resultado = "";

function sanitize(expr){
    return expr
        .replace(/×/g,"*")
        .replace(/÷/g,"/")
        .replace(/−/g,"-")   // <-- clave para que funcione el menos Unicode
        .replace(/\s+/g," ")
        .trim();
}

// Valida expresiones tipo: número (op número)*
function isValidExpr(expr){
    // quitamos espacios para validar más fácil
    const s = expr.replace(/\s+/g,"");
    return /^-?\d+(\.\d+)?([+\-*/%]-?\d+(\.\d+)?)*$/.test(s);
}

// Añade item al historial + autoscroll
function addToHistory(op,res){
    if(!op || op.trim()==="") return;
    const li = document.createElement("li");
    li.className = "hist__item";
    li.innerHTML = `<span class="op">${op.trim()}</span> <span class="eq">=</span> <span class="res">${String(res)}</span>`;
    histList.appendChild(li);
    // scroll al final
    operacionesDiv.scrollTop = operacionesDiv.scrollHeight;
}

// Cuando presionamos un número
botonesNum.forEach(boton => {
    boton.addEventListener("click", () => {
        operacionActual += boton.textContent;
        valor.textContent = operacionActual;
    });
});

// Cuando presionamos una función (+, -, ×, ÷, %)
botonesFunc.forEach(boton => {
    boton.addEventListener("click", () => {

        if (boton.id === "modo") return; //arreglo temporal para el boton de cambio de tema

        const opTxt = boton.textContent;

        // Permitir signo negativo al inicio
        if (operacionActual.trim() === "" && opTxt === "−") {
            operacionActual = "−";
        }
        // Si ya hay un operador al final, reemplazarlo (evita duplicados tipo "9 + ×")
        else if (/[+\u2212×÷%]\s*$/.test(operacionActual)) {
            operacionActual = operacionActual.replace(/[+\u2212×÷%]\s*$/, ` ${opTxt} `);
        }
        // En caso normal, solo agregar
        else {
            operacionActual += ` ${opTxt} `;
        }

        valor.textContent = operacionActual;
    });
});

// Botón igual
igual.addEventListener("click", () => {
    try {
        // Reemplazar símbolos por operadores JS
        let expr = operacionActual.replace(/×/g, "*").replace(/÷/g, "/");

        expr = sanitize(expr); // <-- usa la helper
        if(!isValidExpr(expr) || /[+\-*/%]\s*$/.test(expr)){
            valor.textContent = "Operación no permitida";
            return;
        }

        resultado = eval(expr);
        if (!Number.isFinite(resultado)) {
            valor.textContent = "Error";
            return;
        }

        valor.textContent = f6(resultado);
        addToHistory(operacionActual, f6(resultado));
        operacion.textContent = operacionActual;     // ↑ arriba se muestra la EXPRESIÓN evaluada
        operacionActual = String(f6(resultado));   // encadenar operaciones con el valor formateado
    } catch {
        valor.textContent = "Error";
    }
});

// Botón AC (borrar todo)
ac.addEventListener("click", () => {

    // --- TOMAR SNAPSHOT ANTES DE LIMPIAR ---
    const opAntes  = operacion.textContent.trim();
    const resAntes = valor.textContent.trim();

    operacionActual = "";
    resultado = "";

    if (opAntes && opAntes !== "0") {
        addToHistory(opAntes, resAntes);
    }


    operacion.textContent = "0";
    valor.textContent = "0";
});

histClear.addEventListener("click", () => {
    histList.innerHTML = "";
});




//Es lo del dark theme
document.getElementById('modo').addEventListener('click', ()=>{
    const el = document.documentElement;
    el.classList.toggle('dark');
    localStorage.theme = el.classList.contains('dark') ? 'dark' : 'light';
});
if (localStorage.theme === 'dark') document.documentElement.classList.add('dark');


//esta parte cambia el icono dependiendo del tema
const iconDiv = document.getElementById('icon');
function setThemeIcon() {
    const isDark = document.documentElement.classList.contains('dark');
    iconDiv.innerHTML = isDark
        ? '<ion-icon name="sunny-outline"></ion-icon>'
        : '<ion-icon name="moon-outline"></ion-icon>';
}
setThemeIcon();
document.getElementById('modo').addEventListener('click', setThemeIcon);