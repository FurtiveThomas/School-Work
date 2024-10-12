let RisingNumber = function() {

  this.new = ( e, type, amount = null ) => {

    if ( !S.prefs.show_rising_numbers ) return

    let el = document.createElement( 'div' )

    el.style.position = 'absolute'
    el.style.pointerEvents = 'none'
    el.style.color = 'white'
    el.style.fontSize = '20px'
    el.style.fontFamily = 'Germania One'
    el.style.zIndex = '2'
    el.style.textAlign = 'left'
    el.style.textShadow = '0 0 1px rgba( 0, 0, 0, 0.5 )'

    if ( e ) {
      el.style.left = e.clientX + get_random_num( -20, 20 ) + 'px'
      el.style.top = e.clientY + get_random_num( -5, 5 ) + 'px'
    }
    el.style.animation = 'flyingNumber 2s forwards ease-out';

    el.innerHTML = `+${ beautify_number( amount ) }`

    // TYPES
    switch ( type ) {

      case 'hoverable-ore':
        break;

      case 'ore-madness':
        el.style.color = 'crimson'
        el.style.textShadow = '0 0 4px black, 0 2px 6px purple, 0 -2px 5px orange'
        el.style.textAlign = 'center'
        el.innerHTML = `
          <h1>ORE MADNESS</h1> 
          <p>666x MULTIPLIER ON ALL CLICKS</p>
        `
        break;

      case 'gold-rush':
        el.style.color = 'gold'
        el.style.textShadow = '0 0 8px white'
        el.innerHTML = `
          <h1>GOLD RUSH</h1>
        `
        break

      case 'combo-shield':
        el.style.color = '#00e7ff'
        el.style.fontSize = '30px'
        el.style.animationDuration = '3s'
        el.innerHTML = 'Hit Prevented'
        break;

      case 'combo-loss':
        el.style.color = 'maroon'
        el.style.fontSize = '20px'
        el.style.animation = 'combo_loss 1s linear forwards'
        el.innerHTML = 'Combo Loss'
        break;

      case 'gold-nugget-click':
        el.style.color = 'gold'
        el.style.fontSize = '40px'
        el.style.animationDuration = '3s'
        break;

      case 'weak-hit-crit-click':
        el.style.fontSize = '35px'
        el.style.innerHTML = `
          <h1>CRIT/h1>
          <p>${ beautify_number( amount ) }</p>
        `
        break

      case 'weak-hit-click':
        el.style.fontSize = '28px'
        break;

      case 'successful-buy':
        el.innerHTML = '-$'
        el.style.color = 'red'
        el.style.fontSize = '30px'
        break;

      case 'combo':
        el.innerHTML = `${ amount } hit combo`
        el.style.color = get_random_color()
        el.style.fontSize = '35px'
        el.style.animationDuration = '3s'
        break;

      case 'buildings':
        let ore_sprite_dimensions = ORE_SPRITE.getBoundingClientRect()
        el.style.animation = 'buildingFlyingNumber 1.2s ease-out'
        el.style.left = ( ore_sprite_dimensions.left + ore_sprite_dimensions.right ) / 2  + 'px'
        el.style.top = ( ore_sprite_dimensions.top + ore_sprite_dimensions.bottom ) / 2 + 'px'
        break;

      default:
        break;
    }

    s( 'body' ).append( el )

    el.addEventListener( 'animationend', () => { remove_el( el ) } )
  }
}