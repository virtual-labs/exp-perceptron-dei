/**
 * Sim 3: Training Animation
 * Step-by-step weight updates with animated boundary movement
 */
(function () {
    const canvas = document.getElementById('sim3Canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const lrSlider = document.getElementById('sim3Lr');
    const lrVal = document.getElementById('sim3LrVal');
    const datasetSelect = document.getElementById('sim3Dataset');
    const playBtn = document.getElementById('sim3Play');
    const stepBtn = document.getElementById('sim3Step');
    const resetBtn = document.getElementById('sim3Reset');
    const logDiv = document.getElementById('sim3Log');
    const statusDot = document.getElementById('sim3StatusDot');
    const statusText = document.getElementById('sim3StatusText');

    const DATASETS = {
        OR: [
            { x1: 0, x2: 0, label: 0 },
            { x1: 0, x2: 1, label: 1 },
            { x1: 1, x2: 0, label: 1 },
            { x1: 1, x2: 1, label: 1 }
        ],
        AND: [
            { x1: 0, x2: 0, label: 0 },
            { x1: 0, x2: 1, label: 0 },
            { x1: 1, x2: 0, label: 0 },
            { x1: 1, x2: 1, label: 1 }
        ]
    };

    let state = {
        w1: -0.4, w2: 0.2, bias: -0.1,
        epoch: 0,
        sampleIdx: 0,
        running: false,
        converged: false,
        animId: null,
        currentMisclassified: null,
        logs: []
    };

    function reset() {
        state = {
            w1: -0.4, w2: 0.2, bias: -0.1,
            epoch: 0, sampleIdx: 0,
            running: false, converged: false,
            animId: null, currentMisclassified: null,
            logs: []
        };
        if (state.animId) cancelAnimationFrame(state.animId);
        playBtn.textContent = '▶ Play';
        statusDot.className = 'status-dot';
        statusText.textContent = 'Ready';
        logDiv.textContent = 'Press Play or Step to begin training...';
        resizeCanvas();
        draw();
    }

    function resizeCanvas() {
        const rect = canvas.parentElement.getBoundingClientRect();
        canvas.width = rect.width * window.devicePixelRatio;
        canvas.height = rect.height * window.devicePixelRatio;
        canvas.style.width = rect.width + 'px';
        canvas.style.height = rect.height + 'px';
        ctx.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
    }

    function toScreen(x, y, w, h, pad) {
        const sx = pad + ((x + 0.5) / 2.0) * (w - 2 * pad);
        const sy = (h - pad) - ((y + 0.5) / 2.0) * (h - 2 * pad);
        return [sx, sy];
    }

    function draw() {
        const dataset = DATASETS[datasetSelect.value];
        const w = canvas.width / window.devicePixelRatio;
        const h = canvas.height / window.devicePixelRatio;
        const pad = 45;

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
        dataset.forEach((pt, idx) => {
            const [sx, sy] = toScreen(pt.x1, pt.x2, w, h, pad);
            const predicted = (state.w1 * pt.x1 + state.w2 * pt.x2 + state.bias) >= 0 ? 1 : 0;
            const isCorrect = predicted === pt.label;
            const isCurrent = (state.currentMisclassified !== null && state.currentMisclassified === idx);

            // Highlight ring for current point
            if (isCurrent) {
                ctx.beginPath();
                ctx.arc(sx, sy, 18, 0, Math.PI * 2);
                ctx.strokeStyle = '#fbbf24';
                ctx.lineWidth = 3;
                ctx.stroke();
            }

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

        // Info text
        ctx.fillStyle = '#6b7280';
        ctx.font = '11px Inter, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(`Epoch: ${state.epoch}  |  w₁=${state.w1.toFixed(3)}  w₂=${state.w2.toFixed(3)}  b=${state.bias.toFixed(3)}`, pad, pad - 12);
    }

    function trainOneStep() {
        if (state.converged) return false;
        const dataset = DATASETS[datasetSelect.value];
        const lr = parseFloat(lrSlider.value);

        // Check if full epoch completed
        if (state.sampleIdx >= dataset.length) {
            // Check convergence
            let allCorrect = true;
            dataset.forEach(pt => {
                const pred = (state.w1 * pt.x1 + state.w2 * pt.x2 + state.bias) >= 0 ? 1 : 0;
                if (pred !== pt.label) allCorrect = false;
            });

            state.epoch++;
            state.sampleIdx = 0;

            if (allCorrect) {
                state.converged = true;
                state.currentMisclassified = null;
                state.logs.push(`\n✓ Converged after Epoch ${state.epoch}! All points correctly classified.`);
                logDiv.textContent = state.logs.join('\n');
                logDiv.scrollTop = logDiv.scrollHeight;
                statusDot.className = 'status-dot';
                statusText.textContent = `Converged at Epoch ${state.epoch}`;
                playBtn.textContent = '▶ Play';
                state.running = false;
                draw();
                return false;
            }

            if (state.epoch > 50) {
                state.converged = true;
                state.logs.push(`\n✗ Max epochs (50) reached. Training stopped.`);
                logDiv.textContent = state.logs.join('\n');
                logDiv.scrollTop = logDiv.scrollHeight;
                statusDot.className = 'status-dot';
                statusText.textContent = 'Max epochs reached';
                playBtn.textContent = '▶ Play';
                state.running = false;
                draw();
                return false;
            }
        }

        const pt = dataset[state.sampleIdx];
        const predicted = (state.w1 * pt.x1 + state.w2 * pt.x2 + state.bias) >= 0 ? 1 : 0;
        const error = pt.label - predicted;

        if (error !== 0) {
            state.currentMisclassified = state.sampleIdx;
            state.w1 += lr * error * pt.x1;
            state.w2 += lr * error * pt.x2;
            state.bias += lr * error;
            state.logs.push(`E${state.epoch + 1} Sample(${pt.x1},${pt.x2}): pred=${predicted} actual=${pt.label} → update w₁=${state.w1.toFixed(3)} w₂=${state.w2.toFixed(3)} b=${state.bias.toFixed(3)}`);
        } else {
            state.currentMisclassified = null;
            state.logs.push(`E${state.epoch + 1} Sample(${pt.x1},${pt.x2}): pred=${predicted} actual=${pt.label} → correct`);
        }

        // Keep only last 30 logs
        if (state.logs.length > 30) state.logs = state.logs.slice(-30);

        logDiv.textContent = state.logs.join('\n');
        logDiv.scrollTop = logDiv.scrollHeight;

        state.sampleIdx++;
        statusText.textContent = `Epoch ${state.epoch + 1}, Sample ${state.sampleIdx}/${dataset.length}`;
        draw();
        return true;
    }

    function playLoop() {
        if (!state.running) return;
        const cont = trainOneStep();
        if (cont) {
            state.animId = setTimeout(playLoop, 400);
        }
    }

    playBtn.addEventListener('click', () => {
        if (state.converged) return;
        state.running = !state.running;
        if (state.running) {
            playBtn.textContent = '⏸ Pause';
            statusDot.className = 'status-dot running';
            playLoop();
        } else {
            playBtn.textContent = '▶ Play';
            statusDot.className = 'status-dot paused';
        }
    });

    stepBtn.addEventListener('click', () => {
        if (state.converged) return;
        state.running = false;
        playBtn.textContent = '▶ Play';
        statusDot.className = 'status-dot paused';
        trainOneStep();
    });

    resetBtn.addEventListener('click', reset);
    datasetSelect.addEventListener('change', reset);

    lrSlider.addEventListener('input', () => {
        lrVal.textContent = parseFloat(lrSlider.value).toFixed(2);
    });

    window.addEventListener('resize', () => {
        resizeCanvas();
        draw();
    });

    document.addEventListener('DOMContentLoaded', () => {
        resizeCanvas();
        draw();
    });

    setTimeout(() => {
        resizeCanvas();
        draw();
    }, 100);
})();
