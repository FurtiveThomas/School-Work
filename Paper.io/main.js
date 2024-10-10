"use strict";

var canv;
var ctx;
window.onload = function() {
	canv = document.getElementById("canvas");
	canv.width = window.innerWidth;
	canv.height = window.innerHeight;
	ctx = canv.getContext("2d");
	document.addEventListener("keydown", keyDown);
	setInterval(game, 1000/10);
};

window.onresize = function(event) {
	if (canv) {
	    canv.width = window.innerWidth;
		canv.height = window.innerHeight;
	}
};

var posX,posY;
posX=posY=4;
var tileWidth,tileHeigth,tileCountX,tileCountY;
tileWidth=50;
tileHeigth=50;
tileCountX=60;
tileCountY=40;
var inOwnArea = true;

var xMove,yMove;
xMove=yMove=0;
var trail=[];
var tail = 5;

var map = [];
for (var i = 0; i < tileCountX; i++) {
	map.push([]);
	for (var j = 0; j < tileCountY; j++) {
		map[i].push({
			ownArea: false,
			trail: false
		});
	}
}
map[4][3].ownArea = true;
map[4][4].ownArea = true;
map[4][5].ownArea = true;
map[5][3].ownArea = true;
map[5][4].ownArea = true;
map[5][5].ownArea = true;
map[6][3].ownArea = true;
map[6][4].ownArea = true;
map[6][5].ownArea = true;

//		ax=Math.floor(Math.random()*tileCountX);
//		ay=Math.floor(Math.random()*tileCountY);


function getPath(from, to) {
	var toTestItems = [	];
	var cameFrom = { };
	var positionToString = (x, y) => x + "-" + y;
	var stringToPosition = (str) => {
		return {
			x: parseInt(str.split("-")[0]),
			y: parseInt(str.split("-")[1])
		};
	};
	var pushNonExistentOwnSquares = function(x, y) {
		var pushIf = (movedX, movedY) => {
			var str = positionToString(movedX, movedY);
			if (movedX >= 0 && movedX <= tileCountX && movedY >= 0 && movedY <= tileCountY && map[movedX][movedY].ownArea && toTestItems.indexOf(str) === -1) {
				toTestItems.push(str);
				cameFrom[str] = positionToString(x, y);
			}
		};
		pushIf(x - 1, y);
		pushIf(x + 1, y);
		pushIf(x, y - 1);
		pushIf(x, y + 1);
	}

	toTestItems.push(positionToString(from.x, from.y));
	pushNonExistentOwnSquares(from.x, from.y);

	var toStr = positionToString(to.x, to.y);
	var i = 0;
	while (i < toTestItems.length) {
		var toTest = toTestItems[i];
		var toTestPos = stringToPosition(toTest);

		if (toTest === toStr) { // Arrived..
			var path = [];
			var toAdd = toTest;
			while (toAdd) {
				path.push(stringToPosition(toAdd));
				toAdd = cameFrom[toAdd];
			}
			return path.reverse();
		}
		
		pushNonExistentOwnSquares(toTestPos.x, toTestPos.y);
		i++;
	}
}

function game() {
	posX+=xMove;
	posY+=yMove;
	if(posX<0) {
		posX= tileCountX-1;
	}
	if(posX>tileCountX-1) {
		posX= 0;
	}
	if(posY<0) {
		posY= tileCountY-1;
	}
	if(posY>tileCountY-1) {
		posY= 0;
	}
	ctx.fillStyle= 'rgba(160, 160, 160, 1)';
	ctx.fillRect(0,0,canv.width,canv.height);
	tileWidth = Math.ceil(canv.width / tileCountX);
	tileHeigth = Math.ceil(canv.height / tileCountY);

	var shouldFillNewArea = false;
	var squareToFill = null;

	if (map[posX][posY].ownArea) {
		tail = 1;
		shouldFillNewArea = !inOwnArea;
		inOwnArea = true;
	} else {
		tail++;
		inOwnArea = false;
	}
	trail.push({x:posX,y:posY});

	if (shouldFillNewArea) {
		var squareToFill = getPath(trail[0], trail[trail.length -1]);
		squareToFill.forEach(ii => map[ii.x][ii.y].trail);
		squareToFill = squareToFill.concat(trail);
		ctx.fillStyle = 'rgba(0, 100, 200, 1)';
		squareToFill.forEach(ii => ctx.fillRect(ii.x*tileWidth,ii.y*tileHeigth,tileWidth,tileHeigth));
		//debugger;
	}

	for (var x = 0; x < tileCountX; x++) {
		var trailYCount = 0;
		for (var y = 0; y < tileCountY; y++) {
			var trailXCount = 0;
			for (var x2 = 0; x2 < x; x2++) {
				if (map[x2][y].trail) trailXCount++;
			}

			if (shouldFillNewArea && !map[x][y].ownArea && trailYCount % 2 == 1 && trailXCount % 2 == 1) {
				map[x][y].ownArea = true;
			}
			if (map[x][y].ownArea) {
				ctx.fillStyle = 'rgba(0, 200, 0, 1)';
				ctx.fillRect(x*tileWidth,y*tileHeigth,tileWidth,tileHeigth);
			}

			if (map[x][y].trail) trailYCount++;
		}
	}

	
	map[posX][posY].trail = true;
	while(trail.length>tail) {
		var removed = trail.shift();
		map[removed.x][removed.y].trail = false;
		if (shouldFillNewArea) map[removed.x][removed.y].ownArea = true;
	}

	ctx.fillStyle = 'rgba(0, 255, 0, 1)';
	ctx.fillRect(posX*tileWidth,posY*tileHeigth,tileWidth,tileHeigth);
	for(var i=0;i<trail.length;i++) {
		ctx.fillStyle = 'rgba(0, 255, 0, 0.4)';
		ctx.fillRect(trail[i].x*tileWidth,trail[i].y*tileHeigth,tileWidth,tileHeigth);
	}
}

function keyDown(evt) {
	switch(evt.keyCode) {
		case 37:
			xMove=-1;yMove=0;
			break;
		case 38:
			xMove=0;yMove=-1;
			break;
		case 39:
			xMove=1;yMove=0;
			break;
		case 40:
			xMove=0;yMove=1;
			break;
	}
}