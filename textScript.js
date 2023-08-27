const textbox = document.getElementById('textbox');
const copyBtn = document.getElementById('copy');

textbox.addEventListener('input', function () {
    let value = textbox.value;

    // sanitize value
    value = value.replace(/[^a-zA-Z0-9\s]/g, '');

    console.log(value);
});

copyBtn.addEventListener('click', function () {
    if (!textbox.value) {
        alert("Please enter text");
        return;
    }

    navigator.clipboard.writeText(textbox.value)
        .then(() => {
            const alert = document.createElement('div');
            alert.textContent = 'Copied to clipboard!';
            alert.style.position = 'absolute';
            document.body.appendChild(alert);

            setTimeout(() => {
                alert.remove();
            }, 1000);
        });
});

function checkInput() {
  var input = document.getElementById("myInput");

  if (input.value == "") {
    input.setAttribute("placeholder", "Please enter text");
  } else {
    input.removeAttribute("placeholder");
  }
}