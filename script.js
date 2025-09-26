const set24HourTime = (bool) => {
    CONFIGS.timeIn24 = bool;
    renderYEAR();
}

const CELL_SIZE = 22;
const CONFIGS = {
    timeIn24: false,
    dark: false
}

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
        const months = [
            {name: 'Jan', days: 31},
            {name: 'Feb', days: isLeap(YEAR.year) ? 29 : 28},
            {name: 'Mar', days: 31},
            {name: 'Apr', days: 30},
            {name: 'May', days: 31},
            {name: 'Jun', days: 30},
            {name: 'Jul', days: 31},
            {name: 'Aug', days: 31},
            {name: 'Sep', days: 30},
            {name: 'Oct', days: 31},
            {name: 'Nov', days: 30},
            {name: 'Dec', days: 31}
        ]
        let monthId = 0;
        let daysOfMonth = 0;

        document.getElementById('dates').replaceChildren(...new Array(rows).fill(0).map((_, i) => {
            const div = document.createElement('div');
            div.appendChild(document.createTextNode(`${months[monthId].name} ${daysOfMonth + 1}`));
            daysOfMonth++;
            if (daysOfMonth === months[monthId].days) {
                daysOfMonth = 0;
                monthId++;
            }
            return div;
        }));

        document.getElementById('times').replaceChildren(...new Array(cols + 1).fill(0).map((_, i) => {
            const div = document.createElement('div');
            const maxHour = CONFIGS.timeIn24 ? 24 : 12;
            const hour = `${(i >> 1) % maxHour || maxHour}`;
            const minute = i % 2 === 0 ? '00' : '30';
            const period = (i % 48) < 24 ? 'AM' : 'PM';
            div.appendChild(document.createTextNode(`${hour}:${minute}${CONFIGS.timeIn24 ? '' : ` ${period}`}`));
            return div;
        }));

        document.getElementById('yearslot').replaceChildren(document.createTextNode(`'${YEAR.year % 100}`))
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
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    }

    setupCanvas();

    const drawGridlines = () => {

        ctx.strokeStyle = "#13111d44";

        for (let i = 1; i < rows; i++) {
            ctx.moveTo(0.5, i * CELL_SIZE - 0.5);
            ctx.lineTo(canvasWidth + 0.5, i * CELL_SIZE - 0.5);
        }

        for (let i = 1; i < cols; i++) {
            ctx.moveTo(i * CELL_SIZE - 0.5, 0 - 0.5);
            ctx.lineTo(i * CELL_SIZE - 0.5, canvasHeight - 0.5);
        }

        ctx.lineWidth = 1;
        ctx.stroke();
    }

    const drawCells = () => {
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                // const index = row * 48 + col;
            }
        }
    }

    drawCells();
    drawGridlines();
}

const selectCell = (index) => {
    document.getElementById('selection').style.left = `${(index % 48) * CELL_SIZE}px`;
    document.getElementById('selection').style.top = `${Math.floor(index / 48) * CELL_SIZE}px`;
}

const handleCanvasClick = (event) => {
    const canvas = document.getElementById('canvas');
    const canvasRect = canvas.getBoundingClientRect();
    const x = event.clientX + canvas.scrollLeft - canvasRect.left;
    const y = event.clientY + canvas.scrollTop - canvasRect.top;
    const xIndex = Math.floor(x / CELL_SIZE);
    const yIndex = Math.floor(y / CELL_SIZE);
    const index = yIndex * 48 + xIndex;
    selectCell(index);
}

const YEAR = {
    cells: new Uint8Array(48 * daysInYear((new Date()).getFullYear())),
    year: (new Date()).getFullYear(),
}

renderYEAR()
selectCell(0);