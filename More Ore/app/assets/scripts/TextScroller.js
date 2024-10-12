let TextScroller = function( texts = null ) {

  this.is_scrolling = false
  this.queue = []
  this.texts = texts || [
    'What is a rocks favorite fruit? ... Pom-a-granite',
    'Did you see that cleavage? Now that\'s some gneiss schist.',
    'All rock and no clay makes you a dull boy (or girl)',
    'Don\'t take life for granite',
    'What happens when you throw a blue rock in the red sea? ... It gets wet',
    "As you can tell, these are pretty lame... Submit your own to /u/name_is_Syn",
    'Rocks really rock!',
    'I can\'t believe I\'m googling rock puns right now',
    'There are a few gems amongst all these terrible rock puns',
    'These puns sure are all ore nothing',
    'Rock pun here'
  ]

  this.add_new = ( text ) => {
    this.texts.push( text )
  }

  this.add_to_queue = ( text, add_to_array = false ) => {
    this.queue.push( text )
    if ( add_to_array ) this.texts.push( text )
  }

  this.get = () => {
    return this.queue.length > 0 ? this.queue.shift() : select_random_from_arr( this.texts )
  }

}

let load_text_scroller = () => {

  return new Promise( resolve => {

    if ( localStorage.getItem( 'text_scroller' ) ) {
      TS = new TextScroller( JSON.parse( localStorage.getItem( 'text_scroller' ) ) )
    }

    resolve()

  } )

}
