let Smith = function( obj = {} ) {

    this.click_duration = 1000

    this.upgrade_in_progress = obj.upgrade_in_progress || {}
    this.duration = obj.duration || 0
    this.current_progress = obj.current_progress || 0

    this.start_upgrade = ( upgrade ) => {

        this.current_progress = 0

        if ( S.refined_ores >= upgrade.price ) {
            S.refined_ores -= upgrade.price
            play_sound( 'smith_upgrade_start' )

            this.upgrade_in_progress = upgrade
            this.duration = upgrade.duration

            this._update_progress()
        } else {
            notify( 'Not Enough Refined Ores', 'red', 'error' )
        }

    }

    this.progress_click = () => {
        if ( !is_empty( this.upgrade_in_progress ) ) {
            this.current_progress += this.click_duration
        }
    }

    this._update_progress = () => {

        build_pickaxe_update( true )
    
        let bar = s( '.progress-bar' )

        this.current_progress += ( 1000 / S.prefs.game_speed )

        if ( bar ) {
            let percentage = ( this.current_progress / this.duration ) * 100
            bar.style.width = percentage + '%'
        }

        if ( this.current_progress >= this.duration ) {
            this._update_complete()
        }
    }

    this._update_complete = () => {

        let upgrade = select_from_arr( Smith_Upgrades, this.upgrade_in_progress.code_name )

        if ( upgrade.unlock_functions ) {
            let fn = upgrade.unlock_functions

            if ( fn.unlock_fragility_spectacles ) {
                S.locked.fragility_spectacles = 0
                TS.add_to_queue( 'Do these glasses make my eyes look fat' )
                generate_weak_spot()
                unlock_smith_upgrade( 'quest_board' )
            }

            if ( fn.unlock_quest_board ) {
                S.locked.quest_board = 0
                select_from_arr( Bottom_Tabs, 'quest_board' ).locked = 0
                O.rebuild_bottom_tabs = 1
            }

            if ( upgrade.repeatable ) {
                if ( fn.increase_pickaxe_damage ) S.pickaxe.permanent_bonuses.damage += fn.increase_pickaxe_damage
                if ( fn.increase_pickaxe_sharpness ) S.pickaxe.permanent_bonuses.sharpness += fn.increase_pickaxe_sharpness
                if ( fn.increase_pickaxe_hardness ) S.pickaxe.permanent_bonuses.hardness += fn.increase_pickaxe_hardness

                upgrade.price = upgrade.base_price * Math.pow( upgrade.price_scale, upgrade.level )
                upgrade.level++
            }

            if ( fn.unlock_combo_shield ) {
                S.combo_shield.owned++
                S.combo_shield.available++
                build_combo_sign()
            }

            if ( fn.unlock_smith_upgrades ) {
                
                fn.unlock_smith_upgrades.forEach( code_name => {
                    console.log( fn.unlock_smith_upgrades )
                    let target_upgrade = select_from_arr( Smith_Upgrades, code_name )
                    console.log( 'target_upgrade:', target_upgrade )
                    select_from_arr( target_upgrade.requires, upgrade.code_name ).owned = 1

                    let locked = 0
                    target_upgrade.requires.forEach( requirement => {
                        if ( !requirement.owned ) {
                            locked = 1
                        }
                    })

                    target_upgrade.locked = locked

                })
            }

            if ( fn.increase_maximum_ore_away_gain ) {
                S.max_ore_away_gain *= fn.increase_maximum_ore_away_gain
            }

            if ( fn.unlock_automater ) {
                new Automater()
                S.automater.automater_accordion_hidden = false
                TS.add_to_queue( '- A U T O M A T E R  O N L I N E -' )
            }

            if ( fn.increase_gold_nugget_spawn_rate ) {
                S.gold_nugget_spawn_rate -= fn.increase_gold_nugget_spawn_rate
            }

            if ( fn.increase_gold_nugget_chance_of_spawn ) {
                S.gold_nugget_chance_to_spawn += fn.increase_gold_nugget_chance_of_spawn
            }

            if ( fn.combo_shield_speed_up ) {
                S.combo_shield.time_needed -= fn.combo_shield_speed_up
            }
        }

        if ( !upgrade.repeatable ) upgrade.owned = 1

        this.upgrade_in_progress = {}
        this.current_progress = 0
        O.reposition_elements = 1

        if ( O.current_tab == 'smith' ) O.rebuild_smith_tab = 1
    }

}

let load_smith = () => {

    return new Promise( resolve => {

        if ( localStorage.getItem( 'smith' ) ) {
            
            SMITH = new Smith( JSON.parse( localStorage.getItem( 'smith' ) ) )
            
            if ( !is_empty( SMITH.upgrade_in_progress ) ) {
                SMITH._upgrade_progress()
            }

        }

        resolve()

    })

}
