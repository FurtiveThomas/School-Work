let Tooltip = function() {

  this.hide = () => {
    TOOLTIP.style.display = 'none'
  }

  this.show = ( e, obj ) => {

    let str = ''
    let item;
    let tooltip_dimensions;
    let target_el_dimensions;

    TOOLTIP.style.display = 'flex'
    TOOLTIP.classList.remove( 'generation' )

    // build content
    switch ( obj.type ) {

      case 'pickaxe-socket':
      case 'inventory-item':
      case 'gem':
      case 'scroll':

        if ( obj.type == 'gem' ) item = O.current_gem
        if ( obj.type == 'inventory-item' ) item = S.inventory.items[ obj.inventory_index ]
        if ( obj.type == 'pickaxe-socket' ) item = S.pickaxe.item.sockets.socket[ obj.pickaxe_socket ]

        TOOLTIP.classList.add( 'gem-tooltip-container' )

          str += `
            <div class='gem-tooltip'>
              <div class='gem-image-container'>
                <img src='https://via.placeholder.com/40' >
              </div>
              <small class='gem-level'>Level ${ item.level } Gem</small>
              <h1>${ item.name }</h1>
              <p>+${ item.stat_amount } ${ item.stat_type }</p>
            </div>
          `

        break

      case 'generation':
        TOOLTIP.classList.add( 'generation' )
        str += `
          <div class='generation-tooltip'>
            <h1>Generation: ${ S.generation.level }</h1>
            <p>[ ${ beautify_number( S.generation.current_xp ) }/${ beautify_number( S.generation.needed_xp ) } ]</p>
            <p>XP gained on refine: ${ beautify_number( calculate_refine_rewards().xp ) }</p>
          </div>
        `

        break

      case 'skill':

        item = select_from_arr( Skills, obj.name )
        str += `
          <div class='skill-tooltip'>
            <img src='${ item.img }' />
            <div class='info'>
              <h1>${ item.name }</h1>
              `

              if ( item.locked ) {
                str += `
                  <div class='requirements'>
                    <p>Requires</p>
                    <ul>
                    `

                    item.skill_requirements.forEach( requirement => {

                      let skill = select_from_arr( Skills, requirement.code_name )

                      str += `<li class='${ skill.owned ? 'owned' : 'not-owned' }'>${ skill.name }</li>`

                    })


                    str += `
                    </ul>
                  </div>
                `
              }

              str += `
              <p class='skill-flavor_text'>${ item.flavor_text }</p>
              <p>${ item.desc }</p>
            </div>
          </div>
        `


        break

      case 'combo-shield-info':
        str += `
          <h3>Combo Shield</h3>
          <p>Combo Shields protect your current combo from a mis-strike</p>
          <hr>
          <p style='letter-spacing: .5px; font-size: 14px;'><span style='opacity: .6'>Combo Shields Owned:</span> <strong>${ S.combo_shield.owned }</strong></p>
          <p style='letter-spacing: .5px; font-size: 14px;'><span style='opacity: .6'>Combo Shields Available:</span> <strong>${ S.combo_shield.available }</strong></p>
          `
          if ( S.combo_shield.time_until_next ) {
            str += `
              <p>Time until next combo shield: ${ beautify_ms( S.combo_shield.time_until_next ) }</p>
            `
          }
        break

      case 'sharpness-info':
        str += `
          <div class='sharpness-info'>
            <h2>Sharpness</h2>
            <br/>
            <p><strong>Weak hits</strong> on the ore are affected by <strong>sharpness</strong>.</p>
            <p>The sharper your pickaxe, the more damage you inflict on weak hits.</p>
            <br/>
            <ul>
              <li>Total Sharpness: <strong>${ calculate_pickaxe_sharpness() }%</strong></li>
              <hr/>
              <li>Pickaxe Sharpness: <strong>${ S.pickaxe.item.sharpness }%</strong></li>
              <li>Bonus Sharpness: <strong>${ ( S.pickaxe.temporary_bonuses.sharpness + S.pickaxe.permanent_bonuses.sharpness ) }%</strong></li>
            </ul>
        </div>
        `
        break

      case 'hardness-info':
        str += `
          <div class='hardness-info'>
            <h2>Hardness</h2>
            <br/>
            <p><strong>Regular hits</strong> on the ore are affected by <strong>hardness</strong>.</p>
            <p>The harder your pickaxe is, the more damage you inflict on regular hits.</p>
            <br/>
            <ul>
              <li>Total Hardness: <strong>${ calculate_pickaxe_hardness() }%</strong></li>
              <hr/>
              <li>Pickaxe Hardness: <strong>${ S.pickaxe.item.hardness }%</strong></li>
              <li>Bonus Hardness: <strong>${ ( S.pickaxe.temporary_bonuses.hardness + S.pickaxe.permanent_bonuses.hardness ) }%</strong></li>
            </ul>
          </div>
        `
        break

      case 'achievement-square':
        item = select_from_arr( Achievements, obj.name )

        str += `
          <div class="top">
            <img src="${ item.img }" alt="achievement-img">
            <h1>${ item.name } <small style='color: rgba( 255, 255, 255, 0.5 ); font-size: 13px;'>[ ${ item.type } achievement ]</small></h1>
          </div>
          <div class="bottom">
            <p style='padding: 10px 0'>${ item.desc }</p>
            `

            let r = item.reward
            if ( r ) {
              if ( r.increase_weak_hit_multi ) {
                str += `<p style='color: lightgreen;' class='achievement-reward'>+ Permanently increase <strong>weak-hit</strong> multiplier by <strong>${ r.increase_weak_hit_multi }</strong></p>`
              }
              if ( r.increase_pickaxe_hardness ) {
                str += `<p style='color: lightgreen;' class='achievement-reward'>+ Permanently increase <strong>pickaxe hardness</strong> by <strong>${ r.increase_pickaxe_hardness }%</strong></p>`
              }
              if ( r.increase_pickaxe_sharpness ) {
                str += `<p style='color: lightgreen;' class='achievement-reward'>+ Permanently increase <strong>pickaxe sharpness</strong> by <strong>${ r.increase_pickaxe_sharpness }%</strong></p>`
              }
            }

            str += `<p style='color: rgba( 255, 255, 255, 0.5 ); padding-top: 10px;'> <i class='fa fa-calendar fa-1x'></i> &nbsp; Unlocked: ${ get_time_difference( item.time_won ) } </p>`

            if ( item.flavor_text ) {
              str += `<p style='font-size: 13px; padding-top: 10px; color: rgba( 255, 255, 255, 0.5 ); font-style: italic; text-align: right;'>${ item.flavor_text }</p>`
            }

            str += `
          </div>
        `

        break

      case 'smith_upgrade':
        item = select_from_arr( Smith_Upgrades, obj.name )

        str += `
          <div class="top" style='padding-bottom: 10px;'>
            <img src="./app/assets/images/${ item.img }.png" alt="smith upgrade image"/>
            <h1>${ item.name } ${ item.repeatable ? "<small>[ level: " + item.level + " ]</small>" : "" }</h1>
          </div>
          <div class="bottom" style='display: flex; flex-flow: row nowrap; justify-content: center;'>
            <div class="left" style='width: 20%; text-align: right; padding-right: 10px; border-right: 1px solid white;'>
              <p style='
                padding-bottom: 2px;
                display: flex;
                flex-flow: row nowrap;
                justify-content: flex-end;
                align-items: center;'>${ beautify_number( item.price ) } &nbsp; <img style='height: 15px;' src='./app/assets/images/refined-ore.png' /></p>
              <p style='padding-bottom: 2px;'>${ beautify_ms( item.duration ) } &nbsp; <i class="fa fa-clock-o fa-1x"></i></p>
            </div>
            <div class="right" style='width: 80%; padding-left: 10px'>
              <p>${ item.desc }</p>
            </div>
          </div>
        `

        if ( item.flavor_text ) {
          str += `<p class='flavor-text'>${ item.flavor_text }</p>`
        }
        
        break
      
      case 'upgrade':
        item = select_from_arr( Upgrades, obj.name )

        str += `
          <div class='top'>
            <img src='./app/assets/images/${ item.img }.png' alt='upgrade image' />
            <h1>${ item.name }</h1>
            <p class='upgrade-price ${ S.ores < item.price && 'not-enough' }'>${ beautify_number( item.price ) } ores</p>
          </div>
          <hr />
          <div class='bottom'>
            <p class='desc'>${ item.desc }</p>
            <p class='flavor-text'>${ item.flavor_text }</p>
          </div>
        `
        
        break

      case 'building':
        item = select_from_arr( Buildings, obj.name )

        str = `
          <div class='top'>
            <img src='./app/assets/images/${ item.img }.png' alt='building image' />
            <h1>${ item.name }</h1>
            <p class='building-price ${ S.ores < item.current_price && 'not-enough' }'>${ beautify_number( item.current_price ) } ores</p>
          </div>
          <hr />
          <div class='bottom'>
            <p class='desc'>${ item.desc }</p>
            <ul>
              <li>Each ${ item.name } generates <strong>${ beautify_number( item.production ) }</strong> OpS</li>
              `
              if ( item.owned > 0 ) {
                str += `<li><strong>${ item.owned }</strong> ${ item.owned <= 1 ? item.name : item.name_plural } generating <strong>${ beautify_number( item.production * item.owned ) }</strong> OpS </li>`
                str += `<li>Schools are currently generating <strong>${ calculate_building_ops( item.owned, item.production ) }%</strong> of your total OpS</li>`
              }
              str += `
            </ul>
            <p class='flavor-text'>${ item.flavor_text }</p>
          </div>
        `
        break

      default:
        break

    }

    TOOLTIP.innerHTML = str

    // position tooltip
    switch ( obj.type ) {

      case 'pickaxe-socket':
      case 'inventory-item':
      case 'gem':
        tooltip_dimensions = TOOLTIP.getBoundingClientRect()
        target_el_dimensions = e.target.getBoundingClientRect()
        TOOLTIP.style.left = ( target_el_dimensions.left + target_el_dimensions.right ) / 2 - tooltip_dimensions.width / 2 + 'px'
        TOOLTIP.style.top = e.target.getBoundingClientRect().bottom + 'px'
        // TOOLTIP.style.top = e.target.getBoundingClientRect().top - tooltip_dimensions.height + 'px'
        break

      case 'skill':
        tooltip_dimensions = TOOLTIP.getBoundingClientRect()
        TOOLTIP.style.left = ( MIDDLE_VERTICAL_SEPARATOR.getBoundingClientRect().left - tooltip_dimensions.width ) + 'px'
        TOOLTIP.style.top = ( e.target.getBoundingClientRect().top + e.target.getBoundingClientRect().height / 2 ) - tooltip_dimensions.height / 2 + 'px'
        break

      case 'generation':
        tooltip_dimensions = TOOLTIP.getBoundingClientRect()
        target_el_dimensions = e.target.getBoundingClientRect()

        TOOLTIP.style.left = ( target_el_dimensions.left + target_el_dimensions.right ) / 2 - tooltip_dimensions.width / 2 + 'px'
        TOOLTIP.style.top = TOPBAR_INVENTORY.getBoundingClientRect().bottom + 'px'
        break

      case 'combo-shield-info':
        TOOLTIP.style.left = e.clientX + 'px'
        TOOLTIP.style.top = e.clientY + 'px'
        break

      case 'achievement-square':
        tooltip_dimensions = TOOLTIP.getBoundingClientRect()
        target_el_dimensions = e.target.getBoundingClientRect()
        TOOLTIP.style.left = ( target_el_dimensions.left + target_el_dimensions.right ) / 2 - tooltip_dimensions.width / 2 + 'px'
        TOOLTIP.style.top = e.target.getBoundingClientRect().top - tooltip_dimensions.height + 'px'
        break

      default:
        tooltip_dimensions = TOOLTIP.getBoundingClientRect()
        TOOLTIP.style.left = ( MIDDLE_VERTICAL_SEPARATOR.getBoundingClientRect().left - tooltip_dimensions.width ) + 'px'
        TOOLTIP.style.top = e.target.getBoundingClientRect().top + 'px'
        break

    }


    
  }

}