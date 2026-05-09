// Tab Navigation
document.addEventListener('DOMContentLoaded', () => {
    const tabBtns = document.querySelectorAll('.tab-btn[data-tab]');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.dataset.tab;

            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));

            btn.classList.add('active');
            const el = document.getElementById(target);
            if (el) el.classList.add('active');

            // Re-trigger canvas sizing after tab becomes visible
            requestAnimationFrame(() => {
                window.dispatchEvent(new Event('resize'));
            });
        });
    });
});
