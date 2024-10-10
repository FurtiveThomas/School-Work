class Points {
    constructor(pointsID, fadeID) {
        this._points = 0;
        this._pointsElement = document.getElementById(pointsID);
        this._fadeElement = document.getElementById(fadeID);
        this._fadeTime = 0;
        this._fadeNumber;
    }

    Update() {
        if (this._fadeTime > 0) {
            if (this._fadeTime === 1000) {
                this._fadeElement.innerText = (this._fadeNumber > 0 ? "+" : "") + this._fadeNumber
            }
            this._fadeElement.style = "opacity:" + this._fadeTime / 1000;
            this._fadeTime -= tickSpeed;
            if (this._fadeTime <= 0) {
                this._fadeTime = 0;
                this._fadeElement.innerText = "";
                this._fadeElement.classList.remove("text-green");
                this._fadeElement.classList.remove("text-red");
            }
        }
    }

    Add(number){
        this.UpdateNumber(number);
    }

    Subtract(number) {
        this.UpdateNumber(-number);
    }

    UpdateNumber(number) {
        this._points += number;
        this._fadeNumber = number;
        this._fadeTime = 1000;
        this._pointsElement.innerText = this._points;
        this._fadeElement.classList.add(number > 0 ? "text-green" : "text-red");
    }

    get Get() {
        return this._points;
    }
}
