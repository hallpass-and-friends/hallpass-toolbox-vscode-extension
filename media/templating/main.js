function renderTargetItem(parent, item) {
  const el = addChild(parent, 'div', null, 'item');
  addChild(el, 'div', item.label, 'strong');
  addChild(el, 'div', item.detail, 'light');
  addChild(el, 'div', item.path, 'light');
  return el;
}

function loadTemplates(items) {
  const vscode = getVsCode();

  if (!items) {
    vscode.postMessage({ command: 'get-templates' });
    return; 
  }
  
  //else ... load the templates
  const parent = document.getElementById('templates');
  removeChildren(parent);

  const listItems = items.map(item => {
    const el = renderTargetItem(parent, item);
    el.addEventListener('click', () => {
      listItems.forEach(item => item.classList.remove('active'));
      el.classList.add('active');
      vscode.postMessage({ command: 'set-template', data: item });
    });
    return el;
  });
}

// on load
document.addEventListener('DOMContentLoaded', () => {
  loadTemplates();
});

// on message (from extension to the webview)
window.addEventListener('message', (evt) => {
  const message = evt.data ?? {};
  switch (message.command) {
    case 'templates': 
      loadTemplates(message.data);
      break;
    default: 
      console.warn(`Unsupported message from the extension: ${message.command}`);
      break;
  }
});

