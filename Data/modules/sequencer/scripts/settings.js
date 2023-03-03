import SequencerEffectsUI from "./formapplications/sequencer-effects-ui.js";
import CONSTANTS from "./constants.js";
import { user_can_do } from "./lib/lib.js";

export function registerSettings() {

  // Define a settings submenu which handles advanced configuration needs
  game.settings.registerMenu(CONSTANTS.MODULE_NAME, "openSequencerDatabaseViewer", {
    name: "SEQUENCER.Setting.DatabaseViewer.Title",
    label: "SEQUENCER.Setting.DatabaseViewer.Label",
    icon: "fas fa-bars",
    type: Sequencer.DatabaseViewer,
    restricted: true
  });

  game.settings.register(CONSTANTS.MODULE_NAME, "enable-pixi-fix", {
    name: "SEQUENCER.Setting.EnablePixiFix.Title",
    hint: "SEQUENCER.Setting.EnablePixiFix.Label",
    scope: "client",
    config: true,
    default: true,
    requiresReload: true,
    type: Boolean
  });

  game.settings.register(CONSTANTS.MODULE_NAME, "enable-global-pixi-fix", {
    name: "SEQUENCER.Setting.EnableGlobalPixiFix.Title",
    hint: "SEQUENCER.Setting.EnableGlobalPixiFix.Label",
    scope: "client",
    config: true,
    default: false,
    requiresReload: true,
    type: Boolean
  });

  game.settings.register(CONSTANTS.MODULE_NAME, "enable-above-ui-screenspace", {
    name: "SEQUENCER.Setting.EnableAboveUIScreenspace.Title",
    hint: "SEQUENCER.Setting.EnableAboveUIScreenspace.Label",
    scope: "client",
    config: true,
    default: true,
    requiresReload: true,
    type: Boolean
  });

  game.settings.register(CONSTANTS.MODULE_NAME, "debug", {
    name: "SEQUENCER.Setting.Debug.Title",
    hint: "SEQUENCER.Setting.Debug.Label",
    scope: "client",
    config: true,
    default: false,
    type: Boolean
  });

  game.settings.register(CONSTANTS.MODULE_NAME, "showSidebarTools", {
    name: "SEQUENCER.Setting.ShowTools.Title",
    hint: "SEQUENCER.Setting.ShowTools.Label",
    scope: "client",
    config: true,
    default: true,
    requiresReload: true,
    type: Boolean
  });

  game.settings.register(CONSTANTS.MODULE_NAME, "showTokenSidebarTools", {
    name: "SEQUENCER.Setting.ShowTokenTools.Title",
    hint: "SEQUENCER.Setting.ShowTokenTools.Label",
    scope: "client",
    config: true,
    default: true,
    requiresReload: true,
    type: Boolean
  });

  game.settings.register(CONSTANTS.MODULE_NAME, "effectsEnabled", {
    name: "SEQUENCER.Setting.EnableEffects.Title",
    hint: "SEQUENCER.Setting.EnableEffects.Label",
    scope: "client",
    config: true,
    default: true,
    requiresReload: true,
    type: Boolean
  });

  game.settings.register(CONSTANTS.MODULE_NAME, "soundsEnabled", {
    name: "SEQUENCER.Setting.EnableSounds.Title",
    hint: "SEQUENCER.Setting.EnableSounds.Label",
    scope: "client",
    config: true,
    default: true,
    requiresReload: true,
    type: Boolean
  });

  game.settings.register(CONSTANTS.MODULE_NAME, "user-effect-opacity", {
    name: "SEQUENCER.Setting.ExternalEffectOpacity.Title",
    hint: "SEQUENCER.Setting.ExternalEffectOpacity.Label",
    scope: "client",
    config: true,
    default: 50,
    type: Number,
    range: {
      min: 0,
      max: 100,
      step: 1
    }
  });

  const permissionLevels = [
    game.i18n.localize("SEQUENCER.Permission.Player"),
    game.i18n.localize("SEQUENCER.Permission.Trusted"),
    game.i18n.localize("SEQUENCER.Permission.Assistant"),
    game.i18n.localize("SEQUENCER.Permission.GM")
  ];

  game.settings.register(CONSTANTS.MODULE_NAME, "permissions-effect-create", {
    name: "SEQUENCER.Setting.Permission.EffectCreate.Title",
    hint: "SEQUENCER.Setting.Permission.EffectCreate.Label",
    scope: "world",
    config: true,
    default: 0,
    type: Number,
    choices: permissionLevels,
    requiresReload: true
  });

  game.settings.register(CONSTANTS.MODULE_NAME, "permissions-effect-delete", {
    name: "SEQUENCER.Setting.Permission.EffectDelete.Title",
    hint: "SEQUENCER.Setting.Permission.EffectDelete.Label",
    scope: "world",
    config: true,
    default: 2,
    type: Number,
    choices: permissionLevels,
    requiresReload: true
  });

  game.settings.register(CONSTANTS.MODULE_NAME, "permissions-sound-create", {
    name: "SEQUENCER.Setting.Permission.SoundCreate.Title",
    hint: "SEQUENCER.Setting.Permission.SoundCreate.Label",
    scope: "world",
    config: true,
    default: 0,
    type: Number,
    choices: permissionLevels,
    requiresReload: true
  });

  game.settings.register(CONSTANTS.MODULE_NAME, "permissions-preload", {
    name: "SEQUENCER.Setting.Permission.PreloadClients.Title",
    hint: "SEQUENCER.Setting.Permission.PreloadClients.Label",
    scope: "world",
    config: true,
    default: 1,
    type: Number,
    choices: permissionLevels,
    requiresReload: true
  });

  game.settings.register(CONSTANTS.MODULE_NAME, "permissions-sidebar-tools", {
    name: "SEQUENCER.Setting.Permission.UseSidebarTools.Title",
    hint: "SEQUENCER.Setting.Permission.UseSidebarTools.Label",
    scope: "world",
    config: true,
    default: 0,
    type: Number,
    choices: permissionLevels,
    requiresReload: true
  });

  game.settings.register(CONSTANTS.MODULE_NAME, "hyperspace-deprecation-warning", {
    scope: "world",
    config: false,
    default: false,
    type: Boolean
  });

  game.settings.register(CONSTANTS.MODULE_NAME, "effectPresets", {
    scope: "client",
    default: {},
    type: Object
  });

  Hooks.on("getSceneControlButtons", (controls) => {

    if (!game.settings.get(CONSTANTS.MODULE_NAME, "showSidebarTools")) return;

    const selectTool = {
      icon: "fas fa-expand",
      name: "select-effect",
      title: "Select Effect",
      visible: user_can_do("permissions-effect-create") && user_can_do('permissions-sidebar-tools'),
    };

    const playTool = {
      icon: "fas fa-play",
      name: "play-effect",
      title: "Play Effect",
      visible: user_can_do("permissions-effect-create") && user_can_do('permissions-sidebar-tools'),
      onClick: () => {
        SequencerEffectsUI.show({ inFocus: true, tab: "player" });
      }
    };

    const viewer = {
      icon: "fas fa-film",
      name: "effectviewer",
      title: "Show Sequencer Effects Viewer",
      button: true,
      visible: user_can_do("permissions-effect-create") && user_can_do('permissions-sidebar-tools'),
      onClick: () => {
        SequencerEffectsUI.show({ inFocus: true, tab: "manager" });
      }
    };

    const database = {
      icon: "fas fa-database",
      name: "effectdatabase",
      title: "Show Sequencer Database",
      button: true,
      visible: user_can_do('permissions-sidebar-tools'),
      onClick: () => {
        Sequencer.DatabaseViewer.show(true);
      }
    };

    controls.push({
      name: CONSTANTS.MODULE_NAME,
      title: "Sequencer Layer",
      icon: "fas fa-list-ol",
      layer: "sequencerEffects",
      visible: user_can_do("permissions-effect-create") && user_can_do("permissions-sidebar-tools"),
      activeTool: "select-effect",
      tools: [
        selectTool,
        playTool,
        viewer,
        database
      ]
    })

    if (!game.settings.get(CONSTANTS.MODULE_NAME, "showTokenSidebarTools")) return;

    const bar = controls.find(c => c.name === "token");
    bar.tools.push(database);
    bar.tools.push(viewer);

  });

  console.log("Sequencer | Registered settings");

}

export async function migrateSettings(){

  const oldPixiFixSetting = game.settings.storage.get('client').getItem('sequencer.disable-pixi-fix');

  if(oldPixiFixSetting){
    const value = oldPixiFixSetting === "true";
    game.settings.storage.get('client').removeItem('sequencer.disable-pixi-fix')
    await game.settings.set(CONSTANTS.MODULE_NAME, 'enable-pixi-fix', !value);
  }

  const oldScreenspaceSetting = game.settings.storage.get('client').getItem('sequencer.disable-above-ui-screenspace');
  if(oldScreenspaceSetting){
    const value = oldScreenspaceSetting === "true";
    game.settings.storage.get('client').removeItem('sequencer.disable-above-ui-screenspace')
    await game.settings.set(CONSTANTS.MODULE_NAME, 'enable-above-ui-screenspace', !value);
  }

}
