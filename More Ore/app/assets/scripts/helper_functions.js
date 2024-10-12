let s = ( el ) => {
  return document.querySelector( el )
}

let remove_el = ( el ) => {
  el.parentNode.removeChild( el )
}

let remove_wrapper = () => {
    let wrappers = document.querySelectorAll( '.wrapper' )
    if ( wrappers.length > 0 ){
      let wrapper = wrappers[ wrappers.length - 1 ]
      let child_el = wrapper.firstElementChild
      if ( child_el.classList.contains( 'item-drop-popup-container' ) ) trash_pickaxe()
      child_el.addEventListener( 'animationend', () => { 
        remove_el( wrapper )
        TT.hide()
      } )
      wrapper.style.animation = 'fade_out .15s'
      child_el.style.animation = 'slide_down_out .15s'
    }
}

let get_random_num = ( min, max ) => {
  return Math.floor( Math.random() * ( max - min + 1 ) ) + min;
}

let get_time_difference = ( time ) => {

  let now = new Date().getTime()
  let str = ''

  let time_difference_ms = now - time
  let time_difference_sec = time_difference_ms / 1000
  let time_difference_min = time_difference_sec / 60
  let time_difference_hour = time_difference_min / 60
  let time_difference_day = time_difference_hour / 24

  if ( time_difference_sec < 60 ) { 
    str = 'a couple seconds ago' 
  } else {

    if ( time_difference_min < 60 ) {
      str += `${ Math.floor( time_difference_min ) } minutes ago`
    } else {

      if ( time_difference_hour < 24 ) {
        str += `${ Math.floor( time_difference_hour ) } hours ago`
      } else {

        str += `${ Math.floor( time_difference_day ) } days ago`
      }
    } 
  }

  return str

}

let get_time_difference_value = ( time, type = 'ms' ) => {

  let now = new Date().getTime()

  let diff = now - time

  switch ( type ) {

    case 'hours':
      return diff / 1000 / 60 / 60

    case 'minutes':
      return diff / 1000 / 60

    case 'seconds':
      return diff / 1000

    case 'ms':
    default:
      return diff
      
  }
}

let get_geometric_sequence_price = ( base_price, price_scale, owned, current_price = null ) => {

  let price = 0
  let amount = S.buy_amount

  if ( S.buy_amount == 'max' ) {

    price = current_price
    amount = 0

    while ( S.ores >= price ) {
      amount++
      price += base_price * Math.pow( price_scale, owned + amount )
    }


  } else {
    price = ( base_price * ( Math.pow( price_scale, owned + S.buy_amount ) - Math.pow( price_scale, owned ) ) ) / .15
  }


  return { price, amount }
}

let beautify_number = ( number, type=S.prefs.number_format) => {

  if ( type == 0 ) {
    var SI_PREFIXES = [
      "", // number is less than 1,000
      "Thousand", // number is in the thousands
      "Million",
      "Billion",
      "Trillion",
      "Quadrillion",
      "Quintillion",
      "Sextillion",
      "Septillion",
      "Octillion",
      "Nonillion",
      "Decillion",
      "Undecillion",
      "Dodecillion",
      "Tredecillion",
      "Quattuordecillion",
      "Quindecillion",
      "Sexdecillion",
      "Septendecillion",
      "Octodecillion",
      "Novemdecillion",
      "Vigintillion",
      "Unvigintillion",
      "Dovigintillion",
      "Trevigintillion",
      "Quattuorvigintillion",
      "Quinvigintillion",
      "Sexvigintillion",
      "Septenvigintillion",
      "Octovigintillion",
      "Novemvigintillion",
      "Trigintillion",
      "Untrigintillion",
      "Dotrigintillion",
      "Tretrigintillion",
      "Quattuortrigintillion",
      "Quintrigintillion",
      "Sextrigintillion",
      "Septentrigintillion",
      "Octotrigintillion",
      "Novemtrigintillion",
      "F*ckloadillion",
      "F*cktonillion"
    ];
  
    if (!number) return 0;
    if (number < 10){
        if (Math.round(number) === number) return number;
        return number.toFixed(1);
    }
    // what tier? (determines SI prefix)
    var tier = Math.log10(number) / 3 | 0;
  
    // if zero, we don't need a prefix
    if (tier === 0) return Math.round(number)
    // if (tier === 1) return Math.round(number)
  
    // get prefix and determine scale
    var prefix = SI_PREFIXES[tier];
    var scale = Math.pow(10, tier * 3);
  
    // scale the number
    var scaled = number / scale;
  
    // format number and add prefix as suffix
    return parseFloat(scaled.toFixed(2)) + " " + prefix;
  } else if ( type == 1 ) {
    return ( BigNumber( number ).toExponential( 2 ) )
  }
}

let beautify_ms = ( ms ) => {

  var seconds = ( ms / 1000 ).toFixed( 0 );

  var minutes = ( ms / ( 1000 * 60 ) ).toFixed( 0 );

  var hours = ( ms / ( 1000 * 60 * 60 ) ).toFixed( 0 );

  var days = ( ms / ( 1000 * 60 * 60 * 24 ) ).toFixed( 0 );

  if ( seconds < 60 ) {
      return seconds + "s";
  } else if ( minutes < 60 ) {
      return minutes + "m";
  } else if ( hours < 24 ) {
      return `${ hours } ${ hours > 1 ? 'hrs' : 'hr' }`
  } else {
      return `${ days} ${ days > 1 ? 'days' : 'day' }`
  }
}

let select_from_arr = ( arr, code_name ) => {
  for ( let i in arr ) {
    if ( arr[ i ].code_name === code_name ) {
      arr[ i ].index = parseInt( i )
      return arr[ i ]
    }
  }
}

let select_random_from_arr = ( arr ) => {
  return arr[ Math.floor( Math.random() * arr.length ) ]
}

let get_random_color = () => {
  let letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

let is_empty = ( obj ) => {
  return !obj || Object.keys( obj ).length === 0
}

let to_titlecase = ( sentence ) => {
  console.log( 'setnetnce', sentence )
  return sentence.toLowerCase()
    .split(' ')
    .map( ( s ) => s.charAt( 0 ).toUpperCase() + s.substring( 1 ) )
    .join(' ')
}
