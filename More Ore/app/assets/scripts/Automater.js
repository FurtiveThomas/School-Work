let Automater = function() {

  S.automater.owned++
  S.automater.available++

  this.active = 0
  this.target_location = null
  this.initialized = false

  this.options = {
    time_between_click: 5,
    minimum_time_between_clicks: 5,
    amount_of_clicks: 1,
  }

  this.set = ( el ) => {
    this.active = 1

    this.__init__()

    s( '.automater .owned' ).innerHTML = S.automater.available
    

    let automater_target_square_dimensions = el.children[1].getBoundingClientRect()
    let center = {
      x: ( automater_target_square_dimensions.left + automater_target_square_dimensions.right ) / 2,
      y: ( automater_target_square_dimensions.top + automater_target_square_dimensions.bottom ) / 2
    }

    this.target_location = center
  }

  this.handle_clicks = () => {

    setTimeout(() => {
      if ( this.active ) {

        // automater_accordion_hidden

        let elms = document.elementsFromPoint( this.target_location.x, this.target_location.y )

        let el;

        el = S.automater.automater_visible ? elms[ 1 ] : elms[ 0 ]
        console.log( 'selected element to click:', el)

        console.log( document.elementsFromPoint( this.target_location.x, this.target_location.y ))

        let event = new MouseEvent( 'click', {
          clientX: this.target_location.x,
          clientY: this.target_location.y,
          source: 'Automater'
        })

        el.dispatchEvent( event )

        this.handle_clicks()
      }
    }, this.options.time_between_click * 1000 )
  }

  this.__init__ = () => {
    if ( !this.initialized ) {
      this.initialized = true
      this.active = 1
      this.handle_clicks()
      this._update_state()
    }
  }

  this.remove = ( id )  => {
    let el = document.querySelector(`#${ id }`)
    remove_el( el )
    this.active = 0
    this.initialized = false

    this._update_state()
  }

  this.open_settings = () => {
    console.log('open settings')
  }

  this._update_state = () => {

    let available = 0
    Automaters.forEach( automater => {
      console.log( automater )
      if ( !automater.active ) {
        available++
      }
    })
    S.automater.available = available

    if ( s( '.automater-wrapper' ).classList.contains( 'open' ) ) {
      build_automaters()
      console.log('ya')
    } else {
      console.log('no');
      
    }

  }


  Automaters.push( this )
}

let Automaters = []