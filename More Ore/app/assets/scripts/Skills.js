let Skill = function( obj, index ) {

  this.name = obj.name
  this.code_name = obj.name.replace( / /g, '_').toLowerCase()
  this.id = obj.id
  this.img = obj.img
  this.desc = obj.desc
  this.skill_classes = obj.skill_classes || ''
  this.flavor_text = obj.flavor_text || ''
  this.generation_requirement = obj.generation_requirement || obj.position.col
  this.skill_requirement_names = obj.skill_requirement_names

  this.__get_skill_requirements = () => {

    console.log( 'get skill requirements firing' )

    let skill_requirements = []
    if ( this.skill_requirement_names ) {
      this.skill_requirement_names.forEach( skill_code_name => {
        
        let requirement = {}

        let target_skill = select_from_arr( Skills, skill_code_name )

        requirement.code_name = skill_code_name
        requirement.owned = target_skill.owned ? true : false

        skill_requirements.push( requirement )

      } )
    }

    return skill_requirements
  }

  this.skill_requirements = this.__get_skill_requirements() 

  this.position = obj.position
  this.unlock_function = obj.unlock_function
  this.locked = obj.locked == 0 ? 0 : 1
  this.owned = obj.owned == 1 ? 1 : 0

  Skills.push( this )

  this.level_up = ( e ) => {
    
    if ( this.locked == 0 ) {
      if ( S.generation.knowledge_points > 0 ) {
        if ( this.owned == 0 ) {
          if ( S.generation.level >= this.generation_requirement ) {
            
            S.generation.knowledge_points--
            this.owned = 1
            e.target.classList.remove( 'not-owned' )

            build_skills_header( true )
            play_sound( 'skill_level_up' )

            if ( this.unlock_function ) this.__handle_unlock_function( this.unlock_function )

          } else {
            notify( 'You do not meet the generation requirement', 'red', 'error' )
          }
        } else {
          notify( 'You already have this skill', 'red', 'error' )
        }
      } else {
        notify( 'Not enough knowledge points', 'red', 'error' )
      }
    } else {
      notify( 'This skill is locked', 'red', 'error' )
    }
  }

  this.__handle_unlock_function = ( fn ) => {
    
    if ( fn.unlock_skills ) {
      fn.unlock_skills.forEach( target_skill => {

        let skill_to_unlock = select_from_arr( Skills, target_skill[ 0 ])
        let unlocked = true

        skill_to_unlock.skill_requirements.forEach( req => {
          if ( this.code_name == req.code_name ) {
            req.owned = 1
          }
          if ( req.owned == 0 ) unlocked = false

          if ( unlocked ) {
            skill_to_unlock.locked = 0
            let skill_el = s( `#skill-${ skill_to_unlock.id }` )
            skill_el.classList.remove( 'locked' )

            draw_skill_lines()
          }
        } )

      })
    }

    if ( fn.increase_all_building_production ) S.bonus_building_production.all += fn.increase_all_building_production
    if ( fn.increase_opc ) S.opc_multiplier += S.opc_multiplier * fn.increase_opc

    if ( fn.increase_pickaxe_sharpness ) S.pickaxe.permanent_bonuses += fn.increase_pickaxe_sharpness
    if ( fn.increase_pickaxe_hardness ) S.pickaxe.permanent_bonuses += fn.increase_pickaxe_hardness

    if ( fn.increase_pickaxe_drop_chance ) S.pickaxe_drop_chance += fn.increase_pickaxe_drop_chance
    if ( fn.increase_pickaxe_quality_bonus ) S.pickaxe_quality_bonus += fn.increase_pickaxe_quality_bonus

    O.recalculate_opc = 1
    O.recalculate_ops = 1

  }
}

let Skills = []
let skills = [
  {
    name: 'The Beginning',
    id: 1,
    img: 'https://via.placeholder.com/40',
    desc: 'Increase all building production and ores per click by 50%',
    flavor_text: 'flavor test',
    position: { col: 1, row: 0 },
    locked: 0,
    unlock_function: {
      unlock_skills: [
        [ 'pickaxe_proficiency_i', 'right', 'left' ],
        [ 'managerial_proficiency_i', 'right', 'left' ]
      ],
      increase_all_building_production: .5,
      increase_opc: .5
    }
  }, {
    name: 'Pickaxe Proficiency I',
    id: 2,
    skill_classes: 'circle small',
    img: 'https://via.placeholder.com/40',
    desc: 'Increase all pickaxe sharpness + hardness by 5%',
    flavor_text: 'flavor text',
    position: { col: 2, row: -1 },
    skill_requirement_names: [ 'the_beginning' ],
    unlock_function: {
      unlock_skills: [
        [ 'pickaxe_proficiency_ii', 'right', 'left' ],
        [ 'better_pickaxes', 'top', 'left' ],
        [ 'more_pickaxes', 'top', 'left' ]
      ],
      increase_pickaxe_sharpness: .05,
      increase_pickaxe_hardness: .05
    }
  }, {
    name: 'Pickaxe Proficiency II',
    id: 3,
    skill_classes: 'circle small',
    img: 'https://via.placeholder.com/40',
    desc: 'Increase all pickaxe sharpness + hardness by 5%',
    flavor_text: 'flavor text',
    position: { col: 3, row: -1 },
    skill_requirement_names: [ 'pickaxe_proficiency_i' ],
    unlock_function: {
      unlock_skills: [
        [ 'pickaxe_proficiency_iii', 'right', 'left' ],
      ],
      increase_pickaxe_sharpness: .05,
      increase_pickaxe_hardness: .05
    }
  }, {
    name: 'Pickaxe Proficiency III',
    id: 4,
    skill_classes: 'circle small',
    img: 'https://via.placeholder.com/40',
    desc: 'Increase all pickaxe sharpness + hardness by 5%',
    flavor_text: 'flavor text',
    position: { col: 4, row: -1 },
    skill_requirement_names: [ 'pickaxe_proficiency_ii' ],
    unlock_function: {
      unlock_skills: [
        [ 'miners_knowledge', 'right', 'left']
      ],
      increase_pickaxe_sharpness: .05,
      increase_pickaxe_hardness: .05
    }
  }, {
    name: 'Miners Knowledge',
    id: 5,
    img: 'https://via.placeholder.com/40',
    desc: 'Increase all pickaxe sharpness + hardness by 30%',
    flavor_text: 'flavor text',
    position: { col: 5, row: -1 },
    skill_requirement_names: [ 'pickaxe_proficiency_iii' ],
    unlock_function: {
      unlock_skills: [
        [ 'eagle_eye_i', 'right', 'left' ],
        [ 'stonesmithing_i', 'right', 'left' ],
      ],
      increase_pickaxe_sharpness: .3,
      increase_pickaxe_hardness: .3
    }
  }, {
    name: 'Managerial Proficiency I',
    skill_classes: 'circle small',
    id: 6,
    img: 'https://via.placeholder.com/40',
    desc: 'Increase all building production by 5%',
    flavor_text: 'flavor text',
    position: { col: 2, row: 1 }, 
    skill_requirement_names: [ 'the_beginning' ],
    unlock_function: {
      unlock_skills: [
        [ 'managerial_proficiency_ii', 'right', 'left' ]
      ],
      increase_all_building_production: .05,
    }
  }, {
    name: 'Managerial Proficiency II',
    id: 7,
    skill_classes: 'circle small',
    img: 'https://via.placeholder.com/40',
    desc: 'Increase all building production by 5%',
    flavor_text: 'flavor text',
    position: { col: 3, row: 1 }, 
    skill_requirement_names: [ 'managerial_proficiency_i' ],
    unlock_function: {
      unlock_skills: [
        [ 'managerial_proficiency_iii', 'right', 'left' ]
      ],
      increase_all_building_production: .05,
    }
  }, {
    name: 'Managerial Proficiency III',
    id: 8,
    skill_classes: 'circle small',
    img: 'https://via.placeholder.com/40',
    desc: 'Increase all building production by 5%',
    flavor_text: 'flavor text',
    position: { col: 4, row: 1 }, 
    skill_requirement_names: [ 'managerial_proficiency_ii' ],
    unlock_function: {
    },
    increase_all_building_production: .05,
  }, {
    name: 'Better Pickaxes',
    id: 9,
    skill_classes: 'circle small',
    img: 'https://via.placeholder.com/40',
    desc: 'Increase the chance of getting a better pickaxe!',
    flavor_text: 'flavor text',
    position: { col: 3, row: -2 },
    skill_requirement_names: [ 'pickaxe_proficiency_i' ],
    unlock_function: {
      unlock_skills: [
        [ 'even_better_pickaxes', 'right', 'left' ]
      ],
      increase_pickaxe_quality_bonus: .1
    }
  }, {
    name: 'More Pickaxes',
    id: 10,
    skill_classes: 'circle small',
    img: 'https://via.placeholder.com/40',
    desc: 'Increase the chance of a pickaxe dropping!',
    flavor_text: 'flavor text',
    position: { col: 3, row: -3 },
    skill_requirement_names: [ 'pickaxe_proficiency_i' ],
    unlock_function: {
      unlock_skills: [
        [ 'even_more_pickaxes', 'right', 'left' ]
      ],
      increase_pickaxe_drop_chance: .1
    }
  }, {
    name: 'Even More Pickaxes',
    id: 11,
    skill_classes: 'circle small',
    img: 'https://via.placeholder.com/40',
    desc: 'Increase the chance of a pickaxe dropping even more!',
    flavor_text: 'flavor text',
    position: { col: 6, row: -3 },
    skill_requirement_names: [ 'more_pickaxes' ],
    unlock_function: {
      increase_pickaxe_drop_chance: 15
    }
  }, {
    name: 'Even Better Pickaxes',
    id: 12,
    skill_classes: 'circle small',
    img: 'https://via.placeholder.com/40',
    desc: 'Increase the chance of getting a better pickaxe even more!',
    flavor_text: 'flavor text',
    position: { col: 6, row: -2 },
    skill_requirement_names: [ 'better_pickaxes' ],
    unlock_function: {
      increase_pickaxe_quality_bonus: .1
    }
  }, {
    name: 'Eagle Eye I',
    id: 13,
    skill_classes: 'circle small',
    img: 'https://via.placeholder.com/40',
    desc: 'Increase pickaxe sharpness by 15%',
    flavor_text: 'flavor text',
    position: { col: 7, row: 0 },
    skill_requirement_names: [ 'miners_knowledge' ],
    unlock_function: {
      unlock_skills: [
        [ 'eagle_eye_ii', 'right', 'left' ]
      ],
      increase_pickaxe_sharpness: 15
    }
  }, {
    name: 'Eagle Eye II',
    id: 14,
    skill_classes: 'circle small',
    img: 'https://via.placeholder.com/40',
    desc: 'Increase pickaxe sharpness by 15%',
    flavor_text: 'flavor text',
    position: { col: 9, row: 0 },
    skill_requirement_names: [ 'eagle_eye_i' ],
    unlock_function: {
      unlock_skills: [
        [ 'eagle_eye_iii', 'right', 'left' ]
      ],
      increase_pickaxe_sharpness: 15
    }
  }, {
    name: 'Eagle Eye III',
    id: 15,
    skill_classes: 'circle small',
    img: 'https://via.placeholder.com/40',
    desc: 'Increase pickaxe sharpness by 15%',
    flavor_text: 'flavor text',
    position: { col: 11, row: 0 },
    skill_requirement_names: [ 'eagle_eye_ii' ],
    unlock_function: {
      unlock_skills: [
        [ 'hawk_sense', 'right', 'left' ]
      ],
      increase_pickaxe_sharpness: 15
    }
  }, {
    name: 'Hawk Sense',
    id: 16,
    img: 'https://via.placeholder.com/40',
    desc: 'Increase pickaxe sharpness by 50%. Greatly increase weak hit crit chance.',
    flavor_text: 'flavor text',
    position: { col: 13, row: 0 },
    skill_requirement_names: [ 'eagle_eye_iii' ],
    unlock_function: {
      increase_pickaxe_sharpness: 50,
      increase_weak_hit_crit_chance: .1
    }
  }, {
    name: 'Stonesmithing I',
    id: 17,
    skill_classes: 'circle small',
    img: 'https://via.placeholder.com/40',
    desc: 'Increase pickaxe hardness by 15%',
    flavor_text: 'flavor text',
    position: { col: 7, row: 1 },
    skill_requirement_names: [ 'miners_knowledge' ],
    unlock_function: {
      unlock_skills: [
        [ 'stonesmithing_ii', 'right', 'left' ]
      ],
      increase_pickaxe_hardness: 15,
    }
  }, {
    name: 'Stonesmithing II',
    id: 18,
    skill_classes: 'circle small',
    img: 'https://via.placeholder.com/40',
    desc: 'Increase pickaxe hardness by 15%',
    flavor_text: 'flavor text',
    position: { col: 9, row: 1 },
    skill_requirement_names: [ 'stonesmithing_i' ],
    unlock_function: {
      unlock_skills: [
        [ 'stonesmithing_iii', 'right', 'left' ]
      ],
      increase_pickaxe_hardness: 15,
    }
  }, {
    name: 'Stonesmithing III',
    id: 19,
    skill_classes: 'circle small',
    img: 'https://via.placeholder.com/40',
    desc: 'Increase pickaxe hardness by 15%',
    flavor_text: 'flavor text',
    position: { col: 11, row: 1 },
    skill_requirement_names: [ 'stonesmithing_ii' ],
    unlock_function: {
      unlock_skills: [
        [ 'unyielding', 'right', 'left' ]
      ],
      increase_pickaxe_hardness: 15,
    }
  }, {
    name: 'Unyielding',
    id: 20,
    img: 'https://via.placeholder.com/40',
    desc: 'Increase pickaxe hardness by 50%',
    flavor_text: 'flavor text',
    position: { col: 13, row: 1 },
    skill_requirement_names: [ 'stonesmithing_iii' ],
    unlock_function: {
      increase_pickaxe_hardness: 50,
    }
  }
    //skill for better gold nuggets?
]

let load_skills = () => {

  return new Promise( resolve => {

      Skills = []

      if ( localStorage.getItem( 'skills' ) ) {
          skills = JSON.parse( localStorage.getItem( 'skills' ) )
      }

      skills.forEach( skill => new Skill( skill ))

      resolve()

  })

}


skills.forEach( skill => new Skill( skill ) )
