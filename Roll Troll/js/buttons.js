class RollDiceButton {
    constructor(id) {
        this._element = document.getElementById(id);
        this._element.innerText = "Roll Dice";
        this._enabled = true;
        this._click = this.Click.bind(this);
        this.Enable();
    }

    Enable() {
        this._element.classList.add("button-green");
        this._element.classList.remove("button-disabled");
        this._element.addEventListener("click", this._click);
        this._enabled = true;
    }

    Disable() {
        this._element.classList.add("button-disabled");
        this._element.classList.remove("button-green");
        this._element.removeEventListener("click", this._click);
        this._enabled = false;
    }

    Click() {
        if (!diceManager.IsRolling) {
            this.Disable();
            diceManager.Roll();
        }
    }

    Update() {
        if (!this._enabled && !diceManager.IsRolling) {
            this.Enable();
        }
    }
}

class BuyCoinflipperButton {
    constructor(id) {
        this._element = document.getElementById(id);
        this._enabled = false;
        this._click = this.Click.bind(this);
        this.SetText();
        this.Disable();
    }

    Enable() {
        this._element.classList.add("button-green");
        this._element.classList.remove("button-disabled");
        this._element.addEventListener("click", this._click);
        this._enabled = true;
    }

    Disable() {
        this._element.classList.add("button-disabled");
        this._element.classList.remove("button-green");
        this._element.removeEventListener("click", this._click);
        this._enabled = false;
    }

    SetText() {
        this._element.innerHTML = "Buy coinflipper<br/>Price: " + coinflipperManager.CoinflipperCost;
    }

    Click() {
        coinflipperManager.Purchase();
        this.SetText();
        this.Update();
    }

    Update() {
        if (coinflipperManager.CanPurchase) {
            this.Enable();
        }
        else {
            this.Disable();
        }
    }
}