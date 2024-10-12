const VERSION = 0.01;

let base_ore_max_hp = 50;

const BODY = s("body");
const CONTAINER = s(".container");
const GAME_CONTAINER = s(".game-container");
const ORE_HP = s(".ore-hp");
const ORE_SPRITE = s(".ore-sprite");
const RIGHT_CONTAINER = s(".right-container");
const TOPBAR_INVENTORY_CONTAINER = s(".topbar-inventory-container");
const TOPBAR_INVENTORY = s(".topbar-inventory");
const ORE_CONTAINER = s(".ore-container");
const ORE_WEAK_SPOT_CONTAINER = s(".ore-weak-spot-container");
const ORE_WEAK_SPOT = s(".ore-weak-spot");
const LEFT_VERTICAL_SEPARATOR = s(".left-vertical-separator");
const MIDDLE_VERTICAL_SEPARATOR = s(".middle-vertical-separator");
const RIGHT_VERTICAL_SEPARATOR = s(".right-vertical-separator");
const TORCH_LEFT = s(".torch-left");
const TORCH_RIGHT = s(".torch-right");
const TAB_CONTENT = s(".tab-content");
const TEXT_SCROLLER_CONTAINER = s(".text-scroller-container");
const TOOLTIP = s(".tooltip");
const SETTINGS_CONTAINER = s(".settings-container");
const TABS_CONTAINER = s(".tabs-container");
const AUTOMATER_WRAPPER = s(".automater-wrapper");
const AUTOMATER_CONTAINER = s(".automater-container");
const AUTOMATER_HEADER = s(".automater-wrapper > header");
const ACHIEVEMENT_NOTIFICATION_CONTAINER = s(
  ".achievement-notification-container"
);
const FOOTER = s("footer");
const FOOTER_VERSION = s(".version-number");
const BOTTOM_AREA_TABS = s(".bottom-area-tabs");
const COMBO_SIGN_CONTAINER = s(".combo-sign-container");
const ORES_AMOUNT = s("#ores-amount");
const REFINED_ORES_AMOUNT = s("#refined-ores-amount");
const GENERATION_LVL = s("#generation-lvl");
const LOADING_SCREEN = s(".loading-screen");
const LOADING_TEXT = s(".loading-text");
const QUEST_AREA_CONTAINER = s(".quest-area-container");
const HERO = s(".hero");
const BOOST_NOTIFIER = s(".boost-notifier");
const QUEST_TEXT_LOG = s(".quest-text-log");

let S = new State().state;
let RN = new RisingNumber();
let TS = new TextScroller();
let TT = new Tooltip();
let SMITH = new Smith();
let QL = new QuestLog();

let O = {
  rebuild_bottom_tabs: 1,

  rebuild_store_tab: 1,
  rebuild_smith_tab: 0,
  rebuild_skill_tab: 0,

  reposition_elements: 1,
  recalculate_ops: 1,
  recalculate_opc: 1,

  ore_madness_active: 0,

  current_tab: "store",

  quest_initialized: false,
  can_boost: true,

  inventory_accordion_is_open: 0,
  item_popup_visible: false,

  window_blurred: false,
  counter: 0,
};

let init_game = async () => {
  await load_game();
  update_ore_sprite(true);
  game_loop();
  game_loop_1s();
  S.tabs = Tabs;
  build_tabs();

  if (!S.locked.fragility_spectacles) generate_weak_spot();

  handle_text_scroller();
  ORE_SPRITE.addEventListener("click", handle_click);
  ORE_WEAK_SPOT.addEventListener("click", (e) => {
    handle_click(e, "weak-spot");
  });
  BOOST_NOTIFIER.addEventListener("animationend", () =>
    BOOST_NOTIFIER.classList.remove("clicked")
  );
  build_automater_visibility_toggle_btn();
  build_footer();
  earn_offline_resources();

  window.addEventListener("click", () => {
    if (O.item_popup_visible) {
      remove_el(s(".inventory-item-click-popup"));
      O.item_popup_visible = false;
    }
  });

  if (S.stats.total_clicks == 0) tutorial_click_the_rock();
};

let save_game = () => {
  S.misc.last_save = Date.now();

  localStorage.setItem("state", JSON.stringify(S));
  localStorage.setItem("buildings", JSON.stringify(Buildings));
  localStorage.setItem("upgrades", JSON.stringify(Upgrades));
  localStorage.setItem("achievements", JSON.stringify(Achievements));
  localStorage.setItem("text_scroller", JSON.stringify(TS.texts));
  localStorage.setItem("smith_upgrades", JSON.stringify(Smith_Upgrades));
  localStorage.setItem("smith", JSON.stringify(SMITH));
  localStorage.setItem("bottom_tabs", JSON.stringify(Bottom_Tabs));
  localStorage.setItem("tabs", JSON.stringify(Tabs));
  localStorage.setItem("skills", JSON.stringify(Skills));
  localStorage.setItem("quests", JSON.stringify(Quests));
  localStorage.setItem("quest_log", JSON.stringify(QL.history));

  notify("Saved Game");
};

let load_game = async () => {
  await load_state();
  console.log("state loaded");

  await load_buildings();
  console.log("buildings loaded");

  await load_upgrades();
  console.log("upgrades loaded");

  await load_achievements();
  console.log("achievements loaded");

  await load_text_scroller();
  console.log("text scroller loaded");

  await load_smith_upgrades();
  console.log("smith upgrades loaded");

  await load_smith();
  console.log("smith loaded");

  await load_bottom_tabs();
  console.log("bottom tabs loaded");

  await load_tabs();
  console.log("tabs loaded");

  await load_skills();
  console.log("skills loaded");

  await load_quests();
  console.log("quests loaded");

  await load_quest_log();
  console.log("quest log loaded");

  notify("Save loaded successfully");

  LOADING_SCREEN.addEventListener("transitionend", () =>
    remove_el(LOADING_SCREEN)
  );
  LOADING_SCREEN.classList.add("finished-loading");
};

let notify = (text, color = "white", type = null) => {
  let div = document.createElement("div");
  div.innerHTML = text;
  div.style.position = "absolute";
  div.style.padding = "10px 15px";
  div.style.zIndex = 2;
  div.style.border = "5px ridge #3c3c3c";
  div.style.borderBottom = "none";
  div.style.boxShadow =
    "0 0 10px #000 inset, 0 0 20px rgba( 255, 255, 255, 0.3)";
  div.style.textShadow = "0 0 10px";
  div.style.background = "#222";
  div.style.bottom = "0";
  div.style.right = "0";
  div.style.color = color;
  div.style.animation = "upDown 2s";
  div.addEventListener("animationend", () => {
    remove_el(div);
  });

  CONTAINER.append(div);

  if (type == "error") play_sound("not_enough");
};

let wipe_save = () => {
  localStorage.clear();
  location.reload();
};

let build_footer = () => {
  FOOTER_VERSION.innerHTML = VERSION;
};

let on_blur = () => {
  O.window_blurred = true;
};

let on_focus = () => {
  O.window_blurred = false;
};

let earn_offline_resources = () => {
  console.log("earn offline resources firing", S);

  let last_time = S.misc.last_save;
  let current_time = Date.now();

  if (last_time) {
    let amount_of_time_passed_ms = current_time - last_time;
    let amount_of_time_passed_seconds = amount_of_time_passed_ms / 1000;
    let amount_to_gain = amount_of_time_passed_seconds * S.ops;

    SMITH.current_progress += amount_of_time_passed_ms;
    if (S.quest.state == "in progress")
      S.quest.current_quest_progress += amount_of_time_passed_ms;

    if (amount_to_gain > 1) {
      if (!s(".offline-gain-popup")) {
        let wrapper = document.createElement("div");
        wrapper.classList.add("wrapper");
        wrapper.innerHTML = `
          <div class='offline-gain-popup'>
            <i onclick='remove_wrapper()' class='fa fa-times fa-1x'></i>
            <h1>Ore Warehouse</h1>
            <hr />
            <small>- while away for <strong>${beautify_ms(
              amount_of_time_passed_ms
            )}</strong> -</small>
            <p>You earned <strong>${beautify_number(
              amount_to_gain
            )}</strong> ores!</p>
            <button onclick='remove_wrapper()'>ok</button>
          </div>
        `;

        CONTAINER.append(wrapper);
      }
    }

    earn(amount_to_gain);
    handle_combo_shields(amount_of_time_passed_ms);
  }
};

let play_sound = (name, file_type = "wav", base_vol = 1) => {
  if (S.prefs.sfx_muted) return;

  let sound = new Audio(`./app/assets/sounds/${name}.${file_type}`);
  sound.volume = S.prefs.sfx_volume * base_vol;
  sound.play();
};

let earn = (amount, alter_hp = true) => {
  if (alter_hp) update_ore_hp(amount);

  S.stats.total_ores_earned += amount;
  S.stats.current_ores_earned += amount;
  S.ores += amount;

  if (S.locked.refine_btn && S.stats.total_ores_earned >= 1000000)
    unlock_refine_btn();

  if (S.stats.current_ores_earned >= 200) unlock_upgrade("baby_knowledge");
  if (S.stats.current_ores_earned >= 16500)
    unlock_upgrade("adolescent_knowledge");
  if (S.stats.current_ores_earned >= 1.35 * MILLION)
    unlock_upgrade("adult_knowledge");
  if (S.stats.current_ores_earned >= 521 * MILLION)
    unlock_upgrade("elder_knowledge");
  if (S.stats.current_ores_earned >= 66.66666 * BILLION)
    unlock_upgrade("eldritch_knowledge");
};

let earn_refined_ores = (amount) => {
  S.refined_ores += amount;
  S.stats.total_refined_ores_earned += amount;
};

let spend = (amount) => {
  S.ores -= amount;
  play_sound("buy_sound");
};

let position_elements = () => {
  O.reposition_elements = 0;

  let left_vertical_separator_dimensions = LEFT_VERTICAL_SEPARATOR.getBoundingClientRect();
  let middle_vertical_separator_dimensions = MIDDLE_VERTICAL_SEPARATOR.getBoundingClientRect();
  let torch_dimensions = TORCH_LEFT.getBoundingClientRect();
  let text_scroller_container_dimensions = TEXT_SCROLLER_CONTAINER.getBoundingClientRect();

  // Position torches to the separators
  TORCH_LEFT.style.left = left_vertical_separator_dimensions.right + "px";
  TORCH_RIGHT.style.left =
    middle_vertical_separator_dimensions.left - torch_dimensions.width + "px";

  // Position settings container
  if (!S.locked.refine_btn) s(".refine-btn").style.display = "block";
  let settings_container_dimensions = SETTINGS_CONTAINER.getBoundingClientRect();
  SETTINGS_CONTAINER.style.top =
    text_scroller_container_dimensions.top -
    settings_container_dimensions.height +
    "px";
  SETTINGS_CONTAINER.style.left =
    middle_vertical_separator_dimensions.left -
    settings_container_dimensions.width +
    "px";

  // Position automater
  if (!S.automater.automater_accordion_hidden) {
    AUTOMATER_WRAPPER.style.display = "flex";
    if (AUTOMATER_WRAPPER.classList.contains("open")) {
      let automater_wrapper_dimensions = AUTOMATER_WRAPPER.getBoundingClientRect();
      AUTOMATER_WRAPPER.style.left =
        middle_vertical_separator_dimensions.left -
        automater_wrapper_dimensions.width +
        "px";
    } else {
      let automater_header_dimensions = AUTOMATER_HEADER.getBoundingClientRect();
      AUTOMATER_WRAPPER.style.left =
        middle_vertical_separator_dimensions.left -
        automater_header_dimensions.width +
        "px";
    }
    AUTOMATER_WRAPPER.style.top = "30%";
  }

  // Position bottom area tab
  let bottom_area_tabs_dimensions = BOTTOM_AREA_TABS.getBoundingClientRect();
  BOTTOM_AREA_TABS.style.top =
    text_scroller_container_dimensions.top -
    bottom_area_tabs_dimensions.height +
    "px";

  // Position combo sign
  if (!S.locked.combo_sign) {
    setTimeout(() => {
      let topbar_inventory_container_dimensions = TOPBAR_INVENTORY_CONTAINER.getBoundingClientRect();
      build_combo_sign();
      COMBO_SIGN_CONTAINER.style.top =
        topbar_inventory_container_dimensions.bottom + "px";
      COMBO_SIGN_CONTAINER.style.left =
        topbar_inventory_container_dimensions.left + "px";
      COMBO_SIGN_CONTAINER.style.animation = "slide_down_in .5s forwards";
    }, 1000);
  }
};

// ==== RIGHT SIDE SHIT  =================================================================

let change_tab = (code_name) => {
  let t = select_from_arr(S.tabs, code_name);

  // if the clicked tab isn't currently selected
  if (t.selected != 1) {
    // loop through all tabs
    S.tabs.forEach((tab) => {
      // if the current looped tab is equal to the clicked tab
      if (tab.code_name == t.code_name) {
        // set that tab to selected
        tab.selected = 1;
        O.current_tab = t.code_name;
      } else {
        tab.selected = 0;
      }
    });
    build_tabs();
  }
};

let build_tabs = () => {
  let str = "";

  S.tabs.forEach((tab) => {
    if (!tab.hidden) {
      str += `
        <div 
          class='tab ${tab.name}-tab ${
        O.current_tab == tab.code_name && "selected"
      }'
          onclick='change_tab( "${tab.code_name}" ); build_${
        tab.code_name
      }_tab()'
        >${tab.name}</div>
      `;
    }
  });

  TABS_CONTAINER.innerHTML = str;
};

let build_store_tab = () => {
  let str = "";
  str += build_upgrades();
  str += build_buy_amount();
  str += build_buildings();

  TAB_CONTENT.innerHTML = str;
  TAB_CONTENT.classList.remove("smith", "skills");
  TAB_CONTENT.classList.add("store");

  O.rebuild_store_tab = 0;
};

let build_upgrades = () => {
  let str = '<div class="upgrades-container">';
  let index = 0;

  let sorted_upgrades = Upgrades.sort((a, b) => a.price - b.price);

  sorted_upgrades.forEach((upgrade) => {
    if (!upgrade.hidden && !upgrade.owned) {
      str += `
        <div 
          `;
      if (upgrade.background_color) {
        str += `style='background-color: ${upgrade.background_color}'`;
      }

      str += `
          class='upgrade' 
          onclick="Upgrades[ ${index} ].buy( event )" 
          onmouseover="play_sound( 'store_item_hover' ); TT.show( event, { name: '${upgrade.code_name}', type: 'upgrade' } )" 
          onmouseout="TT.hide()"
          >
          <img src="./app/assets/images/${upgrade.img}.png" />
        </div>
      `;
    }

    index++;
  });

  str += "</div>";

  return str;
};

let build_buy_amount = () => {
  let str = "";

  str += `
  
    <div class='buy-amount-container'>
      <p>Buy Amount:</p>
      <div>
        <p
          onclick='change_buy_amount(1)'
          ${S.buy_amount == 1 && 'class="selected"'}>
          1
        </p>
        <p
          onclick='change_buy_amount(10)'
          ${S.buy_amount == 10 && 'class="selected"'}>
          10
        </p>
        <p
          onclick='change_buy_amount(100)'
          ${S.buy_amount == 100 && 'class="selected"'}>
          100
        </p>
      </div>
    </div>
  
  `;

  return str;
};

let change_buy_amount = (amount) => {
  S.buy_amount = amount;
  O.rebuild_store_tab = 1;
};

let build_buildings = () => {
  let str = "";
  let index = 0;
  Buildings.forEach((building) => {
    if (building.hidden == 0) {
      str += `
        <div
          id='building-${building.code_name}' 
          class="building" 
          onclick="Buildings[ ${index} ].buy( event )" 
          onmouseover="play_sound( 'store_item_hover' ); TT.show( event, { name: '${
            building.code_name
          }', type: 'building' } )" 
          onmouseout="TT.hide()"
          >
          <div class="left">
            <img src="./app/assets/images/${
              building.img
            }.png" alt="building image"/>
          </div>
          <div class="middle">
            <h1>${building.name} ${
        S.buy_amount != 1 ? "x" + S.buy_amount : ""
      }</h1>
            <p><img class='ore-small' src='./app/assets/images/ore.png' /> <span class='${
              S.ores <
                get_geometric_sequence_price(
                  building.base_price,
                  building.price_scale,
                  building.owned,
                  building.current_price
                ).price && "not-enough"
            }'>${beautify_number(
        get_geometric_sequence_price(
          building.base_price,
          building.price_scale,
          building.owned,
          building.current_price
        ).price
      )}</span> </p>
          </div>
          <div class="right">
            <h1>${building.owned}</h1>
          </div>
        </div>
      `;
    } else if (building.hidden == 1) {
      str += `
        <div class="building hidden"">
          <div class="left">
          <img src="./app/assets/images/${building.img}.png" alt="building image"/>
          </div>
          <div class="middle">
            <h1>???</h1>
            <p> &nbsp; </p>
          </div>
        </div>
      `;
    }

    index++;
  });

  return str;
};

let update_building_prices = () => {
  Buildings.forEach((building) => {
    if (!building.hidden) {
      building.current_price = get_geometric_sequence_price(
        building.base_price,
        building.price_scale,
        building.owned,
        building.current_price
      ).price;

      let building_price = s(`#building-${building.code_name} .middle p span`);

      if (S.ores < building.current_price) {
        building_price.classList.add("not-enough");
      } else {
        building_price.classList.remove("not-enough");
      }
    }
  });
};

let build_smith_tab = () => {
  O.rebuild_smith_tab = 0;

  let str = "";

  str += build_inventory_accordion();

  str +=
    '<div class="smith-progress-container" onclick="SMITH.progress_click()">';
  str += build_pickaxe_update();
  str += "</div>";
  str += "<div class='horizontal-separator thin dark'></div>";

  str += '<div class="smith-upgrades-wrapper">';
  str += '<div class="smith-upgrades-container">';
  str += '<div class="smith-upgrades">';
  str += build_smith_upgrades();
  str += "</div></div>";

  str += "</div>";

  TAB_CONTENT.innerHTML = str;
  TAB_CONTENT.classList.add("smith");
  TAB_CONTENT.classList.remove("store", "skills");
};

let build_pickaxe_update = (direct = false) => {
  let str = "";

  if (!is_empty(SMITH.upgrade_in_progress)) {
    str += `
      <img src="./app/assets/images/${SMITH.upgrade_in_progress.img}.png" alt="smith upgrade"/>
      <div>
        <p>${SMITH.upgrade_in_progress.name}</p>
        <div class="progress-bar-container">
          <div class="progress-bar"></div>
        </div>
      </div>
    `;
  }

  // is_empty( SMITH.upgrade_in_progress ) ?
  //   str += '<p style="text-align: center; width: 100%; opacity: 0.5">No upgrade in progress</p>'
  //   :
  //   str += `
  //     <img src="${ SMITH.upgrade_in_progress.img }" alt="smith upgrade"/>
  //     <div>
  //       <p>${ SMITH.upgrade_in_progress.name }</p>
  //       <div class="progress-bar-container">
  //         <div class="progress-bar"></div>
  //       </div>
  //     </div>
  //   `

  if (direct) {
    if (s(".smith-progress-container")) {
      s(".smith-progress-container").innerHTML = str;
    }
    return;
  }

  return str;
};

let build_smith_upgrades = (direct = false) => {
  let owned_upgrades = [];
  let repeatables = [];
  let non_repeatables = [];

  Smith_Upgrades.forEach((upgrade) => {
    if (upgrade.owned) {
      owned_upgrades.push(upgrade);
    } else {
      upgrade.repeatable
        ? repeatables.push(upgrade)
        : non_repeatables.push(upgrade);
    }
  });

  let str = "";

  str += '<p class="available-upgrade-text">Available Upgrades</p>';

  str += '<div class="repeatables">';
  repeatables.forEach((upgrade) => {
    str += `
      <div
        class='smith-upgrade repeatable'
        onmouseover='TT.show( event, { name: "${
          upgrade.code_name
        }", type: "smith_upgrade" } )'
        onmouseout='TT.hide()'
        onclick='start_smith_upgrade( Smith_Upgrades, "${upgrade.code_name}" )'
      >
        <p class='upgrade-level'>Level: ${upgrade.level}</p>
        <img src="./app/assets/images/${upgrade.img}.png">
        <p class="upgrade-price"><img src="./app/assets/images/refined-ore.png"> ${beautify_number(
          upgrade.price
        )}</p>
      </div>
    `;
  });

  str += "</div>";

  non_repeatables
    .sort((a, b) => a.price - b.price)
    .forEach((upgrade) => {
      upgrade.type = "smith_upgrade";
      if (!upgrade.owned && !upgrade.locked) {
        str += `
          <div 
            class="smith-upgrade non-repeatable"
            onmouseover='TT.show( event, { name: "${upgrade.code_name}", type: "smith_upgrade" }); handle_smith_upgrade_hover( "${upgrade.code_name}" )'
            onmouseout='TT.hide()'
            onclick='start_smith_upgrade( Smith_Upgrades, "${upgrade.code_name}")'
            >
              <img src="./app/assets/images/${upgrade.img}.png">
              <div>
                <h1>${upgrade.name}</h1>
                <p><img src="./app/assets/images/refined-ore.png"> ${upgrade.price}</p>
              </div>
            `;

        if (upgrade.new) str += '<div class="new">New!</div>';

        str += `</div>`;
      } else {
        if (upgrade.owned) owned_upgrades.push(upgrade);
      }
    });

  if (owned_upgrades.length > 0) {
    str += "<p>Owned Upgrades</p>";

    owned_upgrades.forEach((upgrade) => {
      str += `
        <div 
          class="smith-upgrade owned"
          style='background: url("${upgrade.img}"); opacity: 0.4'
          onmouseover='TT.show( event, { name: "${upgrade.code_name}", type: "smith_upgrade" })'
          onmouseout='TT.hide()'
          >
          <img src="./app/assets/images/${upgrade.img}.png">
          <div>
            <h1>${upgrade.name}</h1>
            <p><img src="./app/assets/images/refined-ore.png"> ${upgrade.price}</p>
          </div>
        </div>
      `;
    });
  }

  if (direct) {
    if (s(".smith-upgrades")) {
      s(".smith-upgrades").innerHTML = str;
    }
    return;
  }

  return str;
};

let handle_smith_upgrade_hover = (code_name) => {
  let upgrade = select_from_arr(Smith_Upgrades, code_name);

  if (upgrade.new) {
    upgrade.new = false;
    build_smith_upgrades(true);
  }
};

let toggle_inventory_accordion = () => {
  s(".inventory-accordion").classList.toggle("open");
  O.inventory_accordion_is_open = !O.inventory_accordion_is_open;
};

// ==== SKILL SHIT ========================================================================

let build_skills_tab = async () => {
  O.rebuild_skill_tab = 0;

  let str = "";

  str += build_skills_header();

  str += await build_skills();

  TAB_CONTENT.innerHTML = str;
  TAB_CONTENT.classList.remove("store", "smith");
  TAB_CONTENT.classList.add("skills");

  let skills_container = s(".skills-container");
  skills_container.addEventListener("scroll", () => draw_skill_lines());

  position_skill_lines_canvas();
};

let build_skills_header = (direct = false) => {
  let str = `
    <header class='skills-header'>
      <h1>Generation: ${S.generation.level}</h1>
      <p>Available Knowledge Points: <strong>${S.generation.knowledge_points}</strong></p>
    </header>
  `;

  if (direct) {
    s(".skills-header").innerHTML = `
      <h1>Generation: ${S.generation.level}</h1>
      <p>Available Knowledge Points: <strong>${S.generation.knowledge_points}</strong></p>
    `;
    return;
  }

  return str;
};

let build_skills = () => {
  return new Promise((resolve) => {
    let middle = (TAB_CONTENT.offsetHeight - 100) / 2;

    let str = "";

    str += '<div class="skills-container">';
    str += '<canvas class="skill-lines-container"></canvas>';

    Skills.forEach((skill, i) => {
      let skill_height = 40;
      let skill_width = 40;
      let column_spacing = 60;
      let row_spacing = 30;

      let column_position =
        skill.position.col * (skill_width + column_spacing) - 50;
      let row_position =
        middle -
        skill_height / 2 +
        skill.position.row * (skill_height + row_spacing);

      if (skill.skill_classes.includes("small")) {
        skill_height = 30;
        skill_width = 30;
        column_position += 5;
        row_position += 5;
      }

      str += `
        <div
          id='skill-${skill.id}'
          class='skill ${skill.locked ? "locked" : ""} ${
        skill.owned ? "owned" : "not-owned"
      } ${skill.skill_classes ? skill.skill_classes : ""}'
          onclick='Skills[ ${i} ].level_up( event )'
          onmouseover='TT.show( event, { name: "${
            skill.code_name
          }", type: "skill" } )'
          onmouseout='TT.hide()'
          style='
            left: ${column_position}px;
            top: ${row_position}px;
            height: ${skill_height}px;
            width: ${skill_width}px;
            background-image: url( "${skill.img}" );
          '
        >
        </div>
      `;
    });

    str += "</div>";

    resolve(str);
  });
};

let position_skill_lines_canvas = () => {
  let canvas = document.querySelector(".skill-lines-container");
  let skills_container = document.querySelector(".skills-container");
  let skills_container_dimensions = skills_container.getBoundingClientRect();

  canvas.width = skills_container_dimensions.width;
  canvas.height = skills_container_dimensions.height;

  console.log();

  canvas.style.position = "fixed";
  canvas.style.top = skills_container_dimensions.top + "px";
  canvas.style.left = skills_container_dimensions.left + "px";
  canvas.style.pointerEvents = "none";

  draw_skill_lines();
};

let draw_skill_lines = () => {
  let c = s("canvas");
  let ctx = c.getContext("2d");

  ctx.clearRect(0, 0, c.width, c.height);

  let scroll_offset = s(".skills-container").scrollLeft;
  let line_break = 20;

  Skills.forEach((skill) => {
    console.log("drawing lines for:", skill.name);

    let lines = skill.unlock_function.unlock_skills;

    if (lines) {
      lines.forEach((line) => {
        let target_skill = select_from_arr(Skills, line[0]);
        let target_skill_el = s(`#skill-${target_skill.id}`);
        let base_skill_el = s(`#skill-${skill.id}`);

        ctx.strokeStyle = skill.owned ? "#fff" : "#555";
        ctx.lineWidth = skill.owned ? 3 : 1;

        let p = get_skill_line_positions(
          line[1],
          line[2],
          base_skill_el,
          target_skill_el,
          scroll_offset
        );

        ctx.beginPath();
        ctx.moveTo(p.base_position.x, p.base_position.y);

        if (
          skill.position.row != target_skill.position.row &&
          (line[1] == "right" || line[1] == "left")
        ) {
          let middle_distance =
            (target_skill_el.offsetLeft -
              (base_skill_el.offsetLeft + base_skill_el.offsetWidth)) /
            2;

          ctx.lineTo(p.base_position.x + middle_distance, p.base_position.y);
          ctx.lineTo(p.base_position.x + middle_distance, p.target_position.y);
          ctx.lineTo(p.target_position.x, p.target_position.y);
        } else if (
          skill.position.row != target_skill.position.row &&
          line[1] == "top" &&
          line[2] == "left"
        ) {
          ctx.lineTo(p.base_position.x, p.target_position.y);
          ctx.lineTo(p.target_position.x, p.target_position.y);
        } else {
          ctx.lineTo(p.target_position.x, p.target_position.y);
        }

        ctx.stroke();
        ctx.closePath();
      });
    }

    console.log("COMPLETED DRAWING LINES FOR SKILL:", skill.name);
  });
};

let get_skill_line_positions = (
  from,
  to,
  base_skill_el,
  target_skill_el,
  scroll_offset
) => {
  let positions = {};

  let horizontal_middle = (el) => el.offsetLeft + el.offsetWidth / 2;
  let vertical_middle = (el) => el.offsetTop + el.offsetHeight / 2;
  let get_right_side = (el) => el.offsetLeft + el.offsetWidth;
  let get_bottom_side = (el) => el.offsetTop + el.offsetHeight;

  if (from == "right") {
    positions.base_position = {
      x: get_right_side(base_skill_el) - scroll_offset,
      y: vertical_middle(base_skill_el),
    };
  }

  if (from == "top") {
    positions.base_position = {
      x: horizontal_middle(base_skill_el) - scroll_offset,
      y: base_skill_el.offsetTop,
    };
  }

  if (from == "bottom") {
    positions.base_position = {
      x: horizontal_middle(base_skill_el) - scroll_offset,
      y: get_bottom_side(base_skill_el),
    };
  }

  if (to == "left") {
    positions.target_position = {
      x: target_skill_el.offsetLeft - scroll_offset,
      y: vertical_middle(target_skill_el),
    };
  }

  if (to == "top") {
    positions.target_position = {
      x: horizontal_middle(target_skill_el) - scroll_offset,
      y: target_skill_el.offsetTop,
    };
  }

  if (to == "bottom") {
    positions.target_position = {
      x: horizontal_middle(target_skill_el) - scroll_offset,
      y: get_bottom_side(target_skill_el),
    };
  }

  console.log(positions);
  return positions;
};

// ========================================================================================

let calculate_pickaxe_damage = () => {
  let damage = S.pickaxe.item.damage;

  damage += S.pickaxe.permanent_bonuses.damage;

  let flat_damage = ["ruby"];
  let percent_damage = ["citrine"];

  if (S.pickaxe.item.sockets) {
    S.pickaxe.item.sockets.socket.forEach((socket) => {
      if (!is_empty(socket)) {
        if (flat_damage.includes(socket.gem_type)) damage += socket.stat_amount;
        if (percent_damage.includes(socket.gem_type))
          damage += damage * socket.stat_amount;
      }
    });
  }

  return damage;
};

let calculate_pickaxe_sharpness = () => {
  let sharpness = 0;

  sharpness += S.pickaxe.item.sharpness;

  sharpness += S.pickaxe.temporary_bonuses.sharpness;
  sharpness += S.pickaxe.permanent_bonuses.sharpness;

  let flat_sharpness = ["sapphire", "diamond"];
  let percent_sharpness = ["alexandrite", "vibranium"];

  if (S.pickaxe.item.sockets) {
    S.pickaxe.item.sockets.socket.forEach((socket) => {
      if (!is_empty(socket)) {
        if (flat_sharpness.includes(socket.gem_type))
          sharpness += socket.stat_amount;
        if (percent_sharpness.includes(socket.gem_type))
          sharpness += sharpness * socket.stat_amount;
      }
    });
  }

  return sharpness;
};

let calculate_pickaxe_hardness = () => {
  let hardness = 0;

  hardness += S.pickaxe.item.hardness;
  hardness += S.pickaxe.temporary_bonuses.hardness;
  hardness += S.pickaxe.permanent_bonuses.hardness;

  let flat_hardness = ["turquoise", "diamond"];
  let percent_hardness = ["amethyst", "vibranium"];
  if (S.pickaxe.item.sockets) {
    S.pickaxe.item.sockets.socket.forEach((socket) => {
      if (!is_empty(socket)) {
        if (flat_hardness.includes(socket.gem_type))
          hardness += socket.stat_amount;
        if (percent_hardness.includes(socket.gem_type))
          hardness += hardness * socket.stat_amount;
      }
    });
  }

  return hardness;
};

let build_automaters = () => {
  let dd = s(".automater.display").getBoundingClientRect();
  s(".automater .owned").innerHTML = S.automater.available;

  Automaters.forEach((automater, i) => {
    if (!automater.active) {
      let el = document.createElement("div");
      el.classList.add("automater", "real");
      el.style.top = dd.top + "px";
      el.style.left = dd.left + "px";
      el.style.position = "absolute";
      el.id = `automater-${i}`;
      el.innerHTML = `
          <div class="top-bar">
            <i onclick='Automaters[${i}].remove("${el.id}")' class="fa fa-times"></i>
          </div>
          <div class="automater-target">
            <img src="./app/assets/images/misc-crosshair.png" alt="crosshair-img">
          </div>
      `;

      GAME_CONTAINER.append(el);
    }
  });

  document.querySelectorAll(".automater.real").forEach((el) => {
    dragNdrop({
      element: el,
      callback: () => {
        let id = parseInt(el.id.slice(-1));
        el.classList.add("set");
        Automaters[id].set(el);
      },
    });
  });
};

let build_automater_visibility_toggle_btn = () => {
  let el = document.querySelector(".automater-toggle-visibility");
  el.innerHTML = `
    <i class="fa fa-eye-slash fa-1x"></i>
    <label class="switch">
      <input onchange='toggle_automater_visibility()' type="checkbox">
      <span class="slider round"></span>
    </label>
  `;
};

let toggle_automater_visibility = () => {
  S.automater.automater_visible = !S.automater.automater_visible;
  document.querySelectorAll(".automater.real").forEach((el) => {
    console.log(" el", el);
    el.classList.toggle("hidden");
  });
};

let toggle_automater_accordion = () => {
  console.log("togglng");
  let automater_header_dimensions = AUTOMATER_HEADER.getBoundingClientRect();
  let AUTOMATER_WRAPPER_dimensions = AUTOMATER_WRAPPER.getBoundingClientRect();
  let middle_vertical_separator_dimensions = MIDDLE_VERTICAL_SEPARATOR.getBoundingClientRect();
  if (AUTOMATER_WRAPPER.classList.contains("open")) {
    AUTOMATER_WRAPPER.classList.remove("open");
    AUTOMATER_WRAPPER.style.left =
      middle_vertical_separator_dimensions.left -
      automater_header_dimensions.width +
      "px";
  } else {
    AUTOMATER_WRAPPER.classList.add("open");
    AUTOMATER_WRAPPER.style.left =
      middle_vertical_separator_dimensions.left -
      AUTOMATER_WRAPPER_dimensions.width +
      "px";
  }
};

AUTOMATER_WRAPPER.addEventListener("transitionend", () => {
  if (AUTOMATER_WRAPPER.classList.contains("open")) {
    build_automaters();
  } else {
    document.querySelectorAll(".automater.real").forEach((el) => {
      if (!el.classList.contains("set")) {
        remove_el(el);
      }
    });
  }
});

let start_smith_upgrade = (arr, code_name) => {
  let upgrade = select_from_arr(arr, code_name);

  if (is_empty(SMITH.upgrade_in_progress)) {
    SMITH.start_upgrade(upgrade);
  }
};

let calculate_opc = (type) => {
  let opc = S.pickaxe.item.damage;

  opc += S.ops * S.opc_from_ops;

  let flat_damage = ["ruby"];
  let percent_damage = ["citrine"];

  if (S.pickaxe.item.sockets) {
    S.pickaxe.item.sockets.socket.forEach((socket) => {
      if (!is_empty(socket)) {
        if (flat_damage.includes(socket.gem_type)) opc += socket.stat_amount;
        if (percent_damage.includes(socket.gem_type))
          opc += opc * socket.stat_amount;
      }
    });
  }

  if (O.ore_madness_active) opc *= 666;

  if (type) {
    if (type == "weak-spot") {
      opc *= S.weak_hit_multi;
    }
  }

  type
    ? (opc *= calculate_pickaxe_sharpness() / 100)
    : (opc *= calculate_pickaxe_hardness() / 100);

  if (select_from_arr(Upgrades, "flashlight").owned) {
    opc += S.ops * 0.03;
  }

  opc += opc * S.opc_multiplier;

  O.recalculate_opc = 0;
  S.opc = opc;
  return opc;
};

let calculate_ops = () => {
  O.recalculate_ops = 0;

  let ops = 0;

  Buildings.forEach((building) => {
    let production_bonus =
      S.bonus_building_production[building.code_name] +
      S.bonus_building_production.all;

    building.production =
      building.base_production + building.base_production * production_bonus;

    ops += building.owned * building.production;
  });

  ops += ops * S.ops_multiplier;

  S.ops = ops;

  if (ops >= 50) win_achievement("ore-aid_stand");
  if (ops >= 10 * THOUSAND) win_achievement("ore_store");
  if (ops >= 401 * THOUSAND) win_achievement("401k");
  if (ops >= 5 * MILLION) win_achievement("retirement_plan");
  if (ops >= 1 * BILLION) win_achievement("hedge_fund");

  if (S.ops >= 10) unlock_upgrade("flashlight");
  if (S.ops >= 500) unlock_upgrade("double_polish");
  if (S.ops >= 10 * THOUSAND) unlock_upgrade("metal_grips");
  if (S.ops >= 5 * MILLION) unlock_upgrade("miner_battery");
};

let calculate_building_ops = (building_owned, building_production) => {
  let percentage = ((building_owned * building_production) / S.ops) * 100;
  return beautify_number(percentage);
};

let generate_weak_spot = () => {
  if (!S.locked.fragility_spectacles) {
    ORE_WEAK_SPOT.style.display = "block";
    let ore_sprite_coords = ORE_SPRITE.getBoundingClientRect();

    // POSITION CONTAINER AROUND ORE SPRITE
    ORE_WEAK_SPOT_CONTAINER.style.position = "absolute";
    ORE_WEAK_SPOT_CONTAINER.style.width = ore_sprite_coords.width + "px";
    ORE_WEAK_SPOT_CONTAINER.style.height = ore_sprite_coords.height + "px";
    ORE_WEAK_SPOT_CONTAINER.style.bottom = 0;

    // PICK RANDOM COORDS FOR WEAK SPOT
    let ore_weak_spot_container_coords = ORE_WEAK_SPOT_CONTAINER.getBoundingClientRect();

    let x = get_random_num(
      0,
      ore_weak_spot_container_coords.right - ore_weak_spot_container_coords.left
    );
    let y = get_random_num(
      0,
      ore_weak_spot_container_coords.bottom - ore_weak_spot_container_coords.top
    );

    ORE_WEAK_SPOT.style.left = x + "px";
    ORE_WEAK_SPOT.style.top = y + "px";
  }
};

let handle_click = (e, type) => {
  let opc = calculate_opc(type);

  if (opc >= 100) win_achievement("not_even_a_scratch");
  if (opc >= 1000) win_achievement("didnt_even_hurt");
  if (opc >= 100 * THOUSAND) win_achievement("that_tickled");
  if (opc >= 1 * MILLION) win_achievement("i_felt_that");

  if (type) {
    let crit = false;
    if (Math.random() <= S.weak_hit_crit_chance) crit = true;

    play_sound("ore_weak_spot_hit");
    S.stats.total_weak_hit_clicks++;
    S.current_combo++;
    S.generation.xp_on_refine += 0.5;

    if (S.current_combo == 5) {
      win_achievement("combo_baby");
      unlock_smith_upgrade("combo_shield_i");
    }
    if (S.current_combo == 20) win_achievement("combo_pleb");
    if (S.current_combo == 50) win_achievement("combo_squire");
    if (S.current_combo == 100) win_achievement("combo_knight");
    if (S.current_combo == 200) win_achievement("combo_king");
    if (S.current_combo == 350) win_achievement("combo_king");
    if (S.current_combo == 666) win_achievement("combo_devil");
    if (S.current_combo == 777) win_achievement("combo_god");
    if (S.current_combo == 1000) win_achievement("combo_saiyan");
    if (S.current_combo == 10000) win_achievement("combo_saitama");

    if (S.current_combo > S.stats.highest_combo)
      S.stats.highest_combo = S.current_combo;
    if (S.current_combo % 5 == 0) RN.new(e, "combo", S.current_combo);

    if (crit) {
      opc += opc * S.weak_hit_crit_multi;
      RN.new(event, "weak-hit-crit-click", opc);
      S.stats.total_weak_hit_crit_clicks++;

      if (S.stats.total_weak_hit_crit_clicks == 1)
        win_achievement("critical_strike");
      if (S.current_combo == 7) win_achievement("lucky_number_7");
    } else {
      RN.new(event, "weak-hit-click", opc);
    }

    generate_weak_spot();
    handle_rock_particles(event, 3);

    if (S.locked.combo_sign && S.current_combo >= 5) {
      S.locked.combo_sign = 0;
      O.reposition_elements = 1;
    }
  } else {
    if (S.combo_shield.active && S.combo_shield.available > 0) {
      use_combo_shield();
      return;
    } else {
      if (S.current_combo >= 5) RN.new(event, "combo-loss", S.current_combo);
      S.current_combo = 0;
    }

    play_sound("ore_hit");

    RN.new(event, "click", opc);
    handle_rock_particles(event);
  }

  S.stats.total_clicks++;
  S.stats.total_ores_manually_mined += opc;
  S.stats.current_ores_manually_mined += opc;

  earn(opc);

  if (!S.locked.combo_sign && s(".combo-sign-number"))
    update_combo_sign_number();
};

let handle_rock_particles = (e, amount = 2) => {
  if (S.prefs.show_rock_particles) {
    for (let i = 0; i < amount; i++) {
      let particle = document.createElement("div");
      particle.classList.add("particle");
      // DETERMINE COLOR
      let color = get_random_num(150, 200);
      particle.style.background = `rgb( ${color}, ${color}, ${color} )`;

      // DETERMINE SIZE OF PARTICLES
      let size = get_random_num(2, 4);

      // DETERMINE PLACEMENT OF PARTICLES
      let x, y;
      if (e) {
        x = e.clientX;
        y = e.clientY;
      } else {
        size = get_random_num(3, 5);
        let ore_sprite_dimensions = ORE_SPRITE.getBoundingClientRect();
        x = get_random_num(
          ore_sprite_dimensions.left,
          ore_sprite_dimensions.right
        );
        y = ore_sprite_dimensions.top;
      }

      particle.style.height = size + "px";
      particle.style.width = size + "px";

      particle.style.left = x + "px";
      particle.style.top = y + get_random_num(-10, 10) + "px";

      particle.style.transition_duration = get_random_num(5, 10) * 0.1;
      let animation_duration = get_random_num(5, 10) * 0.1;
      particle.style.animation = `particle_fall ${animation_duration}s forwards ease-in`;

      particle.addEventListener("animationend", () => remove_el(particle));

      CONTAINER.append(particle);

      //reflow
      particle.getBoundingClientRect();

      let move_amount =
        get_random_num(10, 40) * (Math.round(Math.random()) * 2 - 1);
      particle.style.left = x + move_amount + "px";
    }
  }
};

let handle_text_scroller = () => {
  let animation_speed = 20;
  setTimeout(handle_text_scroller, 1000 * animation_speed);

  if (!O.window_blurred) {
    if (Math.random() <= 0.6 || TS.queue.length > 0) {
      console.log("firing");
      let text = TS.get();
      let text_scroller = document.createElement("div");
      text_scroller.innerHTML = text;
      text_scroller.style.transition = `transform ${animation_speed}s linear`;
      text_scroller.classList.add("text-scroller");

      TEXT_SCROLLER_CONTAINER.append(text_scroller);

      let text_scroller_dimensions = text_scroller.getBoundingClientRect();
      let text_scroller_container_dimensions = TEXT_SCROLLER_CONTAINER.getBoundingClientRect();

      text_scroller.style.left =
        text_scroller_container_dimensions.right + "px";
      text_scroller.style.transform = `translateX( -${
        text_scroller_container_dimensions.width +
        text_scroller_dimensions.width +
        100
      }px )`;

      text_scroller.addEventListener("transitionend", () => {
        remove_el(text_scroller);
      });
    }
  }
};

// ==== TUTORIAL SHIT ====================================================================

let tutorial_click_the_rock = () => {
  let tutorial = document.createElement("div");

  tutorial.classList.add("tutorial-container");
  tutorial.id = "tutorial-click-the-rock";
  tutorial.innerHTML = `
    <div class='arrow left'></div>
    <div class="tutorial-content">
      <p>Break the rock!</p>
    </div>
  `;

  let ore_container_dimensions = ORE_CONTAINER.getBoundingClientRect();

  CONTAINER.append(tutorial);

  tutorial.style.left = ore_container_dimensions.right + "px";
  tutorial.style.top =
    (ore_container_dimensions.top + ore_container_dimensions.bottom) / 2 + "px";
};

let tutorial_pickaxe_description = () => {
  let tutorial = document.createElement("div");

  tutorial.classList.add("tutorial-window-container");
  tutorial.id = "tutorial-pickaxe-description";
  tutorial.innerHTML = `
    <h1>Your First Pickaxe!</h1>
    <hr>
    <p class='desc'>For some reason... in this magical world, when you crack open an ore, a pickaxe comes out!</p>
    <ul>
      <li><strong>Sharpness</strong> affects how much damage you deal on <i>weak spot</i> hits</li>
      <li><strong>Hardness</strong> affects how much damage you deal on <i>regular</i> hits</li>
    </ul>
  `;

  CONTAINER.append(tutorial);

  let target = document
    .querySelector(".item-drop-popup")
    .getBoundingClientRect();
  let tutorial_dimensions = tutorial.getBoundingClientRect();

  tutorial.style.left = target.left - tutorial_dimensions.width / 1.5 + "px";
  tutorial.style.top = target.top + "px";
};

let tutorial_buy_building = () => {
  let tutorial = document.createElement("div");

  tutorial.classList.add("tutorial-container");
  tutorial.id = "tutorial-buy-building";
  tutorial.innerHTML = `
    <div class="tutorial-content">
      <p>Use your <strong>ores</strong> to purchase buildings!</p>
      <p>Buildings add to your Ores per Second ( OpS )</p>
    </div>
    <div class="arrow right"></div>
  `;

  let target_location_dimensions = s(
    "#building-school"
  ).getBoundingClientRect();

  CONTAINER.append(tutorial);

  console.log("tutorial buy building firing", tutorial, tutorial.offsetHeight);

  tutorial.style.left =
    target_location_dimensions.left - tutorial.offsetWidth - 35 + "px";
  tutorial.style.top = "20%";
};

// ==== COMBO SHIT =======================================================================

let build_combo_sign = () => {
  let str = `
    <div class='top'>
      <div class='vertical-separator thin'></div>
      <div class='vertical-separator thin'></div>
    </div>
    <div class='combo-sign'>
      <p>Current Combo</p>
      <h1 class='combo-sign-number'>${S.current_combo}</h1>
      `;

  if (S.combo_shield.owned > 0) {
    str += `
        <div 
          onmouseover='TT.show( event, { type: "combo-shield-info" } )'
          onmouseout='TT.hide()'
          class='combo-shield-container'>
          <p>Combo Shield: </p>
          <div>
      `;

    str += build_combo_shields();

    str += `
        </div>
      </div>
      `;
  }

  str += `</div>`;

  COMBO_SIGN_CONTAINER.innerHTML = str;
};

let build_combo_shields = () => {
  let str = "";

  if (S.combo_shield.owned == 0) {
    str += `
      <i class='fa fa-shield fa-1x'></i>
      <i class='fa fa-shield fa-1x'></i>
      <i class='fa fa-shield fa-1x'></i>
    `;
  } else {
    for (let i = 0; i < 3; i++) {
      str += `<i class='fa fa-shield fa-1x ${
        S.combo_shield.available > i && "active"
      }'></i>`;
    }
  }

  return str;
};

let update_combo_sign_number = () => {
  let combo_sign_number = s(".combo-sign-number");
  combo_sign_number.innerHTML = S.current_combo;
};

let use_combo_shield = () => {
  play_sound("combo_shield_break");
  S.combo_shield.available -= 1;
  S.combo_shield.time_last_used = Date.now();
  S.stats.total_combo_shields_used++;
  S.stats.current_combo_shields_used++;

  RN.new(event, "combo-shield", null);

  build_combo_sign();
};

let handle_combo_shields = (ms = 0) => {
  if (S.combo_shield.available < S.combo_shield.owned) {
    if (!S.combo_shield.time_until_next)
      S.combo_shield.time_until_next = S.combo_shield.time_needed;

    if (ms > S.combo_shield.time_until_next) {
      ms -= S.combo_shield.time_until_next;
      S.combo_shield.time_until_next = null;
      S.combo_shield.available++;
      handle_combo_shields(ms);
      build_combo_sign();
    } else {
      S.combo_shield.time_until_next -= ms;
    }
  }
};

// ==== REFINE SHIT ======================================================================

let unlock_refine_btn = () => {
  S.locked.refine_btn = 0;

  O.reposition_elements = 1;
};

let confirm_refine = () => {
  let wrapper = document.createElement("div");
  wrapper.classList.add("wrapper");

  let rewards = calculate_refine_rewards();

  let str = `
    <div class='confirm-refine'>
      <header>
        <h1>Refine</h1>
      </header>
      <i onclick='remove_wrapper()' class='fa fa-times fa-1x'></i>
      <p class='gain'>+ You will gain  <strong>${beautify_number(
        rewards.refined_ores
      )}</strong> Refined Ores</p>
      <p class='gain'>+ You will gain <strong>${beautify_number(
        rewards.xp
      )}</strong> generation XP</p>
      <p class='gain'>+ You will keep <strong>all</strong> blacksmith upgrades</p>
      <p class='gain'>+ You will keep your <strong>${
        S.pickaxe.item.name
      }</strong> </p>
      <br />
      <p class='lose'>- You will lose <strong>all</strong> ores</p>
      <p class='lose'>- You will lose <strong>all</strong> owned buildings and upgrades</p>
      <br />
      <p class='confirmation-text'><span>Are you sure you want to refine?</span></p>
      <div class='button-container'>
        <button onclick='refine(); remove_wrapper()'>YES</button>
        <button onclick='remove_wrapper()'>NO</button>
      </div>

    </div>
  `;

  wrapper.innerHTML = str;

  CONTAINER.append(wrapper);
};

let calculate_refine_rewards = () => {
  let rewards = {};

  rewards.refined_ores = Math.floor(
    Math.sqrt(S.stats.current_ores_earned / 1000000)
  );

  rewards.xp =
    S.generation.xp_on_refine + Math.cbrt(S.stats.current_ores_earned) / 2;

  return rewards;
};

let refine = async () => {
  if (S.stats.current_ores_earned >= 1000000) {
    play_sound("refine");
    S.stats.times_refined++;

    let rewards = calculate_refine_rewards();

    earn_refined_ores(rewards.refined_ores);
    earn_generation_xp(rewards.xp);

    reset_state_and_buildings();

    await refine_animation();

    if (S.stats.last_refine_time) {
      let diff = get_time_difference_value(S.stats.last_refine_time, "minutes");
      if (diff <= 10) win_achievement("quick_refiner");
      if (diff <= 5) win_achievement("swift_refiner");
      if (diff <= 1) win_achievement("speedy_refiner");
      if (diff <= 0.166667) win_achievement("flash_refiner");
    }

    S.stats.last_refine_time = Date.now();

    if (S.stats.times_refined == 1) {
      win_achievement("babies_first_refine");
      unlock_smith_upgrade("quest_board");
    }

    if (Tabs[2].hidden == 1) {
      Tabs[2].hidden = 0;
      build_tabs();
    }

    save_game();

    O.reposition_elements = 1;
  } else {
    notify("Requires at least 1,000,000 ores earned", "red", "error");
  }
};

let refine_animation = () => {
  return new Promise((resolve) => {
    let refine_animation = document.createElement("div");
    refine_animation.classList.add("refine-animation");
    refine_animation.innerHTML = `
      <div class='left'></div>
      <div class='right'></div>
    `;

    s("body").append(refine_animation);

    refine_animation.children[0].addEventListener("animationend", () => {
      remove_el(refine_animation);

      resolve();
    });
  });
};

let reset_state_and_buildings = () => {
  S.ores = 0;
  S.current_ore_hp = base_ore_max_hp * Math.pow(1.5, S.stats.times_refined);
  S.current_ore_max_hp = base_ore_max_hp * Math.pow(1.5, S.stats.times_refined);
  S.stats.current_rocks_destroyed = 0;
  S.stats.current_ores_earned = 0;
  S.stats.current_ores_mined = 0;
  S.stats.current_combo_shields_used = 0;

  Buildings = [];
  buildings.forEach((building) => new Building(building));

  Upgrades = [];
  upgrades.forEach((upgrade) => new Upgrade(upgrade));

  if (s(".item-container")) {
    document.querySelectorAll(".item-container").forEach((i) => remove_el(i));
  }

  O.recalculate_opc = 1;
  O.recalculate_ops = 1;
  O.current_tab = "store";
  O.rebuild_store_tab = 1;
};

let earn_generation_xp = (xp) => {
  while (xp > 0) {
    let amount_of_xp_needed_for_level =
      S.generation.needed_xp - S.generation.current_xp;

    if (xp >= amount_of_xp_needed_for_level) {
      xp -= amount_of_xp_needed_for_level;
      gain_generation_level();
    } else {
      S.generation.current_xp += xp;
      xp = 0;
    }
  }

  S.generation.xp_on_refine = 0;
};

let gain_generation_level = () => {
  let xp_needed_scaling = 1.05;

  S.generation.level++;
  S.generation.knowledge_points++;
  S.generation.current_xp = 0;
  S.generation.needed_xp =
    S.generation.needed_xp * Math.pow(xp_needed_scaling, S.generation.level);
};

// ==== ITEM DROP SHIT ===================================================================

let generate_item_drop = (is_hoverable = false) => {
  let item_uuid = Math.round(Math.random() * 10000000);
  let item = document.createElement("div");

  if (is_hoverable) {
    item.id = `item_drop_${item_uuid}`;
    item.classList.add("hoverable-item");
    item.addEventListener("mouseover", (event) =>
      handle_hoverable_mouseover(event, item_uuid)
    );
  } else {
    item.classList.add("item-container");

    item.innerHTML = `
      <img class='item-shine' src="./app/assets/images/misc-shine.png" alt="shine">
      <img class='item-shine' src="./app/assets/images/misc-shine.png" alt="shine">
      <div id='item_drop_${item_uuid}' data-item_level="${S.stats.current_rocks_destroyed}" class="item"></div>
    `;

    item.style.pointerEvents = "none";

    item.addEventListener("click", (event) => {
      handle_item_drop_click(item_uuid);
      remove_el(event.target);
    });
  }

  item.addEventListener("transitionend", () => {
    item.style.pointerEvents = "all";
  });

  let ore_dimensions = ORE_CONTAINER.getBoundingClientRect();

  let origin = {
    x: (ore_dimensions.left + ore_dimensions.right) / 2,
    y: (ore_dimensions.top + ore_dimensions.bottom) / 2,
  };

  let target = {
    x:
      get_random_num(ore_dimensions.left, ore_dimensions.right) +
      get_random_num(-10, 10),
    y: ore_dimensions.bottom + get_random_num(-10, 10),
  };

  item.style.left = origin.x + "px";
  item.style.top = origin.y + "px";

  CONTAINER.append(item);

  let transform_x = origin.x - target.x;
  let transform_y = target.y - origin.y;

  item.style.transition = "all .4s ease-in";

  //reflow
  item.getBoundingClientRect();

  setTimeout(() => {
    if (s(`#item_drop_${item_uuid}`)) {
      item.style.animation = "fade_out 1s linear forwards";
      item.addEventListener("animationend", () => {
        remove_el(item);
      });
    }
  }, 10 * SECOND);

  item.style.transform = `translate( ${transform_x}px, ${transform_y}px )`;
};

let handle_hoverable_mouseover = (e, item_uuid) => {
  play_sound("ore_hover");
  let item = s(`#item_drop_${item_uuid}`);
  remove_el(item);

  let amount = S.opc * 5 + S.ops * 5;

  earn(amount, false);
  RN.new(e, "hoverable-ore", amount);
};

let handle_item_drop_click = (item_uuid) => {
  S.stats.total_items_found++;

  let item = s(`#item_drop_${item_uuid}`);

  console.log(item.dataset);

  O.pickaxe = new Pickaxe(item.dataset.item_level);

  let wrapper = document.createElement("div");
  wrapper.classList.add("wrapper");

  let str = `<div class='item-drop-popup-container'>`;
  str += build_new_pickaxe_popup();
  str += build_equipped_pickaxe_popup();
  str += "</div>";

  wrapper.innerHTML = str;

  CONTAINER.append(wrapper);
  gems_checked = false;

  if (S.stats.total_items_found == 1) tutorial_pickaxe_description();
};

let toggle_show_gem_warning = () => {
  let checkbox = s("#checkbox-gem-warning");

  if (checkbox.checked) {
    S.misc.show_gem_warning = false;
  } else {
    S.misc.show_gem_warning = true;
  }

  console.log(S.misc.show_gem_warning);
};

let gems_checked = false;
let check_for_gems = () => {
  if (gems_checked) {
    equip_pickaxe();
    return;
  }

  if (S.pickaxe.item.sockets) {
    if (S.pickaxe.item.sockets.amount > 0) {
      let has_gems = false;
      for (let i = 0; i < S.pickaxe.item.sockets.socket.length; i++) {
        if (!is_empty(S.pickaxe.item.sockets.socket[i])) has_gems = true;
      }

      if (has_gems && S.misc.show_gem_warning) {
        let popup = document.createElement("div");
        popup.classList.add("wrapper");
        let str = `
          <div class='gem-warning' style='text-align: center;'>
            <h1>Warning</h1>
            <p>Your currently socketed gems will return to your inventory.</p>
            <p>If your inventory is full, the gem will be <span style='color: red;'>destroyed</span>.</p>
            <button onclick='remove_wrapper(); gems_checked = true' style='padding: 3px; background: transparent; border: 1px solid white; color: white; margin-top: 10px;'>OK</button>
            <div style='display: flex; flex-flow: row nowrap; justify-content: flex-start; opacity: .5;'>
              <input id='checkbox-gem-warning' type="checkbox" onchange='toggle_show_gem_warning()'>
              <p style='padding-left: 3px;'>Don't show again</p>
            </div>
          </div>
        `;
        popup.innerHTML = str;

        CONTAINER.append(popup);
      } else {
        equip_pickaxe();
      }
    } else {
      equip_pickaxe();
    }
  } else {
    equip_pickaxe();
  }
};

let equip_pickaxe = () => {
  if (s("#tutorial-pickaxe-description"))
    remove_el(s("#tutorial-pickaxe-description"));
  if (O.current_tab == "smith") O.rebuild_smith_tab = 1;

  // remove current gems on pickaxe and add to inventory
  if (S.pickaxe.item.sockets) {
    S.pickaxe.item.sockets.socket.forEach((socket) => {
      if (!is_empty(socket)) {
        add_to_inventory(socket);
      }
    });
  }

  let pickaxe = O.pickaxe;

  S.pickaxe.item = pickaxe;

  remove_wrapper();
};

let trash_pickaxe = () => {
  S.stats.total_pickaxes_trashed++;

  if (S.stats.total_pickaxes_trashed == 5) win_achievement("trasher");
  if (S.stats.total_pickaxes_trashed == 10) win_achievement("polluter");
  if (S.stats.total_pickaxes_trashed == 20) win_achievement("scrapper");
  if (S.stats.total_pickaxes_trashed == 40) win_achievement("scrap master");

  if (s("#tutorial-pickaxe-description"))
    remove_el(s("#tutorial-pickaxe-description"));
};

let build_new_pickaxe_popup = () => {
  str = `
    <div class='item-drop-popup ${O.pickaxe.rarity.name}'>
      <p style='font-size: 14px; letter-spacing: 0.5px; opacity: 0.6;'>- New Pickaxe -</p>
      <h1 class='${O.pickaxe.rarity.name}'>${O.pickaxe.name}</h1>
      <i onclick='remove_wrapper()' class="fa fa-times fa-1x"></i>
  `;

  str += build_pickaxe_sprite(O.pickaxe);

  str += `
    <p style='padding-bottom: 7.5px; opacity: .7;' class='${
      O.pickaxe.rarity.name
    }'>
      <strong>${O.pickaxe.rarity.name}</strong>
    </p>
    <p><small><i>[ level: <strong>${O.pickaxe.level}</strong> ]</i></small></p>
    <ul>
      <li>Damage: <strong>${beautify_number(O.pickaxe.damage)}</strong> ${
    O.pickaxe.damage > S.pickaxe.item.damage
      ? '<i class="fa fa-angle-up fa-1x"></i>'
      : '<i class="fa fa-angle-down fa-1x"></i>'
  }</li>
      <li>Sharpness: <strong>${beautify_number(
        O.pickaxe.sharpness
      )}%</strong> ${
    O.pickaxe.sharpness > S.pickaxe.item.sharpness
      ? '<i class="fa fa-angle-up fa-1x"></i>'
      : '<i class="fa fa-angle-down fa-1x"></i>'
  }</li>
      <li>Hardness: <strong>${beautify_number(O.pickaxe.hardness)}%</strong> ${
    O.pickaxe.hardness > S.pickaxe.item.hardness
      ? '<i class="fa fa-angle-up fa-1x"></i>'
      : '<i class="fa fa-angle-down fa-1x"></i>'
  }</li>
    </ul>
    <button 
      class='equip-btn'
      onclick='check_for_gems()'
      >EQUIP <i class="fa fa-hand-paper-o fa-1x"></i>
    </button>
    <button 
      class='trash-btn'
      onclick='remove_wrapper();'
      >TRASH <i class="fa fa-trash-o fa-1x"></i>
    </button>
  `;

  str += "</div>";

  return str;
};

let build_equipped_pickaxe_popup = () => {
  let p = S.pickaxe.item;

  str = `
    <div class='currently-equipped-popup ${p.rarity.name}'>
      <p style='font-size: 14px; letter-spacing: 0.5px; opacity: 0.6'>- Currently Equipped -</p>
      <h1 class='${p.rarity.name}'>${p.name}</h1>
  `;

  str += build_pickaxe_sprite(p, 192);

  str += `
    <p style='padding-bottom: 7.5px; opacity: .7;' class='${p.rarity.name}'>
      <strong>${p.rarity.name}</strong>
    </p>
    <p><small><i>[ level: <strong>${p.level}</strong> ]</i></small></p>
    <ul>
      <li>Damage: ${beautify_number(p.damage)}</li>
      <li>Sharpness: ${beautify_number(p.sharpness)}%</li>
      <li>Hardness: ${beautify_number(p.hardness)}%</li>
    </ul>
  `;

  str += "</div>";

  return str;
};

let build_pickaxe_sprite = (pickaxe, size = 320, is_inventory = false) => {
  let str = `
    <div
      class="pickaxe-sprite-container"
      style='
        width: ${size}px;
        height: ${size}px;
      '>
      `;

  if (!is_empty(pickaxe.sockets)) {
    let margin = size == 320 ? "20" : "12";

    str += `<div class='sockets-container'>`;

    for (let i = 0; i < pickaxe.sockets.amount; i++) {
      str += `
            <div
              style='
                height: ${size / 6}px;
                width: ${size / 6}px;
                margin: 7.5px ${margin}px;
              '
              class="socket">
              `;
      if (!is_empty(pickaxe.sockets.socket[i])) {
        str += `<img`;

        if (is_inventory) str += ` onclick='unsocket_gem( event, ${i} )'`;

        str += `
                  onmouseover='TT.show( event, { type: "pickaxe-socket", pickaxe_socket: ${i} } ) '
                  onmouseout='TT.hide()'
                  src='https://via.placeholder.com/40'/>
                `;
      }

      str += `</div>
          `;
    }

    str += `</div>`;
  }

  str += `
      <img class='pickaxe-stick' src='./app/assets/images/pickaxe-bottom.png' />
      <img class='pickaxe-top' src='./app/assets/images/pickaxe-top-${pickaxe.material.name.toLowerCase()}.png' />
    </div>
  `;

  return str;
};

// ==== BOTTOM TAB SHIT ==================================================================

let build_bottom_tabs = () => {
  let str = "";

  Bottom_Tabs.forEach((tab) => {
    if (tab.locked) {
      str += `
        <div class="tab">???</div>
      `;
    } else {
      str += `
        <div 
          onclick="handle_bottom_tab_click( '${tab.code_name}' )" 
          id="bottom-tab-${tab.code_name}"
          class="tab">
          ${tab.name}
        </div>
      `;
    }
  });

  BOTTOM_AREA_TABS.innerHTML = str;

  O.rebuild_bottom_tabs = 0;
  O.reposition_elements = 1;
};

let handle_bottom_tab_click = (code_name) => {
  if (S.bottom_area.selected_tab == code_name) {
    if (code_name == "quest_board") open_quest_board();
  } else {
    // switch tab
    S.bottom_area.selected_tab = code_name;
  }
};

// ==== QUEST SHIT =======================================================================

let open_quest_board = () => {
  let quest_board = document.createElement("div");
  quest_board.classList.add("wrapper");

  let str = `
    <div id='quest-board'>
      <header>
        <i onclick='remove_wrapper()' class='fa fa-times fa-1x'></i>
        <h1>Quest Board</h1>
      </header>
  `;

  str += build_quests();

  str += `</div>`;

  quest_board.innerHTML = str;

  CONTAINER.append(quest_board);
};

let build_quests = () => {
  let str = ``;

  str += `<div class='quest-board-quests'>`;

  Quests.forEach((quest) => {
    str += `
      <div 
        onclick='view_quest( "${quest.code_name}" )'
        class='quest ${quest.locked && "locked"}'
      >
        <div class='pin'></div>
        <h3 class='quest-name'>${quest.name}</h3>
        `;

    if (S.quest.current_quest) {
      if (S.quest.current_quest.code_name == quest.code_name)
        str += `<p class='in-progress'>IN PROGRESS</p>`;
    }

    if (quest.completed)
      str += `<p class='completed ${
        quest.times_completed >= 5 ? "golden" : ""
      }'>COMPLETED</p>`;

    str += `
      </div>
    `;
  });

  str += `</div>`;

  return str;
};

let view_quest = (code_name) => {
  let quest = select_from_arr(Quests, code_name);

  let quest_sheet = document.createElement("div");
  quest_sheet.classList.add("wrapper");

  let str = `
    <div id='quest-sheet'>
      <div class="pin"></div>
      <header>
        <i onclick='remove_wrapper()' class='fa fa-times fa-1x'></i>
        <h1>${quest.name}</h1>
      </header>
      <img class='quest-img' src="https://via.placeholder.com/200x360?text=quest-image-placeholder" alt="">
      <div class="info-container">
        <div class='left'>
          <p>${quest.desc}</p>
          <br/>
          <i>${quest.flavor_text}</i>
        </div>
        <ul class='right'>
          <li><i class="fa fa-clock-o fa-1x"></i> &nbsp; ${beautify_ms(
            quest.duration
          )}</li>
          <li>Ores &nbsp; ${quest.completed ? quest.rewards.ores : "??"}</li>
          <li>XP &nbsp; ${quest.completed ? quest.rewards.xp : "??"}</li>
          `;

  if (quest.completed) {
    str += `
              <hr size='1'> 
              <li>Times Completed</li>
              <li>${quest.times_completed}</li>
              <li>Total XP Gained</li>
              <li>${quest.total_xp_gained}</li>
            `;
  }

  str += `
        </ul>

      </div>

      <button onclick='start_quest( "${quest.code_name}" )'>ACCEPT QUEST</button>
    </div>
  `;

  quest_sheet.innerHTML = str;
  CONTAINER.append(quest_sheet);
};

let start_quest = (code_name) => {
  let quest_board_el = s("#quest-board");
  let quest_board_el_parent = quest_board_el.parentElement;
  remove_wrapper();
  remove_el(quest_board_el_parent);

  if (S.quest.state == "in progress") {
    notify("A quest is already in progress", "red", "error");
    remove_wrapper();
    return;
  }

  let quest = select_from_arr(Quests, code_name);
  S.quest.state = "in progress";
  S.quest.current_quest = quest;
  S.quest.current_quest_progress = 0;
  S.quest.adventurer = new Adventurer();

  QL.append(
    `The adventurer ${S.quest.adventurer.name} has embarked on a quest.`
  );

  quest_initialization();
};

let quest_initialization = () => {
  if (
    S.quest.state == "in progress" ||
    S.quest.state == "completed" ||
    S.quest.state == "boss approaching"
  ) {
    O.quest_initialized = true;
    BOOST_NOTIFIER.classList.add("active");
    HERO.classList.add("active", "moving");
    handle_quest_progress();
  }

  if (S.quest.state == "boss" || S.quest.state == "failed") {
    let manual_attack = s(".manual-attack");
    if (manual_attack) remove_el(manual_attack);

    O.quest_initialized = true;

    let boss_el_container = document.createElement("div");
    boss_el_container.classList.add("boss-container");
    boss_el_container.innerHTML = `
      <p class='boss-hp'>${S.quest.current_boss_hp} HP</p>
      <img class='boss' src="https://via.placeholder.com/64" alt="">
    `;

    QUEST_AREA_CONTAINER.append(boss_el_container);

    quest_failed();
  }

  if (S.quest.state == "boss defeated") {
    O.quest_initialized = true;
    boss_defeated_banner();
  }
};

let handle_quest_progress = (duration = 0) => {
  S.quest.current_quest_progress += duration;

  let percentage_completed =
    (S.quest.current_quest_progress / S.quest.current_quest.duration) * 100;
  HERO.style.left = percentage_completed + "%";

  if (S.quest.current_quest_progress >= S.quest.current_quest.duration) {
    boss_approaching();

    HERO.classList.remove("moving");
    HERO.classList.add("jumping");

    QL.append(`${S.quest.current_quest.boss.name} has its eyes on you.`);

    // QL.append( `${ S.quest.adventurer.name } has completed the ${ S.quest.current_quest.name }` )
  }
};

let boss_approaching = () => {
  S.quest.state = "boss approaching";

  let boss_approaching_div = document.createElement("div");
  boss_approaching_div.classList.add("boss-approaching");
  boss_approaching_div.innerHTML = `
    <h1> BOSS APPROACHING !</h1>
  `;

  QUEST_AREA_CONTAINER.append(boss_approaching_div);
};

let initiate_boss = () => {
  S.quest.state = "boss";
  S.quest.time_limit = 30 * SECOND;
  S.quest.current_boss_hp = S.quest.current_quest.boss.hp;
  QL.append("BOSS FIGHT STARTED");
  HERO.classList.remove("active");

  let boss_approaching_div = s(".boss-approaching");
  remove_el(boss_approaching_div);

  let timer_container = document.createElement("div");
  timer_container.classList.add("timer-container");
  timer_container.innerHTML = `
    <div class="timer-outer">
      <div class="timer-inner"></div>
    </div>
    <i class="fa fa-clock-o fa-1x"></i>
  `;

  QUEST_AREA_CONTAINER.append(timer_container);

  let boss_el_container = document.createElement("div");
  boss_el_container.classList.add("boss-container");
  boss_el_container.innerHTML = `
    <p class='boss-hp'>${beautify_number(S.quest.current_boss_hp)} HP</p>
    <img class='boss' src="./app/assets/images/boss-${S.quest.current_quest.boss.name.toLowerCase()}.png" alt="">
  `;

  generate_manual_attack();

  QUEST_AREA_CONTAINER.append(boss_el_container);
};

let update_boss_time_limit = (ms) => {
  let progress_bar = s(".timer-inner");

  if (progress_bar) {
    S.quest.time_limit -= ms;

    let percentage = (S.quest.time_limit / (30 * SECOND)) * 100;
    progress_bar.style.height = percentage + "%";

    if (percentage <= 0) quest_failed();
  }
};

let quest_failed = () => {
  S.quest.state = "failed";

  QL.append(
    `${S.quest.adventurer.name} couldn't defeat ${S.quest.current_quest.boss.name}.`
  );

  let manual_attack = s(".manual-attack");
  if (manual_attack) remove_el(manual_attack);

  let banner = document.createElement("div");
  banner.classList.add("quest-failed");
  banner.innerHTML = `
    <h1>QUEST FAILED !</h1>
  `;

  remove_el(s(".boss-hp"));
  s(".boss").style.animation = "jumping 1s infinite linear";

  QUEST_AREA_CONTAINER.append(banner);
};

let generate_manual_attack = () => {
  let bottom_area_dimensions = QUEST_AREA_CONTAINER.getBoundingClientRect();
  let attack = document.createElement("div");
  let padding = 50;
  attack.classList.add("manual-attack");
  attack.addEventListener("click", handle_manual_attack);

  let y = get_random_num(
    bottom_area_dimensions.top + padding,
    bottom_area_dimensions.bottom - padding
  );
  let x = get_random_num(
    bottom_area_dimensions.left + padding,
    bottom_area_dimensions.right - padding
  );

  attack.style.left = x + "px";
  attack.style.top = y + "px";

  CONTAINER.append(attack);
};

let handle_manual_attack = (event) => {
  play_sound(`boss_hit_${get_random_num(1, 2)}`);

  remove_el(event.target);

  let damage = S.pickaxe.item.damage;
  damage +=
    S.pickaxe.item.damage *
    select_random_from_arr([0.1, 0.2, 0.3, 0.4, 0.5]) *
    select_random_from_arr([-1, 1]);
  damage = Math.round(damage);
  if (damage < 1) damage = 1;

  S.quest.current_boss_hp -= damage;

  let attack_synonyms = [
    "sliced",
    "attacked",
    "cleaved",
    "carved",
    "slashed",
    "pierced",
    "punched",
    "falcon punched",
    "kicked",
  ];

  QL.append(
    `${S.quest.adventurer.name} ${select_random_from_arr(attack_synonyms)} ${
      S.quest.current_quest.boss.name
    } for ${damage} damage.`
  );

  let bossHP = s(".boss-hp");
  s(".boss-hp").innerHTML = beautify_number(S.quest.current_boss_hp) + "HP";
  // s( '.boss-hp' ).classList.add( 'damaged' )
  // setTimeout(() => {
  //   if ( )
  // }, 500)

  S.quest.current_boss_hp > 0 ? generate_manual_attack() : boss_defeated();
};

let boss_defeated = () => {
  S.quest.state = "boss defeated";

  remove_el(s(".boss-hp"));

  let synonyms = ["killed", "slain", "vanquished"];

  QL.append(
    `${S.quest.adventurer.name} has ${select_random_from_arr(synonyms)} ${
      S.quest.current_quest.boss.name
    } `
  );

  let boss = s(".boss");
  boss.addEventListener("animationend", () => {
    remove_el(s(".boss-container"));
  });
  boss.classList.add("dead");

  boss_defeated_banner();
};

let boss_defeated_banner = () => {
  // APPEND BOSS DEFEATED BANNER
  let banner = document.createElement("div");
  banner.classList.add("boss-defeated");
  banner.innerHTML = "<h1>BOSS VANQUISHED !</h1>";

  QUEST_AREA_CONTAINER.append(banner);
};

let quest_event_counter = 0;
let handle_quest_event = () => {
  quest_event_counter++;

  if (quest_event_counter >= S.prefs.game_speed * 5) {
    quest_event_counter = 0;

    let event = select_random_from_arr(global_quest_events);
    console.log("event:", event);
    QL.append(
      `${S.quest.adventurer.name} ${select_random_from_arr(event.sentences)}`
    );

    S.quest.current_quest_progress += select_random_from_arr(event.amount);

    if (S.quest.current_quest_progress < 0) S.quest.current_quest_progress = 0;
    if (S.quest.current_quest_progress > S.quest.current_quest.duration)
      S.quest.current_quest_progress = S.quest.current_quest.duration;
  }
};

let handle_quest_area_click = (e) => {
  switch (S.quest.state) {
    case "failed":
      complete_quest(false);
      break;

    case "boss defeated":
      complete_quest();
      break;

    case "boss approaching":
      initiate_boss();
      break;

    case "in progress":
      if (!BOOST_NOTIFIER.classList.contains("clicked")) {
        BOOST_NOTIFIER.classList.add("clicked");

        if (
          S.quest.current_quest_progress + S.quest.boost_amount >
          S.quest.current_quest.duration
        ) {
          S.quest.current_quest_progress = S.quest.current_quest.duration;
          handle_quest_progress();
        } else {
          S.quest.current_quest_progress += S.quest.boost_amount;
        }

        S.stats.total_times_quest_boosted++;
        if (S.stats.total_times_quest_boosted == 1) win_achievement("boosted!");
        if (S.stats.total_times_quest_boosted == 100)
          win_achievement("rocket_boost");
      }
      break;

    case "completed":
      complete_quest();
      break;
  }
};

let complete_quest = (successful = true) => {
  let quest = select_from_arr(Quests, S.quest.current_quest.code_name);

  let boss_defeated_el = s(".boss-defeated");
  let quest_failed_el = s(".quest-failed");
  let timer = s(".timer-container");

  if (boss_defeated_el) remove_el(boss_defeated_el);
  if (quest_failed_el) remove_el(quest_failed_el);
  if (timer) remove_el(timer);

  BOOST_NOTIFIER.classList.remove("active");
  quest_event_counter = 0;
  QL.clear();

  if (successful) {
    play_sound("quest_complete");

    quest.completed = 1;
    quest.times_completed++;
    if (quest.times_completed == 5) win_achievement(quest.rewards.achievement);

    quest.total_xp_gained += quest.rewards.xp;
    S.stats.total_quests_completed++;

    if (quest.times_completed == 1) S.stats.total_unique_quests_completed++;

    if (S.stats.total_quests_completed == 1) win_achievement("novice_quester");
    if (S.stats.total_unique_quests_completed == 5)
      win_achievement("adventurer");

    let next_quest = Quests[quest.id + 1];
    if (next_quest) {
      if (next_quest.locked) next_quest.locked = 0;
    }

    gain_quest_rewards(quest);
  } else {
    play_sound("quest_failed");
    S.stats.total_quests_failed++;

    remove_el(s(".boss-container"));

    let percentage_defeated =
      1 - S.quest.current_boss_hp / S.quest.current_quest.boss.hp;
    if (percentage_defeated > 0.4) percentage_defeated = 0.4;

    let q = S.quest.current_quest;
    q.rewards.ores *= percentage_defeated;
    q.rewards.refined_ores *= percentage_defeated;
    q.rewards.xp *= percentage_defeated;

    q.rewards.ores = Math.round(q.rewards.ores);
    q.rewards.refined_ores = Math.round(q.rewards.refined_ores);
    q.rewards.xp = Math.round(q.rewards.xp);

    quest.total_xp_gained += q.rewards.xp;

    gain_quest_rewards(q, true);
  }

  reset_quest_state();
};

let gain_quest_rewards = (quest, failed = false) => {
  // reset_quest_state()

  let gem = null;
  let scroll = null;

  if (!failed) {
    gem = get_quest_gem(quest.rewards.gem);
    O.current_gem = gem;

    scroll = get_quest_scroll(quest.rewards.scrolls);
  }

  let popup = document.createElement("div");
  popup.classList.add("wrapper");

  let str = `
    <div id='quest-rewards-popup'>
      <header>
        <h1>${failed ? "Quest Failed" : "Quest Complete"}</h1>
      </header>
      <ul>
        <p>YOU EARNED</p>
        <li class='quest-reward-xp'>
          <h1>XP</h1>
          <p>${quest.rewards.xp}</p>
        </li>
        <li class='quest-reward-ores'>
          <img src="./app/assets/images/ore.png" alt="ore">
          <p>${quest.rewards.ores}</p>
        </li>
        `;
  if (quest.rewards.refined_ores >= 1) {
    str += `
          <li class='quest-reward-refined-ores'>
            <img src="./app/assets/images/refined-ore.png" alt="refined-ore">
            <p>${quest.rewards.refined_ores}</p>
          </li>
          `;
  }

  if (gem) {
    str += `
            <li
              class='quest-reward-gem'
              onmouseover='TT.show( event, { type: "gem" } )'
              onmouseout='TT.hide()'
            >
              <img src="https://via.placeholder.com/40" alt="">
              <p>1</p>
            </li>
          `;
  }

  if (scroll) {
    str += `
            <li
              class='quest-reward-scroll',
              onmouseover='TT.show( event, { type: "scroll" } )'
              onmouseout='TT.hide()'
            >
              <img src="https://via.placeholder.com/40" alt=''/>
              <p>1</p>
            </li>
          `;
  }

  str += `
      </ul>
      <button onclick='remove_wrapper()'>OK</buttom>
    </div>
  `;

  earn(quest.rewards.ores, false);
  earn_generation_xp(quest.rewards.xp);
  earn_refined_ores(quest.rewards.refined_ores);

  if (!is_empty(gem)) add_to_inventory(gem);
  if (scroll) add_to_inventory(scroll);

  popup.innerHTML = str;

  CONTAINER.append(popup);
};

let get_quest_gem = (q) => {
  if (Math.random() <= q.chance || S.stats.total_quests_completed == 1) {
    return new Gem(
      get_random_num(q.level_range[0], q.level_range[1]),
      q.gem_pool
    );
  }

  return null;
};

let get_quest_scroll = (q) => {
  if (Math.random() <= q.chance) {
    console.log("you found a scroll");
    return new Scroll(q.tier);
  }

  return null;
};

let reset_quest_state = () => {
  S.quest.state = null;
  S.quest.current_quest = null;
  S.quest.current_quest_progress = null;

  HERO.classList.remove("active", "moving", "jumping");
};

// ==== INVENTORY SHIT ===================================================================

let build_inventory_accordion = (direct = false) => {
  let str = "";
  let p = S.pickaxe.item;

  str += `
    <div class='inventory-accordion ${O.inventory_accordion_is_open && "open"}'>
      <header onclick='toggle_inventory_accordion()'>
        <p>INVENTORY</p>
        <i class='fa fa-caret-down fa-1x'></i>
      </header>
      <div>
        <h1 class='pickaxe-name ${p.rarity.name}'>${p.name}</h1>
        `;
  str += build_pickaxe_sprite(p, 192, true);
  str += `
        <p>Level ${p.level}</p>
        <p>Damage: ${beautify_number(
          p.damage
        )} <span style='opacity: .5'>( ${beautify_number(
    calculate_pickaxe_damage()
  )} )</span> </p>
        <p
          onmouseover='TT.show( event, { name: null, type: "sharpness-info" } )'
          onmouseout='TT.hide()'
          >Sharpness: ${beautify_number(
            p.sharpness
          )} <span style='opacity: .5'>( ${beautify_number(
    calculate_pickaxe_sharpness()
  )} )</span> %</p>
        <p
          onmouseover='TT.show( event, { name: null, type: "hardness-info" } )'
          onmouseout='TT.hide()'
          >Hardness: ${beautify_number(
            p.hardness
          )} <span style='opacity: .5'>( ${beautify_number(
    calculate_pickaxe_hardness()
  )} )</span> %</p>
        <p>Enhancements Available: ${p.num_of_upgrades - p.used_upgrades}/${
    p.num_of_upgrades
  }</p>
      </div>

      `;

  str += '<div class="bag-container">';
  str += build_inventory();
  str += "</div>";

  str += `

    </div>
    <div class='horizontal-separator thin dark'></div>
  `;

  if (direct) {
    s(".inventory-accordion").innerHTML = str;
    return;
  }

  return str;
};

let build_inventory = (direct = false) => {
  let str = "";

  str += "<h2>Bag</h2>";
  str += `
    <div class='bag-options-container'>
      <i onclick='trash_all_confirmation()' class='fa fa-trash-o'></i>
      <i onclick='sort_inventory()' class='fa fa-random'></i>
    </div>
  `;

  for (let i = 0; i < S.inventory.items.length; i++) {
    str += '<div class="bag-slot">';

    if (!is_empty(S.inventory.items[i])) {
      str += `<i onclick='toggle_favorite_item( ${i} )' class='fa fa-star ${
        S.inventory.items[i].favorite ? "favorite" : ""
      }'></i>`;
      str += `
        <img
          onmouseover='TT.show( event, { type: "inventory-item", inventory_index: ${i} } )'
          onmouseout='TT.hide()'
          class='inventory-item'
          onclick='handle_inventory_item_click( event, ${i} )'
          src="https://via.placeholder.com/40"/>
      `;
    }

    str += "</div>";
  }

  if (direct) {
    if (O.current_tab == "smith") {
      s(".bag-container").innerHTML = str;
      return;
    }
  }

  return str;
};

let add_to_inventory = (item) => {
  for (let i = 0; i < S.inventory.items.length; i++) {
    if (is_empty(S.inventory.items[i])) {
      item.inventory_index = i;
      S.inventory.items[i] = item;

      if (O.current_tab == "smith") build_inventory(true);

      return;
    }
  }

  notify("Inventory is full", "red", "error");
};

let handle_inventory_item_click = (e, index) => {
  if (s(".inventory-item-click-popup")) return;

  let item = S.inventory.items[index];
  console.log("item", item);

  let popup = document.createElement("div");
  popup.classList.add("inventory-item-click-popup");
  let str = "";

  if (item.item_type == "gem") {
    str += `<p onclick='socket_gem( event, ${index} )'><i class='fa fa-diamond fa-1x'></i> Socket Gem</p>`;
  } else if (item.item_type == "scroll") {
    str += `<p onclick='use_scroll( event, ${index} )'><i class='fa fa-bolt fa-1x'></i> Use Scroll</p>`;
  }

  str += `<p onclick='trash_gem_confirmation( event, ${index} )'><i class='fa fa-trash-o fa-1x'></i>Trash Gem</p>`;
  popup.innerHTML = str;

  CONTAINER.append(popup);
  console.log(popup);

  //reflow
  popup.getBoundingClientRect();

  O.item_popup_visible = true;
  e.stopPropagation();

  popup.style.left = e.clientX + "px";
  popup.style.top = e.clientY + 10 + "px";
};

let toggle_favorite_item = (index) => {
  let item = S.inventory.items[index];
  item.favorite = !item.favorite;

  build_inventory(true);
};

let use_scroll = (e, item_index) => {
  if (S.pickaxe.item.used_upgrades < S.pickaxe.item.num_of_upgrades) {
    S.pickaxe.item.used_upgrades++;

    let scroll = S.inventory.items[item_index];
    S.inventory.items[item_index] = {};

    let successful = Math.random() <= scroll.chance;

    if (successful) {
      notify("enhancement successful", "green");
      play_sound("scroll_successful");
      if (scroll.stat != "damage") {
        S.pickaxe.item[`${scroll.stat}`] += scroll.amount;
      } else {
        S.pickaxe.item.damage += S.pickaxe.item.damage * amount;
      }
    } else {
      notify("enhancement failed", "red");
      play_sound("scroll_failed");
    }
  } else {
    notify("You can't enhance your pickaxe any further", "red", "error");
  }

  O.rebuild_smith_tab = 1;
};

let socket_gem = (e, item_index) => {
  if (!S.pickaxe.item.sockets) {
    notify("Your pickaxe doesnt contain any sockets", "red", "error");
    return;
  }

  let socketed_bool = false;

  for (let i = 0; i < S.pickaxe.item.sockets.socket.length; i++) {
    if (is_empty(S.pickaxe.item.sockets.socket[i])) {
      play_sound("socket_gem");

      socketed_bool = true;
      S.pickaxe.item.sockets.socket[i] = S.inventory.items[item_index];
      S.inventory.items[item_index] = {};

      build_inventory_accordion(true);

      O.recalculate_opc = 1;
      O.recalculate_ops = 1;

      return;
    }
  }

  if (!socketed_bool) {
    notify("No available sockets", "red", "error");
  }
};

let unsocket_gem = (e, socket_index) => {
  play_sound("socket_gem");
  TT.hide();

  add_to_inventory(S.pickaxe.item.sockets.socket[socket_index]);
  S.pickaxe.item.sockets.socket[socket_index] = {};

  build_inventory_accordion(true);

  O.recalculate_opc = 1;
  O.recalculate_ops = 1;
};

let trash_gem_confirmation = (event, item_index) => {
  let wrapper = document.createElement("div");
  wrapper.classList.add("wrapper");

  let str = `
    <div class='confirm-trash-socket'>
      <h1>Trash Socket</h1>
      <p>Are you sure you want to trash your ${S.inventory.items[item_index].name}?</p>
      <button onclick='trash_gem( event, ${item_index} ); remove_wrapper()'>YA</button>
      <button onclick='remove_wrapper()'>NA</button>
    </div>
  `;

  wrapper.innerHTML = str;

  CONTAINER.append(wrapper);
};

let trash_gem = (event, item_index) => {
  let item = S.inventory.items[item_index];

  if (item.favorite) {
    notify("Gem is favorited. Unfavorite to trash gem", "red", "error");
  } else {
    item = {};
    build_inventory(true);
  }
};

let trash_all_confirmation = () => {
  let div = document.createElement("div");
  div.classList.add("wrapper");

  let str = `
    <div class='confirm-trash-socket'>
      <h1>Trash All</h1>
      <p>Are you sure you want to trash your items?</p>
      <p>You will keep all your favorited items</p>
      <ul>
      `;

  S.inventory.items.forEach((item) => {
    if (!is_empty(item) && !item.favorite) {
      str += `<li>${item.name} - Lv.${item.level}</li>`;
    }
  });

  str += `
      </ul>
      <button onclick='trash_all(); remove_wrapper()'>YES</button>
      <button onclick='remove_wrapper()'>NO</button>
    </div>
  `;

  div.innerHTML = str;

  CONTAINER.append(div);
};

let trash_all = () => {
  console.log("trash all firing");

  for (let i = 0; i < S.inventory.items.length; i++) {
    if (!S.inventory.items[i].favorite) {
      S.inventory.items[i] = {};
    } else {
      console.log(S.inventory.items[i], "is a favorite");
    }
  }

  build_inventory(true);
};

let sort_inventory = () => {
  let favorites = [];
  let not_favorites = [];

  S.inventory.items.forEach((item) => {
    if (!is_empty(item)) {
      if (item.favorite) {
        favorites.push(item);
      } else {
        not_favorites.push(item);
      }
    }
  });

  S.inventory.items = [];

  favorites = favorites.sort((a, b) => b.level - a.level);
  not_favorites = not_favorites.sort((a, b) => b.level - a.level);

  S.inventory.items.push(...favorites);
  S.inventory.items.push(...not_favorites);

  while (S.inventory.items.length < S.inventory.max_slots) {
    S.inventory.items.push({});
  }

  build_inventory(true);
};

// =======================================================================================

let game_loop = () => {
  let tick_ms = O.window_blurred ? 1000 : 1000 / S.prefs.game_speed;
  let earn_amount = O.window_blurred ? S.ops : S.ops / S.prefs.game_speed;

  update_ore_sprite();

  build_topbar_inventory_ores();
  build_topbar_inventory_refined_ores();
  build_topbar_inventory_generation();

  if (O.recalculate_ops) calculate_ops();
  if (O.recalculate_opc) calculate_opc();
  if (O.rebuild_store_tab) build_store_tab();
  if (O.rebuild_smith_tab) build_smith_tab();
  if (O.reposition_elements) position_elements();
  if (O.rebuild_bottom_tabs) build_bottom_tabs();

  if (!is_empty(SMITH.upgrade_in_progress)) SMITH._update_progress();
  if (S.quest.state == "boss") update_boss_time_limit(tick_ms);

  if (!O.quest_initialized) quest_initialization();
  if (S.quest.state == "in progress") {
    handle_quest_progress(tick_ms);
    handle_quest_event();
  }

  earn(earn_amount);

  handle_combo_shields(1000 / tick_ms);

  setTimeout(game_loop, tick_ms);
};

let game_loop_1s = () => {
  O.counter++;
  S.stats.seconds_played++;

  if (O.current_tab == "store") update_building_prices();
  if (S.ops > 0 && S.prefs.show_rising_numbers)
    RN.new(null, "buildings", S.ops);

  // THIS RUNS EVERY --------------------------------- ↓ seconds
  if (O.counter % (S.prefs.game_speed * S.gold_nugget_spawn_rate) == 0)
    spawn_gold_nugget();

  setTimeout(game_loop_1s, 1000);
};

let update_ore_hp = (amount) => {
  if (S.current_ore_hp - amount <= 0) {
    play_sound("ore_destroyed");

    if (s("#tutorial-click-the-rock")) remove_el(s("#tutorial-click-the-rock"));

    S.stats.current_rocks_destroyed += 1;
    S.stats.total_rocks_destroyed += 1;

    if (S.stats.total_rocks_destroyed == 1) tutorial_buy_building();

    if (S.stats.total_rocks_destroyed == 2) {
      if (Tabs[1].hidden == 1) {
        Tabs[1].hidden = 0;
        build_tabs();
      }
    }

    S.current_ore_max_hp = Math.pow(S.current_ore_max_hp, 1.09);
    S.current_ore_hp = S.current_ore_max_hp;

    S.misc.current_ore_sprite = get_random_num(1, S.misc.ore_sprite_amount);

    if (
      Math.random() <= S.pickaxe_drop_chance ||
      S.stats.total_rocks_destroyed == 1
    ) {
      generate_item_drop();
    }

    current_sprite = 0;

    if (S.stats.total_rocks_destroyed == 1) win_achievement("newbie_miner");
    if (S.stats.total_rocks_destroyed == 10) win_achievement("novice_miner");
    if (S.stats.total_rocks_destroyed == 25)
      win_achievement("intermediate_miner");
    if (S.stats.total_rocks_destroyed == 50) win_achievement("advanced_miner");
    if (S.stats.total_rocks_destroyed == 100) win_achievement("master_miner");
    if (S.stats.total_rocks_destroyed == 200) win_achievement("chief_miner");
    if (S.stats.total_rocks_destroyed == 500) win_achievement("exalted_miner");
    if (S.stats.total_rocks_destroyed == 1000) win_achievement("god_miner");
  } else {
    S.current_ore_hp -= amount;
  }

  switch (S.prefs.show_rock_hp) {
    case "percentage":
      ORE_HP.innerHTML =
        beautify_number((S.current_ore_hp / S.current_ore_max_hp) * 100) + "%";
      break;

    case "hp":
      let progress = beautify_number(
        (S.current_ore_hp / S.current_ore_max_hp) * 100
      );
      let str = `
        <div class='ore-hp-bar-container'>
          <p>${beautify_number(S.current_ore_hp)} / ${beautify_number(
        S.current_ore_max_hp
      )} </p>
          <div style='width: ${progress}%' class='ore-hp-bar'></div>
        </div>
      `;
      ORE_HP.innerHTML = str;
      break;

    default:
      ORE_HP.innerHTML = "";
      break;
  }
};

let current_sprite = 0;
let update_ore_sprite = (update_from_state = false) => {
  let current_percentage = (S.current_ore_hp / S.current_ore_max_hp) * 100;
  let calc_sprite = Math.min(5, 6 - Math.ceil(current_percentage / 20));
  if (current_sprite !== calc_sprite) {
    current_sprite = calc_sprite;
    ORE_SPRITE.src = `./app/assets/images/ore${S.misc.current_ore_sprite}-${current_sprite}.png`;

    if (!update_from_state) {
      play_sound("ore_percentage_lost");
      handle_rock_particles(null, 5);
      if (Math.random() <= 0.6) {
        let amount = select_random_from_arr([1, 1, 1, 2]);
        for (let i = 0; i < amount; i++) {
          generate_item_drop(true);
        }
      }
    }
  }
};

let build_topbar_inventory_ores = () => {
  let str = "";

  str += `Ores: ${beautify_number(S.ores)}`;

  if (S.ops > 0) str += ` (${beautify_number(S.ops)}/s)`;

  ORES_AMOUNT.innerHTML = str;
};

let build_topbar_inventory_refined_ores = () => {
  if (S.stats.total_refined_ores_earned > 0) {
    REFINED_ORES_AMOUNT.innerHTML = `Refined Ores: ${beautify_number(
      S.refined_ores
    )}`;
  }
};

let build_topbar_inventory_generation = () => {
  GENERATION_LVL.innerHTML = `Generation: ${S.generation.level}`;
};

let build_achievements = () => {
  let wrapper = document.createElement("div");
  wrapper.classList.add("wrapper");

  let str = `
    <div class='stats-container'>
      <h1>Achievements</h1>
      <ul>
        <h2>Stats</h2>
        <li><span>Highest Combo: ${S.stats.highest_combo}</li>
        <li><span>Total Clicks:</span> ${S.stats.total_clicks}</li>
        <li><span>Total Weak Spot Clicks:</span> ${
          S.stats.total_weak_hit_clicks
        }</li>
        <li><span>Seconds Played:</span> ${S.stats.seconds_played}</li>
        <li><span>Current Rocks Destroyed:</span> ${
          S.stats.current_rocks_destroyed
        }</li>
        <li><span>Total Rocks Destroyed:</span> ${
          S.stats.total_rocks_destroyed
        }</li>
        <li><span>Total Ores Earned:</span> ${beautify_number(
          S.stats.total_ores_earned
        )}</li>
        <li><span>Total Ores Mined:</span> ${beautify_number(
          S.stats.total_ores_manually_mined
        )}</li>
        <li><span>Total Refined Ores Earned:</span> ${beautify_number(
          S.stats.total_refined_ores_earned
        )}</li>
        <li><span>Total Gold Nuggets Spawned:</span> ${
          S.stats.total_nuggets_spawned
        }</li>
        <li><span>Total Gold Nuggets Clicked:</span> ${
          S.stats.total_nuggets_clicked
        } </li>
        <li><span>Total Gold Nuggets Missed:</span> ${
          S.stats.total_nuggets_missed
        }</li>
      </ul>
      <div class='achievement-container'>
        `;
  Achievements.forEach((achievement) => {
    str += `
          <div 
            class="achievement-square ${!achievement.won && "locked"}"
            `;

    if (achievement.won) {
      str += `
              onmouseover="TT.show( event, { name: '${achievement.code_name}', type: 'achievement-square' } )"
              onmouseout='TT.hide()'
            `;
    }

    str += `
            
            style='background-image: url( ${achievement.img} )'
            >
          </div>
          `;
  });

  str += `
      <i onclick='remove_wrapper()' class='fa fa-times fa-1x'></i>
    </div>
  `;

  wrapper.innerHTML = str;
  CONTAINER.append(wrapper);
};

let win_achievement = (achievement_code_name) => {
  let achievement = select_from_arr(Achievements, achievement_code_name);

  if (achievement.won == 0) {
    achievement.win();

    let achievement_el = document.createElement("div");
    achievement_el.classList.add("achievement");
    let str = `
      <header>
        <img src='${achievement.img}' alt='achievement img' />
        <h1>${achievement.name} <small>[ ${achievement.type} achievement ]</small></h1>
      </header>
      <p>${achievement.desc}</p>
    `;

    let r = achievement.reward;
    if (r) {
      if (r.increase_weak_hit_multi) {
        str += `<p class='achievement-reward'>+ Permanently increase <strong>weak-hit</strong> multiplier by <strong>${achievement.reward.increase_weak_hit_multi}</strong></p>`;
      }
      if (r.increase_pickaxe_hardness) {
        str += `<p class='achievement-reward'>+ Permanently increase <strong>pickaxe hardness</strong> by <strong>${r.increase_pickaxe_hardness}%</strong></p>`;
      }
      if (r.increase_pickaxe_sharpness) {
        str += `<p class='achievement-reward'>+ Permanently increase <strong>pickaxe sharpness</strong> by <strong>${r.increase_pickaxe_sharpness}%</strong></p>`;
      }
    }

    if (achievement.flavor_text) {
      str += `<small>${achievement.flavor_text}</small>`;
    }

    achievement_el.innerHTML = str;

    ACHIEVEMENT_NOTIFICATION_CONTAINER.append(achievement_el);
    achievement_el.style.marginTop = "-" + achievement_el.offsetHeight + "px";

    achievement_el.addEventListener("animationend", () => {
      remove_el(achievement_el);
    });
  }
};

// ==== SETTINGS SHIT ====================================================================

let betaAlert = () => {
  const wrapper = document.createElement("div");
  wrapper.classList.add("wrapper");

  wrapper.innerHTML = `
    <div class='beta-alert'>
      <i onclick='remove_wrapper()' class='fa fa-times fa-1x'></i>
      <h1>MORE ORE BETA</h1>
      <p style='font-size: 24px;'>More Ore is officially in OPEN BETA!</p>
      <a style='
        color: white;
        text-align: center;
        position: relative;
        display: inline-block;
        left: 50%;
        transform: translateX(-50%);
        padding: 10px 25px;
        background: lime;
        text-shadow: 0 0 5px black, 0 0 1px black;
        border-radius: 5px;
        margin-top: 10px;
        cursor: pointer;
        text-decoration: none;
        font-weight: bold;
        letter-spacing: .5px;
        box-shadow: -2px -2px 3px rgba(255, 255, 255, 0.3) inset, 2px 2px 3px rgba(0, 0, 0, 0.3) inset;
      ' href='https://syns.studio/more-ore?redirected=from-secret' target='_blank'>JOIN THE OPEN BETA</a>
    </div>
  `;

  CONTAINER.append(wrapper);
};

betaAlert();

let build_settings = () => {
  let wrapper = document.createElement("div");
  wrapper.classList.add("wrapper");

  let str = `
    <div class='settings-container'>
      <h1>Settings</h1>
      <i onclick='remove_wrapper()' class='fa fa-times fa-1x'></i>
      <hr />
      <h2>Game</h2>
      <div class="select-container">
        <p>Rock HP Format</p>
        <select id="select-rock-hp" onchange='change_select_value( "select-rock-hp", "show_rock_hp" )'>
          <option ${
            S.prefs.show_rock_hp == 0 ? "selected" : ""
          } value=0>None</option>
          <option ${
            S.prefs.show_rock_hp == "percentage" ? "selected" : ""
          } value="percentage">Percentage</option>
          <option ${
            S.prefs.show_rock_hp == "hp" ? "selected" : ""
          } value="hp">HP</option>
        </select>
      </div>

      <div class='select-container'>
        <p>Number Format</p>
        <select id='select-number-format' onchange='change_select_value( "select-number-format", "number_format" )'>
          <option ${
            S.prefs.number_format == 0 ? "selected" : ""
          } value=0>Default</option>
          <option ${
            S.prefs.number_format == 1 ? "selected" : ""
          } value=1>Scientific Notation</option>
        </select>
      </div>

      <br/>
      <h2>Volume</h2>
      <div>
        <p>Mute BGM</p>
        <input id='checkbox-bgm' type='checkbox' onchange='toggle_bgm_mute()' ${
          S.prefs.bgm_muted ? "checked" : ""
        }/>
      </div>
      <p class='range-slider'>BGM <input id='range-bgm_volume' type='range' min='0' max='1' step='.1' value='${
        S.prefs.bgm_volume
      }' onchange='change_bgm_volume()'/></p>
      <div>
        <p>Mute SFXs</p>
        <input id='checkbox-sfx' type='checkbox' onchange='toggle_sfx_mute()' ${
          S.prefs.sfx_muted ? "checked" : ""
        }/>
      </div>
      <p class='range-slider'>SFX <input id='range-sfx_volume' type='range' min='0' max='1' step='.1' value='${
        S.prefs.sfx_volume
      }' onchange='change_sfx_volume()'/></p>
      <br/>
      <h2>Performance</h2>
      <div class='select-container'>
        <p>My computer... </p>
        <select id='select-tick_rate' onchange='change_tick_rate()'>
          <option value=1 ${
            S.prefs.game_speed == 1 ? "selected" : ""
          }>is powered by a hamster</option>
          <option value=5 ${
            S.prefs.game_speed == 5 ? "selected" : ""
          }>runs windows 95</option>
          <option value=10 ${
            S.prefs.game_speed == 10 ? "selected" : ""
          }>sucks</option>
          <option value=15 ${
            S.prefs.game_speed == 15 ? "selected" : ""
          }>is okay</option>
          <option value=30 ${
            S.prefs.game_speed == 30 ? "selected" : ""
          }>is decent</option>
          <option value=45 ${
            S.prefs.game_speed == 45 ? "selected" : ""
          }>is godly</option>
        </select>
      </div>
      <div>
        <p>Disable Rising Numbers/Texts</p>
        <input id='checkbox-rising_numbers' type='checkbox' onchange='toggle_rising_numbers()' ${
          S.prefs.show_rising_numbers ? "" : "checked"
        }>
      </div>
      <div>
        <p>Disable Rock Particles</p>
        <input id='checkbox-rock_particles' type='checkbox' onchange='toggle_rock_particles()' ${
          S.prefs.show_rock_particles ? "" : "checked"
        }>
      </div>
      
    </div>
  `;

  wrapper.innerHTML = str;
  CONTAINER.append(wrapper);
};

let toggle_rising_numbers = () => {
  let checkbox = s("#checkbox-rising_numbers");

  if (checkbox.checked) {
    S.prefs.show_rising_numbers = false;
  } else {
    S.prefs.show_rising_numbers = true;
  }
};

let toggle_rock_particles = () => {
  let checkbox = s("#checkbox-rock_particles");

  if (checkbox.checked) {
    S.prefs.show_rock_particles = false;
  } else {
    S.prefs.show_rock_particles = true;
  }
};

let toggle_bgm_mute = () => {
  let checkbox = s("#checkbox-bgm");

  if (checkbox.checked) {
    S.prefs.bgm_muted = true;
  } else {
    S.prefs.bgm_muted = false;
  }
};

let toggle_sfx_mute = () => {
  let checkbox = s("#checkbox-sfx");

  if (checkbox.checked) {
    S.prefs.sfx_muted = true;
  } else {
    S.prefs.sfx_muted = false;
  }
};

let change_rock_hp_display = () => {
  let select = s("#select-rock-hp");
  S.prefs.show_rock_hp = select.value;
};

let change_select_value = (name, state_key) => {
  let select = s(`#${name}`);
  S.prefs[`${state_key}`] = select.value;

  if (O.current_tab == "store") O.rebuild_store_tab = 1;
  if (O.current_tab == "smith") O.rebuild_smith_tab = 1;
};

let change_bgm_volume = () => {
  let slider = s("#range-bgm_volume");
  S.prefs.bgm_volume = slider.value;
};

let change_sfx_volume = () => {
  let slider = s("#range-sfx_volume");
  S.prefs.sfx_volume = slider.value;
};

let change_tick_rate = () => {
  let select = s("#select-tick_rate");
  S.prefs.game_speed = select.value;
};

// ==== GOLD NUGGET SHIT =================================================================

let spawn_gold_nugget = () => {
  if (
    Math.random() <= S.gold_nugget_chance_to_spawn * 0.01 ||
    S.stats.total_nuggets_clicked == 0
  ) {
    S.stats.total_nuggets_spawned++;
    let nugget = document.createElement("div");
    nugget.onclick = handle_gold_nugget_click;

    let pos = {
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
    };

    nugget.classList.add("gold-nugget");
    nugget.style.left = pos.x + "px";
    nugget.style.top = pos.y + "px";
    nugget.style.animation =
      "rotate 5s infinite linear, fade_in_out 10s linear forwards";

    nugget.addEventListener("animationend", () => {
      remove_el(nugget);
      S.stats.total_nuggets_missed++;
    });

    BODY.append(nugget);
  }
};

let handle_gold_nugget_click = (event, is_event = null) => {
  S.stats.total_nuggets_clicked++;

  if (S.stats.total_nuggets_clicked == 1) {
    unlock_smith_upgrade("gold_nuggies_frequency_i");
    unlock_smith_upgrade("gold_nuggies_chance_up_i");
  }
  if (S.stats.total_nuggets_clicked == 10) {
    unlock_smith_upgrade("gold_nuggies_frequency_ii");
    unlock_smith_upgrade("gold_nuggies_chance_up_ii");
  }
  if (S.stats.total_nuggets_clicked == 30) {
    unlock_smith_upgrade("gold_nuggies_frequency_iii");
    unlock_smith_upgrade("gold_nuggies_chance_up_iii");
  }

  play_sound("gold_nugget_click");
  remove_el(event.target);

  let chance = Math.random();

  if (is_event == "gold rush" || chance <= 0.7) {
    let amount = S.ops * 13 + S.opc * 13;

    earn(amount, false);
    RN.new(event, "gold-nugget-click", amount);
  } else if (chance >= 0.7 && chance <= 0.9) {
    RN.new(event, "gold-rush", null);
    start_gold_rush();
  } else {
    RN.new(event, "ore-madness", null);
    start_ore_madness();
  }
};

let start_gold_rush = () => {
  let nuggets_to_spawn = 10;
  let fall_speed = 5; // seconds
  let nuggets_clicked = 0;

  let duration = (nuggets_to_spawn + fall_speed) * SECOND;

  let gold_rush_container = document.createElement("div");
  gold_rush_container.classList.add("gold-rush-container");

  CONTAINER.append(gold_rush_container);

  let counter = 0;
  let spawner = setInterval(() => {
    counter++;

    if (counter >= nuggets_to_spawn) clearInterval(spawner);

    let nugget = document.createElement("div");
    nugget.classList.add("gold-nugget");
    nugget.onclick = (e) => {
      nuggets_clicked++;
      handle_gold_nugget_click(e, "gold rush");
      if (nuggets_clicked == nuggets_to_spawn)
        win_achievement("pinpoint_accuracy");
    };
    nugget.addEventListener("animationend", () => remove_el(nugget));

    s(".gold-rush-container").append(nugget);

    let random_x = Math.random() * window.innerWidth;
    nugget.style.left = random_x + "px";
    nugget.style.animation = `fall_down ${fall_speed}s linear forwards, spin 2s infinite linear`;
  }, 1000);

  setTimeout(() => {
    remove_el(gold_rush_container);
  }, duration);
};

let start_ore_madness = () => {
  let duration = 10;

  let cover = document.createElement("div");
  cover.classList.add("ore-madness-cover");
  BODY.classList.add("ore-madness");

  O.ore_madness_active = 1;
  O.recalculate_opc = 1;

  setTimeout(() => {
    BODY.classList.remove("ore-madness");
    remove_el(cover);

    O.ore_madness_active = 0;
    O.recalculate_opc = 1;
  }, duration * SECOND);

  BODY.append(cover);
};

// =======================================================================================

window.onload = () => {
  init_game();
};
window.onresize = () => {
  O.reposition_elements = 1;
};
window.onblur = on_blur;
window.onfocus = on_focus;
document.onkeydown = (e) => {
  if (e.code == "Escape" || e.key == "Escape") {
    remove_wrapper();
  }
};

let pressed = [];
let secretCode = "synclair";
window.addEventListener("keyup", (e) => {
  if (e.key != "Shift") {
    pressed.push(e.key.toLowerCase());
    pressed.splice(-secretCode.length - 1, pressed.length - secretCode.length);
    if (pressed.join("").includes(secretCode)) {
      win_achievement("who_am_i?");
    }
    if (pressed.join("").includes("qq")) {
      // Smith_Upgrades.forEach( upgrade => { upgrade.duration = 200 })
      // S.pickaxe.item.damage *= 1000
      // S.refined_ores += 100
      // Quests.forEach( quest => quest.duration = 1 * SECOND )
    }
    if (pressed.join("").includes("qwer")) {
      s(".ore-container").style.background = "black";
      s(".ore-sprite").style.background = "gray";
      s(".ore-sprite").src = null;
      s(".torch-left").style.visibility = "hidden";
      s(".torch-right").style.visibility = "hidden";
      s(".combo-sign-container").style.visibility = "hidden";
      s(".left").style.background = "black";
      s(".quest-area-container").style.background = "black";
      s(".tab-content").innerHTML = "";
      TOPBAR_INVENTORY_CONTAINER.style.visibility = "hidden";

      s(".smith-upgrades").style.visibility = "hidden";
    }
  }
});

setInterval(save_game, 1000 * 30);
