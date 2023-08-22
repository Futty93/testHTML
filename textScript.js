const textbox = document.getElementById('textbox');
const copyBtn = document.getElementById('copy');

textbox.addEventListener('input', function() {
let value = textbox.value;

// sanitize value
value = value.replace(/[^a-zA-Z0-9\s]/g, '');

console.log(value);
});

copyBtn.addEventListener('click', function() {
if(!textbox.value) {
alert("Please enter text");
return;
}

navigator.clipboard.writeText(textbox.value)
.then(() => {
alert("Copied to clipboard!");
});
});