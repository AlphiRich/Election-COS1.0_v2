/* ecos-loader.js — preview loader. Compiles components/*.jsx in the browser (Babel standalone)
   into window.ECOS so cards and UI kits run before/without the compiled _ds_bundle.js.
   Load after React, ReactDOM and Babel. */
(function () {
  var base = (document.currentScript && document.currentScript.src || '').replace(/ecos-loader\.js.*$/, '');
  var FILES = ['core/Icon','core/Wordmark','core/Button','core/IconButton','core/StatusBadge','core/CodeTag','core/Card',
    'forms/Field','forms/Input','forms/Select','forms/Checkbox','forms/Radio','forms/Switch',
    'feedback/Alert','feedback/Toast','feedback/Dialog','feedback/Tooltip',
    'navigation/Tabs','navigation/SideNav','navigation/AppBar',
    'data/Table','data/Stat',
    'rbac/RoleBadge','rbac/CapabilityCell','rbac/RuleCheck','rbac/CapabilityToken'];
  var NS = window.ECOS = window.ECOS || {};
  var mods = {};
  FILES.forEach(function (f) {
    try {
      var x = new XMLHttpRequest(); x.open('GET', base + f + '.jsx', false); x.send();
      var code = Babel.transform(x.responseText, { presets: ['react'], plugins: ['transform-modules-commonjs'], filename: f + '.jsx' }).code;
      var module = { exports: {} };
      var req = function (p) { if (p === 'react') return window.React; var n = p.split('/').pop().replace(/\.jsx?$/, ''); return mods[n] || {}; };
      new Function('require', 'module', 'exports', 'React', code)(req, module, module.exports, window.React);
      var name = f.split('/').pop(); mods[name] = module.exports;
      Object.keys(module.exports).forEach(function (k) { NS[k] = module.exports[k]; });
    } catch (e) { console.error('[ecos-loader] ' + f, e); }
  });
})();
