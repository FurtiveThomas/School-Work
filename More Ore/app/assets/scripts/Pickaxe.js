let Pickaxe = function( item_level ) {

    this.level = _get_level( item_level )

    this.rarity = _get_rarity()
    this.sockets = _get_sockets( this )
    this.material = _get_material()
    this.prefix = _get_prefix()
    this.suffix = _get_suffix( this )

    this.multiplier = _get_multiplier( this )

    this.damage = _get_damage( this )
    this.sharpness = _get_sharpness( this )
    this.hardness = _get_hardness( this )

    this.num_of_upgrades = _get_num_upgrades( this )
    this.used_upgrades = 0

    this.name = _get_name( this )
    
    return this
}

// IDEAS
/*
    Rage stat - adds damage specifically in quests
    Luck stat - Crits?
    Endurance - quest speed?

    After first refine, pickaxes drop with more stats. 
*/

_get_level = ( item_level ) => {

    let level = S.generation.level

    level += get_random_num( 0, item_level )

    if ( level <= 1 ) level = 1

    return Math.floor( level )

}

_get_rarity = () => {

    let chance = Math.random() + S.pickaxe_quality_bonus

    let rarities = [
        { 
            name: 'Common',
            multiplier: 0 
        }, { 
            name: 'Uncommon',
            multiplier: .02
        }, { 
            name: 'Rare',
            multiplier: .05
        }, { 
            name: 'Unique',
            multiplier: .1
        }, { 
            name: 'Epic',
            multiplier: .3
        }, { 
            name: 'Legendary',
            multiplier: .5
        }, { 
            name: 'Mythic',
            multiplier: 1
        }
    ]

    let rarity = rarities[ 0 ]

    if ( chance < .6 )  rarity = rarities[ 1 ]
    if ( chance < .4 )  rarity = rarities[ 2 ]
    if ( chance < .3 )  rarity = rarities[ 3 ]
    if ( chance < .1 )  rarity = rarities[ 4 ]
    if ( chance < .03 ) rarity = rarities[ 5 ]
    if ( chance < .01 ) rarity = rarities[ 6 ]

    return rarity
}

_get_sockets = ( p ) => {

    let sockets = {}
    let amount = 0

    switch ( p.rarity.name ) {

        case 'Common':
            amount = select_random_from_arr( [ 0, 0, 0, 1 ] )
            break

        case 'Uncommon':
            amount = select_random_from_arr( [ 0, 1, 1, 1, 2 ] )
            break

        case 'Rare':
            amount = select_random_from_arr( [ 1, 1, 1, 2 ] )
            break

        case 'Unique':
            amount = select_random_from_arr( [ 1, 2, 2, 2, 3 ] )
            break

        case 'Epic':
            amount = select_random_from_arr( [ 2, 3, 3, 3, 4 ] )
            break

        case 'Legendary':
            amount = select_random_from_arr( [ 3, 4, 4, 5 ] )
            break
        
        case 'Mythic':
            amount = select_random_from_arr( [ 3, 4, 4, 4, 4, 5, 5, 5, 6 ] )
            break
    }

    sockets.amount = amount
    sockets.socket = []

    for ( let i = 0; i < sockets.amount; i++ ) {
        sockets.socket.push( {} )
    }

    return sockets
}

_get_material = () => {

    let chance = Math.random()

    let materials = [
        {
            names: [ 'Wood', 'Plastic', 'Cardboard', 'Glass', 'Tin' ],
            multiplier: -.03
        }, {
            names: [ 'Stone', 'Bronze', 'Copper', 'Bone', 'Lead' ],
            multiplier: .01
        }, {
            names: [ 'Iron', 'Silver', 'Gold' ],
            multiplier: .05
        }, {
            names: [ 'Steel', 'Platinum' ],
            multiplier: .1
        }, {
            names: [ 'Diamond', 'Adamantite', 'Titanium', 'Alien' ],
            multiplier: .3
        }
    ]

    let material = materials[ 0 ]

    if ( chance < .5 ) material = materials[ 1 ]
    if ( chance < .2 ) material = materials[ 2 ]
    if ( chance < .1 ) material = materials[ 3 ]
    if ( chance < .05 ) material = materials[ 4 ]

    material.name = select_random_from_arr( material.names )

    return {
        name: material.name,
        multiplier: material.multiplier
    }

}

_get_prefix = () => {

    let prefixes = [
        // NOT STRAIGHT UP BAD PREFIXES
        [
            {
                name: select_random_from_arr( [ 'Superior', 'Greater', 'Refined', 'Gigantic', 'Polished' ] ),
                modifier: [
                    {
                        stat: 'sharpness',
                        amount: .05
                    }, {
                        stat: 'hardness',
                        amount: .05
                    }
                ]
            }, {
                name: select_random_from_arr( [ 'Pointy', 'Sharp', 'Razor', 'Acute', 'Fine' ] ),
                modifier: [
                    {
                        stat: 'sharpness',
                        amount: .05
                    }
                ]
            }, {
                name: select_random_from_arr( [ 'Durable', 'Hefty', 'Hard', 'Reliable', 'Strong' ] ),
                modifier: [
                    {
                        stat: 'hardness',
                        amount: .05
                    }
                ]
            }, {
                name: 'Sharp but Flimsy',
                modifier: [
                    {
                        stat: 'sharpness',
                        amount: .1
                    }, {
                        stat: 'hardness',
                        amount: -.25
                    }
                ]
            }, {
                name: 'Hard but Dull',
                modifier: [
                    {
                        stat: 'sharpness',
                        amount: -.25
                    }, {
                        stat: 'hardness',
                        amount: .1
                    }
                ]
            }
        ],
        // STRAIGHT UP BAD PREFIXES
        [
            {
                name: select_random_from_arr( [ 'Tiny', 'Awkward', 'Shoddy', 'Broken', 'Busted', 'Cracked', 'Chipped', 'Damaged', 'Defective' ] ),
                modifier: [
                    {
                        stat: 'sharpness',
                        amount: -.05
                    }, {
                        stat: 'hardness',
                        amount: -.05
                    }
                ]
            }, {
                name: select_random_from_arr( [ 'Dull', 'Blunt' ] ),
                modifier: [
                    {
                        stat: 'sharpness',
                        amount: -.05
                    }
                ]
            }, {
                name: select_random_from_arr( [ 'Soft', 'Squishy', 'Thin' ] ),
                modifier: [
                    {
                        stat: 'hardness',
                        amount: -.05
                    }
                ]
            }
        ]
    ]

    // spawn a prefix at a 60% chance
    if ( Math.random() <= .6 ) {
        let prefix = {}

        if ( Math.random() <= .8 ) {
            // 80% chance for a good prefix
            prefix = select_random_from_arr( prefixes[ 0 ] )
        } else {
            // 20% chance for a bad prefix
            prefix = select_random_from_arr( prefixes[ 1 ] )
        }

        return prefix
    }
}

_get_suffix = ( p ) => {

    let suffixes = [
        {
            name: 'of the Giant',
            modifier: [
                {
                    stat: 'sharpness',
                    amount: .5
                }, {
                    stat: 'hardness',
                    amount: .5
                }
            ]
        }, {
            name: 'of Keen Eyes',
            modifier: [
                {
                    stat: 'sharpness',
                    amount: 1
                }, {
                    stat: 'hardness',
                    amount: -1
                }
            ]
        }
    ]

    if ( p.rarity.name == 'Mythic' ) {
        return select_random_from_arr( suffixes )
    }
}

_get_multiplier = ( p ) => {

    let multiplier = {
        sharpness: 0,
        hardness: 0
    }

    multiplier.sharpness += p.rarity.multiplier
    multiplier.hardness += p.rarity.multiplier

    multiplier.sharpness += p.material.multiplier
    multiplier.hardness += p.material.multiplier
    
    if ( p.prefix ) {

        p.prefix.modifier.forEach( modification => {
            multiplier[ modification.stat ] += modification.amount
        } )

    }

    return multiplier

}

_get_damage = ( p ) => {

    let damage = p.level + ( get_random_num( -p.level, p.level ))

    if ( damage <= 0 ) damage = 1

    if ( p.multiplier.sharpness > p.multiplier.hardness ) {
        damage += damage * p.multiplier.sharpness
    } else {
        damage += damage * p.multiplier.hardness
    }

    return damage

}

_get_sharpness = ( p ) => {

    let level = Math.floor( p.level / 10 )

    let sharpness = get_random_num( 80 + level * 5, 100 + level * 5 )

    sharpness += sharpness * p.multiplier.sharpness

    return sharpness
}

_get_hardness = ( p ) => {

    let level = Math.floor( p.level / 10 )

    let hardness = get_random_num( 80 + level * 5, 100 + level * 5 )

    hardness += hardness * p.multiplier.hardness

    return hardness
}

_get_name = ( p ) => {

    let name = ''

    if ( p.prefix ) {
        name += p.prefix.name + ' '
    }

    name += `${ p.material.name } Pickaxe`

    if ( p.suffix ) {
        name += ` ${ p.suffix.name }`
    }

    return name

}

_get_num_upgrades = ( p ) => {

    let num = 3

    switch ( p.rarity.name ) {

        case 'Common':
            num += select_random_from_arr( [ 0, 1, 2 ] )
            break
    
        case 'Uncommon':
            num += select_random_from_arr( [ 0, 1, 2, 3 ] )
            break

        case 'Rare':
            num += select_random_from_arr( [ 1, 2, 3, 4 ] )
            break

        case 'Unique':
            num += select_random_from_arr( [ 2, 3, 4 ] )
            break

        case 'Epic':
            num += select_random_from_arr( [ 2, 3, 3, 5 ] )
            break

        case 'Legendary':
            num += select_random_from_arr( [ 4, 5, 6 ] )
            break

        case 'Mythic':
            num += select_random_from_arr( [ 5, 6, 7 ] )
            break

    }


    return num

}
