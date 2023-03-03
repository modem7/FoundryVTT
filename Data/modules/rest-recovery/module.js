var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
const style = "";
function noop() {
}
__name(noop, "noop");
const identity = /* @__PURE__ */ __name((x) => x, "identity");
function assign(tar, src) {
  for (const k in src)
    tar[k] = src[k];
  return tar;
}
__name(assign, "assign");
function run(fn) {
  return fn();
}
__name(run, "run");
function blank_object() {
  return /* @__PURE__ */ Object.create(null);
}
__name(blank_object, "blank_object");
function run_all(fns) {
  fns.forEach(run);
}
__name(run_all, "run_all");
function is_function(thing) {
  return typeof thing === "function";
}
__name(is_function, "is_function");
function safe_not_equal(a, b) {
  return a != a ? b == b : a !== b || (a && typeof a === "object" || typeof a === "function");
}
__name(safe_not_equal, "safe_not_equal");
function is_empty(obj) {
  return Object.keys(obj).length === 0;
}
__name(is_empty, "is_empty");
function subscribe(store, ...callbacks) {
  if (store == null) {
    return noop;
  }
  const unsub = store.subscribe(...callbacks);
  return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
}
__name(subscribe, "subscribe");
function get_store_value(store) {
  let value;
  subscribe(store, (_) => value = _)();
  return value;
}
__name(get_store_value, "get_store_value");
function component_subscribe(component, store, callback) {
  component.$$.on_destroy.push(subscribe(store, callback));
}
__name(component_subscribe, "component_subscribe");
function create_slot(definition, ctx, $$scope, fn) {
  if (definition) {
    const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
    return definition[0](slot_ctx);
  }
}
__name(create_slot, "create_slot");
function get_slot_context(definition, ctx, $$scope, fn) {
  return definition[1] && fn ? assign($$scope.ctx.slice(), definition[1](fn(ctx))) : $$scope.ctx;
}
__name(get_slot_context, "get_slot_context");
function get_slot_changes(definition, $$scope, dirty, fn) {
  if (definition[2] && fn) {
    const lets = definition[2](fn(dirty));
    if ($$scope.dirty === void 0) {
      return lets;
    }
    if (typeof lets === "object") {
      const merged = [];
      const len = Math.max($$scope.dirty.length, lets.length);
      for (let i = 0; i < len; i += 1) {
        merged[i] = $$scope.dirty[i] | lets[i];
      }
      return merged;
    }
    return $$scope.dirty | lets;
  }
  return $$scope.dirty;
}
__name(get_slot_changes, "get_slot_changes");
function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
  if (slot_changes) {
    const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
    slot.p(slot_context, slot_changes);
  }
}
__name(update_slot_base, "update_slot_base");
function get_all_dirty_from_scope($$scope) {
  if ($$scope.ctx.length > 32) {
    const dirty = [];
    const length = $$scope.ctx.length / 32;
    for (let i = 0; i < length; i++) {
      dirty[i] = -1;
    }
    return dirty;
  }
  return -1;
}
__name(get_all_dirty_from_scope, "get_all_dirty_from_scope");
function null_to_empty(value) {
  return value == null ? "" : value;
}
__name(null_to_empty, "null_to_empty");
function action_destroyer(action_result) {
  return action_result && is_function(action_result.destroy) ? action_result.destroy : noop;
}
__name(action_destroyer, "action_destroyer");
const is_client = typeof window !== "undefined";
let now = is_client ? () => window.performance.now() : () => Date.now();
let raf = is_client ? (cb) => requestAnimationFrame(cb) : noop;
const tasks = /* @__PURE__ */ new Set();
function run_tasks(now2) {
  tasks.forEach((task) => {
    if (!task.c(now2)) {
      tasks.delete(task);
      task.f();
    }
  });
  if (tasks.size !== 0)
    raf(run_tasks);
}
__name(run_tasks, "run_tasks");
function loop(callback) {
  let task;
  if (tasks.size === 0)
    raf(run_tasks);
  return {
    promise: new Promise((fulfill) => {
      tasks.add(task = { c: callback, f: fulfill });
    }),
    abort() {
      tasks.delete(task);
    }
  };
}
__name(loop, "loop");
function append(target, node) {
  target.appendChild(node);
}
__name(append, "append");
function get_root_for_style(node) {
  if (!node)
    return document;
  const root = node.getRootNode ? node.getRootNode() : node.ownerDocument;
  if (root && root.host) {
    return root;
  }
  return node.ownerDocument;
}
__name(get_root_for_style, "get_root_for_style");
function append_empty_stylesheet(node) {
  const style_element = element("style");
  append_stylesheet(get_root_for_style(node), style_element);
  return style_element.sheet;
}
__name(append_empty_stylesheet, "append_empty_stylesheet");
function append_stylesheet(node, style2) {
  append(node.head || node, style2);
  return style2.sheet;
}
__name(append_stylesheet, "append_stylesheet");
function insert(target, node, anchor) {
  target.insertBefore(node, anchor || null);
}
__name(insert, "insert");
function detach(node) {
  if (node.parentNode) {
    node.parentNode.removeChild(node);
  }
}
__name(detach, "detach");
function destroy_each(iterations, detaching) {
  for (let i = 0; i < iterations.length; i += 1) {
    if (iterations[i])
      iterations[i].d(detaching);
  }
}
__name(destroy_each, "destroy_each");
function element(name) {
  return document.createElement(name);
}
__name(element, "element");
function svg_element(name) {
  return document.createElementNS("http://www.w3.org/2000/svg", name);
}
__name(svg_element, "svg_element");
function text(data) {
  return document.createTextNode(data);
}
__name(text, "text");
function space() {
  return text(" ");
}
__name(space, "space");
function empty() {
  return text("");
}
__name(empty, "empty");
function listen(node, event, handler, options) {
  node.addEventListener(event, handler, options);
  return () => node.removeEventListener(event, handler, options);
}
__name(listen, "listen");
function prevent_default(fn) {
  return function(event) {
    event.preventDefault();
    return fn.call(this, event);
  };
}
__name(prevent_default, "prevent_default");
function stop_propagation(fn) {
  return function(event) {
    event.stopPropagation();
    return fn.call(this, event);
  };
}
__name(stop_propagation, "stop_propagation");
function attr(node, attribute, value) {
  if (value == null)
    node.removeAttribute(attribute);
  else if (node.getAttribute(attribute) !== value)
    node.setAttribute(attribute, value);
}
__name(attr, "attr");
function to_number(value) {
  return value === "" ? null : +value;
}
__name(to_number, "to_number");
function children(element2) {
  return Array.from(element2.childNodes);
}
__name(children, "children");
function set_data(text2, data) {
  data = "" + data;
  if (text2.wholeText !== data)
    text2.data = data;
}
__name(set_data, "set_data");
function set_input_value(input, value) {
  input.value = value == null ? "" : value;
}
__name(set_input_value, "set_input_value");
function set_style(node, key, value, important) {
  if (value === null) {
    node.style.removeProperty(key);
  } else {
    node.style.setProperty(key, value, important ? "important" : "");
  }
}
__name(set_style, "set_style");
function select_option(select, value) {
  for (let i = 0; i < select.options.length; i += 1) {
    const option = select.options[i];
    if (option.__value === value) {
      option.selected = true;
      return;
    }
  }
  select.selectedIndex = -1;
}
__name(select_option, "select_option");
function select_value(select) {
  const selected_option = select.querySelector(":checked") || select.options[0];
  return selected_option && selected_option.__value;
}
__name(select_value, "select_value");
function toggle_class(element2, name, toggle) {
  element2.classList[toggle ? "add" : "remove"](name);
}
__name(toggle_class, "toggle_class");
function custom_event(type, detail, { bubbles = false, cancelable = false } = {}) {
  const e = document.createEvent("CustomEvent");
  e.initCustomEvent(type, bubbles, cancelable, detail);
  return e;
}
__name(custom_event, "custom_event");
class HtmlTag {
  constructor(is_svg = false) {
    this.is_svg = false;
    this.is_svg = is_svg;
    this.e = this.n = null;
  }
  c(html) {
    this.h(html);
  }
  m(html, target, anchor = null) {
    if (!this.e) {
      if (this.is_svg)
        this.e = svg_element(target.nodeName);
      else
        this.e = element(target.nodeName);
      this.t = target;
      this.c(html);
    }
    this.i(anchor);
  }
  h(html) {
    this.e.innerHTML = html;
    this.n = Array.from(this.e.childNodes);
  }
  i(anchor) {
    for (let i = 0; i < this.n.length; i += 1) {
      insert(this.t, this.n[i], anchor);
    }
  }
  p(html) {
    this.d();
    this.h(html);
    this.i(this.a);
  }
  d() {
    this.n.forEach(detach);
  }
}
__name(HtmlTag, "HtmlTag");
function construct_svelte_component(component, props) {
  return new component(props);
}
__name(construct_svelte_component, "construct_svelte_component");
const managed_styles = /* @__PURE__ */ new Map();
let active = 0;
function hash(str) {
  let hash2 = 5381;
  let i = str.length;
  while (i--)
    hash2 = (hash2 << 5) - hash2 ^ str.charCodeAt(i);
  return hash2 >>> 0;
}
__name(hash, "hash");
function create_style_information(doc, node) {
  const info = { stylesheet: append_empty_stylesheet(node), rules: {} };
  managed_styles.set(doc, info);
  return info;
}
__name(create_style_information, "create_style_information");
function create_rule(node, a, b, duration, delay, ease, fn, uid = 0) {
  const step = 16.666 / duration;
  let keyframes = "{\n";
  for (let p = 0; p <= 1; p += step) {
    const t = a + (b - a) * ease(p);
    keyframes += p * 100 + `%{${fn(t, 1 - t)}}
`;
  }
  const rule = keyframes + `100% {${fn(b, 1 - b)}}
}`;
  const name = `__svelte_${hash(rule)}_${uid}`;
  const doc = get_root_for_style(node);
  const { stylesheet, rules } = managed_styles.get(doc) || create_style_information(doc, node);
  if (!rules[name]) {
    rules[name] = true;
    stylesheet.insertRule(`@keyframes ${name} ${rule}`, stylesheet.cssRules.length);
  }
  const animation = node.style.animation || "";
  node.style.animation = `${animation ? `${animation}, ` : ""}${name} ${duration}ms linear ${delay}ms 1 both`;
  active += 1;
  return name;
}
__name(create_rule, "create_rule");
function delete_rule(node, name) {
  const previous = (node.style.animation || "").split(", ");
  const next = previous.filter(
    name ? (anim) => anim.indexOf(name) < 0 : (anim) => anim.indexOf("__svelte") === -1
  );
  const deleted = previous.length - next.length;
  if (deleted) {
    node.style.animation = next.join(", ");
    active -= deleted;
    if (!active)
      clear_rules();
  }
}
__name(delete_rule, "delete_rule");
function clear_rules() {
  raf(() => {
    if (active)
      return;
    managed_styles.forEach((info) => {
      const { ownerNode } = info.stylesheet;
      if (ownerNode)
        detach(ownerNode);
    });
    managed_styles.clear();
  });
}
__name(clear_rules, "clear_rules");
let current_component;
function set_current_component(component) {
  current_component = component;
}
__name(set_current_component, "set_current_component");
function get_current_component() {
  if (!current_component)
    throw new Error("Function called outside component initialization");
  return current_component;
}
__name(get_current_component, "get_current_component");
function setContext(key, context) {
  get_current_component().$$.context.set(key, context);
  return context;
}
__name(setContext, "setContext");
function getContext(key) {
  return get_current_component().$$.context.get(key);
}
__name(getContext, "getContext");
const dirty_components = [];
const binding_callbacks = [];
const render_callbacks = [];
const flush_callbacks = [];
const resolved_promise = Promise.resolve();
let update_scheduled = false;
function schedule_update() {
  if (!update_scheduled) {
    update_scheduled = true;
    resolved_promise.then(flush);
  }
}
__name(schedule_update, "schedule_update");
function add_render_callback(fn) {
  render_callbacks.push(fn);
}
__name(add_render_callback, "add_render_callback");
function add_flush_callback(fn) {
  flush_callbacks.push(fn);
}
__name(add_flush_callback, "add_flush_callback");
const seen_callbacks = /* @__PURE__ */ new Set();
let flushidx = 0;
function flush() {
  const saved_component = current_component;
  do {
    while (flushidx < dirty_components.length) {
      const component = dirty_components[flushidx];
      flushidx++;
      set_current_component(component);
      update(component.$$);
    }
    set_current_component(null);
    dirty_components.length = 0;
    flushidx = 0;
    while (binding_callbacks.length)
      binding_callbacks.pop()();
    for (let i = 0; i < render_callbacks.length; i += 1) {
      const callback = render_callbacks[i];
      if (!seen_callbacks.has(callback)) {
        seen_callbacks.add(callback);
        callback();
      }
    }
    render_callbacks.length = 0;
  } while (dirty_components.length);
  while (flush_callbacks.length) {
    flush_callbacks.pop()();
  }
  update_scheduled = false;
  seen_callbacks.clear();
  set_current_component(saved_component);
}
__name(flush, "flush");
function update($$) {
  if ($$.fragment !== null) {
    $$.update();
    run_all($$.before_update);
    const dirty = $$.dirty;
    $$.dirty = [-1];
    $$.fragment && $$.fragment.p($$.ctx, dirty);
    $$.after_update.forEach(add_render_callback);
  }
}
__name(update, "update");
let promise;
function wait$1() {
  if (!promise) {
    promise = Promise.resolve();
    promise.then(() => {
      promise = null;
    });
  }
  return promise;
}
__name(wait$1, "wait$1");
function dispatch(node, direction, kind) {
  node.dispatchEvent(custom_event(`${direction ? "intro" : "outro"}${kind}`));
}
__name(dispatch, "dispatch");
const outroing = /* @__PURE__ */ new Set();
let outros;
function group_outros() {
  outros = {
    r: 0,
    c: [],
    p: outros
  };
}
__name(group_outros, "group_outros");
function check_outros() {
  if (!outros.r) {
    run_all(outros.c);
  }
  outros = outros.p;
}
__name(check_outros, "check_outros");
function transition_in(block, local) {
  if (block && block.i) {
    outroing.delete(block);
    block.i(local);
  }
}
__name(transition_in, "transition_in");
function transition_out(block, local, detach2, callback) {
  if (block && block.o) {
    if (outroing.has(block))
      return;
    outroing.add(block);
    outros.c.push(() => {
      outroing.delete(block);
      if (callback) {
        if (detach2)
          block.d(1);
        callback();
      }
    });
    block.o(local);
  } else if (callback) {
    callback();
  }
}
__name(transition_out, "transition_out");
const null_transition = { duration: 0 };
function create_in_transition(node, fn, params) {
  const options = { direction: "in" };
  let config = fn(node, params, options);
  let running = false;
  let animation_name;
  let task;
  let uid = 0;
  function cleanup() {
    if (animation_name)
      delete_rule(node, animation_name);
  }
  __name(cleanup, "cleanup");
  function go() {
    const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
    if (css)
      animation_name = create_rule(node, 0, 1, duration, delay, easing, css, uid++);
    tick(0, 1);
    const start_time = now() + delay;
    const end_time = start_time + duration;
    if (task)
      task.abort();
    running = true;
    add_render_callback(() => dispatch(node, true, "start"));
    task = loop((now2) => {
      if (running) {
        if (now2 >= end_time) {
          tick(1, 0);
          dispatch(node, true, "end");
          cleanup();
          return running = false;
        }
        if (now2 >= start_time) {
          const t = easing((now2 - start_time) / duration);
          tick(t, 1 - t);
        }
      }
      return running;
    });
  }
  __name(go, "go");
  let started = false;
  return {
    start() {
      if (started)
        return;
      started = true;
      delete_rule(node);
      if (is_function(config)) {
        config = config(options);
        wait$1().then(go);
      } else {
        go();
      }
    },
    invalidate() {
      started = false;
    },
    end() {
      if (running) {
        cleanup();
        running = false;
      }
    }
  };
}
__name(create_in_transition, "create_in_transition");
function create_out_transition(node, fn, params) {
  const options = { direction: "out" };
  let config = fn(node, params, options);
  let running = true;
  let animation_name;
  const group = outros;
  group.r += 1;
  function go() {
    const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
    if (css)
      animation_name = create_rule(node, 1, 0, duration, delay, easing, css);
    const start_time = now() + delay;
    const end_time = start_time + duration;
    add_render_callback(() => dispatch(node, false, "start"));
    loop((now2) => {
      if (running) {
        if (now2 >= end_time) {
          tick(0, 1);
          dispatch(node, false, "end");
          if (!--group.r) {
            run_all(group.c);
          }
          return false;
        }
        if (now2 >= start_time) {
          const t = easing((now2 - start_time) / duration);
          tick(1 - t, t);
        }
      }
      return running;
    });
  }
  __name(go, "go");
  if (is_function(config)) {
    wait$1().then(() => {
      config = config(options);
      go();
    });
  } else {
    go();
  }
  return {
    end(reset) {
      if (reset && config.tick) {
        config.tick(1, 0);
      }
      if (running) {
        if (animation_name)
          delete_rule(node, animation_name);
        running = false;
      }
    }
  };
}
__name(create_out_transition, "create_out_transition");
const globals = typeof window !== "undefined" ? window : typeof globalThis !== "undefined" ? globalThis : global;
function destroy_block(block, lookup) {
  block.d(1);
  lookup.delete(block.key);
}
__name(destroy_block, "destroy_block");
function outro_and_destroy_block(block, lookup) {
  transition_out(block, 1, 1, () => {
    lookup.delete(block.key);
  });
}
__name(outro_and_destroy_block, "outro_and_destroy_block");
function update_keyed_each(old_blocks, dirty, get_key, dynamic, ctx, list, lookup, node, destroy, create_each_block2, next, get_context) {
  let o = old_blocks.length;
  let n = list.length;
  let i = o;
  const old_indexes = {};
  while (i--)
    old_indexes[old_blocks[i].key] = i;
  const new_blocks = [];
  const new_lookup = /* @__PURE__ */ new Map();
  const deltas = /* @__PURE__ */ new Map();
  i = n;
  while (i--) {
    const child_ctx = get_context(ctx, list, i);
    const key = get_key(child_ctx);
    let block = lookup.get(key);
    if (!block) {
      block = create_each_block2(key, child_ctx);
      block.c();
    } else if (dynamic) {
      block.p(child_ctx, dirty);
    }
    new_lookup.set(key, new_blocks[i] = block);
    if (key in old_indexes)
      deltas.set(key, Math.abs(i - old_indexes[key]));
  }
  const will_move = /* @__PURE__ */ new Set();
  const did_move = /* @__PURE__ */ new Set();
  function insert2(block) {
    transition_in(block, 1);
    block.m(node, next);
    lookup.set(block.key, block);
    next = block.first;
    n--;
  }
  __name(insert2, "insert");
  while (o && n) {
    const new_block = new_blocks[n - 1];
    const old_block = old_blocks[o - 1];
    const new_key = new_block.key;
    const old_key = old_block.key;
    if (new_block === old_block) {
      next = new_block.first;
      o--;
      n--;
    } else if (!new_lookup.has(old_key)) {
      destroy(old_block, lookup);
      o--;
    } else if (!lookup.has(new_key) || will_move.has(new_key)) {
      insert2(new_block);
    } else if (did_move.has(old_key)) {
      o--;
    } else if (deltas.get(new_key) > deltas.get(old_key)) {
      did_move.add(new_key);
      insert2(new_block);
    } else {
      will_move.add(old_key);
      o--;
    }
  }
  while (o--) {
    const old_block = old_blocks[o];
    if (!new_lookup.has(old_block.key))
      destroy(old_block, lookup);
  }
  while (n)
    insert2(new_blocks[n - 1]);
  return new_blocks;
}
__name(update_keyed_each, "update_keyed_each");
function get_spread_update(levels, updates) {
  const update2 = {};
  const to_null_out = {};
  const accounted_for = { $$scope: 1 };
  let i = levels.length;
  while (i--) {
    const o = levels[i];
    const n = updates[i];
    if (n) {
      for (const key in o) {
        if (!(key in n))
          to_null_out[key] = 1;
      }
      for (const key in n) {
        if (!accounted_for[key]) {
          update2[key] = n[key];
          accounted_for[key] = 1;
        }
      }
      levels[i] = n;
    } else {
      for (const key in o) {
        accounted_for[key] = 1;
      }
    }
  }
  for (const key in to_null_out) {
    if (!(key in update2))
      update2[key] = void 0;
  }
  return update2;
}
__name(get_spread_update, "get_spread_update");
function get_spread_object(spread_props) {
  return typeof spread_props === "object" && spread_props !== null ? spread_props : {};
}
__name(get_spread_object, "get_spread_object");
function bind(component, name, callback, value) {
  const index = component.$$.props[name];
  if (index !== void 0) {
    component.$$.bound[index] = callback;
    if (value === void 0) {
      callback(component.$$.ctx[index]);
    }
  }
}
__name(bind, "bind");
function create_component(block) {
  block && block.c();
}
__name(create_component, "create_component");
function mount_component(component, target, anchor, customElement) {
  const { fragment, after_update } = component.$$;
  fragment && fragment.m(target, anchor);
  if (!customElement) {
    add_render_callback(() => {
      const new_on_destroy = component.$$.on_mount.map(run).filter(is_function);
      if (component.$$.on_destroy) {
        component.$$.on_destroy.push(...new_on_destroy);
      } else {
        run_all(new_on_destroy);
      }
      component.$$.on_mount = [];
    });
  }
  after_update.forEach(add_render_callback);
}
__name(mount_component, "mount_component");
function destroy_component(component, detaching) {
  const $$ = component.$$;
  if ($$.fragment !== null) {
    run_all($$.on_destroy);
    $$.fragment && $$.fragment.d(detaching);
    $$.on_destroy = $$.fragment = null;
    $$.ctx = [];
  }
}
__name(destroy_component, "destroy_component");
function make_dirty(component, i) {
  if (component.$$.dirty[0] === -1) {
    dirty_components.push(component);
    schedule_update();
    component.$$.dirty.fill(0);
  }
  component.$$.dirty[i / 31 | 0] |= 1 << i % 31;
}
__name(make_dirty, "make_dirty");
function init(component, options, instance2, create_fragment2, not_equal, props, append_styles, dirty = [-1]) {
  const parent_component = current_component;
  set_current_component(component);
  const $$ = component.$$ = {
    fragment: null,
    ctx: [],
    props,
    update: noop,
    not_equal,
    bound: blank_object(),
    on_mount: [],
    on_destroy: [],
    on_disconnect: [],
    before_update: [],
    after_update: [],
    context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
    callbacks: blank_object(),
    dirty,
    skip_bound: false,
    root: options.target || parent_component.$$.root
  };
  append_styles && append_styles($$.root);
  let ready = false;
  $$.ctx = instance2 ? instance2(component, options.props || {}, (i, ret, ...rest) => {
    const value = rest.length ? rest[0] : ret;
    if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
      if (!$$.skip_bound && $$.bound[i])
        $$.bound[i](value);
      if (ready)
        make_dirty(component, i);
    }
    return ret;
  }) : [];
  $$.update();
  ready = true;
  run_all($$.before_update);
  $$.fragment = create_fragment2 ? create_fragment2($$.ctx) : false;
  if (options.target) {
    if (options.hydrate) {
      const nodes = children(options.target);
      $$.fragment && $$.fragment.l(nodes);
      nodes.forEach(detach);
    } else {
      $$.fragment && $$.fragment.c();
    }
    if (options.intro)
      transition_in(component.$$.fragment);
    mount_component(component, options.target, options.anchor, options.customElement);
    flush();
  }
  set_current_component(parent_component);
}
__name(init, "init");
class SvelteComponent {
  $destroy() {
    destroy_component(this, 1);
    this.$destroy = noop;
  }
  $on(type, callback) {
    if (!is_function(callback)) {
      return noop;
    }
    const callbacks = this.$$.callbacks[type] || (this.$$.callbacks[type] = []);
    callbacks.push(callback);
    return () => {
      const index = callbacks.indexOf(callback);
      if (index !== -1)
        callbacks.splice(index, 1);
    };
  }
  $set($$props) {
    if (this.$$set && !is_empty($$props)) {
      this.$$.skip_bound = true;
      this.$$set($$props);
      this.$$.skip_bound = false;
    }
  }
}
__name(SvelteComponent, "SvelteComponent");
const subscriber_queue = [];
function readable(value, start) {
  return {
    subscribe: writable(value, start).subscribe
  };
}
__name(readable, "readable");
function writable(value, start = noop) {
  let stop;
  const subscribers = /* @__PURE__ */ new Set();
  function set(new_value) {
    if (safe_not_equal(value, new_value)) {
      value = new_value;
      if (stop) {
        const run_queue = !subscriber_queue.length;
        for (const subscriber of subscribers) {
          subscriber[1]();
          subscriber_queue.push(subscriber, value);
        }
        if (run_queue) {
          for (let i = 0; i < subscriber_queue.length; i += 2) {
            subscriber_queue[i][0](subscriber_queue[i + 1]);
          }
          subscriber_queue.length = 0;
        }
      }
    }
  }
  __name(set, "set");
  function update2(fn) {
    set(fn(value));
  }
  __name(update2, "update");
  function subscribe2(run2, invalidate = noop) {
    const subscriber = [run2, invalidate];
    subscribers.add(subscriber);
    if (subscribers.size === 1) {
      stop = start(set) || noop;
    }
    run2(value);
    return () => {
      subscribers.delete(subscriber);
      if (subscribers.size === 0) {
        stop();
        stop = null;
      }
    };
  }
  __name(subscribe2, "subscribe");
  return { set, update: update2, subscribe: subscribe2 };
}
__name(writable, "writable");
function derived(stores, fn, initial_value) {
  const single = !Array.isArray(stores);
  const stores_array = single ? [stores] : stores;
  const auto = fn.length < 2;
  return readable(initial_value, (set) => {
    let inited = false;
    const values = [];
    let pending = 0;
    let cleanup = noop;
    const sync = /* @__PURE__ */ __name(() => {
      if (pending) {
        return;
      }
      cleanup();
      const result = fn(single ? values[0] : values, set);
      if (auto) {
        set(result);
      } else {
        cleanup = is_function(result) ? result : noop;
      }
    }, "sync");
    const unsubscribers = stores_array.map((store, i) => subscribe(store, (value) => {
      values[i] = value;
      pending &= ~(1 << i);
      if (inited) {
        sync();
      }
    }, () => {
      pending |= 1 << i;
    }));
    inited = true;
    sync();
    return /* @__PURE__ */ __name(function stop() {
      run_all(unsubscribers);
      cleanup();
    }, "stop");
  });
}
__name(derived, "derived");
const s_UUIDV4_REGEX = /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;
function uuidv4() {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) => (c ^ (globalThis.crypto || globalThis.msCrypto).getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16));
}
__name(uuidv4, "uuidv4");
uuidv4.isValid = (uuid) => s_UUIDV4_REGEX.test(uuid);
const s_REGEX = /(\d+)\s*px/;
function styleParsePixels(value) {
  if (typeof value !== "string") {
    return void 0;
  }
  const isPixels = s_REGEX.test(value);
  const number = parseInt(value);
  return isPixels && Number.isFinite(number) ? number : void 0;
}
__name(styleParsePixels, "styleParsePixels");
const applicationShellContract = ["elementRoot"];
Object.freeze(applicationShellContract);
function isApplicationShell(component) {
  if (component === null || component === void 0) {
    return false;
  }
  let compHasContract = true;
  let protoHasContract = true;
  for (const accessor of applicationShellContract) {
    const descriptor = Object.getOwnPropertyDescriptor(component, accessor);
    if (descriptor === void 0 || descriptor.get === void 0 || descriptor.set === void 0) {
      compHasContract = false;
    }
  }
  const prototype = Object.getPrototypeOf(component);
  for (const accessor of applicationShellContract) {
    const descriptor = Object.getOwnPropertyDescriptor(prototype, accessor);
    if (descriptor === void 0 || descriptor.get === void 0 || descriptor.set === void 0) {
      protoHasContract = false;
    }
  }
  return compHasContract || protoHasContract;
}
__name(isApplicationShell, "isApplicationShell");
function isHMRProxy(comp) {
  const instanceName = comp?.constructor?.name;
  if (typeof instanceName === "string" && (instanceName.startsWith("Proxy<") || instanceName === "ProxyComponent")) {
    return true;
  }
  const prototypeName = comp?.prototype?.constructor?.name;
  return typeof prototypeName === "string" && (prototypeName.startsWith("Proxy<") || prototypeName === "ProxyComponent");
}
__name(isHMRProxy, "isHMRProxy");
function isSvelteComponent(comp) {
  if (comp === null || comp === void 0 || typeof comp !== "function") {
    return false;
  }
  const prototypeName = comp?.prototype?.constructor?.name;
  if (typeof prototypeName === "string" && (prototypeName.startsWith("Proxy<") || prototypeName === "ProxyComponent")) {
    return true;
  }
  return typeof window !== void 0 ? typeof comp.prototype.$destroy === "function" && typeof comp.prototype.$on === "function" : typeof comp.render === "function";
}
__name(isSvelteComponent, "isSvelteComponent");
async function outroAndDestroy(instance2) {
  return new Promise((resolve) => {
    if (instance2.$$.fragment && instance2.$$.fragment.o) {
      group_outros();
      transition_out(instance2.$$.fragment, 0, 0, () => {
        instance2.$destroy();
        resolve();
      });
      check_outros();
    } else {
      instance2.$destroy();
      resolve();
    }
  });
}
__name(outroAndDestroy, "outroAndDestroy");
function parseSvelteConfig(config, thisArg = void 0) {
  if (typeof config !== "object") {
    throw new TypeError(`parseSvelteConfig - 'config' is not an object:
${JSON.stringify(config)}.`);
  }
  if (!isSvelteComponent(config.class)) {
    throw new TypeError(
      `parseSvelteConfig - 'class' is not a Svelte component constructor for config:
${JSON.stringify(config)}.`
    );
  }
  if (config.hydrate !== void 0 && typeof config.hydrate !== "boolean") {
    throw new TypeError(
      `parseSvelteConfig - 'hydrate' is not a boolean for config:
${JSON.stringify(config)}.`
    );
  }
  if (config.intro !== void 0 && typeof config.intro !== "boolean") {
    throw new TypeError(
      `parseSvelteConfig - 'intro' is not a boolean for config:
${JSON.stringify(config)}.`
    );
  }
  if (config.target !== void 0 && typeof config.target !== "string" && !(config.target instanceof HTMLElement) && !(config.target instanceof ShadowRoot) && !(config.target instanceof DocumentFragment)) {
    throw new TypeError(
      `parseSvelteConfig - 'target' is not a string, HTMLElement, ShadowRoot, or DocumentFragment for config:
${JSON.stringify(config)}.`
    );
  }
  if (config.anchor !== void 0 && typeof config.anchor !== "string" && !(config.anchor instanceof HTMLElement) && !(config.anchor instanceof ShadowRoot) && !(config.anchor instanceof DocumentFragment)) {
    throw new TypeError(
      `parseSvelteConfig - 'anchor' is not a string, HTMLElement, ShadowRoot, or DocumentFragment for config:
${JSON.stringify(config)}.`
    );
  }
  if (config.context !== void 0 && typeof config.context !== "function" && !(config.context instanceof Map) && typeof config.context !== "object") {
    throw new TypeError(
      `parseSvelteConfig - 'context' is not a Map, function or object for config:
${JSON.stringify(config)}.`
    );
  }
  if (config.selectorTarget !== void 0 && typeof config.selectorTarget !== "string") {
    throw new TypeError(
      `parseSvelteConfig - 'selectorTarget' is not a string for config:
${JSON.stringify(config)}.`
    );
  }
  if (config.options !== void 0 && typeof config.options !== "object") {
    throw new TypeError(
      `parseSvelteConfig - 'options' is not an object for config:
${JSON.stringify(config)}.`
    );
  }
  if (config.options !== void 0) {
    if (config.options.injectApp !== void 0 && typeof config.options.injectApp !== "boolean") {
      throw new TypeError(
        `parseSvelteConfig - 'options.injectApp' is not a boolean for config:
${JSON.stringify(config)}.`
      );
    }
    if (config.options.injectEventbus !== void 0 && typeof config.options.injectEventbus !== "boolean") {
      throw new TypeError(
        `parseSvelteConfig - 'options.injectEventbus' is not a boolean for config:
${JSON.stringify(config)}.`
      );
    }
    if (config.options.selectorElement !== void 0 && typeof config.options.selectorElement !== "string") {
      throw new TypeError(
        `parseSvelteConfig - 'selectorElement' is not a string for config:
${JSON.stringify(config)}.`
      );
    }
  }
  const svelteConfig = { ...config };
  delete svelteConfig.options;
  let externalContext = {};
  if (typeof svelteConfig.context === "function") {
    const contextFunc = svelteConfig.context;
    delete svelteConfig.context;
    const result = contextFunc.call(thisArg);
    if (typeof result === "object") {
      externalContext = { ...result };
    } else {
      throw new Error(`parseSvelteConfig - 'context' is a function that did not return an object for config:
${JSON.stringify(config)}`);
    }
  } else if (svelteConfig.context instanceof Map) {
    externalContext = Object.fromEntries(svelteConfig.context);
    delete svelteConfig.context;
  } else if (typeof svelteConfig.context === "object") {
    externalContext = svelteConfig.context;
    delete svelteConfig.context;
  }
  svelteConfig.props = s_PROCESS_PROPS(svelteConfig.props, thisArg, config);
  if (Array.isArray(svelteConfig.children)) {
    const children2 = [];
    for (let cntr = 0; cntr < svelteConfig.children.length; cntr++) {
      const child = svelteConfig.children[cntr];
      if (!isSvelteComponent(child.class)) {
        throw new Error(`parseSvelteConfig - 'class' is not a Svelte component for child[${cntr}] for config:
${JSON.stringify(config)}`);
      }
      child.props = s_PROCESS_PROPS(child.props, thisArg, config);
      children2.push(child);
    }
    if (children2.length > 0) {
      externalContext.children = children2;
    }
    delete svelteConfig.children;
  } else if (typeof svelteConfig.children === "object") {
    if (!isSvelteComponent(svelteConfig.children.class)) {
      throw new Error(`parseSvelteConfig - 'class' is not a Svelte component for children object for config:
${JSON.stringify(config)}`);
    }
    svelteConfig.children.props = s_PROCESS_PROPS(svelteConfig.children.props, thisArg, config);
    externalContext.children = [svelteConfig.children];
    delete svelteConfig.children;
  }
  if (!(svelteConfig.context instanceof Map)) {
    svelteConfig.context = /* @__PURE__ */ new Map();
  }
  svelteConfig.context.set("external", externalContext);
  return svelteConfig;
}
__name(parseSvelteConfig, "parseSvelteConfig");
function s_PROCESS_PROPS(props, thisArg, config) {
  if (typeof props === "function") {
    const result = props.call(thisArg);
    if (typeof result === "object") {
      return result;
    } else {
      throw new Error(`parseSvelteConfig - 'props' is a function that did not return an object for config:
${JSON.stringify(config)}`);
    }
  } else if (typeof props === "object") {
    return props;
  } else if (props !== void 0) {
    throw new Error(
      `parseSvelteConfig - 'props' is not a function or an object for config:
${JSON.stringify(config)}`
    );
  }
  return {};
}
__name(s_PROCESS_PROPS, "s_PROCESS_PROPS");
function hasGetter(object, accessor) {
  if (object === null || object === void 0) {
    return false;
  }
  const iDescriptor = Object.getOwnPropertyDescriptor(object, accessor);
  if (iDescriptor !== void 0 && iDescriptor.get !== void 0) {
    return true;
  }
  for (let o = Object.getPrototypeOf(object); o; o = Object.getPrototypeOf(o)) {
    const descriptor = Object.getOwnPropertyDescriptor(o, accessor);
    if (descriptor !== void 0 && descriptor.get !== void 0) {
      return true;
    }
  }
  return false;
}
__name(hasGetter, "hasGetter");
function hasPrototype(target, Prototype) {
  if (typeof target !== "function") {
    return false;
  }
  if (target === Prototype) {
    return true;
  }
  for (let proto = Object.getPrototypeOf(target); proto; proto = Object.getPrototypeOf(proto)) {
    if (proto === Prototype) {
      return true;
    }
  }
  return false;
}
__name(hasPrototype, "hasPrototype");
const s_TAG_OBJECT = "[object Object]";
function deepMerge(target = {}, ...sourceObj) {
  if (Object.prototype.toString.call(target) !== s_TAG_OBJECT) {
    throw new TypeError(`deepMerge error: 'target' is not an 'object'.`);
  }
  for (let cntr = 0; cntr < sourceObj.length; cntr++) {
    if (Object.prototype.toString.call(sourceObj[cntr]) !== s_TAG_OBJECT) {
      throw new TypeError(`deepMerge error: 'sourceObj[${cntr}]' is not an 'object'.`);
    }
  }
  return _deepMerge(target, ...sourceObj);
}
__name(deepMerge, "deepMerge");
function isIterable(value) {
  if (value === null || value === void 0 || typeof value !== "object") {
    return false;
  }
  return typeof value[Symbol.iterator] === "function";
}
__name(isIterable, "isIterable");
function isObject(value) {
  return value !== null && typeof value === "object";
}
__name(isObject, "isObject");
function isPlainObject(value) {
  if (Object.prototype.toString.call(value) !== s_TAG_OBJECT) {
    return false;
  }
  const prototype = Object.getPrototypeOf(value);
  return prototype === null || prototype === Object.prototype;
}
__name(isPlainObject, "isPlainObject");
function safeAccess(data, accessor, defaultValue = void 0) {
  if (typeof data !== "object") {
    return defaultValue;
  }
  if (typeof accessor !== "string") {
    return defaultValue;
  }
  const access = accessor.split(".");
  for (let cntr = 0; cntr < access.length; cntr++) {
    if (typeof data[access[cntr]] === "undefined" || data[access[cntr]] === null) {
      return defaultValue;
    }
    data = data[access[cntr]];
  }
  return data;
}
__name(safeAccess, "safeAccess");
function safeSet(data, accessor, value, operation = "set", createMissing = true) {
  if (typeof data !== "object") {
    throw new TypeError(`safeSet Error: 'data' is not an 'object'.`);
  }
  if (typeof accessor !== "string") {
    throw new TypeError(`safeSet Error: 'accessor' is not a 'string'.`);
  }
  const access = accessor.split(".");
  for (let cntr = 0; cntr < access.length; cntr++) {
    if (Array.isArray(data)) {
      const number = +access[cntr];
      if (!Number.isInteger(number) || number < 0) {
        return false;
      }
    }
    if (cntr === access.length - 1) {
      switch (operation) {
        case "add":
          data[access[cntr]] += value;
          break;
        case "div":
          data[access[cntr]] /= value;
          break;
        case "mult":
          data[access[cntr]] *= value;
          break;
        case "set":
          data[access[cntr]] = value;
          break;
        case "set-undefined":
          if (typeof data[access[cntr]] === "undefined") {
            data[access[cntr]] = value;
          }
          break;
        case "sub":
          data[access[cntr]] -= value;
          break;
      }
    } else {
      if (createMissing && typeof data[access[cntr]] === "undefined") {
        data[access[cntr]] = {};
      }
      if (data[access[cntr]] === null || typeof data[access[cntr]] !== "object") {
        return false;
      }
      data = data[access[cntr]];
    }
  }
  return true;
}
__name(safeSet, "safeSet");
function _deepMerge(target = {}, ...sourceObj) {
  for (let cntr = 0; cntr < sourceObj.length; cntr++) {
    const obj = sourceObj[cntr];
    for (const prop in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, prop)) {
        if (prop.startsWith("-=")) {
          delete target[prop.slice(2)];
          continue;
        }
        target[prop] = Object.prototype.hasOwnProperty.call(target, prop) && target[prop]?.constructor === Object && obj[prop]?.constructor === Object ? _deepMerge({}, target[prop], obj[prop]) : obj[prop];
      }
    }
  }
  return target;
}
__name(_deepMerge, "_deepMerge");
function getUUIDFromDataTransfer(data, { actor = true, compendium = true, world = true, types = void 0 } = {}) {
  if (typeof data !== "object") {
    return void 0;
  }
  if (Array.isArray(types) && !types.includes(data.type)) {
    return void 0;
  }
  let uuid = void 0;
  if (typeof data.uuid === "string") {
    const isCompendium = data.uuid.startsWith("Compendium");
    if (isCompendium && compendium) {
      uuid = data.uuid;
    } else if (world) {
      uuid = data.uuid;
    }
  } else {
    if (actor && world && data.actorId && data.type) {
      uuid = `Actor.${data.actorId}.${data.type}.${data.data._id}`;
    } else if (typeof data.id === "string") {
      if (compendium && typeof data.pack === "string") {
        uuid = `Compendium.${data.pack}.${data.id}`;
      } else if (world) {
        uuid = `${data.type}.${data.id}`;
      }
    }
  }
  return uuid;
}
__name(getUUIDFromDataTransfer, "getUUIDFromDataTransfer");
class DynReducerUtils {
  static arrayEquals(a, b) {
    if (a === b) {
      return true;
    }
    if (a === null || b === null) {
      return false;
    }
    if (a.length !== b.length) {
      return false;
    }
    for (let cntr = a.length; --cntr >= 0; ) {
      if (a[cntr] !== b[cntr]) {
        return false;
      }
    }
    return true;
  }
  static hashString(str, seed = 0) {
    let h1 = 3735928559 ^ seed, h2 = 1103547991 ^ seed;
    for (let ch, i = 0; i < str.length; i++) {
      ch = str.charCodeAt(i);
      h1 = Math.imul(h1 ^ ch, 2654435761);
      h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    h1 = Math.imul(h1 ^ h1 >>> 16, 2246822507) ^ Math.imul(h2 ^ h2 >>> 13, 3266489909);
    h2 = Math.imul(h2 ^ h2 >>> 16, 2246822507) ^ Math.imul(h1 ^ h1 >>> 13, 3266489909);
    return 4294967296 * (2097151 & h2) + (h1 >>> 0);
  }
  static hashUnknown(value) {
    if (value === null || value === void 0) {
      return 0;
    }
    let result = 0;
    switch (typeof value) {
      case "boolean":
        result = value ? 1 : 0;
        break;
      case "bigint":
        result = Number(BigInt.asIntN(64, value));
        break;
      case "function":
        result = this.hashString(value.name);
        break;
      case "number":
        result = Number.isFinite(value) ? value : 0;
        break;
      case "object":
        break;
      case "string":
        result = this.hashString(value);
        break;
      case "symbol":
        result = this.hashString(Symbol.keyFor(value));
        break;
    }
    return result;
  }
  static hasPrototype(target, Prototype) {
    if (typeof target !== "function") {
      return false;
    }
    if (target === Prototype) {
      return true;
    }
    for (let proto = Object.getPrototypeOf(target); proto; proto = Object.getPrototypeOf(proto)) {
      if (proto === Prototype) {
        return true;
      }
    }
    return false;
  }
  static isIterable(data) {
    return data !== null && data !== void 0 && typeof data === "object" && typeof data[Symbol.iterator] === "function";
  }
}
__name(DynReducerUtils, "DynReducerUtils");
class AdapterDerived {
  #hostData;
  #DerivedReducerCtor;
  #parentIndex;
  #derived = /* @__PURE__ */ new Map();
  #destroyed = false;
  constructor(hostData, parentIndex, DerivedReducerCtor) {
    this.#hostData = hostData;
    this.#parentIndex = parentIndex;
    this.#DerivedReducerCtor = DerivedReducerCtor;
    Object.freeze(this);
  }
  create(options) {
    if (this.#destroyed) {
      throw Error(`AdapterDerived.create error: this instance has been destroyed.`);
    }
    let name;
    let rest = {};
    let ctor;
    const DerivedReducerCtor = this.#DerivedReducerCtor;
    if (typeof options === "string") {
      name = options;
      ctor = DerivedReducerCtor;
    } else if (typeof options === "function" && DynReducerUtils.hasPrototype(options, DerivedReducerCtor)) {
      ctor = options;
    } else if (typeof options === "object" && options !== null) {
      ({ name, ctor = DerivedReducerCtor, ...rest } = options);
    } else {
      throw new TypeError(`AdapterDerived.create error: 'options' does not conform to allowed parameters.`);
    }
    if (!DynReducerUtils.hasPrototype(ctor, DerivedReducerCtor)) {
      throw new TypeError(`AdapterDerived.create error: 'ctor' is not a '${DerivedReducerCtor?.name}'.`);
    }
    name = name ?? ctor?.name;
    if (typeof name !== "string") {
      throw new TypeError(`AdapterDerived.create error: 'name' is not a string.`);
    }
    const derivedReducer = new ctor(this.#hostData, this.#parentIndex, rest);
    this.#derived.set(name, derivedReducer);
    return derivedReducer;
  }
  clear() {
    if (this.#destroyed) {
      return;
    }
    for (const reducer of this.#derived.values()) {
      reducer.destroy();
    }
    this.#derived.clear();
  }
  delete(name) {
    if (this.#destroyed) {
      throw Error(`AdapterDerived.delete error: this instance has been destroyed.`);
    }
    const reducer = this.#derived.get(name);
    if (reducer) {
      reducer.destroy();
    }
    return this.#derived.delete(name);
  }
  destroy() {
    if (this.#destroyed) {
      return;
    }
    this.clear();
    this.#hostData = [null];
    this.#parentIndex = null;
    this.#destroyed = true;
  }
  get(name) {
    if (this.#destroyed) {
      throw Error(`AdapterDerived.get error: this instance has been destroyed.`);
    }
    return this.#derived.get(name);
  }
  update(force = false) {
    if (this.#destroyed) {
      return;
    }
    for (const reducer of this.#derived.values()) {
      reducer.index.update(force);
    }
  }
}
__name(AdapterDerived, "AdapterDerived");
class AdapterFilters {
  #filtersData;
  #indexUpdate;
  #mapUnsubscribe = /* @__PURE__ */ new Map();
  constructor(indexUpdate, filtersAdapter) {
    this.#indexUpdate = indexUpdate;
    this.#filtersData = filtersAdapter;
    Object.freeze(this);
  }
  get length() {
    return this.#filtersData.filters.length;
  }
  *[Symbol.iterator]() {
    if (this.#filtersData.filters.length === 0) {
      return;
    }
    for (const entry of this.#filtersData.filters) {
      yield { ...entry };
    }
  }
  add(...filters) {
    let subscribeCount = 0;
    for (const filter of filters) {
      const filterType = typeof filter;
      if (filterType !== "function" && (filterType !== "object" || filter === null)) {
        throw new TypeError(`AdapterFilters error: 'filter' is not a function or object.`);
      }
      let data = void 0;
      let subscribeFn = void 0;
      if (filterType === "function") {
        data = {
          id: void 0,
          filter,
          weight: 1
        };
        subscribeFn = filter.subscribe;
      } else if (filterType === "object") {
        if ("filter" in filter) {
          if (typeof filter.filter !== "function") {
            throw new TypeError(`AdapterFilters error: 'filter' attribute is not a function.`);
          }
          if (filter.weight !== void 0 && typeof filter.weight !== "number" || (filter.weight < 0 || filter.weight > 1)) {
            throw new TypeError(`AdapterFilters error: 'weight' attribute is not a number between '0 - 1' inclusive.`);
          }
          data = {
            id: filter.id !== void 0 ? filter.id : void 0,
            filter: filter.filter,
            weight: filter.weight || 1
          };
          subscribeFn = filter.filter.subscribe ?? filter.subscribe;
        } else {
          throw new TypeError(`AdapterFilters error: 'filter' attribute is not a function.`);
        }
      }
      const index = this.#filtersData.filters.findIndex((value) => {
        return data.weight < value.weight;
      });
      if (index >= 0) {
        this.#filtersData.filters.splice(index, 0, data);
      } else {
        this.#filtersData.filters.push(data);
      }
      if (typeof subscribeFn === "function") {
        const unsubscribe = subscribeFn(this.#indexUpdate);
        if (typeof unsubscribe !== "function") {
          throw new TypeError("AdapterFilters error: Filter has subscribe function, but no unsubscribe function is returned.");
        }
        if (this.#mapUnsubscribe.has(data.filter)) {
          throw new Error("AdapterFilters error: Filter added already has an unsubscribe function registered.");
        }
        this.#mapUnsubscribe.set(data.filter, unsubscribe);
        subscribeCount++;
      }
    }
    if (subscribeCount < filters.length) {
      this.#indexUpdate();
    }
  }
  clear() {
    this.#filtersData.filters.length = 0;
    for (const unsubscribe of this.#mapUnsubscribe.values()) {
      unsubscribe();
    }
    this.#mapUnsubscribe.clear();
    this.#indexUpdate();
  }
  remove(...filters) {
    const length = this.#filtersData.filters.length;
    if (length === 0) {
      return;
    }
    for (const data of filters) {
      const actualFilter = typeof data === "function" ? data : data !== null && typeof data === "object" ? data.filter : void 0;
      if (!actualFilter) {
        continue;
      }
      for (let cntr = this.#filtersData.filters.length; --cntr >= 0; ) {
        if (this.#filtersData.filters[cntr].filter === actualFilter) {
          this.#filtersData.filters.splice(cntr, 1);
          let unsubscribe = void 0;
          if (typeof (unsubscribe = this.#mapUnsubscribe.get(actualFilter)) === "function") {
            unsubscribe();
            this.#mapUnsubscribe.delete(actualFilter);
          }
        }
      }
    }
    if (length !== this.#filtersData.filters.length) {
      this.#indexUpdate();
    }
  }
  removeBy(callback) {
    const length = this.#filtersData.filters.length;
    if (length === 0) {
      return;
    }
    if (typeof callback !== "function") {
      throw new TypeError(`AdapterFilters error: 'callback' is not a function.`);
    }
    this.#filtersData.filters = this.#filtersData.filters.filter((data) => {
      const remove = callback.call(callback, { ...data });
      if (remove) {
        let unsubscribe;
        if (typeof (unsubscribe = this.#mapUnsubscribe.get(data.filter)) === "function") {
          unsubscribe();
          this.#mapUnsubscribe.delete(data.filter);
        }
      }
      return !remove;
    });
    if (length !== this.#filtersData.filters.length) {
      this.#indexUpdate();
    }
  }
  removeById(...ids) {
    const length = this.#filtersData.filters.length;
    if (length === 0) {
      return;
    }
    this.#filtersData.filters = this.#filtersData.filters.filter((data) => {
      let remove = 0;
      for (const id of ids) {
        remove |= data.id === id ? 1 : 0;
      }
      if (!!remove) {
        let unsubscribe;
        if (typeof (unsubscribe = this.#mapUnsubscribe.get(data.filter)) === "function") {
          unsubscribe();
          this.#mapUnsubscribe.delete(data.filter);
        }
      }
      return !remove;
    });
    if (length !== this.#filtersData.filters.length) {
      this.#indexUpdate();
    }
  }
}
__name(AdapterFilters, "AdapterFilters");
class AdapterIndexer {
  derivedAdapter;
  filtersData;
  hostData;
  hostUpdate;
  indexData;
  sortData;
  sortFn;
  destroyed = false;
  constructor(hostData, hostUpdate, parentIndexer) {
    this.hostData = hostData;
    this.hostUpdate = hostUpdate;
    this.indexData = { index: null, hash: null, reversed: false, parent: parentIndexer };
  }
  get active() {
    return this.filtersData.filters.length > 0 || this.sortData.compareFn !== null || this.indexData.parent?.active === true;
  }
  get length() {
    return this.indexData.index ? this.indexData.index.length : 0;
  }
  get reversed() {
    return this.indexData.reversed;
  }
  set reversed(reversed) {
    this.indexData.reversed = reversed;
  }
  calcHashUpdate(oldIndex, oldHash, force = false) {
    const actualForce = typeof force === "boolean" ? force : false;
    let newHash = null;
    const newIndex = this.indexData.index;
    if (newIndex) {
      for (let cntr = newIndex.length; --cntr >= 0; ) {
        newHash ^= DynReducerUtils.hashUnknown(newIndex[cntr]) + 2654435769 + (newHash << 6) + (newHash >> 2);
      }
    }
    this.indexData.hash = newHash;
    if (actualForce || (oldHash === newHash ? !DynReducerUtils.arrayEquals(oldIndex, newIndex) : true)) {
      this.hostUpdate();
    }
  }
  destroy() {
    if (this.destroyed) {
      return;
    }
    this.indexData.index = null;
    this.indexData.hash = null;
    this.indexData.reversed = null;
    this.indexData.parent = null;
    this.destroyed = true;
  }
  initAdapters(filtersData, sortData, derivedAdapter) {
    this.filtersData = filtersData;
    this.sortData = sortData;
    this.derivedAdapter = derivedAdapter;
    this.sortFn = this.createSortFn();
  }
}
__name(AdapterIndexer, "AdapterIndexer");
class AdapterSort {
  #sortData;
  #indexUpdate;
  #unsubscribe;
  constructor(indexUpdate, sortData) {
    this.#indexUpdate = indexUpdate;
    this.#sortData = sortData;
    Object.freeze(this);
  }
  clear() {
    const oldCompareFn = this.#sortData.compareFn;
    this.#sortData.compareFn = null;
    if (typeof this.#unsubscribe === "function") {
      this.#unsubscribe();
      this.#unsubscribe = void 0;
    }
    if (typeof oldCompareFn === "function") {
      this.#indexUpdate();
    }
  }
  set(data) {
    if (typeof this.#unsubscribe === "function") {
      this.#unsubscribe();
      this.#unsubscribe = void 0;
    }
    let compareFn = void 0;
    let subscribeFn = void 0;
    switch (typeof data) {
      case "function":
        compareFn = data;
        subscribeFn = data.subscribe;
        break;
      case "object":
        if (data === null) {
          break;
        }
        if (typeof data.compare !== "function") {
          throw new TypeError(`AdapterSort error: 'compare' attribute is not a function.`);
        }
        compareFn = data.compare;
        subscribeFn = data.compare.subscribe ?? data.subscribe;
        break;
    }
    if (typeof compareFn === "function") {
      this.#sortData.compareFn = compareFn;
    } else {
      const oldCompareFn = this.#sortData.compareFn;
      this.#sortData.compareFn = null;
      if (typeof oldCompareFn === "function") {
        this.#indexUpdate();
      }
      return;
    }
    if (typeof subscribeFn === "function") {
      this.#unsubscribe = subscribeFn(this.#indexUpdate);
      if (typeof this.#unsubscribe !== "function") {
        throw new Error(`AdapterSort error: sort has 'subscribe' function, but no 'unsubscribe' function is returned.`);
      }
    } else {
      this.#indexUpdate();
    }
  }
}
__name(AdapterSort, "AdapterSort");
class IndexerAPI {
  #indexData;
  active;
  length;
  update;
  constructor(adapterIndexer) {
    this.#indexData = adapterIndexer.indexData;
    this.update = adapterIndexer.update.bind(adapterIndexer);
    Object.defineProperties(this, {
      active: { get: () => adapterIndexer.active },
      length: { get: () => adapterIndexer.length }
    });
    Object.freeze(this);
  }
  get hash() {
    return this.#indexData.hash;
  }
  *[Symbol.iterator]() {
    const indexData = this.#indexData;
    if (!indexData.index) {
      return;
    }
    const reversed = indexData.reversed;
    const length = indexData.index.length;
    if (reversed) {
      for (let cntr = length; --cntr >= 0; ) {
        yield indexData.index[cntr];
      }
    } else {
      for (let cntr = 0; cntr < length; cntr++) {
        yield indexData.index[cntr];
      }
    }
  }
}
__name(IndexerAPI, "IndexerAPI");
class DerivedAPI {
  clear;
  create;
  delete;
  destroy;
  get;
  constructor(adapterDerived) {
    this.clear = adapterDerived.clear.bind(adapterDerived);
    this.create = adapterDerived.create.bind(adapterDerived);
    this.delete = adapterDerived.delete.bind(adapterDerived);
    this.destroy = adapterDerived.destroy.bind(adapterDerived);
    this.get = adapterDerived.get.bind(adapterDerived);
    Object.freeze(this);
  }
}
__name(DerivedAPI, "DerivedAPI");
class Indexer extends AdapterIndexer {
  createSortFn() {
    return (a, b) => this.sortData.compareFn(this.hostData[0].get(a), this.hostData[0].get(b));
  }
  reduceImpl() {
    const data = [];
    const map = this.hostData[0];
    if (!map) {
      return data;
    }
    const filters = this.filtersData.filters;
    let include = true;
    const parentIndex = this.indexData.parent;
    if (DynReducerUtils.isIterable(parentIndex) && parentIndex.active) {
      for (const key of parentIndex) {
        const value = map.get(key);
        include = true;
        for (let filCntr = 0, filLength = filters.length; filCntr < filLength; filCntr++) {
          if (!filters[filCntr].filter(value)) {
            include = false;
            break;
          }
        }
        if (include) {
          data.push(key);
        }
      }
    } else {
      for (const key of map.keys()) {
        include = true;
        const value = map.get(key);
        for (let filCntr = 0, filLength = filters.length; filCntr < filLength; filCntr++) {
          if (!filters[filCntr].filter(value)) {
            include = false;
            break;
          }
        }
        if (include) {
          data.push(key);
        }
      }
    }
    return data;
  }
  update(force = false) {
    if (this.destroyed) {
      return;
    }
    const oldIndex = this.indexData.index;
    const oldHash = this.indexData.hash;
    const map = this.hostData[0];
    const parentIndex = this.indexData.parent;
    if (this.filtersData.filters.length === 0 && !this.sortData.compareFn || this.indexData.index && map?.size !== this.indexData.index.length) {
      this.indexData.index = null;
    }
    if (this.filtersData.filters.length > 0) {
      this.indexData.index = this.reduceImpl();
    }
    if (!this.indexData.index && parentIndex?.active) {
      this.indexData.index = [...parentIndex];
    }
    if (this.sortData.compareFn && map instanceof Map) {
      if (!this.indexData.index) {
        this.indexData.index = this.indexData.index = [...map.keys()];
      }
      this.indexData.index.sort(this.sortFn);
    }
    this.calcHashUpdate(oldIndex, oldHash, force);
    this.derivedAdapter?.update(force);
  }
}
__name(Indexer, "Indexer");
class DerivedMapReducer {
  #map;
  #derived;
  #derivedPublicAPI;
  #filters;
  #filtersData = { filters: [] };
  #index;
  #indexPublicAPI;
  #reversed = false;
  #sort;
  #sortData = { compareFn: null };
  #subscriptions = [];
  #destroyed = false;
  constructor(map, parentIndex, options) {
    this.#map = map;
    this.#index = new Indexer(this.#map, this.#updateSubscribers.bind(this), parentIndex);
    this.#indexPublicAPI = new IndexerAPI(this.#index);
    this.#filters = new AdapterFilters(this.#indexPublicAPI.update, this.#filtersData);
    this.#sort = new AdapterSort(this.#indexPublicAPI.update, this.#sortData);
    this.#derived = new AdapterDerived(this.#map, this.#indexPublicAPI, DerivedMapReducer);
    this.#derivedPublicAPI = new DerivedAPI(this.#derived);
    this.#index.initAdapters(this.#filtersData, this.#sortData, this.#derived);
    let filters = void 0;
    let sort = void 0;
    if (options !== void 0 && ("filters" in options || "sort" in options)) {
      if (options.filters !== void 0) {
        if (DynReducerUtils.isIterable(options.filters)) {
          filters = options.filters;
        } else {
          throw new TypeError(`DerivedMapReducer error (DataDerivedOptions): 'filters' attribute is not iterable.`);
        }
      }
      if (options.sort !== void 0) {
        if (typeof options.sort === "function") {
          sort = options.sort;
        } else if (typeof options.sort === "object" && options.sort !== null) {
          sort = options.sort;
        } else {
          throw new TypeError(`DerivedMapReducer error (DataDerivedOptions): 'sort' attribute is not a function or object.`);
        }
      }
    }
    if (filters) {
      this.filters.add(...filters);
    }
    if (sort) {
      this.sort.set(sort);
    }
    this.initialize();
  }
  get data() {
    return this.#map[0];
  }
  get derived() {
    return this.#derivedPublicAPI;
  }
  get filters() {
    return this.#filters;
  }
  get index() {
    return this.#indexPublicAPI;
  }
  get destroyed() {
    return this.#destroyed;
  }
  get length() {
    const map = this.#map[0];
    return this.#index.active ? this.index.length : map ? map.size : 0;
  }
  get reversed() {
    return this.#reversed;
  }
  get sort() {
    return this.#sort;
  }
  set reversed(reversed) {
    if (typeof reversed !== "boolean") {
      throw new TypeError(`DerivedMapReducer.reversed error: 'reversed' is not a boolean.`);
    }
    this.#reversed = reversed;
    this.#index.reversed = reversed;
    this.index.update(true);
  }
  destroy() {
    this.#destroyed = true;
    this.#map = [null];
    this.#index.update(true);
    this.#subscriptions.length = 0;
    this.#derived.destroy();
    this.#index.destroy();
    this.#filters.clear();
    this.#sort.clear();
  }
  initialize() {
  }
  *[Symbol.iterator]() {
    const map = this.#map[0];
    if (this.#destroyed || map === null || map?.size === 0) {
      return;
    }
    if (this.#index.active) {
      for (const key of this.index) {
        yield map.get(key);
      }
    } else {
      if (this.reversed) {
        const values = [...map.values()];
        for (let cntr = values.length; --cntr >= 0; ) {
          yield values[cntr];
        }
      } else {
        for (const value of map.values()) {
          yield value;
        }
      }
    }
  }
  subscribe(handler) {
    this.#subscriptions.push(handler);
    handler(this);
    return () => {
      const index = this.#subscriptions.findIndex((sub) => sub === handler);
      if (index >= 0) {
        this.#subscriptions.splice(index, 1);
      }
    };
  }
  #updateSubscribers() {
    for (let cntr = 0; cntr < this.#subscriptions.length; cntr++) {
      this.#subscriptions[cntr](this);
    }
  }
}
__name(DerivedMapReducer, "DerivedMapReducer");
class DynMapReducer {
  #map = [null];
  #derived;
  #derivedPublicAPI;
  #filters;
  #filtersData = { filters: [] };
  #index;
  #indexPublicAPI;
  #reversed = false;
  #sort;
  #sortData = { compareFn: null };
  #subscriptions = [];
  #destroyed = false;
  constructor(data) {
    let dataMap = void 0;
    let filters = void 0;
    let sort = void 0;
    if (data === null) {
      throw new TypeError(`DynMapReducer error: 'data' is not an object or Map.`);
    }
    if (data !== void 0 && typeof data !== "object" && !(data instanceof Map)) {
      throw new TypeError(`DynMapReducer error: 'data' is not an object or Map.`);
    }
    if (data !== void 0 && data instanceof Map) {
      dataMap = data;
    } else if (data !== void 0 && ("data" in data || "filters" in data || "sort" in data)) {
      if (data.data !== void 0 && !(data.data instanceof Map)) {
        throw new TypeError(`DynMapReducer error (DataDynMap): 'data' attribute is not a Map.`);
      }
      dataMap = data.data;
      if (data.filters !== void 0) {
        if (DynReducerUtils.isIterable(data.filters)) {
          filters = data.filters;
        } else {
          throw new TypeError(`DynMapReducer error (DataDynMap): 'filters' attribute is not iterable.`);
        }
      }
      if (data.sort !== void 0) {
        if (typeof data.sort === "function") {
          sort = data.sort;
        } else if (typeof data.sort === "object" && data.sort !== null) {
          sort = data.sort;
        } else {
          throw new TypeError(`DynMapReducer error (DataDynMap): 'sort' attribute is not a function or object.`);
        }
      }
    }
    if (dataMap) {
      this.#map[0] = dataMap;
    }
    this.#index = new Indexer(this.#map, this.#updateSubscribers.bind(this));
    this.#indexPublicAPI = new IndexerAPI(this.#index);
    this.#filters = new AdapterFilters(this.#indexPublicAPI.update, this.#filtersData);
    this.#sort = new AdapterSort(this.#indexPublicAPI.update, this.#sortData);
    this.#derived = new AdapterDerived(this.#map, this.#indexPublicAPI, DerivedMapReducer);
    this.#derivedPublicAPI = new DerivedAPI(this.#derived);
    this.#index.initAdapters(this.#filtersData, this.#sortData, this.#derived);
    if (filters) {
      this.filters.add(...filters);
    }
    if (sort) {
      this.sort.set(sort);
    }
    this.initialize();
  }
  get data() {
    return this.#map[0];
  }
  get derived() {
    return this.#derivedPublicAPI;
  }
  get filters() {
    return this.#filters;
  }
  get index() {
    return this.#indexPublicAPI;
  }
  get destroyed() {
    return this.#destroyed;
  }
  get length() {
    const map = this.#map[0];
    return this.#index.active ? this.#indexPublicAPI.length : map ? map.size : 0;
  }
  get reversed() {
    return this.#reversed;
  }
  get sort() {
    return this.#sort;
  }
  set reversed(reversed) {
    if (typeof reversed !== "boolean") {
      throw new TypeError(`DynMapReducer.reversed error: 'reversed' is not a boolean.`);
    }
    this.#reversed = reversed;
    this.#index.reversed = reversed;
    this.index.update(true);
  }
  destroy() {
    if (this.#destroyed) {
      return;
    }
    this.#destroyed = true;
    this.#derived.destroy();
    this.#map = [null];
    this.index.update(true);
    this.#subscriptions.length = 0;
    this.#index.destroy();
    this.#filters.clear();
    this.#sort.clear();
  }
  initialize() {
  }
  setData(data, replace = false) {
    if (data !== null && !(data instanceof Map)) {
      throw new TypeError(`DynMapReducer.setData error: 'data' is not iterable.`);
    }
    if (typeof replace !== "boolean") {
      throw new TypeError(`DynMapReducer.setData error: 'replace' is not a boolean.`);
    }
    const map = this.#map[0];
    if (!(map instanceof Map) || replace) {
      this.#map[0] = data instanceof Map ? data : null;
    } else if (data instanceof Map && map instanceof Map) {
      const removeKeySet = new Set(map.keys());
      for (const key of data.keys()) {
        map.set(key, data.get(key));
        if (removeKeySet.has(key)) {
          removeKeySet.delete(key);
        }
      }
      for (const key of removeKeySet) {
        map.delete(key);
      }
    } else if (data === null) {
      this.#map[0] = null;
    }
    this.index.update(true);
  }
  subscribe(handler) {
    this.#subscriptions.push(handler);
    handler(this);
    return () => {
      const index = this.#subscriptions.findIndex((sub) => sub === handler);
      if (index >= 0) {
        this.#subscriptions.splice(index, 1);
      }
    };
  }
  #updateSubscribers() {
    for (let cntr = 0; cntr < this.#subscriptions.length; cntr++) {
      this.#subscriptions[cntr](this);
    }
  }
  *[Symbol.iterator]() {
    const map = this.#map[0];
    if (this.#destroyed || map === null || map?.size === 0) {
      return;
    }
    if (this.#index.active) {
      for (const key of this.index) {
        yield map.get(key);
      }
    } else {
      if (this.reversed) {
        const values = [...map.values()];
        for (let cntr = values.length; --cntr >= 0; ) {
          yield values[cntr];
        }
      } else {
        for (const value of map.values()) {
          yield value;
        }
      }
    }
  }
}
__name(DynMapReducer, "DynMapReducer");
function isUpdatableStore(store) {
  if (store === null || store === void 0) {
    return false;
  }
  switch (typeof store) {
    case "function":
    case "object":
      return typeof store.subscribe === "function" && typeof store.update === "function";
  }
  return false;
}
__name(isUpdatableStore, "isUpdatableStore");
function subscribeIgnoreFirst(store, update2) {
  let firedFirst = false;
  return store.subscribe((value) => {
    if (!firedFirst) {
      firedFirst = true;
    } else {
      update2(value);
    }
  });
}
__name(subscribeIgnoreFirst, "subscribeIgnoreFirst");
function writableDerived(origins, derive, reflect, initial) {
  var childDerivedSetter, originValues, blockNextDerive = false;
  var reflectOldValues = "withOld" in reflect;
  var wrappedDerive = /* @__PURE__ */ __name((got, set) => {
    childDerivedSetter = set;
    if (reflectOldValues) {
      originValues = got;
    }
    if (!blockNextDerive) {
      let returned = derive(got, set);
      if (derive.length < 2) {
        set(returned);
      } else {
        return returned;
      }
    }
    blockNextDerive = false;
  }, "wrappedDerive");
  var childDerived = derived(origins, wrappedDerive, initial);
  var singleOrigin = !Array.isArray(origins);
  var sendUpstream = /* @__PURE__ */ __name((setWith) => {
    if (singleOrigin) {
      blockNextDerive = true;
      origins.set(setWith);
    } else {
      setWith.forEach((value, i) => {
        blockNextDerive = true;
        origins[i].set(value);
      });
    }
    blockNextDerive = false;
  }, "sendUpstream");
  if (reflectOldValues) {
    reflect = reflect.withOld;
  }
  var reflectIsAsync = reflect.length >= (reflectOldValues ? 3 : 2);
  var cleanup = null;
  function doReflect(reflecting) {
    if (cleanup) {
      cleanup();
      cleanup = null;
    }
    if (reflectOldValues) {
      var returned = reflect(reflecting, originValues, sendUpstream);
    } else {
      var returned = reflect(reflecting, sendUpstream);
    }
    if (reflectIsAsync) {
      if (typeof returned == "function") {
        cleanup = returned;
      }
    } else {
      sendUpstream(returned);
    }
  }
  __name(doReflect, "doReflect");
  var tryingSet = false;
  function update2(fn) {
    var isUpdated, mutatedBySubscriptions, oldValue, newValue;
    if (tryingSet) {
      newValue = fn(get_store_value(childDerived));
      childDerivedSetter(newValue);
      return;
    }
    var unsubscribe = childDerived.subscribe((value) => {
      if (!tryingSet) {
        oldValue = value;
      } else if (!isUpdated) {
        isUpdated = true;
      } else {
        mutatedBySubscriptions = true;
      }
    });
    newValue = fn(oldValue);
    tryingSet = true;
    childDerivedSetter(newValue);
    unsubscribe();
    tryingSet = false;
    if (mutatedBySubscriptions) {
      newValue = get_store_value(childDerived);
    }
    if (isUpdated) {
      doReflect(newValue);
    }
  }
  __name(update2, "update");
  return {
    subscribe: childDerived.subscribe,
    set(value) {
      update2(() => value);
    },
    update: update2
  };
}
__name(writableDerived, "writableDerived");
function propertyStore(origin, propName) {
  if (!Array.isArray(propName)) {
    return writableDerived(
      origin,
      (object) => object[propName],
      { withOld(reflecting, object) {
        object[propName] = reflecting;
        return object;
      } }
    );
  } else {
    let props = propName.concat();
    return writableDerived(
      origin,
      (value) => {
        for (let i = 0; i < props.length; ++i) {
          value = value[props[i]];
        }
        return value;
      },
      { withOld(reflecting, object) {
        let target = object;
        for (let i = 0; i < props.length - 1; ++i) {
          target = target[props[i]];
        }
        target[props[props.length - 1]] = reflecting;
        return object;
      } }
    );
  }
}
__name(propertyStore, "propertyStore");
class EmbeddedStoreManager {
  static #renderContextRegex = /(create|delete|update)(\w+)/;
  #name = /* @__PURE__ */ new Map();
  #document;
  #embeddedNames = /* @__PURE__ */ new Set();
  constructor(document2) {
    this.#document = document2;
    this.handleDocChange();
  }
  create(embeddedName, options) {
    const doc = this.#document[0];
    let collection = null;
    if (doc) {
      try {
        collection = doc.getEmbeddedCollection(embeddedName);
      } catch (err) {
        console.warn(`EmbeddedStoreManager.create error: No valid embedded collection for: ${embeddedName}`);
      }
    }
    let embeddedData;
    if (!this.#name.has(embeddedName)) {
      embeddedData = {
        collection,
        stores: /* @__PURE__ */ new Map()
      };
      this.#name.set(embeddedName, embeddedData);
    } else {
      embeddedData = this.#name.get(embeddedName);
    }
    let name;
    let rest = {};
    let ctor;
    if (typeof options === "string") {
      name = options;
      ctor = DynMapReducer;
    } else if (typeof options === "function" && hasPrototype(options, DynMapReducer)) {
      ctor = options;
    } else if (typeof options === "object" && options !== null) {
      ({ name, ctor = DynMapReducer, ...rest } = options);
    } else {
      throw new TypeError(`EmbeddedStoreManager.create error: 'options' does not conform to allowed parameters.`);
    }
    if (!hasPrototype(ctor, DynMapReducer)) {
      throw new TypeError(`EmbeddedStoreManager.create error: 'ctor' is not a 'DynMapReducer'.`);
    }
    name = name ?? ctor?.name;
    if (typeof name !== "string") {
      throw new TypeError(`EmbeddedStoreManager.create error: 'name' is not a string.`);
    }
    if (embeddedData.stores.has(name)) {
      return embeddedData.stores.get(name);
    } else {
      const storeOptions = collection ? { data: collection, ...rest } : { ...rest };
      const store = new ctor(storeOptions);
      embeddedData.stores.set(name, store);
      return store;
    }
  }
  destroy(embeddedName, storeName) {
    let count = 0;
    if (embeddedName === void 0) {
      for (const embeddedData of this.#name.values()) {
        embeddedData.collection = null;
        for (const store of embeddedData.stores.values()) {
          store.destroy();
          count++;
        }
      }
      this.#name.clear();
    } else if (typeof embeddedName === "string" && storeName === void 0) {
      const embeddedData = this.#name.get(embeddedName);
      if (embeddedData) {
        embeddedData.collection = null;
        for (const store of embeddedData.stores.values()) {
          store.destroy();
          count++;
        }
      }
      this.#name.delete(embeddedName);
    } else if (typeof embeddedName === "string" && storeName === "string") {
      const embeddedData = this.#name.get(embeddedName);
      if (embeddedData) {
        const store = embeddedData.stores.get(storeName);
        if (store) {
          store.destroy();
          count++;
        }
      }
    }
    return count > 0;
  }
  get(embeddedName, storeName) {
    if (!this.#name.has(embeddedName)) {
      return void 0;
    }
    return this.#name.get(embeddedName).stores.get(storeName);
  }
  handleDocChange() {
    const doc = this.#document[0];
    if (doc instanceof foundry.abstract.Document) {
      const existingEmbeddedNames = new Set(this.#name.keys());
      const embeddedNames = Object.keys(doc.constructor?.metadata?.embedded ?? []);
      this.#embeddedNames.clear();
      for (const embeddedName of embeddedNames) {
        existingEmbeddedNames.delete(embeddedName);
        this.#embeddedNames.add(`create${embeddedName}`);
        this.#embeddedNames.add(`delete${embeddedName}`);
        this.#embeddedNames.add(`update${embeddedName}`);
        let collection = null;
        try {
          collection = doc.getEmbeddedCollection(embeddedName);
        } catch (err) {
          console.warn(`EmbeddedStoreManager.handleDocUpdate error: No valid embedded collection for: ${embeddedName}`);
        }
        const embeddedData = this.#name.get(embeddedName);
        if (embeddedData) {
          embeddedData.collection = collection;
          for (const store of embeddedData.stores.values()) {
            store.setData(collection, true);
          }
        }
      }
      for (const embeddedName of existingEmbeddedNames) {
        const embeddedData = this.#name.get(embeddedName);
        if (embeddedData) {
          embeddedData.collection = null;
          for (const store of embeddedData.stores.values()) {
            store.setData(null, true);
          }
        }
      }
    } else {
      this.#embeddedNames.clear();
      for (const embeddedData of this.#name.values()) {
        embeddedData.collection = null;
        for (const store of embeddedData.stores.values()) {
          store.setData(null, true);
        }
      }
    }
  }
  handleUpdate(renderContext) {
    if (!this.#embeddedNames.has(renderContext)) {
      return;
    }
    const match = EmbeddedStoreManager.#renderContextRegex.exec(renderContext);
    if (match) {
      const embeddedName = match[2];
      if (!this.#name.has(embeddedName)) {
        return;
      }
      for (const store of this.#name.get(embeddedName).stores.values()) {
        store.index.update(true);
      }
    }
  }
}
__name(EmbeddedStoreManager, "EmbeddedStoreManager");
class TJSDocument {
  #document = [void 0];
  #embeddedStoreManager;
  #embeddedAPI;
  #uuidv4;
  #options = { delete: void 0 };
  #subscriptions = [];
  #updateOptions;
  constructor(document2, options = {}) {
    this.#uuidv4 = `tjs-document-${uuidv4()}`;
    if (isPlainObject(document2)) {
      this.setOptions(document2);
    } else {
      this.setOptions(options);
      this.set(document2);
    }
  }
  get embedded() {
    if (!this.#embeddedAPI) {
      this.#embeddedStoreManager = new EmbeddedStoreManager(this.#document);
      this.#embeddedAPI = {
        create: (embeddedName, options) => this.#embeddedStoreManager.create(embeddedName, options),
        destroy: (embeddedName, storeName) => this.#embeddedStoreManager.destroy(embeddedName, storeName),
        get: (embeddedName, storeName) => this.#embeddedStoreManager.get(embeddedName, storeName)
      };
    }
    return this.#embeddedAPI;
  }
  get updateOptions() {
    return this.#updateOptions ?? {};
  }
  get uuidv4() {
    return this.#uuidv4;
  }
  async #deleted() {
    const doc = this.#document[0];
    if (doc instanceof foundry.abstract.Document && !doc?.collection?.has(doc.id)) {
      delete doc?.apps[this.#uuidv4];
      this.#setDocument(void 0);
      if (typeof this.#options.delete === "function") {
        await this.#options.delete();
      }
      this.#updateSubscribers(false, { action: "delete", data: void 0 });
      this.#updateOptions = void 0;
    }
  }
  destroy() {
    const doc = this.#document[0];
    if (this.#embeddedStoreManager) {
      this.#embeddedStoreManager.destroy();
      this.#embeddedStoreManager = void 0;
      this.#embeddedAPI = void 0;
    }
    if (doc instanceof foundry.abstract.Document) {
      delete doc?.apps[this.#uuidv4];
      this.#setDocument(void 0);
    }
    this.#options.delete = void 0;
    this.#subscriptions.length = 0;
  }
  #updateSubscribers(force = false, options = {}) {
    this.#updateOptions = options;
    const doc = this.#document[0];
    for (let cntr = 0; cntr < this.#subscriptions.length; cntr++) {
      this.#subscriptions[cntr](doc, options);
    }
    if (this.#embeddedStoreManager) {
      this.#embeddedStoreManager.handleUpdate(options.renderContext);
    }
  }
  get() {
    return this.#document[0];
  }
  set(document2, options = {}) {
    if (this.#document[0]) {
      delete this.#document[0].apps[this.#uuidv4];
    }
    if (document2 !== void 0 && !(document2 instanceof foundry.abstract.Document)) {
      throw new TypeError(`TJSDocument set error: 'document' is not a valid Document or undefined.`);
    }
    if (options === null || typeof options !== "object") {
      throw new TypeError(`TJSDocument set error: 'options' is not an object.`);
    }
    if (document2 instanceof foundry.abstract.Document) {
      document2.apps[this.#uuidv4] = {
        close: this.#deleted.bind(this),
        render: this.#updateSubscribers.bind(this)
      };
    }
    this.#setDocument(document2);
    this.#updateOptions = options;
    this.#updateSubscribers();
  }
  #setDocument(doc) {
    this.#document[0] = doc;
    if (this.#embeddedStoreManager) {
      this.#embeddedStoreManager.handleDocChange();
    }
  }
  async setFromDataTransfer(data, options) {
    return this.setFromUUID(getUUIDFromDataTransfer(data, options), options);
  }
  async setFromUUID(uuid, options = {}) {
    if (typeof uuid !== "string" || uuid.length === 0) {
      return false;
    }
    try {
      const doc = await globalThis.fromUuid(uuid);
      if (doc) {
        this.set(doc, options);
        return true;
      }
    } catch (err) {
    }
    return false;
  }
  setOptions(options) {
    if (!isObject(options)) {
      throw new TypeError(`TJSDocument error: 'options' is not a plain object.`);
    }
    if (options.delete !== void 0 && typeof options.delete !== "function") {
      throw new TypeError(`TJSDocument error: 'delete' attribute in options is not a function.`);
    }
    if (options.delete === void 0 || typeof options.delete === "function") {
      this.#options.delete = options.delete;
    }
  }
  subscribe(handler) {
    this.#subscriptions.push(handler);
    const updateOptions = { action: "subscribe", data: void 0 };
    handler(this.#document[0], updateOptions);
    return () => {
      const index = this.#subscriptions.findIndex((sub) => sub === handler);
      if (index >= 0) {
        this.#subscriptions.splice(index, 1);
      }
    };
  }
}
__name(TJSDocument, "TJSDocument");
const storeState = writable(void 0);
const gameState = {
  subscribe: storeState.subscribe,
  get: () => game
};
Object.freeze(gameState);
Hooks.once("ready", () => storeState.set(game));
function cubicOut(t) {
  const f = t - 1;
  return f * f * f + 1;
}
__name(cubicOut, "cubicOut");
function lerp$5(start, end, amount) {
  return (1 - amount) * start + amount * end;
}
__name(lerp$5, "lerp$5");
function degToRad(deg) {
  return deg * (Math.PI / 180);
}
__name(degToRad, "degToRad");
var EPSILON = 1e-6;
var ARRAY_TYPE = typeof Float32Array !== "undefined" ? Float32Array : Array;
var RANDOM = Math.random;
if (!Math.hypot)
  Math.hypot = function() {
    var y = 0, i = arguments.length;
    while (i--) {
      y += arguments[i] * arguments[i];
    }
    return Math.sqrt(y);
  };
function create$6() {
  var out = new ARRAY_TYPE(9);
  if (ARRAY_TYPE != Float32Array) {
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[5] = 0;
    out[6] = 0;
    out[7] = 0;
  }
  out[0] = 1;
  out[4] = 1;
  out[8] = 1;
  return out;
}
__name(create$6, "create$6");
function create$5() {
  var out = new ARRAY_TYPE(16);
  if (ARRAY_TYPE != Float32Array) {
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
  }
  out[0] = 1;
  out[5] = 1;
  out[10] = 1;
  out[15] = 1;
  return out;
}
__name(create$5, "create$5");
function clone$5(a) {
  var out = new ARRAY_TYPE(16);
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  out[3] = a[3];
  out[4] = a[4];
  out[5] = a[5];
  out[6] = a[6];
  out[7] = a[7];
  out[8] = a[8];
  out[9] = a[9];
  out[10] = a[10];
  out[11] = a[11];
  out[12] = a[12];
  out[13] = a[13];
  out[14] = a[14];
  out[15] = a[15];
  return out;
}
__name(clone$5, "clone$5");
function copy$5(out, a) {
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  out[3] = a[3];
  out[4] = a[4];
  out[5] = a[5];
  out[6] = a[6];
  out[7] = a[7];
  out[8] = a[8];
  out[9] = a[9];
  out[10] = a[10];
  out[11] = a[11];
  out[12] = a[12];
  out[13] = a[13];
  out[14] = a[14];
  out[15] = a[15];
  return out;
}
__name(copy$5, "copy$5");
function fromValues$5(m00, m01, m02, m03, m10, m11, m12, m13, m20, m21, m22, m23, m30, m31, m32, m33) {
  var out = new ARRAY_TYPE(16);
  out[0] = m00;
  out[1] = m01;
  out[2] = m02;
  out[3] = m03;
  out[4] = m10;
  out[5] = m11;
  out[6] = m12;
  out[7] = m13;
  out[8] = m20;
  out[9] = m21;
  out[10] = m22;
  out[11] = m23;
  out[12] = m30;
  out[13] = m31;
  out[14] = m32;
  out[15] = m33;
  return out;
}
__name(fromValues$5, "fromValues$5");
function set$5(out, m00, m01, m02, m03, m10, m11, m12, m13, m20, m21, m22, m23, m30, m31, m32, m33) {
  out[0] = m00;
  out[1] = m01;
  out[2] = m02;
  out[3] = m03;
  out[4] = m10;
  out[5] = m11;
  out[6] = m12;
  out[7] = m13;
  out[8] = m20;
  out[9] = m21;
  out[10] = m22;
  out[11] = m23;
  out[12] = m30;
  out[13] = m31;
  out[14] = m32;
  out[15] = m33;
  return out;
}
__name(set$5, "set$5");
function identity$2(out) {
  out[0] = 1;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = 1;
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[10] = 1;
  out[11] = 0;
  out[12] = 0;
  out[13] = 0;
  out[14] = 0;
  out[15] = 1;
  return out;
}
__name(identity$2, "identity$2");
function transpose(out, a) {
  if (out === a) {
    var a01 = a[1], a02 = a[2], a03 = a[3];
    var a12 = a[6], a13 = a[7];
    var a23 = a[11];
    out[1] = a[4];
    out[2] = a[8];
    out[3] = a[12];
    out[4] = a01;
    out[6] = a[9];
    out[7] = a[13];
    out[8] = a02;
    out[9] = a12;
    out[11] = a[14];
    out[12] = a03;
    out[13] = a13;
    out[14] = a23;
  } else {
    out[0] = a[0];
    out[1] = a[4];
    out[2] = a[8];
    out[3] = a[12];
    out[4] = a[1];
    out[5] = a[5];
    out[6] = a[9];
    out[7] = a[13];
    out[8] = a[2];
    out[9] = a[6];
    out[10] = a[10];
    out[11] = a[14];
    out[12] = a[3];
    out[13] = a[7];
    out[14] = a[11];
    out[15] = a[15];
  }
  return out;
}
__name(transpose, "transpose");
function invert$2(out, a) {
  var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3];
  var a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7];
  var a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];
  var a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];
  var b00 = a00 * a11 - a01 * a10;
  var b01 = a00 * a12 - a02 * a10;
  var b02 = a00 * a13 - a03 * a10;
  var b03 = a01 * a12 - a02 * a11;
  var b04 = a01 * a13 - a03 * a11;
  var b05 = a02 * a13 - a03 * a12;
  var b06 = a20 * a31 - a21 * a30;
  var b07 = a20 * a32 - a22 * a30;
  var b08 = a20 * a33 - a23 * a30;
  var b09 = a21 * a32 - a22 * a31;
  var b10 = a21 * a33 - a23 * a31;
  var b11 = a22 * a33 - a23 * a32;
  var det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
  if (!det) {
    return null;
  }
  det = 1 / det;
  out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
  out[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
  out[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
  out[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;
  out[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
  out[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
  out[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
  out[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;
  out[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
  out[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
  out[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
  out[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;
  out[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det;
  out[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det;
  out[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det;
  out[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;
  return out;
}
__name(invert$2, "invert$2");
function adjoint(out, a) {
  var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3];
  var a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7];
  var a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];
  var a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];
  out[0] = a11 * (a22 * a33 - a23 * a32) - a21 * (a12 * a33 - a13 * a32) + a31 * (a12 * a23 - a13 * a22);
  out[1] = -(a01 * (a22 * a33 - a23 * a32) - a21 * (a02 * a33 - a03 * a32) + a31 * (a02 * a23 - a03 * a22));
  out[2] = a01 * (a12 * a33 - a13 * a32) - a11 * (a02 * a33 - a03 * a32) + a31 * (a02 * a13 - a03 * a12);
  out[3] = -(a01 * (a12 * a23 - a13 * a22) - a11 * (a02 * a23 - a03 * a22) + a21 * (a02 * a13 - a03 * a12));
  out[4] = -(a10 * (a22 * a33 - a23 * a32) - a20 * (a12 * a33 - a13 * a32) + a30 * (a12 * a23 - a13 * a22));
  out[5] = a00 * (a22 * a33 - a23 * a32) - a20 * (a02 * a33 - a03 * a32) + a30 * (a02 * a23 - a03 * a22);
  out[6] = -(a00 * (a12 * a33 - a13 * a32) - a10 * (a02 * a33 - a03 * a32) + a30 * (a02 * a13 - a03 * a12));
  out[7] = a00 * (a12 * a23 - a13 * a22) - a10 * (a02 * a23 - a03 * a22) + a20 * (a02 * a13 - a03 * a12);
  out[8] = a10 * (a21 * a33 - a23 * a31) - a20 * (a11 * a33 - a13 * a31) + a30 * (a11 * a23 - a13 * a21);
  out[9] = -(a00 * (a21 * a33 - a23 * a31) - a20 * (a01 * a33 - a03 * a31) + a30 * (a01 * a23 - a03 * a21));
  out[10] = a00 * (a11 * a33 - a13 * a31) - a10 * (a01 * a33 - a03 * a31) + a30 * (a01 * a13 - a03 * a11);
  out[11] = -(a00 * (a11 * a23 - a13 * a21) - a10 * (a01 * a23 - a03 * a21) + a20 * (a01 * a13 - a03 * a11));
  out[12] = -(a10 * (a21 * a32 - a22 * a31) - a20 * (a11 * a32 - a12 * a31) + a30 * (a11 * a22 - a12 * a21));
  out[13] = a00 * (a21 * a32 - a22 * a31) - a20 * (a01 * a32 - a02 * a31) + a30 * (a01 * a22 - a02 * a21);
  out[14] = -(a00 * (a11 * a32 - a12 * a31) - a10 * (a01 * a32 - a02 * a31) + a30 * (a01 * a12 - a02 * a11));
  out[15] = a00 * (a11 * a22 - a12 * a21) - a10 * (a01 * a22 - a02 * a21) + a20 * (a01 * a12 - a02 * a11);
  return out;
}
__name(adjoint, "adjoint");
function determinant(a) {
  var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3];
  var a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7];
  var a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];
  var a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];
  var b00 = a00 * a11 - a01 * a10;
  var b01 = a00 * a12 - a02 * a10;
  var b02 = a00 * a13 - a03 * a10;
  var b03 = a01 * a12 - a02 * a11;
  var b04 = a01 * a13 - a03 * a11;
  var b05 = a02 * a13 - a03 * a12;
  var b06 = a20 * a31 - a21 * a30;
  var b07 = a20 * a32 - a22 * a30;
  var b08 = a20 * a33 - a23 * a30;
  var b09 = a21 * a32 - a22 * a31;
  var b10 = a21 * a33 - a23 * a31;
  var b11 = a22 * a33 - a23 * a32;
  return b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
}
__name(determinant, "determinant");
function multiply$5(out, a, b) {
  var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3];
  var a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7];
  var a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];
  var a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];
  var b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3];
  out[0] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
  out[1] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
  out[2] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
  out[3] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
  b0 = b[4];
  b1 = b[5];
  b2 = b[6];
  b3 = b[7];
  out[4] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
  out[5] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
  out[6] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
  out[7] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
  b0 = b[8];
  b1 = b[9];
  b2 = b[10];
  b3 = b[11];
  out[8] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
  out[9] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
  out[10] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
  out[11] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
  b0 = b[12];
  b1 = b[13];
  b2 = b[14];
  b3 = b[15];
  out[12] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
  out[13] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
  out[14] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
  out[15] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
  return out;
}
__name(multiply$5, "multiply$5");
function translate$1(out, a, v) {
  var x = v[0], y = v[1], z = v[2];
  var a00, a01, a02, a03;
  var a10, a11, a12, a13;
  var a20, a21, a22, a23;
  if (a === out) {
    out[12] = a[0] * x + a[4] * y + a[8] * z + a[12];
    out[13] = a[1] * x + a[5] * y + a[9] * z + a[13];
    out[14] = a[2] * x + a[6] * y + a[10] * z + a[14];
    out[15] = a[3] * x + a[7] * y + a[11] * z + a[15];
  } else {
    a00 = a[0];
    a01 = a[1];
    a02 = a[2];
    a03 = a[3];
    a10 = a[4];
    a11 = a[5];
    a12 = a[6];
    a13 = a[7];
    a20 = a[8];
    a21 = a[9];
    a22 = a[10];
    a23 = a[11];
    out[0] = a00;
    out[1] = a01;
    out[2] = a02;
    out[3] = a03;
    out[4] = a10;
    out[5] = a11;
    out[6] = a12;
    out[7] = a13;
    out[8] = a20;
    out[9] = a21;
    out[10] = a22;
    out[11] = a23;
    out[12] = a00 * x + a10 * y + a20 * z + a[12];
    out[13] = a01 * x + a11 * y + a21 * z + a[13];
    out[14] = a02 * x + a12 * y + a22 * z + a[14];
    out[15] = a03 * x + a13 * y + a23 * z + a[15];
  }
  return out;
}
__name(translate$1, "translate$1");
function scale$5(out, a, v) {
  var x = v[0], y = v[1], z = v[2];
  out[0] = a[0] * x;
  out[1] = a[1] * x;
  out[2] = a[2] * x;
  out[3] = a[3] * x;
  out[4] = a[4] * y;
  out[5] = a[5] * y;
  out[6] = a[6] * y;
  out[7] = a[7] * y;
  out[8] = a[8] * z;
  out[9] = a[9] * z;
  out[10] = a[10] * z;
  out[11] = a[11] * z;
  out[12] = a[12];
  out[13] = a[13];
  out[14] = a[14];
  out[15] = a[15];
  return out;
}
__name(scale$5, "scale$5");
function rotate$1(out, a, rad, axis) {
  var x = axis[0], y = axis[1], z = axis[2];
  var len = Math.hypot(x, y, z);
  var s, c, t;
  var a00, a01, a02, a03;
  var a10, a11, a12, a13;
  var a20, a21, a22, a23;
  var b00, b01, b02;
  var b10, b11, b12;
  var b20, b21, b22;
  if (len < EPSILON) {
    return null;
  }
  len = 1 / len;
  x *= len;
  y *= len;
  z *= len;
  s = Math.sin(rad);
  c = Math.cos(rad);
  t = 1 - c;
  a00 = a[0];
  a01 = a[1];
  a02 = a[2];
  a03 = a[3];
  a10 = a[4];
  a11 = a[5];
  a12 = a[6];
  a13 = a[7];
  a20 = a[8];
  a21 = a[9];
  a22 = a[10];
  a23 = a[11];
  b00 = x * x * t + c;
  b01 = y * x * t + z * s;
  b02 = z * x * t - y * s;
  b10 = x * y * t - z * s;
  b11 = y * y * t + c;
  b12 = z * y * t + x * s;
  b20 = x * z * t + y * s;
  b21 = y * z * t - x * s;
  b22 = z * z * t + c;
  out[0] = a00 * b00 + a10 * b01 + a20 * b02;
  out[1] = a01 * b00 + a11 * b01 + a21 * b02;
  out[2] = a02 * b00 + a12 * b01 + a22 * b02;
  out[3] = a03 * b00 + a13 * b01 + a23 * b02;
  out[4] = a00 * b10 + a10 * b11 + a20 * b12;
  out[5] = a01 * b10 + a11 * b11 + a21 * b12;
  out[6] = a02 * b10 + a12 * b11 + a22 * b12;
  out[7] = a03 * b10 + a13 * b11 + a23 * b12;
  out[8] = a00 * b20 + a10 * b21 + a20 * b22;
  out[9] = a01 * b20 + a11 * b21 + a21 * b22;
  out[10] = a02 * b20 + a12 * b21 + a22 * b22;
  out[11] = a03 * b20 + a13 * b21 + a23 * b22;
  if (a !== out) {
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
  }
  return out;
}
__name(rotate$1, "rotate$1");
function rotateX$3(out, a, rad) {
  var s = Math.sin(rad);
  var c = Math.cos(rad);
  var a10 = a[4];
  var a11 = a[5];
  var a12 = a[6];
  var a13 = a[7];
  var a20 = a[8];
  var a21 = a[9];
  var a22 = a[10];
  var a23 = a[11];
  if (a !== out) {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
  }
  out[4] = a10 * c + a20 * s;
  out[5] = a11 * c + a21 * s;
  out[6] = a12 * c + a22 * s;
  out[7] = a13 * c + a23 * s;
  out[8] = a20 * c - a10 * s;
  out[9] = a21 * c - a11 * s;
  out[10] = a22 * c - a12 * s;
  out[11] = a23 * c - a13 * s;
  return out;
}
__name(rotateX$3, "rotateX$3");
function rotateY$3(out, a, rad) {
  var s = Math.sin(rad);
  var c = Math.cos(rad);
  var a00 = a[0];
  var a01 = a[1];
  var a02 = a[2];
  var a03 = a[3];
  var a20 = a[8];
  var a21 = a[9];
  var a22 = a[10];
  var a23 = a[11];
  if (a !== out) {
    out[4] = a[4];
    out[5] = a[5];
    out[6] = a[6];
    out[7] = a[7];
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
  }
  out[0] = a00 * c - a20 * s;
  out[1] = a01 * c - a21 * s;
  out[2] = a02 * c - a22 * s;
  out[3] = a03 * c - a23 * s;
  out[8] = a00 * s + a20 * c;
  out[9] = a01 * s + a21 * c;
  out[10] = a02 * s + a22 * c;
  out[11] = a03 * s + a23 * c;
  return out;
}
__name(rotateY$3, "rotateY$3");
function rotateZ$3(out, a, rad) {
  var s = Math.sin(rad);
  var c = Math.cos(rad);
  var a00 = a[0];
  var a01 = a[1];
  var a02 = a[2];
  var a03 = a[3];
  var a10 = a[4];
  var a11 = a[5];
  var a12 = a[6];
  var a13 = a[7];
  if (a !== out) {
    out[8] = a[8];
    out[9] = a[9];
    out[10] = a[10];
    out[11] = a[11];
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
  }
  out[0] = a00 * c + a10 * s;
  out[1] = a01 * c + a11 * s;
  out[2] = a02 * c + a12 * s;
  out[3] = a03 * c + a13 * s;
  out[4] = a10 * c - a00 * s;
  out[5] = a11 * c - a01 * s;
  out[6] = a12 * c - a02 * s;
  out[7] = a13 * c - a03 * s;
  return out;
}
__name(rotateZ$3, "rotateZ$3");
function fromTranslation$1(out, v) {
  out[0] = 1;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = 1;
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[10] = 1;
  out[11] = 0;
  out[12] = v[0];
  out[13] = v[1];
  out[14] = v[2];
  out[15] = 1;
  return out;
}
__name(fromTranslation$1, "fromTranslation$1");
function fromScaling(out, v) {
  out[0] = v[0];
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = v[1];
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[10] = v[2];
  out[11] = 0;
  out[12] = 0;
  out[13] = 0;
  out[14] = 0;
  out[15] = 1;
  return out;
}
__name(fromScaling, "fromScaling");
function fromRotation$1(out, rad, axis) {
  var x = axis[0], y = axis[1], z = axis[2];
  var len = Math.hypot(x, y, z);
  var s, c, t;
  if (len < EPSILON) {
    return null;
  }
  len = 1 / len;
  x *= len;
  y *= len;
  z *= len;
  s = Math.sin(rad);
  c = Math.cos(rad);
  t = 1 - c;
  out[0] = x * x * t + c;
  out[1] = y * x * t + z * s;
  out[2] = z * x * t - y * s;
  out[3] = 0;
  out[4] = x * y * t - z * s;
  out[5] = y * y * t + c;
  out[6] = z * y * t + x * s;
  out[7] = 0;
  out[8] = x * z * t + y * s;
  out[9] = y * z * t - x * s;
  out[10] = z * z * t + c;
  out[11] = 0;
  out[12] = 0;
  out[13] = 0;
  out[14] = 0;
  out[15] = 1;
  return out;
}
__name(fromRotation$1, "fromRotation$1");
function fromXRotation(out, rad) {
  var s = Math.sin(rad);
  var c = Math.cos(rad);
  out[0] = 1;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = c;
  out[6] = s;
  out[7] = 0;
  out[8] = 0;
  out[9] = -s;
  out[10] = c;
  out[11] = 0;
  out[12] = 0;
  out[13] = 0;
  out[14] = 0;
  out[15] = 1;
  return out;
}
__name(fromXRotation, "fromXRotation");
function fromYRotation(out, rad) {
  var s = Math.sin(rad);
  var c = Math.cos(rad);
  out[0] = c;
  out[1] = 0;
  out[2] = -s;
  out[3] = 0;
  out[4] = 0;
  out[5] = 1;
  out[6] = 0;
  out[7] = 0;
  out[8] = s;
  out[9] = 0;
  out[10] = c;
  out[11] = 0;
  out[12] = 0;
  out[13] = 0;
  out[14] = 0;
  out[15] = 1;
  return out;
}
__name(fromYRotation, "fromYRotation");
function fromZRotation(out, rad) {
  var s = Math.sin(rad);
  var c = Math.cos(rad);
  out[0] = c;
  out[1] = s;
  out[2] = 0;
  out[3] = 0;
  out[4] = -s;
  out[5] = c;
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[10] = 1;
  out[11] = 0;
  out[12] = 0;
  out[13] = 0;
  out[14] = 0;
  out[15] = 1;
  return out;
}
__name(fromZRotation, "fromZRotation");
function fromRotationTranslation$1(out, q, v) {
  var x = q[0], y = q[1], z = q[2], w = q[3];
  var x2 = x + x;
  var y2 = y + y;
  var z2 = z + z;
  var xx = x * x2;
  var xy = x * y2;
  var xz = x * z2;
  var yy = y * y2;
  var yz = y * z2;
  var zz = z * z2;
  var wx = w * x2;
  var wy = w * y2;
  var wz = w * z2;
  out[0] = 1 - (yy + zz);
  out[1] = xy + wz;
  out[2] = xz - wy;
  out[3] = 0;
  out[4] = xy - wz;
  out[5] = 1 - (xx + zz);
  out[6] = yz + wx;
  out[7] = 0;
  out[8] = xz + wy;
  out[9] = yz - wx;
  out[10] = 1 - (xx + yy);
  out[11] = 0;
  out[12] = v[0];
  out[13] = v[1];
  out[14] = v[2];
  out[15] = 1;
  return out;
}
__name(fromRotationTranslation$1, "fromRotationTranslation$1");
function fromQuat2(out, a) {
  var translation = new ARRAY_TYPE(3);
  var bx = -a[0], by = -a[1], bz = -a[2], bw = a[3], ax = a[4], ay = a[5], az = a[6], aw = a[7];
  var magnitude = bx * bx + by * by + bz * bz + bw * bw;
  if (magnitude > 0) {
    translation[0] = (ax * bw + aw * bx + ay * bz - az * by) * 2 / magnitude;
    translation[1] = (ay * bw + aw * by + az * bx - ax * bz) * 2 / magnitude;
    translation[2] = (az * bw + aw * bz + ax * by - ay * bx) * 2 / magnitude;
  } else {
    translation[0] = (ax * bw + aw * bx + ay * bz - az * by) * 2;
    translation[1] = (ay * bw + aw * by + az * bx - ax * bz) * 2;
    translation[2] = (az * bw + aw * bz + ax * by - ay * bx) * 2;
  }
  fromRotationTranslation$1(out, a, translation);
  return out;
}
__name(fromQuat2, "fromQuat2");
function getTranslation$1(out, mat) {
  out[0] = mat[12];
  out[1] = mat[13];
  out[2] = mat[14];
  return out;
}
__name(getTranslation$1, "getTranslation$1");
function getScaling(out, mat) {
  var m11 = mat[0];
  var m12 = mat[1];
  var m13 = mat[2];
  var m21 = mat[4];
  var m22 = mat[5];
  var m23 = mat[6];
  var m31 = mat[8];
  var m32 = mat[9];
  var m33 = mat[10];
  out[0] = Math.hypot(m11, m12, m13);
  out[1] = Math.hypot(m21, m22, m23);
  out[2] = Math.hypot(m31, m32, m33);
  return out;
}
__name(getScaling, "getScaling");
function getRotation(out, mat) {
  var scaling = new ARRAY_TYPE(3);
  getScaling(scaling, mat);
  var is1 = 1 / scaling[0];
  var is2 = 1 / scaling[1];
  var is3 = 1 / scaling[2];
  var sm11 = mat[0] * is1;
  var sm12 = mat[1] * is2;
  var sm13 = mat[2] * is3;
  var sm21 = mat[4] * is1;
  var sm22 = mat[5] * is2;
  var sm23 = mat[6] * is3;
  var sm31 = mat[8] * is1;
  var sm32 = mat[9] * is2;
  var sm33 = mat[10] * is3;
  var trace = sm11 + sm22 + sm33;
  var S = 0;
  if (trace > 0) {
    S = Math.sqrt(trace + 1) * 2;
    out[3] = 0.25 * S;
    out[0] = (sm23 - sm32) / S;
    out[1] = (sm31 - sm13) / S;
    out[2] = (sm12 - sm21) / S;
  } else if (sm11 > sm22 && sm11 > sm33) {
    S = Math.sqrt(1 + sm11 - sm22 - sm33) * 2;
    out[3] = (sm23 - sm32) / S;
    out[0] = 0.25 * S;
    out[1] = (sm12 + sm21) / S;
    out[2] = (sm31 + sm13) / S;
  } else if (sm22 > sm33) {
    S = Math.sqrt(1 + sm22 - sm11 - sm33) * 2;
    out[3] = (sm31 - sm13) / S;
    out[0] = (sm12 + sm21) / S;
    out[1] = 0.25 * S;
    out[2] = (sm23 + sm32) / S;
  } else {
    S = Math.sqrt(1 + sm33 - sm11 - sm22) * 2;
    out[3] = (sm12 - sm21) / S;
    out[0] = (sm31 + sm13) / S;
    out[1] = (sm23 + sm32) / S;
    out[2] = 0.25 * S;
  }
  return out;
}
__name(getRotation, "getRotation");
function fromRotationTranslationScale(out, q, v, s) {
  var x = q[0], y = q[1], z = q[2], w = q[3];
  var x2 = x + x;
  var y2 = y + y;
  var z2 = z + z;
  var xx = x * x2;
  var xy = x * y2;
  var xz = x * z2;
  var yy = y * y2;
  var yz = y * z2;
  var zz = z * z2;
  var wx = w * x2;
  var wy = w * y2;
  var wz = w * z2;
  var sx = s[0];
  var sy = s[1];
  var sz = s[2];
  out[0] = (1 - (yy + zz)) * sx;
  out[1] = (xy + wz) * sx;
  out[2] = (xz - wy) * sx;
  out[3] = 0;
  out[4] = (xy - wz) * sy;
  out[5] = (1 - (xx + zz)) * sy;
  out[6] = (yz + wx) * sy;
  out[7] = 0;
  out[8] = (xz + wy) * sz;
  out[9] = (yz - wx) * sz;
  out[10] = (1 - (xx + yy)) * sz;
  out[11] = 0;
  out[12] = v[0];
  out[13] = v[1];
  out[14] = v[2];
  out[15] = 1;
  return out;
}
__name(fromRotationTranslationScale, "fromRotationTranslationScale");
function fromRotationTranslationScaleOrigin(out, q, v, s, o) {
  var x = q[0], y = q[1], z = q[2], w = q[3];
  var x2 = x + x;
  var y2 = y + y;
  var z2 = z + z;
  var xx = x * x2;
  var xy = x * y2;
  var xz = x * z2;
  var yy = y * y2;
  var yz = y * z2;
  var zz = z * z2;
  var wx = w * x2;
  var wy = w * y2;
  var wz = w * z2;
  var sx = s[0];
  var sy = s[1];
  var sz = s[2];
  var ox = o[0];
  var oy = o[1];
  var oz = o[2];
  var out0 = (1 - (yy + zz)) * sx;
  var out1 = (xy + wz) * sx;
  var out2 = (xz - wy) * sx;
  var out4 = (xy - wz) * sy;
  var out5 = (1 - (xx + zz)) * sy;
  var out6 = (yz + wx) * sy;
  var out8 = (xz + wy) * sz;
  var out9 = (yz - wx) * sz;
  var out10 = (1 - (xx + yy)) * sz;
  out[0] = out0;
  out[1] = out1;
  out[2] = out2;
  out[3] = 0;
  out[4] = out4;
  out[5] = out5;
  out[6] = out6;
  out[7] = 0;
  out[8] = out8;
  out[9] = out9;
  out[10] = out10;
  out[11] = 0;
  out[12] = v[0] + ox - (out0 * ox + out4 * oy + out8 * oz);
  out[13] = v[1] + oy - (out1 * ox + out5 * oy + out9 * oz);
  out[14] = v[2] + oz - (out2 * ox + out6 * oy + out10 * oz);
  out[15] = 1;
  return out;
}
__name(fromRotationTranslationScaleOrigin, "fromRotationTranslationScaleOrigin");
function fromQuat(out, q) {
  var x = q[0], y = q[1], z = q[2], w = q[3];
  var x2 = x + x;
  var y2 = y + y;
  var z2 = z + z;
  var xx = x * x2;
  var yx = y * x2;
  var yy = y * y2;
  var zx = z * x2;
  var zy = z * y2;
  var zz = z * z2;
  var wx = w * x2;
  var wy = w * y2;
  var wz = w * z2;
  out[0] = 1 - yy - zz;
  out[1] = yx + wz;
  out[2] = zx - wy;
  out[3] = 0;
  out[4] = yx - wz;
  out[5] = 1 - xx - zz;
  out[6] = zy + wx;
  out[7] = 0;
  out[8] = zx + wy;
  out[9] = zy - wx;
  out[10] = 1 - xx - yy;
  out[11] = 0;
  out[12] = 0;
  out[13] = 0;
  out[14] = 0;
  out[15] = 1;
  return out;
}
__name(fromQuat, "fromQuat");
function frustum(out, left, right, bottom, top, near, far) {
  var rl = 1 / (right - left);
  var tb = 1 / (top - bottom);
  var nf = 1 / (near - far);
  out[0] = near * 2 * rl;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = near * 2 * tb;
  out[6] = 0;
  out[7] = 0;
  out[8] = (right + left) * rl;
  out[9] = (top + bottom) * tb;
  out[10] = (far + near) * nf;
  out[11] = -1;
  out[12] = 0;
  out[13] = 0;
  out[14] = far * near * 2 * nf;
  out[15] = 0;
  return out;
}
__name(frustum, "frustum");
function perspectiveNO(out, fovy, aspect, near, far) {
  var f = 1 / Math.tan(fovy / 2), nf;
  out[0] = f / aspect;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = f;
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[11] = -1;
  out[12] = 0;
  out[13] = 0;
  out[15] = 0;
  if (far != null && far !== Infinity) {
    nf = 1 / (near - far);
    out[10] = (far + near) * nf;
    out[14] = 2 * far * near * nf;
  } else {
    out[10] = -1;
    out[14] = -2 * near;
  }
  return out;
}
__name(perspectiveNO, "perspectiveNO");
var perspective = perspectiveNO;
function perspectiveZO(out, fovy, aspect, near, far) {
  var f = 1 / Math.tan(fovy / 2), nf;
  out[0] = f / aspect;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = f;
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[11] = -1;
  out[12] = 0;
  out[13] = 0;
  out[15] = 0;
  if (far != null && far !== Infinity) {
    nf = 1 / (near - far);
    out[10] = far * nf;
    out[14] = far * near * nf;
  } else {
    out[10] = -1;
    out[14] = -near;
  }
  return out;
}
__name(perspectiveZO, "perspectiveZO");
function perspectiveFromFieldOfView(out, fov, near, far) {
  var upTan = Math.tan(fov.upDegrees * Math.PI / 180);
  var downTan = Math.tan(fov.downDegrees * Math.PI / 180);
  var leftTan = Math.tan(fov.leftDegrees * Math.PI / 180);
  var rightTan = Math.tan(fov.rightDegrees * Math.PI / 180);
  var xScale = 2 / (leftTan + rightTan);
  var yScale = 2 / (upTan + downTan);
  out[0] = xScale;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = yScale;
  out[6] = 0;
  out[7] = 0;
  out[8] = -((leftTan - rightTan) * xScale * 0.5);
  out[9] = (upTan - downTan) * yScale * 0.5;
  out[10] = far / (near - far);
  out[11] = -1;
  out[12] = 0;
  out[13] = 0;
  out[14] = far * near / (near - far);
  out[15] = 0;
  return out;
}
__name(perspectiveFromFieldOfView, "perspectiveFromFieldOfView");
function orthoNO(out, left, right, bottom, top, near, far) {
  var lr = 1 / (left - right);
  var bt = 1 / (bottom - top);
  var nf = 1 / (near - far);
  out[0] = -2 * lr;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = -2 * bt;
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[10] = 2 * nf;
  out[11] = 0;
  out[12] = (left + right) * lr;
  out[13] = (top + bottom) * bt;
  out[14] = (far + near) * nf;
  out[15] = 1;
  return out;
}
__name(orthoNO, "orthoNO");
var ortho = orthoNO;
function orthoZO(out, left, right, bottom, top, near, far) {
  var lr = 1 / (left - right);
  var bt = 1 / (bottom - top);
  var nf = 1 / (near - far);
  out[0] = -2 * lr;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = -2 * bt;
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[10] = nf;
  out[11] = 0;
  out[12] = (left + right) * lr;
  out[13] = (top + bottom) * bt;
  out[14] = near * nf;
  out[15] = 1;
  return out;
}
__name(orthoZO, "orthoZO");
function lookAt(out, eye, center, up) {
  var x0, x1, x2, y0, y1, y2, z0, z1, z2, len;
  var eyex = eye[0];
  var eyey = eye[1];
  var eyez = eye[2];
  var upx = up[0];
  var upy = up[1];
  var upz = up[2];
  var centerx = center[0];
  var centery = center[1];
  var centerz = center[2];
  if (Math.abs(eyex - centerx) < EPSILON && Math.abs(eyey - centery) < EPSILON && Math.abs(eyez - centerz) < EPSILON) {
    return identity$2(out);
  }
  z0 = eyex - centerx;
  z1 = eyey - centery;
  z2 = eyez - centerz;
  len = 1 / Math.hypot(z0, z1, z2);
  z0 *= len;
  z1 *= len;
  z2 *= len;
  x0 = upy * z2 - upz * z1;
  x1 = upz * z0 - upx * z2;
  x2 = upx * z1 - upy * z0;
  len = Math.hypot(x0, x1, x2);
  if (!len) {
    x0 = 0;
    x1 = 0;
    x2 = 0;
  } else {
    len = 1 / len;
    x0 *= len;
    x1 *= len;
    x2 *= len;
  }
  y0 = z1 * x2 - z2 * x1;
  y1 = z2 * x0 - z0 * x2;
  y2 = z0 * x1 - z1 * x0;
  len = Math.hypot(y0, y1, y2);
  if (!len) {
    y0 = 0;
    y1 = 0;
    y2 = 0;
  } else {
    len = 1 / len;
    y0 *= len;
    y1 *= len;
    y2 *= len;
  }
  out[0] = x0;
  out[1] = y0;
  out[2] = z0;
  out[3] = 0;
  out[4] = x1;
  out[5] = y1;
  out[6] = z1;
  out[7] = 0;
  out[8] = x2;
  out[9] = y2;
  out[10] = z2;
  out[11] = 0;
  out[12] = -(x0 * eyex + x1 * eyey + x2 * eyez);
  out[13] = -(y0 * eyex + y1 * eyey + y2 * eyez);
  out[14] = -(z0 * eyex + z1 * eyey + z2 * eyez);
  out[15] = 1;
  return out;
}
__name(lookAt, "lookAt");
function targetTo(out, eye, target, up) {
  var eyex = eye[0], eyey = eye[1], eyez = eye[2], upx = up[0], upy = up[1], upz = up[2];
  var z0 = eyex - target[0], z1 = eyey - target[1], z2 = eyez - target[2];
  var len = z0 * z0 + z1 * z1 + z2 * z2;
  if (len > 0) {
    len = 1 / Math.sqrt(len);
    z0 *= len;
    z1 *= len;
    z2 *= len;
  }
  var x0 = upy * z2 - upz * z1, x1 = upz * z0 - upx * z2, x2 = upx * z1 - upy * z0;
  len = x0 * x0 + x1 * x1 + x2 * x2;
  if (len > 0) {
    len = 1 / Math.sqrt(len);
    x0 *= len;
    x1 *= len;
    x2 *= len;
  }
  out[0] = x0;
  out[1] = x1;
  out[2] = x2;
  out[3] = 0;
  out[4] = z1 * x2 - z2 * x1;
  out[5] = z2 * x0 - z0 * x2;
  out[6] = z0 * x1 - z1 * x0;
  out[7] = 0;
  out[8] = z0;
  out[9] = z1;
  out[10] = z2;
  out[11] = 0;
  out[12] = eyex;
  out[13] = eyey;
  out[14] = eyez;
  out[15] = 1;
  return out;
}
__name(targetTo, "targetTo");
function str$5(a) {
  return "mat4(" + a[0] + ", " + a[1] + ", " + a[2] + ", " + a[3] + ", " + a[4] + ", " + a[5] + ", " + a[6] + ", " + a[7] + ", " + a[8] + ", " + a[9] + ", " + a[10] + ", " + a[11] + ", " + a[12] + ", " + a[13] + ", " + a[14] + ", " + a[15] + ")";
}
__name(str$5, "str$5");
function frob(a) {
  return Math.hypot(a[0], a[1], a[2], a[3], a[4], a[5], a[6], a[7], a[8], a[9], a[10], a[11], a[12], a[13], a[14], a[15]);
}
__name(frob, "frob");
function add$5(out, a, b) {
  out[0] = a[0] + b[0];
  out[1] = a[1] + b[1];
  out[2] = a[2] + b[2];
  out[3] = a[3] + b[3];
  out[4] = a[4] + b[4];
  out[5] = a[5] + b[5];
  out[6] = a[6] + b[6];
  out[7] = a[7] + b[7];
  out[8] = a[8] + b[8];
  out[9] = a[9] + b[9];
  out[10] = a[10] + b[10];
  out[11] = a[11] + b[11];
  out[12] = a[12] + b[12];
  out[13] = a[13] + b[13];
  out[14] = a[14] + b[14];
  out[15] = a[15] + b[15];
  return out;
}
__name(add$5, "add$5");
function subtract$3(out, a, b) {
  out[0] = a[0] - b[0];
  out[1] = a[1] - b[1];
  out[2] = a[2] - b[2];
  out[3] = a[3] - b[3];
  out[4] = a[4] - b[4];
  out[5] = a[5] - b[5];
  out[6] = a[6] - b[6];
  out[7] = a[7] - b[7];
  out[8] = a[8] - b[8];
  out[9] = a[9] - b[9];
  out[10] = a[10] - b[10];
  out[11] = a[11] - b[11];
  out[12] = a[12] - b[12];
  out[13] = a[13] - b[13];
  out[14] = a[14] - b[14];
  out[15] = a[15] - b[15];
  return out;
}
__name(subtract$3, "subtract$3");
function multiplyScalar(out, a, b) {
  out[0] = a[0] * b;
  out[1] = a[1] * b;
  out[2] = a[2] * b;
  out[3] = a[3] * b;
  out[4] = a[4] * b;
  out[5] = a[5] * b;
  out[6] = a[6] * b;
  out[7] = a[7] * b;
  out[8] = a[8] * b;
  out[9] = a[9] * b;
  out[10] = a[10] * b;
  out[11] = a[11] * b;
  out[12] = a[12] * b;
  out[13] = a[13] * b;
  out[14] = a[14] * b;
  out[15] = a[15] * b;
  return out;
}
__name(multiplyScalar, "multiplyScalar");
function multiplyScalarAndAdd(out, a, b, scale) {
  out[0] = a[0] + b[0] * scale;
  out[1] = a[1] + b[1] * scale;
  out[2] = a[2] + b[2] * scale;
  out[3] = a[3] + b[3] * scale;
  out[4] = a[4] + b[4] * scale;
  out[5] = a[5] + b[5] * scale;
  out[6] = a[6] + b[6] * scale;
  out[7] = a[7] + b[7] * scale;
  out[8] = a[8] + b[8] * scale;
  out[9] = a[9] + b[9] * scale;
  out[10] = a[10] + b[10] * scale;
  out[11] = a[11] + b[11] * scale;
  out[12] = a[12] + b[12] * scale;
  out[13] = a[13] + b[13] * scale;
  out[14] = a[14] + b[14] * scale;
  out[15] = a[15] + b[15] * scale;
  return out;
}
__name(multiplyScalarAndAdd, "multiplyScalarAndAdd");
function exactEquals$5(a, b) {
  return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3] && a[4] === b[4] && a[5] === b[5] && a[6] === b[6] && a[7] === b[7] && a[8] === b[8] && a[9] === b[9] && a[10] === b[10] && a[11] === b[11] && a[12] === b[12] && a[13] === b[13] && a[14] === b[14] && a[15] === b[15];
}
__name(exactEquals$5, "exactEquals$5");
function equals$5(a, b) {
  var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3];
  var a4 = a[4], a5 = a[5], a6 = a[6], a7 = a[7];
  var a8 = a[8], a9 = a[9], a10 = a[10], a11 = a[11];
  var a12 = a[12], a13 = a[13], a14 = a[14], a15 = a[15];
  var b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3];
  var b4 = b[4], b5 = b[5], b6 = b[6], b7 = b[7];
  var b8 = b[8], b9 = b[9], b10 = b[10], b11 = b[11];
  var b12 = b[12], b13 = b[13], b14 = b[14], b15 = b[15];
  return Math.abs(a0 - b0) <= EPSILON * Math.max(1, Math.abs(a0), Math.abs(b0)) && Math.abs(a1 - b1) <= EPSILON * Math.max(1, Math.abs(a1), Math.abs(b1)) && Math.abs(a2 - b2) <= EPSILON * Math.max(1, Math.abs(a2), Math.abs(b2)) && Math.abs(a3 - b3) <= EPSILON * Math.max(1, Math.abs(a3), Math.abs(b3)) && Math.abs(a4 - b4) <= EPSILON * Math.max(1, Math.abs(a4), Math.abs(b4)) && Math.abs(a5 - b5) <= EPSILON * Math.max(1, Math.abs(a5), Math.abs(b5)) && Math.abs(a6 - b6) <= EPSILON * Math.max(1, Math.abs(a6), Math.abs(b6)) && Math.abs(a7 - b7) <= EPSILON * Math.max(1, Math.abs(a7), Math.abs(b7)) && Math.abs(a8 - b8) <= EPSILON * Math.max(1, Math.abs(a8), Math.abs(b8)) && Math.abs(a9 - b9) <= EPSILON * Math.max(1, Math.abs(a9), Math.abs(b9)) && Math.abs(a10 - b10) <= EPSILON * Math.max(1, Math.abs(a10), Math.abs(b10)) && Math.abs(a11 - b11) <= EPSILON * Math.max(1, Math.abs(a11), Math.abs(b11)) && Math.abs(a12 - b12) <= EPSILON * Math.max(1, Math.abs(a12), Math.abs(b12)) && Math.abs(a13 - b13) <= EPSILON * Math.max(1, Math.abs(a13), Math.abs(b13)) && Math.abs(a14 - b14) <= EPSILON * Math.max(1, Math.abs(a14), Math.abs(b14)) && Math.abs(a15 - b15) <= EPSILON * Math.max(1, Math.abs(a15), Math.abs(b15));
}
__name(equals$5, "equals$5");
var mul$5 = multiply$5;
var sub$3 = subtract$3;
const mat4 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  create: create$5,
  clone: clone$5,
  copy: copy$5,
  fromValues: fromValues$5,
  set: set$5,
  identity: identity$2,
  transpose,
  invert: invert$2,
  adjoint,
  determinant,
  multiply: multiply$5,
  translate: translate$1,
  scale: scale$5,
  rotate: rotate$1,
  rotateX: rotateX$3,
  rotateY: rotateY$3,
  rotateZ: rotateZ$3,
  fromTranslation: fromTranslation$1,
  fromScaling,
  fromRotation: fromRotation$1,
  fromXRotation,
  fromYRotation,
  fromZRotation,
  fromRotationTranslation: fromRotationTranslation$1,
  fromQuat2,
  getTranslation: getTranslation$1,
  getScaling,
  getRotation,
  fromRotationTranslationScale,
  fromRotationTranslationScaleOrigin,
  fromQuat,
  frustum,
  perspectiveNO,
  perspective,
  perspectiveZO,
  perspectiveFromFieldOfView,
  orthoNO,
  ortho,
  orthoZO,
  lookAt,
  targetTo,
  str: str$5,
  frob,
  add: add$5,
  subtract: subtract$3,
  multiplyScalar,
  multiplyScalarAndAdd,
  exactEquals: exactEquals$5,
  equals: equals$5,
  mul: mul$5,
  sub: sub$3
});
function create$4() {
  var out = new ARRAY_TYPE(3);
  if (ARRAY_TYPE != Float32Array) {
    out[0] = 0;
    out[1] = 0;
    out[2] = 0;
  }
  return out;
}
__name(create$4, "create$4");
function clone$4(a) {
  var out = new ARRAY_TYPE(3);
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  return out;
}
__name(clone$4, "clone$4");
function length$4(a) {
  var x = a[0];
  var y = a[1];
  var z = a[2];
  return Math.hypot(x, y, z);
}
__name(length$4, "length$4");
function fromValues$4(x, y, z) {
  var out = new ARRAY_TYPE(3);
  out[0] = x;
  out[1] = y;
  out[2] = z;
  return out;
}
__name(fromValues$4, "fromValues$4");
function copy$4(out, a) {
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  return out;
}
__name(copy$4, "copy$4");
function set$4(out, x, y, z) {
  out[0] = x;
  out[1] = y;
  out[2] = z;
  return out;
}
__name(set$4, "set$4");
function add$4(out, a, b) {
  out[0] = a[0] + b[0];
  out[1] = a[1] + b[1];
  out[2] = a[2] + b[2];
  return out;
}
__name(add$4, "add$4");
function subtract$2(out, a, b) {
  out[0] = a[0] - b[0];
  out[1] = a[1] - b[1];
  out[2] = a[2] - b[2];
  return out;
}
__name(subtract$2, "subtract$2");
function multiply$4(out, a, b) {
  out[0] = a[0] * b[0];
  out[1] = a[1] * b[1];
  out[2] = a[2] * b[2];
  return out;
}
__name(multiply$4, "multiply$4");
function divide$2(out, a, b) {
  out[0] = a[0] / b[0];
  out[1] = a[1] / b[1];
  out[2] = a[2] / b[2];
  return out;
}
__name(divide$2, "divide$2");
function ceil$2(out, a) {
  out[0] = Math.ceil(a[0]);
  out[1] = Math.ceil(a[1]);
  out[2] = Math.ceil(a[2]);
  return out;
}
__name(ceil$2, "ceil$2");
function floor$2(out, a) {
  out[0] = Math.floor(a[0]);
  out[1] = Math.floor(a[1]);
  out[2] = Math.floor(a[2]);
  return out;
}
__name(floor$2, "floor$2");
function min$2(out, a, b) {
  out[0] = Math.min(a[0], b[0]);
  out[1] = Math.min(a[1], b[1]);
  out[2] = Math.min(a[2], b[2]);
  return out;
}
__name(min$2, "min$2");
function max$2(out, a, b) {
  out[0] = Math.max(a[0], b[0]);
  out[1] = Math.max(a[1], b[1]);
  out[2] = Math.max(a[2], b[2]);
  return out;
}
__name(max$2, "max$2");
function round$2(out, a) {
  out[0] = Math.round(a[0]);
  out[1] = Math.round(a[1]);
  out[2] = Math.round(a[2]);
  return out;
}
__name(round$2, "round$2");
function scale$4(out, a, b) {
  out[0] = a[0] * b;
  out[1] = a[1] * b;
  out[2] = a[2] * b;
  return out;
}
__name(scale$4, "scale$4");
function scaleAndAdd$2(out, a, b, scale) {
  out[0] = a[0] + b[0] * scale;
  out[1] = a[1] + b[1] * scale;
  out[2] = a[2] + b[2] * scale;
  return out;
}
__name(scaleAndAdd$2, "scaleAndAdd$2");
function distance$2(a, b) {
  var x = b[0] - a[0];
  var y = b[1] - a[1];
  var z = b[2] - a[2];
  return Math.hypot(x, y, z);
}
__name(distance$2, "distance$2");
function squaredDistance$2(a, b) {
  var x = b[0] - a[0];
  var y = b[1] - a[1];
  var z = b[2] - a[2];
  return x * x + y * y + z * z;
}
__name(squaredDistance$2, "squaredDistance$2");
function squaredLength$4(a) {
  var x = a[0];
  var y = a[1];
  var z = a[2];
  return x * x + y * y + z * z;
}
__name(squaredLength$4, "squaredLength$4");
function negate$2(out, a) {
  out[0] = -a[0];
  out[1] = -a[1];
  out[2] = -a[2];
  return out;
}
__name(negate$2, "negate$2");
function inverse$2(out, a) {
  out[0] = 1 / a[0];
  out[1] = 1 / a[1];
  out[2] = 1 / a[2];
  return out;
}
__name(inverse$2, "inverse$2");
function normalize$4(out, a) {
  var x = a[0];
  var y = a[1];
  var z = a[2];
  var len = x * x + y * y + z * z;
  if (len > 0) {
    len = 1 / Math.sqrt(len);
  }
  out[0] = a[0] * len;
  out[1] = a[1] * len;
  out[2] = a[2] * len;
  return out;
}
__name(normalize$4, "normalize$4");
function dot$4(a, b) {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}
__name(dot$4, "dot$4");
function cross$2(out, a, b) {
  var ax = a[0], ay = a[1], az = a[2];
  var bx = b[0], by = b[1], bz = b[2];
  out[0] = ay * bz - az * by;
  out[1] = az * bx - ax * bz;
  out[2] = ax * by - ay * bx;
  return out;
}
__name(cross$2, "cross$2");
function lerp$4(out, a, b, t) {
  var ax = a[0];
  var ay = a[1];
  var az = a[2];
  out[0] = ax + t * (b[0] - ax);
  out[1] = ay + t * (b[1] - ay);
  out[2] = az + t * (b[2] - az);
  return out;
}
__name(lerp$4, "lerp$4");
function hermite(out, a, b, c, d, t) {
  var factorTimes2 = t * t;
  var factor1 = factorTimes2 * (2 * t - 3) + 1;
  var factor2 = factorTimes2 * (t - 2) + t;
  var factor3 = factorTimes2 * (t - 1);
  var factor4 = factorTimes2 * (3 - 2 * t);
  out[0] = a[0] * factor1 + b[0] * factor2 + c[0] * factor3 + d[0] * factor4;
  out[1] = a[1] * factor1 + b[1] * factor2 + c[1] * factor3 + d[1] * factor4;
  out[2] = a[2] * factor1 + b[2] * factor2 + c[2] * factor3 + d[2] * factor4;
  return out;
}
__name(hermite, "hermite");
function bezier(out, a, b, c, d, t) {
  var inverseFactor = 1 - t;
  var inverseFactorTimesTwo = inverseFactor * inverseFactor;
  var factorTimes2 = t * t;
  var factor1 = inverseFactorTimesTwo * inverseFactor;
  var factor2 = 3 * t * inverseFactorTimesTwo;
  var factor3 = 3 * factorTimes2 * inverseFactor;
  var factor4 = factorTimes2 * t;
  out[0] = a[0] * factor1 + b[0] * factor2 + c[0] * factor3 + d[0] * factor4;
  out[1] = a[1] * factor1 + b[1] * factor2 + c[1] * factor3 + d[1] * factor4;
  out[2] = a[2] * factor1 + b[2] * factor2 + c[2] * factor3 + d[2] * factor4;
  return out;
}
__name(bezier, "bezier");
function random$3(out, scale) {
  scale = scale || 1;
  var r = RANDOM() * 2 * Math.PI;
  var z = RANDOM() * 2 - 1;
  var zScale = Math.sqrt(1 - z * z) * scale;
  out[0] = Math.cos(r) * zScale;
  out[1] = Math.sin(r) * zScale;
  out[2] = z * scale;
  return out;
}
__name(random$3, "random$3");
function transformMat4$2(out, a, m) {
  var x = a[0], y = a[1], z = a[2];
  var w = m[3] * x + m[7] * y + m[11] * z + m[15];
  w = w || 1;
  out[0] = (m[0] * x + m[4] * y + m[8] * z + m[12]) / w;
  out[1] = (m[1] * x + m[5] * y + m[9] * z + m[13]) / w;
  out[2] = (m[2] * x + m[6] * y + m[10] * z + m[14]) / w;
  return out;
}
__name(transformMat4$2, "transformMat4$2");
function transformMat3$1(out, a, m) {
  var x = a[0], y = a[1], z = a[2];
  out[0] = x * m[0] + y * m[3] + z * m[6];
  out[1] = x * m[1] + y * m[4] + z * m[7];
  out[2] = x * m[2] + y * m[5] + z * m[8];
  return out;
}
__name(transformMat3$1, "transformMat3$1");
function transformQuat$1(out, a, q) {
  var qx = q[0], qy = q[1], qz = q[2], qw = q[3];
  var x = a[0], y = a[1], z = a[2];
  var uvx = qy * z - qz * y, uvy = qz * x - qx * z, uvz = qx * y - qy * x;
  var uuvx = qy * uvz - qz * uvy, uuvy = qz * uvx - qx * uvz, uuvz = qx * uvy - qy * uvx;
  var w2 = qw * 2;
  uvx *= w2;
  uvy *= w2;
  uvz *= w2;
  uuvx *= 2;
  uuvy *= 2;
  uuvz *= 2;
  out[0] = x + uvx + uuvx;
  out[1] = y + uvy + uuvy;
  out[2] = z + uvz + uuvz;
  return out;
}
__name(transformQuat$1, "transformQuat$1");
function rotateX$2(out, a, b, rad) {
  var p = [], r = [];
  p[0] = a[0] - b[0];
  p[1] = a[1] - b[1];
  p[2] = a[2] - b[2];
  r[0] = p[0];
  r[1] = p[1] * Math.cos(rad) - p[2] * Math.sin(rad);
  r[2] = p[1] * Math.sin(rad) + p[2] * Math.cos(rad);
  out[0] = r[0] + b[0];
  out[1] = r[1] + b[1];
  out[2] = r[2] + b[2];
  return out;
}
__name(rotateX$2, "rotateX$2");
function rotateY$2(out, a, b, rad) {
  var p = [], r = [];
  p[0] = a[0] - b[0];
  p[1] = a[1] - b[1];
  p[2] = a[2] - b[2];
  r[0] = p[2] * Math.sin(rad) + p[0] * Math.cos(rad);
  r[1] = p[1];
  r[2] = p[2] * Math.cos(rad) - p[0] * Math.sin(rad);
  out[0] = r[0] + b[0];
  out[1] = r[1] + b[1];
  out[2] = r[2] + b[2];
  return out;
}
__name(rotateY$2, "rotateY$2");
function rotateZ$2(out, a, b, rad) {
  var p = [], r = [];
  p[0] = a[0] - b[0];
  p[1] = a[1] - b[1];
  p[2] = a[2] - b[2];
  r[0] = p[0] * Math.cos(rad) - p[1] * Math.sin(rad);
  r[1] = p[0] * Math.sin(rad) + p[1] * Math.cos(rad);
  r[2] = p[2];
  out[0] = r[0] + b[0];
  out[1] = r[1] + b[1];
  out[2] = r[2] + b[2];
  return out;
}
__name(rotateZ$2, "rotateZ$2");
function angle$1(a, b) {
  var ax = a[0], ay = a[1], az = a[2], bx = b[0], by = b[1], bz = b[2], mag1 = Math.sqrt(ax * ax + ay * ay + az * az), mag2 = Math.sqrt(bx * bx + by * by + bz * bz), mag = mag1 * mag2, cosine = mag && dot$4(a, b) / mag;
  return Math.acos(Math.min(Math.max(cosine, -1), 1));
}
__name(angle$1, "angle$1");
function zero$2(out) {
  out[0] = 0;
  out[1] = 0;
  out[2] = 0;
  return out;
}
__name(zero$2, "zero$2");
function str$4(a) {
  return "vec3(" + a[0] + ", " + a[1] + ", " + a[2] + ")";
}
__name(str$4, "str$4");
function exactEquals$4(a, b) {
  return a[0] === b[0] && a[1] === b[1] && a[2] === b[2];
}
__name(exactEquals$4, "exactEquals$4");
function equals$4(a, b) {
  var a0 = a[0], a1 = a[1], a2 = a[2];
  var b0 = b[0], b1 = b[1], b2 = b[2];
  return Math.abs(a0 - b0) <= EPSILON * Math.max(1, Math.abs(a0), Math.abs(b0)) && Math.abs(a1 - b1) <= EPSILON * Math.max(1, Math.abs(a1), Math.abs(b1)) && Math.abs(a2 - b2) <= EPSILON * Math.max(1, Math.abs(a2), Math.abs(b2));
}
__name(equals$4, "equals$4");
var sub$2 = subtract$2;
var mul$4 = multiply$4;
var div$2 = divide$2;
var dist$2 = distance$2;
var sqrDist$2 = squaredDistance$2;
var len$4 = length$4;
var sqrLen$4 = squaredLength$4;
var forEach$2 = function() {
  var vec = create$4();
  return function(a, stride, offset, count, fn, arg) {
    var i, l;
    if (!stride) {
      stride = 3;
    }
    if (!offset) {
      offset = 0;
    }
    if (count) {
      l = Math.min(count * stride + offset, a.length);
    } else {
      l = a.length;
    }
    for (i = offset; i < l; i += stride) {
      vec[0] = a[i];
      vec[1] = a[i + 1];
      vec[2] = a[i + 2];
      fn(vec, vec, arg);
      a[i] = vec[0];
      a[i + 1] = vec[1];
      a[i + 2] = vec[2];
    }
    return a;
  };
}();
const vec3 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  create: create$4,
  clone: clone$4,
  length: length$4,
  fromValues: fromValues$4,
  copy: copy$4,
  set: set$4,
  add: add$4,
  subtract: subtract$2,
  multiply: multiply$4,
  divide: divide$2,
  ceil: ceil$2,
  floor: floor$2,
  min: min$2,
  max: max$2,
  round: round$2,
  scale: scale$4,
  scaleAndAdd: scaleAndAdd$2,
  distance: distance$2,
  squaredDistance: squaredDistance$2,
  squaredLength: squaredLength$4,
  negate: negate$2,
  inverse: inverse$2,
  normalize: normalize$4,
  dot: dot$4,
  cross: cross$2,
  lerp: lerp$4,
  hermite,
  bezier,
  random: random$3,
  transformMat4: transformMat4$2,
  transformMat3: transformMat3$1,
  transformQuat: transformQuat$1,
  rotateX: rotateX$2,
  rotateY: rotateY$2,
  rotateZ: rotateZ$2,
  angle: angle$1,
  zero: zero$2,
  str: str$4,
  exactEquals: exactEquals$4,
  equals: equals$4,
  sub: sub$2,
  mul: mul$4,
  div: div$2,
  dist: dist$2,
  sqrDist: sqrDist$2,
  len: len$4,
  sqrLen: sqrLen$4,
  forEach: forEach$2
});
function create$3() {
  var out = new ARRAY_TYPE(4);
  if (ARRAY_TYPE != Float32Array) {
    out[0] = 0;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
  }
  return out;
}
__name(create$3, "create$3");
function normalize$3(out, a) {
  var x = a[0];
  var y = a[1];
  var z = a[2];
  var w = a[3];
  var len = x * x + y * y + z * z + w * w;
  if (len > 0) {
    len = 1 / Math.sqrt(len);
  }
  out[0] = x * len;
  out[1] = y * len;
  out[2] = z * len;
  out[3] = w * len;
  return out;
}
__name(normalize$3, "normalize$3");
(function() {
  var vec = create$3();
  return function(a, stride, offset, count, fn, arg) {
    var i, l;
    if (!stride) {
      stride = 4;
    }
    if (!offset) {
      offset = 0;
    }
    if (count) {
      l = Math.min(count * stride + offset, a.length);
    } else {
      l = a.length;
    }
    for (i = offset; i < l; i += stride) {
      vec[0] = a[i];
      vec[1] = a[i + 1];
      vec[2] = a[i + 2];
      vec[3] = a[i + 3];
      fn(vec, vec, arg);
      a[i] = vec[0];
      a[i + 1] = vec[1];
      a[i + 2] = vec[2];
      a[i + 3] = vec[3];
    }
    return a;
  };
})();
function create$2() {
  var out = new ARRAY_TYPE(4);
  if (ARRAY_TYPE != Float32Array) {
    out[0] = 0;
    out[1] = 0;
    out[2] = 0;
  }
  out[3] = 1;
  return out;
}
__name(create$2, "create$2");
function setAxisAngle(out, axis, rad) {
  rad = rad * 0.5;
  var s = Math.sin(rad);
  out[0] = s * axis[0];
  out[1] = s * axis[1];
  out[2] = s * axis[2];
  out[3] = Math.cos(rad);
  return out;
}
__name(setAxisAngle, "setAxisAngle");
function slerp(out, a, b, t) {
  var ax = a[0], ay = a[1], az = a[2], aw = a[3];
  var bx = b[0], by = b[1], bz = b[2], bw = b[3];
  var omega, cosom, sinom, scale0, scale1;
  cosom = ax * bx + ay * by + az * bz + aw * bw;
  if (cosom < 0) {
    cosom = -cosom;
    bx = -bx;
    by = -by;
    bz = -bz;
    bw = -bw;
  }
  if (1 - cosom > EPSILON) {
    omega = Math.acos(cosom);
    sinom = Math.sin(omega);
    scale0 = Math.sin((1 - t) * omega) / sinom;
    scale1 = Math.sin(t * omega) / sinom;
  } else {
    scale0 = 1 - t;
    scale1 = t;
  }
  out[0] = scale0 * ax + scale1 * bx;
  out[1] = scale0 * ay + scale1 * by;
  out[2] = scale0 * az + scale1 * bz;
  out[3] = scale0 * aw + scale1 * bw;
  return out;
}
__name(slerp, "slerp");
function fromMat3(out, m) {
  var fTrace = m[0] + m[4] + m[8];
  var fRoot;
  if (fTrace > 0) {
    fRoot = Math.sqrt(fTrace + 1);
    out[3] = 0.5 * fRoot;
    fRoot = 0.5 / fRoot;
    out[0] = (m[5] - m[7]) * fRoot;
    out[1] = (m[6] - m[2]) * fRoot;
    out[2] = (m[1] - m[3]) * fRoot;
  } else {
    var i = 0;
    if (m[4] > m[0])
      i = 1;
    if (m[8] > m[i * 3 + i])
      i = 2;
    var j = (i + 1) % 3;
    var k = (i + 2) % 3;
    fRoot = Math.sqrt(m[i * 3 + i] - m[j * 3 + j] - m[k * 3 + k] + 1);
    out[i] = 0.5 * fRoot;
    fRoot = 0.5 / fRoot;
    out[3] = (m[j * 3 + k] - m[k * 3 + j]) * fRoot;
    out[j] = (m[j * 3 + i] + m[i * 3 + j]) * fRoot;
    out[k] = (m[k * 3 + i] + m[i * 3 + k]) * fRoot;
  }
  return out;
}
__name(fromMat3, "fromMat3");
var normalize$2 = normalize$3;
(function() {
  var tmpvec3 = create$4();
  var xUnitVec3 = fromValues$4(1, 0, 0);
  var yUnitVec3 = fromValues$4(0, 1, 0);
  return function(out, a, b) {
    var dot = dot$4(a, b);
    if (dot < -0.999999) {
      cross$2(tmpvec3, xUnitVec3, a);
      if (len$4(tmpvec3) < 1e-6)
        cross$2(tmpvec3, yUnitVec3, a);
      normalize$4(tmpvec3, tmpvec3);
      setAxisAngle(out, tmpvec3, Math.PI);
      return out;
    } else if (dot > 0.999999) {
      out[0] = 0;
      out[1] = 0;
      out[2] = 0;
      out[3] = 1;
      return out;
    } else {
      cross$2(tmpvec3, a, b);
      out[0] = tmpvec3[0];
      out[1] = tmpvec3[1];
      out[2] = tmpvec3[2];
      out[3] = 1 + dot;
      return normalize$2(out, out);
    }
  };
})();
(function() {
  var temp1 = create$2();
  var temp2 = create$2();
  return function(out, a, b, c, d, t) {
    slerp(temp1, a, d, t);
    slerp(temp2, b, c, t);
    slerp(out, temp1, temp2, 2 * t * (1 - t));
    return out;
  };
})();
(function() {
  var matr = create$6();
  return function(out, view, right, up) {
    matr[0] = right[0];
    matr[3] = right[1];
    matr[6] = right[2];
    matr[1] = up[0];
    matr[4] = up[1];
    matr[7] = up[2];
    matr[2] = -view[0];
    matr[5] = -view[1];
    matr[8] = -view[2];
    return normalize$2(out, fromMat3(out, matr));
  };
})();
function create() {
  var out = new ARRAY_TYPE(2);
  if (ARRAY_TYPE != Float32Array) {
    out[0] = 0;
    out[1] = 0;
  }
  return out;
}
__name(create, "create");
(function() {
  var vec = create();
  return function(a, stride, offset, count, fn, arg) {
    var i, l;
    if (!stride) {
      stride = 2;
    }
    if (!offset) {
      offset = 0;
    }
    if (count) {
      l = Math.min(count * stride + offset, a.length);
    } else {
      l = a.length;
    }
    for (i = offset; i < l; i += stride) {
      vec[0] = a[i];
      vec[1] = a[i + 1];
      fn(vec, vec, arg);
      a[i] = vec[0];
      a[i + 1] = vec[1];
    }
    return a;
  };
})();
class AnimationControl {
  #animationData;
  #finishedPromise;
  #willFinish;
  static #voidControl = new AnimationControl(null);
  static get voidControl() {
    return this.#voidControl;
  }
  constructor(animationData, willFinish = false) {
    this.#animationData = animationData;
    this.#willFinish = willFinish;
    if (animationData !== null && typeof animationData === "object") {
      animationData.control = this;
    }
  }
  get finished() {
    if (!(this.#finishedPromise instanceof Promise)) {
      this.#finishedPromise = this.#willFinish ? new Promise((resolve) => this.#animationData.resolve = resolve) : Promise.resolve();
    }
    return this.#finishedPromise;
  }
  get isActive() {
    return this.#animationData.active;
  }
  get isFinished() {
    return this.#animationData.finished;
  }
  cancel() {
    const animationData = this.#animationData;
    if (animationData === null || animationData === void 0) {
      return;
    }
    animationData.cancelled = true;
  }
}
__name(AnimationControl, "AnimationControl");
class AnimationManager {
  static activeList = [];
  static newList = [];
  static current;
  static add(data) {
    const now2 = performance.now();
    data.start = now2 + (AnimationManager.current - now2);
    AnimationManager.newList.push(data);
  }
  static animate() {
    const current = AnimationManager.current = performance.now();
    if (AnimationManager.activeList.length === 0 && AnimationManager.newList.length === 0) {
      globalThis.requestAnimationFrame(AnimationManager.animate);
      return;
    }
    if (AnimationManager.newList.length) {
      for (let cntr = AnimationManager.newList.length; --cntr >= 0; ) {
        const data = AnimationManager.newList[cntr];
        if (data.cancelled) {
          AnimationManager.newList.splice(cntr, 1);
          data.cleanup(data);
        }
        if (data.active) {
          AnimationManager.newList.splice(cntr, 1);
          AnimationManager.activeList.push(data);
        }
      }
    }
    for (let cntr = AnimationManager.activeList.length; --cntr >= 0; ) {
      const data = AnimationManager.activeList[cntr];
      if (data.cancelled || data.el !== void 0 && !data.el.isConnected) {
        AnimationManager.activeList.splice(cntr, 1);
        data.cleanup(data);
        continue;
      }
      data.current = current - data.start;
      if (data.current >= data.duration) {
        for (let dataCntr = data.keys.length; --dataCntr >= 0; ) {
          const key = data.keys[dataCntr];
          data.newData[key] = data.destination[key];
        }
        data.position.set(data.newData);
        AnimationManager.activeList.splice(cntr, 1);
        data.cleanup(data);
        continue;
      }
      const easedTime = data.ease(data.current / data.duration);
      for (let dataCntr = data.keys.length; --dataCntr >= 0; ) {
        const key = data.keys[dataCntr];
        data.newData[key] = data.interpolate(data.initial[key], data.destination[key], easedTime);
      }
      data.position.set(data.newData);
    }
    globalThis.requestAnimationFrame(AnimationManager.animate);
  }
  static cancel(position) {
    for (let cntr = AnimationManager.activeList.length; --cntr >= 0; ) {
      const data = AnimationManager.activeList[cntr];
      if (data.position === position) {
        AnimationManager.activeList.splice(cntr, 1);
        data.cancelled = true;
        data.cleanup(data);
      }
    }
    for (let cntr = AnimationManager.newList.length; --cntr >= 0; ) {
      const data = AnimationManager.newList[cntr];
      if (data.position === position) {
        AnimationManager.newList.splice(cntr, 1);
        data.cancelled = true;
        data.cleanup(data);
      }
    }
  }
  static cancelAll() {
    for (let cntr = AnimationManager.activeList.length; --cntr >= 0; ) {
      const data = AnimationManager.activeList[cntr];
      data.cancelled = true;
      data.cleanup(data);
    }
    for (let cntr = AnimationManager.newList.length; --cntr >= 0; ) {
      const data = AnimationManager.newList[cntr];
      data.cancelled = true;
      data.cleanup(data);
    }
    AnimationManager.activeList.length = 0;
    AnimationManager.newList.length = 0;
  }
  static getScheduled(position) {
    const results = [];
    for (let cntr = AnimationManager.activeList.length; --cntr >= 0; ) {
      const data = AnimationManager.activeList[cntr];
      if (data.position === position) {
        results.push(data.control);
      }
    }
    for (let cntr = AnimationManager.newList.length; --cntr >= 0; ) {
      const data = AnimationManager.newList[cntr];
      if (data.position === position) {
        results.push(data.control);
      }
    }
    return results;
  }
}
__name(AnimationManager, "AnimationManager");
AnimationManager.animate();
const animateKeys = /* @__PURE__ */ new Set([
  "left",
  "top",
  "maxWidth",
  "maxHeight",
  "minWidth",
  "minHeight",
  "width",
  "height",
  "rotateX",
  "rotateY",
  "rotateZ",
  "scale",
  "translateX",
  "translateY",
  "translateZ",
  "zIndex",
  "rotation"
]);
const transformKeys = ["rotateX", "rotateY", "rotateZ", "scale", "translateX", "translateY", "translateZ"];
Object.freeze(transformKeys);
const relativeRegex = /^([-+*])=(-?[\d]*\.?[\d]+)$/;
const numericDefaults = {
  height: 0,
  left: 0,
  maxHeight: null,
  maxWidth: null,
  minHeight: null,
  minWidth: null,
  top: 0,
  transformOrigin: null,
  width: 0,
  zIndex: null,
  rotateX: 0,
  rotateY: 0,
  rotateZ: 0,
  scale: 1,
  translateX: 0,
  translateY: 0,
  translateZ: 0,
  rotation: 0
};
Object.freeze(numericDefaults);
function setNumericDefaults(data) {
  if (data.rotateX === null) {
    data.rotateX = 0;
  }
  if (data.rotateY === null) {
    data.rotateY = 0;
  }
  if (data.rotateZ === null) {
    data.rotateZ = 0;
  }
  if (data.translateX === null) {
    data.translateX = 0;
  }
  if (data.translateY === null) {
    data.translateY = 0;
  }
  if (data.translateZ === null) {
    data.translateZ = 0;
  }
  if (data.scale === null) {
    data.scale = 1;
  }
  if (data.rotation === null) {
    data.rotation = 0;
  }
}
__name(setNumericDefaults, "setNumericDefaults");
const transformKeysBitwise = {
  rotateX: 1,
  rotateY: 2,
  rotateZ: 4,
  scale: 8,
  translateX: 16,
  translateY: 32,
  translateZ: 64
};
Object.freeze(transformKeysBitwise);
const transformOriginDefault = "top left";
const transformOrigins = [
  "top left",
  "top center",
  "top right",
  "center left",
  "center",
  "center right",
  "bottom left",
  "bottom center",
  "bottom right"
];
Object.freeze(transformOrigins);
function convertRelative(positionData, position) {
  for (const key in positionData) {
    if (animateKeys.has(key)) {
      const value = positionData[key];
      if (typeof value !== "string") {
        continue;
      }
      if (value === "auto" || value === "inherit") {
        continue;
      }
      const regexResults = relativeRegex.exec(value);
      if (!regexResults) {
        throw new Error(
          `convertRelative error: malformed relative key (${key}) with value (${value})`
        );
      }
      const current = position[key];
      switch (regexResults[1]) {
        case "-":
          positionData[key] = current - parseFloat(regexResults[2]);
          break;
        case "+":
          positionData[key] = current + parseFloat(regexResults[2]);
          break;
        case "*":
          positionData[key] = current * parseFloat(regexResults[2]);
          break;
      }
    }
  }
}
__name(convertRelative, "convertRelative");
class AnimationAPI {
  #data;
  #position;
  #instanceCount = 0;
  #cleanup;
  constructor(position, data) {
    this.#position = position;
    this.#data = data;
    this.#cleanup = this.#cleanupInstance.bind(this);
  }
  get isScheduled() {
    return this.#instanceCount > 0;
  }
  #addAnimation(initial, destination, duration, el, delay, ease, interpolate) {
    setNumericDefaults(initial);
    setNumericDefaults(destination);
    for (const key in initial) {
      if (!Number.isFinite(initial[key])) {
        delete initial[key];
      }
    }
    const keys = Object.keys(initial);
    const newData = Object.assign({ immediateElementUpdate: true }, initial);
    if (keys.length === 0) {
      return AnimationControl.voidControl;
    }
    const animationData = {
      active: true,
      cleanup: this.#cleanup,
      cancelled: false,
      control: void 0,
      current: 0,
      destination,
      duration: duration * 1e3,
      ease,
      el,
      finished: false,
      initial,
      interpolate,
      keys,
      newData,
      position: this.#position,
      resolve: void 0,
      start: void 0
    };
    if (delay > 0) {
      animationData.active = false;
      setTimeout(() => {
        if (!animationData.cancelled) {
          animationData.active = true;
          const now2 = performance.now();
          animationData.start = now2 + (AnimationManager.current - now2);
        }
      }, delay * 1e3);
    }
    this.#instanceCount++;
    AnimationManager.add(animationData);
    return new AnimationControl(animationData, true);
  }
  cancel() {
    AnimationManager.cancel(this.#position);
  }
  #cleanupInstance(data) {
    this.#instanceCount--;
    data.active = false;
    data.finished = true;
    if (typeof data.resolve === "function") {
      data.resolve(data.cancelled);
    }
  }
  getScheduled() {
    return AnimationManager.getScheduled(this.#position);
  }
  from(fromData, { delay = 0, duration = 1, ease = cubicOut, interpolate = lerp$5 } = {}) {
    if (!isObject(fromData)) {
      throw new TypeError(`AnimationAPI.from error: 'fromData' is not an object.`);
    }
    const position = this.#position;
    const parent = position.parent;
    if (parent !== void 0 && typeof parent?.options?.positionable === "boolean" && !parent?.options?.positionable) {
      return AnimationControl.voidControl;
    }
    const targetEl = parent instanceof HTMLElement ? parent : parent?.elementTarget;
    const el = targetEl instanceof HTMLElement && targetEl.isConnected ? targetEl : void 0;
    if (!Number.isFinite(delay) || delay < 0) {
      throw new TypeError(`AnimationAPI.from error: 'delay' is not a positive number.`);
    }
    if (!Number.isFinite(duration) || duration < 0) {
      throw new TypeError(`AnimationAPI.from error: 'duration' is not a positive number.`);
    }
    if (typeof ease !== "function") {
      throw new TypeError(`AnimationAPI.from error: 'ease' is not a function.`);
    }
    if (typeof interpolate !== "function") {
      throw new TypeError(`AnimationAPI.from error: 'interpolate' is not a function.`);
    }
    const initial = {};
    const destination = {};
    const data = this.#data;
    for (const key in fromData) {
      if (data[key] !== void 0 && fromData[key] !== data[key]) {
        initial[key] = fromData[key];
        destination[key] = data[key];
      }
    }
    convertRelative(initial, data);
    return this.#addAnimation(initial, destination, duration, el, delay, ease, interpolate);
  }
  fromTo(fromData, toData, { delay = 0, duration = 1, ease = cubicOut, interpolate = lerp$5 } = {}) {
    if (!isObject(fromData)) {
      throw new TypeError(`AnimationAPI.fromTo error: 'fromData' is not an object.`);
    }
    if (!isObject(toData)) {
      throw new TypeError(`AnimationAPI.fromTo error: 'toData' is not an object.`);
    }
    const parent = this.#position.parent;
    if (parent !== void 0 && typeof parent?.options?.positionable === "boolean" && !parent?.options?.positionable) {
      return AnimationControl.voidControl;
    }
    const targetEl = parent instanceof HTMLElement ? parent : parent?.elementTarget;
    const el = targetEl instanceof HTMLElement && targetEl.isConnected ? targetEl : void 0;
    if (!Number.isFinite(delay) || delay < 0) {
      throw new TypeError(`AnimationAPI.fromTo error: 'delay' is not a positive number.`);
    }
    if (!Number.isFinite(duration) || duration < 0) {
      throw new TypeError(`AnimationAPI.fromTo error: 'duration' is not a positive number.`);
    }
    if (typeof ease !== "function") {
      throw new TypeError(`AnimationAPI.fromTo error: 'ease' is not a function.`);
    }
    if (typeof interpolate !== "function") {
      throw new TypeError(`AnimationAPI.fromTo error: 'interpolate' is not a function.`);
    }
    const initial = {};
    const destination = {};
    const data = this.#data;
    for (const key in fromData) {
      if (toData[key] === void 0) {
        console.warn(
          `AnimationAPI.fromTo warning: key ('${key}') from 'fromData' missing in 'toData'; skipping this key.`
        );
        continue;
      }
      if (data[key] !== void 0) {
        initial[key] = fromData[key];
        destination[key] = toData[key];
      }
    }
    convertRelative(initial, data);
    convertRelative(destination, data);
    return this.#addAnimation(initial, destination, duration, el, delay, ease, interpolate);
  }
  to(toData, { delay = 0, duration = 1, ease = cubicOut, interpolate = lerp$5 } = {}) {
    if (!isObject(toData)) {
      throw new TypeError(`AnimationAPI.to error: 'toData' is not an object.`);
    }
    const parent = this.#position.parent;
    if (parent !== void 0 && typeof parent?.options?.positionable === "boolean" && !parent?.options?.positionable) {
      return AnimationControl.voidControl;
    }
    const targetEl = parent instanceof HTMLElement ? parent : parent?.elementTarget;
    const el = targetEl instanceof HTMLElement && targetEl.isConnected ? targetEl : void 0;
    if (!Number.isFinite(delay) || delay < 0) {
      throw new TypeError(`AnimationAPI.to error: 'delay' is not a positive number.`);
    }
    if (!Number.isFinite(duration) || duration < 0) {
      throw new TypeError(`AnimationAPI.to error: 'duration' is not a positive number.`);
    }
    if (typeof ease !== "function") {
      throw new TypeError(`AnimationAPI.to error: 'ease' is not a function.`);
    }
    if (typeof interpolate !== "function") {
      throw new TypeError(`AnimationAPI.to error: 'interpolate' is not a function.`);
    }
    const initial = {};
    const destination = {};
    const data = this.#data;
    for (const key in toData) {
      if (data[key] !== void 0 && toData[key] !== data[key]) {
        destination[key] = toData[key];
        initial[key] = data[key];
      }
    }
    convertRelative(destination, data);
    return this.#addAnimation(initial, destination, duration, el, delay, ease, interpolate);
  }
  quickTo(keys, { duration = 1, ease = cubicOut, interpolate = lerp$5 } = {}) {
    if (!isIterable(keys)) {
      throw new TypeError(`AnimationAPI.quickTo error: 'keys' is not an iterable list.`);
    }
    const parent = this.#position.parent;
    if (parent !== void 0 && typeof parent?.options?.positionable === "boolean" && !parent?.options?.positionable) {
      throw new Error(`AnimationAPI.quickTo error: 'parent' is not positionable.`);
    }
    if (!Number.isFinite(duration) || duration < 0) {
      throw new TypeError(`AnimationAPI.quickTo error: 'duration' is not a positive number.`);
    }
    if (typeof ease !== "function") {
      throw new TypeError(`AnimationAPI.quickTo error: 'ease' is not a function.`);
    }
    if (typeof interpolate !== "function") {
      throw new TypeError(`AnimationAPI.quickTo error: 'interpolate' is not a function.`);
    }
    const initial = {};
    const destination = {};
    const data = this.#data;
    for (const key of keys) {
      if (typeof key !== "string") {
        throw new TypeError(`AnimationAPI.quickTo error: key is not a string.`);
      }
      if (!animateKeys.has(key)) {
        throw new Error(`AnimationAPI.quickTo error: key ('${key}') is not animatable.`);
      }
      if (data[key] !== void 0) {
        destination[key] = data[key];
        initial[key] = data[key];
      }
    }
    const keysArray = [...keys];
    Object.freeze(keysArray);
    const newData = Object.assign({ immediateElementUpdate: true }, initial);
    const animationData = {
      active: true,
      cleanup: this.#cleanup,
      cancelled: false,
      control: void 0,
      current: 0,
      destination,
      duration: duration * 1e3,
      ease,
      el: void 0,
      finished: true,
      initial,
      interpolate,
      keys,
      newData,
      position: this.#position,
      resolve: void 0,
      start: void 0
    };
    const quickToCB = /* @__PURE__ */ __name((...args) => {
      const argsLength = args.length;
      if (argsLength === 0) {
        return;
      }
      for (let cntr = keysArray.length; --cntr >= 0; ) {
        const key = keysArray[cntr];
        if (data[key] !== void 0) {
          initial[key] = data[key];
        }
      }
      if (isObject(args[0])) {
        const objData = args[0];
        for (const key in objData) {
          if (destination[key] !== void 0) {
            destination[key] = objData[key];
          }
        }
      } else {
        for (let cntr = 0; cntr < argsLength && cntr < keysArray.length; cntr++) {
          const key = keysArray[cntr];
          if (destination[key] !== void 0) {
            destination[key] = args[cntr];
          }
        }
      }
      convertRelative(destination, data);
      setNumericDefaults(initial);
      setNumericDefaults(destination);
      const targetEl = parent instanceof HTMLElement ? parent : parent?.elementTarget;
      animationData.el = targetEl instanceof HTMLElement && targetEl.isConnected ? targetEl : void 0;
      if (animationData.finished) {
        animationData.finished = false;
        animationData.active = true;
        animationData.current = 0;
        this.#instanceCount++;
        AnimationManager.add(animationData);
      } else {
        const now2 = performance.now();
        animationData.start = now2 + (AnimationManager.current - now2);
        animationData.current = 0;
      }
    }, "quickToCB");
    quickToCB.keys = keysArray;
    quickToCB.options = ({ duration: duration2, ease: ease2, interpolate: interpolate2 } = {}) => {
      if (duration2 !== void 0 && (!Number.isFinite(duration2) || duration2 < 0)) {
        throw new TypeError(`AnimationAPI.quickTo.options error: 'duration' is not a positive number.`);
      }
      if (ease2 !== void 0 && typeof ease2 !== "function") {
        throw new TypeError(`AnimationAPI.quickTo.options error: 'ease' is not a function.`);
      }
      if (interpolate2 !== void 0 && typeof interpolate2 !== "function") {
        throw new TypeError(`AnimationAPI.quickTo.options error: 'interpolate' is not a function.`);
      }
      if (duration2 >= 0) {
        animationData.duration = duration2 * 1e3;
      }
      if (ease2) {
        animationData.ease = ease2;
      }
      if (interpolate2) {
        animationData.interpolate = interpolate2;
      }
      return quickToCB;
    };
    return quickToCB;
  }
}
__name(AnimationAPI, "AnimationAPI");
class AnimationGroupControl {
  #animationControls;
  #finishedPromise;
  static #voidControl = new AnimationGroupControl(null);
  static get voidControl() {
    return this.#voidControl;
  }
  constructor(animationControls) {
    this.#animationControls = animationControls;
  }
  get finished() {
    const animationControls = this.#animationControls;
    if (animationControls === null || animationControls === void 0) {
      return Promise.resolve();
    }
    if (!(this.#finishedPromise instanceof Promise)) {
      const promises = [];
      for (let cntr = animationControls.length; --cntr >= 0; ) {
        promises.push(animationControls[cntr].finished);
      }
      this.#finishedPromise = Promise.all(promises);
    }
    return this.#finishedPromise;
  }
  get isActive() {
    const animationControls = this.#animationControls;
    if (animationControls === null || animationControls === void 0) {
      return false;
    }
    for (let cntr = animationControls.length; --cntr >= 0; ) {
      if (animationControls[cntr].isActive) {
        return true;
      }
    }
    return false;
  }
  get isFinished() {
    const animationControls = this.#animationControls;
    if (animationControls === null || animationControls === void 0) {
      return true;
    }
    for (let cntr = animationControls.length; --cntr >= 0; ) {
      if (!animationControls[cntr].isFinished) {
        return false;
      }
    }
    return false;
  }
  cancel() {
    const animationControls = this.#animationControls;
    if (animationControls === null || animationControls === void 0) {
      return;
    }
    for (let cntr = this.#animationControls.length; --cntr >= 0; ) {
      this.#animationControls[cntr].cancel();
    }
  }
}
__name(AnimationGroupControl, "AnimationGroupControl");
class AnimationGroupAPI {
  static #isPosition(object) {
    return object !== null && typeof object === "object" && object.animate instanceof AnimationAPI;
  }
  static cancel(position) {
    if (isIterable(position)) {
      let index = -1;
      for (const entry of position) {
        index++;
        const actualPosition = this.#isPosition(entry) ? entry : entry.position;
        if (!this.#isPosition(actualPosition)) {
          console.warn(`AnimationGroupAPI.cancel warning: No Position instance found at index: ${index}.`);
          continue;
        }
        AnimationManager.cancel(actualPosition);
      }
    } else {
      const actualPosition = this.#isPosition(position) ? position : position.position;
      if (!this.#isPosition(actualPosition)) {
        console.warn(`AnimationGroupAPI.cancel warning: No Position instance found.`);
        return;
      }
      AnimationManager.cancel(actualPosition);
    }
  }
  static cancelAll() {
    AnimationManager.cancelAll();
  }
  static getScheduled(position) {
    const results = [];
    if (isIterable(position)) {
      let index = -1;
      for (const entry of position) {
        index++;
        const isPosition = this.#isPosition(entry);
        const actualPosition = isPosition ? entry : entry.position;
        if (!this.#isPosition(actualPosition)) {
          console.warn(`AnimationGroupAPI.getScheduled warning: No Position instance found at index: ${index}.`);
          continue;
        }
        const controls = AnimationManager.getScheduled(actualPosition);
        results.push({ position: actualPosition, data: isPosition ? void 0 : entry, controls });
      }
    } else {
      const isPosition = this.#isPosition(position);
      const actualPosition = isPosition ? position : position.position;
      if (!this.#isPosition(actualPosition)) {
        console.warn(`AnimationGroupAPI.getScheduled warning: No Position instance found.`);
        return results;
      }
      const controls = AnimationManager.getScheduled(actualPosition);
      results.push({ position: actualPosition, data: isPosition ? void 0 : position, controls });
    }
    return results;
  }
  static from(position, fromData, options) {
    if (!isObject(fromData) && typeof fromData !== "function") {
      throw new TypeError(`AnimationGroupAPI.from error: 'fromData' is not an object or function.`);
    }
    if (options !== void 0 && !isObject(options) && typeof options !== "function") {
      throw new TypeError(`AnimationGroupAPI.from error: 'options' is not an object or function.`);
    }
    const animationControls = [];
    let index = -1;
    let callbackOptions;
    const hasDataCallback = typeof fromData === "function";
    const hasOptionCallback = typeof options === "function";
    const hasCallback = hasDataCallback || hasOptionCallback;
    if (hasCallback) {
      callbackOptions = { index, position: void 0, data: void 0 };
    }
    let actualFromData = fromData;
    let actualOptions = options;
    if (isIterable(position)) {
      for (const entry of position) {
        index++;
        const isPosition = this.#isPosition(entry);
        const actualPosition = isPosition ? entry : entry.position;
        if (!this.#isPosition(actualPosition)) {
          console.warn(`AnimationGroupAPI.from warning: No Position instance found at index: ${index}.`);
          continue;
        }
        if (hasCallback) {
          callbackOptions.index = index;
          callbackOptions.position = position;
          callbackOptions.data = isPosition ? void 0 : entry;
        }
        if (hasDataCallback) {
          actualFromData = fromData(callbackOptions);
          if (actualFromData === null || actualFromData === void 0) {
            continue;
          }
          if (typeof actualFromData !== "object") {
            throw new TypeError(`AnimationGroupAPI.from error: fromData callback function iteration(${index}) failed to return an object.`);
          }
        }
        if (hasOptionCallback) {
          actualOptions = options(callbackOptions);
          if (actualOptions === null || actualOptions === void 0) {
            continue;
          }
          if (typeof actualOptions !== "object") {
            throw new TypeError(`AnimationGroupAPI.from error: options callback function iteration(${index}) failed to return an object.`);
          }
        }
        animationControls.push(actualPosition.animate.from(actualFromData, actualOptions));
      }
    } else {
      const isPosition = this.#isPosition(position);
      const actualPosition = isPosition ? position : position.position;
      if (!this.#isPosition(actualPosition)) {
        console.warn(`AnimationGroupAPI.from warning: No Position instance found.`);
        return AnimationGroupControl.voidControl;
      }
      if (hasCallback) {
        callbackOptions.index = 0;
        callbackOptions.position = position;
        callbackOptions.data = isPosition ? void 0 : position;
      }
      if (hasDataCallback) {
        actualFromData = fromData(callbackOptions);
        if (typeof actualFromData !== "object") {
          throw new TypeError(
            `AnimationGroupAPI.from error: fromData callback function failed to return an object.`
          );
        }
      }
      if (hasOptionCallback) {
        actualOptions = options(callbackOptions);
        if (typeof actualOptions !== "object") {
          throw new TypeError(
            `AnimationGroupAPI.from error: options callback function failed to return an object.`
          );
        }
      }
      animationControls.push(actualPosition.animate.from(actualFromData, actualOptions));
    }
    return new AnimationGroupControl(animationControls);
  }
  static fromTo(position, fromData, toData, options) {
    if (!isObject(fromData) && typeof fromData !== "function") {
      throw new TypeError(`AnimationGroupAPI.fromTo error: 'fromData' is not an object or function.`);
    }
    if (!isObject(toData) && typeof toData !== "function") {
      throw new TypeError(`AnimationGroupAPI.fromTo error: 'toData' is not an object or function.`);
    }
    if (options !== void 0 && !isObject(options) && typeof options !== "function") {
      throw new TypeError(`AnimationGroupAPI.fromTo error: 'options' is not an object or function.`);
    }
    const animationControls = [];
    let index = -1;
    let callbackOptions;
    const hasFromCallback = typeof fromData === "function";
    const hasToCallback = typeof toData === "function";
    const hasOptionCallback = typeof options === "function";
    const hasCallback = hasFromCallback || hasToCallback || hasOptionCallback;
    if (hasCallback) {
      callbackOptions = { index, position: void 0, data: void 0 };
    }
    let actualFromData = fromData;
    let actualToData = toData;
    let actualOptions = options;
    if (isIterable(position)) {
      for (const entry of position) {
        index++;
        const isPosition = this.#isPosition(entry);
        const actualPosition = isPosition ? entry : entry.position;
        if (!this.#isPosition(actualPosition)) {
          console.warn(`AnimationGroupAPI.fromTo warning: No Position instance found at index: ${index}.`);
          continue;
        }
        if (hasCallback) {
          callbackOptions.index = index;
          callbackOptions.position = position;
          callbackOptions.data = isPosition ? void 0 : entry;
        }
        if (hasFromCallback) {
          actualFromData = fromData(callbackOptions);
          if (actualFromData === null || actualFromData === void 0) {
            continue;
          }
          if (typeof actualFromData !== "object") {
            throw new TypeError(`AnimationGroupAPI.fromTo error: fromData callback function iteration(${index}) failed to return an object.`);
          }
        }
        if (hasToCallback) {
          actualToData = toData(callbackOptions);
          if (actualToData === null || actualToData === void 0) {
            continue;
          }
          if (typeof actualToData !== "object") {
            throw new TypeError(`AnimationGroupAPI.fromTo error: toData callback function iteration(${index}) failed to return an object.`);
          }
        }
        if (hasOptionCallback) {
          actualOptions = options(callbackOptions);
          if (actualOptions === null || actualOptions === void 0) {
            continue;
          }
          if (typeof actualOptions !== "object") {
            throw new TypeError(`AnimationGroupAPI.fromTo error: options callback function iteration(${index}) failed to return an object.`);
          }
        }
        animationControls.push(actualPosition.animate.fromTo(actualFromData, actualToData, actualOptions));
      }
    } else {
      const isPosition = this.#isPosition(position);
      const actualPosition = isPosition ? position : position.position;
      if (!this.#isPosition(actualPosition)) {
        console.warn(`AnimationGroupAPI.fromTo warning: No Position instance found.`);
        return AnimationGroupControl.voidControl;
      }
      if (hasCallback) {
        callbackOptions.index = 0;
        callbackOptions.position = position;
        callbackOptions.data = isPosition ? void 0 : position;
      }
      if (hasFromCallback) {
        actualFromData = fromData(callbackOptions);
        if (typeof actualFromData !== "object") {
          throw new TypeError(
            `AnimationGroupAPI.fromTo error: fromData callback function failed to return an object.`
          );
        }
      }
      if (hasToCallback) {
        actualToData = toData(callbackOptions);
        if (typeof actualToData !== "object") {
          throw new TypeError(
            `AnimationGroupAPI.fromTo error: toData callback function failed to return an object.`
          );
        }
      }
      if (hasOptionCallback) {
        actualOptions = options(callbackOptions);
        if (typeof actualOptions !== "object") {
          throw new TypeError(
            `AnimationGroupAPI.fromTo error: options callback function failed to return an object.`
          );
        }
      }
      animationControls.push(actualPosition.animate.fromTo(actualFromData, actualToData, actualOptions));
    }
    return new AnimationGroupControl(animationControls);
  }
  static to(position, toData, options) {
    if (!isObject(toData) && typeof toData !== "function") {
      throw new TypeError(`AnimationGroupAPI.to error: 'toData' is not an object or function.`);
    }
    if (options !== void 0 && !isObject(options) && typeof options !== "function") {
      throw new TypeError(`AnimationGroupAPI.to error: 'options' is not an object or function.`);
    }
    const animationControls = [];
    let index = -1;
    let callbackOptions;
    const hasDataCallback = typeof toData === "function";
    const hasOptionCallback = typeof options === "function";
    const hasCallback = hasDataCallback || hasOptionCallback;
    if (hasCallback) {
      callbackOptions = { index, position: void 0, data: void 0 };
    }
    let actualToData = toData;
    let actualOptions = options;
    if (isIterable(position)) {
      for (const entry of position) {
        index++;
        const isPosition = this.#isPosition(entry);
        const actualPosition = isPosition ? entry : entry.position;
        if (!this.#isPosition(actualPosition)) {
          console.warn(`AnimationGroupAPI.to warning: No Position instance found at index: ${index}.`);
          continue;
        }
        if (hasCallback) {
          callbackOptions.index = index;
          callbackOptions.position = position;
          callbackOptions.data = isPosition ? void 0 : entry;
        }
        if (hasDataCallback) {
          actualToData = toData(callbackOptions);
          if (actualToData === null || actualToData === void 0) {
            continue;
          }
          if (typeof actualToData !== "object") {
            throw new TypeError(`AnimationGroupAPI.to error: toData callback function iteration(${index}) failed to return an object.`);
          }
        }
        if (hasOptionCallback) {
          actualOptions = options(callbackOptions);
          if (actualOptions === null || actualOptions === void 0) {
            continue;
          }
          if (typeof actualOptions !== "object") {
            throw new TypeError(`AnimationGroupAPI.to error: options callback function iteration(${index}) failed to return an object.`);
          }
        }
        animationControls.push(actualPosition.animate.to(actualToData, actualOptions));
      }
    } else {
      const isPosition = this.#isPosition(position);
      const actualPosition = isPosition ? position : position.position;
      if (!this.#isPosition(actualPosition)) {
        console.warn(`AnimationGroupAPI.to warning: No Position instance found.`);
        return AnimationGroupControl.voidControl;
      }
      if (hasCallback) {
        callbackOptions.index = 0;
        callbackOptions.position = position;
        callbackOptions.data = isPosition ? void 0 : position;
      }
      if (hasDataCallback) {
        actualToData = toData(callbackOptions);
        if (typeof actualToData !== "object") {
          throw new TypeError(
            `AnimationGroupAPI.to error: toData callback function failed to return an object.`
          );
        }
      }
      if (hasOptionCallback) {
        actualOptions = options(callbackOptions);
        if (typeof actualOptions !== "object") {
          throw new TypeError(
            `AnimationGroupAPI.to error: options callback function failed to return an object.`
          );
        }
      }
      animationControls.push(actualPosition.animate.to(actualToData, actualOptions));
    }
    return new AnimationGroupControl(animationControls);
  }
  static quickTo(position, keys, options) {
    if (!isIterable(keys)) {
      throw new TypeError(`AnimationGroupAPI.quickTo error: 'keys' is not an iterable list.`);
    }
    if (options !== void 0 && !isObject(options) && typeof options !== "function") {
      throw new TypeError(`AnimationGroupAPI.quickTo error: 'options' is not an object or function.`);
    }
    const quickToCallbacks = [];
    let index = -1;
    const hasOptionCallback = typeof options === "function";
    const callbackOptions = { index, position: void 0, data: void 0 };
    let actualOptions = options;
    if (isIterable(position)) {
      for (const entry of position) {
        index++;
        const isPosition = this.#isPosition(entry);
        const actualPosition = isPosition ? entry : entry.position;
        if (!this.#isPosition(actualPosition)) {
          console.warn(`AnimationGroupAPI.quickTo warning: No Position instance found at index: ${index}.`);
          continue;
        }
        callbackOptions.index = index;
        callbackOptions.position = position;
        callbackOptions.data = isPosition ? void 0 : entry;
        if (hasOptionCallback) {
          actualOptions = options(callbackOptions);
          if (actualOptions === null || actualOptions === void 0) {
            continue;
          }
          if (typeof actualOptions !== "object") {
            throw new TypeError(`AnimationGroupAPI.quickTo error: options callback function iteration(${index}) failed to return an object.`);
          }
        }
        quickToCallbacks.push(actualPosition.animate.quickTo(keys, actualOptions));
      }
    } else {
      const isPosition = this.#isPosition(position);
      const actualPosition = isPosition ? position : position.position;
      if (!this.#isPosition(actualPosition)) {
        console.warn(`AnimationGroupAPI.quickTo warning: No Position instance found.`);
        return () => null;
      }
      callbackOptions.index = 0;
      callbackOptions.position = position;
      callbackOptions.data = isPosition ? void 0 : position;
      if (hasOptionCallback) {
        actualOptions = options(callbackOptions);
        if (typeof actualOptions !== "object") {
          throw new TypeError(
            `AnimationGroupAPI.quickTo error: options callback function failed to return an object.`
          );
        }
      }
      quickToCallbacks.push(actualPosition.animate.quickTo(keys, actualOptions));
    }
    const keysArray = [...keys];
    Object.freeze(keysArray);
    const quickToCB = /* @__PURE__ */ __name((...args) => {
      const argsLength = args.length;
      if (argsLength === 0) {
        return;
      }
      if (typeof args[0] === "function") {
        const dataCallback = args[0];
        index = -1;
        let cntr = 0;
        if (isIterable(position)) {
          for (const entry of position) {
            index++;
            const isPosition = this.#isPosition(entry);
            const actualPosition = isPosition ? entry : entry.position;
            if (!this.#isPosition(actualPosition)) {
              continue;
            }
            callbackOptions.index = index;
            callbackOptions.position = position;
            callbackOptions.data = isPosition ? void 0 : entry;
            const toData = dataCallback(callbackOptions);
            if (toData === null || toData === void 0) {
              continue;
            }
            const toDataIterable = isIterable(toData);
            if (!Number.isFinite(toData) && !toDataIterable && typeof toData !== "object") {
              throw new TypeError(`AnimationGroupAPI.quickTo error: toData callback function iteration(${index}) failed to return a finite number, iterable list, or object.`);
            }
            if (toDataIterable) {
              quickToCallbacks[cntr++](...toData);
            } else {
              quickToCallbacks[cntr++](toData);
            }
          }
        } else {
          const isPosition = this.#isPosition(position);
          const actualPosition = isPosition ? position : position.position;
          if (!this.#isPosition(actualPosition)) {
            return;
          }
          callbackOptions.index = 0;
          callbackOptions.position = position;
          callbackOptions.data = isPosition ? void 0 : position;
          const toData = dataCallback(callbackOptions);
          if (toData === null || toData === void 0) {
            return;
          }
          const toDataIterable = isIterable(toData);
          if (!Number.isFinite(toData) && !toDataIterable && typeof toData !== "object") {
            throw new TypeError(`AnimationGroupAPI.quickTo error: toData callback function iteration(${index}) failed to return a finite number, iterable list, or object.`);
          }
          if (toDataIterable) {
            quickToCallbacks[cntr++](...toData);
          } else {
            quickToCallbacks[cntr++](toData);
          }
        }
      } else {
        for (let cntr = quickToCallbacks.length; --cntr >= 0; ) {
          quickToCallbacks[cntr](...args);
        }
      }
    }, "quickToCB");
    quickToCB.keys = keysArray;
    quickToCB.options = (options2) => {
      if (options2 !== void 0 && !isObject(options2) && typeof options2 !== "function") {
        throw new TypeError(`AnimationGroupAPI.quickTo error: 'options' is not an object or function.`);
      }
      if (isObject(options2)) {
        for (let cntr = quickToCallbacks.length; --cntr >= 0; ) {
          quickToCallbacks[cntr].options(options2);
        }
      } else if (typeof options2 === "function") {
        if (isIterable(position)) {
          index = -1;
          let cntr = 0;
          for (const entry of position) {
            index++;
            const isPosition = this.#isPosition(entry);
            const actualPosition = isPosition ? entry : entry.position;
            if (!this.#isPosition(actualPosition)) {
              console.warn(
                `AnimationGroupAPI.quickTo.options warning: No Position instance found at index: ${index}.`
              );
              continue;
            }
            callbackOptions.index = index;
            callbackOptions.position = position;
            callbackOptions.data = isPosition ? void 0 : entry;
            actualOptions = options2(callbackOptions);
            if (actualOptions === null || actualOptions === void 0) {
              continue;
            }
            if (typeof actualOptions !== "object") {
              throw new TypeError(
                `AnimationGroupAPI.quickTo.options error: options callback function iteration(${index}) failed to return an object.`
              );
            }
            quickToCallbacks[cntr++].options(actualOptions);
          }
        } else {
          const isPosition = this.#isPosition(position);
          const actualPosition = isPosition ? position : position.position;
          if (!this.#isPosition(actualPosition)) {
            console.warn(`AnimationGroupAPI.quickTo.options warning: No Position instance found.`);
            return quickToCB;
          }
          callbackOptions.index = 0;
          callbackOptions.position = position;
          callbackOptions.data = isPosition ? void 0 : position;
          actualOptions = options2(callbackOptions);
          if (typeof actualOptions !== "object") {
            throw new TypeError(
              `AnimationGroupAPI.quickTo error: options callback function failed to return an object.`
            );
          }
          quickToCallbacks[0].options(actualOptions);
        }
      }
      return quickToCB;
    };
    return quickToCB;
  }
}
__name(AnimationGroupAPI, "AnimationGroupAPI");
class Centered {
  #element;
  #height;
  #lock;
  #width;
  constructor({ element: element2, lock = false, width, height } = {}) {
    this.element = element2;
    this.width = width;
    this.height = height;
    this.#lock = typeof lock === "boolean" ? lock : false;
  }
  get element() {
    return this.#element;
  }
  get height() {
    return this.#height;
  }
  get width() {
    return this.#width;
  }
  set element(element2) {
    if (this.#lock) {
      return;
    }
    if (element2 === void 0 || element2 === null || element2 instanceof HTMLElement) {
      this.#element = element2;
    } else {
      throw new TypeError(`'element' is not a HTMLElement, undefined, or null.`);
    }
  }
  set height(height) {
    if (this.#lock) {
      return;
    }
    if (height === void 0 || Number.isFinite(height)) {
      this.#height = height;
    } else {
      throw new TypeError(`'height' is not a finite number or undefined.`);
    }
  }
  set width(width) {
    if (this.#lock) {
      return;
    }
    if (width === void 0 || Number.isFinite(width)) {
      this.#width = width;
    } else {
      throw new TypeError(`'width' is not a finite number or undefined.`);
    }
  }
  setDimension(width, height) {
    if (this.#lock) {
      return;
    }
    if (width === void 0 || Number.isFinite(width)) {
      this.#width = width;
    } else {
      throw new TypeError(`'width' is not a finite number or undefined.`);
    }
    if (height === void 0 || Number.isFinite(height)) {
      this.#height = height;
    } else {
      throw new TypeError(`'height' is not a finite number or undefined.`);
    }
  }
  getLeft(width) {
    const boundsWidth = this.#width ?? this.#element?.offsetWidth ?? globalThis.innerWidth;
    return (boundsWidth - width) / 2;
  }
  getTop(height) {
    const boundsHeight = this.#height ?? this.#element?.offsetHeight ?? globalThis.innerHeight;
    return (boundsHeight - height) / 2;
  }
}
__name(Centered, "Centered");
const browserCentered = new Centered();
const positionInitial = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  browserCentered,
  Centered
}, Symbol.toStringTag, { value: "Module" }));
class PositionChangeSet {
  constructor() {
    this.left = false;
    this.top = false;
    this.width = false;
    this.height = false;
    this.maxHeight = false;
    this.maxWidth = false;
    this.minHeight = false;
    this.minWidth = false;
    this.zIndex = false;
    this.transform = false;
    this.transformOrigin = false;
  }
  hasChange() {
    return this.left || this.top || this.width || this.height || this.maxHeight || this.maxWidth || this.minHeight || this.minWidth || this.zIndex || this.transform || this.transformOrigin;
  }
  set(value) {
    this.left = value;
    this.top = value;
    this.width = value;
    this.height = value;
    this.maxHeight = value;
    this.maxWidth = value;
    this.minHeight = value;
    this.minWidth = value;
    this.zIndex = value;
    this.transform = value;
    this.transformOrigin = value;
  }
}
__name(PositionChangeSet, "PositionChangeSet");
class PositionData {
  constructor({
    height = null,
    left = null,
    maxHeight = null,
    maxWidth = null,
    minHeight = null,
    minWidth = null,
    rotateX = null,
    rotateY = null,
    rotateZ = null,
    scale = null,
    translateX = null,
    translateY = null,
    translateZ = null,
    top = null,
    transformOrigin = null,
    width = null,
    zIndex = null
  } = {}) {
    this.height = height;
    this.left = left;
    this.maxHeight = maxHeight;
    this.maxWidth = maxWidth;
    this.minHeight = minHeight;
    this.minWidth = minWidth;
    this.rotateX = rotateX;
    this.rotateY = rotateY;
    this.rotateZ = rotateZ;
    this.scale = scale;
    this.top = top;
    this.transformOrigin = transformOrigin;
    this.translateX = translateX;
    this.translateY = translateY;
    this.translateZ = translateZ;
    this.width = width;
    this.zIndex = zIndex;
    Object.seal(this);
  }
  copy(data) {
    this.height = data.height;
    this.left = data.left;
    this.maxHeight = data.maxHeight;
    this.maxWidth = data.maxWidth;
    this.minHeight = data.minHeight;
    this.minWidth = data.minWidth;
    this.rotateX = data.rotateX;
    this.rotateY = data.rotateY;
    this.rotateZ = data.rotateZ;
    this.scale = data.scale;
    this.top = data.top;
    this.transformOrigin = data.transformOrigin;
    this.translateX = data.translateX;
    this.translateY = data.translateY;
    this.translateZ = data.translateZ;
    this.width = data.width;
    this.zIndex = data.zIndex;
    return this;
  }
}
__name(PositionData, "PositionData");
class PositionStateAPI {
  #data;
  #dataSaved = /* @__PURE__ */ new Map();
  #position;
  #transforms;
  constructor(position, data, transforms) {
    this.#position = position;
    this.#data = data;
    this.#transforms = transforms;
  }
  get({ name }) {
    if (typeof name !== "string") {
      throw new TypeError(`Position - getSave error: 'name' is not a string.`);
    }
    return this.#dataSaved.get(name);
  }
  getDefault() {
    return this.#dataSaved.get("#defaultData");
  }
  remove({ name }) {
    if (typeof name !== "string") {
      throw new TypeError(`Position - remove: 'name' is not a string.`);
    }
    const data = this.#dataSaved.get(name);
    this.#dataSaved.delete(name);
    return data;
  }
  reset({ keepZIndex = false, invokeSet = true } = {}) {
    const defaultData = this.#dataSaved.get("#defaultData");
    if (typeof defaultData !== "object") {
      return false;
    }
    if (this.#position.animate.isScheduled) {
      this.#position.animate.cancel();
    }
    const zIndex = this.#position.zIndex;
    const data = Object.assign({}, defaultData);
    if (keepZIndex) {
      data.zIndex = zIndex;
    }
    this.#transforms.reset(data);
    if (this.#position.parent?.reactive?.minimized) {
      this.#position.parent?.maximize?.({ animate: false, duration: 0 });
    }
    if (invokeSet) {
      setTimeout(() => this.#position.set(data), 0);
    }
    return true;
  }
  restore({
    name,
    remove = false,
    properties,
    silent = false,
    async = false,
    animateTo = false,
    duration = 0.1,
    ease = identity,
    interpolate = lerp$5
  }) {
    if (typeof name !== "string") {
      throw new TypeError(`Position - restore error: 'name' is not a string.`);
    }
    const dataSaved = this.#dataSaved.get(name);
    if (dataSaved) {
      if (remove) {
        this.#dataSaved.delete(name);
      }
      let data = dataSaved;
      if (isIterable(properties)) {
        data = {};
        for (const property of properties) {
          data[property] = dataSaved[property];
        }
      }
      if (silent) {
        for (const property in data) {
          this.#data[property] = data[property];
        }
        return dataSaved;
      } else if (animateTo) {
        if (data.transformOrigin !== this.#position.transformOrigin) {
          this.#position.transformOrigin = data.transformOrigin;
        }
        if (async) {
          return this.#position.animate.to(data, { duration, ease, interpolate }).finished.then(() => dataSaved);
        } else {
          this.#position.animate.to(data, { duration, ease, interpolate });
        }
      } else {
        this.#position.set(data);
      }
    }
    return dataSaved;
  }
  save({ name, ...extra }) {
    if (typeof name !== "string") {
      throw new TypeError(`Position - save error: 'name' is not a string.`);
    }
    const data = this.#position.get(extra);
    this.#dataSaved.set(name, data);
    return data;
  }
  set({ name, ...data }) {
    if (typeof name !== "string") {
      throw new TypeError(`Position - set error: 'name' is not a string.`);
    }
    this.#dataSaved.set(name, data);
  }
}
__name(PositionStateAPI, "PositionStateAPI");
class StyleCache {
  constructor() {
    this.el = void 0;
    this.computed = void 0;
    this.marginLeft = void 0;
    this.marginTop = void 0;
    this.maxHeight = void 0;
    this.maxWidth = void 0;
    this.minHeight = void 0;
    this.minWidth = void 0;
    this.hasWillChange = false;
    this.resizeObserved = {
      contentHeight: void 0,
      contentWidth: void 0,
      offsetHeight: void 0,
      offsetWidth: void 0
    };
    const storeResizeObserved = writable(this.resizeObserved);
    this.stores = {
      element: writable(this.el),
      resizeContentHeight: propertyStore(storeResizeObserved, "contentHeight"),
      resizeContentWidth: propertyStore(storeResizeObserved, "contentWidth"),
      resizeObserved: storeResizeObserved,
      resizeOffsetHeight: propertyStore(storeResizeObserved, "offsetHeight"),
      resizeOffsetWidth: propertyStore(storeResizeObserved, "offsetWidth")
    };
  }
  get offsetHeight() {
    if (this.el instanceof HTMLElement) {
      return this.resizeObserved.offsetHeight !== void 0 ? this.resizeObserved.offsetHeight : this.el.offsetHeight;
    }
    throw new Error(`StyleCache - get offsetHeight error: no element assigned.`);
  }
  get offsetWidth() {
    if (this.el instanceof HTMLElement) {
      return this.resizeObserved.offsetWidth !== void 0 ? this.resizeObserved.offsetWidth : this.el.offsetWidth;
    }
    throw new Error(`StyleCache - get offsetWidth error: no element assigned.`);
  }
  hasData(el) {
    return this.el === el;
  }
  reset() {
    if (this.el instanceof HTMLElement && this.el.isConnected && !this.hasWillChange) {
      this.el.style.willChange = null;
    }
    this.el = void 0;
    this.computed = void 0;
    this.marginLeft = void 0;
    this.marginTop = void 0;
    this.maxHeight = void 0;
    this.maxWidth = void 0;
    this.minHeight = void 0;
    this.minWidth = void 0;
    this.hasWillChange = false;
    this.resizeObserved.contentHeight = void 0;
    this.resizeObserved.contentWidth = void 0;
    this.resizeObserved.offsetHeight = void 0;
    this.resizeObserved.offsetWidth = void 0;
    this.stores.element.set(void 0);
  }
  update(el) {
    this.el = el;
    this.computed = globalThis.getComputedStyle(el);
    this.marginLeft = styleParsePixels(el.style.marginLeft) ?? styleParsePixels(this.computed.marginLeft);
    this.marginTop = styleParsePixels(el.style.marginTop) ?? styleParsePixels(this.computed.marginTop);
    this.maxHeight = styleParsePixels(el.style.maxHeight) ?? styleParsePixels(this.computed.maxHeight);
    this.maxWidth = styleParsePixels(el.style.maxWidth) ?? styleParsePixels(this.computed.maxWidth);
    this.minHeight = styleParsePixels(el.style.minHeight) ?? styleParsePixels(this.computed.minHeight);
    this.minWidth = styleParsePixels(el.style.minWidth) ?? styleParsePixels(this.computed.minWidth);
    const willChange = el.style.willChange !== "" ? el.style.willChange : this.computed.willChange;
    this.hasWillChange = willChange !== "" && willChange !== "auto";
    this.stores.element.set(el);
  }
}
__name(StyleCache, "StyleCache");
class TransformData {
  constructor() {
    Object.seal(this);
  }
  #boundingRect = new DOMRect();
  #corners = [vec3.create(), vec3.create(), vec3.create(), vec3.create()];
  #mat4 = mat4.create();
  #originTranslations = [mat4.create(), mat4.create()];
  get boundingRect() {
    return this.#boundingRect;
  }
  get corners() {
    return this.#corners;
  }
  get css() {
    return `matrix3d(${this.mat4.join(",")})`;
  }
  get mat4() {
    return this.#mat4;
  }
  get originTranslations() {
    return this.#originTranslations;
  }
}
__name(TransformData, "TransformData");
class AdapterValidators {
  #validatorData;
  #mapUnsubscribe = /* @__PURE__ */ new Map();
  constructor() {
    this.#validatorData = [];
    Object.seal(this);
    return [this, this.#validatorData];
  }
  get length() {
    return this.#validatorData.length;
  }
  *[Symbol.iterator]() {
    if (this.#validatorData.length === 0) {
      return;
    }
    for (const entry of this.#validatorData) {
      yield { ...entry };
    }
  }
  add(...validators) {
    for (const validator of validators) {
      const validatorType = typeof validator;
      if (validatorType !== "function" && validatorType !== "object" || validator === null) {
        throw new TypeError(`AdapterValidator error: 'validator' is not a function or object.`);
      }
      let data = void 0;
      let subscribeFn = void 0;
      switch (validatorType) {
        case "function":
          data = {
            id: void 0,
            validator,
            weight: 1
          };
          subscribeFn = validator.subscribe;
          break;
        case "object":
          if (typeof validator.validator !== "function") {
            throw new TypeError(`AdapterValidator error: 'validator' attribute is not a function.`);
          }
          if (validator.weight !== void 0 && typeof validator.weight !== "number" || (validator.weight < 0 || validator.weight > 1)) {
            throw new TypeError(
              `AdapterValidator error: 'weight' attribute is not a number between '0 - 1' inclusive.`
            );
          }
          data = {
            id: validator.id !== void 0 ? validator.id : void 0,
            validator: validator.validator.bind(validator),
            weight: validator.weight || 1,
            instance: validator
          };
          subscribeFn = validator.validator.subscribe ?? validator.subscribe;
          break;
      }
      const index = this.#validatorData.findIndex((value) => {
        return data.weight < value.weight;
      });
      if (index >= 0) {
        this.#validatorData.splice(index, 0, data);
      } else {
        this.#validatorData.push(data);
      }
      if (typeof subscribeFn === "function") {
        const unsubscribe = subscribeFn();
        if (typeof unsubscribe !== "function") {
          throw new TypeError(
            "AdapterValidator error: Filter has subscribe function, but no unsubscribe function is returned."
          );
        }
        if (this.#mapUnsubscribe.has(data.validator)) {
          throw new Error(
            "AdapterValidator error: Filter added already has an unsubscribe function registered."
          );
        }
        this.#mapUnsubscribe.set(data.validator, unsubscribe);
      }
    }
  }
  clear() {
    this.#validatorData.length = 0;
    for (const unsubscribe of this.#mapUnsubscribe.values()) {
      unsubscribe();
    }
    this.#mapUnsubscribe.clear();
  }
  remove(...validators) {
    const length = this.#validatorData.length;
    if (length === 0) {
      return;
    }
    for (const data of validators) {
      const actualValidator = typeof data === "function" ? data : data !== null && typeof data === "object" ? data.validator : void 0;
      if (!actualValidator) {
        continue;
      }
      for (let cntr = this.#validatorData.length; --cntr >= 0; ) {
        if (this.#validatorData[cntr].validator === actualValidator) {
          this.#validatorData.splice(cntr, 1);
          let unsubscribe = void 0;
          if (typeof (unsubscribe = this.#mapUnsubscribe.get(actualValidator)) === "function") {
            unsubscribe();
            this.#mapUnsubscribe.delete(actualValidator);
          }
        }
      }
    }
  }
  removeBy(callback) {
    const length = this.#validatorData.length;
    if (length === 0) {
      return;
    }
    if (typeof callback !== "function") {
      throw new TypeError(`AdapterValidator error: 'callback' is not a function.`);
    }
    this.#validatorData = this.#validatorData.filter((data) => {
      const remove = callback.call(callback, { ...data });
      if (remove) {
        let unsubscribe;
        if (typeof (unsubscribe = this.#mapUnsubscribe.get(data.validator)) === "function") {
          unsubscribe();
          this.#mapUnsubscribe.delete(data.validator);
        }
      }
      return !remove;
    });
  }
  removeById(...ids) {
    const length = this.#validatorData.length;
    if (length === 0) {
      return;
    }
    this.#validatorData = this.#validatorData.filter((data) => {
      let remove = false;
      for (const id of ids) {
        remove |= data.id === id;
      }
      if (remove) {
        let unsubscribe;
        if (typeof (unsubscribe = this.#mapUnsubscribe.get(data.validator)) === "function") {
          unsubscribe();
          this.#mapUnsubscribe.delete(data.validator);
        }
      }
      return !remove;
    });
  }
}
__name(AdapterValidators, "AdapterValidators");
class BasicBounds {
  #constrain;
  #element;
  #enabled;
  #height;
  #lock;
  #width;
  constructor({ constrain = true, element: element2, enabled = true, lock = false, width, height } = {}) {
    this.element = element2;
    this.constrain = constrain;
    this.enabled = enabled;
    this.width = width;
    this.height = height;
    this.#lock = typeof lock === "boolean" ? lock : false;
  }
  get constrain() {
    return this.#constrain;
  }
  get element() {
    return this.#element;
  }
  get enabled() {
    return this.#enabled;
  }
  get height() {
    return this.#height;
  }
  get width() {
    return this.#width;
  }
  set constrain(constrain) {
    if (this.#lock) {
      return;
    }
    if (typeof constrain !== "boolean") {
      throw new TypeError(`'constrain' is not a boolean.`);
    }
    this.#constrain = constrain;
  }
  set element(element2) {
    if (this.#lock) {
      return;
    }
    if (element2 === void 0 || element2 === null || element2 instanceof HTMLElement) {
      this.#element = element2;
    } else {
      throw new TypeError(`'element' is not a HTMLElement, undefined, or null.`);
    }
  }
  set enabled(enabled) {
    if (this.#lock) {
      return;
    }
    if (typeof enabled !== "boolean") {
      throw new TypeError(`'enabled' is not a boolean.`);
    }
    this.#enabled = enabled;
  }
  set height(height) {
    if (this.#lock) {
      return;
    }
    if (height === void 0 || Number.isFinite(height)) {
      this.#height = height;
    } else {
      throw new TypeError(`'height' is not a finite number or undefined.`);
    }
  }
  set width(width) {
    if (this.#lock) {
      return;
    }
    if (width === void 0 || Number.isFinite(width)) {
      this.#width = width;
    } else {
      throw new TypeError(`'width' is not a finite number or undefined.`);
    }
  }
  setDimension(width, height) {
    if (this.#lock) {
      return;
    }
    if (width === void 0 || Number.isFinite(width)) {
      this.#width = width;
    } else {
      throw new TypeError(`'width' is not a finite number or undefined.`);
    }
    if (height === void 0 || Number.isFinite(height)) {
      this.#height = height;
    } else {
      throw new TypeError(`'height' is not a finite number or undefined.`);
    }
  }
  validator(valData) {
    if (!this.#enabled) {
      return valData.position;
    }
    const boundsWidth = this.#width ?? this.#element?.offsetWidth ?? globalThis.innerWidth;
    const boundsHeight = this.#height ?? this.#element?.offsetHeight ?? globalThis.innerHeight;
    if (typeof valData.position.width === "number") {
      const maxW = valData.maxWidth ?? (this.#constrain ? boundsWidth : Number.MAX_SAFE_INTEGER);
      valData.position.width = valData.width = Math.clamped(valData.position.width, valData.minWidth, maxW);
      if (valData.width + valData.position.left + valData.marginLeft > boundsWidth) {
        valData.position.left = boundsWidth - valData.width - valData.marginLeft;
      }
    }
    if (typeof valData.position.height === "number") {
      const maxH = valData.maxHeight ?? (this.#constrain ? boundsHeight : Number.MAX_SAFE_INTEGER);
      valData.position.height = valData.height = Math.clamped(valData.position.height, valData.minHeight, maxH);
      if (valData.height + valData.position.top + valData.marginTop > boundsHeight) {
        valData.position.top = boundsHeight - valData.height - valData.marginTop;
      }
    }
    const maxL = Math.max(boundsWidth - valData.width - valData.marginLeft, 0);
    valData.position.left = Math.round(Math.clamped(valData.position.left, 0, maxL));
    const maxT = Math.max(boundsHeight - valData.height - valData.marginTop, 0);
    valData.position.top = Math.round(Math.clamped(valData.position.top, 0, maxT));
    return valData.position;
  }
}
__name(BasicBounds, "BasicBounds");
const s_TRANSFORM_DATA = new TransformData();
class TransformBounds {
  #constrain;
  #element;
  #enabled;
  #height;
  #lock;
  #width;
  constructor({ constrain = true, element: element2, enabled = true, lock = false, width, height } = {}) {
    this.element = element2;
    this.constrain = constrain;
    this.enabled = enabled;
    this.width = width;
    this.height = height;
    this.#lock = typeof lock === "boolean" ? lock : false;
  }
  get constrain() {
    return this.#constrain;
  }
  get element() {
    return this.#element;
  }
  get enabled() {
    return this.#enabled;
  }
  get height() {
    return this.#height;
  }
  get width() {
    return this.#width;
  }
  set constrain(constrain) {
    if (this.#lock) {
      return;
    }
    if (typeof constrain !== "boolean") {
      throw new TypeError(`'constrain' is not a boolean.`);
    }
    this.#constrain = constrain;
  }
  set element(element2) {
    if (this.#lock) {
      return;
    }
    if (element2 === void 0 || element2 === null || element2 instanceof HTMLElement) {
      this.#element = element2;
    } else {
      throw new TypeError(`'element' is not a HTMLElement, undefined, or null.`);
    }
  }
  set enabled(enabled) {
    if (this.#lock) {
      return;
    }
    if (typeof enabled !== "boolean") {
      throw new TypeError(`'enabled' is not a boolean.`);
    }
    this.#enabled = enabled;
  }
  set height(height) {
    if (this.#lock) {
      return;
    }
    if (height === void 0 || Number.isFinite(height)) {
      this.#height = height;
    } else {
      throw new TypeError(`'height' is not a finite number or undefined.`);
    }
  }
  set width(width) {
    if (this.#lock) {
      return;
    }
    if (width === void 0 || Number.isFinite(width)) {
      this.#width = width;
    } else {
      throw new TypeError(`'width' is not a finite number or undefined.`);
    }
  }
  setDimension(width, height) {
    if (this.#lock) {
      return;
    }
    if (width === void 0 || Number.isFinite(width)) {
      this.#width = width;
    } else {
      throw new TypeError(`'width' is not a finite number or undefined.`);
    }
    if (height === void 0 || Number.isFinite(height)) {
      this.#height = height;
    } else {
      throw new TypeError(`'height' is not a finite number or undefined.`);
    }
  }
  validator(valData) {
    if (!this.#enabled) {
      return valData.position;
    }
    const boundsWidth = this.#width ?? this.#element?.offsetWidth ?? globalThis.innerWidth;
    const boundsHeight = this.#height ?? this.#element?.offsetHeight ?? globalThis.innerHeight;
    if (typeof valData.position.width === "number") {
      const maxW = valData.maxWidth ?? (this.#constrain ? boundsWidth : Number.MAX_SAFE_INTEGER);
      valData.position.width = Math.clamped(valData.width, valData.minWidth, maxW);
    }
    if (typeof valData.position.height === "number") {
      const maxH = valData.maxHeight ?? (this.#constrain ? boundsHeight : Number.MAX_SAFE_INTEGER);
      valData.position.height = Math.clamped(valData.height, valData.minHeight, maxH);
    }
    const data = valData.transforms.getData(valData.position, s_TRANSFORM_DATA, valData);
    const initialX = data.boundingRect.x;
    const initialY = data.boundingRect.y;
    if (data.boundingRect.bottom + valData.marginTop > boundsHeight) {
      data.boundingRect.y += boundsHeight - data.boundingRect.bottom - valData.marginTop;
    }
    if (data.boundingRect.right + valData.marginLeft > boundsWidth) {
      data.boundingRect.x += boundsWidth - data.boundingRect.right - valData.marginLeft;
    }
    if (data.boundingRect.top - valData.marginTop < 0) {
      data.boundingRect.y += Math.abs(data.boundingRect.top - valData.marginTop);
    }
    if (data.boundingRect.left - valData.marginLeft < 0) {
      data.boundingRect.x += Math.abs(data.boundingRect.left - valData.marginLeft);
    }
    valData.position.left -= initialX - data.boundingRect.x;
    valData.position.top -= initialY - data.boundingRect.y;
    return valData.position;
  }
}
__name(TransformBounds, "TransformBounds");
const basicWindow = new BasicBounds({ lock: true });
const transformWindow = new TransformBounds({ lock: true });
const positionValidators = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  basicWindow,
  BasicBounds,
  transformWindow,
  TransformBounds
}, Symbol.toStringTag, { value: "Module" }));
const s_SCALE_VECTOR = [1, 1, 1];
const s_TRANSLATE_VECTOR = [0, 0, 0];
const s_MAT4_RESULT = mat4.create();
const s_MAT4_TEMP = mat4.create();
const s_VEC3_TEMP = vec3.create();
class Transforms {
  #orderList = [];
  constructor() {
    this._data = {};
  }
  get isActive() {
    return this.#orderList.length > 0;
  }
  get rotateX() {
    return this._data.rotateX;
  }
  get rotateY() {
    return this._data.rotateY;
  }
  get rotateZ() {
    return this._data.rotateZ;
  }
  get scale() {
    return this._data.scale;
  }
  get translateX() {
    return this._data.translateX;
  }
  get translateY() {
    return this._data.translateY;
  }
  get translateZ() {
    return this._data.translateZ;
  }
  set rotateX(value) {
    if (Number.isFinite(value)) {
      if (this._data.rotateX === void 0) {
        this.#orderList.push("rotateX");
      }
      this._data.rotateX = value;
    } else {
      if (this._data.rotateX !== void 0) {
        const index = this.#orderList.findIndex((entry) => entry === "rotateX");
        if (index >= 0) {
          this.#orderList.splice(index, 1);
        }
      }
      delete this._data.rotateX;
    }
  }
  set rotateY(value) {
    if (Number.isFinite(value)) {
      if (this._data.rotateY === void 0) {
        this.#orderList.push("rotateY");
      }
      this._data.rotateY = value;
    } else {
      if (this._data.rotateY !== void 0) {
        const index = this.#orderList.findIndex((entry) => entry === "rotateY");
        if (index >= 0) {
          this.#orderList.splice(index, 1);
        }
      }
      delete this._data.rotateY;
    }
  }
  set rotateZ(value) {
    if (Number.isFinite(value)) {
      if (this._data.rotateZ === void 0) {
        this.#orderList.push("rotateZ");
      }
      this._data.rotateZ = value;
    } else {
      if (this._data.rotateZ !== void 0) {
        const index = this.#orderList.findIndex((entry) => entry === "rotateZ");
        if (index >= 0) {
          this.#orderList.splice(index, 1);
        }
      }
      delete this._data.rotateZ;
    }
  }
  set scale(value) {
    if (Number.isFinite(value)) {
      if (this._data.scale === void 0) {
        this.#orderList.push("scale");
      }
      this._data.scale = value;
    } else {
      if (this._data.scale !== void 0) {
        const index = this.#orderList.findIndex((entry) => entry === "scale");
        if (index >= 0) {
          this.#orderList.splice(index, 1);
        }
      }
      delete this._data.scale;
    }
  }
  set translateX(value) {
    if (Number.isFinite(value)) {
      if (this._data.translateX === void 0) {
        this.#orderList.push("translateX");
      }
      this._data.translateX = value;
    } else {
      if (this._data.translateX !== void 0) {
        const index = this.#orderList.findIndex((entry) => entry === "translateX");
        if (index >= 0) {
          this.#orderList.splice(index, 1);
        }
      }
      delete this._data.translateX;
    }
  }
  set translateY(value) {
    if (Number.isFinite(value)) {
      if (this._data.translateY === void 0) {
        this.#orderList.push("translateY");
      }
      this._data.translateY = value;
    } else {
      if (this._data.translateY !== void 0) {
        const index = this.#orderList.findIndex((entry) => entry === "translateY");
        if (index >= 0) {
          this.#orderList.splice(index, 1);
        }
      }
      delete this._data.translateY;
    }
  }
  set translateZ(value) {
    if (Number.isFinite(value)) {
      if (this._data.translateZ === void 0) {
        this.#orderList.push("translateZ");
      }
      this._data.translateZ = value;
    } else {
      if (this._data.translateZ !== void 0) {
        const index = this.#orderList.findIndex((entry) => entry === "translateZ");
        if (index >= 0) {
          this.#orderList.splice(index, 1);
        }
      }
      delete this._data.translateZ;
    }
  }
  getCSS(data = this._data) {
    return `matrix3d(${this.getMat4(data, s_MAT4_RESULT).join(",")})`;
  }
  getCSSOrtho(data = this._data) {
    return `matrix3d(${this.getMat4Ortho(data, s_MAT4_RESULT).join(",")})`;
  }
  getData(position, output = new TransformData(), validationData = {}) {
    const valWidth = validationData.width ?? 0;
    const valHeight = validationData.height ?? 0;
    const valOffsetTop = validationData.offsetTop ?? validationData.marginTop ?? 0;
    const valOffsetLeft = validationData.offsetLeft ?? validationData.offsetLeft ?? 0;
    position.top += valOffsetTop;
    position.left += valOffsetLeft;
    const width = Number.isFinite(position.width) ? position.width : valWidth;
    const height = Number.isFinite(position.height) ? position.height : valHeight;
    const rect = output.corners;
    if (this.hasTransform(position)) {
      rect[0][0] = rect[0][1] = rect[0][2] = 0;
      rect[1][0] = width;
      rect[1][1] = rect[1][2] = 0;
      rect[2][0] = width;
      rect[2][1] = height;
      rect[2][2] = 0;
      rect[3][0] = 0;
      rect[3][1] = height;
      rect[3][2] = 0;
      const matrix = this.getMat4(position, output.mat4);
      const translate = s_GET_ORIGIN_TRANSLATION(position.transformOrigin, width, height, output.originTranslations);
      if (transformOriginDefault === position.transformOrigin) {
        vec3.transformMat4(rect[0], rect[0], matrix);
        vec3.transformMat4(rect[1], rect[1], matrix);
        vec3.transformMat4(rect[2], rect[2], matrix);
        vec3.transformMat4(rect[3], rect[3], matrix);
      } else {
        vec3.transformMat4(rect[0], rect[0], translate[0]);
        vec3.transformMat4(rect[0], rect[0], matrix);
        vec3.transformMat4(rect[0], rect[0], translate[1]);
        vec3.transformMat4(rect[1], rect[1], translate[0]);
        vec3.transformMat4(rect[1], rect[1], matrix);
        vec3.transformMat4(rect[1], rect[1], translate[1]);
        vec3.transformMat4(rect[2], rect[2], translate[0]);
        vec3.transformMat4(rect[2], rect[2], matrix);
        vec3.transformMat4(rect[2], rect[2], translate[1]);
        vec3.transformMat4(rect[3], rect[3], translate[0]);
        vec3.transformMat4(rect[3], rect[3], matrix);
        vec3.transformMat4(rect[3], rect[3], translate[1]);
      }
      rect[0][0] = position.left + rect[0][0];
      rect[0][1] = position.top + rect[0][1];
      rect[1][0] = position.left + rect[1][0];
      rect[1][1] = position.top + rect[1][1];
      rect[2][0] = position.left + rect[2][0];
      rect[2][1] = position.top + rect[2][1];
      rect[3][0] = position.left + rect[3][0];
      rect[3][1] = position.top + rect[3][1];
    } else {
      rect[0][0] = position.left;
      rect[0][1] = position.top;
      rect[1][0] = position.left + width;
      rect[1][1] = position.top;
      rect[2][0] = position.left + width;
      rect[2][1] = position.top + height;
      rect[3][0] = position.left;
      rect[3][1] = position.top + height;
      mat4.identity(output.mat4);
    }
    let maxX = Number.MIN_SAFE_INTEGER;
    let maxY = Number.MIN_SAFE_INTEGER;
    let minX = Number.MAX_SAFE_INTEGER;
    let minY = Number.MAX_SAFE_INTEGER;
    for (let cntr = 4; --cntr >= 0; ) {
      if (rect[cntr][0] > maxX) {
        maxX = rect[cntr][0];
      }
      if (rect[cntr][0] < minX) {
        minX = rect[cntr][0];
      }
      if (rect[cntr][1] > maxY) {
        maxY = rect[cntr][1];
      }
      if (rect[cntr][1] < minY) {
        minY = rect[cntr][1];
      }
    }
    const boundingRect = output.boundingRect;
    boundingRect.x = minX;
    boundingRect.y = minY;
    boundingRect.width = maxX - minX;
    boundingRect.height = maxY - minY;
    position.top -= valOffsetTop;
    position.left -= valOffsetLeft;
    return output;
  }
  getMat4(data = this._data, output = mat4.create()) {
    const matrix = mat4.identity(output);
    let seenKeys = 0;
    const orderList = this.#orderList;
    for (let cntr = 0; cntr < orderList.length; cntr++) {
      const key = orderList[cntr];
      switch (key) {
        case "rotateX":
          seenKeys |= transformKeysBitwise.rotateX;
          mat4.multiply(matrix, matrix, mat4.fromXRotation(s_MAT4_TEMP, degToRad(data[key])));
          break;
        case "rotateY":
          seenKeys |= transformKeysBitwise.rotateY;
          mat4.multiply(matrix, matrix, mat4.fromYRotation(s_MAT4_TEMP, degToRad(data[key])));
          break;
        case "rotateZ":
          seenKeys |= transformKeysBitwise.rotateZ;
          mat4.multiply(matrix, matrix, mat4.fromZRotation(s_MAT4_TEMP, degToRad(data[key])));
          break;
        case "scale":
          seenKeys |= transformKeysBitwise.scale;
          s_SCALE_VECTOR[0] = s_SCALE_VECTOR[1] = data[key];
          mat4.multiply(matrix, matrix, mat4.fromScaling(s_MAT4_TEMP, s_SCALE_VECTOR));
          break;
        case "translateX":
          seenKeys |= transformKeysBitwise.translateX;
          s_TRANSLATE_VECTOR[0] = data.translateX;
          s_TRANSLATE_VECTOR[1] = 0;
          s_TRANSLATE_VECTOR[2] = 0;
          mat4.multiply(matrix, matrix, mat4.fromTranslation(s_MAT4_TEMP, s_TRANSLATE_VECTOR));
          break;
        case "translateY":
          seenKeys |= transformKeysBitwise.translateY;
          s_TRANSLATE_VECTOR[0] = 0;
          s_TRANSLATE_VECTOR[1] = data.translateY;
          s_TRANSLATE_VECTOR[2] = 0;
          mat4.multiply(matrix, matrix, mat4.fromTranslation(s_MAT4_TEMP, s_TRANSLATE_VECTOR));
          break;
        case "translateZ":
          seenKeys |= transformKeysBitwise.translateZ;
          s_TRANSLATE_VECTOR[0] = 0;
          s_TRANSLATE_VECTOR[1] = 0;
          s_TRANSLATE_VECTOR[2] = data.translateZ;
          mat4.multiply(matrix, matrix, mat4.fromTranslation(s_MAT4_TEMP, s_TRANSLATE_VECTOR));
          break;
      }
    }
    if (data !== this._data) {
      for (let cntr = 0; cntr < transformKeys.length; cntr++) {
        const key = transformKeys[cntr];
        if (data[key] === null || (seenKeys & transformKeysBitwise[key]) > 0) {
          continue;
        }
        switch (key) {
          case "rotateX":
            mat4.multiply(matrix, matrix, mat4.fromXRotation(s_MAT4_TEMP, degToRad(data[key])));
            break;
          case "rotateY":
            mat4.multiply(matrix, matrix, mat4.fromYRotation(s_MAT4_TEMP, degToRad(data[key])));
            break;
          case "rotateZ":
            mat4.multiply(matrix, matrix, mat4.fromZRotation(s_MAT4_TEMP, degToRad(data[key])));
            break;
          case "scale":
            s_SCALE_VECTOR[0] = s_SCALE_VECTOR[1] = data[key];
            mat4.multiply(matrix, matrix, mat4.fromScaling(s_MAT4_TEMP, s_SCALE_VECTOR));
            break;
          case "translateX":
            s_TRANSLATE_VECTOR[0] = data[key];
            s_TRANSLATE_VECTOR[1] = 0;
            s_TRANSLATE_VECTOR[2] = 0;
            mat4.multiply(matrix, matrix, mat4.fromTranslation(s_MAT4_TEMP, s_TRANSLATE_VECTOR));
            break;
          case "translateY":
            s_TRANSLATE_VECTOR[0] = 0;
            s_TRANSLATE_VECTOR[1] = data[key];
            s_TRANSLATE_VECTOR[2] = 0;
            mat4.multiply(matrix, matrix, mat4.fromTranslation(s_MAT4_TEMP, s_TRANSLATE_VECTOR));
            break;
          case "translateZ":
            s_TRANSLATE_VECTOR[0] = 0;
            s_TRANSLATE_VECTOR[1] = 0;
            s_TRANSLATE_VECTOR[2] = data[key];
            mat4.multiply(matrix, matrix, mat4.fromTranslation(s_MAT4_TEMP, s_TRANSLATE_VECTOR));
            break;
        }
      }
    }
    return matrix;
  }
  getMat4Ortho(data = this._data, output = mat4.create()) {
    const matrix = mat4.identity(output);
    s_TRANSLATE_VECTOR[0] = (data.left ?? 0) + (data.translateX ?? 0);
    s_TRANSLATE_VECTOR[1] = (data.top ?? 0) + (data.translateY ?? 0);
    s_TRANSLATE_VECTOR[2] = data.translateZ ?? 0;
    mat4.multiply(matrix, matrix, mat4.fromTranslation(s_MAT4_TEMP, s_TRANSLATE_VECTOR));
    if (data.scale !== null) {
      s_SCALE_VECTOR[0] = s_SCALE_VECTOR[1] = data.scale;
      mat4.multiply(matrix, matrix, mat4.fromScaling(s_MAT4_TEMP, s_SCALE_VECTOR));
    }
    if (data.rotateX === null && data.rotateY === null && data.rotateZ === null) {
      return matrix;
    }
    let seenKeys = 0;
    const orderList = this.#orderList;
    for (let cntr = 0; cntr < orderList.length; cntr++) {
      const key = orderList[cntr];
      switch (key) {
        case "rotateX":
          seenKeys |= transformKeysBitwise.rotateX;
          mat4.multiply(matrix, matrix, mat4.fromXRotation(s_MAT4_TEMP, degToRad(data[key])));
          break;
        case "rotateY":
          seenKeys |= transformKeysBitwise.rotateY;
          mat4.multiply(matrix, matrix, mat4.fromYRotation(s_MAT4_TEMP, degToRad(data[key])));
          break;
        case "rotateZ":
          seenKeys |= transformKeysBitwise.rotateZ;
          mat4.multiply(matrix, matrix, mat4.fromZRotation(s_MAT4_TEMP, degToRad(data[key])));
          break;
      }
    }
    if (data !== this._data) {
      for (let cntr = 0; cntr < transformKeys.length; cntr++) {
        const key = transformKeys[cntr];
        if (data[key] === null || (seenKeys & transformKeysBitwise[key]) > 0) {
          continue;
        }
        switch (key) {
          case "rotateX":
            mat4.multiply(matrix, matrix, mat4.fromXRotation(s_MAT4_TEMP, degToRad(data[key])));
            break;
          case "rotateY":
            mat4.multiply(matrix, matrix, mat4.fromYRotation(s_MAT4_TEMP, degToRad(data[key])));
            break;
          case "rotateZ":
            mat4.multiply(matrix, matrix, mat4.fromZRotation(s_MAT4_TEMP, degToRad(data[key])));
            break;
        }
      }
    }
    return matrix;
  }
  hasTransform(data) {
    for (const key of transformKeys) {
      if (Number.isFinite(data[key])) {
        return true;
      }
    }
    return false;
  }
  reset(data) {
    for (const key in data) {
      if (transformKeys.includes(key)) {
        if (Number.isFinite(data[key])) {
          this._data[key] = data[key];
        } else {
          const index = this.#orderList.findIndex((entry) => entry === key);
          if (index >= 0) {
            this.#orderList.splice(index, 1);
          }
          delete this._data[key];
        }
      }
    }
  }
}
__name(Transforms, "Transforms");
function s_GET_ORIGIN_TRANSLATION(transformOrigin, width, height, output) {
  const vector = s_VEC3_TEMP;
  switch (transformOrigin) {
    case "top left":
      vector[0] = vector[1] = 0;
      mat4.fromTranslation(output[0], vector);
      mat4.fromTranslation(output[1], vector);
      break;
    case "top center":
      vector[0] = -width * 0.5;
      vector[1] = 0;
      mat4.fromTranslation(output[0], vector);
      vector[0] = width * 0.5;
      mat4.fromTranslation(output[1], vector);
      break;
    case "top right":
      vector[0] = -width;
      vector[1] = 0;
      mat4.fromTranslation(output[0], vector);
      vector[0] = width;
      mat4.fromTranslation(output[1], vector);
      break;
    case "center left":
      vector[0] = 0;
      vector[1] = -height * 0.5;
      mat4.fromTranslation(output[0], vector);
      vector[1] = height * 0.5;
      mat4.fromTranslation(output[1], vector);
      break;
    case null:
    case "center":
      vector[0] = -width * 0.5;
      vector[1] = -height * 0.5;
      mat4.fromTranslation(output[0], vector);
      vector[0] = width * 0.5;
      vector[1] = height * 0.5;
      mat4.fromTranslation(output[1], vector);
      break;
    case "center right":
      vector[0] = -width;
      vector[1] = -height * 0.5;
      mat4.fromTranslation(output[0], vector);
      vector[0] = width;
      vector[1] = height * 0.5;
      mat4.fromTranslation(output[1], vector);
      break;
    case "bottom left":
      vector[0] = 0;
      vector[1] = -height;
      mat4.fromTranslation(output[0], vector);
      vector[1] = height;
      mat4.fromTranslation(output[1], vector);
      break;
    case "bottom center":
      vector[0] = -width * 0.5;
      vector[1] = -height;
      mat4.fromTranslation(output[0], vector);
      vector[0] = width * 0.5;
      vector[1] = height;
      mat4.fromTranslation(output[1], vector);
      break;
    case "bottom right":
      vector[0] = -width;
      vector[1] = -height;
      mat4.fromTranslation(output[0], vector);
      vector[0] = width;
      vector[1] = height;
      mat4.fromTranslation(output[1], vector);
      break;
    default:
      mat4.identity(output[0]);
      mat4.identity(output[1]);
      break;
  }
  return output;
}
__name(s_GET_ORIGIN_TRANSLATION, "s_GET_ORIGIN_TRANSLATION");
class UpdateElementData {
  constructor() {
    this.data = void 0;
    this.dataSubscribers = new PositionData();
    this.dimensionData = { width: 0, height: 0 };
    this.changeSet = void 0;
    this.options = void 0;
    this.queued = false;
    this.styleCache = void 0;
    this.transforms = void 0;
    this.transformData = new TransformData();
    this.subscriptions = void 0;
    this.storeDimension = writable(this.dimensionData);
    this.storeTransform = writable(this.transformData, () => {
      this.options.transformSubscribed = true;
      return () => this.options.transformSubscribed = false;
    });
    this.queued = false;
    Object.seal(this.dimensionData);
  }
}
__name(UpdateElementData, "UpdateElementData");
async function nextAnimationFrame(cntr = 1) {
  if (!Number.isInteger(cntr) || cntr < 1) {
    throw new TypeError(`nextAnimationFrame error: 'cntr' must be a positive integer greater than 0.`);
  }
  let currentTime = performance.now();
  for (; --cntr >= 0; ) {
    currentTime = await new Promise((resolve) => requestAnimationFrame(resolve));
  }
  return currentTime;
}
__name(nextAnimationFrame, "nextAnimationFrame");
class UpdateElementManager {
  static list = [];
  static listCntr = 0;
  static updatePromise;
  static get promise() {
    return this.updatePromise;
  }
  static add(el, updateData) {
    if (this.listCntr < this.list.length) {
      const entry = this.list[this.listCntr];
      entry[0] = el;
      entry[1] = updateData;
    } else {
      this.list.push([el, updateData]);
    }
    this.listCntr++;
    updateData.queued = true;
    if (!this.updatePromise) {
      this.updatePromise = this.wait();
    }
    return this.updatePromise;
  }
  static async wait() {
    const currentTime = await nextAnimationFrame();
    this.updatePromise = void 0;
    for (let cntr = this.listCntr; --cntr >= 0; ) {
      const entry = this.list[cntr];
      const el = entry[0];
      const updateData = entry[1];
      entry[0] = void 0;
      entry[1] = void 0;
      updateData.queued = false;
      if (!el.isConnected) {
        continue;
      }
      if (updateData.options.ortho) {
        s_UPDATE_ELEMENT_ORTHO(el, updateData);
      } else {
        s_UPDATE_ELEMENT(el, updateData);
      }
      if (updateData.options.calculateTransform || updateData.options.transformSubscribed) {
        s_UPDATE_TRANSFORM(el, updateData);
      }
      this.updateSubscribers(updateData);
    }
    this.listCntr = 0;
    return currentTime;
  }
  static immediate(el, updateData) {
    if (!el.isConnected) {
      return;
    }
    if (updateData.options.ortho) {
      s_UPDATE_ELEMENT_ORTHO(el, updateData);
    } else {
      s_UPDATE_ELEMENT(el, updateData);
    }
    if (updateData.options.calculateTransform || updateData.options.transformSubscribed) {
      s_UPDATE_TRANSFORM(el, updateData);
    }
    this.updateSubscribers(updateData);
  }
  static updateSubscribers(updateData) {
    const data = updateData.data;
    const changeSet = updateData.changeSet;
    if (!changeSet.hasChange()) {
      return;
    }
    const output = updateData.dataSubscribers.copy(data);
    const subscriptions = updateData.subscriptions;
    if (subscriptions.length > 0) {
      for (let cntr = 0; cntr < subscriptions.length; cntr++) {
        subscriptions[cntr](output);
      }
    }
    if (changeSet.width || changeSet.height) {
      updateData.dimensionData.width = data.width;
      updateData.dimensionData.height = data.height;
      updateData.storeDimension.set(updateData.dimensionData);
    }
    changeSet.set(false);
  }
}
__name(UpdateElementManager, "UpdateElementManager");
function s_UPDATE_ELEMENT(el, updateData) {
  const changeSet = updateData.changeSet;
  const data = updateData.data;
  if (changeSet.left) {
    el.style.left = `${data.left}px`;
  }
  if (changeSet.top) {
    el.style.top = `${data.top}px`;
  }
  if (changeSet.zIndex) {
    el.style.zIndex = typeof data.zIndex === "number" ? `${data.zIndex}` : null;
  }
  if (changeSet.width) {
    el.style.width = typeof data.width === "number" ? `${data.width}px` : data.width;
  }
  if (changeSet.height) {
    el.style.height = typeof data.height === "number" ? `${data.height}px` : data.height;
  }
  if (changeSet.transformOrigin) {
    el.style.transformOrigin = data.transformOrigin === "center" ? null : data.transformOrigin;
  }
  if (changeSet.transform) {
    el.style.transform = updateData.transforms.isActive ? updateData.transforms.getCSS() : null;
  }
}
__name(s_UPDATE_ELEMENT, "s_UPDATE_ELEMENT");
function s_UPDATE_ELEMENT_ORTHO(el, updateData) {
  const changeSet = updateData.changeSet;
  const data = updateData.data;
  if (changeSet.zIndex) {
    el.style.zIndex = typeof data.zIndex === "number" ? `${data.zIndex}` : null;
  }
  if (changeSet.width) {
    el.style.width = typeof data.width === "number" ? `${data.width}px` : data.width;
  }
  if (changeSet.height) {
    el.style.height = typeof data.height === "number" ? `${data.height}px` : data.height;
  }
  if (changeSet.transformOrigin) {
    el.style.transformOrigin = data.transformOrigin === "center" ? null : data.transformOrigin;
  }
  if (changeSet.left || changeSet.top || changeSet.transform) {
    el.style.transform = updateData.transforms.getCSSOrtho(data);
  }
}
__name(s_UPDATE_ELEMENT_ORTHO, "s_UPDATE_ELEMENT_ORTHO");
function s_UPDATE_TRANSFORM(el, updateData) {
  s_VALIDATION_DATA$1.height = updateData.data.height !== "auto" ? updateData.data.height : updateData.styleCache.offsetHeight;
  s_VALIDATION_DATA$1.width = updateData.data.width !== "auto" ? updateData.data.width : updateData.styleCache.offsetWidth;
  s_VALIDATION_DATA$1.marginLeft = updateData.styleCache.marginLeft;
  s_VALIDATION_DATA$1.marginTop = updateData.styleCache.marginTop;
  updateData.transforms.getData(updateData.data, updateData.transformData, s_VALIDATION_DATA$1);
  updateData.storeTransform.set(updateData.transformData);
}
__name(s_UPDATE_TRANSFORM, "s_UPDATE_TRANSFORM");
const s_VALIDATION_DATA$1 = {
  height: void 0,
  width: void 0,
  marginLeft: void 0,
  marginTop: void 0
};
class Position {
  #data = new PositionData();
  #animate = new AnimationAPI(this, this.#data);
  #enabled = true;
  #positionChangeSet = new PositionChangeSet();
  #options = {
    calculateTransform: false,
    initialHelper: void 0,
    ortho: true,
    transformSubscribed: false
  };
  #parent;
  #stores;
  #styleCache;
  #subscriptions = [];
  #transforms = new Transforms();
  #updateElementData;
  #updateElementPromise;
  #validators;
  #validatorData;
  #state = new PositionStateAPI(this, this.#data, this.#transforms);
  static get Animate() {
    return AnimationGroupAPI;
  }
  static get Initial() {
    return positionInitial;
  }
  static get TransformData() {
    return TransformData;
  }
  static get Validators() {
    return positionValidators;
  }
  static duplicate(position, options) {
    if (!(position instanceof Position)) {
      throw new TypeError(`'position' is not an instance of Position.`);
    }
    const newPosition = new Position(options);
    newPosition.#options = Object.assign({}, position.#options, options);
    newPosition.#validators.add(...position.#validators);
    newPosition.set(position.#data);
    return newPosition;
  }
  constructor(parent, options) {
    if (isPlainObject(parent)) {
      options = parent;
    } else {
      this.#parent = parent;
    }
    const data = this.#data;
    const transforms = this.#transforms;
    this.#styleCache = new StyleCache();
    const updateData = new UpdateElementData();
    updateData.changeSet = this.#positionChangeSet;
    updateData.data = this.#data;
    updateData.options = this.#options;
    updateData.styleCache = this.#styleCache;
    updateData.subscriptions = this.#subscriptions;
    updateData.transforms = this.#transforms;
    this.#updateElementData = updateData;
    if (typeof options === "object") {
      if (typeof options.calculateTransform === "boolean") {
        this.#options.calculateTransform = options.calculateTransform;
      }
      if (typeof options.ortho === "boolean") {
        this.#options.ortho = options.ortho;
      }
      if (Number.isFinite(options.height) || options.height === "auto" || options.height === "inherit" || options.height === null) {
        data.height = updateData.dimensionData.height = typeof options.height === "number" ? Math.round(options.height) : options.height;
      }
      if (Number.isFinite(options.left) || options.left === null) {
        data.left = typeof options.left === "number" ? Math.round(options.left) : options.left;
      }
      if (Number.isFinite(options.maxHeight) || options.maxHeight === null) {
        data.maxHeight = typeof options.maxHeight === "number" ? Math.round(options.maxHeight) : options.maxHeight;
      }
      if (Number.isFinite(options.maxWidth) || options.maxWidth === null) {
        data.maxWidth = typeof options.maxWidth === "number" ? Math.round(options.maxWidth) : options.maxWidth;
      }
      if (Number.isFinite(options.minHeight) || options.minHeight === null) {
        data.minHeight = typeof options.minHeight === "number" ? Math.round(options.minHeight) : options.minHeight;
      }
      if (Number.isFinite(options.minWidth) || options.minWidth === null) {
        data.minWidth = typeof options.minWidth === "number" ? Math.round(options.minWidth) : options.minWidth;
      }
      if (Number.isFinite(options.rotateX) || options.rotateX === null) {
        transforms.rotateX = data.rotateX = options.rotateX;
      }
      if (Number.isFinite(options.rotateY) || options.rotateY === null) {
        transforms.rotateY = data.rotateY = options.rotateY;
      }
      if (Number.isFinite(options.rotateZ) || options.rotateZ === null) {
        transforms.rotateZ = data.rotateZ = options.rotateZ;
      }
      if (Number.isFinite(options.scale) || options.scale === null) {
        transforms.scale = data.scale = options.scale;
      }
      if (Number.isFinite(options.top) || options.top === null) {
        data.top = typeof options.top === "number" ? Math.round(options.top) : options.top;
      }
      if (typeof options.transformOrigin === "string" || options.transformOrigin === null) {
        data.transformOrigin = transformOrigins.includes(options.transformOrigin) ? options.transformOrigin : null;
      }
      if (Number.isFinite(options.translateX) || options.translateX === null) {
        transforms.translateX = data.translateX = options.translateX;
      }
      if (Number.isFinite(options.translateY) || options.translateY === null) {
        transforms.translateY = data.translateY = options.translateY;
      }
      if (Number.isFinite(options.translateZ) || options.translateZ === null) {
        transforms.translateZ = data.translateZ = options.translateZ;
      }
      if (Number.isFinite(options.width) || options.width === "auto" || options.width === "inherit" || options.width === null) {
        data.width = updateData.dimensionData.width = typeof options.width === "number" ? Math.round(options.width) : options.width;
      }
      if (Number.isFinite(options.zIndex) || options.zIndex === null) {
        data.zIndex = typeof options.zIndex === "number" ? Math.round(options.zIndex) : options.zIndex;
      }
    }
    this.#stores = {
      height: propertyStore(this, "height"),
      left: propertyStore(this, "left"),
      rotateX: propertyStore(this, "rotateX"),
      rotateY: propertyStore(this, "rotateY"),
      rotateZ: propertyStore(this, "rotateZ"),
      scale: propertyStore(this, "scale"),
      top: propertyStore(this, "top"),
      transformOrigin: propertyStore(this, "transformOrigin"),
      translateX: propertyStore(this, "translateX"),
      translateY: propertyStore(this, "translateY"),
      translateZ: propertyStore(this, "translateZ"),
      width: propertyStore(this, "width"),
      zIndex: propertyStore(this, "zIndex"),
      maxHeight: propertyStore(this, "maxHeight"),
      maxWidth: propertyStore(this, "maxWidth"),
      minHeight: propertyStore(this, "minHeight"),
      minWidth: propertyStore(this, "minWidth"),
      dimension: { subscribe: updateData.storeDimension.subscribe },
      element: { subscribe: this.#styleCache.stores.element.subscribe },
      resizeContentHeight: { subscribe: this.#styleCache.stores.resizeContentHeight.subscribe },
      resizeContentWidth: { subscribe: this.#styleCache.stores.resizeContentWidth.subscribe },
      resizeOffsetHeight: { subscribe: this.#styleCache.stores.resizeOffsetHeight.subscribe },
      resizeOffsetWidth: { subscribe: this.#styleCache.stores.resizeOffsetWidth.subscribe },
      transform: { subscribe: updateData.storeTransform.subscribe },
      resizeObserved: this.#styleCache.stores.resizeObserved
    };
    subscribeIgnoreFirst(this.#stores.resizeObserved, (resizeData) => {
      const parent2 = this.#parent;
      const el = parent2 instanceof HTMLElement ? parent2 : parent2?.elementTarget;
      if (el instanceof HTMLElement && Number.isFinite(resizeData?.offsetWidth) && Number.isFinite(resizeData?.offsetHeight)) {
        this.set(data);
      }
    });
    this.#stores.transformOrigin.values = transformOrigins;
    [this.#validators, this.#validatorData] = new AdapterValidators();
    if (options?.initial || options?.positionInitial) {
      const initialHelper = options.initial ?? options.positionInitial;
      if (typeof initialHelper?.getLeft !== "function" || typeof initialHelper?.getTop !== "function") {
        throw new Error(
          `'options.initial' position helper does not contain 'getLeft' and / or 'getTop' functions.`
        );
      }
      this.#options.initialHelper = options.initial;
    }
    if (options?.validator) {
      if (isIterable(options?.validator)) {
        this.validators.add(...options.validator);
      } else {
        this.validators.add(options.validator);
      }
    }
  }
  get animate() {
    return this.#animate;
  }
  get dimension() {
    return this.#updateElementData.dimensionData;
  }
  get enabled() {
    return this.#enabled;
  }
  get element() {
    return this.#styleCache.el;
  }
  get elementUpdated() {
    return this.#updateElementPromise;
  }
  get parent() {
    return this.#parent;
  }
  get state() {
    return this.#state;
  }
  get stores() {
    return this.#stores;
  }
  get transform() {
    return this.#updateElementData.transformData;
  }
  get validators() {
    return this.#validators;
  }
  set enabled(enabled) {
    if (typeof enabled !== "boolean") {
      throw new TypeError(`'enabled' is not a boolean.`);
    }
    this.#enabled = enabled;
  }
  set parent(parent) {
    if (parent !== void 0 && !(parent instanceof HTMLElement) && !isObject(parent)) {
      throw new TypeError(`'parent' is not an HTMLElement, object, or undefined.`);
    }
    this.#parent = parent;
    this.#state.remove({ name: "#defaultData" });
    this.#styleCache.reset();
    if (parent) {
      this.set(this.#data);
    }
  }
  get height() {
    return this.#data.height;
  }
  get left() {
    return this.#data.left;
  }
  get maxHeight() {
    return this.#data.maxHeight;
  }
  get maxWidth() {
    return this.#data.maxWidth;
  }
  get minHeight() {
    return this.#data.minHeight;
  }
  get minWidth() {
    return this.#data.minWidth;
  }
  get rotateX() {
    return this.#data.rotateX;
  }
  get rotateY() {
    return this.#data.rotateY;
  }
  get rotateZ() {
    return this.#data.rotateZ;
  }
  get rotation() {
    return this.#data.rotateZ;
  }
  get scale() {
    return this.#data.scale;
  }
  get top() {
    return this.#data.top;
  }
  get transformOrigin() {
    return this.#data.transformOrigin;
  }
  get translateX() {
    return this.#data.translateX;
  }
  get translateY() {
    return this.#data.translateY;
  }
  get translateZ() {
    return this.#data.translateZ;
  }
  get width() {
    return this.#data.width;
  }
  get zIndex() {
    return this.#data.zIndex;
  }
  set height(height) {
    this.#stores.height.set(height);
  }
  set left(left) {
    this.#stores.left.set(left);
  }
  set maxHeight(maxHeight) {
    this.#stores.maxHeight.set(maxHeight);
  }
  set maxWidth(maxWidth) {
    this.#stores.maxWidth.set(maxWidth);
  }
  set minHeight(minHeight) {
    this.#stores.minHeight.set(minHeight);
  }
  set minWidth(minWidth) {
    this.#stores.minWidth.set(minWidth);
  }
  set rotateX(rotateX) {
    this.#stores.rotateX.set(rotateX);
  }
  set rotateY(rotateY) {
    this.#stores.rotateY.set(rotateY);
  }
  set rotateZ(rotateZ) {
    this.#stores.rotateZ.set(rotateZ);
  }
  set rotation(rotateZ) {
    this.#stores.rotateZ.set(rotateZ);
  }
  set scale(scale) {
    this.#stores.scale.set(scale);
  }
  set top(top) {
    this.#stores.top.set(top);
  }
  set transformOrigin(transformOrigin) {
    if (transformOrigins.includes(transformOrigin)) {
      this.#stores.transformOrigin.set(transformOrigin);
    }
  }
  set translateX(translateX) {
    this.#stores.translateX.set(translateX);
  }
  set translateY(translateY) {
    this.#stores.translateY.set(translateY);
  }
  set translateZ(translateZ) {
    this.#stores.translateZ.set(translateZ);
  }
  set width(width) {
    this.#stores.width.set(width);
  }
  set zIndex(zIndex) {
    this.#stores.zIndex.set(zIndex);
  }
  get(position = {}, options) {
    const keys = options?.keys;
    const excludeKeys = options?.exclude;
    const numeric = options?.numeric ?? false;
    if (isIterable(keys)) {
      if (numeric) {
        for (const key of keys) {
          position[key] = this[key] ?? numericDefaults[key];
        }
      } else {
        for (const key of keys) {
          position[key] = this[key];
        }
      }
      if (isIterable(excludeKeys)) {
        for (const key of excludeKeys) {
          delete position[key];
        }
      }
      return position;
    } else {
      const data = Object.assign(position, this.#data);
      if (isIterable(excludeKeys)) {
        for (const key of excludeKeys) {
          delete data[key];
        }
      }
      if (numeric) {
        setNumericDefaults(data);
      }
      return data;
    }
  }
  toJSON() {
    return Object.assign({}, this.#data);
  }
  set(position = {}) {
    if (typeof position !== "object") {
      throw new TypeError(`Position - set error: 'position' is not an object.`);
    }
    const parent = this.#parent;
    if (!this.#enabled) {
      return this;
    }
    if (parent !== void 0 && typeof parent?.options?.positionable === "boolean" && !parent?.options?.positionable) {
      return this;
    }
    const immediateElementUpdate = position.immediateElementUpdate === true;
    const data = this.#data;
    const transforms = this.#transforms;
    const targetEl = parent instanceof HTMLElement ? parent : parent?.elementTarget;
    const el = targetEl instanceof HTMLElement && targetEl.isConnected ? targetEl : void 0;
    const changeSet = this.#positionChangeSet;
    const styleCache = this.#styleCache;
    if (el) {
      if (!styleCache.hasData(el)) {
        styleCache.update(el);
        if (!styleCache.hasWillChange) {
          el.style.willChange = this.#options.ortho ? "transform" : "top, left, transform";
        }
        changeSet.set(true);
        this.#updateElementData.queued = false;
      }
      convertRelative(position, this);
      position = this.#updatePosition(position, parent, el, styleCache);
      if (position === null) {
        return this;
      }
    }
    if (Number.isFinite(position.left)) {
      position.left = Math.round(position.left);
      if (data.left !== position.left) {
        data.left = position.left;
        changeSet.left = true;
      }
    }
    if (Number.isFinite(position.top)) {
      position.top = Math.round(position.top);
      if (data.top !== position.top) {
        data.top = position.top;
        changeSet.top = true;
      }
    }
    if (Number.isFinite(position.maxHeight) || position.maxHeight === null) {
      position.maxHeight = typeof position.maxHeight === "number" ? Math.round(position.maxHeight) : null;
      if (data.maxHeight !== position.maxHeight) {
        data.maxHeight = position.maxHeight;
        changeSet.maxHeight = true;
      }
    }
    if (Number.isFinite(position.maxWidth) || position.maxWidth === null) {
      position.maxWidth = typeof position.maxWidth === "number" ? Math.round(position.maxWidth) : null;
      if (data.maxWidth !== position.maxWidth) {
        data.maxWidth = position.maxWidth;
        changeSet.maxWidth = true;
      }
    }
    if (Number.isFinite(position.minHeight) || position.minHeight === null) {
      position.minHeight = typeof position.minHeight === "number" ? Math.round(position.minHeight) : null;
      if (data.minHeight !== position.minHeight) {
        data.minHeight = position.minHeight;
        changeSet.minHeight = true;
      }
    }
    if (Number.isFinite(position.minWidth) || position.minWidth === null) {
      position.minWidth = typeof position.minWidth === "number" ? Math.round(position.minWidth) : null;
      if (data.minWidth !== position.minWidth) {
        data.minWidth = position.minWidth;
        changeSet.minWidth = true;
      }
    }
    if (Number.isFinite(position.rotateX) || position.rotateX === null) {
      if (data.rotateX !== position.rotateX) {
        data.rotateX = transforms.rotateX = position.rotateX;
        changeSet.transform = true;
      }
    }
    if (Number.isFinite(position.rotateY) || position.rotateY === null) {
      if (data.rotateY !== position.rotateY) {
        data.rotateY = transforms.rotateY = position.rotateY;
        changeSet.transform = true;
      }
    }
    if (Number.isFinite(position.rotateZ) || position.rotateZ === null) {
      if (data.rotateZ !== position.rotateZ) {
        data.rotateZ = transforms.rotateZ = position.rotateZ;
        changeSet.transform = true;
      }
    }
    if (Number.isFinite(position.scale) || position.scale === null) {
      position.scale = typeof position.scale === "number" ? Math.max(0, Math.min(position.scale, 1e3)) : null;
      if (data.scale !== position.scale) {
        data.scale = transforms.scale = position.scale;
        changeSet.transform = true;
      }
    }
    if (typeof position.transformOrigin === "string" && transformOrigins.includes(
      position.transformOrigin
    ) || position.transformOrigin === null) {
      if (data.transformOrigin !== position.transformOrigin) {
        data.transformOrigin = position.transformOrigin;
        changeSet.transformOrigin = true;
      }
    }
    if (Number.isFinite(position.translateX) || position.translateX === null) {
      if (data.translateX !== position.translateX) {
        data.translateX = transforms.translateX = position.translateX;
        changeSet.transform = true;
      }
    }
    if (Number.isFinite(position.translateY) || position.translateY === null) {
      if (data.translateY !== position.translateY) {
        data.translateY = transforms.translateY = position.translateY;
        changeSet.transform = true;
      }
    }
    if (Number.isFinite(position.translateZ) || position.translateZ === null) {
      if (data.translateZ !== position.translateZ) {
        data.translateZ = transforms.translateZ = position.translateZ;
        changeSet.transform = true;
      }
    }
    if (Number.isFinite(position.zIndex)) {
      position.zIndex = Math.round(position.zIndex);
      if (data.zIndex !== position.zIndex) {
        data.zIndex = position.zIndex;
        changeSet.zIndex = true;
      }
    }
    if (Number.isFinite(position.width) || position.width === "auto" || position.width === "inherit" || position.width === null) {
      position.width = typeof position.width === "number" ? Math.round(position.width) : position.width;
      if (data.width !== position.width) {
        data.width = position.width;
        changeSet.width = true;
      }
    }
    if (Number.isFinite(position.height) || position.height === "auto" || position.height === "inherit" || position.height === null) {
      position.height = typeof position.height === "number" ? Math.round(position.height) : position.height;
      if (data.height !== position.height) {
        data.height = position.height;
        changeSet.height = true;
      }
    }
    if (el) {
      const defaultData = this.#state.getDefault();
      if (typeof defaultData !== "object") {
        this.#state.save({ name: "#defaultData", ...Object.assign({}, data) });
      }
      if (immediateElementUpdate) {
        UpdateElementManager.immediate(el, this.#updateElementData);
        this.#updateElementPromise = Promise.resolve(performance.now());
      } else if (!this.#updateElementData.queued) {
        this.#updateElementPromise = UpdateElementManager.add(el, this.#updateElementData);
      }
    } else {
      UpdateElementManager.updateSubscribers(this.#updateElementData);
    }
    return this;
  }
  subscribe(handler) {
    this.#subscriptions.push(handler);
    handler(Object.assign({}, this.#data));
    return () => {
      const index = this.#subscriptions.findIndex((sub) => sub === handler);
      if (index >= 0) {
        this.#subscriptions.splice(index, 1);
      }
    };
  }
  #updatePosition({
    left,
    top,
    maxWidth,
    maxHeight,
    minWidth,
    minHeight,
    width,
    height,
    rotateX,
    rotateY,
    rotateZ,
    scale,
    transformOrigin,
    translateX,
    translateY,
    translateZ,
    zIndex,
    rotation,
    ...rest
  } = {}, parent, el, styleCache) {
    let currentPosition = s_DATA_UPDATE.copy(this.#data);
    if (el.style.width === "" || width !== void 0) {
      if (width === "auto" || currentPosition.width === "auto" && width !== null) {
        currentPosition.width = "auto";
        width = styleCache.offsetWidth;
      } else if (width === "inherit" || currentPosition.width === "inherit" && width !== null) {
        currentPosition.width = "inherit";
        width = styleCache.offsetWidth;
      } else {
        const newWidth = Number.isFinite(width) ? width : currentPosition.width;
        currentPosition.width = width = Number.isFinite(newWidth) ? Math.round(newWidth) : styleCache.offsetWidth;
      }
    } else {
      width = Number.isFinite(currentPosition.width) ? currentPosition.width : styleCache.offsetWidth;
    }
    if (el.style.height === "" || height !== void 0) {
      if (height === "auto" || currentPosition.height === "auto" && height !== null) {
        currentPosition.height = "auto";
        height = styleCache.offsetHeight;
      } else if (height === "inherit" || currentPosition.height === "inherit" && height !== null) {
        currentPosition.height = "inherit";
        height = styleCache.offsetHeight;
      } else {
        const newHeight = Number.isFinite(height) ? height : currentPosition.height;
        currentPosition.height = height = Number.isFinite(newHeight) ? Math.round(newHeight) : styleCache.offsetHeight;
      }
    } else {
      height = Number.isFinite(currentPosition.height) ? currentPosition.height : styleCache.offsetHeight;
    }
    if (Number.isFinite(left)) {
      currentPosition.left = left;
    } else if (!Number.isFinite(currentPosition.left)) {
      currentPosition.left = typeof this.#options.initialHelper?.getLeft === "function" ? this.#options.initialHelper.getLeft(width) : 0;
    }
    if (Number.isFinite(top)) {
      currentPosition.top = top;
    } else if (!Number.isFinite(currentPosition.top)) {
      currentPosition.top = typeof this.#options.initialHelper?.getTop === "function" ? this.#options.initialHelper.getTop(height) : 0;
    }
    if (Number.isFinite(maxHeight) || maxHeight === null) {
      currentPosition.maxHeight = Number.isFinite(maxHeight) ? Math.round(maxHeight) : null;
    }
    if (Number.isFinite(maxWidth) || maxWidth === null) {
      currentPosition.maxWidth = Number.isFinite(maxWidth) ? Math.round(maxWidth) : null;
    }
    if (Number.isFinite(minHeight) || minHeight === null) {
      currentPosition.minHeight = Number.isFinite(minHeight) ? Math.round(minHeight) : null;
    }
    if (Number.isFinite(minWidth) || minWidth === null) {
      currentPosition.minWidth = Number.isFinite(minWidth) ? Math.round(minWidth) : null;
    }
    if (Number.isFinite(rotateX) || rotateX === null) {
      currentPosition.rotateX = rotateX;
    }
    if (Number.isFinite(rotateY) || rotateY === null) {
      currentPosition.rotateY = rotateY;
    }
    if (rotateZ !== currentPosition.rotateZ && (Number.isFinite(rotateZ) || rotateZ === null)) {
      currentPosition.rotateZ = rotateZ;
    } else if (rotation !== currentPosition.rotateZ && (Number.isFinite(rotation) || rotation === null)) {
      currentPosition.rotateZ = rotation;
    }
    if (Number.isFinite(translateX) || translateX === null) {
      currentPosition.translateX = translateX;
    }
    if (Number.isFinite(translateY) || translateY === null) {
      currentPosition.translateY = translateY;
    }
    if (Number.isFinite(translateZ) || translateZ === null) {
      currentPosition.translateZ = translateZ;
    }
    if (Number.isFinite(scale) || scale === null) {
      currentPosition.scale = typeof scale === "number" ? Math.max(0, Math.min(scale, 1e3)) : null;
    }
    if (typeof transformOrigin === "string" || transformOrigin === null) {
      currentPosition.transformOrigin = transformOrigins.includes(transformOrigin) ? transformOrigin : null;
    }
    if (Number.isFinite(zIndex) || zIndex === null) {
      currentPosition.zIndex = typeof zIndex === "number" ? Math.round(zIndex) : zIndex;
    }
    const validatorData = this.#validatorData;
    if (validatorData.length) {
      s_VALIDATION_DATA.parent = parent;
      s_VALIDATION_DATA.el = el;
      s_VALIDATION_DATA.computed = styleCache.computed;
      s_VALIDATION_DATA.transforms = this.#transforms;
      s_VALIDATION_DATA.height = height;
      s_VALIDATION_DATA.width = width;
      s_VALIDATION_DATA.marginLeft = styleCache.marginLeft;
      s_VALIDATION_DATA.marginTop = styleCache.marginTop;
      s_VALIDATION_DATA.maxHeight = styleCache.maxHeight ?? currentPosition.maxHeight;
      s_VALIDATION_DATA.maxWidth = styleCache.maxWidth ?? currentPosition.maxWidth;
      const isMinimized = parent?.reactive?.minimized ?? false;
      s_VALIDATION_DATA.minHeight = isMinimized ? currentPosition.minHeight ?? 0 : styleCache.minHeight || (currentPosition.minHeight ?? 0);
      s_VALIDATION_DATA.minWidth = isMinimized ? currentPosition.minWidth ?? 0 : styleCache.minWidth || (currentPosition.minWidth ?? 0);
      for (let cntr = 0; cntr < validatorData.length; cntr++) {
        s_VALIDATION_DATA.position = currentPosition;
        s_VALIDATION_DATA.rest = rest;
        currentPosition = validatorData[cntr].validator(s_VALIDATION_DATA);
        if (currentPosition === null) {
          return null;
        }
      }
    }
    return currentPosition;
  }
}
__name(Position, "Position");
const s_DATA_UPDATE = new PositionData();
const s_VALIDATION_DATA = {
  position: void 0,
  parent: void 0,
  el: void 0,
  computed: void 0,
  transforms: void 0,
  height: void 0,
  width: void 0,
  marginLeft: void 0,
  marginTop: void 0,
  maxHeight: void 0,
  maxWidth: void 0,
  minHeight: void 0,
  minWidth: void 0,
  rest: void 0
};
Object.seal(s_VALIDATION_DATA);
class ApplicationState {
  #application;
  #dataSaved = /* @__PURE__ */ new Map();
  constructor(application) {
    this.#application = application;
  }
  get(extra = {}) {
    return Object.assign(extra, {
      position: this.#application?.position?.get(),
      beforeMinimized: this.#application?.position?.state.get({ name: "#beforeMinimized" }),
      options: Object.assign({}, this.#application?.options),
      ui: { minimized: this.#application?.reactive?.minimized }
    });
  }
  getSave({ name }) {
    if (typeof name !== "string") {
      throw new TypeError(`ApplicationState - getSave error: 'name' is not a string.`);
    }
    return this.#dataSaved.get(name);
  }
  remove({ name }) {
    if (typeof name !== "string") {
      throw new TypeError(`ApplicationState - remove: 'name' is not a string.`);
    }
    const data = this.#dataSaved.get(name);
    this.#dataSaved.delete(name);
    return data;
  }
  restore({
    name,
    remove = false,
    async = false,
    animateTo = false,
    duration = 0.1,
    ease = identity,
    interpolate = lerp$5
  }) {
    if (typeof name !== "string") {
      throw new TypeError(`ApplicationState - restore error: 'name' is not a string.`);
    }
    const dataSaved = this.#dataSaved.get(name);
    if (dataSaved) {
      if (remove) {
        this.#dataSaved.delete(name);
      }
      if (async) {
        return this.set(dataSaved, { async, animateTo, duration, ease, interpolate }).then(() => dataSaved);
      } else {
        this.set(dataSaved, { async, animateTo, duration, ease, interpolate });
      }
    }
    return dataSaved;
  }
  save({ name, ...extra }) {
    if (typeof name !== "string") {
      throw new TypeError(`ApplicationState - save error: 'name' is not a string.`);
    }
    const data = this.get(extra);
    this.#dataSaved.set(name, data);
    return data;
  }
  set(data, { async = false, animateTo = false, duration = 0.1, ease = identity, interpolate = lerp$5 } = {}) {
    if (!isObject(data)) {
      throw new TypeError(`ApplicationState - restore error: 'data' is not an object.`);
    }
    const application = this.#application;
    if (!isObject(data?.position)) {
      console.warn(`ApplicationState.set warning: 'data.position' is not an object.`);
      return application;
    }
    const rendered = application.rendered;
    if (animateTo && !rendered) {
      console.warn(`ApplicationState.set warning: Application is not rendered and 'animateTo' is true.`);
      return application;
    }
    if (animateTo) {
      if (data.position.transformOrigin !== application.position.transformOrigin) {
        application.position.transformOrigin = data.position.transformOrigin;
      }
      if (isObject(data?.ui)) {
        const minimized = typeof data.ui?.minimized === "boolean" ? data.ui.minimized : false;
        if (application?.reactive?.minimized && !minimized) {
          application.maximize({ animate: false, duration: 0 });
        }
      }
      const promise2 = application.position.animate.to(
        data.position,
        { duration, ease, interpolate }
      ).finished.then((cancelled) => {
        if (cancelled) {
          return application;
        }
        if (isObject(data?.options)) {
          application?.reactive.mergeOptions(data.options);
        }
        if (isObject(data?.ui)) {
          const minimized = typeof data.ui?.minimized === "boolean" ? data.ui.minimized : false;
          if (!application?.reactive?.minimized && minimized) {
            application.minimize({ animate: false, duration: 0 });
          }
        }
        if (isObject(data?.beforeMinimized)) {
          application.position.state.set({ name: "#beforeMinimized", ...data.beforeMinimized });
        }
        return application;
      });
      if (async) {
        return promise2;
      }
    } else {
      if (rendered) {
        if (isObject(data?.options)) {
          application?.reactive.mergeOptions(data.options);
        }
        if (isObject(data?.ui)) {
          const minimized = typeof data.ui?.minimized === "boolean" ? data.ui.minimized : false;
          if (application?.reactive?.minimized && !minimized) {
            application.maximize({ animate: false, duration: 0 });
          } else if (!application?.reactive?.minimized && minimized) {
            application.minimize({ animate: false, duration });
          }
        }
        if (isObject(data?.beforeMinimized)) {
          application.position.state.set({ name: "#beforeMinimized", ...data.beforeMinimized });
        }
        application.position.set(data.position);
      } else {
        let positionData = data.position;
        if (isObject(data.beforeMinimized)) {
          positionData = data.beforeMinimized;
          positionData.left = data.position.left;
          positionData.top = data.position.top;
        }
        application.position.set(positionData);
      }
    }
    return application;
  }
}
__name(ApplicationState, "ApplicationState");
class GetSvelteData {
  #applicationShellHolder;
  #svelteData;
  constructor(applicationShellHolder, svelteData) {
    this.#applicationShellHolder = applicationShellHolder;
    this.#svelteData = svelteData;
  }
  get applicationShell() {
    return this.#applicationShellHolder[0];
  }
  component(index) {
    const data = this.#svelteData[index];
    return typeof data === "object" ? data?.component : void 0;
  }
  *componentEntries() {
    for (let cntr = 0; cntr < this.#svelteData.length; cntr++) {
      yield [cntr, this.#svelteData[cntr].component];
    }
  }
  *componentValues() {
    for (let cntr = 0; cntr < this.#svelteData.length; cntr++) {
      yield this.#svelteData[cntr].component;
    }
  }
  data(index) {
    return this.#svelteData[index];
  }
  dataByComponent(component) {
    for (const data of this.#svelteData) {
      if (data.component === component) {
        return data;
      }
    }
    return void 0;
  }
  dataEntries() {
    return this.#svelteData.entries();
  }
  dataValues() {
    return this.#svelteData.values();
  }
  get length() {
    return this.#svelteData.length;
  }
}
__name(GetSvelteData, "GetSvelteData");
function loadSvelteConfig({ app, template, config, elementRootUpdate } = {}) {
  const svelteOptions = typeof config.options === "object" ? config.options : {};
  let target;
  if (config.target instanceof HTMLElement) {
    target = config.target;
  } else if (template instanceof HTMLElement && typeof config.target === "string") {
    target = template.querySelector(config.target);
  } else {
    target = document.createDocumentFragment();
  }
  if (target === void 0) {
    console.log(
      `%c[TRL] loadSvelteConfig error - could not find target selector, '${config.target}', for config:
`,
      "background: rgb(57,34,34)",
      config
    );
    throw new Error();
  }
  const NewSvelteComponent = config.class;
  const svelteConfig = parseSvelteConfig({ ...config, target }, app);
  const externalContext = svelteConfig.context.get("external");
  externalContext.application = app;
  externalContext.elementRootUpdate = elementRootUpdate;
  let eventbus;
  if (typeof app._eventbus === "object" && typeof app._eventbus.createProxy === "function") {
    eventbus = app._eventbus.createProxy();
    externalContext.eventbus = eventbus;
  }
  const component = new NewSvelteComponent(svelteConfig);
  svelteConfig.eventbus = eventbus;
  let element2;
  if (isApplicationShell(component)) {
    element2 = component.elementRoot;
  }
  if (target instanceof DocumentFragment && target.firstElementChild) {
    if (element2 === void 0) {
      element2 = target.firstElementChild;
    }
    template.append(target);
  } else if (config.target instanceof HTMLElement && element2 === void 0) {
    if (config.target instanceof HTMLElement && typeof svelteOptions.selectorElement !== "string") {
      console.log(
        `%c[TRL] loadSvelteConfig error - HTMLElement target with no 'selectorElement' defined.

Note: If configuring an application shell and directly targeting a HTMLElement did you bind an'elementRoot' and include '<svelte:options accessors={true}/>'?

Offending config:
`,
        "background: rgb(57,34,34)",
        config
      );
      throw new Error();
    }
    element2 = target.querySelector(svelteOptions.selectorElement);
    if (element2 === null || element2 === void 0) {
      console.log(
        `%c[TRL] loadSvelteConfig error - HTMLElement target with 'selectorElement', '${svelteOptions.selectorElement}', not found for config:
`,
        "background: rgb(57,34,34)",
        config
      );
      throw new Error();
    }
  }
  const injectHTML = !(config.target instanceof HTMLElement);
  return { config: svelteConfig, component, element: element2, injectHTML };
}
__name(loadSvelteConfig, "loadSvelteConfig");
class SvelteReactive {
  #application;
  #initialized = false;
  #storeAppOptions;
  #storeAppOptionsUpdate;
  #dataUIState;
  #storeUIState;
  #storeUIStateUpdate;
  #storeUnsubscribe = [];
  constructor(application) {
    this.#application = application;
  }
  initialize() {
    if (this.#initialized) {
      return;
    }
    this.#initialized = true;
    this.#storesInitialize();
    return {
      appOptionsUpdate: this.#storeAppOptionsUpdate,
      uiOptionsUpdate: this.#storeUIStateUpdate,
      subscribe: this.#storesSubscribe.bind(this),
      unsubscribe: this.#storesUnsubscribe.bind(this)
    };
  }
  get dragging() {
    return this.#dataUIState.dragging;
  }
  get minimized() {
    return this.#dataUIState.minimized;
  }
  get resizing() {
    return this.#dataUIState.resizing;
  }
  get draggable() {
    return this.#application?.options?.draggable;
  }
  get headerButtonNoClose() {
    return this.#application?.options?.headerButtonNoClose;
  }
  get headerButtonNoLabel() {
    return this.#application?.options?.headerButtonNoLabel;
  }
  get headerNoTitleMinimized() {
    return this.#application?.options?.headerNoTitleMinimized;
  }
  get minimizable() {
    return this.#application?.options?.minimizable;
  }
  get popOut() {
    return this.#application.popOut;
  }
  get resizable() {
    return this.#application?.options?.resizable;
  }
  get storeAppOptions() {
    return this.#storeAppOptions;
  }
  get storeUIState() {
    return this.#storeUIState;
  }
  get title() {
    return this.#application.title;
  }
  set draggable(draggable2) {
    if (typeof draggable2 === "boolean") {
      this.setOptions("draggable", draggable2);
    }
  }
  set headerButtonNoClose(headerButtonNoClose) {
    if (typeof headerButtonNoClose === "boolean") {
      this.setOptions("headerButtonNoClose", headerButtonNoClose);
    }
  }
  set headerButtonNoLabel(headerButtonNoLabel) {
    if (typeof headerButtonNoLabel === "boolean") {
      this.setOptions("headerButtonNoLabel", headerButtonNoLabel);
    }
  }
  set headerNoTitleMinimized(headerNoTitleMinimized) {
    if (typeof headerNoTitleMinimized === "boolean") {
      this.setOptions("headerNoTitleMinimized", headerNoTitleMinimized);
    }
  }
  set minimizable(minimizable) {
    if (typeof minimizable === "boolean") {
      this.setOptions("minimizable", minimizable);
    }
  }
  set popOut(popOut) {
    if (typeof popOut === "boolean") {
      this.setOptions("popOut", popOut);
    }
  }
  set resizable(resizable) {
    if (typeof resizable === "boolean") {
      this.setOptions("resizable", resizable);
    }
  }
  set title(title) {
    if (typeof title === "string") {
      this.setOptions("title", title);
    } else if (title === void 0 || title === null) {
      this.setOptions("title", "");
    }
  }
  getOptions(accessor, defaultValue) {
    return safeAccess(this.#application.options, accessor, defaultValue);
  }
  mergeOptions(options) {
    this.#storeAppOptionsUpdate((instanceOptions) => deepMerge(instanceOptions, options));
  }
  setOptions(accessor, value) {
    const success = safeSet(this.#application.options, accessor, value);
    if (success) {
      this.#storeAppOptionsUpdate(() => this.#application.options);
    }
  }
  #storesInitialize() {
    const writableAppOptions = writable(this.#application.options);
    this.#storeAppOptionsUpdate = writableAppOptions.update;
    const storeAppOptions = {
      subscribe: writableAppOptions.subscribe,
      draggable: propertyStore(writableAppOptions, "draggable"),
      headerButtonNoClose: propertyStore(writableAppOptions, "headerButtonNoClose"),
      headerButtonNoLabel: propertyStore(writableAppOptions, "headerButtonNoLabel"),
      headerNoTitleMinimized: propertyStore(writableAppOptions, "headerNoTitleMinimized"),
      minimizable: propertyStore(writableAppOptions, "minimizable"),
      popOut: propertyStore(writableAppOptions, "popOut"),
      resizable: propertyStore(writableAppOptions, "resizable"),
      title: propertyStore(writableAppOptions, "title")
    };
    Object.freeze(storeAppOptions);
    this.#storeAppOptions = storeAppOptions;
    this.#dataUIState = {
      dragging: false,
      headerButtons: [],
      minimized: this.#application._minimized,
      resizing: false
    };
    const writableUIOptions = writable(this.#dataUIState);
    this.#storeUIStateUpdate = writableUIOptions.update;
    const storeUIState = {
      subscribe: writableUIOptions.subscribe,
      dragging: propertyStore(writableUIOptions, "dragging"),
      headerButtons: derived(writableUIOptions, ($options, set) => set($options.headerButtons)),
      minimized: derived(writableUIOptions, ($options, set) => set($options.minimized)),
      resizing: propertyStore(writableUIOptions, "resizing")
    };
    Object.freeze(storeUIState);
    this.#storeUIState = storeUIState;
  }
  #storesSubscribe() {
    this.#storeUnsubscribe.push(subscribeIgnoreFirst(this.#storeAppOptions.headerButtonNoClose, (value) => {
      this.updateHeaderButtons({ headerButtonNoClose: value });
    }));
    this.#storeUnsubscribe.push(subscribeIgnoreFirst(this.#storeAppOptions.headerButtonNoLabel, (value) => {
      this.updateHeaderButtons({ headerButtonNoLabel: value });
    }));
    this.#storeUnsubscribe.push(subscribeIgnoreFirst(this.#storeAppOptions.popOut, (value) => {
      if (value && this.#application.rendered) {
        ui.windows[this.#application.appId] = this.#application;
      } else {
        delete ui.windows[this.#application.appId];
      }
    }));
  }
  #storesUnsubscribe() {
    this.#storeUnsubscribe.forEach((unsubscribe) => unsubscribe());
    this.#storeUnsubscribe = [];
  }
  updateHeaderButtons({
    headerButtonNoClose = this.#application.options.headerButtonNoClose,
    headerButtonNoLabel = this.#application.options.headerButtonNoLabel
  } = {}) {
    let buttons = this.#application._getHeaderButtons();
    if (typeof headerButtonNoClose === "boolean" && headerButtonNoClose) {
      buttons = buttons.filter((button) => button.class !== "close");
    }
    if (typeof headerButtonNoLabel === "boolean" && headerButtonNoLabel) {
      for (const button of buttons) {
        button.label = void 0;
      }
    }
    this.#storeUIStateUpdate((options) => {
      options.headerButtons = buttons;
      return options;
    });
  }
}
__name(SvelteReactive, "SvelteReactive");
class SvelteApplication extends Application {
  #applicationShellHolder = [null];
  #applicationState;
  #elementTarget = null;
  #elementContent = null;
  #initialZIndex = 95;
  #onMount = false;
  #position;
  #reactive;
  #svelteData = [];
  #getSvelteData = new GetSvelteData(this.#applicationShellHolder, this.#svelteData);
  #stores;
  constructor(options = {}) {
    super(options);
    this.#applicationState = new ApplicationState(this);
    this.#position = new Position(this, {
      ...this.position,
      ...this.options,
      initial: this.options.positionInitial,
      ortho: this.options.positionOrtho,
      validator: this.options.positionValidator
    });
    delete this.position;
    Object.defineProperty(this, "position", {
      get: () => this.#position,
      set: (position) => {
        if (typeof position === "object") {
          this.#position.set(position);
        }
      }
    });
    this.#reactive = new SvelteReactive(this);
    this.#stores = this.#reactive.initialize();
  }
  static get defaultOptions() {
    return deepMerge(super.defaultOptions, {
      defaultCloseAnimation: true,
      draggable: true,
      headerButtonNoClose: false,
      headerButtonNoLabel: false,
      headerNoTitleMinimized: false,
      minHeight: MIN_WINDOW_HEIGHT,
      minWidth: MIN_WINDOW_WIDTH,
      positionable: true,
      positionInitial: Position.Initial.browserCentered,
      positionOrtho: true,
      positionValidator: Position.Validators.transformWindow,
      transformOrigin: "top left"
    });
  }
  get elementContent() {
    return this.#elementContent;
  }
  get elementTarget() {
    return this.#elementTarget;
  }
  get reactive() {
    return this.#reactive;
  }
  get state() {
    return this.#applicationState;
  }
  get svelte() {
    return this.#getSvelteData;
  }
  _activateCoreListeners(html) {
    super._activateCoreListeners(typeof this.options.template === "string" ? html : [this.#elementTarget]);
  }
  bringToTop({ force = false } = {}) {
    if (force || this.popOut) {
      super.bringToTop();
    }
    if (document.activeElement !== document.body && !this.elementTarget.contains(document.activeElement)) {
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
      document.body.focus();
    }
    ui.activeWindow = this;
  }
  async close(options = {}) {
    const states = Application.RENDER_STATES;
    if (!options.force && ![states.RENDERED, states.ERROR].includes(this._state)) {
      return;
    }
    this.#stores.unsubscribe();
    this._state = states.CLOSING;
    const el = this.#elementTarget;
    if (!el) {
      return this._state = states.CLOSED;
    }
    const content = el.querySelector(".window-content");
    if (content) {
      content.style.overflow = "hidden";
      for (let cntr = content.children.length; --cntr >= 0; ) {
        content.children[cntr].style.overflow = "hidden";
      }
    }
    for (const cls of this.constructor._getInheritanceChain()) {
      Hooks.call(`close${cls.name}`, this, el);
    }
    const animate = typeof this.options.defaultCloseAnimation === "boolean" ? this.options.defaultCloseAnimation : true;
    if (animate) {
      el.style.minHeight = "0";
      const { paddingBottom, paddingTop } = globalThis.getComputedStyle(el);
      await el.animate([
        { maxHeight: `${el.clientHeight}px`, paddingTop, paddingBottom },
        { maxHeight: 0, paddingTop: 0, paddingBottom: 0 }
      ], { duration: 250, easing: "ease-in", fill: "forwards" }).finished;
    }
    const svelteDestroyPromises = [];
    for (const entry of this.#svelteData) {
      svelteDestroyPromises.push(outroAndDestroy(entry.component));
      const eventbus = entry.config.eventbus;
      if (typeof eventbus === "object" && typeof eventbus.off === "function") {
        eventbus.off();
        entry.config.eventbus = void 0;
      }
    }
    await Promise.all(svelteDestroyPromises);
    this.#svelteData.length = 0;
    el.remove();
    this.position.state.restore({
      name: "#beforeMinimized",
      properties: ["width", "height"],
      silent: true,
      remove: true
    });
    this.#applicationShellHolder[0] = null;
    this._element = null;
    this.#elementContent = null;
    this.#elementTarget = null;
    delete ui.windows[this.appId];
    this._minimized = false;
    this._scrollPositions = null;
    this._state = states.CLOSED;
    this.#onMount = false;
    this.#stores.uiOptionsUpdate((storeOptions) => deepMerge(storeOptions, { minimized: this._minimized }));
  }
  _injectHTML(html) {
    if (this.popOut && html.length === 0 && Array.isArray(this.options.svelte)) {
      throw new Error(
        "SvelteApplication - _injectHTML - A popout app with no template can only support one Svelte component."
      );
    }
    this.reactive.updateHeaderButtons();
    const elementRootUpdate = /* @__PURE__ */ __name(() => {
      let cntr = 0;
      return (elementRoot) => {
        if (elementRoot !== null && elementRoot !== void 0 && cntr++ > 0) {
          this.#updateApplicationShell();
          return true;
        }
        return false;
      };
    }, "elementRootUpdate");
    if (Array.isArray(this.options.svelte)) {
      for (const svelteConfig of this.options.svelte) {
        const svelteData = loadSvelteConfig({
          app: this,
          template: html[0],
          config: svelteConfig,
          elementRootUpdate
        });
        if (isApplicationShell(svelteData.component)) {
          if (this.svelte.applicationShell !== null) {
            throw new Error(
              `SvelteApplication - _injectHTML - An application shell is already mounted; offending config:
                    ${JSON.stringify(svelteConfig)}`
            );
          }
          this.#applicationShellHolder[0] = svelteData.component;
          if (isHMRProxy(svelteData.component) && Array.isArray(svelteData.component?.$$?.on_hmr)) {
            svelteData.component.$$.on_hmr.push(() => () => this.#updateApplicationShell());
          }
        }
        this.#svelteData.push(svelteData);
      }
    } else if (typeof this.options.svelte === "object") {
      const svelteData = loadSvelteConfig({
        app: this,
        template: html[0],
        config: this.options.svelte,
        elementRootUpdate
      });
      if (isApplicationShell(svelteData.component)) {
        if (this.svelte.applicationShell !== null) {
          throw new Error(
            `SvelteApplication - _injectHTML - An application shell is already mounted; offending config:
                 ${JSON.stringify(this.options.svelte)}`
          );
        }
        this.#applicationShellHolder[0] = svelteData.component;
        if (isHMRProxy(svelteData.component) && Array.isArray(svelteData.component?.$$?.on_hmr)) {
          svelteData.component.$$.on_hmr.push(() => () => this.#updateApplicationShell());
        }
      }
      this.#svelteData.push(svelteData);
    }
    const isDocumentFragment = html.length && html[0] instanceof DocumentFragment;
    let injectHTML = true;
    for (const svelteData of this.#svelteData) {
      if (!svelteData.injectHTML) {
        injectHTML = false;
        break;
      }
    }
    if (injectHTML) {
      super._injectHTML(html);
    }
    if (this.svelte.applicationShell !== null) {
      this._element = $(this.svelte.applicationShell.elementRoot);
      this.#elementContent = hasGetter(this.svelte.applicationShell, "elementContent") ? this.svelte.applicationShell.elementContent : null;
      this.#elementTarget = hasGetter(this.svelte.applicationShell, "elementTarget") ? this.svelte.applicationShell.elementTarget : null;
    } else if (isDocumentFragment) {
      for (const svelteData of this.#svelteData) {
        if (svelteData.element instanceof HTMLElement) {
          this._element = $(svelteData.element);
          break;
        }
      }
    }
    if (this.#elementTarget === null) {
      const element2 = typeof this.options.selectorTarget === "string" ? this._element.find(this.options.selectorTarget) : this._element;
      this.#elementTarget = element2[0];
    }
    if (this.#elementTarget === null || this.#elementTarget === void 0 || this.#elementTarget.length === 0) {
      throw new Error(`SvelteApplication - _injectHTML: Target element '${this.options.selectorTarget}' not found.`);
    }
    if (typeof this.options.positionable === "boolean" && this.options.positionable) {
      this.#elementTarget.style.zIndex = typeof this.options.zIndex === "number" ? this.options.zIndex : this.#initialZIndex ?? 95;
    }
    this.#stores.subscribe();
  }
  async maximize({ animate = true, duration = 0.1 } = {}) {
    if (!this.popOut || [false, null].includes(this._minimized)) {
      return;
    }
    this._minimized = null;
    const durationMS = duration * 1e3;
    const element2 = this.elementTarget;
    const header = element2.querySelector(".window-header");
    const content = element2.querySelector(".window-content");
    const positionBefore = this.position.state.get({ name: "#beforeMinimized" });
    if (animate) {
      await this.position.state.restore({
        name: "#beforeMinimized",
        async: true,
        animateTo: true,
        properties: ["width"],
        duration: 0.1
      });
    }
    for (let cntr = header.children.length; --cntr >= 0; ) {
      header.children[cntr].style.display = null;
    }
    content.style.display = null;
    let constraints;
    if (animate) {
      ({ constraints } = this.position.state.restore({
        name: "#beforeMinimized",
        animateTo: true,
        properties: ["height"],
        remove: true,
        duration
      }));
    } else {
      ({ constraints } = this.position.state.remove({ name: "#beforeMinimized" }));
    }
    await content.animate([
      { maxHeight: 0, paddingTop: 0, paddingBottom: 0, offset: 0 },
      { ...constraints, offset: 1 },
      { maxHeight: "100%", offset: 1 }
    ], { duration: durationMS, fill: "forwards" }).finished;
    this.position.set({
      minHeight: positionBefore.minHeight ?? this.options?.minHeight ?? MIN_WINDOW_HEIGHT,
      minWidth: positionBefore.minWidth ?? this.options?.minWidth ?? MIN_WINDOW_WIDTH
    });
    element2.style.minWidth = null;
    element2.style.minHeight = null;
    element2.classList.remove("minimized");
    this._minimized = false;
    setTimeout(() => {
      content.style.overflow = null;
      for (let cntr = content.children.length; --cntr >= 0; ) {
        content.children[cntr].style.overflow = null;
      }
    }, 50);
    this.#stores.uiOptionsUpdate((options) => deepMerge(options, { minimized: false }));
  }
  async minimize({ animate = true, duration = 0.1 } = {}) {
    if (!this.rendered || !this.popOut || [true, null].includes(this._minimized)) {
      return;
    }
    this.#stores.uiOptionsUpdate((options) => deepMerge(options, { minimized: true }));
    this._minimized = null;
    const durationMS = duration * 1e3;
    const element2 = this.elementTarget;
    const header = element2.querySelector(".window-header");
    const content = element2.querySelector(".window-content");
    const beforeMinWidth = this.position.minWidth;
    const beforeMinHeight = this.position.minHeight;
    this.position.set({ minWidth: 100, minHeight: 30 });
    element2.style.minWidth = "100px";
    element2.style.minHeight = "30px";
    if (content) {
      content.style.overflow = "hidden";
      for (let cntr = content.children.length; --cntr >= 0; ) {
        content.children[cntr].style.overflow = "hidden";
      }
    }
    const { paddingBottom, paddingTop } = globalThis.getComputedStyle(content);
    const constraints = {
      maxHeight: `${content.clientHeight}px`,
      paddingTop,
      paddingBottom
    };
    if (animate) {
      const animation = content.animate([
        constraints,
        { maxHeight: 0, paddingTop: 0, paddingBottom: 0 }
      ], { duration: durationMS, fill: "forwards" });
      animation.finished.then(() => content.style.display = "none");
    } else {
      setTimeout(() => content.style.display = "none", durationMS);
    }
    const saved = this.position.state.save({ name: "#beforeMinimized", constraints });
    saved.minWidth = beforeMinWidth;
    saved.minHeight = beforeMinHeight;
    const headerOffsetHeight = header.offsetHeight;
    this.position.minHeight = headerOffsetHeight;
    if (animate) {
      await this.position.animate.to({ height: headerOffsetHeight }, { duration }).finished;
    }
    for (let cntr = header.children.length; --cntr >= 0; ) {
      const className = header.children[cntr].className;
      if (className.includes("window-title") || className.includes("close")) {
        continue;
      }
      if (className.includes("keep-minimized")) {
        header.children[cntr].style.display = "block";
        continue;
      }
      header.children[cntr].style.display = "none";
    }
    if (animate) {
      await this.position.animate.to({ width: MIN_WINDOW_WIDTH }, { duration: 0.1 }).finished;
    }
    element2.classList.add("minimized");
    this._minimized = true;
  }
  onSvelteMount({ element: element2, elementContent, elementTarget } = {}) {
  }
  onSvelteRemount({ element: element2, elementContent, elementTarget } = {}) {
  }
  _replaceHTML(element2, html) {
    if (!element2.length) {
      return;
    }
    this.reactive.updateHeaderButtons();
  }
  async _render(force = false, options = {}) {
    if (this._state === Application.RENDER_STATES.NONE && document.querySelector(`#${this.id}`) instanceof HTMLElement) {
      console.warn(`SvelteApplication - _render: A DOM element already exists for CSS ID '${this.id}'. Cancelling initial render for new application with appId '${this.appId}'.`);
      return;
    }
    await super._render(force, options);
    if (!this.#onMount) {
      this.onSvelteMount({ element: this._element[0], elementContent: this.#elementContent, elementTarget: this.#elementTarget });
      this.#onMount = true;
    }
  }
  async _renderInner(data) {
    const html = typeof this.template === "string" ? await renderTemplate(this.template, data) : document.createDocumentFragment();
    return $(html);
  }
  async _renderOuter() {
    const html = await super._renderOuter();
    this.#initialZIndex = html[0].style.zIndex;
    return html;
  }
  setPosition(position) {
    return this.position.set(position);
  }
  #updateApplicationShell() {
    const applicationShell = this.svelte.applicationShell;
    if (applicationShell !== null) {
      this._element = $(applicationShell.elementRoot);
      this.#elementContent = hasGetter(applicationShell, "elementContent") ? applicationShell.elementContent : null;
      this.#elementTarget = hasGetter(applicationShell, "elementTarget") ? applicationShell.elementTarget : null;
      if (this.#elementTarget === null) {
        const element2 = typeof this.options.selectorTarget === "string" ? this._element.find(this.options.selectorTarget) : this._element;
        this.#elementTarget = element2[0];
      }
      if (typeof this.options.positionable === "boolean" && this.options.positionable) {
        this.#elementTarget.style.zIndex = typeof this.options.zIndex === "number" ? this.options.zIndex : this.#initialZIndex ?? 95;
        super.bringToTop();
        this.position.set(this.position.get());
      }
      super._activateCoreListeners([this.#elementTarget]);
      this.onSvelteRemount({ element: this._element[0], elementContent: this.#elementContent, elementTarget: this.#elementTarget });
    }
  }
}
__name(SvelteApplication, "SvelteApplication");
const TJSContainer_svelte_svelte_type_style_lang = "";
function get_each_context$c(ctx, list, i) {
  const child_ctx = ctx.slice();
  child_ctx[2] = list[i];
  return child_ctx;
}
__name(get_each_context$c, "get_each_context$c");
function create_if_block_1$b(ctx) {
  let p;
  return {
    c() {
      p = element("p");
      p.textContent = "Container warning: No children.";
      attr(p, "class", "svelte-1s361pr");
    },
    m(target, anchor) {
      insert(target, p, anchor);
    },
    p: noop,
    i: noop,
    o: noop,
    d(detaching) {
      if (detaching)
        detach(p);
    }
  };
}
__name(create_if_block_1$b, "create_if_block_1$b");
function create_if_block$f(ctx) {
  let each_1_anchor;
  let current;
  let each_value = ctx[1];
  let each_blocks = [];
  for (let i = 0; i < each_value.length; i += 1) {
    each_blocks[i] = create_each_block$c(get_each_context$c(ctx, each_value, i));
  }
  const out = /* @__PURE__ */ __name((i) => transition_out(each_blocks[i], 1, 1, () => {
    each_blocks[i] = null;
  }), "out");
  return {
    c() {
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].c();
      }
      each_1_anchor = empty();
    },
    m(target, anchor) {
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].m(target, anchor);
      }
      insert(target, each_1_anchor, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      if (dirty & 2) {
        each_value = ctx2[1];
        let i;
        for (i = 0; i < each_value.length; i += 1) {
          const child_ctx = get_each_context$c(ctx2, each_value, i);
          if (each_blocks[i]) {
            each_blocks[i].p(child_ctx, dirty);
            transition_in(each_blocks[i], 1);
          } else {
            each_blocks[i] = create_each_block$c(child_ctx);
            each_blocks[i].c();
            transition_in(each_blocks[i], 1);
            each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
          }
        }
        group_outros();
        for (i = each_value.length; i < each_blocks.length; i += 1) {
          out(i);
        }
        check_outros();
      }
    },
    i(local) {
      if (current)
        return;
      for (let i = 0; i < each_value.length; i += 1) {
        transition_in(each_blocks[i]);
      }
      current = true;
    },
    o(local) {
      each_blocks = each_blocks.filter(Boolean);
      for (let i = 0; i < each_blocks.length; i += 1) {
        transition_out(each_blocks[i]);
      }
      current = false;
    },
    d(detaching) {
      destroy_each(each_blocks, detaching);
      if (detaching)
        detach(each_1_anchor);
    }
  };
}
__name(create_if_block$f, "create_if_block$f");
function create_each_block$c(ctx) {
  let switch_instance;
  let switch_instance_anchor;
  let current;
  const switch_instance_spread_levels = [ctx[2].props];
  var switch_value = ctx[2].class;
  function switch_props(ctx2) {
    let switch_instance_props = {};
    for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
      switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
    }
    return { props: switch_instance_props };
  }
  __name(switch_props, "switch_props");
  if (switch_value) {
    switch_instance = construct_svelte_component(switch_value, switch_props());
  }
  return {
    c() {
      if (switch_instance)
        create_component(switch_instance.$$.fragment);
      switch_instance_anchor = empty();
    },
    m(target, anchor) {
      if (switch_instance)
        mount_component(switch_instance, target, anchor);
      insert(target, switch_instance_anchor, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      const switch_instance_changes = dirty & 2 ? get_spread_update(switch_instance_spread_levels, [get_spread_object(ctx2[2].props)]) : {};
      if (switch_value !== (switch_value = ctx2[2].class)) {
        if (switch_instance) {
          group_outros();
          const old_component = switch_instance;
          transition_out(old_component.$$.fragment, 1, 0, () => {
            destroy_component(old_component, 1);
          });
          check_outros();
        }
        if (switch_value) {
          switch_instance = construct_svelte_component(switch_value, switch_props());
          create_component(switch_instance.$$.fragment);
          transition_in(switch_instance.$$.fragment, 1);
          mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
        } else {
          switch_instance = null;
        }
      } else if (switch_value) {
        switch_instance.$set(switch_instance_changes);
      }
    },
    i(local) {
      if (current)
        return;
      if (switch_instance)
        transition_in(switch_instance.$$.fragment, local);
      current = true;
    },
    o(local) {
      if (switch_instance)
        transition_out(switch_instance.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      if (detaching)
        detach(switch_instance_anchor);
      if (switch_instance)
        destroy_component(switch_instance, detaching);
    }
  };
}
__name(create_each_block$c, "create_each_block$c");
function create_fragment$n(ctx) {
  let show_if;
  let current_block_type_index;
  let if_block;
  let if_block_anchor;
  let current;
  const if_block_creators = [create_if_block$f, create_if_block_1$b];
  const if_blocks = [];
  function select_block_type(ctx2, dirty) {
    if (dirty & 2)
      show_if = null;
    if (show_if == null)
      show_if = !!Array.isArray(ctx2[1]);
    if (show_if)
      return 0;
    if (ctx2[0])
      return 1;
    return -1;
  }
  __name(select_block_type, "select_block_type");
  if (~(current_block_type_index = select_block_type(ctx, -1))) {
    if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
  }
  return {
    c() {
      if (if_block)
        if_block.c();
      if_block_anchor = empty();
    },
    m(target, anchor) {
      if (~current_block_type_index) {
        if_blocks[current_block_type_index].m(target, anchor);
      }
      insert(target, if_block_anchor, anchor);
      current = true;
    },
    p(ctx2, [dirty]) {
      let previous_block_index = current_block_type_index;
      current_block_type_index = select_block_type(ctx2, dirty);
      if (current_block_type_index === previous_block_index) {
        if (~current_block_type_index) {
          if_blocks[current_block_type_index].p(ctx2, dirty);
        }
      } else {
        if (if_block) {
          group_outros();
          transition_out(if_blocks[previous_block_index], 1, 1, () => {
            if_blocks[previous_block_index] = null;
          });
          check_outros();
        }
        if (~current_block_type_index) {
          if_block = if_blocks[current_block_type_index];
          if (!if_block) {
            if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx2);
            if_block.c();
          } else {
            if_block.p(ctx2, dirty);
          }
          transition_in(if_block, 1);
          if_block.m(if_block_anchor.parentNode, if_block_anchor);
        } else {
          if_block = null;
        }
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(if_block);
      current = true;
    },
    o(local) {
      transition_out(if_block);
      current = false;
    },
    d(detaching) {
      if (~current_block_type_index) {
        if_blocks[current_block_type_index].d(detaching);
      }
      if (detaching)
        detach(if_block_anchor);
    }
  };
}
__name(create_fragment$n, "create_fragment$n");
function instance$n($$self, $$props, $$invalidate) {
  let { warn = false } = $$props;
  let { children: children2 = void 0 } = $$props;
  $$self.$$set = ($$props2) => {
    if ("warn" in $$props2)
      $$invalidate(0, warn = $$props2.warn);
    if ("children" in $$props2)
      $$invalidate(1, children2 = $$props2.children);
  };
  return [warn, children2];
}
__name(instance$n, "instance$n");
class TJSContainer extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$n, create_fragment$n, safe_not_equal, { warn: 0, children: 1 });
  }
  get warn() {
    return this.$$.ctx[0];
  }
  set warn(warn) {
    this.$$set({ warn });
    flush();
  }
  get children() {
    return this.$$.ctx[1];
  }
  set children(children2) {
    this.$$set({ children: children2 });
    flush();
  }
}
__name(TJSContainer, "TJSContainer");
function fade(node, { delay = 0, duration = 400, easing = identity } = {}) {
  const o = +getComputedStyle(node).opacity;
  return {
    delay,
    duration,
    easing,
    css: (t) => `opacity: ${t * o}`
  };
}
__name(fade, "fade");
const s_DEFAULT_TRANSITION = /* @__PURE__ */ __name(() => void 0, "s_DEFAULT_TRANSITION");
const s_DEFAULT_TRANSITION_OPTIONS = {};
const TJSGlassPane_svelte_svelte_type_style_lang = "";
function create_fragment$m(ctx) {
  let div;
  let div_intro;
  let div_outro;
  let current;
  let mounted;
  let dispose;
  const default_slot_template = ctx[17].default;
  const default_slot = create_slot(default_slot_template, ctx, ctx[16], null);
  return {
    c() {
      div = element("div");
      if (default_slot)
        default_slot.c();
      attr(div, "id", ctx[4]);
      attr(div, "class", "tjs-glass-pane svelte-71db55");
    },
    m(target, anchor) {
      insert(target, div, anchor);
      if (default_slot) {
        default_slot.m(div, null);
      }
      ctx[18](div);
      current = true;
      if (!mounted) {
        dispose = listen(div, "keydown", ctx[6]);
        mounted = true;
      }
    },
    p(new_ctx, [dirty]) {
      ctx = new_ctx;
      if (default_slot) {
        if (default_slot.p && (!current || dirty & 65536)) {
          update_slot_base(
            default_slot,
            default_slot_template,
            ctx,
            ctx[16],
            !current ? get_all_dirty_from_scope(ctx[16]) : get_slot_changes(default_slot_template, ctx[16], dirty, null),
            null
          );
        }
      }
      if (!current || dirty & 16) {
        attr(div, "id", ctx[4]);
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(default_slot, local);
      add_render_callback(() => {
        if (div_outro)
          div_outro.end(1);
        div_intro = create_in_transition(div, ctx[0], ctx[2]);
        div_intro.start();
      });
      current = true;
    },
    o(local) {
      transition_out(default_slot, local);
      if (div_intro)
        div_intro.invalidate();
      div_outro = create_out_transition(div, ctx[1], ctx[3]);
      current = false;
    },
    d(detaching) {
      if (detaching)
        detach(div);
      if (default_slot)
        default_slot.d(detaching);
      ctx[18](null);
      if (detaching && div_outro)
        div_outro.end();
      mounted = false;
      dispose();
    }
  };
}
__name(create_fragment$m, "create_fragment$m");
function instance$m($$self, $$props, $$invalidate) {
  let { $$slots: slots = {}, $$scope } = $$props;
  let { id = void 0 } = $$props;
  let { zIndex = Number.MAX_SAFE_INTEGER } = $$props;
  let { background = "#50505080" } = $$props;
  let { captureInput = true } = $$props;
  let { preventDefault: preventDefault2 = true } = $$props;
  let { stopPropagation = true } = $$props;
  let glassPane;
  let { transition = void 0 } = $$props;
  let { inTransition = s_DEFAULT_TRANSITION } = $$props;
  let { outTransition = s_DEFAULT_TRANSITION } = $$props;
  let { transitionOptions = void 0 } = $$props;
  let { inTransitionOptions = s_DEFAULT_TRANSITION_OPTIONS } = $$props;
  let { outTransitionOptions = s_DEFAULT_TRANSITION_OPTIONS } = $$props;
  let oldTransition = void 0;
  let oldTransitionOptions = void 0;
  function swallow(event) {
    if (captureInput) {
      if (preventDefault2) {
        event.preventDefault();
      }
      if (stopPropagation) {
        event.stopPropagation();
      }
    }
  }
  __name(swallow, "swallow");
  function div_binding($$value) {
    binding_callbacks[$$value ? "unshift" : "push"](() => {
      glassPane = $$value;
      $$invalidate(5, glassPane), $$invalidate(9, captureInput), $$invalidate(8, background), $$invalidate(7, zIndex);
    });
  }
  __name(div_binding, "div_binding");
  $$self.$$set = ($$props2) => {
    if ("id" in $$props2)
      $$invalidate(4, id = $$props2.id);
    if ("zIndex" in $$props2)
      $$invalidate(7, zIndex = $$props2.zIndex);
    if ("background" in $$props2)
      $$invalidate(8, background = $$props2.background);
    if ("captureInput" in $$props2)
      $$invalidate(9, captureInput = $$props2.captureInput);
    if ("preventDefault" in $$props2)
      $$invalidate(10, preventDefault2 = $$props2.preventDefault);
    if ("stopPropagation" in $$props2)
      $$invalidate(11, stopPropagation = $$props2.stopPropagation);
    if ("transition" in $$props2)
      $$invalidate(12, transition = $$props2.transition);
    if ("inTransition" in $$props2)
      $$invalidate(0, inTransition = $$props2.inTransition);
    if ("outTransition" in $$props2)
      $$invalidate(1, outTransition = $$props2.outTransition);
    if ("transitionOptions" in $$props2)
      $$invalidate(13, transitionOptions = $$props2.transitionOptions);
    if ("inTransitionOptions" in $$props2)
      $$invalidate(2, inTransitionOptions = $$props2.inTransitionOptions);
    if ("outTransitionOptions" in $$props2)
      $$invalidate(3, outTransitionOptions = $$props2.outTransitionOptions);
    if ("$$scope" in $$props2)
      $$invalidate(16, $$scope = $$props2.$$scope);
  };
  $$self.$$.update = () => {
    if ($$self.$$.dirty & 32) {
      if (glassPane) {
        $$invalidate(5, glassPane.style.maxWidth = "100%", glassPane);
        $$invalidate(5, glassPane.style.maxHeight = "100%", glassPane);
        $$invalidate(5, glassPane.style.width = "100%", glassPane);
        $$invalidate(5, glassPane.style.height = "100%", glassPane);
      }
    }
    if ($$self.$$.dirty & 544) {
      if (glassPane) {
        if (captureInput) {
          glassPane.focus();
        }
        $$invalidate(5, glassPane.style.pointerEvents = captureInput ? "auto" : "none", glassPane);
      }
    }
    if ($$self.$$.dirty & 288) {
      if (glassPane) {
        $$invalidate(5, glassPane.style.background = background, glassPane);
      }
    }
    if ($$self.$$.dirty & 160) {
      if (glassPane) {
        $$invalidate(5, glassPane.style.zIndex = zIndex, glassPane);
      }
    }
    if ($$self.$$.dirty & 20480) {
      if (oldTransition !== transition) {
        const newTransition = s_DEFAULT_TRANSITION !== transition && typeof transition === "function" ? transition : s_DEFAULT_TRANSITION;
        $$invalidate(0, inTransition = newTransition);
        $$invalidate(1, outTransition = newTransition);
        $$invalidate(14, oldTransition = newTransition);
      }
    }
    if ($$self.$$.dirty & 40960) {
      if (oldTransitionOptions !== transitionOptions) {
        const newOptions = transitionOptions !== s_DEFAULT_TRANSITION_OPTIONS && typeof transitionOptions === "object" ? transitionOptions : s_DEFAULT_TRANSITION_OPTIONS;
        $$invalidate(2, inTransitionOptions = newOptions);
        $$invalidate(3, outTransitionOptions = newOptions);
        $$invalidate(15, oldTransitionOptions = newOptions);
      }
    }
    if ($$self.$$.dirty & 1) {
      if (typeof inTransition !== "function") {
        $$invalidate(0, inTransition = s_DEFAULT_TRANSITION);
      }
    }
    if ($$self.$$.dirty & 2) {
      if (typeof outTransition !== "function") {
        $$invalidate(1, outTransition = s_DEFAULT_TRANSITION);
      }
    }
    if ($$self.$$.dirty & 4) {
      if (typeof inTransitionOptions !== "object") {
        $$invalidate(2, inTransitionOptions = s_DEFAULT_TRANSITION_OPTIONS);
      }
    }
    if ($$self.$$.dirty & 8) {
      if (typeof outTransitionOptions !== "object") {
        $$invalidate(3, outTransitionOptions = s_DEFAULT_TRANSITION_OPTIONS);
      }
    }
  };
  return [
    inTransition,
    outTransition,
    inTransitionOptions,
    outTransitionOptions,
    id,
    glassPane,
    swallow,
    zIndex,
    background,
    captureInput,
    preventDefault2,
    stopPropagation,
    transition,
    transitionOptions,
    oldTransition,
    oldTransitionOptions,
    $$scope,
    slots,
    div_binding
  ];
}
__name(instance$m, "instance$m");
class TJSGlassPane extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$m, create_fragment$m, safe_not_equal, {
      id: 4,
      zIndex: 7,
      background: 8,
      captureInput: 9,
      preventDefault: 10,
      stopPropagation: 11,
      transition: 12,
      inTransition: 0,
      outTransition: 1,
      transitionOptions: 13,
      inTransitionOptions: 2,
      outTransitionOptions: 3
    });
  }
  get id() {
    return this.$$.ctx[4];
  }
  set id(id) {
    this.$$set({ id });
    flush();
  }
  get zIndex() {
    return this.$$.ctx[7];
  }
  set zIndex(zIndex) {
    this.$$set({ zIndex });
    flush();
  }
  get background() {
    return this.$$.ctx[8];
  }
  set background(background) {
    this.$$set({ background });
    flush();
  }
  get captureInput() {
    return this.$$.ctx[9];
  }
  set captureInput(captureInput) {
    this.$$set({ captureInput });
    flush();
  }
  get preventDefault() {
    return this.$$.ctx[10];
  }
  set preventDefault(preventDefault2) {
    this.$$set({ preventDefault: preventDefault2 });
    flush();
  }
  get stopPropagation() {
    return this.$$.ctx[11];
  }
  set stopPropagation(stopPropagation) {
    this.$$set({ stopPropagation });
    flush();
  }
  get transition() {
    return this.$$.ctx[12];
  }
  set transition(transition) {
    this.$$set({ transition });
    flush();
  }
  get inTransition() {
    return this.$$.ctx[0];
  }
  set inTransition(inTransition) {
    this.$$set({ inTransition });
    flush();
  }
  get outTransition() {
    return this.$$.ctx[1];
  }
  set outTransition(outTransition) {
    this.$$set({ outTransition });
    flush();
  }
  get transitionOptions() {
    return this.$$.ctx[13];
  }
  set transitionOptions(transitionOptions) {
    this.$$set({ transitionOptions });
    flush();
  }
  get inTransitionOptions() {
    return this.$$.ctx[2];
  }
  set inTransitionOptions(inTransitionOptions) {
    this.$$set({ inTransitionOptions });
    flush();
  }
  get outTransitionOptions() {
    return this.$$.ctx[3];
  }
  set outTransitionOptions(outTransitionOptions) {
    this.$$set({ outTransitionOptions });
    flush();
  }
}
__name(TJSGlassPane, "TJSGlassPane");
function resizeObserver(node, target) {
  ResizeObserverManager.add(node, target);
  return {
    update: (newTarget) => {
      ResizeObserverManager.remove(node, target);
      target = newTarget;
      ResizeObserverManager.add(node, target);
    },
    destroy: () => {
      ResizeObserverManager.remove(node, target);
    }
  };
}
__name(resizeObserver, "resizeObserver");
resizeObserver.updateCache = function(el) {
  if (!(el instanceof HTMLElement)) {
    throw new TypeError(`resizeObserverUpdate error: 'el' is not an HTMLElement.`);
  }
  const subscribers = s_MAP.get(el);
  if (Array.isArray(subscribers)) {
    const computed = globalThis.getComputedStyle(el);
    const borderBottom = styleParsePixels(el.style.borderBottom) ?? styleParsePixels(computed.borderBottom) ?? 0;
    const borderLeft = styleParsePixels(el.style.borderLeft) ?? styleParsePixels(computed.borderLeft) ?? 0;
    const borderRight = styleParsePixels(el.style.borderRight) ?? styleParsePixels(computed.borderRight) ?? 0;
    const borderTop = styleParsePixels(el.style.borderTop) ?? styleParsePixels(computed.borderTop) ?? 0;
    const paddingBottom = styleParsePixels(el.style.paddingBottom) ?? styleParsePixels(computed.paddingBottom) ?? 0;
    const paddingLeft = styleParsePixels(el.style.paddingLeft) ?? styleParsePixels(computed.paddingLeft) ?? 0;
    const paddingRight = styleParsePixels(el.style.paddingRight) ?? styleParsePixels(computed.paddingRight) ?? 0;
    const paddingTop = styleParsePixels(el.style.paddingTop) ?? styleParsePixels(computed.paddingTop) ?? 0;
    const additionalWidth = borderLeft + borderRight + paddingLeft + paddingRight;
    const additionalHeight = borderTop + borderBottom + paddingTop + paddingBottom;
    for (const subscriber of subscribers) {
      subscriber.styles.additionalWidth = additionalWidth;
      subscriber.styles.additionalHeight = additionalHeight;
      s_UPDATE_SUBSCRIBER(subscriber, subscriber.contentWidth, subscriber.contentHeight);
    }
  }
};
const s_MAP = /* @__PURE__ */ new Map();
class ResizeObserverManager {
  static add(el, target) {
    const updateType = s_GET_UPDATE_TYPE(target);
    if (updateType === 0) {
      throw new Error(`'target' does not match supported ResizeObserverManager update mechanisms.`);
    }
    const computed = globalThis.getComputedStyle(el);
    const borderBottom = styleParsePixels(el.style.borderBottom) ?? styleParsePixels(computed.borderBottom) ?? 0;
    const borderLeft = styleParsePixels(el.style.borderLeft) ?? styleParsePixels(computed.borderLeft) ?? 0;
    const borderRight = styleParsePixels(el.style.borderRight) ?? styleParsePixels(computed.borderRight) ?? 0;
    const borderTop = styleParsePixels(el.style.borderTop) ?? styleParsePixels(computed.borderTop) ?? 0;
    const paddingBottom = styleParsePixels(el.style.paddingBottom) ?? styleParsePixels(computed.paddingBottom) ?? 0;
    const paddingLeft = styleParsePixels(el.style.paddingLeft) ?? styleParsePixels(computed.paddingLeft) ?? 0;
    const paddingRight = styleParsePixels(el.style.paddingRight) ?? styleParsePixels(computed.paddingRight) ?? 0;
    const paddingTop = styleParsePixels(el.style.paddingTop) ?? styleParsePixels(computed.paddingTop) ?? 0;
    const data = {
      updateType,
      target,
      contentWidth: 0,
      contentHeight: 0,
      styles: {
        additionalWidth: borderLeft + borderRight + paddingLeft + paddingRight,
        additionalHeight: borderTop + borderBottom + paddingTop + paddingBottom
      }
    };
    if (s_MAP.has(el)) {
      const subscribers = s_MAP.get(el);
      subscribers.push(data);
    } else {
      s_MAP.set(el, [data]);
    }
    s_RESIZE_OBSERVER.observe(el);
  }
  static remove(el, target = void 0) {
    const subscribers = s_MAP.get(el);
    if (Array.isArray(subscribers)) {
      const index = subscribers.findIndex((entry) => entry.target === target);
      if (index >= 0) {
        s_UPDATE_SUBSCRIBER(subscribers[index], void 0, void 0);
        subscribers.splice(index, 1);
      }
      if (subscribers.length === 0) {
        s_MAP.delete(el);
        s_RESIZE_OBSERVER.unobserve(el);
      }
    }
  }
}
__name(ResizeObserverManager, "ResizeObserverManager");
const s_UPDATE_TYPES = {
  none: 0,
  attribute: 1,
  function: 2,
  resizeObserved: 3,
  setContentBounds: 4,
  setDimension: 5,
  storeObject: 6,
  storesObject: 7
};
const s_RESIZE_OBSERVER = new ResizeObserver((entries) => {
  for (const entry of entries) {
    const subscribers = s_MAP.get(entry?.target);
    if (Array.isArray(subscribers)) {
      const contentWidth = entry.contentRect.width;
      const contentHeight = entry.contentRect.height;
      for (const subscriber of subscribers) {
        s_UPDATE_SUBSCRIBER(subscriber, contentWidth, contentHeight);
      }
    }
  }
});
function s_GET_UPDATE_TYPE(target) {
  if (target?.resizeObserved instanceof Function) {
    return s_UPDATE_TYPES.resizeObserved;
  }
  if (target?.setDimension instanceof Function) {
    return s_UPDATE_TYPES.setDimension;
  }
  if (target?.setContentBounds instanceof Function) {
    return s_UPDATE_TYPES.setContentBounds;
  }
  const targetType = typeof target;
  if (targetType === "object" || targetType === "function") {
    if (isUpdatableStore(target.resizeObserved)) {
      return s_UPDATE_TYPES.storeObject;
    }
    const stores = target?.stores;
    if (typeof stores === "object" || typeof stores === "function") {
      if (isUpdatableStore(stores.resizeObserved)) {
        return s_UPDATE_TYPES.storesObject;
      }
    }
  }
  if (targetType === "object") {
    return s_UPDATE_TYPES.attribute;
  }
  if (targetType === "function") {
    return s_UPDATE_TYPES.function;
  }
  return s_UPDATE_TYPES.none;
}
__name(s_GET_UPDATE_TYPE, "s_GET_UPDATE_TYPE");
function s_UPDATE_SUBSCRIBER(subscriber, contentWidth, contentHeight) {
  const styles = subscriber.styles;
  subscriber.contentWidth = contentWidth;
  subscriber.contentHeight = contentHeight;
  const offsetWidth = Number.isFinite(contentWidth) ? contentWidth + styles.additionalWidth : void 0;
  const offsetHeight = Number.isFinite(contentHeight) ? contentHeight + styles.additionalHeight : void 0;
  const target = subscriber.target;
  switch (subscriber.updateType) {
    case s_UPDATE_TYPES.attribute:
      target.contentWidth = contentWidth;
      target.contentHeight = contentHeight;
      target.offsetWidth = offsetWidth;
      target.offsetHeight = offsetHeight;
      break;
    case s_UPDATE_TYPES.function:
      target?.(offsetWidth, offsetHeight, contentWidth, contentHeight);
      break;
    case s_UPDATE_TYPES.resizeObserved:
      target.resizeObserved?.(offsetWidth, offsetHeight, contentWidth, contentHeight);
      break;
    case s_UPDATE_TYPES.setContentBounds:
      target.setContentBounds?.(contentWidth, contentHeight);
      break;
    case s_UPDATE_TYPES.setDimension:
      target.setDimension?.(offsetWidth, offsetHeight);
      break;
    case s_UPDATE_TYPES.storeObject:
      target.resizeObserved.update((object) => {
        object.contentHeight = contentHeight;
        object.contentWidth = contentWidth;
        object.offsetHeight = offsetHeight;
        object.offsetWidth = offsetWidth;
        return object;
      });
      break;
    case s_UPDATE_TYPES.storesObject:
      target.stores.resizeObserved.update((object) => {
        object.contentHeight = contentHeight;
        object.contentWidth = contentWidth;
        object.offsetHeight = offsetHeight;
        object.offsetWidth = offsetWidth;
        return object;
      });
      break;
  }
}
__name(s_UPDATE_SUBSCRIBER, "s_UPDATE_SUBSCRIBER");
function applyStyles(node, properties) {
  function setProperties() {
    if (typeof properties !== "object") {
      return;
    }
    for (const prop of Object.keys(properties)) {
      node.style.setProperty(`${prop}`, properties[prop]);
    }
  }
  __name(setProperties, "setProperties");
  setProperties();
  return {
    update(newProperties) {
      properties = newProperties;
      setProperties();
    }
  };
}
__name(applyStyles, "applyStyles");
function draggable(node, {
  position,
  active: active2 = true,
  button = 0,
  storeDragging = void 0,
  ease = false,
  easeOptions = { duration: 0.1, ease: cubicOut }
}) {
  let initialPosition = null;
  let initialDragPoint = {};
  let dragging = false;
  let quickTo = position.animate.quickTo(["top", "left"], easeOptions);
  const handlers = {
    dragDown: ["pointerdown", (e) => onDragPointerDown(e), false],
    dragMove: ["pointermove", (e) => onDragPointerChange(e), false],
    dragUp: ["pointerup", (e) => onDragPointerUp(e), false]
  };
  function activateListeners() {
    node.addEventListener(...handlers.dragDown);
    node.classList.add("draggable");
  }
  __name(activateListeners, "activateListeners");
  function removeListeners() {
    if (typeof storeDragging?.set === "function") {
      storeDragging.set(false);
    }
    node.removeEventListener(...handlers.dragDown);
    node.removeEventListener(...handlers.dragMove);
    node.removeEventListener(...handlers.dragUp);
    node.classList.remove("draggable");
  }
  __name(removeListeners, "removeListeners");
  if (active2) {
    activateListeners();
  }
  function onDragPointerDown(event) {
    if (event.button !== button || !event.isPrimary) {
      return;
    }
    if (!position.enabled) {
      return;
    }
    event.preventDefault();
    dragging = false;
    initialPosition = position.get();
    initialDragPoint = { x: event.clientX, y: event.clientY };
    node.addEventListener(...handlers.dragMove);
    node.addEventListener(...handlers.dragUp);
    node.setPointerCapture(event.pointerId);
  }
  __name(onDragPointerDown, "onDragPointerDown");
  function onDragPointerChange(event) {
    if ((event.buttons & 1) === 0) {
      onDragPointerUp(event);
      return;
    }
    if (event.button !== -1 || !event.isPrimary) {
      return;
    }
    event.preventDefault();
    if (!dragging && typeof storeDragging?.set === "function") {
      dragging = true;
      storeDragging.set(true);
    }
    const newLeft = initialPosition.left + (event.clientX - initialDragPoint.x);
    const newTop = initialPosition.top + (event.clientY - initialDragPoint.y);
    if (ease) {
      quickTo(newTop, newLeft);
    } else {
      s_POSITION_DATA.left = newLeft;
      s_POSITION_DATA.top = newTop;
      position.set(s_POSITION_DATA);
    }
  }
  __name(onDragPointerChange, "onDragPointerChange");
  function onDragPointerUp(event) {
    event.preventDefault();
    dragging = false;
    if (typeof storeDragging?.set === "function") {
      storeDragging.set(false);
    }
    node.removeEventListener(...handlers.dragMove);
    node.removeEventListener(...handlers.dragUp);
  }
  __name(onDragPointerUp, "onDragPointerUp");
  return {
    update: (options) => {
      if (typeof options.active === "boolean") {
        active2 = options.active;
        if (active2) {
          activateListeners();
        } else {
          removeListeners();
        }
      }
      if (typeof options.button === "number") {
        button = options.button;
      }
      if (options.position !== void 0 && options.position !== position) {
        position = options.position;
        quickTo = position.animate.quickTo(["top", "left"], easeOptions);
      }
      if (typeof options.ease === "boolean") {
        ease = options.ease;
      }
      if (typeof options.easeOptions === "object") {
        easeOptions = options.easeOptions;
        quickTo.options(easeOptions);
      }
    },
    destroy: () => removeListeners()
  };
}
__name(draggable, "draggable");
class DraggableOptions {
  #ease = false;
  #easeOptions = { duration: 0.1, ease: cubicOut };
  #subscriptions = [];
  constructor({ ease, easeOptions } = {}) {
    Object.defineProperty(this, "ease", {
      get: () => {
        return this.#ease;
      },
      set: (newEase) => {
        if (typeof newEase !== "boolean") {
          throw new TypeError(`'ease' is not a boolean.`);
        }
        this.#ease = newEase;
        this.#updateSubscribers();
      },
      enumerable: true
    });
    Object.defineProperty(this, "easeOptions", {
      get: () => {
        return this.#easeOptions;
      },
      set: (newEaseOptions) => {
        if (newEaseOptions === null || typeof newEaseOptions !== "object") {
          throw new TypeError(`'easeOptions' is not an object.`);
        }
        if (newEaseOptions.duration !== void 0) {
          if (!Number.isFinite(newEaseOptions.duration)) {
            throw new TypeError(`'easeOptions.duration' is not a finite number.`);
          }
          if (newEaseOptions.duration < 0) {
            throw new Error(`'easeOptions.duration' is less than 0.`);
          }
          this.#easeOptions.duration = newEaseOptions.duration;
        }
        if (newEaseOptions.ease !== void 0) {
          if (typeof newEaseOptions.ease !== "function" && typeof newEaseOptions.ease !== "string") {
            throw new TypeError(`'easeOptions.ease' is not a function or string.`);
          }
          this.#easeOptions.ease = newEaseOptions.ease;
        }
        this.#updateSubscribers();
      },
      enumerable: true
    });
    if (ease !== void 0) {
      this.ease = ease;
    }
    if (easeOptions !== void 0) {
      this.easeOptions = easeOptions;
    }
  }
  get easeDuration() {
    return this.#easeOptions.duration;
  }
  get easeValue() {
    return this.#easeOptions.ease;
  }
  set easeDuration(duration) {
    if (!Number.isFinite(duration)) {
      throw new TypeError(`'duration' is not a finite number.`);
    }
    if (duration < 0) {
      throw new Error(`'duration' is less than 0.`);
    }
    this.#easeOptions.duration = duration;
    this.#updateSubscribers();
  }
  set easeValue(value) {
    if (typeof value !== "function" && typeof value !== "string") {
      throw new TypeError(`'value' is not a function or string.`);
    }
    this.#easeOptions.ease = value;
    this.#updateSubscribers();
  }
  reset() {
    this.#ease = false;
    this.#easeOptions = { duration: 0.1, ease: cubicOut };
    this.#updateSubscribers();
  }
  resetEase() {
    this.#easeOptions = { duration: 0.1, ease: cubicOut };
    this.#updateSubscribers();
  }
  subscribe(handler) {
    this.#subscriptions.push(handler);
    handler(this);
    return () => {
      const index = this.#subscriptions.findIndex((sub) => sub === handler);
      if (index >= 0) {
        this.#subscriptions.splice(index, 1);
      }
    };
  }
  #updateSubscribers() {
    const subscriptions = this.#subscriptions;
    if (subscriptions.length > 0) {
      for (let cntr = 0; cntr < subscriptions.length; cntr++) {
        subscriptions[cntr](this);
      }
    }
  }
}
__name(DraggableOptions, "DraggableOptions");
draggable.options = (options) => new DraggableOptions(options);
const s_POSITION_DATA = { left: 0, top: 0 };
function localize(stringId, data) {
  const result = typeof data !== "object" ? game.i18n.localize(stringId) : game.i18n.format(stringId, data);
  return result !== void 0 ? result : "";
}
__name(localize, "localize");
function create_fragment$l(ctx) {
  let a;
  let html_tag;
  let t;
  let a_class_value;
  let applyStyles_action;
  let mounted;
  let dispose;
  return {
    c() {
      a = element("a");
      html_tag = new HtmlTag(false);
      t = text(ctx[2]);
      html_tag.a = t;
      attr(a, "class", a_class_value = "header-button " + ctx[0].class);
      attr(a, "role", "presentation");
    },
    m(target, anchor) {
      insert(target, a, anchor);
      html_tag.m(ctx[1], a);
      append(a, t);
      if (!mounted) {
        dispose = [
          listen(a, "click", stop_propagation(prevent_default(ctx[4])), true),
          listen(a, "pointerdown", stop_propagation(prevent_default(pointerdown_handler)), true),
          listen(a, "mousedown", stop_propagation(prevent_default(mousedown_handler)), true),
          listen(a, "dblclick", stop_propagation(prevent_default(dblclick_handler)), true),
          action_destroyer(applyStyles_action = applyStyles.call(null, a, ctx[3]))
        ];
        mounted = true;
      }
    },
    p(ctx2, [dirty]) {
      if (dirty & 2)
        html_tag.p(ctx2[1]);
      if (dirty & 4)
        set_data(t, ctx2[2]);
      if (dirty & 1 && a_class_value !== (a_class_value = "header-button " + ctx2[0].class)) {
        attr(a, "class", a_class_value);
      }
      if (applyStyles_action && is_function(applyStyles_action.update) && dirty & 8)
        applyStyles_action.update.call(null, ctx2[3]);
    },
    i: noop,
    o: noop,
    d(detaching) {
      if (detaching)
        detach(a);
      mounted = false;
      run_all(dispose);
    }
  };
}
__name(create_fragment$l, "create_fragment$l");
const s_REGEX_HTML$1 = /^\s*<.*>$/;
const pointerdown_handler = /* @__PURE__ */ __name(() => null, "pointerdown_handler");
const mousedown_handler = /* @__PURE__ */ __name(() => null, "mousedown_handler");
const dblclick_handler = /* @__PURE__ */ __name(() => null, "dblclick_handler");
function instance$l($$self, $$props, $$invalidate) {
  let { button = void 0 } = $$props;
  let icon, label, title, styles;
  function onClick(event) {
    const invoke = button.callback ?? button.onclick;
    if (typeof invoke === "function") {
      invoke.call(button, event);
      $$invalidate(0, button);
    }
  }
  __name(onClick, "onClick");
  $$self.$$set = ($$props2) => {
    if ("button" in $$props2)
      $$invalidate(0, button = $$props2.button);
  };
  $$self.$$.update = () => {
    if ($$self.$$.dirty & 33) {
      if (button) {
        $$invalidate(5, title = typeof button.title === "string" ? localize(button.title) : "");
        $$invalidate(1, icon = typeof button.icon !== "string" ? void 0 : s_REGEX_HTML$1.test(button.icon) ? button.icon : `<i class="${button.icon}" title="${title}"></i>`);
        $$invalidate(2, label = typeof button.label === "string" ? localize(button.label) : "");
        $$invalidate(3, styles = typeof button.styles === "object" ? button.styles : void 0);
      }
    }
  };
  return [button, icon, label, styles, onClick, title];
}
__name(instance$l, "instance$l");
class TJSHeaderButton extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$l, create_fragment$l, safe_not_equal, { button: 0 });
  }
  get button() {
    return this.$$.ctx[0];
  }
  set button(button) {
    this.$$set({ button });
    flush();
  }
}
__name(TJSHeaderButton, "TJSHeaderButton");
const TJSApplicationHeader_svelte_svelte_type_style_lang = "";
function get_each_context$b(ctx, list, i) {
  const child_ctx = ctx.slice();
  child_ctx[20] = list[i];
  return child_ctx;
}
__name(get_each_context$b, "get_each_context$b");
function create_each_block$b(ctx) {
  let switch_instance;
  let switch_instance_anchor;
  let current;
  const switch_instance_spread_levels = [ctx[20].props];
  var switch_value = ctx[20].class;
  function switch_props(ctx2) {
    let switch_instance_props = {};
    for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
      switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
    }
    return { props: switch_instance_props };
  }
  __name(switch_props, "switch_props");
  if (switch_value) {
    switch_instance = construct_svelte_component(switch_value, switch_props());
  }
  return {
    c() {
      if (switch_instance)
        create_component(switch_instance.$$.fragment);
      switch_instance_anchor = empty();
    },
    m(target, anchor) {
      if (switch_instance)
        mount_component(switch_instance, target, anchor);
      insert(target, switch_instance_anchor, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      const switch_instance_changes = dirty & 8 ? get_spread_update(switch_instance_spread_levels, [get_spread_object(ctx2[20].props)]) : {};
      if (switch_value !== (switch_value = ctx2[20].class)) {
        if (switch_instance) {
          group_outros();
          const old_component = switch_instance;
          transition_out(old_component.$$.fragment, 1, 0, () => {
            destroy_component(old_component, 1);
          });
          check_outros();
        }
        if (switch_value) {
          switch_instance = construct_svelte_component(switch_value, switch_props());
          create_component(switch_instance.$$.fragment);
          transition_in(switch_instance.$$.fragment, 1);
          mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
        } else {
          switch_instance = null;
        }
      } else if (switch_value) {
        switch_instance.$set(switch_instance_changes);
      }
    },
    i(local) {
      if (current)
        return;
      if (switch_instance)
        transition_in(switch_instance.$$.fragment, local);
      current = true;
    },
    o(local) {
      if (switch_instance)
        transition_out(switch_instance.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      if (detaching)
        detach(switch_instance_anchor);
      if (switch_instance)
        destroy_component(switch_instance, detaching);
    }
  };
}
__name(create_each_block$b, "create_each_block$b");
function create_key_block(ctx) {
  let header;
  let h4;
  let t0_value = localize(ctx[5]) + "";
  let t0;
  let t1;
  let draggable_action;
  let minimizable_action;
  let current;
  let mounted;
  let dispose;
  let each_value = ctx[3];
  let each_blocks = [];
  for (let i = 0; i < each_value.length; i += 1) {
    each_blocks[i] = create_each_block$b(get_each_context$b(ctx, each_value, i));
  }
  const out = /* @__PURE__ */ __name((i) => transition_out(each_blocks[i], 1, 1, () => {
    each_blocks[i] = null;
  }), "out");
  return {
    c() {
      header = element("header");
      h4 = element("h4");
      t0 = text(t0_value);
      t1 = space();
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].c();
      }
      attr(h4, "class", "window-title svelte-3umz0z");
      set_style(h4, "display", ctx[2]);
      attr(header, "class", "window-header flexrow");
    },
    m(target, anchor) {
      insert(target, header, anchor);
      append(header, h4);
      append(h4, t0);
      append(header, t1);
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].m(header, null);
      }
      current = true;
      if (!mounted) {
        dispose = [
          action_destroyer(draggable_action = ctx[0].call(null, header, ctx[1])),
          action_destroyer(minimizable_action = ctx[12].call(null, header, ctx[4]))
        ];
        mounted = true;
      }
    },
    p(ctx2, dirty) {
      if ((!current || dirty & 32) && t0_value !== (t0_value = localize(ctx2[5]) + ""))
        set_data(t0, t0_value);
      if (dirty & 4) {
        set_style(h4, "display", ctx2[2]);
      }
      if (dirty & 8) {
        each_value = ctx2[3];
        let i;
        for (i = 0; i < each_value.length; i += 1) {
          const child_ctx = get_each_context$b(ctx2, each_value, i);
          if (each_blocks[i]) {
            each_blocks[i].p(child_ctx, dirty);
            transition_in(each_blocks[i], 1);
          } else {
            each_blocks[i] = create_each_block$b(child_ctx);
            each_blocks[i].c();
            transition_in(each_blocks[i], 1);
            each_blocks[i].m(header, null);
          }
        }
        group_outros();
        for (i = each_value.length; i < each_blocks.length; i += 1) {
          out(i);
        }
        check_outros();
      }
      if (draggable_action && is_function(draggable_action.update) && dirty & 2)
        draggable_action.update.call(null, ctx2[1]);
      if (minimizable_action && is_function(minimizable_action.update) && dirty & 16)
        minimizable_action.update.call(null, ctx2[4]);
    },
    i(local) {
      if (current)
        return;
      for (let i = 0; i < each_value.length; i += 1) {
        transition_in(each_blocks[i]);
      }
      current = true;
    },
    o(local) {
      each_blocks = each_blocks.filter(Boolean);
      for (let i = 0; i < each_blocks.length; i += 1) {
        transition_out(each_blocks[i]);
      }
      current = false;
    },
    d(detaching) {
      if (detaching)
        detach(header);
      destroy_each(each_blocks, detaching);
      mounted = false;
      run_all(dispose);
    }
  };
}
__name(create_key_block, "create_key_block");
function create_fragment$k(ctx) {
  let previous_key = ctx[0];
  let key_block_anchor;
  let current;
  let key_block = create_key_block(ctx);
  return {
    c() {
      key_block.c();
      key_block_anchor = empty();
    },
    m(target, anchor) {
      key_block.m(target, anchor);
      insert(target, key_block_anchor, anchor);
      current = true;
    },
    p(ctx2, [dirty]) {
      if (dirty & 1 && safe_not_equal(previous_key, previous_key = ctx2[0])) {
        group_outros();
        transition_out(key_block, 1, 1, noop);
        check_outros();
        key_block = create_key_block(ctx2);
        key_block.c();
        transition_in(key_block, 1);
        key_block.m(key_block_anchor.parentNode, key_block_anchor);
      } else {
        key_block.p(ctx2, dirty);
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(key_block);
      current = true;
    },
    o(local) {
      transition_out(key_block);
      current = false;
    },
    d(detaching) {
      if (detaching)
        detach(key_block_anchor);
      key_block.d(detaching);
    }
  };
}
__name(create_fragment$k, "create_fragment$k");
function instance$k($$self, $$props, $$invalidate) {
  let $storeHeaderButtons;
  let $storeMinimized;
  let $storeHeaderNoTitleMinimized;
  let $storeDraggable;
  let $storeMinimizable;
  let $storeTitle;
  let { draggable: draggable$1 = void 0 } = $$props;
  let { draggableOptions = void 0 } = $$props;
  const application = getContext("external").application;
  const storeTitle = application.reactive.storeAppOptions.title;
  component_subscribe($$self, storeTitle, (value) => $$invalidate(5, $storeTitle = value));
  const storeDraggable = application.reactive.storeAppOptions.draggable;
  component_subscribe($$self, storeDraggable, (value) => $$invalidate(17, $storeDraggable = value));
  const storeDragging = application.reactive.storeUIState.dragging;
  const storeHeaderButtons = application.reactive.storeUIState.headerButtons;
  component_subscribe($$self, storeHeaderButtons, (value) => $$invalidate(14, $storeHeaderButtons = value));
  const storeHeaderNoTitleMinimized = application.reactive.storeAppOptions.headerNoTitleMinimized;
  component_subscribe($$self, storeHeaderNoTitleMinimized, (value) => $$invalidate(16, $storeHeaderNoTitleMinimized = value));
  const storeMinimizable = application.reactive.storeAppOptions.minimizable;
  component_subscribe($$self, storeMinimizable, (value) => $$invalidate(4, $storeMinimizable = value));
  const storeMinimized = application.reactive.storeUIState.minimized;
  component_subscribe($$self, storeMinimized, (value) => $$invalidate(15, $storeMinimized = value));
  let dragOptions;
  let displayHeaderTitle;
  let buttons;
  function minimizable(node, booleanStore) {
    const callback = application._onToggleMinimize.bind(application);
    function activateListeners() {
      node.addEventListener("dblclick", callback);
    }
    __name(activateListeners, "activateListeners");
    function removeListeners() {
      node.removeEventListener("dblclick", callback);
    }
    __name(removeListeners, "removeListeners");
    if (booleanStore) {
      activateListeners();
    }
    return {
      update: (booleanStore2) => {
        if (booleanStore2) {
          activateListeners();
        } else {
          removeListeners();
        }
      },
      destroy: () => removeListeners()
    };
  }
  __name(minimizable, "minimizable");
  $$self.$$set = ($$props2) => {
    if ("draggable" in $$props2)
      $$invalidate(0, draggable$1 = $$props2.draggable);
    if ("draggableOptions" in $$props2)
      $$invalidate(13, draggableOptions = $$props2.draggableOptions);
  };
  $$self.$$.update = () => {
    if ($$self.$$.dirty & 1) {
      $$invalidate(0, draggable$1 = typeof draggable$1 === "function" ? draggable$1 : draggable);
    }
    if ($$self.$$.dirty & 139264) {
      $$invalidate(1, dragOptions = Object.assign(
        {},
        {
          ease: true,
          easeOptions: { duration: 0.1, ease: cubicOut }
        },
        typeof draggableOptions === "object" ? draggableOptions : {},
        {
          position: application.position,
          active: $storeDraggable,
          storeDragging
        }
      ));
    }
    if ($$self.$$.dirty & 98304) {
      $$invalidate(2, displayHeaderTitle = $storeHeaderNoTitleMinimized && $storeMinimized ? "none" : null);
    }
    if ($$self.$$.dirty & 16384) {
      {
        $$invalidate(3, buttons = $storeHeaderButtons.reduce(
          (array, button) => {
            array.push(isSvelteComponent(button) ? { class: button, props: {} } : {
              class: TJSHeaderButton,
              props: { button }
            });
            return array;
          },
          []
        ));
      }
    }
  };
  return [
    draggable$1,
    dragOptions,
    displayHeaderTitle,
    buttons,
    $storeMinimizable,
    $storeTitle,
    storeTitle,
    storeDraggable,
    storeHeaderButtons,
    storeHeaderNoTitleMinimized,
    storeMinimizable,
    storeMinimized,
    minimizable,
    draggableOptions,
    $storeHeaderButtons,
    $storeMinimized,
    $storeHeaderNoTitleMinimized,
    $storeDraggable
  ];
}
__name(instance$k, "instance$k");
class TJSApplicationHeader extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$k, create_fragment$k, safe_not_equal, { draggable: 0, draggableOptions: 13 });
  }
}
__name(TJSApplicationHeader, "TJSApplicationHeader");
function create_fragment$j(ctx) {
  let div;
  let resizable_action;
  let mounted;
  let dispose;
  return {
    c() {
      div = element("div");
      div.innerHTML = `<i class="fas fa-arrows-alt-h"></i>`;
      attr(div, "class", "window-resizable-handle");
    },
    m(target, anchor) {
      insert(target, div, anchor);
      ctx[10](div);
      if (!mounted) {
        dispose = action_destroyer(resizable_action = ctx[6].call(null, div, {
          active: ctx[1],
          storeResizing: ctx[5]
        }));
        mounted = true;
      }
    },
    p(ctx2, [dirty]) {
      if (resizable_action && is_function(resizable_action.update) && dirty & 2)
        resizable_action.update.call(null, {
          active: ctx2[1],
          storeResizing: ctx2[5]
        });
    },
    i: noop,
    o: noop,
    d(detaching) {
      if (detaching)
        detach(div);
      ctx[10](null);
      mounted = false;
      dispose();
    }
  };
}
__name(create_fragment$j, "create_fragment$j");
function instance$j($$self, $$props, $$invalidate) {
  let $storeElementRoot;
  let $storeMinimized;
  let $storeResizable;
  let { isResizable = false } = $$props;
  const application = getContext("external").application;
  const storeElementRoot = getContext("storeElementRoot");
  component_subscribe($$self, storeElementRoot, (value) => $$invalidate(8, $storeElementRoot = value));
  const storeResizable = application.reactive.storeAppOptions.resizable;
  component_subscribe($$self, storeResizable, (value) => $$invalidate(1, $storeResizable = value));
  const storeMinimized = application.reactive.storeUIState.minimized;
  component_subscribe($$self, storeMinimized, (value) => $$invalidate(9, $storeMinimized = value));
  const storeResizing = application.reactive.storeUIState.resizing;
  let elementResize;
  function resizable(node, { active: active2 = true, storeResizing: storeResizing2 = void 0 } = {}) {
    let position = null;
    let initialPosition = {};
    let resizing = false;
    const handlers = {
      resizeDown: ["pointerdown", (e) => onResizePointerDown(e), false],
      resizeMove: ["pointermove", (e) => onResizePointerMove(e), false],
      resizeUp: ["pointerup", (e) => onResizePointerUp(e), false]
    };
    function activateListeners() {
      node.addEventListener(...handlers.resizeDown);
      $$invalidate(7, isResizable = true);
      node.style.display = "block";
    }
    __name(activateListeners, "activateListeners");
    function removeListeners() {
      if (typeof storeResizing2?.set === "function") {
        storeResizing2.set(false);
      }
      node.removeEventListener(...handlers.resizeDown);
      node.removeEventListener(...handlers.resizeMove);
      node.removeEventListener(...handlers.resizeUp);
      node.style.display = "none";
      $$invalidate(7, isResizable = false);
    }
    __name(removeListeners, "removeListeners");
    if (active2) {
      activateListeners();
    } else {
      node.style.display = "none";
    }
    function onResizePointerDown(event) {
      event.preventDefault();
      resizing = false;
      position = application.position.get();
      if (position.height === "auto") {
        position.height = $storeElementRoot.clientHeight;
      }
      if (position.width === "auto") {
        position.width = $storeElementRoot.clientWidth;
      }
      initialPosition = { x: event.clientX, y: event.clientY };
      node.addEventListener(...handlers.resizeMove);
      node.addEventListener(...handlers.resizeUp);
      node.setPointerCapture(event.pointerId);
    }
    __name(onResizePointerDown, "onResizePointerDown");
    function onResizePointerMove(event) {
      event.preventDefault();
      if (!resizing && typeof storeResizing2?.set === "function") {
        resizing = true;
        storeResizing2.set(true);
      }
      application.position.set({
        width: position.width + (event.clientX - initialPosition.x),
        height: position.height + (event.clientY - initialPosition.y)
      });
    }
    __name(onResizePointerMove, "onResizePointerMove");
    function onResizePointerUp(event) {
      resizing = false;
      if (typeof storeResizing2?.set === "function") {
        storeResizing2.set(false);
      }
      event.preventDefault();
      node.removeEventListener(...handlers.resizeMove);
      node.removeEventListener(...handlers.resizeUp);
      application._onResize(event);
    }
    __name(onResizePointerUp, "onResizePointerUp");
    return {
      update: ({ active: active3 }) => {
        if (active3) {
          activateListeners();
        } else {
          removeListeners();
        }
      },
      destroy: () => removeListeners()
    };
  }
  __name(resizable, "resizable");
  function div_binding($$value) {
    binding_callbacks[$$value ? "unshift" : "push"](() => {
      elementResize = $$value;
      $$invalidate(0, elementResize), $$invalidate(7, isResizable), $$invalidate(9, $storeMinimized), $$invalidate(8, $storeElementRoot);
    });
  }
  __name(div_binding, "div_binding");
  $$self.$$set = ($$props2) => {
    if ("isResizable" in $$props2)
      $$invalidate(7, isResizable = $$props2.isResizable);
  };
  $$self.$$.update = () => {
    if ($$self.$$.dirty & 897) {
      if (elementResize) {
        $$invalidate(0, elementResize.style.display = isResizable && !$storeMinimized ? "block" : "none", elementResize);
        const elementRoot = $storeElementRoot;
        if (elementRoot) {
          elementRoot.classList[isResizable ? "add" : "remove"]("resizable");
        }
      }
    }
  };
  return [
    elementResize,
    $storeResizable,
    storeElementRoot,
    storeResizable,
    storeMinimized,
    storeResizing,
    resizable,
    isResizable,
    $storeElementRoot,
    $storeMinimized,
    div_binding
  ];
}
__name(instance$j, "instance$j");
class ResizableHandle extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$j, create_fragment$j, safe_not_equal, { isResizable: 7 });
  }
}
__name(ResizableHandle, "ResizableHandle");
const ApplicationShell_svelte_svelte_type_style_lang = "";
function create_else_block$7(ctx) {
  let current;
  const default_slot_template = ctx[27].default;
  const default_slot = create_slot(default_slot_template, ctx, ctx[26], null);
  return {
    c() {
      if (default_slot)
        default_slot.c();
    },
    m(target, anchor) {
      if (default_slot) {
        default_slot.m(target, anchor);
      }
      current = true;
    },
    p(ctx2, dirty) {
      if (default_slot) {
        if (default_slot.p && (!current || dirty & 67108864)) {
          update_slot_base(
            default_slot,
            default_slot_template,
            ctx2,
            ctx2[26],
            !current ? get_all_dirty_from_scope(ctx2[26]) : get_slot_changes(default_slot_template, ctx2[26], dirty, null),
            null
          );
        }
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(default_slot, local);
      current = true;
    },
    o(local) {
      transition_out(default_slot, local);
      current = false;
    },
    d(detaching) {
      if (default_slot)
        default_slot.d(detaching);
    }
  };
}
__name(create_else_block$7, "create_else_block$7");
function create_if_block$e(ctx) {
  let tjscontainer;
  let current;
  tjscontainer = new TJSContainer({
    props: { children: ctx[14] }
  });
  return {
    c() {
      create_component(tjscontainer.$$.fragment);
    },
    m(target, anchor) {
      mount_component(tjscontainer, target, anchor);
      current = true;
    },
    p: noop,
    i(local) {
      if (current)
        return;
      transition_in(tjscontainer.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(tjscontainer.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(tjscontainer, detaching);
    }
  };
}
__name(create_if_block$e, "create_if_block$e");
function create_fragment$i(ctx) {
  let div;
  let tjsapplicationheader;
  let t0;
  let section;
  let current_block_type_index;
  let if_block;
  let applyStyles_action;
  let t1;
  let resizablehandle;
  let div_id_value;
  let div_class_value;
  let div_data_appid_value;
  let applyStyles_action_1;
  let div_intro;
  let div_outro;
  let current;
  let mounted;
  let dispose;
  tjsapplicationheader = new TJSApplicationHeader({
    props: {
      draggable: ctx[6],
      draggableOptions: ctx[7]
    }
  });
  const if_block_creators = [create_if_block$e, create_else_block$7];
  const if_blocks = [];
  function select_block_type(ctx2, dirty) {
    if (Array.isArray(ctx2[14]))
      return 0;
    return 1;
  }
  __name(select_block_type, "select_block_type");
  current_block_type_index = select_block_type(ctx);
  if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
  resizablehandle = new ResizableHandle({});
  return {
    c() {
      div = element("div");
      create_component(tjsapplicationheader.$$.fragment);
      t0 = space();
      section = element("section");
      if_block.c();
      t1 = space();
      create_component(resizablehandle.$$.fragment);
      attr(section, "class", "window-content svelte-are4no");
      attr(div, "id", div_id_value = ctx[10].id);
      attr(div, "class", div_class_value = "app window-app " + ctx[10].options.classes.join(" ") + " svelte-are4no");
      attr(div, "data-appid", div_data_appid_value = ctx[10].appId);
    },
    m(target, anchor) {
      insert(target, div, anchor);
      mount_component(tjsapplicationheader, div, null);
      append(div, t0);
      append(div, section);
      if_blocks[current_block_type_index].m(section, null);
      ctx[28](section);
      append(div, t1);
      mount_component(resizablehandle, div, null);
      ctx[29](div);
      current = true;
      if (!mounted) {
        dispose = [
          action_destroyer(applyStyles_action = applyStyles.call(null, section, ctx[9])),
          action_destroyer(ctx[12].call(null, section, ctx[15])),
          listen(div, "pointerdown", ctx[13], true),
          action_destroyer(applyStyles_action_1 = applyStyles.call(null, div, ctx[8])),
          action_destroyer(ctx[11].call(null, div, ctx[16]))
        ];
        mounted = true;
      }
    },
    p(new_ctx, [dirty]) {
      ctx = new_ctx;
      const tjsapplicationheader_changes = {};
      if (dirty & 64)
        tjsapplicationheader_changes.draggable = ctx[6];
      if (dirty & 128)
        tjsapplicationheader_changes.draggableOptions = ctx[7];
      tjsapplicationheader.$set(tjsapplicationheader_changes);
      if_block.p(ctx, dirty);
      if (applyStyles_action && is_function(applyStyles_action.update) && dirty & 512)
        applyStyles_action.update.call(null, ctx[9]);
      if (!current || dirty & 1024 && div_id_value !== (div_id_value = ctx[10].id)) {
        attr(div, "id", div_id_value);
      }
      if (!current || dirty & 1024 && div_class_value !== (div_class_value = "app window-app " + ctx[10].options.classes.join(" ") + " svelte-are4no")) {
        attr(div, "class", div_class_value);
      }
      if (!current || dirty & 1024 && div_data_appid_value !== (div_data_appid_value = ctx[10].appId)) {
        attr(div, "data-appid", div_data_appid_value);
      }
      if (applyStyles_action_1 && is_function(applyStyles_action_1.update) && dirty & 256)
        applyStyles_action_1.update.call(null, ctx[8]);
    },
    i(local) {
      if (current)
        return;
      transition_in(tjsapplicationheader.$$.fragment, local);
      transition_in(if_block);
      transition_in(resizablehandle.$$.fragment, local);
      add_render_callback(() => {
        if (div_outro)
          div_outro.end(1);
        div_intro = create_in_transition(div, ctx[2], ctx[4]);
        div_intro.start();
      });
      current = true;
    },
    o(local) {
      transition_out(tjsapplicationheader.$$.fragment, local);
      transition_out(if_block);
      transition_out(resizablehandle.$$.fragment, local);
      if (div_intro)
        div_intro.invalidate();
      div_outro = create_out_transition(div, ctx[3], ctx[5]);
      current = false;
    },
    d(detaching) {
      if (detaching)
        detach(div);
      destroy_component(tjsapplicationheader);
      if_blocks[current_block_type_index].d();
      ctx[28](null);
      destroy_component(resizablehandle);
      ctx[29](null);
      if (detaching && div_outro)
        div_outro.end();
      mounted = false;
      run_all(dispose);
    }
  };
}
__name(create_fragment$i, "create_fragment$i");
function instance$i($$self, $$props, $$invalidate) {
  let { $$slots: slots = {}, $$scope } = $$props;
  let { elementContent = void 0 } = $$props;
  let { elementRoot = void 0 } = $$props;
  let { draggable: draggable2 = void 0 } = $$props;
  let { draggableOptions = void 0 } = $$props;
  let { children: children2 = void 0 } = $$props;
  let { stylesApp = void 0 } = $$props;
  let { stylesContent = void 0 } = $$props;
  let { appOffsetHeight = false } = $$props;
  let { appOffsetWidth = false } = $$props;
  const appResizeObserver = !!appOffsetHeight || !!appOffsetWidth ? resizeObserver : () => null;
  let { contentOffsetHeight = false } = $$props;
  let { contentOffsetWidth = false } = $$props;
  const contentResizeObserver = !!contentOffsetHeight || !!contentOffsetWidth ? resizeObserver : () => null;
  const bringToTop = /* @__PURE__ */ __name((event) => {
    if (typeof application.options.popOut === "boolean" && application.options.popOut) {
      if (application !== ui?.activeWindow) {
        application.bringToTop.call(application);
      }
      if (document.activeElement !== document.body && event.target !== document.activeElement) {
        if (document.activeElement instanceof HTMLElement) {
          document.activeElement.blur();
        }
        document.body.focus();
      }
    }
  }, "bringToTop");
  if (!getContext("storeElementContent")) {
    setContext("storeElementContent", writable(elementContent));
  }
  if (!getContext("storeElementRoot")) {
    setContext("storeElementRoot", writable(elementRoot));
  }
  const context = getContext("external");
  const application = context.application;
  const allChildren = Array.isArray(children2) ? children2 : typeof context === "object" ? context.children : void 0;
  let { transition = void 0 } = $$props;
  let { inTransition = s_DEFAULT_TRANSITION } = $$props;
  let { outTransition = s_DEFAULT_TRANSITION } = $$props;
  let { transitionOptions = void 0 } = $$props;
  let { inTransitionOptions = s_DEFAULT_TRANSITION_OPTIONS } = $$props;
  let { outTransitionOptions = s_DEFAULT_TRANSITION_OPTIONS } = $$props;
  let oldTransition = void 0;
  let oldTransitionOptions = void 0;
  function resizeObservedContent(offsetWidth, offsetHeight) {
    $$invalidate(20, contentOffsetWidth = offsetWidth);
    $$invalidate(19, contentOffsetHeight = offsetHeight);
  }
  __name(resizeObservedContent, "resizeObservedContent");
  function resizeObservedApp(offsetWidth, offsetHeight, contentWidth, contentHeight) {
    application.position.stores.resizeObserved.update((object) => {
      object.contentWidth = contentWidth;
      object.contentHeight = contentHeight;
      object.offsetWidth = offsetWidth;
      object.offsetHeight = offsetHeight;
      return object;
    });
    $$invalidate(17, appOffsetHeight = offsetHeight);
    $$invalidate(18, appOffsetWidth = offsetWidth);
  }
  __name(resizeObservedApp, "resizeObservedApp");
  function section_binding($$value) {
    binding_callbacks[$$value ? "unshift" : "push"](() => {
      elementContent = $$value;
      $$invalidate(0, elementContent);
    });
  }
  __name(section_binding, "section_binding");
  function div_binding($$value) {
    binding_callbacks[$$value ? "unshift" : "push"](() => {
      elementRoot = $$value;
      $$invalidate(1, elementRoot);
    });
  }
  __name(div_binding, "div_binding");
  $$self.$$set = ($$props2) => {
    if ("elementContent" in $$props2)
      $$invalidate(0, elementContent = $$props2.elementContent);
    if ("elementRoot" in $$props2)
      $$invalidate(1, elementRoot = $$props2.elementRoot);
    if ("draggable" in $$props2)
      $$invalidate(6, draggable2 = $$props2.draggable);
    if ("draggableOptions" in $$props2)
      $$invalidate(7, draggableOptions = $$props2.draggableOptions);
    if ("children" in $$props2)
      $$invalidate(21, children2 = $$props2.children);
    if ("stylesApp" in $$props2)
      $$invalidate(8, stylesApp = $$props2.stylesApp);
    if ("stylesContent" in $$props2)
      $$invalidate(9, stylesContent = $$props2.stylesContent);
    if ("appOffsetHeight" in $$props2)
      $$invalidate(17, appOffsetHeight = $$props2.appOffsetHeight);
    if ("appOffsetWidth" in $$props2)
      $$invalidate(18, appOffsetWidth = $$props2.appOffsetWidth);
    if ("contentOffsetHeight" in $$props2)
      $$invalidate(19, contentOffsetHeight = $$props2.contentOffsetHeight);
    if ("contentOffsetWidth" in $$props2)
      $$invalidate(20, contentOffsetWidth = $$props2.contentOffsetWidth);
    if ("transition" in $$props2)
      $$invalidate(22, transition = $$props2.transition);
    if ("inTransition" in $$props2)
      $$invalidate(2, inTransition = $$props2.inTransition);
    if ("outTransition" in $$props2)
      $$invalidate(3, outTransition = $$props2.outTransition);
    if ("transitionOptions" in $$props2)
      $$invalidate(23, transitionOptions = $$props2.transitionOptions);
    if ("inTransitionOptions" in $$props2)
      $$invalidate(4, inTransitionOptions = $$props2.inTransitionOptions);
    if ("outTransitionOptions" in $$props2)
      $$invalidate(5, outTransitionOptions = $$props2.outTransitionOptions);
    if ("$$scope" in $$props2)
      $$invalidate(26, $$scope = $$props2.$$scope);
  };
  $$self.$$.update = () => {
    if ($$self.$$.dirty & 1) {
      if (elementContent !== void 0 && elementContent !== null) {
        getContext("storeElementContent").set(elementContent);
      }
    }
    if ($$self.$$.dirty & 2) {
      if (elementRoot !== void 0 && elementRoot !== null) {
        getContext("storeElementRoot").set(elementRoot);
      }
    }
    if ($$self.$$.dirty & 20971520) {
      if (oldTransition !== transition) {
        const newTransition = s_DEFAULT_TRANSITION !== transition && typeof transition === "function" ? transition : s_DEFAULT_TRANSITION;
        $$invalidate(2, inTransition = newTransition);
        $$invalidate(3, outTransition = newTransition);
        $$invalidate(24, oldTransition = newTransition);
      }
    }
    if ($$self.$$.dirty & 41943040) {
      if (oldTransitionOptions !== transitionOptions) {
        const newOptions = transitionOptions !== s_DEFAULT_TRANSITION_OPTIONS && typeof transitionOptions === "object" ? transitionOptions : s_DEFAULT_TRANSITION_OPTIONS;
        $$invalidate(4, inTransitionOptions = newOptions);
        $$invalidate(5, outTransitionOptions = newOptions);
        $$invalidate(25, oldTransitionOptions = newOptions);
      }
    }
    if ($$self.$$.dirty & 4) {
      if (typeof inTransition !== "function") {
        $$invalidate(2, inTransition = s_DEFAULT_TRANSITION);
      }
    }
    if ($$self.$$.dirty & 1032) {
      {
        if (typeof outTransition !== "function") {
          $$invalidate(3, outTransition = s_DEFAULT_TRANSITION);
        }
        if (application && typeof application?.options?.defaultCloseAnimation === "boolean") {
          $$invalidate(10, application.options.defaultCloseAnimation = outTransition === s_DEFAULT_TRANSITION, application);
        }
      }
    }
    if ($$self.$$.dirty & 16) {
      if (typeof inTransitionOptions !== "object") {
        $$invalidate(4, inTransitionOptions = s_DEFAULT_TRANSITION_OPTIONS);
      }
    }
    if ($$self.$$.dirty & 32) {
      if (typeof outTransitionOptions !== "object") {
        $$invalidate(5, outTransitionOptions = s_DEFAULT_TRANSITION_OPTIONS);
      }
    }
  };
  return [
    elementContent,
    elementRoot,
    inTransition,
    outTransition,
    inTransitionOptions,
    outTransitionOptions,
    draggable2,
    draggableOptions,
    stylesApp,
    stylesContent,
    application,
    appResizeObserver,
    contentResizeObserver,
    bringToTop,
    allChildren,
    resizeObservedContent,
    resizeObservedApp,
    appOffsetHeight,
    appOffsetWidth,
    contentOffsetHeight,
    contentOffsetWidth,
    children2,
    transition,
    transitionOptions,
    oldTransition,
    oldTransitionOptions,
    $$scope,
    slots,
    section_binding,
    div_binding
  ];
}
__name(instance$i, "instance$i");
class ApplicationShell extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$i, create_fragment$i, safe_not_equal, {
      elementContent: 0,
      elementRoot: 1,
      draggable: 6,
      draggableOptions: 7,
      children: 21,
      stylesApp: 8,
      stylesContent: 9,
      appOffsetHeight: 17,
      appOffsetWidth: 18,
      contentOffsetHeight: 19,
      contentOffsetWidth: 20,
      transition: 22,
      inTransition: 2,
      outTransition: 3,
      transitionOptions: 23,
      inTransitionOptions: 4,
      outTransitionOptions: 5
    });
  }
  get elementContent() {
    return this.$$.ctx[0];
  }
  set elementContent(elementContent) {
    this.$$set({ elementContent });
    flush();
  }
  get elementRoot() {
    return this.$$.ctx[1];
  }
  set elementRoot(elementRoot) {
    this.$$set({ elementRoot });
    flush();
  }
  get draggable() {
    return this.$$.ctx[6];
  }
  set draggable(draggable2) {
    this.$$set({ draggable: draggable2 });
    flush();
  }
  get draggableOptions() {
    return this.$$.ctx[7];
  }
  set draggableOptions(draggableOptions) {
    this.$$set({ draggableOptions });
    flush();
  }
  get children() {
    return this.$$.ctx[21];
  }
  set children(children2) {
    this.$$set({ children: children2 });
    flush();
  }
  get stylesApp() {
    return this.$$.ctx[8];
  }
  set stylesApp(stylesApp) {
    this.$$set({ stylesApp });
    flush();
  }
  get stylesContent() {
    return this.$$.ctx[9];
  }
  set stylesContent(stylesContent) {
    this.$$set({ stylesContent });
    flush();
  }
  get appOffsetHeight() {
    return this.$$.ctx[17];
  }
  set appOffsetHeight(appOffsetHeight) {
    this.$$set({ appOffsetHeight });
    flush();
  }
  get appOffsetWidth() {
    return this.$$.ctx[18];
  }
  set appOffsetWidth(appOffsetWidth) {
    this.$$set({ appOffsetWidth });
    flush();
  }
  get contentOffsetHeight() {
    return this.$$.ctx[19];
  }
  set contentOffsetHeight(contentOffsetHeight) {
    this.$$set({ contentOffsetHeight });
    flush();
  }
  get contentOffsetWidth() {
    return this.$$.ctx[20];
  }
  set contentOffsetWidth(contentOffsetWidth) {
    this.$$set({ contentOffsetWidth });
    flush();
  }
  get transition() {
    return this.$$.ctx[22];
  }
  set transition(transition) {
    this.$$set({ transition });
    flush();
  }
  get inTransition() {
    return this.$$.ctx[2];
  }
  set inTransition(inTransition) {
    this.$$set({ inTransition });
    flush();
  }
  get outTransition() {
    return this.$$.ctx[3];
  }
  set outTransition(outTransition) {
    this.$$set({ outTransition });
    flush();
  }
  get transitionOptions() {
    return this.$$.ctx[23];
  }
  set transitionOptions(transitionOptions) {
    this.$$set({ transitionOptions });
    flush();
  }
  get inTransitionOptions() {
    return this.$$.ctx[4];
  }
  set inTransitionOptions(inTransitionOptions) {
    this.$$set({ inTransitionOptions });
    flush();
  }
  get outTransitionOptions() {
    return this.$$.ctx[5];
  }
  set outTransitionOptions(outTransitionOptions) {
    this.$$set({ outTransitionOptions });
    flush();
  }
}
__name(ApplicationShell, "ApplicationShell");
const TJSApplicationShell_svelte_svelte_type_style_lang = "";
const DialogContent_svelte_svelte_type_style_lang = "";
function get_each_context$a(ctx, list, i) {
  const child_ctx = ctx.slice();
  child_ctx[15] = list[i];
  return child_ctx;
}
__name(get_each_context$a, "get_each_context$a");
function create_if_block_3$5(ctx) {
  let switch_instance;
  let switch_instance_anchor;
  let current;
  const switch_instance_spread_levels = [ctx[5]];
  var switch_value = ctx[4];
  function switch_props(ctx2) {
    let switch_instance_props = {};
    for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
      switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
    }
    return { props: switch_instance_props };
  }
  __name(switch_props, "switch_props");
  if (switch_value) {
    switch_instance = construct_svelte_component(switch_value, switch_props());
    ctx[12](switch_instance);
  }
  return {
    c() {
      if (switch_instance)
        create_component(switch_instance.$$.fragment);
      switch_instance_anchor = empty();
    },
    m(target, anchor) {
      if (switch_instance)
        mount_component(switch_instance, target, anchor);
      insert(target, switch_instance_anchor, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      const switch_instance_changes = dirty & 32 ? get_spread_update(switch_instance_spread_levels, [get_spread_object(ctx2[5])]) : {};
      if (switch_value !== (switch_value = ctx2[4])) {
        if (switch_instance) {
          group_outros();
          const old_component = switch_instance;
          transition_out(old_component.$$.fragment, 1, 0, () => {
            destroy_component(old_component, 1);
          });
          check_outros();
        }
        if (switch_value) {
          switch_instance = construct_svelte_component(switch_value, switch_props());
          ctx2[12](switch_instance);
          create_component(switch_instance.$$.fragment);
          transition_in(switch_instance.$$.fragment, 1);
          mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
        } else {
          switch_instance = null;
        }
      } else if (switch_value) {
        switch_instance.$set(switch_instance_changes);
      }
    },
    i(local) {
      if (current)
        return;
      if (switch_instance)
        transition_in(switch_instance.$$.fragment, local);
      current = true;
    },
    o(local) {
      if (switch_instance)
        transition_out(switch_instance.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      ctx[12](null);
      if (detaching)
        detach(switch_instance_anchor);
      if (switch_instance)
        destroy_component(switch_instance, detaching);
    }
  };
}
__name(create_if_block_3$5, "create_if_block_3$5");
function create_if_block_2$5(ctx) {
  let html_tag;
  let html_anchor;
  return {
    c() {
      html_tag = new HtmlTag(false);
      html_anchor = empty();
      html_tag.a = html_anchor;
    },
    m(target, anchor) {
      html_tag.m(ctx[2], target, anchor);
      insert(target, html_anchor, anchor);
    },
    p(ctx2, dirty) {
      if (dirty & 4)
        html_tag.p(ctx2[2]);
    },
    i: noop,
    o: noop,
    d(detaching) {
      if (detaching)
        detach(html_anchor);
      if (detaching)
        html_tag.d();
    }
  };
}
__name(create_if_block_2$5, "create_if_block_2$5");
function create_if_block$d(ctx) {
  let div;
  let each_blocks = [];
  let each_1_lookup = /* @__PURE__ */ new Map();
  let each_value = ctx[1];
  const get_key = /* @__PURE__ */ __name((ctx2) => ctx2[15].id, "get_key");
  for (let i = 0; i < each_value.length; i += 1) {
    let child_ctx = get_each_context$a(ctx, each_value, i);
    let key = get_key(child_ctx);
    each_1_lookup.set(key, each_blocks[i] = create_each_block$a(key, child_ctx));
  }
  return {
    c() {
      div = element("div");
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].c();
      }
      attr(div, "class", "dialog-buttons svelte-14xg9ru");
    },
    m(target, anchor) {
      insert(target, div, anchor);
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].m(div, null);
      }
    },
    p(ctx2, dirty) {
      if (dirty & 74) {
        each_value = ctx2[1];
        each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx2, each_value, each_1_lookup, div, destroy_block, create_each_block$a, null, get_each_context$a);
      }
    },
    d(detaching) {
      if (detaching)
        detach(div);
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].d();
      }
    }
  };
}
__name(create_if_block$d, "create_if_block$d");
function create_if_block_1$a(ctx) {
  let html_tag;
  let raw_value = ctx[15].icon + "";
  let html_anchor;
  return {
    c() {
      html_tag = new HtmlTag(false);
      html_anchor = empty();
      html_tag.a = html_anchor;
    },
    m(target, anchor) {
      html_tag.m(raw_value, target, anchor);
      insert(target, html_anchor, anchor);
    },
    p(ctx2, dirty) {
      if (dirty & 2 && raw_value !== (raw_value = ctx2[15].icon + ""))
        html_tag.p(raw_value);
    },
    d(detaching) {
      if (detaching)
        detach(html_anchor);
      if (detaching)
        html_tag.d();
    }
  };
}
__name(create_if_block_1$a, "create_if_block_1$a");
function create_each_block$a(key_1, ctx) {
  let button;
  let span;
  let t0_value = ctx[15].label + "";
  let t0;
  let span_title_value;
  let t1;
  let button_class_value;
  let applyStyles_action;
  let mounted;
  let dispose;
  let if_block = ctx[15].icon && create_if_block_1$a(ctx);
  function click_handler() {
    return ctx[13](ctx[15]);
  }
  __name(click_handler, "click_handler");
  return {
    key: key_1,
    first: null,
    c() {
      button = element("button");
      span = element("span");
      if (if_block)
        if_block.c();
      t0 = text(t0_value);
      t1 = space();
      attr(span, "title", span_title_value = ctx[15].title);
      attr(button, "class", button_class_value = "dialog-button " + ctx[15].id);
      toggle_class(button, "default", ctx[15].id === ctx[3]);
      this.first = button;
    },
    m(target, anchor) {
      insert(target, button, anchor);
      append(button, span);
      if (if_block)
        if_block.m(span, null);
      append(span, t0);
      append(button, t1);
      if (!mounted) {
        dispose = [
          listen(button, "click", click_handler),
          action_destroyer(applyStyles_action = applyStyles.call(null, button, ctx[15].styles))
        ];
        mounted = true;
      }
    },
    p(new_ctx, dirty) {
      ctx = new_ctx;
      if (ctx[15].icon) {
        if (if_block) {
          if_block.p(ctx, dirty);
        } else {
          if_block = create_if_block_1$a(ctx);
          if_block.c();
          if_block.m(span, t0);
        }
      } else if (if_block) {
        if_block.d(1);
        if_block = null;
      }
      if (dirty & 2 && t0_value !== (t0_value = ctx[15].label + ""))
        set_data(t0, t0_value);
      if (dirty & 2 && span_title_value !== (span_title_value = ctx[15].title)) {
        attr(span, "title", span_title_value);
      }
      if (dirty & 2 && button_class_value !== (button_class_value = "dialog-button " + ctx[15].id)) {
        attr(button, "class", button_class_value);
      }
      if (applyStyles_action && is_function(applyStyles_action.update) && dirty & 2)
        applyStyles_action.update.call(null, ctx[15].styles);
      if (dirty & 10) {
        toggle_class(button, "default", ctx[15].id === ctx[3]);
      }
    },
    d(detaching) {
      if (detaching)
        detach(button);
      if (if_block)
        if_block.d();
      mounted = false;
      run_all(dispose);
    }
  };
}
__name(create_each_block$a, "create_each_block$a");
function create_fragment$h(ctx) {
  let t0;
  let div;
  let current_block_type_index;
  let if_block0;
  let t1;
  let if_block1_anchor;
  let current;
  let mounted;
  let dispose;
  const if_block_creators = [create_if_block_2$5, create_if_block_3$5];
  const if_blocks = [];
  function select_block_type(ctx2, dirty) {
    if (typeof ctx2[2] === "string")
      return 0;
    if (ctx2[4])
      return 1;
    return -1;
  }
  __name(select_block_type, "select_block_type");
  if (~(current_block_type_index = select_block_type(ctx))) {
    if_block0 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
  }
  let if_block1 = ctx[1].length && create_if_block$d(ctx);
  return {
    c() {
      t0 = space();
      div = element("div");
      if (if_block0)
        if_block0.c();
      t1 = space();
      if (if_block1)
        if_block1.c();
      if_block1_anchor = empty();
      attr(div, "class", "dialog-content");
    },
    m(target, anchor) {
      insert(target, t0, anchor);
      insert(target, div, anchor);
      if (~current_block_type_index) {
        if_blocks[current_block_type_index].m(div, null);
      }
      insert(target, t1, anchor);
      if (if_block1)
        if_block1.m(target, anchor);
      insert(target, if_block1_anchor, anchor);
      current = true;
      if (!mounted) {
        dispose = listen(document.body, "keydown", ctx[7]);
        mounted = true;
      }
    },
    p(ctx2, [dirty]) {
      let previous_block_index = current_block_type_index;
      current_block_type_index = select_block_type(ctx2);
      if (current_block_type_index === previous_block_index) {
        if (~current_block_type_index) {
          if_blocks[current_block_type_index].p(ctx2, dirty);
        }
      } else {
        if (if_block0) {
          group_outros();
          transition_out(if_blocks[previous_block_index], 1, 1, () => {
            if_blocks[previous_block_index] = null;
          });
          check_outros();
        }
        if (~current_block_type_index) {
          if_block0 = if_blocks[current_block_type_index];
          if (!if_block0) {
            if_block0 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx2);
            if_block0.c();
          } else {
            if_block0.p(ctx2, dirty);
          }
          transition_in(if_block0, 1);
          if_block0.m(div, null);
        } else {
          if_block0 = null;
        }
      }
      if (ctx2[1].length) {
        if (if_block1) {
          if_block1.p(ctx2, dirty);
        } else {
          if_block1 = create_if_block$d(ctx2);
          if_block1.c();
          if_block1.m(if_block1_anchor.parentNode, if_block1_anchor);
        }
      } else if (if_block1) {
        if_block1.d(1);
        if_block1 = null;
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(if_block0);
      current = true;
    },
    o(local) {
      transition_out(if_block0);
      current = false;
    },
    d(detaching) {
      if (detaching)
        detach(t0);
      if (detaching)
        detach(div);
      if (~current_block_type_index) {
        if_blocks[current_block_type_index].d();
      }
      if (detaching)
        detach(t1);
      if (if_block1)
        if_block1.d(detaching);
      if (detaching)
        detach(if_block1_anchor);
      mounted = false;
      dispose();
    }
  };
}
__name(create_fragment$h, "create_fragment$h");
const s_REGEX_HTML = /^\s*<.*>$/;
function instance$h($$self, $$props, $$invalidate) {
  let { data = {} } = $$props;
  let { autoClose = true } = $$props;
  let { preventDefault: preventDefault2 = false } = $$props;
  let { stopPropagation = false } = $$props;
  let { dialogInstance = void 0 } = $$props;
  let buttons;
  let content = void 0;
  let dialogComponent;
  let dialogProps = {};
  let application = getContext("external").application;
  let currentButtonId = data.default;
  async function onClick(button) {
    try {
      let result = null;
      const invoke = button.callback ?? button.onclick;
      switch (typeof invoke) {
        case "function":
          result = await invoke(
            application.options.jQuery ? application.element : application.element[0],
            dialogInstance
          );
          break;
        case "string":
          if (dialogInstance !== void 0 && typeof dialogInstance[invoke] === "function") {
            result = await dialogInstance[invoke](
              application.options.jQuery ? application.element : application.element[0],
              dialogInstance
            );
          }
          break;
      }
      if (autoClose) {
        setTimeout(() => application.close(), 0);
      }
      return result;
    } catch (err) {
      ui.notifications.error(err);
      throw new Error(err);
    }
  }
  __name(onClick, "onClick");
  function onKeydown(event) {
    if (event.key !== "Escape" && ui.activeWindow !== application) {
      return;
    }
    switch (event.key) {
      case "ArrowLeft": {
        event.preventDefault();
        event.stopPropagation();
        const currentIndex = buttons.findIndex((button) => button.id === currentButtonId);
        if (buttons.length && currentIndex > 0) {
          $$invalidate(3, currentButtonId = buttons[currentIndex - 1].id);
        }
        break;
      }
      case "ArrowRight": {
        event.preventDefault();
        event.stopPropagation();
        const currentIndex = buttons.findIndex((button) => button.id === currentButtonId);
        if (buttons.length && currentIndex < buttons.length - 1) {
          $$invalidate(3, currentButtonId = buttons[currentIndex + 1].id);
        }
        break;
      }
      case "Escape":
        event.preventDefault();
        event.stopPropagation();
        return application.close();
      case "Enter":
        event.preventDefault();
        event.stopPropagation();
        if (currentButtonId && isObject(data.buttons) && currentButtonId in data.buttons) {
          onClick(data.buttons[currentButtonId]);
        }
        break;
      default:
        if (preventDefault2) {
          event.preventDefault();
        }
        if (stopPropagation) {
          event.stopPropagation();
        }
        break;
    }
  }
  __name(onKeydown, "onKeydown");
  function switch_instance_binding($$value) {
    binding_callbacks[$$value ? "unshift" : "push"](() => {
      dialogInstance = $$value;
      $$invalidate(0, dialogInstance);
    });
  }
  __name(switch_instance_binding, "switch_instance_binding");
  const click_handler = /* @__PURE__ */ __name((button) => onClick(button), "click_handler");
  $$self.$$set = ($$props2) => {
    if ("data" in $$props2)
      $$invalidate(8, data = $$props2.data);
    if ("autoClose" in $$props2)
      $$invalidate(9, autoClose = $$props2.autoClose);
    if ("preventDefault" in $$props2)
      $$invalidate(10, preventDefault2 = $$props2.preventDefault);
    if ("stopPropagation" in $$props2)
      $$invalidate(11, stopPropagation = $$props2.stopPropagation);
    if ("dialogInstance" in $$props2)
      $$invalidate(0, dialogInstance = $$props2.dialogInstance);
  };
  $$self.$$.update = () => {
    if ($$self.$$.dirty & 256) {
      {
        $$invalidate(1, buttons = !isObject(data.buttons) ? [] : Object.keys(data.buttons).reduce(
          (array, key) => {
            const b = data.buttons[key];
            const icon = typeof b.icon !== "string" ? void 0 : s_REGEX_HTML.test(b.icon) ? b.icon : `<i class="${b.icon}"></i>`;
            const label = typeof b.label === "string" ? `${icon !== void 0 ? " " : ""}${localize(b.label)}` : "";
            const title = typeof b.title === "string" ? localize(b.title) : void 0;
            const condition = typeof b.condition === "function" ? b.condition.call(b) : b.condition ?? true;
            if (condition) {
              array.push({ ...b, id: key, icon, label, title });
            }
            return array;
          },
          []
        ));
      }
    }
    if ($$self.$$.dirty & 10) {
      if (!buttons.find((button) => button.id === currentButtonId)) {
        $$invalidate(3, currentButtonId = void 0);
      }
    }
    if ($$self.$$.dirty & 260) {
      if (content !== data.content) {
        $$invalidate(2, content = data.content);
        try {
          if (isSvelteComponent(content)) {
            $$invalidate(4, dialogComponent = content);
            $$invalidate(5, dialogProps = {});
          } else if (typeof content === "object") {
            const svelteConfig = parseSvelteConfig(content, application);
            $$invalidate(4, dialogComponent = svelteConfig.class);
            $$invalidate(5, dialogProps = svelteConfig.props ?? {});
            const children2 = svelteConfig?.context?.get("external")?.children;
            if (Array.isArray(children2)) {
              $$invalidate(5, dialogProps.children = children2, dialogProps);
            }
          } else {
            $$invalidate(4, dialogComponent = void 0);
            $$invalidate(5, dialogProps = {});
          }
        } catch (err) {
          $$invalidate(4, dialogComponent = void 0);
          $$invalidate(5, dialogProps = {});
          $$invalidate(2, content = err.message);
          console.error(err);
        }
      }
    }
  };
  return [
    dialogInstance,
    buttons,
    content,
    currentButtonId,
    dialogComponent,
    dialogProps,
    onClick,
    onKeydown,
    data,
    autoClose,
    preventDefault2,
    stopPropagation,
    switch_instance_binding,
    click_handler
  ];
}
__name(instance$h, "instance$h");
class DialogContent extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$h, create_fragment$h, safe_not_equal, {
      data: 8,
      autoClose: 9,
      preventDefault: 10,
      stopPropagation: 11,
      dialogInstance: 0
    });
  }
}
__name(DialogContent, "DialogContent");
function create_else_block$6(ctx) {
  let applicationshell;
  let updating_elementRoot;
  let updating_elementContent;
  let current;
  const applicationshell_spread_levels = [ctx[6], { appOffsetHeight: true }];
  function applicationshell_elementRoot_binding_1(value) {
    ctx[16](value);
  }
  __name(applicationshell_elementRoot_binding_1, "applicationshell_elementRoot_binding_1");
  function applicationshell_elementContent_binding_1(value) {
    ctx[17](value);
  }
  __name(applicationshell_elementContent_binding_1, "applicationshell_elementContent_binding_1");
  let applicationshell_props = {
    $$slots: { default: [create_default_slot_2] },
    $$scope: { ctx }
  };
  for (let i = 0; i < applicationshell_spread_levels.length; i += 1) {
    applicationshell_props = assign(applicationshell_props, applicationshell_spread_levels[i]);
  }
  if (ctx[1] !== void 0) {
    applicationshell_props.elementRoot = ctx[1];
  }
  if (ctx[0] !== void 0) {
    applicationshell_props.elementContent = ctx[0];
  }
  applicationshell = new ApplicationShell({ props: applicationshell_props });
  binding_callbacks.push(() => bind(applicationshell, "elementRoot", applicationshell_elementRoot_binding_1, ctx[1]));
  binding_callbacks.push(() => bind(applicationshell, "elementContent", applicationshell_elementContent_binding_1, ctx[0]));
  return {
    c() {
      create_component(applicationshell.$$.fragment);
    },
    m(target, anchor) {
      mount_component(applicationshell, target, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      const applicationshell_changes = dirty & 64 ? get_spread_update(applicationshell_spread_levels, [
        get_spread_object(ctx2[6]),
        applicationshell_spread_levels[1]
      ]) : {};
      if (dirty & 1049100) {
        applicationshell_changes.$$scope = { dirty, ctx: ctx2 };
      }
      if (!updating_elementRoot && dirty & 2) {
        updating_elementRoot = true;
        applicationshell_changes.elementRoot = ctx2[1];
        add_flush_callback(() => updating_elementRoot = false);
      }
      if (!updating_elementContent && dirty & 1) {
        updating_elementContent = true;
        applicationshell_changes.elementContent = ctx2[0];
        add_flush_callback(() => updating_elementContent = false);
      }
      applicationshell.$set(applicationshell_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(applicationshell.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(applicationshell.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(applicationshell, detaching);
    }
  };
}
__name(create_else_block$6, "create_else_block$6");
function create_if_block$c(ctx) {
  let tjsglasspane;
  let current;
  const tjsglasspane_spread_levels = [
    {
      id: `${ctx[4].id}-glasspane`
    },
    { preventDefault: false },
    { stopPropagation: false },
    ctx[7],
    { zIndex: ctx[8] }
  ];
  let tjsglasspane_props = {
    $$slots: { default: [create_default_slot$6] },
    $$scope: { ctx }
  };
  for (let i = 0; i < tjsglasspane_spread_levels.length; i += 1) {
    tjsglasspane_props = assign(tjsglasspane_props, tjsglasspane_spread_levels[i]);
  }
  tjsglasspane = new TJSGlassPane({ props: tjsglasspane_props });
  return {
    c() {
      create_component(tjsglasspane.$$.fragment);
    },
    m(target, anchor) {
      mount_component(tjsglasspane, target, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      const tjsglasspane_changes = dirty & 400 ? get_spread_update(tjsglasspane_spread_levels, [
        dirty & 16 && {
          id: `${ctx2[4].id}-glasspane`
        },
        tjsglasspane_spread_levels[1],
        tjsglasspane_spread_levels[2],
        dirty & 128 && get_spread_object(ctx2[7]),
        dirty & 256 && { zIndex: ctx2[8] }
      ]) : {};
      if (dirty & 1049167) {
        tjsglasspane_changes.$$scope = { dirty, ctx: ctx2 };
      }
      tjsglasspane.$set(tjsglasspane_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(tjsglasspane.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(tjsglasspane.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(tjsglasspane, detaching);
    }
  };
}
__name(create_if_block$c, "create_if_block$c");
function create_default_slot_2(ctx) {
  let dialogcontent;
  let updating_autoClose;
  let updating_dialogInstance;
  let current;
  function dialogcontent_autoClose_binding_1(value) {
    ctx[14](value);
  }
  __name(dialogcontent_autoClose_binding_1, "dialogcontent_autoClose_binding_1");
  function dialogcontent_dialogInstance_binding_1(value) {
    ctx[15](value);
  }
  __name(dialogcontent_dialogInstance_binding_1, "dialogcontent_dialogInstance_binding_1");
  let dialogcontent_props = { data: ctx[3] };
  if (ctx[9] !== void 0) {
    dialogcontent_props.autoClose = ctx[9];
  }
  if (ctx[2] !== void 0) {
    dialogcontent_props.dialogInstance = ctx[2];
  }
  dialogcontent = new DialogContent({ props: dialogcontent_props });
  binding_callbacks.push(() => bind(dialogcontent, "autoClose", dialogcontent_autoClose_binding_1, ctx[9]));
  binding_callbacks.push(() => bind(dialogcontent, "dialogInstance", dialogcontent_dialogInstance_binding_1, ctx[2]));
  return {
    c() {
      create_component(dialogcontent.$$.fragment);
    },
    m(target, anchor) {
      mount_component(dialogcontent, target, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      const dialogcontent_changes = {};
      if (dirty & 8)
        dialogcontent_changes.data = ctx2[3];
      if (!updating_autoClose && dirty & 512) {
        updating_autoClose = true;
        dialogcontent_changes.autoClose = ctx2[9];
        add_flush_callback(() => updating_autoClose = false);
      }
      if (!updating_dialogInstance && dirty & 4) {
        updating_dialogInstance = true;
        dialogcontent_changes.dialogInstance = ctx2[2];
        add_flush_callback(() => updating_dialogInstance = false);
      }
      dialogcontent.$set(dialogcontent_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(dialogcontent.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(dialogcontent.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(dialogcontent, detaching);
    }
  };
}
__name(create_default_slot_2, "create_default_slot_2");
function create_default_slot_1(ctx) {
  let dialogcontent;
  let updating_autoClose;
  let updating_dialogInstance;
  let current;
  function dialogcontent_autoClose_binding(value) {
    ctx[10](value);
  }
  __name(dialogcontent_autoClose_binding, "dialogcontent_autoClose_binding");
  function dialogcontent_dialogInstance_binding(value) {
    ctx[11](value);
  }
  __name(dialogcontent_dialogInstance_binding, "dialogcontent_dialogInstance_binding");
  let dialogcontent_props = {
    stopPropagation: true,
    data: ctx[3]
  };
  if (ctx[9] !== void 0) {
    dialogcontent_props.autoClose = ctx[9];
  }
  if (ctx[2] !== void 0) {
    dialogcontent_props.dialogInstance = ctx[2];
  }
  dialogcontent = new DialogContent({ props: dialogcontent_props });
  binding_callbacks.push(() => bind(dialogcontent, "autoClose", dialogcontent_autoClose_binding, ctx[9]));
  binding_callbacks.push(() => bind(dialogcontent, "dialogInstance", dialogcontent_dialogInstance_binding, ctx[2]));
  return {
    c() {
      create_component(dialogcontent.$$.fragment);
    },
    m(target, anchor) {
      mount_component(dialogcontent, target, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      const dialogcontent_changes = {};
      if (dirty & 8)
        dialogcontent_changes.data = ctx2[3];
      if (!updating_autoClose && dirty & 512) {
        updating_autoClose = true;
        dialogcontent_changes.autoClose = ctx2[9];
        add_flush_callback(() => updating_autoClose = false);
      }
      if (!updating_dialogInstance && dirty & 4) {
        updating_dialogInstance = true;
        dialogcontent_changes.dialogInstance = ctx2[2];
        add_flush_callback(() => updating_dialogInstance = false);
      }
      dialogcontent.$set(dialogcontent_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(dialogcontent.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(dialogcontent.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(dialogcontent, detaching);
    }
  };
}
__name(create_default_slot_1, "create_default_slot_1");
function create_default_slot$6(ctx) {
  let applicationshell;
  let updating_elementRoot;
  let updating_elementContent;
  let current;
  const applicationshell_spread_levels = [ctx[6], { appOffsetHeight: true }];
  function applicationshell_elementRoot_binding(value) {
    ctx[12](value);
  }
  __name(applicationshell_elementRoot_binding, "applicationshell_elementRoot_binding");
  function applicationshell_elementContent_binding(value) {
    ctx[13](value);
  }
  __name(applicationshell_elementContent_binding, "applicationshell_elementContent_binding");
  let applicationshell_props = {
    $$slots: { default: [create_default_slot_1] },
    $$scope: { ctx }
  };
  for (let i = 0; i < applicationshell_spread_levels.length; i += 1) {
    applicationshell_props = assign(applicationshell_props, applicationshell_spread_levels[i]);
  }
  if (ctx[1] !== void 0) {
    applicationshell_props.elementRoot = ctx[1];
  }
  if (ctx[0] !== void 0) {
    applicationshell_props.elementContent = ctx[0];
  }
  applicationshell = new ApplicationShell({ props: applicationshell_props });
  binding_callbacks.push(() => bind(applicationshell, "elementRoot", applicationshell_elementRoot_binding, ctx[1]));
  binding_callbacks.push(() => bind(applicationshell, "elementContent", applicationshell_elementContent_binding, ctx[0]));
  return {
    c() {
      create_component(applicationshell.$$.fragment);
    },
    m(target, anchor) {
      mount_component(applicationshell, target, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      const applicationshell_changes = dirty & 64 ? get_spread_update(applicationshell_spread_levels, [
        get_spread_object(ctx2[6]),
        applicationshell_spread_levels[1]
      ]) : {};
      if (dirty & 1049100) {
        applicationshell_changes.$$scope = { dirty, ctx: ctx2 };
      }
      if (!updating_elementRoot && dirty & 2) {
        updating_elementRoot = true;
        applicationshell_changes.elementRoot = ctx2[1];
        add_flush_callback(() => updating_elementRoot = false);
      }
      if (!updating_elementContent && dirty & 1) {
        updating_elementContent = true;
        applicationshell_changes.elementContent = ctx2[0];
        add_flush_callback(() => updating_elementContent = false);
      }
      applicationshell.$set(applicationshell_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(applicationshell.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(applicationshell.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(applicationshell, detaching);
    }
  };
}
__name(create_default_slot$6, "create_default_slot$6");
function create_fragment$g(ctx) {
  let current_block_type_index;
  let if_block;
  let if_block_anchor;
  let current;
  const if_block_creators = [create_if_block$c, create_else_block$6];
  const if_blocks = [];
  function select_block_type(ctx2, dirty) {
    if (ctx2[5])
      return 0;
    return 1;
  }
  __name(select_block_type, "select_block_type");
  current_block_type_index = select_block_type(ctx);
  if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
  return {
    c() {
      if_block.c();
      if_block_anchor = empty();
    },
    m(target, anchor) {
      if_blocks[current_block_type_index].m(target, anchor);
      insert(target, if_block_anchor, anchor);
      current = true;
    },
    p(ctx2, [dirty]) {
      let previous_block_index = current_block_type_index;
      current_block_type_index = select_block_type(ctx2);
      if (current_block_type_index === previous_block_index) {
        if_blocks[current_block_type_index].p(ctx2, dirty);
      } else {
        group_outros();
        transition_out(if_blocks[previous_block_index], 1, 1, () => {
          if_blocks[previous_block_index] = null;
        });
        check_outros();
        if_block = if_blocks[current_block_type_index];
        if (!if_block) {
          if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx2);
          if_block.c();
        } else {
          if_block.p(ctx2, dirty);
        }
        transition_in(if_block, 1);
        if_block.m(if_block_anchor.parentNode, if_block_anchor);
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(if_block);
      current = true;
    },
    o(local) {
      transition_out(if_block);
      current = false;
    },
    d(detaching) {
      if_blocks[current_block_type_index].d(detaching);
      if (detaching)
        detach(if_block_anchor);
    }
  };
}
__name(create_fragment$g, "create_fragment$g");
const s_MODAL_BACKGROUND = "#50505080";
function instance$g($$self, $$props, $$invalidate) {
  let { elementContent = void 0 } = $$props;
  let { elementRoot = void 0 } = $$props;
  let { data = {} } = $$props;
  let { dialogComponent = void 0 } = $$props;
  const application = getContext("external").application;
  const s_MODAL_TRANSITION = fade;
  const s_MODAL_TRANSITION_OPTIONS = { duration: 200 };
  let modal = void 0;
  const appProps = {
    transition: void 0,
    inTransition: void 0,
    outTransition: void 0,
    transitionOptions: void 0,
    inTransitionOptions: void 0,
    outTransitionOptions: void 0,
    stylesApp: void 0,
    stylesContent: void 0
  };
  const modalProps = {
    background: void 0,
    transition: void 0,
    inTransition: void 0,
    outTransition: void 0,
    transitionOptions: void 0,
    inTransitionOptions: void 0,
    outTransitionOptions: void 0
  };
  let zIndex = void 0;
  let autoClose = true;
  if (modal === void 0) {
    modal = typeof data?.modal === "boolean" ? data.modal : false;
  }
  function dialogcontent_autoClose_binding(value) {
    autoClose = value;
    $$invalidate(9, autoClose), $$invalidate(3, data), $$invalidate(5, modal), $$invalidate(8, zIndex), $$invalidate(4, application);
  }
  __name(dialogcontent_autoClose_binding, "dialogcontent_autoClose_binding");
  function dialogcontent_dialogInstance_binding(value) {
    dialogComponent = value;
    $$invalidate(2, dialogComponent);
  }
  __name(dialogcontent_dialogInstance_binding, "dialogcontent_dialogInstance_binding");
  function applicationshell_elementRoot_binding(value) {
    elementRoot = value;
    $$invalidate(1, elementRoot);
  }
  __name(applicationshell_elementRoot_binding, "applicationshell_elementRoot_binding");
  function applicationshell_elementContent_binding(value) {
    elementContent = value;
    $$invalidate(0, elementContent);
  }
  __name(applicationshell_elementContent_binding, "applicationshell_elementContent_binding");
  function dialogcontent_autoClose_binding_1(value) {
    autoClose = value;
    $$invalidate(9, autoClose), $$invalidate(3, data), $$invalidate(5, modal), $$invalidate(8, zIndex), $$invalidate(4, application);
  }
  __name(dialogcontent_autoClose_binding_1, "dialogcontent_autoClose_binding_1");
  function dialogcontent_dialogInstance_binding_1(value) {
    dialogComponent = value;
    $$invalidate(2, dialogComponent);
  }
  __name(dialogcontent_dialogInstance_binding_1, "dialogcontent_dialogInstance_binding_1");
  function applicationshell_elementRoot_binding_1(value) {
    elementRoot = value;
    $$invalidate(1, elementRoot);
  }
  __name(applicationshell_elementRoot_binding_1, "applicationshell_elementRoot_binding_1");
  function applicationshell_elementContent_binding_1(value) {
    elementContent = value;
    $$invalidate(0, elementContent);
  }
  __name(applicationshell_elementContent_binding_1, "applicationshell_elementContent_binding_1");
  $$self.$$set = ($$props2) => {
    if ("elementContent" in $$props2)
      $$invalidate(0, elementContent = $$props2.elementContent);
    if ("elementRoot" in $$props2)
      $$invalidate(1, elementRoot = $$props2.elementRoot);
    if ("data" in $$props2)
      $$invalidate(3, data = $$props2.data);
    if ("dialogComponent" in $$props2)
      $$invalidate(2, dialogComponent = $$props2.dialogComponent);
  };
  $$self.$$.update = () => {
    if ($$self.$$.dirty & 312) {
      if (typeof data === "object") {
        $$invalidate(9, autoClose = typeof data.autoClose === "boolean" ? data.autoClose : true);
        const newZIndex = Number.isInteger(data.zIndex) || data.zIndex === null ? data.zIndex : modal ? Number.MAX_SAFE_INTEGER : Number.MAX_SAFE_INTEGER - 1;
        if (zIndex !== newZIndex) {
          $$invalidate(8, zIndex = newZIndex);
        }
        const newDraggable = data.draggable ?? true;
        if (application.reactive.draggable !== newDraggable) {
          $$invalidate(4, application.reactive.draggable = newDraggable, application);
        }
        const newPopOut = data.popOut ?? true;
        if (application.reactive.popOut !== newPopOut) {
          $$invalidate(4, application.reactive.popOut = newPopOut, application);
        }
        const newResizable = data.resizable ?? false;
        if (application.reactive.resizable !== newResizable) {
          $$invalidate(4, application.reactive.resizable = newResizable, application);
        }
        const newTitle = data.title ?? "Dialog";
        if (newTitle !== application?.options?.title) {
          $$invalidate(4, application.reactive.title = newTitle, application);
        }
        if (application.position.zIndex !== zIndex) {
          $$invalidate(4, application.position.zIndex = zIndex, application);
        }
      }
    }
    if ($$self.$$.dirty & 72) {
      if (typeof data?.transition === "object") {
        const d = data.transition;
        if (d?.transition !== appProps.transition) {
          $$invalidate(6, appProps.transition = d.transition, appProps);
        }
        if (d?.inTransition !== appProps.inTransition) {
          $$invalidate(6, appProps.inTransition = d.inTransition, appProps);
        }
        if (d?.outTransition !== appProps.outTransition) {
          $$invalidate(6, appProps.outTransition = d.outTransition, appProps);
        }
        if (d?.transitionOptions !== appProps.transitionOptions) {
          $$invalidate(6, appProps.transitionOptions = d.transitionOptions, appProps);
        }
        if (d?.inTransitionOptions !== appProps.inTransitionOptions) {
          $$invalidate(6, appProps.inTransitionOptions = d.inTransitionOptions, appProps);
        }
        if (d?.outTransitionOptions !== appProps.outTransitionOptions) {
          $$invalidate(6, appProps.outTransitionOptions = d.outTransitionOptions, appProps);
        }
      }
    }
    if ($$self.$$.dirty & 136) {
      {
        const newModalBackground = typeof data?.modalOptions?.background === "string" ? data.modalOptions.background : s_MODAL_BACKGROUND;
        if (newModalBackground !== modalProps.background) {
          $$invalidate(7, modalProps.background = newModalBackground, modalProps);
        }
      }
    }
    if ($$self.$$.dirty & 136) {
      if (typeof data?.modalOptions?.transition === "object") {
        const d = data.modalOptions.transition;
        if (d?.transition !== modalProps.transition) {
          $$invalidate(
            7,
            modalProps.transition = typeof d?.transition === "function" ? d.transition : s_MODAL_TRANSITION,
            modalProps
          );
        }
        if (d?.inTransition !== modalProps.inTransition) {
          $$invalidate(7, modalProps.inTransition = d.inTransition, modalProps);
        }
        if (d?.outTransition !== modalProps.outTransition) {
          $$invalidate(7, modalProps.outTransition = d.outTransition, modalProps);
        }
        if (d?.transitionOptions !== modalProps.transitionOptions) {
          $$invalidate(
            7,
            modalProps.transitionOptions = typeof d?.transitionOptions === "object" ? d.transitionOptions : s_MODAL_TRANSITION_OPTIONS,
            modalProps
          );
        }
        if (d?.inTransitionOptions !== modalProps.inTransitionOptions) {
          $$invalidate(7, modalProps.inTransitionOptions = d.inTransitionOptions, modalProps);
        }
        if (d?.outTransitionOptions !== modalProps.outTransitionOptions) {
          $$invalidate(7, modalProps.outTransitionOptions = d.outTransitionOptions, modalProps);
        }
      } else {
        const newModalTransition = typeof data?.modalOptions?.transition?.transition === "function" ? data.modalOptions.transition.transition : s_MODAL_TRANSITION;
        if (newModalTransition !== modalProps.transition) {
          $$invalidate(7, modalProps.transition = newModalTransition, modalProps);
        }
        const newModalTransitionOptions = typeof data?.modalOptions?.transitionOptions === "object" ? data.modalOptions.transitionOptions : s_MODAL_TRANSITION_OPTIONS;
        if (newModalTransitionOptions !== modalProps.transitionOptions) {
          $$invalidate(7, modalProps.transitionOptions = newModalTransitionOptions, modalProps);
        }
      }
    }
  };
  return [
    elementContent,
    elementRoot,
    dialogComponent,
    data,
    application,
    modal,
    appProps,
    modalProps,
    zIndex,
    autoClose,
    dialogcontent_autoClose_binding,
    dialogcontent_dialogInstance_binding,
    applicationshell_elementRoot_binding,
    applicationshell_elementContent_binding,
    dialogcontent_autoClose_binding_1,
    dialogcontent_dialogInstance_binding_1,
    applicationshell_elementRoot_binding_1,
    applicationshell_elementContent_binding_1
  ];
}
__name(instance$g, "instance$g");
class DialogShell extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$g, create_fragment$g, safe_not_equal, {
      elementContent: 0,
      elementRoot: 1,
      data: 3,
      dialogComponent: 2
    });
  }
  get elementContent() {
    return this.$$.ctx[0];
  }
  set elementContent(elementContent) {
    this.$$set({ elementContent });
    flush();
  }
  get elementRoot() {
    return this.$$.ctx[1];
  }
  set elementRoot(elementRoot) {
    this.$$set({ elementRoot });
    flush();
  }
  get data() {
    return this.$$.ctx[3];
  }
  set data(data) {
    this.$$set({ data });
    flush();
  }
  get dialogComponent() {
    return this.$$.ctx[2];
  }
  set dialogComponent(dialogComponent) {
    this.$$set({ dialogComponent });
    flush();
  }
}
__name(DialogShell, "DialogShell");
class DialogData {
  #application;
  constructor(application) {
    this.#application = application;
  }
  get(accessor, defaultValue) {
    return safeAccess(this, accessor, defaultValue);
  }
  merge(data) {
    deepMerge(this, data);
    const component = this.#application.svelte.component(0);
    if (component?.data) {
      component.data = this;
    }
  }
  set(accessor, value) {
    const success = safeSet(this, accessor, value);
    if (success) {
      const component = this.#application.svelte.component(0);
      if (component?.data) {
        component.data = this;
      }
    }
    return success;
  }
}
__name(DialogData, "DialogData");
class TJSDialog extends SvelteApplication {
  #data;
  constructor(data, options = {}) {
    super(options);
    this.#data = new DialogData(this);
    this.data = data;
    Object.defineProperty(this.svelte, "dialogComponent", {
      get: () => this.svelte?.applicationShell?.dialogComponent
    });
  }
  static get defaultOptions() {
    return deepMerge(super.defaultOptions, {
      classes: ["dialog"],
      width: 400,
      height: "auto",
      jQuery: true,
      svelte: {
        class: DialogShell,
        intro: true,
        target: document.body,
        props: function() {
          return { data: this.#data };
        }
      }
    });
  }
  get data() {
    return this.#data;
  }
  set data(data) {
    const descriptors = Object.getOwnPropertyDescriptors(this.#data);
    for (const descriptor in descriptors) {
      if (descriptors[descriptor].configurable) {
        delete this.#data[descriptor];
      }
    }
    this.#data.merge(data);
  }
  activateListeners(html) {
    super.activateListeners(html);
    if (this.data.render instanceof Function) {
      const actualHTML = typeof this.options.template === "string" ? html : this.options.jQuery ? $(this.elementContent) : this.elementContent;
      this.data.render(this.options.jQuery ? actualHTML : actualHTML[0]);
    }
  }
  async close(options) {
    if (this.data.close instanceof Function) {
      this.data.close(this.options.jQuery ? this.element : this.element[0]);
    }
    return super.close(options);
  }
  static async confirm({
    title,
    content,
    yes,
    no,
    render,
    defaultYes = true,
    rejectClose = false,
    options = {},
    buttons = {},
    draggable: draggable2 = true,
    modal = false,
    modalOptions = {},
    popOut = true,
    resizable = false,
    transition = {},
    zIndex
  } = {}) {
    const mergedButtons = deepMerge({
      yes: {
        icon: '<i class="fas fa-check"></i>',
        label: game.i18n.localize("Yes")
      },
      no: {
        icon: '<i class="fas fa-times"></i>',
        label: game.i18n.localize("No")
      }
    }, buttons);
    return new Promise((resolve, reject) => {
      const dialog = new this({
        title,
        content,
        render,
        draggable: draggable2,
        modal,
        modalOptions,
        popOut,
        resizable,
        transition,
        zIndex,
        buttons: deepMerge(mergedButtons, {
          yes: {
            callback: (html) => {
              const result = yes ? yes(html) : true;
              resolve(result);
            }
          },
          no: {
            callback: (html) => {
              const result = no ? no(html) : false;
              resolve(result);
            }
          }
        }),
        default: defaultYes ? "yes" : "no",
        close: () => {
          if (rejectClose) {
            reject("The confirmation Dialog was closed without a choice being made.");
          } else {
            resolve(null);
          }
        }
      }, options);
      dialog.render(true);
    });
  }
  static async prompt({
    title,
    content,
    label,
    callback,
    render,
    rejectClose = false,
    options = {},
    draggable: draggable2 = true,
    icon = '<i class="fas fa-check"></i>',
    modal = false,
    modalOptions = {},
    popOut = true,
    resizable = false,
    transition = {},
    zIndex
  } = {}) {
    return new Promise((resolve, reject) => {
      const dialog = new this({
        title,
        content,
        render,
        draggable: draggable2,
        modal,
        modalOptions,
        popOut,
        resizable,
        transition,
        zIndex,
        buttons: {
          ok: {
            icon,
            label,
            callback: (html) => {
              const result = callback ? callback(html) : null;
              resolve(result);
            }
          }
        },
        default: "ok",
        close: () => {
          if (rejectClose) {
            reject(new Error("The Dialog prompt was closed without being accepted."));
          } else {
            resolve(null);
          }
        }
      }, options);
      dialog.render(true);
    });
  }
}
__name(TJSDialog, "TJSDialog");
Hooks.on("PopOut:loading", (app) => {
  if (app instanceof SvelteApplication) {
    app.position.enabled = false;
  }
});
Hooks.on("PopOut:popin", (app) => {
  if (app instanceof SvelteApplication) {
    app.position.enabled = true;
  }
});
Hooks.on("PopOut:close", (app) => {
  if (app instanceof SvelteApplication) {
    app.position.enabled = true;
  }
});
class CustomSvelteApplication extends SvelteApplication {
  constructor(options, dialogData) {
    super(options, dialogData);
  }
  static getActiveApp(actor) {
    return Object.values(ui.windows).find((app) => app instanceof this && app?.actor === actor);
  }
  static async show(options = {}, dialogData = {}) {
    const app = this.getActiveApp(options.actor);
    if (app) {
      app.render(false, { focus: true });
      return new Promise((resolve, reject) => {
        app.options.resolve = resolve;
        app.options.reject = reject;
      });
    }
    return new Promise((resolve, reject) => {
      options.resolve = resolve;
      options.reject = reject;
      const newApp = new this(options, dialogData).render(true, { focus: true });
      newApp.actor = options.actor;
    });
  }
}
__name(CustomSvelteApplication, "CustomSvelteApplication");
function is_date(obj) {
  return Object.prototype.toString.call(obj) === "[object Date]";
}
__name(is_date, "is_date");
function get_interpolator(a, b) {
  if (a === b || a !== a)
    return () => a;
  const type = typeof a;
  if (type !== typeof b || Array.isArray(a) !== Array.isArray(b)) {
    throw new Error("Cannot interpolate values of different type");
  }
  if (Array.isArray(a)) {
    const arr = b.map((bi, i) => {
      return get_interpolator(a[i], bi);
    });
    return (t) => arr.map((fn) => fn(t));
  }
  if (type === "object") {
    if (!a || !b)
      throw new Error("Object cannot be null");
    if (is_date(a) && is_date(b)) {
      a = a.getTime();
      b = b.getTime();
      const delta = b - a;
      return (t) => new Date(a + t * delta);
    }
    const keys = Object.keys(b);
    const interpolators = {};
    keys.forEach((key) => {
      interpolators[key] = get_interpolator(a[key], b[key]);
    });
    return (t) => {
      const result = {};
      keys.forEach((key) => {
        result[key] = interpolators[key](t);
      });
      return result;
    };
  }
  if (type === "number") {
    const delta = b - a;
    return (t) => a + t * delta;
  }
  throw new Error(`Cannot interpolate ${type} values`);
}
__name(get_interpolator, "get_interpolator");
function tweened(value, defaults = {}) {
  const store = writable(value);
  let task;
  let target_value = value;
  function set(new_value, opts) {
    if (value == null) {
      store.set(value = new_value);
      return Promise.resolve();
    }
    target_value = new_value;
    let previous_task = task;
    let started = false;
    let { delay = 0, duration = 400, easing = identity, interpolate = get_interpolator } = assign(assign({}, defaults), opts);
    if (duration === 0) {
      if (previous_task) {
        previous_task.abort();
        previous_task = null;
      }
      store.set(value = target_value);
      return Promise.resolve();
    }
    const start = now() + delay;
    let fn;
    task = loop((now2) => {
      if (now2 < start)
        return true;
      if (!started) {
        fn = interpolate(value, new_value);
        if (typeof duration === "function")
          duration = duration(value, new_value);
        started = true;
      }
      if (previous_task) {
        previous_task.abort();
        previous_task = null;
      }
      const elapsed = now2 - start;
      if (elapsed > duration) {
        store.set(value = new_value);
        return false;
      }
      store.set(value = fn(easing(elapsed / duration)));
      return true;
    });
    return task.promise;
  }
  __name(set, "set");
  return {
    set,
    update: (fn, opts) => set(fn(target_value, value), opts),
    subscribe: store.subscribe
  };
}
__name(tweened, "tweened");
const HealthBar_svelte_svelte_type_style_lang = "";
function create_fragment$f(ctx) {
  let div4;
  let div3;
  let div0;
  let t0;
  let div1;
  let t1;
  let div2;
  let t2;
  return {
    c() {
      div4 = element("div");
      div3 = element("div");
      div0 = element("div");
      t0 = space();
      div1 = element("div");
      t1 = space();
      div2 = element("div");
      t2 = text(ctx[0]);
      attr(div0, "class", "progress_ghost svelte-zkgr9f");
      set_style(div0, "width", ctx[3] * 100 + "%");
      attr(div1, "class", "progress svelte-zkgr9f");
      set_style(div1, "width", ctx[4] * 100 + "%");
      attr(div2, "class", "overlay svelte-zkgr9f");
      attr(div3, "class", "healthbar svelte-zkgr9f");
    },
    m(target, anchor) {
      insert(target, div4, anchor);
      append(div4, div3);
      append(div3, div0);
      append(div3, t0);
      append(div3, div1);
      append(div3, t1);
      append(div3, div2);
      append(div2, t2);
    },
    p(ctx2, [dirty]) {
      if (dirty & 8) {
        set_style(div0, "width", ctx2[3] * 100 + "%");
      }
      if (dirty & 16) {
        set_style(div1, "width", ctx2[4] * 100 + "%");
      }
      if (dirty & 1)
        set_data(t2, ctx2[0]);
    },
    i: noop,
    o: noop,
    d(detaching) {
      if (detaching)
        detach(div4);
    }
  };
}
__name(create_fragment$f, "create_fragment$f");
function instance$f($$self, $$props, $$invalidate) {
  let $progressBarGhost, $$unsubscribe_progressBarGhost = noop, $$subscribe_progressBarGhost = /* @__PURE__ */ __name(() => ($$unsubscribe_progressBarGhost(), $$unsubscribe_progressBarGhost = subscribe(progressBarGhost, ($$value) => $$invalidate(3, $progressBarGhost = $$value)), progressBarGhost), "$$subscribe_progressBarGhost");
  let $progressBar, $$unsubscribe_progressBar = noop, $$subscribe_progressBar = /* @__PURE__ */ __name(() => ($$unsubscribe_progressBar(), $$unsubscribe_progressBar = subscribe(progressBar, ($$value) => $$invalidate(4, $progressBar = $$value)), progressBar), "$$subscribe_progressBar");
  $$self.$$.on_destroy.push(() => $$unsubscribe_progressBarGhost());
  $$self.$$.on_destroy.push(() => $$unsubscribe_progressBar());
  let { text: text2 } = $$props;
  let { progress = 0 } = $$props;
  let { progressGhost = 0 } = $$props;
  let { progressBar = tweened(0, { duration: 400, easing: cubicOut }) } = $$props;
  $$subscribe_progressBar();
  let { progressBarGhost = tweened(0, { duration: 400, easing: cubicOut }) } = $$props;
  $$subscribe_progressBarGhost();
  function updateProgress() {
    progressBar.set(progress);
    progressBarGhost.set(progressGhost);
  }
  __name(updateProgress, "updateProgress");
  $$self.$$set = ($$props2) => {
    if ("text" in $$props2)
      $$invalidate(0, text2 = $$props2.text);
    if ("progress" in $$props2)
      $$invalidate(5, progress = $$props2.progress);
    if ("progressGhost" in $$props2)
      $$invalidate(6, progressGhost = $$props2.progressGhost);
    if ("progressBar" in $$props2)
      $$subscribe_progressBar($$invalidate(1, progressBar = $$props2.progressBar));
    if ("progressBarGhost" in $$props2)
      $$subscribe_progressBarGhost($$invalidate(2, progressBarGhost = $$props2.progressBarGhost));
  };
  $$self.$$.update = () => {
    if ($$self.$$.dirty & 32) {
      updateProgress();
    }
    if ($$self.$$.dirty & 64) {
      updateProgress();
    }
  };
  return [
    text2,
    progressBar,
    progressBarGhost,
    $progressBarGhost,
    $progressBar,
    progress,
    progressGhost
  ];
}
__name(instance$f, "instance$f");
class HealthBar extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$f, create_fragment$f, safe_not_equal, {
      text: 0,
      progress: 5,
      progressGhost: 6,
      progressBar: 1,
      progressBarGhost: 2
    });
  }
}
__name(HealthBar, "HealthBar");
const Dialog_svelte_svelte_type_style_lang = "";
function create_if_block_1$9(ctx) {
  let p;
  let i;
  let i_class_value;
  return {
    c() {
      p = element("p");
      i = element("i");
      attr(i, "class", i_class_value = null_to_empty(ctx[0]) + " svelte-iivrm9");
      attr(p, "class", "header-icon svelte-iivrm9");
    },
    m(target, anchor) {
      insert(target, p, anchor);
      append(p, i);
    },
    p(ctx2, dirty) {
      if (dirty & 1 && i_class_value !== (i_class_value = null_to_empty(ctx2[0]) + " svelte-iivrm9")) {
        attr(i, "class", i_class_value);
      }
    },
    d(detaching) {
      if (detaching)
        detach(p);
    }
  };
}
__name(create_if_block_1$9, "create_if_block_1$9");
function create_if_block$b(ctx) {
  let div;
  return {
    c() {
      div = element("div");
      attr(div, "class", "svelte-iivrm9");
    },
    m(target, anchor) {
      insert(target, div, anchor);
      div.innerHTML = ctx[3];
    },
    p(ctx2, dirty) {
      if (dirty & 8)
        div.innerHTML = ctx2[3];
    },
    d(detaching) {
      if (detaching)
        detach(div);
    }
  };
}
__name(create_if_block$b, "create_if_block$b");
function create_fragment$e(ctx) {
  let div;
  let t0;
  let p0;
  let strong;
  let t1;
  let t2;
  let p1;
  let t3;
  let if_block0 = ctx[0] && create_if_block_1$9(ctx);
  let if_block1 = ctx[3] && create_if_block$b(ctx);
  return {
    c() {
      div = element("div");
      if (if_block0)
        if_block0.c();
      t0 = space();
      p0 = element("p");
      strong = element("strong");
      t1 = text(ctx[1]);
      t2 = space();
      p1 = element("p");
      t3 = space();
      if (if_block1)
        if_block1.c();
      attr(p0, "class", "header svelte-iivrm9");
      attr(div, "class", "svelte-iivrm9");
    },
    m(target, anchor) {
      insert(target, div, anchor);
      if (if_block0)
        if_block0.m(div, null);
      append(div, t0);
      append(div, p0);
      append(p0, strong);
      append(strong, t1);
      append(div, t2);
      append(div, p1);
      p1.innerHTML = ctx[2];
      append(div, t3);
      if (if_block1)
        if_block1.m(div, null);
    },
    p(ctx2, [dirty]) {
      if (ctx2[0]) {
        if (if_block0) {
          if_block0.p(ctx2, dirty);
        } else {
          if_block0 = create_if_block_1$9(ctx2);
          if_block0.c();
          if_block0.m(div, t0);
        }
      } else if (if_block0) {
        if_block0.d(1);
        if_block0 = null;
      }
      if (dirty & 2)
        set_data(t1, ctx2[1]);
      if (dirty & 4)
        p1.innerHTML = ctx2[2];
      if (ctx2[3]) {
        if (if_block1) {
          if_block1.p(ctx2, dirty);
        } else {
          if_block1 = create_if_block$b(ctx2);
          if_block1.c();
          if_block1.m(div, null);
        }
      } else if (if_block1) {
        if_block1.d(1);
        if_block1 = null;
      }
    },
    i: noop,
    o: noop,
    d(detaching) {
      if (detaching)
        detach(div);
      if (if_block0)
        if_block0.d();
      if (if_block1)
        if_block1.d();
    }
  };
}
__name(create_fragment$e, "create_fragment$e");
function instance$e($$self, $$props, $$invalidate) {
  let { icon } = $$props;
  let { header } = $$props;
  let { content } = $$props;
  let { extraContent = "" } = $$props;
  $$self.$$set = ($$props2) => {
    if ("icon" in $$props2)
      $$invalidate(0, icon = $$props2.icon);
    if ("header" in $$props2)
      $$invalidate(1, header = $$props2.header);
    if ("content" in $$props2)
      $$invalidate(2, content = $$props2.content);
    if ("extraContent" in $$props2)
      $$invalidate(3, extraContent = $$props2.extraContent);
  };
  return [icon, header, content, extraContent];
}
__name(instance$e, "instance$e");
class Dialog extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$e, create_fragment$e, safe_not_equal, {
      icon: 0,
      header: 1,
      content: 2,
      extraContent: 3
    });
  }
}
__name(Dialog, "Dialog");
const CONSTANTS = {
  MODULE_NAME: "rest-recovery",
  FLAG_NAME: "data",
  SETTINGS: {
    MIGRATION_VERSION: "migration-version",
    MODULE_PROFILES: "module-profiles",
    ACTIVE_MODULE_PROFILE: "active-module-profile",
    PROMPT_REST_CONFIG: "prompt-rest-config",
    QUICK_HD_ROLL: "quick-hd-roll",
    SHOW_PLAYER_LIST_REST_BUTTON: "show-player-list-rest-button",
    ENABLE_AUTO_ROLL_HIT_DICE: "enable-auto-roll-hit-dice",
    ENABLE_PROMPT_REST_TIME_PASSING: "enable-prompt-rest-time-passing",
    ENABLE_SIMPLE_CALENDAR_INTEGRATION: "enable-simple-calendar-integration",
    PREVENT_USER_REST: "prevent-user-rest",
    IGNORE_INACTIVE_PLAYERS: "ignore-inactive-players",
    MAX_SHORT_RESTS: "max-short-rests-per-long-rest",
    MIN_HIT_DIE_SPEND: "minimum-hit-die-spend",
    MAX_HIT_DICE_SPEND: "maximum-hit-die-spend",
    DISABLE_SHORT_REST_HIT_DICE: "disable-short-rest-hit-dice",
    SHORT_RESOURCES_MULTIPLIER: "short-rest-recovery-resources",
    SHORT_USES_OTHERS_MULTIPLIER: "short-rest-recovery-uses-others",
    SHORT_USES_FEATS_MULTIPLIER: "short-rest-recovery-uses-feats",
    SHORT_PACT_SPELLS_MULTIPLIER: "short-rest-recovery-pact-spells",
    MAX_HIT_DICE_SPEND_FORMULA: "max-hit-die-spend-formula",
    SHORT_RESOURCES_MULTIPLIER_FORMULA: "short-recovery-resources-formula",
    SHORT_USES_OTHERS_MULTIPLIER_FORMULA: "short-recovery-uses-others-formula",
    SHORT_USES_FEATS_MULTIPLIER_FORMULA: "short-recovery-uses-feats-formula",
    SHORT_PACT_SPELLS_MULTIPLIER_FORMULA: "short-recovery-pact-spells-formula",
    AUTOMATE_EXHAUSTION: "automate-exhaustion",
    EXHAUSTION_INTEGRATION: "exhaustion-integration",
    ONE_DND_EXHAUSTION: "one-dnd-exhaustion",
    LONG_REST_ROLL_HIT_DICE: "long-rest-roll-hit-dice",
    PRE_REST_REGAIN_HIT_DICE: "pre-rest-regain-hit-dice",
    PREVENT_REST_REGAIN_HIT_DICE: "prevent-rest-regain-hit-dice",
    PRE_REST_REGAIN_BUFFER: "pre-rest-regain-hit-dice-buffer",
    LONG_MAX_HIT_DICE_SPEND: "long-rest-maximum-hit-die-spend",
    HD_ROUNDING: "recovery-rounding",
    HP_MULTIPLIER: "recovery-hitpoints",
    HD_MULTIPLIER: "recovery-hitdice",
    LONG_RESOURCES_MULTIPLIER: "recovery-resources",
    LONG_SPELLS_MULTIPLIER: "recovery-spells",
    LONG_CUSTOM_SPELL_RECOVERY: "long-recovery-custom-spell-points",
    LONG_PACT_SPELLS_MULTIPLIER: "long-recovery-pact-spells",
    LONG_USES_OTHERS_MULTIPLIER: "recovery-uses-others",
    LONG_USES_FEATS_MULTIPLIER: "recovery-uses-feats",
    LONG_USES_DAILY_MULTIPLIER: "recovery-day",
    LONG_REST_ARMOR_AUTOMATION: "long-rest-heavy-armor-automation",
    LONG_REST_ARMOR_HIT_DICE: "long-rest-heavy-armor-recovery-hitdice",
    LONG_REST_ARMOR_EXHAUSTION: "long-rest-heavy-armor-exhaustion",
    LONG_MAX_HIT_DICE_SPEND_FORMULA: "long-max-hit-die-spend-formula",
    HP_MULTIPLIER_FORMULA: "long-recovery-hitpoints-formula",
    HD_MULTIPLIER_FORMULA: "long-recovery-hitdice-formula",
    LONG_RESOURCES_MULTIPLIER_FORMULA: "long-recovery-resources-formula",
    LONG_SPELLS_MULTIPLIER_FORMULA: "long-recovery-spells-formula",
    LONG_PACT_SPELLS_MULTIPLIER_FORMULA: "long-pact-recovery-spells-formula",
    LONG_USES_OTHERS_MULTIPLIER_FORMULA: "long-recovery-uses-others-formula",
    LONG_USES_FEATS_MULTIPLIER_FORMULA: "long-recovery-uses-feats-formula",
    LONG_USES_DAILY_MULTIPLIER_FORMULA: "long-recovery-day-formula",
    LONG_REST_ARMOR_HIT_DICE_FORMULA: "long-recovery-heavy-armor-hitdice-formula",
    WIZARD_CLASS: "wizard-class-name",
    DRUID_CLASS: "druid-class-name",
    BARD_CLASS: "bard-class-name",
    ARCANE_RECOVERY: "arcane-recovery-feature-name",
    POWER_SURGE: "power-surge-feature-name",
    NATURAL_RECOVERY: "natural-recovery-feature-name",
    SONG_OF_REST: "song-of-rest-name",
    CHEF_FEAT: "chef-feat-name",
    CHEF_TOOLS: "chef-tools-name",
    DURABLE_FEAT: "durable-feat-name",
    PERIAPT_ITEM: "periapt-item-name",
    WOUND_CLOSURE_BLESSING: "wound-closure-blessing-name",
    BLACK_BLOOD_FEATURE: "black-blood-feature-name",
    ENABLE_FOOD_AND_WATER: "enable-food-and-water",
    FOOD_UNITS_PER_DAY: "food-units-per-day",
    WATER_UNITS_PER_DAY: "water-units-per-day",
    EXTERNAL_FOOD_ACCESS: "external-food-access",
    EXTERNAL_WATER_ACCESS: "external-water-access",
    AUTOMATE_FOODWATER_EXHAUSTION: "automate-foodwater-exhaustion",
    NO_FOOD_DURATION_MODIFIER: "no-food-duration-modifier",
    HALF_WATER_SAVE_DC: "half-water-save-dc"
  },
  FRACTIONS: {
    FULL: "full",
    HALF: "half",
    QUARTER: "quarter",
    NONE: "none",
    CUSTOM: "custom_formula",
    UP: "up",
    DOWN: "down"
  },
  MODULES: {
    DFREDS: "dfreds-convenient-effects",
    CUB: "combat-utility-belt"
  },
  USING_DEFAULT_LONG_REST_SETTINGS() {
    const settings = this.GET_DEFAULT_SETTINGS();
    for (const [key, setting] of Object.entries(settings)) {
      if (setting.group !== "longrest")
        continue;
      if (game.settings.get(this.MODULE_NAME, key) !== setting.default)
        return false;
    }
    return true;
  },
  GET_DEFAULT_SETTINGS() {
    return foundry.utils.deepClone(CONSTANTS.DEFAULT_SETTINGS);
  }
};
CONSTANTS.DEFAULT_SETTINGS = {
  [CONSTANTS.SETTINGS.MIGRATION_VERSION]: {
    scope: "world",
    config: false,
    default: "0.0.0",
    type: String
  },
  [CONSTANTS.SETTINGS.PROMPT_REST_CONFIG]: {
    scope: "client",
    config: false,
    default: [],
    type: Array
  },
  [CONSTANTS.SETTINGS.PREVENT_USER_REST]: {
    name: "REST-RECOVERY.Settings.General.PreventUserRest.Title",
    hint: "REST-RECOVERY.Settings.General.PreventUserRest.Hint",
    scope: "world",
    group: "general",
    config: false,
    default: false,
    type: Boolean
  },
  [CONSTANTS.SETTINGS.ENABLE_AUTO_ROLL_HIT_DICE]: {
    name: "REST-RECOVERY.Settings.General.EnableAutoRollButton.Title",
    hint: "REST-RECOVERY.Settings.General.EnableAutoRollButton.Hint",
    scope: "world",
    group: "general",
    config: false,
    default: true,
    type: Boolean
  },
  [CONSTANTS.SETTINGS.ENABLE_PROMPT_REST_TIME_PASSING]: {
    name: "REST-RECOVERY.Settings.General.EnablePromptRestTimePassing.Title",
    hint: "REST-RECOVERY.Settings.General.EnablePromptRestTimePassing.Hint",
    scope: "world",
    group: "general",
    config: false,
    default: true,
    type: Boolean
  },
  [CONSTANTS.SETTINGS.ENABLE_SIMPLE_CALENDAR_INTEGRATION]: {
    name: "REST-RECOVERY.Settings.General.EnableSimpleCalendarIntegration.Title",
    hint: "REST-RECOVERY.Settings.General.EnableSimpleCalendarIntegration.Hint",
    scope: "world",
    group: "general",
    config: false,
    default: false,
    type: Boolean,
    moduleIntegration: { label: "Simple Calendar", key: "foundryvtt-simple-calendar" },
    validate: () => {
      return !game.modules.get("foundryvtt-simple-calendar")?.active;
    }
  },
  [CONSTANTS.SETTINGS.IGNORE_INACTIVE_PLAYERS]: {
    name: "REST-RECOVERY.Settings.ShortRest.IgnoreInactive.Title",
    hint: "REST-RECOVERY.Settings.ShortRest.IgnoreInactive.Hint",
    scope: "world",
    group: "shortrest",
    config: false,
    default: false,
    type: Boolean
  },
  [CONSTANTS.SETTINGS.MAX_SHORT_RESTS]: {
    name: "REST-RECOVERY.Settings.ShortRest.MaxShortRests.Title",
    hint: "REST-RECOVERY.Settings.ShortRest.MaxShortRests.Hint",
    scope: "world",
    group: "shortrest",
    customSettingsDialog: true,
    config: false,
    default: 0,
    type: Number
  },
  [CONSTANTS.SETTINGS.DISABLE_SHORT_REST_HIT_DICE]: {
    name: "REST-RECOVERY.Settings.ShortRest.NoHitDice.Title",
    hint: "REST-RECOVERY.Settings.ShortRest.NoHitDice.Hint",
    scope: "world",
    group: "shortrest",
    config: false,
    default: false,
    type: Boolean
  },
  [CONSTANTS.SETTINGS.MIN_HIT_DIE_SPEND]: {
    name: "REST-RECOVERY.Settings.ShortRest.MinHitDieSpend.Title",
    hint: "REST-RECOVERY.Settings.ShortRest.MinHitDieSpend.Hint",
    scope: "world",
    group: "shortrest",
    customSettingsDialog: true,
    dependsOn: [CONSTANTS.SETTINGS.DISABLE_SHORT_REST_HIT_DICE],
    validate: (settings) => {
      return settings.get(CONSTANTS.SETTINGS.DISABLE_SHORT_REST_HIT_DICE).value;
    },
    config: false,
    default: 0,
    type: Number
  },
  [CONSTANTS.SETTINGS.MAX_HIT_DICE_SPEND]: {
    name: "REST-RECOVERY.Settings.ShortRest.MaxHitDieSpend.Title",
    hint: "REST-RECOVERY.Settings.ShortRest.MaxHitDieSpend.Hint",
    scope: "world",
    group: "shortrest",
    customSettingsDialog: true,
    dependsOn: [CONSTANTS.SETTINGS.DISABLE_SHORT_REST_HIT_DICE],
    validate: (settings) => {
      return settings.get(CONSTANTS.SETTINGS.DISABLE_SHORT_REST_HIT_DICE).value;
    },
    customFormula: CONSTANTS.SETTINGS.MAX_HIT_DICE_SPEND_FORMULA,
    config: false,
    type: String,
    choices: {
      [CONSTANTS.FRACTIONS.QUARTER]: "REST-RECOVERY.Fractions.Quarter",
      [CONSTANTS.FRACTIONS.HALF]: "REST-RECOVERY.Fractions.Half",
      [CONSTANTS.FRACTIONS.FULL]: "REST-RECOVERY.Fractions.Full",
      [CONSTANTS.FRACTIONS.CUSTOM]: "REST-RECOVERY.Fractions.Custom"
    },
    default: CONSTANTS.FRACTIONS.FULL
  },
  [CONSTANTS.SETTINGS.MAX_HIT_DICE_SPEND_FORMULA]: {
    scope: "world",
    group: "shortrest",
    config: false,
    hidden: true,
    type: String,
    default: "@details.level"
  },
  [CONSTANTS.SETTINGS.SHORT_RESOURCES_MULTIPLIER]: {
    name: "REST-RECOVERY.Settings.ShortRest.ResourcesRecoveryFraction.Title",
    hint: "REST-RECOVERY.Settings.ShortRest.ResourcesRecoveryFraction.Hint",
    scope: "world",
    group: "shortrest",
    customFormula: CONSTANTS.SETTINGS.LONG_RESOURCES_MULTIPLIER_FORMULA,
    config: false,
    type: String,
    choices: {
      [CONSTANTS.FRACTIONS.NONE]: "REST-RECOVERY.Fractions.None",
      [CONSTANTS.FRACTIONS.QUARTER]: "REST-RECOVERY.Fractions.Quarter",
      [CONSTANTS.FRACTIONS.HALF]: "REST-RECOVERY.Fractions.Half",
      [CONSTANTS.FRACTIONS.FULL]: "REST-RECOVERY.Fractions.Full",
      [CONSTANTS.FRACTIONS.CUSTOM]: "REST-RECOVERY.Fractions.Custom"
    },
    default: CONSTANTS.FRACTIONS.FULL
  },
  [CONSTANTS.SETTINGS.SHORT_RESOURCES_MULTIPLIER_FORMULA]: {
    scope: "world",
    group: "shortrest",
    config: false,
    hidden: true,
    type: String,
    default: "@resource.max"
  },
  [CONSTANTS.SETTINGS.SHORT_USES_OTHERS_MULTIPLIER]: {
    name: "REST-RECOVERY.Settings.ShortRest.ItemUsesRecoveryFraction.Title",
    hint: "REST-RECOVERY.Settings.ShortRest.ItemUsesRecoveryFraction.Hint",
    scope: "world",
    group: "shortrest",
    customFormula: CONSTANTS.SETTINGS.SHORT_USES_OTHERS_MULTIPLIER_FORMULA,
    config: false,
    type: String,
    choices: {
      [CONSTANTS.FRACTIONS.NONE]: "REST-RECOVERY.Fractions.None",
      [CONSTANTS.FRACTIONS.QUARTER]: "REST-RECOVERY.Fractions.Quarter",
      [CONSTANTS.FRACTIONS.HALF]: "REST-RECOVERY.Fractions.Half",
      [CONSTANTS.FRACTIONS.FULL]: "REST-RECOVERY.Fractions.Full",
      [CONSTANTS.FRACTIONS.CUSTOM]: "REST-RECOVERY.Fractions.Custom"
    },
    default: CONSTANTS.FRACTIONS.FULL
  },
  [CONSTANTS.SETTINGS.SHORT_USES_OTHERS_MULTIPLIER_FORMULA]: {
    scope: "world",
    group: "shortrest",
    config: false,
    hidden: true,
    type: String,
    default: "@uses.max"
  },
  [CONSTANTS.SETTINGS.SHORT_USES_FEATS_MULTIPLIER]: {
    name: "REST-RECOVERY.Settings.ShortRest.FeatUsesRecoveryFraction.Title",
    hint: "REST-RECOVERY.Settings.ShortRest.FeatUsesRecoveryFraction.Hint",
    scope: "world",
    group: "shortrest",
    customFormula: CONSTANTS.SETTINGS.SHORT_USES_FEATS_MULTIPLIER_FORMULA,
    config: false,
    type: String,
    choices: {
      [CONSTANTS.FRACTIONS.NONE]: "REST-RECOVERY.Fractions.None",
      [CONSTANTS.FRACTIONS.QUARTER]: "REST-RECOVERY.Fractions.Quarter",
      [CONSTANTS.FRACTIONS.HALF]: "REST-RECOVERY.Fractions.Half",
      [CONSTANTS.FRACTIONS.FULL]: "REST-RECOVERY.Fractions.Full",
      [CONSTANTS.FRACTIONS.CUSTOM]: "REST-RECOVERY.Fractions.Custom"
    },
    default: CONSTANTS.FRACTIONS.FULL
  },
  [CONSTANTS.SETTINGS.SHORT_USES_FEATS_MULTIPLIER_FORMULA]: {
    scope: "world",
    group: "shortrest",
    config: false,
    hidden: true,
    type: String,
    default: "@uses.max"
  },
  [CONSTANTS.SETTINGS.SHORT_PACT_SPELLS_MULTIPLIER]: {
    name: "REST-RECOVERY.Settings.ShortRest.PactSpellSlotsLongRecoveryFraction.Title",
    hint: "REST-RECOVERY.Settings.ShortRest.PactSpellSlotsLongRecoveryFraction.Hint",
    scope: "world",
    group: "shortrest",
    customSettingsDialog: true,
    customFormula: CONSTANTS.SETTINGS.SHORT_PACT_SPELLS_MULTIPLIER_FORMULA,
    config: false,
    type: String,
    choices: {
      [CONSTANTS.FRACTIONS.NONE]: "REST-RECOVERY.Fractions.None",
      [CONSTANTS.FRACTIONS.QUARTER]: "REST-RECOVERY.Fractions.Quarter",
      [CONSTANTS.FRACTIONS.HALF]: "REST-RECOVERY.Fractions.Half",
      [CONSTANTS.FRACTIONS.FULL]: "REST-RECOVERY.Fractions.Full",
      [CONSTANTS.FRACTIONS.CUSTOM]: "REST-RECOVERY.Fractions.Custom"
    },
    default: CONSTANTS.FRACTIONS.FULL
  },
  [CONSTANTS.SETTINGS.SHORT_PACT_SPELLS_MULTIPLIER_FORMULA]: {
    scope: "world",
    group: "shortrest",
    config: false,
    hidden: true,
    type: String,
    default: "@slot.max"
  },
  [CONSTANTS.SETTINGS.AUTOMATE_EXHAUSTION]: {
    name: "REST-RECOVERY.Settings.LongRest.AutomateExhaustion.Title",
    hint: "REST-RECOVERY.Settings.LongRest.AutomateExhaustion.Hint",
    scope: "world",
    group: "longrest",
    customSettingsDialog: true,
    config: false,
    default: false,
    type: Boolean
  },
  [CONSTANTS.SETTINGS.EXHAUSTION_INTEGRATION]: {
    name: "REST-RECOVERY.Settings.LongRest.ExhaustionIntegration.Title",
    hint: "REST-RECOVERY.Settings.LongRest.ExhaustionIntegration.Hint",
    scope: "world",
    group: "longrest",
    dependsOn: [CONSTANTS.SETTINGS.AUTOMATE_EXHAUSTION],
    validate: (settings) => {
      return !settings.get(CONSTANTS.SETTINGS.AUTOMATE_EXHAUSTION).value;
    },
    config: false,
    type: String,
    choices: {
      [CONSTANTS.FRACTIONS.NONE]: "REST-RECOVERY.Fractions.None",
      [CONSTANTS.MODULES.DFREDS]: "REST-RECOVERY.Modules.DFreds",
      [CONSTANTS.MODULES.CUB]: "REST-RECOVERY.Modules.CUB"
    },
    default: CONSTANTS.FRACTIONS.NONE
  },
  [CONSTANTS.SETTINGS.ONE_DND_EXHAUSTION]: {
    name: "REST-RECOVERY.Settings.LongRest.OneDnDExhaustion.Title",
    hint: "REST-RECOVERY.Settings.LongRest.OneDnDExhaustion.Hint",
    scope: "world",
    group: "longrest",
    dependsOn: [CONSTANTS.SETTINGS.AUTOMATE_EXHAUSTION, CONSTANTS.SETTINGS.EXHAUSTION_INTEGRATION],
    validate: (settings) => {
      return !settings.get(CONSTANTS.SETTINGS.AUTOMATE_EXHAUSTION).value || settings.get(CONSTANTS.SETTINGS.EXHAUSTION_INTEGRATION).value === CONSTANTS.MODULES.CUB;
    },
    customSettingsDialog: true,
    config: false,
    default: false,
    type: Boolean
  },
  [CONSTANTS.SETTINGS.LONG_REST_ROLL_HIT_DICE]: {
    name: "REST-RECOVERY.Settings.LongRest.RollHitDice.Title",
    hint: "REST-RECOVERY.Settings.LongRest.RollHitDice.Hint",
    scope: "world",
    group: "longrest",
    customSettingsDialog: true,
    config: false,
    default: false,
    type: Boolean
  },
  [CONSTANTS.SETTINGS.PRE_REST_REGAIN_HIT_DICE]: {
    name: "REST-RECOVERY.Settings.LongRest.PreRegainHitDice.Title",
    hint: "REST-RECOVERY.Settings.LongRest.PreRegainHitDice.Hint",
    scope: "world",
    group: "longrest",
    dependsOn: [CONSTANTS.SETTINGS.LONG_REST_ROLL_HIT_DICE, CONSTANTS.SETTINGS.PREVENT_REST_REGAIN_HIT_DICE],
    validate: (settings) => {
      return !settings.get(CONSTANTS.SETTINGS.LONG_REST_ROLL_HIT_DICE).value || settings.get(CONSTANTS.SETTINGS.PREVENT_REST_REGAIN_HIT_DICE).value;
    },
    config: false,
    default: false,
    type: Boolean
  },
  [CONSTANTS.SETTINGS.PRE_REST_REGAIN_BUFFER]: {
    name: "REST-RECOVERY.Settings.LongRest.PreRegainHitDiceBuffer.Title",
    hint: "REST-RECOVERY.Settings.LongRest.PreRegainHitDiceBuffer.Hint",
    scope: "world",
    group: "longrest",
    dependsOn: [CONSTANTS.SETTINGS.PRE_REST_REGAIN_HIT_DICE, CONSTANTS.SETTINGS.PREVENT_REST_REGAIN_HIT_DICE],
    validate: (settings) => {
      return !settings.get(CONSTANTS.SETTINGS.PRE_REST_REGAIN_HIT_DICE).value || settings.get(CONSTANTS.SETTINGS.PREVENT_REST_REGAIN_HIT_DICE).value;
    },
    config: false,
    default: false,
    type: Boolean
  },
  [CONSTANTS.SETTINGS.PREVENT_REST_REGAIN_HIT_DICE]: {
    name: "REST-RECOVERY.Settings.LongRest.PreventRegainHitDice.Title",
    hint: "REST-RECOVERY.Settings.LongRest.PreventRegainHitDice.Hint",
    scope: "world",
    group: "longrest",
    dependsOn: [CONSTANTS.SETTINGS.LONG_REST_ROLL_HIT_DICE, CONSTANTS.SETTINGS.PRE_REST_REGAIN_HIT_DICE],
    validate: (settings) => {
      return !settings.get(CONSTANTS.SETTINGS.LONG_REST_ROLL_HIT_DICE).value || settings.get(CONSTANTS.SETTINGS.PRE_REST_REGAIN_HIT_DICE).value;
    },
    config: false,
    default: false,
    type: Boolean
  },
  [CONSTANTS.SETTINGS.LONG_MAX_HIT_DICE_SPEND]: {
    name: "REST-RECOVERY.Settings.LongRest.MaxHitDieSpend.Title",
    hint: "REST-RECOVERY.Settings.LongRest.MaxHitDieSpend.Hint",
    scope: "world",
    group: "longrest",
    customSettingsDialog: true,
    dependsOn: [CONSTANTS.SETTINGS.LONG_REST_ROLL_HIT_DICE],
    validate: (settings) => {
      return !settings.get(CONSTANTS.SETTINGS.LONG_REST_ROLL_HIT_DICE).value;
    },
    customFormula: CONSTANTS.SETTINGS.LONG_MAX_HIT_DICE_SPEND_FORMULA,
    config: false,
    type: String,
    choices: {
      [CONSTANTS.FRACTIONS.QUARTER]: "REST-RECOVERY.Fractions.Quarter",
      [CONSTANTS.FRACTIONS.HALF]: "REST-RECOVERY.Fractions.Half",
      [CONSTANTS.FRACTIONS.FULL]: "REST-RECOVERY.Fractions.Full",
      [CONSTANTS.FRACTIONS.CUSTOM]: "REST-RECOVERY.Fractions.Custom"
    },
    default: CONSTANTS.FRACTIONS.FULL
  },
  [CONSTANTS.SETTINGS.LONG_MAX_HIT_DICE_SPEND_FORMULA]: {
    scope: "world",
    group: "longrest",
    config: false,
    hidden: true,
    type: String,
    default: "floor(@details.level/2)"
  },
  [CONSTANTS.SETTINGS.HP_MULTIPLIER]: {
    name: "REST-RECOVERY.Settings.LongRest.HitPointsRecoveryFraction.Title",
    hint: "REST-RECOVERY.Settings.LongRest.HitPointsRecoveryFraction.Hint",
    scope: "world",
    group: "longrest",
    customSettingsDialog: true,
    customFormula: CONSTANTS.SETTINGS.HP_MULTIPLIER_FORMULA,
    config: false,
    type: String,
    choices: {
      [CONSTANTS.FRACTIONS.NONE]: "REST-RECOVERY.Fractions.None",
      [CONSTANTS.FRACTIONS.QUARTER]: "REST-RECOVERY.Fractions.Quarter",
      [CONSTANTS.FRACTIONS.HALF]: "REST-RECOVERY.Fractions.Half",
      [CONSTANTS.FRACTIONS.FULL]: "REST-RECOVERY.Fractions.Full",
      [CONSTANTS.FRACTIONS.CUSTOM]: "REST-RECOVERY.Fractions.Custom"
    },
    default: CONSTANTS.FRACTIONS.FULL
  },
  [CONSTANTS.SETTINGS.HP_MULTIPLIER_FORMULA]: {
    scope: "world",
    group: "longrest",
    config: false,
    hidden: true,
    type: String,
    default: "@attributes.hp.max"
  },
  [CONSTANTS.SETTINGS.HD_MULTIPLIER]: {
    name: "REST-RECOVERY.Settings.LongRest.HitDiceRecoveryFraction.Title",
    hint: "REST-RECOVERY.Settings.LongRest.HitDiceRecoveryFraction.Hint",
    scope: "world",
    group: "longrest",
    customSettingsDialog: true,
    customFormula: CONSTANTS.SETTINGS.HD_MULTIPLIER_FORMULA,
    config: false,
    type: String,
    choices: {
      [CONSTANTS.FRACTIONS.NONE]: "REST-RECOVERY.Fractions.None",
      [CONSTANTS.FRACTIONS.QUARTER]: "REST-RECOVERY.Fractions.Quarter",
      [CONSTANTS.FRACTIONS.HALF]: "REST-RECOVERY.Fractions.Half",
      [CONSTANTS.FRACTIONS.FULL]: "REST-RECOVERY.Fractions.Full",
      [CONSTANTS.FRACTIONS.CUSTOM]: "REST-RECOVERY.Fractions.Custom"
    },
    default: CONSTANTS.FRACTIONS.HALF
  },
  [CONSTANTS.SETTINGS.HD_MULTIPLIER_FORMULA]: {
    scope: "world",
    group: "longrest",
    config: false,
    hidden: true,
    type: String,
    default: "@details.level / 2"
  },
  [CONSTANTS.SETTINGS.HD_ROUNDING]: {
    name: "REST-RECOVERY.Settings.LongRest.HitDiceRecoveryRounding.Title",
    hint: "REST-RECOVERY.Settings.LongRest.HitDiceRecoveryRounding.Hint",
    scope: "world",
    group: "longrest",
    customSettingsDialog: true,
    config: false,
    type: String,
    choices: {
      [CONSTANTS.FRACTIONS.DOWN]: "REST-RECOVERY.Rounding.RoundDown",
      [CONSTANTS.FRACTIONS.UP]: "REST-RECOVERY.Rounding.RoundUp"
    },
    default: CONSTANTS.FRACTIONS.DOWN
  },
  [CONSTANTS.SETTINGS.LONG_RESOURCES_MULTIPLIER]: {
    name: "REST-RECOVERY.Settings.LongRest.ResourcesRecoveryFraction.Title",
    hint: "REST-RECOVERY.Settings.LongRest.ResourcesRecoveryFraction.Hint",
    scope: "world",
    group: "longrest",
    customSettingsDialog: true,
    customFormula: CONSTANTS.SETTINGS.LONG_RESOURCES_MULTIPLIER_FORMULA,
    config: false,
    type: String,
    choices: {
      [CONSTANTS.FRACTIONS.NONE]: "REST-RECOVERY.Fractions.None",
      [CONSTANTS.FRACTIONS.QUARTER]: "REST-RECOVERY.Fractions.Quarter",
      [CONSTANTS.FRACTIONS.HALF]: "REST-RECOVERY.Fractions.Half",
      [CONSTANTS.FRACTIONS.FULL]: "REST-RECOVERY.Fractions.Full",
      [CONSTANTS.FRACTIONS.CUSTOM]: "REST-RECOVERY.Fractions.Custom"
    },
    default: CONSTANTS.FRACTIONS.FULL
  },
  [CONSTANTS.SETTINGS.LONG_RESOURCES_MULTIPLIER_FORMULA]: {
    scope: "world",
    group: "longrest",
    config: false,
    hidden: true,
    type: String,
    default: "@resource.max"
  },
  [CONSTANTS.SETTINGS.LONG_SPELLS_MULTIPLIER]: {
    name: "REST-RECOVERY.Settings.LongRest.SpellSlotsRecoveryFraction.Title",
    hint: "REST-RECOVERY.Settings.LongRest.SpellSlotsRecoveryFraction.Hint",
    scope: "world",
    group: "longrest",
    customSettingsDialog: true,
    customFormula: CONSTANTS.SETTINGS.LONG_SPELLS_MULTIPLIER_FORMULA,
    config: false,
    type: String,
    choices: {
      [CONSTANTS.FRACTIONS.NONE]: "REST-RECOVERY.Fractions.None",
      [CONSTANTS.FRACTIONS.QUARTER]: "REST-RECOVERY.Fractions.Quarter",
      [CONSTANTS.FRACTIONS.HALF]: "REST-RECOVERY.Fractions.Half",
      [CONSTANTS.FRACTIONS.FULL]: "REST-RECOVERY.Fractions.Full",
      [CONSTANTS.FRACTIONS.CUSTOM]: "REST-RECOVERY.Fractions.Custom"
    },
    default: CONSTANTS.FRACTIONS.FULL
  },
  [CONSTANTS.SETTINGS.LONG_SPELLS_MULTIPLIER_FORMULA]: {
    scope: "world",
    group: "longrest",
    config: false,
    hidden: true,
    type: String,
    default: "@slot.max"
  },
  [CONSTANTS.SETTINGS.LONG_CUSTOM_SPELL_RECOVERY]: {
    name: "REST-RECOVERY.Settings.LongRest.CustomSpellSlotRecovery.Title",
    hint: "REST-RECOVERY.Settings.LongRest.CustomSpellSlotRecovery.Hint",
    dependsOn: [CONSTANTS.SETTINGS.LONG_SPELLS_MULTIPLIER],
    validate: (settings) => {
      return settings.get(CONSTANTS.SETTINGS.LONG_SPELLS_MULTIPLIER).value !== CONSTANTS.FRACTIONS.CUSTOM;
    },
    callback: (settings) => {
      const setting = settings.get(CONSTANTS.SETTINGS.LONG_SPELLS_MULTIPLIER_FORMULA);
      if (setting.value === "@slot.max") {
        setting.store.set("ceil(min(17, @details.level+1)/2)*2");
      }
    },
    scope: "world",
    group: "longrest",
    customSettingsDialog: true,
    nonDefaultSetting: true,
    config: false,
    default: false,
    type: Boolean
  },
  [CONSTANTS.SETTINGS.LONG_PACT_SPELLS_MULTIPLIER]: {
    name: "REST-RECOVERY.Settings.LongRest.PactSpellSlotsLongRecoveryFraction.Title",
    hint: "REST-RECOVERY.Settings.LongRest.PactSpellSlotsLongRecoveryFraction.Hint",
    scope: "world",
    group: "longrest",
    customSettingsDialog: true,
    customFormula: CONSTANTS.SETTINGS.LONG_PACT_SPELLS_MULTIPLIER_FORMULA,
    config: false,
    type: String,
    choices: {
      [CONSTANTS.FRACTIONS.NONE]: "REST-RECOVERY.Fractions.None",
      [CONSTANTS.FRACTIONS.QUARTER]: "REST-RECOVERY.Fractions.Quarter",
      [CONSTANTS.FRACTIONS.HALF]: "REST-RECOVERY.Fractions.Half",
      [CONSTANTS.FRACTIONS.FULL]: "REST-RECOVERY.Fractions.Full",
      [CONSTANTS.FRACTIONS.CUSTOM]: "REST-RECOVERY.Fractions.Custom"
    },
    default: CONSTANTS.FRACTIONS.FULL
  },
  [CONSTANTS.SETTINGS.LONG_PACT_SPELLS_MULTIPLIER_FORMULA]: {
    scope: "world",
    group: "longrest",
    config: false,
    hidden: true,
    type: String,
    default: "@slot.max"
  },
  [CONSTANTS.SETTINGS.LONG_USES_OTHERS_MULTIPLIER]: {
    name: "REST-RECOVERY.Settings.LongRest.ItemUsesRecoveryFraction.Title",
    hint: "REST-RECOVERY.Settings.LongRest.ItemUsesRecoveryFraction.Hint",
    scope: "world",
    group: "longrest",
    customSettingsDialog: true,
    customFormula: CONSTANTS.SETTINGS.LONG_USES_OTHERS_MULTIPLIER_FORMULA,
    config: false,
    type: String,
    choices: {
      [CONSTANTS.FRACTIONS.NONE]: "REST-RECOVERY.Fractions.None",
      [CONSTANTS.FRACTIONS.QUARTER]: "REST-RECOVERY.Fractions.Quarter",
      [CONSTANTS.FRACTIONS.HALF]: "REST-RECOVERY.Fractions.Half",
      [CONSTANTS.FRACTIONS.FULL]: "REST-RECOVERY.Fractions.Full",
      [CONSTANTS.FRACTIONS.CUSTOM]: "REST-RECOVERY.Fractions.Custom"
    },
    default: CONSTANTS.FRACTIONS.FULL
  },
  [CONSTANTS.SETTINGS.LONG_USES_OTHERS_MULTIPLIER_FORMULA]: {
    scope: "world",
    group: "longrest",
    config: false,
    hidden: true,
    type: String,
    default: "@uses.max"
  },
  [CONSTANTS.SETTINGS.LONG_USES_FEATS_MULTIPLIER]: {
    name: "REST-RECOVERY.Settings.LongRest.FeatUsesRecoveryFraction.Title",
    hint: "REST-RECOVERY.Settings.LongRest.FeatUsesRecoveryFraction.Hint",
    scope: "world",
    group: "longrest",
    customSettingsDialog: true,
    customFormula: CONSTANTS.SETTINGS.LONG_USES_FEATS_MULTIPLIER_FORMULA,
    config: false,
    type: String,
    choices: {
      [CONSTANTS.FRACTIONS.NONE]: "REST-RECOVERY.Fractions.None",
      [CONSTANTS.FRACTIONS.QUARTER]: "REST-RECOVERY.Fractions.Quarter",
      [CONSTANTS.FRACTIONS.HALF]: "REST-RECOVERY.Fractions.Half",
      [CONSTANTS.FRACTIONS.FULL]: "REST-RECOVERY.Fractions.Full",
      [CONSTANTS.FRACTIONS.CUSTOM]: "REST-RECOVERY.Fractions.Custom"
    },
    default: CONSTANTS.FRACTIONS.FULL
  },
  [CONSTANTS.SETTINGS.LONG_USES_FEATS_MULTIPLIER_FORMULA]: {
    scope: "world",
    group: "longrest",
    config: false,
    hidden: true,
    type: String,
    default: "@uses.max"
  },
  [CONSTANTS.SETTINGS.LONG_USES_DAILY_MULTIPLIER]: {
    name: "REST-RECOVERY.Settings.LongRest.DailyUsesRecoveryFraction.Title",
    hint: "REST-RECOVERY.Settings.LongRest.DailyUsesRecoveryFraction.Hint",
    scope: "world",
    group: "longrest",
    customSettingsDialog: true,
    customFormula: CONSTANTS.SETTINGS.LONG_USES_DAILY_MULTIPLIER_FORMULA,
    config: false,
    type: String,
    choices: {
      [CONSTANTS.FRACTIONS.NONE]: "REST-RECOVERY.Fractions.None",
      [CONSTANTS.FRACTIONS.QUARTER]: "REST-RECOVERY.Fractions.Quarter",
      [CONSTANTS.FRACTIONS.HALF]: "REST-RECOVERY.Fractions.Half",
      [CONSTANTS.FRACTIONS.FULL]: "REST-RECOVERY.Fractions.Full",
      [CONSTANTS.FRACTIONS.CUSTOM]: "REST-RECOVERY.Fractions.Custom"
    },
    default: CONSTANTS.FRACTIONS.FULL
  },
  [CONSTANTS.SETTINGS.LONG_USES_DAILY_MULTIPLIER_FORMULA]: {
    scope: "world",
    group: "longrest",
    config: false,
    hidden: true,
    type: String,
    default: "@uses.max"
  },
  [CONSTANTS.SETTINGS.LONG_REST_ARMOR_AUTOMATION]: {
    name: "REST-RECOVERY.Settings.LongRest.AutomateArmor.Title",
    hint: "REST-RECOVERY.Settings.LongRest.AutomateArmor.Hint",
    scope: "world",
    group: "longrest",
    customSettingsDialog: true,
    nonDefaultSetting: true,
    config: false,
    default: false,
    type: Boolean
  },
  [CONSTANTS.SETTINGS.LONG_REST_ARMOR_HIT_DICE]: {
    name: "REST-RECOVERY.Settings.LongRest.ArmorHitDiceRecoveryFraction.Title",
    hint: "REST-RECOVERY.Settings.LongRest.ArmorHitDiceRecoveryFraction.Hint",
    dependsOn: [CONSTANTS.SETTINGS.LONG_REST_ARMOR_AUTOMATION],
    validate: (settings) => {
      return !settings.get(CONSTANTS.SETTINGS.LONG_REST_ARMOR_AUTOMATION).value;
    },
    scope: "world",
    group: "longrest",
    customSettingsDialog: true,
    nonDefaultSetting: true,
    customFormula: CONSTANTS.SETTINGS.LONG_REST_ARMOR_HIT_DICE_FORMULA,
    config: false,
    type: String,
    choices: {
      [CONSTANTS.FRACTIONS.NONE]: "REST-RECOVERY.Fractions.None",
      [CONSTANTS.FRACTIONS.QUARTER]: "REST-RECOVERY.Fractions.Quarter",
      [CONSTANTS.FRACTIONS.HALF]: "REST-RECOVERY.Fractions.Half",
      [CONSTANTS.FRACTIONS.FULL]: "REST-RECOVERY.Fractions.Full",
      [CONSTANTS.FRACTIONS.CUSTOM]: "REST-RECOVERY.Fractions.Custom"
    },
    default: CONSTANTS.FRACTIONS.QUARTER
  },
  [CONSTANTS.SETTINGS.LONG_REST_ARMOR_HIT_DICE_FORMULA]: {
    scope: "world",
    group: "longrest",
    config: false,
    hidden: true,
    type: String,
    default: "@details.level / 4"
  },
  [CONSTANTS.SETTINGS.LONG_REST_ARMOR_EXHAUSTION]: {
    name: "REST-RECOVERY.Settings.LongRest.AutomateArmorExhaustion.Title",
    hint: "REST-RECOVERY.Settings.LongRest.AutomateArmorExhaustion.Hint",
    dependsOn: [CONSTANTS.SETTINGS.AUTOMATE_EXHAUSTION, CONSTANTS.SETTINGS.LONG_REST_ARMOR_AUTOMATION],
    validate: (settings) => {
      return !settings.get(CONSTANTS.SETTINGS.AUTOMATE_EXHAUSTION).value || !settings.get(CONSTANTS.SETTINGS.LONG_REST_ARMOR_AUTOMATION).value;
    },
    scope: "world",
    group: "longrest",
    customSettingsDialog: true,
    nonDefaultSetting: true,
    config: false,
    default: false,
    type: Boolean
  },
  [CONSTANTS.SETTINGS.WIZARD_CLASS]: {
    name: "REST-RECOVERY.Settings.ItemNames.WizardClassName.Title",
    hint: "REST-RECOVERY.Settings.ItemNames.WizardClassName.Hint",
    scope: "world",
    group: "itemnames",
    config: false,
    localize: true,
    default: "REST-RECOVERY.ClassNames.Wizard",
    type: String
  },
  [CONSTANTS.SETTINGS.DRUID_CLASS]: {
    name: "REST-RECOVERY.Settings.ItemNames.DruidClassName.Title",
    hint: "REST-RECOVERY.Settings.ItemNames.DruidClassName.Hint",
    scope: "world",
    group: "itemnames",
    config: false,
    localize: true,
    default: "REST-RECOVERY.ClassNames.Druid",
    type: String
  },
  [CONSTANTS.SETTINGS.BARD_CLASS]: {
    name: "REST-RECOVERY.Settings.ItemNames.BardClassName.Title",
    hint: "REST-RECOVERY.Settings.ItemNames.BardClassName.Hint",
    scope: "world",
    group: "itemnames",
    config: false,
    localize: true,
    default: "REST-RECOVERY.ClassNames.Bard",
    type: String
  },
  [CONSTANTS.SETTINGS.ARCANE_RECOVERY]: {
    name: "REST-RECOVERY.Settings.ItemNames.ArcaneRecovery.Title",
    hint: "REST-RECOVERY.Settings.ItemNames.ArcaneRecovery.Hint",
    scope: "world",
    group: "itemnames",
    config: false,
    localize: true,
    default: "REST-RECOVERY.FeatureNames.ArcaneRecovery",
    type: String
  },
  [CONSTANTS.SETTINGS.POWER_SURGE]: {
    name: "REST-RECOVERY.Settings.ItemNames.PowerSurge.Title",
    hint: "REST-RECOVERY.Settings.ItemNames.PowerSurge.Hint",
    scope: "world",
    group: "itemnames",
    config: false,
    localize: true,
    default: "REST-RECOVERY.FeatureNames.PowerSurge",
    type: String
  },
  [CONSTANTS.SETTINGS.NATURAL_RECOVERY]: {
    name: "REST-RECOVERY.Settings.ItemNames.NaturalRecovery.Title",
    hint: "REST-RECOVERY.Settings.ItemNames.NaturalRecovery.Hint",
    scope: "world",
    group: "itemnames",
    config: false,
    localize: true,
    default: "REST-RECOVERY.FeatureNames.NaturalRecovery",
    type: String
  },
  [CONSTANTS.SETTINGS.SONG_OF_REST]: {
    name: "REST-RECOVERY.Settings.ItemNames.SongOfRest.Title",
    hint: "REST-RECOVERY.Settings.ItemNames.SongOfRest.Hint",
    scope: "world",
    group: "itemnames",
    config: false,
    localize: true,
    default: "REST-RECOVERY.FeatureNames.SongOfRest",
    type: String
  },
  [CONSTANTS.SETTINGS.CHEF_FEAT]: {
    name: "REST-RECOVERY.Settings.ItemNames.ChefFeat.Title",
    hint: "REST-RECOVERY.Settings.ItemNames.ChefFeat.Hint",
    scope: "world",
    group: "itemnames",
    config: false,
    localize: true,
    default: "REST-RECOVERY.FeatureNames.ChefFeat",
    type: String
  },
  [CONSTANTS.SETTINGS.CHEF_TOOLS]: {
    name: "REST-RECOVERY.Settings.ItemNames.ChefTools.Title",
    hint: "REST-RECOVERY.Settings.ItemNames.ChefTools.Hint",
    scope: "world",
    group: "itemnames",
    config: false,
    localize: true,
    default: "REST-RECOVERY.FeatureNames.ChefTools",
    type: String
  },
  [CONSTANTS.SETTINGS.DURABLE_FEAT]: {
    name: "REST-RECOVERY.Settings.ItemNames.DurableFeat.Title",
    hint: "REST-RECOVERY.Settings.ItemNames.DurableFeat.Hint",
    scope: "world",
    group: "itemnames",
    config: false,
    localize: true,
    default: "REST-RECOVERY.FeatureNames.DurableFeat",
    type: String
  },
  [CONSTANTS.SETTINGS.PERIAPT_ITEM]: {
    name: "REST-RECOVERY.Settings.ItemNames.PeriaptItem.Title",
    hint: "REST-RECOVERY.Settings.ItemNames.PeriaptItem.Hint",
    scope: "world",
    group: "itemnames",
    config: false,
    localize: true,
    default: "REST-RECOVERY.FeatureNames.PeriaptItem",
    type: String
  },
  [CONSTANTS.SETTINGS.WOUND_CLOSURE_BLESSING]: {
    name: "REST-RECOVERY.Settings.ItemNames.WoundClosureBlessing.Title",
    hint: "REST-RECOVERY.Settings.ItemNames.WoundClosureBlessing.Hint",
    scope: "world",
    group: "itemnames",
    config: false,
    localize: true,
    default: "REST-RECOVERY.FeatureNames.WoundClosureBlessing",
    type: String
  },
  [CONSTANTS.SETTINGS.BLACK_BLOOD_FEATURE]: {
    name: "REST-RECOVERY.Settings.ItemNames.BlackBloodFeature.Title",
    hint: "REST-RECOVERY.Settings.ItemNames.BlackBloodFeature.Hint",
    scope: "world",
    group: "itemnames",
    config: false,
    localize: true,
    default: "REST-RECOVERY.FeatureNames.BlackBloodFeature",
    type: String
  },
  [CONSTANTS.SETTINGS.ENABLE_FOOD_AND_WATER]: {
    name: "REST-RECOVERY.Settings.FoodAndWater.EnableFoodAndWater.Title",
    hint: "REST-RECOVERY.Settings.FoodAndWater.EnableFoodAndWater.Hint",
    scope: "world",
    group: "foodandwater",
    customSettingsDialog: true,
    config: false,
    default: false,
    type: Boolean
  },
  [CONSTANTS.SETTINGS.FOOD_UNITS_PER_DAY]: {
    name: "REST-RECOVERY.Settings.FoodAndWater.FoodUnitsPerDay.Title",
    hint: "REST-RECOVERY.Settings.FoodAndWater.FoodUnitsPerDay.Hint",
    scope: "world",
    group: "foodandwater",
    customSettingsDialog: true,
    dependsOn: [CONSTANTS.SETTINGS.ENABLE_FOOD_AND_WATER],
    validate: (settings) => {
      return !settings.get(CONSTANTS.SETTINGS.ENABLE_FOOD_AND_WATER).value;
    },
    config: false,
    default: 1,
    type: Number
  },
  [CONSTANTS.SETTINGS.WATER_UNITS_PER_DAY]: {
    name: "REST-RECOVERY.Settings.FoodAndWater.WaterUnitsPerDay.Title",
    hint: "REST-RECOVERY.Settings.FoodAndWater.WaterUnitsPerDay.Hint",
    scope: "world",
    group: "foodandwater",
    customSettingsDialog: true,
    dependsOn: [CONSTANTS.SETTINGS.ENABLE_FOOD_AND_WATER],
    validate: (settings) => {
      return !settings.get(CONSTANTS.SETTINGS.ENABLE_FOOD_AND_WATER).value;
    },
    config: false,
    default: 1,
    type: Number
  },
  [CONSTANTS.SETTINGS.EXTERNAL_FOOD_ACCESS]: {
    name: "REST-RECOVERY.Settings.FoodAndWater.ExternalFoodAccess.Title",
    hint: "REST-RECOVERY.Settings.FoodAndWater.ExternalFoodAccess.Hint",
    scope: "world",
    group: "foodandwater",
    customSettingsDialog: true,
    config: false,
    dependsOn: [CONSTANTS.SETTINGS.ENABLE_FOOD_AND_WATER],
    validate: (settings) => {
      return !settings.get(CONSTANTS.SETTINGS.ENABLE_FOOD_AND_WATER).value;
    },
    choices: {
      [CONSTANTS.FRACTIONS.FULL]: "REST-RECOVERY.Fractions.Full",
      [CONSTANTS.FRACTIONS.HALF]: "REST-RECOVERY.Fractions.Half",
      [CONSTANTS.FRACTIONS.NONE]: "REST-RECOVERY.Fractions.None"
    },
    default: "full",
    type: String
  },
  [CONSTANTS.SETTINGS.EXTERNAL_WATER_ACCESS]: {
    name: "REST-RECOVERY.Settings.FoodAndWater.ExternalWaterAccess.Title",
    hint: "REST-RECOVERY.Settings.FoodAndWater.ExternalWaterAccess.Hint",
    scope: "world",
    group: "foodandwater",
    customSettingsDialog: true,
    config: false,
    dependsOn: [CONSTANTS.SETTINGS.ENABLE_FOOD_AND_WATER],
    validate: (settings) => {
      return !settings.get(CONSTANTS.SETTINGS.ENABLE_FOOD_AND_WATER).value;
    },
    choices: {
      [CONSTANTS.FRACTIONS.FULL]: "REST-RECOVERY.Fractions.Full",
      [CONSTANTS.FRACTIONS.HALF]: "REST-RECOVERY.Fractions.Half",
      [CONSTANTS.FRACTIONS.NONE]: "REST-RECOVERY.Fractions.None"
    },
    default: "full",
    type: String
  },
  [CONSTANTS.SETTINGS.AUTOMATE_FOODWATER_EXHAUSTION]: {
    name: "REST-RECOVERY.Settings.FoodAndWater.AutomateFoodWaterExhaustion.Title",
    hint: "REST-RECOVERY.Settings.FoodAndWater.AutomateFoodWaterExhaustion.Hint",
    scope: "world",
    group: "foodandwater",
    dependsOn: [CONSTANTS.SETTINGS.AUTOMATE_EXHAUSTION, CONSTANTS.SETTINGS.ENABLE_FOOD_AND_WATER],
    validate: (settings) => {
      return !settings.get(CONSTANTS.SETTINGS.AUTOMATE_EXHAUSTION).value || !settings.get(CONSTANTS.SETTINGS.ENABLE_FOOD_AND_WATER).value;
    },
    config: false,
    default: false,
    type: Boolean
  },
  [CONSTANTS.SETTINGS.NO_FOOD_DURATION_MODIFIER]: {
    name: "REST-RECOVERY.Settings.FoodAndWater.NoFoodDuration.Title",
    hint: "REST-RECOVERY.Settings.FoodAndWater.NoFoodDuration.Hint",
    scope: "world",
    group: "foodandwater",
    dependsOn: [CONSTANTS.SETTINGS.AUTOMATE_FOODWATER_EXHAUSTION],
    validate: (settings) => {
      return !settings.get(CONSTANTS.SETTINGS.AUTOMATE_FOODWATER_EXHAUSTION).value;
    },
    config: false,
    default: "3+max(1,@abilities.con.mod)",
    type: String
  },
  [CONSTANTS.SETTINGS.HALF_WATER_SAVE_DC]: {
    name: "REST-RECOVERY.Settings.FoodAndWater.HalfWaterSaveDC.Title",
    hint: "REST-RECOVERY.Settings.FoodAndWater.HalfWaterSaveDC.Hint",
    scope: "world",
    group: "foodandwater",
    dependsOn: [CONSTANTS.SETTINGS.AUTOMATE_FOODWATER_EXHAUSTION],
    validate: (settings) => {
      return !settings.get(CONSTANTS.SETTINGS.AUTOMATE_FOODWATER_EXHAUSTION).value;
    },
    config: false,
    default: 15,
    type: Number
  }
};
const baseFlag = `flags.${CONSTANTS.MODULE_NAME}.${CONSTANTS.FLAG_NAME}.`;
CONSTANTS.FLAGS = {};
CONSTANTS.FLAGS.RESOURCES = baseFlag + "resources";
CONSTANTS.FLAGS.RECOVERY = baseFlag + "recovery";
CONSTANTS.FLAGS.RECOVERY_ENABLED = CONSTANTS.FLAGS.RECOVERY + ".enabled";
CONSTANTS.FLAGS.RECOVERY_FORMULA = CONSTANTS.FLAGS.RECOVERY + ".custom_formula";
CONSTANTS.FLAGS.CONSUMABLE = baseFlag + "consumable";
CONSTANTS.FLAGS.CONSUMABLE_ENABLED = CONSTANTS.FLAGS.CONSUMABLE + ".enabled";
CONSTANTS.FLAGS.CONSUMABLE_TYPE = CONSTANTS.FLAGS.CONSUMABLE + ".type";
CONSTANTS.FLAGS.CONSUMABLE_DAY_WORTH = CONSTANTS.FLAGS.CONSUMABLE + ".dayWorth";
CONSTANTS.FLAGS.CONSUMABLE_TYPE_FOOD = "food";
CONSTANTS.FLAGS.CONSUMABLE_TYPE_WATER = "water";
CONSTANTS.FLAGS.CONSUMABLE_TYPE_BOTH = "both";
CONSTANTS.FLAGS.STARVATION = baseFlag + "starvation";
CONSTANTS.FLAGS.SATED_FOOD = baseFlag + "sated.food";
CONSTANTS.FLAGS.SATED_WATER = baseFlag + "sated.water";
CONSTANTS.FLAGS.CURRENT_NUM_SHORT_RESTS = baseFlag + "currentShortRests";
CONSTANTS.FLAGS.HIT_DICE_BUFFER_FLAG = baseFlag + `hitDiceBuffer`;
CONSTANTS.FLAGS.REMOVE_HIT_DICE_BUFFER_FLAG = baseFlag + `-=hitDiceBuffer`;
const daeFlag = `flags.dae.${CONSTANTS.MODULE_NAME}.`;
CONSTANTS.FLAGS.DAE = {};
CONSTANTS.FLAGS.DAE.PREVENT = daeFlag + "prevent.";
CONSTANTS.FLAGS.DAE.PREVENT_LONG_REST = CONSTANTS.FLAGS.DAE.PREVENT + "longRest";
CONSTANTS.FLAGS.DAE.PREVENT_SHORT_REST = CONSTANTS.FLAGS.DAE.PREVENT + "shortRest";
CONSTANTS.FLAGS.DAE.NEEDS_NO_FOOD = daeFlag + "force.noFood";
CONSTANTS.FLAGS.DAE.NEEDS_NO_WATER = daeFlag + "force.noWater";
CONSTANTS.FLAGS.DAE.REQUIRED_FOOD = daeFlag + "require.food";
CONSTANTS.FLAGS.DAE.REQUIRED_WATER = daeFlag + "require.water";
CONSTANTS.FLAGS.DAE.MAXIMISE_HIT_DIE_ROLL = daeFlag + "force.maximiseHitDieRoll";
const dndFlag = `flags.dnd5e.`;
CONSTANTS.FLAGS.DND = {};
CONSTANTS.FLAGS.DND.NEEDS_NO_FOOD_AND_WATER = dndFlag + "noFoodWater";
CONSTANTS.FLAGS.DND.REQUIRED_FOOD = dndFlag + "foodUnits";
CONSTANTS.FLAGS.DND.REQUIRED_WATER = dndFlag + "waterUnits";
CONSTANTS.CONSUMABLE = {
  NONE: "none",
  REGULAR: "regular"
};
CONSTANTS.PATH = `modules/${CONSTANTS.MODULE_NAME}/`;
function custom_warning(message, console2 = true) {
  ui.notifications.warn("Rest Recovery | " + game.i18n.localize(message), { console: console2 });
}
__name(custom_warning, "custom_warning");
function ordinalSuffixOf(i) {
  let j = i % 10;
  let k = i % 100;
  if (j === 1 && k !== 11) {
    return game.i18n.localize(`REST-RECOVERY.NumberToText.${i + "st"}`);
  } else if (j === 2 && k !== 12) {
    return game.i18n.localize(`REST-RECOVERY.NumberToText.${i + "nd"}`);
  } else if (j === 3 && k !== 13) {
    return game.i18n.localize(`REST-RECOVERY.NumberToText.${i + "rd"}`);
  }
  return game.i18n.localize(`REST-RECOVERY.NumberToText.${i + "th"}`);
}
__name(ordinalSuffixOf, "ordinalSuffixOf");
function determineMultiplier(settingKey) {
  const multiplierSetting = getSetting(settingKey);
  switch (multiplierSetting) {
    case CONSTANTS.FRACTIONS.NONE:
      return 0;
    case CONSTANTS.FRACTIONS.QUARTER:
      return 0.25;
    case CONSTANTS.FRACTIONS.HALF:
      return 0.5;
    case CONSTANTS.FRACTIONS.FULL:
      return 1;
    case CONSTANTS.FRACTIONS.CUSTOM:
      return getSetting(CONSTANTS.DEFAULT_SETTINGS[settingKey].customFormula);
    default:
      throw new Error(`Unable to parse recovery multiplier setting for "${settingKey}".`);
  }
}
__name(determineMultiplier, "determineMultiplier");
function determineRoundingMethod(settingKey) {
  const rounding = getSetting(settingKey);
  switch (rounding) {
    case "down":
      return Math.floor;
    case "up":
      return Math.ceil;
    case "round":
      return Math.round;
    default:
      throw new Error(`Unable to parse rounding setting for "${settingKey}".`);
  }
}
__name(determineRoundingMethod, "determineRoundingMethod");
function getSetting(key, localize2 = false) {
  if (!localize2) {
    const setting = CONSTANTS.DEFAULT_SETTINGS[key];
    if (setting?.moduleIntegration && !game.modules.get(setting.moduleIntegration.key)?.active) {
      return setting.default;
    }
  }
  const value = game.settings.get(CONSTANTS.MODULE_NAME, key);
  if (localize2)
    return game.i18n.localize(value);
  return value;
}
__name(getSetting, "getSetting");
function setSetting(key, value) {
  return game.settings.set(CONSTANTS.MODULE_NAME, key, value);
}
__name(setSetting, "setSetting");
function evaluateFormula(formula, data, warn = true) {
  const rollFormula = Roll.replaceFormulaData(formula, data, { warn });
  return new Roll(rollFormula).evaluate({ async: false });
}
__name(evaluateFormula, "evaluateFormula");
function getConsumableItemsFromActor(actor) {
  return actor.items.map((item) => {
    const consumableUses = getConsumableItemDayUses(item);
    if (!consumableUses > 0)
      return false;
    const consumableData = getProperty(item, CONSTANTS.FLAGS.CONSUMABLE);
    return {
      id: item.id,
      name: item.name + " (" + game.i18n.localize("REST-RECOVERY.Misc." + capitalizeFirstLetter(consumableData.type)) + ")"
    };
  }).filter(Boolean);
}
__name(getConsumableItemsFromActor, "getConsumableItemsFromActor");
function getConsumableItemDayUses(item) {
  const consumableData = getProperty(item, CONSTANTS.FLAGS.CONSUMABLE);
  if (!consumableData?.enabled)
    return 0;
  return getProperty(item, "system.uses.value") ?? 1;
}
__name(getConsumableItemDayUses, "getConsumableItemDayUses");
function isRealNumber(inNumber) {
  return !isNaN(inNumber) && typeof inNumber === "number" && isFinite(inNumber);
}
__name(isRealNumber, "isRealNumber");
function getActorConsumableValues(actor, grittyLongRest) {
  const actorFoodSatedValue = getProperty(actor, CONSTANTS.FLAGS.SATED_FOOD) ?? 0;
  const actorWaterSatedValue = getProperty(actor, CONSTANTS.FLAGS.SATED_WATER) ?? 0;
  const actorNeedsNoFoodWater = getProperty(actor, CONSTANTS.FLAGS.DND.NEEDS_NO_FOOD_AND_WATER);
  const actorNeedsNoFood = getProperty(actor, CONSTANTS.FLAGS.DAE.NEEDS_NO_FOOD);
  const actorNeedsNoWater = getProperty(actor, CONSTANTS.FLAGS.DAE.NEEDS_NO_WATER);
  const foodUnitsSetting = getSetting(CONSTANTS.SETTINGS.FOOD_UNITS_PER_DAY);
  const actorRequiredFoodUnits = getProperty(actor, CONSTANTS.FLAGS.DAE.REQUIRED_FOOD) ?? getProperty(actor, CONSTANTS.FLAGS.DND.REQUIRED_FOOD);
  let actorRequiredFood = isRealNumber(actorRequiredFoodUnits) && foodUnitsSetting !== 0 ? actorRequiredFoodUnits : foodUnitsSetting;
  const waterUnitsSetting = getSetting(CONSTANTS.SETTINGS.WATER_UNITS_PER_DAY);
  const actorRequiredWaterUnits = getProperty(actor, CONSTANTS.FLAGS.DAE.REQUIRED_WATER) ?? getProperty(actor, CONSTANTS.FLAGS.DND.REQUIRED_WATER);
  let actorRequiredWater = isRealNumber(actorRequiredWaterUnits) && waterUnitsSetting !== 0 ? actorRequiredWaterUnits : waterUnitsSetting;
  actorRequiredFood *= grittyLongRest ? 7 : 1;
  actorRequiredWater *= grittyLongRest ? 7 : 1;
  actorRequiredFood = actorNeedsNoFoodWater || actorNeedsNoFood ? 0 : actorRequiredFood;
  actorRequiredWater = actorNeedsNoFoodWater || actorNeedsNoWater ? 0 : actorRequiredWater;
  return {
    actorRequiredFood,
    actorRequiredWater,
    actorFoodSatedValue,
    actorWaterSatedValue
  };
}
__name(getActorConsumableValues, "getActorConsumableValues");
function capitalizeFirstLetter(str) {
  return str.slice(0, 1).toUpperCase() + str.slice(1);
}
__name(capitalizeFirstLetter, "capitalizeFirstLetter");
function roundHalf(num) {
  return Math.round(num * 2) / 2;
}
__name(roundHalf, "roundHalf");
function getTimeChanges(isLongRest) {
  const simpleCalendarActive = getSetting(CONSTANTS.SETTINGS.ENABLE_SIMPLE_CALENDAR_INTEGRATION);
  const timeConfig = simpleCalendarActive ? SimpleCalendar.api.getTimeConfiguration() : { hoursInDay: 24, minutesInHour: 60, secondsInMinute: 60 };
  timeConfig.secondsInDay = timeConfig.hoursInDay * timeConfig.minutesInHour * timeConfig.secondsInMinute;
  const hourInSeconds = timeConfig.minutesInHour * timeConfig.secondsInMinute;
  const { hour, minute, seconds } = simpleCalendarActive ? SimpleCalendar.api.currentDateTime() : {
    hour: 0,
    minute: 0,
    seconds: 0
  };
  const currentTime = hour * hourInSeconds + minute * timeConfig.secondsInMinute + seconds;
  let restTime;
  const restVariant = game.settings.get("dnd5e", "restVariant");
  switch (restVariant) {
    case "epic":
      restTime = isLongRest ? hourInSeconds : timeConfig.secondsInMinute;
      break;
    case "gritty":
      restTime = isLongRest ? timeConfig.hoursInDay * hourInSeconds * 7 : hourInSeconds * 8;
      break;
    default:
      restTime = isLongRest ? hourInSeconds * 8 : hourInSeconds;
      break;
  }
  return {
    restTime,
    isNewDay: simpleCalendarActive ? currentTime + restTime >= timeConfig.secondsInDay : restVariant === "gritty" || restVariant !== "epic" && isLongRest
  };
}
__name(getTimeChanges, "getTimeChanges");
function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
__name(wait, "wait");
function get_each_context$9(ctx, list, i) {
  const child_ctx = ctx.slice();
  child_ctx[13] = list[i][0];
  child_ctx[14] = list[i][1];
  child_ctx[16] = i;
  return child_ctx;
}
__name(get_each_context$9, "get_each_context$9");
function create_each_block$9(key_1, ctx) {
  let option;
  let t0_value = ctx[13] + "";
  let t0;
  let t1;
  let t2_value = ctx[14] + "";
  let t2;
  let t3;
  let t4_value = localize("DND5E.available") + "";
  let t4;
  let t5;
  let option_value_value;
  return {
    key: key_1,
    first: null,
    c() {
      option = element("option");
      t0 = text(t0_value);
      t1 = text(" (");
      t2 = text(t2_value);
      t3 = space();
      t4 = text(t4_value);
      t5 = text(")");
      option.__value = option_value_value = ctx[13];
      option.value = option.__value;
      this.first = option;
    },
    m(target, anchor) {
      insert(target, option, anchor);
      append(option, t0);
      append(option, t1);
      append(option, t2);
      append(option, t3);
      append(option, t4);
      append(option, t5);
    },
    p(new_ctx, dirty) {
      ctx = new_ctx;
      if (dirty & 2 && t0_value !== (t0_value = ctx[13] + ""))
        set_data(t0, t0_value);
      if (dirty & 2 && t2_value !== (t2_value = ctx[14] + ""))
        set_data(t2, t2_value);
      if (dirty & 2 && option_value_value !== (option_value_value = ctx[13])) {
        option.__value = option_value_value;
        option.value = option.__value;
      }
    },
    d(detaching) {
      if (detaching)
        detach(option);
    }
  };
}
__name(create_each_block$9, "create_each_block$9");
function create_if_block_1$8(ctx) {
  let button;
  let i;
  let t0;
  let t1_value = localize("REST-RECOVERY.Dialogs.ShortRest.AutoRoll") + "";
  let t1;
  let button_disabled_value;
  let mounted;
  let dispose;
  return {
    c() {
      button = element("button");
      i = element("i");
      t0 = space();
      t1 = text(t1_value);
      attr(i, "class", "fas fa-redo");
      attr(button, "type", "button");
      button.disabled = button_disabled_value = ctx[4] || !ctx[5];
    },
    m(target, anchor) {
      insert(target, button, anchor);
      append(button, i);
      append(button, t0);
      append(button, t1);
      if (!mounted) {
        dispose = listen(button, "click", ctx[12]);
        mounted = true;
      }
    },
    p(ctx2, dirty) {
      if (dirty & 48 && button_disabled_value !== (button_disabled_value = ctx2[4] || !ctx2[5])) {
        button.disabled = button_disabled_value;
      }
    },
    d(detaching) {
      if (detaching)
        detach(button);
      mounted = false;
      dispose();
    }
  };
}
__name(create_if_block_1$8, "create_if_block_1$8");
function create_if_block$a(ctx) {
  let p;
  return {
    c() {
      p = element("p");
      p.textContent = `${localize("DND5E.ShortRestNoHD")}`;
      attr(p, "class", "notes");
    },
    m(target, anchor) {
      insert(target, p, anchor);
    },
    p: noop,
    d(detaching) {
      if (detaching)
        detach(p);
    }
  };
}
__name(create_if_block$a, "create_if_block$a");
function create_fragment$d(ctx) {
  let div3;
  let div2;
  let div0;
  let label;
  let t1;
  let div1;
  let select;
  let each_blocks = [];
  let each_1_lookup = /* @__PURE__ */ new Map();
  let t2;
  let button;
  let i;
  let t3;
  let t4_value = localize("DND5E.Roll") + "";
  let t4;
  let button_disabled_value;
  let t5;
  let t6;
  let mounted;
  let dispose;
  let each_value = Object.entries(ctx[1].availableHitDice);
  const get_key = /* @__PURE__ */ __name((ctx2) => ctx2[16], "get_key");
  for (let i2 = 0; i2 < each_value.length; i2 += 1) {
    let child_ctx = get_each_context$9(ctx, each_value, i2);
    let key = get_key(child_ctx);
    each_1_lookup.set(key, each_blocks[i2] = create_each_block$9(key, child_ctx));
  }
  let if_block0 = ctx[6] && create_if_block_1$8(ctx);
  let if_block1 = ctx[1].totalHitDice === 0 && create_if_block$a();
  return {
    c() {
      div3 = element("div");
      div2 = element("div");
      div0 = element("div");
      label = element("label");
      label.textContent = `${localize("DND5E.ShortRestSelect")}`;
      t1 = space();
      div1 = element("div");
      select = element("select");
      for (let i2 = 0; i2 < each_blocks.length; i2 += 1) {
        each_blocks[i2].c();
      }
      t2 = space();
      button = element("button");
      i = element("i");
      t3 = space();
      t4 = text(t4_value);
      t5 = space();
      if (if_block0)
        if_block0.c();
      t6 = space();
      if (if_block1)
        if_block1.c();
      attr(select, "name", "hd");
      set_style(select, "height", "26px");
      if (ctx[0] === void 0)
        add_render_callback(() => ctx[10].call(select));
      attr(i, "class", "fas fa-dice-d20");
      attr(button, "type", "button");
      button.disabled = button_disabled_value = !ctx[5];
      attr(div1, "class", "form-fields");
      attr(div2, "class", "flexcol");
      attr(div3, "class", "form-group");
    },
    m(target, anchor) {
      insert(target, div3, anchor);
      append(div3, div2);
      append(div2, div0);
      append(div0, label);
      append(div2, t1);
      append(div2, div1);
      append(div1, select);
      for (let i2 = 0; i2 < each_blocks.length; i2 += 1) {
        each_blocks[i2].m(select, null);
      }
      select_option(select, ctx[0]);
      append(div1, t2);
      append(div1, button);
      append(button, i);
      append(button, t3);
      append(button, t4);
      append(div1, t5);
      if (if_block0)
        if_block0.m(div1, null);
      append(div2, t6);
      if (if_block1)
        if_block1.m(div2, null);
      if (!mounted) {
        dispose = [
          listen(select, "change", ctx[10]),
          listen(button, "click", ctx[11])
        ];
        mounted = true;
      }
    },
    p(ctx2, [dirty]) {
      if (dirty & 2) {
        each_value = Object.entries(ctx2[1].availableHitDice);
        each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx2, each_value, each_1_lookup, select, destroy_block, create_each_block$9, null, get_each_context$9);
      }
      if (dirty & 3) {
        select_option(select, ctx2[0]);
      }
      if (dirty & 32 && button_disabled_value !== (button_disabled_value = !ctx2[5])) {
        button.disabled = button_disabled_value;
      }
      if (ctx2[6])
        if_block0.p(ctx2, dirty);
      if (ctx2[1].totalHitDice === 0) {
        if (if_block1) {
          if_block1.p(ctx2, dirty);
        } else {
          if_block1 = create_if_block$a();
          if_block1.c();
          if_block1.m(div2, null);
        }
      } else if (if_block1) {
        if_block1.d(1);
        if_block1 = null;
      }
    },
    i: noop,
    o: noop,
    d(detaching) {
      if (detaching)
        detach(div3);
      for (let i2 = 0; i2 < each_blocks.length; i2 += 1) {
        each_blocks[i2].d();
      }
      if (if_block0)
        if_block0.d();
      if (if_block1)
        if_block1.d();
      mounted = false;
      run_all(dispose);
    }
  };
}
__name(create_fragment$d, "create_fragment$d");
function instance$d($$self, $$props, $$invalidate) {
  let { workflow } = $$props;
  let { healthData } = $$props;
  let { selectedHitDice } = $$props;
  let { onHitDiceFunction = /* @__PURE__ */ __name(() => {
  }, "onHitDiceFunction") } = $$props;
  let { onAutoFunction = /* @__PURE__ */ __name(() => {
  }, "onAutoFunction") } = $$props;
  let { minSpendHitDice = 0 } = $$props;
  let { maxSpendHitDice = 0 } = $$props;
  let autoRollEnabled = getSetting(CONSTANTS.SETTINGS.ENABLE_AUTO_ROLL_HIT_DICE);
  let disableAutoButton;
  let enableRollButton;
  function select_change_handler() {
    selectedHitDice = select_value(this);
    $$invalidate(0, selectedHitDice);
    $$invalidate(1, healthData);
  }
  __name(select_change_handler, "select_change_handler");
  const click_handler = /* @__PURE__ */ __name((event) => {
    onHitDiceFunction(event);
  }, "click_handler");
  const click_handler_1 = /* @__PURE__ */ __name((event) => {
    onAutoFunction(event);
  }, "click_handler_1");
  $$self.$$set = ($$props2) => {
    if ("workflow" in $$props2)
      $$invalidate(7, workflow = $$props2.workflow);
    if ("healthData" in $$props2)
      $$invalidate(1, healthData = $$props2.healthData);
    if ("selectedHitDice" in $$props2)
      $$invalidate(0, selectedHitDice = $$props2.selectedHitDice);
    if ("onHitDiceFunction" in $$props2)
      $$invalidate(2, onHitDiceFunction = $$props2.onHitDiceFunction);
    if ("onAutoFunction" in $$props2)
      $$invalidate(3, onAutoFunction = $$props2.onAutoFunction);
    if ("minSpendHitDice" in $$props2)
      $$invalidate(8, minSpendHitDice = $$props2.minSpendHitDice);
    if ("maxSpendHitDice" in $$props2)
      $$invalidate(9, maxSpendHitDice = $$props2.maxSpendHitDice);
  };
  $$self.$$.update = () => {
    if ($$self.$$.dirty & 2) {
      {
        $$invalidate(4, disableAutoButton = !healthData.enableAutoRollHitDice);
      }
    }
    if ($$self.$$.dirty & 899) {
      {
        $$invalidate(5, enableRollButton = healthData.availableHitDice[selectedHitDice] > 0 && workflow.currHP < workflow.maxHP && (minSpendHitDice === 0 || (minSpendHitDice > healthData.hitDiceSpent || (maxSpendHitDice === 0 || healthData.hitDiceSpent < maxSpendHitDice))) && (maxSpendHitDice === 0 || healthData.hitDiceSpent < maxSpendHitDice));
      }
    }
  };
  return [
    selectedHitDice,
    healthData,
    onHitDiceFunction,
    onAutoFunction,
    disableAutoButton,
    enableRollButton,
    autoRollEnabled,
    workflow,
    minSpendHitDice,
    maxSpendHitDice,
    select_change_handler,
    click_handler,
    click_handler_1
  ];
}
__name(instance$d, "instance$d");
class HitDieRoller extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$d, create_fragment$d, safe_not_equal, {
      workflow: 7,
      healthData: 1,
      selectedHitDice: 0,
      onHitDiceFunction: 2,
      onAutoFunction: 3,
      minSpendHitDice: 8,
      maxSpendHitDice: 9
    });
  }
}
__name(HitDieRoller, "HitDieRoller");
class plugins {
  static _integrationMap = {
    [CONSTANTS.MODULES.DFREDS + "-exhaustion"]: this.handleDFredsConvenientEffects,
    [CONSTANTS.MODULES.CUB + "-exhaustion"]: this.handleCombatUtilityBelt
  };
  static handleIntegration(integration, ...args) {
    if (!this._integrationMap[integration])
      return;
    return this._integrationMap[integration](...args);
  }
  static handleExhaustion(...args) {
    const integration = getSetting(CONSTANTS.SETTINGS.EXHAUSTION_INTEGRATION);
    const integrationFunction = this._integrationMap[integration + "-exhaustion"];
    if (integrationFunction) {
      return integrationFunction(...args);
    }
    return this.handleNativeExhaustion(...args);
  }
  static async handleDFredsConvenientEffects(actor, data) {
    if (!game.modules.get(CONSTANTS.MODULES.DFREDS)?.active)
      return;
    if (!game?.dfreds?.effectInterface)
      return;
    const DFREDS = game?.dfreds?.effectInterface;
    const oneDndExhaustionEnabled = getSetting(CONSTANTS.SETTINGS.ONE_DND_EXHAUSTION);
    const exhaustionLevel = getProperty(data, "data.attributes.exhaustion");
    const actorUuid = actor.uuid;
    if (!oneDndExhaustionEnabled) {
      for (let level = 1; level <= 6; level++) {
        let levelName = `Exhaustion ${level}`;
        if (levelName !== `Exhaustion ${exhaustionLevel}` && DFREDS.hasEffectApplied(levelName, actorUuid)) {
          await DFREDS.removeEffect({
            effectName: levelName,
            uuid: actorUuid
          });
        }
      }
      if (exhaustionLevel >= 1 && exhaustionLevel <= 6) {
        await DFREDS.addEffect({ effectName: `Exhaustion ${exhaustionLevel}`, uuid: actorUuid });
      }
    } else {
      const presetEffect = game?.dfreds?.effects.customEffects.find((effect) => {
        return getProperty(effect.flags, "rest-recovery.exhaustion-effect");
      });
      if (exhaustionLevel >= 1) {
        await DFREDS.addEffect({
          effectName: presetEffect.name,
          uuid: actorUuid
        });
      } else {
        await DFREDS.removeEffect({
          effectName: presetEffect.name,
          uuid: actorUuid
        });
      }
    }
  }
  static async createConvenientEffect() {
    if (game?.dfreds?.effects.customEffects.find((effect) => {
      return getProperty(effect.flags, "rest-recovery.exhaustion-effect");
    })) {
      return;
    }
    return game?.dfreds?.effectInterface.createNewCustomEffectsWith({
      activeEffects: [oneDndExhaustionEffectData]
    });
  }
  static async handleCombatUtilityBelt(actor, data) {
    if (!game.modules.get(CONSTANTS.MODULES.CUB)?.active)
      return;
    if (!game?.cub?.enhancedConditions?.supported)
      return;
    const CUB = game.cub;
    const exhaustionLevel = getProperty(data, "data.attributes.exhaustion");
    const exhaustionEffectName = `Exhaustion ${exhaustionLevel}`;
    for (let level = 1; level <= 5; level++) {
      let levelName = `Exhaustion ${level}`;
      if (levelName !== exhaustionEffectName && CUB.hasCondition(levelName, actor, { warn: false })) {
        await CUB.removeCondition(levelName, actor, { warn: false });
      }
    }
    if (exhaustionLevel >= 1 && exhaustionLevel <= 5) {
      await CUB.addCondition(exhaustionEffectName, actor);
    }
  }
  static handleNativeExhaustion(actor, data) {
    const oneDndExhaustionEnabled = getSetting(CONSTANTS.SETTINGS.ONE_DND_EXHAUSTION);
    if (!oneDndExhaustionEnabled)
      return;
    const exhaustionLevel = getProperty(data, "data.attributes.exhaustion");
    const actorExhaustionEffect = actor.effects.find((effect) => getProperty(effect, "flags.rest-recovery.exhaustion-effect"));
    if (exhaustionLevel > 0 && !actorExhaustionEffect) {
      return actor.createEmbeddedDocuments("ActiveEffect", [oneDndExhaustionEffectData]);
    } else if (exhaustionLevel <= 0 && actorExhaustionEffect) {
      return actor.deleteEmbeddedDocuments("ActiveEffect", [actorExhaustionEffect.id]);
    }
  }
}
__name(plugins, "plugins");
const oneDndExhaustionEffectData = {
  "label": "Exhaustion (One D&D)",
  "description": "One D&D exhaustion applies a -1 penalty to Ability Checks, Attack Rolls, Saving Throws, and the character's Spell Save DC per exhaustion level. Once a character reaches 10 levels of exhaustion, they perish.",
  "icon": "icons/svg/downgrade.svg",
  "tint": null,
  "seconds": null,
  "rounds": null,
  "turns": null,
  "isDynamic": false,
  "isViewable": true,
  "flags": {
    "isCustomConvenient": true,
    "convenientDescription": "One D&D exhaustion applies a -1 penalty to Ability Checks, Attack Rolls, Saving Throws, and the character's Spell Save DC per exhaustion level. Once a character reaches 10 levels of exhaustion, they perish.",
    "rest-recovery": {
      "exhaustion-effect": true
    }
  },
  "changes": [{
    "key": "system.bonuses.All-Attacks",
    "value": "-@attributes.exhaustion",
    "mode": 2,
    "priority": 20
  }, {
    "key": "system.bonuses.abilities.save",
    "value": "-@attributes.exhaustion",
    "mode": 2,
    "priority": 20
  }, {
    "key": "system.bonuses.abilities.check",
    "value": "-@attributes.exhaustion",
    "mode": 2,
    "priority": 20
  }, {
    "key": "system.bonuses.spell.dc",
    "value": "-@attributes.exhaustion",
    "mode": 2,
    "priority": 20
  }]
};
const FoodWater_svelte_svelte_type_style_lang = "";
function get_each_context$8(ctx, list, i) {
  const child_ctx = ctx.slice();
  child_ctx[43] = list[i];
  child_ctx[45] = i;
  return child_ctx;
}
__name(get_each_context$8, "get_each_context$8");
function get_each_context_1$3(ctx, list, i) {
  const child_ctx = ctx.slice();
  child_ctx[43] = list[i];
  child_ctx[46] = list;
  child_ctx[45] = i;
  return child_ctx;
}
__name(get_each_context_1$3, "get_each_context_1$3");
function create_if_block_13$1(ctx) {
  let if_block_anchor;
  function select_block_type(ctx2, dirty) {
    if (ctx2[10] - ctx2[12] > 0)
      return create_if_block_14;
    return create_else_block_3$2;
  }
  __name(select_block_type, "select_block_type");
  let current_block_type = select_block_type(ctx);
  let if_block = current_block_type(ctx);
  return {
    c() {
      if_block.c();
      if_block_anchor = empty();
    },
    m(target, anchor) {
      if_block.m(target, anchor);
      insert(target, if_block_anchor, anchor);
    },
    p(ctx2, dirty) {
      if_block.p(ctx2, dirty);
    },
    d(detaching) {
      if_block.d(detaching);
      if (detaching)
        detach(if_block_anchor);
    }
  };
}
__name(create_if_block_13$1, "create_if_block_13$1");
function create_else_block_3$2(ctx) {
  let p;
  let raw_value = localize("REST-RECOVERY.Dialogs.RestSteps.FoodWater.FoodSated") + "";
  return {
    c() {
      p = element("p");
    },
    m(target, anchor) {
      insert(target, p, anchor);
      p.innerHTML = raw_value;
    },
    p: noop,
    d(detaching) {
      if (detaching)
        detach(p);
    }
  };
}
__name(create_else_block_3$2, "create_else_block_3$2");
function create_if_block_14(ctx) {
  let p;
  let raw_value = localize("REST-RECOVERY.Dialogs.RestSteps.FoodWater.FoodRequirement", {
    food: Math.max(0, ctx[10] - ctx[4])
  }) + "";
  let t;
  let if_block_anchor;
  let if_block = (ctx[18] === "half" || ctx[18] === "full") && create_if_block_15(ctx);
  return {
    c() {
      p = element("p");
      t = space();
      if (if_block)
        if_block.c();
      if_block_anchor = empty();
    },
    m(target, anchor) {
      insert(target, p, anchor);
      p.innerHTML = raw_value;
      insert(target, t, anchor);
      if (if_block)
        if_block.m(target, anchor);
      insert(target, if_block_anchor, anchor);
    },
    p(ctx2, dirty) {
      if (dirty[0] & 16 && raw_value !== (raw_value = localize("REST-RECOVERY.Dialogs.RestSteps.FoodWater.FoodRequirement", {
        food: Math.max(0, ctx2[10] - ctx2[4])
      }) + ""))
        p.innerHTML = raw_value;
      if (ctx2[18] === "half" || ctx2[18] === "full")
        if_block.p(ctx2, dirty);
    },
    d(detaching) {
      if (detaching)
        detach(p);
      if (detaching)
        detach(t);
      if (if_block)
        if_block.d(detaching);
      if (detaching)
        detach(if_block_anchor);
    }
  };
}
__name(create_if_block_14, "create_if_block_14");
function create_if_block_15(ctx) {
  let label;
  let input;
  let t0;
  let t1_value = localize("REST-RECOVERY.Dialogs.RestSteps.FoodWater.ExternalFood") + "";
  let t1;
  let t2;
  let if_block_anchor;
  let mounted;
  let dispose;
  let if_block = ctx[0] && create_if_block_16(ctx);
  return {
    c() {
      label = element("label");
      input = element("input");
      t0 = space();
      t1 = text(t1_value);
      t2 = space();
      if (if_block)
        if_block.c();
      if_block_anchor = empty();
      attr(input, "type", "checkbox");
      attr(input, "class", "svelte-1v4je4b");
      attr(label, "class", "checkbox svelte-1v4je4b");
    },
    m(target, anchor) {
      insert(target, label, anchor);
      append(label, input);
      input.checked = ctx[0];
      append(label, t0);
      append(label, t1);
      insert(target, t2, anchor);
      if (if_block)
        if_block.m(target, anchor);
      insert(target, if_block_anchor, anchor);
      if (!mounted) {
        dispose = [
          listen(input, "change", ctx[29]),
          listen(input, "change", ctx[20])
        ];
        mounted = true;
      }
    },
    p(ctx2, dirty) {
      if (dirty[0] & 1) {
        input.checked = ctx2[0];
      }
      if (ctx2[0]) {
        if (if_block) {
          if_block.p(ctx2, dirty);
        } else {
          if_block = create_if_block_16(ctx2);
          if_block.c();
          if_block.m(if_block_anchor.parentNode, if_block_anchor);
        }
      } else if (if_block) {
        if_block.d(1);
        if_block = null;
      }
    },
    d(detaching) {
      if (detaching)
        detach(label);
      if (detaching)
        detach(t2);
      if (if_block)
        if_block.d(detaching);
      if (detaching)
        detach(if_block_anchor);
      mounted = false;
      run_all(dispose);
    }
  };
}
__name(create_if_block_15, "create_if_block_15");
function create_if_block_16(ctx) {
  let p;
  let label0;
  let input0;
  let t0;
  let t1_value = localize("REST-RECOVERY.Dialogs.RestSteps.FoodWater.ExternalFoodFull") + "";
  let t1;
  let t2;
  let label1;
  let input1;
  let t3;
  let t4_value = localize("REST-RECOVERY.Dialogs.RestSteps.FoodWater.ExternalFoodHalf") + "";
  let t4;
  let mounted;
  let dispose;
  return {
    c() {
      p = element("p");
      label0 = element("label");
      input0 = element("input");
      t0 = space();
      t1 = text(t1_value);
      t2 = space();
      label1 = element("label");
      input1 = element("input");
      t3 = space();
      t4 = text(t4_value);
      attr(input0, "type", "radio");
      input0.__value = "full";
      input0.value = input0.__value;
      input0.disabled = ctx[18] === "half";
      attr(input0, "class", "svelte-1v4je4b");
      ctx[31][0].push(input0);
      attr(label0, "class", "checkbox svelte-1v4je4b");
      attr(input1, "type", "radio");
      input1.__value = "half";
      input1.value = input1.__value;
      attr(input1, "class", "svelte-1v4je4b");
      ctx[31][0].push(input1);
      attr(label1, "class", "checkbox svelte-1v4je4b");
    },
    m(target, anchor) {
      insert(target, p, anchor);
      append(p, label0);
      append(label0, input0);
      input0.checked = input0.__value === ctx[1];
      append(label0, t0);
      append(label0, t1);
      append(p, t2);
      append(p, label1);
      append(label1, input1);
      input1.checked = input1.__value === ctx[1];
      append(label1, t3);
      append(label1, t4);
      if (!mounted) {
        dispose = [
          listen(input0, "change", ctx[30]),
          listen(input0, "change", ctx[21]),
          listen(input1, "change", ctx[32]),
          listen(input1, "change", ctx[21])
        ];
        mounted = true;
      }
    },
    p(ctx2, dirty) {
      if (dirty[0] & 2) {
        input0.checked = input0.__value === ctx2[1];
      }
      if (dirty[0] & 2) {
        input1.checked = input1.__value === ctx2[1];
      }
    },
    d(detaching) {
      if (detaching)
        detach(p);
      ctx[31][0].splice(ctx[31][0].indexOf(input0), 1);
      ctx[31][0].splice(ctx[31][0].indexOf(input1), 1);
      mounted = false;
      run_all(dispose);
    }
  };
}
__name(create_if_block_16, "create_if_block_16");
function create_if_block_9$2(ctx) {
  let if_block_anchor;
  function select_block_type_1(ctx2, dirty) {
    if (ctx2[11] - ctx2[13] > 0)
      return create_if_block_10$1;
    return create_else_block_2$2;
  }
  __name(select_block_type_1, "select_block_type_1");
  let current_block_type = select_block_type_1(ctx);
  let if_block = current_block_type(ctx);
  return {
    c() {
      if_block.c();
      if_block_anchor = empty();
    },
    m(target, anchor) {
      if_block.m(target, anchor);
      insert(target, if_block_anchor, anchor);
    },
    p(ctx2, dirty) {
      if_block.p(ctx2, dirty);
    },
    d(detaching) {
      if_block.d(detaching);
      if (detaching)
        detach(if_block_anchor);
    }
  };
}
__name(create_if_block_9$2, "create_if_block_9$2");
function create_else_block_2$2(ctx) {
  let p;
  let raw_value = localize("REST-RECOVERY.Dialogs.RestSteps.FoodWater.WaterSated") + "";
  return {
    c() {
      p = element("p");
    },
    m(target, anchor) {
      insert(target, p, anchor);
      p.innerHTML = raw_value;
    },
    p: noop,
    d(detaching) {
      if (detaching)
        detach(p);
    }
  };
}
__name(create_else_block_2$2, "create_else_block_2$2");
function create_if_block_10$1(ctx) {
  let p;
  let raw_value = localize("REST-RECOVERY.Dialogs.RestSteps.FoodWater.WaterRequirement", {
    water: Math.max(0, ctx[11] - ctx[5])
  }) + "";
  let t;
  let if_block_anchor;
  let if_block = (ctx[19] === "half" || ctx[19] === "full") && create_if_block_11$1(ctx);
  return {
    c() {
      p = element("p");
      t = space();
      if (if_block)
        if_block.c();
      if_block_anchor = empty();
    },
    m(target, anchor) {
      insert(target, p, anchor);
      p.innerHTML = raw_value;
      insert(target, t, anchor);
      if (if_block)
        if_block.m(target, anchor);
      insert(target, if_block_anchor, anchor);
    },
    p(ctx2, dirty) {
      if (dirty[0] & 32 && raw_value !== (raw_value = localize("REST-RECOVERY.Dialogs.RestSteps.FoodWater.WaterRequirement", {
        water: Math.max(0, ctx2[11] - ctx2[5])
      }) + ""))
        p.innerHTML = raw_value;
      if (ctx2[19] === "half" || ctx2[19] === "full")
        if_block.p(ctx2, dirty);
    },
    d(detaching) {
      if (detaching)
        detach(p);
      if (detaching)
        detach(t);
      if (if_block)
        if_block.d(detaching);
      if (detaching)
        detach(if_block_anchor);
    }
  };
}
__name(create_if_block_10$1, "create_if_block_10$1");
function create_if_block_11$1(ctx) {
  let label;
  let input;
  let t0;
  let t1_value = localize("REST-RECOVERY.Dialogs.RestSteps.FoodWater.ExternalWater") + "";
  let t1;
  let t2;
  let if_block_anchor;
  let mounted;
  let dispose;
  let if_block = ctx[2] && create_if_block_12$1(ctx);
  return {
    c() {
      label = element("label");
      input = element("input");
      t0 = space();
      t1 = text(t1_value);
      t2 = space();
      if (if_block)
        if_block.c();
      if_block_anchor = empty();
      attr(input, "type", "checkbox");
      attr(input, "class", "red svelte-1v4je4b");
      attr(label, "class", "checkbox svelte-1v4je4b");
    },
    m(target, anchor) {
      insert(target, label, anchor);
      append(label, input);
      input.checked = ctx[2];
      append(label, t0);
      append(label, t1);
      insert(target, t2, anchor);
      if (if_block)
        if_block.m(target, anchor);
      insert(target, if_block_anchor, anchor);
      if (!mounted) {
        dispose = [
          listen(input, "change", ctx[33]),
          listen(input, "change", ctx[22])
        ];
        mounted = true;
      }
    },
    p(ctx2, dirty) {
      if (dirty[0] & 4) {
        input.checked = ctx2[2];
      }
      if (ctx2[2]) {
        if (if_block) {
          if_block.p(ctx2, dirty);
        } else {
          if_block = create_if_block_12$1(ctx2);
          if_block.c();
          if_block.m(if_block_anchor.parentNode, if_block_anchor);
        }
      } else if (if_block) {
        if_block.d(1);
        if_block = null;
      }
    },
    d(detaching) {
      if (detaching)
        detach(label);
      if (detaching)
        detach(t2);
      if (if_block)
        if_block.d(detaching);
      if (detaching)
        detach(if_block_anchor);
      mounted = false;
      run_all(dispose);
    }
  };
}
__name(create_if_block_11$1, "create_if_block_11$1");
function create_if_block_12$1(ctx) {
  let p;
  let label0;
  let input0;
  let t0;
  let t1_value = localize("REST-RECOVERY.Dialogs.RestSteps.FoodWater.ExternalWaterFull") + "";
  let t1;
  let t2;
  let label1;
  let input1;
  let t3;
  let t4_value = localize("REST-RECOVERY.Dialogs.RestSteps.FoodWater.ExternalWaterHalf") + "";
  let t4;
  let mounted;
  let dispose;
  return {
    c() {
      p = element("p");
      label0 = element("label");
      input0 = element("input");
      t0 = space();
      t1 = text(t1_value);
      t2 = space();
      label1 = element("label");
      input1 = element("input");
      t3 = space();
      t4 = text(t4_value);
      attr(input0, "type", "radio");
      input0.__value = "full";
      input0.value = input0.__value;
      input0.disabled = ctx[19] === "half";
      attr(input0, "class", "svelte-1v4je4b");
      ctx[31][1].push(input0);
      attr(label0, "class", "checkbox svelte-1v4je4b");
      attr(input1, "type", "radio");
      input1.__value = "half";
      input1.value = input1.__value;
      attr(input1, "class", "svelte-1v4je4b");
      ctx[31][1].push(input1);
      attr(label1, "class", "checkbox svelte-1v4je4b");
    },
    m(target, anchor) {
      insert(target, p, anchor);
      append(p, label0);
      append(label0, input0);
      input0.checked = input0.__value === ctx[3];
      append(label0, t0);
      append(label0, t1);
      append(p, t2);
      append(p, label1);
      append(label1, input1);
      input1.checked = input1.__value === ctx[3];
      append(label1, t3);
      append(label1, t4);
      if (!mounted) {
        dispose = [
          listen(input0, "change", ctx[34]),
          listen(input0, "change", ctx[23]),
          listen(input1, "change", ctx[35]),
          listen(input1, "change", ctx[23])
        ];
        mounted = true;
      }
    },
    p(ctx2, dirty) {
      if (dirty[0] & 8) {
        input0.checked = input0.__value === ctx2[3];
      }
      if (dirty[0] & 8) {
        input1.checked = input1.__value === ctx2[3];
      }
    },
    d(detaching) {
      if (detaching)
        detach(p);
      ctx[31][1].splice(ctx[31][1].indexOf(input0), 1);
      ctx[31][1].splice(ctx[31][1].indexOf(input1), 1);
      mounted = false;
      run_all(dispose);
    }
  };
}
__name(create_if_block_12$1, "create_if_block_12$1");
function create_if_block_7$2(ctx) {
  let div;
  let each_blocks = [];
  let each_1_lookup = /* @__PURE__ */ new Map();
  let each_value_1 = ctx[6];
  const get_key = /* @__PURE__ */ __name((ctx2) => ctx2[43].id, "get_key");
  for (let i = 0; i < each_value_1.length; i += 1) {
    let child_ctx = get_each_context_1$3(ctx, each_value_1, i);
    let key = get_key(child_ctx);
    each_1_lookup.set(key, each_blocks[i] = create_each_block_1$3(key, child_ctx));
  }
  return {
    c() {
      div = element("div");
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].c();
      }
      attr(div, "class", "items-container svelte-1v4je4b");
    },
    m(target, anchor) {
      insert(target, div, anchor);
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].m(div, null);
      }
    },
    p(ctx2, dirty) {
      if (dirty[0] & 201326656) {
        each_value_1 = ctx2[6];
        each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx2, each_value_1, each_1_lookup, div, destroy_block, create_each_block_1$3, null, get_each_context_1$3);
      }
    },
    d(detaching) {
      if (detaching)
        detach(div);
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].d();
      }
    }
  };
}
__name(create_if_block_7$2, "create_if_block_7$2");
function create_else_block_1$3(ctx) {
  let t_value = localize("REST-RECOVERY.Dialogs.AbilityUse.DayWorthTitle" + capitalizeFirstLetter(ctx[43].consumable.type)) + "";
  let t;
  return {
    c() {
      t = text(t_value);
    },
    m(target, anchor) {
      insert(target, t, anchor);
    },
    p(ctx2, dirty) {
      if (dirty[0] & 64 && t_value !== (t_value = localize("REST-RECOVERY.Dialogs.AbilityUse.DayWorthTitle" + capitalizeFirstLetter(ctx2[43].consumable.type)) + ""))
        set_data(t, t_value);
    },
    d(detaching) {
      if (detaching)
        detach(t);
    }
  };
}
__name(create_else_block_1$3, "create_else_block_1$3");
function create_if_block_8$2(ctx) {
  let input;
  let t0;
  let t1_value = localize("REST-RECOVERY.Dialogs.RestSteps.FoodWater.AmountToConsume") + "";
  let t1;
  let mounted;
  let dispose;
  function input_input_handler() {
    ctx[36].call(input, ctx[46], ctx[45]);
  }
  __name(input_input_handler, "input_input_handler");
  function change_handler() {
    return ctx[37](ctx[43], ctx[46], ctx[45]);
  }
  __name(change_handler, "change_handler");
  return {
    c() {
      input = element("input");
      t0 = space();
      t1 = text(t1_value);
      attr(input, "type", "number");
      attr(input, "step", "0.5");
      attr(input, "class", "svelte-1v4je4b");
    },
    m(target, anchor) {
      insert(target, input, anchor);
      set_input_value(input, ctx[43].amount);
      insert(target, t0, anchor);
      insert(target, t1, anchor);
      if (!mounted) {
        dispose = [
          listen(input, "input", input_input_handler),
          listen(input, "change", change_handler)
        ];
        mounted = true;
      }
    },
    p(new_ctx, dirty) {
      ctx = new_ctx;
      if (dirty[0] & 64 && to_number(input.value) !== ctx[43].amount) {
        set_input_value(input, ctx[43].amount);
      }
    },
    d(detaching) {
      if (detaching)
        detach(input);
      if (detaching)
        detach(t0);
      if (detaching)
        detach(t1);
      mounted = false;
      run_all(dispose);
    }
  };
}
__name(create_if_block_8$2, "create_if_block_8$2");
function create_each_block_1$3(key_1, ctx) {
  let div1;
  let div0;
  let span;
  let t0_value = ctx[43].fullName + "";
  let t0;
  let t1;
  let label;
  let t2;
  let button;
  let t3;
  let mounted;
  let dispose;
  function select_block_type_2(ctx2, dirty) {
    if (!ctx2[43].consumable.dayWorth)
      return create_if_block_8$2;
    return create_else_block_1$3;
  }
  __name(select_block_type_2, "select_block_type_2");
  let current_block_type = select_block_type_2(ctx);
  let if_block = current_block_type(ctx);
  function click_handler() {
    return ctx[38](ctx[45]);
  }
  __name(click_handler, "click_handler");
  return {
    key: key_1,
    first: null,
    c() {
      div1 = element("div");
      div0 = element("div");
      span = element("span");
      t0 = text(t0_value);
      t1 = space();
      label = element("label");
      if_block.c();
      t2 = space();
      button = element("button");
      button.innerHTML = `<i class="fas fa-times"></i>`;
      t3 = space();
      attr(span, "class", "item-name svelte-1v4je4b");
      attr(label, "class", "svelte-1v4je4b");
      attr(div0, "class", "flexcol svelte-1v4je4b");
      attr(button, "type", "button");
      attr(button, "class", "svelte-1v4je4b");
      attr(div1, "class", "item-container svelte-1v4je4b");
      this.first = div1;
    },
    m(target, anchor) {
      insert(target, div1, anchor);
      append(div1, div0);
      append(div0, span);
      append(span, t0);
      append(div0, t1);
      append(div0, label);
      if_block.m(label, null);
      append(div1, t2);
      append(div1, button);
      append(div1, t3);
      if (!mounted) {
        dispose = listen(button, "click", click_handler);
        mounted = true;
      }
    },
    p(new_ctx, dirty) {
      ctx = new_ctx;
      if (dirty[0] & 64 && t0_value !== (t0_value = ctx[43].fullName + ""))
        set_data(t0, t0_value);
      if (current_block_type === (current_block_type = select_block_type_2(ctx)) && if_block) {
        if_block.p(ctx, dirty);
      } else {
        if_block.d(1);
        if_block = current_block_type(ctx);
        if (if_block) {
          if_block.c();
          if_block.m(label, null);
        }
      }
    },
    d(detaching) {
      if (detaching)
        detach(div1);
      if_block.d();
      mounted = false;
      dispose();
    }
  };
}
__name(create_each_block_1$3, "create_each_block_1$3");
function create_if_block_6$2(ctx) {
  let div2;
  let div1;
  let p;
  let t1;
  let div0;
  let select;
  let each_blocks = [];
  let each_1_lookup = /* @__PURE__ */ new Map();
  let t2;
  let button;
  let mounted;
  let dispose;
  let each_value = ctx[7];
  const get_key = /* @__PURE__ */ __name((ctx2) => ctx2[43].id, "get_key");
  for (let i = 0; i < each_value.length; i += 1) {
    let child_ctx = get_each_context$8(ctx, each_value, i);
    let key = get_key(child_ctx);
    each_1_lookup.set(key, each_blocks[i] = create_each_block$8(key, child_ctx));
  }
  return {
    c() {
      div2 = element("div");
      div1 = element("div");
      p = element("p");
      p.textContent = `${localize("REST-RECOVERY.Dialogs.RestSteps.FoodWater.DragDrop")}`;
      t1 = space();
      div0 = element("div");
      select = element("select");
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].c();
      }
      t2 = space();
      button = element("button");
      button.innerHTML = `<i class="fas fa-plus"></i>`;
      if (ctx[8] === void 0)
        add_render_callback(() => ctx[39].call(select));
      attr(button, "class", "consumable-add-button svelte-1v4je4b");
      attr(button, "type", "button");
      attr(div0, "class", "flexrow");
      attr(div1, "class", "form-fields");
      attr(div2, "class", "dragDropBox svelte-1v4je4b");
    },
    m(target, anchor) {
      insert(target, div2, anchor);
      append(div2, div1);
      append(div1, p);
      append(div1, t1);
      append(div1, div0);
      append(div0, select);
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].m(select, null);
      }
      select_option(select, ctx[8]);
      append(div0, t2);
      append(div0, button);
      if (!mounted) {
        dispose = [
          listen(select, "change", ctx[39]),
          listen(button, "click", ctx[40]),
          listen(div2, "dragstart", preventDefault),
          listen(div2, "drop", ctx[24]),
          listen(div2, "dragover", preventDefault)
        ];
        mounted = true;
      }
    },
    p(ctx2, dirty) {
      if (dirty[0] & 128) {
        each_value = ctx2[7];
        each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx2, each_value, each_1_lookup, select, destroy_block, create_each_block$8, null, get_each_context$8);
      }
      if (dirty[0] & 384) {
        select_option(select, ctx2[8]);
      }
    },
    d(detaching) {
      if (detaching)
        detach(div2);
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].d();
      }
      mounted = false;
      run_all(dispose);
    }
  };
}
__name(create_if_block_6$2, "create_if_block_6$2");
function create_each_block$8(key_1, ctx) {
  let option;
  let t_value = ctx[43].name + "";
  let t;
  let option_value_value;
  return {
    key: key_1,
    first: null,
    c() {
      option = element("option");
      t = text(t_value);
      option.__value = option_value_value = ctx[43].id;
      option.value = option.__value;
      this.first = option;
    },
    m(target, anchor) {
      insert(target, option, anchor);
      append(option, t);
    },
    p(new_ctx, dirty) {
      ctx = new_ctx;
      if (dirty[0] & 128 && t_value !== (t_value = ctx[43].name + ""))
        set_data(t, t_value);
      if (dirty[0] & 128 && option_value_value !== (option_value_value = ctx[43].id)) {
        option.__value = option_value_value;
        option.value = option.__value;
      }
    },
    d(detaching) {
      if (detaching)
        detach(option);
    }
  };
}
__name(create_each_block$8, "create_each_block$8");
function create_if_block$9(ctx) {
  let t;
  let if_block1_anchor;
  let if_block0 = ctx[10] && ctx[4] < ctx[10] && create_if_block_4$3(ctx);
  let if_block1 = ctx[11] && create_if_block_1$7(ctx);
  return {
    c() {
      if (if_block0)
        if_block0.c();
      t = space();
      if (if_block1)
        if_block1.c();
      if_block1_anchor = empty();
    },
    m(target, anchor) {
      if (if_block0)
        if_block0.m(target, anchor);
      insert(target, t, anchor);
      if (if_block1)
        if_block1.m(target, anchor);
      insert(target, if_block1_anchor, anchor);
    },
    p(ctx2, dirty) {
      if (ctx2[10] && ctx2[4] < ctx2[10]) {
        if (if_block0) {
          if_block0.p(ctx2, dirty);
        } else {
          if_block0 = create_if_block_4$3(ctx2);
          if_block0.c();
          if_block0.m(t.parentNode, t);
        }
      } else if (if_block0) {
        if_block0.d(1);
        if_block0 = null;
      }
      if (ctx2[11])
        if_block1.p(ctx2, dirty);
    },
    d(detaching) {
      if (if_block0)
        if_block0.d(detaching);
      if (detaching)
        detach(t);
      if (if_block1)
        if_block1.d(detaching);
      if (detaching)
        detach(if_block1_anchor);
    }
  };
}
__name(create_if_block$9, "create_if_block$9");
function create_if_block_4$3(ctx) {
  let if_block_anchor;
  function select_block_type_3(ctx2, dirty) {
    if (ctx2[16] < ctx2[17])
      return create_if_block_5$3;
    return create_else_block$5;
  }
  __name(select_block_type_3, "select_block_type_3");
  let current_block_type = select_block_type_3(ctx);
  let if_block = current_block_type(ctx);
  return {
    c() {
      if_block.c();
      if_block_anchor = empty();
    },
    m(target, anchor) {
      if_block.m(target, anchor);
      insert(target, if_block_anchor, anchor);
    },
    p(ctx2, dirty) {
      if_block.p(ctx2, dirty);
    },
    d(detaching) {
      if_block.d(detaching);
      if (detaching)
        detach(if_block_anchor);
    }
  };
}
__name(create_if_block_4$3, "create_if_block_4$3");
function create_else_block$5(ctx) {
  let p;
  let raw_value = localize("REST-RECOVERY.Dialogs.RestSteps.FoodWater.FoodExhaustion") + "";
  return {
    c() {
      p = element("p");
    },
    m(target, anchor) {
      insert(target, p, anchor);
      p.innerHTML = raw_value;
    },
    p: noop,
    d(detaching) {
      if (detaching)
        detach(p);
    }
  };
}
__name(create_else_block$5, "create_else_block$5");
function create_if_block_5$3(ctx) {
  let p;
  let raw_value = localize("REST-RECOVERY.Dialogs.RestSteps.FoodWater.FoodAlmostExhaustion", {
    days: (ctx[17] - ctx[16]) * (ctx[4] > 0 && ctx[4] <= ctx[10] / 2 ? 2 : 1)
  }) + "";
  return {
    c() {
      p = element("p");
    },
    m(target, anchor) {
      insert(target, p, anchor);
      p.innerHTML = raw_value;
    },
    p(ctx2, dirty) {
      if (dirty[0] & 16 && raw_value !== (raw_value = localize("REST-RECOVERY.Dialogs.RestSteps.FoodWater.FoodAlmostExhaustion", {
        days: (ctx2[17] - ctx2[16]) * (ctx2[4] > 0 && ctx2[4] <= ctx2[10] / 2 ? 2 : 1)
      }) + ""))
        p.innerHTML = raw_value;
    },
    d(detaching) {
      if (detaching)
        detach(p);
    }
  };
}
__name(create_if_block_5$3, "create_if_block_5$3");
function create_if_block_1$7(ctx) {
  let if_block_anchor;
  function select_block_type_4(ctx2, dirty) {
    if (ctx2[5] > 0 && ctx2[5] <= ctx2[11] / 2)
      return create_if_block_2$4;
    if (ctx2[5] === 0)
      return create_if_block_3$4;
  }
  __name(select_block_type_4, "select_block_type_4");
  let current_block_type = select_block_type_4(ctx);
  let if_block = current_block_type && current_block_type(ctx);
  return {
    c() {
      if (if_block)
        if_block.c();
      if_block_anchor = empty();
    },
    m(target, anchor) {
      if (if_block)
        if_block.m(target, anchor);
      insert(target, if_block_anchor, anchor);
    },
    p(ctx2, dirty) {
      if (current_block_type === (current_block_type = select_block_type_4(ctx2)) && if_block) {
        if_block.p(ctx2, dirty);
      } else {
        if (if_block)
          if_block.d(1);
        if_block = current_block_type && current_block_type(ctx2);
        if (if_block) {
          if_block.c();
          if_block.m(if_block_anchor.parentNode, if_block_anchor);
        }
      }
    },
    d(detaching) {
      if (if_block) {
        if_block.d(detaching);
      }
      if (detaching)
        detach(if_block_anchor);
    }
  };
}
__name(create_if_block_1$7, "create_if_block_1$7");
function create_if_block_3$4(ctx) {
  let p;
  let raw_value = localize("REST-RECOVERY.Dialogs.RestSteps.FoodWater.NoWater", {
    exhaustion: ctx[15] > 0 ? 2 : 1
  }) + "";
  return {
    c() {
      p = element("p");
    },
    m(target, anchor) {
      insert(target, p, anchor);
      p.innerHTML = raw_value;
    },
    p: noop,
    d(detaching) {
      if (detaching)
        detach(p);
    }
  };
}
__name(create_if_block_3$4, "create_if_block_3$4");
function create_if_block_2$4(ctx) {
  let p;
  let raw_value = localize("REST-RECOVERY.Dialogs.RestSteps.FoodWater.HalfWater", {
    dc: ctx[14],
    exhaustion: ctx[15] > 0 ? 2 : 1
  }) + "";
  return {
    c() {
      p = element("p");
    },
    m(target, anchor) {
      insert(target, p, anchor);
      p.innerHTML = raw_value;
    },
    p: noop,
    d(detaching) {
      if (detaching)
        detach(p);
    }
  };
}
__name(create_if_block_2$4, "create_if_block_2$4");
function create_fragment$c(ctx) {
  let div;
  let t0;
  let t1;
  let t2;
  let t3;
  let if_block0 = ctx[10] && create_if_block_13$1(ctx);
  let if_block1 = ctx[11] && create_if_block_9$2(ctx);
  let if_block2 = (!ctx[0] || !ctx[2]) && ctx[6].length && create_if_block_7$2(ctx);
  let if_block3 = ctx[7].length && (ctx[10] && ctx[12] < ctx[10] && !ctx[0] || ctx[11] && ctx[13] < ctx[11] && !ctx[2]) && create_if_block_6$2(ctx);
  let if_block4 = ctx[9] && create_if_block$9(ctx);
  return {
    c() {
      div = element("div");
      if (if_block0)
        if_block0.c();
      t0 = space();
      if (if_block1)
        if_block1.c();
      t1 = space();
      if (if_block2)
        if_block2.c();
      t2 = space();
      if (if_block3)
        if_block3.c();
      t3 = space();
      if (if_block4)
        if_block4.c();
      attr(div, "class", "flex");
    },
    m(target, anchor) {
      insert(target, div, anchor);
      if (if_block0)
        if_block0.m(div, null);
      append(div, t0);
      if (if_block1)
        if_block1.m(div, null);
      append(div, t1);
      if (if_block2)
        if_block2.m(div, null);
      append(div, t2);
      if (if_block3)
        if_block3.m(div, null);
      append(div, t3);
      if (if_block4)
        if_block4.m(div, null);
    },
    p(ctx2, dirty) {
      if (ctx2[10])
        if_block0.p(ctx2, dirty);
      if (ctx2[11])
        if_block1.p(ctx2, dirty);
      if ((!ctx2[0] || !ctx2[2]) && ctx2[6].length) {
        if (if_block2) {
          if_block2.p(ctx2, dirty);
        } else {
          if_block2 = create_if_block_7$2(ctx2);
          if_block2.c();
          if_block2.m(div, t2);
        }
      } else if (if_block2) {
        if_block2.d(1);
        if_block2 = null;
      }
      if (ctx2[7].length && (ctx2[10] && ctx2[12] < ctx2[10] && !ctx2[0] || ctx2[11] && ctx2[13] < ctx2[11] && !ctx2[2])) {
        if (if_block3) {
          if_block3.p(ctx2, dirty);
        } else {
          if_block3 = create_if_block_6$2(ctx2);
          if_block3.c();
          if_block3.m(div, t3);
        }
      } else if (if_block3) {
        if_block3.d(1);
        if_block3 = null;
      }
      if (ctx2[9])
        if_block4.p(ctx2, dirty);
    },
    i: noop,
    o: noop,
    d(detaching) {
      if (detaching)
        detach(div);
      if (if_block0)
        if_block0.d();
      if (if_block1)
        if_block1.d();
      if (if_block2)
        if_block2.d();
      if (if_block3)
        if_block3.d();
      if (if_block4)
        if_block4.d();
    }
  };
}
__name(create_fragment$c, "create_fragment$c");
function preventDefault(event) {
  event.preventDefault();
}
__name(preventDefault, "preventDefault");
function instance$c($$self, $$props, $$invalidate) {
  let { workflow } = $$props;
  const actor = workflow.actor;
  const enableAutomatedExhaustion = getSetting(CONSTANTS.SETTINGS.AUTOMATE_EXHAUSTION) && getSetting(CONSTANTS.SETTINGS.AUTOMATE_FOODWATER_EXHAUSTION);
  const { actorRequiredFood, actorRequiredWater, actorFoodSatedValue, actorWaterSatedValue } = workflow.foodWaterRequirement;
  const halfWaterSaveDC = getSetting(CONSTANTS.SETTINGS.HALF_WATER_SAVE_DC);
  const actorExhaustion = getProperty(actor, "system.attributes.exhaustion") ?? 0;
  const actorDaysWithoutFood = getProperty(actor, CONSTANTS.FLAGS.STARVATION) ?? 0;
  const actorExhaustionThreshold = evaluateFormula(getSetting(CONSTANTS.SETTINGS.NO_FOOD_DURATION_MODIFIER), actor.getRollData())?.total ?? 4;
  let hasAccessToFood = false;
  let halfFood = false;
  let hasAccessToWater = false;
  let halfWater = false;
  let externalFoodSourceAccess = getSetting(CONSTANTS.SETTINGS.EXTERNAL_FOOD_ACCESS);
  let externalWaterSourceAccess = getSetting(CONSTANTS.SETTINGS.EXTERNAL_WATER_ACCESS);
  let newFoodSatedValue = actorFoodSatedValue;
  let newWaterSatedValue = actorWaterSatedValue;
  let consumableItems = [];
  let actorConsumableItems = [];
  let selectedItem = "";
  RestWorkflow.patchAllConsumableItems(actor).then(() => {
    refreshConsumableItems();
  });
  function toggleAccessToFood() {
    $$invalidate(1, halfFood = hasAccessToFood ? externalFoodSourceAccess : false);
    toggleAmountOfFood();
  }
  __name(toggleAccessToFood, "toggleAccessToFood");
  function toggleAmountOfFood() {
    if (halfFood === "full") {
      $$invalidate(4, newFoodSatedValue = actorRequiredFood);
    } else {
      $$invalidate(4, newFoodSatedValue = actorFoodSatedValue + actorRequiredFood / 2);
    }
    calculateAmountOfItems();
    refreshConsumableItems();
  }
  __name(toggleAmountOfFood, "toggleAmountOfFood");
  function toggleAccessToWater() {
    $$invalidate(3, halfWater = hasAccessToWater ? externalWaterSourceAccess : false);
    toggleAmountOfWater();
  }
  __name(toggleAccessToWater, "toggleAccessToWater");
  function toggleAmountOfWater() {
    if (halfWater === "full") {
      $$invalidate(5, newWaterSatedValue = actorRequiredWater);
    } else {
      $$invalidate(5, newWaterSatedValue = actorWaterSatedValue + actorRequiredWater / 2);
    }
    calculateAmountOfItems();
    refreshConsumableItems();
  }
  __name(toggleAmountOfWater, "toggleAmountOfWater");
  async function dropData(event) {
    event.preventDefault();
    let drop;
    try {
      drop = JSON.parse(event.dataTransfer.getData("text/plain"));
    } catch (err) {
      return false;
    }
    if (drop.type !== "Item")
      return;
    const actor2 = drop.sceneId && drop.tokenId ? (await fromUuid(`Scene.${drop.sceneId}.Token.${drop.tokenId}`)).actor : game.actors.get(drop.actorId);
    if (!actor2)
      return;
    addConsumableItem(drop.data._id);
  }
  __name(dropData, "dropData");
  function addConsumableItem(itemId) {
    const item = actor.items.get(itemId);
    if (!item) {
      return;
    }
    const consumable = getProperty(item, CONSTANTS.FLAGS.CONSUMABLE);
    if (!consumable?.enabled)
      return;
    const usesLeft = getProperty(item, "system.uses.value");
    const maxUses = getProperty(item, "system.uses.max");
    if (usesLeft < 0.5) {
      return;
    }
    if (consumableItems.find((existingItem) => existingItem.id === item.id)) {
      return;
    }
    const typeIndex = { "both": 2, "food": 1, "water": 0 };
    const foodRequired = Math.max(0.5, actorRequiredFood - newFoodSatedValue);
    const waterRequired = Math.max(0.5, actorRequiredWater - newWaterSatedValue);
    const maxBothRequired = Math.max(foodRequired, waterRequired);
    const consumableItem = {
      id: item.id,
      item,
      index: typeIndex[consumable.type],
      fullName: `${item.name} (${localize("REST-RECOVERY.Misc." + capitalizeFirstLetter(consumable.type))}) - ${usesLeft} / ${maxUses}`,
      baseAmount: 0,
      amount: 0,
      usesLeft,
      consumable
    };
    switch (consumable.type) {
      case "both":
        consumableItem["baseAmount"] = maxBothRequired;
        consumableItem["amount"] = maxBothRequired;
        break;
      case "food":
        consumableItem["baseAmount"] = foodRequired;
        consumableItem["amount"] = foodRequired;
        break;
      case "water":
        consumableItem["baseAmount"] = waterRequired;
        consumableItem["amount"] = waterRequired;
        break;
    }
    consumableItem["amount"] = Math.min(usesLeft, consumableItem["amount"]);
    consumableItems.push(consumableItem);
    consumableItems.sort((a, b) => {
      if (a.index === b.index) {
        return b.name > a.name ? -1 : 1;
      }
      return b.index - a.index;
    });
    $$invalidate(6, consumableItems);
    calculateAmountOfItems();
    refreshConsumableItems();
  }
  __name(addConsumableItem, "addConsumableItem");
  function calculateAmountOfItems() {
    if (!hasAccessToFood) {
      $$invalidate(4, newFoodSatedValue = actorFoodSatedValue);
    }
    if (!hasAccessToWater) {
      $$invalidate(5, newWaterSatedValue = actorWaterSatedValue);
    }
    for (const item of consumableItems) {
      if (!hasAccessToFood && (item.consumable.type === "food" || item.consumable.type === "both")) {
        $$invalidate(4, newFoodSatedValue += item.amount);
      }
      if (!hasAccessToWater && (item.consumable.type === "water" || item.consumable.type === "both")) {
        $$invalidate(5, newWaterSatedValue += item.amount);
      }
    }
    $$invalidate(
      28,
      workflow.consumableData = {
        items: consumableItems,
        hasAccessToFood,
        hasAccessToWater,
        halfFood,
        halfWater
      },
      workflow
    );
  }
  __name(calculateAmountOfItems, "calculateAmountOfItems");
  function refreshConsumableItems() {
    $$invalidate(7, actorConsumableItems = getConsumableItemsFromActor(actor).filter((item) => !consumableItems.find((consumableItem) => consumableItem.id === item.id)));
    $$invalidate(8, selectedItem = actorConsumableItems.find((item) => item.id === selectedItem) ? selectedItem : actorConsumableItems[0]?.id ?? "");
  }
  __name(refreshConsumableItems, "refreshConsumableItems");
  function removeConsumableItem(index) {
    consumableItems.splice(index, 1);
    $$invalidate(6, consumableItems);
    calculateAmountOfItems();
    refreshConsumableItems();
  }
  __name(removeConsumableItem, "removeConsumableItem");
  const $$binding_groups = [[], []];
  function input_change_handler() {
    hasAccessToFood = this.checked;
    $$invalidate(0, hasAccessToFood);
  }
  __name(input_change_handler, "input_change_handler");
  function input0_change_handler() {
    halfFood = this.__value;
    $$invalidate(1, halfFood);
  }
  __name(input0_change_handler, "input0_change_handler");
  function input1_change_handler() {
    halfFood = this.__value;
    $$invalidate(1, halfFood);
  }
  __name(input1_change_handler, "input1_change_handler");
  function input_change_handler_1() {
    hasAccessToWater = this.checked;
    $$invalidate(2, hasAccessToWater);
  }
  __name(input_change_handler_1, "input_change_handler_1");
  function input0_change_handler_1() {
    halfWater = this.__value;
    $$invalidate(3, halfWater);
  }
  __name(input0_change_handler_1, "input0_change_handler_1");
  function input1_change_handler_1() {
    halfWater = this.__value;
    $$invalidate(3, halfWater);
  }
  __name(input1_change_handler_1, "input1_change_handler_1");
  function input_input_handler(each_value_1, index) {
    each_value_1[index].amount = to_number(this.value);
    $$invalidate(6, consumableItems);
  }
  __name(input_input_handler, "input_input_handler");
  const change_handler = /* @__PURE__ */ __name((item, each_value_1, index) => {
    $$invalidate(6, each_value_1[index].amount = Math.max(0.5, Math.min(item.usesLeft, roundHalf(item.amount))), consumableItems);
    calculateAmountOfItems();
  }, "change_handler");
  const click_handler = /* @__PURE__ */ __name((index) => {
    removeConsumableItem(index);
  }, "click_handler");
  function select_change_handler() {
    selectedItem = select_value(this);
    $$invalidate(8, selectedItem);
    $$invalidate(7, actorConsumableItems);
  }
  __name(select_change_handler, "select_change_handler");
  const click_handler_1 = /* @__PURE__ */ __name(() => {
    addConsumableItem(selectedItem);
  }, "click_handler_1");
  $$self.$$set = ($$props2) => {
    if ("workflow" in $$props2)
      $$invalidate(28, workflow = $$props2.workflow);
  };
  return [
    hasAccessToFood,
    halfFood,
    hasAccessToWater,
    halfWater,
    newFoodSatedValue,
    newWaterSatedValue,
    consumableItems,
    actorConsumableItems,
    selectedItem,
    enableAutomatedExhaustion,
    actorRequiredFood,
    actorRequiredWater,
    actorFoodSatedValue,
    actorWaterSatedValue,
    halfWaterSaveDC,
    actorExhaustion,
    actorDaysWithoutFood,
    actorExhaustionThreshold,
    externalFoodSourceAccess,
    externalWaterSourceAccess,
    toggleAccessToFood,
    toggleAmountOfFood,
    toggleAccessToWater,
    toggleAmountOfWater,
    dropData,
    addConsumableItem,
    calculateAmountOfItems,
    removeConsumableItem,
    workflow,
    input_change_handler,
    input0_change_handler,
    $$binding_groups,
    input1_change_handler,
    input_change_handler_1,
    input0_change_handler_1,
    input1_change_handler_1,
    input_input_handler,
    change_handler,
    click_handler,
    select_change_handler,
    click_handler_1
  ];
}
__name(instance$c, "instance$c");
class FoodWater extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$c, create_fragment$c, safe_not_equal, { workflow: 28 }, null, [-1, -1]);
  }
}
__name(FoodWater, "FoodWater");
function get_each_context$7(ctx, list, i) {
  const child_ctx = ctx.slice();
  child_ctx[5] = list[i][0];
  child_ctx[6] = list[i][1];
  child_ctx[8] = i;
  return child_ctx;
}
__name(get_each_context$7, "get_each_context$7");
function get_each_context_1$2(ctx, list, i) {
  const child_ctx = ctx.slice();
  child_ctx[9] = list[i];
  child_ctx[10] = list;
  child_ctx[11] = i;
  return child_ctx;
}
__name(get_each_context_1$2, "get_each_context_1$2");
function create_else_block$4(ctx) {
  let p;
  return {
    c() {
      p = element("p");
      p.textContent = `${localize("REST-RECOVERY.Dialogs.RestSteps.SpellRecovery.FullSpells")}`;
      attr(p, "class", "notes");
    },
    m(target, anchor) {
      insert(target, p, anchor);
    },
    p: noop,
    d(detaching) {
      if (detaching)
        detach(p);
    }
  };
}
__name(create_else_block$4, "create_else_block$4");
function create_if_block_1$6(ctx) {
  let each_blocks = [];
  let each_1_lookup = /* @__PURE__ */ new Map();
  let t0;
  let p;
  let t1_value = localize("REST-RECOVERY.Dialogs.RestSteps.SpellRecovery.SpellSlotsLeft", {
    spellSlotsLeft: ctx[0].pointsTotal - ctx[0].pointsSpent
  }) + "";
  let t1;
  let each_value = Object.entries(ctx[0].slots);
  const get_key = /* @__PURE__ */ __name((ctx2) => ctx2[8], "get_key");
  for (let i = 0; i < each_value.length; i += 1) {
    let child_ctx = get_each_context$7(ctx, each_value, i);
    let key = get_key(child_ctx);
    each_1_lookup.set(key, each_blocks[i] = create_each_block$7(key, child_ctx));
  }
  return {
    c() {
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].c();
      }
      t0 = space();
      p = element("p");
      t1 = text(t1_value);
      set_style(p, "font-style", "italic");
    },
    m(target, anchor) {
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].m(target, anchor);
      }
      insert(target, t0, anchor);
      insert(target, p, anchor);
      append(p, t1);
    },
    p(ctx2, dirty) {
      if (dirty & 3) {
        each_value = Object.entries(ctx2[0].slots);
        each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx2, each_value, each_1_lookup, t0.parentNode, destroy_block, create_each_block$7, t0, get_each_context$7);
      }
      if (dirty & 1 && t1_value !== (t1_value = localize("REST-RECOVERY.Dialogs.RestSteps.SpellRecovery.SpellSlotsLeft", {
        spellSlotsLeft: ctx2[0].pointsTotal - ctx2[0].pointsSpent
      }) + ""))
        set_data(t1, t1_value);
    },
    d(detaching) {
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].d(detaching);
      }
      if (detaching)
        detach(t0);
      if (detaching)
        detach(p);
    }
  };
}
__name(create_if_block_1$6, "create_if_block_1$6");
function create_if_block$8(ctx) {
  let p;
  let t_value = localize("REST-RECOVERY.Dialogs.RestSteps.SpellRecovery.NoFeatureUse", {
    featureName: ctx[0].feature.name
  }) + "";
  let t;
  return {
    c() {
      p = element("p");
      t = text(t_value);
      attr(p, "class", "notes");
    },
    m(target, anchor) {
      insert(target, p, anchor);
      append(p, t);
    },
    p(ctx2, dirty) {
      if (dirty & 1 && t_value !== (t_value = localize("REST-RECOVERY.Dialogs.RestSteps.SpellRecovery.NoFeatureUse", {
        featureName: ctx2[0].feature.name
      }) + ""))
        set_data(t, t_value);
    },
    d(detaching) {
      if (detaching)
        detach(p);
    }
  };
}
__name(create_if_block$8, "create_if_block$8");
function create_each_block_1$2(key_1, ctx) {
  let input;
  let input_disabled_value;
  let mounted;
  let dispose;
  function input_change_handler() {
    ctx[3].call(input, ctx[10], ctx[11]);
  }
  __name(input_change_handler, "input_change_handler");
  function change_handler(...args) {
    return ctx[4](ctx[5], ctx[11], ...args);
  }
  __name(change_handler, "change_handler");
  return {
    key: key_1,
    first: null,
    c() {
      input = element("input");
      attr(input, "type", "checkbox");
      input.disabled = input_disabled_value = ctx[9].disabled || ctx[9].alwaysDisabled;
      this.first = input;
    },
    m(target, anchor) {
      insert(target, input, anchor);
      input.checked = ctx[9].checked;
      if (!mounted) {
        dispose = [
          listen(input, "change", input_change_handler),
          listen(input, "change", change_handler)
        ];
        mounted = true;
      }
    },
    p(new_ctx, dirty) {
      ctx = new_ctx;
      if (dirty & 1 && input_disabled_value !== (input_disabled_value = ctx[9].disabled || ctx[9].alwaysDisabled)) {
        input.disabled = input_disabled_value;
      }
      if (dirty & 1) {
        input.checked = ctx[9].checked;
      }
    },
    d(detaching) {
      if (detaching)
        detach(input);
      mounted = false;
      run_all(dispose);
    }
  };
}
__name(create_each_block_1$2, "create_each_block_1$2");
function create_each_block$7(key_1, ctx) {
  let div3;
  let div2;
  let div0;
  let t0;
  let t1_value = ctx[5] + "";
  let t1;
  let t2;
  let t3;
  let div1;
  let each_blocks = [];
  let each_1_lookup = /* @__PURE__ */ new Map();
  let each_value_1 = ctx[6];
  const get_key = /* @__PURE__ */ __name((ctx2) => ctx2[11], "get_key");
  for (let i = 0; i < each_value_1.length; i += 1) {
    let child_ctx = get_each_context_1$2(ctx, each_value_1, i);
    let key = get_key(child_ctx);
    each_1_lookup.set(key, each_blocks[i] = create_each_block_1$2(key, child_ctx));
  }
  return {
    key: key_1,
    first: null,
    c() {
      div3 = element("div");
      div2 = element("div");
      div0 = element("div");
      t0 = text("Level ");
      t1 = text(t1_value);
      t2 = text(":");
      t3 = space();
      div1 = element("div");
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].c();
      }
      set_style(div0, "margin-right", "5px");
      set_style(div0, "flex", "0 1 auto");
      set_style(div1, "flex", "0 1 auto");
      attr(div2, "class", "form-fields");
      set_style(div2, "justify-content", "flex-start");
      attr(div3, "class", "form-group");
      this.first = div3;
    },
    m(target, anchor) {
      insert(target, div3, anchor);
      append(div3, div2);
      append(div2, div0);
      append(div0, t0);
      append(div0, t1);
      append(div0, t2);
      append(div2, t3);
      append(div2, div1);
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].m(div1, null);
      }
    },
    p(new_ctx, dirty) {
      ctx = new_ctx;
      if (dirty & 1 && t1_value !== (t1_value = ctx[5] + ""))
        set_data(t1, t1_value);
      if (dirty & 3) {
        each_value_1 = ctx[6];
        each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value_1, each_1_lookup, div1, destroy_block, create_each_block_1$2, null, get_each_context_1$2);
      }
    },
    d(detaching) {
      if (detaching)
        detach(div3);
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].d();
      }
    }
  };
}
__name(create_each_block$7, "create_each_block$7");
function create_fragment$b(ctx) {
  let div;
  let label;
  let t0_value = localize(
    "REST-RECOVERY.Dialogs.RestSteps.SpellRecovery." + (ctx[0].feature ? "SpellSlotFeature" : "SpellSlotRule"),
    {
      featureName: ctx[0]?.feature?.name ?? ""
    }
  ) + "";
  let t0;
  let t1;
  let if_block_anchor;
  function select_block_type(ctx2, dirty) {
    if (ctx2[0].missingSlots && ctx2[0].feature && !ctx2[0].has_feature_use)
      return create_if_block$8;
    if (ctx2[0].missingSlots)
      return create_if_block_1$6;
    return create_else_block$4;
  }
  __name(select_block_type, "select_block_type");
  let current_block_type = select_block_type(ctx);
  let if_block = current_block_type(ctx);
  return {
    c() {
      div = element("div");
      label = element("label");
      t0 = text(t0_value);
      t1 = space();
      if_block.c();
      if_block_anchor = empty();
      attr(div, "class", "form-group");
    },
    m(target, anchor) {
      insert(target, div, anchor);
      append(div, label);
      append(label, t0);
      insert(target, t1, anchor);
      if_block.m(target, anchor);
      insert(target, if_block_anchor, anchor);
    },
    p(ctx2, [dirty]) {
      if (dirty & 1 && t0_value !== (t0_value = localize(
        "REST-RECOVERY.Dialogs.RestSteps.SpellRecovery." + (ctx2[0].feature ? "SpellSlotFeature" : "SpellSlotRule"),
        {
          featureName: ctx2[0]?.feature?.name ?? ""
        }
      ) + ""))
        set_data(t0, t0_value);
      if (current_block_type === (current_block_type = select_block_type(ctx2)) && if_block) {
        if_block.p(ctx2, dirty);
      } else {
        if_block.d(1);
        if_block = current_block_type(ctx2);
        if (if_block) {
          if_block.c();
          if_block.m(if_block_anchor.parentNode, if_block_anchor);
        }
      }
    },
    i: noop,
    o: noop,
    d(detaching) {
      if (detaching)
        detach(div);
      if (detaching)
        detach(t1);
      if_block.d(detaching);
      if (detaching)
        detach(if_block_anchor);
    }
  };
}
__name(create_fragment$b, "create_fragment$b");
function instance$b($$self, $$props, $$invalidate) {
  let { workflow } = $$props;
  let spellData = workflow.spellData;
  function spendSpellPoint(event, level) {
    workflow.spendSpellPoint(level, event.target.checked);
    $$invalidate(0, spellData = workflow.spellData);
  }
  __name(spendSpellPoint, "spendSpellPoint");
  function input_change_handler(each_value_1, slotIndex) {
    each_value_1[slotIndex].checked = this.checked;
    $$invalidate(0, spellData);
  }
  __name(input_change_handler, "input_change_handler");
  const change_handler = /* @__PURE__ */ __name((level, slotIndex, event) => {
    spendSpellPoint(event, level);
  }, "change_handler");
  $$self.$$set = ($$props2) => {
    if ("workflow" in $$props2)
      $$invalidate(2, workflow = $$props2.workflow);
  };
  return [spellData, spendSpellPoint, workflow, input_change_handler, change_handler];
}
__name(instance$b, "instance$b");
class SpellRecovery extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$b, create_fragment$b, safe_not_equal, { workflow: 2 });
  }
}
__name(SpellRecovery, "SpellRecovery");
const rests = /* @__PURE__ */ new Map();
class RestWorkflow {
  static itemsListened = /* @__PURE__ */ new Map();
  constructor(actor, longRest) {
    this.actor = actor;
    this.longRest = longRest;
    this.finished = false;
    this.preRestRegainHitDice = false;
    this.restVariant = game.settings.get("dnd5e", "restVariant");
    this.spellSlotsRegainedMessage = "";
    this.hitDiceMessage = "";
    this.itemsRegainedMessages = [];
    this.resourcesRegainedMessages = [];
    this.foodAndWaterMessage = [];
    this.steps = [];
    this.consumableData = { items: [] };
  }
  static get LongRestItemNameHandlers() {
    return {
      [getSetting(CONSTANTS.SETTINGS.POWER_SURGE, true)]: "_handlePowerSurgeFeature"
    };
  }
  get maxHP() {
    return this.actor.system.attributes.hp.max + (this.actor.system.attributes.hp.tempmax ?? 0);
  }
  get currHP() {
    return this.actor.system.attributes.hp.value;
  }
  get healthPercentage() {
    return this.currHP / this.maxHP;
  }
  get healthRegained() {
    return this.currHP - this.healthData.startingHealth;
  }
  get totalHitDice() {
    return this.actor.system.attributes.hd;
  }
  get recoveredSlots() {
    return Object.fromEntries(Object.entries(this.spellData.slots).map((entry) => {
      return [entry[0], entry[1] ? entry[1].reduce((acc, slot) => {
        return acc + (slot.empty && slot.checked ? 1 : 0);
      }, 0) : 0];
    }).filter((entry) => entry[1]));
  }
  static initialize() {
    Hooks.on("dnd5e.restCompleted", (actor) => {
      RestWorkflow.remove(actor);
    });
    Hooks.on("preUpdateActor", (actor, data) => {
      if (!getSetting(CONSTANTS.SETTINGS.AUTOMATE_EXHAUSTION))
        return;
      const exhaustion = getProperty(data, "system.attributes.exhaustion");
      if (exhaustion === void 0)
        return;
      return plugins.handleExhaustion(actor, data);
    });
    let cachedDenomination = false;
    Hooks.on("dnd5e.preRollHitDie", (actor, config, denomination) => {
      const workflow = RestWorkflow.get(actor);
      if (!workflow)
        return;
      cachedDenomination = denomination;
      const periapt = getSetting(CONSTANTS.SETTINGS.PERIAPT_ITEM) ? actor.items.getName(getSetting(CONSTANTS.SETTINGS.PERIAPT_ITEM, true)) : false;
      const blessing = getSetting(CONSTANTS.SETTINGS.WOUND_CLOSURE_BLESSING) ? actor.items.getName(getSetting(CONSTANTS.SETTINGS.WOUND_CLOSURE_BLESSING, true)) : false;
      const hasWoundClosure = periapt && periapt?.system?.attunement === 2 || blessing && blessing?.type === "feat";
      const durable = getSetting(CONSTANTS.SETTINGS.DURABLE_FEAT) ? actor.items.getName(getSetting(CONSTANTS.SETTINGS.DURABLE_FEAT, true)) : false;
      const isDurable = durable && durable?.type === "feat";
      const blackBlood = getSetting(CONSTANTS.SETTINGS.BLACK_BLOOD_FEATURE) ? actor.items.getName(getSetting(CONSTANTS.SETTINGS.BLACK_BLOOD_FEATURE, true)) : false;
      const hasBlackBlood = blackBlood && blackBlood?.type === "feat";
      const conMod = actor.system.abilities.con.mod;
      const durableMod = Math.max(2, conMod * 2);
      const forceMaxRoll = getProperty(actor, CONSTANTS.FLAGS.DAE.MAXIMISE_HIT_DIE_ROLL);
      let formula = !forceMaxRoll ? "1" + denomination : denomination.slice(1);
      if (hasBlackBlood) {
        formula += "r<3";
      }
      if (hasWoundClosure) {
        formula = "(" + formula + "*2)";
      }
      formula += "+@abilities.con.mod";
      const hitDiceBonus = actor.getFlag("dnd5e", "hitDieBonus") ?? 0;
      if (hitDiceBonus) {
        formula += `+${hitDiceBonus}`;
      }
      if (isDurable) {
        formula = `{${formula},${durableMod}}kh`;
      }
      config.formula = `max(0, ${formula})`;
    });
    Hooks.on("dnd5e.rollHitDie", (actor, roll, updates) => {
      const workflow = RestWorkflow.get(actor);
      if (!workflow)
        return;
      const denomination = cachedDenomination;
      const hitDice = updates.class["system.hitDiceUsed"] - 1;
      const clsItem = actor.items.find((i) => {
        return i.system.hitDice === denomination && i.system.hitDiceUsed === hitDice;
      });
      if (!clsItem)
        return;
      const bufferDice = getProperty(clsItem, CONSTANTS.FLAGS.HIT_DICE_BUFFER_FLAG);
      if ((bufferDice ?? 0) > 0) {
        delete updates.class["system.hitDiceUsed"];
        updates.class[CONSTANTS.FLAGS.HIT_DICE_BUFFER_FLAG] = bufferDice - 1;
      } else if (bufferDice === 0) {
        updates.class[`-=${CONSTANTS.FLAGS.HIT_DICE_BUFFER_FLAG}`] = null;
      }
    });
    this._setupFoodListeners();
  }
  static get(actor) {
    return rests.get(actor.uuid);
  }
  static remove(actor) {
    rests.delete(actor.uuid);
  }
  static make(actor, longRest = false) {
    this.remove(actor);
    const workflow = new this(actor, longRest);
    rests.set(actor.uuid, workflow);
    return workflow.setup();
  }
  setup() {
    this.fetchHealthData();
    this.fetchFeatures();
    this.fetchSpellData();
    this.determineSteps();
    return this;
  }
  determineSteps() {
    const hasSpells = Object.values(this.actor.classes).some((cls) => !["none", "pact"].includes(cls.system.spellcasting.progression));
    this.steps = [
      {
        title: "REST-RECOVERY.Dialogs.RestSteps.Rest.Title",
        required: true
      },
      {
        title: "REST-RECOVERY.Dialogs.RestSteps.FoodWater.Title",
        required: getSetting(CONSTANTS.SETTINGS.ENABLE_FOOD_AND_WATER) && (this.longRest || this.restVariant === "gritty") && this.foodWaterRequirement.actorRequiredFood > 0 && this.foodWaterRequirement.actorRequiredWater > 0,
        component: FoodWater
      },
      {
        title: "REST-RECOVERY.Dialogs.RestSteps.SpellRecovery.Title",
        required: hasSpells && this.spellData.missingSlots && (!this.longRest && this.spellData.feature || this.longRest && getSetting(CONSTANTS.SETTINGS.LONG_CUSTOM_SPELL_RECOVERY)),
        component: SpellRecovery
      }
    ].filter((step) => step.required);
  }
  fetchHealthData() {
    const actorHasNonLightArmor = !!this.actor.items.find((item) => item.type === "equipment" && ["heavy", "medium"].indexOf(item.system?.armor?.type) > -1 && item.system.equipped);
    this.healthData = {
      level: this.actor.system.details.level,
      startingHitDice: this.actor.system.attributes.hd,
      startingHealth: this.actor.system.attributes.hp.value,
      hitDiceSpent: 0,
      hitPointsToRegainFromRest: 0,
      hitPointsToRegain: 0,
      enableAutoRollHitDice: false,
      hasNonLightArmor: actorHasNonLightArmor && getSetting(CONSTANTS.SETTINGS.LONG_REST_ARMOR_AUTOMATION),
      removeNonLightArmor: !(actorHasNonLightArmor && getSetting(CONSTANTS.SETTINGS.LONG_REST_ARMOR_AUTOMATION))
    };
    const longRestRollHitDice = this.longRest && getSetting(CONSTANTS.SETTINGS.LONG_REST_ROLL_HIT_DICE);
    const longRestNotFullHitPoints = longRestRollHitDice && getSetting(CONSTANTS.SETTINGS.HP_MULTIPLIER) !== CONSTANTS.FRACTIONS.FULL;
    if (!this.longRest || longRestRollHitDice || longRestNotFullHitPoints) {
      let { hitPointsToRegainFromRest } = this.actor._getRestHitPointRecovery();
      this.healthData.hitPointsToRegainFromRest = hitPointsToRegainFromRest;
    }
    this.foodWaterRequirement = getActorConsumableValues(this.actor, this.longRest && this.restVariant === "gritty");
    this.refreshHealthData();
  }
  refreshHealthData() {
    this.healthData.availableHitDice = this.getHitDice();
    this.healthData.totalHitDice = this.totalHitDice;
    if (getSetting(CONSTANTS.SETTINGS.ENABLE_AUTO_ROLL_HIT_DICE)) {
      let avgHitDiceRegain = this.getAverageHitDiceRoll();
      let missingHP = this.maxHP - this.currHP;
      let probableHitDiceLeftToRoll = Math.floor(missingHP / avgHitDiceRegain);
      this.healthData.enableAutoRollHitDice = this.currHP + this.healthData.hitPointsToRegainFromRest < this.maxHP && probableHitDiceLeftToRoll > 0 && this.healthData.totalHitDice > 0;
    }
  }
  getHitDice() {
    return this.actor.items.reduce((hd, item) => {
      if (item.type === "class") {
        const d = item.system;
        const denom = d.hitDice || "d6";
        let available = parseInt(d.levels || 1) - parseInt(d.hitDiceUsed || 0);
        if (this.longRest && getSetting(CONSTANTS.SETTINGS.PRE_REST_REGAIN_BUFFER)) {
          const hitDiceBuffer = getProperty(item, CONSTANTS.FLAGS.HIT_DICE_BUFFER_FLAG) ?? 0;
          available += hitDiceBuffer;
        }
        hd[denom] = denom in hd ? hd[denom] + available : available;
      }
      return hd;
    }, {});
  }
  fetchSpellData() {
    this.spellData = {
      slots: {},
      missingSlots: false,
      feature: false,
      pointsSpent: 0,
      pointsTotal: 0,
      className: ""
    };
    for (let [level, slot] of Object.entries(this.actor.system.spells)) {
      if (!slot.max && !slot.override || level === "pact") {
        continue;
      }
      let levelNum = Number(level.substr(5));
      if (!this.longRest && Number(levelNum) > 5) {
        break;
      }
      this.spellData.slots[levelNum] = [];
      for (let i = 0; i < slot.max; i++) {
        this.spellData.slots[levelNum].push({
          checked: i < slot.value,
          disabled: false,
          alwaysDisabled: i < slot.value,
          empty: i >= slot.value
        });
        this.spellData.missingSlots = this.spellData.missingSlots || i >= slot.value;
      }
    }
    if (this.longRest && getSetting(CONSTANTS.SETTINGS.LONG_CUSTOM_SPELL_RECOVERY)) {
      const actorSpecificFormula = this.actor.getFlag("dnd5e", "longRestSpellPointsFormula") || false;
      const formula = actorSpecificFormula || getSetting(CONSTANTS.SETTINGS.LONG_SPELLS_MULTIPLIER_FORMULA);
      this.spellData.pointsTotal = evaluateFormula(
        formula || "ceil(min(17, @details.level+1)/2)*2",
        this.actor.getRollData(),
        false
      )?.total + (this.actor.getFlag("dnd5e", "longRestSpellPointsBonus") ?? 0);
      return;
    }
    const wizardLevel = this.actor.items.find((item) => {
      return item.type === "class" && item.name === getSetting(CONSTANTS.SETTINGS.WIZARD_CLASS, true);
    })?.system?.levels || 0;
    const wizardFeature = this.actor.items.getName(getSetting(CONSTANTS.SETTINGS.ARCANE_RECOVERY, true)) || false;
    const druidLevel = this.actor.items.find((item) => {
      return item.type === "class" && item.system.levels >= 2 && item.name === getSetting(CONSTANTS.SETTINGS.DRUID_CLASS, true);
    })?.system?.levels || 0;
    const druidFeature = this.actor.items.getName(getSetting(CONSTANTS.SETTINGS.NATURAL_RECOVERY, true)) ?? false;
    const wizardFeatureUse = wizardLevel && wizardFeature && this.patchSpellFeature(wizardFeature, "wizard");
    const druidFeatureUse = druidLevel && druidFeature && this.patchSpellFeature(druidFeature, "druid");
    if (wizardFeature && (wizardLevel > druidLevel || druidLevel > wizardLevel && !druidFeatureUse)) {
      this.spellData.has_feature_use = wizardFeatureUse;
      this.spellData.feature = wizardFeature;
      this.spellData.pointsTotal = wizardFeature ? evaluateFormula(wizardFeature.system.formula || "ceil(@classes.wizard.levels/2)", this.actor.getRollData())?.total : 0;
      this.spellData.className = getSetting(CONSTANTS.SETTINGS.WIZARD_CLASS, true);
    } else if (druidFeature && (druidLevel > wizardLevel || wizardLevel > druidLevel && !wizardFeatureUse)) {
      this.spellData.has_feature_use = druidFeatureUse;
      this.spellData.feature = druidFeature;
      this.spellData.pointsTotal = druidFeature ? evaluateFormula(druidFeature.system.formula || "ceil(@classes.druid.levels/2)", this.actor.getRollData())?.total : 0;
      this.spellData.className = getSetting(CONSTANTS.SETTINGS.DRUID_CLASS, true);
    }
  }
  patchSpellFeature(feature, className) {
    if (feature && (feature.system.activation.type !== "special" || feature.system.uses.value === null || feature.system.uses.max === null || feature.system.uses.per !== "lr" || feature.system.actionType !== "util" || feature.system.formula === "")) {
      this.actor.updateEmbeddedDocuments("Item", [{
        _id: feature.id,
        "system.activation.type": "special",
        "system.uses.value": feature.system.uses.value ?? 1,
        "system.uses.max": 1,
        "system.uses.per": "lr",
        "system.actionType": "util",
        "system.formula": `ceil(@classes.${className.toLowerCase()}.levels/2)`
      }]);
      ui.notifications.info("Rest Recovery for 5e | " + game.i18n.format("REST-RECOVERY.PatchedRecovery", {
        actorName: this.actor.name,
        recoveryName: this.spellData.feature.name
      }));
      return (feature.system.uses.value ?? 1) > 0;
    }
    return feature.system.uses.value > 0;
  }
  fetchFeatures() {
    this.features = {
      bard: false,
      bardFeature: false,
      usedBardFeature: false,
      chef: false,
      usedChef: false
    };
    const ignoreInactivePlayers = getSetting(CONSTANTS.SETTINGS.IGNORE_INACTIVE_PLAYERS);
    let bardLevel = false;
    let characters = game.actors.filter((actor) => actor.type === "character" && actor.hasPlayerOwner);
    for (let actor of characters) {
      if (actor.system.attributes.hp.value <= 0)
        continue;
      if (ignoreInactivePlayers) {
        let found = game.users.find((user) => {
          return actor === user.character && user.active;
        });
        if (!found)
          continue;
      }
      const bardClass = actor.items.find((item) => item.type === "class" && item.name === getSetting(CONSTANTS.SETTINGS.BARD_CLASS, true));
      if (bardClass) {
        const songOfRest = actor.items.find((item) => item.name.startsWith(getSetting(CONSTANTS.SETTINGS.SONG_OF_REST, true)));
        if (songOfRest) {
          const level = bardClass.system.levels;
          if (level > bardLevel) {
            bardLevel = level;
            this.features.bard = actor;
            this.features.bardFeature = songOfRest;
          }
        }
      }
      const chefFeat = actor.items.find((item) => item.name.startsWith(getSetting(CONSTANTS.SETTINGS.CHEF_FEAT, true)));
      const chefTools = getSetting(CONSTANTS.SETTINGS.CHEF_TOOLS, true) !== "" ? actor.items.find((item) => item.name.startsWith(getSetting(CONSTANTS.SETTINGS.CHEF_TOOLS, true))) : true;
      if (chefFeat && chefTools) {
        if (!this.features.chef) {
          this.features.chef = [];
        }
        this.features.chef.push(actor);
      }
    }
  }
  async autoSpendHitDice() {
    let avgHitDiceRegain = this.getAverageHitDiceRoll();
    let missingHP = this.maxHP - this.currHP;
    let probableHitDiceLeftToRoll = Math.floor(missingHP / avgHitDiceRegain);
    let minSpendHitDice = 0;
    let maxSpendHitDice = Infinity;
    if (this.longRest) {
      const maxHitDiceSpendMultiplier = determineMultiplier(CONSTANTS.SETTINGS.LONG_MAX_HIT_DICE_SPEND);
      maxSpendHitDice = typeof maxHitDiceSpendMultiplier === "string" ? Math.floor(evaluateFormula(maxHitDiceSpendMultiplier, this.actor.getRollData())?.total ?? 0) : Math.floor(this.actor.system.details.level * maxHitDiceSpendMultiplier);
    } else {
      minSpendHitDice = getSetting(CONSTANTS.SETTINGS.MIN_HIT_DIE_SPEND) || 0;
      const maxHitDiceSpendMultiplier = determineMultiplier(CONSTANTS.SETTINGS.MAX_HIT_DICE_SPEND);
      maxSpendHitDice = typeof maxHitDiceSpendMultiplier === "string" ? Math.floor(evaluateFormula(maxHitDiceSpendMultiplier, this.actor.getRollData())?.total ?? 0) : Math.floor(this.actor.system.details.level * maxHitDiceSpendMultiplier);
      maxSpendHitDice = Math.max(minSpendHitDice, maxSpendHitDice);
    }
    while (missingHP && probableHitDiceLeftToRoll > 0 && this.healthData.totalHitDice > 0 && avgHitDiceRegain > 0) {
      if (this.healthData.hitDiceSpent >= maxSpendHitDice)
        break;
      avgHitDiceRegain = this.getAverageHitDiceRoll();
      await this.rollHitDice(void 0, false);
      missingHP = this.maxHP - this.currHP;
      probableHitDiceLeftToRoll = Math.floor(missingHP / avgHitDiceRegain);
    }
    this.refreshHealthData();
  }
  getAverageHitDiceRoll() {
    const availableHitDice = Object.entries(this.healthData.availableHitDice).filter((entry) => entry[1]);
    if (!availableHitDice.length)
      return 0;
    const periapt = getSetting(CONSTANTS.SETTINGS.PERIAPT_ITEM) ? this.actor.items.getName(getSetting(CONSTANTS.SETTINGS.PERIAPT_ITEM, true)) : false;
    const blessing = getSetting(CONSTANTS.SETTINGS.WOUND_CLOSURE_BLESSING) ? this.actor.items.getName(getSetting(CONSTANTS.SETTINGS.WOUND_CLOSURE_BLESSING, true)) : false;
    const periapt_mod = periapt && periapt?.system?.attunement === 2 || blessing && blessing?.type === "feat" ? 3 : 1;
    let durable = getSetting(CONSTANTS.SETTINGS.DURABLE_FEAT) ? this.actor.items.getName(getSetting(CONSTANTS.SETTINGS.DURABLE_FEAT, true)) : false;
    durable = durable && durable?.type === "feat";
    let blackBlood = getSetting(CONSTANTS.SETTINGS.BLACK_BLOOD_FEATURE) ? this.actor.items.getName(getSetting(CONSTANTS.SETTINGS.BLACK_BLOOD_FEATURE, true)) : false;
    blackBlood = blackBlood && blackBlood?.type === "feat";
    const conMod = this.actor.system.abilities.con.mod;
    const totalHitDice = availableHitDice.reduce((acc, entry) => acc + entry[1], 0);
    return availableHitDice.map((entry) => {
      const dieSize = Number(entry[0].split("d")[1]);
      let average = dieSize / 2 + 0.5;
      if (blackBlood) {
        average = Array.from(Array(dieSize).keys()).reduce((acc, num) => acc + Math.max(average, num + 1), 0) / dieSize;
      }
      average *= periapt_mod;
      if (durable) {
        if (conMod <= 0) {
          average += (-2 * conMod + 1) / dieSize;
        } else {
          average += (conMod - 1) * conMod / (2 * dieSize);
        }
      }
      return average * entry[1];
    }).reduce((acc, num) => acc + num, 0) / totalHitDice;
  }
  async rollHitDice(hitDice, dialog) {
    const roll = await this.actor.rollHitDie(hitDice, { dialog });
    if (!roll)
      return;
    this.healthData.availableHitDice = this.getHitDice();
    this.healthData.totalHitDice = this.totalHitDice;
    this.healthData.hitDiceSpent++;
    if (this.longRest)
      return true;
    let hpRegained = 0;
    if (!this.features.usedSongOfRest && this.features.bardFeature) {
      const formula = getProperty(this.features.bardFeature, "system.damage.parts")?.[0]?.[0] ?? "1@scale.bard.song-of-rest";
      const roll2 = evaluateFormula(formula, this.features.bard.getRollData());
      hpRegained += roll2.total;
      const isOwnBard = this.features.bard === this.actor;
      await roll2.toMessage({
        flavor: game.i18n.format("REST-RECOVERY.Chat.SongOfRest" + (isOwnBard ? "Self" : ""), {
          name: this.actor.name,
          bard: this.features.bard.name
        }),
        speaker: ChatMessage.getSpeaker({ actor: this.actor })
      });
      this.features.usedSongOfRest = true;
    }
    if (this.features.chef.length > 0 && !this.features.usedChef) {
      const chefActor = this.features.chef[Math.floor(Math.random() * this.features.chef.length)];
      const roll2 = new Roll("1d8").evaluate({ async: false });
      hpRegained += roll2.total;
      await roll2.toMessage({
        flavor: game.i18n.format("REST-RECOVERY.Chat.Chef" + (chefActor === this.actor ? "Self" : ""), {
          name: this.actor.name,
          chef: chefActor.name
        }),
        speaker: ChatMessage.getSpeaker({ actor: this.actor })
      });
      this.features.usedChef = true;
    }
    if (hpRegained > 0) {
      const curHP = this.actor.system.attributes.hp.value;
      const maxHP = this.actor.system.attributes.hp.max + (this.actor.system.attributes.hp.tempmax ?? 0 ?? 0);
      await this.actor.update({ "system.attributes.hp.value": Math.min(maxHP, curHP + hpRegained) });
    }
    return true;
  }
  spendSpellPoint(level, add) {
    this.spellData.pointsSpent += Number(level) * (add ? 1 : -1);
    const pointsLeft = this.spellData.pointsTotal - this.spellData.pointsSpent;
    for (let level2 of Object.keys(this.spellData.slots)) {
      for (let i = 0; i < this.spellData.slots[level2].length; i++) {
        const slot = this.spellData.slots[level2][i];
        this.spellData.slots[level2][i].disabled = slot.alwaysDisabled || Number(level2) > pointsLeft && !slot.checked;
      }
    }
  }
  static wrapperFn(actor, wrapped, args, fnName) {
    const workflow = this.get(actor);
    let updates = wrapped(args);
    if (workflow && workflow[fnName]) {
      updates = workflow[fnName](updates, args);
    }
    return updates;
  }
  static async asyncWrappedFn(actor, wrapped, args, fnName) {
    const workflow = this.get(actor);
    let updates = await wrapped(args);
    if (workflow && workflow[fnName]) {
      updates = workflow[fnName](updates, args);
    }
    return updates;
  }
  async regainHitDice() {
    if (!getSetting(CONSTANTS.SETTINGS.PRE_REST_REGAIN_HIT_DICE))
      return;
    const maxHitDice = this._getMaxHitDiceRecovery();
    this.preRestRegainHitDice = true;
    let { updates, hitDiceRecovered } = this.actor._getRestHitDiceRecovery({ maxHitDice });
    this.preRestRegainHitDice = false;
    let hitDiceLeftToRecover = Math.max(0, maxHitDice - hitDiceRecovered);
    if (hitDiceLeftToRecover > 0) {
      const sortedClasses = Object.values(this.actor.classes).sort((a, b) => {
        return (parseInt(b.system.hitDice.slice(1)) || 0) - (parseInt(a.system.hitDice.slice(1)) || 0);
      });
      const biggestClass = sortedClasses[0];
      updates.push({
        _id: biggestClass.id,
        [CONSTANTS.FLAGS.HIT_DICE_BUFFER_FLAG]: hitDiceLeftToRecover
      });
    }
    await this.actor.updateEmbeddedDocuments("Item", updates);
    this.healthData.availableHitDice = this.getHitDice();
    this.healthData.totalHitDice = this.totalHitDice;
  }
  _finishedRest() {
    let updates = {};
    const maxShortRests = getSetting(CONSTANTS.SETTINGS.MAX_SHORT_RESTS) || 0;
    if (maxShortRests > 0) {
      if (this.longRest) {
        updates[CONSTANTS.FLAGS.CURRENT_NUM_SHORT_RESTS] = 0;
      } else {
        const currentShortRests = getProperty(this.actor, CONSTANTS.FLAGS.CURRENT_NUM_SHORT_RESTS) || 0;
        updates[CONSTANTS.FLAGS.CURRENT_NUM_SHORT_RESTS] = currentShortRests + 1;
      }
    }
    const maxHitDice = this._getMaxHitDiceRecovery();
    let { hitDiceRecovered } = this.actor._getRestHitDiceRecovery();
    if (this.longRest) {
      if (this.healthData.hitDiceSpent > 0 && hitDiceRecovered === 0 && getSetting(CONSTANTS.SETTINGS.PREVENT_REST_REGAIN_HIT_DICE)) {
        this.hitDiceMessage = game.i18n.localize("REST-RECOVERY.Chat.PreventedHitDiceRecovery");
      } else if (getSetting(CONSTANTS.SETTINGS.LONG_REST_ARMOR_AUTOMATION) && getSetting(CONSTANTS.SETTINGS.LONG_REST_ARMOR_HIT_DICE)) {
        const armor = this.actor.items.find((item) => item.type === "equipment" && ["heavy", "medium"].indexOf(item.system?.armor?.type) > -1 && item.system.equipped);
        if (armor) {
          if (!this.healthData.removeNonLightArmor) {
            if (maxHitDice === 0) {
              this.hitDiceMessage = game.i18n.localize("REST-RECOVERY.Chat.NoHitDiceArmor");
            } else if (hitDiceRecovered) {
              this.hitDiceMessage = game.i18n.localize("REST-RECOVERY.Chat.HitDiceArmor");
            }
          } else {
            this.hitDiceMessage = game.i18n.localize("REST-RECOVERY.Chat.HitDiceNoArmor");
          }
        }
      }
    }
    return updates;
  }
  async _handleExhaustion(updates) {
    if (!(this.longRest || this.restVariant === "gritty"))
      return updates;
    let actorInitialExhaustion = getProperty(this.actor, "system.attributes.exhaustion") ?? 0;
    let actorExhaustion = actorInitialExhaustion;
    let exhaustionGain = false;
    let exhaustionSave = false;
    let exhaustionToRemove = 1;
    if (getSetting(CONSTANTS.SETTINGS.ENABLE_FOOD_AND_WATER)) {
      let {
        actorRequiredFood,
        actorRequiredWater,
        actorFoodSatedValue,
        actorWaterSatedValue
      } = getActorConsumableValues(this.actor);
      let actorDaysWithoutFood = getProperty(this.actor, CONSTANTS.FLAGS.STARVATION) ?? 0;
      const items = this.consumableData.items.filter((item) => item.amount);
      let foodItems = items.filter((item) => item.consumable.type === "both" || item.consumable.type === "food");
      let waterItems = items.filter((item) => item.consumable.type === "both" || item.consumable.type === "water");
      if (actorRequiredFood) {
        let localize2 = "REST-RECOVERY.Chat.Food";
        let actorExhaustionThreshold = evaluateFormula(
          getSetting(CONSTANTS.SETTINGS.NO_FOOD_DURATION_MODIFIER),
          this.actor.getRollData()
        )?.total ?? 4;
        if (this.consumableData.hasAccessToFood) {
          if (actorFoodSatedValue >= actorRequiredFood / 2) {
            localize2 += actorFoodSatedValue >= actorRequiredFood ? "Full" : "Half";
          } else {
            localize2 += "None";
          }
          localize2 += capitalizeFirstLetter(this.consumableData.halfFood);
          actorFoodSatedValue += this.consumableData.halfFood === "full" ? actorRequiredFood : actorRequiredFood / 2;
        } else {
          actorFoodSatedValue += foodItems.reduce((acc, item) => {
            acc += item.consumable.dayWorth ? 1e11 : item.amount;
            return acc;
          }, actorFoodSatedValue);
          if (actorFoodSatedValue >= actorRequiredFood / 2) {
            localize2 += actorFoodSatedValue >= actorRequiredFood ? "Full" : "Half";
          } else {
            localize2 += "None";
          }
          localize2 += "None";
        }
        this.foodAndWaterMessage.push(game.i18n.localize(localize2));
        actorFoodSatedValue = Math.min(actorRequiredFood, actorFoodSatedValue);
        if (getSetting(CONSTANTS.SETTINGS.AUTOMATE_FOODWATER_EXHAUSTION)) {
          if (actorFoodSatedValue <= actorRequiredFood / 2) {
            exhaustionToRemove = 0;
            actorDaysWithoutFood += actorFoodSatedValue === 0 ? 1 : 0.5;
          } else {
            actorDaysWithoutFood = 0;
          }
          if (actorDaysWithoutFood > actorExhaustionThreshold) {
            actorExhaustion++;
            exhaustionGain = true;
          }
          updates[CONSTANTS.FLAGS.STARVATION] = actorDaysWithoutFood;
        }
      }
      if (actorRequiredWater) {
        let localize2 = "REST-RECOVERY.Chat.Water";
        if (this.consumableData.hasAccessToWater) {
          if (actorWaterSatedValue >= actorRequiredWater / 2) {
            localize2 += actorWaterSatedValue >= actorRequiredWater ? "Full" : "Half";
          } else {
            localize2 += "None";
          }
          localize2 += capitalizeFirstLetter(this.consumableData.halfWater);
          actorWaterSatedValue += this.consumableData.halfWater === "full" ? actorRequiredWater : actorRequiredWater / 2;
        } else {
          actorWaterSatedValue = waterItems.reduce((acc, item) => {
            acc += item.consumable.dayWorth ? actorRequiredWater : item.amount;
            return acc;
          }, actorWaterSatedValue);
          if (actorWaterSatedValue >= actorRequiredWater / 2) {
            localize2 += actorWaterSatedValue >= actorRequiredWater ? "Full" : "Half";
          } else {
            localize2 += "None";
          }
          localize2 += "None";
        }
        this.foodAndWaterMessage.push(game.i18n.localize(localize2));
        actorWaterSatedValue = Math.min(actorRequiredWater, actorWaterSatedValue);
        if (actorWaterSatedValue < actorRequiredWater && getSetting(CONSTANTS.SETTINGS.AUTOMATE_FOODWATER_EXHAUSTION)) {
          if (actorWaterSatedValue < actorRequiredWater / 2) {
            actorExhaustion += actorExhaustion > 0 ? 2 : 1;
            exhaustionGain = true;
            exhaustionToRemove = 0;
          } else {
            const halfWaterSaveDC = getSetting(CONSTANTS.SETTINGS.HALF_WATER_SAVE_DC);
            if (halfWaterSaveDC) {
              exhaustionToRemove = 0;
              let roll = await this.actor.rollAbilitySave("con", {
                targetValue: halfWaterSaveDC
              });
              if (!roll) {
                roll = await this.actor.rollAbilitySave("con", {
                  targetValue: halfWaterSaveDC,
                  fastForward: true
                });
              }
              if (roll.total < halfWaterSaveDC) {
                actorExhaustion += actorExhaustion > 0 ? 2 : 1;
                exhaustionGain = true;
              } else {
                exhaustionSave = true;
              }
            }
          }
        }
      }
      updates[CONSTANTS.FLAGS.SATED_FOOD] = 0;
      updates[CONSTANTS.FLAGS.SATED_WATER] = 0;
    }
    if (this.longRest && getSetting(CONSTANTS.SETTINGS.AUTOMATE_EXHAUSTION)) {
      if (getSetting(CONSTANTS.SETTINGS.LONG_REST_ARMOR_AUTOMATION) && getSetting(CONSTANTS.SETTINGS.LONG_REST_ARMOR_EXHAUSTION) && actorExhaustion > 0) {
        const armor = this.actor.items.find((item) => item.type === "equipment" && ["heavy", "medium"].indexOf(item.system?.armor?.type) > -1 && item.system.equipped);
        if (armor && !this.healthData.removeNonLightArmor) {
          exhaustionToRemove = 0;
          this.foodAndWaterMessage.push(game.i18n.localize("REST-RECOVERY.Chat.ExhaustionArmor"));
        }
      }
      if (exhaustionGain) {
        this.foodAndWaterMessage.push(game.i18n.format("REST-RECOVERY.Chat.Exhaustion", {
          exhaustion: actorExhaustion - actorInitialExhaustion
        }));
      } else if (exhaustionSave) {
        this.foodAndWaterMessage.push(game.i18n.localize("REST-RECOVERY.Chat.NoExhaustion"));
      }
      const maxExhaustion = getSetting(CONSTANTS.SETTINGS.ONE_DND_EXHAUSTION) ? 10 : 6;
      updates["system.attributes.exhaustion"] = Math.max(0, Math.min(actorExhaustion - exhaustionToRemove, maxExhaustion));
      if (updates["system.attributes.exhaustion"] === maxExhaustion) {
        this.foodAndWaterMessage.push(game.i18n.format("REST-RECOVERY.Chat.ExhaustionDeath", {
          actorName: this.actor.name,
          max_levels: maxExhaustion
        }));
      }
    }
    if (this.foodAndWaterMessage.length) {
      this.foodAndWaterMessage = this.foodAndWaterMessage.map((str) => `<p>${str}</p>`);
    }
    return updates;
  }
  _displayRestResultMessage(chatMessage) {
    let extra = this.spellSlotsRegainedMessage + this.itemsRegainedMessages.join("") + this.resourcesRegainedMessages.join("");
    if (extra.length) {
      extra = `<p>${game.i18n.localize("REST-RECOVERY.Chat.RegainedUses")}</p>` + extra;
    }
    if (this.foodAndWaterMessage.length) {
      extra += this.foodAndWaterMessage.join("");
    }
    chatMessage.update({
      content: `<p>${chatMessage.content}${this.hitDiceMessage ? " " + this.hitDiceMessage : ""}</p>` + extra
    }).then(() => {
      ui.chat.scrollBottom();
    });
    return chatMessage;
  }
  _getRestHitPointRecovery(result) {
    const maxHP = this.actor.system.attributes.hp.max;
    const currentHP = this.actor.system.attributes.hp.value;
    if (!this.longRest) {
      result.hitPointsRecovered = currentHP - this.healthData.startingHealth;
      result.hitPointsToRegainFromRest = 0;
      return result;
    }
    const multiplier = determineMultiplier(CONSTANTS.SETTINGS.HP_MULTIPLIER);
    result.hitPointsToRegainFromRest = typeof multiplier === "string" ? Math.floor(evaluateFormula(multiplier, this.actor.getRollData())?.total) : Math.floor(maxHP * multiplier);
    result.updates["system.attributes.hp.value"] = Math.min(maxHP, currentHP + result.hitPointsToRegainFromRest);
    result.hitPointsRecovered = result.updates["system.attributes.hp.value"] - this.healthData.startingHealth;
    return result;
  }
  _getPostRestHitDiceRecovery(results) {
    if (this.preRestRegainHitDice)
      return results;
    results.hitDiceRecovered = Math.max(0, Math.min(this.actor.system.details.level, this.totalHitDice) - this.healthData.startingHitDice);
    results.updates = [];
    return results;
  }
  _getMaxHitDiceRecovery({ maxHitDice = void 0 } = {}) {
    let multiplier = determineMultiplier(CONSTANTS.SETTINGS.HD_MULTIPLIER);
    let roundingMethod = determineRoundingMethod(CONSTANTS.SETTINGS.HD_ROUNDING);
    const actorLevel = this.actor.system.details.level;
    if (getSetting(CONSTANTS.SETTINGS.LONG_REST_ARMOR_AUTOMATION) && getSetting(CONSTANTS.SETTINGS.LONG_REST_ARMOR_HIT_DICE)) {
      const armor = this.actor.items.find((item) => item.type === "equipment" && item.system?.armor?.type === "heavy" && item.system.equipped);
      if (armor && !this.healthData.removeNonLightArmor) {
        multiplier = determineMultiplier(CONSTANTS.SETTINGS.LONG_REST_ARMOR_HIT_DICE);
        roundingMethod = determineRoundingMethod(CONSTANTS.SETTINGS.HD_ROUNDING);
      }
    }
    if (typeof multiplier === "string") {
      const customRegain = evaluateFormula(multiplier, this.actor.getRollData())?.total;
      maxHitDice = Math.clamped(roundingMethod(customRegain), 0, maxHitDice ?? actorLevel);
    } else {
      maxHitDice = Math.clamped(
        roundingMethod(actorLevel * multiplier),
        multiplier ? 1 : 0,
        maxHitDice ?? actorLevel
      );
    }
    if (!getSetting(CONSTANTS.SETTINGS.PRE_REST_REGAIN_BUFFER)) {
      const maximumHitDiceToRecover = Number(Object.values(this.actor.classes).reduce((acc, cls) => {
        acc += cls.system?.hitDiceUsed ?? 0;
        return acc;
      }, 0));
      maxHitDice = Math.min(maximumHitDiceToRecover, maxHitDice);
    }
    if (this.healthData.hitDiceSpent > 0 && getSetting(CONSTANTS.SETTINGS.PREVENT_REST_REGAIN_HIT_DICE)) {
      maxHitDice = 0;
    }
    return maxHitDice;
  }
  _getRestResourceRecovery(updates, { recoverShortRestResources = true, recoverLongRestResources = true } = {}) {
    const finishedRestUpdates = this._finishedRest(updates);
    const customRecoveryResources = Object.entries(this.actor.system.resources).filter((entry) => {
      return Number.isNumeric(entry[1].max) && entry[1].value !== entry[1].max && getProperty(this.actor, `${CONSTANTS.FLAGS.RESOURCES}.${entry[0]}.formula`);
    });
    const regularResources = Object.entries(this.actor.system.resources).filter((entry) => {
      return Number.isNumeric(entry[1].max) && entry[1].value !== entry[1].max && !getProperty(this.actor, `${CONSTANTS.FLAGS.RESOURCES}.${entry[0]}.formula`);
    });
    for (const [key, resource] of customRecoveryResources) {
      if (recoverShortRestResources && resource.sr || recoverLongRestResources && resource.lr) {
        const customFormula = getProperty(this.actor, `${CONSTANTS.FLAGS.RESOURCES}.${key}.formula`);
        const customRoll = evaluateFormula(customFormula, this.actor.getRollData());
        finishedRestUpdates[`system.resources.${key}.value`] = Math.min(resource.value + customRoll.total, resource.max);
        const chargeText = `<a class="inline-roll roll" onClick="return false;" title="${customRoll.formula} (${customRoll.total})">${Math.min(resource.max - resource.value, customRoll.total)}</a>`;
        this.resourcesRegainedMessages.push(`<li>${game.i18n.format("REST-RECOVERY.Chat.RecoveryNameNum", {
          name: resource.label,
          number: chargeText
        })}</li>`);
      }
    }
    if (this.resourcesRegainedMessages.length) {
      this.resourcesRegainedMessages.unshift("<ul>");
      this.resourcesRegainedMessages.push("</ul>");
    }
    const multiplier = determineMultiplier(CONSTANTS.SETTINGS.LONG_RESOURCES_MULTIPLIER);
    if (multiplier === 1)
      return { ...updates, ...finishedRestUpdates };
    if (!multiplier)
      return finishedRestUpdates;
    for (const [key, resource] of regularResources) {
      if (recoverShortRestResources && resource.sr) {
        finishedRestUpdates[`system.resources.${key}.value`] = Number(resource.max);
      } else if (recoverLongRestResources && resource.lr) {
        const recoverResources = typeof multiplier === "string" ? evaluateFormula(multiplier, { resource: foundry.utils.deepClone(resource) })?.total : Math.max(Math.floor(resource.max * multiplier), 1);
        finishedRestUpdates[`system.resources.${key}.value`] = Math.min(resource.value + recoverResources, resource.max);
      }
    }
    return finishedRestUpdates;
  }
  _getRestSpellRecovery(updates, { recoverSpells = true } = {}) {
    const customSpellRecovery = getSetting(CONSTANTS.SETTINGS.LONG_CUSTOM_SPELL_RECOVERY);
    if (recoverSpells) {
      const spellMultiplier = determineMultiplier(CONSTANTS.SETTINGS.LONG_SPELLS_MULTIPLIER);
      const pactMultiplier = determineMultiplier(CONSTANTS.SETTINGS.LONG_PACT_SPELLS_MULTIPLIER);
      for (let [level, slot] of Object.entries(this.actor.system.spells)) {
        if (!slot.override && !slot.max)
          continue;
        let multiplier = level === "pact" ? pactMultiplier : spellMultiplier;
        if (level !== "pact" && customSpellRecovery) {
          updates[`system.spells.${level}.value`] = 0;
          continue;
        }
        let spellMax = slot.override || slot.max;
        let recoverSpells2 = typeof multiplier === "string" ? Math.max(evaluateFormula(multiplier, { slot: foundry.utils.deepClone(slot) })?.total, 1) : Math.max(Math.floor(spellMax * multiplier), multiplier ? 1 : multiplier);
        updates[`system.spells.${level}.value`] = Math.min(slot.value + recoverSpells2, spellMax);
      }
    } else {
      const pactMultiplier = determineMultiplier(CONSTANTS.SETTINGS.SHORT_PACT_SPELLS_MULTIPLIER);
      for (let [level, slot] of Object.entries(this.actor.system.spells)) {
        if (!slot.override && !slot.max || level !== "pact")
          continue;
        let spellMax = slot.override || slot.max;
        let recoverSpells2 = typeof pactMultiplier === "string" ? Math.max(evaluateFormula(pactMultiplier, { slot: foundry.utils.deepClone(slot) })?.total, 1) : Math.max(Math.floor(spellMax * pactMultiplier), pactMultiplier ? 1 : pactMultiplier);
        updates[`system.spells.${level}.value`] = Math.min(slot.value + recoverSpells2, spellMax);
      }
    }
    if (!this.longRest && this.spellData.feature || this.longRest && customSpellRecovery) {
      if (!foundry.utils.isEmpty(this.recoveredSlots)) {
        for (const [slot, num] of Object.entries(this.recoveredSlots)) {
          const prop = `system.spells.spell${slot}.value`;
          updates[prop] = (updates[prop] || foundry.utils.getProperty(this.actor, prop) || 0) + num;
        }
        this.spellSlotsRegainedMessage = "<ul>";
        for (const [level, num] of Object.entries(this.recoveredSlots)) {
          const numText = game.i18n.localize("REST-RECOVERY.NumberToText." + num);
          const levelText = ordinalSuffixOf(level);
          const localization = "REST-RECOVERY.Chat.SpellSlotList" + (num > 1 ? "Plural" : "");
          this.spellSlotsRegainedMessage += `<li>${game.i18n.format(localization, {
            number: numText,
            level: levelText
          })}</li>`;
        }
        this.spellSlotsRegainedMessage += "</ul>";
      }
    }
    return updates;
  }
  _getRestItemUsesRecovery(updates, args) {
    updates = this._recoverItemsUses(updates, args);
    if (!this.longRest && this.spellData.pointsSpent && this.spellData.feature) {
      updates.push({ _id: this.spellData.feature.id, "system.uses.value": 0 });
    }
    if (this.longRest && getSetting(CONSTANTS.SETTINGS.PRE_REST_REGAIN_BUFFER)) {
      Object.values(this.actor.classes).forEach((cls) => {
        updates.push({ _id: cls.id, [CONSTANTS.FLAGS.REMOVE_HIT_DICE_BUFFER_FLAG]: null });
      });
    }
    return updates;
  }
  _recoverItemsUses(updates, args) {
    const { recoverLongRestUses, recoverDailyUses, rolls } = args;
    const longFeatsMultiplier = determineMultiplier(CONSTANTS.SETTINGS.LONG_USES_FEATS_MULTIPLIER);
    const longOthersMultiplier = determineMultiplier(CONSTANTS.SETTINGS.LONG_USES_OTHERS_MULTIPLIER);
    const shortFeatsMultiplier = determineMultiplier(CONSTANTS.SETTINGS.SHORT_USES_FEATS_MULTIPLIER);
    const shortOthersMultiplier = determineMultiplier(CONSTANTS.SETTINGS.SHORT_USES_OTHERS_MULTIPLIER);
    const dailyMultiplier = determineMultiplier(CONSTANTS.SETTINGS.LONG_USES_DAILY_MULTIPLIER);
    const actorRollData = this.actor.getRollData();
    const longRestItemNameHandlers = RestWorkflow.LongRestItemNameHandlers;
    for (const item of this.actor.items) {
      const itemHandlerFn = longRestItemNameHandlers[item.name];
      if (recoverLongRestUses && itemHandlerFn) {
        this[itemHandlerFn](actorRollData, updates, item, rolls);
      } else if (item.system.uses) {
        if (recoverDailyUses && item.system.uses.per === "day") {
          this._recoverItemUse(actorRollData, updates, item, dailyMultiplier, rolls);
        } else if (recoverLongRestUses && item.system.uses.per === "lr") {
          this._recoverItemUse(actorRollData, updates, item, item.type === "feat" ? longFeatsMultiplier : longOthersMultiplier, rolls);
        } else if (item.system.uses.per === "sr") {
          this._recoverItemUse(actorRollData, updates, item, item.type === "feat" ? shortFeatsMultiplier : shortOthersMultiplier, rolls);
        }
      } else if (recoverLongRestUses && item.system.recharge && item.system.recharge.value) {
        updates.push({ _id: item.id, "system.recharge.charged": true });
      }
    }
    if (this.itemsRegainedMessages.length) {
      this.itemsRegainedMessages.sort((a, b) => {
        return a[0] > b[0] || a[1] > b[1] ? -1 : 1;
      });
      this.itemsRegainedMessages = this.itemsRegainedMessages.map((line) => line[1]);
      this.itemsRegainedMessages.unshift(`<ul>`);
      this.itemsRegainedMessages.push("</ul>");
    }
    return updates;
  }
  _recoverItemUse(actorRollData, updates, item, multiplier = 1, rolls) {
    const usesMax = item.system.uses.max;
    const usesCur = item.system.uses.value;
    if (usesCur === usesMax)
      return;
    const customRecovery = getProperty(item, CONSTANTS.FLAGS.RECOVERY_ENABLED);
    const customFormula = getProperty(item, CONSTANTS.FLAGS.RECOVERY_FORMULA);
    let recoverValue;
    if (customRecovery && customFormula) {
      const customRoll = evaluateFormula(customFormula, {
        actor: actorRollData,
        item: foundry.utils.deepClone(item.system)
      });
      rolls.push(customRoll);
      recoverValue = Math.max(0, Math.min(usesCur + customRoll.total, usesMax));
      const chargeText = `<a class="inline-roll roll" onClick="return false;" title="${customRoll.formula} (${customRoll.total})">${Math.min(usesMax - usesCur, customRoll.total)}</a>`;
      this.itemsRegainedMessages.push([item.type, `<li>${game.i18n.format("REST-RECOVERY.Chat.RecoveryNameNum", {
        name: item.name,
        number: chargeText
      })}</li>`]);
    } else {
      recoverValue = typeof multiplier === "string" ? evaluateFormula(multiplier, foundry.utils.deepClone(item.system))?.total : Math.max(Math.floor(usesMax * multiplier), multiplier ? 1 : 0);
      recoverValue = Math.max(0, Math.min(usesCur + recoverValue, usesMax));
    }
    const update2 = updates.find((update3) => update3._id === item.id);
    if (update2) {
      update2["system.uses.value"] = recoverValue;
    } else {
      updates.push({
        _id: item.id,
        "system.uses.value": recoverValue
      });
    }
  }
  _handlePowerSurgeFeature(actorRollData, updates, item) {
    const numSurges = getProperty(item, "system.uses.value");
    if (numSurges === 1)
      return;
    const update2 = updates.find((update3) => update3._id === item.id);
    if (update2) {
      update2["system.uses.value"] = 1;
    } else {
      updates.push({
        _id: item.id,
        "system.uses.value": 1
      });
    }
  }
  async _handleFoodAndWaterItems(updates) {
    if (!getSetting(CONSTANTS.SETTINGS.ENABLE_FOOD_AND_WATER))
      return updates;
    if (!(this.longRest || this.restVariant === "gritty"))
      return updates;
    const {
      actorRequiredFood,
      actorRequiredWater
    } = getActorConsumableValues(this.actor);
    if (!actorRequiredFood && !actorRequiredWater || !this.consumableData.items.length)
      return updates;
    let itemsToDelete = [];
    for (const consumableData of this.consumableData.items) {
      const item = consumableData.item;
      let updateIndex = updates.findIndex((update3) => update3._id === item.id);
      let update2 = updates[updateIndex] ?? {
        _id: item.id
      };
      const newUses = getProperty(update2, "system.uses.value") ?? consumableData.usesLeft - consumableData.amount;
      update2["system.uses.value"] = newUses;
      if (updateIndex > -1) {
        updates.splice(updateIndex, 1);
      }
      const consumeQuantity = getProperty(item, "system.uses.autoDestroy") ?? false;
      const quantity = getProperty(item, "system.quantity");
      if (consumeQuantity && quantity <= 1 && newUses === 0) {
        itemsToDelete.push(consumableData.id);
      } else {
        if (consumeQuantity && newUses === 0) {
          update2["system.uses.value"] = getProperty(item, "system.uses.max") ?? 1;
          update2["system.quantity"] = quantity - 1;
        }
        updates.push(update2);
      }
    }
    await this.actor.deleteEmbeddedDocuments("Item", itemsToDelete);
    return updates;
  }
  static _setupFoodListeners() {
    Hooks.on("closeApplication", (app) => {
      if (!getSetting(CONSTANTS.SETTINGS.ENABLE_FOOD_AND_WATER))
        return;
      if (!app?.item)
        return;
      const item = app.item;
      const consumable = getProperty(item, CONSTANTS.FLAGS.CONSUMABLE);
      if (!consumable?.enabled)
        return;
      let consumeFull = true;
      const element2 = app.element.find('input[name="consumeAmount"]:checked');
      if (element2.length) {
        consumeFull = element2.val() === "full";
      }
      this.itemsListened.set(item.id, consumeFull);
      setTimeout(() => {
        this.itemsListened.delete(item.id);
      }, 150);
    });
    Hooks.on("preUpdateItem", (item, data) => {
      if (!getSetting(CONSTANTS.SETTINGS.ENABLE_FOOD_AND_WATER))
        return;
      if (getProperty(data, CONSTANTS.FLAGS.CONSUMABLE)?.enabled && !isRealNumber(getProperty(item, "system.uses.max"))) {
        return this._patchConsumableItem(item, data);
      }
      if (!this.itemsListened.has(item.id))
        return;
      const consumable = getProperty(item, CONSTANTS.FLAGS.CONSUMABLE);
      if (!consumable?.enabled)
        return;
      return this._handleConsumableItem(item, data);
    });
  }
  static patchAllConsumableItems(actor) {
    const items = actor.items.filter((item) => (item.name === "Rations" || item.name === "Waterskin") && getProperty(item, CONSTANTS.FLAGS.CONSUMABLE) === void 0);
    const updates = items.map((item) => {
      if (item.name.startsWith("Rations")) {
        return {
          "_id": item.id,
          "system.uses.value": getProperty(item, "system.uses.value") ?? 1,
          "system.uses.max": getProperty(item, "system.uses.max") ?? 1,
          "system.uses.per": getProperty(item, "system.uses.per") ?? "charges",
          [CONSTANTS.FLAGS.CONSUMABLE_ENABLED]: true,
          [CONSTANTS.FLAGS.CONSUMABLE_TYPE]: CONSTANTS.FLAGS.CONSUMABLE_TYPE_FOOD
        };
      }
      return {
        "_id": item.id,
        "system.uses.value": 1,
        "system.uses.max": 1,
        "system.uses.per": "charges",
        [CONSTANTS.FLAGS.CONSUMABLE_ENABLED]: true,
        [CONSTANTS.FLAGS.CONSUMABLE_TYPE]: CONSTANTS.FLAGS.CONSUMABLE_TYPE_WATER
      };
    });
    if (updates.length) {
      ui.notifications.info("Rest Recovery for 5e | " + game.i18n.format("REST-RECOVERY.PatchedConsumable", {
        itemName: [...new Set(items.map((item) => item.name))].join(", ")
      }));
    }
    return actor.updateEmbeddedDocuments("Item", updates);
  }
  static _patchConsumableItem(item, updates) {
    if (!getSetting(CONSTANTS.SETTINGS.ENABLE_FOOD_AND_WATER))
      return;
    updates["system.uses.value"] = 1;
    updates["system.uses.max"] = 1;
    updates["system.uses.per"] = "charges";
    ui.notifications.info("Rest Recovery for 5e | " + game.i18n.format("REST-RECOVERY.PatchedConsumable", {
      itemName: item.name
    }));
  }
  static _handleConsumableItem(item, data) {
    if (!getSetting(CONSTANTS.SETTINGS.ENABLE_FOOD_AND_WATER))
      return;
    const consumable = getProperty(item, CONSTANTS.FLAGS.CONSUMABLE);
    const actorUpdates = {};
    let {
      actorRequiredFood,
      actorRequiredWater,
      actorFoodSatedValue,
      actorWaterSatedValue
    } = getActorConsumableValues(item.parent);
    const currCharges = getProperty(item, "system.uses.value");
    const newCharges = getProperty(data, "system.uses.value") ?? currCharges - 1;
    const chargesUsed = currCharges < newCharges ? currCharges : currCharges - newCharges;
    let message;
    if (consumable.type === "both") {
      actorUpdates[CONSTANTS.FLAGS.SATED_FOOD] = consumable.dayWorth ? 1e11 : actorFoodSatedValue + chargesUsed;
      actorUpdates[CONSTANTS.FLAGS.SATED_WATER] = consumable.dayWorth ? 1e11 : actorWaterSatedValue + chargesUsed;
      const localize2 = "REST-RECOVERY.Chat.ConsumedBoth" + (consumable.dayWorth ? "DayWorth" : "");
      message = "<p>" + game.i18n.format(localize2, {
        actorName: item.parent.name,
        itemName: item.name,
        charges: chargesUsed
      }) + "</p>";
      if (!consumable.dayWorth) {
        message += actorUpdates[CONSTANTS.FLAGS.SATED_FOOD] >= actorRequiredFood ? "<p>" + game.i18n.localize("REST-RECOVERY.Chat.SatedFood") + "</p>" : "<p>" + game.i18n.format("REST-RECOVERY.Chat.RequiredSatedFood", { units: actorRequiredFood - actorUpdates[CONSTANTS.FLAGS.SATED_FOOD] }) + "</p>";
        message += actorUpdates[CONSTANTS.FLAGS.SATED_WATER] >= actorRequiredWater ? "<p>" + game.i18n.localize("REST-RECOVERY.Chat.SatedWater") + "</p>" : "<p>" + game.i18n.format("REST-RECOVERY.Chat.RequiredSatedWater", { units: actorRequiredWater - actorUpdates[CONSTANTS.FLAGS.SATED_WATER] }) + "</p>";
      }
    } else if (consumable.type === "food") {
      actorUpdates[CONSTANTS.FLAGS.SATED_FOOD] = consumable.dayWorth ? 1e11 : actorFoodSatedValue + chargesUsed;
      const localize2 = "REST-RECOVERY.Chat.ConsumedFood" + (consumable.dayWorth ? "DayWorth" : "");
      message = "<p>" + game.i18n.format(localize2, {
        actorName: item.parent.name,
        itemName: item.name,
        charges: chargesUsed
      }) + "</p>";
      message += actorUpdates[CONSTANTS.FLAGS.SATED_FOOD] >= actorRequiredFood ? "<p>" + game.i18n.localize("REST-RECOVERY.Chat.SatedFood") + "</p>" : "<p>" + game.i18n.format("REST-RECOVERY.Chat.RequiredSatedFood", { units: actorRequiredFood - actorUpdates[CONSTANTS.FLAGS.SATED_FOOD] }) + "</p>";
    } else if (consumable.type === "water") {
      actorUpdates[CONSTANTS.FLAGS.SATED_WATER] = consumable.dayWorth ? 1e11 : actorWaterSatedValue + chargesUsed;
      const localize2 = "REST-RECOVERY.Chat.ConsumedWater" + (consumable.dayWorth ? "DayWorth" : "");
      message = "<p>" + game.i18n.format(localize2, {
        actorName: item.parent.name,
        itemName: item.name,
        charges: chargesUsed
      }) + "</p>";
      message += actorUpdates[CONSTANTS.FLAGS.SATED_WATER] >= actorRequiredWater ? "<p>" + game.i18n.localize("REST-RECOVERY.Chat.SatedWater") + "</p>" : "<p>" + game.i18n.format("REST-RECOVERY.Chat.RequiredSatedWater", { units: actorRequiredWater - actorUpdates[CONSTANTS.FLAGS.SATED_WATER] }) + "</p>";
    }
    if (!foundry.utils.isEmpty(actorUpdates)) {
      item.parent.update(actorUpdates);
    }
    if (message) {
      setTimeout(() => {
        ChatMessage.create({
          flavor: "Rest Recovery",
          user: game.user.id,
          speaker: ChatMessage.getSpeaker({ actor: item.parent }),
          content: message
        });
      }, 1e3);
    }
  }
}
__name(RestWorkflow, "RestWorkflow");
const Steps_svelte_svelte_type_style_lang = "";
function get_each_context$6(ctx, list, i) {
  const child_ctx = ctx.slice();
  child_ctx[3] = list[i];
  child_ctx[5] = i;
  return child_ctx;
}
__name(get_each_context$6, "get_each_context$6");
function create_if_block$7(ctx) {
  let i;
  return {
    c() {
      i = element("i");
      attr(i, "class", "fas fa-arrow-right svelte-1qg54vo");
    },
    m(target, anchor) {
      insert(target, i, anchor);
    },
    d(detaching) {
      if (detaching)
        detach(i);
    }
  };
}
__name(create_if_block$7, "create_if_block$7");
function create_each_block$6(key_1, ctx) {
  let a;
  let t0_value = localize(ctx[3].title) + "";
  let t0;
  let t1;
  let if_block_anchor;
  let mounted;
  let dispose;
  function click_handler() {
    return ctx[2](ctx[5]);
  }
  __name(click_handler, "click_handler");
  let if_block = ctx[5] < ctx[1].length - 1 && create_if_block$7();
  return {
    key: key_1,
    first: null,
    c() {
      a = element("a");
      t0 = text(t0_value);
      t1 = space();
      if (if_block)
        if_block.c();
      if_block_anchor = empty();
      attr(a, "class", "svelte-1qg54vo");
      toggle_class(a, "active", ctx[0] === ctx[5]);
      this.first = a;
    },
    m(target, anchor) {
      insert(target, a, anchor);
      append(a, t0);
      insert(target, t1, anchor);
      if (if_block)
        if_block.m(target, anchor);
      insert(target, if_block_anchor, anchor);
      if (!mounted) {
        dispose = listen(a, "click", click_handler);
        mounted = true;
      }
    },
    p(new_ctx, dirty) {
      ctx = new_ctx;
      if (dirty & 2 && t0_value !== (t0_value = localize(ctx[3].title) + ""))
        set_data(t0, t0_value);
      if (dirty & 3) {
        toggle_class(a, "active", ctx[0] === ctx[5]);
      }
      if (ctx[5] < ctx[1].length - 1) {
        if (if_block)
          ;
        else {
          if_block = create_if_block$7();
          if_block.c();
          if_block.m(if_block_anchor.parentNode, if_block_anchor);
        }
      } else if (if_block) {
        if_block.d(1);
        if_block = null;
      }
    },
    d(detaching) {
      if (detaching)
        detach(a);
      if (detaching)
        detach(t1);
      if (if_block)
        if_block.d(detaching);
      if (detaching)
        detach(if_block_anchor);
      mounted = false;
      dispose();
    }
  };
}
__name(create_each_block$6, "create_each_block$6");
function create_fragment$a(ctx) {
  let div;
  let each_blocks = [];
  let each_1_lookup = /* @__PURE__ */ new Map();
  let each_value = ctx[1];
  const get_key = /* @__PURE__ */ __name((ctx2) => ctx2[5], "get_key");
  for (let i = 0; i < each_value.length; i += 1) {
    let child_ctx = get_each_context$6(ctx, each_value, i);
    let key = get_key(child_ctx);
    each_1_lookup.set(key, each_blocks[i] = create_each_block$6(key, child_ctx));
  }
  return {
    c() {
      div = element("div");
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].c();
      }
      attr(div, "class", "steps svelte-1qg54vo");
    },
    m(target, anchor) {
      insert(target, div, anchor);
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].m(div, null);
      }
    },
    p(ctx2, [dirty]) {
      if (dirty & 3) {
        each_value = ctx2[1];
        each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx2, each_value, each_1_lookup, div, destroy_block, create_each_block$6, null, get_each_context$6);
      }
    },
    i: noop,
    o: noop,
    d(detaching) {
      if (detaching)
        detach(div);
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].d();
      }
    }
  };
}
__name(create_fragment$a, "create_fragment$a");
function instance$a($$self, $$props, $$invalidate) {
  let { steps } = $$props;
  let { activeStep } = $$props;
  const click_handler = /* @__PURE__ */ __name((index) => {
    $$invalidate(0, activeStep = index);
  }, "click_handler");
  $$self.$$set = ($$props2) => {
    if ("steps" in $$props2)
      $$invalidate(1, steps = $$props2.steps);
    if ("activeStep" in $$props2)
      $$invalidate(0, activeStep = $$props2.activeStep);
  };
  return [activeStep, steps, click_handler];
}
__name(instance$a, "instance$a");
class Steps extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$a, create_fragment$a, safe_not_equal, { steps: 1, activeStep: 0 });
  }
}
__name(Steps, "Steps");
function create_if_block_9$1(ctx) {
  let steps;
  let updating_activeStep;
  let current;
  function steps_activeStep_binding(value) {
    ctx[26](value);
  }
  __name(steps_activeStep_binding, "steps_activeStep_binding");
  let steps_props = { steps: ctx[6].steps };
  if (ctx[11] !== void 0) {
    steps_props.activeStep = ctx[11];
  }
  steps = new Steps({ props: steps_props });
  binding_callbacks.push(() => bind(steps, "activeStep", steps_activeStep_binding, ctx[11]));
  return {
    c() {
      create_component(steps.$$.fragment);
    },
    m(target, anchor) {
      mount_component(steps, target, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      const steps_changes = {};
      if (dirty[0] & 64)
        steps_changes.steps = ctx2[6].steps;
      if (!updating_activeStep && dirty[0] & 2048) {
        updating_activeStep = true;
        steps_changes.activeStep = ctx2[11];
        add_flush_callback(() => updating_activeStep = false);
      }
      steps.$set(steps_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(steps.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(steps.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(steps, detaching);
    }
  };
}
__name(create_if_block_9$1, "create_if_block_9$1");
function create_else_block_3$1(ctx) {
  let div;
  let label;
  let t1;
  let p;
  return {
    c() {
      div = element("div");
      label = element("label");
      label.textContent = `${localize("REST-RECOVERY.Dialogs.ShortRest.NoMoreRests")}`;
      t1 = space();
      p = element("p");
      p.textContent = `${localize("REST-RECOVERY.Dialogs.ShortRest.NoMoreRestsSmall", {
        max_short_rests: ctx[12]
      })}`;
      attr(div, "class", "form-group");
      attr(p, "class", "notes");
    },
    m(target, anchor) {
      insert(target, div, anchor);
      append(div, label);
      insert(target, t1, anchor);
      insert(target, p, anchor);
    },
    p: noop,
    i: noop,
    o: noop,
    d(detaching) {
      if (detaching)
        detach(div);
      if (detaching)
        detach(t1);
      if (detaching)
        detach(p);
    }
  };
}
__name(create_else_block_3$1, "create_else_block_3$1");
function create_if_block_2$3(ctx) {
  let current_block_type_index;
  let if_block;
  let if_block_anchor;
  let current;
  const if_block_creators = [create_if_block_3$3, create_else_block_2$1];
  const if_blocks = [];
  function select_block_type_1(ctx2, dirty) {
    if (ctx2[11] === 0)
      return 0;
    return 1;
  }
  __name(select_block_type_1, "select_block_type_1");
  current_block_type_index = select_block_type_1(ctx);
  if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
  return {
    c() {
      if_block.c();
      if_block_anchor = empty();
    },
    m(target, anchor) {
      if_blocks[current_block_type_index].m(target, anchor);
      insert(target, if_block_anchor, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      let previous_block_index = current_block_type_index;
      current_block_type_index = select_block_type_1(ctx2);
      if (current_block_type_index === previous_block_index) {
        if_blocks[current_block_type_index].p(ctx2, dirty);
      } else {
        group_outros();
        transition_out(if_blocks[previous_block_index], 1, 1, () => {
          if_blocks[previous_block_index] = null;
        });
        check_outros();
        if_block = if_blocks[current_block_type_index];
        if (!if_block) {
          if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx2);
          if_block.c();
        } else {
          if_block.p(ctx2, dirty);
        }
        transition_in(if_block, 1);
        if_block.m(if_block_anchor.parentNode, if_block_anchor);
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(if_block);
      current = true;
    },
    o(local) {
      transition_out(if_block);
      current = false;
    },
    d(detaching) {
      if_blocks[current_block_type_index].d(detaching);
      if (detaching)
        detach(if_block_anchor);
    }
  };
}
__name(create_if_block_2$3, "create_if_block_2$3");
function create_else_block_2$1(ctx) {
  let switch_instance;
  let switch_instance_anchor;
  let current;
  var switch_value = ctx[6].steps[ctx[11]].component;
  function switch_props(ctx2) {
    return { props: { workflow: ctx2[6] } };
  }
  __name(switch_props, "switch_props");
  if (switch_value) {
    switch_instance = construct_svelte_component(switch_value, switch_props(ctx));
  }
  return {
    c() {
      if (switch_instance)
        create_component(switch_instance.$$.fragment);
      switch_instance_anchor = empty();
    },
    m(target, anchor) {
      if (switch_instance)
        mount_component(switch_instance, target, anchor);
      insert(target, switch_instance_anchor, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      const switch_instance_changes = {};
      if (dirty[0] & 64)
        switch_instance_changes.workflow = ctx2[6];
      if (switch_value !== (switch_value = ctx2[6].steps[ctx2[11]].component)) {
        if (switch_instance) {
          group_outros();
          const old_component = switch_instance;
          transition_out(old_component.$$.fragment, 1, 0, () => {
            destroy_component(old_component, 1);
          });
          check_outros();
        }
        if (switch_value) {
          switch_instance = construct_svelte_component(switch_value, switch_props(ctx2));
          create_component(switch_instance.$$.fragment);
          transition_in(switch_instance.$$.fragment, 1);
          mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
        } else {
          switch_instance = null;
        }
      } else if (switch_value) {
        switch_instance.$set(switch_instance_changes);
      }
    },
    i(local) {
      if (current)
        return;
      if (switch_instance)
        transition_in(switch_instance.$$.fragment, local);
      current = true;
    },
    o(local) {
      if (switch_instance)
        transition_out(switch_instance.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      if (detaching)
        detach(switch_instance_anchor);
      if (switch_instance)
        destroy_component(switch_instance, detaching);
    }
  };
}
__name(create_else_block_2$1, "create_else_block_2$1");
function create_if_block_3$3(ctx) {
  let t0;
  let current_block_type_index;
  let if_block1;
  let t1;
  let t2;
  let healthbar;
  let t3;
  let t4;
  let if_block4_anchor;
  let current;
  let if_block0 = ctx[12] > 0 && ctx[14] < ctx[12] && create_if_block_8$1(ctx);
  const if_block_creators = [create_if_block_7$1, create_else_block_1$2];
  const if_blocks = [];
  function select_block_type_2(ctx2, dirty) {
    if (ctx2[13])
      return 0;
    return 1;
  }
  __name(select_block_type_2, "select_block_type_2");
  current_block_type_index = select_block_type_2(ctx);
  if_block1 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
  let if_block2 = (ctx[17] || ctx[8]) && create_if_block_6$1(ctx);
  healthbar = new HealthBar({
    props: {
      text: "HP: " + ctx[2] + " / " + ctx[3],
      progress: ctx[4]
    }
  });
  let if_block3 = ctx[16] > 0 && ctx[9].hitDiceSpent < ctx[16] && create_if_block_5$2(ctx);
  let if_block4 = ctx[7] > 0 && ctx[7] !== ctx[9].level && create_if_block_4$2(ctx);
  return {
    c() {
      if (if_block0)
        if_block0.c();
      t0 = space();
      if_block1.c();
      t1 = space();
      if (if_block2)
        if_block2.c();
      t2 = space();
      create_component(healthbar.$$.fragment);
      t3 = space();
      if (if_block3)
        if_block3.c();
      t4 = space();
      if (if_block4)
        if_block4.c();
      if_block4_anchor = empty();
    },
    m(target, anchor) {
      if (if_block0)
        if_block0.m(target, anchor);
      insert(target, t0, anchor);
      if_blocks[current_block_type_index].m(target, anchor);
      insert(target, t1, anchor);
      if (if_block2)
        if_block2.m(target, anchor);
      insert(target, t2, anchor);
      mount_component(healthbar, target, anchor);
      insert(target, t3, anchor);
      if (if_block3)
        if_block3.m(target, anchor);
      insert(target, t4, anchor);
      if (if_block4)
        if_block4.m(target, anchor);
      insert(target, if_block4_anchor, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      if (ctx2[12] > 0 && ctx2[14] < ctx2[12])
        if_block0.p(ctx2, dirty);
      if_block1.p(ctx2, dirty);
      if (ctx2[17] || ctx2[8]) {
        if (if_block2) {
          if_block2.p(ctx2, dirty);
        } else {
          if_block2 = create_if_block_6$1(ctx2);
          if_block2.c();
          if_block2.m(t2.parentNode, t2);
        }
      } else if (if_block2) {
        if_block2.d(1);
        if_block2 = null;
      }
      const healthbar_changes = {};
      if (dirty[0] & 12)
        healthbar_changes.text = "HP: " + ctx2[2] + " / " + ctx2[3];
      if (dirty[0] & 16)
        healthbar_changes.progress = ctx2[4];
      healthbar.$set(healthbar_changes);
      if (ctx2[16] > 0 && ctx2[9].hitDiceSpent < ctx2[16]) {
        if (if_block3) {
          if_block3.p(ctx2, dirty);
        } else {
          if_block3 = create_if_block_5$2(ctx2);
          if_block3.c();
          if_block3.m(t4.parentNode, t4);
        }
      } else if (if_block3) {
        if_block3.d(1);
        if_block3 = null;
      }
      if (ctx2[7] > 0 && ctx2[7] !== ctx2[9].level) {
        if (if_block4) {
          if_block4.p(ctx2, dirty);
        } else {
          if_block4 = create_if_block_4$2(ctx2);
          if_block4.c();
          if_block4.m(if_block4_anchor.parentNode, if_block4_anchor);
        }
      } else if (if_block4) {
        if_block4.d(1);
        if_block4 = null;
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(if_block1);
      transition_in(healthbar.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(if_block1);
      transition_out(healthbar.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      if (if_block0)
        if_block0.d(detaching);
      if (detaching)
        detach(t0);
      if_blocks[current_block_type_index].d(detaching);
      if (detaching)
        detach(t1);
      if (if_block2)
        if_block2.d(detaching);
      if (detaching)
        detach(t2);
      destroy_component(healthbar, detaching);
      if (detaching)
        detach(t3);
      if (if_block3)
        if_block3.d(detaching);
      if (detaching)
        detach(t4);
      if (if_block4)
        if_block4.d(detaching);
      if (detaching)
        detach(if_block4_anchor);
    }
  };
}
__name(create_if_block_3$3, "create_if_block_3$3");
function create_if_block_8$1(ctx) {
  let div;
  let p0;
  let raw0_value = localize("REST-RECOVERY.Dialogs.ShortRest.ShortRestLimit", {
    num_short_rests: ctx[12] - ctx[14]
  }) + "";
  let t;
  let p1;
  let raw1_value = localize("REST-RECOVERY.Dialogs.ShortRest.ShortRestLimitSmall", {
    max_short_rests: ctx[12]
  }) + "";
  return {
    c() {
      div = element("div");
      p0 = element("p");
      t = space();
      p1 = element("p");
      attr(div, "class", "form-group");
      attr(p1, "class", "notes");
    },
    m(target, anchor) {
      insert(target, div, anchor);
      append(div, p0);
      p0.innerHTML = raw0_value;
      insert(target, t, anchor);
      insert(target, p1, anchor);
      p1.innerHTML = raw1_value;
    },
    p: noop,
    d(detaching) {
      if (detaching)
        detach(div);
      if (detaching)
        detach(t);
      if (detaching)
        detach(p1);
    }
  };
}
__name(create_if_block_8$1, "create_if_block_8$1");
function create_else_block_1$2(ctx) {
  let p;
  return {
    c() {
      p = element("p");
      p.textContent = `${localize("REST-RECOVERY.Dialogs.ShortRest.NoHitDiceRest")}`;
    },
    m(target, anchor) {
      insert(target, p, anchor);
    },
    p: noop,
    i: noop,
    o: noop,
    d(detaching) {
      if (detaching)
        detach(p);
    }
  };
}
__name(create_else_block_1$2, "create_else_block_1$2");
function create_if_block_7$1(ctx) {
  let p;
  let t1;
  let hitdieroller;
  let updating_selectedHitDice;
  let updating_healthData;
  let current;
  function hitdieroller_selectedHitDice_binding(value) {
    ctx[27](value);
  }
  __name(hitdieroller_selectedHitDice_binding, "hitdieroller_selectedHitDice_binding");
  function hitdieroller_healthData_binding(value) {
    ctx[28](value);
  }
  __name(hitdieroller_healthData_binding, "hitdieroller_healthData_binding");
  let hitdieroller_props = {
    onHitDiceFunction: ctx[21],
    onAutoFunction: ctx[22],
    workflow: ctx[6],
    minSpendHitDice: ctx[16],
    maxSpendHitDice: ctx[7]
  };
  if (ctx[10] !== void 0) {
    hitdieroller_props.selectedHitDice = ctx[10];
  }
  if (ctx[9] !== void 0) {
    hitdieroller_props.healthData = ctx[9];
  }
  hitdieroller = new HitDieRoller({ props: hitdieroller_props });
  binding_callbacks.push(() => bind(hitdieroller, "selectedHitDice", hitdieroller_selectedHitDice_binding, ctx[10]));
  binding_callbacks.push(() => bind(hitdieroller, "healthData", hitdieroller_healthData_binding, ctx[9]));
  return {
    c() {
      p = element("p");
      p.textContent = `${localize("DND5E.ShortRestHint")}`;
      t1 = space();
      create_component(hitdieroller.$$.fragment);
    },
    m(target, anchor) {
      insert(target, p, anchor);
      insert(target, t1, anchor);
      mount_component(hitdieroller, target, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      const hitdieroller_changes = {};
      if (dirty[0] & 64)
        hitdieroller_changes.workflow = ctx2[6];
      if (dirty[0] & 128)
        hitdieroller_changes.maxSpendHitDice = ctx2[7];
      if (!updating_selectedHitDice && dirty[0] & 1024) {
        updating_selectedHitDice = true;
        hitdieroller_changes.selectedHitDice = ctx2[10];
        add_flush_callback(() => updating_selectedHitDice = false);
      }
      if (!updating_healthData && dirty[0] & 512) {
        updating_healthData = true;
        hitdieroller_changes.healthData = ctx2[9];
        add_flush_callback(() => updating_healthData = false);
      }
      hitdieroller.$set(hitdieroller_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(hitdieroller.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(hitdieroller.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      if (detaching)
        detach(p);
      if (detaching)
        detach(t1);
      destroy_component(hitdieroller, detaching);
    }
  };
}
__name(create_if_block_7$1, "create_if_block_7$1");
function create_if_block_6$1(ctx) {
  let div;
  let label;
  let t0_value = localize(!ctx[17] && ctx[8] ? "REST-RECOVERY.Dialogs.ShortRest.ForcedNewDayTitle" : "DND5E.NewDay") + "";
  let t0;
  let t1;
  let input;
  let t2;
  let p;
  let t3_value = localize(!ctx[17] && ctx[8] ? "REST-RECOVERY.Dialogs.ShortRest.ForcedNewDayHint" : "DND5E.NewDayHint") + "";
  let t3;
  let mounted;
  let dispose;
  return {
    c() {
      div = element("div");
      label = element("label");
      t0 = text(t0_value);
      t1 = space();
      input = element("input");
      t2 = space();
      p = element("p");
      t3 = text(t3_value);
      attr(input, "type", "checkbox");
      input.disabled = !ctx[17];
      attr(p, "class", "hint");
      attr(div, "class", "form-group");
    },
    m(target, anchor) {
      insert(target, div, anchor);
      append(div, label);
      append(label, t0);
      append(div, t1);
      append(div, input);
      input.checked = ctx[8];
      append(div, t2);
      append(div, p);
      append(p, t3);
      if (!mounted) {
        dispose = listen(input, "change", ctx[29]);
        mounted = true;
      }
    },
    p(ctx2, dirty) {
      if (dirty[0] & 256 && t0_value !== (t0_value = localize(!ctx2[17] && ctx2[8] ? "REST-RECOVERY.Dialogs.ShortRest.ForcedNewDayTitle" : "DND5E.NewDay") + ""))
        set_data(t0, t0_value);
      if (dirty[0] & 256) {
        input.checked = ctx2[8];
      }
      if (dirty[0] & 256 && t3_value !== (t3_value = localize(!ctx2[17] && ctx2[8] ? "REST-RECOVERY.Dialogs.ShortRest.ForcedNewDayHint" : "DND5E.NewDayHint") + ""))
        set_data(t3, t3_value);
    },
    d(detaching) {
      if (detaching)
        detach(div);
      mounted = false;
      dispose();
    }
  };
}
__name(create_if_block_6$1, "create_if_block_6$1");
function create_if_block_5$2(ctx) {
  let p;
  let raw_value = localize("REST-RECOVERY.Dialogs.ShortRest.MinHitDiceSpend", {
    min_spend: ctx[16] - ctx[9].hitDiceSpent
  }) + "";
  return {
    c() {
      p = element("p");
    },
    m(target, anchor) {
      insert(target, p, anchor);
      p.innerHTML = raw_value;
    },
    p(ctx2, dirty) {
      if (dirty[0] & 512 && raw_value !== (raw_value = localize("REST-RECOVERY.Dialogs.ShortRest.MinHitDiceSpend", {
        min_spend: ctx2[16] - ctx2[9].hitDiceSpent
      }) + ""))
        p.innerHTML = raw_value;
    },
    d(detaching) {
      if (detaching)
        detach(p);
    }
  };
}
__name(create_if_block_5$2, "create_if_block_5$2");
function create_if_block_4$2(ctx) {
  let p;
  let raw_value = localize("REST-RECOVERY.Dialogs.ShortRest.MaxHitDiceSpend", {
    max_spend: ctx[7],
    current: ctx[7] - ctx[9].hitDiceSpent
  }) + "";
  return {
    c() {
      p = element("p");
    },
    m(target, anchor) {
      insert(target, p, anchor);
      p.innerHTML = raw_value;
    },
    p(ctx2, dirty) {
      if (dirty[0] & 640 && raw_value !== (raw_value = localize("REST-RECOVERY.Dialogs.ShortRest.MaxHitDiceSpend", {
        max_spend: ctx2[7],
        current: ctx2[7] - ctx2[9].hitDiceSpent
      }) + ""))
        p.innerHTML = raw_value;
    },
    d(detaching) {
      if (detaching)
        detach(p);
    }
  };
}
__name(create_if_block_4$2, "create_if_block_4$2");
function create_if_block_1$5(ctx) {
  let button;
  let i;
  let t0;
  let t1_value = localize("REST-RECOVERY.Dialogs.RestSteps.Prev") + "";
  let t1;
  let button_disabled_value;
  let mounted;
  let dispose;
  return {
    c() {
      button = element("button");
      i = element("i");
      t0 = space();
      t1 = text(t1_value);
      attr(i, "class", "fas fa-chevron-left");
      attr(button, "type", "button");
      attr(button, "class", "dialog-button");
      button.disabled = button_disabled_value = ctx[11] === 0;
    },
    m(target, anchor) {
      insert(target, button, anchor);
      append(button, i);
      append(button, t0);
      append(button, t1);
      if (!mounted) {
        dispose = listen(button, "click", ctx[30]);
        mounted = true;
      }
    },
    p(ctx2, dirty) {
      if (dirty[0] & 2048 && button_disabled_value !== (button_disabled_value = ctx2[11] === 0)) {
        button.disabled = button_disabled_value;
      }
    },
    d(detaching) {
      if (detaching)
        detach(button);
      mounted = false;
      dispose();
    }
  };
}
__name(create_if_block_1$5, "create_if_block_1$5");
function create_else_block$3(ctx) {
  let button;
  let t0_value = localize("REST-RECOVERY.Dialogs.RestSteps.Next") + "";
  let t0;
  let t1;
  let i;
  let mounted;
  let dispose;
  return {
    c() {
      button = element("button");
      t0 = text(t0_value);
      t1 = space();
      i = element("i");
      attr(i, "class", "fas fa-chevron-right");
      attr(button, "type", "button");
      attr(button, "class", "dialog-button");
    },
    m(target, anchor) {
      insert(target, button, anchor);
      append(button, t0);
      append(button, t1);
      append(button, i);
      if (!mounted) {
        dispose = listen(button, "click", ctx[31]);
        mounted = true;
      }
    },
    p: noop,
    d(detaching) {
      if (detaching)
        detach(button);
      mounted = false;
      dispose();
    }
  };
}
__name(create_else_block$3, "create_else_block$3");
function create_if_block$6(ctx) {
  let button;
  let i;
  let t0;
  let t1_value = localize("REST-RECOVERY.Dialogs.ShortRest.FinishRest") + "";
  let t1;
  let mounted;
  let dispose;
  return {
    c() {
      button = element("button");
      i = element("i");
      t0 = space();
      t1 = text(t1_value);
      attr(i, "class", "fas fa-bed");
      attr(button, "type", "button");
      attr(button, "class", "dialog-button");
    },
    m(target, anchor) {
      insert(target, button, anchor);
      append(button, i);
      append(button, t0);
      append(button, t1);
      if (!mounted) {
        dispose = listen(button, "click", ctx[1]);
        mounted = true;
      }
    },
    p: noop,
    d(detaching) {
      if (detaching)
        detach(button);
      mounted = false;
      dispose();
    }
  };
}
__name(create_if_block$6, "create_if_block$6");
function create_default_slot$5(ctx) {
  let form_1;
  let t0;
  let current_block_type_index;
  let if_block1;
  let t1;
  let footer;
  let t2;
  let current;
  let mounted;
  let dispose;
  let if_block0 = ctx[6].steps.length > 1 && create_if_block_9$1(ctx);
  const if_block_creators = [create_if_block_2$3, create_else_block_3$1];
  const if_blocks = [];
  function select_block_type(ctx2, dirty) {
    if (ctx2[15])
      return 0;
    return 1;
  }
  __name(select_block_type, "select_block_type");
  current_block_type_index = select_block_type(ctx);
  if_block1 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
  let if_block2 = ctx[6].steps.length > 1 && create_if_block_1$5(ctx);
  function select_block_type_3(ctx2, dirty) {
    if (ctx2[11] === ctx2[6].steps.length - 1)
      return create_if_block$6;
    return create_else_block$3;
  }
  __name(select_block_type_3, "select_block_type_3");
  let current_block_type = select_block_type_3(ctx);
  let if_block3 = current_block_type(ctx);
  return {
    c() {
      form_1 = element("form");
      if (if_block0)
        if_block0.c();
      t0 = space();
      if_block1.c();
      t1 = space();
      footer = element("footer");
      if (if_block2)
        if_block2.c();
      t2 = space();
      if_block3.c();
      attr(footer, "class", "flexrow");
      set_style(footer, "margin-top", "0.5rem");
      attr(form_1, "autocomplete", "off");
      attr(form_1, "id", "short-rest-hd");
      attr(form_1, "class", "dialog-content");
    },
    m(target, anchor) {
      insert(target, form_1, anchor);
      if (if_block0)
        if_block0.m(form_1, null);
      append(form_1, t0);
      if_blocks[current_block_type_index].m(form_1, null);
      append(form_1, t1);
      append(form_1, footer);
      if (if_block2)
        if_block2.m(footer, null);
      append(footer, t2);
      if_block3.m(footer, null);
      ctx[32](form_1);
      current = true;
      if (!mounted) {
        dispose = listen(form_1, "submit", prevent_default(ctx[18]));
        mounted = true;
      }
    },
    p(ctx2, dirty) {
      if (ctx2[6].steps.length > 1) {
        if (if_block0) {
          if_block0.p(ctx2, dirty);
          if (dirty[0] & 64) {
            transition_in(if_block0, 1);
          }
        } else {
          if_block0 = create_if_block_9$1(ctx2);
          if_block0.c();
          transition_in(if_block0, 1);
          if_block0.m(form_1, t0);
        }
      } else if (if_block0) {
        group_outros();
        transition_out(if_block0, 1, 1, () => {
          if_block0 = null;
        });
        check_outros();
      }
      if_block1.p(ctx2, dirty);
      if (ctx2[6].steps.length > 1) {
        if (if_block2) {
          if_block2.p(ctx2, dirty);
        } else {
          if_block2 = create_if_block_1$5(ctx2);
          if_block2.c();
          if_block2.m(footer, t2);
        }
      } else if (if_block2) {
        if_block2.d(1);
        if_block2 = null;
      }
      if (current_block_type === (current_block_type = select_block_type_3(ctx2)) && if_block3) {
        if_block3.p(ctx2, dirty);
      } else {
        if_block3.d(1);
        if_block3 = current_block_type(ctx2);
        if (if_block3) {
          if_block3.c();
          if_block3.m(footer, null);
        }
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(if_block0);
      transition_in(if_block1);
      current = true;
    },
    o(local) {
      transition_out(if_block0);
      transition_out(if_block1);
      current = false;
    },
    d(detaching) {
      if (detaching)
        detach(form_1);
      if (if_block0)
        if_block0.d();
      if_blocks[current_block_type_index].d();
      if (if_block2)
        if_block2.d();
      if_block3.d();
      ctx[32](null);
      mounted = false;
      dispose();
    }
  };
}
__name(create_default_slot$5, "create_default_slot$5");
function create_fragment$9(ctx) {
  let applicationshell;
  let updating_elementRoot;
  let current;
  function applicationshell_elementRoot_binding(value) {
    ctx[33](value);
  }
  __name(applicationshell_elementRoot_binding, "applicationshell_elementRoot_binding");
  let applicationshell_props = {
    $$slots: { default: [create_default_slot$5] },
    $$scope: { ctx }
  };
  if (ctx[0] !== void 0) {
    applicationshell_props.elementRoot = ctx[0];
  }
  applicationshell = new ApplicationShell({ props: applicationshell_props });
  binding_callbacks.push(() => bind(applicationshell, "elementRoot", applicationshell_elementRoot_binding, ctx[0]));
  return {
    c() {
      create_component(applicationshell.$$.fragment);
    },
    m(target, anchor) {
      mount_component(applicationshell, target, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      const applicationshell_changes = {};
      if (dirty[0] & 4092 | dirty[1] & 2048) {
        applicationshell_changes.$$scope = { dirty, ctx: ctx2 };
      }
      if (!updating_elementRoot && dirty[0] & 1) {
        updating_elementRoot = true;
        applicationshell_changes.elementRoot = ctx2[0];
        add_flush_callback(() => updating_elementRoot = false);
      }
      applicationshell.$set(applicationshell_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(applicationshell.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(applicationshell.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(applicationshell, detaching);
    }
  };
}
__name(create_fragment$9, "create_fragment$9");
function instance$9($$self, $$props, $$invalidate) {
  let $doc;
  const { application } = getContext("external");
  let { elementRoot } = $$props;
  const actor = application.options.actor;
  let currHP;
  let maxHP;
  let healthPercentage;
  let form;
  let startedShortRest = false;
  const workflow = RestWorkflow.get(actor);
  const maxShortRests = getSetting(CONSTANTS.SETTINGS.MAX_SHORT_RESTS);
  const enableRollHitDice = !getSetting(CONSTANTS.SETTINGS.DISABLE_SHORT_REST_HIT_DICE);
  const currentShortRests = getProperty(actor, CONSTANTS.FLAGS.CURRENT_NUM_SHORT_RESTS) || 0;
  const enableShortRest = maxShortRests === 0 || currentShortRests < maxShortRests;
  const minSpendHitDice = enableRollHitDice ? getSetting(CONSTANTS.SETTINGS.MIN_HIT_DIE_SPEND) || 0 : 0;
  const maxHitDiceSpendMultiplier = determineMultiplier(CONSTANTS.SETTINGS.MAX_HIT_DICE_SPEND);
  let maxSpendHitDice = typeof maxHitDiceSpendMultiplier === "string" ? Math.floor(evaluateFormula(maxHitDiceSpendMultiplier, actor.getRollData())?.total ?? 0) : Math.floor(actor.system.details.level * maxHitDiceSpendMultiplier);
  maxSpendHitDice = Math.max(minSpendHitDice, maxSpendHitDice);
  const simpleCalendarActive = getSetting(CONSTANTS.SETTINGS.ENABLE_SIMPLE_CALENDAR_INTEGRATION);
  const timeChanges = getTimeChanges(false);
  let newDay = simpleCalendarActive ? timeChanges.isNewDay : application.options.newDay;
  let promptNewDay = !simpleCalendarActive && workflow.restVariant !== "epic" && application.options.promptNewDay;
  updateHealthBarText();
  let healthData = workflow.healthData;
  let selectedHitDice = Object.entries(workflow.healthData.availableHitDice).filter((entry) => entry[1])?.[0]?.[0];
  async function requestSubmit() {
    if (minSpendHitDice > 0 && healthData.hitDiceSpent < minSpendHitDice) {
      if (workflow.totalHitDice <= 0) {
        await TJSDialog.prompt({
          title: localize("REST-RECOVERY.Dialogs.RestNoHitDice.Title"),
          content: {
            class: Dialog,
            props: {
              icon: "fas fa-exclamation-triangle",
              header: localize("REST-RECOVERY.Dialogs.RestNoHitDice.Title"),
              content: localize("REST-RECOVERY.Dialogs.RestNoHitDice.Content", {
                num_dice: minSpendHitDice - healthData.hitDiceSpent
              })
            }
          },
          modal: true,
          draggable: false,
          options: {
            height: "auto",
            headerButtonNoClose: true
          }
        });
        return false;
      }
      const doContinue = await TJSDialog.confirm({
        title: localize("REST-RECOVERY.Dialogs.RestSpendHitDice.Title"),
        content: {
          class: Dialog,
          props: {
            icon: "fas fa-exclamation-triangle",
            header: localize("REST-RECOVERY.Dialogs.RestSpendHitDice.Title"),
            content: localize("REST-RECOVERY.Dialogs.RestSpendHitDice.Content", {
              num_dice: minSpendHitDice - healthData.hitDiceSpent
            })
          }
        },
        modal: true,
        draggable: false,
        options: {
          height: "auto",
          headerButtonNoClose: true
        }
      });
      if (!doContinue)
        return false;
      await rollHitDice();
    }
    if (workflow.healthPercentage <= 0.75 && workflow.healthRegained === 0 && workflow.totalHitDice > 0) {
      const doContinue = await TJSDialog.confirm({
        title: localize("REST-RECOVERY.Dialogs.RestHealthWarning.Title"),
        content: {
          class: Dialog,
          props: {
            icon: "fas fa-exclamation-triangle",
            header: localize("REST-RECOVERY.Dialogs.RestHealthWarning.Title"),
            content: localize("REST-RECOVERY.Dialogs.RestHealthWarning.Content")
          }
        },
        modal: true,
        draggable: false,
        options: {
          height: "auto",
          headerButtonNoClose: true
        }
      });
      if (!doContinue)
        return false;
    }
    form.requestSubmit();
  }
  __name(requestSubmit, "requestSubmit");
  async function updateSettings() {
    $$invalidate(6, workflow.finished = true, workflow);
    application.options.resolve(newDay);
    application.close();
  }
  __name(updateSettings, "updateSettings");
  async function nextStep() {
    $$invalidate(11, activeStep = Math.min(workflow.steps.length, activeStep + 1));
  }
  __name(nextStep, "nextStep");
  async function prevStep() {
    $$invalidate(11, activeStep = Math.max(0, activeStep - 1));
  }
  __name(prevStep, "prevStep");
  async function rollHitDice(event) {
    const rolled = await workflow.rollHitDice(selectedHitDice, event?.ctrlKey === getSetting(CONSTANTS.SETTINGS.QUICK_HD_ROLL));
    if (!rolled)
      return;
    $$invalidate(9, healthData = workflow.healthData);
    $$invalidate(24, startedShortRest = true);
  }
  __name(rollHitDice, "rollHitDice");
  async function autoRollHitDie() {
    await workflow.autoSpendHitDice();
    $$invalidate(9, healthData = workflow.healthData);
    $$invalidate(24, startedShortRest = true);
  }
  __name(autoRollHitDie, "autoRollHitDie");
  const doc = new TJSDocument(actor);
  component_subscribe($$self, doc, (value) => $$invalidate(25, $doc = value));
  async function updateHealthData() {
    if (!startedShortRest) {
      await workflow.refreshHealthData();
      $$invalidate(9, healthData = workflow.healthData);
    }
    updateHealthBarText();
  }
  __name(updateHealthData, "updateHealthData");
  function updateHealthBarText() {
    $$invalidate(2, currHP = workflow.currHP);
    $$invalidate(3, maxHP = workflow.maxHP);
    $$invalidate(4, healthPercentage = currHP / maxHP);
  }
  __name(updateHealthBarText, "updateHealthBarText");
  let activeStep = 0;
  function steps_activeStep_binding(value) {
    activeStep = value;
    $$invalidate(11, activeStep);
  }
  __name(steps_activeStep_binding, "steps_activeStep_binding");
  function hitdieroller_selectedHitDice_binding(value) {
    selectedHitDice = value;
    $$invalidate(10, selectedHitDice);
  }
  __name(hitdieroller_selectedHitDice_binding, "hitdieroller_selectedHitDice_binding");
  function hitdieroller_healthData_binding(value) {
    healthData = value;
    $$invalidate(9, healthData);
  }
  __name(hitdieroller_healthData_binding, "hitdieroller_healthData_binding");
  function input_change_handler() {
    newDay = this.checked;
    $$invalidate(8, newDay);
  }
  __name(input_change_handler, "input_change_handler");
  const click_handler = /* @__PURE__ */ __name(() => {
    prevStep();
  }, "click_handler");
  const click_handler_1 = /* @__PURE__ */ __name(() => {
    nextStep();
  }, "click_handler_1");
  function form_1_binding($$value) {
    binding_callbacks[$$value ? "unshift" : "push"](() => {
      form = $$value;
      $$invalidate(5, form);
    });
  }
  __name(form_1_binding, "form_1_binding");
  function applicationshell_elementRoot_binding(value) {
    elementRoot = value;
    $$invalidate(0, elementRoot);
  }
  __name(applicationshell_elementRoot_binding, "applicationshell_elementRoot_binding");
  $$self.$$set = ($$props2) => {
    if ("elementRoot" in $$props2)
      $$invalidate(0, elementRoot = $$props2.elementRoot);
  };
  $$self.$$.update = () => {
    if ($$self.$$.dirty[0] & 16777216) {
      application.reactive.headerButtonNoClose = startedShortRest;
    }
    if ($$self.$$.dirty[0] & 33554432) {
      {
        const hpUpdate = getProperty(doc.updateOptions, "data.system.attributes.hp");
        if (hpUpdate) {
          updateHealthData();
        }
      }
    }
  };
  return [
    elementRoot,
    requestSubmit,
    currHP,
    maxHP,
    healthPercentage,
    form,
    workflow,
    maxSpendHitDice,
    newDay,
    healthData,
    selectedHitDice,
    activeStep,
    maxShortRests,
    enableRollHitDice,
    currentShortRests,
    enableShortRest,
    minSpendHitDice,
    promptNewDay,
    updateSettings,
    nextStep,
    prevStep,
    rollHitDice,
    autoRollHitDie,
    doc,
    startedShortRest,
    $doc,
    steps_activeStep_binding,
    hitdieroller_selectedHitDice_binding,
    hitdieroller_healthData_binding,
    input_change_handler,
    click_handler,
    click_handler_1,
    form_1_binding,
    applicationshell_elementRoot_binding
  ];
}
__name(instance$9, "instance$9");
class Short_rest_shell extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$9, create_fragment$9, safe_not_equal, { elementRoot: 0, requestSubmit: 1 }, null, [-1, -1]);
  }
  get elementRoot() {
    return this.$$.ctx[0];
  }
  set elementRoot(elementRoot) {
    this.$$set({ elementRoot });
    flush();
  }
  get requestSubmit() {
    return this.$$.ctx[1];
  }
}
__name(Short_rest_shell, "Short_rest_shell");
class ShortRestDialog extends CustomSvelteApplication {
  constructor(options = {}, dialogData = {}) {
    super({
      title: `${game.i18n.localize("DND5E.ShortRest")}: ${options.actor.name}`,
      zIndex: 102,
      svelte: {
        class: Short_rest_shell,
        target: document.body
      },
      close: () => this.options.reject(),
      ...options
    }, dialogData);
  }
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      closeOnSubmit: false,
      width: 350,
      height: "auto",
      classes: ["dnd5e dialog"]
    });
  }
}
__name(ShortRestDialog, "ShortRestDialog");
const CustomSettingsDialog_svelte_svelte_type_style_lang = "";
const { Map: Map_1 } = globals;
function get_each_context$5(ctx, list, i) {
  const child_ctx = ctx.slice();
  child_ctx[3] = list[i];
  child_ctx[5] = i;
  return child_ctx;
}
__name(get_each_context$5, "get_each_context$5");
function create_each_block$5(key_1, ctx) {
  let tr;
  let td0;
  let i;
  let t0;
  let t1_value = ctx[3].name + "";
  let t1;
  let t2;
  let td1;
  let t3_value = ctx[3].settingText + "";
  let t3;
  let t4;
  return {
    key: key_1,
    first: null,
    c() {
      tr = element("tr");
      td0 = element("td");
      i = element("i");
      t0 = space();
      t1 = text(t1_value);
      t2 = space();
      td1 = element("td");
      t3 = text(t3_value);
      t4 = space();
      attr(i, "class", "fas fa-info-circle svelte-cgeoso");
      attr(td0, "title", ctx[3].hint);
      this.first = tr;
    },
    m(target, anchor) {
      insert(target, tr, anchor);
      append(tr, td0);
      append(td0, i);
      append(td0, t0);
      append(td0, t1);
      append(tr, t2);
      append(tr, td1);
      append(td1, t3);
      append(tr, t4);
    },
    p(new_ctx, dirty) {
      ctx = new_ctx;
    },
    d(detaching) {
      if (detaching)
        detach(tr);
    }
  };
}
__name(create_each_block$5, "create_each_block$5");
function create_fragment$8(ctx) {
  let div;
  let h3;
  let t1;
  let p;
  let t3;
  let table;
  let tr;
  let t7;
  let each_blocks = [];
  let each_1_lookup = new Map_1();
  let each_value = ctx[0].filter(func);
  const get_key = /* @__PURE__ */ __name((ctx2) => ctx2[5], "get_key");
  for (let i = 0; i < each_value.length; i += 1) {
    let child_ctx = get_each_context$5(ctx, each_value, i);
    let key = get_key(child_ctx);
    each_1_lookup.set(key, each_blocks[i] = create_each_block$5(key, child_ctx));
  }
  return {
    c() {
      div = element("div");
      h3 = element("h3");
      h3.textContent = `${localize("REST-RECOVERY.Dialogs.LongRestSettingsDialog.Title")}`;
      t1 = space();
      p = element("p");
      p.textContent = `${localize("REST-RECOVERY.Dialogs.LongRestSettingsDialog.Content")}`;
      t3 = space();
      table = element("table");
      tr = element("tr");
      tr.innerHTML = `<th class="svelte-cgeoso">Setting</th> 
      <th class="svelte-cgeoso">Value</th>`;
      t7 = space();
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].c();
      }
      attr(table, "class", "svelte-cgeoso");
    },
    m(target, anchor) {
      insert(target, div, anchor);
      append(div, h3);
      append(div, t1);
      append(div, p);
      append(div, t3);
      append(div, table);
      append(table, tr);
      append(table, t7);
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].m(table, null);
      }
    },
    p(ctx2, [dirty]) {
      if (dirty & 1) {
        each_value = ctx2[0].filter(func);
        each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx2, each_value, each_1_lookup, table, destroy_block, create_each_block$5, null, get_each_context$5);
      }
    },
    i: noop,
    o: noop,
    d(detaching) {
      if (detaching)
        detach(div);
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].d();
      }
    }
  };
}
__name(create_fragment$8, "create_fragment$8");
const func = /* @__PURE__ */ __name((s) => s.visible, "func");
function instance$8($$self, $$props, $$invalidate) {
  let { settings = {} } = $$props;
  const settingsMap = /* @__PURE__ */ new Map();
  const shownSettings = Object.entries(CONSTANTS.GET_DEFAULT_SETTINGS()).map((entry) => {
    let [key, setting] = entry;
    setting.name = localize(setting.name);
    setting.hint = localize(setting.hint);
    setting.value = settings[key] ?? getSetting(key);
    if (setting.customSettingsDialog) {
      if (typeof setting.value === "boolean") {
        setting.settingText = setting.value ? "Yes" : "No";
      } else if (typeof setting.value === "string") {
        setting.settingText = localize(setting.choices[setting.value]);
      } else {
        setting.settingText = setting.value;
      }
    }
    settingsMap.set(key, setting);
    return setting;
  }).map((setting) => {
    setting.visible = setting.customSettingsDialog && (setting.validate ? !setting.validate(settingsMap) : true) && !!setting?.settingText && !!setting.value && (setting.default !== setting.value || setting.nonDefaultSetting);
    return setting;
  });
  $$self.$$set = ($$props2) => {
    if ("settings" in $$props2)
      $$invalidate(1, settings = $$props2.settings);
  };
  return [shownSettings, settings];
}
__name(instance$8, "instance$8");
class CustomSettingsDialog extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$8, create_fragment$8, safe_not_equal, { settings: 1 });
  }
}
__name(CustomSettingsDialog, "CustomSettingsDialog");
const longRestShell_svelte_svelte_type_style_lang = "";
function create_if_block_13(ctx) {
  let steps;
  let updating_activeStep;
  let current;
  function steps_activeStep_binding(value) {
    ctx[28](value);
  }
  __name(steps_activeStep_binding, "steps_activeStep_binding");
  let steps_props = { steps: ctx[5].steps };
  if (ctx[10] !== void 0) {
    steps_props.activeStep = ctx[10];
  }
  steps = new Steps({ props: steps_props });
  binding_callbacks.push(() => bind(steps, "activeStep", steps_activeStep_binding, ctx[10]));
  return {
    c() {
      create_component(steps.$$.fragment);
    },
    m(target, anchor) {
      mount_component(steps, target, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      const steps_changes = {};
      if (dirty[0] & 32)
        steps_changes.steps = ctx2[5].steps;
      if (!updating_activeStep && dirty[0] & 1024) {
        updating_activeStep = true;
        steps_changes.activeStep = ctx2[10];
        add_flush_callback(() => updating_activeStep = false);
      }
      steps.$set(steps_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(steps.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(steps.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(steps, detaching);
    }
  };
}
__name(create_if_block_13, "create_if_block_13");
function create_else_block_3(ctx) {
  let switch_instance;
  let switch_instance_anchor;
  let current;
  var switch_value = ctx[5].steps[ctx[10]].component;
  function switch_props(ctx2) {
    return { props: { workflow: ctx2[5] } };
  }
  __name(switch_props, "switch_props");
  if (switch_value) {
    switch_instance = construct_svelte_component(switch_value, switch_props(ctx));
  }
  return {
    c() {
      if (switch_instance)
        create_component(switch_instance.$$.fragment);
      switch_instance_anchor = empty();
    },
    m(target, anchor) {
      if (switch_instance)
        mount_component(switch_instance, target, anchor);
      insert(target, switch_instance_anchor, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      const switch_instance_changes = {};
      if (dirty[0] & 32)
        switch_instance_changes.workflow = ctx2[5];
      if (switch_value !== (switch_value = ctx2[5].steps[ctx2[10]].component)) {
        if (switch_instance) {
          group_outros();
          const old_component = switch_instance;
          transition_out(old_component.$$.fragment, 1, 0, () => {
            destroy_component(old_component, 1);
          });
          check_outros();
        }
        if (switch_value) {
          switch_instance = construct_svelte_component(switch_value, switch_props(ctx2));
          create_component(switch_instance.$$.fragment);
          transition_in(switch_instance.$$.fragment, 1);
          mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
        } else {
          switch_instance = null;
        }
      } else if (switch_value) {
        switch_instance.$set(switch_instance_changes);
      }
    },
    i(local) {
      if (current)
        return;
      if (switch_instance)
        transition_in(switch_instance.$$.fragment, local);
      current = true;
    },
    o(local) {
      if (switch_instance)
        transition_out(switch_instance.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      if (detaching)
        detach(switch_instance_anchor);
      if (switch_instance)
        destroy_component(switch_instance, detaching);
    }
  };
}
__name(create_else_block_3, "create_else_block_3");
function create_if_block_4$1(ctx) {
  let t0;
  let t1;
  let t2;
  let t3;
  let if_block4_anchor;
  let current;
  function select_block_type_1(ctx2, dirty) {
    if (ctx2[12])
      return create_if_block_12;
    return create_else_block_2;
  }
  __name(select_block_type_1, "select_block_type_1");
  let current_block_type = select_block_type_1(ctx);
  let if_block0 = current_block_type(ctx);
  let if_block1 = !ctx[7] && create_if_block_8(ctx);
  let if_block2 = ctx[14] && create_if_block_7(ctx);
  let if_block3 = ctx[15] > 0 && ctx[15] !== ctx[8].level && create_if_block_6(ctx);
  let if_block4 = ctx[16] && create_if_block_5$1(ctx);
  return {
    c() {
      if_block0.c();
      t0 = space();
      if (if_block1)
        if_block1.c();
      t1 = space();
      if (if_block2)
        if_block2.c();
      t2 = space();
      if (if_block3)
        if_block3.c();
      t3 = space();
      if (if_block4)
        if_block4.c();
      if_block4_anchor = empty();
    },
    m(target, anchor) {
      if_block0.m(target, anchor);
      insert(target, t0, anchor);
      if (if_block1)
        if_block1.m(target, anchor);
      insert(target, t1, anchor);
      if (if_block2)
        if_block2.m(target, anchor);
      insert(target, t2, anchor);
      if (if_block3)
        if_block3.m(target, anchor);
      insert(target, t3, anchor);
      if (if_block4)
        if_block4.m(target, anchor);
      insert(target, if_block4_anchor, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      if_block0.p(ctx2, dirty);
      if (!ctx2[7]) {
        if (if_block1) {
          if_block1.p(ctx2, dirty);
          if (dirty[0] & 128) {
            transition_in(if_block1, 1);
          }
        } else {
          if_block1 = create_if_block_8(ctx2);
          if_block1.c();
          transition_in(if_block1, 1);
          if_block1.m(t1.parentNode, t1);
        }
      } else if (if_block1) {
        group_outros();
        transition_out(if_block1, 1, 1, () => {
          if_block1 = null;
        });
        check_outros();
      }
      if (ctx2[14])
        if_block2.p(ctx2, dirty);
      if (ctx2[15] > 0 && ctx2[15] !== ctx2[8].level) {
        if (if_block3) {
          if_block3.p(ctx2, dirty);
        } else {
          if_block3 = create_if_block_6(ctx2);
          if_block3.c();
          if_block3.m(t3.parentNode, t3);
        }
      } else if (if_block3) {
        if_block3.d(1);
        if_block3 = null;
      }
      if (ctx2[16])
        if_block4.p(ctx2, dirty);
    },
    i(local) {
      if (current)
        return;
      transition_in(if_block1);
      transition_in(if_block2);
      current = true;
    },
    o(local) {
      transition_out(if_block1);
      transition_out(if_block2);
      current = false;
    },
    d(detaching) {
      if_block0.d(detaching);
      if (detaching)
        detach(t0);
      if (if_block1)
        if_block1.d(detaching);
      if (detaching)
        detach(t1);
      if (if_block2)
        if_block2.d(detaching);
      if (detaching)
        detach(t2);
      if (if_block3)
        if_block3.d(detaching);
      if (detaching)
        detach(t3);
      if (if_block4)
        if_block4.d(detaching);
      if (detaching)
        detach(if_block4_anchor);
    }
  };
}
__name(create_if_block_4$1, "create_if_block_4$1");
function create_else_block_2(ctx) {
  let p0;
  let t1;
  let p1;
  let a;
  let mounted;
  let dispose;
  return {
    c() {
      p0 = element("p");
      p0.textContent = `${localize("REST-RECOVERY.Dialogs.LongRest.CustomRules")}`;
      t1 = space();
      p1 = element("p");
      a = element("a");
      a.textContent = `${localize("REST-RECOVERY.Dialogs.LongRest.CustomRulesLink")}`;
      set_style(a, "color", "var(--color-text-hyperlink)");
      attr(p1, "class", "notes");
    },
    m(target, anchor) {
      insert(target, p0, anchor);
      insert(target, t1, anchor);
      insert(target, p1, anchor);
      append(p1, a);
      if (!mounted) {
        dispose = listen(a, "click", ctx[25]);
        mounted = true;
      }
    },
    p: noop,
    d(detaching) {
      if (detaching)
        detach(p0);
      if (detaching)
        detach(t1);
      if (detaching)
        detach(p1);
      mounted = false;
      dispose();
    }
  };
}
__name(create_else_block_2, "create_else_block_2");
function create_if_block_12(ctx) {
  let p;
  return {
    c() {
      p = element("p");
      p.textContent = `${localize("DND5E.LongRestHint")}`;
    },
    m(target, anchor) {
      insert(target, p, anchor);
    },
    p: noop,
    d(detaching) {
      if (detaching)
        detach(p);
    }
  };
}
__name(create_if_block_12, "create_if_block_12");
function create_if_block_8(ctx) {
  let t;
  let if_block1_anchor;
  let current;
  let if_block0 = ctx[13] && create_if_block_11(ctx);
  let if_block1 = (ctx[11] || ctx[6]) && create_if_block_9(ctx);
  return {
    c() {
      if (if_block0)
        if_block0.c();
      t = space();
      if (if_block1)
        if_block1.c();
      if_block1_anchor = empty();
    },
    m(target, anchor) {
      if (if_block0)
        if_block0.m(target, anchor);
      insert(target, t, anchor);
      if (if_block1)
        if_block1.m(target, anchor);
      insert(target, if_block1_anchor, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      if (ctx2[13])
        if_block0.p(ctx2, dirty);
      if (ctx2[11] || ctx2[6]) {
        if (if_block1) {
          if_block1.p(ctx2, dirty);
        } else {
          if_block1 = create_if_block_9(ctx2);
          if_block1.c();
          if_block1.m(if_block1_anchor.parentNode, if_block1_anchor);
        }
      } else if (if_block1) {
        if_block1.d(1);
        if_block1 = null;
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(if_block0);
      current = true;
    },
    o(local) {
      transition_out(if_block0);
      current = false;
    },
    d(detaching) {
      if (if_block0)
        if_block0.d(detaching);
      if (detaching)
        detach(t);
      if (if_block1)
        if_block1.d(detaching);
      if (detaching)
        detach(if_block1_anchor);
    }
  };
}
__name(create_if_block_8, "create_if_block_8");
function create_if_block_11(ctx) {
  let hitdieroller;
  let updating_selectedHitDice;
  let updating_healthData;
  let current;
  function hitdieroller_selectedHitDice_binding(value) {
    ctx[29](value);
  }
  __name(hitdieroller_selectedHitDice_binding, "hitdieroller_selectedHitDice_binding");
  function hitdieroller_healthData_binding(value) {
    ctx[30](value);
  }
  __name(hitdieroller_healthData_binding, "hitdieroller_healthData_binding");
  let hitdieroller_props = {
    onHitDiceFunction: ctx[21],
    onAutoFunction: ctx[23],
    workflow: ctx[5],
    maxSpendHitDice: ctx[15]
  };
  if (ctx[9] !== void 0) {
    hitdieroller_props.selectedHitDice = ctx[9];
  }
  if (ctx[8] !== void 0) {
    hitdieroller_props.healthData = ctx[8];
  }
  hitdieroller = new HitDieRoller({ props: hitdieroller_props });
  binding_callbacks.push(() => bind(hitdieroller, "selectedHitDice", hitdieroller_selectedHitDice_binding, ctx[9]));
  binding_callbacks.push(() => bind(hitdieroller, "healthData", hitdieroller_healthData_binding, ctx[8]));
  return {
    c() {
      create_component(hitdieroller.$$.fragment);
    },
    m(target, anchor) {
      mount_component(hitdieroller, target, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      const hitdieroller_changes = {};
      if (dirty[0] & 32)
        hitdieroller_changes.workflow = ctx2[5];
      if (!updating_selectedHitDice && dirty[0] & 512) {
        updating_selectedHitDice = true;
        hitdieroller_changes.selectedHitDice = ctx2[9];
        add_flush_callback(() => updating_selectedHitDice = false);
      }
      if (!updating_healthData && dirty[0] & 256) {
        updating_healthData = true;
        hitdieroller_changes.healthData = ctx2[8];
        add_flush_callback(() => updating_healthData = false);
      }
      hitdieroller.$set(hitdieroller_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(hitdieroller.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(hitdieroller.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(hitdieroller, detaching);
    }
  };
}
__name(create_if_block_11, "create_if_block_11");
function create_if_block_9(ctx) {
  let div;
  let label;
  let t0_value = localize(!ctx[11] && ctx[6] ? "REST-RECOVERY.Dialogs.LongRest.ForcedNewDayTitle" : "DND5E.NewDay") + "";
  let t0;
  let t1;
  let t2;
  let p;
  let t3_value = localize(!ctx[11] && ctx[6] ? "REST-RECOVERY.Dialogs.LongRest.ForcedNewDayHint" : "DND5E.NewDayHint") + "";
  let t3;
  let if_block = ctx[11] && create_if_block_10(ctx);
  return {
    c() {
      div = element("div");
      label = element("label");
      t0 = text(t0_value);
      t1 = space();
      if (if_block)
        if_block.c();
      t2 = space();
      p = element("p");
      t3 = text(t3_value);
      attr(p, "class", "hint");
      attr(div, "class", "form-group");
    },
    m(target, anchor) {
      insert(target, div, anchor);
      append(div, label);
      append(label, t0);
      append(div, t1);
      if (if_block)
        if_block.m(div, null);
      append(div, t2);
      append(div, p);
      append(p, t3);
    },
    p(ctx2, dirty) {
      if (dirty[0] & 64 && t0_value !== (t0_value = localize(!ctx2[11] && ctx2[6] ? "REST-RECOVERY.Dialogs.LongRest.ForcedNewDayTitle" : "DND5E.NewDay") + ""))
        set_data(t0, t0_value);
      if (ctx2[11])
        if_block.p(ctx2, dirty);
      if (dirty[0] & 64 && t3_value !== (t3_value = localize(!ctx2[11] && ctx2[6] ? "REST-RECOVERY.Dialogs.LongRest.ForcedNewDayHint" : "DND5E.NewDayHint") + ""))
        set_data(t3, t3_value);
    },
    d(detaching) {
      if (detaching)
        detach(div);
      if (if_block)
        if_block.d();
    }
  };
}
__name(create_if_block_9, "create_if_block_9");
function create_if_block_10(ctx) {
  let input;
  let mounted;
  let dispose;
  return {
    c() {
      input = element("input");
      attr(input, "type", "checkbox");
    },
    m(target, anchor) {
      insert(target, input, anchor);
      input.checked = ctx[6];
      if (!mounted) {
        dispose = listen(input, "change", ctx[31]);
        mounted = true;
      }
    },
    p(ctx2, dirty) {
      if (dirty[0] & 64) {
        input.checked = ctx2[6];
      }
    },
    d(detaching) {
      if (detaching)
        detach(input);
      mounted = false;
      dispose();
    }
  };
}
__name(create_if_block_10, "create_if_block_10");
function create_if_block_7(ctx) {
  let healthbar;
  let current;
  healthbar = new HealthBar({
    props: {
      text: ctx[1],
      progress: ctx[2],
      progressGhost: ctx[3]
    }
  });
  return {
    c() {
      create_component(healthbar.$$.fragment);
    },
    m(target, anchor) {
      mount_component(healthbar, target, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      const healthbar_changes = {};
      if (dirty[0] & 2)
        healthbar_changes.text = ctx2[1];
      if (dirty[0] & 4)
        healthbar_changes.progress = ctx2[2];
      if (dirty[0] & 8)
        healthbar_changes.progressGhost = ctx2[3];
      healthbar.$set(healthbar_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(healthbar.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(healthbar.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(healthbar, detaching);
    }
  };
}
__name(create_if_block_7, "create_if_block_7");
function create_if_block_6(ctx) {
  let p;
  let raw_value = localize("REST-RECOVERY.Dialogs.LongRest.MaxHitDiceSpend", {
    max_spend: ctx[15],
    current: ctx[15] - ctx[8].hitDiceSpent
  }) + "";
  return {
    c() {
      p = element("p");
    },
    m(target, anchor) {
      insert(target, p, anchor);
      p.innerHTML = raw_value;
    },
    p(ctx2, dirty) {
      if (dirty[0] & 256 && raw_value !== (raw_value = localize("REST-RECOVERY.Dialogs.LongRest.MaxHitDiceSpend", {
        max_spend: ctx2[15],
        current: ctx2[15] - ctx2[8].hitDiceSpent
      }) + ""))
        p.innerHTML = raw_value;
    },
    d(detaching) {
      if (detaching)
        detach(p);
    }
  };
}
__name(create_if_block_6, "create_if_block_6");
function create_if_block_5$1(ctx) {
  let div;
  let label;
  let t1;
  let input;
  let t2;
  let p;
  let mounted;
  let dispose;
  return {
    c() {
      div = element("div");
      label = element("label");
      label.textContent = `${localize("REST-RECOVERY.Dialogs.LongRest.ArmorRecovery")}`;
      t1 = space();
      input = element("input");
      t2 = space();
      p = element("p");
      p.textContent = `${localize("REST-RECOVERY.Dialogs.LongRest.ArmorRecoveryHint")}`;
      attr(input, "type", "checkbox");
      attr(p, "class", "hint");
      attr(div, "class", "form-group");
    },
    m(target, anchor) {
      insert(target, div, anchor);
      append(div, label);
      append(div, t1);
      append(div, input);
      input.checked = ctx[8].removeNonLightArmor;
      append(div, t2);
      append(div, p);
      if (!mounted) {
        dispose = listen(input, "change", ctx[32]);
        mounted = true;
      }
    },
    p(ctx2, dirty) {
      if (dirty[0] & 256) {
        input.checked = ctx2[8].removeNonLightArmor;
      }
    },
    d(detaching) {
      if (detaching)
        detach(div);
      mounted = false;
      dispose();
    }
  };
}
__name(create_if_block_5$1, "create_if_block_5$1");
function create_if_block_3$2(ctx) {
  let div;
  let p;
  return {
    c() {
      div = element("div");
      p = element("p");
      p.textContent = `${localize("REST-RECOVERY.Dialogs.LongRest.BeginExplanation")}`;
      attr(p, "class", "notes");
      attr(div, "class", "form-group");
      set_style(div, "margin", "0.5rem 0");
    },
    m(target, anchor) {
      insert(target, div, anchor);
      append(div, p);
    },
    p: noop,
    d(detaching) {
      if (detaching)
        detach(div);
    }
  };
}
__name(create_if_block_3$2, "create_if_block_3$2");
function create_else_block$2(ctx) {
  let t;
  let if_block1_anchor;
  let if_block0 = ctx[5].steps.length > 1 && !ctx[7] && create_if_block_2$2(ctx);
  function select_block_type_3(ctx2, dirty) {
    if (ctx2[10] === ctx2[5].steps.length - 1)
      return create_if_block_1$4;
    return create_else_block_1$1;
  }
  __name(select_block_type_3, "select_block_type_3");
  let current_block_type = select_block_type_3(ctx);
  let if_block1 = current_block_type(ctx);
  return {
    c() {
      if (if_block0)
        if_block0.c();
      t = space();
      if_block1.c();
      if_block1_anchor = empty();
    },
    m(target, anchor) {
      if (if_block0)
        if_block0.m(target, anchor);
      insert(target, t, anchor);
      if_block1.m(target, anchor);
      insert(target, if_block1_anchor, anchor);
    },
    p(ctx2, dirty) {
      if (ctx2[5].steps.length > 1 && !ctx2[7]) {
        if (if_block0) {
          if_block0.p(ctx2, dirty);
        } else {
          if_block0 = create_if_block_2$2(ctx2);
          if_block0.c();
          if_block0.m(t.parentNode, t);
        }
      } else if (if_block0) {
        if_block0.d(1);
        if_block0 = null;
      }
      if (current_block_type === (current_block_type = select_block_type_3(ctx2)) && if_block1) {
        if_block1.p(ctx2, dirty);
      } else {
        if_block1.d(1);
        if_block1 = current_block_type(ctx2);
        if (if_block1) {
          if_block1.c();
          if_block1.m(if_block1_anchor.parentNode, if_block1_anchor);
        }
      }
    },
    d(detaching) {
      if (if_block0)
        if_block0.d(detaching);
      if (detaching)
        detach(t);
      if_block1.d(detaching);
      if (detaching)
        detach(if_block1_anchor);
    }
  };
}
__name(create_else_block$2, "create_else_block$2");
function create_if_block$5(ctx) {
  let button;
  let i;
  let t0;
  let t1_value = localize("REST-RECOVERY.Dialogs.LongRest.Begin") + "";
  let t1;
  let mounted;
  let dispose;
  return {
    c() {
      button = element("button");
      i = element("i");
      t0 = space();
      t1 = text(t1_value);
      attr(i, "class", "fas fa-bed");
      attr(button, "type", "button");
      attr(button, "class", "dialog-button svelte-1p7201f");
    },
    m(target, anchor) {
      insert(target, button, anchor);
      append(button, i);
      append(button, t0);
      append(button, t1);
      if (!mounted) {
        dispose = listen(button, "click", ctx[22]);
        mounted = true;
      }
    },
    p: noop,
    d(detaching) {
      if (detaching)
        detach(button);
      mounted = false;
      dispose();
    }
  };
}
__name(create_if_block$5, "create_if_block$5");
function create_if_block_2$2(ctx) {
  let button;
  let i;
  let t0;
  let t1_value = localize("REST-RECOVERY.Dialogs.RestSteps.Prev") + "";
  let t1;
  let button_disabled_value;
  let mounted;
  let dispose;
  return {
    c() {
      button = element("button");
      i = element("i");
      t0 = space();
      t1 = text(t1_value);
      attr(i, "class", "fas fa-chevron-left");
      attr(button, "type", "button");
      attr(button, "class", "dialog-button svelte-1p7201f");
      button.disabled = button_disabled_value = ctx[10] === 0;
    },
    m(target, anchor) {
      insert(target, button, anchor);
      append(button, i);
      append(button, t0);
      append(button, t1);
      if (!mounted) {
        dispose = listen(button, "click", ctx[33]);
        mounted = true;
      }
    },
    p(ctx2, dirty) {
      if (dirty[0] & 1024 && button_disabled_value !== (button_disabled_value = ctx2[10] === 0)) {
        button.disabled = button_disabled_value;
      }
    },
    d(detaching) {
      if (detaching)
        detach(button);
      mounted = false;
      dispose();
    }
  };
}
__name(create_if_block_2$2, "create_if_block_2$2");
function create_else_block_1$1(ctx) {
  let button;
  let t0_value = localize("REST-RECOVERY.Dialogs.RestSteps.Next") + "";
  let t0;
  let t1;
  let i;
  let mounted;
  let dispose;
  return {
    c() {
      button = element("button");
      t0 = text(t0_value);
      t1 = space();
      i = element("i");
      attr(i, "class", "fas fa-chevron-right");
      attr(button, "type", "button");
      attr(button, "class", "dialog-button svelte-1p7201f");
    },
    m(target, anchor) {
      insert(target, button, anchor);
      append(button, t0);
      append(button, t1);
      append(button, i);
      if (!mounted) {
        dispose = listen(button, "click", ctx[34]);
        mounted = true;
      }
    },
    p: noop,
    d(detaching) {
      if (detaching)
        detach(button);
      mounted = false;
      dispose();
    }
  };
}
__name(create_else_block_1$1, "create_else_block_1$1");
function create_if_block_1$4(ctx) {
  let button;
  let i;
  let t0;
  let t1_value = localize("REST-RECOVERY.Dialogs.LongRest.FinishRest") + "";
  let t1;
  let mounted;
  let dispose;
  return {
    c() {
      button = element("button");
      i = element("i");
      t0 = space();
      t1 = text(t1_value);
      attr(i, "class", "fas fa-bed");
      attr(button, "type", "button");
      attr(button, "class", "dialog-button svelte-1p7201f");
    },
    m(target, anchor) {
      insert(target, button, anchor);
      append(button, i);
      append(button, t0);
      append(button, t1);
      if (!mounted) {
        dispose = listen(button, "click", ctx[19]);
        mounted = true;
      }
    },
    p: noop,
    d(detaching) {
      if (detaching)
        detach(button);
      mounted = false;
      dispose();
    }
  };
}
__name(create_if_block_1$4, "create_if_block_1$4");
function create_default_slot$4(ctx) {
  let form_1;
  let t0;
  let current_block_type_index;
  let if_block1;
  let t1;
  let t2;
  let footer;
  let current;
  let mounted;
  let dispose;
  let if_block0 = ctx[5].steps.length > 1 && create_if_block_13(ctx);
  const if_block_creators = [create_if_block_4$1, create_else_block_3];
  const if_blocks = [];
  function select_block_type(ctx2, dirty) {
    if (ctx2[10] === 0)
      return 0;
    return 1;
  }
  __name(select_block_type, "select_block_type");
  current_block_type_index = select_block_type(ctx);
  if_block1 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
  let if_block2 = ctx[7] && create_if_block_3$2();
  function select_block_type_2(ctx2, dirty) {
    if (ctx2[7])
      return create_if_block$5;
    return create_else_block$2;
  }
  __name(select_block_type_2, "select_block_type_2");
  let current_block_type = select_block_type_2(ctx);
  let if_block3 = current_block_type(ctx);
  return {
    c() {
      form_1 = element("form");
      if (if_block0)
        if_block0.c();
      t0 = space();
      if_block1.c();
      t1 = space();
      if (if_block2)
        if_block2.c();
      t2 = space();
      footer = element("footer");
      if_block3.c();
      attr(footer, "class", "flexrow");
      set_style(footer, "margin-top", "0.5rem");
      attr(form_1, "autocomplete", "off");
      attr(form_1, "id", "short-rest-hd");
      attr(form_1, "class", "dialog-content");
    },
    m(target, anchor) {
      insert(target, form_1, anchor);
      if (if_block0)
        if_block0.m(form_1, null);
      append(form_1, t0);
      if_blocks[current_block_type_index].m(form_1, null);
      append(form_1, t1);
      if (if_block2)
        if_block2.m(form_1, null);
      append(form_1, t2);
      append(form_1, footer);
      if_block3.m(footer, null);
      ctx[35](form_1);
      current = true;
      if (!mounted) {
        dispose = listen(form_1, "submit", prevent_default(ctx[20]));
        mounted = true;
      }
    },
    p(ctx2, dirty) {
      if (ctx2[5].steps.length > 1) {
        if (if_block0) {
          if_block0.p(ctx2, dirty);
          if (dirty[0] & 32) {
            transition_in(if_block0, 1);
          }
        } else {
          if_block0 = create_if_block_13(ctx2);
          if_block0.c();
          transition_in(if_block0, 1);
          if_block0.m(form_1, t0);
        }
      } else if (if_block0) {
        group_outros();
        transition_out(if_block0, 1, 1, () => {
          if_block0 = null;
        });
        check_outros();
      }
      let previous_block_index = current_block_type_index;
      current_block_type_index = select_block_type(ctx2);
      if (current_block_type_index === previous_block_index) {
        if_blocks[current_block_type_index].p(ctx2, dirty);
      } else {
        group_outros();
        transition_out(if_blocks[previous_block_index], 1, 1, () => {
          if_blocks[previous_block_index] = null;
        });
        check_outros();
        if_block1 = if_blocks[current_block_type_index];
        if (!if_block1) {
          if_block1 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx2);
          if_block1.c();
        } else {
          if_block1.p(ctx2, dirty);
        }
        transition_in(if_block1, 1);
        if_block1.m(form_1, t1);
      }
      if (ctx2[7]) {
        if (if_block2) {
          if_block2.p(ctx2, dirty);
        } else {
          if_block2 = create_if_block_3$2();
          if_block2.c();
          if_block2.m(form_1, t2);
        }
      } else if (if_block2) {
        if_block2.d(1);
        if_block2 = null;
      }
      if (current_block_type === (current_block_type = select_block_type_2(ctx2)) && if_block3) {
        if_block3.p(ctx2, dirty);
      } else {
        if_block3.d(1);
        if_block3 = current_block_type(ctx2);
        if (if_block3) {
          if_block3.c();
          if_block3.m(footer, null);
        }
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(if_block0);
      transition_in(if_block1);
      current = true;
    },
    o(local) {
      transition_out(if_block0);
      transition_out(if_block1);
      current = false;
    },
    d(detaching) {
      if (detaching)
        detach(form_1);
      if (if_block0)
        if_block0.d();
      if_blocks[current_block_type_index].d();
      if (if_block2)
        if_block2.d();
      if_block3.d();
      ctx[35](null);
      mounted = false;
      dispose();
    }
  };
}
__name(create_default_slot$4, "create_default_slot$4");
function create_fragment$7(ctx) {
  let applicationshell;
  let updating_elementRoot;
  let current;
  function applicationshell_elementRoot_binding(value) {
    ctx[36](value);
  }
  __name(applicationshell_elementRoot_binding, "applicationshell_elementRoot_binding");
  let applicationshell_props = {
    $$slots: { default: [create_default_slot$4] },
    $$scope: { ctx }
  };
  if (ctx[0] !== void 0) {
    applicationshell_props.elementRoot = ctx[0];
  }
  applicationshell = new ApplicationShell({ props: applicationshell_props });
  binding_callbacks.push(() => bind(applicationshell, "elementRoot", applicationshell_elementRoot_binding, ctx[0]));
  return {
    c() {
      create_component(applicationshell.$$.fragment);
    },
    m(target, anchor) {
      mount_component(applicationshell, target, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      const applicationshell_changes = {};
      if (dirty[0] & 2046 | dirty[1] & 65536) {
        applicationshell_changes.$$scope = { dirty, ctx: ctx2 };
      }
      if (!updating_elementRoot && dirty[0] & 1) {
        updating_elementRoot = true;
        applicationshell_changes.elementRoot = ctx2[0];
        add_flush_callback(() => updating_elementRoot = false);
      }
      applicationshell.$set(applicationshell_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(applicationshell.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(applicationshell.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(applicationshell, detaching);
    }
  };
}
__name(create_fragment$7, "create_fragment$7");
function instance$7($$self, $$props, $$invalidate) {
  let $doc;
  const { application } = getContext("external");
  let { elementRoot } = $$props;
  const actor = application.options.actor;
  let healthBarText;
  let currHP;
  let maxHP;
  let healthPercentage;
  let healthPercentageToGain;
  let form;
  let startedLongRest = false;
  const workflow = RestWorkflow.get(actor);
  const simpleCalendarActive = getSetting(CONSTANTS.SETTINGS.ENABLE_SIMPLE_CALENDAR_INTEGRATION);
  const timeChanges = getTimeChanges(false);
  let newDay = simpleCalendarActive ? timeChanges.isNewDay : application.options.newDay ?? true;
  let promptNewDay = !simpleCalendarActive && workflow.restVariant !== "gritty" && application.options.promptNewDay;
  let usingDefaultSettings = CONSTANTS.USING_DEFAULT_LONG_REST_SETTINGS();
  let enableRollHitDice = getSetting(CONSTANTS.SETTINGS.LONG_REST_ROLL_HIT_DICE);
  let showHealthBar = enableRollHitDice || getSetting(CONSTANTS.SETTINGS.HP_MULTIPLIER) !== CONSTANTS.FRACTIONS.FULL;
  let showStartLongRestButton = getSetting(CONSTANTS.SETTINGS.PRE_REST_REGAIN_HIT_DICE);
  const maxHitDiceSpendMultiplier = determineMultiplier(CONSTANTS.SETTINGS.LONG_MAX_HIT_DICE_SPEND);
  const maxSpendHitDice = typeof maxHitDiceSpendMultiplier === "string" ? Math.floor(evaluateFormula(maxHitDiceSpendMultiplier, actor.getRollData())?.total ?? 0) : Math.floor(actor.system.details.level * maxHitDiceSpendMultiplier);
  const showArmorCheckbox = getSetting(CONSTANTS.SETTINGS.LONG_REST_ARMOR_AUTOMATION) && workflow.healthData.hasNonLightArmor;
  let healthData = workflow.healthData;
  updateHealthBarText();
  let selectedHitDice = Object.entries(healthData.availableHitDice).filter((entry) => entry[1])?.[0]?.[0];
  async function nextStep() {
    $$invalidate(10, activeStep = Math.min(workflow.steps.length, activeStep + 1));
  }
  __name(nextStep, "nextStep");
  async function prevStep() {
    $$invalidate(10, activeStep = Math.max(0, activeStep - 1));
  }
  __name(prevStep, "prevStep");
  async function requestSubmit() {
    if (enableRollHitDice && healthData.hitDiceSpent === 0 && healthPercentageToGain < 0.75 && workflow.healthRegained === 0 && workflow.totalHitDice > 0) {
      const doContinue = await TJSDialog.confirm({
        title: localize("REST-RECOVERY.Dialogs.RestHealthWarning.Title"),
        content: {
          class: Dialog,
          props: {
            icon: "fas fa-exclamation-triangle",
            header: localize("REST-RECOVERY.Dialogs.RestHealthWarning.Title"),
            content: localize("REST-RECOVERY.Dialogs.RestHealthWarning.Content")
          }
        },
        modal: true,
        draggable: false,
        options: {
          height: "auto",
          headerButtonNoClose: true
        }
      });
      if (!doContinue)
        return false;
    }
    form.requestSubmit();
  }
  __name(requestSubmit, "requestSubmit");
  async function updateSettings() {
    $$invalidate(5, workflow.finished = true, workflow);
    application.options.resolve(newDay);
    application.close();
  }
  __name(updateSettings, "updateSettings");
  async function rollHitDice(event) {
    const rolled = await workflow.rollHitDice(selectedHitDice, event.ctrlKey === getSetting("quick-hd-roll"));
    if (!rolled)
      return;
    $$invalidate(8, healthData = workflow.healthData);
  }
  __name(rollHitDice, "rollHitDice");
  async function startLongRest() {
    $$invalidate(7, showStartLongRestButton = false);
    $$invalidate(26, startedLongRest = true);
    await workflow.regainHitDice();
    $$invalidate(8, healthData = workflow.healthData);
  }
  __name(startLongRest, "startLongRest");
  async function autoRollHitDie() {
    await workflow.autoSpendHitDice();
    $$invalidate(8, healthData = workflow.healthData);
    $$invalidate(26, startedLongRest = true);
  }
  __name(autoRollHitDie, "autoRollHitDie");
  const doc = new TJSDocument(actor);
  component_subscribe($$self, doc, (value) => $$invalidate(27, $doc = value));
  async function updateHealthData() {
    if (!startedLongRest) {
      await workflow.refreshHealthData();
      $$invalidate(8, healthData = workflow.healthData);
    }
    updateHealthBarText();
  }
  __name(updateHealthData, "updateHealthData");
  function updateHealthBarText() {
    currHP = workflow.currHP;
    maxHP = workflow.maxHP;
    $$invalidate(2, healthPercentage = currHP / maxHP);
    $$invalidate(3, healthPercentageToGain = (currHP + healthData.hitPointsToRegainFromRest) / maxHP);
    $$invalidate(1, healthBarText = `HP: ${currHP} / ${maxHP}`);
    if (healthData.hitPointsToRegainFromRest) {
      $$invalidate(1, healthBarText += ` (+${healthData.hitPointsToRegainFromRest})`);
    }
  }
  __name(updateHealthBarText, "updateHealthBarText");
  function showCustomRulesDialog() {
    TJSDialog.prompt({
      title: localize("REST-RECOVERY.Dialogs.LongRestSettingsDialog.Title"),
      content: { class: CustomSettingsDialog },
      label: "Okay",
      modal: true,
      draggable: false,
      options: {
        height: "auto",
        width: "350",
        headerButtonNoClose: true
      }
    });
  }
  __name(showCustomRulesDialog, "showCustomRulesDialog");
  let activeStep = 0;
  function steps_activeStep_binding(value) {
    activeStep = value;
    $$invalidate(10, activeStep);
  }
  __name(steps_activeStep_binding, "steps_activeStep_binding");
  function hitdieroller_selectedHitDice_binding(value) {
    selectedHitDice = value;
    $$invalidate(9, selectedHitDice);
  }
  __name(hitdieroller_selectedHitDice_binding, "hitdieroller_selectedHitDice_binding");
  function hitdieroller_healthData_binding(value) {
    healthData = value;
    $$invalidate(8, healthData);
  }
  __name(hitdieroller_healthData_binding, "hitdieroller_healthData_binding");
  function input_change_handler() {
    newDay = this.checked;
    $$invalidate(6, newDay);
  }
  __name(input_change_handler, "input_change_handler");
  function input_change_handler_1() {
    healthData.removeNonLightArmor = this.checked;
    $$invalidate(8, healthData);
  }
  __name(input_change_handler_1, "input_change_handler_1");
  const click_handler = /* @__PURE__ */ __name(() => {
    prevStep();
  }, "click_handler");
  const click_handler_1 = /* @__PURE__ */ __name(() => {
    nextStep();
  }, "click_handler_1");
  function form_1_binding($$value) {
    binding_callbacks[$$value ? "unshift" : "push"](() => {
      form = $$value;
      $$invalidate(4, form);
    });
  }
  __name(form_1_binding, "form_1_binding");
  function applicationshell_elementRoot_binding(value) {
    elementRoot = value;
    $$invalidate(0, elementRoot);
  }
  __name(applicationshell_elementRoot_binding, "applicationshell_elementRoot_binding");
  $$self.$$set = ($$props2) => {
    if ("elementRoot" in $$props2)
      $$invalidate(0, elementRoot = $$props2.elementRoot);
  };
  $$self.$$.update = () => {
    if ($$self.$$.dirty[0] & 67108864) {
      application.reactive.headerButtonNoClose = startedLongRest;
    }
    if ($$self.$$.dirty[0] & 134217728) {
      {
        const { data } = doc.updateOptions;
        const hpUpdate = getProperty(data, "system.attributes.hp");
        if (hpUpdate) {
          updateHealthData();
        }
      }
    }
  };
  return [
    elementRoot,
    healthBarText,
    healthPercentage,
    healthPercentageToGain,
    form,
    workflow,
    newDay,
    showStartLongRestButton,
    healthData,
    selectedHitDice,
    activeStep,
    promptNewDay,
    usingDefaultSettings,
    enableRollHitDice,
    showHealthBar,
    maxSpendHitDice,
    showArmorCheckbox,
    nextStep,
    prevStep,
    requestSubmit,
    updateSettings,
    rollHitDice,
    startLongRest,
    autoRollHitDie,
    doc,
    showCustomRulesDialog,
    startedLongRest,
    $doc,
    steps_activeStep_binding,
    hitdieroller_selectedHitDice_binding,
    hitdieroller_healthData_binding,
    input_change_handler,
    input_change_handler_1,
    click_handler,
    click_handler_1,
    form_1_binding,
    applicationshell_elementRoot_binding
  ];
}
__name(instance$7, "instance$7");
class Long_rest_shell extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$7, create_fragment$7, safe_not_equal, { elementRoot: 0 }, null, [-1, -1]);
  }
  get elementRoot() {
    return this.$$.ctx[0];
  }
  set elementRoot(elementRoot) {
    this.$$set({ elementRoot });
    flush();
  }
}
__name(Long_rest_shell, "Long_rest_shell");
class LongRestDialog extends CustomSvelteApplication {
  constructor(options = {}, dialogData = {}) {
    super({
      title: `${game.i18n.localize("DND5E.LongRest")}: ${options.actor.name}`,
      zIndex: 102,
      svelte: {
        class: Long_rest_shell,
        target: document.body
      },
      close: () => this.options.reject(),
      ...options
    }, dialogData);
  }
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      closeOnSubmit: false,
      width: 400,
      height: "auto",
      classes: ["dnd5e dialog"]
    });
  }
}
__name(LongRestDialog, "LongRestDialog");
function registerLibwrappers() {
  patch_shortRest();
  patch_longRest();
  patch_rest();
  patch_displayRestResultMessage();
  patch_getRestHitPointRecovery();
  patch_getRestHitDiceRecovery();
  patch_getRestResourceRecovery();
  patch_getRestSpellRecovery();
  patch_getRestItemUsesRecovery();
  patch_getUsageUpdates();
}
__name(registerLibwrappers, "registerLibwrappers");
function patch_shortRest() {
  libWrapper.ignore_conflicts(CONSTANTS.MODULE_NAME, ["dnd5e-helpers"], [
    "CONFIG.Actor.documentClass.prototype.shortRest"
  ]);
  libWrapper.register(
    CONSTANTS.MODULE_NAME,
    "CONFIG.Actor.documentClass.prototype.shortRest",
    async function(config, dialogOptions = {}) {
      config = foundry.utils.mergeObject({
        dialog: true,
        chat: true,
        newDay: false,
        promptNewDay: true,
        autoHD: false,
        autoHDThreshold: 3,
        ignoreFlags: false,
        restPrompted: false
      }, config);
      if (Hooks.call("dnd5e.preShortRest", this, config) === false)
        return;
      if (getProperty(this, CONSTANTS.FLAGS.DAE.PREVENT_SHORT_REST) && !config.ignoreFlags) {
        custom_warning("REST-RECOVERY.Warnings.PreventedShortRest");
        return false;
      }
      if (getSetting(CONSTANTS.SETTINGS.PREVENT_USER_REST) && !game.user.isGM && !config.restPrompted) {
        custom_warning("REST-RECOVERY.Warnings.NotPromptedShortRest");
        return false;
      }
      RestWorkflow.make(this);
      const hd0 = this.system.attributes.hd;
      const hp0 = this.system.attributes.hp.value;
      if (config.dialog) {
        try {
          config.newDay = await ShortRestDialog.show({ ...config, actor: this }, dialogOptions);
        } catch (err) {
          return;
        }
      } else if (config.autoHD)
        await this.autoSpendHitDice({ threshold: config.autoHDThreshold });
      const dhd = this.system.attributes.hd - hd0;
      const dhp = this.system.attributes.hp.value - hp0;
      return this._rest(config.chat, config.newDay, false, dhd, dhp);
    },
    "OVERRIDE"
  );
}
__name(patch_shortRest, "patch_shortRest");
function patch_longRest() {
  libWrapper.ignore_conflicts(CONSTANTS.MODULE_NAME, ["dnd5e-helpers"], [
    "CONFIG.Actor.documentClass.prototype.longRest"
  ]);
  libWrapper.register(
    CONSTANTS.MODULE_NAME,
    "CONFIG.Actor.documentClass.prototype.longRest",
    async function(config = {}, dialogOptions = {}) {
      config = foundry.utils.mergeObject({
        dialog: true,
        chat: true,
        newDay: true,
        promptNewDay: true,
        ignoreFlags: false,
        restPrompted: false
      }, config);
      if (Hooks.call("dnd5e.preLongRest", this, config) === false)
        return;
      if (getProperty(this, CONSTANTS.FLAGS.DAE.PREVENT_LONG_REST) && !config.ignoreFlags) {
        custom_warning("REST-RECOVERY.Warnings.PreventedLongRest");
        return false;
      }
      if (getSetting(CONSTANTS.SETTINGS.PREVENT_USER_REST) && !game.user.isGM && !config.restPrompted) {
        custom_warning("REST-RECOVERY.Warnings.NotPromptedLongRest");
        return false;
      }
      RestWorkflow.make(this, true);
      if (config.dialog) {
        try {
          config.newDay = await LongRestDialog.show({ ...config, actor: this }, dialogOptions);
        } catch (err) {
          return;
        }
      }
      return this._rest(config.chat, config.newDay, true);
    },
    "OVERRIDE"
  );
}
__name(patch_longRest, "patch_longRest");
function patch_rest() {
  libWrapper.register(
    CONSTANTS.MODULE_NAME,
    "CONFIG.Actor.documentClass.prototype._rest",
    async function(chat, newDay, longRest, dhd = 0, dhp = 0) {
      let hitPointsRecovered = 0;
      let hitPointUpdates = {};
      let hitDiceRecovered = 0;
      let hitDiceUpdates = [];
      const rolls = [];
      if (longRest) {
        ({ updates: hitPointUpdates, hitPointsRecovered } = this._getRestHitPointRecovery());
        ({ updates: hitDiceUpdates, hitDiceRecovered } = this._getRestHitDiceRecovery());
      }
      const result = {
        dhd: dhd + hitDiceRecovered,
        dhp: dhp + hitPointsRecovered,
        updateData: {
          ...hitPointUpdates,
          ...this._getRestResourceRecovery({
            recoverShortRestResources: !longRest,
            recoverLongRestResources: longRest
          }),
          ...this._getRestSpellRecovery({ recoverSpells: longRest })
        },
        updateItems: [
          ...hitDiceUpdates,
          ...await this._getRestItemUsesRecovery({ recoverLongRestUses: longRest, recoverDailyUses: newDay, rolls })
        ],
        longRest,
        newDay
      };
      result.rolls = rolls;
      const workflow = RestWorkflow.get(this);
      result.updateData = await workflow._handleExhaustion(result.updateData);
      result.updateItems = await workflow._handleFoodAndWaterItems(result.updateItems);
      if (Hooks.call("dnd5e.preRestCompleted", this, result) === false)
        return result;
      await this.update(result.updateData);
      await this.updateEmbeddedDocuments("Item", result.updateItems);
      if (chat)
        await this._displayRestResultMessage(result, longRest);
      if (Hooks.events.restCompleted?.length)
        foundry.utils.logCompatibilityWarning(
          "The restCompleted hook has been deprecated in favor of dnd5e.restCompleted.",
          { since: "DnD5e 1.6", until: "DnD5e 2.1" }
        );
      Hooks.callAll("restCompleted", this, result);
      Hooks.callAll("dnd5e.restCompleted", this, result);
      return result;
    },
    "OVERRIDE"
  );
}
__name(patch_rest, "patch_rest");
function patch_displayRestResultMessage() {
  libWrapper.register(
    CONSTANTS.MODULE_NAME,
    "CONFIG.Actor.documentClass.prototype._displayRestResultMessage",
    async function(wrapped, ...args) {
      const result = await wrapped(...args);
      const workflow = RestWorkflow.get(this);
      if (workflow) {
        await workflow._displayRestResultMessage(result);
      }
      return result;
    }
  );
}
__name(patch_displayRestResultMessage, "patch_displayRestResultMessage");
function patch_getRestHitPointRecovery() {
  libWrapper.register(
    CONSTANTS.MODULE_NAME,
    "CONFIG.Actor.documentClass.prototype._getRestHitPointRecovery",
    function(wrapped, args) {
      return RestWorkflow.wrapperFn(this, wrapped, args, "_getRestHitPointRecovery");
    }
  );
}
__name(patch_getRestHitPointRecovery, "patch_getRestHitPointRecovery");
function patch_getRestHitDiceRecovery() {
  libWrapper.register(
    CONSTANTS.MODULE_NAME,
    "CONFIG.Actor.documentClass.prototype._getRestHitDiceRecovery",
    function(wrapped, args) {
      const rest = RestWorkflow.get(this);
      const maxHitDice = rest ? { maxHitDice: rest._getMaxHitDiceRecovery() } : args;
      if (getSetting(CONSTANTS.SETTINGS.PRE_REST_REGAIN_HIT_DICE)) {
        return RestWorkflow.wrapperFn(this, wrapped, maxHitDice, "_getPostRestHitDiceRecovery");
      }
      return wrapped(maxHitDice);
    }
  );
}
__name(patch_getRestHitDiceRecovery, "patch_getRestHitDiceRecovery");
function patch_getRestResourceRecovery() {
  libWrapper.register(
    CONSTANTS.MODULE_NAME,
    "CONFIG.Actor.documentClass.prototype._getRestResourceRecovery",
    function(wrapped, args) {
      return RestWorkflow.wrapperFn(this, wrapped, args, "_getRestResourceRecovery");
    }
  );
}
__name(patch_getRestResourceRecovery, "patch_getRestResourceRecovery");
function patch_getRestSpellRecovery() {
  libWrapper.register(
    CONSTANTS.MODULE_NAME,
    "CONFIG.Actor.documentClass.prototype._getRestSpellRecovery",
    function(wrapped, args) {
      return RestWorkflow.wrapperFn(this, wrapped, args, "_getRestSpellRecovery");
    }
  );
}
__name(patch_getRestSpellRecovery, "patch_getRestSpellRecovery");
function patch_getRestItemUsesRecovery() {
  libWrapper.register(
    CONSTANTS.MODULE_NAME,
    "CONFIG.Actor.documentClass.prototype._getRestItemUsesRecovery",
    function(wrapped, args) {
      return RestWorkflow.asyncWrappedFn(this, wrapped, args, "_getRestItemUsesRecovery");
    }
  );
}
__name(patch_getRestItemUsesRecovery, "patch_getRestItemUsesRecovery");
function patch_getUsageUpdates() {
  libWrapper.register(
    CONSTANTS.MODULE_NAME,
    "CONFIG.Item.documentClass.prototype._getUsageUpdates",
    /* @__PURE__ */ __name(function _getUsageUpdates({
      consumeQuantity,
      consumeRecharge,
      consumeResource,
      consumeSpellSlot,
      consumeSpellLevel,
      consumeUsage
    }) {
      const actorUpdates = {};
      const itemUpdates = {};
      const resourceUpdates = [];
      if (consumeRecharge) {
        const recharge = this.system.recharge || {};
        if (recharge.charged === false) {
          ui.notifications.warn(game.i18n.format("DND5E.ItemNoUses", { name: this.name }));
          return false;
        }
        itemUpdates["system.recharge.charged"] = false;
      }
      if (consumeResource) {
        const canConsume = this._handleConsumeResource(itemUpdates, actorUpdates, resourceUpdates);
        if (canConsume === false)
          return false;
      }
      if (consumeSpellSlot && consumeSpellLevel) {
        if (Number.isNumeric(consumeSpellLevel))
          consumeSpellLevel = `spell${consumeSpellLevel}`;
        const level = this.actor?.system.spells[consumeSpellLevel];
        const spells = Number(level?.value ?? 0);
        if (spells === 0) {
          const labelKey = consumeSpellLevel === "pact" ? "DND5E.SpellProgPact" : `DND5E.SpellLevel${this.system.level}`;
          const label = game.i18n.localize(labelKey);
          ui.notifications.warn(game.i18n.format("DND5E.SpellCastNoSlots", { name: this.name, level: label }));
          return false;
        }
        actorUpdates[`system.spells.${consumeSpellLevel}.value`] = Math.max(spells - 1, 0);
      }
      const overrideLogic = RestWorkflow.itemsListened.get(this.id);
      const consumeFull = overrideLogic ?? true;
      if (consumeUsage) {
        const uses = this.system.uses || {};
        const available = Number(uses.value ?? 0);
        let used = false;
        const remaining = Math.max(available - (consumeFull ? 1 : 0.5), 0);
        if (overrideLogic && available > 0 || !overrideLogic && available >= 1) {
          used = true;
          itemUpdates["system.uses.value"] = remaining;
        }
        if (consumeQuantity && (!used || remaining === 0)) {
          const q = Number(this.system.quantity ?? 1);
          if (q >= 1) {
            used = true;
            itemUpdates["system.quantity"] = Math.max(q - 1, 0);
            itemUpdates["system.uses.value"] = uses.max ?? 1;
          }
        }
        if (!used) {
          ui.notifications.warn(game.i18n.format("DND5E.ItemNoUses", { name: this.name }));
          return false;
        }
      }
      return { itemUpdates, actorUpdates, resourceUpdates };
    }, "_getUsageUpdates"),
    "OVERRIDE"
  );
}
__name(patch_getUsageUpdates, "patch_getUsageUpdates");
const quickSetupShell_svelte_svelte_type_style_lang = "";
function create_default_slot$3(ctx) {
  let form_1;
  let div6;
  let h2;
  let t1;
  let select;
  let option0;
  let option1;
  let option2;
  let t5;
  let div2;
  let div0;
  let input0;
  let t6;
  let label0;
  let t8;
  let div1;
  let t10;
  let div5;
  let div3;
  let input1;
  let t11;
  let label1;
  let t13;
  let div4;
  let t15;
  let footer;
  let button0;
  let i0;
  let t16;
  let t17_value = localize("Submit") + "";
  let t17;
  let t18;
  let button1;
  let i1;
  let t19;
  let t20_value = localize("REST-RECOVERY.Dialogs.QuickSetup.OpenSettings") + "";
  let t20;
  let mounted;
  let dispose;
  return {
    c() {
      form_1 = element("form");
      div6 = element("div");
      h2 = element("h2");
      h2.textContent = `${localize("SETTINGS.5eRestN")}`;
      t1 = space();
      select = element("select");
      option0 = element("option");
      option0.textContent = `${localize("SETTINGS.5eRestPHB")}`;
      option1 = element("option");
      option1.textContent = `${localize("SETTINGS.5eRestGritty")}`;
      option2 = element("option");
      option2.textContent = `${localize("SETTINGS.5eRestEpic")}`;
      t5 = space();
      div2 = element("div");
      div0 = element("div");
      input0 = element("input");
      t6 = space();
      label0 = element("label");
      label0.textContent = `${localize("REST-RECOVERY.Dialogs.QuickSetup.SlowNaturalHealingTitle")}`;
      t8 = space();
      div1 = element("div");
      div1.textContent = `${localize("REST-RECOVERY.Dialogs.QuickSetup.SlowNaturalHealingLabel")}`;
      t10 = space();
      div5 = element("div");
      div3 = element("div");
      input1 = element("input");
      t11 = space();
      label1 = element("label");
      label1.textContent = `${localize("REST-RECOVERY.Dialogs.QuickSetup.RecoverHitDiceTitle")}`;
      t13 = space();
      div4 = element("div");
      div4.textContent = `${localize("REST-RECOVERY.Dialogs.QuickSetup.RecoverHitDiceLabel")}`;
      t15 = space();
      footer = element("footer");
      button0 = element("button");
      i0 = element("i");
      t16 = space();
      t17 = text(t17_value);
      t18 = space();
      button1 = element("button");
      i1 = element("i");
      t19 = space();
      t20 = text(t20_value);
      attr(h2, "class", "svelte-1b00j1");
      option0.__value = "normal";
      option0.value = option0.__value;
      option1.__value = "gritty";
      option1.value = option1.__value;
      option2.__value = "epic";
      option2.value = option2.__value;
      attr(select, "class", "svelte-1b00j1");
      if (ctx[2] === void 0)
        add_render_callback(() => ctx[8].call(select));
      attr(input0, "id", "slow-natural-healing");
      attr(input0, "type", "checkbox");
      attr(input0, "class", "svelte-1b00j1");
      attr(label0, "for", "slow-natural-healing");
      attr(label0, "class", "svelte-1b00j1");
      attr(div0, "class", "form-control svelte-1b00j1");
      attr(div1, "class", "small-text svelte-1b00j1");
      attr(div2, "class", "svelte-1b00j1");
      attr(input1, "id", "recover-before-starting-rest");
      attr(input1, "type", "checkbox");
      attr(input1, "class", "svelte-1b00j1");
      attr(label1, "for", "recover-before-starting-rest");
      attr(label1, "class", "svelte-1b00j1");
      attr(div3, "class", "form-control svelte-1b00j1");
      attr(div4, "class", "small-text svelte-1b00j1");
      attr(div5, "class", "svelte-1b00j1");
      attr(div6, "class", "rest-recovery-flex-col svelte-1b00j1");
      attr(i0, "class", "fas fa-check");
      attr(button0, "class", "dialog-button");
      attr(button0, "type", "button");
      attr(i1, "class", "fas fa-cog");
      attr(button1, "class", "dialog-button");
      attr(button1, "type", "button");
      attr(footer, "class", "flexrow");
      attr(form_1, "autocomplete", "off");
      attr(form_1, "class", "dialog-content");
    },
    m(target, anchor) {
      insert(target, form_1, anchor);
      append(form_1, div6);
      append(div6, h2);
      append(div6, t1);
      append(div6, select);
      append(select, option0);
      append(select, option1);
      append(select, option2);
      select_option(select, ctx[2]);
      append(div6, t5);
      append(div6, div2);
      append(div2, div0);
      append(div0, input0);
      input0.checked = ctx[3];
      append(div0, t6);
      append(div0, label0);
      append(div2, t8);
      append(div2, div1);
      append(div6, t10);
      append(div6, div5);
      append(div5, div3);
      append(div3, input1);
      input1.checked = ctx[4];
      append(div3, t11);
      append(div3, label1);
      append(div5, t13);
      append(div5, div4);
      append(form_1, t15);
      append(form_1, footer);
      append(footer, button0);
      append(button0, i0);
      append(button0, t16);
      append(button0, t17);
      append(footer, t18);
      append(footer, button1);
      append(button1, i1);
      append(button1, t19);
      append(button1, t20);
      ctx[11](form_1);
      if (!mounted) {
        dispose = [
          listen(select, "change", ctx[8]),
          listen(input0, "change", ctx[9]),
          listen(input1, "change", ctx[10]),
          listen(button0, "click", ctx[5]),
          listen(button1, "click", ctx[7]),
          listen(form_1, "submit", prevent_default(ctx[6]))
        ];
        mounted = true;
      }
    },
    p(ctx2, dirty) {
      if (dirty & 4) {
        select_option(select, ctx2[2]);
      }
      if (dirty & 8) {
        input0.checked = ctx2[3];
      }
      if (dirty & 16) {
        input1.checked = ctx2[4];
      }
    },
    d(detaching) {
      if (detaching)
        detach(form_1);
      ctx[11](null);
      mounted = false;
      run_all(dispose);
    }
  };
}
__name(create_default_slot$3, "create_default_slot$3");
function create_fragment$6(ctx) {
  let applicationshell;
  let updating_elementRoot;
  let current;
  function applicationshell_elementRoot_binding(value) {
    ctx[12](value);
  }
  __name(applicationshell_elementRoot_binding, "applicationshell_elementRoot_binding");
  let applicationshell_props = {
    $$slots: { default: [create_default_slot$3] },
    $$scope: { ctx }
  };
  if (ctx[0] !== void 0) {
    applicationshell_props.elementRoot = ctx[0];
  }
  applicationshell = new ApplicationShell({ props: applicationshell_props });
  binding_callbacks.push(() => bind(applicationshell, "elementRoot", applicationshell_elementRoot_binding, ctx[0]));
  return {
    c() {
      create_component(applicationshell.$$.fragment);
    },
    m(target, anchor) {
      mount_component(applicationshell, target, anchor);
      current = true;
    },
    p(ctx2, [dirty]) {
      const applicationshell_changes = {};
      if (dirty & 16414) {
        applicationshell_changes.$$scope = { dirty, ctx: ctx2 };
      }
      if (!updating_elementRoot && dirty & 1) {
        updating_elementRoot = true;
        applicationshell_changes.elementRoot = ctx2[0];
        add_flush_callback(() => updating_elementRoot = false);
      }
      applicationshell.$set(applicationshell_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(applicationshell.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(applicationshell.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(applicationshell, detaching);
    }
  };
}
__name(create_fragment$6, "create_fragment$6");
function instance$6($$self, $$props, $$invalidate) {
  const { application } = getContext("external");
  let { elementRoot } = $$props;
  let form;
  async function requestSubmit() {
    form.requestSubmit();
  }
  __name(requestSubmit, "requestSubmit");
  let restVariant = game.settings.get("dnd5e", "restVariant");
  let slowHealingEnabled = getSetting(CONSTANTS.SETTINGS.HP_MULTIPLIER) === CONSTANTS.FRACTIONS.NONE && getSetting(CONSTANTS.SETTINGS.LONG_REST_ROLL_HIT_DICE);
  let bufferEnabled = getSetting(CONSTANTS.SETTINGS.PRE_REST_REGAIN_HIT_DICE);
  async function submitPrompt() {
    await game.settings.set("dnd5e", "restVariant", restVariant);
    await setSetting(CONSTANTS.SETTINGS.HP_MULTIPLIER, slowHealingEnabled ? CONSTANTS.FRACTIONS.NONE : CONSTANTS.FRACTIONS.FULL);
    await setSetting(CONSTANTS.SETTINGS.LONG_REST_ROLL_HIT_DICE, slowHealingEnabled);
    await setSetting(CONSTANTS.SETTINGS.PRE_REST_REGAIN_HIT_DICE, bufferEnabled);
    application.options.resolve();
    application.close();
  }
  __name(submitPrompt, "submitPrompt");
  async function openSettings() {
    new SettingsShim().render(true);
    application.close();
  }
  __name(openSettings, "openSettings");
  function select_change_handler() {
    restVariant = select_value(this);
    $$invalidate(2, restVariant);
  }
  __name(select_change_handler, "select_change_handler");
  function input0_change_handler() {
    slowHealingEnabled = this.checked;
    $$invalidate(3, slowHealingEnabled);
  }
  __name(input0_change_handler, "input0_change_handler");
  function input1_change_handler() {
    bufferEnabled = this.checked;
    $$invalidate(4, bufferEnabled);
  }
  __name(input1_change_handler, "input1_change_handler");
  function form_1_binding($$value) {
    binding_callbacks[$$value ? "unshift" : "push"](() => {
      form = $$value;
      $$invalidate(1, form);
    });
  }
  __name(form_1_binding, "form_1_binding");
  function applicationshell_elementRoot_binding(value) {
    elementRoot = value;
    $$invalidate(0, elementRoot);
  }
  __name(applicationshell_elementRoot_binding, "applicationshell_elementRoot_binding");
  $$self.$$set = ($$props2) => {
    if ("elementRoot" in $$props2)
      $$invalidate(0, elementRoot = $$props2.elementRoot);
  };
  return [
    elementRoot,
    form,
    restVariant,
    slowHealingEnabled,
    bufferEnabled,
    requestSubmit,
    submitPrompt,
    openSettings,
    select_change_handler,
    input0_change_handler,
    input1_change_handler,
    form_1_binding,
    applicationshell_elementRoot_binding
  ];
}
__name(instance$6, "instance$6");
class Quick_setup_shell extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$6, create_fragment$6, safe_not_equal, { elementRoot: 0 });
  }
  get elementRoot() {
    return this.$$.ctx[0];
  }
  set elementRoot(elementRoot) {
    this.$$set({ elementRoot });
    flush();
  }
}
__name(Quick_setup_shell, "Quick_setup_shell");
class QuickSetup extends CustomSvelteApplication {
  constructor(options = {}) {
    super({
      close: () => this.options.reject(),
      ...options
    });
  }
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      title: game.i18n.localize("REST-RECOVERY.Dialogs.QuickSetup.Title"),
      zIndex: 102,
      svelte: {
        class: Quick_setup_shell,
        target: document.body
      },
      closeOnSubmit: false,
      id: "rest-quick-setup-app",
      width: 350,
      height: "auto",
      classes: ["dnd5e dialog"],
      resizable: false
    });
  }
}
__name(QuickSetup, "QuickSetup");
class QuickSetupShim extends FormApplication {
  constructor() {
    super({});
    QuickSetup.show();
  }
  async _updateObject(event, formData) {
  }
  render() {
    this.close();
  }
}
__name(QuickSetupShim, "QuickSetupShim");
class RestRecoverySettings {
  constructor() {
    this.namespace = CONSTANTS.MODULE_NAME;
    this.settings = /* @__PURE__ */ new Map();
    this.groupedSettings = /* @__PURE__ */ new Map();
    this.activeProfile = "";
    this.profiles = {};
    this.initialized = false;
  }
  get activeProfileData() {
    return this.profiles?.[this.activeProfile] ?? {};
  }
  get(key, localize2 = false) {
    const value = game.settings.get(this.namespace, key);
    if (localize2)
      return game.i18n.localize(value);
    return value;
  }
  set(key, value) {
    if (this.settings.get(key)) {
      this.settings.get(key).store.set(value);
    }
    return game.settings.set(this.namespace, key, value);
  }
  register(key, options) {
    game.settings.register(this.namespace, key, options);
    if (!options.group)
      return;
    const value = getSetting(key);
    const store = writable(value);
    const setting = {
      ...options,
      store,
      key,
      value,
      disabled: writable(false)
    };
    this.settings.set(key, setting);
    store.subscribe((val) => {
      if (!this.initialized)
        return;
      setting.value = val;
      this.activeProfileData[key] = val;
      this.validateSettings(key);
    });
    if (setting.hidden)
      return;
    const group = this.groupedSettings.get(options.group) ?? [];
    group.push(setting);
    this.groupedSettings.set(options.group, group);
  }
  reset(key) {
    const setting = this.settings.get(key);
    setting.store.set(setting.default);
  }
  resetAll() {
    for (const key of this.settings.keys()) {
      this.reset(key);
    }
  }
  validateSettings(changedSettingKey = false) {
    const settingsToValidate = Array.from(this.settings).filter(([_, setting]) => {
      return setting?.moduleIntegration || setting?.dependsOn && (!changedSettingKey || setting?.dependsOn.includes(changedSettingKey));
    });
    for (const [key, setting] of settingsToValidate) {
      const disabled = setting.validate(this.settings);
      setting.disabled.set(disabled);
      if (disabled) {
        this.reset(key);
      }
    }
  }
  async updateSettingsFromActiveProfile(persist = false) {
    for (const [key, setting] of this.settings) {
      const value = this.activeProfileData?.[key] ?? setting.default;
      setting.store.set(value);
      if (persist) {
        await this.set(key, value);
      }
    }
  }
  async setActiveProfile(inProfile, persist = false) {
    this.activeProfile = inProfile;
    await this.updateSettingsFromActiveProfile(persist);
    if (!persist)
      return;
    return this.set(CONSTANTS.SETTINGS.ACTIVE_MODULE_PROFILE, this.activeProfile);
  }
  async createProfile(inProfile, inProfileData, setActive = false, persist = false) {
    this.profiles[inProfile] = inProfileData;
    await this.updateProfiles(this.profiles, persist);
    if (setActive) {
      await this.setActiveProfile(inProfile, persist);
    }
  }
  async updateProfiles(inProfiles, persist = false) {
    this.profiles = inProfiles;
    await this.updateSettingsFromActiveProfile(persist);
    if (!persist)
      return;
    return this.set(CONSTANTS.SETTINGS.MODULE_PROFILES, this.profiles);
  }
  async deleteProfile(inProfile, persist = false) {
    delete this.profiles[inProfile];
    await this.updateProfiles(this.profiles, persist);
    return this.setActiveProfile("Default", persist);
  }
  async persistSettings() {
    await this.updateProfiles(this.profiles, true);
    await this.setActiveProfile(this.activeProfile, true);
    if (this.settings.get(CONSTANTS.SETTINGS.ONE_DND_EXHAUSTION).value && this.settings.get(CONSTANTS.SETTINGS.EXHAUSTION_INTEGRATION).value === CONSTANTS.MODULES.DFREDS) {
      await plugins.createConvenientEffect();
    }
  }
  cleanup() {
    for (const [key, setting] of this.settings) {
      setting.store.set(getSetting(key));
      if (!setting.customFormula)
        continue;
      setting.customFormulaSetting = this.settings.get(setting.customFormula);
    }
    this.validateSettings();
    this.activeProfile = this.get(CONSTANTS.SETTINGS.ACTIVE_MODULE_PROFILE);
    this.profiles = foundry.utils.deepClone(this.get(CONSTANTS.SETTINGS.MODULE_PROFILES));
    this.initialized = true;
  }
  initialize() {
    game.settings.registerMenu(this.namespace, "quickSetup", {
      name: "REST-RECOVERY.Settings.QuickSetup.Title",
      label: "REST-RECOVERY.Settings.QuickSetup.Label",
      hint: "REST-RECOVERY.Settings.QuickSetup.Hint",
      icon: "fas fa-cog",
      type: QuickSetupShim,
      restricted: true
    });
    game.settings.registerMenu(this.namespace, "configureRest", {
      name: "REST-RECOVERY.Settings.Configure.Title",
      label: "REST-RECOVERY.Settings.Configure.Label",
      hint: "REST-RECOVERY.Settings.Configure.Hint",
      icon: "fas fa-bed",
      type: SettingsShim,
      restricted: true
    });
    for (const [key, options] of Object.entries(CONSTANTS.GET_DEFAULT_SETTINGS())) {
      this.register(key, options);
    }
    let customSettings = !!Object.entries(CONSTANTS.GET_DEFAULT_SETTINGS()).find((setting) => {
      return getSetting(setting[0]) !== setting[1].default;
    });
    this.register(CONSTANTS.SETTINGS.ACTIVE_MODULE_PROFILE, {
      scope: "world",
      config: false,
      default: customSettings ? "Custom" : "Default",
      type: String
    });
    const moduleProfiles = {
      "Default": Object.fromEntries(Object.entries(CONSTANTS.GET_DEFAULT_SETTINGS()).map((entry) => {
        return [entry[0], entry[1].default];
      }))
    };
    if (customSettings) {
      moduleProfiles["Custom"] = Object.fromEntries(Object.keys(CONSTANTS.GET_DEFAULT_SETTINGS()).map((key) => {
        return [key, getSetting(key)];
      }));
    }
    this.register(CONSTANTS.SETTINGS.MODULE_PROFILES, {
      scope: "world",
      config: false,
      default: moduleProfiles,
      type: Object
    });
    this.register(CONSTANTS.SETTINGS.SHOW_PLAYER_LIST_REST_BUTTON, {
      name: "REST-RECOVERY.Settings.ShowPlayerListRestButton.Title",
      hint: "REST-RECOVERY.Settings.ShowPlayerListRestButton.Hint",
      scope: "client",
      config: true,
      default: true,
      type: Boolean
    });
    this.register(CONSTANTS.SETTINGS.QUICK_HD_ROLL, {
      name: "REST-RECOVERY.Settings.QuickHDRoll.Title",
      hint: "REST-RECOVERY.Settings.QuickHDRoll.Hint",
      scope: "client",
      config: true,
      default: true,
      type: Boolean
    });
    this.cleanup();
  }
}
__name(RestRecoverySettings, "RestRecoverySettings");
const gameSettings = new RestRecoverySettings();
const Setting_svelte_svelte_type_style_lang = "";
function get_each_context$4(ctx, list, i) {
  const child_ctx = ctx.slice();
  child_ctx[0] = list[i][0];
  child_ctx[15] = list[i][1];
  child_ctx[17] = i;
  return child_ctx;
}
__name(get_each_context$4, "get_each_context$4");
function create_if_block_5(ctx) {
  let label;
  return {
    c() {
      label = element("label");
      label.textContent = `${localize("REST-RECOVERY.Settings.RequiresModule", {
        module_name: ctx[4].moduleIntegration.label
      })}`;
      attr(label, "class", "module-integration svelte-11115am");
    },
    m(target, anchor) {
      insert(target, label, anchor);
    },
    p: noop,
    d(detaching) {
      if (detaching)
        detach(label);
    }
  };
}
__name(create_if_block_5, "create_if_block_5");
function create_else_block$1(ctx) {
  let div;
  let input;
  let t;
  let mounted;
  let dispose;
  let if_block = ctx[4].localize && create_if_block_4(ctx);
  return {
    c() {
      div = element("div");
      input = element("input");
      t = space();
      if (if_block)
        if_block.c();
      attr(input, "type", "text");
      input.disabled = ctx[1];
      attr(input, "class", "svelte-11115am");
      attr(div, "class", "setting-container svelte-11115am");
    },
    m(target, anchor) {
      insert(target, div, anchor);
      append(div, input);
      set_input_value(input, ctx[2]);
      append(div, t);
      if (if_block)
        if_block.m(div, null);
      if (!mounted) {
        dispose = [
          listen(input, "input", ctx[14]),
          listen(input, "change", ctx[8])
        ];
        mounted = true;
      }
    },
    p(ctx2, dirty) {
      if (dirty & 2) {
        input.disabled = ctx2[1];
      }
      if (dirty & 20 && input.value !== ctx2[2]) {
        set_input_value(input, ctx2[2]);
      }
      if (ctx2[4].localize)
        if_block.p(ctx2, dirty);
    },
    d(detaching) {
      if (detaching)
        detach(div);
      if (if_block)
        if_block.d();
      mounted = false;
      run_all(dispose);
    }
  };
}
__name(create_else_block$1, "create_else_block$1");
function create_if_block_3$1(ctx) {
  let input;
  let mounted;
  let dispose;
  return {
    c() {
      input = element("input");
      attr(input, "type", "number");
      input.disabled = ctx[1];
      attr(input, "class", "svelte-11115am");
      toggle_class(input, "invalid", !ctx[2] && ctx[2] !== 0);
    },
    m(target, anchor) {
      insert(target, input, anchor);
      set_input_value(input, ctx[2]);
      if (!mounted) {
        dispose = [
          listen(input, "input", ctx[13]),
          listen(input, "change", ctx[8])
        ];
        mounted = true;
      }
    },
    p(ctx2, dirty) {
      if (dirty & 2) {
        input.disabled = ctx2[1];
      }
      if (dirty & 20 && to_number(input.value) !== ctx2[2]) {
        set_input_value(input, ctx2[2]);
      }
      if (dirty & 4) {
        toggle_class(input, "invalid", !ctx2[2] && ctx2[2] !== 0);
      }
    },
    d(detaching) {
      if (detaching)
        detach(input);
      mounted = false;
      run_all(dispose);
    }
  };
}
__name(create_if_block_3$1, "create_if_block_3$1");
function create_if_block_1$3(ctx) {
  let div;
  let select;
  let each_blocks = [];
  let each_1_lookup = /* @__PURE__ */ new Map();
  let t;
  let mounted;
  let dispose;
  let each_value = Object.entries(ctx[4].choices);
  const get_key = /* @__PURE__ */ __name((ctx2) => ctx2[17], "get_key");
  for (let i = 0; i < each_value.length; i += 1) {
    let child_ctx = get_each_context$4(ctx, each_value, i);
    let key = get_key(child_ctx);
    each_1_lookup.set(key, each_blocks[i] = create_each_block$4(key, child_ctx));
  }
  let if_block = ctx[4].customFormulaSetting && ctx[2] === CONSTANTS.FRACTIONS.CUSTOM && create_if_block_2$1(ctx);
  return {
    c() {
      div = element("div");
      select = element("select");
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].c();
      }
      t = space();
      if (if_block)
        if_block.c();
      attr(select, "name", ctx[4].key);
      select.disabled = ctx[1];
      attr(select, "class", "svelte-11115am");
      if (ctx[2] === void 0)
        add_render_callback(() => ctx[11].call(select));
      attr(div, "class", "choice-container svelte-11115am");
    },
    m(target, anchor) {
      insert(target, div, anchor);
      append(div, select);
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].m(select, null);
      }
      select_option(select, ctx[2]);
      append(div, t);
      if (if_block)
        if_block.m(div, null);
      if (!mounted) {
        dispose = [
          listen(select, "change", ctx[11]),
          listen(select, "change", ctx[8])
        ];
        mounted = true;
      }
    },
    p(ctx2, dirty) {
      if (dirty & 16) {
        each_value = Object.entries(ctx2[4].choices);
        each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx2, each_value, each_1_lookup, select, destroy_block, create_each_block$4, null, get_each_context$4);
      }
      if (dirty & 2) {
        select.disabled = ctx2[1];
      }
      if (dirty & 20) {
        select_option(select, ctx2[2]);
      }
      if (ctx2[4].customFormulaSetting && ctx2[2] === CONSTANTS.FRACTIONS.CUSTOM) {
        if (if_block) {
          if_block.p(ctx2, dirty);
        } else {
          if_block = create_if_block_2$1(ctx2);
          if_block.c();
          if_block.m(div, null);
        }
      } else if (if_block) {
        if_block.d(1);
        if_block = null;
      }
    },
    d(detaching) {
      if (detaching)
        detach(div);
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].d();
      }
      if (if_block)
        if_block.d();
      mounted = false;
      run_all(dispose);
    }
  };
}
__name(create_if_block_1$3, "create_if_block_1$3");
function create_if_block$4(ctx) {
  let input;
  let mounted;
  let dispose;
  return {
    c() {
      input = element("input");
      attr(input, "type", "checkbox");
      input.disabled = ctx[1];
    },
    m(target, anchor) {
      insert(target, input, anchor);
      input.checked = ctx[2];
      if (!mounted) {
        dispose = [
          listen(input, "change", ctx[10]),
          listen(input, "change", ctx[8])
        ];
        mounted = true;
      }
    },
    p(ctx2, dirty) {
      if (dirty & 2) {
        input.disabled = ctx2[1];
      }
      if (dirty & 20) {
        input.checked = ctx2[2];
      }
    },
    d(detaching) {
      if (detaching)
        detach(input);
      mounted = false;
      run_all(dispose);
    }
  };
}
__name(create_if_block$4, "create_if_block$4");
function create_if_block_4(ctx) {
  let input;
  let input_value_value;
  return {
    c() {
      input = element("input");
      attr(input, "type", "text");
      input.disabled = true;
      input.value = input_value_value = localize(ctx[2]);
      attr(input, "class", "svelte-11115am");
    },
    m(target, anchor) {
      insert(target, input, anchor);
    },
    p(ctx2, dirty) {
      if (dirty & 20 && input_value_value !== (input_value_value = localize(ctx2[2])) && input.value !== input_value_value) {
        input.value = input_value_value;
      }
    },
    d(detaching) {
      if (detaching)
        detach(input);
    }
  };
}
__name(create_if_block_4, "create_if_block_4");
function create_each_block$4(key_2, ctx) {
  let option;
  let t_value = localize(ctx[15]) + "";
  let t;
  return {
    key: key_2,
    first: null,
    c() {
      option = element("option");
      t = text(t_value);
      option.__value = ctx[0];
      option.value = option.__value;
      this.first = option;
    },
    m(target, anchor) {
      insert(target, option, anchor);
      append(option, t);
    },
    p(new_ctx, dirty) {
      ctx = new_ctx;
    },
    d(detaching) {
      if (detaching)
        detach(option);
    }
  };
}
__name(create_each_block$4, "create_each_block$4");
function create_if_block_2$1(ctx) {
  let input;
  let mounted;
  let dispose;
  return {
    c() {
      input = element("input");
      attr(input, "name", ctx[4].customFormula);
      attr(input, "type", "text");
      input.disabled = ctx[1];
      attr(input, "class", "svelte-11115am");
      toggle_class(input, "invalid", ctx[3] === "");
    },
    m(target, anchor) {
      insert(target, input, anchor);
      set_input_value(input, ctx[3]);
      if (!mounted) {
        dispose = listen(input, "input", ctx[12]);
        mounted = true;
      }
    },
    p(ctx2, dirty) {
      if (dirty & 2) {
        input.disabled = ctx2[1];
      }
      if (dirty & 8 && input.value !== ctx2[3]) {
        set_input_value(input, ctx2[3]);
      }
      if (dirty & 8) {
        toggle_class(input, "invalid", ctx2[3] === "");
      }
    },
    d(detaching) {
      if (detaching)
        detach(input);
      mounted = false;
      dispose();
    }
  };
}
__name(create_if_block_2$1, "create_if_block_2$1");
function create_fragment$5(ctx) {
  let div3;
  let div1;
  let div0;
  let label;
  let t0_value = localize(ctx[4].name) + "";
  let t0;
  let t1;
  let a;
  let i;
  let t2;
  let t3;
  let p;
  let t5;
  let div2;
  let mounted;
  let dispose;
  let if_block0 = ctx[4].moduleIntegration && create_if_block_5(ctx);
  function select_block_type(ctx2, dirty) {
    if (ctx2[4].type === Boolean)
      return create_if_block$4;
    if (ctx2[4].choices)
      return create_if_block_1$3;
    if (ctx2[4].type === Number)
      return create_if_block_3$1;
    return create_else_block$1;
  }
  __name(select_block_type, "select_block_type");
  let current_block_type = select_block_type(ctx);
  let if_block1 = current_block_type(ctx);
  return {
    c() {
      div3 = element("div");
      div1 = element("div");
      div0 = element("div");
      label = element("label");
      t0 = text(t0_value);
      t1 = space();
      a = element("a");
      i = element("i");
      t2 = space();
      if (if_block0)
        if_block0.c();
      t3 = space();
      p = element("p");
      p.textContent = `${localize(ctx[4].hint)}`;
      t5 = space();
      div2 = element("div");
      if_block1.c();
      attr(i, "title", "Reset setting");
      attr(i, "class", "fas fa-undo reset-setting svelte-11115am");
      attr(label, "class", "svelte-11115am");
      attr(div0, "class", "svelte-11115am");
      attr(p, "class", "notes");
      attr(div1, "class", "label-side svelte-11115am");
      attr(div2, "class", "form-fields input-side svelte-11115am");
      attr(div3, "class", "form-group flexrow");
    },
    m(target, anchor) {
      insert(target, div3, anchor);
      append(div3, div1);
      append(div1, div0);
      append(div0, label);
      append(label, t0);
      append(label, t1);
      append(label, a);
      append(a, i);
      append(div0, t2);
      if (if_block0)
        if_block0.m(div0, null);
      append(div1, t3);
      append(div1, p);
      append(div3, t5);
      append(div3, div2);
      if_block1.m(div2, null);
      if (!mounted) {
        dispose = listen(i, "click", ctx[9]);
        mounted = true;
      }
    },
    p(ctx2, [dirty]) {
      if (ctx2[4].moduleIntegration)
        if_block0.p(ctx2, dirty);
      if_block1.p(ctx2, dirty);
    },
    i: noop,
    o: noop,
    d(detaching) {
      if (detaching)
        detach(div3);
      if (if_block0)
        if_block0.d();
      if_block1.d();
      mounted = false;
      dispose();
    }
  };
}
__name(create_fragment$5, "create_fragment$5");
function instance$5($$self, $$props, $$invalidate) {
  let $disabled;
  let $store;
  let $customFormulaStore;
  let { key } = $$props;
  const setting = gameSettings.settings.get(key);
  const customFormulaStore = setting.customFormula ? setting.customFormulaSetting.store : writable("");
  component_subscribe($$self, customFormulaStore, (value) => $$invalidate(3, $customFormulaStore = value));
  const store = setting.store;
  component_subscribe($$self, store, (value) => $$invalidate(2, $store = value));
  const disabled = setting.disabled;
  component_subscribe($$self, disabled, (value) => $$invalidate(1, $disabled = value));
  function callback() {
    if (!setting.callback)
      return;
    setting.callback(gameSettings.settings);
  }
  __name(callback, "callback");
  const click_handler = /* @__PURE__ */ __name(() => {
    gameSettings.reset(key);
  }, "click_handler");
  function input_change_handler() {
    $store = this.checked;
    store.set($store);
    $$invalidate(4, setting);
  }
  __name(input_change_handler, "input_change_handler");
  function select_change_handler() {
    $store = select_value(this);
    store.set($store);
    $$invalidate(4, setting);
  }
  __name(select_change_handler, "select_change_handler");
  function input_input_handler() {
    $customFormulaStore = this.value;
    customFormulaStore.set($customFormulaStore);
  }
  __name(input_input_handler, "input_input_handler");
  function input_input_handler_1() {
    $store = to_number(this.value);
    store.set($store);
    $$invalidate(4, setting);
  }
  __name(input_input_handler_1, "input_input_handler_1");
  function input_input_handler_2() {
    $store = this.value;
    store.set($store);
    $$invalidate(4, setting);
  }
  __name(input_input_handler_2, "input_input_handler_2");
  $$self.$$set = ($$props2) => {
    if ("key" in $$props2)
      $$invalidate(0, key = $$props2.key);
  };
  return [
    key,
    $disabled,
    $store,
    $customFormulaStore,
    setting,
    customFormulaStore,
    store,
    disabled,
    callback,
    click_handler,
    input_change_handler,
    select_change_handler,
    input_input_handler,
    input_input_handler_1,
    input_input_handler_2
  ];
}
__name(instance$5, "instance$5");
class Setting extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$5, create_fragment$5, safe_not_equal, { key: 0 });
  }
}
__name(Setting, "Setting");
const Tabs_svelte_svelte_type_style_lang = "";
function get_each_context$3(ctx, list, i) {
  const child_ctx = ctx.slice();
  child_ctx[3] = list[i];
  child_ctx[5] = i;
  return child_ctx;
}
__name(get_each_context$3, "get_each_context$3");
function create_if_block_1$2(ctx) {
  let i;
  let i_class_value;
  return {
    c() {
      i = element("i");
      attr(i, "class", i_class_value = "icon " + ctx[3].icon + " svelte-19exln0");
    },
    m(target, anchor) {
      insert(target, i, anchor);
    },
    p(ctx2, dirty) {
      if (dirty & 2 && i_class_value !== (i_class_value = "icon " + ctx2[3].icon + " svelte-19exln0")) {
        attr(i, "class", i_class_value);
      }
    },
    d(detaching) {
      if (detaching)
        detach(i);
    }
  };
}
__name(create_if_block_1$2, "create_if_block_1$2");
function create_if_block$3(ctx) {
  let div;
  return {
    c() {
      div = element("div");
      div.innerHTML = `<i class="fas fa-exclamation"></i>`;
      attr(div, "class", "blob svelte-19exln0");
    },
    m(target, anchor) {
      insert(target, div, anchor);
    },
    d(detaching) {
      if (detaching)
        detach(div);
    }
  };
}
__name(create_if_block$3, "create_if_block$3");
function create_each_block$3(key_1, ctx) {
  let a;
  let t0;
  let t1_value = localize(ctx[3].label) + "";
  let t1;
  let t2;
  let t3;
  let mounted;
  let dispose;
  let if_block0 = ctx[3].icon && create_if_block_1$2(ctx);
  let if_block1 = ctx[3].highlight && create_if_block$3();
  function click_handler() {
    return ctx[2](ctx[3]);
  }
  __name(click_handler, "click_handler");
  return {
    key: key_1,
    first: null,
    c() {
      a = element("a");
      if (if_block0)
        if_block0.c();
      t0 = space();
      t1 = text(t1_value);
      t2 = space();
      if (if_block1)
        if_block1.c();
      t3 = space();
      attr(a, "class", "item flexrow svelte-19exln0");
      attr(a, "data-tab", "rest");
      toggle_class(a, "active", ctx[0] === ctx[3].value);
      this.first = a;
    },
    m(target, anchor) {
      insert(target, a, anchor);
      if (if_block0)
        if_block0.m(a, null);
      append(a, t0);
      append(a, t1);
      append(a, t2);
      if (if_block1)
        if_block1.m(a, null);
      append(a, t3);
      if (!mounted) {
        dispose = listen(a, "click", click_handler);
        mounted = true;
      }
    },
    p(new_ctx, dirty) {
      ctx = new_ctx;
      if (ctx[3].icon) {
        if (if_block0) {
          if_block0.p(ctx, dirty);
        } else {
          if_block0 = create_if_block_1$2(ctx);
          if_block0.c();
          if_block0.m(a, t0);
        }
      } else if (if_block0) {
        if_block0.d(1);
        if_block0 = null;
      }
      if (dirty & 2 && t1_value !== (t1_value = localize(ctx[3].label) + ""))
        set_data(t1, t1_value);
      if (ctx[3].highlight) {
        if (if_block1)
          ;
        else {
          if_block1 = create_if_block$3();
          if_block1.c();
          if_block1.m(a, t3);
        }
      } else if (if_block1) {
        if_block1.d(1);
        if_block1 = null;
      }
      if (dirty & 3) {
        toggle_class(a, "active", ctx[0] === ctx[3].value);
      }
    },
    d(detaching) {
      if (detaching)
        detach(a);
      if (if_block0)
        if_block0.d();
      if (if_block1)
        if_block1.d();
      mounted = false;
      dispose();
    }
  };
}
__name(create_each_block$3, "create_each_block$3");
function create_fragment$4(ctx) {
  let div;
  let nav;
  let each_blocks = [];
  let each_1_lookup = /* @__PURE__ */ new Map();
  let each_value = ctx[1];
  const get_key = /* @__PURE__ */ __name((ctx2) => ctx2[3].value, "get_key");
  for (let i = 0; i < each_value.length; i += 1) {
    let child_ctx = get_each_context$3(ctx, each_value, i);
    let key = get_key(child_ctx);
    each_1_lookup.set(key, each_blocks[i] = create_each_block$3(key, child_ctx));
  }
  return {
    c() {
      div = element("div");
      nav = element("nav");
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].c();
      }
      attr(nav, "class", "tabs svelte-19exln0");
      attr(nav, "data-group", "primary");
    },
    m(target, anchor) {
      insert(target, div, anchor);
      append(div, nav);
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].m(nav, null);
      }
    },
    p(ctx2, [dirty]) {
      if (dirty & 3) {
        each_value = ctx2[1];
        each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx2, each_value, each_1_lookup, nav, destroy_block, create_each_block$3, null, get_each_context$3);
      }
    },
    i: noop,
    o: noop,
    d(detaching) {
      if (detaching)
        detach(div);
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].d();
      }
    }
  };
}
__name(create_fragment$4, "create_fragment$4");
function instance$4($$self, $$props, $$invalidate) {
  let { activeTab } = $$props;
  let { tabs } = $$props;
  const click_handler = /* @__PURE__ */ __name((tab) => {
    $$invalidate(0, activeTab = tab.value);
  }, "click_handler");
  $$self.$$set = ($$props2) => {
    if ("activeTab" in $$props2)
      $$invalidate(0, activeTab = $$props2.activeTab);
    if ("tabs" in $$props2)
      $$invalidate(1, tabs = $$props2.tabs);
  };
  return [activeTab, tabs, click_handler];
}
__name(instance$4, "instance$4");
class Tabs extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$4, create_fragment$4, safe_not_equal, { activeTab: 0, tabs: 1 });
  }
}
__name(Tabs, "Tabs");
const SaveProfileDialog_svelte_svelte_type_style_lang = "";
function create_if_block_1$1(ctx) {
  let div;
  return {
    c() {
      div = element("div");
      div.textContent = `${localize("REST-RECOVERY.Dialogs.SaveProfile.OverrideProfile")}`;
      attr(div, "class", "notification error svelte-tz22jy");
    },
    m(target, anchor) {
      insert(target, div, anchor);
    },
    p: noop,
    d(detaching) {
      if (detaching)
        detach(div);
    }
  };
}
__name(create_if_block_1$1, "create_if_block_1$1");
function create_if_block$2(ctx) {
  let div;
  return {
    c() {
      div = element("div");
      div.textContent = `${localize("REST-RECOVERY.Dialogs.SaveProfile.Empty")}`;
      attr(div, "class", "notification error svelte-tz22jy");
    },
    m(target, anchor) {
      insert(target, div, anchor);
    },
    p: noop,
    d(detaching) {
      if (detaching)
        detach(div);
    }
  };
}
__name(create_if_block$2, "create_if_block$2");
function create_fragment$3(ctx) {
  let form_1;
  let div;
  let label;
  let t1;
  let input;
  let t2;
  let show_if;
  let t3;
  let footer;
  let button;
  let t4_value = localize("Okay") + "";
  let t4;
  let button_disabled_value;
  let mounted;
  let dispose;
  function select_block_type(ctx2, dirty) {
    if (dirty & 6)
      show_if = null;
    if (ctx2[1] === "")
      return create_if_block$2;
    if (show_if == null)
      show_if = !!(ctx2[2].indexOf(ctx2[1]) > -1);
    if (show_if)
      return create_if_block_1$1;
  }
  __name(select_block_type, "select_block_type");
  let current_block_type = select_block_type(ctx, -1);
  let if_block = current_block_type && current_block_type(ctx);
  return {
    c() {
      form_1 = element("form");
      div = element("div");
      label = element("label");
      label.textContent = `${localize("REST-RECOVERY.Dialogs.SaveProfile.Enter")}`;
      t1 = space();
      input = element("input");
      t2 = space();
      if (if_block)
        if_block.c();
      t3 = space();
      footer = element("footer");
      button = element("button");
      t4 = text(t4_value);
      attr(input, "type", "text");
      attr(div, "class", "form-control svelte-tz22jy");
      attr(button, "type", "button");
      button.disabled = button_disabled_value = ctx[1] === "" || ctx[2].indexOf(ctx[1]) > -1;
      attr(footer, "class", "svelte-tz22jy");
      attr(form_1, "autocomplete", "off");
      attr(form_1, "class", "dialog-content");
    },
    m(target, anchor) {
      insert(target, form_1, anchor);
      append(form_1, div);
      append(div, label);
      append(div, t1);
      append(div, input);
      set_input_value(input, ctx[1]);
      append(form_1, t2);
      if (if_block)
        if_block.m(form_1, null);
      append(form_1, t3);
      append(form_1, footer);
      append(footer, button);
      append(button, t4);
      ctx[6](form_1);
      if (!mounted) {
        dispose = [
          listen(input, "input", ctx[5]),
          listen(button, "click", ctx[3]),
          listen(form_1, "submit", prevent_default(ctx[4]))
        ];
        mounted = true;
      }
    },
    p(ctx2, [dirty]) {
      if (dirty & 2 && input.value !== ctx2[1]) {
        set_input_value(input, ctx2[1]);
      }
      if (current_block_type === (current_block_type = select_block_type(ctx2, dirty)) && if_block) {
        if_block.p(ctx2, dirty);
      } else {
        if (if_block)
          if_block.d(1);
        if_block = current_block_type && current_block_type(ctx2);
        if (if_block) {
          if_block.c();
          if_block.m(form_1, t3);
        }
      }
      if (dirty & 6 && button_disabled_value !== (button_disabled_value = ctx2[1] === "" || ctx2[2].indexOf(ctx2[1]) > -1)) {
        button.disabled = button_disabled_value;
      }
    },
    i: noop,
    o: noop,
    d(detaching) {
      if (detaching)
        detach(form_1);
      if (if_block) {
        if_block.d();
      }
      ctx[6](null);
      mounted = false;
      run_all(dispose);
    }
  };
}
__name(create_fragment$3, "create_fragment$3");
function instance$3($$self, $$props, $$invalidate) {
  const { application } = getContext("external");
  let { form } = $$props;
  let { existingProfiles } = $$props;
  let { profileName = "New Preset" } = $$props;
  async function requestSubmit() {
    form.requestSubmit();
    if (profileName === "Default") {
      ui.notifications.error();
      return false;
    }
  }
  __name(requestSubmit, "requestSubmit");
  async function savePreset() {
    application.options.resolve(profileName);
    application.close();
  }
  __name(savePreset, "savePreset");
  function input_input_handler() {
    profileName = this.value;
    $$invalidate(1, profileName);
  }
  __name(input_input_handler, "input_input_handler");
  function form_1_binding($$value) {
    binding_callbacks[$$value ? "unshift" : "push"](() => {
      form = $$value;
      $$invalidate(0, form);
    });
  }
  __name(form_1_binding, "form_1_binding");
  $$self.$$set = ($$props2) => {
    if ("form" in $$props2)
      $$invalidate(0, form = $$props2.form);
    if ("existingProfiles" in $$props2)
      $$invalidate(2, existingProfiles = $$props2.existingProfiles);
    if ("profileName" in $$props2)
      $$invalidate(1, profileName = $$props2.profileName);
  };
  return [
    form,
    profileName,
    existingProfiles,
    requestSubmit,
    savePreset,
    input_input_handler,
    form_1_binding
  ];
}
__name(instance$3, "instance$3");
class SaveProfileDialog extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$3, create_fragment$3, safe_not_equal, {
      form: 0,
      existingProfiles: 2,
      profileName: 1,
      requestSubmit: 3,
      savePreset: 4
    });
  }
  get form() {
    return this.$$.ctx[0];
  }
  set form(form) {
    this.$$set({ form });
    flush();
  }
  get existingProfiles() {
    return this.$$.ctx[2];
  }
  set existingProfiles(existingProfiles) {
    this.$$set({ existingProfiles });
    flush();
  }
  get profileName() {
    return this.$$.ctx[1];
  }
  set profileName(profileName) {
    this.$$set({ profileName });
    flush();
  }
  get requestSubmit() {
    return this.$$.ctx[3];
  }
  get savePreset() {
    return this.$$.ctx[4];
  }
}
__name(SaveProfileDialog, "SaveProfileDialog");
const settingsShell_svelte_svelte_type_style_lang = "";
function get_each_context$2(ctx, list, i) {
  const child_ctx = ctx.slice();
  child_ctx[18] = list[i];
  child_ctx[20] = i;
  return child_ctx;
}
__name(get_each_context$2, "get_each_context$2");
function get_each_context_1$1(ctx, list, i) {
  const child_ctx = ctx.slice();
  child_ctx[21] = list[i];
  child_ctx[23] = i;
  return child_ctx;
}
__name(get_each_context_1$1, "get_each_context_1$1");
function get_each_context_2$1(ctx, list, i) {
  const child_ctx = ctx.slice();
  child_ctx[24] = list[i];
  return child_ctx;
}
__name(get_each_context_2$1, "get_each_context_2$1");
function create_each_block_2$1(key_1, ctx) {
  let option;
  let t_value = ctx[24] + "";
  let t;
  let option_value_value;
  return {
    key: key_1,
    first: null,
    c() {
      option = element("option");
      t = text(t_value);
      option.__value = option_value_value = ctx[24];
      option.value = option.__value;
      this.first = option;
    },
    m(target, anchor) {
      insert(target, option, anchor);
      append(option, t);
    },
    p(new_ctx, dirty) {
      ctx = new_ctx;
      if (dirty & 2 && t_value !== (t_value = ctx[24] + ""))
        set_data(t, t_value);
      if (dirty & 2 && option_value_value !== (option_value_value = ctx[24])) {
        option.__value = option_value_value;
        option.value = option.__value;
      }
    },
    d(detaching) {
      if (detaching)
        detach(option);
    }
  };
}
__name(create_each_block_2$1, "create_each_block_2$1");
function create_each_block_1$1(key_1, ctx) {
  let div;
  let setting;
  let current;
  setting = new Setting({ props: { key: ctx[21].key } });
  return {
    key: key_1,
    first: null,
    c() {
      div = element("div");
      create_component(setting.$$.fragment);
      attr(div, "class", "setting svelte-kvgwwk");
      this.first = div;
    },
    m(target, anchor) {
      insert(target, div, anchor);
      mount_component(setting, div, null);
      current = true;
    },
    p(new_ctx, dirty) {
      ctx = new_ctx;
      const setting_changes = {};
      if (dirty & 2)
        setting_changes.key = ctx[21].key;
      setting.$set(setting_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(setting.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(setting.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      if (detaching)
        detach(div);
      destroy_component(setting);
    }
  };
}
__name(create_each_block_1$1, "create_each_block_1$1");
function create_if_block$1(ctx) {
  let div0;
  let p0;
  let t1;
  let p1;
  let a0;
  let t3;
  let div1;
  let p2;
  let p3;
  let p4;
  let a1;
  let t7;
  let p5;
  let t9;
  let p6;
  let mounted;
  let dispose;
  return {
    c() {
      div0 = element("div");
      p0 = element("p");
      p0.textContent = `${localize("REST-RECOVERY.Dialogs.ModuleConfig.Confused")}`;
      t1 = space();
      p1 = element("p");
      a0 = element("a");
      a0.textContent = `${localize("REST-RECOVERY.Dialogs.ModuleConfig.QuickSetup")}`;
      t3 = space();
      div1 = element("div");
      p2 = element("p");
      p2.textContent = `${localize("REST-RECOVERY.Dialogs.ModuleConfig.MoreToCome")} 
              `;
      p3 = element("p");
      p4 = element("p");
      a1 = element("a");
      a1.textContent = `${localize("REST-RECOVERY.Dialogs.ModuleConfig.Request")}`;
      t7 = space();
      p5 = element("p");
      p5.textContent = `${localize("REST-RECOVERY.Dialogs.ModuleConfig.Donate")}`;
      t9 = space();
      p6 = element("p");
      p6.innerHTML = `<a href="https://ko-fi.com/fantasycomputerworks" target="_blank" style="text-decoration: none !important; flex: 0 1 auto;"><button class="donate-button svelte-kvgwwk" type="button"><img src="https://storage.ko-fi.com/cdn/cup-border.png" class="svelte-kvgwwk"/> 
                    <span class="svelte-kvgwwk">Donate</span></button></a>`;
      attr(a0, "class", "link-text svelte-kvgwwk");
      set_style(div0, "text-align", "center");
      set_style(div0, "font-size", "1rem");
      set_style(div0, "margin-top", "2rem");
      set_style(div0, "padding-bottom", "2rem");
      set_style(div0, "border-bottom", "1px solid rgba(0,0,0,0.25)");
      attr(a1, "class", "link-text svelte-kvgwwk");
      attr(a1, "href", "https://github.com/fantasycalendar/FoundryVTT-RestRecovery/issues/new?assignees=&labels=&template=feature_request.md&title=");
      attr(a1, "target", "_blank");
      set_style(p4, "margin-bottom", "1rem");
      set_style(p6, "display", "flex");
      set_style(p6, "justify-content", "center");
      set_style(div1, "text-align", "center");
      set_style(div1, "font-size", "1rem");
      set_style(div1, "margin-top", "2rem");
    },
    m(target, anchor) {
      insert(target, div0, anchor);
      append(div0, p0);
      append(div0, t1);
      append(div0, p1);
      append(p1, a0);
      insert(target, t3, anchor);
      insert(target, div1, anchor);
      append(div1, p2);
      append(div1, p3);
      append(div1, p4);
      append(p4, a1);
      append(div1, t7);
      append(div1, p5);
      append(div1, t9);
      append(div1, p6);
      if (!mounted) {
        dispose = listen(a0, "click", ctx[14]);
        mounted = true;
      }
    },
    p: noop,
    d(detaching) {
      if (detaching)
        detach(div0);
      if (detaching)
        detach(t3);
      if (detaching)
        detach(div1);
      mounted = false;
      dispose();
    }
  };
}
__name(create_if_block$1, "create_if_block$1");
function create_each_block$2(key_1, ctx) {
  let div;
  let each_blocks = [];
  let each_1_lookup = /* @__PURE__ */ new Map();
  let t0;
  let t1;
  let div_data_tab_value;
  let current;
  let each_value_1 = ctx[1].groupedSettings.get(ctx[18]);
  const get_key = /* @__PURE__ */ __name((ctx2) => ctx2[21].key, "get_key");
  for (let i = 0; i < each_value_1.length; i += 1) {
    let child_ctx = get_each_context_1$1(ctx, each_value_1, i);
    let key = get_key(child_ctx);
    each_1_lookup.set(key, each_blocks[i] = create_each_block_1$1(key, child_ctx));
  }
  let if_block = ctx[18] === "general" && create_if_block$1(ctx);
  return {
    key: key_1,
    first: null,
    c() {
      div = element("div");
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].c();
      }
      t0 = space();
      if (if_block)
        if_block.c();
      t1 = space();
      attr(div, "class", "tab flex");
      attr(div, "data-group", "primary");
      attr(div, "data-tab", div_data_tab_value = ctx[18]);
      toggle_class(div, "active", ctx[3] === ctx[18]);
      this.first = div;
    },
    m(target, anchor) {
      insert(target, div, anchor);
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].m(div, null);
      }
      append(div, t0);
      if (if_block)
        if_block.m(div, null);
      append(div, t1);
      current = true;
    },
    p(new_ctx, dirty) {
      ctx = new_ctx;
      if (dirty & 2) {
        each_value_1 = ctx[1].groupedSettings.get(ctx[18]);
        group_outros();
        each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value_1, each_1_lookup, div, outro_and_destroy_block, create_each_block_1$1, t0, get_each_context_1$1);
        check_outros();
      }
      if (ctx[18] === "general") {
        if (if_block) {
          if_block.p(ctx, dirty);
        } else {
          if_block = create_if_block$1(ctx);
          if_block.c();
          if_block.m(div, t1);
        }
      } else if (if_block) {
        if_block.d(1);
        if_block = null;
      }
      if (!current || dirty & 2 && div_data_tab_value !== (div_data_tab_value = ctx[18])) {
        attr(div, "data-tab", div_data_tab_value);
      }
      if (!current || dirty & 10) {
        toggle_class(div, "active", ctx[3] === ctx[18]);
      }
    },
    i(local) {
      if (current)
        return;
      for (let i = 0; i < each_value_1.length; i += 1) {
        transition_in(each_blocks[i]);
      }
      current = true;
    },
    o(local) {
      for (let i = 0; i < each_blocks.length; i += 1) {
        transition_out(each_blocks[i]);
      }
      current = false;
    },
    d(detaching) {
      if (detaching)
        detach(div);
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].d();
      }
      if (if_block)
        if_block.d();
    }
  };
}
__name(create_each_block$2, "create_each_block$2");
function create_default_slot$2(ctx) {
  let form_1;
  let h2;
  let t1;
  let div;
  let label;
  let t3;
  let select;
  let each_blocks_1 = [];
  let each0_lookup = /* @__PURE__ */ new Map();
  let t4;
  let button0;
  let t5;
  let button1;
  let t6;
  let button2;
  let i2;
  let button2_disabled_value;
  let t7;
  let tabs;
  let updating_activeTab;
  let t8;
  let section;
  let each_blocks = [];
  let each1_lookup = /* @__PURE__ */ new Map();
  let t9;
  let footer;
  let button3;
  let i3;
  let t10;
  let t11_value = localize("REST-RECOVERY.Dialogs.ModuleConfig.Submit") + "";
  let t11;
  let current;
  let mounted;
  let dispose;
  let each_value_2 = Object.keys(ctx[1].profiles);
  const get_key = /* @__PURE__ */ __name((ctx2) => ctx2[24], "get_key");
  for (let i = 0; i < each_value_2.length; i += 1) {
    let child_ctx = get_each_context_2$1(ctx, each_value_2, i);
    let key = get_key(child_ctx);
    each0_lookup.set(key, each_blocks_1[i] = create_each_block_2$1(key, child_ctx));
  }
  function tabs_activeTab_binding(value) {
    ctx[13](value);
  }
  __name(tabs_activeTab_binding, "tabs_activeTab_binding");
  let tabs_props = {
    tabs: [
      {
        value: "general",
        label: "REST-RECOVERY.Dialogs.ModuleConfig.General"
      },
      {
        value: "longrest",
        label: "REST-RECOVERY.Dialogs.ModuleConfig.LongRest"
      },
      {
        value: "shortrest",
        label: "REST-RECOVERY.Dialogs.ModuleConfig.ShortRest"
      },
      {
        value: "itemnames",
        label: "REST-RECOVERY.Dialogs.ModuleConfig.ItemNames"
      },
      {
        value: "foodandwater",
        label: "REST-RECOVERY.Dialogs.ModuleConfig.FoodAndWater"
      }
    ]
  };
  if (ctx[3] !== void 0) {
    tabs_props.activeTab = ctx[3];
  }
  tabs = new Tabs({ props: tabs_props });
  binding_callbacks.push(() => bind(tabs, "activeTab", tabs_activeTab_binding, ctx[3]));
  let each_value = Array.from(ctx[1].groupedSettings.keys());
  const get_key_1 = /* @__PURE__ */ __name((ctx2) => ctx2[18], "get_key_1");
  for (let i = 0; i < each_value.length; i += 1) {
    let child_ctx = get_each_context$2(ctx, each_value, i);
    let key = get_key_1(child_ctx);
    each1_lookup.set(key, each_blocks[i] = create_each_block$2(key, child_ctx));
  }
  return {
    c() {
      form_1 = element("form");
      h2 = element("h2");
      h2.textContent = `${localize("REST-RECOVERY.Dialogs.ModuleConfig.Title")}`;
      t1 = space();
      div = element("div");
      label = element("label");
      label.textContent = `${localize("REST-RECOVERY.Dialogs.ModuleConfig.ModuleProfile")}`;
      t3 = space();
      select = element("select");
      for (let i = 0; i < each_blocks_1.length; i += 1) {
        each_blocks_1[i].c();
      }
      t4 = space();
      button0 = element("button");
      button0.innerHTML = `<i class="fas fa-plus"></i>`;
      t5 = space();
      button1 = element("button");
      button1.innerHTML = `<i class="fas fa-redo"></i>`;
      t6 = space();
      button2 = element("button");
      i2 = element("i");
      t7 = space();
      create_component(tabs.$$.fragment);
      t8 = space();
      section = element("section");
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].c();
      }
      t9 = space();
      footer = element("footer");
      button3 = element("button");
      i3 = element("i");
      t10 = space();
      t11 = text(t11_value);
      set_style(h2, "text-align", "center");
      set_style(h2, "margin-bottom", "1rem");
      attr(label, "class", "svelte-kvgwwk");
      attr(select, "class", "svelte-kvgwwk");
      if (ctx[1].activeProfile === void 0)
        add_render_callback(() => ctx[11].call(select));
      attr(button0, "type", "button");
      attr(button0, "class", "svelte-kvgwwk");
      attr(button1, "type", "button");
      attr(button1, "class", "svelte-kvgwwk");
      toggle_class(button1, "hidden", ctx[1].activeProfile !== "Default");
      attr(i2, "class", "fas fa-trash-alt");
      attr(button2, "type", "button");
      button2.disabled = button2_disabled_value = ctx[1].activeProfile === "Default";
      attr(button2, "class", "svelte-kvgwwk");
      toggle_class(button2, "hidden", ctx[1].activeProfile === "Default");
      attr(div, "class", "preset-select svelte-kvgwwk");
      attr(section, "class", "tab-body svelte-kvgwwk");
      attr(i3, "class", "far fa-save");
      attr(button3, "type", "button");
      attr(footer, "class", "svelte-kvgwwk");
      attr(form_1, "autocomplete", "off");
    },
    m(target, anchor) {
      insert(target, form_1, anchor);
      append(form_1, h2);
      append(form_1, t1);
      append(form_1, div);
      append(div, label);
      append(div, t3);
      append(div, select);
      for (let i = 0; i < each_blocks_1.length; i += 1) {
        each_blocks_1[i].m(select, null);
      }
      select_option(select, ctx[1].activeProfile);
      append(div, t4);
      append(div, button0);
      append(div, t5);
      append(div, button1);
      append(div, t6);
      append(div, button2);
      append(button2, i2);
      append(form_1, t7);
      mount_component(tabs, form_1, null);
      append(form_1, t8);
      append(form_1, section);
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].m(section, null);
      }
      append(form_1, t9);
      append(form_1, footer);
      append(footer, button3);
      append(button3, i3);
      append(button3, t10);
      append(button3, t11);
      ctx[15](form_1);
      current = true;
      if (!mounted) {
        dispose = [
          listen(select, "change", ctx[11]),
          listen(select, "change", ctx[12]),
          listen(button0, "click", ctx[5]),
          listen(button1, "click", ctx[7]),
          listen(button2, "click", ctx[4]),
          listen(button3, "click", ctx[8]),
          listen(form_1, "submit", prevent_default(ctx[9]), { once: true })
        ];
        mounted = true;
      }
    },
    p(ctx2, dirty) {
      if (dirty & 2) {
        each_value_2 = Object.keys(ctx2[1].profiles);
        each_blocks_1 = update_keyed_each(each_blocks_1, dirty, get_key, 1, ctx2, each_value_2, each0_lookup, select, destroy_block, create_each_block_2$1, null, get_each_context_2$1);
      }
      if (dirty & 2) {
        select_option(select, ctx2[1].activeProfile);
      }
      if (!current || dirty & 2) {
        toggle_class(button1, "hidden", ctx2[1].activeProfile !== "Default");
      }
      if (!current || dirty & 2 && button2_disabled_value !== (button2_disabled_value = ctx2[1].activeProfile === "Default")) {
        button2.disabled = button2_disabled_value;
      }
      if (!current || dirty & 2) {
        toggle_class(button2, "hidden", ctx2[1].activeProfile === "Default");
      }
      const tabs_changes = {};
      if (!updating_activeTab && dirty & 8) {
        updating_activeTab = true;
        tabs_changes.activeTab = ctx2[3];
        add_flush_callback(() => updating_activeTab = false);
      }
      tabs.$set(tabs_changes);
      if (dirty & 1034) {
        each_value = Array.from(ctx2[1].groupedSettings.keys());
        group_outros();
        each_blocks = update_keyed_each(each_blocks, dirty, get_key_1, 1, ctx2, each_value, each1_lookup, section, outro_and_destroy_block, create_each_block$2, null, get_each_context$2);
        check_outros();
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(tabs.$$.fragment, local);
      for (let i = 0; i < each_value.length; i += 1) {
        transition_in(each_blocks[i]);
      }
      current = true;
    },
    o(local) {
      transition_out(tabs.$$.fragment, local);
      for (let i = 0; i < each_blocks.length; i += 1) {
        transition_out(each_blocks[i]);
      }
      current = false;
    },
    d(detaching) {
      if (detaching)
        detach(form_1);
      for (let i = 0; i < each_blocks_1.length; i += 1) {
        each_blocks_1[i].d();
      }
      destroy_component(tabs);
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].d();
      }
      ctx[15](null);
      mounted = false;
      run_all(dispose);
    }
  };
}
__name(create_default_slot$2, "create_default_slot$2");
function create_fragment$2(ctx) {
  let applicationshell;
  let updating_elementRoot;
  let current;
  function applicationshell_elementRoot_binding(value) {
    ctx[16](value);
  }
  __name(applicationshell_elementRoot_binding, "applicationshell_elementRoot_binding");
  let applicationshell_props = {
    $$slots: { default: [create_default_slot$2] },
    $$scope: { ctx }
  };
  if (ctx[0] !== void 0) {
    applicationshell_props.elementRoot = ctx[0];
  }
  applicationshell = new ApplicationShell({ props: applicationshell_props });
  binding_callbacks.push(() => bind(applicationshell, "elementRoot", applicationshell_elementRoot_binding, ctx[0]));
  return {
    c() {
      create_component(applicationshell.$$.fragment);
    },
    m(target, anchor) {
      mount_component(applicationshell, target, anchor);
      current = true;
    },
    p(ctx2, [dirty]) {
      const applicationshell_changes = {};
      if (dirty & 134217742) {
        applicationshell_changes.$$scope = { dirty, ctx: ctx2 };
      }
      if (!updating_elementRoot && dirty & 1) {
        updating_elementRoot = true;
        applicationshell_changes.elementRoot = ctx2[0];
        add_flush_callback(() => updating_elementRoot = false);
      }
      applicationshell.$set(applicationshell_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(applicationshell.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(applicationshell.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(applicationshell, detaching);
    }
  };
}
__name(create_fragment$2, "create_fragment$2");
function instance$2($$self, $$props, $$invalidate) {
  const { application } = getContext("external");
  let { elementRoot } = $$props;
  let form;
  gameSettings.cleanup();
  async function deleteProfile() {
    const result = await TJSDialog.confirm({
      title: localize("REST-RECOVERY.Dialogs.DeleteProfile.Title"),
      content: localize("REST-RECOVERY.Dialogs.DeleteProfile.Content", { profile: gameSettings.activeProfile }),
      modal: true,
      draggable: false,
      autoClose: true,
      rejectClose: false
    });
    if (!result) {
      return;
    }
    await gameSettings.deleteProfile(gameSettings.activeProfile);
    $$invalidate(1, gameSettings);
  }
  __name(deleteProfile, "deleteProfile");
  async function newProfile() {
    const result = await new Promise((resolve) => {
      let options = { resolve };
      new TJSDialog(
        {
          title: localize("REST-RECOVERY.Dialogs.SaveProfile.Title"),
          content: {
            class: SaveProfileDialog,
            props: {
              existingProfiles: Object.keys(gameSettings.profiles)
            }
          },
          label: "Okay",
          modal: true,
          draggable: false,
          autoClose: true,
          close: () => options.resolve?.(null)
        },
        options
      ).render(true);
    });
    if (!result)
      return;
    const newProfile2 = foundry.utils.duplicate(gameSettings.activeProfileData);
    await gameSettings.createProfile(result, newProfile2, true);
    $$invalidate(1, gameSettings);
  }
  __name(newProfile, "newProfile");
  async function changeProfile() {
    return gameSettings.setActiveProfile(gameSettings.activeProfile);
  }
  __name(changeProfile, "changeProfile");
  async function resetDefaultSetting() {
    const result = await TJSDialog.confirm({
      title: localize("REST-RECOVERY.Dialogs.ResetDefaultChanges.Title"),
      content: localize("REST-RECOVERY.Dialogs.ResetDefaultChanges.Content"),
      modal: true,
      draggable: false,
      autoClose: true,
      rejectClose: false
    });
    if (!result)
      return;
    return gameSettings.resetAll();
  }
  __name(resetDefaultSetting, "resetDefaultSetting");
  function requestSubmit() {
    form.requestSubmit();
  }
  __name(requestSubmit, "requestSubmit");
  async function updateSettings() {
    await gameSettings.persistSettings();
    application.close();
  }
  __name(updateSettings, "updateSettings");
  async function openQuickSetup() {
    QuickSetup.show();
    application.close();
  }
  __name(openQuickSetup, "openQuickSetup");
  let activeTab = "general";
  function select_change_handler() {
    gameSettings.activeProfile = select_value(this);
    $$invalidate(1, gameSettings);
  }
  __name(select_change_handler, "select_change_handler");
  const change_handler = /* @__PURE__ */ __name(() => {
    changeProfile();
  }, "change_handler");
  function tabs_activeTab_binding(value) {
    activeTab = value;
    $$invalidate(3, activeTab);
  }
  __name(tabs_activeTab_binding, "tabs_activeTab_binding");
  const click_handler = /* @__PURE__ */ __name(() => {
    openQuickSetup();
  }, "click_handler");
  function form_1_binding($$value) {
    binding_callbacks[$$value ? "unshift" : "push"](() => {
      form = $$value;
      $$invalidate(2, form);
    });
  }
  __name(form_1_binding, "form_1_binding");
  function applicationshell_elementRoot_binding(value) {
    elementRoot = value;
    $$invalidate(0, elementRoot);
  }
  __name(applicationshell_elementRoot_binding, "applicationshell_elementRoot_binding");
  $$self.$$set = ($$props2) => {
    if ("elementRoot" in $$props2)
      $$invalidate(0, elementRoot = $$props2.elementRoot);
  };
  return [
    elementRoot,
    gameSettings,
    form,
    activeTab,
    deleteProfile,
    newProfile,
    changeProfile,
    resetDefaultSetting,
    requestSubmit,
    updateSettings,
    openQuickSetup,
    select_change_handler,
    change_handler,
    tabs_activeTab_binding,
    click_handler,
    form_1_binding,
    applicationshell_elementRoot_binding
  ];
}
__name(instance$2, "instance$2");
class Settings_shell extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$2, create_fragment$2, safe_not_equal, { elementRoot: 0 });
  }
  get elementRoot() {
    return this.$$.ctx[0];
  }
  set elementRoot(elementRoot) {
    this.$$set({ elementRoot });
    flush();
  }
}
__name(Settings_shell, "Settings_shell");
class Settings extends SvelteApplication {
  constructor(options = {}, dialogData = {}) {
    super({
      id: `rest-recovery-app`,
      title: "Rest Recovery",
      svelte: {
        class: Settings_shell,
        target: document.body
      },
      width: 600,
      ...options
    }, { dialogData });
  }
  static getActiveApp() {
    return Object.values(ui.windows).find((app) => app.id === "rest-recovery-app");
  }
  static async show(options = {}, dialogData = {}) {
    const app = this.getActiveApp();
    if (app)
      return app.render(false, { focus: true });
    return new Promise((resolve) => {
      options.resolve = resolve;
      new this(options, dialogData).render(true, { focus: true });
    });
  }
  _getHeaderButtons() {
    const buttons = super._getHeaderButtons();
    buttons.unshift({
      icon: "fas fa-file-import",
      title: game.i18n.localize("REST-RECOVERY.Dialogs.ModuleConfig.ImportProfile"),
      label: game.i18n.localize("REST-RECOVERY.Dialogs.ModuleConfig.ImportProfile"),
      onclick: async () => {
        const profiles = this.svelte.applicationShell.profiles;
        const input = document.createElement("input");
        input.type = "file";
        input.onchange = (e) => {
          input.remove();
          const file = e.target.files[0];
          const fileName = file.name;
          const reader = new FileReader();
          reader.addEventListener("load", async () => {
            try {
              const newProfileName = await new Promise((resolve) => {
                let options = { resolve };
                new TJSDialog({
                  title: game.i18n.localize("REST-RECOVERY.Dialogs.SaveProfile.Title"),
                  content: {
                    class: SaveProfileDialog,
                    props: {
                      existingProfiles: Object.keys(profiles),
                      profileName: fileName.split(".")[0]
                    }
                  },
                  label: "Okay",
                  modal: true,
                  draggable: false,
                  autoClose: true,
                  close: () => options.resolve?.(null)
                }, options).render(true);
              });
              const newProfile = foundry.utils.duplicate(this.svelte.applicationShell.profiles["Default"]);
              const profileData = JSON.parse(reader.result);
              for (const [key, value] of Object.entries(profileData)) {
                newProfile[key] = value;
              }
              this.svelte.applicationShell.profiles[newProfileName] = newProfile;
              this.svelte.applicationShell.selectedProfile = newProfileName;
              this.svelte.applicationShell.profiles = this.svelte.applicationShell.profiles;
            } catch (err) {
              console.error(err);
            }
          });
          reader.readAsText(file);
        };
        input.click();
      }
    });
    buttons.unshift({
      icon: "fas fa-file-export",
      title: game.i18n.localize("REST-RECOVERY.Dialogs.ModuleConfig.ExportProfile"),
      label: game.i18n.localize("REST-RECOVERY.Dialogs.ModuleConfig.ExportProfile"),
      onclick: async () => {
        const profiles = this.svelte.applicationShell.profiles;
        const selectedProfile = this.svelte.applicationShell.selectedProfile;
        const profile = profiles[selectedProfile];
        const a = document.createElement("a");
        const file = new Blob([JSON.stringify(profile)], { type: "text/json" });
        a.href = URL.createObjectURL(file);
        a.download = selectedProfile + ".json";
        a.click();
        a.remove();
      }
    });
    return buttons;
  }
}
__name(Settings, "Settings");
class SettingsShim extends FormApplication {
  constructor() {
    super({});
    Settings.show();
  }
  async _updateObject(event, formData) {
  }
  render() {
    this.close();
  }
}
__name(SettingsShim, "SettingsShim");
class SocketHandler {
  static PROMPT_REST = "prompt-rest";
  static handlers = {
    [this.PROMPT_REST]: this._promptRest
  };
  static initialize() {
    game.socket.on("module.rest-recovery", (data, senderId) => {
      if (this.handlers[data.type]) {
        this.handlers[data.type](data.payload, senderId);
      }
    });
  }
  static emit(handler, data) {
    game.socket.emit("module.rest-recovery", {
      type: handler,
      payload: data
    });
    if (this.handlers[handler]) {
      this.handlers[handler](data, game.user.id);
    }
  }
  static async _promptRest(data, senderId) {
    const sender = game.users.get(senderId);
    const actorsToRest = [];
    const offlineResters = [];
    const isLongRest = data.restType === "longRest";
    for (const userActorPair of data.userActors) {
      const [userId, actorId] = userActorPair.split("-");
      const user = game.users.get(userId);
      const actor = game.actors.get(actorId);
      if (!actor)
        continue;
      const preventRest = getProperty(actor, CONSTANTS.FLAGS.DAE.PREVENT + data.restType);
      if (preventRest) {
        if (sender === game.user) {
          await ChatMessage.create({
            content: `<p>${localize("REST-RECOVERY.Chat.CouldNot" + (isLongRest ? "LongRest" : "ShortRest"), { actorName: actor.name })}</p>`,
            speaker: {
              alias: actor.name
            }
          });
        }
      } else if (user === game.user) {
        actorsToRest.push(actor);
      } else if (actor && !user.active && sender === game.user) {
        offlineResters.push(actor);
      }
    }
    const width = 425;
    const midPoint = window.innerWidth / actorsToRest.length;
    const indexOffset = actorsToRest.length > 1 ? actorsToRest.length / 2 * -1 : 0;
    actorsToRest.forEach((actor, index) => {
      actor[data.restType](
        {
          newDay: data.newDay,
          promptNewDay: data.promptNewDay,
          restPrompted: true
        },
        indexOffset ? { left: midPoint + (indexOffset + index) * width } : {}
      );
    });
    if (!offlineResters.length)
      return;
    await wait(250);
    const doContinue = await TJSDialog.confirm({
      title: game.i18n.localize("REST-RECOVERY.Dialogs.CharacterOwnersOffline.Title"),
      content: {
        class: Dialog,
        props: {
          icon: "fas fa-exclamation-triangle",
          header: game.i18n.localize("REST-RECOVERY.Dialogs.CharacterOwnersOffline.Title"),
          content: game.i18n.localize("REST-RECOVERY.Dialogs.CharacterOwnersOffline.Content"),
          extraContent: offlineResters.map((actor) => actor.name).join(", ")
        }
      },
      modal: true,
      draggable: false,
      options: {
        height: "auto",
        headerButtonNoClose: true
      }
    });
    if (!doContinue) {
      return false;
    }
    const offlineMidPoint = window.innerWidth / 2;
    const offlineIndexOffset = offlineResters.length > 1 ? offlineResters.length / 2 * -1 : 0;
    offlineResters.forEach((actor, index) => {
      actor[data.restType]({}, offlineIndexOffset ? { left: offlineMidPoint + (offlineIndexOffset + index) * width } : {});
    });
  }
}
__name(SocketHandler, "SocketHandler");
const promptRestShell_svelte_svelte_type_style_lang = "";
function get_each_context$1(ctx, list, i) {
  const child_ctx = ctx.slice();
  child_ctx[35] = list[i];
  return child_ctx;
}
__name(get_each_context$1, "get_each_context$1");
function get_each_context_1(ctx, list, i) {
  const child_ctx = ctx.slice();
  child_ctx[38] = list[i];
  child_ctx[39] = list;
  child_ctx[40] = i;
  return child_ctx;
}
__name(get_each_context_1, "get_each_context_1");
function get_each_context_2(ctx, list, i) {
  const child_ctx = ctx.slice();
  child_ctx[41] = list[i][0];
  child_ctx[42] = list[i][1];
  return child_ctx;
}
__name(get_each_context_2, "get_each_context_2");
function create_each_block_2(key_1, ctx) {
  let option;
  let t_value = ctx[42] + "";
  let t;
  let option_value_value;
  return {
    key: key_1,
    first: null,
    c() {
      option = element("option");
      t = text(t_value);
      option.__value = option_value_value = ctx[41];
      option.value = option.__value;
      this.first = option;
    },
    m(target, anchor) {
      insert(target, option, anchor);
      append(option, t);
    },
    p(new_ctx, dirty) {
      ctx = new_ctx;
      if (dirty[0] & 68 && t_value !== (t_value = ctx[42] + ""))
        set_data(t, t_value);
      if (dirty[0] & 196 && option_value_value !== (option_value_value = ctx[41])) {
        option.__value = option_value_value;
        option.value = option.__value;
      }
    },
    d(detaching) {
      if (detaching)
        detach(option);
    }
  };
}
__name(create_each_block_2, "create_each_block_2");
function create_each_block_1(ctx) {
  let select;
  let each_blocks = [];
  let each_1_lookup = /* @__PURE__ */ new Map();
  let t;
  let div;
  let i;
  let mounted;
  let dispose;
  function func2(...args) {
    return ctx[20](ctx[38], ...args);
  }
  __name(func2, "func");
  let each_value_2 = ctx[7].filter(func2);
  const get_key = /* @__PURE__ */ __name((ctx2) => ctx2[41], "get_key");
  for (let i2 = 0; i2 < each_value_2.length; i2 += 1) {
    let child_ctx = get_each_context_2(ctx, each_value_2, i2);
    let key = get_key(child_ctx);
    each_1_lookup.set(key, each_blocks[i2] = create_each_block_2(key, child_ctx));
  }
  function select_change_handler() {
    ctx[21].call(select, ctx[39], ctx[40]);
  }
  __name(select_change_handler, "select_change_handler");
  function click_handler_1() {
    return ctx[23](ctx[40]);
  }
  __name(click_handler_1, "click_handler_1");
  return {
    c() {
      select = element("select");
      for (let i2 = 0; i2 < each_blocks.length; i2 += 1) {
        each_blocks[i2].c();
      }
      t = space();
      div = element("div");
      i = element("i");
      attr(select, "class", "svelte-1ut5zun");
      if (ctx[38] === void 0)
        add_render_callback(select_change_handler);
      attr(i, "class", "fas fa-times rest-recovery-clickable-link-red svelte-1ut5zun");
      set_style(div, "text-align", "center");
    },
    m(target, anchor) {
      insert(target, select, anchor);
      for (let i2 = 0; i2 < each_blocks.length; i2 += 1) {
        each_blocks[i2].m(select, null);
      }
      select_option(select, ctx[38]);
      insert(target, t, anchor);
      insert(target, div, anchor);
      append(div, i);
      if (!mounted) {
        dispose = [
          listen(select, "change", select_change_handler),
          listen(select, "change", ctx[22]),
          listen(i, "click", click_handler_1)
        ];
        mounted = true;
      }
    },
    p(new_ctx, dirty) {
      ctx = new_ctx;
      if (dirty[0] & 196) {
        each_value_2 = ctx[7].filter(func2);
        each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value_2, each_1_lookup, select, destroy_block, create_each_block_2, null, get_each_context_2);
      }
      if (dirty[0] & 196) {
        select_option(select, ctx[38]);
      }
    },
    d(detaching) {
      if (detaching)
        detach(select);
      for (let i2 = 0; i2 < each_blocks.length; i2 += 1) {
        each_blocks[i2].d();
      }
      if (detaching)
        detach(t);
      if (detaching)
        detach(div);
      mounted = false;
      run_all(dispose);
    }
  };
}
__name(create_each_block_1, "create_each_block_1");
function create_each_block$1(ctx) {
  let option;
  let t_value = ctx[35] + "";
  let t;
  return {
    c() {
      option = element("option");
      t = text(t_value);
      option.__value = ctx[35];
      option.value = option.__value;
    },
    m(target, anchor) {
      insert(target, option, anchor);
      append(option, t);
    },
    p: noop,
    d(detaching) {
      if (detaching)
        detach(option);
    }
  };
}
__name(create_each_block$1, "create_each_block$1");
function create_else_block_1(ctx) {
  let div0;
  let span;
  let raw0_value = localize(`REST-RECOVERY.Dialogs.PromptRest.${!ctx[10] && !ctx[11] ? "No" : ""}NewDayTitle`) + "";
  let t0;
  let p;
  let raw1_value = localize(`REST-RECOVERY.Dialogs.PromptRest.${!ctx[10] && !ctx[11] ? "No" : ""}NewDaySimpleCalendarHint`) + "";
  let t1;
  let div1;
  return {
    c() {
      div0 = element("div");
      span = element("span");
      t0 = space();
      p = element("p");
      t1 = space();
      div1 = element("div");
      set_style(span, "font-size", "1rem");
      set_style(p, "font-size", "0.75rem");
      set_style(p, "color", "#4b4a44");
      set_style(div0, "margin-top", "0.25rem");
      set_style(div0, "grid-column", ctx[9] ? "1 / 3" : "1");
    },
    m(target, anchor) {
      insert(target, div0, anchor);
      append(div0, span);
      span.innerHTML = raw0_value;
      append(div0, t0);
      append(div0, p);
      p.innerHTML = raw1_value;
      insert(target, t1, anchor);
      insert(target, div1, anchor);
    },
    p: noop,
    d(detaching) {
      if (detaching)
        detach(div0);
      if (detaching)
        detach(t1);
      if (detaching)
        detach(div1);
    }
  };
}
__name(create_else_block_1, "create_else_block_1");
function create_if_block_2(ctx) {
  let div;
  let span;
  let t1;
  let p;
  let t3;
  let if_block_anchor;
  function select_block_type_1(ctx2, dirty) {
    if (!ctx2[9])
      return create_if_block_3;
    return create_else_block;
  }
  __name(select_block_type_1, "select_block_type_1");
  let current_block_type = select_block_type_1(ctx);
  let if_block = current_block_type(ctx);
  return {
    c() {
      div = element("div");
      span = element("span");
      span.textContent = `${localize("REST-RECOVERY.Dialogs.PromptRest.NewDayTitle")}`;
      t1 = space();
      p = element("p");
      p.textContent = `${localize("REST-RECOVERY.Dialogs.PromptRest.NewDayHint")}`;
      t3 = space();
      if_block.c();
      if_block_anchor = empty();
      set_style(span, "font-size", "1rem");
      set_style(p, "font-size", "0.75rem");
      set_style(p, "color", "#4b4a44");
      set_style(div, "margin-top", "0.25rem");
      set_style(div, "grid-column", ctx[9] ? "1 / 3" : "1");
    },
    m(target, anchor) {
      insert(target, div, anchor);
      append(div, span);
      append(div, t1);
      append(div, p);
      insert(target, t3, anchor);
      if_block.m(target, anchor);
      insert(target, if_block_anchor, anchor);
    },
    p(ctx2, dirty) {
      if_block.p(ctx2, dirty);
    },
    d(detaching) {
      if (detaching)
        detach(div);
      if (detaching)
        detach(t3);
      if_block.d(detaching);
      if (detaching)
        detach(if_block_anchor);
    }
  };
}
__name(create_if_block_2, "create_if_block_2");
function create_else_block(ctx) {
  let div;
  return {
    c() {
      div = element("div");
    },
    m(target, anchor) {
      insert(target, div, anchor);
    },
    p: noop,
    d(detaching) {
      if (detaching)
        detach(div);
    }
  };
}
__name(create_else_block, "create_else_block");
function create_if_block_3(ctx) {
  let input;
  let mounted;
  let dispose;
  return {
    c() {
      input = element("input");
      attr(input, "type", "checkbox");
    },
    m(target, anchor) {
      insert(target, input, anchor);
      input.checked = ctx[3];
      if (!mounted) {
        dispose = listen(input, "change", ctx[27]);
        mounted = true;
      }
    },
    p(ctx2, dirty) {
      if (dirty[0] & 8) {
        input.checked = ctx2[3];
      }
    },
    d(detaching) {
      if (detaching)
        detach(input);
      mounted = false;
      dispose();
    }
  };
}
__name(create_if_block_3, "create_if_block_3");
function create_if_block_1(ctx) {
  let t_value = localize("REST-RECOVERY.Dialogs.PromptRest.NewDay") + "";
  let t;
  return {
    c() {
      t = text(t_value);
    },
    m(target, anchor) {
      insert(target, t, anchor);
    },
    p: noop,
    d(detaching) {
      if (detaching)
        detach(t);
    }
  };
}
__name(create_if_block_1, "create_if_block_1");
function create_if_block(ctx) {
  let t_value = localize("REST-RECOVERY.Dialogs.PromptRest.NewDay") + "";
  let t;
  return {
    c() {
      t = text(t_value);
    },
    m(target, anchor) {
      insert(target, t, anchor);
    },
    p: noop,
    d(detaching) {
      if (detaching)
        detach(t);
    }
  };
}
__name(create_if_block, "create_if_block");
function create_default_slot$1(ctx) {
  let form_1;
  let div5;
  let div0;
  let t1;
  let div1;
  let i0;
  let t2;
  let t3;
  let div2;
  let t5;
  let div3;
  let t6;
  let select;
  let t7;
  let div4;
  let i1;
  let t8;
  let i2;
  let t9;
  let t10;
  let footer;
  let button0;
  let i3;
  let t11;
  let t12_value = localize("REST-RECOVERY.Dialogs.PromptRest.Long") + "";
  let t12;
  let t13;
  let t14;
  let button1;
  let i4;
  let t15;
  let t16_value = localize("REST-RECOVERY.Dialogs.PromptRest.Short") + "";
  let t16;
  let t17;
  let mounted;
  let dispose;
  let each_value_1 = ctx[6];
  let each_blocks_1 = [];
  for (let i = 0; i < each_value_1.length; i += 1) {
    each_blocks_1[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
  }
  let each_value = ctx[12];
  let each_blocks = [];
  for (let i = 0; i < each_value.length; i += 1) {
    each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
  }
  function select_block_type(ctx2, dirty) {
    if (!ctx2[9])
      return create_if_block_2;
    return create_else_block_1;
  }
  __name(select_block_type, "select_block_type");
  let current_block_type = select_block_type(ctx);
  let if_block0 = current_block_type(ctx);
  let if_block1 = ctx[9] && ctx[10] && create_if_block_1();
  let if_block2 = ctx[9] && ctx[11] && create_if_block();
  return {
    c() {
      form_1 = element("form");
      div5 = element("div");
      div0 = element("div");
      div0.textContent = "Player characters to prompt rests for";
      t1 = space();
      div1 = element("div");
      i0 = element("i");
      t2 = space();
      for (let i = 0; i < each_blocks_1.length; i += 1) {
        each_blocks_1[i].c();
      }
      t3 = space();
      div2 = element("div");
      div2.textContent = "Rest Profile";
      t5 = space();
      div3 = element("div");
      t6 = space();
      select = element("select");
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].c();
      }
      t7 = space();
      div4 = element("div");
      i1 = element("i");
      t8 = space();
      i2 = element("i");
      t9 = space();
      if_block0.c();
      t10 = space();
      footer = element("footer");
      button0 = element("button");
      i3 = element("i");
      t11 = space();
      t12 = text(t12_value);
      t13 = space();
      if (if_block1)
        if_block1.c();
      t14 = space();
      button1 = element("button");
      i4 = element("i");
      t15 = space();
      t16 = text(t16_value);
      t17 = space();
      if (if_block2)
        if_block2.c();
      set_style(div0, "font-size", "1rem");
      set_style(div0, "margin-bottom", "0.25rem");
      attr(i0, "class", "fas fa-plus rest-recovery-clickable-link svelte-1ut5zun");
      set_style(i0, "font-size", "1rem");
      set_style(div1, "text-align", "center");
      set_style(div2, "font-size", "1rem");
      set_style(div2, "margin-top", "0.25rem");
      set_style(div2, "margin-bottom", "0.25rem");
      attr(select, "class", "svelte-1ut5zun");
      if (ctx[4] === void 0)
        add_render_callback(() => ctx[24].call(select));
      attr(i1, "class", "fas fa-info-circle svelte-1ut5zun");
      set_style(i1, "margin-right", "0.25rem");
      toggle_class(i1, "rest-recovery-clickable-link", ctx[4] !== "Default");
      toggle_class(i1, "rest-recovery-disabled", ctx[4] === "Default");
      attr(i2, "class", "fas fa-cog rest-recovery-clickable-link svelte-1ut5zun");
      set_style(div4, "text-align", "center");
      attr(div5, "class", "rest-recovery-grid-table svelte-1ut5zun");
      attr(i3, "class", "fas fa-bed");
      attr(button0, "type", "button");
      attr(button0, "class", "dialog-button");
      attr(i4, "class", "fa-solid fa-hourglass-half");
      attr(button1, "type", "button");
      attr(button1, "class", "dialog-button");
      attr(footer, "class", "flexrow");
      set_style(footer, "margin-top", "0.25rem");
      attr(form_1, "autocomplete", "off");
      attr(form_1, "class", "dialog-content");
    },
    m(target, anchor) {
      insert(target, form_1, anchor);
      append(form_1, div5);
      append(div5, div0);
      append(div5, t1);
      append(div5, div1);
      append(div1, i0);
      append(div5, t2);
      for (let i = 0; i < each_blocks_1.length; i += 1) {
        each_blocks_1[i].m(div5, null);
      }
      append(div5, t3);
      append(div5, div2);
      append(div5, t5);
      append(div5, div3);
      append(div5, t6);
      append(div5, select);
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].m(select, null);
      }
      select_option(select, ctx[4]);
      append(div5, t7);
      append(div5, div4);
      append(div4, i1);
      append(div4, t8);
      append(div4, i2);
      append(div5, t9);
      if_block0.m(div5, null);
      append(form_1, t10);
      append(form_1, footer);
      append(footer, button0);
      append(button0, i3);
      append(button0, t11);
      append(button0, t12);
      append(button0, t13);
      if (if_block1)
        if_block1.m(button0, null);
      append(footer, t14);
      append(footer, button1);
      append(button1, i4);
      append(button1, t15);
      append(button1, t16);
      append(button1, t17);
      if (if_block2)
        if_block2.m(button1, null);
      ctx[30](form_1);
      if (!mounted) {
        dispose = [
          listen(i0, "click", ctx[19]),
          listen(select, "change", ctx[24]),
          listen(i1, "click", ctx[25]),
          listen(i2, "click", ctx[26]),
          listen(button0, "click", ctx[28]),
          listen(button1, "click", ctx[29]),
          listen(form_1, "submit", prevent_default(ctx[17]))
        ];
        mounted = true;
      }
    },
    p(ctx2, dirty) {
      if (dirty[0] & 41156) {
        each_value_1 = ctx2[6];
        let i;
        for (i = 0; i < each_value_1.length; i += 1) {
          const child_ctx = get_each_context_1(ctx2, each_value_1, i);
          if (each_blocks_1[i]) {
            each_blocks_1[i].p(child_ctx, dirty);
          } else {
            each_blocks_1[i] = create_each_block_1(child_ctx);
            each_blocks_1[i].c();
            each_blocks_1[i].m(div5, t3);
          }
        }
        for (; i < each_blocks_1.length; i += 1) {
          each_blocks_1[i].d(1);
        }
        each_blocks_1.length = each_value_1.length;
      }
      if (dirty[0] & 4096) {
        each_value = ctx2[12];
        let i;
        for (i = 0; i < each_value.length; i += 1) {
          const child_ctx = get_each_context$1(ctx2, each_value, i);
          if (each_blocks[i]) {
            each_blocks[i].p(child_ctx, dirty);
          } else {
            each_blocks[i] = create_each_block$1(child_ctx);
            each_blocks[i].c();
            each_blocks[i].m(select, null);
          }
        }
        for (; i < each_blocks.length; i += 1) {
          each_blocks[i].d(1);
        }
        each_blocks.length = each_value.length;
      }
      if (dirty[0] & 4112) {
        select_option(select, ctx2[4]);
      }
      if (dirty[0] & 16) {
        toggle_class(i1, "rest-recovery-clickable-link", ctx2[4] !== "Default");
      }
      if (dirty[0] & 16) {
        toggle_class(i1, "rest-recovery-disabled", ctx2[4] === "Default");
      }
      if_block0.p(ctx2, dirty);
      if (ctx2[9] && ctx2[10])
        if_block1.p(ctx2, dirty);
      if (ctx2[9] && ctx2[11])
        if_block2.p(ctx2, dirty);
    },
    d(detaching) {
      if (detaching)
        detach(form_1);
      destroy_each(each_blocks_1, detaching);
      destroy_each(each_blocks, detaching);
      if_block0.d();
      if (if_block1)
        if_block1.d();
      if (if_block2)
        if_block2.d();
      ctx[30](null);
      mounted = false;
      run_all(dispose);
    }
  };
}
__name(create_default_slot$1, "create_default_slot$1");
function create_fragment$1(ctx) {
  let applicationshell;
  let updating_elementRoot;
  let current;
  function applicationshell_elementRoot_binding(value) {
    ctx[31](value);
  }
  __name(applicationshell_elementRoot_binding, "applicationshell_elementRoot_binding");
  let applicationshell_props = {
    $$slots: { default: [create_default_slot$1] },
    $$scope: { ctx }
  };
  if (ctx[0] !== void 0) {
    applicationshell_props.elementRoot = ctx[0];
  }
  applicationshell = new ApplicationShell({ props: applicationshell_props });
  binding_callbacks.push(() => bind(applicationshell, "elementRoot", applicationshell_elementRoot_binding, ctx[0]));
  return {
    c() {
      create_component(applicationshell.$$.fragment);
    },
    m(target, anchor) {
      mount_component(applicationshell, target, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      const applicationshell_changes = {};
      if (dirty[0] & 126 | dirty[1] & 16384) {
        applicationshell_changes.$$scope = { dirty, ctx: ctx2 };
      }
      if (!updating_elementRoot && dirty[0] & 1) {
        updating_elementRoot = true;
        applicationshell_changes.elementRoot = ctx2[0];
        add_flush_callback(() => updating_elementRoot = false);
      }
      applicationshell.$set(applicationshell_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(applicationshell.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(applicationshell.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(applicationshell, detaching);
    }
  };
}
__name(create_fragment$1, "create_fragment$1");
function instance$1($$self, $$props, $$invalidate) {
  let $cleanConfig;
  const { application } = getContext("external");
  let { elementRoot } = $$props;
  let form;
  const validActors = Array.from(game.actors).reduce(
    (acc, actor) => {
      for (const [userId, permissions] of Object.entries(actor.ownership)) {
        if (userId === "default")
          continue;
        const user = game.users.get(userId);
        if (!user)
          continue;
        const combinedID = user.id + "-" + actor.id;
        if (user.isGM || permissions < 3)
          continue;
        acc.push([combinedID, `${actor.name} (${user.name})`]);
      }
      return acc;
    },
    []
  );
  let configuration = /* @__PURE__ */ new Set();
  let validRemainingIds = [];
  let forceNewDay = false;
  const cleanConfig = writable([]);
  component_subscribe($$self, cleanConfig, (value) => $$invalidate(6, $cleanConfig = value));
  game.settings.get("dnd5e", "restVariant");
  const simpleCalendarActive = getSetting(CONSTANTS.SETTINGS.ENABLE_SIMPLE_CALENDAR_INTEGRATION);
  const longRestWouldBeNewDay = getTimeChanges(true).isNewDay;
  const shortRestWouldBeNewDay = getTimeChanges(false).isNewDay;
  const profiles = game.restrecovery.getAllProfiles();
  let activeProfile = game.restrecovery.getActiveProfile();
  let restType = "longRest";
  cleanConfig.subscribe((values) => {
    $$invalidate(2, configuration = new Set(values));
    validRemainingIds = validActors.filter((entry) => {
      return !configuration.has(entry[0]);
    }).map((entry) => entry[0]);
  });
  cleanConfig.update(() => {
    return Array.from(getSetting(CONSTANTS.SETTINGS.PROMPT_REST_CONFIG)).filter((entry) => {
      return game.users.get(entry.split("-")[0]) && game.actors.get(entry.split("-")[1]);
    });
  });
  function updateRestConfig() {
    setSetting(CONSTANTS.SETTINGS.PROMPT_REST_CONFIG, [...configuration]);
  }
  __name(updateRestConfig, "updateRestConfig");
  function addPlayer() {
    if (!validRemainingIds.length)
      return;
    cleanConfig.update((values) => {
      values.push(validRemainingIds[0]);
      return values;
    });
    updateRestConfig();
  }
  __name(addPlayer, "addPlayer");
  function removePlayer(index) {
    cleanConfig.update((values) => {
      values.splice(index, 1);
      return values;
    });
    updateRestConfig();
  }
  __name(removePlayer, "removePlayer");
  async function requestSubmit() {
    form.requestSubmit();
  }
  __name(requestSubmit, "requestSubmit");
  async function submitPrompt() {
    await game.restrecovery.setActiveProfile(activeProfile);
    await setSetting(CONSTANTS.SETTINGS.PROMPT_REST_CONFIG, [...configuration]);
    const timeChanges = getTimeChanges(restType === "longRest");
    if (getSetting(CONSTANTS.SETTINGS.ENABLE_PROMPT_REST_TIME_PASSING)) {
      await game.time.advance(timeChanges.restTime);
    }
    if (configuration.size) {
      SocketHandler.emit(SocketHandler.PROMPT_REST, {
        userActors: [...configuration],
        restType,
        newDay: forceNewDay,
        promptNewDay: false
      });
    }
    application.options.resolve();
    application.close();
  }
  __name(submitPrompt, "submitPrompt");
  function showCustomRulesDialog() {
    TJSDialog.prompt({
      title: localize("REST-RECOVERY.Dialogs.LongRestSettingsDialog.Title"),
      content: {
        class: CustomSettingsDialog,
        props: {
          settings: game.restrecovery.getProfileData(activeProfile)
        }
      },
      label: "Okay",
      modal: true,
      draggable: false,
      options: {
        height: "auto",
        width: "350",
        headerButtonNoClose: true
      }
    });
  }
  __name(showCustomRulesDialog, "showCustomRulesDialog");
  const click_handler = /* @__PURE__ */ __name(() => {
    addPlayer();
  }, "click_handler");
  const func2 = /* @__PURE__ */ __name((comboId, actorEntry) => {
    return !configuration.has(actorEntry[0]) || actorEntry[0] === comboId;
  }, "func");
  function select_change_handler(each_value_1, index) {
    each_value_1[index] = select_value(this);
    cleanConfig.set($cleanConfig);
    $$invalidate(7, validActors);
    $$invalidate(2, configuration);
  }
  __name(select_change_handler, "select_change_handler");
  const change_handler = /* @__PURE__ */ __name(() => {
    updateRestConfig();
  }, "change_handler");
  const click_handler_1 = /* @__PURE__ */ __name((index) => {
    removePlayer(index);
  }, "click_handler_1");
  function select_change_handler_1() {
    activeProfile = select_value(this);
    $$invalidate(4, activeProfile);
    $$invalidate(12, profiles);
  }
  __name(select_change_handler_1, "select_change_handler_1");
  const click_handler_2 = /* @__PURE__ */ __name(() => {
    if (activeProfile === "Default")
      return;
    showCustomRulesDialog();
  }, "click_handler_2");
  const click_handler_3 = /* @__PURE__ */ __name(() => {
    new SettingsShim().render(true);
  }, "click_handler_3");
  function input_change_handler() {
    forceNewDay = this.checked;
    $$invalidate(3, forceNewDay);
  }
  __name(input_change_handler, "input_change_handler");
  const click_handler_4 = /* @__PURE__ */ __name((e) => {
    $$invalidate(5, restType = "longRest");
    requestSubmit();
  }, "click_handler_4");
  const click_handler_5 = /* @__PURE__ */ __name((e) => {
    $$invalidate(5, restType = "shortRest");
    requestSubmit();
  }, "click_handler_5");
  function form_1_binding($$value) {
    binding_callbacks[$$value ? "unshift" : "push"](() => {
      form = $$value;
      $$invalidate(1, form);
    });
  }
  __name(form_1_binding, "form_1_binding");
  function applicationshell_elementRoot_binding(value) {
    elementRoot = value;
    $$invalidate(0, elementRoot);
  }
  __name(applicationshell_elementRoot_binding, "applicationshell_elementRoot_binding");
  $$self.$$set = ($$props2) => {
    if ("elementRoot" in $$props2)
      $$invalidate(0, elementRoot = $$props2.elementRoot);
  };
  return [
    elementRoot,
    form,
    configuration,
    forceNewDay,
    activeProfile,
    restType,
    $cleanConfig,
    validActors,
    cleanConfig,
    simpleCalendarActive,
    longRestWouldBeNewDay,
    shortRestWouldBeNewDay,
    profiles,
    updateRestConfig,
    addPlayer,
    removePlayer,
    requestSubmit,
    submitPrompt,
    showCustomRulesDialog,
    click_handler,
    func2,
    select_change_handler,
    change_handler,
    click_handler_1,
    select_change_handler_1,
    click_handler_2,
    click_handler_3,
    input_change_handler,
    click_handler_4,
    click_handler_5,
    form_1_binding,
    applicationshell_elementRoot_binding
  ];
}
__name(instance$1, "instance$1");
class Prompt_rest_shell extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$1, create_fragment$1, safe_not_equal, { elementRoot: 0 }, null, [-1, -1]);
  }
  get elementRoot() {
    return this.$$.ctx[0];
  }
  set elementRoot(elementRoot) {
    this.$$set({ elementRoot });
    flush();
  }
}
__name(Prompt_rest_shell, "Prompt_rest_shell");
class PromptRestDialog extends SvelteApplication {
  constructor(options = {}, dialogData = {}) {
    super({
      close: () => this.options.reject(),
      ...options
    }, dialogData);
  }
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      title: game.i18n.localize("REST-RECOVERY.Dialogs.PromptRest.Title"),
      zIndex: 102,
      svelte: {
        class: Prompt_rest_shell,
        target: document.body
      },
      closeOnSubmit: false,
      id: "rest-request-app",
      width: 350,
      height: "auto",
      classes: ["dnd5e dialog rest-recovery-request-app"],
      resizable: true
    });
  }
  static getActiveApp() {
    return Object.values(ui.windows).find((app) => app.id === "rest-request-app");
  }
  static async show(options = {}, dialogData = {}) {
    const app = this.getActiveApp();
    if (app)
      return app.render(false, { focus: true });
    return new Promise((resolve) => {
      options.resolve = resolve;
      new this(options, dialogData).render(true, { focus: true });
    });
  }
}
__name(PromptRestDialog, "PromptRestDialog");
function registerHooks() {
  Hooks.on("renderPlayerList", (app, html) => {
    if (!game.user.isGM || !getSetting(CONSTANTS.SETTINGS.SHOW_PLAYER_LIST_REST_BUTTON))
      return;
    const minimalUI = game.modules.get("minimal-ui")?.active;
    const itemPiles = game.modules.get("item-piles")?.active;
    const classes = "rest-recovery-prompt-rest-button" + (minimalUI ? " minimal-ui-button" : "");
    let parent = html;
    const tradeButton = html.find(".item-piles-player-list-trade-button");
    if (itemPiles && tradeButton.length && !minimalUI) {
      tradeButton.html(`<i class="fas fa-handshake"></i> Trade`);
      tradeButton.addClass(classes);
      parent = $(`<div class="rest-recovery-button-parent"></div>`);
      parent.append(tradeButton);
      html.append(parent);
    }
    const text2 = !minimalUI ? itemPiles && tradeButton.length ? "Rest" : "Prompt Rest" : "";
    const button = $(`<button type="button" class="${classes}"><i class="fas fa-bed"></i>${text2}</button>`);
    button.click(() => {
      PromptRestDialog.show();
    });
    parent.append(button);
  });
}
__name(registerHooks, "registerHooks");
let oldSettings;
async function migrate() {
  oldSettings = game.settings.storage.get("world").filter((setting) => setting.key.includes("rest-recovery"));
  const sortedMigrations = Object.entries(migrations).sort((a, b) => {
    return isNewerVersion(b[0], a[0]) ? -1 : 1;
  });
  for (const [version, migration] of sortedMigrations) {
    const migrationVersion = getSetting(CONSTANTS.SETTINGS.MIGRATION_VERSION);
    if (!isNewerVersion(version, migrationVersion))
      continue;
    await migration();
  }
  const moduleVersion = game.modules.get(CONSTANTS.MODULE_NAME).version;
  await setSetting(CONSTANTS.SETTINGS.MIGRATION_VERSION, moduleVersion);
}
__name(migrate, "migrate");
function findOldSettingValue(oldSettingKey) {
  return oldSettings.find((setting) => setting.key.endsWith(oldSettingKey))?.value;
}
__name(findOldSettingValue, "findOldSettingValue");
const migrations = {
  "1.3.3": async () => {
    if (findOldSettingValue("recovery-hitpoints-formula")) {
      await setSetting(CONSTANTS.SETTINGS.HP_MULTIPLIER_FORMULA, findOldSettingValue("recovery-hitpoints-formula"));
      await setSetting(CONSTANTS.SETTINGS.HD_MULTIPLIER_FORMULA, findOldSettingValue("recovery-hitdice-formula"));
      await setSetting(CONSTANTS.SETTINGS.LONG_RESOURCES_MULTIPLIER_FORMULA, findOldSettingValue("recovery-resources-formula"));
      await setSetting(CONSTANTS.SETTINGS.LONG_SPELLS_MULTIPLIER_FORMULA, findOldSettingValue("recovery-spells-formula"));
      await setSetting(CONSTANTS.SETTINGS.LONG_USES_OTHERS_MULTIPLIER_FORMULA, findOldSettingValue("recovery-uses-others-formula"));
      await setSetting(CONSTANTS.SETTINGS.LONG_USES_FEATS_MULTIPLIER_FORMULA, findOldSettingValue("recovery-uses-feats-formula"));
      await setSetting(CONSTANTS.SETTINGS.LONG_USES_DAILY_MULTIPLIER_FORMULA, findOldSettingValue("recovery-day-formula"));
    }
  },
  "1.4.4": async () => {
    if (game.modules.get("simple-calendar")?.active) {
      await setSetting(CONSTANTS.SETTINGS.ENABLE_SIMPLE_CALENDAR_INTEGRATION, true);
    }
  }
};
const resourceConfigShell_svelte_svelte_type_style_lang = "";
function get_each_context(ctx, list, i) {
  const child_ctx = ctx.slice();
  child_ctx[16] = list[i];
  child_ctx[17] = list;
  child_ctx[18] = i;
  return child_ctx;
}
__name(get_each_context, "get_each_context");
function create_each_block(key_1, ctx) {
  let tr;
  let td0;
  let input0;
  let input0_placeholder_value;
  let t0;
  let td1;
  let div;
  let input1;
  let t1;
  let span;
  let t3;
  let input2;
  let t4;
  let td2;
  let input3;
  let t5;
  let td3;
  let input4;
  let t6;
  let td4;
  let input5;
  let t7;
  let mounted;
  let dispose;
  function input0_input_handler() {
    ctx[6].call(input0, ctx[17], ctx[18]);
  }
  __name(input0_input_handler, "input0_input_handler");
  function input1_input_handler() {
    ctx[7].call(input1, ctx[17], ctx[18]);
  }
  __name(input1_input_handler, "input1_input_handler");
  function input2_input_handler() {
    ctx[8].call(input2, ctx[17], ctx[18]);
  }
  __name(input2_input_handler, "input2_input_handler");
  function input3_change_handler() {
    ctx[9].call(input3, ctx[17], ctx[18]);
  }
  __name(input3_change_handler, "input3_change_handler");
  function input4_change_handler() {
    ctx[10].call(input4, ctx[17], ctx[18]);
  }
  __name(input4_change_handler, "input4_change_handler");
  function input5_input_handler() {
    ctx[11].call(input5, ctx[17], ctx[18]);
  }
  __name(input5_input_handler, "input5_input_handler");
  return {
    key: key_1,
    first: null,
    c() {
      tr = element("tr");
      td0 = element("td");
      input0 = element("input");
      t0 = space();
      td1 = element("td");
      div = element("div");
      input1 = element("input");
      t1 = space();
      span = element("span");
      span.textContent = "/";
      t3 = space();
      input2 = element("input");
      t4 = space();
      td2 = element("td");
      input3 = element("input");
      t5 = space();
      td3 = element("td");
      input4 = element("input");
      t6 = space();
      td4 = element("td");
      input5 = element("input");
      t7 = space();
      attr(input0, "type", "text");
      attr(input0, "placeholder", input0_placeholder_value = "Resource " + (ctx[18] + 1));
      attr(input1, "type", "number");
      set_style(input1, "text-align", "right");
      attr(span, "class", "sep svelte-zyuci1");
      attr(input2, "type", "number");
      attr(div, "class", "flexrow");
      attr(input3, "type", "checkbox");
      attr(td2, "class", "text-center svelte-zyuci1");
      attr(input4, "type", "checkbox");
      attr(td3, "class", "text-center svelte-zyuci1");
      attr(input5, "type", "text");
      this.first = tr;
    },
    m(target, anchor) {
      insert(target, tr, anchor);
      append(tr, td0);
      append(td0, input0);
      set_input_value(input0, ctx[16].label);
      append(tr, t0);
      append(tr, td1);
      append(td1, div);
      append(div, input1);
      set_input_value(input1, ctx[16].value);
      append(div, t1);
      append(div, span);
      append(div, t3);
      append(div, input2);
      set_input_value(input2, ctx[16].max);
      append(tr, t4);
      append(tr, td2);
      append(td2, input3);
      input3.checked = ctx[16].sr;
      append(tr, t5);
      append(tr, td3);
      append(td3, input4);
      input4.checked = ctx[16].lr;
      append(tr, t6);
      append(tr, td4);
      append(td4, input5);
      set_input_value(input5, ctx[16].formula);
      append(tr, t7);
      if (!mounted) {
        dispose = [
          listen(input0, "input", input0_input_handler),
          listen(input1, "input", input1_input_handler),
          listen(input2, "input", input2_input_handler),
          listen(input3, "change", input3_change_handler),
          listen(input4, "change", input4_change_handler),
          listen(input5, "input", input5_input_handler)
        ];
        mounted = true;
      }
    },
    p(new_ctx, dirty) {
      ctx = new_ctx;
      if (dirty & 4 && input0_placeholder_value !== (input0_placeholder_value = "Resource " + (ctx[18] + 1))) {
        attr(input0, "placeholder", input0_placeholder_value);
      }
      if (dirty & 4 && input0.value !== ctx[16].label) {
        set_input_value(input0, ctx[16].label);
      }
      if (dirty & 4 && to_number(input1.value) !== ctx[16].value) {
        set_input_value(input1, ctx[16].value);
      }
      if (dirty & 4 && to_number(input2.value) !== ctx[16].max) {
        set_input_value(input2, ctx[16].max);
      }
      if (dirty & 4) {
        input3.checked = ctx[16].sr;
      }
      if (dirty & 4) {
        input4.checked = ctx[16].lr;
      }
      if (dirty & 4 && input5.value !== ctx[16].formula) {
        set_input_value(input5, ctx[16].formula);
      }
    },
    d(detaching) {
      if (detaching)
        detach(tr);
      mounted = false;
      run_all(dispose);
    }
  };
}
__name(create_each_block, "create_each_block");
function create_default_slot(ctx) {
  let form_1;
  let div;
  let table;
  let tr;
  let th0;
  let t1;
  let th1;
  let t3;
  let th2;
  let t5;
  let th3;
  let t7;
  let th4;
  let t9;
  let each_blocks = [];
  let each_1_lookup = /* @__PURE__ */ new Map();
  let t10;
  let footer;
  let button;
  let i;
  let t11;
  let t12_value = localize("Submit") + "";
  let t12;
  let mounted;
  let dispose;
  let each_value = ctx[2];
  const get_key = /* @__PURE__ */ __name((ctx2) => ctx2[18], "get_key");
  for (let i2 = 0; i2 < each_value.length; i2 += 1) {
    let child_ctx = get_each_context(ctx, each_value, i2);
    let key = get_key(child_ctx);
    each_1_lookup.set(key, each_blocks[i2] = create_each_block(key, child_ctx));
  }
  return {
    c() {
      form_1 = element("form");
      div = element("div");
      table = element("table");
      tr = element("tr");
      th0 = element("th");
      th0.textContent = `${localize("REST-RECOVERY.Dialogs.Resources.Name")}`;
      t1 = space();
      th1 = element("th");
      th1.textContent = `${localize("REST-RECOVERY.Dialogs.Resources.Value")}`;
      t3 = space();
      th2 = element("th");
      th2.textContent = `${localize("REST-RECOVERY.Dialogs.Resources.Short")}`;
      t5 = space();
      th3 = element("th");
      th3.textContent = `${localize("REST-RECOVERY.Dialogs.Resources.Long")}`;
      t7 = space();
      th4 = element("th");
      th4.textContent = `${localize("REST-RECOVERY.Dialogs.Resources.RecoveryFormula")}`;
      t9 = space();
      for (let i2 = 0; i2 < each_blocks.length; i2 += 1) {
        each_blocks[i2].c();
      }
      t10 = space();
      footer = element("footer");
      button = element("button");
      i = element("i");
      t11 = space();
      t12 = text(t12_value);
      set_style(th0, "width", "auto");
      set_style(th1, "width", "20%");
      set_style(th2, "width", "auto");
      set_style(th3, "width", "auto");
      set_style(th4, "width", "auto");
      attr(div, "class", "container svelte-zyuci1");
      attr(i, "class", "fas fa-check");
      attr(button, "type", "button");
      attr(button, "class", "dialog-button");
      attr(footer, "class", "flexrow");
      set_style(footer, "margin-top", "0.5rem");
      attr(form_1, "autocomplete", "off");
    },
    m(target, anchor) {
      insert(target, form_1, anchor);
      append(form_1, div);
      append(div, table);
      append(table, tr);
      append(tr, th0);
      append(tr, t1);
      append(tr, th1);
      append(tr, t3);
      append(tr, th2);
      append(tr, t5);
      append(tr, th3);
      append(tr, t7);
      append(tr, th4);
      append(table, t9);
      for (let i2 = 0; i2 < each_blocks.length; i2 += 1) {
        each_blocks[i2].m(table, null);
      }
      append(form_1, t10);
      append(form_1, footer);
      append(footer, button);
      append(button, i);
      append(button, t11);
      append(button, t12);
      ctx[12](form_1);
      if (!mounted) {
        dispose = [
          listen(button, "click", ctx[3]),
          listen(form_1, "submit", prevent_default(ctx[4]))
        ];
        mounted = true;
      }
    },
    p(ctx2, dirty) {
      if (dirty & 4) {
        each_value = ctx2[2];
        each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx2, each_value, each_1_lookup, table, destroy_block, create_each_block, null, get_each_context);
      }
    },
    d(detaching) {
      if (detaching)
        detach(form_1);
      for (let i2 = 0; i2 < each_blocks.length; i2 += 1) {
        each_blocks[i2].d();
      }
      ctx[12](null);
      mounted = false;
      run_all(dispose);
    }
  };
}
__name(create_default_slot, "create_default_slot");
function create_fragment(ctx) {
  let applicationshell;
  let updating_elementRoot;
  let current;
  function applicationshell_elementRoot_binding(value) {
    ctx[13](value);
  }
  __name(applicationshell_elementRoot_binding, "applicationshell_elementRoot_binding");
  let applicationshell_props = {
    $$slots: { default: [create_default_slot] },
    $$scope: { ctx }
  };
  if (ctx[0] !== void 0) {
    applicationshell_props.elementRoot = ctx[0];
  }
  applicationshell = new ApplicationShell({ props: applicationshell_props });
  binding_callbacks.push(() => bind(applicationshell, "elementRoot", applicationshell_elementRoot_binding, ctx[0]));
  return {
    c() {
      create_component(applicationshell.$$.fragment);
    },
    m(target, anchor) {
      mount_component(applicationshell, target, anchor);
      current = true;
    },
    p(ctx2, [dirty]) {
      const applicationshell_changes = {};
      if (dirty & 524294) {
        applicationshell_changes.$$scope = { dirty, ctx: ctx2 };
      }
      if (!updating_elementRoot && dirty & 1) {
        updating_elementRoot = true;
        applicationshell_changes.elementRoot = ctx2[0];
        add_flush_callback(() => updating_elementRoot = false);
      }
      applicationshell.$set(applicationshell_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(applicationshell.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(applicationshell.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(applicationshell, detaching);
    }
  };
}
__name(create_fragment, "create_fragment");
function instance($$self, $$props, $$invalidate) {
  const { application } = getContext("external");
  let { elementRoot } = $$props;
  let { actor } = $$props;
  let form;
  const count = actor.system.resources["count"]?.value ?? 3;
  const resources = Object.entries(actor.system.resources).map((entry) => {
    let resource = entry[1];
    resource.path = `system.resources.${entry[0]}`;
    resource.flagPath = `flags.${CONSTANTS.MODULE_NAME}.${CONSTANTS.FLAG_NAME}.resources.${entry[0]}.formula`;
    resource.formula = getProperty(actor, `${resource.flagPath}`) ?? "";
    return resource;
  }).filter((resource, index) => resource.path !== "count" && index < count);
  function requestSubmit() {
    let valid = true;
    const actorData = actor.getRollData();
    for (let i = 0; i < resources.length; i++) {
      const resource = resources[i];
      if (!resource.formula)
        continue;
      try {
        const roll = evaluateFormula(resource.formula, actorData);
        if (!roll) {
          valid = false;
        }
      } catch (err) {
        const resourceName = resource.label ? `Resource "${resource.label}"` : "Resource " + (i + 1);
        ui.notifications.warn(`Rest Recovery for 5e: ${resourceName} has a problem with its formula, please fix this.`);
        valid = false;
      }
    }
    if (!valid)
      return false;
    form.requestSubmit();
  }
  __name(requestSubmit, "requestSubmit");
  async function updateSettings() {
    const flagUpdates = Object.fromEntries(resources.map((resource) => {
      return [resource.flagPath, resource.formula];
    }));
    const resourceUpdates = Object.fromEntries(resources.map((resource) => {
      return [
        resource.path,
        {
          label: resource.label,
          value: Number(resource.value),
          max: Number(resource.max),
          sr: resource.sr,
          lr: resource.lr
        }
      ];
    }));
    await actor.update({ ...flagUpdates, ...resourceUpdates });
    application.options.resolve();
    application.close();
  }
  __name(updateSettings, "updateSettings");
  function input0_input_handler(each_value, index) {
    each_value[index].label = this.value;
    $$invalidate(2, resources);
  }
  __name(input0_input_handler, "input0_input_handler");
  function input1_input_handler(each_value, index) {
    each_value[index].value = to_number(this.value);
    $$invalidate(2, resources);
  }
  __name(input1_input_handler, "input1_input_handler");
  function input2_input_handler(each_value, index) {
    each_value[index].max = to_number(this.value);
    $$invalidate(2, resources);
  }
  __name(input2_input_handler, "input2_input_handler");
  function input3_change_handler(each_value, index) {
    each_value[index].sr = this.checked;
    $$invalidate(2, resources);
  }
  __name(input3_change_handler, "input3_change_handler");
  function input4_change_handler(each_value, index) {
    each_value[index].lr = this.checked;
    $$invalidate(2, resources);
  }
  __name(input4_change_handler, "input4_change_handler");
  function input5_input_handler(each_value, index) {
    each_value[index].formula = this.value;
    $$invalidate(2, resources);
  }
  __name(input5_input_handler, "input5_input_handler");
  function form_1_binding($$value) {
    binding_callbacks[$$value ? "unshift" : "push"](() => {
      form = $$value;
      $$invalidate(1, form);
    });
  }
  __name(form_1_binding, "form_1_binding");
  function applicationshell_elementRoot_binding(value) {
    elementRoot = value;
    $$invalidate(0, elementRoot);
  }
  __name(applicationshell_elementRoot_binding, "applicationshell_elementRoot_binding");
  $$self.$$set = ($$props2) => {
    if ("elementRoot" in $$props2)
      $$invalidate(0, elementRoot = $$props2.elementRoot);
    if ("actor" in $$props2)
      $$invalidate(5, actor = $$props2.actor);
  };
  return [
    elementRoot,
    form,
    resources,
    requestSubmit,
    updateSettings,
    actor,
    input0_input_handler,
    input1_input_handler,
    input2_input_handler,
    input3_change_handler,
    input4_change_handler,
    input5_input_handler,
    form_1_binding,
    applicationshell_elementRoot_binding
  ];
}
__name(instance, "instance");
class Resource_config_shell extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance, create_fragment, safe_not_equal, { elementRoot: 0, actor: 5 });
  }
  get elementRoot() {
    return this.$$.ctx[0];
  }
  set elementRoot(elementRoot) {
    this.$$set({ elementRoot });
    flush();
  }
  get actor() {
    return this.$$.ctx[5];
  }
  set actor(actor) {
    this.$$set({ actor });
    flush();
  }
}
__name(Resource_config_shell, "Resource_config_shell");
class ResourceConfig extends CustomSvelteApplication {
  constructor(options = {}, dialogData = {}) {
    super({
      title: `${game.i18n.localize("REST-RECOVERY.Dialogs.Resources.Title")}: ${options.actor.name}`,
      zIndex: 102,
      svelte: {
        class: Resource_config_shell,
        target: document.body,
        props: {
          actor: options.actor
        }
      },
      close: () => this.options.reject(),
      ...options
    }, {
      resizable: true,
      ...dialogData
    });
  }
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      closeOnSubmit: false,
      width: 550,
      height: "auto",
      classes: ["dnd5e dialog"]
    });
  }
}
__name(ResourceConfig, "ResourceConfig");
function registerSheetOverrides() {
  Hooks.on("renderItemSheet5e", patch_itemSheet);
  Hooks.on("renderActorSheet5e", patch_actorSheet);
  Hooks.on("renderAbilityUseDialog", patch_AbilityUseDialog);
  registerTraits();
}
__name(registerSheetOverrides, "registerSheetOverrides");
function registerTraits() {
  CONFIG.DND5E.characterFlags.hitDieBonus = {
    section: game.i18n.localize("REST-RECOVERY.Traits.Title"),
    name: game.i18n.localize("REST-RECOVERY.Traits.HitDieBonus.Title"),
    hint: game.i18n.localize("REST-RECOVERY.Traits.HitDieBonus.Hint"),
    type: String,
    placeholder: "0"
  };
  if (getSetting(CONSTANTS.SETTINGS.LONG_CUSTOM_SPELL_RECOVERY)) {
    CONFIG.DND5E.characterFlags.longRestSpellPointsBonus = {
      section: game.i18n.localize("REST-RECOVERY.Traits.Title"),
      name: game.i18n.localize("REST-RECOVERY.Traits.LongRestSpellPointsBonus.Title"),
      hint: game.i18n.localize("REST-RECOVERY.Traits.LongRestSpellPointsBonus.Hint"),
      type: String,
      placeholder: "0"
    };
    CONFIG.DND5E.characterFlags.longRestSpellPointsFormula = {
      section: game.i18n.localize("REST-RECOVERY.Traits.Title"),
      name: game.i18n.localize("REST-RECOVERY.Traits.LongRestSpellPointsFormula.Title"),
      hint: game.i18n.localize("REST-RECOVERY.Traits.LongRestSpellPointsFormula.Hint"),
      type: String,
      placeholder: getSetting(CONSTANTS.SETTINGS.LONG_SPELLS_MULTIPLIER_FORMULA)
    };
  }
  if (getSetting(CONSTANTS.SETTINGS.ENABLE_FOOD_AND_WATER)) {
    CONFIG.DND5E.characterFlags.foodUnits = {
      section: game.i18n.localize("REST-RECOVERY.Traits.Title"),
      name: game.i18n.localize("REST-RECOVERY.Traits.FoodUnitsPerDay.Title"),
      hint: game.i18n.localize("REST-RECOVERY.Traits.FoodUnitsPerDay.Hint"),
      type: Number,
      placeholder: getSetting(CONSTANTS.SETTINGS.FOOD_UNITS_PER_DAY)
    };
    CONFIG.DND5E.characterFlags.waterUnits = {
      section: game.i18n.localize("REST-RECOVERY.Traits.Title"),
      name: game.i18n.localize("REST-RECOVERY.Traits.WaterUnitsPerDay.Title"),
      hint: game.i18n.localize("REST-RECOVERY.Traits.WaterUnitsPerDay.Hint"),
      type: Number,
      placeholder: getSetting(CONSTANTS.SETTINGS.WATER_UNITS_PER_DAY)
    };
    CONFIG.DND5E.characterFlags.noFoodWater = {
      section: game.i18n.localize("REST-RECOVERY.Traits.Title"),
      name: game.i18n.localize("REST-RECOVERY.Traits.NoFoodWater.Title"),
      hint: game.i18n.localize("REST-RECOVERY.Traits.NoFoodWater.Hint"),
      type: Boolean,
      placeholder: false
    };
  }
}
__name(registerTraits, "registerTraits");
function patch_actorSheet(app, html, data) {
  let actor = game.actors.get(data.actor._id);
  let border = true;
  let targetElem = html.find(".center-pane .attributes")[0];
  if (!targetElem) {
    border = false;
    targetElem = html.find(".center-pane .resources")[0];
    if (!targetElem)
      return;
  }
  const elem = $(`<div class="form-group" style="${border ? "border-bottom: 2px groove #eeede0; padding-bottom: 0.25rem;" : "padding-top: 0.25rem;"} flex:0;"  title="Module: Rest Recovery for 5e">
        <label style="flex: none; line-height: 20px; font-weight: bold; margin: 0 10px 0 0;">${game.i18n.localize("REST-RECOVERY.Dialogs.Resources.Configure")}</label>
        <a class="config-button" title="${game.i18n.localize("REST-RECOVERY.Dialogs.Resources.Configure")}" style="flex:1;">
            <i class="fas fa-cog" style="float: right; margin-right: 3px; text-align: right; color: #999;"></i>
        </a>
    </div>`);
  elem.insertAfter(targetElem);
  elem.find(".config-button").on("click", function() {
    ResourceConfig.show({ actor });
  });
}
__name(patch_actorSheet, "patch_actorSheet");
function patch_itemSheet(app, html, { item } = {}) {
  if (getSetting(CONSTANTS.SETTINGS.ENABLE_FOOD_AND_WATER) && item.type === "consumable") {
    patch_itemConsumableInputs(app, html, item);
  }
  patch_itemCustomRecovery(app, html, item);
}
__name(patch_itemSheet, "patch_itemSheet");
function patch_itemConsumableInputs(app, html, item) {
  const customConsumable = getProperty(item, CONSTANTS.FLAGS.CONSUMABLE) ?? {};
  const uses = Number(getProperty(item, "data.uses.max"));
  const per = getProperty(item, "data.uses.per");
  const validUses = uses && uses > 0 && per;
  let targetElem = html.find(".form-header")?.[1];
  if (!targetElem)
    return;
  $(`
        <div class="form-header">${game.i18n.localize("REST-RECOVERY.Dialogs.ItemOverrides.Title")}</div>
        <div class="form-group">
            <div class="form-fields" style="margin-right:0.5rem;">
                <label class="checkbox" style="font-size:13px;">
                    <input type="checkbox" name="${CONSTANTS.FLAGS.CONSUMABLE_ENABLED}" ${customConsumable.enabled ? "checked" : ""}> ${game.i18n.localize("REST-RECOVERY.Dialogs.ItemOverrides.IsConsumable")}
                </label>
            </div>
            <div class="form-fields" style="margin-right:0.5rem;">
                <label style="flex:0 1 auto;">${game.i18n.localize("REST-RECOVERY.Dialogs.ItemOverrides.Type")}</label>
                <select name="${CONSTANTS.FLAGS.CONSUMABLE_TYPE}" ${!customConsumable.enabled ? "disabled" : ""}>
                    <option ${customConsumable.type === CONSTANTS.FLAGS.CONSUMABLE_TYPE_FOOD ? "selected" : ""} value="${CONSTANTS.FLAGS.CONSUMABLE_TYPE_FOOD}">${game.i18n.localize("REST-RECOVERY.Misc.Food")}</option>
                    <option ${customConsumable.type === CONSTANTS.FLAGS.CONSUMABLE_TYPE_WATER ? "selected" : ""} value="${CONSTANTS.FLAGS.CONSUMABLE_TYPE_WATER}">${game.i18n.localize("REST-RECOVERY.Misc.Water")}</option>
                    <option ${customConsumable.type === CONSTANTS.FLAGS.CONSUMABLE_TYPE_BOTH ? "selected" : ""} value="${CONSTANTS.FLAGS.CONSUMABLE_TYPE_BOTH}">${game.i18n.localize("REST-RECOVERY.Misc.Both")}</option>
                </select>
            </div>
        </div>
        
        <div class="form-group">
            <div class="form-fields" style="margin-right:0.5rem;">
                <label class="checkbox" style="font-size:13px;">
                    <input type="checkbox" name="${CONSTANTS.FLAGS.CONSUMABLE_DAY_WORTH}" ${customConsumable.dayWorth ? "checked" : ""}> ${game.i18n.localize("REST-RECOVERY.Dialogs.ItemOverrides.DayWorth")}
                </label>
            </div>
        </div>
        
        <small style="display:${customConsumable.enabled && !validUses ? "block" : "none"}; margin: 0.5rem 0;">
            <i class="fas fa-info-circle" style="color:rgb(217, 49, 49);"></i> ${game.i18n.localize("REST-RECOVERY.Dialogs.ItemOverrides.ChargesDescription")}
        </small>
    `).insertBefore(targetElem);
}
__name(patch_itemConsumableInputs, "patch_itemConsumableInputs");
function patch_itemCustomRecovery(app, html, item) {
  const customRecovery = getProperty(item, `${CONSTANTS.FLAGS.RECOVERY_ENABLED}`) ?? false;
  const customFormula = getProperty(item, `${CONSTANTS.FLAGS.RECOVERY_FORMULA}`) ?? "";
  let targetElem = html.find(".uses-per")?.[0];
  if (!targetElem)
    return;
  $(`<div class="form-group" title="Module: Rest Recovery for 5e">
        <label>${game.i18n.localize("REST-RECOVERY.Dialogs.ItemOverrides.UsesCustomRecovery")} <i class="fas fa-info-circle"></i></label>
        <div class="form-fields">
            <label class="checkbox">
                <input type="checkbox" name="${CONSTANTS.FLAGS.RECOVERY_ENABLED}" ${customRecovery ? "checked" : ""}>
                ${game.i18n.localize("REST-RECOVERY.Dialogs.ItemOverrides.Enabled")}
            </label>
            <span style="flex: 0 0 auto; margin: 0 0.25rem;">|</span>
            <span class="sep" style="flex: 0 0 auto; margin-right: 0.25rem;">${game.i18n.localize("REST-RECOVERY.Dialogs.ItemOverrides.Formula")}</span>
            <input type="text" name="${CONSTANTS.FLAGS.RECOVERY_FORMULA}" ${!customRecovery ? "disabled" : ""} value="${customRecovery ? customFormula : ""}">
        </div>
    </div>`).insertAfter(targetElem);
}
__name(patch_itemCustomRecovery, "patch_itemCustomRecovery");
function patch_AbilityUseDialog(app, html) {
  if (!app.item)
    return;
  const customConsumable = getProperty(app.item, CONSTANTS.FLAGS.CONSUMABLE) ?? {};
  if (!customConsumable.enabled || !app.item.system.uses.max)
    return;
  let {
    actorRequiredFood,
    actorRequiredWater,
    actorFoodSatedValue,
    actorWaterSatedValue
  } = getActorConsumableValues(app.item.parent);
  if (!actorRequiredFood && !actorRequiredWater)
    return;
  let content = html.find(".dialog-content");
  let targetElem = content.children().first();
  const fullUseAvailable = app.item.system.uses.value >= 1;
  let additionalHtml;
  if (customConsumable.dayWorth) {
    let localizationString = "REST-RECOVERY.Dialogs.AbilityUse.DayWorthTitle" + capitalizeFirstLetter(customConsumable.type);
    additionalHtml = `<p style='border-top: 1px solid rgba(0,0,0,0.25); margin:0.5rem 0; padding: 0.5rem 0;' class='notes'>
            ${game.i18n.localize(localizationString)}
        </p>`;
  } else {
    additionalHtml = `
        <p>${game.i18n.localize("REST-RECOVERY.Dialogs.AbilityUse.Title")}</p>
        <div style="margin-bottom:0.5rem;">
            <input type="radio" name="consumeAmount" value="full"
                ${fullUseAvailable ? "checked" : ""}
                ${!fullUseAvailable ? "disabled" : ""}/> ${game.i18n.localize("REST-RECOVERY.Dialogs.AbilityUse.FullUnit")}
            <input type="radio" name="consumeAmount" value="half" ${!fullUseAvailable ? "checked" : ""}/> ${game.i18n.localize("REST-RECOVERY.Dialogs.AbilityUse.HalfUnit")}
        </div>`;
    if (actorRequiredFood && (customConsumable.type === "both" || customConsumable.type === "food")) {
      additionalHtml += "<p style='border-top: 1px solid rgba(0,0,0,0.25); margin:0.5rem 0; padding: 0.5rem 0;' class='notes'>";
      if (actorFoodSatedValue >= actorRequiredFood) {
        additionalHtml += game.i18n.localize("REST-RECOVERY.Dialogs.AbilityUse.SatedFood");
      } else {
        additionalHtml += game.i18n.format("REST-RECOVERY.Dialogs.AbilityUse.NotSatedFood", {
          units: actorRequiredFood - actorFoodSatedValue
        });
      }
      additionalHtml += "</p>";
    }
    if (actorRequiredWater && customConsumable.type === "water") {
      additionalHtml += "<p style='border-top: 1px solid rgba(0,0,0,0.25); margin:0.5rem 0; padding: 0.5rem 0;' class='notes'>";
      if (actorWaterSatedValue >= actorRequiredWater) {
        additionalHtml += game.i18n.localize("REST-RECOVERY.Dialogs.AbilityUse.SatedWater");
      } else {
        additionalHtml += game.i18n.format("REST-RECOVERY.Dialogs.AbilityUse.NotSatedWater", {
          units: actorRequiredWater - actorWaterSatedValue
        });
      }
      additionalHtml += "</p>";
    }
  }
  targetElem.append($(additionalHtml));
  app.options.height = "auto";
  app.setPosition();
}
__name(patch_AbilityUseDialog, "patch_AbilityUseDialog");
class API {
  static renderPromptRestInterface() {
    if (!game.user.isGM)
      return false;
    return PromptRestDialog.show();
  }
  static getAllProfiles() {
    return Object.keys(this.getAllProfilesData());
  }
  static getAllProfilesData() {
    return foundry.utils.deepClone(gameSettings.profiles);
  }
  static getProfileData(inProfileName) {
    return gameSettings.activeProfileData ?? false;
  }
  static getActiveProfile() {
    return gameSettings.activeProfile;
  }
  static getActiveProfileData() {
    return this.getProfileData(this.getActiveProfile());
  }
  static async setActiveProfile(inProfileName) {
    return gameSettings.setActiveProfile(inProfileName, true);
  }
  static updateProfiles(inProfiles) {
    const defaultSettings = CONSTANTS.GET_DEFAULT_SETTINGS();
    for (let profileName of Object.keys(inProfiles)) {
      const profileData = {};
      const originalProfileData = this.getProfileData(profileName) || {};
      for (let key of Object.keys(defaultSettings)) {
        profileData[key] = inProfiles[profileName][key] ?? originalProfileData[key] ?? defaultSettings[key].default;
      }
      inProfiles[profileName] = profileData;
    }
    return gameSettings.updateProfiles(inProfiles, true);
  }
  static updateProfile(inProfileName, inData) {
    const profile = this.getProfileData(inProfileName);
    const profiles = this.getAllProfilesData();
    const newData = {};
    const defaultSettings = CONSTANTS.GET_DEFAULT_SETTINGS();
    for (let key of Object.keys(defaultSettings)) {
      newData[key] = inData[key] ?? profile[key] ?? defaultSettings[key].default;
    }
    profiles[inProfileName] = newData;
    return gameSettings.updateProfiles(profiles, true);
  }
  static setActorConsumableValues(actor, { food = null, water = null, starvation } = {}) {
    if (!(actor instanceof game.dnd5e.entities.Actor5e)) {
      throw new Error("actor must instance of Actor5e");
    }
    const update2 = {};
    if (food !== null) {
      if (!(isRealNumber(food) && food >= 0))
        throw new Error("food must be of type number greater or equal than 0");
      update2[CONSTANTS.FLAGS.SATED_FOOD] = food;
    }
    if (water !== null) {
      if (!(isRealNumber(water) && water >= 0))
        throw new Error("water must be of type number greater or equal than 0");
      update2[CONSTANTS.FLAGS.SATED_WATER] = water;
    }
    if (starvation !== null) {
      if (!(isRealNumber(starvation) && starvation >= 0))
        throw new Error("starvation must be of type number greater or equal than 0");
      update2[CONSTANTS.FLAGS.STARVATION] = starvation;
    }
    return actor.update(update2);
  }
}
__name(API, "API");
Hooks.once("init", () => {
  SocketHandler.initialize();
  gameSettings.initialize();
  registerLibwrappers();
  registerSheetOverrides();
  RestWorkflow.initialize();
  registerHooks();
  console.log("Rest Recovery 5e | Initialized");
});
Hooks.once("ready", () => {
  migrate();
  game.restrecovery = API;
});
//# sourceMappingURL=module.js.map
