let __vs_code_api = null;
function getVsCode() {
  if (!__vs_code_api) {
    __vs_code_api = acquireVsCodeApi();
  }
  return __vs_code_api;
}

function removeChildren(parent) {
  while (parent?.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}

function addChild(parent, tag, html, classNames) {
  const el = document.createElement(tag);
  el.innerHTML = html ?? '';
  classNames = typeof(classNames) === 'string'
    ? [classNames]
    : Array.isArray(classNames)
      ? classNames
      : [];
  classNames.forEach(c => el.classList.add(c));
  parent.appendChild(el);
  return el;
}