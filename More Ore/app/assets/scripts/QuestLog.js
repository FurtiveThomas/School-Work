let QuestLog = function() {

    this.history = []

    this.append = ( text ) => {

        if ( !QUEST_TEXT_LOG.classList.contains( 'active' ) ) {
            QUEST_TEXT_LOG.classList.add( 'active' )
        }

        let p = document.createElement( 'p' )
        p.innerHTML = `> ${ text }`

        QUEST_TEXT_LOG.append( p )
        this.history.push( text )

        QUEST_TEXT_LOG.scrollTop = QUEST_TEXT_LOG.scrollHeight

    }

    this.clear = () => {
        QUEST_TEXT_LOG.classList.remove( 'active' )
        QUEST_TEXT_LOG.innerHTML = ''
        this.history = []
    }

    this.rebuild_history = () => {
        if ( S.quest.state != 'completed' ) {
            QUEST_TEXT_LOG.classList.add( 'active' )
            let str = ''
            this.history.forEach( log => {
                str += `
                    <p>> ${ log }</p>
                `
            })
            QUEST_TEXT_LOG.innerHTML = str
        }
    }
}

let load_quest_log = () => {

    return new Promise( resolve => {
        
        if ( localStorage.getItem( 'quest_log' ) ) {

            QL = new QuestLog()
            QL.history = JSON.parse( localStorage.getItem( 'quest_log' ) )

            QL.rebuild_history()
        }

        resolve()
    })
}