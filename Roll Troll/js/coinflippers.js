class CoinflipperManager {
    constructor(coinflippersID, headerID, informationID, containerID) {
        this._coinflippersElement = document.getElementById(coinflippersID);
        this._headerElement = document.getElementById(headerID);
        this._informationElement = document.getElementById(informationID);
        this._containerElement = document.getElementById(containerID);
        this._numberOfCoinflippers = 0;
        this._coinFlipperCost = 100;
        this._coinFlipperCostMult = 1.1;
        this._totalHeadsFlipped = 0;
        this._totalTailsFlipped = 0;
        this._totalSidesFlipped = 0;
        this._SideChance = 0.001
        this._currentFlipTime = -1;
        this._flipTime = 1000;
        this._currentHeads = 0;
        this._currentTails = 0;
        this._currentSides = 0;
        this._sidePointMultiplier = 10000;

        this.Hide();
        this.UpdateInformation();
    }

    get CoinflipperCost() {
        return this._coinFlipperCost;
    }

    Hide() {
        this._containerElement.classList.add("hidden");
    }

    Reveal() {
        this._containerElement.classList.remove("hidden");
    }

    UpdateInformation() {
        let html = "<strong>Coinflippers owned: </strong>" + this._numberOfCoinflippers + "<br/>";
        html += "<strong>Flip time: </strong>" + this._flipTime / 1000 + " seconds<br/>";
        html += "<strong>Side chance: </strong>" + this._SideChance * 100 + "%<br/>";
        html += "<strong>Side point multiplier: </strong>" + this._sidePointMultiplier + "x<br/>";
        html += "<strong>Total Heads flipped: </strong>" + this._totalHeadsFlipped + "<br/>";
        html += "<strong>Total Tails flipped: </strong>" + this._totalTailsFlipped + "<br/>";
        html += "<strong>Total Sides flipped: </strong>" + this._totalSidesFlipped;
        this._informationElement.innerHTML = html;
    }

    UpdateFlips() {
        this._currentHeads = 0;
        this._currentTails = 0;
        this._currentSides = 0;
        for (let i = 0; i < this._numberOfCoinflippers; i++) {
            const r = Math.random();
            if (r <= 0.5 - (this._SideChance / 2)) {
                this._currentHeads++;
            }
            else if (r <= 1 - this._SideChance) {
                this._currentTails++;
            }
            else {
                this._currentSides++;
            }
        }
        this._totalHeadsFlipped += this._currentHeads;
        this._totalTailsFlipped += this._currentTails;
        this._totalSidesFlipped += this._currentSides;
        let html = "Heads: " + this._currentHeads + "</br>";
        html += "Tails: " + this._currentTails + "</br>";
        html += "Sides: " + this._currentSides;
        this._coinflippersElement.innerHTML = html;
        this.UpdateInformation();
        points.Add(this._currentHeads + this._currentTails + (this._currentSides * this._sidePointMultiplier));
    }

    get CanPurchase() {
        return points.Get >= this._coinFlipperCost;
    }

    Purchase() {
        points.Subtract(this._coinFlipperCost);
        this._numberOfCoinflippers++;
        this._coinFlipperCost *= this._coinFlipperCostMult;
        this._coinFlipperCost = Math.floor(this._coinFlipperCost);
        this.UpdateInformation();
    }

    Update() {
        if (this._numberOfCoinflippers > 0) {
            if (this._currentFlipTime >= 0) {
                this._currentFlipTime -= tickSpeed;
            }
            else if (this._currentFlipTime < 0) {
                this._currentFlipTime = this._flipTime;
                this.UpdateFlips();
            }
        }
    }

    AddFlipTimeMultiplier(multiplier){
        this._flipTime *= multiplier;
        this.UpdateInformation();
    }

    AddSideChanceMultiplier(multiplier){
        this._SideChance *= multiplier;
        this.UpdateInformation();
    }

    AddSidePointMultiplier(multiplier){
        this._sidePointMultiplier *= multiplier;
        this.UpdateInformation();
    }
}