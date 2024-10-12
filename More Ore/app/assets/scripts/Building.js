let Building = function( obj ) {
    this.name = obj.name
    this.name_plural = obj.name_plural
    this.code_name = obj.name.replace(/ /g, '_').toLowerCase()
    this.img = obj.img || `building-${ this.code_name }`
    this.desc = obj.desc
    this.flavor_text = obj.flavor_text
    this.base_production = obj.base_production
    this.production = obj.production || obj.base_production
    this.base_price = obj.base_price
    this.current_price = obj.current_price || obj.base_price
    this.price_scale = obj.price_scale
    this.owned = obj.owned || 0
    this.hidden = obj.hidden
    this.buy_functions = obj.buy_functions
    this.total_produced = 0

    this.buy = ( e ) => {

        let buy_info = get_geometric_sequence_price( this.base_price, this.price_scale, this.owned, this.current_price )

        if ( S.ores >= buy_info.price ) {
            spend( buy_info.price )
            RN.new( e, 'successful-buy')
            play_sound( 'buy_sound' )
            this.owned += buy_info.amount
            this.current_price = this.base_price * Math.pow( this.price_scale, this.owned )

            __update_hidden( this.code_name )

            if ( this.buy_functions ) {
                if ( this.buy_functions.unlock_upgrades ) {
                    this.buy_functions.unlock_upgrades.forEach( upgrade => {
                        if ( this.owned >= upgrade.amount_needed ) {
                            unlock_upgrade( upgrade.code_name )
                        }
                    })
                }
            }

            O.rebuild_store_tab = 1
            O.recalculate_opc = 1
            O.recalculate_ops = 1
        }

        if ( s( '#tutorial-buy-building' ) ) {
            remove_el( s( '#tutorial-buy-building' ) )
        }
    }

    Buildings.push( this )
}

let Buildings = []
let buildings = [
    {
        name: 'School',
        name_plural: 'Schools',
        desc: 'Teach students about the wonders of ore',
        flavor_text: '"Jesus christ Marie, they\'re minerals!"',
        base_production: .5,
        base_price: 50,
        price_scale: 1.15,
        hidden: 0,
        buy_functions: {
            unlock_upgrades: [
                { code_name: 'composition_notebooks', amount_needed: 1 },
                { code_name: 'no._2_pencil', amount_needed: 5 },
                { code_name: '3_ring_binder', amount_needed: 10 },
                { code_name: 'looseleaf', amount_needed: 20 },
                { code_name: 'schoolbag', amount_needed: 50 },
                { code_name: 'fresh_pink_eraser', amount_needed: 100 },
                { code_name: 'gum', amount_needed: 200 },
                { code_name: 'report_card', amount_needed: 400 }
            ]
        }
    }, {
        name: 'Farm',
        name_plural: 'Farms',
        desc: 'Cultivate the lands for higher quality ores',
        flavor_text: 'This totally makes sense',
        base_production: 1,
        base_price: 210,
        price_scale: 1.15,
        hidden: 1,
        buy_functions: {
            unlock_upgrades: [
                { code_name: 'manure_spreader', amount_needed: 1 },
                { code_name: 'pitchfork', amount_needed: 5 },
                { code_name: 'tractor', amount_needed: 10},
                { code_name: 'rotary_cutter', amount_needed: 20 },
                { code_name: 'hoe', amount_needed: 50 },
                { code_name: 'baler', amount_needed: 100 },
                { code_name: 'sickle', amount_needed: 200 },
                { code_name: 'scythe', amount_needed: 400 },
            ]
        }
    }, {
        name: 'Quarry',
        name_plural: 'Quarries',
        desc: 'Designated Mining Area',
        flavor_text: 'diggy diggy hole',
        base_production: 20,
        base_price: 2520,
        price_scale: 1.15,
        hidden: 1,
        buy_functions: {
            unlock_upgrades: [
                { code_name: 'floodlights', amount_needed: 1 },
                { code_name: 'twill_rope', amount_needed: 5 },
                { code_name: 'wooden_compass', amount_needed: 10 },
                { code_name: 'ore_filter', amount_needed: 20 },
                { code_name: 'waterproof_tape', amount_needed: 50 },
                { code_name: 'metallic_compass', amount_needed: 100 },
                { code_name: 'cape_chisel', amount_needed: 200 },
                { code_name: 'laser_drill', amount_needed: 400 },
            ]
        }
    }, {
        name: 'Church',
        name_plural: 'Churches',
        desc: 'Praise to the Ore Gods',
        flavor_text: 'In Ore name we pray, Amen',
        base_production: 320,
        base_price: 37800,
        price_scale: 1.15,
        hidden: 2,
        buy_functions: {
            unlock_upgrades: [
                { code_name: 'scripture_reading', amount_needed: 1 },
                { code_name: 'communion', amount_needed: 5 },
                { code_name: 'worship_session', amount_needed: 10 },
                { code_name: '7th_day', amount_needed: 20 },
                { code_name: 'eden_apple', amount_needed: 50 },
                { code_name: 'apocalypse', amount_needed: 100 },
                { code_name: 'rapture', amount_needed: 200 },
                { code_name: 'satanic_ritual', amount_needed: 400 },
            ]
        }
    }, {
        name: 'Factory',
        name_plural: 'Factories',
        desc: 'Manufacture your ores',
        flavor_text: 'Assembly line this SH%* up!',
        base_production: 4480,
        base_price: 491400,
        price_scale: 1.15,
        hidden: 2,
        buy_functions: {
            unlock_upgrades: [
                { code_name: 'rubber_conveyor_belt', amount_needed: 1 },
                { code_name: 'floppy_squiggle_tubes', amount_needed: 5 },
                { code_name: 'clicky_squish_buttons', amount_needed: 10 },
                { code_name: 'metallic_magnetic_panels', amount_needed: 20 },
                { code_name: 'hydroponic_auxilleration', amount_needed: 50 },
                { code_name: 'factory_tbd_6', amount_needed: 100 },
                { code_name: 'factory_tbd_7', amount_needed: 200 },
                { code_name: 'factory_tbd_8', amount_needed: 400 },
            ]
        }
    }, {
        name: 'Crypt',
        name_plural: 'Crypts',
        desc: 'Raise dead ores from the graves',
        flavor_text: 'Spooky ores',
        base_production: 67200,
        base_price: 7862400,
        price_scale: 1.15,
        hidden: 2,
        buy_functions: {
            unlock_upgrades: [
                { code_name: 'metal_sarcophagus', amount_needed: 1},
                { code_name: 'scarecrow', amount_needed: 5},
                { code_name: 'polished_shovel', amount_needed: 10},
                { code_name: 'fresh_bandages', amount_needed: 20},
                { code_name: 'oil_lanterns', amount_needed: 50 },
                { code_name: 'crypt_tbd_6', amount_needed: 100 },
                { code_name: 'crypt_tbd_7', amount_needed: 200 },
                { code_name: 'crypt_tbd_8', amount_needed: 500 },

            ]
        }
    }, {
        name: 'Hospital',
        name_plural: 'Hospitals',
        desc: 'Heal your damaged ores',
        flavor_text: 'An apple a day keeps the ore cancer away',
        base_production: 1344000,
        base_price: 196560000,
        price_scale: 1.15,
        hidden: 2,
        buy_functions: {
            unlock_upgrades: [
                { code_name: 'immunization_shot', amount_needed: 1 },
                { code_name: 'blood_test', amount_needed: 10 },
                { code_name: 'blood_transfusion', amount_needed: 20 },
                { code_name: 'cat_scan', amount_needed: 50 },
                { code_name: 'enhancement_surgery', amount_needed: 100 },
            ]
        }
    }, {
        name: 'Citadel', 
        name_plural: 'Citadels', 
        desc: 'wip', 
        flavor_text: 'wip', 
        base_production: 14784000, 
        base_price: 2751840000, 
        price_scale: 1.15,
        hidden: 2,
        buy_functions: {
            unlock_upgrades: [
                { code_name: 'council_of_rocks', amount_needed: 1 },
            ]
        }
    }, {
        name: 'Xeno Spaceship', 
        name_plural: 'Xeno Spaceships', 
        desc: 'wip', 
        flavor_text: 'wip', 
        base_production: 192192000, 
        base_price: 49533120000, 
        price_scale: 1.15,
        hidden: 2,
        buy_functions: {
            unlock_upgrades: [
                { code_name: 'jet_fuel', amount_needed: 1 },
            ]
        }
    }, {
        name: 'Sky Castle', 
        name_plural: 'Sky Castles', 
        desc: 'Use magic beans to reach an egg based source of ore', 
        flavor_text: 'wip', 
        base_production: 3843840000, 
        base_price: 1238328000000, 
        price_scale: 1.15,
        hidden: 2,
        buy_functions: {
            unlock_upgrades: [
                { code_name: 'golden_eggs', amount_needed: 1 },
            ]
        }
    }, {
        name: 'Eon Portal', 
        name_plural: 'Eon Portals', 
        desc: 'Steal ore from your past and future self', 
        flavor_text: 'wip', 
        base_production: 45126080000, 
        base_price: 18574920000000, 
        price_scale: 1.15,
        hidden: 2,
        buy_functions: {
            unlock_upgrades: [
                { code_name: 'green_goop', amount_needed: 1 },
            ]
        }
    },
    // {
    //     name: 'Sacred Mine', 
    //     name_plural: 'Sacred Mines', 
    //     desc: 'wip', 
    //     flavor_text: 'wip', 
    //     base_production: 691891200000, 
    //     base_price: 297198720000000, 
    //     price_scale: 1.15,
    //     hidden: 2,
    //     buy_functions: {
    //         unlock_upgrades: [
    //             { code_name: 'sacred_mine_upgrade_i', amount_needed: 1 },
    //         ]
    //     }
    // },
    // {
    //     name: 'O.A.R.D.I.S.', 
    //     name_plural: 'O.A.R.D.I.S.s', 
    //     img: 'oardis',
    //     desc: 'wip', 
    //     flavor_text: 'wip', 
    //     base_production: 17289780000000, 
    //     base_price: 8915961600000000, 
    //     price_scale: 1.15,
    //     hidden: 2,
    //     buy_functions: {
    //         unlock_upgrades: [
    //             { code_name: 'o.a.r.d.i.s._upgrade_i', amount_needed: 1 },
    //         ]
    //     }
    // }, 
    // {
    //     name: 'Final Destination', 
    //     name_plural: 'Final Destinations', 
    //     desc: 'The Final Destination', 
    //     flavor_text: 'wip', 
    //     base_production: 999999999999999999, 
    //     base_price: 999999999999999999999999999999999, 
    //     price_scale: 1.15,
    //     hidden: 2,
    // }
]

let load_buildings = async () => {

    return new Promise( resolve => {

        Buildings = []
        let base_buildings = buildings

        if ( localStorage.getItem( 'buildings' ) ) {
            base_buildings = JSON.parse( localStorage.getItem( 'buildings' ) )
        }

        base_buildings.forEach( b => new Building( b ) )

        resolve()

    } )
}

let __update_hidden = ( code_name ) => {
    let building = select_from_arr( Buildings, code_name )
    let item;

    item = Buildings[ building.index + 1 ]
    if ( item.hidden != 0 ) {
        item.hidden = 0
    }

    item = Buildings[ building.index + 2 ]
    if ( item ) {
        if ( item.hidden != 0 && item.hidden != 1 ) {
            item.hidden = 1
        }
    }

    item = Buildings[ building.index + 3 ]
    if ( item ) {
        if ( item.hidden != 0 && item.hidden != 1 ) {
            item.hidden = 1
        }
    }

}