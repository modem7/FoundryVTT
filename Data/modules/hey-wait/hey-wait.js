/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/module/Animator.js":
/*!********************************!*\
  !*** ./src/module/Animator.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Animator)
/* harmony export */ });
/* global PIXI */

/**
 * A class to animate the Hey, Wait! reactions. This currently includes showing
 * a "?" or "!" on top of the specified X and Y coordinates.
 */
class Animator {
  constructor(layer, ease) {
    /**
     * The injected Layer instance dependency.
     */
    this.layer = layer;
    /**
     * The injected PIXI Ease dependency.
     */

    this.ease = ease;
  }
  /**
   * Enum for the animation types.
   *
   * @return {Object}
   */


  static get animationTypes() {
    return {
      TYPE_NONE: 0,
      TYPE_INFO: 1,
      TYPE_QUESTION: 2,
      TYPE_EXCLAMATION: 3
    };
  }
  /**
   * Animate the selected Hey, Wait! reaction type to the user.
   *
   * @param {Animator.animationTypes} type
   *   The specified type to animate.
   * @param {number} x
   *   The X coordinate where we should render the sprite.
   * @param {number} y
   *   The Y coordinate where we should render the sprite.
   * @param {number} gridSize
   *   The size of a grid space.
   */


  animate(type, x, y, gridSize) {
    if (type === Animator.animationTypes.TYPE_NONE) {
      return;
    }

    const sprite = this._getSprite(type, gridSize);

    sprite.alpha = 0; // Ensure we're anchoring to the center of the token.

    sprite.anchor.set(0.5);
    sprite.position.x = x;
    sprite.position.y = y;
    sprite.name = Math.random().toString(36).substring(16);
    const child = this.layer.addChild(sprite);
    const anim1 = this.ease.add(child, {
      alpha: 100,
      x,
      y: y - gridSize * 0.25
    }, {
      duration: 150
    });
    anim1.once('complete', () => {
      const anim2 = this.ease.add(child, {
        x,
        y: y - gridSize * 1.25
      }, {
        duration: 100
      });
      anim2.once('complete', () => {
        const anim3 = this.ease.add(child, {
          x,
          y: y - gridSize * 0.85
        }, {
          duration: 100
        });
        anim3.once('complete', () => {
          const anim4 = this.ease.add(child, {
            x,
            y: y - gridSize * 0.95
          }, {
            duration: 45
          });
          anim4.once('complete', () => {
            const anim5 = this.ease.add(child, {
              x,
              y: y - gridSize * 0.85
            }, {
              duration: 45
            });
            anim5.once('complete', () => {
              const anim6 = this.ease.add(child, {
                alpha: 0
              }, {
                duration: 2500
              });
              anim6.once('complete', () => {
                this.layer.removeChild(child);
              });
            });
          });
        });
      });
    });
  }
  /**
   * Get the Pixi Sprite to be rendered.
   *
   * @param {Animator.animationTypes} type
   *   The type of animation we should be creating.
   * @param {number} gridSize
   *   The size of the Canvas grid.
   *
   * @return {PIXI.Text}
   *   The sprite.
   *
   * @private
   */


  _getSprite(type, gridSize) {
    const fontSize = Math.round(gridSize * 0.6);
    return new PIXI.Text(this._getTextFromType(type), new PIXI.TextStyle({
      fontSize,
      dropShadow: true,
      dropShadowDistance: 4,
      fill: '#feffff',
      fontFamily: 'Signika',
      fontWeight: 'bolder',
      strokeThickness: 4
    }));
  }
  /**
   * Get the text to render from the provided Animator type.
   *
   * @param {Animator.T}type
   * @return {string}
   * @private
   */


  _getTextFromType(type) {
    switch (type) {
      case Animator.animationTypes.TYPE_QUESTION:
        return '?';

      case Animator.animationTypes.TYPE_EXCLAMATION:
        return '!';

      case Animator.animationTypes.TYPE_INFO:
        return 'ⓘ';

      default:
        throw new Error(`Cannot find text for Animator type ${type}`);
    }
  }

}

/***/ }),

/***/ "./src/module/Collision.js":
/*!*********************************!*\
  !*** ./src/module/Collision.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Collision)
/* harmony export */ });
/* global Ray */

/**
 * A class to determine collision between relevant Entitys.
 */
class Collision {
  /**
   * Collision constructor.
   *
   * @param {number} gridSize
   *   The grid size of the canvas for our calculations.
   */
  constructor(gridSize) {
    this.gridSize = gridSize;
  }
  /**
   * Check if a Tile and a Token collide.
   *
   * @param {Tile} tile
   *   The Tile to check.
   * @param {Token} token
   *   The Token to check.
   * @param {x,y} initTokenPos
   *   The initial position of the Token before it was updated. X and Y values.
   *
   * @return {boolean}
   *   If the Tile and Token collide.
   */


  checkTileTokenCollision(tile, token, initTokenPos) {
    // 1. Get all the tile's vertices. X and Y are position at top-left corner
    // of tile.
    const tileX1 = tile.data.x;
    const tileY1 = tile.data.y;
    const tileX2 = tile.data.x + tile.data.width;
    const tileY2 = tile.data.y + tile.data.height;
    const tokenCanvasWidth = token.data.width * this.gridSize;
    const tokenCanvasHeight = token.data.height * this.gridSize;
    const tokenX1 = initTokenPos.x + tokenCanvasWidth / 2;
    const tokenY1 = initTokenPos.y + tokenCanvasHeight / 2;
    const tokenX2 = token.data.x + tokenCanvasWidth / 2;
    const tokenY2 = token.data.y + tokenCanvasHeight / 2; // 2. Create a new Ray for the token, from its starting position to its
    // destination.

    const tokenRay = new Ray({
      x: tokenX1,
      y: tokenY1
    }, {
      x: tokenX2,
      y: tokenY2
    }); // 3. Create four intersection checks, one for each line making up the
    // tile rectangle. If any of these pass, that means it has intersected at
    // some point.

    return Boolean(tokenRay.intersectSegment([tileX1, tileY1, tileX2, tileY1])) || Boolean(tokenRay.intersectSegment([tileX2, tileY1, tileX2, tileY2])) || Boolean(tokenRay.intersectSegment([tileX2, tileY2, tileX1, tileY2])) || Boolean(tokenRay.intersectSegment([tileX1, tileY2, tileX1, tileY1]));
  }

}

/***/ }),

/***/ "./src/module/Constants.js":
/*!*********************************!*\
  !*** ./src/module/Constants.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Constants)
/* harmony export */ });
/* harmony import */ var _Animator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Animator */ "./src/module/Animator.js");

/**
 * A class storing our module's constants.
 */

class Constants {
  /**
   * The name and identifier of the module.
   *
   * @return {string}
   */
  static get MODULE_NAME() {
    return 'hey-wait';
  }
  /**
   * The identifier of the tool in the controls toolbar.
   *
   * @return {string}
   */


  static get TOOLNAME() {
    return 'heyWaitTile';
  }
  /**
   * The possible token disposition choices for triggering Hey, Wait! tiles.
   *
   * @return {object}
   */


  static get DISPOSITION_CHOICES() {
    return {
      FRIENDLY: 1,
      FRIENDLY_NETURAL: 2,
      FRIENDLY_NEUTRAL_HOSTILE: 3
    };
  }
  /**
   * The default animation type when no other is available.
   *
   * @return {number}
   */


  static get DEFAULT_ANIM_TYPE() {
    return _Animator__WEBPACK_IMPORTED_MODULE_0__["default"].animationTypes.TYPE_NONE;
  }
  /**
   * The filepath to the HUD template.
   *
   * @return {string}
   */


  static get TEMPLATE_HUD_PATH() {
    return '/modules/hey-wait/src/templates/hud.hbs';
  }
  /**
   * The filepath for the "Hey, Wait! Stop" tile image.
   *
   * @return {string}
   */


  static get TILE_STOP_PATH() {
    return 'modules/hey-wait/src/img/hey_wait_stop.jpg';
  }
  /**
   * The width of the "Hey, Wait! Stop" tile.
   *
   * @return {number}
   */


  static get TILE_STOP_WIDTH() {
    return 200;
  }
  /**
   * The height of the "Hey, Wait! Stop" tile.
   *
   * @return {number}
   */


  static get TILE_STOP_HEIGHT() {
    return 167;
  }
  /**
   * The filepath for the "Hey, Wait! Go" tile image.
   *
   * @return {string}
   */


  static get TILE_GO_PATH() {
    return 'modules/hey-wait/src/img/hey_wait_go.jpg';
  }
  /**
   * The width of the "Hey, Wait! Go" tile.
   *
   * @return {number}
   */


  static get TILE_GO_WIDTH() {
    return 222;
  }
  /**
   * The height of the "Hey, Wait! Go" tile.
   *
   * @return {number}
   */


  static get TILE_GO_HEIGHT() {
    return 160;
  }
  /**
   * The filepath for the fallback tile image.
   *
   * @return {string}
   */


  static get TILE_FALLBACK_PATH() {
    return 'icons/svg/hazard.svg';
  }
  /**
   * How long our Canvas panning should last.
   *
   * @return {number}
   */


  static get CANVAS_PAN_DURATION() {
    return 1000;
  }

}

/***/ }),

/***/ "./src/module/ControlsGenerator.js":
/*!*****************************************!*\
  !*** ./src/module/ControlsGenerator.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ ControlsGenerator)
/* harmony export */ });
/* harmony import */ var _Constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Constants */ "./src/module/Constants.js");
/**
 * Facilitate the generation of the Controls for the toolbar.
 */

/**
 * Generate the control buttons / icons in the toolbar.
 */

class ControlsGenerator {
  /**
   * Generate the toolbar controls.
   *
   * @param {Object} controls
   *   The game's controls object.
   * @param {Boolean} isGm
   *   If the current user is a GM.
   */
  generate(controls, isGm) {
    if (!isGm) {
      return;
    }

    const tileControl = controls.find(control => (control === null || control === void 0 ? void 0 : control.name) === 'tiles');

    if (!tileControl) {
      return;
    } // Insert the Hey, Wait! tile after the browse control button.


    let browseControlIndex;
    tileControl.tools.forEach((tool, index) => {
      if (tool.name === 'browse') {
        browseControlIndex = index + 1;
      }
    });

    if (!browseControlIndex) {
      // eslint-disable-next-line no-console
      console.error('Could not find the "Browse Tile" control. Not adding Hey, Wait! control');
      return;
    }

    tileControl.tools.splice(browseControlIndex, 0, {
      name: _Constants__WEBPACK_IMPORTED_MODULE_0__["default"].TOOLNAME,
      title: 'HEYWAIT.CONTROLS.TOOLS.heyWaitTile',
      icon: 'fas fa-hand-paper'
    });
  }

}

/***/ }),

/***/ "./src/module/EntityFinder.js":
/*!************************************!*\
  !*** ./src/module/EntityFinder.js ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ EntityFinder)
/* harmony export */ });
/**
 * A class to find entities and their data in the Game based on sparse
 * information.
 */
class EntityFinder {
  /**
   * EntityFinder constructor.
   *
   * @param {Game} game
   *   The injected Game dependency.
   * @param {Canvas} canvas
   *   The injected Canvas dependency.
   */
  constructor(game, canvas) {
    this.game = game;
    this.canvas = canvas;
  }
  /**
   * Find the Scene by Scene ID.
   *
   * @param {string} sceneId
   *   The ID of the Scene to find.
   *
   * @return {Scene}
   */


  findScene(sceneId) {
    const scene = this.game.scenes.get(sceneId);

    if (!scene) {
      throw new Error(`Could not find a scene with ID ${sceneId}`);
    }

    return scene;
  }
  /**
   * Find the TokenDocument by Token ID.
   *
   * @param {string} tokenId
   *   The ID of the Token.
   * @param {string} sceneId
   *   The ID of the Scene.
   *
   * @return {TokenDocument}
   */


  findTokenDocument(tokenId, sceneId) {
    const scene = this.findScene(sceneId);
    const {
      tokens
    } = scene.data;
    const tokenDocument = tokens.find(token => token.id === tokenId);

    if (!tokenDocument) {
      throw new Error(`Could not find Token document with ID ${tokenId} in Scene ${scene.data._id}`);
    }

    return tokenDocument;
  }
  /**
   * Find the Tile by Tile ID.
   *
   * @param {string} tileId
   *   The ID of the tile.
   *
   * @return {Tile}
   */


  findTile(tileId) {
    const filtered = this.canvas.background.tiles.filter(tile => tile.id === tileId);

    if (!filtered.length) {
      return false;
    }

    return filtered[0];
  }

}

/***/ }),

/***/ "./src/module/GameChanger.js":
/*!***********************************!*\
  !*** ./src/module/GameChanger.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ GameChanger)
/* harmony export */ });
/* harmony import */ var _Constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Constants */ "./src/module/Constants.js");

/**
 * A class to "change" the game when a Hey, Wait! event has been triggered.
 */

class GameChanger {
  constructor(game, canvas) {
    this.game = game;
    this.canvas = canvas;
  }
  /**
   * Execute any changes to the game after a Hey, Wait! event has been triggered.
   *
   * @param {string} tileId
   *   The relevant Tile ID that has been triggered.
   * @param {x,y} location
   *   The location where the triggering occurred.
   *
   * @param {string} sceneId
   *   The scene ID where the triggering occurred.
   *
   * @return {Promise<void>}
   */


  async execute(tileId, location, sceneId) {
    await this._changeScene(sceneId);

    if (this.game.user.isGM) {
      this._pause();

      this._handleTileChange(tileId);
    }
  }
  /**
     * Animate the canvas moving over to the desired location.
     *
     * @param {x,y} location
     *   A location designated by X and Y coords.
     *
     * @return {Promise}
     */


  async pan(location) {
    const {
      x,
      y
    } = location;
    return this.canvas.animatePan({
      x,
      y,
      scale: Math.max(1, this.canvas.stage.scale.x),
      duration: _Constants__WEBPACK_IMPORTED_MODULE_0__["default"].CANVAS_PAN_DURATION
    });
  }
  /**
   * Handle the tile triggering adjustments such as updating flags and image.
   *
   * Can only be executed as the GM.
   *
   * @param {string} tileId
   *   The relevant tile ID.
   */


  _handleTileChange(tileId) {
    const tile = this.canvas.background.get(tileId);

    if (!tile) {
      throw new Error(`Could not find a tile with ID ${tileId}`);
    }

    const {
      document
    } = tile;
    const update = {
      flags: {
        'hey-wait': {
          triggered: true
        }
      },
      img: _Constants__WEBPACK_IMPORTED_MODULE_0__["default"].TILE_GO_PATH
    };
    document.update(update);
  }
  /**
   * Change the current scene for the user.
   *
   * @param {string} sceneId
   *   The scene ID to change to.
   *
   * @return {Promise<void>}
   *
   * @private
   */


  async _changeScene(sceneId) {
    const scene = this.game.scenes.get(sceneId);

    if (!scene) {
      throw new Error(`Could not find a scene with ID ${sceneId}`);
    }

    await scene.view();
  }
  /**
   * Pause the game.
   *
   * @private
   */


  _pause() {
    this.game.togglePause(true, true);
  }

}

/***/ }),

/***/ "./src/module/MacroOperations.js":
/*!***************************************!*\
  !*** ./src/module/MacroOperations.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ MacroOperations)
/* harmony export */ });
class MacroOperations {
  /**
   * MacroOperations constructor.
   *
   * @param {User} user
   *   The injected User dependency. The current user.
   * @param {BackgroundLayer} backgroundLayer
   *   The injected BackgroundLayer dependency.
   * @param {Map} macros
   *   The injected game macros map dependency.
   * @param {Notifications} notifications
   *   The injected Notifications dependency.
   */
  constructor(user, backgroundLayer, macros, notifications) {
    this.user = user;
    this.backgroundLayer = backgroundLayer;
    this.macros = macros;
    this.notifications = notifications;
  }
  /**
   * Handle the tile triggering macro execution, if one is set.
   *
   * Can only be executed as the GM.
   *
   * @param {string} tileId
   *   The relevant tile ID.
   * @param {TokenDocument} tokenDoc
   *   The relevant TokenDocument that is the protagonist.
   */


  handleTileMacroFiring(tileId, tokenDoc) {
    var _tile$data, _tile$data$flags, _tile$data$flags$hey;

    if (!this.user.isGM) {
      return;
    }

    let tile;

    for (const bgTile of this.backgroundLayer.tiles) {
      if (bgTile.id === tileId) {
        tile = bgTile;
        break;
      }
    }

    if (!tile) {
      return;
    }

    const macroId = (_tile$data = tile.data) === null || _tile$data === void 0 ? void 0 : (_tile$data$flags = _tile$data.flags) === null || _tile$data$flags === void 0 ? void 0 : (_tile$data$flags$hey = _tile$data$flags['hey-wait']) === null || _tile$data$flags$hey === void 0 ? void 0 : _tile$data$flags$hey.macro;

    if (!macroId || macroId === '0') {
      return;
    }

    const macro = this.macros.get(macroId);

    if (!macro) {
      this.notifications.error('The macro triggered by the Hey, Wait! tile no longer exists.');
      return;
    }

    macro.execute({
      actor: tokenDoc.getActor(),
      token: tokenDoc.object
    });
  }

}

/***/ }),

/***/ "./src/module/ReactionCoordinator.js":
/*!*******************************************!*\
  !*** ./src/module/ReactionCoordinator.js ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ ReactionCoordinator)
/* harmony export */ });
/* harmony import */ var _Animator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Animator */ "./src/module/Animator.js");
/* harmony import */ var _Constants__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Constants */ "./src/module/Constants.js");
/* eslint-disable no-loop-func */

/* eslint-disable no-await-in-loop */

/* global AudioHelper */


/**
 * Coordinate processing and running any reactions within the module.
 */

class ReactionCoordinator {
  /**
   * ReactionCoordinator constructor.
   *
   * @param {TokenCalculator} tokenCalculator
   *   The injected TokenCalculator dependency.
   * @param {Animator} animator
   *   The injected Animator dependency.
   * @param {ClientSettings} settings
   *   The injected ClientSettings dependency. Contains all current game
   *   settings.
   */
  constructor(tokenCalculator, animator, settings) {
    this.tokenCalculator = tokenCalculator;
    this.animator = animator;
    this.settings = settings;
  }
  /**
   * Handle the reaction (animation and SFX) on the specified Token.
   *
   * @param {Scene} scene
   *   The current Scene.
   * @param {Token} token
   *   The associated Token to animate the reaction on.
   * @param {Animator.animationTypes} animType
   *   The associated Token to animate the reaction on.
   *
   * @return {Promise}
   */


  handleTokenReaction(scene, token, animType) {
    const coords = this.tokenCalculator.calculateCoordinates(scene, token.data);
    this.animator.animate(animType, coords.x, coords.y, scene.data.grid);

    this._handleSfx(animType);
  }
  /**
   * Handle the playing of any sound effects, if applicable to the animation.
   *
   * @param {Animator.animationTypes} animType
   *   One of the animation types, which corresponds to the SFX ID number.
   *
   * @private
   */


  _handleSfx(animType) {
    if (animType === _Animator__WEBPACK_IMPORTED_MODULE_0__["default"].animationTypes.TYPE_NONE || this._sfxDisabled()) {
      return;
    }

    const path = `modules/hey-wait/sounds/reaction${animType}.mp3`;
    AudioHelper.play({
      src: path,
      autoplay: true,
      volume: 0.5
    }, false);
  }
  /**
   * Get if the sound effects for animations are disabled.
   *
   * @return {boolean}
   *   If the sound effects for animations are disabled.
   *
   * @private
   */


  _sfxDisabled() {
    return Boolean(this.settings.get(_Constants__WEBPACK_IMPORTED_MODULE_1__["default"].MODULE_NAME, 'disable-sfx'));
  }

}

/***/ }),

/***/ "./src/module/SocketController.js":
/*!****************************************!*\
  !*** ./src/module/SocketController.js ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ SocketController)
/* harmony export */ });
/* eslint-disable no-console */

/**
 * A controller for handling socket related operations for our module.
 */
class SocketController {
  /**
   * SocketController constructor.
   *
   * @param {Socket} socket
   *   The current Socket instance.
   * @param {User} user
   *   The current User instance.
   * @param {GameChanger} gameChanger
   *   The current GameChanger instance.
   * @param {EntityFinder} entityFinder
   *   The current EntityFinder instance.
   * @param {UserOperations} userOperations
   *   The current UserOperations instance.
   * @param {TriggerActions} triggerActions
   *   The current TriggerActions instance.
   * @param {PostTriggerActions} postTriggerActions
   *   The current PostTriggerActions instance.
   */
  constructor(socket, user, gameChanger, entityFinder, userOperations, postTriggerActions) {
    this.socket = socket;
    this.user = user;
    this.gameChanger = gameChanger;
    this.entityFinder = entityFinder;
    this.userOperations = userOperations;
    this.postTriggerActions = postTriggerActions;
    this.socketName = 'module.hey-wait';
  }
  /**
   * Initialize any socket controller behaviour.
   *
   * @return {Promise<void>}
   */


  async init() {
    await this._listen();
  }
  /**
   * Deactivate the currently open socket.
   *
   * @return {Promise<void>}
   */


  async deactivate() {
    await this._removeListener();
  }
  /**
   * Emit any Hey, Wait! events that occurred.
   *
   * @param {string} tokenId
   *   The ID of the Token that has collided with the Tile.
   * @param {string} tileId
   *   The ID of the Tile that the Token has collided with.
   * @param {string} sceneId
   *   The scene ID where this is taking place.
   * @param {x,y} pos
   *   The X and Y position where the event takes place.
   *
   * @return {Promise<void>}
   *   The promise for what's taking place.
   */


  async emit(tokenId, tileId, sceneId, pos) {
    __webpack_require__.g.console.debug(`hey-wait | Emitting to ${this.socketName}`);
    this.socket.emit(this.socketName, {
      tokenId,
      tileId,
      sceneId,
      pos
    });
  }
  /**
   * Listen for events on our module's socket.
   *
   * Any event received will subsequently call the GameChanger to ensure the
   * event takes place in the current user's game.
   *
   * @return {Promise<void>}
   *
   * @private
   */


  async _listen() {
    this.socket.on(this.socketName, async data => {
      __webpack_require__.g.console.debug(`hey-wait | Emission received on ${this.socketName}`);

      try {
        if (!this.userOperations.canChangeGameForUser(data.sceneId)) {
          return;
        } // Change the game by potentially modifying the tile and pausing the
        // game.


        await this.gameChanger.execute(data.tileId, {
          x: data.pos.x,
          y: data.pos.y
        }, data.sceneId);
        const tokenDoc = this.entityFinder.findTokenDocument(data.tokenId, data.sceneId);

        if (!tokenDoc) {
          __webpack_require__.g.console.error(`Could not find token document with ID ${data.tokenId}`);
        }

        const tile = this.entityFinder.findTile(data.tileId);

        if (!tile) {
          __webpack_require__.g.console.error(`Could not find Hey, Wait! tile with ID ${data.tileId}`);
        }

        await this.postTriggerActions.execute(tokenDoc, tile);
      } catch (e) {
        console.error(`hey-wait | ${e.name}: ${e.message}`);
      }
    });
  }
  /**
   * Remove the associated socket listener.
   *
   * @return {Promise<void>}
   *
   * @private
   */


  async _removeListener() {
    this.socket.off(this.socketName);
  }

}

/***/ }),

/***/ "./src/module/TileAuditor.js":
/*!***********************************!*\
  !*** ./src/module/TileAuditor.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ TileAuditor)
/* harmony export */ });
/**
 * A class for auditing Tile entities pertaining to Hey, Wait!
 */
class TileAuditor {
  /**
   * Determine if the provided Tile is a Hey, Wait! tile.
   *
   * Includes checks if the tile has not yet been initialized but is destined
   * to be a Hey, Wait! tile.
   *
   * @param {Tile} tile
   *   The relevant Tile to check.
   * @param {string} activeTool
   *   The game's active tool being used.
   *
   * @return {boolean}
   *   If this is a Hey, Wait! tile or not.
   */
  isHeyWaitTile(tile, activeTool) {
    var _tile$data;

    if ((_tile$data = tile.data) !== null && _tile$data !== void 0 && _tile$data._id) {
      var _tile$data2, _tile$data2$flags, _tile$data2$flags$hey;

      // Existing tile.
      if (!((_tile$data2 = tile.data) !== null && _tile$data2 !== void 0 && (_tile$data2$flags = _tile$data2.flags) !== null && _tile$data2$flags !== void 0 && (_tile$data2$flags$hey = _tile$data2$flags['hey-wait']) !== null && _tile$data2$flags$hey !== void 0 && _tile$data2$flags$hey.enabled)) {
        return false;
      }
    } else if (activeTool && activeTool !== 'heyWaitTile') {
      // This is in a situation where we're placing a new tile and it's a
      // Hey, Wait! tile, but we don't have flags or an ID setup yet.
      return false;
    }

    return true;
  }

}

/***/ }),

/***/ "./src/module/TokenAnimationWatcher.js":
/*!*********************************************!*\
  !*** ./src/module/TokenAnimationWatcher.js ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ TokenAnimationWatcher)
/* harmony export */ });
/* eslint-disable no-loop-func */

/* eslint-disable no-await-in-loop */

/* global CanvasAnimation */

/**
 * A class to watch the animation cycles of a Token in Foundry.
 *
 * An "animation" is when a Token is being dragged across the Canvas.
 */
class TokenAnimationWatcher {
  /**
   * Watch the specific Token for its animation to be complete.
   *
   * @param {string} tokenId
   *   The Token ID to watch for.
   *
   * @return {Promise}
   */
  async watchForCompletion(tokenId) {
    // Create a "timeout" function which allows us to sleep for specific
    // amounts of time.
    // See https://stackoverflow.com/a/33292942/823549.
    const timeout = ms => new Promise(resolve => setTimeout(resolve, ms)); // Check for the deletion of the animation key in the current animations
    // to be sure that the animation has been successfully completed.
    // This is hacky but unfortunately I'm unsure of another way to listen
    // for animations being completed.
    // This should allow for a buffer of 20 seconds to allow the animation to
    // finish which theoretically should be more than enough time.


    for (let i = 1; i <= 200; i += 1) {
      var _CanvasAnimation$anim;

      await timeout(100);

      if (!((_CanvasAnimation$anim = CanvasAnimation.animations) !== null && _CanvasAnimation$anim !== void 0 && _CanvasAnimation$anim[this._getAnimationKeyFromTokenId(tokenId)])) {
        return Promise.resolve();
      }
    }

    return Promise.resolve();
  }
  /**
   * Get the expected animation array key from the Token object.
   *
   * This is used to find the animation pertaining to the Token.
   *
   * @param {string} tokenId
   *   The specified Token ID to find the animation for.
   *
   * @return {string}
   *
   * @private
   */


  _getAnimationKeyFromTokenId(tokenId) {
    return `Token.${tokenId}.animateMovement`;
  }

}

/***/ }),

/***/ "./src/module/TokenCalculator.js":
/*!***************************************!*\
  !*** ./src/module/TokenCalculator.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ TokenCalculator)
/* harmony export */ });
/**
 * A class for calculations relating to Tokens.
 */
class TokenCalculator {
  /**
   * Calculate the center coordinates of the Token in the Scene.
   * @param {Scene} scene
   *   The relevant Scene.
   * @param {Token} token
   *   The relevant Token.
   *
   * @return {x,y}
   *   The final X and Y coordinates.
   */
  calculateCoordinates(scene, token) {
    const coords = {}; // In order to "center" our numbers, we'll need to get the in-between
    // based on the grid size.

    const gridSize = Number(scene.data.grid);
    const width = Number(token.width) * gridSize;
    const height = Number(token.height) * gridSize; // Take into account the width of the token - some may be larger than 1.

    coords.x = Math.round(token.x + width / 2);
    coords.y = Math.round(token.y + height / 2);
    return coords;
  }

}

/***/ }),

/***/ "./src/module/TokenUpdateCoordinator.js":
/*!**********************************************!*\
  !*** ./src/module/TokenUpdateCoordinator.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ TokenUpdateCoordinator)
/* harmony export */ });
/* eslint-disable no-console */

/**
 * Coordinate any Token updates from the Foundry Hook system.
 */
class TokenUpdateCoordinator {
  /**
   * TokenUpdateCoordinator constructor.
   *
   * @param {TriggeringHandler} triggeringHandler
   *   The injected TriggeringHandler dependency.
   * @param {PostTriggerActions} postTriggerActions
   *   The injected PostTriggerActions dependency.
   * @param {SocketController} socketController
   *   The injected SocketController dependency.
   */
  constructor(triggeringHandler, postTriggerActions, socketController) {
    this.triggeringHandler = triggeringHandler;
    this.postTriggerActions = postTriggerActions;
    this.socketController = socketController;
    /**
     * Keep track of the Token's initial position between updates.
     *
     * @type {Map<any, any>}
     */

    this.tokenInitPos = new Map();
  }
  /**
   * Register the Token's initial position to be used later.
   *
   * We need to cache this in memory as the next update does not contain the
   * relevant starting info.
   *
   * @param {Token} token
   *   The Token to be registered.
   */


  registerTokenInitPos(token) {
    if (!token) {
      return;
    }

    this.tokenInitPos.set(token._id, {
      x: token.x,
      y: token.y
    });
  }
  /**
   * Coordinate a Token update.
   *
   * Checks all applicable tiles for if they have been triggered or not. If
   * they have, execute the functionality for triggering a tile.
   *
   * @param {TokenDocument} tokenDoc
   *   The Token document getting updated.
   * @param {Array} tiles
   *   All of the potential tiles to check for triggers.
   */


  async coordinateUpdate(tokenDoc, tiles) {
    const t0 = __webpack_require__.g.performance.now(); // Let's find the previously stored Token initial position.

    const initPos = this.tokenInitPos.get(tokenDoc.id);

    if (!initPos) {
      // We may not have created an update queued previously, due to a
      // lightweight update or something else. Just cleanup and exit.
      this._cleanQueuedTokenInitPos(tokenDoc.id);

      return;
    }

    const triggeredTile = await this.triggeringHandler.handleTileTriggering(tiles, tokenDoc, initPos, tokenDoc.parent.id);

    if (triggeredTile) {
      const token = tokenDoc.object;
      this.socketController.emit(tokenDoc.id, triggeredTile.id, tokenDoc.parent.id, {
        x: token.x,
        y: token.y
      });
      await this.postTriggerActions.execute(tokenDoc, triggeredTile);
    }

    const t1 = __webpack_require__.g.performance.now();
    console.debug(`hey-wait | \`coordinateUpdate\` took ${t1 - t0}ms.`);

    this._cleanQueuedTokenInitPos(tokenDoc.id);
  }
  /**
   * Clean up any queued Tokens initial positions pertaining to the provided
   * Token ID.
   *
   * @param {string} tokenId
   *   The associated Token ID with the queued initial position.
   *
   * @private
   */


  _cleanQueuedTokenInitPos(tokenId) {
    this.tokenInitPos.delete(tokenId);
  }

}

/***/ }),

/***/ "./src/module/UserOperations.js":
/*!**************************************!*\
  !*** ./src/module/UserOperations.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ UserOperations)
/* harmony export */ });
/* harmony import */ var _Constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Constants */ "./src/module/Constants.js");

/**
 * A class for determining if specific user operations are allowed.
 */

class UserOperations {
  constructor(user, settings) {
    this.user = user;
    this.settings = settings;
  }
  /**
   * Determine if we can change the scene and warp, pan, etc. for the current
   * user.
   *
   * @param {string} sceneId
   *   The target scene ID.
   *
   * @return {boolean}
   *   If we should change the scene or not.
   */


  canChangeGameForUser(sceneId) {
    if (this.user.isGM || this.user.viewedScene === sceneId) {
      return true;
    }

    const warpPlayers = this.settings.get(_Constants__WEBPACK_IMPORTED_MODULE_0__["default"].MODULE_NAME, 'warp-players');
    return !!warpPlayers;
  }

}

/***/ }),

/***/ "./src/module/hooks/TokenHooks.js":
/*!****************************************!*\
  !*** ./src/module/hooks/TokenHooks.js ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ TokenHooks)
/* harmony export */ });
/* harmony import */ var _Constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Constants */ "./src/module/Constants.js");

/**
 * A class for dealing with logic relating to Token hooks called by Foundry.
 */

class TokenHooks {
  constructor(user, settings) {
    this.user = user;
    this.settings = settings;
  }
  /**
   * Determine of we can run logic for the "update Token" hook.
   *
   * @param {object} change
   *   The `change` object provided by the hook.
   * @param {number} disposition
   *   The disposition of the token. See `CONST.TOKEN_DISPOSITION`.
   * @param {boolean} isPaused
   *   If the game is current pause or not.
   *
   * @returns {boolean}
   */


  canRunTokenUpdate(change, disposition, isPaused) {
    if (isPaused) {
      return false;
    } // Exit early if there's no relevant updates. Specifically, if the token
    // has not moved.


    if (!this._hasDataChanged(change)) {
      return false;
    }

    if (!this._isUserAllowed()) {
      return false;
    }

    if (!this._isDispositionAllowed(disposition)) {
      return false;
    }

    return true;
  }
  /**
   * Determine if the token data has changed.
   *
   * @param {object} change
   *   The `change` object supplied by the hook.
   * @returns {boolean}
   *   If the data has changed.
   *
   * @private
   */


  _hasDataChanged(change) {
    return Boolean((change === null || change === void 0 ? void 0 : change.x) !== undefined || (change === null || change === void 0 ? void 0 : change.y) !== undefined);
  }
  /**
   * Determine if the current user is allowed to perform the token update.
   *
   * @returns {boolean}
   *   If the user is allowed to trigger the update.
   *
   * @private
   */


  _isUserAllowed() {
    if (!this.user.isGM) {
      return true;
    }

    const restrictGm = this.settings.get(_Constants__WEBPACK_IMPORTED_MODULE_0__["default"].MODULE_NAME, 'restrict-gm'); // If we are restricting a GM from triggering Hey, Wait! tiles, let's exit
    // early so they don't move through the triggering flow.

    if (restrictGm) {
      return false;
    }

    return true;
  }
  /**
   * Determine if the token's disposition allows it for Hey, Wait! updates.
   *
   * @param {number} disposition
   *   The token's disposition. See `CONST.TOKEN_DISPOSITIONS`.
   * @returns {boolean}
   *   If the token's disposition is allowed.
   *
   * @private
   */


  _isDispositionAllowed(disposition) {
    // If we have a friendly disposition, it will always be allowed.
    if (disposition === __webpack_require__.g.CONST.TOKEN_DISPOSITIONS.FRIENDLY) {
      return true;
    }

    const choices = _Constants__WEBPACK_IMPORTED_MODULE_0__["default"].DISPOSITION_CHOICES;
    const dispositionsAllowed = this.settings.get(_Constants__WEBPACK_IMPORTED_MODULE_0__["default"].MODULE_NAME, 'disposition'); // If we have a neutral disposition, it's only allowed if we're allowing
    // neutral and hostile.

    if (disposition === __webpack_require__.g.CONST.TOKEN_DISPOSITIONS.NEUTRAL && [choices.FRIENDLY_NETURAL, choices.FRIENDLY_NEUTRAL_HOSTILE].includes(dispositionsAllowed)) {
      return true;
    } // If we have a hostile disposition, it's only allowed if we allow all
    // dispositions.


    if (disposition === __webpack_require__.g.CONST.TOKEN_DISPOSITIONS.HOSTILE && dispositionsAllowed === choices.FRIENDLY_NEUTRAL_HOSTILE) {
      return true;
    }

    return false;
  }

}

/***/ }),

/***/ "./src/module/settings.js":
/*!********************************!*\
  !*** ./src/module/settings.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _Constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Constants */ "./src/module/Constants.js");
/* global game */

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (() => {
  const dispositionChoices = {};
  dispositionChoices[_Constants__WEBPACK_IMPORTED_MODULE_0__["default"].DISPOSITION_CHOICES.FRIENDLY] = game.i18n.localize('HEYWAIT.SETTINGS.dispositionChoiceFriendly');
  dispositionChoices[_Constants__WEBPACK_IMPORTED_MODULE_0__["default"].DISPOSITION_CHOICES.FRIENDLY_NETURAL] = game.i18n.localize('HEYWAIT.SETTINGS.dispositionChoiceFriendlyNeutral');
  dispositionChoices[_Constants__WEBPACK_IMPORTED_MODULE_0__["default"].DISPOSITION_CHOICES.FRIENDLY_NEUTRAL_HOSTILE] = game.i18n.localize('HEYWAIT.SETTINGS.dispositionChoiceFriendlyNeutralHostile');
  game.settings.register(_Constants__WEBPACK_IMPORTED_MODULE_0__["default"].MODULE_NAME, 'disposition', {
    name: game.i18n.localize('HEYWAIT.SETTINGS.dispositionName'),
    hint: game.i18n.localize('HEYWAIT.SETTINGS.dispositionHint'),
    scope: 'world',
    config: true,
    default: _Constants__WEBPACK_IMPORTED_MODULE_0__["default"].DISPOSITION_CHOICES.FRIENDLY,
    type: Number,
    choices: dispositionChoices
  });
  game.settings.register(_Constants__WEBPACK_IMPORTED_MODULE_0__["default"].MODULE_NAME, 'restrict-gm', {
    name: game.i18n.localize('HEYWAIT.SETTINGS.restrictGmName'),
    hint: game.i18n.localize('HEYWAIT.SETTINGS.restrictGmHint'),
    scope: 'world',
    config: true,
    default: false,
    type: Boolean
  });
  game.settings.register(_Constants__WEBPACK_IMPORTED_MODULE_0__["default"].MODULE_NAME, 'warp-players', {
    name: game.i18n.localize('HEYWAIT.SETTINGS.warpPlayersName'),
    hint: game.i18n.localize('HEYWAIT.SETTINGS.warpPlayersHint'),
    scope: 'world',
    config: true,
    default: false,
    type: Boolean
  });
  game.settings.register(_Constants__WEBPACK_IMPORTED_MODULE_0__["default"].MODULE_NAME, 'disable-sfx', {
    name: game.i18n.localize('HEYWAIT.SETTINGS.disableSfxName'),
    hint: game.i18n.localize('HEYWAIT.SETTINGS.disableSfxHint'),
    scope: 'world',
    config: true,
    default: false,
    type: Boolean
  });
});

/***/ }),

/***/ "./src/module/triggering/PostTriggerActions.js":
/*!*****************************************************!*\
  !*** ./src/module/triggering/PostTriggerActions.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ PostTriggerActions)
/* harmony export */ });
/* harmony import */ var _Constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Constants */ "./src/module/Constants.js");

/**
 * A class to handle execution of any post-trigger actions needed.
 */

class PostTriggerActions {
  /**
   * PostTriggerActions constructor.
   *
   * @param {GameChanger} gameChanger
   * @param {MacroOperations} macroOperations
   * @param {ReactionCoordinator} reactionCoordinator
   */
  constructor(gameChanger, macroOperations, reactionCoordinator) {
    this.gameChanger = gameChanger;
    this.macroOperations = macroOperations;
    this.reactionCoordinator = reactionCoordinator;
  }
  /**
   * Run any post-triggering functionality for Hey, Wait! tiles.
   *
   * @param {TokenDocument} tokenDoc
   *   The TokenDocument which triggered the Hey, Wait! tile.
   * @param {Tile} tile
   *   The Tile which was triggered.
   */


  async execute(tokenDoc, tile) {
    var _tile$data, _tile$data$flags, _tile$data$flags$hey;

    // 1. Fire the associated macro with the Hey, Wait! tile if one's defined.
    this.macroOperations.handleTileMacroFiring(tile.id, tokenDoc);
    const token = tokenDoc.object; // 2. Pan to the trigger location.

    const coords = {
      x: token.x,
      y: token.y
    };
    await this.gameChanger.pan(coords); // 3. Handle the relevant reaction if one's defined.

    const animType = ((_tile$data = tile.data) === null || _tile$data === void 0 ? void 0 : (_tile$data$flags = _tile$data.flags) === null || _tile$data$flags === void 0 ? void 0 : (_tile$data$flags$hey = _tile$data$flags['hey-wait']) === null || _tile$data$flags$hey === void 0 ? void 0 : _tile$data$flags$hey.animType) ?? _Constants__WEBPACK_IMPORTED_MODULE_0__["default"].DEFAULT_ANIM_TYPE;
    this.reactionCoordinator.handleTokenReaction(tokenDoc.parent, token, animType);
  }

}

/***/ }),

/***/ "./src/module/triggering/TriggeringHandler.js":
/*!****************************************************!*\
  !*** ./src/module/triggering/TriggeringHandler.js ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ TriggeringHandler)
/* harmony export */ });
/* eslint-disable no-console */

/* global _levels */

/* global _levelsModuleName */

/**
 * A class to handle any triggering logic and tile modification operations.
 */
class TriggeringHandler {
  /**
   * TriggeringHandler constructor.
   *
   * @param {Collision} collision
   *   The injected Collision dependency.
   * @param {TriggerActions} triggerActions
   *   The injected TriggerActions dependency.
   */
  constructor(collision, gameChanger, tokenAnimationWatcher) {
    this.collision = collision;
    this.gameChanger = gameChanger;
    this.tokenAnimationWatcher = tokenAnimationWatcher;
  }
  /**
   * Handle the tile triggering, and take action if a tile is triggered.
   *
   * @param {Array} tiles
   *   The Tiles to check for triggering.
   * @param {TokenDocument} tokenDoc
   *   The TokenDocument to check the trigger from.
   * @param {x,y} initPos
   *   The initial position of the Token.
   * @param {string} viewedSceneId
   *   The ID of the currently viewed scene.
   *
   * @return {Promise<Tile|null>}
   */


  async handleTileTriggering(tiles, tokenDoc, initPos, viewedSceneId) {
    const token = tokenDoc.object;

    for (const tile of tiles) {
      if (!this._isTileTriggered(tile, tokenDoc, initPos)) {
        // eslint-disable-next-line no-continue
        continue;
      }

      try {
        // eslint-disable-next-line no-await-in-loop
        await this.gameChanger.execute(tile.id, {
          x: token.x,
          y: token.y
        }, viewedSceneId);
      } catch (e) {
        __webpack_require__.g.console.error(`hey-wait | ${e.name}: ${e.message}`);
      } // eslint-disable-next-line no-await-in-loop


      await this.tokenAnimationWatcher.watchForCompletion(tokenDoc.id);
      return Promise.resolve(tile);
    }

    return Promise.resolve(null);
  }
  /**
   * Determine if the tile has been triggered by the token's movement.
   *
   * @param {Tile} tile
   *   The Tile to check for.
   * @param {TokenDocument} tokenDoc
   *   The TokenDocument to check for.
   * @param {x,y} initTokenPos
   *   The initial position of the Token before it was updated. X and Y values.
   *
   * @return {boolean}
   *   If the tile has been triggered by the token's movement.
   */


  _isTileTriggered(tile, tokenDoc, initTokenPos) {
    if (!this._isHeyWaitTile(tile)) {
      return false;
    }

    if (!this._checkIsValidWithOtherModules(tile, tokenDoc.object)) {
      return false;
    }

    if (this._isPreviouslyTriggered(tile)) {
      return false;
    }

    if (!this.collision.checkTileTokenCollision(tile, tokenDoc.object, initTokenPos)) {
      return false;
    }

    return true;
  }
  /**
   * If the tile is a valid Hey, Wait! tile.
   *
   * @param {Tile} tile
   *   The relevant Tile for checking.
   *
   * @return {boolean}
   *
   * @private
   */


  _isHeyWaitTile(tile) {
    var _tile$data, _tile$data$flags, _tile$data$flags$hey;

    return Boolean((_tile$data = tile.data) === null || _tile$data === void 0 ? void 0 : (_tile$data$flags = _tile$data.flags) === null || _tile$data$flags === void 0 ? void 0 : (_tile$data$flags$hey = _tile$data$flags['hey-wait']) === null || _tile$data$flags$hey === void 0 ? void 0 : _tile$data$flags$hey.enabled);
  }

  _checkIsValidWithOtherModules(tile, token) {
    // If the Levels module is enabled, ensure we don't trigger on a wrong level.
    if (typeof _levels !== 'undefined' && typeof _levelsModuleName !== 'undefined' && !_levels.isTokenInRange(token, tile)) {
      return false;
    }

    return true;
  }
  /**
   * If the tile was previously triggered.
   *
   * @param {Tile} tile
   *   The relevant Tile for checking.
   *
   * @return {boolean}
   *
   * @private
   */


  _isPreviouslyTriggered(tile) {
    var _tile$data2, _tile$data2$flags, _tile$data2$flags$hey;

    return Boolean((_tile$data2 = tile.data) === null || _tile$data2 === void 0 ? void 0 : (_tile$data2$flags = _tile$data2.flags) === null || _tile$data2$flags === void 0 ? void 0 : (_tile$data2$flags$hey = _tile$data2$flags['hey-wait']) === null || _tile$data2$flags$hey === void 0 ? void 0 : _tile$data2$flags$hey.triggered);
  }

}

/***/ }),

/***/ "./node_modules/pixi-ease/dist/ease.es.js":
/*!************************************************!*\
  !*** ./node_modules/pixi-ease/dist/ease.es.js ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Ease": () => (/* binding */ Ease),
/* harmony export */   "List": () => (/* binding */ List),
/* harmony export */   "ease": () => (/* binding */ ease)
/* harmony export */ });
var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof __webpack_require__.g !== 'undefined' ? __webpack_require__.g : typeof self !== 'undefined' ? self : {};

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var penner = createCommonjsModule(function (module, exports) {
/*
	Copyright © 2001 Robert Penner
	All rights reserved.

	Redistribution and use in source and binary forms, with or without modification, 
	are permitted provided that the following conditions are met:

	Redistributions of source code must retain the above copyright notice, this list of 
	conditions and the following disclaimer.
	Redistributions in binary form must reproduce the above copyright notice, this list 
	of conditions and the following disclaimer in the documentation and/or other materials 
	provided with the distribution.

	Neither the name of the author nor the names of contributors may be used to endorse 
	or promote products derived from this software without specific prior written permission.

	THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY 
	EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
	MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
	COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
	EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE
	GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED 
	AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
	NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED 
	OF THE POSSIBILITY OF SUCH DAMAGE.
 */

(function() {
  var penner, umd;

  umd = function(factory) {
    {
      return module.exports = factory;
    }
  };

  penner = {
    linear: function(t, b, c, d) {
      return c * t / d + b;
    },
    easeInQuad: function(t, b, c, d) {
      return c * (t /= d) * t + b;
    },
    easeOutQuad: function(t, b, c, d) {
      return -c * (t /= d) * (t - 2) + b;
    },
    easeInOutQuad: function(t, b, c, d) {
      if ((t /= d / 2) < 1) {
        return c / 2 * t * t + b;
      } else {
        return -c / 2 * ((--t) * (t - 2) - 1) + b;
      }
    },
    easeInCubic: function(t, b, c, d) {
      return c * (t /= d) * t * t + b;
    },
    easeOutCubic: function(t, b, c, d) {
      return c * ((t = t / d - 1) * t * t + 1) + b;
    },
    easeInOutCubic: function(t, b, c, d) {
      if ((t /= d / 2) < 1) {
        return c / 2 * t * t * t + b;
      } else {
        return c / 2 * ((t -= 2) * t * t + 2) + b;
      }
    },
    easeInQuart: function(t, b, c, d) {
      return c * (t /= d) * t * t * t + b;
    },
    easeOutQuart: function(t, b, c, d) {
      return -c * ((t = t / d - 1) * t * t * t - 1) + b;
    },
    easeInOutQuart: function(t, b, c, d) {
      if ((t /= d / 2) < 1) {
        return c / 2 * t * t * t * t + b;
      } else {
        return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
      }
    },
    easeInQuint: function(t, b, c, d) {
      return c * (t /= d) * t * t * t * t + b;
    },
    easeOutQuint: function(t, b, c, d) {
      return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
    },
    easeInOutQuint: function(t, b, c, d) {
      if ((t /= d / 2) < 1) {
        return c / 2 * t * t * t * t * t + b;
      } else {
        return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
      }
    },
    easeInSine: function(t, b, c, d) {
      return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
    },
    easeOutSine: function(t, b, c, d) {
      return c * Math.sin(t / d * (Math.PI / 2)) + b;
    },
    easeInOutSine: function(t, b, c, d) {
      return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
    },
    easeInExpo: function(t, b, c, d) {
      if (t === 0) {
        return b;
      } else {
        return c * Math.pow(2, 10 * (t / d - 1)) + b;
      }
    },
    easeOutExpo: function(t, b, c, d) {
      if (t === d) {
        return b + c;
      } else {
        return c * (-Math.pow(2, -10 * t / d) + 1) + b;
      }
    },
    easeInOutExpo: function(t, b, c, d) {
      if ((t /= d / 2) < 1) {
        return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
      } else {
        return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b;
      }
    },
    easeInCirc: function(t, b, c, d) {
      return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b;
    },
    easeOutCirc: function(t, b, c, d) {
      return c * Math.sqrt(1 - (t = t / d - 1) * t) + b;
    },
    easeInOutCirc: function(t, b, c, d) {
      if ((t /= d / 2) < 1) {
        return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
      } else {
        return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
      }
    },
    easeInElastic: function(t, b, c, d) {
      var a, p, s;
      s = 1.70158;
      p = 0;
      a = c;
      if (t === 0) ; else if ((t /= d) === 1) ;
      if (!p) {
        p = d * .3;
      }
      if (a < Math.abs(c)) {
        a = c;
        s = p / 4;
      } else {
        s = p / (2 * Math.PI) * Math.asin(c / a);
      }
      return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
    },
    easeOutElastic: function(t, b, c, d) {
      var a, p, s;
      s = 1.70158;
      p = 0;
      a = c;
      if (t === 0) ; else if ((t /= d) === 1) ;
      if (!p) {
        p = d * .3;
      }
      if (a < Math.abs(c)) {
        a = c;
        s = p / 4;
      } else {
        s = p / (2 * Math.PI) * Math.asin(c / a);
      }
      return a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b;
    },
    easeInOutElastic: function(t, b, c, d) {
      var a, p, s;
      s = 1.70158;
      p = 0;
      a = c;
      if (t === 0) ; else if ((t /= d / 2) === 2) ;
      if (!p) {
        p = d * (.3 * 1.5);
      }
      if (a < Math.abs(c)) {
        a = c;
        s = p / 4;
      } else {
        s = p / (2 * Math.PI) * Math.asin(c / a);
      }
      if (t < 1) {
        return -.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
      } else {
        return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) * .5 + c + b;
      }
    },
    easeInBack: function(t, b, c, d, s) {
      if (s === void 0) {
        s = 1.70158;
      }
      return c * (t /= d) * t * ((s + 1) * t - s) + b;
    },
    easeOutBack: function(t, b, c, d, s) {
      if (s === void 0) {
        s = 1.70158;
      }
      return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
    },
    easeInOutBack: function(t, b, c, d, s) {
      if (s === void 0) {
        s = 1.70158;
      }
      if ((t /= d / 2) < 1) {
        return c / 2 * (t * t * (((s *= 1.525) + 1) * t - s)) + b;
      } else {
        return c / 2 * ((t -= 2) * t * (((s *= 1.525) + 1) * t + s) + 2) + b;
      }
    },
    easeInBounce: function(t, b, c, d) {
      var v;
      v = penner.easeOutBounce(d - t, 0, c, d);
      return c - v + b;
    },
    easeOutBounce: function(t, b, c, d) {
      if ((t /= d) < 1 / 2.75) {
        return c * (7.5625 * t * t) + b;
      } else if (t < 2 / 2.75) {
        return c * (7.5625 * (t -= 1.5 / 2.75) * t + .75) + b;
      } else if (t < 2.5 / 2.75) {
        return c * (7.5625 * (t -= 2.25 / 2.75) * t + .9375) + b;
      } else {
        return c * (7.5625 * (t -= 2.625 / 2.75) * t + .984375) + b;
      }
    },
    easeInOutBounce: function(t, b, c, d) {
      var v;
      if (t < d / 2) {
        v = penner.easeInBounce(t * 2, 0, c, d);
        return v * .5 + b;
      } else {
        v = penner.easeOutBounce(t * 2 - d, 0, c, d);
        return v * .5 + c * .5 + b;
      }
    }
  };

  umd(penner);

}).call(commonjsGlobal);
});

var eventemitter3 = createCommonjsModule(function (module) {

var has = Object.prototype.hasOwnProperty
  , prefix = '~';

/**
 * Constructor to create a storage for our `EE` objects.
 * An `Events` instance is a plain object whose properties are event names.
 *
 * @constructor
 * @private
 */
function Events() {}

//
// We try to not inherit from `Object.prototype`. In some engines creating an
// instance in this way is faster than calling `Object.create(null)` directly.
// If `Object.create(null)` is not supported we prefix the event names with a
// character to make sure that the built-in object properties are not
// overridden or used as an attack vector.
//
if (Object.create) {
  Events.prototype = Object.create(null);

  //
  // This hack is needed because the `__proto__` property is still inherited in
  // some old browsers like Android 4, iPhone 5.1, Opera 11 and Safari 5.
  //
  if (!new Events().__proto__) prefix = false;
}

/**
 * Representation of a single event listener.
 *
 * @param {Function} fn The listener function.
 * @param {*} context The context to invoke the listener with.
 * @param {Boolean} [once=false] Specify if the listener is a one-time listener.
 * @constructor
 * @private
 */
function EE(fn, context, once) {
  this.fn = fn;
  this.context = context;
  this.once = once || false;
}

/**
 * Add a listener for a given event.
 *
 * @param {EventEmitter} emitter Reference to the `EventEmitter` instance.
 * @param {(String|Symbol)} event The event name.
 * @param {Function} fn The listener function.
 * @param {*} context The context to invoke the listener with.
 * @param {Boolean} once Specify if the listener is a one-time listener.
 * @returns {EventEmitter}
 * @private
 */
function addListener(emitter, event, fn, context, once) {
  if (typeof fn !== 'function') {
    throw new TypeError('The listener must be a function');
  }

  var listener = new EE(fn, context || emitter, once)
    , evt = prefix ? prefix + event : event;

  if (!emitter._events[evt]) emitter._events[evt] = listener, emitter._eventsCount++;
  else if (!emitter._events[evt].fn) emitter._events[evt].push(listener);
  else emitter._events[evt] = [emitter._events[evt], listener];

  return emitter;
}

/**
 * Clear event by name.
 *
 * @param {EventEmitter} emitter Reference to the `EventEmitter` instance.
 * @param {(String|Symbol)} evt The Event name.
 * @private
 */
function clearEvent(emitter, evt) {
  if (--emitter._eventsCount === 0) emitter._events = new Events();
  else delete emitter._events[evt];
}

/**
 * Minimal `EventEmitter` interface that is molded against the Node.js
 * `EventEmitter` interface.
 *
 * @constructor
 * @public
 */
function EventEmitter() {
  this._events = new Events();
  this._eventsCount = 0;
}

/**
 * Return an array listing the events for which the emitter has registered
 * listeners.
 *
 * @returns {Array}
 * @public
 */
EventEmitter.prototype.eventNames = function eventNames() {
  var names = []
    , events
    , name;

  if (this._eventsCount === 0) return names;

  for (name in (events = this._events)) {
    if (has.call(events, name)) names.push(prefix ? name.slice(1) : name);
  }

  if (Object.getOwnPropertySymbols) {
    return names.concat(Object.getOwnPropertySymbols(events));
  }

  return names;
};

/**
 * Return the listeners registered for a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @returns {Array} The registered listeners.
 * @public
 */
EventEmitter.prototype.listeners = function listeners(event) {
  var evt = prefix ? prefix + event : event
    , handlers = this._events[evt];

  if (!handlers) return [];
  if (handlers.fn) return [handlers.fn];

  for (var i = 0, l = handlers.length, ee = new Array(l); i < l; i++) {
    ee[i] = handlers[i].fn;
  }

  return ee;
};

/**
 * Return the number of listeners listening to a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @returns {Number} The number of listeners.
 * @public
 */
EventEmitter.prototype.listenerCount = function listenerCount(event) {
  var evt = prefix ? prefix + event : event
    , listeners = this._events[evt];

  if (!listeners) return 0;
  if (listeners.fn) return 1;
  return listeners.length;
};

/**
 * Calls each of the listeners registered for a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @returns {Boolean} `true` if the event had listeners, else `false`.
 * @public
 */
EventEmitter.prototype.emit = function emit(event, a1, a2, a3, a4, a5) {
  var evt = prefix ? prefix + event : event;

  if (!this._events[evt]) return false;

  var listeners = this._events[evt]
    , len = arguments.length
    , args
    , i;

  if (listeners.fn) {
    if (listeners.once) this.removeListener(event, listeners.fn, undefined, true);

    switch (len) {
      case 1: return listeners.fn.call(listeners.context), true;
      case 2: return listeners.fn.call(listeners.context, a1), true;
      case 3: return listeners.fn.call(listeners.context, a1, a2), true;
      case 4: return listeners.fn.call(listeners.context, a1, a2, a3), true;
      case 5: return listeners.fn.call(listeners.context, a1, a2, a3, a4), true;
      case 6: return listeners.fn.call(listeners.context, a1, a2, a3, a4, a5), true;
    }

    for (i = 1, args = new Array(len -1); i < len; i++) {
      args[i - 1] = arguments[i];
    }

    listeners.fn.apply(listeners.context, args);
  } else {
    var length = listeners.length
      , j;

    for (i = 0; i < length; i++) {
      if (listeners[i].once) this.removeListener(event, listeners[i].fn, undefined, true);

      switch (len) {
        case 1: listeners[i].fn.call(listeners[i].context); break;
        case 2: listeners[i].fn.call(listeners[i].context, a1); break;
        case 3: listeners[i].fn.call(listeners[i].context, a1, a2); break;
        case 4: listeners[i].fn.call(listeners[i].context, a1, a2, a3); break;
        default:
          if (!args) for (j = 1, args = new Array(len -1); j < len; j++) {
            args[j - 1] = arguments[j];
          }

          listeners[i].fn.apply(listeners[i].context, args);
      }
    }
  }

  return true;
};

/**
 * Add a listener for a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @param {Function} fn The listener function.
 * @param {*} [context=this] The context to invoke the listener with.
 * @returns {EventEmitter} `this`.
 * @public
 */
EventEmitter.prototype.on = function on(event, fn, context) {
  return addListener(this, event, fn, context, false);
};

/**
 * Add a one-time listener for a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @param {Function} fn The listener function.
 * @param {*} [context=this] The context to invoke the listener with.
 * @returns {EventEmitter} `this`.
 * @public
 */
EventEmitter.prototype.once = function once(event, fn, context) {
  return addListener(this, event, fn, context, true);
};

/**
 * Remove the listeners of a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @param {Function} fn Only remove the listeners that match this function.
 * @param {*} context Only remove the listeners that have this context.
 * @param {Boolean} once Only remove one-time listeners.
 * @returns {EventEmitter} `this`.
 * @public
 */
EventEmitter.prototype.removeListener = function removeListener(event, fn, context, once) {
  var evt = prefix ? prefix + event : event;

  if (!this._events[evt]) return this;
  if (!fn) {
    clearEvent(this, evt);
    return this;
  }

  var listeners = this._events[evt];

  if (listeners.fn) {
    if (
      listeners.fn === fn &&
      (!once || listeners.once) &&
      (!context || listeners.context === context)
    ) {
      clearEvent(this, evt);
    }
  } else {
    for (var i = 0, events = [], length = listeners.length; i < length; i++) {
      if (
        listeners[i].fn !== fn ||
        (once && !listeners[i].once) ||
        (context && listeners[i].context !== context)
      ) {
        events.push(listeners[i]);
      }
    }

    //
    // Reset the array, or remove it completely if we have no more listeners.
    //
    if (events.length) this._events[evt] = events.length === 1 ? events[0] : events;
    else clearEvent(this, evt);
  }

  return this;
};

/**
 * Remove all listeners, or those of the specified event.
 *
 * @param {(String|Symbol)} [event] The event name.
 * @returns {EventEmitter} `this`.
 * @public
 */
EventEmitter.prototype.removeAllListeners = function removeAllListeners(event) {
  var evt;

  if (event) {
    evt = prefix ? prefix + event : event;
    if (this._events[evt]) clearEvent(this, evt);
  } else {
    this._events = new Events();
    this._eventsCount = 0;
  }

  return this;
};

//
// Alias methods names because people roll like that.
//
EventEmitter.prototype.off = EventEmitter.prototype.removeListener;
EventEmitter.prototype.addListener = EventEmitter.prototype.on;

//
// Expose the prefix.
//
EventEmitter.prefixed = prefix;

//
// Allow `EventEmitter` to be imported as module namespace.
//
EventEmitter.EventEmitter = EventEmitter;

//
// Expose the module.
//
{
  module.exports = EventEmitter;
}
});

/**
 * Controls a group of easings added by Ease.add()
 * @extends EventEmitter
 */
class Easing extends eventemitter3
{
    /**
     * an easing that acts on an element or an array of elements
     * @param {(PIXI.DisplayObject|PIXI.DisplayObject[])} element
     * @param {object} params
     * @param {object} options
     * @extends EventEmitter
     * @fires EaseElement#complete
     * @fires EaseElement#each
     * @fires EaseElement#complete
     * @fires EaseElement#reverse
     * @fires EaseElement#repeat
     * @fires EaseElement#wait
     * @fires EaseElement#wait-end
     */
    constructor(element, params, options)
    {
        super();

        /**
         * element(s) being eased
         * @member {(PIXI.DisplayObject|PIXI.DisplayObject[])}
         */
        this.elements = Array.isArray(element) ? element : [element];
        this.eases = [];
        this.options = options || {};
        this.time = 0;
        for (let param in params)
        {
            for (let element of this.elements)
            {
                this.addParam(element, param, params[param]);
            }
        }
    }

    addParam(element, entry, param)
    {
        let start, to, delta, update, name = entry;
        switch (entry)
        {
            case 'scaleX':
            case 'skewX':
                name = entry.substr(0, entry.length - 1);
                start = element[name].x;
                to = param;
                delta = param - start;
                update = ease => this.updateCoord(ease, name, 'x');
                break

            case 'scaleY':
            case 'skewY':
                name = entry.substr(0, entry.length - 1);
                start = element[name].y;
                to = param;
                delta = param - start;
                update = ease => this.updateCoord(ease, name, 'y');
                break

            case 'tint':
            case 'blend':
                const colors = Array.isArray(param) ? param : [element.tint, param];
                start = 0;
                to = colors.length;
                delta = to;
                update = (entry === 'tint') ? ease => this.updateTint(ease, colors) : ease => this.updateBlend(ease, colors);
                break

            case 'shake':
                start = { x: element.x, y: element.y };
                to = param;
                update = ease => this.updateShake(ease);
                break

            case 'position':
                start = { x: element.x, y: element.y };
                to = { x: param.x, y: param.y };
                delta = { x: to.x - start.x, y: to.y - start.y };
                update = ease => this.updatePosition(ease);
                break

            case 'skew':
            case 'scale':
                start = element[entry].x;
                to = param;
                delta = param - start;
                update = ease => this.updatePoint(ease, entry);
                break

            case 'face':
                start = element.rotation;
                to = Easing.shortestAngle(start, Math.atan2(param.y - element.y, param.x - element.x));
                delta = to - start;
                update = ease => this.updateOne(ease, 'rotation');
                break

            default:
                start = element[entry];
                to = param;
                delta = param - start;
                update = ease => this.updateOne(ease, entry);
        }
        this.eases.push({ element, entry, update, start, to, delta });
    }

    /**
     * helper function to find closest angle to change between angle start and angle finish (used by face)
     * @param {number} start angle
     * @param {number} finish angle
     * @private
     */
    static shortestAngle(start, finish)
    {
        function mod(a, n)
        {
            return (a % n + n) % n
        }

        const PI_2 = Math.PI * 2;
        let diff = Math.abs(start - finish) % PI_2;
        diff = diff > Math.PI ? (PI_2 - diff) : diff;

        const simple = finish - start;
        const sign = mod((simple + Math.PI), PI_2) - Math.PI > 0 ? 1 : -1;

        return diff * sign
    }

    /**
     * remove all easings with matching element and params
     * @param {PIXI.DisplayObject} [element] if not set, removes all elements in this easing
     * @param {(string|string[])} [params] if not set, removes all params for each element
     */
    remove(element, params)
    {
        if (arguments.length === 0)
        {
            this.eases = [];
        }
        else
        {
            if (typeof params === 'string')
            {
                params = [params];
            }
            for (let i = 0; i < this.eases.length; i++)
            {
                const ease = this.eases[i];
                if ((!element || ease.element === element) && (!params || params.indexOf(ease.entry) !== -1))
                {
                    this.eases.splice(i, 1);
                    i--;
                }
            }
        }
        if (this.eases.length === 0)
        {
            return true
        }
    }

    updateOne(ease, entry)
    {
        ease.element[entry] = this.options.ease(this.time, ease.start, ease.delta, this.options.duration);
    }

    updatePoint(ease, entry)
    {
        ease.element[entry].x = ease.element[entry].y = this.options.ease(this.time, ease.start, ease.delta, this.options.duration);
    }

    updatePosition(ease)
    {
        ease.element.x = this.options.ease(this.time, ease.start.x, ease.delta.x, this.options.duration);
        ease.element.y = this.options.ease(this.time, ease.start.y, ease.delta.y, this.options.duration);
    }

    updateCoord(ease, name, coord)
    {
        ease.element[name][coord] = this.options.ease(this.time, ease.start, ease.delta, this.options.duration);
    }

    updateTint(ease, colors)
    {
        let index = Math.floor(this.options.ease(this.time, ease.start, ease.delta, this.options.duration));
        if (index === colors.length)
        {
            index = colors.length - 1;
        }
        ease.element.tint = colors[index];
    }

    updateBlend(ease, colors)
    {
        const calc = this.options.ease(this.time, ease.start, ease.delta, this.options.duration);
        let index = Math.floor(calc);
        if (index === colors.length)
        {
            index = colors.length - 1;
        }
        let next = index + 1;
        if (next === colors.length)
        {
            next = this.options.reverse ? index - 1 : this.options.repeat ? 0 : index;
        }
        const percent = calc - index;
        const color1 = colors[index];
        const color2 = colors[next];
        const r1 = color1 >> 16;
        const g1 = color1 >> 8 & 0x0000ff;
        const b1 = color1 & 0x0000ff;
        const r2 = color2 >> 16;
        const g2 = color2 >> 8 & 0x0000ff;
        const b2 = color2 & 0x0000ff;
        const percent1 = 1 - percent;
        const r = percent1 * r1 + percent * r2;
        const g = percent1 * g1 + percent * g2;
        const b = percent1 * b1 + percent * b2;
        ease.element.tint = r << 16 | g << 8 | b;
    }

    updateShake(ease)
    {
        function random(n)
        {
            return Math.floor(Math.random() * n) - Math.floor(n / 2)
        }
        ease.element.x = ease.start.x + random(ease.to);
        ease.element.y = ease.start.y + random(ease.to);
    }

    complete(ease)
    {
        if (ease.entry === 'shake')
        {
            ease.element.x = ease.start.x;
            ease.element.y = ease.start.y;
        }
    }

    reverse(ease)
    {
        if (ease.entry === 'position')
        {
            const swapX = ease.to.x;
            const swapY = ease.to.y;
            ease.to.x = ease.start.x;
            ease.to.y = ease.start.y;
            ease.start.x = swapX;
            ease.start.y = swapY;
            ease.delta.x = -ease.delta.x;
            ease.delta.y = -ease.delta.y;
        }
        else
        {
            const swap = ease.to;
            ease.to = ease.start;
            ease.start = swap;
            ease.delta = -ease.delta;
        }
    }

    repeat(ease)
    {
        switch (ease.entry)
        {
            case 'skewX':
                ease.element.skew.x = ease.start;
                break

            case 'skewY':
                ease.element.skew.y = ease.start;
                break

            case 'skew':
                ease.element.skew.x = ease.start;
                ease.element.skew.y = ease.start;
                break

            case 'scaleX':
                ease.element.scale.x = ease.start;
                break

            case 'scaleY':
                ease.element.scale.y = ease.start;
                break

            case 'scale':
                ease.element.scale.x = ease.start;
                ease.element.scale.y = ease.start;
                break

            case 'position':
                ease.element.x = ease.start.x;
                ease.element.y = ease.start.y;
                break

            default:
                ease.element[ease.entry] = ease.start;
        }
    }

    update(elapsed)
    {
        if (this.eases.length === 0)
        {
            return true
        }
        if (this.options.wait)
        {
            this.options.wait -= elapsed;
            if (this.options.wait > 0)
            {
                this.emit('wait', this);
                return
            }
            else
            {
                elapsed = -this.options.wait;
                this.options.wait = 0;
                this.emit('wait-end', this);
            }
        }
        this.time += elapsed;
        let leftover = 0;
        if (this.time >= this.options.duration)
        {
            leftover = this.time - this.options.duration;
            this.time = this.options.duration;
        }
        for (let i = 0; i < this.eases.length; i++)
        {
            const ease = this.eases[i];
            if (ease.element._destroyed)
            {
                this.eases.splice(i, 1);
                i--;
            }
            else
            {
                ease.update(ease);
            }
        }
        this.emit('each', this);
        if (this.time >= this.options.duration)
        {
            if (this.options.reverse)
            {
                this.eases.forEach(ease => this.reverse(ease));
                this.time = leftover;
                if (leftover)
                {
                    this.eases.forEach(ease => ease.update(ease));
                }
                this.emit('reverse', this);
                if (!this.options.repeat)
                {
                    this.options.reverse = false;
                }
                else if (this.options.repeat !== true)
                {
                    this.options.repeat--;
                }
            }
            else if (this.options.repeat)
            {
                this.eases.forEach(ease => this.repeat(ease));
                this.time = leftover;
                if (leftover)
                {
                    this.eases.forEach(ease => ease.update(ease));
                }
                if (this.options.repeat !== true)
                {
                    this.options.repeat--;
                }
                this.emit('repeat', this);
            }
            else
            {
                this.eases.forEach(ease => this.complete(ease));
                this.emit('complete', this);
                return true
            }
        }
    }

    /**
     * number of parameters being eased
     * @returns {number}
     */
    get count()
    {
        return this.eases.length
    }
}

/**
 * fires when easings are finished
 * @event EaseElement#complete
 * @type {EaseElement}
 */

/**
 * fires on each loop where there are easings
 * @event EaseElement#each
 * @type {EaseElement}
 */

/**
 * fires when easings repeats
 * @event EaseElement#repeat
 * @type {EaseElement}
 */

 /**
 * fires when easings reverse
 * @event EaseElement#reverse
 * @type {EaseElement}
 */

/**
 * fires on each frame while a wait is counting down
 * @event EaseElement#wait
 * @type {object}
 * @property {EaseElement} element
 * @property {number} wait
 */

/**
 * fires after a wait expires
 * @event EaseElement#wait-end
 * @type { EaseElement }
 */

const easeOptions = {
    duration: 1000,
    ease: penner.easeInOutSine,
    maxFrame: 1000 / 60,
    ticker: null,
    useRAF: true
};

/**
 * Manages a group of eases
 * @extends EventEmitter
 * @example
 * import * as PIXI from 'pixi.js'
 * import { Ease, ease } from 'pixi-ease'
 *
 * const app = new PIXI.Application()
 * const test = app.stage.addChild(new PIXI.Sprite(PIXI.Texture.WHITE))
 *
 * const move = ease.add(test, { x: 20, y: 15, alpha: 0.25 }, { reverse: true })
 * move.once('complete', () => console.log('move ease complete.'))
 *
 * test.generic = 25
 * const generic = ease.add(test, { generic: 0 }, { duration: 1500, ease: 'easeOutQuad' })
 * generic.on('each', () => console.log(test.generic))
 *
 * const secondEase = new Ease({ duration: 3000, ease: 'easeInBack' })
 * const test2 = app.stage.addChild(new PIXI.Sprite(PIXI.Texture.WHITE))
 * test2.tint = 0x0000ff
 * secondEase.add(test2, { blend: [0xff0000, 0x00ff00], scale: 2 })
 */
class Ease extends eventemitter3
{
    /**
     * @param {object} [options]
     * @param {number} [options.duration=1000] default duration if not set
     * @param {(string|function)} [options.ease=Penner.easeInOutSine] default ease function if not set (see {@link https://www.npmjs.com/package/penner} for names of easing functions)
     * @param {boolean} [option.useRAF=true] attach to a requestAnimationFrame listener
     * @param {PIXI.Ticker} [options.ticker] attach to a PIXI.Ticker instead of RAF
     * @param {number} [options.maxFrame=1000/60] maximum frame time (set to Infinity to ignore); only used if useTicker = true
     * @fires Ease#complete
     * @fires Ease#each
     */
    constructor(options)
    {
        super();
        this.options = Object.assign({}, easeOptions, options);
        this.easings = [];
        this.empty = true;
        if (this.options.ticker)
        {
            this.options.ticker.add(this.update, this);
        }
    }

    /**
     * removes all eases and tickers
     */
    destroy()
    {
        this.removeAll();
        if (this.options.useTicker)
        {
            this.ticker.remove(this.update, this);
        }
        else if (this.options.useRAF)
        {
            cancelAnimationFrame(this.handleRAF);
            this.handleRAF = null;
        }
    }

    /**
     * add ease(s) to a PIXI.DisplayObject element
     * @param {(PIXI.DisplayObject|PIXI.DisplayObject[])} element
     *
     * @param {object} params
     * @param {number} [params.x]
     * @param {number} [params.y]
     * @param {(PIXI.DisplayObject|PIXI.Point)} [params.position] changes both x and y
     * @param {number} [params.width]
     * @param {number} [params.height]
     * @param {number} [params.scale] changes both scale.x and scale.y
     * @param {number} [params.scaleX]
     * @param {number} [params.scaleY]
     * @param {number} [params.alpha]
     * @param {number} [params.rotation]
     * @param {(PIXI.DisplayObject|PIXI.Point)} [params.face] rotate the element to face a DisplayObject using the closest angle
     * @param {number} [params.skew] changes both skew.x and skew.y
     * @param {number} [params.skewX]
     * @param {number} [params.skewY]
     * @param {(number|number[])} [params.tint] cycle through colors - if number is provided then it cycles between current tint and number; if number[] is provided is cycles only between tints in the number[]
     * @param {(number|number[])} [params.blend] blend between colors - if number is provided then it blends current tint to number; if number[] is provided then it blends between the tints in the number[]
     * @param {number} [params.shake] shakes the object by this number (randomly placing the element +/-shake pixels away from starting point)
     * @param {number} [params.*] generic number parameter
     *
     * @param {object} [options]
     * @param {number} [options.duration]
     * @param {(string|function)} [options.ease]
     * @param {(boolean|number)} [options.repeat]
     * @param {boolean} [options.reverse]
     * @param {number} [options.wait] wait this number of milliseconds before ease starts
     *
     * @returns {Easing}
     */
    add(element, params, options)
    {
        options = options || {};
        options.duration = typeof options.duration !== 'undefined' ? options.duration : this.options.duration;
        options.ease = options.ease || this.options.ease;
        if (typeof options.ease === 'string')
        {
            options.ease = penner[options.ease];
        }
        const easing = new Easing(element, params, options);
        this.easings.push(easing);
        if (this.empty && this.options.useRAF)
        {
            this.handleRAF = requestAnimationFrame(() => this.update());
            this.lastTime = Date.now();
        }
        this.empty = false;
        return easing
    }

    /**
     * create an ease that changes position (x, y) of the element by moving to the target at the speed
     * NOTE: under the hood this calls add(element, { x, y }, { duration: <calculated speed based on distance and speed> })
     * @param {PIXI.DisplayObject} element
     * @param {(PIXI.DisplayObject|PIXI.Point)} target
     * @param {number} speed in pixels / ms
     *
     * @param {object} [options]
     * @param {(string|function)} [options.ease]
     * @param {(boolean|number)} [options.repeat]
     * @param {boolean} [options.reverse]
     * @param {number} [options.wait] wait this number of milliseconds before ease starts
     * @param {boolean} [options.removeExisting] removes existing eases on the element of the same type (including x,y/position, skewX,skewY/skew, scaleX,scaleY/scale)
     *
     * @returns {Easing}
     */
    target(element, target, speed, options)
    {
        const duration = Math.sqrt(Math.pow(element.x - target.x, 2) + Math.pow(element.y - target.y, 2)) / speed;
        options = options || {};
        options.duration = duration;
        return this.add(element, { x: target.x, y: target.y }, options)
    }

    /**
     * helper function to add an ease that changes rotation to face the element at the desired target using the speed
     * NOTE: under the hood this calls add(element {x, y }, { duration: <calculated speed based on shortest rotation and speed> })
     * @param {PIXI.DisplayObject} element
     * @param {(PIXI.DisplayObject|PIXI.Point)} target
     * @param {number} speed in radians / ms
     *
     * @param {object} [options]
     * @param {(string|function)} [options.ease]
     * @param {(boolean|number)} [options.repeat]
     * @param {boolean} [options.reverse]
     * @param {number} [options.wait] wait this number of milliseconds before ease starts
     *
     * @returns {Easing}
     */
    face(element, target, speed, options)
    {
        const shortestAngle = Easing.shortestAngle(element.rotation, Math.atan2(target.y - element.y, target.x - element.x));
        const duration = Math.abs(shortestAngle - element.rotation) / speed;
        options = options || {};
        options.duration = duration;
        return this.add(element, { rotation: shortestAngle }, options)
    }

    /**
     * removes one or more eases from a DisplayObject
     * WARNING: 'complete' events will not fire for these removals
     * @param {PIXI.DisplayObject} element
     * @param {(string|string[])} [param] omit to remove all easings for an element
     */
    removeEase(element, param)
    {
        for (let i = 0; i < this.easings.length; i++)
        {
            if (this.easings[i].remove(element, param))
            {
                this.easings.splice(i, 1);
                i--;
            }
        }
        if (this.easings.length === 0)
        {
            this.empty = true;
            if (this.options.useRAF && this.handleRAF)
            {
                cancelAnimationFrame(this.handleRAF);
                this.handleRAF = null;
            }
        }
    }

    /**
     * remove all easings
     * WARNING: 'complete' events will not fire for these removals
     */
    removeAll()
    {
        this.easings = [];
        this.empty = true;
        if (this.options.useRAF && this.handleRAF)
        {
            cancelAnimationFrame(this.handleRAF);
            this.handleRAF = null;
        }
}

    /**
     * update frame; this is called automatically if options.useTicker !== false
     * @param {number} elapsed time in ms since last frame
     */
    update(elapsed)
    {
        if (this.options.useTicker)
        {
            elapsed = this.ticker.elapsedMS;
        }
        else if (this.options.useRAF)
        {
            const now = Date.now();
            elapsed = now - this.lastTime;
            this.lastTime = now;
        }
        elapsed = Math.min(elapsed, this.options.maxFrame);
        if (!this.empty)
        {
            const list = this.easings.slice(0);
            for (let easing of list)
            {
                if (easing.update(elapsed))
                {
                    this.easings.splice(this.easings.indexOf(easing), 1);
                }
            }
            this.emit('each', this);
            if (this.easings.length === 0)
            {
                this.empty = true;
                this.emit('complete', this);
            }
        }
        if (this.options.useRAF && this.easings.length)
        {
            this.handleRAF = requestAnimationFrame(() => this.update());
        }
        else
        {
            this.handleRAF = null;
        }
    }

    /**
     * number of easings
     * @type {number}
     */
    get count()
    {
        return this.easings.length
    }

    /**
     * number of active easings across all elements
     * @returns {number}
     */
    countRunning()
    {
        let count = 0;
        for (let entry of this.easings)
        {
            count += entry.count;
        }
        return count
    }

    /**
     * default duration for eases.add() (only applies to newly added eases)
     * @type {number}
     */
    set duration(duration)
    {
        this.options.duration = duration;
    }
    get duration()
    {
        return this.options.duration
    }

    /**
     * default ease for eases.add() (only applies to newly added eases)
     * @type {(string|Function)}
     */
    set ease(ease)
    {
        this.options.ease = ease;
    }
    get ease()
    {
        return this.options.ease
    }
}

// manages the ids used to define the DisplayObject ease variable (enabled multiple eases attached to the same object)
Ease.id = 0;

/**
 * default instantiated Ease class
 * @type {Ease}
 */
let ease = new Ease();

Ease.ease = ease;

class List
{
    constructor()
    {
        console.warn('Ease.List was deprecated. Use new Ease() instead.');
    }
}

/**
 * fires when there are no more eases
 * @event Ease#complete
 * @type {Ease}
 */

 /**
 * fires on each loop when there are eases running
 * @event Ease#each
 * @type {Ease}
 */


//# sourceMappingURL=ease.es.js.map


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!*************************!*\
  !*** ./src/hey-wait.js ***!
  \*************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var pixi_ease__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! pixi-ease */ "./node_modules/pixi-ease/dist/ease.es.js");
/* harmony import */ var _module_settings__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./module/settings */ "./src/module/settings.js");
/* harmony import */ var _module_ControlsGenerator__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./module/ControlsGenerator */ "./src/module/ControlsGenerator.js");
/* harmony import */ var _module_Collision__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./module/Collision */ "./src/module/Collision.js");
/* harmony import */ var _module_triggering_TriggeringHandler__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./module/triggering/TriggeringHandler */ "./src/module/triggering/TriggeringHandler.js");
/* harmony import */ var _module_triggering_PostTriggerActions__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./module/triggering/PostTriggerActions */ "./src/module/triggering/PostTriggerActions.js");
/* harmony import */ var _module_TileAuditor__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./module/TileAuditor */ "./src/module/TileAuditor.js");
/* harmony import */ var _module_Constants__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./module/Constants */ "./src/module/Constants.js");
/* harmony import */ var _module_SocketController__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./module/SocketController */ "./src/module/SocketController.js");
/* harmony import */ var _module_TokenUpdateCoordinator__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./module/TokenUpdateCoordinator */ "./src/module/TokenUpdateCoordinator.js");
/* harmony import */ var _module_GameChanger__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./module/GameChanger */ "./src/module/GameChanger.js");
/* harmony import */ var _module_Animator__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./module/Animator */ "./src/module/Animator.js");
/* harmony import */ var _module_TokenCalculator__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./module/TokenCalculator */ "./src/module/TokenCalculator.js");
/* harmony import */ var _module_ReactionCoordinator__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./module/ReactionCoordinator */ "./src/module/ReactionCoordinator.js");
/* harmony import */ var _module_EntityFinder__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./module/EntityFinder */ "./src/module/EntityFinder.js");
/* harmony import */ var _module_TokenAnimationWatcher__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./module/TokenAnimationWatcher */ "./src/module/TokenAnimationWatcher.js");
/* harmony import */ var _module_UserOperations__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./module/UserOperations */ "./src/module/UserOperations.js");
/* harmony import */ var _module_MacroOperations__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ./module/MacroOperations */ "./src/module/MacroOperations.js");
/* harmony import */ var _module_hooks_TokenHooks__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ./module/hooks/TokenHooks */ "./src/module/hooks/TokenHooks.js");
/**
 * The main entry point for "Hey, Wait!".
 *
 * Author: 1000Nettles
 * Content License: MIT
 * Software License: MIT
 */



















/* eslint no-console: ['error', { allow: ['warn', 'log', 'debug'] }] */

/* eslint-disable no-param-reassign */

/* global CONFIG */

/**
 * Our Collision instance.
 */

let collision;
/**
 * Our TokenAnimationWatcher instance.
 */

let tokenAnimationWatcher;
/**
 * Our TriggeringHandler instance.
 */

let triggeringHandler;
/**
 * Our PostTriggerActions instance.
 */

let postTriggerActions;
/**
 * Our TileAuditor instance.
 */

let tileAuditor;
/**
 * Our SocketController instance.
 */

let socketController;
/**
 * Our UserOperations instance.
 */

let userOperations;
/**
 * Our MacroOperations instance.
 */

let macroOperations;
/**
 * Our GameChanger instance.
 */

let gameChanger;
/**
 * Our TokenUpdateCoordinator instance.
 */

let tokenUpdateCoordinator;
/**
 * Our TokenCalculator instance.
 */

let tokenCalculator;
/**
 * Our ReactionCoordinator instance.
 */

let reactionCoordinator;
/**
 * Our EntityFinder instance.
 */

let entityFinder;
/**
 * Our Animator instance.
 */

let animator;
/**
 * Our TokenHooks instance.
 */

let tokenHooks; // Extract our early available dependencies out of the global scope.

const {
  Hooks,
  jQuery,
  renderTemplate
} = __webpack_require__.g;
/**
 * Determine if we're running Foundry v9.x or not.
 *
 * @return {boolean}
 */

function isV9x() {
  var _CONFIG, _CONFIG$Canvas, _CONFIG$Canvas$layers, _CONFIG$Canvas$layers2;

  return ((_CONFIG = CONFIG) === null || _CONFIG === void 0 ? void 0 : (_CONFIG$Canvas = _CONFIG.Canvas) === null || _CONFIG$Canvas === void 0 ? void 0 : (_CONFIG$Canvas$layers = _CONFIG$Canvas.layers) === null || _CONFIG$Canvas$layers === void 0 ? void 0 : (_CONFIG$Canvas$layers2 = _CONFIG$Canvas$layers.background) === null || _CONFIG$Canvas$layers2 === void 0 ? void 0 : _CONFIG$Canvas$layers2.layerClass) != null;
}
/* ------------------------------------ */

/* Initialize module                    */

/* ------------------------------------ */


Hooks.once('init', () => {
  console.log('hey-wait | Initializing hey-wait');
  (0,_module_settings__WEBPACK_IMPORTED_MODULE_1__["default"])();
});
/* ------------------------------------ */

/* Setup module                         */

/* ------------------------------------ */

Hooks.on('canvasReady', async () => {
  const {
    canvas,
    game,
    ui
  } = __webpack_require__.g;
  let backgroundLayer;

  if (isV9x()) {
    backgroundLayer = __webpack_require__.g.CONFIG.Canvas.layers.background.layerClass;
  } else {
    backgroundLayer = __webpack_require__.g.CONFIG.Canvas.layers.background;
  }

  collision = new _module_Collision__WEBPACK_IMPORTED_MODULE_3__["default"](canvas.grid.size);
  gameChanger = new _module_GameChanger__WEBPACK_IMPORTED_MODULE_10__["default"](game, canvas);
  entityFinder = new _module_EntityFinder__WEBPACK_IMPORTED_MODULE_14__["default"](game, canvas);
  const layer = canvas.layers.find(targetLayer => targetLayer instanceof backgroundLayer);
  tokenCalculator = new _module_TokenCalculator__WEBPACK_IMPORTED_MODULE_12__["default"]();
  animator = new _module_Animator__WEBPACK_IMPORTED_MODULE_11__["default"](layer, pixi_ease__WEBPACK_IMPORTED_MODULE_0__.ease);
  reactionCoordinator = new _module_ReactionCoordinator__WEBPACK_IMPORTED_MODULE_13__["default"](tokenCalculator, animator, game.settings);
  macroOperations = new _module_MacroOperations__WEBPACK_IMPORTED_MODULE_17__["default"](game.user, canvas.background, game.macros, ui.notifications);
  userOperations = new _module_UserOperations__WEBPACK_IMPORTED_MODULE_16__["default"](game.user, game.settings);
  tokenAnimationWatcher = new _module_TokenAnimationWatcher__WEBPACK_IMPORTED_MODULE_15__["default"]();
  postTriggerActions = new _module_triggering_PostTriggerActions__WEBPACK_IMPORTED_MODULE_5__["default"](gameChanger, macroOperations, reactionCoordinator);
  triggeringHandler = new _module_triggering_TriggeringHandler__WEBPACK_IMPORTED_MODULE_4__["default"](collision, gameChanger, tokenAnimationWatcher); // Ensure that we only have a single socket open for our module so we don't
  // clutter up open sockets when changing scenes (or, more specifically,
  // rendering new canvases.)

  if (socketController instanceof _module_SocketController__WEBPACK_IMPORTED_MODULE_8__["default"]) {
    await socketController.deactivate();
  }

  socketController = new _module_SocketController__WEBPACK_IMPORTED_MODULE_8__["default"](game.socket, game.user, gameChanger, entityFinder, userOperations, postTriggerActions);
  tileAuditor = new _module_TileAuditor__WEBPACK_IMPORTED_MODULE_6__["default"]();
  tokenHooks = new _module_hooks_TokenHooks__WEBPACK_IMPORTED_MODULE_18__["default"](game.user, game.settings);
  tokenUpdateCoordinator = new _module_TokenUpdateCoordinator__WEBPACK_IMPORTED_MODULE_9__["default"](triggeringHandler, postTriggerActions, socketController);
  await socketController.init();
});
Hooks.on('preCreateTile', (document, data) => {
  // This is referencing the data attached from the form submission, not a flag.
  const isHeyWait = Boolean(data === null || data === void 0 ? void 0 : data.isHeyWaitTile);

  if (!isHeyWait) {
    return;
  } // Set the "hey-wait" flag on the new tile dataset.


  data.flags = data.flags || {};
  data.flags['hey-wait'] = {
    enabled: true,
    triggered: false,
    animType: Number(data.heyWaitAnimType),
    macro: data.heyWaitMacro // unlimited: data.heyWaitUnlimited,

  }; // Hey, Wait! tiles should be hidden so players cannot see them.

  data.hidden = true;
  document.data.update(data);
});
Hooks.on('preUpdateTile', (document, change, options) => {
  var _data$flags, _data$flags$heyWait, _change$flags$heyWai;

  const {
    data
  } = document;

  if (!(data !== null && data !== void 0 && (_data$flags = data.flags) !== null && _data$flags !== void 0 && (_data$flags$heyWait = _data$flags['hey-wait']) !== null && _data$flags$heyWait !== void 0 && _data$flags$heyWait.enabled)) {
    return;
  } // Ensure that Hey, Wait! tiles cannot be rotated.
  // Currently, our logic for collision doesn't take into account rotations.


  if ((change === null || change === void 0 ? void 0 : change.rotation) !== undefined) {
    change.rotation = 0;
  }

  change.flags = change.flags || {};
  change.flags['hey-wait'] = change.flags['hey-wait'] || {}; // Record the selected animation type for the Hey, Wait! tile.

  if ((change === null || change === void 0 ? void 0 : change.heyWaitAnimType) !== undefined) {
    change.flags['hey-wait'].animType = Number(change.heyWaitAnimType);
    options.diff = true;
  } // Record the selected macro for the Hey, Wait! tile.


  if ((change === null || change === void 0 ? void 0 : change.heyWaitMacro) !== undefined) {
    change.flags['hey-wait'].macro = change.heyWaitMacro;
    options.diff = true;
  } // Record the "unlimited" setting for the Hey, Wait! tile.

  /* if (change?.heyWaitUnlimited !== undefined) {
    change.flags['hey-wait'].unlimited = change.heyWaitUnlimited;
    options.diff = true;
  } */
  // Change the tile image depending on triggered state.


  const triggered = (_change$flags$heyWai = change.flags['hey-wait']) === null || _change$flags$heyWai === void 0 ? void 0 : _change$flags$heyWai.triggered;

  if (triggered !== undefined) {
    change.img = triggered ? _module_Constants__WEBPACK_IMPORTED_MODULE_7__["default"].TILE_GO_PATH : _module_Constants__WEBPACK_IMPORTED_MODULE_7__["default"].TILE_STOP_PATH;
    options.diff = true;
  } // Clean the document for any Hey, Wait! residue.


  delete data.isHeyWaitTile;
  delete data.heyWaitAnimType;
  delete data.heyWaitMacro; // delete data.heyWaitUnlimited;
});
Hooks.on('preUpdateToken', async document => {
  tokenUpdateCoordinator.registerTokenInitPos(document.toObject());
});
Hooks.on('updateToken', async (document, change) => {
  const canRunUpdate = tokenHooks.canRunTokenUpdate(change, document.data.disposition, __webpack_require__.g.game.paused);

  if (!canRunUpdate) {
    return;
  }

  await tokenUpdateCoordinator.coordinateUpdate(document, __webpack_require__.g.canvas.background.tiles);
});
Hooks.on('getSceneControlButtons', controls => {
  const controlsGenerator = new _module_ControlsGenerator__WEBPACK_IMPORTED_MODULE_2__["default"]();
  controlsGenerator.generate(controls, __webpack_require__.g.game.user.isGM);
});
Hooks.on('renderFormApplication', (config, html) => {
  var _config$options;

  // Ensure the form application we're targeting is actually the Tile config.
  // Ensure that we're also interacting with a Hey, Wait! tile, and not
  // a regular tile.
  if (!(config !== null && config !== void 0 && (_config$options = config.options) !== null && _config$options !== void 0 && _config$options.id)) {
    return;
  }

  const tileConfigOptionsId = isV9x() ? __webpack_require__.g.CONFIG.Tile.sheetClasses.base['core.TileConfig'].cls.defaultOptions.id : __webpack_require__.g.CONFIG.Tile.sheetClass.defaultOptions.id;

  if (config.options.id !== tileConfigOptionsId || !tileAuditor.isHeyWaitTile(config.object, __webpack_require__.g.game.activeTool)) {
    return;
  }

  const windowTitleEl = html.find('.window-title');
  const originalTitle = windowTitleEl.html();
  windowTitleEl.html(`Hey, Wait! ${originalTitle}`); // Ensure we have the correct height for all the new Hey, Wait! elements.

  html.height(384);
});
Hooks.on('renderTileConfig', config => {
  var _config$object$data, _config$object$data$f, _config$object$data$f2, _config$object$data2, _config$object$data2$, _config$object$data2$2;

  const {
    game
  } = __webpack_require__.g;

  if (!tileAuditor.isHeyWaitTile(config.object, game.activeTool)) {
    return;
  }

  const selectedAnimType = ((_config$object$data = config.object.data) === null || _config$object$data === void 0 ? void 0 : (_config$object$data$f = _config$object$data.flags) === null || _config$object$data$f === void 0 ? void 0 : (_config$object$data$f2 = _config$object$data$f['hey-wait']) === null || _config$object$data$f2 === void 0 ? void 0 : _config$object$data$f2.animType) ?? _module_Constants__WEBPACK_IMPORTED_MODULE_7__["default"].DEFAULT_ANIM_TYPE;
  const setMacro = (_config$object$data2 = config.object.data) === null || _config$object$data2 === void 0 ? void 0 : (_config$object$data2$ = _config$object$data2.flags) === null || _config$object$data2$ === void 0 ? void 0 : (_config$object$data2$2 = _config$object$data2$['hey-wait']) === null || _config$object$data2$2 === void 0 ? void 0 : _config$object$data2$2.macro;
  /* const unlimitedChecked = Boolean(config.object.data?.flags?.['hey-wait']?.unlimited
    ?? false); */
  // Ensure the "setMacro" exists and wasn't deleted.

  const selectedMacro = setMacro && game.macros.get(setMacro) ? setMacro : 0; // Hide the file picker, rotation, and notes for Hey, Wait! tiling...

  const $tileSpriteInputEl = jQuery(config.form).find('div[data-tab="basic"] input[name="img"]');
  jQuery(config.form).find('.sheet-tabs a[data-tab!="basic"]').hide();
  jQuery(config.form).find('.sheet-tabs a[data-tab="basic"]').html('<i class="fas fa-hand-paper"></i> Hey, Wait!');
  const $tileSpriteGroupEl = $tileSpriteInputEl.closest('.form-group');
  const $rotationGroupEl = jQuery(config.form).find('input[name="rotation"]').closest('.form-group');
  const $tileSpriteNotesEl = $tileSpriteGroupEl.prev('.notes');
  $tileSpriteGroupEl.hide();
  $rotationGroupEl.hide();
  $tileSpriteNotesEl.hide();
  const $opacityGroupEl = jQuery(config.form).find('input[name="alpha"]').closest('.form-group');
  const $tintGroupEl = jQuery(config.form).find('input[name="tint"]').closest('.form-group');
  $opacityGroupEl.hide();
  $tintGroupEl.hide();

  if (!$tileSpriteInputEl.val()) {
    $tileSpriteInputEl.val(_module_Constants__WEBPACK_IMPORTED_MODULE_7__["default"].TILE_STOP_PATH);
  }

  const $newNotes = jQuery('<p>').attr('class', 'notes');
  $newNotes.html('Configure this Hey, Wait! tile. Hey, Wait! tiles that are <span style="color:darkred;font-weight:bold;">red</span> have not been triggered yet. Hey, Wait! tiles that are <span style="color:green;font-weight:bold;">green</span> have already been triggered by players.'); // Build "Trigger Animation Type" dropdown.

  const tileType = jQuery('<select></select>').attr('name', 'heyWaitAnimType');
  const tileTypeKeys = Object.values(_module_Animator__WEBPACK_IMPORTED_MODULE_11__["default"].animationTypes);
  const tileTypeValues = [game.i18n.localize('HEYWAIT.TILECONFIG.typeNone'), game.i18n.localize('HEYWAIT.TILECONFIG.typeInfo'), game.i18n.localize('HEYWAIT.TILECONFIG.typeQuestion'), game.i18n.localize('HEYWAIT.TILECONFIG.typeExclamation')];

  for (let i = 0; i < tileTypeKeys.length; i += 1) {
    const option = jQuery('<option></option>');
    jQuery(option).val(tileTypeKeys[i]);
    jQuery(option).html(tileTypeValues[i]);
    jQuery(tileType).append(option);
  }

  tileType.val(selectedAnimType);
  const tileTypeLabel = jQuery('<label></label>').attr('for', 'heyWaitAnimType').html(game.i18n.localize('HEYWAIT.TILECONFIG.typeText'));
  const tileTypeWrapped = tileType.wrap('<div class="form-group"></div>').parent();
  tileTypeWrapped.prepend(tileTypeLabel); // Build "Macro" dropdown.

  const $macro = jQuery('<select></select>').attr('name', 'heyWaitMacro'); // Add "none" at start.

  const noneOption = jQuery('<option></option>');
  jQuery(noneOption).val(0);
  jQuery(noneOption).html(game.i18n.localize('HEYWAIT.TILECONFIG.macroNone'));
  jQuery($macro).append(noneOption);
  game.macros.forEach(macro => {
    const option = jQuery('<option></option>');
    jQuery(option).val(macro.id);
    jQuery(option).html(macro.data.name);
    jQuery($macro).append(option);
  });
  $macro.val(selectedMacro);
  const $macroLabel = jQuery('<label></label>').attr('for', 'heyWaitMacro').html(game.i18n.localize('HEYWAIT.TILECONFIG.macroText'));
  const macroWrapped = $macro.wrap('<div class="form-group"></div>').parent();
  macroWrapped.prepend($macroLabel); // Build "unlimited uses" checkbox.

  /* const $unlimited = jQuery('<input />', {
    type: 'checkbox',
    name: 'heyWaitUnlimited',
    checked: unlimitedChecked,
  });
   const $unlimitedLabel = jQuery('<label></label>')
    .attr('for', 'heyWaitUnlimited')
    .html(game.i18n.localize('HEYWAIT.TILECONFIG.unlimitedText'));
   const $unlimitedWrapped = $unlimited
    .wrap('<div class="form-group"></div>')
    .parent();
   const $unlimitedHint = jQuery('<p></p>')
    .attr('class', 'notes')
    .html(game.i18n.localize('HEYWAIT.TILECONFIG.unlimitedHint'));
   $unlimitedWrapped.prepend($unlimitedLabel);
  $unlimitedWrapped.append($unlimitedHint); */

  jQuery(config.form).find('div[data-tab="basic"]').first().append(tileTypeWrapped);
  jQuery(config.form).find('div[data-tab="basic"]').first().append(macroWrapped);
  /* jQuery(config.form).find('div[data-tab="basic"]').first().append(
    $unlimitedWrapped,
  ); */
  // Add the hidden element specifying that this is a Hey, Wait! Tile.

  const hidden = jQuery('<input>').attr('type', 'hidden').attr('name', 'isHeyWaitTile').attr('value', 1);
  $newNotes.insertBefore($tileSpriteGroupEl);
  jQuery(hidden).insertBefore(jQuery(config.form).find(':submit'));
});
Hooks.on('renderTileHUD', async (tileHud, html) => {
  var _tileDocument$data, _tileDocument$data$fl, _tileDocument$data$fl2, _tileDocument$data2, _tileDocument$data2$f, _tileDocument$data2$f2;

  const tileDocument = tileHud.object.document;

  if (!((_tileDocument$data = tileDocument.data) !== null && _tileDocument$data !== void 0 && (_tileDocument$data$fl = _tileDocument$data.flags) !== null && _tileDocument$data$fl !== void 0 && (_tileDocument$data$fl2 = _tileDocument$data$fl['hey-wait']) !== null && _tileDocument$data$fl2 !== void 0 && _tileDocument$data$fl2.enabled)) {
    return;
  } // Hide the visibility icon as the Hey, Wait! tiles should always be hidden
  // from players' view.


  html.find('.control-icon[data-action="visibility"]').hide();
  html.find('.control-icon[data-action="overhead"]').hide();
  html.find('.control-icon[data-action="underfoot"]').hide(); // Append Hey, Wait! template for the HUD. We need to specify `isNotTriggered`
  // due to Handlebars not being able to inverse logic in a conditional.

  const form = await renderTemplate(_module_Constants__WEBPACK_IMPORTED_MODULE_7__["default"].TEMPLATE_HUD_PATH, {
    isNotTriggered: !((_tileDocument$data2 = tileDocument.data) !== null && _tileDocument$data2 !== void 0 && (_tileDocument$data2$f = _tileDocument$data2.flags) !== null && _tileDocument$data2$f !== void 0 && (_tileDocument$data2$f2 = _tileDocument$data2$f['hey-wait']) !== null && _tileDocument$data2$f2 !== void 0 && _tileDocument$data2$f2.triggered)
  });
  html.find('.col.right').prepend(form);
  html.find('.hey-wait-isNotTriggered').click(async () => {
    // Toggle the triggered state of the Hey, Wait! tile.
    await tileDocument.setFlag('hey-wait', 'triggered', !tileDocument.getFlag('hey-wait', 'triggered'));
    tileHud.render();
  });
});
})();

/******/ })()
;
//# sourceMappingURL=hey-wait.js.map