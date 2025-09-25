const CELL_SIZE = 22;

const isLeap = (year) => {
    return ((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0);
}

const daysInYear = (year) => {
    return isLeap(year) ? 366 : 365;
}

const renderYEAR = () => {
    const rows = daysInYear(YEAR.year);
    const cols = 48;

    const renderDatetimes = () => {
        document.getElementById('dates').replaceChildren(...new Array(rows).fill(0).map((_, i) => {
            const div = document.createElement('div');
            div.appendChild(document.createTextNode(`January ${i}`));
            return div;
        }));

        document.getElementById('times').replaceChildren(...new Array(cols + 1).fill(0).map((_, i) => {
            const div = document.createElement('div');
            div.appendChild(document.createTextNode(`${i % 48}:00`));
            return div;
        }));
    }

    renderDatetimes();

    const canvasWidth = CELL_SIZE * cols;
    const canvasHeight = CELL_SIZE * rows;

    const ctx = document.getElementById('canvas').getContext('2d');

    const setupCanvas = () => {
        document.getElementById('canvas').setAttribute('width', `${canvasWidth}`);
        document.getElementById('canvas').style.width = `${canvasWidth}px`;
        document.getElementById('canvas').setAttribute('height', `${canvasHeight}`);
        document.getElementById('canvas').style.height = `${canvasHeight}px`;
    }

    setupCanvas();

    const drawGridlines = () => {

        for (let i = 1; i < rows; i++) {
            ctx.moveTo(0.5, i * CELL_SIZE - 0.5);
            ctx.lineTo(canvasWidth + 0.5, i * CELL_SIZE - 0.5);
        }

        for (let i = 1; i < cols; i++) {
            ctx.moveTo(i * CELL_SIZE - 0.5, 0 - 0.5);
            ctx.lineTo(i * CELL_SIZE - 0.5, canvasHeight - 0.5);
        }

        ctx.lineWidth = 1;
        ctx.strokeStyle = "#00000044";
        ctx.stroke();
    }

    const drawCells = () => {
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                // const index = row * 48 + col;
                if (Math.random() < 0.5) continue;
                ctx.fillStyle = 'lime';
                ctx.fillRect(col * CELL_SIZE, row * CELL_SIZE, CELL_SIZE, CELL_SIZE);
            }
        }
    }

    drawCells();
    drawGridlines();

}

const YEAR = {
    cells: new Uint8Array(48 * daysInYear((new Date()).getFullYear())),
    year: (new Date()).getFullYear(),
}

renderYEAR()