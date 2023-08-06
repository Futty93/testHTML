let selectedImage;
let points = [];
let linesSVG;
let squareFrame;

function displayImage(event) {
    selectedImage = document.getElementById('selectedImage');
    selectedImage.src = URL.createObjectURL(event.target.files[0]);

    selectedImage.addEventListener('click', showSelectedPoint);

    linesSVG = document.getElementById('lines');
    squareFrame = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    squareFrame.setAttribute('fill', 'transparent');
    linesSVG.appendChild(squareFrame);
}

function showSelectedPoint(event) {
    const imageOffset = selectedImage.getBoundingClientRect();
    const clickX = event.clientX - imageOffset.left;
    const clickY = event.clientY - imageOffset.top;

    points.push({ x: clickX, y: clickY });

    drawCircle(event.clientX, event.clientY);

    const pointCoordinates = document.getElementById('pointCoordinates');
    pointCoordinates.textContent = `X: ${clickX.toFixed(2)} - Y: ${clickY.toFixed(2)}`;

    if (points.length === 4) {
        drawLines();
        drawSquareFrame();
    }
}

function drawCircle(x, y) {
    const circle = document.getElementById('circle');
    circle.style.display = 'block';
    circle.style.left = x + 'px';
    circle.style.top = y + 'px';
}

function drawLines() {
    linesSVG.innerHTML = ''; // Clear previous lines

    const lines = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
    lines.setAttribute('fill', 'none');
    lines.setAttribute('stroke', 'red');
    lines.setAttribute('stroke-width', '2');

    const pointsString = points.map(point => `${point.x},${point.y}`).join(' ');
    lines.setAttribute('points', pointsString);

    linesSVG.appendChild(lines);
}

function drawSquareFrame() {
    const minX = Math.min(points[0].x, points[1].x, points[2].x, points[3].x);
    const minY = Math.min(points[0].y, points[1].y, points[2].y, points[3].y);

    const maxX = Math.max(points[0].x, points[1].x, points[2].x, points[3].x);
    const maxY = Math.max(points[0].y, points[1].y, points[2].y, points[3].y);

    const width = maxX - minX;
    const height = maxY - minY;

    squareFrame.setAttribute('x', minX);
    squareFrame.setAttribute('y', minY);
    squareFrame.setAttribute('width', width);
    squareFrame.setAttribute('height', height);
}
