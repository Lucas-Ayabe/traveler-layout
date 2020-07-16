document.documentElement.className += " js";

const select = (query) => document.querySelector(query);
const selectAll = (query) => document.querySelectorAll(query);
const classList = (element) => element.classList;
const toggleClass = (element) => (className) => {
    return classList(element).toggle(className);
};
const fromEvent = (event) => (element) => (handler) => {
    return element.addEventListener(event, handler);
};
const scrollTo = (element) => {
    return (
        options = {
            behavior: "smooth",
            block: "start",
        }
    ) => element.scrollIntoView(options);
};

function hamburgerFactory(
    triggerQuery = ".hamburger[data-target]",
    activeClass = "is-active"
) {
    const trigger = select(triggerQuery);
    const target = triggerQuery ? select(trigger.dataset.target) : null;

    return {
        trigger: trigger,
        target,
        activeClass,
        toggleMenu() {
            if (this.target && this.trigger) {
                this.target.classList.toggle(this.activeClass);
                this.trigger.classList.toggle(this.activeClass);
            }
        },
        bindMethods() {
            this.toggleMenu = this.toggleMenu.bind(this);
        },
        addEvents(events = ["click"]) {
            events.forEach((event) => {
                const onEvent = fromEvent(event);
                const onEventInTrigger = onEvent(this.trigger);
                onEventInTrigger(this.toggleMenu);
            });
        },
        init() {
            this.bindMethods();
            this.addEvents();

            return this;
        },
    };
}

function smoothScrollFactory(
    linksQuery = ".nav__link[data-internal-link]",
    options = {
        behavior: "smooth",
        block: "start",
    }
) {
    const links = selectAll(linksQuery);
    const hamburger = hamburgerFactory().init();

    return {
        links,
        options,
        addEvents() {
            const onClick = fromEvent("click");

            this.links.forEach((link) => {
                const onClickInLink = onClick(link);

                onClickInLink((event) => {
                    const {
                        target: { hash },
                    } = event;
                    const elementToScroll = select(hash);

                    if (elementToScroll) {
                        const scrollToElement = scrollTo(elementToScroll);
                        scrollToElement(this.options);
                    }

                    event.preventDefault();
                    hamburger.toggleMenu();
                });
            });
        },
        init() {
            this.addEvents();

            return this;
        },
    };
}

function stickyHeaderFactory(
    headerQuery = ".header",
    activeClass = "is-active"
) {
    const header = select(headerQuery);

    return {
        header,
        bindMethods() {
            this.toggleHeader = this.toggleHeader.bind(this);
        },
        addEvents() {
            const onScroll = fromEvent("scroll");
            const onScrollInWindow = onScroll(window);
            onScrollInWindow(this.toggleHeader);
        },
        toggleHeader() {
            const headerClassList = classList(this.header);

            if (window.scrollY > 50) headerClassList.add(activeClass);
            else headerClassList.remove(activeClass);
        },
        init() {
            this.bindMethods();
            this.addEvents();

            return this;
        },
    };
}

const smoothScroll = smoothScrollFactory();
smoothScroll.init();

const stickyHeader = stickyHeaderFactory();
stickyHeader.init();
stickyHeader.toggleHeader();
