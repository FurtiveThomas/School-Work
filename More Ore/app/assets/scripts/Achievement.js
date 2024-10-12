/* 

  Achievements to add:
  - weak hit crit clicks

*/

let Achievement = function( obj ) {

  this.name = obj.name
  this.code_name = obj.name.replace( / /g, '_').toLowerCase()
  this.img = obj.img || "http://via.placeholder.com/32"
  this.type = obj.type || ''
  this.desc = obj.desc
  this.reward = obj.reward || null
  this.won = obj.won || 0
  this.time_won = obj.time_won || null
  if ( obj.flavor_text ) this.flavor_text = obj.flavor_text

  this.win = () => {
    this.won = 1
    this.time_won = new Date().getTime()

    let r = this.reward
    if ( r ) {
      if ( r.increase_building_production ) {
        let building = select_from_arr( Buildings, r.increase_building_production.building_code_name )
        building.production *= r.increase_building_production.multiplier_amount
      }

      if ( r.increase_weak_hit_multi ) {
        S.weak_hit_multi += r.increase_weak_hit_multi
      }

      if ( r.increase_pickaxe_hardness ) S.pickaxe.permanent_bonuses.hardness += r.increase_pickaxe_hardness
      if ( r.increase_pickaxe_sharpness ) S.pickaxe.permanent_bonuses.sharpness += r.increase_pickaxe_sharpness

      if ( r.increase_boost_amount ) S.quest.boost_amount *= r.increase_boost_amount

      if ( r.increase_quest_speed) {
        S.quest_speed_bonus += r.increase_quest_speed
        Quests.forEach( q => { q.duration = q.base_duration - ( q.base_duration * S.quest_speed_bonus ) } )
      }
    }
  }

  Achievements.push( this )
}

let Achievements = []
let achievements = [

  // { name: 'Schoolboy', desc: 'Have 10 Schools' },

  // MINING RELATED ACHIEVEMENTS
  { name: 'Newbie Miner', desc: 'Break your first rock', reward: { increase_pickaxe_hardness: 5, increase_pickaxe_sharpness: 5 } },
  { name: 'Novice Miner', desc: 'Break 10 rocks' },
  { name: 'Intermediate Miner', desc: 'Break 25 rocks' },
  { name: 'Advanced Miner', desc: 'Break 50 rocks', reward: { increase_pickaxe_hardness: 15, increase_pickaxe_sharpness: 15 } },
  { name: 'Master Miner', desc: 'Break 100 rocks', reward: { increase_pickaxe_hardness: 20, increase_pickaxe_sharpness: 20 } },
  { name: 'Chief Miner', desc: 'Break 200 rocks', reward: { increase_pickaxe_hardness: 30, increase_pickaxe_sharpness: 30} },
  { name: 'Exalted Miner', desc: 'Break 500 rocks', reward: { increase_pickaxe_hardness: 50, increase_pickaxe_sharpness: 50 } },
  { name: 'God Miner', desc: 'Break 1000 rocks', reward: { increase_pickaxe_hardness: 100, increase_pickaxe_sharpness: 100 } },

  // OPC RELATED ACHIEVEMENTS
  { name: 'Not even a scratch', desc: 'Deal more than 100 damage from a hit' },
  { name: 'Didnt even hurt', desc: 'Deal more than 1,000 damage from a hit' },
  { name: 'That tickled', desc: 'Deal more than 100,000 damage from a hit' },
  { name: 'I felt that', desc: 'Deal more than 1,000,000 damage from a hit' },

  // OPS RELATED ACHIEVEMENTS
  { name: 'Ore-aid Stand', desc: 'Reach 50 OpS' },
  { name: 'Ore Store', desc: 'Reach 10,000 OpS' },
  { name: '401k', desc: 'Reach 401,000 OpS' },
  { name: 'Retirement Plan', desc: 'Reach 5,000,000 OpS' },
  { name: 'Hedge Fund', desc: '1,000,000,000 OpS' },

  // REFINE RELATED ACHIEVEMENTS
  { name: 'Babies First Refine', desc: 'Refine for your first time' },
  { name: 'Quick Refiner', desc: 'Refine within 10 minutes of your last refine' },
  { name: 'Swift Refiner', desc: 'Refine within 5 minutes of your last refine' },
  { name: 'Speedy Refiner', desc: 'Refine within 1 minutes of your last refine' },
  { name: 'Flash Refiner', desc: 'Refine within 10 seconds of your last refine' },

  // TRASH PICKAXE RELATED ACHIEVEMENTS
  { name: 'Trasher', desc: 'Trash 5 pickaxes', flavor_text: 'Screw the environment, amirite!?' },
  { name: 'Polluter', desc: 'Trash 10 pickaxes' },
  { name: 'Scrapper', desc: 'Trash 20 pickaxes' },
  { name: 'Scrap Master', desc: 'Trash 40 pickaxes' },

  // COMBO RELATED ACHIEVEMENTS
  { name: 'Combo Baby', desc: 'Reach a 5 hit combo', type: 'combo' },
  { name: 'Combo Pleb', desc: 'Reach a 20 hit combo', type: 'combo' },
  { name: 'Combo Squire', desc: 'Reach a 50 hit combo', type: 'combo', reward: { increase_weak_hit_multi: .5 } },
  { name: 'Combo Knight', desc: 'Reach a 100 hit combo', type: 'combo', reward: { increase_weak_hit_multi: 1 } },
  { name: 'Combo King', desc: 'Reach a 200 hit combo', type: 'combo', reward: { increase_weak_hit_multi: 1 } },
  { name: 'Combo Master', desc: 'Reach a 350 hit combo', type: 'combo', reward: { increase_weak_hit_multi: 2 } },
  { name: 'Combo Devil', desc: 'Reach a 666 hit combo', type: 'combo', reward: { increase_weak_hit_mutli: 3 } },
  { name: 'Combo God', desc: 'Reach a 777 hit combo', type: 'combo', reward: { increase_weak_hit_multi: 3 } },
  { name: 'Combo Saiyan', desc: 'Read a 1000 hit combo', type: 'combo', reward: { increase_weak_hit_multi: 4 } },
  { name: 'Combo Saitama', desc: 'Reach a 10000 hit combo', type: 'combo', reward: { increase_weak_hit_multi: 5 } },

  // CRIT CLICK RELATED ACHIEVEMENTS
  { name: 'Critical Strike', desc: 'Deal a critical strike', type: 'crit' },
  { name: 'Lucky Number 7', desc: 'Deal a critical strike on combo 7', type: 'crit' },
  

  // QUEST RELATED ACHEIVEMENTS
  { name: 'Novice Quester', desc: 'Complete the first quest', type: 'quest' },
  { name: 'Adventurer', desc: 'Complete the first 5 quests', type: 'quest' },
  { name: 'Boosted!', desc: 'Boost a single time', type: 'quest' },
  { name: 'Rocket Boost', desc: 'Boost 100 times', type: 'quest', reward: { increase_boost_amount: 2 } },
  { name: 'Not That Dark!', desc: 'Complete the Dark Forest 5 times', type: 'quest', reward: { increase_quest_speed: .05 } },
  { name: 'Spooky Scary Skeletons', desc: 'Complete the Forgotten Cemetary 5 times', type: 'quest', reward: { increase_quest_speed: .05 } },
  { name: 'Worm Scarf', desc: 'Complete the Venal Corruption 5 times', type: 'quest', reward: { increase_quest_speed: .05 } },
  { name: 'Crystallization', desc: 'Complete the Crystal Mines 5 times', type: 'quest', reward: { increase_quest_speed: .05 } },
  { name: 'Poneglyph', desc: 'Complete the Ohara Athenaeum 5 times', type: 'quest', reward: { increase_quest_speed: .05 } },

  { name: 'Pinpoint Accuracy', desc: 'Grab all falling gold nuggets during a gold rush', type: 'gold rush' },

  // SECRET ACHIEVEMENTS
  { name: 'Who am I?', desc: 'Figure out the developers name', type: 'secret' },

]

let load_achievements = async () => {

  return new Promise( resolve => {

      Achievements = []

      if ( localStorage.getItem( 'achievements' ) ) {
          achievements = JSON.parse( localStorage.getItem( 'achievements' ) )
      }

      achievements.forEach( b => new Achievement( b ) )

      resolve()

  } )
}