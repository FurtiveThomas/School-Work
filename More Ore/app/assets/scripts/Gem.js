let Gem = function( level, gem_pool ) {

  this.level = level
  this.item_type = 'gem'
  this.gem_type = get_gem_type( gem_pool )
  this.stat_amount = get_stat_amount( this )
  this.stat_type = get_stat_type_str( this.gem_type )
  this.name = get_name( this )
  this.favorite = false
  
}

var get_name = ( gem ) => {

  let name = to_titlecase( gem.gem_type )

  return name
}

var get_gem_type = ( gem_pool ) => {

  let gems = {
    common_types: [ 'ruby', 'sapphire', 'turquoise' ],
    uncommon_types: [ 'citrine', 'alexandrite', 'amethyst', 'diamond' ],
    rare_types: [ 'vibranium', 'jade', 'morganite', 'emerald', 'topax', 'onyx', 'tanzanite' ]
  }

  let available_gems = []
  
  if ( gem_pool == 0 ) available_gems.push( ...gems.common_types )
  if ( gem_pool == 1 ) available_gems.push( ...gems.common_types, ...gems.uncommon_types )
  if ( gem_pool == 2 ) available_gems.push( ...gems.common_types, ...gems.uncommon_types, ...gems.rare_types )

  let type = select_random_from_arr( available_gems )

  return type

}

var get_stat_amount = ( gem ) => {

  let amount = 0

  switch( gem.gem_type ) {

    case 'ruby':
    case 'sapphire':
    case 'turquoise':
    case 'diamond':
    case 'jade':
    case 'emerald':
    case 'onyx':

      amount += gem.level * get_random_num( 1, 5 )

      break

    case 'citrine':
    case 'alexandrite':
    case 'amethyst':
    case 'vibranium':
    case 'morganite':
    case 'topaz':
    case 'tanzanite':
      break

  }

  return amount

}

var get_stat_type_str = ( type ) => {

  let str = ''

  switch( type ) {

    case 'ruby':
      str = 'flat damage'
      break

    case 'citrine':
      str = '% damage'
      break
    
    case 'sapphire':
      str = 'sharpness'
      break

    case  'alexandrite':
      str = '% sharpness'
      break

    case 'turquoise':
      str = 'hardness'
      break

    case 'amethyst':
      str = '% hardness'
      break

    default:
      str = 'not yet added into switch statement'
      break

  }

  return str

}


/*
    Gems:
    --------------
    - Ruby:         Increase pickaxe damage by flat amount
    - Citrine:      Increase pickaxe damage by percentage
    - null          Increase pickaxe damage by a percentage of your OpS
    - Sapphire:     Increase pickaxe sharpness by flat amount
    - Alexandrite:  Increase pickaxe sharpness by percentage
    - Turquoise:    Increase pickaxe hardness by flat amount
    - Amethyst:     Increase pickaxe hardness by percentage
    - Diamond:      Increase pickaxe sharpness and hardness by flat amount
    - Vibranium:    Increase pickaxe sharpness and hardness by percentage
    - Jade:         Increase specific building production by flat amount
    - Morganite:    Increase specific building production by percentage
    - Emerald:      Increase all building production by flat amount
    - Topaz:        Increase all building production by percentage
    - Onyx:         Increase quest completion percentage by a flat amount
    - Tanzanite:    Increase quest completion percentage by a percentage
*/



