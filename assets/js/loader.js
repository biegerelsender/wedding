const scriptBasePath = "../assets/js/";  // Adjust based on /docs/ location

const scripts = [
    "jquery.min.js",  // Ensure jQuery loads first
    "jquery.scrollex.min.js",
    "jquery.scrolly.min.js",
    "browser.min.js",
    "breakpoints.min.js",
    "util.js",
    "main.js",
    "rsvp.js"
];

function loadScript(scriptSrc, callback) {
    const script = document.createElement("script");
    script.src = scriptBasePath + scriptSrc;
    script.defer = true; 

    script.onload = () => {
        console.log(`${scriptSrc} loaded`);
        if (callback) callback();
    };

    script.onerror = () => console.error(`Error loading ${scriptSrc}`);

    document.body.appendChild(script);
}

// Load jQuery first, then load other scripts
loadScript("jquery.min.js", () => {
    scripts.slice(1).forEach(scriptSrc => loadScript(scriptSrc));
});
