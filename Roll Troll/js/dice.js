class DiceManager {
    constructor(boxID, informationID) {
        this._boxElement = document.getElementById(boxID);
        this._informationElement = document.getElementById(informationID);
        this._numberOfDice = 1;
        this._numbers = [];
        this._currentRollTime = 0;
        this._rollTime = 5000;
        this._diceLowerBound = 1;
        this._diceUpperBound = 6;
        this._dicePointBonus = 0;
        this._diceMultipliers = [];
        this.UpdateInformation();
    }

    get DiceMultipliers() {
        return this._diceMultipliers;
    }

    AddDiceMultiplier(number) {
        this._diceMultipliers.push(number);
    }

    AddDicePointBonus(number) {
        this._dicePointBonus += number;
        this.UpdateInformation();
    }

    get DicePointBonus() {
        return this._dicePointBonus;
    }

    ChangeRollTime(multiplier) {
        this._rollTime *= multiplier;
        this.UpdateInformation();
    }

    Roll() {
        this._currentRollTime = this._rollTime;
        this._boxElement.classList.add("text-red");
    }

    get IsRolling() {
        return this._currentRollTime > 0;
    }

    Add(number) {
        this._numberOfDice += number;
        this._boxElement.innerText += "  1";
        this.UpdateInformation();
    }

    Remove(number) {
        this._numberOfDice -= number;
    }

    IncreaseDiceSize(number) {
        this._diceUpperBound += number;
        this.UpdateInformation();
    }

    RandomizeDice() {
        this._numbers = [];
        for (let i = 0; i < this._numberOfDice; i++) {
            this._numbers.push(RandomInt(this._diceLowerBound, this._diceUpperBound));
        }
        let text = this._numbers[0];
        for (let i = 1; i < this._numberOfDice; i++) {
            text += "  " + this._numbers[i];
        }
        this._boxElement.innerText = text;
    }

    get DiceNumbers() {
        return this._numbers;
    }

    get DiceNumberTotal() {
        let total = 0;
        for (let i = 0; i < this._numberOfDice; i++) {
            total += this._numbers[i];
        }
        return total;
    }

    get NumberOfDice() {
        return this._numberOfDice;
    }

    UpdateInformation() {
        let html = "<strong>Dice owned: </strong>" + this._numberOfDice + "<br/>";
        html += "<strong>Dice size: </strong> D" + this._diceUpperBound + "<br/>";
        html += "<strong>Dice point bonus: </strong>" + this._dicePointBonus + "<br/>";
        html += "<strong>Dice roll time: </strong>" + this._rollTime / 1000 + " seconds";
        this._informationElement.innerHTML = html;
    }

    Update() {
        if (this._currentRollTime > 0) {
            this.RandomizeDice();
            this._currentRollTime -= tickSpeed;
            if (this._currentRollTime <= 0) {
                this._boxElement.classList.remove("text-red");
                this._currentRollTime = 0;
                let total = this.DiceNumberTotal;
                total += this._numberOfDice * this._dicePointBonus;
                let multiplier = 1;
                let mults = this._diceMultipliers;
                let dice = this._numbers;
                for (let i = 0; i < mults.length; i++) {
                    multiplier *= dice[mults[i]];
                }
                total *= multiplier;
                points.Add(total);
            }
        }
    }
}
