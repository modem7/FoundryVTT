import { TerrainLayer } from './terrainlayer.js';
import { TerrainDocument } from './terraindocument.js';
import { log, setting, i18n, getflag} from '../terrain-main.js';

export class TerrainConfig extends DocumentSheet {

    /** @override */
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            id: "terrain-config",
            classes: ["sheet", "terrain-sheet"],
            //title: i18n("EnhancedTerrainLayer.Configuration"),
            template: "modules/enhanced-terrain-layer/templates/terrain-config.html",
            width: 400,
            height: "auto",
            configureDefault: false,
            submitOnChange: false
        });
    }

    /* -------------------------------------------- */

    /** @override */
    getData(options) {
        var _obstacles = {};
        var _environments = canvas.terrain.getEnvironments().reduce(function (map, obj) {
            if (obj.obstacle === true) {
                _obstacles[obj.id] = i18n(obj.text);
            }else
                 map[obj.id] = i18n(obj.text);
            return map;
        }, {});

        const data = super.getData();
        return mergeObject(data, {
            author: game.users.get(this.document.author)?.name || "",
            environments: _environments,
            obstacles: _obstacles,
            useObstacles: setting('use-obstacles'),
            submitText: this.document.id ? "Update" : "Create"
        })
    }

    /* -------------------------------------------- */

    /** @override */
    _onChangeInput(event) {
        if ($(event.target).attr('name') == 'multiple') {
            let val = $(event.target).val();
            $(event.target).next().html(TerrainDocument.text(val));
        }
        super._onChangeInput.call(this, event);
    }

    /* -------------------------------------------- */

    /** @override */
    async _updateObject(event, formData) {
        if (!game.user.isGM) throw "You do not have the ability to configure a Terrain object.";

        // Un-scale the bezier factor
        //formData.bezierFactor /= 2;

        if (formData.width != this.object.width || formData.height != this.object.height) {
            let reshape = this.object.object._rescaleDimensions(this.object, formData.width - this.object.width, formData.height - this.object.height);
            formData["shape.width"] = reshape.shape.width;
            formData["shape.height"] = reshape.shape.height;
            if (this.object.object.isPolygon)
                formData["shape.points"] = reshape.shape.points;
        }
        delete formData.width;
        delete formData.height;

        let data = expandObject(formData);
        data.multiple = Math.clamped(data.multiple, setting('minimum-cost'), setting('maximum-cost'));

        let defaultOpacity = getflag(canvas.scene, 'opacity') ?? setting('opacity') ?? 1;
        if (data.opacity == defaultOpacity)
            data.opacity = null;

        if (this.object.id) {
            return this.object.update(data);
        }
        return this.object.constructor.create(data);
    }

    async close(options) {
        await super.close(options);
        if (this.preview) {
            this.preview.removeChildren();
            this.preview = null;
        }
    }

    activateListeners(html) {
        super.activateListeners(html);

        if (setting('use-obstacles')) {
            $('select[name="environment"], select[name="obstacle"]', html).on('change', function () {
                //make sure that the environment is always set if using obstacles
                if ($('select[name="environment"]', html).val() == '' && $('select[name="obstacle"]', html).val() != '') {
                    $('select[name="environment"]', html).val($('select[name="obstacle"]', html).val());
                    $('select[name="obstacle"]', html).val('');
                }

                //make sure that obstacle is only set once, can't have an obstacle + obstacle, can only be environment + obstacle
                if ($('select[name="environment"] option:selected', html).parent().attr('data-type') == 'obstacle' && $('select[name="obstacle"]', html).val() != '') {
                    if ($(this).attr('name') == 'obstacle') {
                        $('select[name="environment"]', html).val($('select[name="obstacle"]', html).val());
                    }
                    $('select[name="obstacle"]', html).val('');
                };
            });
        }
    }
}