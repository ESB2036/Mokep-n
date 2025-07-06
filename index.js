// Clase para representar a los usuarios que se conectan al sitio web:
class Player{
    constructor(id){
        this.id = id;
    }

    assignMokepon(mokepon){
        this.mokepon = mokepon;
    }

    updatePosition(x, y){
        this.x = x;
        this.y = y;
    }

    assignAttacksUsed(attacksUsed){
        this.attacksUsed = attacksUsed;
    }
}

class Mokepon{
    constructor(specie, name){
        this.specie = specie;
        this.name = name;
    }
}

// Importamos Express desde la carpeta node_modules:
const express = require("express");
const cors = require("cors");

// Creamos la aplicación de Express:
const app = express(); // Se genera una instacia del servidor que se utilizará.

app.use(cors()); // Deshabilitar todos los posibles errores relacionados con cors.
app.use(express.json()); // Habilitar la capacidad de recibir peticiones POST que traigan contenido en formato JSON.
app.use(express.static("public")); //

// Escojemos un puerto por el cual el servidor web escuchará:
const port = 8080;

// Array que contenga a los jugadores que se vayan uniendo al sitio web:
const playersList = [];

// Página para visualizar el mensaje "¡Hola Express!"
app.get("/unirse", (req, res) => { // Se ejecuta cada vez que la página se carga.
    const id = `${Math.random()}`;
    const newPlayer = new Player(id);

    playersList.push(newPlayer);

    console.log("Entró un nuevo usuario: " + id);

    res.send(id);
});

app.post("/mokepon/:playerId", (req, res) => {
    const playerId = req.params.playerId || "";
    const specie = req.body.mokeponSpecie || "";
    const name = req.body.mokeponName || "";
    const mokepon = new Mokepon(specie, name);

    const playerIndex = playersList.findIndex((player) => player.id === playerId);

    if(playerIndex >= 0){
        playersList[playerIndex].assignMokepon(mokepon);
    }

    console.log(playersList);

    res.end(); // Responder un dato vacío.
});

app.post("/mokepon/:playerId/playerPosition", (req, res) => {
    const playerId = req.params.playerId || "";
    const playerX = req.body.playerX || 0;
    const playerY = req.body.playerY || 0;

    const playerIndex = playersList.findIndex((player) => player.id === playerId);

    if(playerIndex >= 0){
        playersList[playerIndex].updatePosition(playerX, playerY);
    }

    const enemiesList = playersList.filter((player) => player.id !== playerId);

    res.send({ // Responder con la lista de los demás jugadores (enemigos).
        enemiesList
    });
});

app.post("/mokepon/:playerId/attacksUsed", (req, res) => {
    const playerId = req.params.playerId || "";
    const playerAttacksUsed = req.body.attacksUsed || [];

    const playerIndex = playersList.findIndex((player) => player.id === playerId);

    if(playerIndex >= 0){
        playersList[playerIndex].assignAttacksUsed(playerAttacksUsed);
    }

    res.end(); // Responder un dato vacío.
});

app.get("/mokepon/:playerId/attacksUsed", (req, res) => {
    const playerId = req.params.playerId || "";
    const enemy = playersList.find((player) => player.id === playerId);

    res.send({ // Responder con el envío de los ataques del enemigo:
        attacksUsed: enemy.attacksUsed || []
    }); 
});

// Escuchar la activación del servidor en el puerto elegido:
app.listen(port, () => {
    console.log("¡Servidor funcionando!");
});