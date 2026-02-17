/**
 * Sim 5: Perceptron vs MLP
 * Compare single perceptron (linear) vs MLP (nonlinear) on XOR
 */
(function () {
    const canvasP = document.getElementById('sim5CanvasPerceptron');
    const canvasMLP = document.getElementById('sim5CanvasMLP');
    if (!canvasP || !canvasMLP) return;

    const ctxP = canvasP.getContext('2d');
    const ctxMLP = canvasMLP.getContext('2d');

    const hiddenSlider = document.getElementById('sim5Hidden');
    const hiddenVal = document.getElementById('sim5HiddenVal');
    const lrSlider = document.getElementById('sim5Lr');
    const lrVal = document.getElementById('sim5LrVal');
    const trainBtn = document.getElementById('sim5Train');
    const resetBtn = document.getElementById('sim5Reset');
    const epochPSpan = document.getElementById('sim5EpochP');
    const accPSpan = document.getElementById('sim5AccP');
    const epochMLPSpan = document.getElementById('sim5EpochMLP');
    const accMLPSpan = document.getElementById('sim5AccMLP');

    const XOR_DATA = [
        { x1: 0, x2: 0, label: 0 },
        { x1: 0, x2: 1, label: 1 },
        { x1: 1, x2: 0, label: 1 },
        { x1: 1, x2: 1, label: 0 }
    ];

    let stateP = { w1: 0.5, w2: -0.3, bias: 0.1, epoch: 0 };
    let stateMLP = { 
        hidden: 4,
        wh1: [], wh2: [], bh: [],
        wo: [], bo: 0,
        epoch: 0
    };
    let training = false;
    let animId = null;

    function reset() {
        stateP = { w1: 0.5, w2: -0.3, bias: 0.1, epoch: 0 };
        const hidden = parseInt(hiddenSlider.value);
        stateMLP = {
            hidden: hidden,
            wh1: Array(hidden).fill(0).map(() => Math.random() * 2 - 1),
            wh2: Array(hidden).fill(0).map(() => Math.random() * 2 - 1),
            bh: Array(hidden).fill(0).map(() => Math.random() * 0.2 - 0.1),
            wo: Array(hidden).fill(0).map(() => Math.random() * 2 - 1),
            bo: Math.random() * 0.2 - 0.1,
            epoch: 0
        };
        training = false;
        if (animId) clearTimeout(animId);
        animId = null;
        trainBtn.textContent = '▶ Train Both';
        epochPSpan.textContent = '0';
        accPSpan.textContent = '—';
        epochMLPSpan.textContent = '0';
        accMLPSpan.textContent = '—';
        accPSpan.classList.remove('success', 'failure');
        accMLPSpan.classList.remove('success', 'failure');
        resizeCanvases();
        drawBoth();
    }

    function resizeCanvases() {
        [canvasP, canvasMLP].forEach(canvas => {
            const rect = canvas.parentElement.getBoundingClientRect();
            canvas.width = rect.width * window.devicePixelRatio;
            canvas.height = rect.height * window.devicePixelRatio;
            canvas.style.width = rect.width + 'px';
            canvas.style.height = rect.height + 'px';
        });
        ctxP.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
        ctxMLP.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
    }

    function sigmoid(x) {
        return 1 / (1 + Math.exp(-x));
    }

    function toScreen(x, y, w, h, pad) {
        const sx = pad + ((x + 0.5) / 2.0) * (w - 2 * pad);
        const sy = (h - pad) - ((y + 0.5) / 2.0) * (h - 2 * pad);
        return [sx, sy];
    }

    function predictPerceptron(x1, x2, state) {
        return (state.w1 * x1 + state.w2 * x2 + state.bias) >= 0 ? 1 : 0;
    }

    function predictMLP(x1, x2, state) {
        // Forward pass
        const hidden = [];
        for (let i = 0; i < state.hidden; i++) {
            const h = sigmoid(state.wh1[i] * x1 + state.wh2[i] * x2 + state.bh[i]);
            hidden.push(h);
        }
        let out = state.bo;
        for (let i = 0; i < state.hidden; i++) {
            out += state.wo[i] * hidden[i];
        }
        const prob = sigmoid(out);
        return prob >= 0.5 ? 1 : 0;
    }

    function drawDecisionBoundary(ctx, w, h, pad, predictor) {
        // Draw decision boundary by sampling grid
        const resolution = 40;
        const imgData = ctx.createImageData(w - 2 * pad, h - 2 * pad);
        
        for (let px = 0; px < w - 2 * pad; px++) {
            for (let py = 0; py < h - 2 * pad; py++) {
                // Convert pixel to data coordinates
                const x1 = -0.5 + (px / (w - 2 * pad)) * 2.0;
                const x2 = 0.5 - (py / (h - 2 * pad)) * 2.0;
                
                const pred = predictor(x1, x2);
                const idx = (py * (w - 2 * pad) + px) * 4;
                
                if (pred === 1) {
                    imgData.data[idx] = 239;     // R
                    imgData.data[idx + 1] = 68;  // G
                    imgData.data[idx + 2] = 68;  // B
                    imgData.data[idx + 3] = 30;  // A
                } else {
                    imgData.data[idx] = 59;      // R
                    imgData.data[idx + 1] = 130; // G
                    imgData.data[idx + 2] = 246; // B
                    imgData.data[idx + 3] = 30;  // A
                }
            }
        }
        
        ctx.putImageData(imgData, pad, pad);
    }

    function drawCanvas(ctx, state, canvas, isPerceptron) {
        const w = canvas.width / window.devicePixelRatio;
        const h = canvas.height / window.devicePixelRatio;
        const pad = 35;

        ctx.clearRect(0, 0, w, h);

        // Draw decision boundary
        const predictor = isPerceptron 
            ? (x1, x2) => predictPerceptron(x1, x2, state)
            : (x1, x2) => predictMLP(x1, x2, state);
        
        drawDecisionBoundary(ctx, w, h, pad, predictor);

        // Grid
        ctx.strokeStyle = '#d1d5db';
        ctx.lineWidth = 0.5;
        for (let i = 0; i <= 4; i++) {
            const gx = -0.5 + i * 0.5;
            const [sx] = toScreen(gx, 0, w, h, pad);
            ctx.beginPath(); ctx.moveTo(sx, pad); ctx.lineTo(sx, h - pad); ctx.stroke();
            const [, sy] = toScreen(0, gx, w, h, pad);
            ctx.beginPath(); ctx.moveTo(pad, sy); ctx.lineTo(w - pad, sy); ctx.stroke();
        }

        // Axes
        ctx.strokeStyle = '#9ca3af';
        ctx.lineWidth = 1;
        const [, axOY] = toScreen(0, 0, w, h, pad);
        ctx.beginPath(); ctx.moveTo(pad, axOY); ctx.lineTo(w - pad, axOY); ctx.stroke();
        const [axBX] = toScreen(0, 0, w, h, pad);
        ctx.beginPath(); ctx.moveTo(axBX, pad); ctx.lineTo(axBX, h - pad); ctx.stroke();

        // Data points
        XOR_DATA.forEach((pt) => {
            const [sx, sy] = toScreen(pt.x1, pt.x2, w, h, pad);
            const predicted = predictor(pt.x1, pt.x2);
            const isCorrect = predicted === pt.label;

            ctx.beginPath();
            ctx.arc(sx, sy, 12, 0, Math.PI * 2);
            ctx.fillStyle = pt.label === 1 ? '#ef4444' : '#3b82f6';
            ctx.fill();
            ctx.strokeStyle = isCorrect ? '#fff' : '#fbbf24';
            ctx.lineWidth = isCorrect ? 3 : 4;
            ctx.stroke();

            ctx.fillStyle = '#fff';
            ctx.font = 'bold 11px Inter, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(pt.label, sx, sy);
            ctx.textBaseline = 'alphabetic';
        });
    }

    function drawBoth() {
        drawCanvas(ctxP, stateP, canvasP, true);
        drawCanvas(ctxMLP, stateMLP, canvasMLP, false);
    }

    function calcAccuracy(predictor) {
        let correct = 0;
        XOR_DATA.forEach(pt => {
            const pred = predictor(pt.x1, pt.x2);
            if (pred === pt.label) correct++;
        });
        return (correct / XOR_DATA.length) * 100;
    }

    function trainPerceptron() {
        const lr = parseFloat(lrSlider.value) * 0.1; // Slower for perceptron
        XOR_DATA.forEach(pt => {
            const predicted = predictPerceptron(pt.x1, pt.x2, stateP);
            const error = pt.label - predicted;
            if (error !== 0) {
                stateP.w1 += lr * error * pt.x1;
                stateP.w2 += lr * error * pt.x2;
                stateP.bias += lr * error;
            }
        });
        stateP.epoch++;
    }

    function trainMLP() {
        const lr = parseFloat(lrSlider.value) * 0.05;
        
        XOR_DATA.forEach(pt => {
            // Forward pass
            const hidden = [];
            for (let i = 0; i < stateMLP.hidden; i++) {
                const h = sigmoid(stateMLP.wh1[i] * pt.x1 + stateMLP.wh2[i] * pt.x2 + stateMLP.bh[i]);
                hidden.push(h);
            }
            let out = stateMLP.bo;
            for (let i = 0; i < stateMLP.hidden; i++) {
                out += stateMLP.wo[i] * hidden[i];
            }
            const prob = sigmoid(out);
            
            // Backward pass (simple gradient descent)
            const outputError = pt.label - prob;
            const outputDelta = outputError * prob * (1 - prob);
            
            // Update output weights
            for (let i = 0; i < stateMLP.hidden; i++) {
                stateMLP.wo[i] += lr * outputDelta * hidden[i];
            }
            stateMLP.bo += lr * outputDelta;
            
            // Update hidden weights
            for (let i = 0; i < stateMLP.hidden; i++) {
                const hiddenError = outputDelta * stateMLP.wo[i];
                const hiddenDelta = hiddenError * hidden[i] * (1 - hidden[i]);
                stateMLP.wh1[i] += lr * hiddenDelta * pt.x1;
                stateMLP.wh2[i] += lr * hiddenDelta * pt.x2;
                stateMLP.bh[i] += lr * hiddenDelta;
            }
        });
        
        stateMLP.epoch++;
    }

    function trainingLoop() {
        if (!training) return;

        if (stateP.epoch < 100) {
            trainPerceptron();
            const accP = calcAccuracy((x1, x2) => predictPerceptron(x1, x2, stateP));
            accPSpan.textContent = accP.toFixed(0) + '%';
            epochPSpan.textContent = stateP.epoch;
            if (stateP.epoch >= 100) {
                if (accP < 100) accPSpan.classList.add('failure');
            }
        }

        if (stateMLP.epoch < 100) {
            trainMLP();
            const accMLP = calcAccuracy((x1, x2) => predictMLP(x1, x2, stateMLP));
            accMLPSpan.textContent = accMLP.toFixed(0) + '%';
            epochMLPSpan.textContent = stateMLP.epoch;
            if (stateMLP.epoch >= 100) {
                if (accMLP >= 100) accMLPSpan.classList.add('success');
                else accMLPSpan.classList.add('failure');
            }
        }

        drawBoth();

        // Stop at max epochs
        if (stateP.epoch >= 100 && stateMLP.epoch >= 100) {
            training = false;
            trainBtn.textContent = '▶ Train Both';
            return;
        }

        animId = setTimeout(trainingLoop, 50);
    }

    trainBtn.addEventListener('click', () => {
        training = !training;
        if (training) {
            trainBtn.textContent = '⏸ Pause';
            trainingLoop();
        } else {
            trainBtn.textContent = '▶ Train Both';
            if (animId) clearTimeout(animId);
        }
    });

    resetBtn.addEventListener('click', reset);
    hiddenSlider.addEventListener('input', () => {
        hiddenVal.textContent = hiddenSlider.value;
    });
    lrSlider.addEventListener('input', () => {
        lrVal.textContent = parseFloat(lrSlider.value).toFixed(2);
    });

    window.addEventListener('resize', () => {
        resizeCanvases();
        drawBoth();
    });

    document.addEventListener('DOMContentLoaded', () => {
        resizeCanvases();
        drawBoth();
    });

    setTimeout(() => {
        resizeCanvases();
        drawBoth();
    }, 100);
})();
