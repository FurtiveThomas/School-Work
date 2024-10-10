window.addEventListener('DOMContentLoaded', (e) => {

//specifies playing card standards
let suitOptions = ['C', 'D', 'S', 'H'];
let valueOptions = ['A', '2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K'];

//defines relevant card properties
class Card{
    constructor(value, suit){
        this.value = value;
        this.suit = suit;
        this.color = (()=>{
            if (suit === "D" || suit === 'H') return 'red'
            else return 'black'
        })()

        this.id = `${value}${suit}`;
        this.faceup = false;
        // this.accepts = []
    }
    };


//initializes a deck of cards with complete value range
 const createDeck = () => {
        let allCards = []
        suitOptions.forEach(suit => {
            valueOptions.forEach(value => {
                let newCard = new Card(value, suit)
                allCards.push(newCard)
            })
        })
        return allCards
};



//accepts a deck and pulls one card out at random and assigns to a new deck
let shuffleDeck = (startDeck) => {
    let resultDeck = []
    while (startDeck.length > 0) {
        let randomIndex = Math.floor(Math.random() * startDeck.length)
        resultDeck.push(startDeck.splice(randomIndex, 1))
    }
    return resultDeck
};


//defines behavior for clicking on the bottom-most facedown card on piles
const flipUpInPlace = card => {
    if (card.children.length === 0 || card.children[0].dataset.faceup === true) {
        card.dataset.faceup = true
        card.style.backgroundImage = `url(./assets/card-fronts/${card.id}.svg)`
        card.draggable = true
    }
}


//creates a new div based on the last element in the shuffled deck, and appends it to a specified pile's linked-list

const dealCard = (deck, pileID, facing = 'down', flipInPlace = false) => {
    //create a new div
    let cardElement = document.createElement('div');
    cardElement.draggable = false


    //get the top card in the shuffled array
    let cardObject = deck.pop()[0];
    cardElement.id = cardObject.id;

    //assign the appropriate background image and html attributes
    if (facing === 'up') {
        //set upturned card behavior
        cardElement.style.backgroundImage = `url(./assets/card-fronts/${cardObject.id}.svg)`
        cardObject.faceup = true
        cardElement.draggable = true
    } else {
        //set downturned card behavior
        cardElement.faceup = false
        cardElement.style.backgroundImage = `url(./assets/lite-card-back.svg)`
        cardElement.draggable = false

        //allows for card to be turned over when all covering cards have been removed
        if (flipInPlace) {
            cardElement.addEventListener('click', (e) => {
                e.stopPropagation()
                flipUpInPlace(cardElement)

            })
        }
    };

    // assign all card data attributes based on object key/value pairs
    for (let property in cardObject) {
        cardElement.dataset[property] = cardObject[property]
    }


    //adds necessary classes for styling and drag drop functionality
    cardElement.classList.add('card','cardslot');



    //appends the thing
    let pileToAdd = document.getElementById(pileID)
    pileToAdd.appendChild(cardElement);
    return cardElement.id

}


//defines behavior to flip over a card from the downpile to the uppile

document.getElementById('downpile').addEventListener('click', (e) => {
    let topCard = e.target;

    while (topCard.innerHTML) {
        newTop = topCard
        topCard = topCard.innerHTML
    }

    if (document.getElementById('downpile') === topCard) return;

    let uppile = document.querySelector('#uppile')

    while (uppile.children[0]) {
        uppile = uppile.children[0]
    }

    topCard.draggable = true
    topCard.dataset.faceup = true
    topCard.style.backgroundImage = `url(./assets/card-fronts/${topCard.id}.svg)`
    uppile.appendChild(topCard);

})


//lays out all cards from the shuffled deck array of objects into nested div elements in the document
const dealNewGame = () =>{
        //add basecards to each pile
        let shuffledDeck = shuffleDeck(createDeck())

        document.querySelectorAll('.pile').forEach(pile => {
            let dealCount = parseInt(pile.id[pile.id.length - 1])
            let startingPile = pile.id
            for (let i = 0; i < dealCount-1; i++) {
                startingPile = dealCard(shuffledDeck, startingPile, 'down', true)
            }
            dealCard(shuffledDeck, startingPile, 'up')
        })

        let startingPile = 'downpile'
        while (shuffledDeck.length > 0) {
            startingPile = dealCard(shuffledDeck, startingPile, 'down');
    }
}



//once all cards in the 'hand' have been clicked through and are ready for a reset, the div 'linked-list' must be reversed
//to preserve card order

const resetCardStack = () => {
    //check to see if there are no more children (i.e. you've reached the new top)
    let newList = '';
    let parentNode = document.getElementById('uppile').children[0]
    //while you haven't reached the new top
    while (parentNode) {
        parentNode.dataset.faceup = false;
        parentNode.style.backgroundImage = `url(./assets/lite-card-back.svg)`
        //prepare the next level
        nextCard = parentNode.children[0];
        //take the current level and nest the reversed stack
        parentNode.innerHTML = '';
        if (newList) {
            parentNode.appendChild(newList)
        }
        //redefine the reversed stack
        newList = parentNode;
        //redefine the parent node
        parentNode = nextCard;

    }
    return newList;
}


document.getElementById('uppile').addEventListener('click', () => {
    if (document.getElementById('downpile').children.length === 0) {
        let freshDeck = resetCardStack()
        document.getElementById('downpile').innerHTML = '';
        document.getElementById('downpile').appendChild(freshDeck);
    }

})

//initializes the deal
dealNewGame();

//sets the newgame button to reload the page
document.getElementById('newgame').addEventListener('click', e => location.reload());
})
