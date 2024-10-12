let Adventurer = function() {

    let gender = get_random_num( 0, 1 )

    this.name = select_random_from_arr( adventurers[ gender ] )
    this.gender = gender == 0 ? 'Male' : 'Female'
}

let adventurers = [
    [
        // MALES
        'Syn',
        'Jimin',
        'Jason',
        'Jordan',
        'Kevin',
        'Andy',
        'Nick',
        'Luffy',
        'Zoro',
        'Saitama',
        'Ichigo',
        'Naruto',
        'Sasuke'
    ],
    [
        // FEMALES
        'Christine',
        'Nami'
    ],
]
