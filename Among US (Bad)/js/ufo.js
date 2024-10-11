class UFO {
    constructor(game, amongus, x, y) {
        this.game = game;
        this.amongus = amongus;
        this.x = x;
        this.y = y;
        this.ufo = new Image();
        this.init();
    }

    init() {
        var rd = Math.floor((Math.random() * 1000000)) % 13;
        this.ufo.src="images/Pet/pet" + rd + ".png";
        this.loop();
    }

    loop() {
        this.update();
        // this.draw();
        setTimeout(() => this.loop(), 30);
    }

    update() {
        if (Math.abs(this.amongus.xA - this.x) > 7) {
            if (this.x > this.amongus.xA)
                this.x -= Math.abs(this.amongus.xA - this.x) / 15;
            else
                this.x += Math.abs(this.amongus.xA - this.x) / 15;
        }

        if (Math.abs(this.y - (this.amongus.yA - SizeSquar * 2)) > 7) {
            if (this.y > this.amongus.yA - SizeSquar * 2)
                this.y -= Math.abs(this.y - (this.amongus.yA - SizeSquar * 2)) / 15;
            else 
                this.y += Math.abs(this.y - (this.amongus.yA - SizeSquar * 2)) / 15;
        }
    }

    draw() {
        this.game.context.drawImage(this.ufo, this.x - SizeSquar * 0.75, this.y - SizeSquar * 0.75, SizeSquar * 1.5, SizeSquar * 1.5);
    }
}