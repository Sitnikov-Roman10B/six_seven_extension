const UpdatePage = () =>{
    if (!document.body) {
        const observer = new MutationObserver(() => {
            if (document.body) {
                observer.disconnect();
                UpdatePage();
            }
        });
        observer.observe(document.documentElement, { childList: true });
        return;
    }
    let wordCounter = 0;
    let digitCounter = 0;
    const forbiddenTags = ['SCRIPT', 'STYLE', 'TEXTAREA', 'INPUT', 'NOSCRIPT', 'CODE', 'CANVAS', 'SVG'];
    function transformString(text) {
        let tokens = text.split(/([\p{L}]+|\d+)/gu);
        for (let i = 0; i < tokens.length; i++) {
            let token = tokens[i];
            if (/[\p{L}]+/u.test(token)) {
                wordCounter++;
                tokens[i] = (wordCounter % 2 !== 0) ? "six" : "seven";
            } else if (/\d+/.test(token)) {
                let new_n = "";
                for (let n = 0; n < token.length; n++) {
                    digitCounter++;
                    new_n += (digitCounter % 2 !== 0) ? "6" : "7";
                }
                tokens[i] = new_n;
            }
        }
        return tokens.join("");
    }

    function replaceAlternating(node) {
        if (!node) return;

        if (node.nodeType === 1 && (node.tagName === 'INPUT' || node.tagName === 'TEXTAREA')) {
            if (node.placeholder) {
                node.placeholder = transformString(node.placeholder);
            }
            if (node.tagName === 'INPUT') return;
        }

        if (node.nodeType === 1 && forbiddenTags.includes(node.tagName)) return;

        let child = node.firstChild;
        while (child) {
            if (child.nodeType === 3) {
                const newText = transformString(child.nodeValue);
                if (newText !== child.nodeValue) {
                    child.nodeValue = newText;
                }
            } 
            else if (child.nodeType === 1) {
                replaceAlternating(child);
            }
            child = child.nextSibling;
        }
    }
    
    if (document.head) replaceAlternating(document.head);
    if (document.body) replaceAlternating(document.body);

    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            for (const node of mutation.addedNodes) {
                if (node.nodeType === 1) replaceAlternating(node);
            }
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
}
UpdatePage();