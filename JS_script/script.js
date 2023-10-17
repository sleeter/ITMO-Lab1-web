let X, Y, R, flag;
flag = true;
const GRAPH_WIDTH = 400;
const GRAPH_HEIGHT = 400;
const yTextField = document.getElementById("Y-text");
window.addEventListener("load", function (event) {
    fetch("php/load.php")
        .then(response =>  response.text())
        .then(response => document.getElementById("check").innerHTML = response);
});
document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("clear-button").addEventListener("click", clearButton);
    document.getElementById("submit-button").addEventListener("click", function (e) {
        e.preventDefault();
        setR();
        if (!checkY()) return;
        setX();
        if (isNaN(X)){
            alert("\"X\" не выбрано!")
            flag = false
        }
        if (isNaN(Y)){
            alert("\"Y\" не корректно!")
            flag = false
        }
        if (isNaN(R)){
            alert("\"R\" не выбрано!")
            flag = false
        }
        if(flag) {
            changePoint();
            fetch("php/check.php?x=" + X + "&y=" + Y + "&r=" + R)
                .then(response => response.text())
                .then(response => document.getElementById("check").innerHTML = response);
        }
    });
});

function checkY(){
    let Y_text = document.getElementById("Y-text");
    Y = Y_text.value.replace(",", ".").replace(/^0+/, '');
    if (Y.trim() === ""){
        Y_text.setCustomValidity("Заполните поле");
        Y_text.reportValidity();
        return false;
    } else if (!isFinite(Y)){
        Y_text.setCustomValidity("Должно быть число!");
        Y_text.reportValidity();
        return false;
    } else if (Y >= 5 || Y <= -5){
        Y_text.setCustomValidity("Вы вышли за диапазон (-5; 5)!");
        Y_text.reportValidity();
        return false;
    }
    Y_text.setCustomValidity("");
    return true;
}

function setR() {
    const selectedR = document.querySelector('input[name="r"]:checked')
    if (selectedR) {
        R = selectedR.value;
    }
}

function setX() {
    document.querySelectorAll(".x-button").forEach(button => {
        button.addEventListener("click", function() {
            X = this.getAttribute("data-value");
            changePoint();
        });
    });

}

function calculateX(x, r){
    return x / r * 100 + GRAPH_WIDTH / 2;
}

function calculateY(y, r){
    return GRAPH_HEIGHT / 2 - y / r * 100;
}
function changeButtonBackGround(id) {
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        if (button.name === 'x') {
            button.style.backgroundColor = 'white';
        }
    });
    const button = document.getElementById(id);
    button.style.backgroundColor = 'lightgrey';
}

const clearButton = function (e){
    e.preventDefault();
    fetch("php/clear_table.php")
        .then(response => response.text())
        .then(response => document.getElementById("check").innerHTML = response)
};

function changePoint(){
    let point = $("#point");
    let formData = new FormData(document.getElementById("coordinates-form"));
    Y = formData.get("y").replace(",", ".");
    if (X==null || Y==null || R==null) return;
    const xGraph = calculateX(X, R), yGraph = calculateY(Y, R);

    point.attr({
        cx: xGraph,
        cy: yGraph,
        visibility: "visible"
    });
}

document.querySelectorAll(".x-button").forEach(button => {
    button.addEventListener("click", function() {
        X = this.getAttribute("data-value");
        document.getElementById("X-input").value = X;
        changePoint();
    });
});


yTextField.addEventListener("change", e => {
    changePoint();
});