const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");

const emojis = ["✂️", "🗿", "📄"];
const emojiSize = 20;

class Emoji {
    constructor(type, x, y, dx, dy) {
        this.type = type;
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.dy = dy;
    }

    move() {
        // Make sure emojis don't move outside the canvas.
        this.x += this.dx; 
        this.y += this.dy;

        // reflect movement off of the walls 
        if (this.x < 0 || this.x > canvas.width - emojiSize) {
            this.dx = -this.dx;
        }
        if (this.y < 0 || this.y > canvas.height - emojiSize) {
            this.dy = -this.dy;
        }
    }

    draw() {
        ctx.fillText(this.type, this.x, this.y);  // fill the type of emoji at x,y
    }

    checkCollision(other) {
        
        // Return true if they've collided, false otherwise.
        const distance = Math.sqrt((this.x - other.x) ** 2 + (this.y - other.y) ** 2);
        return distance < emojiSize; 
    }
}

let emojisArray = [];

function initializeEmojis(numEmojis) {
    // loop through the emojis 
    for (i = 0; i < numEmojis; i++)
    {
        for (let emojiType of emojis) {
            let x = Math.random() * (canvas.width - emojiSize);
            let y = Math.random() * (canvas.height - emojiSize);
            let dx = (Math.random() - 0.5) * 2;
            let dy = (Math.random() - 0.5) * 2;
            emojisArray.push(new Emoji(emojiType, x, y, dx, dy));
        }
        }
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let emoji of emojisArray) {
        emoji.move();
        emoji.draw();
    }
    for (let i = 0; i < emojisArray.length; i++) {
        for (let j = i + 1; j < emojisArray.length; j++) {
            if (emojisArray[i].checkCollision(emojisArray[j])) {
                let winner, loser;
                if (emojisArray[i].type == "🗿" && emojisArray[j].type == "✂️" || 
                    emojisArray[i].type == "✂️" && emojisArray[j].type == "📄" ||
                    emojisArray[i].type == "📄" && emojisArray[j].type == "🗿") {
                    winner = i;
                    loser = j;
                } else {
                    winner = j;
                    loser = i;
                }
                
                emojisArray.splice(loser, 1);
                j--; // Adjust loop index due to splice
            }
        }
    }

    if (allSameType()) {
        alert("Game over!");
    } else {
        requestAnimationFrame(gameLoop);
    }
}

// function handleCollisions() {
//     // If two emojis collide, determine the winner and remove the loser from emojisArray.
//     // Rock beats scissors, paper beats rock, and scissor beats paper 
//     for (let i = 0; i < emojisArray.length; i++){
//         for (let j = i + 1; i < emojisArray.length; j++){
//             if (emojisArray[i].checkCollision(emojisArray[j])) {
//                 let winner, loser;
//             }
//             if (emojisArray[i].type === "🗿" && emojisArray[j].type === "✂️" ||
//                 emojisArray[i].type === "✂️" && emojisArray[j].type === "📄" ||
//                 emojisArray[i].type === "📄" && emojisArray[j].type === "🗿") {
//                 winner = i;
//                 loser = j;
//             } else {
//                 winner = j;
//                 loser = i;
//             }
//             emojisArray.splice(loser, 1); // remove the loser 
//             j--; // decrement the loop 
//         }
//     }
// }

function allSameType() {
    const firstEmojiType = emojisArray[0].type; // look at first emoji

    // loop through emojis 
    for (let emoji of emojisArray) {
        if (emoji.type !== firstEmojiType) {
            return false;
        }
    }
    return true; // if we checked all and they are all the same then return true
}

initializeEmojis(500);
gameLoop();
