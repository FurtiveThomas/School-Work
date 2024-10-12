let Tab = function( tab ) {

    this.name = tab.name
    this.code_name = tab.code_name || tab.name.replace(/ /g, '_').toLowerCase()
    this.hidden = tab.hidden || 0

    Tabs.push( this )
}

let Tabs = []
let tabs = [
    {
      name: '<i class="fa fa-usd"></i>',
      code_name: 'store',
    }, {
      name: '<i class="fa fa-gavel"></i>',
      code_name: 'smith',
      hidden: 1
    }, {
      name: '<i class="fa fa-superpowers"></i>',
      code_name: 'skills',
      hidden: 1
    }
]


let load_tabs = () => {

  return new Promise( resolve => {

      Tabs = []

      if ( localStorage.getItem( 'tabs' ) ) {
          tabs = JSON.parse( localStorage.getItem( 'tabs' ) )
      }

      tabs.forEach( t => new Tab( t ))

      resolve()

  })

}


// ---------------------------------------------------------------

let Bottom_Tab = function( tab ) {

  this.name = tab.name
  this.code_name = tab.name.replace( / /g, '_' ).toLowerCase()
  this.locked = tab.locked || 0
  this.selected = tab.selected || 0

  Bottom_Tabs.push( this )

}

let Bottom_Tabs = []
let bottom_tabs = [
  {
    name: 'Quest Board',
    selected: 1,
    locked: 1
  }, {
    name: 'Ore Garden',
    locked: 1,
    selected: 0
  }
]

let load_bottom_tabs = () => {

  return new Promise( resolve => {

      Bottom_Tabs = []

      if ( localStorage.getItem( 'bottom_tabs' ) ) {
          bottom_tabs = JSON.parse( localStorage.getItem( 'bottom_tabs' ) )
      }

      bottom_tabs.forEach( bt => new Bottom_Tab( bt ))

      resolve()

  })

}
