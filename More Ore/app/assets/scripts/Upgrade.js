let Upgrade = function( obj ) {

    this.build_upgrade_desc = () => {
    
        let str = ''
        
        let building = select_from_arr( Buildings, this.buy_functions.increase_building_production.building )
    
        switch( this.buy_functions.increase_building_production.multi ) {
    
            case 2:
                str += 'Doubles '
                break
    
            case 3:
                str += 'Triples '
                break
    
            case 4:
                str += 'Quadruples '
                break
    
            case 5:
                str += 'Quintuples '
                break
    
            default:
                str += 'not defined'
                break
    
        }
    
        str += `the production of ${ building.name_plural }`
    
        return str
    }

    this.name = obj.name
    this.code_name = obj.name.replace( / /g, '_' ).toLowerCase()
    this.img = obj.img || `upgrade-${ this.code_name }`
    this.background_color = obj.background_color
    this.flavor_text = obj.flavor_text || ''
    this.price = obj.price
    this.hidden = obj.hasOwnProperty( 'hidden' ) ? obj.hidden : 1
    this.owned = obj.owned || false
    this.buy_functions = obj.buy_functions

    this.desc = obj.desc || this.build_upgrade_desc()

    this.buy = ( e ) => {
        if ( S.ores >= this.price ) {
            S.ores -= this.price
            play_sound( 'buy_sound' )
            this.owned = 1

            remove_el( e.target )

            if ( this.buy_functions ) {

                let fn = this.buy_functions

                let building = {}
                if ( fn.increase_building_production ) building = select_from_arr( Buildings, fn.increase_building_production.building )

                if ( fn.increase_building_production ) building.base_production *= fn.increase_building_production.multi
                if ( fn.gain_opc_from_ops ) S.opc_from_ops += fn.gain_opc_from_ops
                if ( fn.increase_ops_opc_multiplier ) {
                    S.ops_multiplier += fn.increase_ops_opc_multiplier
                    S.opc_multiplier += fn.increase_ops_opc_multiplier
                }
                if ( fn.change_building_image ) building.img = fn.change_building_image
                if ( fn.change_building_desc ) building.desc = fn.change_building_desc

            }

            O.recalculate_opc = 1
            O.recalculate_ops = 1

        } else {
            notify( 'Not enough ores', 'red', 'error' )
        }
    }

    Upgrades.push( this )
}

let Upgrades = []
let upgrades = [

    // OPC FROM OPS RELATED UPGRADES
    {
        name: 'Flashlight',
        background_color: '#f3d528',
        desc: 'Gain 1% of your OpS as OpC',
        flavor_text: 'Or a torch if you\'re so inclined.',
        price: 5 * THOUSAND,
        buy_functions: {
            gain_opc_from_ops: .01
        }
    }, {
        name: 'Double Polish',
        background_color: '#f3d528',
        desc: 'Gain 2% of your OpS as OpC',
        flavor_text: 'Extra sharp',
        price: 70 * THOUSAND,
        buy_functions: {
            gain_opc_from_ops: .02
        }
    }, {
        name: 'Metal Grips',
        background_color: '#f3d528',
        desc: 'Gain 3% of your OpS as OpC',
        flavor_text: 'Better grip for better smashin\'.',
        price: 500 * THOUSAND,
        buy_functions: {
            gain_opc_from_ops: .03
        }
    }, {
        name: 'Miner Battery',
        background_color: '#f3d528',
        desc: 'Gain 2% of your Ops as OpC',
        flavor_text: 'Miners are battery powered right?',
        price: 3.5 * MILLION,
        buy_functions: {
            gain_opc_from_ops: .02
        }
    },

    // INCREASE OPS AND OPC MULTIPLIER
    {
        name: 'Baby Knowledge',
        background_color: '#e092a4',
        desc: 'Increase overall OpS and OpC multiplier by 1%',
        flavor_text: 'Just a lil\' babby',
        price: 200,
        buy_functions: {
            increase_ops_opc_multiplier: .01
        }
    }, {
        name: 'Adolescent Knowledge',
        background_color: '#e092a4',
        desc: 'Increase overall OpS and OpC multiplier by 2%',
        flavor_text: 'Puberty Incoming',
        price: 16.5 * THOUSAND,
        buy_functions: {
            increase_ops_opc_multiplier: .02
        }
    }, {
        name: 'Adult Knowledge',
        background_color: '#e092a4',
        desc: 'Increase overall OpS and OpC multiplier by 3%',
        flavor_text: 'I still don\'t know anything',
        price: 1.35 * MILLION,
        buy_functions: {
            increase_ops_opc_multiplier: .03
        }
    }, {
        name: 'Elder Knowledge',
        background_color: '#e092a4',
        desc: 'increase overall OpS and OpC multiplier by 3%',
        flavor_text: 'Wise ol\' man.',
        price: 521 * MILLION,
        buy_functions: {
            increase_ops_opc_multiplier: .03
        }
    }, {
        name: 'Eldritch Knowledge',
        background_color: '#e092a4',
        desc: 'Increase overall OpS and OpC multiplier by 5%',
        flavor_text: 'We\'ve come so far.',
        price: 66.66666 * BILLION,
        buy_functions: {
            increase_ops_opc_multiplier: .05
        }
    },

    // -----------------------------------------------------------------------------------

    // SCHOOL RELATED UPGRADES
    {
        name: 'Composition Notebooks',
        background_color: '#6c6c6c',
        flavor_text: 'College Ruled!',
        price: 300,
        buy_functions: {
            increase_building_production: { building: 'school', multi: 2 }
        }
    }, {
        name: 'No. 2 Pencil',
        background_color: '#6c6c6c',
        img: 'upgrade-no_2_pencil',
        flavor_text: 'Test ready!',
        price: 1000,
        buy_functions: {
            increase_building_production: { building: 'school', multi: 2 }
        }
    }, {
        name: '3 Ring Binder',
        background_color: '#6c6c6c',
        flavor_text: 'Be the Lord of the Rings with our new 2.5\" binder!',
        price: 12000,
        buy_functions: {
            increase_building_production: { building: 'school', multi: 2 }
        }
    }, {
        name: 'Looseleaf',
        background_color: '#6c6c6c',
        flavor_text: '"Can I borrow a sheet?"',
        price: 450000,
        buy_functions: {
            increase_building_production: { building: 'school', multi: 2 }
        }
    }, {
        name: 'Schoolbag',
        background_color: '#6c6c6c',
        flavor_text: 'Break your back carrying one of these stylish bags!',
        price: 5500000,
        buy_functions: {
            increase_building_production: { building: 'school', multi: 3 }
        }
    }, {
        name: 'Fresh Pink Eraser',
        background_color: '#6c6c6c',
        flavor_text: 'Never use this. Keep it pristine.',
        price: 22.5 * MILLION,
        buy_functions: {
            increase_building_production: { building: 'school', multi: 2 }
        }
    }, {
        name: 'Gum',
        background_color: '#6c6c6c',
        flavor_text: 'You\'ll be the most popular kid in the class',
        price: 620 * MILLION,
        buy_functions: {
            increase_building_production: { building: 'school', multi: 2 }
        }
    }, {
        name: 'Hallpass',
        background_color: '#6c6c6c',
        flavor_text: 'Wander the halls without a care in the world',
        price: 3 * TRILLION,
        buy_functions: {
            increase_building_production: { building: 'school', multi: 2 }
        }
    }, {
        name: 'Report Card',
        background_color: '#6c6c6c',
        flavor_text: 'Decides your fate for the upcoming months',
        price: 82 * TRILLION,
        buy_functions: {
            increase_building_production: { building: 'school', multi: 2 }
        }
    },  

    // FARM RELATED UPGRADES
    {
        name: 'Manure Spreader',
        flavor_text: 'The poop helps the ore mature',
        background_color: '#beff00',
        price: 950,
        buy_functions: {
            increase_building_production: { building: 'farm', multi: 2 }
        }
    }, {
        name: 'Pitchfork',
        flavor_text: 'Torches not included',
        background_color: '#beff00',
        price: 12.5 * THOUSAND,
        buy_functions: {
            increase_building_production: { building: 'farm', multi: 2 }
        }
    }, {
        name: 'Tractor',
        flavor_text: 'im in me mums tractor',
        background_color: '#beff00',
        price: 265 * THOUSAND,
        buy_functions: {
            increase_building_production: { building: 'farm', multi: 2 }
        }
    }, {
        name: 'Rotary Cutter',
        flavor_text: 'Not even grass can stop us now',
        background_color: '#beff00',
        price: 3.45 * MILLION,
        buy_functions: {
            increase_building_production: { building: 'farm', multi: 2 }
        }
    }, {
        name: 'Hoe',
        flavor_text: 'Torches not included',
        background_color: '#beff00',
        price: 69 * MILLION,
        buy_functions: {
            increase_building_production: { building: 'farm', multi: 2 }
        }
    }, {
        name: 'Baler',
        flavor_text: '"How many people a year do you think get their arms cut off in a baler?"',
        background_color: '#beff00',
        price: 400 * MILLION,
        buy_functions: {
            increase_building_production: { building: 'farm', multi: 2 }
        }
    }, {
        name: 'Sickle',
        flavor_text: 'For easy sickle-ing of course.',
        background_color: '#beff00',
        price: 47.3 * MILLION,
        buy_functions: {
            increase_building_production: { building: 'farm', multi: 2 }
        }
    }, {
        name: 'Scythe',
        flavor_text: 'Looks like an upgraded sickle.',
        background_color: '#beff00',
        price: 700 * MILLION,
        buy_functions: {
            increase_building_production: { building: 'farm', multi: 2 }
        }
    },
    // QUARRY RELATED UPGRADES
    {
        name: 'Floodlights',
        background_color: '#d07221',
        flavor_text: 'Staring into one of them is like staring into a billion suns',
        price: 1.9 * THOUSAND,
        buy_functions: {
            increase_building_production: { building: 'quarry', multi: 2 }
        }
    }, {
        name: 'Twill Rope',
        background_color: '#d07221',
        flavor_text: 'Sturdy enuff',
        price: 11 * THOUSAND,
        buy_functions: {
            increase_building_production: { building: 'quarry', multi: 2 }
        }
    }, {
        name: 'Wooden Compass',
        background_color: '#d07221',
        flavor_text: 'Responds to ore magnetism ',
        price: 510 * THOUSAND,
        buy_functions: {
            increase_building_production: { building: 'quarry', multi: 2 }
        }
    }, {
        name: 'Ore Filter',
        background_color: '#d07221',
        flavor_text: 'Less sorting, more ore',
        price: 7 * MILLION,
        buy_functions: {
            increase_building_production: { building: 'quarry', multi: 2 }
        }
    }, {
        name: 'Waterproof Tape',
        background_color: '#d07221',
        flavor_text: 'Poor mans Flex Tape®',
        price: 80 * MILLION,
        buy_functions: {
            increase_building_production: { building: 'quarry', multi: 2 }
        }
    }, {
        name: 'Metallic Compass',
        background_color: '#d07221',
        flavor_text: 'Looks cooler, does the same thing.',
        price: 210.5 * MILLION,
        buy_functions: {
            increase_building_production: { building: 'quarry', multi: 2 }
        }
    }, {
        name: 'Miners Mask',
        background_color: '#d07221',
        flavor_text: 'Asbestos be gone!',
        price: 5 * BILLION,
        buy_functions: {
            increase_building_production: { building: 'quarry', multi: 2 }
        }
    }, {
        name: 'Cape Chisel',
        background_color: '#d07221',
        flavor_text: 'Faster than mining!',
        price: 27 * BILLION,
        buy_functions: {
            increase_building_production: { building: 'quarry', multi: 2 }
        }
    }, {
        name: 'Ore Splitter',
        background_color: '#d07221',
        flavor_text: 'Right down the midding',
        price: 600 * BILLION,
        buy_functions: {
            increase_building_production: { building: 'quarry', multi: 2 }
        }
    }, {
        name: 'Laser Drill',
        background_color: '#d07221',
        flavor_text: 'tbd',
        price: 6.3 * TRILLION,
        buy_functions: {
            increase_building_production: { building: 'quarry', multi: 2 }
        }
    },
    // CHURCH RELATED UPGRADES
    {
        name: 'Scripture Reading',
        background_color: '#f1be00',
        flavor_text: 'Read the word of our l-ore-d and savior',
        price: 60 * THOUSAND,
        buy_functions: {
            increase_building_production: { building: 'church', multi: 2 }
        }
    }, {
        name: 'Communion',
        background_color: '#f1be00',
        flavor_text: 'Note: Not communism',
        price: 740 * THOUSAND,
        buy_functions: {
            increase_building_production: { building: 'church', multi: 2 }
        }
    }, {
        name: 'Worship Session',
        background_color: '#f1be00',
        flavor_text: 'More like W-ore-ship ha.. haa...',
        price: 2.8 * MILLION,
        buy_functions: {
            increase_building_production: { building: 'church', multi: 2 }
        }
    }, {
        name: '7th Day',
        background_color: '#f1be00',
        flavor_text: 'You would think a day of worship is one less day of work but somehow it works out to more ore!',
        price: 62 * MILLION,
        buy_functions: {
            increase_building_production: { building: 'church', multi: 2 }
        }
    }, {
        name: 'Eden Apple',
        background_color: '#f1be00',
        flavor_text: 'You can\'t resist this forbidden fruit',
        price: 777 * MILLION,
        buy_functions: {
            increase_building_production: { building: 'church', multi: 2 }
        }
    }, {
        name: 'Apocalypse',
        background_color: '#f1be00',
        flavor_text: 'Hell on earth',
        price: 8.2 * BILLION,
        buy_functions: {
            increase_building_production: { building: 'church', multi: 5 },
            change_building_image: 'building-church-evil',
            change_building_desc: 'Praise to the Ore Demons',
        }
    }, {
        name: 'Judgement Day',
        background_color: '#f1be00',
        flavor_text: 'It\'s the end of the world',
        price: 32 * BILLION,
        buy_functions: {
            increase_building_production: { building: 'church', multi: 4 }
        }
    }, {
        name: 'Rapture',
        background_color: '#f1be00',
        flavor_text: 'Are you saved?',
        price: 700 * BILLION,
        buy_functions: {
            increase_building_production: { building: 'church', multi: 4 },
        }
    }, {
        name: 'Chaos',
        background_color: '#f1be00',
        flavor_text: '...',
        price: 2.45 * TRILLION,
        buy_functions: {
            increase_building_production: { building: 'church', multi: 3 }
        }
    }, {
        name: 'Satanic Ritual',
        background_color: '#f1be00',
        flavor_text: 'Sacrifices are the only way to appease the demons.',
        price: 33 * TRILLION,
        buy_functions: {
            increase_building_production: { building: 'church', multi: 3 }
        }
    },
    // FACTORY RELATED UPGRADES
    {
        name: 'Rubber Conveyor Belt',
        background_color: '#484848',
        flavor_text: 'These moves the things to there, that\'s all I know',
        price: 30 * THOUSAND,
        buy_functions: {
            increase_building_production: { building: 'factory', multi: 2 }
        }
    }, {
        name: 'Floppy Squiggle Tubes',
        background_color: '#484848',
        flavor_text: 'If I could tell you what these were for you\'d buy twice as many.',
        price: 300 * THOUSAND,
        buy_functions: {
            increase_building_production: { building: 'factory', multi: 2 }
        }
    }, {
        name: 'Clicky Squish Buttons',
        background_color: '#484848',
        flavor_text: 'These go next to the Squishy Click Buttons',
        price: 44 * MILLION,
        buy_functions: {
            increase_building_production: { building: 'factory', multi: 2 }
        }
    }, {
        name: 'Metallic Magnetic Panels',
        background_color: '#484848',
        flavor_text: 'These are actually for my fridge',
        price: 800 * MILLION,
        buy_functions: {
            increase_building_production: { building: 'factory', multi: 2 }
        }
    }, {
        name: 'Hydroponic Auxilleration',
        background_color: '#484848',
        flavor_text: 'Aquaman is here to stay',
        price: 5.3 * BILLION,
        buy_functions: {
            increase_building_production: { building: 'factory', multi: 2 }
        }
    }, {
        name: 'factory tbd 6',
        background_color: '#484848',
        flavor_text: 'tbd',
        price: 63 * BILLION,
        buy_functions: {
            increase_building_production: { building: 'factory', multi: 2 }
        }
    }, {
        name: 'factory tbd 7',
        background_color: '#484848',
        flavor_text: 'tbd',
        price: 700 * BILLION,
        buy_functions: {
            increase_building_production: { building: 'factory', multi: 2 }
        }
    }, {
        name: 'factory tbd 8',
        background_color: '#484848',
        flavor_text: 'tbd',
        price: 2 * TRILLION,
        buy_functions: {
            increase_building_production: { building: 'factory', multi: 2 }
        }
    }, {
        name: 'factory tbd 9',
        background_color: '#484848',
        flavor_text: 'tbd',
        price: 14 * TRILLION,
        buy_functions: {
            increase_building_production: { building: 'factory', multi: 2 }
        }
    }, {
        name: 'factory tbd 10',
        background_color: '#484848',
        flavor_text: 'tbd',
        price: 320 * TRILLION,
        buy_functions: {
            increase_building_production: { building: 'factory', multi: 2 }
        }
    },
    // CRYPT RELATED UPGRADES
    {
        name: 'Metal Sarcophagus',
        background_color: '#a55d2a',
        flavor_text: 'Sellers note: sarcophagus does not come with mummy preinstalled.',
        price: 5.2 * MILLION,
        buy_functions: {
            increase_building_production: { building: 'crypt', multi: 2 }
        }
    }, {
        name: 'Scarecrow',
        background_color: '#a55d2a',
        flavor_text: 'Scare the dead miners away',
        price: 72 * MILLION,
        buy_functions: {
            increase_building_production: { building: 'crypt', multi: 2 }
        }
    }, {
        name: 'Polished Shovel',
        background_color: '#a55d2a',
        flavor_text: 'Tool of choice for a Knight or an archaeologist.',
        price: 150 * MILLION,
        buy_functions: {
            increase_building_production: { building: 'crypt', multi: 2 }
        }
    },  {
        name: 'Fresh Bandages',
        background_color: '#a55d2a',
        flavor_text: 'Sanitary!',
        price: 2.5 * BILLION,
        buy_functions: {
            increase_building_production: { building: 'crypt', multi: 2 }
        }
    },  {
        name: 'Oil Lanterns',
        background_color: '#a55d2a',
        flavor_text: 'Sets the mood ;)',
        price: 50 * BILLION,
        buy_functions: {
            increase_building_production: { building: 'crypt', multi: 2 }
        }
    }, {
        name: 'factory tbd 5',
        background_color: '#a55d2a',
        flavor_text: 'tbd',
        price: 300 * BILLION,
        buy_functions: {
            increase_building_production: { building: 'crypt', multi: 2 }
        }
    }, {
        name: 'factory tbd 6',
        background_color: '#a55d2a',
        flavor_text: 'tbd',
        price: 1.2 * TRILLION,
        buy_functions: {
            increase_building_production: { building: 'crypt', multi: 2 }
        }
    }, {
        name: 'factory tbd 7',
        background_color: '#a55d2a',
        flavor_text: 'tbd',
        price: 22.5 * TRILLION,
        buy_functions: {
            increase_building_production: { building: 'crypt', multi: 2 }
        }
    }, {
        name: 'factory tbd 8',
        background_color: '#a55d2a',
        flavor_text: 'tbd',
        price: 420 * TRILLION,
        buy_functions: {
            increase_building_production: { building: 'crypt', multi: 2 }
        }
    }, {
        name: 'factory tbd 9',
        background_color: '#a55d2a',
        flavor_text: 'tbd',
        price: 3 * QUINTILLION,
        buy_functions: {
            increase_building_production: { building: 'crypt', multi: 2 }
        }
    }, {
        name: 'factory tbd 10',
        background_color: '#a55d2a',
        flavor_text: 'tbd',
        price: 25 * QUINTILLION,
        buy_functions: {
            increase_building_production: { building: 'crypt', multi: 2 }
        }
    },

    // HOSPITAL RELATED UPGRADES
    {
        name: 'Immunization Shot',
        background_color: '#d20000',
        desc: 'Doubles the production of Hospitals',
        flavor_text: 'wip',
        price: 10000000,
        buy_functions: {
            increase_building_production: { building: 'hospital', multi: 2 }
        }
    }, {
        name: 'Blood Test',
        background_color: '#d20000',
        desc: 'Find out the blood type of your ores to better understand them.',
        flavor_text: 'wip',
        price: 300000000,
        buy_functions: {
            increase_building_production: { building: 'hospital', multi: 3 }
        }
    }, {
        name: 'Blood Transfusion',
        background_color: '#d20000',
        desc: 'Doubles the production of Hospitals',
        flavor_text: 'Give the ores what they want: blood.',
        price: 2900000000,
        buy_functions: {
            increase_building_production: { building: 'hospital', multi: 2 }
        }
    }, {
        name: 'CAT Scan',
        background_color: '#d20000',
        desc: 'Triples the production of Hospitals',
        flavor_text: 'Not to be confused with PET scan.',
        price: 82000000000,
        buy_functions: {
            increase_building_production: { building: 'hospital', multi: 3 }
        }
    }, {
        name: 'Enhancement Surgery',
        background_color: '#d20000',
        desc: 'Quintuples the production of Hospitals',
        flavor_text: 'wip',
        price: 900000000000,
        buy_functions: {
            increase_building_production: { building: 'hospital', multi: 5 }
        }
    },
    // CITADEL RELATED UPGRADES
    {
        name: 'Council of Rocks',
        desc: 'Doubles the production of Citadels',
        flavor_text: 'Council of Rocks, not the Council of Ricks',
        price: 400000000,
        buy_functions: {
            increase_building_production: { building: 'citadel', multi: 2 }
        }
    },
    // XENO SPACESHIP RELATED UPGRADES
    {
        name: 'Jet Fuel',
        desc: 'Doubles the production of Xeno Spaceships',
        flavor_text: 'Steel beams nowhere in sight',
        price: 5500000000,
        buy_functions: {
            increase_building_production: { building: 'xeno_spaceship', multi: 2 }
        }
    },
    // SKY CASTLE RELATED ACHIEVEMENTS
    {
        name: 'Golden Eggs',
        desc: 'Doubles the production of Sky Castles',
        flavor_text: 'wip',
        price: 95000000000,
        buy_functions: {
            increase_building_production: { building: 'sky_castle', multi: 2 }
        }
    },
    // EON PORTAL RELATED ACHIEVEMENTS
    {
        name: 'Green Goop',
        desc: 'Doubles the production of Eon Portals',
        flavor_text: 'Goopy!',
        price: 150000000000,
        buy_functions: {
            increase_building_production: { building: 'eon_portal', multi: 2 }
        }
    },
    // SACRED MINE RELATED ACHIEVEMENTS
    {
        name: 'Sacred Mine Upgrade I',
        desc: 'Doubles the production of Sacred Mines',
        flavor_text: 'wip',
        price: 2200000000000,
        buy_functions: {
            increase_building_production: { building: 'sacred_mine', multi: 2 }
        }
    },
    // O.A.R.D.I.S. RELATED ACHIEVEMENTS
    {
        name: 'O.A.R.D.I.S. Upgrade I',
        desc: 'Doubles the production of O.A.R.D.I.S.',
        flavor_text: 'wip',
        price: 50000000000000,
        buy_functions: {
            increase_building_production: { building: 'o.a.r.d.i.s.', multi: 2 }
        }
    }
]

let unlock_upgrade = ( code_name ) => {
    let upgrade = select_from_arr( Upgrades, code_name )
    if ( upgrade.hidden ) {
        upgrade.hidden = false
        if ( O.current_tab == 'store' ) {
            O.rebuild_store_tab = 1
        }
    }
}

let load_upgrades = () => {

    return new Promise( resolve => {

        Upgrades = []
        let base_upgrades = upgrades

        if ( localStorage.getItem( 'upgrades' ) ) {
            base_upgrades = JSON.parse( localStorage.getItem( 'upgrades' ) )
        }

        base_upgrades.forEach( u => new Upgrade( u ))

        resolve()

    })

}
