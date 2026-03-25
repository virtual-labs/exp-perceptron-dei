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

    // Max epochs before auto-stop
    const MAX_EPOCHS = 500;

    let stateP = null;
    let stateMLP = null;
    let training = false;
    let animId = null;

    function initStates() {
        stateP = { w1: 0.5, w2: -0.3, bias: 0.1, epoch: 0 };
        const hidden = parseInt(hiddenSlider.value);
        stateMLP = {
            hidden: hidden,
            wh1: Array(hidden).fill(0).map(() => (Math.random() * 2 - 1) * 0.5),
            wh2: Array(hidden).fill(0).map(() => (Math.random() * 2 - 1) * 0.5),
            bh:  Array(hidden).fill(0).map(() => (Math.random() * 0.2 - 0.1)),
            wo:  Array(hidden).fill(0).map(() => (Math.random() * 2 - 1) * 0.5),
            bo:  Math.random() * 0.2 - 0.1,
            epoch: 0
        };
    }

    function reset() {
        training = false;
        if (animId) { cancelAnimationFrame(animId); animId = null; }
        trainBtn.textContent = '▶ Train Both';
        epochPSpan.textContent = '0';
        accPSpan.textContent = '—';
        epochMLPSpan.textContent = '0';
        accMLPSpan.textContent = '—';
        accPSpan.classList.remove('success', 'failure');
        accMLPSpan.classList.remove('success', 'failure');
        initStates();
        resizeCanvases();
        drawBoth();
    }

    function resizeCanvases() {
        [canvasP, canvasMLP].forEach(canvas => {
            const rect = canvas.parentElement.getBoundingClientRect();
            const dpr = window.devicePixelRatio || 1;
            canvas.width = Math.round(rect.width * dpr);
            canvas.height = Math.round(rect.height * dpr);
            canvas.style.width = rect.width + 'px';
            canvas.style.height = rect.height + 'px';
        });
        ctxP.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
        ctxMLP.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
    }

    function sigmoid(x) {
        return 1 / (1 + Math.exp(-x));
    }

    // Convert data coords [0,1] → screen coords with padding
    function toScreen(x, y, w, h, pad) {
        const sx = pad + x * (w - 2 * pad);
        const sy = (h - pad) - y * (h - 2 * pad);
        return [sx, sy];
    }

    function predictPerceptron(x1, x2) {
        return (stateP.w1 * x1 + stateP.w2 * x2 + stateP.bias) >= 0 ? 1 : 0;
    }

    function predictMLP(x1, x2) {
        const hidden = [];
        for (let i = 0; i < stateMLP.hidden; i++) {
            hidden.push(sigmoid(stateMLP.wh1[i] * x1 + stateMLP.wh2[i] * x2 + stateMLP.bh[i]));
        }
        let out = stateMLP.bo;
        for (let i = 0; i < stateMLP.hidden; i++) out += stateMLP.wo[i] * hidden[i];
        return sigmoid(out) >= 0.5 ? 1 : 0;
    }

    /**
     * Draw decision regions using fillRect on a coarse grid.
     * This respects the canvas 2D transform (DPR scaling) correctly.
     */
    function drawDecisionRegion(ctx, w, h, pad, predictor) {
        const GRID = 40; // number of cells per axis
        const cellW = (w - 2 * pad) / GRID;
        const cellH = (h - 2 * pad) / GRID;

        for (let gx = 0; gx < GRID; gx++) {
            for (let gy = 0; gy < GRID; gy++) {
                // centre of cell in data space [0,1]
                const x1 = (gx + 0.5) / GRID;
                const x2 = 1 - (gy + 0.5) / GRID; // flip y

                const pred = predictor(x1, x2);
                ctx.fillStyle = pred === 1
                    ? 'rgba(239,68,68,0.18)'
                    : 'rgba(59,130,246,0.18)';

                const px = pad + gx * cellW;
                const py = pad + gy * cellH;
                ctx.fillRect(px, py, cellW + 0.5, cellH + 0.5); // +0.5 avoids gaps
            }
        }
    }

    /**
     * Draw the perceptron decision line: w1·x1 + w2·x2 + bias = 0
     * → x2 = -(w1·x1 + bias) / w2
     */
    function drawPerceptronLine(ctx, w, h, pad) {
        const { w1, w2, bias } = stateP;
        if (Math.abs(w2) < 1e-6) {
            // Vertical line at x1 = -bias/w1
            if (Math.abs(w1) < 1e-6) return; // degenerate
            const x1val = -bias / w1;
            const [sx] = toScreen(x1val, 0, w, h, pad);
            ctx.strokeStyle = '#10b981';
            ctx.lineWidth = 2.5;
            ctx.setLineDash([6, 4]);
            ctx.beginPath();
            ctx.moveTo(sx, pad);
            ctx.lineTo(sx, h - pad);
            ctx.stroke();
            ctx.setLineDash([]);
            return;
        }
        // x2 at x1=0: (-bias) / w2
        // x2 at x1=1: -(w1 + bias) / w2
        const x2at0 = -bias / w2;
        const x2at1 = -(w1 + bias) / w2;
        const [sx0, sy0] = toScreen(0, x2at0, w, h, pad);
        const [sx1, sy1] = toScreen(1, x2at1, w, h, pad);

        ctx.save();
        ctx.beginPath();
        ctx.rect(pad, pad, w - 2 * pad, h - 2 * pad);
        ctx.clip();

        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 2.5;
        ctx.setLineDash([6, 4]);
        ctx.beginPath();
        ctx.moveTo(sx0, sy0);
        ctx.lineTo(sx1, sy1);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.restore();
    }

    function drawCanvas(ctx, canvas, isPerceptron) {
        const w = canvas.width / (window.devicePixelRatio || 1);
        const h = canvas.height / (window.devicePixelRatio || 1);
        const pad = 35;

        ctx.clearRect(0, 0, w, h);

        // Background
        ctx.fillStyle = '#f8fafc';
        ctx.fillRect(pad, pad, w - 2 * pad, h - 2 * pad);

        const predictor = isPerceptron
            ? (x1, x2) => predictPerceptron(x1, x2)
            : (x1, x2) => predictMLP(x1, x2);

        // Decision regions
        drawDecisionRegion(ctx, w, h, pad, predictor);

        // Grid lines
        ctx.strokeStyle = '#e2e8f0';
        ctx.lineWidth = 0.8;
        for (let i = 0; i <= 4; i++) {
            const t = i / 4;
            const gx = pad + t * (w - 2 * pad);
            const gy = pad + t * (h - 2 * pad);
            ctx.beginPath(); ctx.moveTo(gx, pad); ctx.lineTo(gx, h - pad); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(pad, gy); ctx.lineTo(w - pad, gy); ctx.stroke();
        }

        // Perceptron decision line
        if (isPerceptron) {
            drawPerceptronLine(ctx, w, h, pad);
        }

        // Axis labels
        ctx.fillStyle = '#94a3b8';
        ctx.font = '10px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('0', ...toScreen(0, 0, w, h, pad).map((v, i) => i === 0 ? v : v + 14));
        ctx.fillText('1', pad + (w - 2 * pad), h - pad + 14);
        ctx.textAlign = 'right';
        ctx.fillText('1', pad - 6, pad + 4);

        // Axis lines
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 1;
        const [axX0, axY0] = toScreen(0, 0, w, h, pad);
        ctx.beginPath(); ctx.moveTo(pad, axY0); ctx.lineTo(w - pad, axY0); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(axX0, pad); ctx.lineTo(axX0, h - pad); ctx.stroke();

        // Axis tick labels along bottom and left
        ctx.fillStyle = '#64748b';
        ctx.font = '9px Inter, sans-serif';
        ctx.textAlign = 'center';
        for (let v = 0; v <= 1; v += 0.5) {
            const [sx] = toScreen(v, 0, w, h, pad);
            ctx.fillText(v.toFixed(1), sx, h - pad + 13);
        }
        ctx.textAlign = 'right';
        for (let v = 0; v <= 1; v += 0.5) {
            const [, sy] = toScreen(0, v, w, h, pad);
            ctx.fillText(v.toFixed(1), pad - 4, sy + 4);
        }

        // Data points
        XOR_DATA.forEach(pt => {
            const [sx, sy] = toScreen(pt.x1, pt.x2, w, h, pad);
            const predicted = predictor(pt.x1, pt.x2);
            const isCorrect = predicted === pt.label;

            ctx.beginPath();
            ctx.arc(sx, sy, 13, 0, Math.PI * 2);
            ctx.fillStyle = pt.label === 1 ? '#ef4444' : '#3b82f6';
            ctx.fill();
            ctx.strokeStyle = isCorrect ? '#fff' : '#f59e0b';
            ctx.lineWidth = isCorrect ? 2.5 : 3.5;
            ctx.stroke();

            ctx.fillStyle = '#fff';
            ctx.font = 'bold 11px Inter, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(pt.label, sx, sy);
            ctx.textBaseline = 'alphabetic';
        });

        // Border
        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 1;
        ctx.strokeRect(pad, pad, w - 2 * pad, h - 2 * pad);
    }

    function drawBoth() {
        if (stateP && stateMLP) {
            drawCanvas(ctxP, canvasP, true);
            drawCanvas(ctxMLP, canvasMLP, false);
        }
    }

    function calcAccuracy(predictor) {
        let correct = 0;
        XOR_DATA.forEach(pt => {
            if (predictor(pt.x1, pt.x2) === pt.label) correct++;
        });
        return (correct / XOR_DATA.length) * 100;
    }

    function trainPerceptronStep() {
        const lr = parseFloat(lrSlider.value) * 0.05;
        XOR_DATA.forEach(pt => {
            const predicted = predictPerceptron(pt.x1, pt.x2);
            const error = pt.label - predicted;
            if (error !== 0) {
                stateP.w1 += lr * error * pt.x1;
                stateP.w2 += lr * error * pt.x2;
                stateP.bias += lr * error;
            }
        });
        stateP.epoch++;
    }

    function trainMLPStep() {
        const lr = parseFloat(lrSlider.value) * 0.08;
        XOR_DATA.forEach(pt => {
            // Forward
            const hid = [];
            for (let i = 0; i < stateMLP.hidden; i++) {
                hid.push(sigmoid(stateMLP.wh1[i] * pt.x1 + stateMLP.wh2[i] * pt.x2 + stateMLP.bh[i]));
            }
            let out = stateMLP.bo;
            for (let i = 0; i < stateMLP.hidden; i++) out += stateMLP.wo[i] * hid[i];
            const prob = sigmoid(out);

            // Backward
            const dOut = (pt.label - prob) * prob * (1 - prob);
            for (let i = 0; i < stateMLP.hidden; i++) {
                stateMLP.wo[i] += lr * dOut * hid[i];
                const dHid = dOut * stateMLP.wo[i] * hid[i] * (1 - hid[i]);
                stateMLP.wh1[i] += lr * dHid * pt.x1;
                stateMLP.wh2[i] += lr * dHid * pt.x2;
                stateMLP.bh[i]  += lr * dHid;
            }
            stateMLP.bo += lr * dOut;
        });
        stateMLP.epoch++;
    }

    // Batch size: train N epochs per animation frame to avoid per-frame slowness
    const EPOCHS_PER_FRAME = 5;

    function trainingLoop() {
        if (!training) return;

        const pDone = stateP.epoch >= MAX_EPOCHS;
        const mlpDone = stateMLP.epoch >= MAX_EPOCHS;

        if (!pDone) {
            for (let i = 0; i < EPOCHS_PER_FRAME; i++) trainPerceptronStep();
            const accP = calcAccuracy((x1, x2) => predictPerceptron(x1, x2));
            epochPSpan.textContent = stateP.epoch;
            accPSpan.textContent = accP.toFixed(0) + '%';
            if (stateP.epoch >= MAX_EPOCHS) {
                accPSpan.classList.remove('success', 'failure');
                accPSpan.classList.add(accP >= 100 ? 'success' : 'failure');
            }
        }

        if (!mlpDone) {
            for (let i = 0; i < EPOCHS_PER_FRAME; i++) trainMLPStep();
            const accMLP = calcAccuracy((x1, x2) => predictMLP(x1, x2));
            epochMLPSpan.textContent = stateMLP.epoch;
            accMLPSpan.textContent = accMLP.toFixed(0) + '%';
            if (stateMLP.epoch >= MAX_EPOCHS) {
                accMLPSpan.classList.remove('success', 'failure');
                accMLPSpan.classList.add(accMLP >= 100 ? 'success' : 'failure');
            }
        }

        drawBoth();

        if (stateP.epoch >= MAX_EPOCHS && stateMLP.epoch >= MAX_EPOCHS) {
            training = false;
            trainBtn.textContent = '▶ Train Both';
            return;
        }

        animId = requestAnimationFrame(trainingLoop);
    }

    trainBtn.addEventListener('click', () => {
        if (stateP.epoch >= MAX_EPOCHS && stateMLP.epoch >= MAX_EPOCHS) {
            // Already finished — reset then train
            reset();
            return;
        }
        training = !training;
        if (training) {
            trainBtn.textContent = '⏸ Pause';
            animId = requestAnimationFrame(trainingLoop);
        } else {
            trainBtn.textContent = '▶ Train Both';
            if (animId) { cancelAnimationFrame(animId); animId = null; }
        }
    });

    resetBtn.addEventListener('click', reset);

    hiddenSlider.addEventListener('input', () => {
        hiddenVal.textContent = hiddenSlider.value;
    });
    lrSlider.addEventListener('input', () => {
        lrVal.textContent = parseFloat(lrSlider.value).toFixed(2);
    });

    let resizeTimer = null;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            resizeCanvases();
            drawBoth();
        }, 100);
    });

    // Init on load
    function init() {
        initStates();
        resizeCanvases();
        drawBoth();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        setTimeout(init, 50);
    }
})();
