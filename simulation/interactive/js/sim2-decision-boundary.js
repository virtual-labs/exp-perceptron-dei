/**
 * Sim 2: Decision Boundary Visualizer
 * Interactive canvas showing how weights rotate/shift the boundary
 */
(function () {
    const canvas = document.getElementById('sim2Canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const w1Slider = document.getElementById('sim2W1');
    const w2Slider = document.getElementById('sim2W2');
    const biasSlider = document.getElementById('sim2Bias');
    const datasetSelect = document.getElementById('sim2Dataset');

    const w1Val = document.getElementById('sim2W1Val');
    const w2Val = document.getElementById('sim2W2Val');
    const biasVal = document.getElementById('sim2BiasVal');
    const statusText = document.getElementById('sim2StatusText');

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
        ],
        XOR: [
            { x1: 0, x2: 0, label: 0 },
            { x1: 0, x2: 1, label: 1 },
            { x1: 1, x2: 0, label: 1 },
            { x1: 1, x2: 1, label: 0 }
        ]
    };

    function resizeCanvas() {
        const rect = canvas.parentElement.getBoundingClientRect();
        canvas.width = rect.width * window.devicePixelRatio;
        canvas.height = rect.height * window.devicePixelRatio;
        canvas.style.width = rect.width + 'px';
        canvas.style.height = rect.height + 'px';
        ctx.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
    }

    function toScreen(x, y, w, h, pad) {
        const rangeX = 2.0; // -0.5 to 1.5
        const rangeY = 2.0;
        const sx = pad + ((x + 0.5) / rangeX) * (w - 2 * pad);
        const sy = (h - pad) - ((y + 0.5) / rangeY) * (h - 2 * pad);
        return [sx, sy];
    }

    function draw() {
        const w1 = parseFloat(w1Slider.value);
        const w2 = parseFloat(w2Slider.value);
        const bias = parseFloat(biasSlider.value);
        const dataset = DATASETS[datasetSelect.value];

        const w = canvas.width / window.devicePixelRatio;
        const h = canvas.height / window.devicePixelRatio;
        const pad = 50;

        ctx.clearRect(0, 0, w, h);

        // ── Shaded regions ──
        const resolution = 4;
        for (let px = pad; px < w - pad; px += resolution) {
            for (let py = pad; py < h - pad; py += resolution) {
                // Convert screen to data coords
                const dataX = ((px - pad) / (w - 2 * pad)) * 2.0 - 0.5;
                const dataY = ((h - pad - py) / (h - 2 * pad)) * 2.0 - 0.5;
                const val = w1 * dataX + w2 * dataY + bias;
                if (val >= 0) {
                    ctx.fillStyle = 'rgba(238, 242, 255, 0.6)'; // indigo tint
                } else {
                    ctx.fillStyle = 'rgba(254, 226, 226, 0.5)'; // red tint
                }
                ctx.fillRect(px, py, resolution, resolution);
            }
        }

        // ── Grid ──
        ctx.strokeStyle = '#e5e7eb';
        ctx.lineWidth = 0.5;
        for (let i = 0; i <= 4; i++) {
            const gx = -0.5 + i * 0.5;
            const [sx] = toScreen(gx, 0, w, h, pad);
            ctx.beginPath(); ctx.moveTo(sx, pad); ctx.lineTo(sx, h - pad); ctx.stroke();
            const [, sy] = toScreen(0, gx, w, h, pad);
            ctx.beginPath(); ctx.moveTo(pad, sy); ctx.lineTo(w - pad, sy); ctx.stroke();
        }

        // ── Axes ──
        ctx.strokeStyle = '#9ca3af';
        ctx.lineWidth = 1;
        const [axOX, axOY] = toScreen(-0.5, 0, w, h, pad);
        const [axEX] = toScreen(1.5, 0, w, h, pad);
        ctx.beginPath(); ctx.moveTo(pad, axOY); ctx.lineTo(w - pad, axOY); ctx.stroke();
        const [, axTY] = toScreen(0, 1.5, w, h, pad);
        const [axBX] = toScreen(0, 0, w, h, pad);
        ctx.beginPath(); ctx.moveTo(axBX, pad); ctx.lineTo(axBX, h - pad); ctx.stroke();

        // Axis labels
        ctx.fillStyle = '#6b7280';
        ctx.font = '11px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('x₁', w - pad + 15, axOY + 4);
        ctx.fillText('x₂', axBX, pad - 10);

        // Tick labels
        ctx.font = '9px Inter, sans-serif';
        for (let i = 0; i <= 3; i++) {
            const v = i * 0.5;
            const [tx, ty] = toScreen(v, 0, w, h, pad);
            ctx.fillText(v.toFixed(1), tx, ty + 14);
            const [, tty] = toScreen(0, v, w, h, pad);
            ctx.textAlign = 'right';
            ctx.fillText(v.toFixed(1), axBX - 6, tty + 3);
            ctx.textAlign = 'center';
        }

        // ── Decision boundary ──
        if (Math.abs(w2) > 0.001 || Math.abs(w1) > 0.001) {
            ctx.strokeStyle = '#6366f1';
            ctx.lineWidth = 2.5;
            ctx.setLineDash([]);
            ctx.beginPath();

            if (Math.abs(w2) > 0.001) {
                const x_start = -0.5;
                const x_end = 1.5;
                const y_start = -(w1 * x_start + bias) / w2;
                const y_end = -(w1 * x_end + bias) / w2;
                const [sx1, sy1] = toScreen(x_start, y_start, w, h, pad);
                const [sx2, sy2] = toScreen(x_end, y_end, w, h, pad);
                ctx.moveTo(sx1, sy1);
                ctx.lineTo(sx2, sy2);
            } else {
                const bx = -bias / w1;
                const [sx] = toScreen(bx, 0, w, h, pad);
                ctx.moveTo(sx, pad);
                ctx.lineTo(sx, h - pad);
            }
            ctx.stroke();

            // Boundary label
            ctx.fillStyle = '#065f46';
            ctx.font = 'bold 10px Inter, sans-serif';
            ctx.textAlign = 'left';
            if (Math.abs(w2) > 0.001) {
                const labelX = 0.8;
                const labelY = -(w1 * labelX + bias) / w2;
                const [slx, sly] = toScreen(labelX, labelY, w, h, pad);
                ctx.fillText('w₁x₁+w₂x₂+b=0', slx + 5, sly - 8);
            }
        }

        // ── Data points ──
        let correct = 0;
        dataset.forEach(pt => {
            const [sx, sy] = toScreen(pt.x1, pt.x2, w, h, pad);
            const predicted = (w1 * pt.x1 + w2 * pt.x2 + bias) >= 0 ? 1 : 0;
            const isCorrect = predicted === pt.label;
            if (isCorrect) correct++;

            ctx.beginPath();
            ctx.arc(sx, sy, 10, 0, Math.PI * 2);
            ctx.fillStyle = pt.label === 1 ? '#ef4444' : '#3b82f6';
            ctx.fill();
            ctx.strokeStyle = isCorrect ? '#fff' : '#fbbf24';
            ctx.lineWidth = isCorrect ? 2 : 3;
            ctx.stroke();

            // Label
            ctx.fillStyle = '#fff';
            ctx.font = 'bold 10px Inter, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(pt.label, sx, sy);
            ctx.textBaseline = 'alphabetic';
        });

        // Status
        const acc = ((correct / dataset.length) * 100).toFixed(0);
        statusText.textContent = `Accuracy: ${acc}% (${correct}/${dataset.length} correct)`;

        // Update value displays
        w1Val.textContent = w1.toFixed(2);
        w2Val.textContent = w2.toFixed(2);
        biasVal.textContent = bias.toFixed(2);
    }

    [w1Slider, w2Slider, biasSlider, datasetSelect].forEach(el => {
        el.addEventListener('input', draw);
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
