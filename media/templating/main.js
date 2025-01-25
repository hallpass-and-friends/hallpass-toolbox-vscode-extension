const main = (() => {
  window._HALLPASS_ ??= {};
  const ret = window._HALLPASS_;
  
  //data
  ret.valid = false;
  ret.template = null;
  ret.target = null;      //target input element
  ret.processBtn = null;  //process button

  ret.configuration = {
    fields: {},
    subscriptions: []
  };

  //methods
  ret.update = (override) => {
    return updatePanelState(override);
  };
  ret.configuration.reset = () => {
    //reset the fields
    ret.configuration.fields = {};
    
    //remove all subscriptions
    ret.configuration.subscriptions.forEach(sub => {
      if (typeof(sub) === 'function') { sub(); }
    });
    ret.configuration.subscriptions = [];

    //reset (invalidate) the panel
    ret.update(true);

    //clear the configuration wrapper
    const wrapper = document.getElementById("configuration");
    wrapper.classList.add('active');
    removeChildren(wrapper);
    return wrapper;
  };


  return ret;

})();

function updatePanelState(override) {
  if (!main.processBtn) {
    main.processBtn = document.getElementById('process');
    main.processBtn.addEventListener('click', () => processTemplate());
  }
  if (!main.target) {
    main.target = document.getElementById('target');
    main.target.addEventListener('keyup', () => main.update());
  }

  const output = [];
  if (!main.template) { output.push('[Template] Please select template'); }
  if (output.length === 0) {
    Object.keys(main.configuration.fields).forEach((id) => {
      const current = main.configuration.fields[id];
      if (!current.value) {
        output.push(`[${id}] Missing value for ${current.field.label}`);
      }
    });
  }
  if (output.length === 0 && !target.value) { output.push('[Output Folder] Enter folder for the outputted  template files'); }

  main.valid = override === true 
    ? false 
    : output.length === 0;

  if (main.processBtn) {
    main.processBtn.disabled = !main.valid;
  }

  displayOutput(output.length === 0 ? 'Ready' : 'Todo', output);
  return main.valid;
}

function displayOutput(title, content /*:string[]*/) {
  const vscode = getVsCode();
  if (vscode) {
    vscode.postMessage({ command: 'log', title, content });
    return; 
  }
}

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

function onTemplateSelected(template) {
  console.log(">>> onTemplateSelected", template);
  main.template = template;
  const wrapper = main.configuration.reset();  

  addChild(wrapper, 'h4', template.label, 'strong');

  if (Array.isArray(template.fields) && template.fields.length > 0) {
    const group = addChild(wrapper, 'div', null, 'field-group');
    template.fields.forEach(field => {
      group.appendChild(buildField(field));
    });
  }
  else {
    addChild(wrapper, 'div', `<em>No configuration fields for this template</em>`);
  }

  main.update();
}

function buildField(field) {
  const ret = document.createElement('div');
  ret.classList.add('field');
  const label = addChild(ret, 'label', field.label);
  label.htmlFor = field.id;
  const input = addChild(ret, 'input');
  input.type = 'text';
  input.name = field.id;
  input.id = field.id;
  input.placeholder = field.hint ?? `Enter ${field.label}`;
  if (field.default) { 
    input.value = field.default; 
  }

  main.configuration.fields[field.id] = { field, input, value: field.default ?? null };

  //add subscription
  main.configuration.subscriptions.push(
    addListener(input, 'keyup', () => { 
      main.configuration.fields[field.id].value = input.value; 
      main.update();
    })
  );

  return ret;
}

function processTemplate() {
  const template = main.template;
  const target = main.target.value;
  const fields = Object.keys(main.configuration.fields)
    .reduce((ret, id) => {
      const {field, value} = main.configuration.fields[id];
      ret[id] = { field, value };
      return ret;
    }, {});
  
  const vscode = getVsCode();
  if (vscode) {
    vscode.postMessage({ command: 'process-template', template, fields, target });
  }
  console.log("[Templating] ProcessTemplate()", {template, target, fields});
}
// on load
document.addEventListener('DOMContentLoaded', () => {  
  loadTemplates();
  main.update(true); //reset/invalidate  
});

// on message (from extension to the webview)
window.addEventListener('message', (evt) => {
  const message = evt.data ?? {};
  switch (message.command) {
    case 'templates': 
      loadTemplates(message.data);
      break;
    case 'template-selected':
      onTemplateSelected(message.data);
      break;
    default: 
      console.warn(`Unsupported message from the extension: ${message.command}`);
      break;
  }
});

