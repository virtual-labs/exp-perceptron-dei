/**
 * Sim 4: Convergence vs Failure
 * Compare OR (linearly separable) vs XOR (not separable)
 */
(function () {
    const canvasOR = document.getElementById('sim4CanvasOR');
    const canvasXOR = document.getElementById('sim4CanvasXOR');
    if (!canvasOR || !canvasXOR) return;

    const ctxOR = canvasOR.getContext('2d');
    const ctxXOR = canvasXOR.getContext('2d');

    const lrSlider = document.getElementById('sim4Lr');
    const lrVal = document.getElementById('sim4LrVal');
    const trainBtn = document.getElementById('sim4Train');
    const resetBtn = document.getElementById('sim4Reset');
    const epochORSpan = document.getElementById('sim4EpochOR');
    const accORSpan = document.getElementById('sim4AccOR');
    const epochXORSpan = document.getElementById('sim4EpochXOR');
    const accXORSpan = document.getElementById('sim4AccXOR');

    const OR_DATA = [
        { x1: 0, x2: 0, label: 0 },
        { x1: 0, x2: 1, label: 1 },
        { x1: 1, x2: 0, label: 1 },
        { x1: 1, x2: 1, label: 1 }
    ];

    const XOR_DATA = [
        { x1: 0, x2: 0, label: 0 },
        { x1: 0, x2: 1, label: 1 },
        { x1: 1, x2: 0, label: 1 },
        { x1: 1, x2: 1, label: 0 }
    ];

    let stateOR = { w1: -0.3, w2: 0.4, bias: -0.2, epoch: 0, converged: false };
    let stateXOR = { w1: 0.5, w2: -0.3, bias: 0.1, epoch: 0, converged: false };
    let training = false;
    let animId = null;

    function reset() {
        stateOR = { w1: -0.3, w2: 0.4, bias: -0.2, epoch: 0, converged: false };
        stateXOR = { w1: 0.5, w2: -0.3, bias: 0.1, epoch: 0, converged: false };
        training = false;
        if (animId) clearTimeout(animId);
        animId = null;
        trainBtn.textContent = '▶ Train Both';
        epochORSpan.textContent = '0';
        accORSpan.textContent = '—';
        epochXORSpan.textContent = '0';
        accXORSpan.textContent = '—';
        resizeCanvases();
        drawBoth();
    }

    function resizeCanvases() {
        const dpr = window.devicePixelRatio || 1;
        [canvasOR, canvasXOR].forEach(canvas => {
            // Use the canvas's own CSS-resolved size (width:100%; height:100%)
            // Do NOT set canvas.style.width/height — causes a feedback loop
            const rect = canvas.getBoundingClientRect();
            canvas.width = Math.round(rect.width * dpr);
            canvas.height = Math.round(rect.height * dpr);
        });
        ctxOR.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctxXOR.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function toScreen(x, y, w, h, pad) {
        const sx = pad + ((x + 0.5) / 2.0) * (w - 2 * pad);
        const sy = (h - pad) - ((y + 0.5) / 2.0) * (h - 2 * pad);
        return [sx, sy];
    }

    function drawCanvas(ctx, dataset, state, canvas) {
        const w = canvas.width / window.devicePixelRatio;
        const h = canvas.height / window.devicePixelRatio;
        const pad = 35;

        ctx.clearRect(0, 0, w, h);

        // Grid
        ctx.strokeStyle = '#f3f4f6';
        ctx.lineWidth = 0.5;
        for (let i = 0; i <= 4; i++) {
            const gx = -0.5 + i * 0.5;
            const [sx] = toScreen(gx, 0, w, h, pad);
            ctx.beginPath(); ctx.moveTo(sx, pad); ctx.lineTo(sx, h - pad); ctx.stroke();
            const [, sy] = toScreen(0, gx, w, h, pad);
            ctx.beginPath(); ctx.moveTo(pad, sy); ctx.lineTo(w - pad, sy); ctx.stroke();
        }

        // Axes
        ctx.strokeStyle = '#d1d5db';
        ctx.lineWidth = 1;
        const [, axOY] = toScreen(0, 0, w, h, pad);
        ctx.beginPath(); ctx.moveTo(pad, axOY); ctx.lineTo(w - pad, axOY); ctx.stroke();
        const [axBX] = toScreen(0, 0, w, h, pad);
        ctx.beginPath(); ctx.moveTo(axBX, pad); ctx.lineTo(axBX, h - pad); ctx.stroke();

        // Decision boundary
        if (Math.abs(state.w2) > 0.001 || Math.abs(state.w1) > 0.001) {
            ctx.strokeStyle = '#6366f1';
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            if (Math.abs(state.w2) > 0.001) {
                const y_start = -(state.w1 * (-0.5) + state.bias) / state.w2;
                const y_end = -(state.w1 * 1.5 + state.bias) / state.w2;
                const [sx1, sy1] = toScreen(-0.5, y_start, w, h, pad);
                const [sx2, sy2] = toScreen(1.5, y_end, w, h, pad);
                ctx.moveTo(sx1, sy1);
                ctx.lineTo(sx2, sy2);
            } else {
                const bx = -state.bias / state.w1;
                const [sx] = toScreen(bx, 0, w, h, pad);
                ctx.moveTo(sx, pad);
                ctx.lineTo(sx, h - pad);
            }
            ctx.stroke();
        }

        // Data points
        dataset.forEach((pt) => {
            const [sx, sy] = toScreen(pt.x1, pt.x2, w, h, pad);
            const predicted = (state.w1 * pt.x1 + state.w2 * pt.x2 + state.bias) >= 0 ? 1 : 0;
            const isCorrect = predicted === pt.label;

            ctx.beginPath();
            ctx.arc(sx, sy, 10, 0, Math.PI * 2);
            ctx.fillStyle = pt.label === 1 ? '#ef4444' : '#3b82f6';
            ctx.fill();
            ctx.strokeStyle = isCorrect ? '#fff' : '#fbbf24';
            ctx.lineWidth = isCorrect ? 2 : 3;
            ctx.stroke();

            ctx.fillStyle = '#fff';
            ctx.font = 'bold 10px Inter, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(pt.label, sx, sy);
            ctx.textBaseline = 'alphabetic';
        });
    }

    function drawBoth() {
        drawCanvas(ctxOR, OR_DATA, stateOR, canvasOR);
        drawCanvas(ctxXOR, XOR_DATA, stateXOR, canvasXOR);
    }

    function calcAccuracy(dataset, state) {
        let correct = 0;
        dataset.forEach(pt => {
            const pred = (state.w1 * pt.x1 + state.w2 * pt.x2 + state.bias) >= 0 ? 1 : 0;
            if (pred === pt.label) correct++;
        });
        return (correct / dataset.length) * 100;
    }

    function trainEpoch(dataset, state) {
        const lr = parseFloat(lrSlider.value);
        dataset.forEach(pt => {
            const predicted = (state.w1 * pt.x1 + state.w2 * pt.x2 + state.bias) >= 0 ? 1 : 0;
            const error = pt.label - predicted;
            if (error !== 0) {
                state.w1 += lr * error * pt.x1;
                state.w2 += lr * error * pt.x2;
                state.bias += lr * error;
            }
        });
        state.epoch++;
    }

    function trainingLoop() {
        if (!training) return;

        // Train OR if not converged
        if (!stateOR.converged && stateOR.epoch < 50) {
            trainEpoch(OR_DATA, stateOR);
            const accOR = calcAccuracy(OR_DATA, stateOR);
            accORSpan.textContent = accOR.toFixed(0) + '%';
            epochORSpan.textContent = stateOR.epoch;
            if (accOR >= 100) {
                stateOR.converged = true;
                accORSpan.classList.add('success');
            }
        }

        // Train XOR (will oscillate)
        if (stateXOR.epoch < 50) {
            trainEpoch(XOR_DATA, stateXOR);
            const accXOR = calcAccuracy(XOR_DATA, stateXOR);
            accXORSpan.textContent = accXOR.toFixed(0) + '%';
            epochXORSpan.textContent = stateXOR.epoch;
        }

        drawBoth();

        // Stop at max epochs
        if (stateOR.epoch >= 50 && stateXOR.epoch >= 50) {
            training = false;
            trainBtn.textContent = '▶ Train Both';
            if (!stateOR.converged) accORSpan.classList.add('failure');
            accXORSpan.classList.add('failure');
            return;
        }

        animId = setTimeout(trainingLoop, 150);
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
