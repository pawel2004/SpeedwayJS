import MenuModal from "./classes/MenuModal.js";
import Player from "./classes/Player.js";
import ResultModal from "./classes/ResultModal.js";
import Track from "./classes/Track.js";

/* 
    Constants
*/
const canvas = document.querySelector('#canvas');
const loopsCounter = document.querySelector('#loopsCounter');
const ctx = canvas.getContext('2d');
const canvasWidth = canvas.width;
const canvasHeight = canvas.height;
const startingPos = {
    x: canvasWidth / 2,
    y: canvasHeight / 2 + canvasHeight / 4 + 25
};
const playerCustomData = {
    orange: {
        color: {
            r: 255,
            g: 165,
            b: 0
        },
        image: 'img/orange-motocycle.png',
        initialName: 'Player1',
        initialKeyLeft: 'ArrowLeft',
        initialKeyRight: 'ArrowRight'
    },
    green: {
        color: {
            r: 0,
            g: 255,
            b: 0
        },
        image: 'img/green-motocycle.png',
        initialName: 'Player2',
        initialKeyLeft: 'KeyA',
        initialKeyRight: 'KeyD'
    },
    blue: {
        color: {
            r: 0,
            g: 0,
            b: 255
        },
        image: 'img/blue-motocycle.png',
        initialName: 'Player3',
        initialKeyLeft: 'Numpad2',
        initialKeyRight: 'Numpad3'
    },
    red: {
        color: {
            r: 255,
            g: 0,
            b: 0
        },
        image: 'img/red-motocycle.png',
        initialName: 'Player4',
        initialKeyLeft: 'KeyI',
        initialKeyRight: 'KeyO'
    }
};
const loseModalColor = {
    r: 255,
    g: 0,
    b: 0
};
const winModalColor = {
    r: 0,
    g: 255,
    b: 0
};

/* 
    Variables
*/
const keyPressed = {};
let isPlaying = false;
let players = [];
let alive = 0;
let setLoops = 0;
let loops = 0;

/* 
    Start
*/
showMenu();


/* 
    Elements
*/
const track = new Track(ctx, canvasWidth, canvasHeight, 2, 'img/grass.png', 4, '#FFFFFF', '#555555');

const loseModal = new ResultModal(400, 200, 'Lack of winners!<br>Press SPACE to start again!', loseModalColor);
const errorModal = new ResultModal(400, 200, 'No players added!', loseModalColor);
const winModal = new ResultModal(400, 200, '', winModalColor);

window.addEventListener('keyup', function (e) {
    keyPressed[e.code] = false;
});

/* 
    Handle pressed keys
*/
function keyHandler() {
    for (const [key, value] of Object.entries(keyPressed)) {
        players.forEach(player => {
            if (!player.crashed) {
                if (player.steerLeft == key && value) {
                    player.angle -= 1;
                }
                else if (player.steerRight == key && value) {
                    player.angle += 1;
                }
            }
        });
    }
}

/* 
    Render
*/
function render() {

    // Clear
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // Update
    if (isPlaying) {
        if (alive == 0) {
            loseModal.show();
            isPlaying = false;
        }
        else if (alive == 1 && players.length > 1) {
            players.forEach(player => {
                if (!player.crashed) {
                    winModal.text = `${player.name} wins!<br>Press SPACE to start again!`;
                    return;
                }
            });

            winModal.show();
            isPlaying = false;
        }
        keyHandler();
        players.forEach(player => {
            if (!player.crashed) {
                player.update();
                if (player.checkCollision(track.innerPath, track.outerPath)) {
                    player.crashed = true;
                    alive--;
                }
                if (player.position.x >= startingPos.x - 1 && player.position.x <= startingPos.x + 1 && player.position.y >= canvasHeight / 2 && player.position.y <= canvasHeight) {
                    player.loops--;
                    let leastLoops = setLoops;
                    players.forEach(player => {
                        if (player.loops < leastLoops)
                            leastLoops = player.loops;
                    });
                    loopsCounter.innerHTML = 'Loops left: ' + leastLoops;
                    if (player.loops == 0) {
                        winModal.text = `${player.name} wins!<br>Press SPACE to start again!`;
                        winModal.show();
                        isPlaying = false;
                    }
                }
            }
        });
    }

    // Draw
    track.draw();
    players.forEach(player => {
        player.draw();
    });
    players.forEach(player => {
        player.drawMotocycle();
    });

    requestAnimationFrame(render);
}

/* 
    Pages
*/
function showMenu() {
    const menuModal = new MenuModal(playerCustomData);
    menuModal.show();
    menuModal.confirmButton.addEventListener('click', function () {
        switch (menuModal.validate()) {
            case 'OK': {
                const data = menuModal.packData();
                menuModal.dismiss();
                showGame(data);
                break;
            }
            case 'INVALID_LOOPS': {
                errorModal.text = 'Too small amount of loops!';
                errorModal.show();
                setTimeout(function () {
                    errorModal.dismiss();
                }, 1500);
                break;
            }
            case 'NO_PLAYERS': {
                errorModal.text = 'No players added';
                errorModal.show();
                setTimeout(function () {
                    errorModal.dismiss();
                }, 1000);
                break;
            }
            case 'SAME_KEYS_ON_CARD': {
                errorModal.text = 'Some players have same key(s) on their own cards';
                errorModal.show();
                setTimeout(function () {
                    errorModal.dismiss();
                }, 1000);
                break;
            }
            case 'SAME_KEYS': {
                errorModal.text = 'Some players have same key(s)';
                errorModal.show();
                setTimeout(function () {
                    errorModal.dismiss();
                }, 1000);
            }

        }
    });
}

function showGame(data) {

    /* 
        Keyboard handling
    */
    window.addEventListener('keydown', function (e) {
        if (e.code == 'Space') {
            if (!isPlaying) {
                loseModal.dismiss();
                winModal.dismiss();
                isPlaying = true;
                alive = players.length;
                loops = setLoops;
                loopsCounter.innerHTML = 'Loops left: ' + loops;
                players.forEach(player => {
                    player.clear(setLoops);
                });
            }
        } else
            keyPressed[e.code] = true;
    });

    setLoops = data.loops;

    data.players.forEach(playerData => {
        const playerCustomObj = playerCustomData[playerData.color];
        const player = new Player(ctx, playerData.name, playerData.leftTurn, playerData.rightTurn, playerCustomObj.color, 2, 2, startingPos, playerCustomObj.image, 25, 10, setLoops);
        players.push(player);
    });

    render();
}