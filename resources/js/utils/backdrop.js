// this should solve backdrop problem , but not working

export function assignBackdrop(selector) {
    const el = document.querySelector(selector);
    if (!el) return;

    removeBackdrop();
    el.classList.add("backdrop");
}

export function removeBackdrop() {
    document.querySelectorAll(".backdrop").forEach((el) => {
        el.classList.remove("backdrop");
    });
}
