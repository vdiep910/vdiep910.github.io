const scene     = document.getElementById('scene');
const meterFill = document.getElementById('meter-fill');
const ballGroup = document.getElementById('ball-group');
const ballEl    = document.getElementById('ball');
const arrowWrap = document.getElementById('arrow-wrap');
const arrowLine = document.getElementById('arrow-line');
const volFill   = document.getElementById('vol-fill');
const resultPct = document.getElementById('result-pct');
const actionRow = document.getElementById('action-row');

let power = 0, angle = 0;
let meterVal = 0, meterDir = 1, meterRaf;
let angleVal = 0, angleDirUp = 1, angleRaf;

const START_LEFT   = 58;
const START_BOTTOM = 58;

function setBtn(l, c, f) {
  actionRow.innerHTML = '';
  const b = document.createElement('button');
  b.textContent = l; b.className = c; b.onclick = f;
  actionRow.appendChild(b);
}

function setTwoBtns(l1, c1, f1, l2, c2, f2) {
  actionRow.innerHTML = '';
  [[l1, c1, f1], [l2, c2, f2]].forEach(([l, c, f]) => {
    const b = document.createElement('button');
    b.textContent = l; b.className = c; b.onclick = f;
    actionRow.appendChild(b);
  });
}

function startPower() {
  resultPct.style.display = 'none';
  volFill.style.width = '0%';
  ballGroup.style.position = 'absolute';
  ballGroup.style.transition = 'none';
  ballGroup.style.left   = START_LEFT + 'px';
  ballGroup.style.bottom = START_BOTTOM + 'px';
  ballGroup.style.top    = 'auto';
  ballEl.style.background = '#378ADD';
  arrowWrap.style.display = 'none';
  meterVal = 0; meterDir = 1;
  setBtn('Lock power', 'primary', lockPower);
  animateMeter();
}

function animateMeter() {
  meterVal += meterDir * 4;
  if (meterVal >= 100) { meterVal = 100; meterDir = -1; }
  if (meterVal <= 0)   { meterVal = 0;   meterDir =  1; }
  const h = document.getElementById('meter-outer').offsetHeight;
  meterFill.style.height = (meterVal / 100 * h) + 'px';
  meterFill.style.background = `rgb(${Math.round((100 - meterVal) * 2.55)},${Math.round(meterVal * 2.55)},50)`;
  meterRaf = requestAnimationFrame(animateMeter);
}

function lockPower() {
  cancelAnimationFrame(meterRaf);
  power = Math.round(meterVal);
  arrowWrap.style.display = 'block';
  angleVal = 0; angleDirUp = 1;
  setBtn('Lock angle', 'primary', lockAngle);
  animateAngle();
}

function animateAngle() {
  angleVal += angleDirUp * 4;
  if (angleVal >  20) { angleVal =  20; angleDirUp = -1; }
  if (angleVal < -60) { angleVal = -60; angleDirUp =  1; }
  arrowLine.style.transform = `rotate(${-angleVal}deg)`;
  angleRaf = requestAnimationFrame(animateAngle);
}

function lockAngle() {
  cancelAnimationFrame(angleRaf);
  angle = angleVal;
  arrowWrap.style.display = 'none';
  actionRow.innerHTML = '';

  const sr      = scene.getBoundingClientRect();
  const barEl   = document.getElementById('vol-bar');
  const br      = barEl.getBoundingClientRect();
  const barLeft = br.left - sr.left;
  const barTop  = br.top  - sr.top;
  const barW    = br.width;
  const sceneH  = scene.offsetHeight;

  const usable = barW - 26;

  const anglePct = (angle + 60) / 105;
  const powerPush = (power / 100) * 0.4;
  const raw = anglePct * 0.6 + powerPush;
  const finalPct = Math.max(0, Math.min(1, (raw - 0.12) * (1 / 0.64)));

  const landX = finalPct * usable;
  const pct   = Math.round(finalPct * 100);

  const lLeft = barLeft + landX;
  const lTop  = barTop - 5;

  const sLeft = START_LEFT;
  const sTop  = sceneH - START_BOTTOM - 26;

  let t = 0;
  const dur = 30;

  (function animBall() {
    t++;
    const p  = t / dur;
    const cx = sLeft + (lLeft - sLeft) * p;
    const arc = Math.max(5, (angle / 45) * 30 + (power / 100) * 20);
    const cy = sTop + (lTop - sTop) * p - arc * Math.sin(Math.PI * p);

    ballGroup.style.left   = cx + 'px';
    ballGroup.style.top    = cy + 'px';
    ballGroup.style.bottom = 'auto';

    if (t < dur) { requestAnimationFrame(animBall); return; }

    ballGroup.style.left = lLeft + 'px';
    ballGroup.style.top  = lTop  + 'px';
    ballEl.style.background = '#1D9E75';
    volFill.style.width = pct + '%';
    resultPct.textContent = pct + '%';
    resultPct.style.display = 'block';

    setTwoBtns(
      'Try again', '', startPower,
      'Submit', 'accept', () => {
        actionRow.innerHTML = '';
        const b = document.createElement('button');
        b.textContent = 'Start over'; b.onclick = startPower;
        actionRow.appendChild(b);
      }
    );
  })();
}

startPower();