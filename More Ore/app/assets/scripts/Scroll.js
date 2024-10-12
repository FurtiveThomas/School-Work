let Scroll = function( tier ) {

    let selectedScroll;
    if ( tier == 1 ) selectedScroll = select_random_from_arr( scrolls[ 0 ] )
    if ( tier == 2 ) selectedScroll = select_random_from_arr( scrolls[ select_random_from_arr( [ 0, 1 ] ) ] )

    this.name = selectedScroll.name
    this.desc = selectedScroll.desc
    this.amount = selectedScroll.amount
    this.chance = selectedScroll.chance
    this.stat = selectedScroll.stat
    this.item_type = 'scroll'

}

let scrolls = [
    [
        // TIER 1 SCROLLS
        {
            name: '100% Scroll of Sharpness',
            desc: 'When used, add 20% sharpness onto your pickaxe',
            amount: 20,
            chance: 1,
            stat: 'sharpness'
        },
        {
            name: '100% Scroll of Hardness',
            desc: 'When used, add 20% hardness onto your pickaxe',
            amount: 20,
            chance: 1,
            stat: 'hardness'
        },
    ],
    [
        // TIER 2 SCROLLS
        {
            name: '60% Scroll of Sharpness',
            desc: 'If successful, add 50% sharpness onto your pickaxe',
            amount: 50,
            chance: .6,
            stat: 'sharpness'
        },
        {
            name: '10% Scroll of Sharpness',
            desc: 'If successful, add 150% sharpness onto your pickaxe',
            amount: 150,
            chance: .1,
            stat: 'sharpness'
        },
        {
            name: '60% Scroll of Hardness',
            desc: 'If successful, add 50% hardness onto your pickaxe',
            amount: 50,
            chance: .6,
            stat: 'hardness'
        },
        {
            name: '10% Scroll of Hardness',
            desc: 'If successful, add 150% hardness onto your pickaxe',
            amount: 150,
            chance: .1,
            stat: 'hardness'
        },
    ],
    [
        // TIER 3 SCROLLS
        {
            name: '100% Scroll of Damage',
            desc: 'When used, add a 2% damage bonus onto your pickaxe',
            amount: .02,
            chance: 1,
            stat: 'damage'
        },
        {
            name: '60% Scroll of Damage',
            desc: 'If successful, add a 5% damage bonus onto your pickaxe',
            amount: .05,
            chance: .6,
            stat: 'damage'
        },
        {
            name: '10% Scroll of Damage',
            desc: 'If successful, add a 10% damage bonus onto your pickaxe',
            amount: .1,
            chance: .1,
            stat: 'damage'
        },
    ]
    
    

]