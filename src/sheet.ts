function toggleSummaryElement(el: HTMLElement) {
    const duration = 0.4;

    if (el.hidden) {
        gsap.fromTo(
            el,
            { height: 0, opacity: 0, hidden: false },
            { height: "auto", opacity: 1, duration }
        );
    } else {
        gsap.to(el, {
            height: 0,
            duration,
            opacity: 0,
            paddingTop: 0,
            paddingBottom: 0,
            margin: 0,
            clearProps: "all",
            onComplete: () => {
                el.hidden = true;
            },
        });
    }
}

export { toggleSummaryElement };
