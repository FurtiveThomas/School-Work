class Upgrade {
    constructor(price, name, type, magnitude, prerequisite) {
        this._name = name;
        this._price = price;
        this._purchased = false;
        this._type = type;
        this._magnitude = magnitude;
        this._prerequisite = prerequisite;
    }

    get HasPrerequisite() {
        return this._prerequisite !== undefined;
    }

    get Prerequisite() {
        return upgradeManager.Upgrades[this._prerequisite];
    }

    get Name() {
        return this._name;
    }

    get CanPurchase() {
        return points.Get >= this._price;
    }

    get Price() {
        return this._price;
    }

    get Type() {
        return this._type;
    }

    get Magnitude() {
        return this._magnitude;
    }

    Purchase() {
        this._purchased = true;
        points.Subtract(this._price);
        switch (this._type) {
            case "AddDice":
                diceManager.Add(this._magnitude);
                break;
            case "BiggerDice":
                diceManager.IncreaseDiceSize(this._magnitude);
                break;
            case "FasterRoll":
                diceManager.ChangeRollTime(this._magnitude);
                break;
            case "DicePointBonus":
                diceManager.AddDicePointBonus(this._magnitude);
                break;
            case "DiceMultiplier":
                diceManager.AddDiceMultiplier(this._magnitude);
                break;
            case "UnlockCoinflippers":
                coinflipperManager.Reveal();
                break;
            case "FasterFlips":
                coinflipperManager.AddFlipTimeMultiplier(this._magnitude);
                break;
            case "SideChance":
                coinflipperManager.AddSideChanceMultiplier(this._magnitude);
                break;
            case "SidePointMultiplier":
                coinflipperManager.AddSidePointMultiplier(this._magnitude);
                break;
            default:
        }
        upgradeManager.CheckPrerequisites();
    }

    get Purchased() {
        return this._purchased;
    }
}

class UpgradeManager {
    constructor(id) {
        this._element = document.getElementById(id);
        this._upgrades = {};
        this._buttons = [];
    }

    Add(key, upgrade) {
        this._upgrades[key] = upgrade;
    }

    get Upgrades() {
        return this._upgrades;
    }

    get PurchasedUpgrades() {
        let purchased = [];
        const keys = Object.keys(this._upgrades);
        for (let i = 0; i < keys.length; i++) {
            const u = this._upgrades[keys[i]];
            if (u.Purchased) {
                purchased.push(u);
            }
        }
        return purchased;
    }

    get UnpurchasedUpgrades() {
        let unpurchased = [];
        const keys = Object.keys(this._upgrades);
        for (let i = 0; i < keys.length; i++) {
            const u = this._upgrades[keys[i]];
            if (!u.Purchased) {
                unpurchased.push(u);
            }
        }
        return unpurchased;
    }

    CreateElements() {
        //Create the HTML buttons
        let html = "";
        const keys = Object.keys(this._upgrades);
        for (let i = 0; i < keys.length; i++) {
            html += `<button id="UpgradeButton` + i + `"/>`
        }
        this._element.innerHTML = html;

        //Create the button instances
        for (let i = 0; i < keys.length; i++) {
            this._buttons.push(new UpgradeButton("UpgradeButton" + i, this._upgrades[keys[i]]));
        }
    }

    CheckPrerequisites() {
        for (let i = 0; i < this._buttons.length; i++) {
            this._buttons[i].CheckPrerequisites();
        }
    }

    Update() {
        for (let i = 0; i < this._buttons.length; i++) {
            this._buttons[i].Update();
        }
    }
}

class UpgradeButton {
    constructor(id, upgrade) {
        this._element = document.getElementById(id);
        this._upgrade = upgrade;
        this._enabled = false;
        this._element.innerHTML = this._upgrade.Name + "<br/> Price: " + this._upgrade.Price;
        this._click = this.Click.bind(this);
        this.Disable();
        this.Hide();
    }

    Hide() {
        this._element.classList.add("hidden");
    }

    Reveal() {
        this._element.classList.remove("hidden");
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
        this._upgrade.Purchase();
        this.Hide();
    }

    CheckPrerequisites() {
        if (!this._upgrade.Purchased) {
            if (this._upgrade.HasPrerequisite) {
                if (this._upgrade.Prerequisite.Purchased) {
                    this.Reveal();
                }
            }
            else {
                this.Reveal();
            }
        }
    }

    Update() {
        if (!this._upgrade.Purchased) {
            if (this._enabled) {
                if (!this._upgrade.CanPurchase) {
                    this.Disable();
                }
            }
            else {
                if (this._upgrade.CanPurchase) {
                    this.Enable();
                }
            }
        }
    }
}
