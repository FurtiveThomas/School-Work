let State = function( s = {} ) {

  this.state = {

    ores: s.ores || 0,
    refined_ores: s.refined_ores || 0,

    generation: s.generation || {
      level: 0,
      current_xp: 0,
      needed_xp: 100,
      xp_on_refine: 0,
      knowledge_points: 0
    },

    ops: s.ops || 0,
    ops_multiplier: 0,

    opc: s.opc || 0,
    opc_multiplier: 0,
    opc_from_ops: 0,

    weak_hit_multi: s.weak_hit_multi || 7,
    weak_hit_crit_chance: .02,
    weak_hit_crit_multi: 1.5,
    current_combo: s.current_combo || 0,

    buy_amount: 1,

    inventory: s.inventory || {
      max_slots: 12,
      items: [
        {},{},{},{},
        {},{},{},{},
        {},{},{},{}
      ],
    },

    combo_shield: s.combo_shield || {
      active: 1,
      owned: 0,
      available: 0,
      time_until_next: null,
      time_last_used: null,
      time_needed: 4 * HOUR
    },

    current_ore_hp: s.current_ore_hp || base_ore_max_hp,
    current_ore_max_hp: s.current_ore_max_hp || base_ore_max_hp,

    tabs: [],

    max_ore_away_gain: s.max_ore_away_gain || 1 * MILLION, 

    gold_nugget_spawn_rate: s.gold_nugget_spawn_rate || 60, // 
    gold_nugget_chance_to_spawn: s.gold_nugget_chance_to_spawn || 30, // 30% chance to spawn
    
    bottom_area: s.bottom_area || {
      selected_tab: 'quest_board'
    },

    bonus_building_production: s.bonus_building_production || {
      all: 0,
      school: 0,
      farm: 0,
      quarry: 0,
      church: 0,
      factory: 0,
      crypt: 0,
      hospital: 0,
      citadel: 0,
      xeno_spaceship: 0,
      sky_castle: 0,
      eon_portal: 0,
      sacred_mine: 0,
      'o.a.r.d.i.s.': 0,
      final_destination: 0
    },

    quest_speed_bonus: 0,
    quest: s.quest ||  {
      state: null,
      hero: null,
      current_quest: null,
      current_quest_progress: null,
      boost_amount: 1 * SECOND
    },

    pickaxe_drop_chance: .3,
    pickaxe_quality_bonus: 0,
    pickaxe: s.pickaxe || {

      item: {
        level: 1,
        damage: 1,
        hardness: 100,
        sharpness: 100,
        name: "Wooden Starter Pickaxe",
        material: { name: 'Wood' },
        rarity: { name: 'Common' },
        num_of_upgrades: 3,
        used_upgrades: 0,
      },
      
      temporary_bonuses: {
        damage: 0,
        sharpness: 0,
        hardness: 0
      },

      permanent_bonuses: {
        damage: 0,
        sharpness: 0,
        hardness: 0
      },

      item_multiplier: 0,
      bonus_drop_rate: 0
    },

    automater: {
      automater_accordion_hidden: true,
      automater_visible: true,
      owned: 0,
      available: 0
    },

    locked: s.locked || {
      fragility_spectacles: 1,
      quest_board: 1,
      refine_btn: 1,
      combo_sign: 1
    },

    last_save: null,

    stats: s.stats || {
      highest_combo: 0,
      total_clicks: 0,
      total_weak_hit_clicks: 0,
      total_weak_hit_crit_clicks: 0,
      times_refined: 0,
      last_refine_time: null,
      current_rocks_destroyed: 0,
      current_ores_earned: 0,
      current_ores_manually_mined: 0,
      total_rocks_destroyed: 0,
      total_ores_manually_mined: 0,
      total_ores_earned: 0,
      total_refined_ores_earned: 0,
      total_nuggets_spawned: 0,
      total_nuggets_missed: 0,
      total_nuggets_clicked: 0,
      total_items_found: 0,
      total_pickaxes_trashed: 0,
      total_combo_shields_used: 0,

      total_quests_completed: 0,
      total_quests_failed: 0,
      total_unique_quests_completed: 0,
      total_times_quest_boosted: 0,
      current_combo_shields_used: 0,
      seconds_played: 0,
      first_day: new Date().getTime()
    },

    prefs: s.prefs || {
      game_speed: 30,
      sfx_muted: false,
      sfx_volume: .1,
      bgm_muted: false,
      bgm_volume: .1,
      show_rising_numbers: true,
      show_rock_particles: true,
      show_rock_hp: 'percentage',
      number_format: 0,
    },

    misc: s.misc || {
      current_ore_sprite: 1,
      ore_sprite_amount: 5,
      show_gem_warning: true,
      last_save: null
    }
  }
}


let load_state = async () => {

  return new Promise( resolve => {

      if ( localStorage.getItem( 'state' ) ) {
          S = new State( JSON.parse( localStorage.getItem( 'state' ) ) ).state
      }

      resolve()

  } )
}