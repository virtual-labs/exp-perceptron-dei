/**
 * Perceptron Simulation - Main JavaScript
 * Handles cell execution, step state management, and dynamic output based on hyperparameters
 */

// ============================================
// Configuration
// ============================================

const CONFIG = {
    executionDelay: 1500,
    chartAnimationDuration: 1000,
    totalSteps: 7,
};

// ============================================
// State Management
// ============================================

const state = {
    currentStep: 1,
    completedSteps: new Set(),
    runningStep: null,
    charts: {},
    epochCharts: [], // Store charts for each epoch
    isRunningAll: false,
    operation: 'OR',
    lr: 0.1
};

// ============================================
// DOM Elements
// ============================================

const elements = {
    stepItems: document.querySelectorAll('.step-item'),
    cells: document.querySelectorAll('.notebook-cell'),
    downloadBtn: document.getElementById('downloadBtn'),
    resetBtn: document.getElementById('resetBtn'),
    completionMessage: document.getElementById('completionMessage'),
    loadingOverlay: document.getElementById('loadingOverlay'),
    operationSelect: document.getElementById('operationSelect'),
    lrSelect: document.getElementById('lrSelect'),
    trainingLog: document.getElementById('trainingLog'),
    codeLr: document.getElementById('codeLr'),
    codeW1: document.getElementById('codeW1'),
    codeW2: document.getElementById('codeW2'),
    codeB: document.getElementById('codeB'),
    initialParams: document.getElementById('initialParams'),
    finalAccuracy: document.getElementById('finalAccuracy'),
    datasetLabels: document.getElementById('datasetLabels'),
    datasetTable: document.getElementById('datasetTable'),
    plotTitle: document.getElementById('plotTitle'),
    boundaryTitle: document.getElementById('boundaryTitle'),
    predictionsTable: document.getElementById('predictionsTable')
};

// ============================================
// Helper Functions
// ============================================

function downloadExperiment() {
    const link = document.createElement('a');
    link.href = './assets/Perceptron.pdf';
    link.download = 'Perceptron_Experiment.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function getDataKey() {
    return `${state.operation}_${state.lr}`;
}

function getCurrentData() {
    const key = getDataKey();
    return EXPERIMENT_DATA[key] || null;
}

function updateCodeDisplay() {
    const data = getCurrentData();
    if (!data) return;

    if (elements.codeLr) elements.codeLr.textContent = state.lr;
    if (elements.codeW1) elements.codeW1.textContent = data.initial_params.w1.toFixed(1);
    if (elements.codeW2) elements.codeW2.textContent = data.initial_params.w2.toFixed(1);
    if (elements.codeB) elements.codeB.textContent = data.initial_params.b.toFixed(1);

    const labels = state.operation === 'OR' ? '[0, 1, 1, 1]' : '[0, 1, 1, 0]';
    if (elements.datasetLabels) {
        elements.datasetLabels.innerHTML = labels.split('').map((char) => {
            if (char === '0' || char === '1') {
                return `<span class="number">${char}</span>`;
            }
            return char;
        }).join('');
    }

    if (elements.plotTitle) {
        elements.plotTitle.textContent = `"${state.operation} Dataset Plot"`;
    }
    if (elements.boundaryTitle) {
        elements.boundaryTitle.textContent = `"${state.operation} Dataset with Initial Random Decision Boundary"`;
    }
}

function updateDatasetTable() {
    const data = getCurrentData();
    if (!data || !elements.datasetTable) return;

    elements.datasetTable.innerHTML = data.dataset.map(row => `
        <tr>
            <td>${row.x1}</td>
            <td>${row.x2}</td>
            <td>${row.label}</td>
        </tr>
    `).join('');
}

function updateInitialParams() {
    const data = getCurrentData();
    if (!data || !elements.initialParams) return;

    elements.initialParams.textContent = 
`Initial Parameters:
w1 = ${data.initial_params.w1.toFixed(3)}, w2 = ${data.initial_params.w2.toFixed(3)}, b = ${data.initial_params.b.toFixed(3)}
Learning Rate = ${state.lr}`;
}

function updateTrainingOutput() {
    const data = getCurrentData();
    if (!data || !elements.trainingLog) return;

    // Create enhanced training log with epoch charts
    let logHTML = '';
    
    data.training_epochs.forEach((epochData, index) => {
        logHTML += `<div class="epoch-section">`;
        logHTML += `<h4>----EPOCH ${epochData.epoch}----</h4>`;
        logHTML += `<p>Accuracy after Epoch ${epochData.epoch}: ${epochData.accuracy.toFixed(2)}%</p>`;
        logHTML += `<p>Updated Weights -> w1=${epochData.w1.toFixed(3)}, w2=${epochData.w2.toFixed(3)}, b=${epochData.b.toFixed(3)}</p>`;
        logHTML += `<div class="epoch-chart-container"><canvas id="epochChart${epochData.epoch}"></canvas></div>`;
        logHTML += `</div>`;
    });

    elements.trainingLog.innerHTML = logHTML;

    // Render charts for each epoch after DOM is updated
    setTimeout(() => {
        data.training_epochs.forEach((epochData) => {
            renderEpochChart(epochData.epoch, epochData.w1, epochData.w2, epochData.b);
        });
    }, 100);

    if (elements.finalAccuracy) {
        elements.finalAccuracy.textContent = `${data.final_accuracy.toFixed(2)}%`;
    }

    if (elements.predictionsTable) {
        elements.predictionsTable.innerHTML = data.final_predictions.map(pred => `
            <tr>
                <td>(${pred.x1}, ${pred.x2})</td>
                <td>${pred.predicted}</td>
                <td>${pred.actual}</td>
            </tr>
        `).join('');
    }
}

function renderEpochChart(epoch, w1, w2, b) {
    const canvas = document.getElementById(`epochChart${epoch}`);
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const data = getCurrentData();
    if (!data) return;

    const class0 = data.dataset.filter(d => d.label === 0);
    const class1 = data.dataset.filter(d => d.label === 1);

    const xVals = [-0.5, 1.5];
    const yVals = xVals.map(x => w2 !== 0 ? -(w1 * x + b) / w2 : 0);

    const chart = new Chart(ctx, {
        type: 'scatter',
        data: {
            datasets: [{
                label: 'Class 0',
                data: class0.map(d => ({x: d.x1, y: d.x2})),
                backgroundColor: 'blue',
                pointRadius: 8
            }, {
                label: 'Class 1',
                data: class1.map(d => ({x: d.x1, y: d.x2})),
                backgroundColor: 'red',
                pointRadius: 8
            }, {
                label: 'Decision Boundary',
                data: [{x: xVals[0], y: yVals[0]}, {x: xVals[1], y: yVals[1]}],
                type: 'line',
                borderColor: 'green',
                borderWidth: 2,
                fill: false,
                pointRadius: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: `Decision Boundary After Epoch ${epoch}`,
                    font: { size: 14 }
                },
                legend: {
                    display: true,
                    position: 'top'
                }
            },
            scales: {
                x: {
                    title: { display: true, text: 'x1' },
                    min: -0.5,
                    max: 1.5
                },
                y: {
                    title: { display: true, text: 'x2' },
                    min: -0.5,
                    max: 1.5
                }
            }
        }
    });

    state.epochCharts.push(chart);
}

function renderDatasetChart() {
    const canvas = document.getElementById('datasetChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const data = getCurrentData();
    if (!data) return;

    if (state.charts.datasetChart) {
        state.charts.datasetChart.destroy();
    }

    const class0 = data.dataset.filter(d => d.label === 0);
    const class1 = data.dataset.filter(d => d.label === 1);

    state.charts.datasetChart = new Chart(ctx, {
        type: 'scatter',
        data: {
            datasets: [{
                label: 'Class 0',
                data: class0.map(d => ({x: d.x1, y: d.x2})),
                backgroundColor: 'blue',
                pointRadius: 8
            }, {
                label: 'Class 1',
                data: class1.map(d => ({x: d.x1, y: d.x2})),
                backgroundColor: 'red',
                pointRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                title: {
                    display: true,
                    text: `${state.operation} Dataset Plot`,
                    font: { size: 16 }
                },
                legend: {
                    display: true,
                    position: 'top'
                }
            },
            scales: {
                x: {
                    title: { display: true, text: 'x1' },
                    min: -0.5,
                    max: 1.5
                },
                y: {
                    title: { display: true, text: 'x2' },
                    min: -0.5,
                    max: 1.5
                }
            }
        }
    });
}

function renderInitialBoundaryChart() {
    const canvas = document.getElementById('initialBoundaryChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const data = getCurrentData();
    if (!data) return;

    if (state.charts.initialBoundaryChart) {
        state.charts.initialBoundaryChart.destroy();
    }

    const class0 = data.dataset.filter(d => d.label === 0);
    const class1 = data.dataset.filter(d => d.label === 1);

    const w1 = data.initial_params.w1;
    const w2 = data.initial_params.w2;
    const b = data.initial_params.b;

    const xVals = [-0.5, 1.5];
    const yVals = xVals.map(x => w2 !== 0 ? -(w1 * x + b) / w2 : 0);

    state.charts.initialBoundaryChart = new Chart(ctx, {
        type: 'scatter',
        data: {
            datasets: [{
                label: 'Class 0',
                data: class0.map(d => ({x: d.x1, y: d.x2})),
                backgroundColor: 'blue',
                pointRadius: 10
            }, {
                label: 'Class 1',
                data: class1.map(d => ({x: d.x1, y: d.x2})),
                backgroundColor: 'red',
                pointRadius: 10
            }, {
                label: 'Decision Boundary',
                data: [{x: xVals[0], y: yVals[0]}, {x: xVals[1], y: yVals[1]}],
                type: 'line',
                borderColor: 'green',
                borderWidth: 2,
                fill: false,
                pointRadius: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                title: {
                    display: true,
                    text: `${state.operation} Dataset with Initial Random Decision Boundary`,
                    font: { size: 16 }
                },
                legend: {
                    display: true,
                    position: 'top'
                }
            },
            scales: {
                x: {
                    title: { display: true, text: 'x1' },
                    min: -0.5,
                    max: 1.5
                },
                y: {
                    title: { display: true, text: 'x2' },
                    min: -0.5,
                    max: 1.5
                }
            }
        }
    });
}

// ============================================
// Step Management
// ============================================

function updateStepState(stepNumber, status) {
    const stepItem = document.querySelector(`.step-item[data-step="${stepNumber}"]`);
    const cell = document.querySelector(`.notebook-cell[data-step="${stepNumber}"]`);
    
    if (!stepItem) return;
    
    stepItem.classList.remove('active', 'running', 'completed');
    if (cell) {
        cell.classList.remove('running', 'completed');
    }
    
    switch (status) {
        case 'active':
            stepItem.classList.add('active');
            break;
        case 'running':
            stepItem.classList.add('running');
            if (cell) cell.classList.add('running');
            state.runningStep = stepNumber;
            break;
        case 'completed':
            stepItem.classList.add('completed');
            if (cell) cell.classList.add('completed');
            state.completedSteps.add(stepNumber);
            break;
    }
}

function setNextStepActive() {
    const nextStep = Math.min(state.currentStep + 1, CONFIG.totalSteps);
    if (!state.completedSteps.has(nextStep)) {
        updateStepState(nextStep, 'active');
        state.currentStep = nextStep;
    }
}

function canRunCell(cellNumber) {
    for (let i = 1; i < cellNumber; i++) {
        if (!state.completedSteps.has(i)) {
            return false;
        }
    }
    return true;
}

function resetFromStep(fromStep) {
    // Destroy charts
    if (fromStep <= 3 && state.charts.datasetChart) {
        state.charts.datasetChart.destroy();
        state.charts.datasetChart = null;
    }
    if (fromStep <= 5 && state.charts.initialBoundaryChart) {
        state.charts.initialBoundaryChart.destroy();
        state.charts.initialBoundaryChart = null;
    }
    if (fromStep <= 7) {
        state.epochCharts.forEach(chart => chart.destroy());
        state.epochCharts = [];
    }
    
    for (let i = fromStep; i <= CONFIG.totalSteps; i++) {
        state.completedSteps.delete(i);
        
        const stepItem = document.querySelector(`.step-item[data-step="${i}"]`);
        const cell = document.querySelector(`.notebook-cell[data-step="${i}"]`);
        
        if (stepItem) {
            stepItem.classList.remove('active', 'running', 'completed');
        }
        
        if (cell) {
            cell.classList.remove('running', 'completed');
            const output = cell.querySelector('.cell-output');
            const runBtn = cell.querySelector('.run-btn');
            
            if (output) output.classList.add('hidden');
            if (runBtn) {
                runBtn.disabled = false;
                runBtn.classList.remove('running');
                runBtn.innerHTML = `
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M8 5v14l11-7z"/>
                    </svg>
                    Run
                `;
            }
        }
    }
    
    if (fromStep > 1 && state.completedSteps.has(fromStep - 1)) {
        state.currentStep = fromStep;
        updateStepState(fromStep, 'active');
    } else {
        state.currentStep = fromStep;
        updateStepState(fromStep, 'active');
    }
    
    if (elements.completionMessage) {
        elements.completionMessage.classList.add('hidden');
    }
}

// ============================================
// Cell Execution
// ============================================

async function executeCell(cellNumber) {
    const cell = document.querySelector(`.notebook-cell[data-cell="${cellNumber}"]`);
    const stepNumber = parseInt(cell.dataset.step);
    const output = cell.querySelector('.cell-output');
    const runBtn = cell.querySelector('.run-btn');
    
    if (state.completedSteps.has(stepNumber)) {
        return;
    }
    
    if (!canRunCell(cellNumber)) {
        alert(`Please run all previous cells first before running Step ${cellNumber}.`);
        return;
    }
    
    updateStepState(stepNumber, 'running');
    runBtn.classList.add('running');
    runBtn.disabled = true;
    runBtn.innerHTML = `
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" class="spinning">
            <path d="M12 4V2A10 10 0 0 0 2 12h2a8 8 0 0 1 8-8z"/>
        </svg>
        Running...
    `;
    
    const spinner = runBtn.querySelector('.spinning');
    if (spinner) {
        spinner.style.animation = 'spin 1s linear infinite';
    }
    
    await new Promise(resolve => setTimeout(resolve, CONFIG.executionDelay));
    
    if (cellNumber === 2) {
        updateDatasetTable();
    } else if (cellNumber === 3) {
        renderDatasetChart();
    } else if (cellNumber === 4) {
        updateInitialParams();
    } else if (cellNumber === 5) {
        renderInitialBoundaryChart();
    } else if (cellNumber === 7) {
        updateTrainingOutput();
    }
    
    output.classList.remove('hidden');
    
    updateStepState(stepNumber, 'completed');
    runBtn.classList.remove('running');
    runBtn.innerHTML = `
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
        </svg>
        Done
    `;
    
    setNextStepActive();
    
    if (state.completedSteps.size === CONFIG.totalSteps && elements.completionMessage) {
        elements.completionMessage.classList.remove('hidden');
    }
}

// ============================================
// Event Listeners
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // Run buttons for individual cells
    elements.cells.forEach((cell, index) => {
        const runBtn = cell.querySelector('.run-btn');
        if (runBtn) {
            runBtn.addEventListener('click', () => {
                executeCell(index + 1);
            });
        }
    });

    // Step items (sidebar navigation)
    elements.stepItems.forEach((item) => {
        item.addEventListener('click', () => {
            const stepNumber = parseInt(item.dataset.step);
            const cell = document.querySelector(`.notebook-cell[data-step="${stepNumber}"]`);
            if (cell) {
                cell.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        });
    });

    // Reset button
    if (elements.resetBtn) {
        elements.resetBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to reset the experiment? This will clear all progress.')) {
                state.completedSteps.clear();
                state.currentStep = 1;
                state.runningStep = null;
                
                // Destroy all charts
                Object.values(state.charts).forEach(chart => {
                    if (chart) chart.destroy();
                });
                state.charts = {};
                
                // Destroy epoch charts
                state.epochCharts.forEach(chart => chart.destroy());
                state.epochCharts = [];
                
                resetFromStep(1);
                updateStepState(1, 'active');
            }
        });
    }

    // Download button
    if (elements.downloadBtn) {
        elements.downloadBtn.addEventListener('click', downloadExperiment);
    }

    // Hyperparameter selectors
    if (elements.operationSelect) {
        elements.operationSelect.addEventListener('change', (e) => {
            state.operation = e.target.value;
            updateCodeDisplay();
            
            if (state.completedSteps.size > 0) {
                resetFromStep(2);
            }
        });
    }

    if (elements.lrSelect) {
        elements.lrSelect.addEventListener('change', (e) => {
            state.lr = parseFloat(e.target.value);
            updateCodeDisplay();
            
            if (state.completedSteps.size >= 4) {
                resetFromStep(4);
            }
        });
    }

    // Set initial active step
    updateStepState(1, 'active');
    
    // Initialize dynamic displays
    updateCodeDisplay();
    
    console.log('Perceptron Simulation initialized');
});
