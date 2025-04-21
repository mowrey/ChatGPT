(function() {
    'use strict';

    // --- Configuration ---
    const targetSelector = 'button[data-testid="voice-play-turn-action-button"]';
    const observeTargetNode = document.body;
    const observerConfig = {
        childList: true,
        subtree: true
    };
    const debounceDelay = 150; // ms

    // --- Script Logic ---
    console.clear();
    console.log(`[Smart AutoClicker] Watching for new last instance of: "${targetSelector}"`);
    let debounceTimeout = null;
    let observer = null;
    let lastClickedElement = null; // Stores the reference to the last clicked element

    function findAndClickIfNew() {
        const matchingElements = observeTargetNode.querySelectorAll(targetSelector);

        if (matchingElements.length > 0) {
            const currentLastElement = matchingElements[matchingElements.length - 1];

            // Click only if this element is DIFFERENT from the one last clicked
            if (currentLastElement !== lastClickedElement) {
                console.clear(); // Clear console before logging our action
                console.log(`[Smart AutoClicker] New last element found. Clicking it:`, currentLastElement);
                try {
                    currentLastElement.click();
                    lastClickedElement = currentLastElement; // Track the clicked element
                    console.log("[Smart AutoClicker] Clicked. Now tracking this element.");
                } catch (e) {
                    console.error("[Smart AutoClicker] Error clicking element:", e, currentLastElement);
                }
            }
        } else {
            // Reset tracking if the element disappears
            if (lastClickedElement !== null) {
                 console.log("[Smart AutoClicker] Target element no longer found. Resetting tracking.");
                 lastClickedElement = null;
            }
        }
    }

    const mutationCallback = function(mutationsList, obs) {
        // Debounce the check
        clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(() => {
            findAndClickIfNew();
        }, debounceDelay);
    };

    // --- Initialization ---
    console.log("[Smart AutoClicker] Performing initial check...");
    findAndClickIfNew(); // Initial check

    observer = new MutationObserver(mutationCallback);
    observer.observe(observeTargetNode, observerConfig); // Start observing
    console.log("[Smart AutoClicker] Observer started. Continuously watching...");

})();
