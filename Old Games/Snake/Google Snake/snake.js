
function init()
{

	canvas = document.getElementById('mycanvas');
	W = H = canvas.width = canvas.height = 800;
	pen = canvas.getContext('2d');
	cs=66;
	score=0;
	game_over=false;
	drawgame=1;
	food_img= new Image();	
	food_img.src="images/apple.png";
	trophy = new Image();
	trophy.src="images/trophy.png";
	food=getRandomFood();
	snake={
		init_len:5,
		color:"#337AFF",
		cells:[],
		direction:"right",
		createSnake:function()
		{
			for(var i=this.init_len;i>0;i--)
			{
				this.cells.push({x:i,y:0});
			}
		},
		drawSnake:function()
		{
			for(var i=0;i<this.cells.length;i++)
			{
				pen.fillStyle=this.color;
				pen.fillRect(this.cells[i].x*cs,this.cells[i].y*cs,cs-3,cs-3);
			}
		},
		updateSnake:function()
		{
			var headX=this.cells[0].x;
			var headY=this.cells[0].y;
			if(food.x==headX && food.y==headY)
			{
				food=getRandomFood();
				score++;
			}
			else
			{
				this.cells.pop();
			}			
			var nextX,nextY;
			if(this.direction=="right")
			{
				nextX=headX+1;
				nextY=headY;
			}
			else if(this.direction=="left")
			{
				nextX=headX-1;
				nextY=headY;
			}
			else if(this.direction=="down")
			{
				nextX=headX;
				nextY=headY+1;
			}
			else
			{
				nextX=headX;
				nextY=headY-1;
			}
			this.cells.unshift({x:nextX,y:nextY});
			var lastX=Math.round(W/cs);
			var lastY=Math.round(H/cs);
			if(this.cells[0].x < 0 || this.cells[0].y < 0 || this.cells[0].x > lastX || this.cells[0].y > lastY)
			{
					game_over=true;
			}
			
		}
	};
snake.createSnake();

function keyPressed(e)
{
	if(e.key=="ArrowLeft")
	{
		snake.direction="left";
	}
	else if(e.key=="ArrowRight")
	{
		snake.direction="right";
	}
	else if(e.key=="ArrowDown")
	{
		snake.direction="down";
	}
	else
	{
		snake.direction="up";
	}
}

document.addEventListener('keydown',keyPressed);
}
function draw()
{
	pen.clearRect(0,0,W,H);
	snake.drawSnake();
	pen.drawImage(food_img,food.x*cs,food.y*cs,cs,cs);
	pen.drawImage(trophy,18,20,cs,cs);
	pen.fillStyle = "blue";
	pen.font = "20px Consolas"
	pen.fillText(score,45,50);
}

function update()
{
	snake.updateSnake();
}
function getRandomFood()
{
	foodX=Math.round(Math.random()*((W-cs)/cs));
	foodY=Math.round(Math.random()*((H-cs)/cs));
	food={
		x:foodX,
		y:foodY,
	};
	return food;
}
init();
function gameloop()
{
	if(game_over==true)
	{
		clearInterval(f);
		var r=window.confirm("GAME OVER !!\n Play Again ?");
		if(r==true)
		{
			location.reload();
		}
		else
		{
			window.location.href="index.html";
		}
	}
	if(drawgame==1)
	{
		alert("USE KEYBOARD UP OR DOWN OR LEFT OR RIGHT TO PLAY\nPRESS ENTER TO START");
		drawgame++;
	}
	draw();
	update();
}

var f=setInterval(gameloop,150);

