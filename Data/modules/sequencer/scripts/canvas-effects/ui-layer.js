export default class SequencerUILayer {

  constructor(name, zIndex = 0.1) {

    this.canvas = document.createElement("canvas");
    this.canvas.id = name;

    this.canvas.style.cssText = `
            position:absolute;
            touch-action: none;
            pointer-events: none;
            width:100%;
            height:100%;
            z-index:${zIndex};
            padding: 0;
            margin: 0;
        `;

    document.body.appendChild(this.canvas);

    this.app = new PIXI.Application({
      width: window.innerWidth,
      height: window.innerHeight,
      view: this.canvas,
      antialias: true,
      backgroundAlpha: 0.0,
      sharedTicker: true
    });

    this.app.resizeTo = window;

    this.container = new PIXI.Container();
    this.container.sortableChildren = true;
    this.container.parentName = "sequencer";

    this.app.stage.addChild(this.container);

    this.app.ticker.add(this.tick.bind(this));

  }

  get effects() {
    return this.container.children;
  }

  static setup() {
    return {
      "below": new this("sequencerUILayerBelow"),
      "above": new this("sequencerUILayerAbove", 10000)
    }
  }

  tick() {
    this.updateAnchoredElements();
  }

  removeContainerByEffect(inEffect) {
    const child = this.children.find(child => child === inEffect);
    if (!child) return;
    this.container.removeChild(child);
  }

  updateAnchoredElements() {

    for (let effect of this.effects) {

      let screenSpaceAnchor = effect.data.screenSpaceAnchor;
      let screenSpacePosition = effect.data.screenSpacePosition

      if (!screenSpaceAnchor) {
        if (!effect.data.anchor) {
          if (!screenSpaceAnchor) {
            screenSpaceAnchor = { x: 0.5, y: 0.5 };
          }
          if (effect.data.screenSpace) {
            effect.data.anchor = { ...screenSpaceAnchor };
          } else {
            effect.data.anchor = { x: 0.5, y: 0.5 };
          }
        } else if (!screenSpaceAnchor) {
          screenSpaceAnchor = { ...effect.data.anchor };
        }
      }

      if (!screenSpacePosition) {
        screenSpacePosition = { x: 0, y: 0 }
      }

      effect.position.set(
        screenSpacePosition.x + this.app.renderer.width * screenSpaceAnchor.x,
        screenSpacePosition.y + this.app.renderer.height * screenSpaceAnchor.y
      );

      if (effect.data.screenSpaceScale) {

        const scaleData = effect.data.screenSpaceScale ?? { x: 1, y: 1 };

        let scaleX = scaleData.x;
        let scaleY = scaleData.y;

        if (scaleData.fitX) {
          scaleX = scaleX * (this.app.renderer.width / effect.sprite.width);
        }

        if (scaleData.fitY) {
          scaleY = scaleY * (this.app.renderer.height / effect.sprite.height);
        }

        scaleX = scaleData.ratioX ? scaleY : scaleX;
        scaleY = scaleData.ratioY ? scaleX : scaleY;

        effect.scale.set(
          scaleX,
          scaleY
        )

      }

    }

  }

}