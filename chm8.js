
(async () => {
    console.log("hello")

    const { Chess } = await import(browser.runtime.getURL("chess.js"));
    const chess = new Chess();

    const stockfish = new Worker(browser.runtime.getURL("stockfish.js"));
    const alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    stockfish.onmessage = function (event) {
        let msg = event.data;

        if (!msg.startsWith("bestmove")) return;

        while(document.getElementsByClassName("custom-hl").length > 0)
            document.getElementsByClassName("custom-hl")[0].remove();

        console.log(msg);

        let bestMove = msg.split(" ")[1];

        console.log(bestMove);

        let from = bestMove.substring(0, 2);
        let to = bestMove.substring(2, 4);

        console.log(from)
        console.log(to)

        let white = document.getElementsByClassName("orientation-white").length > 0;
        console.log(white);

        let x1 = alphabet.indexOf(from.substring(0, 1));
        let y1 = from.substring(1, 2) - 1;

        let x2 = alphabet.indexOf(to.substring(0, 1));
        let y2 = to.substring(1, 2) - 1;

        console.log(x1)

        /*let line = document.createElement("line");
        line.setAttribute("stroke", "#15781B");
        line.setAttribute("stoke-width", "0.15625");
        line.setAttribute("stroke-linecap", "round");
        line.setAttribute("marker-end", "url(#arrowhead-g)");
        line.setAttribute("opacity", "1");
        line.setAttribute("x1", "-2.5");
        line.setAttribute("y1", "1.5");
        line.setAttribute("x2", "-2.5");
        line.setAttribute("y2", "0.65625");
        line.setAttribute("cgHash", "416,416,g6,g5,green")

        //let cg = document.getElementById("cg-container")[0];
        //let size = cg.getAttribute("style").split("width: ")[1].split("px")[0];

   

        document.getElementsByClassName("cg-shapes")[0].appendChild(line);
        console.log(line)*/

        for (let i = 0; i < 2; i++) {
            let pos = i == 0 ? from : to;
    
            // Creating highlight div
            let highlight = document.createElement('square');
    
            let x = alphabet.indexOf(pos.substring(0, 1));
            let y = pos.substring(1, 2) - 1;
    
            if (!white) {
                x = 7 - x;
            } else {
                y = 7 - y;
            }
    
            let cg = document.getElementsByTagName('cg-container')[0];
            let style = cg.getAttribute('style');
            let w = style.split('width: ')[1].split('px')[0];
    
            let size = w / 8;
    
            highlight.setAttribute('class', 'custom-hl');
            highlight.setAttribute('style', 'background: rgb(255, 0, 0); opacity: 0.5; transform: translate(' + (x * size) + 'px, ' + (y * size) + 'px);');
    
            // Adding as first element
            cg.insertBefore(highlight, document.getElementsByTagName('cg-board')[0].nextSibling);
        }

    };

    let currentFen = "";

    function tick() {
        let moves = document.getElementsByTagName("l4x")[0];

        if (!moves)
            return;

        chess.reset();

        for (let tag of moves.children) {

            if (tag.tagName == "I5Z" || tag.tagName == "DIV") continue;

            let move = tag.innerHTML;

            chess.move(move);
        }

        let fen = chess.fen();

        if (currentFen == fen) {
            return;
        }

        currentFen = fen;

        console.log("scanning -> fen " + fen)
        stockfish.postMessage("position fen " + fen);
        stockfish.postMessage("go depth 10");
    }


    setInterval(tick, 50);

})();


