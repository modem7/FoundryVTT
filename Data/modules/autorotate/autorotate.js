function t(t,e,o){if(e.type,e?.type?.prototype instanceof FormApplication)return game.settings.registerMenu("autorotate",t,e);const n=e.onChange;null!=o&&(e.onChange=null!=n?function(e){o[t]=e,n(e)}:function(e){o[t]=e}),void 0===e.default&&void 0!==o[t]&&(e.default=o[t]);const a=game.settings.register("autorotate",t,e);return null!=e.onChange&&e.onChange(function(t){return game.settings.get("autorotate",t)}(t)),a}const e={version:"",defaultRotationMode:"regular"};function o(t,e){return t.flags.autorotate?.[e]}function n(t){const n=o(t,"enabled");return 1==n||null==n&&"automatic"===e.defaultRotationMode}function a(t){return o(t,"offset")??0}function r(t,e,o){return function(t){const e=t%360;return e<0?e+360:e}(function(t,e,o){let n=Math.atan2(e,t)/(Math.PI/180);return n}(t,e)-90+o)}Hooks.on("ready",(()=>{!function(e,o){for(var[n,a]of Object.entries({version:{scope:"world"},defaultRotationMode:{name:"Default Rotation Mode",hint:"The rotation mode used for tokens that do not have automatic rotation explicitly enabled or disabled.",scope:"world",config:1,choices:{regular:"Regular",automatic:"Automatic"}}}))t(n,a,e)}(e)})),Hooks.on("preUpdateToken",(async function(t,e,o,i){if(i!==game.user.id||!n(t))return;const s=e.x||t.x,u=e.y||t.y;if(s===t.x&&u===t.y)return;const d=s-t.x,c=u-t.y,f=a(t);e.rotation=r(d,c,f),game.keyboard.downKeys.has("Shift")&&(game.keyboard.downKeys.has("ArrowUp")||game.keyboard.downKeys.has("ArrowDown")||game.keyboard.downKeys.has("ArrowLeft")||game.keyboard.downKeys.has("ArrowRight"))&&(e.x=void 0,e.y=void 0)})),Hooks.on("targetToken",(async function(t,e,o){if(!o||t.id!==game.user.id)return;const i=canvas.tokens.controlled;if(0===i.length)return;const s=i.filter((t=>n(t.document))).filter((t=>t.id!==e.id)).map((t=>({_id:t.id,rotation:r(e.document.x-t.document.x,e.document.y-t.document.y,a(t.document))})));await canvas.scene.updateEmbeddedDocuments("Token",s)})),Hooks.on("renderTokenConfig",(async function(t,e,o){const n=o.object.flags.autorotate?.enabled,a=o.object.flags.autorotate?.offset,r=e.find("div[data-tab='appearance']:first");let i=await renderTemplate("modules/autorotate/templates/token-config-snippet.html",{selectDefault:null==n,selectYes:1==n,selectNo:0==n,offsetToSet:a});r.append(i)}));
//# sourceMappingURL=autorotate.js.map
