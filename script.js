const set24HourTime = (bool) => {
    CONFIGS.timeIn24 = bool;
    renderYEAR();
}

const CELL_SIZE = 22;

const COLORS = [
    [
        'hsl(355, 74%, 57%)', 'hsl(359, 62%, 64%)', 'hsl(7, 76%, 45%)',
        'hsl(341, 69%, 60%)', 'hsl(6, 66%, 51%)', 'hsl(1, 79%, 72%)',
        'hsl(353, 64%, 37%)', 'hsl(0, 74%, 41%)', 'hsl(357, 76%, 62%)',
    ], [
        'hsl(13, 93%, 67%)', 'hsl(17, 81%, 74%)', 'hsl(25, 95%, 55%)',
        'hsl(359, 88%, 70%)', 'hsl(28, 85%, 61%)', 'hsl(19, 98%, 82%)',
        'hsl(11, 83%, 47%)', 'hsl(18, 93%, 51%)', 'hsl(15, 95%, 72%)',
    ], [
        'hsl(28, 26%, 60%)', 'hsl(32, 14%, 77%)', 'hsl(40, 28%, 48%)',
        'hsl(14, 21%, 63%)', 'hsl(48, 18%, 54%)', 'hsl(34, 31%, 75%)',
        'hsl(26, 16%, 40%)', 'hsl(33, 26%, 44%)', 'hsl(35, 28%, 66%)',
    ], [
        'hsl(41, 94%, 65%)', 'hsl(45, 82%, 72%)', 'hsl(55, 96%, 50%)',
        'hsl(29, 89%, 68%)', 'hsl(55, 76%, 59%)', 'hsl(47, 99%, 80%)',
        'hsl(39, 84%, 45%)', 'hsl(46, 94%, 49%)', 'hsl(43, 96%, 70%)',
    ], [
        'hsl(74, 44%, 59%)', 'hsl(78, 22%, 66%)', 'hsl(86, 46%, 47%)',
        'hsl(62, 39%, 62%)', 'hsl(91, 30%, 53%)', 'hsl(80, 49%, 74%)',
        'hsl(72, 34%, 39%)', 'hsl(79, 44%, 43%)', 'hsl(74, 42%, 64%)',
    ], [
        'hsl(124, 49%, 49%)', 'hsl(128, 37%, 56%)', 'hsl(136, 51%, 37%)',
        'hsl(110, 44%, 52%)', 'hsl(141, 41%, 43%)', 'hsl(137, 54%, 64%)',
        'hsl(122, 24%, 29%)', 'hsl(129, 49%, 33%)', 'hsl(126, 51%, 59%)',
    ], [
        'hsl(167, 60%, 52%)', 'hsl(171, 48%, 68%)', 'hsl(187, 62%, 35%)',
        'hsl(148, 55%, 58%)', 'hsl(184, 52%, 49%)', 'hsl(173, 75%, 70%)',
        'hsl(165, 45%, 27%)', 'hsl(169, 60%, 37%)', 'hsl(155, 62%, 60%)',
    ], [
        'hsl(199, 66%, 53%)', 'hsl(203, 54%, 75%)', 'hsl(211, 68%, 49%)',
        'hsl(185, 61%, 56%)', 'hsl(216, 58%, 47%)', 'hsl(205, 71%, 68%)',
        'hsl(197, 45%, 42%)', 'hsl(204, 76%, 30%)', 'hsl(195, 84%, 63%)',
    ], [
        'hsl(213, 27%, 71%)', 'hsl(217, 15%, 78%)', 'hsl(225, 36%, 59%)',
        'hsl(199, 22%, 74%)', 'hsl(230, 19%, 65%)', 'hsl(219, 32%, 89%)',
        'hsl(215, 17%, 38%)', 'hsl(222, 23%, 55%)', 'hsl(215, 29%, 76%)',
    ], [
        'hsl(249, 88%, 74%)', 'hsl(253, 76%, 81%)', 'hsl(261, 67%, 55%)',
        'hsl(235, 83%, 77%)', 'hsl(269, 80%, 68%)', 'hsl(255, 93%, 91%)',
        'hsl(247, 57%, 41%)', 'hsl(254, 88%, 58%)', 'hsl(251, 90%, 79%)',
    ], [
        'hsl(324, 85%, 71%)', 'hsl(331, 70%, 78%)', 'hsl(342, 87%, 59%)',
        'hsl(310, 80%, 74%)', 'hsl(344, 77%, 65%)', 'hsl(333, 90%, 86%)',
        'hsl(323, 75%, 51%)', 'hsl(332, 85%, 55%)', 'hsl(329, 87%, 76%)'
    ]
]

const DEFAULT_KEYS = [
    {}
]

let CONFIGS = {
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
    window.requestAnimationFrame(() => window.requestAnimationFrame(() => {
        document.getElementById('selection').scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline: 'center'
        });
    }))
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

let YEAR = {
    cells: new Uint8Array(48 * daysInYear((new Date()).getFullYear())),
    year: (new Date()).getFullYear(),
}

renderYEAR();
selectCell(0);