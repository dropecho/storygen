var container = document.getElementsByClassName('container')[0];
var leftPanel = document.getElementsByClassName('left-panel')[0];
var rightPanel = document.getElementsByClassName('right-panel')[0];

function funcToString(func) {
  let stringFunc = func.toString();
  let firstParenIndex = stringFunc.indexOf('{');
  let body = stringFunc.substring(firstParenIndex + 1, stringFunc.length - 1).replace('\n', '');
  return body;
}

function addExample(title, callback) {
  const el = document.createElement('div');

  const cb = (e) => {
    rightPanel.innerHTML = '';
    if (callback) {
      const rootEl = document.createElement('div');
      const textEl = document.createElement('div');
      const descEl = document.createElement('div');
      const codeEl = document.createElement('pre');
      const outputEl = document.createElement('pre');

      descEl.classList.add('output-desc', 'raised');
      textEl.classList.add('output-text', 'raised');
      codeEl.classList.add('output-code', 'raised');
      outputEl.classList.add('output-json', 'raised');

      var data = callback();

      if (data.description) {
        descEl.innerText = data.description;
        let title = document.createElement('div');
        title.classList.add('raised-title');
        title.innerText = 'Description';

        descEl.appendChild(title);
        rootEl.appendChild(descEl);
      }
      if (data.text) {

        let title = document.createElement('div');
        title.classList.add('raised-title');
        title.innerText = 'Generated Text';

        let textInner = document.createElement('div');
        textInner.innerText = data.text;

        textInner.style.maxWidth = '70%';

        textEl.appendChild(title);
        textEl.appendChild(textInner);
        rootEl.appendChild(textEl);
      }
      if (data.code) {
        let title = document.createElement('div');
        title.classList.add('raised-title');
        title.innerText = 'Code';


        codeEl.innerText = data.code;
        codeEl.appendChild(title);
        rootEl.appendChild(codeEl);
      }
      if (data.output) {
        let title = document.createElement('div');
        title.classList.add('raised-title');
        title.innerText = 'Output';

        outputEl.innerText = JSON.stringify(data.output, null, 2);

        outputEl.appendChild(title);
        rootEl.appendChild(outputEl);
      }

      rightPanel.appendChild(rootEl);
    }
  };

  el.classList.add('button');
  el.classList.add('dark');
  el.addEventListener('click', cb);

  const textEl = document.createElement('div');
  textEl.classList.add('text');
  textEl.innerText = title;

  el.appendChild(textEl);
  leftPanel.appendChild(el);

  return el;
}

var home = addExample('Home', () => {
  return {
    description: `Click on one of the options to the left to run an example.
Click again to run it again (with a new seed, generating a new sentence/story).
`
  };
});

home.click();
