// Constantes para guardar secciones de HTML:
const sectionSelectMokepon = document.getElementById("section-select-mokepon"),
sectionGiveName = document.getElementById("section-give-name"),
sectionSelectAttack = document.getElementById("section-select-attack"),
divContainerAttackButtons = document.getElementById("container-attack-buttons"),
pBattleResult = document.getElementById("p-battle-result"),
sectionResetGame = document.getElementById("section-reset-game"),
divPlayerAttacks = document.getElementById("div-player-attacks"),
divEnemyAttacks = document.getElementById("div-enemy-attacks"),
divContainerCards = document.getElementById("container-cards"),
sectionMap  = document.getElementById("section-map"),
map = document.getElementById("map");
let canva = map.getContext("2d");

let pMokeponPlayerWins = document.getElementById("mokepon-player-wins"),
pMokeponEnemyWins = document.getElementById("mokepon-enemy-wins");

// Constantes para guardar elementos de HTML:
const buttonSelectMokeponPlayer = document.getElementById("button-select-mokepon"),
inputMokeponPlayerName = document.getElementById("input-mokepon-player-name"),
pMokeponPlayerName = document.getElementById("mokepon-player-name"), // Párrafo global para el nombre del mokepón del jugador.
pMokeponEnemyName = document.getElementById("mokepon-enemy-name"),
buttonMokeponPlayerName = document.getElementById("button-mokepon-player-name"),
buttonResetGame = document.getElementById("button-reset-game");

// Variables globales para la lógica del juego:
let defaultMokeponPlayerName = "", // Variable para almacenar el nombre por defecto del mokepón seleccionado.
playerAttackText = "",
mokeponEnemyName = "", // AÚN NO UTILIZO ESTA VARIABLE.
enemyAttackText = "",
mokeponOptions,
attackOptions,
mokeponPlayerAttackButtons = [],
mokeponPlayerAttacksUsed = [],
mokeponEnemyAttacksUsed = [],
timeInterval,
mapBackgroundImage = new Image();
mapBackgroundImage.src = "./assets/mokemap.png"

const maxMapWidth = 480;
let mapWidht = window.innerWidth - 20;

if(mapWidht > maxMapWidth){
    mapWidht = maxMapWidth - 20;
}

let wantedHeight = mapWidht * 600 / 800;

map.width = mapWidht;
map.height = wantedHeight;

// Variables globales para los input de los mokepón jugables:
let ratigueyaInput,
capipepoInput,
hipodogeInput,
zefirinInput,
illapikInput;

// Variables globales para los ataques de los mokepón:
let buttonFire,
buttonGrass,
buttonWater,
buttonAir,
buttonRay;

// Variable para guardar al objeto del mokepón jugador:
let mokeponPlayer, currentMokeponEnemyCollided;

let playerId = null, enemyId = null;

// Clase para representar a los mokepón:
class Mokepon{
    constructor(specie, name, fullBodyImage, faceImage, playerRelatedId = null){
        this.playerRelatedId = playerRelatedId;
        this.specie = specie;
        this.name = name;
        this.fullBodyImage = fullBodyImage;
        this.faceImage = new Image();
        this.faceImage.src = faceImage;
        this.width = 50;
        this.height = 50;
        this.x = randomSelection(0, map.width - this.width);
        this.y = randomSelection(0, map.height - this.height);
        this.attacks = [];
        this.speedX = 0;
        this.speedY = 0;
        this.wins = 0;
    }

    drawMokepon(){
        canva.drawImage(
            this.faceImage,
            this.x,
            this.y,
            this.width,
            this.height
        );
    }
}

// Crear objetos de la clase Mokepón:
let ratigueya = new Mokepon("ratigueya", "Ratigueya", "./assets/mokepons_mokepon_ratigueya_attack.png", "./assets/ratigueya_face.png");
let capipepo = new Mokepon("capipepo", "Capipepo", "./assets/mokepons_mokepon_capipepo_attack.png", "./assets/capipepo_face.png");
let hipodoge = new Mokepon("hipodoge", "Hipodoge", "./assets/mokepons_mokepon_hipodoge_attack.png", "./assets/hipodoge_face.png");
let zefirin = new Mokepon("zefirin", "Zefirín", "./assets/mokepons_mokepon_zefirin_attack.png", "./assets/mokepons_mokepon_zefirin_attack.png");
let illapik = new Mokepon("illapik", "Illapik", "./assets/mokepons_mokepon_illapik_attack.png", "./assets/mokepons_mokepon_illapik_attack.png");

let playableMokepon = [], enemyPlayableMokepon = []

const RATIGUEYA_ATTACKS = [
    { emoji: "🔥", id: "button-fire", value: 0 },
    { emoji: "🔥", id: "button-fire", value: 0 },
    { emoji: "🌱", id: "button-grass", value: 1 },
    { emoji: "💧", id: "button-water", value: 2 },
    { emoji: "🌪️", id: "button-air", value: 3 },
    { emoji: "⚡", id: "button-ray", value: 4 }
];
const CAPIPEPO_ATTACKS = [
    { emoji: "🌱", id: "button-grass", value: 1 },
    { emoji: "🌱", id: "button-grass", value: 1 },
    { emoji: "🔥", id: "button-fire", value: 0 },
    { emoji: "💧", id: "button-water", value: 2 },
    { emoji: "🌪️", id: "button-air", value: 3 },
    { emoji: "⚡", id: "button-ray", value: 4 }
];
const HIPODOGE_ATTACKS = [
    { emoji: "💧", id: "button-water", value: 2 },
    { emoji: "💧", id: "button-water", value: 2 },
    { emoji: "🔥", id: "button-fire", value: 0 },
    { emoji: "🌱", id: "button-grass", value: 1 },
    { emoji: "🌪️", id: "button-air", value: 3 },
    { emoji: "⚡", id: "button-ray", value: 4 }
];
const ZEFIRIN_ATTACKS = [
    { emoji: "🌪️", id: "button-air", value: 3 },
    { emoji: "🌪️", id: "button-air", value: 3 },
    { emoji: "🔥", id: "button-fire", value: 0 },
    { emoji: "🌱", id: "button-grass", value: 1 },
    { emoji: "💧", id: "button-water", value: 2 },
    { emoji: "⚡", id: "button-ray", value: 4 }
];
const ILLAPIK_ATTACKS = [
    { emoji: "⚡", id: "button-ray", value: 4 },
    { emoji: "⚡", id: "button-ray", value: 4 },
    { emoji: "🔥", id: "button-fire", value: 0 },
    { emoji: "🌱", id: "button-grass", value: 1 },
    { emoji: "💧", id: "button-water", value: 2 },
    { emoji: "🌪️", id: "button-air", value: 3 }
];

// Agregar los ataques de los mokepón con objetos literales:
ratigueya.attacks.push(...RATIGUEYA_ATTACKS);
capipepo.attacks.push(...CAPIPEPO_ATTACKS);
hipodoge.attacks.push(...HIPODOGE_ATTACKS);
zefirin.attacks.push(...ZEFIRIN_ATTACKS);
illapik.attacks.push(...ILLAPIK_ATTACKS);

playableMokepon.push(ratigueya, capipepo, hipodoge, zefirin, illapik);

function startGame(){
    // Esconder secciones no utilizadas al principio del juego:
    sectionGiveName.style.display = "none";
    sectionMap.style.display = "none";
    sectionSelectAttack.style.display = "none";
    pBattleResult.style.display = "none";
    sectionResetGame.style.display = "none";
    
    // Popular los mokepón jugables al iniciar el juego:
    playableMokepon.forEach((mokepon) => {
        mokeponOptions = `
            <input type="radio" name="mokepon" id="${mokepon.specie}" />
            
            <label class="mokepon-card" for="${mokepon.specie}">
                <p>${mokepon.name}</p>
                <img src="${mokepon.fullBodyImage}" alt="Imagen de ${mokepon.name}" />
            </label>
        `;

        divContainerCards.innerHTML += mokeponOptions;
    });

    // Definir los inputs de los mokepón jugables una vez renderizados en HTML:
    ratigueyaInput = document.getElementById("ratigueya");
    capipepoInput = document.getElementById("capipepo");
    hipodogeInput = document.getElementById("hipodoge");
    zefirinInput = document.getElementById("zefirin");
    illapikInput = document.getElementById("illapik");

    buttonSelectMokeponPlayer.addEventListener("click", selectMokeponPlayer);
    
    // Escuchar cuando se presione el botón para nombrar el mokepón:
    buttonMokeponPlayerName.addEventListener("click", assignMokeponPlayerName);

    // Escuchar cuando se presione el botón de reiniciar el juego:
    buttonResetGame.addEventListener("click", resetGame);
    
    // Función para iniciar el juego desde el backend:
    joinTheGame();
}

function joinTheGame(){
    fetch("http://192.168.123.49:8080/unirse")
        .then(function(res) {
            if(res.ok){
                res.text()
                    .then(function(myReponse) {
                        console.log(myReponse);

                        playerId = myReponse;
                    })
            }
        })

}

function selectMokeponPlayer(){
    // Identificar cuál mokepón fue elegido y guardar el nombre
    if(ratigueyaInput.checked){
        defaultMokeponPlayerName = ratigueya.name;
    }else if(capipepoInput.checked){
        defaultMokeponPlayerName = capipepo.name;
    }else if(hipodogeInput.checked){
        defaultMokeponPlayerName = hipodoge.name;
    }else if(zefirinInput.checked){
        defaultMokeponPlayerName = zefirin.name;
    }else if(illapikInput.checked){
        defaultMokeponPlayerName = illapik.name;
    }else{
        alert("Debes elegir a un mokepón para jugar...");
        return; // Salir de la función si no se ha elegido un mokepón para que no de paso a la siguiente sección.
    }

    // Obetener el mokepón elegido por el jugador en un objeto propio:
    getMokeponSelectedByPlayer();

    // Ocultar la sección de selección y mostrar la sección de nombrar:
    sectionSelectMokepon.style.display = "none";
    sectionGiveName.style.display = "flex";
}

function getMokeponSelectedByPlayer(){
    for(let i = 0; i < playableMokepon.length; i++){
        if(defaultMokeponPlayerName === playableMokepon[i].name){
            
            mokeponPlayer = new Mokepon(playableMokepon[i].specie, playableMokepon[i].name, playableMokepon[i].fullBodyImage, playableMokepon[i].faceImage.src);

            // Copiar manualmente las propiedades restantes:
            mokeponPlayer.x = playableMokepon[i].x;
            mokeponPlayer.y = playableMokepon[i].y;
            mokeponPlayer.speedX = playableMokepon[i].speedX;
            mokeponPlayer.speedY = playableMokepon[i].speedY;
            mokeponPlayer.width = playableMokepon[i].width;
            mokeponPlayer.height = playableMokepon[i].height;

            // Copiar ataques (creando nuevos objetos literales):
            mokeponPlayer.attacks = playableMokepon[i].attacks.map(attack => ({ ...attack }));
            
            break;
        }
    }

    // Cargar los botones de ataques del mokepón del jugador: 
    loadMokeponPlayerAttackButtons();
}

function loadMokeponPlayerAttackButtons(){
    mokeponPlayer.attacks.forEach((attack) => {
        attackOptions = `
            <button id="${attack.id}" class="button-attack AButton">${attack.emoji}</button>
        `;

        divContainerAttackButtons.innerHTML += attackOptions;
    });

    // Definir los inputs de los ataques disponibles del mokepón del jugador una vez renderizados en HTML:
    buttonFire = document.getElementById("button-fire");
    buttonGrass = document.getElementById("button-grass");
    buttonWater = document.getElementById("button-water");
    buttonAir = document.getElementById("button-air");
    buttonRay = document.getElementById("button-ray");

    mokeponPlayerAttackButtons = document.querySelectorAll(".AButton");
}

function assignMokeponPlayerName(){
    // Verificar si el campo de texto está vacío:
    if(!(inputMokeponPlayerName.value.trim() === "")){
        // Si no está vacío, usar el nombre ingresado por el jugador:
        mokeponPlayer.name = inputMokeponPlayerName.value.trim();
    }

    // Mostrar el nombre del mokepón del jugador en el juego:
    pMokeponPlayerName.innerHTML = mokeponPlayer.name;

    // Enviar el nombre del mokepón del jugador al backend:
    sendMokeponPlayerData();

    // Ocultar la sección de nombrar:
    sectionGiveName.style.display = "none";
    
    showMap();
}

function sendMokeponPlayerData(){
    fetch(`http://192.168.123.49:8080/mokepon/${playerId}`, {
        method: "post",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            mokeponSpecie: mokeponPlayer.specie,
            mokeponName: mokeponPlayer.name
        })
    })
}

function showMap(){
    // Mostrar la sección de mapa:
    sectionMap.style.display = "flex";

    sectionMap.querySelector("h2").innerHTML = `¡Recorre el mapa con tu ${mokeponPlayer.name}!`;

    timeInterval = setInterval(drawMap, 50);

    window.addEventListener("keydown", keyPressed);
    window.addEventListener("keyup", stopMovement);
}

function drawMap(){
    let topSide = mokeponPlayer.y, // 0
    bottomSide = (mokeponPlayer.y + mokeponPlayer.height), // 50
    leftSide = mokeponPlayer.x, // 
    rightSide = (mokeponPlayer.x + mokeponPlayer.width); // 

    mokeponPlayer.y = ((topSide > 0) && (bottomSide < map.height)) // Evaluar si estoy en los límites verticales del mapa.
        ? mokeponPlayer.y + mokeponPlayer.speedY // Permitir libre movimiento en el eje Y.
        : Math.max(1, Math.min((map.height - mokeponPlayer.height - 1), mokeponPlayer.y)); // Detectar si está en el límite superior o inferior para así posicionar dentro del rango permitido.

    mokeponPlayer.x = ((leftSide > 0) && (rightSide < map.width)) // Evaluar si estoy en los límites horizontales del mapa.
        ? mokeponPlayer.x + mokeponPlayer.speedX // Permitir libre movimiento en el eje X.
        : Math.max(1, Math.min((map.width - mokeponPlayer.width - 1), mokeponPlayer.x));// Detectar si está en el límite izquierdo o derecho para así posicionar dentro del rango permitido.


    canva.clearRect(0, 0, map.width, map.height);
    
    canva.drawImage(
        mapBackgroundImage,
        0,
        0,
        map.width,
        map.height
    );

    mokeponPlayer.drawMokepon();

    // Enviar las coordenadas del mokepón jugador al backend:
    sendMokeponPlayerPosition();

    enemyPlayableMokepon.forEach((enemy) => {
        if(enemy !== undefined){
            enemy.drawMokepon();
            checkCollision();
        }
    });
}

function sendMokeponPlayerPosition(){
    console.log(mokeponPlayer.x +", "+ mokeponPlayer.y);

    fetch(`http://192.168.123.49:8080/mokepon/${playerId}/playerPosition`, {
        method: "post",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            playerX: mokeponPlayer.x,
            playerY: mokeponPlayer.y
        })
    })
        .then(function (res){
            if(res.ok){
                res.json()
                    .then(function ({enemiesList}){
                        enemyPlayableMokepon = enemiesList.map(function (enemy){
                            if(enemy.mokepon !== undefined){
                                const mokeponSpecie = enemy.mokepon.specie || "";
                                
                                let mokeponEnemy = null;
                                
                                switch(mokeponSpecie){
                                    case "ratigueya":
                                        mokeponEnemy = new Mokepon("ratigueya", enemy.mokepon.name, "./assets/mokepons_mokepon_ratigueya_attack.png", "./assets/ratigueya_face.png", enemy.id);

                                        break;
                                    case "capipepo":
                                        mokeponEnemy = new Mokepon("capipepo", enemy.mokepon.name, "./assets/mokepons_mokepon_capipepo_attack.png", "./assets/capipepo_face.png", enemy.id);

                                        break;
                                    case "hipodoge":
                                        mokeponEnemy = new Mokepon("hipodoge", enemy.mokepon.name, "./assets/mokepons_mokepon_hipodoge_attack.png", "./assets/hipodoge_face.png", enemy.id);

                                        break;
                                    case "zefirin":
                                        mokeponEnemy = new Mokepon("zefirin", enemy.mokepon.name, "./assets/mokepons_mokepon_zefirin_attack.png", "./assets/mokepons_mokepon_zefirin_attack.png", enemy.id);

                                        break;
                                    case "illapik":
                                        mokeponEnemy = new Mokepon("illapik", enemy.mokepon.name, "./assets/mokepons_mokepon_illapik_attack.png", "./assets/mokepons_mokepon_illapik_attack.png", enemy.id);

                                        break;
                                    default:
                                        break;
                                }

                                mokeponEnemy.x = enemy.x;
                                mokeponEnemy.y = enemy.y;

                                return mokeponEnemy;
                            }
                        });
                    })
            }
        })
}

function keyPressed(event){
    switch (event.key) {
        case 'ArrowUp':
            moveUp();
            break;
        case 'ArrowLeft':
            moveLeft();
            break;
        case 'ArrowDown':
            moveDown();
            break;
        case 'ArrowRight':
            moveRight();
            break;
        default:
            break;
    }
}

function moveUp(){
    mokeponPlayer.speedY = -5;
}

function moveDown(){
    mokeponPlayer.speedY = 5;
}

function moveLeft(){
    mokeponPlayer.speedX = -5;
}

function moveRight(){
    mokeponPlayer.speedX = 5;
}

function stopMovement(){
    mokeponPlayer.speedX = 0;
    mokeponPlayer.speedY = 0;
}

function checkCollision(){
    enemyPlayableMokepon.forEach((enemy) => {
        if(!(
            ((mokeponPlayer.y + mokeponPlayer.height) < enemy.y) ||
            (mokeponPlayer.y > (enemy.y + enemy.height)) ||
            ((mokeponPlayer.x + mokeponPlayer.width) < enemy.x) ||
            (mokeponPlayer.x > (enemy.x + enemy.width))
        )){
            clearInterval(timeInterval);
            stopMovement();

            console.log("Se detectó una colisión");

            enemyId = enemy.playerRelatedId;
            console.log("ID del enemigo colisionado: " + enemyId);
            
            // Ocultar la sección de mapa y mostrar las secciones de combate y mensajes:
            sectionMap.style.display = "none";
            sectionSelectAttack.style.display = "flex";
            pBattleResult.style.display = "flex";

            listenMokeponPlayerAttacksSequence();

            // Obtener al mokepón enemigo colisionado:
            currentMokeponEnemyCollided = enemy;
            // Mostrar el nombre del mokepón enemigo colisionado:
            pMokeponEnemyName.innerHTML = currentMokeponEnemyCollided.name;
        }
    });
}

function listenMokeponPlayerAttacksSequence(){
    mokeponPlayerAttackButtons.forEach((attackButton) => {
        // Escuchar cuando se presione algún botón de ataque:
        attackButton.addEventListener("click", (e) => {
            // Se guarda una copia del objeto del ataque utilizado por el jugador:
            mokeponPlayerAttacksUsed.push(mokeponPlayer.attacks.find(obj => obj["emoji"] === e.target.textContent));
            
           // Deshabilitar botón de ataque tras ser utilizado y cambiar el color de fondo del mismo:
            attackButton.disabled = true;
            attackButton.style.background = "#1E3E62";
            
            if(mokeponPlayerAttacksUsed.length === mokeponPlayer.attacks.length){
                // Enviar los ataques del mokepón jugador al backend:
                sendMokeponPlayerAttacksUsed();
            }
        });
    });
}

function sendMokeponPlayerAttacksUsed(){
    fetch(`http://192.168.123.49:8080/mokepon/${playerId}/attacksUsed`, {
        method: "post",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            attacksUsed: mokeponPlayerAttacksUsed
        })
    })

    timeInterval = setInterval(getEnemyAttacksUsed, 50);
}

function getEnemyAttacksUsed(){
    fetch(`http://192.168.123.49:8080/mokepon/${enemyId}/attacksUsed`,)
        .then(function (res){
            if(res.ok){
                res.json()
                    .then(function ({attacksUsed}){
                        if(attacksUsed.length === mokeponPlayerAttacksUsed.length){
                            console.log("Secuencia de ataques del enemigo: ");
                            console.log(attacksUsed);

                            mokeponEnemyAttacksUsed = attacksUsed;
                            mokeponBattle();
                        }
                    })
            }
        })
}

function attacksIndexSequence(index){
    playerAttackText = mokeponPlayerAttacksUsed[index].emoji;
    enemyAttackText = mokeponEnemyAttacksUsed[index].emoji;
}

function mokeponBattle(){
    clearInterval(timeInterval);

    // Matriz de resultados: (fila = jugador1, columna = jugador2)
    const matrix = [
        [0, 1, -1, -1, 1],   // Fuego (0)
        [-1, 0, 1, 1, -1],   // Planta (1)
        [1, -1, 0, -1, 1],   // Agua (2)
        [1, -1, 1, 0, -1],   // Aire (3)
        [-1, 1, -1, 1, 0]    // Rayo (4)
    ];

    let interactionResult;

    for(let i = 0; i < mokeponPlayerAttacksUsed.length; i++){
        // Resultado según la matriz de interacciones:
        interactionResult = matrix[mokeponPlayerAttacksUsed[i].value][mokeponEnemyAttacksUsed[i].value];

        attacksIndexSequence(i);

        // Mostrar el resultado de cada comparación de ataques:
        if(interactionResult === 0){
            createMessage("Empate"); // SE EJECUTA PERO NUNCA LO PUEDE VER EL JUGADOR.
        }else if(interactionResult === 1){
            mokeponPlayer.wins++;
            createMessage("Ganaste"); // SE EJECUTA PERO NUNCA LO PUEDE VER EL JUGADOR.
        }else{
            currentMokeponEnemyCollided.wins++;
            createMessage("Perdiste"); // SE EJECUTA PERO NUNCA LO PUEDE VER EL JUGADOR.
        }
    }

    // Obtener las vidas del jugador y enemigo del document y actualizarlas según el resultado del combate:
    pMokeponPlayerWins.innerHTML = mokeponPlayer.wins;
    pMokeponEnemyWins.innerHTML = currentMokeponEnemyCollided.wins;
}

function createMessage(battleResultMessage){
    let pNewPlayerAttack = document.createElement("p");
    let pNewEnemyAttack = document.createElement("p");
    
    pBattleResult.innerHTML = battleResultMessage;
    
    pNewPlayerAttack.innerHTML = playerAttackText;
    pNewEnemyAttack.innerHTML = enemyAttackText;

    divPlayerAttacks.appendChild(pNewPlayerAttack);
    divEnemyAttacks.appendChild(pNewEnemyAttack);

    finalizeBattle();

    /*
    // Si los oponentes han elegido todos los ataques disponibles, finalizar la batalla:
    if((mokeponPlayerAttacksUsed.length === mokeponPlayer.attacks.length) && (mokeponEnemyAttacksUsed.length === currentMokeponEnemyCollided.attacks.length)){
        finalizeBattle();
    }
    */
}

function finalizeBattle(){
    pBattleResult.innerHTML = (mokeponPlayer.wins > currentMokeponEnemyCollided.wins) 
        ? "¡Ganaste ✨!"
        : (mokeponPlayer.wins < currentMokeponEnemyCollided.wins)
        ? "Perdiste 😢"
        : "Empate 😐";
    
    // Mostrar la sección de reiniciar juego:
    sectionResetGame.style.display = "flex";
}

function resetGame(){
    location.reload();
}

function randomSelection(min, max){
    return Math.floor(Math.random() * (max - min + 1) + min);
}

// window.onload = startGame; // Lo mismo que window.addEventListener("load", startGame);, pero menos flexible.
window.addEventListener("load", startGame);