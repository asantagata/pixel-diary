const set24HourTime = (bool) => {
    CONFIGS.timeIn24 = bool;
    toRerender.info = true;
    setConfigsInStorage();
}

const CELL_SIZE = 22;
const CHARS = `\`1234567890ú-=qwertyuiop[]óasdfghjkl;'zxcvbnm,íá./~!@#$%^&*()_+QWERTYUIOP{é}|ASDFGHJKL:\\"ZXCVBNM<>? `;
const FROMCHARS = {...Object.fromEntries(CHARS.split('').map((x, i) => [x, i])), ' ': 255};
let YEAR = null;
let CONFIGS = null;
let SELECTION = 0;
let toRerender = {
    info: false,
    canvas: false,
    palette: false,
}
let DATABASE = null;

const DEFAULT_PALETTE = () => {
    return [
        {
            name: 'Necessities', color: 7, subs: [
                {name: 'Eating', color: 1},
                {name: 'Hygiene', color: 3},
                {name: 'Exercise', color: 0},
                {name: 'Sleep', color: 6}
            ]
        },
        {
            name: 'Leisure', color: 1, subs: [
                {name: 'Social media', color: 3},
                {name: 'TV', color: 2},
                {name: 'Games', color: 8},
                {name: 'Hobbies', color: 1}
            ]
        },
        {
            name: 'Work', color: 6, subs: []
        },
        {
            name: 'Social', color: 10, subs: [
                {name: 'Seeing friends', color: 4},
                {name: 'Seeing family', color: 5},
                {name: 'Events', color: 3}
            ]
        },
        {
            name: 'Errands', color: 3, subs: [
                {name: 'Shopping', color: 2},
                {name: 'Cleaning', color: 5},
                {name: 'Cooking', color: 3},
                {name: 'Appointments', color: 7}
            ]
        },
        {
            name: 'Transit', color: 8, subs: []
        }
    ];
}

const COLORS = [
    'hsl(355, 74%, 57%)', 'hsl(359, 62%, 64%)', 'hsl(7, 76%, 45%)',
    'hsl(341, 69%, 60%)', 'hsl(6, 66%, 51%)', 'hsl(1, 79%, 72%)',
    'hsl(353, 64%, 37%)', 'hsl(0, 74%, 41%)', 'hsl(359, 76%, 64%)',

    'hsl(13, 93%, 67%)', 'hsl(17, 81%, 74%)', 'hsl(25, 95%, 55%)',
    'hsl(359, 88%, 70%)', 'hsl(28, 85%, 61%)', 'hsl(19, 98%, 82%)',
    'hsl(11, 83%, 47%)', 'hsl(18, 93%, 51%)', 'hsl(12,95%,77%)',

    'hsl(28, 26%, 60%)', 'hsl(32, 14%, 77%)', 'hsl(40, 28%, 48%)',
    'hsl(14, 21%, 63%)', 'hsl(48, 18%, 54%)', 'hsl(34, 31%, 75%)',
    'hsl(26, 16%, 40%)', 'hsl(33, 26%, 44%)', 'hsl(35, 28%, 68%)',

    'hsl(39, 94%, 65%)', 'hsl(45, 82%, 72%)', 'hsl(55, 96%, 50%)',
    'hsl(29, 89%, 68%)', 'hsl(52, 76%, 59%)', 'hsl(47, 99%, 80%)',
    'hsl(39, 84%, 45%)', 'hsl(46, 94%, 49%)', 'hsl(45, 96%, 70%)',

    'hsl(74, 44%, 59%)', 'hsl(78, 22%, 66%)', 'hsl(86, 46%, 47%)',
    'hsl(62, 39%, 50%)', 'hsl(91, 30%, 53%)', 'hsl(80, 49%, 74%)',
    'hsl(72, 34%, 39%)', 'hsl(79, 44%, 43%)', 'hsl(74, 42%, 64%)',

    'hsl(124, 49%, 49%)', 'hsl(128, 37%, 74%)', 'hsl(136,75%,33%)',
    'hsl(102, 44%, 52%)', 'hsl(141, 41%, 43%)', 'hsl(137, 54%, 64%)',
    'hsl(122, 18%, 29%)', 'hsl(129, 35%, 33%)', 'hsl(126, 51%, 59%)',

    'hsl(167, 60%, 52%)', 'hsl(171, 48%, 68%)', 'hsl(187, 62%, 35%)',
    'hsl(150, 55%, 58%)', 'hsl(184, 52%, 49%)', 'hsl(173, 75%, 70%)',
    'hsl(165, 45%, 27%)', 'hsl(169, 60%, 37%)', 'hsl(154, 62%, 60%)',

    'hsl(199, 66%, 53%)', 'hsl(203, 54%, 75%)', 'hsl(211, 68%, 49%)',
    'hsl(188, 61%, 56%)', 'hsl(216, 58%, 47%)', 'hsl(205, 71%, 68%)',
    'hsl(197, 45%, 42%)', 'hsl(204, 76%, 30%)', 'hsl(194, 84%, 63%)',

    'hsl(213, 27%, 71%)', 'hsl(217, 15%, 78%)', 'hsl(225, 36%, 59%)',
    'hsl(199, 22%, 74%)', 'hsl(230, 19%, 65%)', 'hsl(219, 32%, 89%)',
    'hsl(215, 17%, 38%)', 'hsl(222, 23%, 55%)', 'hsl(215, 29%, 76%)',

    'hsl(249, 88%, 74%)', 'hsl(253, 76%, 81%)', 'hsl(261, 67%, 55%)',
    'hsl(235, 83%, 77%)', 'hsl(269, 80%, 68%)', 'hsl(255, 93%, 91%)',
    'hsl(247, 57%, 41%)', 'hsl(254, 88%, 58%)', 'hsl(251, 94%, 79%)',

    'hsl(324, 85%, 71%)', 'hsl(331, 70%, 78%)', 'hsl(342, 87%, 59%)',
    'hsl(310, 80%, 74%)', 'hsl(344, 77%, 65%)', 'hsl(333, 90%, 86%)',
    'hsl(323, 75%, 51%)', 'hsl(332, 85%, 55%)', 'hsl(332, 87%, 76%)'
]

const WHITE_TEXT = [
    true,true,true,true,true,true,true,true,true,
    true,false,true,true,true,false,true,true,false,
    true,false,true,true,true,false,true,true,false,
    false,false,false,false,false,false,true,false,false,
    true,false,true,true,true,false,true,true,false,
    true,false,true,true,true,false,true,true,true,
    true,false,true,true,true,false,true,true,true,
    true,false,true,true,true,true,true,true,true,
    true,false,true,false,true,false,true,true,true,
    true,true,true,true,true,false,true,true,true,
    true,false,true,true,true,false,true,true,true
];

const isLeap = (year) => {
    return ((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0);
}

const daysInYear = (year) => {
    return isLeap(year) ? 366 : 365;
}

const cellsToString = (cells) => {
    return Array.from(cells, (byte, i) => byte === 255 ? CHARS[99] : CHARS[byte]).join('');
}

const stringToCells = (string) => {
    return string.split('').map(char => FROMCHARS[char]);
}

const getDateList = (year) => {
    const leap = isLeap(year);
    const totalDays = daysInYear(year);
    const months = [
        {name: 'Jan', days: 31},
        {name: 'Feb', days: leap ? 29 : 28},
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
    const dateList = [];
    for (let i = 0; i < totalDays; i++) {
        dateList.push(`${months[monthId].name} ${daysOfMonth + 1}`);
        daysOfMonth++;
        if (daysOfMonth === months[monthId].days) {
            monthId++;
            daysOfMonth = 0;
        }
    }
    return dateList;
}

const getTimeStr = (i) => {
    const maxHour = CONFIGS.timeIn24 ? 24 : 12;
    const hour = `${(i >> 1) % maxHour || maxHour}`;
    const minute = i % 2 === 0 ? '00' : '30';
    const period = (i % 48) < 24 ? 'AM' : 'PM';
    return `${hour}:${minute}${CONFIGS.timeIn24 ? '' : ` ${period}`}`;
}

const renderYEARInfo = () => {
    const rows = daysInYear(YEAR.year);
    const cols = 48;

    const renderDatetimes = () => {


        document.getElementById('dates').replaceChildren(
            (() => {
                const span = document.createElement('span');
                span.id = 'selection-h';
                return span;
            })(),

            ...getDateList(YEAR.year).map(date => {
                const div = document.createElement('div');
                div.appendChild(document.createTextNode(date));
                return div;
            })
        );

        document.getElementById('times').replaceChildren(

            (() => {
                const span = document.createElement('span');
                span.id = 'selection-v';
                return span;
            })(),

            ...newRange(cols + 1).map(i => {
            const div = document.createElement('div');
            div.appendChild(document.createTextNode(getTimeStr(i)));
            return div;
        }));

        document.getElementById('yearslot').replaceChildren(document.createTextNode(`'${YEAR.year % 100}`))
    }

    renderDatetimes();
}

const renderYEARCanvas = () => {
    const rows = daysInYear(YEAR.year);
    const cols = 48;

    const canvasWidth = CELL_SIZE * cols;
    const canvasHeight = CELL_SIZE * rows;

    const setupCanvas = () => {
        document.getElementById('canvas').setAttribute('width', `${canvasWidth}`);
        document.getElementById('canvas').style.width = `${canvasWidth}px`;
        document.getElementById('canvas').setAttribute('height', `${canvasHeight}`);
        document.getElementById('canvas').style.height = `${canvasHeight}px`;
        document.getElementById('grid').style.height = `calc(var(--bordered-cell-size) * ${daysInYear(YEAR.year)})`;
    }

    setupCanvas();

    const ctx = document.getElementById('canvas').getContext('2d');

    const drawGridlines = () => {

        ctx.strokeStyle = "#13111d44";
        ctx.beginPath();

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
                const index = row * 48 + col;
                const colorIndex = YEAR.cells[index];
                if (colorIndex !== 255) {
                    ctx.fillStyle = COLORS[colorIndex];
                    ctx.fillRect(col * CELL_SIZE, row * CELL_SIZE, CELL_SIZE, CELL_SIZE);
                }
            }
        }
        ctx.fill();
    }

    drawCells();
    drawGridlines();

    return ctx;
}

const renderYEARPalette = () => {
    const ctx = document.getElementById('canvas').getContext('2d');
    document.getElementById('palette').replaceChildren(...[
        {isTop: true, subs: YEAR.activities},
        ...YEAR.activities.filter(x => x.subs.length > 0)
    ].map(activity => {
        const panel = document.createElement('div');
        panel.className = 'panel'
        panel.id = `panel-${activity.isTop ? 'home' : activity.color}`;
        const childCount = activity.subs.length + 1;
        const rowCount = Math.ceil(childCount / 3);
        panel.replaceChildren(...[...activity.subs, ...(activity.isTop ? [{isErase: true}] : [{isHome: true}])].map(sub => {
            const button = document.createElement('div');
            button.className = 'button center';
            button.style.width = `calc((100% - ${rowCount - 1}ch) / ${rowCount})`;
            if (sub.isHome) {
                button.style.background = 'var(--gentle)';
                button.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-house-icon lucide-house"><path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/><path d="M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>`;
            } else if (sub.isErase) {
                button.style.background = 'var(--gentle)';
                button.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-delete-icon lucide-delete"><path d="M10 5a2 2 0 0 0-1.344.519l-6.328 5.74a1 1 0 0 0 0 1.481l6.328 5.741A2 2 0 0 0 10 19h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2z"/><path d="m12 9 6 6"/><path d="m18 9-6 6"/></svg>`;
            } else {
                const colorIndex = activity.isTop ? sub.color * 9 : activity.color * 9 + sub.color;
                button.id = `button-${colorIndex}`;
                button.style.background = COLORS[colorIndex];
                if (!WHITE_TEXT[colorIndex]) {
                    button.classList.add('dark-text');
                }
                if (activity.isTop && sub.subs.length > 0) {
                    button.classList.add('parent-button');
                }
                const label = document.createElement('div');
                label.className = 'button-label';
                const text = document.createTextNode(sub.name);
                label.appendChild(text);
                button.appendChild(label);
            }
            if (activity.isTop && !sub.isErase && sub.subs.length > 0) {
                button.addEventListener('click', () => {
                    document.getElementById('palette').className = `panel-${sub.color}`;
                });
            } else if (sub.isHome) {
                button.addEventListener('click', () => {
                    document.getElementById('palette').className = 'panel-home';
                });
            } else {
                button.addEventListener('click', () => {
                    const colorId = sub.isErase ? 255 : activity.isTop ? (sub.color * 9) : (activity.color * 9 + sub.color);
                    paintSELECTION(ctx, colorId)
                });
            }
            return button;
        }));
        return panel;
    }))
}

const highlightSELECTIONColor = () => {
    document.querySelector('.button.selected')?.classList.remove('selected');
    document.getElementById(`button-${YEAR.cells[SELECTION]}`)?.classList.add('selected');
}

const gotoSELECTIONPalettePage = () => {
    const color = YEAR.cells[SELECTION];
    if (color !== 255) {
        const colorGroup = Math.floor(color / 9);
        const activity = YEAR.activities.find(a => a.color === colorGroup);
        if (activity.subs.length === 0) {
            document.getElementById('palette').className = 'panel-home';
        } else {
            document.getElementById('palette').className = `panel-${colorGroup}`;
        }
    }
}

const paintSELECTION = (ctx, colorId) => {
    const row = Math.floor(SELECTION / 48) * CELL_SIZE;
    const col = (SELECTION % 48) * CELL_SIZE;
    if (colorId === 255) {
        ctx.clearRect(col, row, CELL_SIZE, CELL_SIZE);
    } else {
        ctx.fillStyle = COLORS[colorId];
        ctx.fillRect(col, row, CELL_SIZE, CELL_SIZE);
    }
    ctx.beginPath();
    if (SELECTION % 48 !== 47) {
        ctx.moveTo(col + CELL_SIZE - 0.5, row - 0.5);
        ctx.lineTo(col + CELL_SIZE - 0.5, row + CELL_SIZE - 0.5);
    }
    if (Math.floor(SELECTION / 48) < daysInYear(YEAR.year) - 1) {
        ctx.moveTo(col - 0.5, row + CELL_SIZE - 0.5);
        ctx.lineTo(col + CELL_SIZE - 0.5, row + CELL_SIZE - 0.5);
    }
    ctx.stroke();
    YEAR.cells[SELECTION] = colorId;
    if (colorId === 255) {
        selectCell(SELECTION - 1, false);
    } else {
        selectCell(SELECTION + 1, false);
    }
    setYEARPixelsInDATABASE();
}

const selectCell = (indexIn, adapt = true) => {
    const index = Math.max(0, Math.min(YEAR.cells.length, indexIn));
    const calendar = document.getElementById('calendar');
    const calendarRect = calendar.getBoundingClientRect();
    document.getElementById('selection').style.right =
        `${calendarRect.width - calendar.scrollWidth + (48 - (index % 48)) * CELL_SIZE - CELL_SIZE}px`;
    document.getElementById('selection-v').style.left = `${(index % 48) * CELL_SIZE}px`;

    document.getElementById('selection').style.bottom =
        `${calendarRect.height - calendar.scrollHeight + (daysInYear(YEAR.year) - Math.floor(index / 48)) * CELL_SIZE - CELL_SIZE + 2}px`;
    document.getElementById('selection-h').style.top = `${Math.floor(index / 48) * CELL_SIZE}px`;

    window.requestAnimationFrame(() => window.requestAnimationFrame(() => {
        document.getElementById('selection').scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline: 'center'
        });
    }));
    SELECTION = index;
    highlightSELECTIONColor();
    if (adapt)
        gotoSELECTIONPalettePage();
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

const renderColorsMenu = () => {
    const liOfActivity = (act, parent = null) => {
        const li = document.createElement('div');
        li.className = 'activity';
        const myColorId = parent ? (parent.color * 9 + act.color) : (act.color * 9);
        const swatch = document.createElement('span');
        swatch.className = 'swatch';
        swatch.style.background = COLORS[myColorId];
        swatch.addEventListener('click', () => {
            const colorIds = newRange(parent ? 9 : 11);
            const swatches = document.createElement('div');
            swatches.className = 'swatches';
            swatches.replaceChildren(...colorIds.map(colorId => {
                const swatch = document.createElement('span');
                swatch.className = 'swatch';
                swatch.style.background = parent ? COLORS[parent.color * 9 + colorId] : COLORS[colorId * 9];
                if (colorId === act.color) {
                    swatch.className = 'swatch shadowed'
                }
                swatch.addEventListener('click', () => {
                    if (colorId !== act.color) {
                        toRerender.palette = true;
                        toRerender.canvas = true;
                        const opponent = parent
                            ? parent.subs.find(sub => sub.color === colorId)
                            : YEAR.activities.find(sub => sub.color === colorId);

                        if (opponent) {
                            if (parent) {
                                swapPixels(parent.color * 9 + colorId, parent.color * 9 + act.color);
                            } else if (act.subs.length === 0 && opponent.subs.length === 0) {
                                swapPixels(colorId * 9, act.color * 9);
                            } else if (act.subs.length === 0) {
                                replacePixels(new Map([
                                    [act.color * 9, opponent.color * 9],
                                    ...newRange(9).map(i => [opponent.color * 9 + i, act.color * 9 + i])
                                ]));
                            } else if (opponent.subs.length === 0) {
                                replacePixels(new Map([
                                    [opponent.color * 9, act.color * 9],
                                    ...newRange(9).map(i => [act.color * 9 + i, opponent.color * 9 + i])
                                ]));
                            } else {
                                replacePixels(new Map([
                                    ...newRange(9).map(i => [opponent.color * 9 + i, act.color * 9 + i]),
                                    ...newRange(9).map(i => [act.color * 9 + i, opponent.color * 9 + i])
                                ]));
                            }
                        } else {
                            if (parent) {
                                replacePixels(new Map([
                                    [parent.color * 9 + act.color, parent.color * 9 + colorId]
                                ]));
                            } else if (act.subs.length === 0) {
                                replacePixels(new Map([
                                    [act.color * 9, colorId * 9]
                                ]));
                            } else {
                                replacePixels(new Map(
                                    newRange(9).map(i => [act.color * 9 + i, colorId * 9 + i])
                                ));
                            }
                        }

                        if (opponent) {
                            opponent.color = act.color;
                        }
                        act.color = colorId;
                    }
                    document.getElementById('mini-modal-wrapper').style.display = 'none';
                    renderColorsMenu();
                })
                return swatch;
            }));
            summonMiniModal(swatches);
        })

        li.appendChild(swatch);
        const input = document.createElement('input');
        input.type = 'text';
        input.maxLength = 30;
        input.addEventListener('change', (e) => {
            act.name = e.target.value;
            toRerender.palette = true;
        });
        input.value = act.name;
        input.placeholder = 'Name';
        const xButton = document.createElement('span');
        xButton.className = 'x-button act-button';
        xButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x-icon lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>`;
        xButton.addEventListener('click', () => {

            if (parent && !YEAR.cells.includes(myColorId)) {
                parent.subs = parent.subs.filter(sub => sub.color !== act.color);
                renderColorsMenu();
                toRerender.palette = true;
                return;
            } else if (!parent &&
                ((act.subs.length === 0 && !YEAR.cells.includes(myColorId)) ||
            (act.subs.length > 0
                && newRange(9).every(
                    i => !YEAR.cells.includes(act.color * 9 + i)
                )))
            ) {
                YEAR.activities = YEAR.activities.filter(sub => sub.color !== act.color);
                renderColorsMenu();
                toRerender.palette = true;
                return;
            }

            const getReplacerFn = (newColor) => {
                return () => {
                    if (parent) {
                        parent.subs = parent.subs.filter(sub => sub.color !== act.color);
                        renderColorsMenu();
                        toRerender.palette = true;
                        replacePixels(new Map([[myColorId, newColor]]));
                        toRerender.canvas = true;
                        document.getElementById('mini-modal-wrapper').style.display = 'none';
                    } else {
                        YEAR.activities = YEAR.activities.filter(sub => sub.color !== act.color);
                        renderColorsMenu();
                        toRerender.palette = true;
                        if (act.subs.length === 0) {
                            replacePixels(new Map([[myColorId, newColor]]));
                        } else {
                            replacePixels(new Map(
                                newRange(9).map(i => [myColorId + i, newColor])
                            ));
                        }
                        toRerender.canvas = true;
                        document.getElementById('mini-modal-wrapper').style.display = 'none';
                    }
                }
            }

            const activitiesDiv = document.createElement('div');
            activitiesDiv.className = 'select-activity';
            const activities = parent
                ? YEAR.activities
                    .map(act => act.subs.length > 0
                        ? [act.subs.map(sub => {return {...sub, color: act.color * 9 + sub.color}})]
                        : {...act, color: act.color * 9})
                    .flat(2)
                    .filter(act => act.color !== myColorId)
                : YEAR.activities
                    .filter(activity => activity.color !== act.color)
                    .map(act => act.subs.length > 0
                        ? [act.subs.map(sub => {return {...sub, color: act.color * 9 + sub.color}})]
                        : {...act, color: act.color * 9})
                    .flat(2);

            const eraseDiv = document.createElement('div');
            eraseDiv.className = 'button';
            eraseDiv.style.background = 'var(--gentle)';
            eraseDiv.addEventListener('click', getReplacerFn(255));
            eraseDiv.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-eraser-icon lucide-eraser"><path d="M21 21H8a2 2 0 0 1-1.42-.587l-3.994-3.999a2 2 0 0 1 0-2.828l10-10a2 2 0 0 1 2.829 0l5.999 6a2 2 0 0 1 0 2.828L12.834 21"/><path d="m5.082 11.09 8.828 8.828"/></svg>';

            activitiesDiv.replaceChildren(...activities.map(replaceAct => {
                const li = document.createElement('div');
                li.className = 'button';
                li.style.background = COLORS[replaceAct.color];
                if (!WHITE_TEXT[replaceAct.color]) {
                    li.classList.add('dark-text');
                }
                li.replaceChildren(document.createTextNode(replaceAct.name || 'Untitled'));
                li.addEventListener('click', getReplacerFn(replaceAct.color));
                return li;
            }), eraseDiv);

            const name = document.createElement('span');
            name.className = 'inline-button';
            name.style.background = COLORS[myColorId];
            if (!WHITE_TEXT[myColorId]) {
                name.classList.add('dark-text');
            }
            name.replaceChildren(document.createTextNode(act.name));

            const modalDiv = document.createElement('div');
            modalDiv.replaceChildren(
                document.createTextNode(`Choose an activity for `),
                name,
                document.createTextNode(` pixels to use instead:`),
                activitiesDiv
            )
            summonMiniModal(modalDiv);
        });

        li.appendChild(swatch);
        li.appendChild(input);

        if (!parent) {
            if (act.subs.length === 0) {
                const categorify = document.createElement('span');
                categorify.className = 'act-button';
                categorify.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-grid2x2-icon lucide-grid-2x2"><path d="M12 3v18"/><path d="M3 12h18"/><rect x="3" y="3" width="18" height="18" rx="2"/></svg>`;

                categorify.addEventListener('click', () => {
                    const sub1ColorId = 0;
                    const sub2ColorId = Math.floor(Math.random() * 8) + 1;
                    act.subs = [
                        {name: '', color: sub1ColorId},
                        {name: '', color: sub2ColorId}
                    ];
                    renderColorsMenu();
                    toRerender.palette = true;
                })

                li.append(categorify);
            } else {
                const activitify = document.createElement('span');
                activitify.className = 'act-button';
                activitify.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-square-icon lucide-square"><rect width="18" height="18" x="3" y="3" rx="2"/></svg>`;

                activitify.addEventListener('click', () => summonConfirm(
                    'Turn category into activity? This will remove all sub-activities.',
                    () => {
                        act.subs = [];
                        renderColorsMenu();
                        toRerender.palette = true;

                        replacePixels(new Map(newRange(9).map(i => [act.color * 9 + i, act.color * 9])));
                        toRerender.canvas = true;
                    }
                ));

                li.append(activitify);
            }
        }

        li.appendChild(xButton);

        return li;
    }
    document.getElementById('color-config').replaceChildren(...YEAR.activities.flatMap(act => {
        const li = liOfActivity(act);
        if (act.subs.length > 0) {
            const ul = document.createElement('div');
            ul.className = 'sub-activities'
            ul.replaceChildren(
                ...act.subs.map(sub => liOfActivity(sub, act)),
                (() => {
                    const newButton = document.createElement('div');
                    newButton.className = 'button center';
                    newButton.style.background = COLORS[act.color * 9];
                    if (!WHITE_TEXT[act.color * 9]) {
                        newButton.className = 'button center dark-text'
                    }
                    newButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-plus-icon lucide-plus"><path d="M5 12h14"/><path d="M12 5v14"/></svg> Activity`
                    newButton.addEventListener('click', () => {
                        toRerender.palette = true;
                        const colorId = chooseRandomFromUnused(act.subs.map(sub => sub.color), 9);
                        act.subs.push({
                            name: '',
                            color: colorId
                        });
                        renderColorsMenu();
                    })
                    return newButton;
                })()
            );
            return [li, ul];
        } else {
            return [li];
        }
    }), (() => {
        const newButtons = document.createElement('div');
        newButtons.className = 'button-pair';
        newButtons.replaceChildren(...[
            {
                name: 'Category',
                create: () => {
                    const colorId = chooseRandomFromUnused(YEAR.activities.map(act => act.color), 11);
                    const sub1ColorId = Math.floor(Math.random() * 8) + 1;
                    const sub2ColorId = Math.floor(Math.random() * sub1ColorId);
                    return {
                        name: '',
                        color: colorId,
                        subs: [
                            {name: '', color: sub1ColorId},
                            {name: '', color: sub2ColorId}
                        ]
                    }
                }
            },
            {
                name: 'Activity',
                create: () => {
                    const colorId = chooseRandomFromUnused(YEAR.activities.map(act => act.color), 11);
                    return {
                        name: '',
                        color: colorId,
                        subs: []
                    }
                }
            }
        ].map(button => {
            const newButton = document.createElement('div');
            newButton.className = 'button center';
            newButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-plus-icon lucide-plus"><path d="M5 12h14"/><path d="M12 5v14"/></svg> ${button.name}`
            newButton.addEventListener('click', () => {
                toRerender.palette = true;
                YEAR.activities.push(button.create());
                renderColorsMenu();
            })
            return newButton;
        }));
        return newButtons;
    })());
}

const renderSavesMenu = () => {

    const trFromYear = (year) => {
        const tr = document.createElement('tr');
        const nameTd = document.createElement('td');
        nameTd.replaceChildren(document.createTextNode(year));
        const actionsTd = document.createElement('td');
        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'action-badges';
        actionsDiv.replaceChildren(...[
            ...(YEAR.year !== parseInt(year) ? [{
                name: 'Open',
                className: 'open',
                icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-folder-open-icon lucide-folder-open"><path d="m6 14 1.5-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.54 6a2 2 0 0 1-1.95 1.5H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H18a2 2 0 0 1 2 2v2"/></svg>`,
                onClick: () => {
                    initialize(parseInt(year));
                    document.getElementById('modal-wrapper').style.display = 'none';
                }
            }] : []),
            {
                name: 'Download image',
                className: 'image',
                icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-image-down-icon lucide-image-down"><path d="M10.3 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10l-3.1-3.1a2 2 0 0 0-2.814.014L6 21"/><path d="m14 19 3 3v-5.5"/><path d="m17 22 3-3"/><circle cx="9" cy="9" r="2"/></svg>`,
                onClick: () => {
                    downloadYearImage(parseInt(year));
                }
            },
            {
                name: 'Export to device',
                className: 'export',
                icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-download-icon lucide-download"><path d="M12 15V3"/><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5"/></svg>`,
                onClick: () => {
                    doWithPixelsFromDATABASE(parseInt(year), (cells) => {
                        console.log(cells);
                        const activities = getPaletteFromStorage(`${year}`);
                        const yearObj = {
                            year: parseInt(year),
                            activities,
                            cells: cellsToString(cells)
                        };
                        const jsonString = JSON.stringify(yearObj, null, 2);
                        const blob = new Blob([jsonString], {type: 'application/json'});
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `pixel-diary-${year}.json`;
                        a.click();
                        URL.revokeObjectURL(url);
                    });
                }
            },
            ...(YEAR.year !== parseInt(year) ? [{
                name: 'Delete',
                className: 'delete',
                icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x-icon lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>`,
                onClick: () => {
                    summonConfirm(`Are you sure you want to delete your ${year} data?`, () => {
                        localStorage.removeItem(year);
                        const tx = DATABASE.transaction('years', 'readwrite');
                        tx.objectStore('years').delete(parseInt(year));
                        renderSavesMenu();
                    });
                }
            }] : [])
        ].map(action => {
            const actionBadge = document.createElement('div');
            actionBadge.className = `action-badge ${action.className}`;
            actionBadge.addEventListener('click', action.onClick);
            const abIcon = document.createElement('div');
            abIcon.className = 'ab-icon center';
            abIcon.innerHTML = action.icon;
            actionBadge.replaceChildren(abIcon, document.createTextNode(action.name));
            return actionBadge;
        }));
        actionsTd.replaceChildren(actionsDiv);
        tr.replaceChildren(nameTd, actionsTd);
        return tr;
    }

    const savedYears = Object.keys(localStorage)
        .filter(x => !Number.isNaN(parseInt(x)))
        .sort((a, b) => parseInt(b) - parseInt(a));
    document.getElementById('saves-menu').replaceChildren(...savedYears.map(trFromYear));

}

const importYear = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.addEventListener('change', () => {
        if (input.files) {
            const file = input.files[0];
            if (!['json', 'application/json'].includes(file.type.toLowerCase())) {
                summonMiniModal(document.createTextNode(`Invalid file type "${file.type}".`));
                return;
            }
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const text = e.target.result;
                    const newYearObj = JSON.parse(text);
                    const newYear = {
                        year: newYearObj.year,
                        activities: newYearObj.activities,
                        cells: stringToCells(newYearObj.cells)
                    };

                    const proceedWithImport = () => {
                        setYEARPaletteInStorage(newYear);
                        setYEARPixelsInDATABASE(newYear, (e) => {
                            renderSavesMenu();
                            if (YEAR.year === newYear.year) {
                                initialize(YEAR.year);
                                document.getElementById('modal-wrapper').style.display = 'none';
                            }
                        });
                    }

                    if (localStorage.getItem(`${newYearObj.year}`)) {
                        summonConfirm(
                            `Import new year? This will replace your current data for the year ${newYearObj.year}.`,
                            proceedWithImport
                        );
                    } else {
                        proceedWithImport();
                    }
                } catch (err) {
                    summonMiniModal(document.createTextNode('Invalid import.'));
                }
            }
            reader.readAsText(file);
        }
    });
    input.click();
}

const newRange = (n) => {
    return new Array(n).fill(0).map((_, i) => i);
}

const chooseRandomFromUnused = (set, max) => {
    const fullSet = newRange(max);
    const diff = fullSet.filter(x => !set.includes(x));
    if (diff.length === 0) return null;
    return diff[Math.floor(Math.random() * diff.length)];
}

const summonMiniModal = (element) => {
    document.getElementById('mini-modal-inner').replaceChildren(element);
    document.getElementById('mini-modal-wrapper').style.display = 'flex';
}

const summonConfirm = (warning, ifConfirmed) => {
    const div = document.createElement('div');
    div.className = 'col-gap';
    const message = document.createElement('div');
    message.replaceChildren(document.createTextNode(warning));
    const button = document.createElement('div');
    button.className = 'button';
    button.replaceChildren(document.createTextNode(
        'Confirm'
    ));
    button.addEventListener('click', () => {
        ifConfirmed();
        document.getElementById('mini-modal-wrapper').style.display = 'none';
    });
    div.replaceChildren(message, button);
    summonMiniModal(div);
}

const replacePixels = (replacements) => {
    for (let i = 0; i < YEAR.cells.length; i++) {
        YEAR.cells[i] = replacements.get(YEAR.cells[i]) ?? YEAR.cells[i];
    }
}

const swapPixels = (a, b) => {
    replacePixels(new Map([[a, b], [b, a]]));
}

const closeModal = () => {
    document.getElementById('modal-wrapper').style.display = 'none';
    if (toRerender.info) renderYEARInfo();
    if (toRerender.canvas) {
        renderYEARCanvas();
        setYEARPixelsInDATABASE();
    }
    if (toRerender.palette) {
        document.getElementById('palette').className = 'panel-home';
        setYEARPaletteInStorage();
        renderYEARPalette();
    }
    if (toRerender.info || toRerender.canvas || toRerender.palette) selectCell(SELECTION, false);
    toRerender = {
        info: false,
        canvas: false,
        palette: false,
    }
}

const setYEARPixelsInDATABASE = (inputYear = null, onsuccess = null) => {
    const year = inputYear || YEAR;
    const tx = DATABASE.transaction('years', 'readwrite');
    const req = tx.objectStore('years').put(year.cells, year.year);
    if (onsuccess) {
        req.onsuccess = onsuccess;
    }
}

const doWithPixelsFromDATABASE = (key, func, funcIfFailed = console.error) => {
    const tx = DATABASE.transaction('years', 'readonly');
    const req = tx.objectStore('years').get(key);
    req.onsuccess = () => func(req.result);
    req.onerror = () => funcIfFailed();
}

const setYEARPaletteInStorage = (inputYear = null) => {
    const year = inputYear || YEAR;
    localStorage.setItem(`${year.year}`, JSON.stringify(year.activities));
}

const getPaletteFromStorage = (year) => {
    const str = localStorage.getItem(`${year}`);
    return str ? JSON.parse(str) : null;
}

const getLatestPaletteFromStorage = () => {
    const latestYear = Math.max(...Object.keys(localStorage).map(x => parseInt(x)).filter(x => !Number.isNaN(x)));
    if (latestYear > 0) {
        return JSON.parse(localStorage.getItem(`${latestYear}`));
    } else {
        return null;
    }
}

const setConfigsInStorage = () => {
    localStorage.setItem('configs', JSON.stringify(CONFIGS));
}

const getConfigsFromStorage = () => {
    const str = localStorage.getItem('configs');
    return str ? JSON.parse(str) : null;
}

const downloadYearImage = (year) => {

    doWithPixelsFromDATABASE(year, (cells) => {

        const activities = getPaletteFromStorage(`${year}`).flatMap(
            act => act.subs.length === 0 ? {...act, color: 9 * act.color} : act.subs.map(sub => { return {...sub, color: act.color * 9 + sub.color} })
        );

        const PADDING = CELL_SIZE;
        const DATE_WIDTH = 69;
        const TIME_HEIGHT = CONFIGS.timeIn24 ? 56 : 85;
        const rows = daysInYear(year);
        const GRID_WIDTH = CELL_SIZE * 48;
        const GRID_HEIGHT = CELL_SIZE * rows;
        const TEXT_PADDING = 5;
        const TEXT_GAP = 5;
        const ACT_MAX_WIDTH = TEXT_PADDING + DATE_WIDTH + TEXT_PADDING + GRID_WIDTH;

        const canvas = document.createElement('canvas');

        const ctx = canvas.getContext('2d');
        ctx.font = "22px \"Chocolate Classical Sans\"";

        const activitiesRows = [];
        let currentRow = [], currentRowCumulativeSize = -1 * TEXT_GAP;
        for (let i = 0; i < activities.length; i++) {
            const thisTextWidth = ctx.measureText(activities[i].name).width;
            const thisTextBoxWidth = TEXT_PADDING + thisTextWidth + TEXT_PADDING + TEXT_GAP;
            const totalWidthIfInRow = currentRowCumulativeSize + thisTextBoxWidth;
            if (totalWidthIfInRow > ACT_MAX_WIDTH) {
                activitiesRows.push(currentRow);
                currentRow = [];
                currentRowCumulativeSize = -1 * TEXT_GAP;
            }
            currentRow.push({...activities[i], width: thisTextWidth});
            currentRowCumulativeSize += thisTextBoxWidth;
        }
        activitiesRows.push(currentRow);

        const CANVAS_WIDTH = PADDING + TEXT_PADDING + DATE_WIDTH + TEXT_PADDING + GRID_WIDTH + PADDING;
        const ACT_START_HEIGHT = PADDING + TEXT_PADDING + TIME_HEIGHT + TEXT_PADDING + GRID_HEIGHT + PADDING + CELL_SIZE + TEXT_PADDING * 2 + TEXT_GAP;
        const CANVAS_HEIGHT = ACT_START_HEIGHT + activitiesRows.length * (CELL_SIZE + TEXT_PADDING * 2 + TEXT_GAP) - TEXT_GAP + PADDING;

        canvas.width = CANVAS_WIDTH;
        canvas.height = CANVAS_HEIGHT;

        const drawBackdrop = () => {
            ctx.fillStyle = "#edecf0";
            ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
            ctx.fill();
        }

        const drawGridlines = () => {

            ctx.strokeStyle = "#13111d44";
            ctx.lineWidth = 1;
            ctx.beginPath();

            // horizontals
            for (let i = 0; i < rows + 1; i++) {
                ctx.moveTo(PADDING + 0.5, PADDING + TEXT_PADDING + TIME_HEIGHT + TEXT_PADDING + i * CELL_SIZE - 0.5);
                ctx.lineTo(PADDING + TEXT_PADDING + DATE_WIDTH + TEXT_PADDING + GRID_WIDTH + 0.5, PADDING + TEXT_PADDING + TIME_HEIGHT + TEXT_PADDING + i * CELL_SIZE - 0.5);
            }

            // verticals
            for (let i = 0; i < 49; i++) {
                ctx.moveTo(PADDING + TEXT_PADDING + DATE_WIDTH + TEXT_PADDING + i * CELL_SIZE - 0.5, PADDING + ((i === 0) ? 0 : (TEXT_PADDING + TIME_HEIGHT + TEXT_PADDING)) - 0.5);
                ctx.lineTo(PADDING + TEXT_PADDING + DATE_WIDTH + TEXT_PADDING + i * CELL_SIZE - 0.5, PADDING + TEXT_PADDING + TIME_HEIGHT + TEXT_PADDING + GRID_HEIGHT - 0.5);
            }

            ctx.stroke();
        }

        const drawCells = () => {
            for (let row = 0; row < rows; row++) {
                for (let col = 0; col < 48; col++) {
                    const index = row * 48 + col;
                    const colorIndex = cells[index];
                    if (colorIndex !== 255) {
                        ctx.fillStyle = COLORS[colorIndex];
                        ctx.fillRect(PADDING + TEXT_PADDING + DATE_WIDTH + TEXT_PADDING + col * CELL_SIZE, PADDING + TEXT_PADDING + TIME_HEIGHT + TEXT_PADDING + row * CELL_SIZE, CELL_SIZE, CELL_SIZE);
                    }
                }
            }
            ctx.fill();
        }

        const drawDates = () => {
            ctx.font = "22px \"Chocolate Classical Sans\"";
            ctx.fillStyle = "#13111d";
            ctx.textBaseline = "middle";
            ctx.textAlign = "right";
            const DATE_LIST = getDateList(year);
            for (let i = 0; i < DATE_LIST.length; i++) {
                const dateStr = DATE_LIST[i];
                ctx.fillText(dateStr, PADDING + TEXT_PADDING + DATE_WIDTH + 0.5, PADDING + TEXT_PADDING + TIME_HEIGHT + TEXT_PADDING + i * CELL_SIZE + CELL_SIZE / 2 + 0.5);
            }
        }

        const drawTimes = () => {
            ctx.font = "22px \"Chocolate Classical Sans\"";
            ctx.rotate(Math.PI / 2);
            for (let i = 0; i < 49; i++) {
                const timeStr = getTimeStr(i);
                ctx.fillStyle = i % 2 === 1 ? "#13111d44" : "#13111d";
                ctx.fillText(timeStr, PADDING + TEXT_PADDING + TIME_HEIGHT + 0.5, (PADDING + TEXT_PADDING + DATE_WIDTH + TEXT_PADDING + i * CELL_SIZE) * -1);
            }
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.fillStyle = "#edecf0";
            ctx.fillRect(0, 0, PADDING + TEXT_PADDING + DATE_WIDTH + TEXT_PADDING, PADDING + TEXT_PADDING + TIME_HEIGHT + TEXT_PADDING);
            ctx.fillRect(PADDING + TEXT_PADDING + DATE_WIDTH + TEXT_PADDING + CELL_SIZE * 48, 0, CELL_SIZE, PADDING + TEXT_PADDING + TIME_HEIGHT + TEXT_PADDING);
        }

        const drawActivities = () => {
            ctx.font = "22px \"Chocolate Classical Sans\"";
            ctx.textAlign = "center";
            ctx.textBaseline = "center";
            ctx.fillStyle = '#13111d';
            const yCenter = (PADDING + TEXT_PADDING + TIME_HEIGHT + TEXT_PADDING + GRID_HEIGHT + PADDING + ACT_START_HEIGHT) / 2;
            const xCenter = CANVAS_WIDTH / 2;
            ctx.fillText('Key', xCenter, yCenter);
            for (let rowIx = 0; rowIx < activitiesRows.length; rowIx++) {
                let row = activitiesRows[rowIx];
                const totalRowWidth = row.reduce((acc, cur) => acc + cur.width, 0);
                let rowProportionTaken = 0;
                for (let cellIx = 0; cellIx < row.length; cellIx++) {
                    const myProportion = row[cellIx].width / totalRowWidth;
                    row[cellIx] = {
                        ...row[cellIx],
                        proportionBefore: rowProportionTaken,
                        myProportion
                    };
                    rowProportionTaken += myProportion;
                }

                const ROW_WIDTH_MINUS_GAPS = ACT_MAX_WIDTH - TEXT_GAP * (row.length - 1);

                for (let cellIx = 0; cellIx < row.length; cellIx++) {
                    const act = row[cellIx];
                    ctx.beginPath();
                    ctx.fillStyle = COLORS[act.color];
                    const x = PADDING + ROW_WIDTH_MINUS_GAPS * act.proportionBefore + TEXT_GAP * cellIx,
                        y = ACT_START_HEIGHT + rowIx * (TEXT_PADDING * 2 + CELL_SIZE + TEXT_GAP),
                        w = ROW_WIDTH_MINUS_GAPS * act.myProportion,
                        h = TEXT_PADDING * 2 + CELL_SIZE
                    ctx.roundRect(x, y, w, h, TEXT_PADDING);
                    ctx.fill();
                    ctx.fillStyle = WHITE_TEXT[act.color] ? '#edecf0' : '#13111d';
                    ctx.fillText(act.name, x + (w / 2), y + (h / 2) + TEXT_PADDING / 2);
                }

            }
        }

        drawBackdrop();
        drawDates();
        drawTimes();
        drawCells();
        drawGridlines();
        drawActivities();

        ctx.fillStyle = '#13111d';
        ctx.fillText(`'${year % 100}`, PADDING + TEXT_PADDING + DATE_WIDTH / 2, PADDING + TEXT_PADDING + TIME_HEIGHT / 2)

        canvas.toBlob((blob) => {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `pixel-diary-${year}.png`;
            a.click();
            URL.revokeObjectURL(url);
        }, 'image/png');

    })

}

const initialize = (inputYear = null) => {
    CONFIGS = getConfigsFromStorage() || {
        timeIn24: false
    };
    if (CONFIGS.timeIn24) {
        document.getElementById('24hour').setAttribute('checked', 'true');
    }
    setConfigsInStorage();

    const now = new Date();
    if (inputYear) now.setFullYear(inputYear);
    const year = (now.getFullYear());

    const request = indexedDB.open('years', 1);

    request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains('years')) {
            db.createObjectStore('years');
        }
    }

    request.onsuccess = () => {
        DATABASE = request.result;
        doWithPixelsFromDATABASE(year, (cells) => {
            YEAR = {
                year: year,
                activities: getPaletteFromStorage(year) || (getLatestPaletteFromStorage() || DEFAULT_PALETTE()),
                cells: cells || new Uint8Array(48 * daysInYear(now.getFullYear())).fill(255)
            };
            renderYEARInfo();
            renderYEARPalette();
            renderYEARCanvas();
            document.getElementById('palette').className = 'panel-home';

            const months = [31, isLeap(now.getFullYear()) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
            const elapsedDays = months.slice(0, now.getMonth()).reduce((acc, cur) => acc + cur, 0) + now.getDate() - 1;
            const elapsedHalfhours = now.getHours() * 2 + (now.getMinutes() < 30 ? 0 : 1);
            selectCell(elapsedDays * 48 + elapsedHalfhours);

            setYEARPaletteInStorage();
            setYEARPixelsInDATABASE();
        });
    };


}

initialize();
