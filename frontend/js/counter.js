// 計數器 CounterUp 邏輯
export function initCounters() {
    const counterUp = window.counterUp.default;
    const callback = entries => {
        entries.forEach(entry => {
            const el = entry.target;
            if (entry.isIntersecting && !el.classList.contains('is-visible')) {
                counterUp(el, { duration: 1000, delay: 16 });
                el.classList.add('is-visible');
            }
        });
    };
    const IO = new IntersectionObserver(callback, { threshold: 0.2 });
    for (let i = 1; i <= 4; i++) {
        const elTarget = document.querySelector(`.cyber-counter-number0${i}`);
        if (elTarget) IO.observe(elTarget);
    }
}