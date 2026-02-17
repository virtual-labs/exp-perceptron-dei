/**
 * Sim 1: Inside a Perceptron
 * Interactive diagram showing inputs → weights → bias → activation → output
 */
(function () {
    const canvas = document.getElementById('sim1Canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // DOM refs
    const x1Slider = document.getElementById('sim1X1');
    const x2Slider = document.getElementById('sim1X2');
    const w1Slider = document.getElementById('sim1W1');
    const w2Slider = document.getElementById('sim1W2');
    const biasSlider = document.getElementById('sim1Bias');
    const activationSelect = document.getElementById('sim1Activation');

    const x1Val = document.getElementById('sim1X1Val');
    const x2Val = document.getElementById('sim1X2Val');
    const w1Val = document.getElementById('sim1W1Val');
    const w2Val = document.getElementById('sim1W2Val');
    const biasVal = document.getElementById('sim1BiasVal');

    const sumDisplay = document.getElementById('sim1Sum');
    const activationInputDisplay = document.getElementById('sim1ActivationInput');
    const outputDisplay = document.getElementById('sim1Output');

    function getValues() {
        return {
            x1: parseFloat(x1Slider.value),
            x2: parseFloat(x2Slider.value),
            w1: parseFloat(w1Slider.value),
            w2: parseFloat(w2Slider.value),
            bias: parseFloat(biasSlider.value),
            activation: activationSelect.value
        };
    }

    function sigmoid(x) {
        return 1 / (1 + Math.exp(-x));
    }

    function compute(vals) {
        const weightedSum = vals.x1 * vals.w1 + vals.x2 * vals.w2 + vals.bias;
        let output;
        if (vals.activation === 'step') {
            output = weightedSum >= 0 ? 1 : 0;
        } else {
            output = sigmoid(weightedSum);
        }
        return { weightedSum, output };
    }

    function resizeCanvas() {
        const rect = canvas.parentElement.getBoundingClientRect();
        canvas.width = rect.width * window.devicePixelRatio;
        canvas.height = rect.height * window.devicePixelRatio;
        canvas.style.width = rect.width + 'px';
        canvas.style.height = rect.height + 'px';
        ctx.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
    }

    function drawArrow(fromX, fromY, toX, toY, color, lineWidth) {
        ctx.strokeStyle = color;
        ctx.lineWidth = lineWidth || 2;
        ctx.beginPath();
        ctx.moveTo(fromX, fromY);
        ctx.lineTo(toX, toY);
        ctx.stroke();

        const angle = Math.atan2(toY - fromY, toX - fromX);
        const headLen = 8;
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(toX, toY);
        ctx.lineTo(toX - headLen * Math.cos(angle - Math.PI / 6), toY - headLen * Math.sin(angle - Math.PI / 6));
        ctx.lineTo(toX - headLen * Math.cos(angle + Math.PI / 6), toY - headLen * Math.sin(angle + Math.PI / 6));
        ctx.closePath();
        ctx.fill();
    }

    function drawNode(x, y, radius, label, sublabel, fillColor, textColor) {
        // Shadow
        ctx.shadowColor = 'rgba(0,0,0,0.1)';
        ctx.shadowBlur = 8;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 2;

        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = fillColor;
        ctx.fill();
        ctx.strokeStyle = '#e5e7eb';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;

        ctx.fillStyle = textColor || '#1a1a2e';
        ctx.font = 'bold 13px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(label, x, sublabel ? y - 6 : y);

        if (sublabel) {
            ctx.font = '10px Inter, sans-serif';
            ctx.fillStyle = '#6b7280';
            ctx.fillText(sublabel, x, y + 10);
        }
    }

    function draw() {
        const vals = getValues();
        const { weightedSum, output } = compute(vals);
        const w = canvas.width / window.devicePixelRatio;
        const h = canvas.height / window.devicePixelRatio;

        ctx.clearRect(0, 0, w, h);

        // Layout
        const inputCol = w * 0.12;
        const weightCol = w * 0.35;
        const sumCol = w * 0.55;
        const activCol = w * 0.72;
        const outputCol = w * 0.88;
        const midY = h * 0.5;
        const spacing = Math.min(h * 0.22, 60);

        const r = 26;

        // ── Input nodes ──
        drawNode(inputCol, midY - spacing, r, 'x₁', vals.x1.toFixed(1), '#eef2ff', '#4338ca');
        drawNode(inputCol, midY + spacing, r, 'x₂', vals.x2.toFixed(1), '#eef2ff', '#4338ca');

        // ── Bias node ──
        drawNode(inputCol, midY + spacing * 2.5, r * 0.8, 'b', vals.bias.toFixed(2), '#fef3c7', '#92400e');

        // ── Arrows from inputs to sum node ──
        const w1Color = vals.w1 >= 0 ? '#6366f1' : '#ef4444';
        const w2Color = vals.w2 >= 0 ? '#6366f1' : '#ef4444';
        const lineW = 2;

        drawArrow(inputCol + r, midY - spacing, sumCol - r - 2, midY, w1Color, lineW);
        drawArrow(inputCol + r, midY + spacing, sumCol - r - 2, midY, w2Color, lineW);
        drawArrow(inputCol + r * 0.8, midY + spacing * 2.5, sumCol - r - 2, midY + 8, '#f59e0b', 1.5);

        // Weight labels on arrows
        ctx.font = 'bold 11px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillStyle = w1Color;
        ctx.fillText('w₁=' + vals.w1.toFixed(2), (inputCol + sumCol) / 2, midY - spacing * 0.7);
        ctx.fillStyle = w2Color;
        ctx.fillText('w₂=' + vals.w2.toFixed(2), (inputCol + sumCol) / 2, midY + spacing * 0.5);

        // ── Sum node (Σ) ──
        const sumColor = weightedSum >= 0 ? '#ddd6fe' : '#fee2e2';
        const sumTextColor = weightedSum >= 0 ? '#5b21b6' : '#991b1b';
        drawNode(sumCol, midY, r + 4, 'Σ', weightedSum.toFixed(2), sumColor, sumTextColor);

        // ── Arrow from sum to activation ──
        drawArrow(sumCol + r + 4, midY, activCol - r - 2, midY, '#6366f1', lineW);

        // ── Activation node ──
        const actLabel = vals.activation === 'step' ? 'Step' : 'σ';
        drawNode(activCol, midY, r + 2, actLabel, '', '#eef2ff', '#4338ca');

        // ── Arrow from activation to output ──
        drawArrow(activCol + r + 2, midY, outputCol - r - 2, midY, '#1a1a2e', lineW);

        // ── Output node ──
        const outVal = vals.activation === 'step' ? output.toString() : output.toFixed(3);
        const outColor = output >= 0.5 ? '#ddd6fe' : '#fee2e2';
        const outTextColor = output >= 0.5 ? '#5b21b6' : '#991b1b';
        drawNode(outputCol, midY, r + 4, 'ŷ', outVal, outColor, outTextColor);

        // ── Column labels ──
        ctx.font = '10px Inter, sans-serif';
        ctx.fillStyle = '#9ca3af';
        ctx.textAlign = 'center';
        ctx.fillText('INPUTS', inputCol, h * 0.08);
        ctx.fillText('WEIGHTED SUM', sumCol, h * 0.08);
        ctx.fillText('ACTIVATION', activCol, h * 0.08);
        ctx.fillText('OUTPUT', outputCol, h * 0.08);

        // Update displays
        const sumClass = weightedSum >= 0 ? 'positive' : 'negative';
        sumDisplay.textContent = weightedSum.toFixed(3);
        sumDisplay.className = 'comp-value ' + sumClass;

        activationInputDisplay.textContent = weightedSum.toFixed(3);
        activationInputDisplay.className = 'comp-value ' + sumClass;

        const outClass = output >= 0.5 ? 'positive' : 'negative';
        outputDisplay.textContent = vals.activation === 'step' ? output.toString() : output.toFixed(3);
        outputDisplay.className = 'comp-value ' + outClass;
    }

    function updateLabels() {
        const vals = getValues();
        x1Val.textContent = vals.x1.toFixed(1);
        x2Val.textContent = vals.x2.toFixed(1);
        w1Val.textContent = vals.w1.toFixed(2);
        w2Val.textContent = vals.w2.toFixed(2);
        biasVal.textContent = vals.bias.toFixed(2);
        draw();
    }

    // Attach listeners
    [x1Slider, x2Slider, w1Slider, w2Slider, biasSlider, activationSelect].forEach(el => {
        el.addEventListener('input', updateLabels);
    });

    window.addEventListener('resize', () => {
        resizeCanvas();
        draw();
    });

    document.addEventListener('DOMContentLoaded', () => {
        resizeCanvas();
        draw();
    });

    // Initial draw
    setTimeout(() => {
        resizeCanvas();
        draw();
    }, 100);
})();
