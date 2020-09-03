var container = document.getElementsByClassName('container')[0];
var leftPanel = document.getElementsByClassName('left-panel')[0];
var rightPanel = document.getElementsByClassName('right-panel')[0];

function addExample(text, callback) {
  const el = document.createElement('div');

  const cb = (e) => {
    rightPanel.innerHTML = '';
    if(callback) {
      rightPanel.appendChild(callback());
    }
  };

  el.innerText = text;
  el.classList.add('example-option');
  el.addEventListener('click', cb);
  leftPanel.appendChild(el);

  return el;
}

var home = addExample('Home', () => {
  var textel = document.createElement('pre');
  textel.classList.add('output-text');
  textel.innerText = `Click on one of the options to the left to run an example.
Click again to run it again (with a new seed, generating a new sentence/story).
`;

  return textel;
});

home.click();
