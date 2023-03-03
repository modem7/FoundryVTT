import * as lib from "../lib/lib.js";
import SequencerAudioHelper from "../modules/sequencer-audio-helper.js";
import Section from "./section.js";
import traits from "./traits/_traits.js";
import { SequencerFile } from "../modules/sequencer-file.js";

class SoundSection extends Section {

  constructor(inSequence, inFile = "") {
    super(inSequence);
    this._file = inFile;
    this._volume = 0.8;
    this._overrides = [];
  }

  /**
   * Adds a function that will run at the end of the sound serialization step, but before it is played. Allows direct
   * modifications of sound's data.
   *
   * @param {function} inFunc
   * @returns {SoundSection}
   */
  addOverride(inFunc) {
    if (!lib.is_function(inFunc)) throw this.sequence._customError(this, "addOverride", "The given function needs to be an actual function.");
    this._overrides.push(inFunc);
    return this;
  }

  /**
   * @private
   */
  _applyTraits() {
    Object.assign(this.constructor.prototype, traits.files);
    Object.assign(this.constructor.prototype, traits.audio);
    Object.assign(this.constructor.prototype, traits.time);
    Object.assign(this.constructor.prototype, traits.users);
  }

  /**
   * @OVERRIDE
   * @returns {Promise}
   */
  async run() {

    if((!this._file && this.sequence.softFail)){
      return new Promise((reject) => {
        reject();
      });
    }

    const playData = await this._sanitizeSoundData();

    if (!playData?.play) {
      this.sequence._showWarning(this, "Play", `File not found: ${playData.data.src}`);
      return new Promise((reject) => reject());
    }

    if (Hooks.call("preCreateSequencerSound", playData.data) === false) return;

    let push = !(playData.data?.users?.length === 1 && playData.data?.users?.includes(game.userId));
    return SequencerAudioHelper.play(playData, push);
  }

  /**
   * @returns {Promise}
   * @private
   */
  async _sanitizeSoundData() {

    let { file, forcedIndex } = await this._determineFile(this._file)

    if (file instanceof SequencerFile) {
      file.forcedIndex = forcedIndex;
      if (file.timeRange) {
        [this._startTime, this._endTime] = file.timeRange;
        this._isRange = true;
      }
      file = file.getFile();
    }

    let soundFile = await AudioHelper.preloadSound(file);
    if (!soundFile) {
      return {
        play: false,
        src: file
      };
    }
    let duration = soundFile.duration * 1000;

    let startTime = (this._startTime ? (!this._startPerc ? this._startTime : this._startTime * duration) : 0) / 1000;

    if (this._endTime) {
      duration = !this._endPerc
        ? Number(this._isRange ? this._endTime - this._startTime : duration - this._endTime)
        : this._endTime * duration;
    }

    duration += this._currentWaitTime;

    let data = {
      play: true,
      src: file,
      loop: this._duration > duration,
      volume: this._volume,
      fadeIn: this._fadeInAudio,
      fadeOut: this._fadeOutAudio,
      startTime: startTime,
      duration: this._duration || duration,
      sceneId: game.user.viewedScene,
      users: this._users ? Array.from(this._users) : null
    };

    for (let override of this._overrides) {
      data = await override(this, data);
    }

    if (typeof data.src !== "string" || data.src === "") {
      throw this.sequence._customError(this, "file", "a sound must have a src of type string!");
    }

    return data;
  }
}

export default SoundSection;
