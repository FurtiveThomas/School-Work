const KILLCOOLDOWN = 11;
const SPEEDCOOLDOWN = 15;
const FREEZECOOLDOWN = 20;

let game_W = 20;
let game_H = 20;
let count = 0;
let count2 = 0;
let xIM2 = 0, yIM2 = 0;
let xCh = 0, yCh = 0;
var im = new Image();
im.src="images/moveButton.png";
var im2 = new Image();
im2.src="images/moveButton2.png";
var bg = new Image();
bg.src="images/background.png";
kill = [];
kill[0] = new Image();
kill[0].src="images/kill/kill0.png";
kill[1] = new Image();
kill[1].src="images/kill/kill1.png";

speed = [];
speed[0] = new Image();
speed[0].src="images/speed/speed0.png";
speed[1] = new Image();
speed[1].src="images/speed/speed1.png";

freeze_im = [];
freeze_im[0] = new Image();
freeze_im[0].src="images/VC/vc2.png";
freeze_im[1] = new Image();
freeze_im[1].src="images/VC/vc3.png";

SizeSquar = 0;

let killcooldown = 0;
let speedcooldown = 0;
let freezeCollDown = 0;
let xSP = 1;


AM = [];
N = 3;
N2 = 1;
var v = [];
let iden = -111;
let idenKill = -222;
let idenSpeed = -333;
let idenFreeze = -444;

class game {
    constructor() {
        this.canvas = null;
        this.context = null;
        this.init();
    }

    init() {
        this.canvas = document.createElement("canvas");
        this.context = this.canvas.getContext("2d");
        document.body.appendChild(this.canvas);

        this.render();

        this.amu = new amongus(this, "HaiZuka");
        this.amu.Vc = true;
        this.amu.rm = false;
        this.amu.Auto = false;
        for (let i = 0; i < N; i++) {
            AM[i] = new amongus(this, "Player " + (i + 1));
        }

        xIM2 = SizeSquar * 2.5;
        yIM2 = game_H - SizeSquar * 4.5;


        this.loop();

        this.listenMouse();
        this.listenTouch();
        this.listenKeyboard();
    }

    listenTouch() {
        document.addEventListener("touchmove", evt => {
            for (let i = 0; i < evt.touches.length; i++)
                if (evt.touches[i].identifier == iden) {
                    var x = evt.touches[i].pageX;
                    var y = evt.touches[i].pageY;

                    var Xc = SizeSquar * 3.5;
                    var Yc = game_H - SizeSquar * 3.5;

                    if ((Xc - x) * (Xc - x) + (Yc - y) * (Yc - y) > 4 * SizeSquar * SizeSquar) {
                        var XX = x - Xc;
                        var YY = y - Yc;
                        var HH = Math.sqrt(XX * XX + YY * YY);
                        var R = 2 * SizeSquar;
                        x = (R * XX) / HH + Xc;
                        y = (R * YY) / HH + Yc;
                    }
                    if (x < Xc)
                        this.amu.direction = 2;
                    else 
                        this.amu.direction = 1;

                    xCh = (x - Xc) / 7;
                    yCh = (y - Yc) / 7;

                    if (this.amu.rm == true) {
                        xIM2 = x - SizeSquar;
                        yIM2 = y - SizeSquar;
                        this.draw();
                    }
                }
            
        })

        document.addEventListener("touchstart", evt => {
            var x = evt.touches[evt.touches.length - 1].pageX;
            var y = evt.touches[evt.touches.length - 1].pageY;
            var Xc = SizeSquar * 3.5;
            var Yc = game_H - SizeSquar * 3.5;

            if ((Xc - x) * (Xc - x) + (Yc - y) * (Yc - y) <= 9 * SizeSquar * SizeSquar) {
                if (!this.amu.rm) {
                    this.amu.rm = true;
                    iden = evt.touches[evt.touches.length - 1].identifier;
                    xIM2 = x - SizeSquar;
                    yIM2 = y - SizeSquar;
                    this.draw();
                }
            }
            var Xk = game_W - SizeSquar * 2.5;
            var Yk = game_H - SizeSquar * 2.5;
            if ((Xk - x) * (Xk - x) + (Yk - y) * (Yk - y) <= 6 * SizeSquar * SizeSquar) {
                console.log("Kill");
                idenKill = evt.touches[evt.touches.length - 1].identifier;
            }

            var Xp = game_W - SizeSquar * 2.5;
            var Yp = game_H - SizeSquar * 7;
            if ((Xp - x) * (Xp - x) + (Yp - y) * (Yp - y) <= 6 * SizeSquar * SizeSquar) {
                console.log("speed");
                idenSpeed = evt.touches[evt.touches.length - 1].identifier;
            }

            var Xf = game_W - SizeSquar * 2.5;
            var Yf = game_H - SizeSquar * 11.5;
            if ((Xf - x) * (Xf - x) + (Yf - y) * (Yf - y) <= 6 * SizeSquar * SizeSquar) {
                console.log("freeze");
                idenFreeze = evt.touches[evt.touches.length - 1].identifier;
            }
        })

        document.addEventListener("touchend", evt => {
            let check = true;
            for (let i = 0; i < evt.touches.length; i++)
                if (evt.touches[i].identifier == iden)
                    check = false;
            if (check) {
                this.amu.rm = false;
                iden = -111;
                xIM2 = SizeSquar * 2.5;
                yIM2 = game_H - SizeSquar * 4.5;
            }

            check = true;
            if (idenKill == -222 || killcooldown > 0)
                check = false;
            for (let i = 0; i < evt.touches.length; i++)
                if (evt.touches[i].identifier == idenKill)
                    check = false;
            if (check) {
                console.log(idenKill);
                var k = this.checkKill();
                if (k != -1) {
                    if (this.amu.xA < AM[k].xA)
                        this.amu.direction = 1;
                    else
                        this.amu.direction = 2;
                    this.amu.xA = AM[k].xA;
                    this.amu.yA = AM[k].yA;
                    AM[k].alive = false;
                    killcooldown = KILLCOOLDOWN - N2 / 5;
                }
                idenKill = -222;
            }

            check = true;
            if (idenSpeed == -333 || speedcooldown > 0)
                check = false;
            for (let i = 0; i < evt.touches.length; i++)
                if (evt.touches[i].identifier == idenSpeed)
                    check = false;
            if (check) {
                console.log("SPEED");
                xSP = 2;
                speedcooldown = SPEEDCOOLDOWN;
                idenSpeed = -333;
            }

            check = true;
            if (idenFreeze == -444 || freezeCollDown > 0)
                check = false;
            for (let i = 0; i < evt.touches.length; i++)
                if (evt.touches[i].identifier == idenFreeze)
                    check = false;
            if (check) {
                console.log("FREEZE");
                for (let i = 0; i < N; i++) {
                    AM[i].Auto = false;
                    AM[i].rm = false;
                    AM[i].freeze = true;
                }
                idenFreeze = -444;
                freezeCollDown = FREEZECOOLDOWN;
            }
                
            this.draw();
        })
    }

    listenMouse() {
        document.addEventListener("mousedown", evt => {
            var x = evt.x;
            var y = evt.y;
            var Xk = game_W - SizeSquar * 2.5;
            var Yk = game_H - SizeSquar * 2.5;
            if ((Xk - x) * (Xk - x) + (Yk - y) * (Yk - y) <= 6 * SizeSquar * SizeSquar) {
                console.log("Kill");
                var k = this.checkKill();
                if (k != -1 && killcooldown <= 0) {
                    if (this.amu.xA < AM[k].xA)
                        this.amu.direction = 1;
                    else
                        this.amu.direction = 2;
                    this.amu.xA = AM[k].xA;
                    this.amu.yA = AM[k].yA;
                    AM[k].alive = false;
                    killcooldown = KILLCOOLDOWN - N2 / 5;
                }
            }

            var Xp = game_W - SizeSquar * 2.5;
            var Yp = game_H - SizeSquar * 7;
            if ((Xp - x) * (Xp - x) + (Yp - y) * (Yp - y) <= 6 * SizeSquar * SizeSquar && speedcooldown <= 0) {
                xSP = 2;
                speedcooldown = SPEEDCOOLDOWN;
            }

            var Xf = game_W - SizeSquar * 2.5;
            var Yf = game_H - SizeSquar * 11.5;
            if ((Xf - x) * (Xf - x) + (Yf - y) * (Yf - y) <= 6 * SizeSquar * SizeSquar && freezeCollDown <= 0) {
                console.log("FREEZE");
                for (let i = 0; i < N; i++) {
                    AM[i].Auto = false;
                    AM[i].rm = false;
                    AM[i].freeze = true;
                }
                idenFreeze = -444;
                freezeCollDown = FREEZECOOLDOWN;
            }
        }) 
    }

    listenKeyboard() {
        document.addEventListener("keydown", key => {
            this.amu.rm2 = true;
            switch(key.keyCode) {
                case 65:
                case 37:
                    xCh = -SizeSquar / 5;
                    this.amu.direction = 2;
                    break;
                case 38:
                case 87:
                    yCh = -SizeSquar / 5;
                    break;
                case 39:
                case 68:
                    xCh = SizeSquar / 5;
                    this.amu.direction = 1;
                    break;
                case 40:
                case 83:
                    yCh = SizeSquar / 5;
                    break;
                default:
                    this.amu.rm2 = false;
            }
        })

        document.addEventListener("keyup", key => {
            switch(key.keyCode) {
                case 65:
                case 37:
                    xCh = 0;
                    this.amu.direction = 2;
                    break;
                case 38:
                case 87:
                    yCh = 0;
                    break;
                case 39:
                case 68:
                    xCh = 0;
                    this.amu.direction = 1;
                    break;
                case 40:
                case 83:
                    yCh = 0;
                    break;
            }
            if (xCh == 0 && yCh == 0)
                this.amu.rm2 = false;
        })
    }

    loop() {
        this.update();
        this.draw();
        setTimeout(() => this.loop(), 20);
    }

    update() {
        this.render();
        count++;
        if (count % 4 == 0)
            count2++;
        if (this.amu.rm || this.amu.rm2) {
            this.amu.xA += xCh * xSP;
            this.amu.yA += yCh * xSP;
        }
        if (count % 35 == 0) {
            if (killcooldown > 0)
                killcooldown--;
            if (speedcooldown > 0)
                speedcooldown--;
            if (freezeCollDown > 0)
                freezeCollDown--;
        }
        if (speedcooldown <= (SPEEDCOOLDOWN) / 2) {
            xSP = 1;
        }

        if (freezeCollDown <= 2 * (FREEZECOOLDOWN) / 2.5) {
            for (let i = 0; i < N; i++) {
                AM[i].Auto = true;
                AM[i].rm = true;
                AM[i].freeze = false;
            }
        }
    }

    render() {
        this.canvas.width = document.documentElement.clientWidth;
        this.canvas.height = document.documentElement.clientHeight;
        game_W = this.canvas.width;
        game_H = this.canvas.height;

        if (this.amu != null && this.amu.rm == false) {
            xIM2 = SizeSquar * 2.5;
            yIM2 = game_H - SizeSquar * 4.5;
        }
        SizeSquar = this.getWidth();
    }

    draw() {
        this.clearScreen();
        if (game_W < 1322 || this.amu.rm)
            this.drawEcircle();
        for (let i = 0; i < N; i++) {
            AM[i].draw();
        }
        this.drawKill();
        this.drawSpeed();
        this.drawFreeze();
        this.amu.draw();
    }

    drawKillcooldown() {
        this.context.fillStyle = "#CC0000";
        this.context.font = (Math.floor(SizeSquar * 2.5)) + 'px Calibri';
        killcooldown = Math.floor(killcooldown);
        if (killcooldown < 10) 
            killcooldown = "0" + killcooldown;
        this.context.fillText(killcooldown, game_W - SizeSquar * 3.8, game_H - SizeSquar * 1.8);
    }

    drawSpeedcooldown() {
        this.context.fillStyle = "#CC0000";
        this.context.font = (Math.floor(SizeSquar * 2.5)) + 'px Calibri';
        speedcooldown = Math.floor(speedcooldown);
        if (speedcooldown < 10) 
            speedcooldown = "0" + speedcooldown;
        this.context.fillText(speedcooldown, game_W - SizeSquar * 3.8, game_H - SizeSquar * 6.8);
    }

    drawFreezeCoolDown() {
        this.context.fillStyle = "#CC0000";
        this.context.font = (Math.floor(SizeSquar * 2.5)) + 'px Calibri';
        freezeCollDown = Math.floor(freezeCollDown);
        if (freezeCollDown < 10) 
            freezeCollDown = "0" + freezeCollDown;
        this.context.fillText(freezeCollDown, game_W - SizeSquar * 3.8, game_H - SizeSquar * 10.8);
    }

    checkKill() {
        var m = 1000000000;
        var index = -1;
        for (var i = 0; i < N; i++) {
            if (AM[i].alive && Math.sqrt(Math.abs(this.amu.xA - AM[i].xA) * Math.abs(this.amu.xA - AM[i].xA) + Math.abs(this.amu.yA - AM[i].yA) * Math.abs(this.amu.yA - AM[i].yA)) <= m) {
                m = Math.sqrt(Math.abs(this.amu.xA - AM[i].xA) * Math.abs(this.amu.xA - AM[i].xA) + Math.abs(this.amu.yA - AM[i].yA) * Math.abs(this.amu.yA - AM[i].yA));
                index = i;
            }
        }
        if (m < 7 * SizeSquar)
            return index;       
        return -1;
    }

    drawKill() {
        let k = this.checkKill();
        if (k == -1 || killcooldown > 0)
            this.context.drawImage(kill[0], game_W - SizeSquar * 4.5, game_H - SizeSquar * 4.5, SizeSquar * 4, SizeSquar * 4);
        else
            this.context.drawImage(kill[1], game_W - SizeSquar * 4.5, game_H - SizeSquar * 4.5, SizeSquar * 4, SizeSquar * 4);
        if (killcooldown > 0)
            this.drawKillcooldown();
    }

    drawSpeed() {
        if (speedcooldown > 0)
            this.context.drawImage(speed[0], game_W - SizeSquar * 4.5, game_H - SizeSquar * 9, SizeSquar * 4, SizeSquar * 4);
        else 
            this.context.drawImage(speed[1], game_W - SizeSquar * 4.5, game_H - SizeSquar * 9, SizeSquar * 4, SizeSquar * 4);
        if (speedcooldown > 0)
            this.drawSpeedcooldown();
    }

    drawFreeze() {
        if (freezeCollDown > 0)
            this.context.drawImage(freeze_im[0], game_W - SizeSquar * 4.5, game_H - SizeSquar * 13.5, SizeSquar * 4, SizeSquar * 4);
        else
            this.context.drawImage(freeze_im[1], game_W - SizeSquar * 4.5, game_H - SizeSquar * 13.5, SizeSquar * 4, SizeSquar * 4);
        if (freezeCollDown > 0)
            this.drawFreezeCoolDown();
    }


    drawEcircle() {
        this.context.drawImage(im, SizeSquar * 0.5, game_H - SizeSquar * 6.5, SizeSquar * 6, SizeSquar * 6);
        this.context.drawImage(im2, xIM2, yIM2, SizeSquar * 2, SizeSquar * 2);
    }

    clearScreen() {
        this.context.clearRect(0, 0, game_W, game_H);
        if (bg.width / game_W < bg.height / game_H)
            this.context.drawImage(bg, 0, (bg.height - game_H * (bg.width / game_W)) / 2, bg.width, game_H * (bg.width / game_W), 0, 0, game_W, game_H);
        else
        this.context.drawImage(bg, (bg.width - game_W * (bg.height / game_H)) / 2, 0, game_W * (bg.height / game_H), bg.height, 0, 0, game_W, game_H);
    }

    getWidth() {
        var area = document.documentElement.clientWidth * document.documentElement.clientHeight;
        return Math.sqrt(area / 400);
    }
}

var g = new game();
