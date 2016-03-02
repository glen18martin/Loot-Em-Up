// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 512;
canvas.height = 480;
document.body.appendChild(canvas);

// Background image
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
	bgReady = true;
};
bgImage.src = "images/background.png";

// Hero image
var heroReady = false;
var heroImage = new Image();
heroImage.onload = function () {
	heroReady = true;
};
heroImage.src = "images/hero.png";


// loot image
var lootReady = false;
var lootImage = new Image();
lootImage.onload = function () {
	lootReady = true;
};
lootImage.src = "images/loot.png";


// Monster image
var monsters = [];
for(var i = 0; i < 2; i++) {
var monsterReady = false;
var monsterImage = new Image();
monsterImage.onload = function () {
	monsterReady = true;
};
monsterImage.src = "images/monster.png";
var mon = {img : monsterImage};
monsters.push(mon);

}



// Game objects
var hero = {
	speed: 140 // movement in pixels per second
};
var loot = {};
var monster = {
	speed: 90
};
var score = 0;

// Handle keyboard controls
var keysDown = {};

addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode];
}, false);

var set = function(){
	hero.x = canvas.width / 2;
	hero.y = canvas.height / 2;
	for(var i = 0; i < 2; i++) {
	monsters[i].x = 32 + (Math.random() * (canvas.width - 64));
	monsters[i].y = 32 + (Math.random() * (canvas.height - 64));
}
}

// Reset the game when the player collects the loot
var resetloot = function () {
	

	// Throw the monster somewhere on the screen randomly
	//monster.x = 32 + (Math.random() * (canvas.width - 64));
	//monster.y = 32 + (Math.random() * (canvas.height - 64));
	
	loot.x = 30 + (Math.random() * (canvas.width - 64));
	loot.y = 30 + (Math.random() * (canvas.height - 64));
};

// Reset the game when the player meets a monster
var resetmon = function () {
	
	// Throw the monster somewhere on the screen randomly
		for(var i = 0; i < 2; i++) {
	monsters[i].x = 32 + (Math.random() * (canvas.width - 64));
	monsters[i].y = 32 + (Math.random() * (canvas.height - 64));
		}
};


// Update game objects
var update = function (modifier) {
	if (38 in keysDown) { // Player holding up
		if(hero.y > 20)
		hero.y -= hero.speed * modifier;
	}
	if (40 in keysDown) { // Player holding down
		if(hero.y < canvas.height - 64)
		hero.y += hero.speed * modifier;
	}
	if (37 in keysDown) { // Player holding left
		if(hero.x > 0.25*(canvas.width/4))
		hero.x -= hero.speed * modifier;
	}
	if (39 in keysDown) { // Player holding right
		if(hero.x < 3.5*(canvas.width/4))
		hero.x += hero.speed * modifier;
	}

	//moving the monster
	if(score >= 0){
	
	for(var i = 0; i < 2; i++) {
	
	if(hero.x > monsters[i].x)
		monsters[i].x++;
	if(hero.x < monsters[i].x)
		monsters[i].x--;
	if(hero.y > monsters[i].y)
		monsters[i].y++;
	if(hero.y < monsters[i].y)
		monsters[i].y--;
	}
	}
	// Are they touching?
	for(var i = 0; i < 2; i++) {
	if (
		hero.x <= (monsters[i].x + 32)
		&& monsters[i].x <= (hero.x + 32)
		&& hero.y <= (monsters[i].y + 32)
		&& monsters[i].y <= (hero.y + 32)
	) {
		--score;
		resetmon();
	}
	}
	if (
		hero.x <= (loot.x + 32)
		&& loot.x <= (hero.x + 32)
		&& hero.y <= (loot.y + 32)
		&& loot.y <= (hero.y + 32)
	) {
		++score;
		resetloot();
	}
	
};

// Draw everything
var render = function () {
	if (bgReady) {
		ctx.drawImage(bgImage, 0, 0);
		//ctx.drawImage(bgImage, canvas.width/2, canvas.height/2);

	}

	if (lootReady) {
		ctx.drawImage(lootImage, loot.x, loot.y);
	}
	
	if (heroReady) {
		ctx.drawImage(heroImage, hero.x, hero.y);
	}

	for(var i = 0; i < 2; i++) {
	
	if (monsterReady) {
		ctx.drawImage(monsterImage, monsters[i].x, monsters[i].y);
	}
	
	}

	// Score
	ctx.fillStyle = "rgb(250, 250, 250)";
	ctx.font = "24px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText("Score: " + score, 32, 32);
};

// The main game loop
var main = function () {
	var now = Date.now();
	var delta = now - then;

	update(delta / 1000);
	render();

	then = now;

	// Request to do this again ASAP
	requestAnimationFrame(main);
};

// Cross-browser support for requestAnimationFrame
var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame; //?

// Let's play this game!
var then = Date.now();
set();
resetloot();
main();
