// DOM Elements
const canvas = document.getElementById('graph');
const ctx = canvas.getContext('2d');
const plotButton = document.getElementById('plotButton');
const functionInput = document.getElementById('functionInput');
const errorDiv = document.getElementById('error');
const functionsContainer = document.getElementById('functionsContainer');

// Global Variables
let scale = 40; // pixels per unit
let offsetX = 0;
let offsetY = 0;
const plottedFunctions = [];

// Initialize Canvas Size
function resizeCanvas() {
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight;
    offsetX = canvas.width / 2;
    offsetY = canvas.height / 2;
    drawAxes();
    plotAllFunctions();
}

window.addEventListener('resize', resizeCanvas);
window.addEventListener('load', resizeCanvas);

// Draw Axes and Grid
function drawAxes() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 1;

    // X-axis
    ctx.moveTo(0, offsetY);
    ctx.lineTo(canvas.width, offsetY);

    // Y-axis
    ctx.moveTo(offsetX, 0);
    ctx.lineTo(offsetX, canvas.height);

    ctx.stroke();

    // Draw Grid
    drawGrid();
}

function drawGrid() {
    const step = scale; // pixels per unit
    ctx.beginPath();
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 1;

    // Vertical Grid Lines
    for (let x = offsetX; x < canvas.width; x += step) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
    }
    for (let x = offsetX; x > 0; x -= step) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
    }

    // Horizontal Grid Lines
    for (let y = offsetY; y < canvas.height; y += step) {
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
    }
    for (let y = offsetY; y > 0; y -= step) {
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
    }

    ctx.stroke();
}

// Plot All Stored Functions
function plotAllFunctions() {
    plottedFunctions.forEach(func => {
        plotSingleFunction(func.input, func.color);
    });
}

// Plot Function from Input
function plotFunction() {
    const input = functionInput.value.trim();
    if (!input) {
        displayError('Please enter a function to plot.');
        return;
    }

    // Parse the Function
    let expr;
    try {
        // Remove 'y =' or 'f(x) =' if present
        const cleanedInput = input.replace(/y\s*=/i, '').replace(/f\s*\(\s*x\s*\)\s*=/i, '').trim();
        console.log('Cleaned Input:', cleanedInput); // Debugging
        expr = math.compile(cleanedInput);
    } catch (error) {
        console.error('Error compiling function:', error);
        displayError('Invalid function. Please check your input.');
        return;
    }

    // Assign a Random Color
    const color = getRandomColor();

    // Store the Function
    plottedFunctions.push({ input: input, color: color });

    // Add Function to Sidebar
    addFunctionToList(input, color);

    // Clear Error Messages
    clearError();

    // Plot the Function
    plotSingleFunction(input, color);
}

// Plot a Single Function
function plotSingleFunction(input, color) {
    let expr;
    try {
        const cleanedInput = input.replace(/y\s*=/i, '').replace(/f\s*\(\s*x\s*\)\s*=/i, '').trim();
        expr = math.compile(cleanedInput);
    } catch (error) {
        console.error('Error compiling function for plotting:', error);
        displayError('Error compiling function for plotting.');
        return;
    }

    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;

    const xStart = -offsetX / scale;
    const xEnd = (canvas.width - offsetX) / scale;
    const step = 1 / scale; // Increment for x

    let firstPoint = true;
    let prevY = 0;

    for (let x = xStart; x <= xEnd; x += step) {
        let y;
        try {
            y = expr.evaluate({ x: x });
            if (typeof y !== 'number' || !isFinite(y)) {
                firstPoint = true;
                continue;
            }
        } catch (err) {
            console.error(`Error evaluating function at x = ${x}:`, err);
            firstPoint = true;
            continue;
        }

        const canvasX = offsetX + x * scale;
        const canvasY = offsetY - y * scale;

        if (firstPoint) {
            ctx.moveTo(canvasX, canvasY);
            firstPoint = false;
        } else {
            ctx.lineTo(canvasX, canvasY);
        }

        prevY = y;
    }

    ctx.stroke();
}

// Generate Random Color
function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

// Display Error Message
function displayError(message) {
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
}

// Clear Error Message
function clearError() {
    errorDiv.textContent = '';
    errorDiv.style.display = 'none';
}

// Add Function to List
function addFunctionToList(input, color) {
    const functionItem = document.createElement('div');
    functionItem.className = 'function-item';

    const colorBox = document.createElement('div');
    colorBox.className = 'color-box';
    colorBox.style.backgroundColor = color;

    const functionText = document.createElement('div');
    functionText.className = 'function-text';
    functionText.textContent = input;

    const removeButton = document.createElement('button');
    removeButton.className = 'remove-button';
    removeButton.textContent = 'Remove';
    removeButton.onclick = () => {
        removeFunction(input);
    };

    functionItem.appendChild(colorBox);
    functionItem.appendChild(functionText);
    functionItem.appendChild(removeButton);
    functionsContainer.appendChild(functionItem);
}

// Remove Function from List
function removeFunction(input) {
    const index = plottedFunctions.findIndex(func => func.input === input);
    if (index !== -1) {
        plottedFunctions.splice(index, 1);
        functionsContainer.innerHTML = ''; // Clear the list
        plottedFunctions.forEach(func => {
            addFunctionToList(func.input, func.color);
        });
        drawAxes(); // Redraw axes and grid
        plotAllFunctions(); // Replot all functions
    }
}

// Event Listener for Plotting Function
plotButton.addEventListener('click', plotFunction);
