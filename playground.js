const toolbox = document.getElementById('toolbox');
const dropzone = document.getElementById('dropzone');
const preview = document.getElementById('preview');
const output = document.getElementById('output');

// Maak blokken dragbaar
toolbox.querySelectorAll('.block').forEach(block => {
  block.addEventListener('dragstart', e => {
    e.dataTransfer.setData('text/plain', block.dataset.prop);
  });
});

// Dropzone event listeners
dropzone.addEventListener('dragover', e => e.preventDefault());

dropzone.addEventListener('drop', e => {
  e.preventDefault();
  const prop = e.dataTransfer.getData('text/plain');

  // Check of blok al bestaat (één prop per keer)
  if ([...dropzone.children].some(b => b.dataset.prop === prop)) {
    alert(`"${prop}" is al toegevoegd.`);
    return;
  }

  const newBlock = document.createElement('div');
  newBlock.className = 'block';
  newBlock.dataset.prop = prop;
  newBlock.innerHTML = `${prop}: <input type="text" placeholder="bijv. 10px of #fff"> <button class="remove">×</button>`;

  dropzone.appendChild(newBlock);

  // Input event
  const input = newBlock.querySelector('input');
  input.addEventListener('input', updateCSS);

  // Verwijder knop event
  newBlock.querySelector('.remove').addEventListener('click', () => {
    newBlock.remove();
    updateCSS();
  });

  updateCSS();
});

function updateCSS() {
  const styles = {};
  dropzone.querySelectorAll('.block').forEach(block => {
    const prop = block.dataset.prop;
    const val = block.querySelector('input').value;
    if (val.trim()) styles[prop] = val;
  });

  // update preview styles
  preview.style.cssText = ""; // reset
  for (let prop in styles) {
    preview.style.setProperty(prop, styles[prop]);
  }

  // generate CSS code
  let cssCode = `.my-button {\n`;
  for (let prop in styles) {
    cssCode += `  ${prop}: ${styles[prop]};\n`;
  }
  cssCode += `}`;

  output.textContent = cssCode;
}
