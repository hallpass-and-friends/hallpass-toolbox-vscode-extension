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

function addListener(element, event, action) {
  element.addEventListener(event, action);
  return () => { element.removeEventListener(event, action); };
}


function debounce(
    callback, /* the function to trigger */
    ms,       /* milliseconds delay before triggering callback defaults to 0 - no delay */
    context   /* defaults to this */) {
  let timer = 0;
  return function(...args) {
    context ??= this;       //the context for the function
    clearTimeout(timer);    //reset the delay
    timer = setTimeout(callback.bind(context, ...args), ms ?? 0);
  };
}