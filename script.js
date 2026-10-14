const progressBar = document.querySelector("#scroll-progress");
const navigationLinks = [...document.querySelectorAll(".main-nav a[href^='#']")];
const navigationSections = navigationLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

let updateScheduled = false;

const updatePageState = () => {
    const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollableHeight > 0 ? window.scrollY / scrollableHeight : 0;

    document.documentElement.style.setProperty("--background-shift", `${window.scrollY * 0.16}px`);

    if (progressBar) {
        progressBar.style.transform = `scaleX(${Math.min(1, Math.max(0, progress))})`;
    }

    let activeSection = navigationSections[0];
    navigationSections.forEach((section) => {
        if (section.getBoundingClientRect().top <= 150) {
            activeSection = section;
        }
    });

    navigationLinks.forEach((link) => {
        const isActive = activeSection && link.hash === `#${activeSection.id}`;
        link.classList.toggle("is-active", Boolean(isActive));
        if (isActive) {
            link.setAttribute("aria-current", "location");
        } else {
            link.removeAttribute("aria-current");
        }
    });
    updateScheduled = false;
};

window.addEventListener("scroll", () => {
    if (!updateScheduled) {
        window.requestAnimationFrame(updatePageState);
        updateScheduled = true;
    }
}, { passive: true });

window.addEventListener("resize", updatePageState);
updatePageState();
