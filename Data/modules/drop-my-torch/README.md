# Drop My Torch

Drop My Torch is a Foundry VTT module containing a macro and set of tokens used to easily handle a character dropping a held light source at the beginning of a fight.

## Installation

You can install this module automatically by inputting the following module URL:

`https://gitlab.com/derekstucki/drop-my-torch/-/raw/main/module.json`

Once activated in a game world, import the "Drop My Torch tokens" and "Drop My Torch macros" compendiums into your Actors and Macros.

## System Support

As of Foundry v10, this module only supports specific game systems. Please file an issue in [gitlab](https://gitlab.com/derekstucki/drop-my-torch/-/issues) to request additional system support.

## Usage

Add the "Drop Torch" and "Light Torch" macros to your macro hotbar. Select one or more character tokens, then activate the Light Torch macro. A dialog box appears to change which light source the selected tokens are holding. Click the appropriate button, then close. When one or more character tokens drop their light source, select those character tokens, and activate the Drop Torch macro. An appropriate light source token will be created in the bottom-right corner of each selected character token, then the character token will be set to not emit light.

### Fully Supported Lights (dnd5e)

| Token | Dim Light Radius | Bright Light Radius |
| --- | --- | --- |
| Torch (default) | 40 | 20 |
| Lamp | 45 | 15 |
| Hooded Lantern (open) | 60 | 30 |
| Hooded Lantern (closed) | 5 | 0 |
| Bullseye Lantern | 120 | 60 |
| Candle | 10 | 5 |

### Partially Supported Lights (dnd5e)

| Token | Dim Light Radius | Bright Light Radius |
| --- | --- | --- |
| Light Cantrip | 40 | 20 |
| Darkness Spell | 0 | -15 |

## Player Permissions

Installed as described above, only the GM user can use the macros. In order for players to use the macros, set all players as owners of the imported Actor tokens, grant Observer rights on the "Drop Torch" and "Light Torch" macros, and enable "Create New Tokens" in the Foundry Permission Configuration.

## Credits

The "Light Torch" macro was heavily inspired by the "Light Picker" macro from [Foundry Community Macros](https://github.com/foundry-vtt-community/macros/blob/main/token/light_picker.js).

Art for the tokens was kitbashed from [Forgetten Adventures](https://www.forgotten-adventures.net/) map making assets. If you like this module, go buy maps or character tokens from them so the art styles will match perfectly.
