const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

function drawPoint(x, y, radius = 3, color = 'red') {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
}

function drawLine(x1, y1, x2, y2, color = 'black', width = 2) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.stroke();
}

function drawRectangle(x, y, width, height, color = 'black') {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
}

function drawCircle(x, y, radius, color = 'black') {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
}

function drawTriangle(x1, y1, x2, y2, x3, y3,  fillColor = null, strokeColor = 'black', width = 2) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineTo(x3, y3);
    ctx.closePath();
    ctx.lineWidth = width;
    ctx.strokeStyle = strokeColor;
    ctx.stroke();
    if (fillColor) {
        ctx.fillStyle = fillColor;
        ctx.fill();
    }
}

function drawPolygon(points, fillColor = null, strokeColor = 'black', width = 2) {
    if (points.length < 3) return;

    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.closePath();

    ctx.lineWidth = width;
    ctx.strokeStyle = strokeColor;
    ctx.stroke();

    if (fillColor) {
        ctx.fillStyle = fillColor;
        ctx.fill();
    }
}

function drawText(text, x, y, color = 'black', font = '20px Arial') {
    ctx.fillStyle = color;
    ctx.font = font;
    ctx.fillText(text, x, y);
}

function drawImage(x, y, width, height) {
    const img = new Image();
    img.src = './images/imagen1.jpg';
    img.onload = () => {
        ctx.drawImage(img, x, y, width, height);
    }
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // detener reloj si existe
    if (intervaloReloj !== null) {
        clearInterval(intervaloReloj);
        intervaloReloj = null;
    }
    horas = 0;
    minutos = 0;
    segundos = 0;
}

function dibujarPlanoCartesiano() {
    // Ejes X y Y
    ctx.beginPath();
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;
    ctx.moveTo(0, canvas.height / 2);
    ctx.lineTo(canvas.width, canvas.height / 2);
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();
    // Cuadricula
    ctx.beginPath();
    ctx.strokeStyle = 'gray';
    ctx.lineWidth = 1;
    for (let i = 0; i < canvas.width; i += 10) {
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
    }
    for (let i = 0; i < canvas.height; i += 10) {
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
    }
    ctx.stroke();
    // Nombre de los ejes
    ctx.fillStyle = 'blue';
    ctx.font = '12px Arial';
    ctx.fillText('Y', canvas.width / 2, 10);
    ctx.fillText('X', 490, canvas.height / 2);
}

function drawLineFromAtoB() {
    const xCenter = canvas.width / 2;
    const yCenter = canvas.height / 2;
    let x1 = parseInt(document.getElementById('x1').value);
    let y1 = parseInt(document.getElementById('y1').value);
    let x2 = parseInt(document.getElementById('x2').value);
    let y2 = parseInt(document.getElementById('y2').value);
    y1*=-1;
    y2*=-1;
    drawLine(xCenter + x1, yCenter + y1, xCenter + x2, yCenter + y2);
}

function drawStar() {
    const xCenter = canvas.width / 2;
    const yCenter = canvas.height / 2;
    const height = canvas.height;
    const width = canvas.width;
    for (let i = 10; i < 260; i+=10) {
        //Lineas del cuadrante inferior derecho
        drawLine(xCenter+i, yCenter, xCenter, height - i)
        //Lineas del cuadrante inferior izquierdo
        drawLine(xCenter-i, yCenter, xCenter, height - i)
        //Lineas del cuadrante superior derecho
        drawLine(xCenter+i, yCenter, xCenter, 0 + i) 
        //Lineas del cuadrante superior izquierdo
        drawLine(xCenter-i, yCenter, xCenter, 0 + i)
    }
}


/* function rotarPuntoRespectoACentro(punto, centro, angulo) {
    trasladar al origen
    let x = punto.x - centro.x;
    let y = punto.y - centro.y;

    //rotar
    let cos = Math.cos(angulo);
    let sin = Math.sin(angulo);

    let xRot = x * cos - y * sin;
    let yRot = x * sin + y * cos;

    //regresar
    return {
        x: xRot + centro.x,
        y: yRot + centro.y
    };

*/


// FUNCIÓN DE ROTACIÓN POR PUNTO
function rotarPuntoRespectoACentro(punto, centro, angulo) {
    let x = punto.x - centro.x;
    let y = punto.y - centro.y;

    let cos = Math.cos(angulo);
    let sin = Math.sin(angulo);

    let xRot = x * cos - y * sin;
    let yRot = x * sin + y * cos;

    return {
        x: xRot + centro.x,
        y: yRot + centro.y
    };
}

// ÁNGULO GLOBAL
let anguloRotacion = 0;
let anguloX = 0;
let anguloY = 0;
let anguloZ = 0;

// DIBUJAR ESTRELLA CON ROTACIÓN ACTUAL
function drawStarRotated() {

    clearCanvas();
    dibujarPlanoCartesiano();

    const xCenter = canvas.width / 2;
    const yCenter = canvas.height / 2;
    const centro = { x: xCenter, y: yCenter };
    const height = canvas.height;

    for (let i = 10; i < 260; i += 10) {

        let pares = [
            [{ x: xCenter + i, y: yCenter }, { x: xCenter, y: height - i }],
            [{ x: xCenter - i, y: yCenter }, { x: xCenter, y: height - i }],
            [{ x: xCenter + i, y: yCenter }, { x: xCenter, y: i }],
            [{ x: xCenter - i, y: yCenter }, { x: xCenter, y: i }]
        ];

        for (let par of pares) {

            let p1 = transformarPunto(par[0], centro);
            let p2 = transformarPunto(par[1], centro);

            drawLine(p1.x, p1.y, p2.x, p2.y);
        }
    }
}


//Funcion para transformar un punto con las rotaciones actuales
function transformarPunto(punto, centro) {

    let x = punto.x - centro.x;
    let y = punto.y - centro.y;

    //ROTACIÓN X
    y = y * Math.cos(anguloX);

    //ROTACIÓN Y
    x = x * Math.cos(anguloY);

    //ROTACIÓN Z
    let cos = Math.cos(anguloZ);
    let sin = Math.sin(anguloZ);

    let xRot = x * cos - y * sin;
    let yRot = x * sin + y * cos;

    return {
        x: xRot + centro.x,
        y: yRot + centro.y
    };
}

// FUNCIÓN QUE SE LLAMA AL HACER CLICK
function rotarZ() {
    anguloZ += Math.PI / 18;
    drawStarRotated();
}

function rotarX() {
    anguloX += Math.PI / 18;
    drawStarRotated();
}

function rotarY() {
    anguloY += Math.PI / 18;
    drawStarRotated();
}



// ROTAR X HACIA EL OTRO SENTIDO
function rotarXNegativo() {
    anguloX -= Math.PI / 18;
    drawStarRotated();
}

// ROTAR Y HACIA EL OTRO SENTIDO
function rotarYNegativo() {
    anguloY -= Math.PI / 18;
    drawStarRotated();
}

// ROTAR Z HACIA EL OTRO SENTIDO
function rotarZNegativo() {
    anguloZ -= Math.PI / 18;
    drawStarRotated();
}



//Funcion para dibujar un circulo con la formula matematica de la circunferencia
function drawCircleWithMath() {
    for (let i = 0; i < 360; i+=10) {
        drawLineFromCircleWithDegrees(i, 'red', 2);
    }
}


//Funcion para dibujar una linea del circulo con la formula matematica de la circunferencia usando numero de grados para el angulo
function drawLineFromCircleWithDegrees(degrees,color = 'red', width = 2) {
    const xCenter = canvas.width / 2;
    const yCenter = canvas.height / 2;
    const x = parseInt(document.getElementById('x').value) + xCenter;
    const y = parseInt(document.getElementById('y').value) + yCenter;
    const radius = parseInt(document.getElementById('radius').value);
    const angle = degrees * 2 * Math.PI / 360;
    const x1 = x + radius * Math.cos(angle);
    const y1 = y + radius * Math.sin(angle);
    drawLine(x, y, x1, y1, color, width);
}

//Funcion para dibujar el reloj
let horas = 0;
let minutos = 0;
let segundos = 0;

//FUNCION PRINCIPAL
function dibujarReloj() {
    clearCanvas();

    const xCenter = canvas.width / 2;
    const yCenter = canvas.height / 2;
    const radius = 150;

    //CÍRCULO EXTERIOR
    ctx.beginPath();
    ctx.arc(xCenter, yCenter, radius, 0, Math.PI * 2);
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 3;
    ctx.stroke();

    //PUNTITOS DE LAS HORAS
    for (let i = 0; i < 360; i += 30) {
        const angle = i * Math.PI / 180;

        const x = xCenter + radius * Math.cos(angle);
        const y = yCenter + radius * Math.sin(angle);

        let size = (i % 90 === 0) ? 8 : 4;
        drawPoint(x, y, size, 'black');
    }

    //CALCULAR ÁNGULOS
    const anguloHora = (horas + minutos / 60) * 30;
    const anguloMinuto = (minutos + segundos / 60) * 6;
    const anguloSegundo = segundos * 6;

    //MANECILLA HORA
    dibujarManecilla(anguloHora, radius * 0.5, 5, 'black');

    //MANECILLA MINUTOS
    dibujarManecilla(anguloMinuto, radius * 0.7, 3, 'blue');

    //MANECILLA SEGUNDOS
    dibujarManecilla(anguloSegundo, radius * 0.9, 2, 'red');

    //CENTRO
    drawPoint(xCenter, yCenter, 5, 'black');

    //AVANCE DEL TIEMPO
    segundos++;

    if (segundos >= 60) {
        segundos = 0;
        minutos++;
    }

    if (minutos >= 60) {
        minutos = 0;
        horas++;
    }

    if (horas >= 12) {
        horas = 0;
    }
}

//FUNCION PARA MANECILLAS
function dibujarManecilla(grados, largo, grosor, color) {
    const xCenter = canvas.width / 2;
    const yCenter = canvas.height / 2;

    const rad = (grados - 90) * Math.PI / 180;

    const x = xCenter + largo * Math.cos(rad);
    const y = yCenter + largo * Math.sin(rad);

    drawLine(xCenter, yCenter, x, y, color, grosor);
}

//INICIAR RELOJ
function iniciarReloj() {
    if (intervaloReloj !== null) {
        clearInterval(intervaloReloj);
    }
    intervaloReloj = setInterval(dibujarReloj, 1000);
}

let intervaloReloj = null;

// Iniciar con hora personalizada
function iniciarRelojConHora() {
    // Obtener valores
    let h = parseInt(document.getElementById("horaInput").value) || 0;
    let m = parseInt(document.getElementById("minutoInput").value) || 0;
    let s = parseInt(document.getElementById("segundoInput").value) || 0;

    // Ajustar valores
    horas = h % 12;
    minutos = m % 60;
    segundos = s % 60;

    //Dibujar reloj
    dibujarReloj();

    //Evitar múltiples timers
    if (intervaloReloj !== null) {
        clearInterval(intervaloReloj);
    }

    //Iniciar reloj
    intervaloReloj = setInterval(dibujarReloj, 1000);
}

// CUBO

const size = 80;
const half = size / 2;

// Vértices del cubo (centrado en 0,0,0)
let cubeVertices = [
  { x: -half, y: -half, z: -half }, // 0
  { x:  half, y: -half, z: -half }, // 1
  { x:  half, y:  half, z: -half }, // 2
  { x: -half, y:  half, z: -half }, // 3
  { x: -half, y: -half, z:  half }, // 4
  { x:  half, y: -half, z:  half }, // 5
  { x:  half, y:  half, z:  half }, // 6
  { x: -half, y:  half, z:  half }, // 7
];

// Cada cara: 4 índices + color
const cubeFaces = [
  { indices: [0, 1, 2, 3], color: 'red'    }, // frente  (z-)
  { indices: [5, 4, 7, 6], color: 'blue'   }, // atrás   (z+)
  { indices: [4, 0, 3, 7], color: 'green'  }, // izquierda
  { indices: [1, 5, 6, 2], color: 'yellow' }, // derecha
  { indices: [4, 5, 1, 0], color: 'orange' }, // abajo
  { indices: [3, 2, 6, 7], color: 'purple' }, // arriba
];

function project3D(vertex, cx, cy) {
    return {
        x: cx + vertex.x,
        y: cy - vertex.y,  // Y hacia arriba en matemáticas, hacia abajo en canvas
        z: vertex.z
    };
}

function drawCube() {
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    clearCanvas();
    dibujarPlanoCartesiano();
    // Calcular profundidad media de cada cara (para pintar atrás primero)
    const facesToDraw = cubeFaces.map(face => {
        const projected = face.indices.map(i => project3D(cubeVertices[i], cx, cy));
        const avgZ = projected.reduce((sum, p) => sum + p.z, 0) / projected.length;
        return { face, projected, avgZ };
    });
    facesToDraw.sort((a, b) => a.avgZ - b.avgZ); // más lejos primero
    for (const { face, projected } of facesToDraw) {
        const points2D = projected.map(p => ({ x: p.x, y: p.y }));
        drawPolygon(points2D, face.color, 'black', 1);
    }
}

function rotatePoint3D(p, cx, cy, cz, axis, angleDeg) {
    const rad = angleDeg * Math.PI / 180;
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);
    let x = p.x - cx, y = p.y - cy, z = p.z - cz;
    let xRot, yRot, zRot;
    if (axis === 'Z') {
        xRot = x * cos - y * sin;
        yRot = x * sin + y * cos;
        zRot = z;
    } else if (axis === 'X') {
        xRot = x;
        yRot = y * cos - z * sin;
        zRot = y * sin + z * cos;
    } else { // 'Y'
        xRot = x * cos + z * sin;
        yRot = y;
        zRot = -x * sin + z * cos;
    }
    return { x: xRot + cx, y: yRot + cy, z: zRot + cz };
}
function rotateCube(axis, angle) {
    const cx = 0, cy = 0, cz = 0; // el cubo está centrado en el origen
    cubeVertices = cubeVertices.map(v => rotatePoint3D(v, cx, cy, cz, axis, angle));
    drawCube();
}


// EJE X
function rotarCuboX() {
    rotateCube('X', 10);
}

function rotarCuboXNegativo() {
    rotateCube('X', -10);
}

// EJE Y
function rotarCuboY() {
    rotateCube('Y', 10);
}

function rotarCuboYNegativo() {
    rotateCube('Y', -10);
}

// EJE Z
function rotarCuboZ() {
    rotateCube('Z', 10);
}

function rotarCuboZNegativo() {
    rotateCube('Z', -10);
}


// =======================
// DIAMANTE (OCTAEDRO)
// =======================

const diamondSize = 100;

// VÉRTICES
let diamondVertices = [
    { x: 0, y: -diamondSize, z: 0 }, // punta arriba
    { x: diamondSize, y: 0, z: 0 }, // derecha
    { x: 0, y: 0, z: diamondSize }, // frente
    { x: -diamondSize, y: 0, z: 0 }, // izquierda
    { x: 0, y: 0, z: -diamondSize }, // atrás
    { x: 0, y: diamondSize, z: 0 } // punta abajo
];

// CARAS
const diamondFaces = [

    { indices:[0,1,2], color:'cyan' },
    { indices:[0,2,3], color:'lightblue' },
    { indices:[0,3,4], color:'deepskyblue' },
    { indices:[0,4,1], color:'dodgerblue' },

    { indices:[5,2,1], color:'violet' },
    { indices:[5,3,2], color:'pink' },
    { indices:[5,4,3], color:'plum' },
    { indices:[5,1,4], color:'magenta' }
];

// PROYECCIÓN
function projectDiamond(v,cx,cy){

    return{
        x:cx+v.x,
        y:cy-v.y,
        z:v.z
    };

}

// DIBUJAR
function drawDiamond(){

    clearCanvas();

    dibujarPlanoCartesiano();

    const cx=canvas.width/2;
    const cy=canvas.height/2;

    const faces=diamondFaces.map(face=>{

        const projected=
            face.indices.map(i=>
                projectDiamond(
                    diamondVertices[i],
                    cx,
                    cy
                )
            );

        const avgZ=
            projected.reduce(
                (s,p)=>s+p.z,
                0
            )/projected.length;

        return{
            face,
            projected,
            avgZ
        };

    });

    faces.sort(
        (a,b)=>
            a.avgZ-b.avgZ
    );

    for(let f of faces){

        drawPolygon(
            f.projected,
            f.face.color,
            'black',
            1
        );

    }

}

// ROTAR
function rotateDiamond(axis,angle){

    diamondVertices=
        diamondVertices.map(v=>
            rotatePoint3D(
                v,
                0,
                0,
                0,
                axis,
                angle
            )
        );

    drawDiamond();

}

// BOTONES
function rotarDiamondX(){
    rotateDiamond('X',10);
}

function rotarDiamondXNegativo(){
    rotateDiamond('X',-10);
}

function rotarDiamondY(){
    rotateDiamond('Y',10);
}

function rotarDiamondYNegativo(){
    rotateDiamond('Y',-10);
}

function rotarDiamondZ(){
    rotateDiamond('Z',10);
}

function rotarDiamondZNegativo(){
    rotateDiamond('Z',-10);
}