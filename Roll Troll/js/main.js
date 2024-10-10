function Load() {
    updateInterval = setInterval(Update, tickSpeed);
    points = new Points("Points", "PointsFade");
    diceManager = new DiceManager("DiceBox", "DiceInformation");
    coinflipperManager = new CoinflipperManager("Coinflippers", "CoinflippersHeader", "CoinflippersInformation", "CoinflipperContainer");

    //Buttons
    rollDiceButton = new RollDiceButton("RollDiceButton");
    buyCoinflipperButton = new BuyCoinflipperButton("BuyCoinflipperButton");

    //Upgrades
    upgradeManager = new UpgradeManager("Upgrades");
    upgradeManager.Add("DicePointBonus1", new Upgrade(50, "Get 1 more point from each dice", "DicePointBonus", 1));
    upgradeManager.Add("DicePointBonus2", new Upgrade(100, "Get 2 more points from each dice", "DicePointBonus", 2, "DicePointBonus1"));
    upgradeManager.Add("DicePointBonus3", new Upgrade(150, "Get 3 more points from each dice", "DicePointBonus", 3, "DicePointBonus2"));
    upgradeManager.Add("DicePointBonus4", new Upgrade(300, "Get 4 more points from each dice", "DicePointBonus", 4, "DicePointBonus3"));
    upgradeManager.Add("AddDice1", new Upgrade(100, "Add 1 more dice", "AddDice", 1));
    upgradeManager.Add("AddDice2", new Upgrade(200, "Add 1 more dice", "AddDice", 1, "AddDice1"));
    upgradeManager.Add("AddDice3", new Upgrade(400, "Add 1 more dice", "AddDice", 1, "AddDice2"));
    upgradeManager.Add("AddDice4", new Upgrade(1000, "Add 1 more dice", "AddDice", 1, "AddDice3"));
    upgradeManager.Add("BiggerDice1", new Upgrade(15, "Use bigger dice", "BiggerDice", 1));
    upgradeManager.Add("BiggerDice2", new Upgrade(30, "Use bigger dice", "BiggerDice", 1, "BiggerDice1"));
    upgradeManager.Add("BiggerDice3", new Upgrade(60, "Use bigger dice", "BiggerDice", 1, "BiggerDice2"));
    upgradeManager.Add("BiggerDice4", new Upgrade(60, "Use bigger dice", "BiggerDice", 1, "BiggerDice3"));
    upgradeManager.Add("FasterRoll1", new Upgrade(50, "Roll 20% faster", "FasterRoll", 0.8));
    upgradeManager.Add("FasterRoll2", new Upgrade(100, "Roll 20% faster", "FasterRoll", 0.8, "FasterRoll1"));
    upgradeManager.Add("FasterRoll3", new Upgrade(200, "Roll 20% faster", "FasterRoll", 0.8, "FasterRoll2"));
    upgradeManager.Add("DiceMultiplier1", new Upgrade(250, "Multiply all dice points by first dice", "DiceMultiplier", 0));
    upgradeManager.Add("DiceMultiplier2", new Upgrade(10000, "Multiply all dice points by second dice", "DiceMultiplier", 1, "DiceMultiplier1"));
    upgradeManager.Add("UnlockCoinflippers", new Upgrade(1000, "Unlock coinflippers", "UnlockCoinflippers"));
    upgradeManager.Add("FasterFlips1", new Upgrade(1000, "Flip coins 20% faster", "FasterFlips", 0.8, "UnlockCoinflippers"));
    upgradeManager.Add("FasterFlips2", new Upgrade(10000, "Flip coins 20% faster", "FasterFlips", 0.8, "FasterFlips1"));
    upgradeManager.Add("FasterFlips3", new Upgrade(100000, "Flip coins 20% faster", "FasterFlips", 0.8, "FasterFlips2"));
    upgradeManager.Add("SideChance1", new Upgrade(1000, "Double chance of coin landing on it's side", "SideChance", 2, "UnlockCoinflippers"));
    upgradeManager.Add("SideChance2", new Upgrade(10000, "Double chance of coin landing on it's side", "SideChance", 2, "SideChance1"));
    upgradeManager.Add("SideChance3", new Upgrade(100000, "Double chance of coin landing on it's side", "SideChance", 2, "SideChance2"));
    upgradeManager.Add("SidePointMultiplier1", new Upgrade(1000, "Gain 2x more points when a coin lands on it's side", "SidePointMultiplier", 2, "UnlockCoinflippers"));
    upgradeManager.Add("SidePointMultiplier2", new Upgrade(10000, "Gain 2x more points when a coin lands on it's side", "SidePointMultiplier", 2, "SidePointMultiplier1"));
    upgradeManager.Add("SidePointMultiplier3", new Upgrade(100000, "Gain 2x more points when a coin lands on it's side", "SidePointMultiplier", 2, "SidePointMultiplier2"));
    upgradeManager.CreateElements();
    upgradeManager.CheckPrerequisites();
}

function RandomInt(lower, upper) {
    const difference = (upper + 1) - lower;
    const random = Math.random() * difference;
    return Math.ceil(random + lower) - 1;
}

function Update() {
    points.Update();
    diceManager.Update();
    upgradeManager.Update();
    coinflipperManager.Update();

    //Buttons
    rollDiceButton.Update();
    buyCoinflipperButton.Update();
}

//Globals
var updateInterval;
var tickSpeed = 50;

var points;
var diceManager;
var rollDiceButton;
var upgradeManager;
var coinflipperManager;

window.onload = Load;