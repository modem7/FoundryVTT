import { custom_error, is_function } from "../lib/lib.js";

const presetMap = new Map();

export default class SequencerPresets {

  /**
   * Adds a preset that can then be used in sequences
   *
   * @param {string} inName
   * @param {Function} inFunction
   * @param {boolean} [overwrite=false] overwrite
   * @returns {Map<string, Function>}
   */
  static add(inName, inFunction, overwrite = false){

    if(typeof inName !== "string"){
      throw custom_error("Sequencer", `SequencerPresets | inName must be of type string`);
    }

    if(!is_function(inFunction)){
      throw custom_error("Sequencer", `SequencerPresets | inFunction must be of type function`);
    }

    if(presetMap.get(inName) && !overwrite){
      throw custom_error("Sequencer", `SequencerPresets | Preset "${inName}" already exists`);
    }

    presetMap.set(inName, inFunction);
    console.log(`Sequencer | Presets | Added "${inName}" preset`);
    return presetMap;

  }

  /**
   * Retrieves all presets
   *
   * @returns {Map<string, Function>}
   */
  static getAll(){
    return presetMap;
  }

  /**
   * Retrieves preset based on its name
   *
   * @param {string} name
   * @returns {Function}
   */
  static get(name){
    return presetMap.get(name);
  }

}
