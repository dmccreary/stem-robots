// Listens for postMessage height reports from diagram-overlay MicroSims
// (docs/sims/shared-libs/diagram.js) and resizes their iframe to match,
// so the infographic never clips or leaves extra blank space.
window.addEventListener('message', function (event) {
    if (!event.data || event.data.type !== 'microsim-resize') return;
    var iframes = document.querySelectorAll('iframe');
    for (var i = 0; i < iframes.length; i++) {
        if (iframes[i].contentWindow === event.source) {
            iframes[i].style.height = event.data.height + 'px';
            break;
        }
    }
});
