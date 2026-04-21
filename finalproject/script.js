const scene      = document.getElementById('scene');
const meterFill  = document.getElementById('meter-fill');
const ballGroup  = document.getElementById('ball-group');
const ballEl     = document.getElementById('ball');
const arrowWrap  = document.getElementById('arrow-wrap');
const arrowLine  = document.getElementById('arrow-line');
const volFill    = document.getElementById('vol-fill');
const resultPct  = document.getElementById('result-pct');
const actionRow  = document.getElementById('action-row');

let power = 0, angle = 0;
let meterVal = 0, meterDir = 1, meterRaf;
let angleVal = 0, angleDirUp = 1, angleRaf;

const START_LEFT   = 60;
const START_BOTTOM = 62;

function setBtn(label, cls, fn) {
  actionRow.innerHTML = '';
  const b = document.createElement('button');
  b.textContent = label;
  b.className = cls;
  b.onclick = fn;
  actionRow.appendChild(b);
}

function setTwoBtns(l1, c1, f1, l2, c2, f2) {
  actionRow.innerHTML = '';
  [[l1, c1, f1], [l2, c2, f2]].forEach(([l, c, f]) => {
    const b = document.createElement('button');
    b.textContent = l;
    b.className = c;
    b.onclick = f;
    actionRow.appendChild(b);
  });
}


function startPower() {
  resultPct.style.display = 'none';
  volFill.style.width = '0%';
  ballGroup.style.transition = 'none';
  ballGroup.style.left   = START_LEFT + 'px';
  ballGroup.style.bottom = START_BOTTOM + 'px';
  ballGroup.style.top    = 'auto';
  ballEl.style.background = '#378ADD';
  arrowWrap.style.display = 'none';
  meterVal = 0;
  meterDir = 1;
  setBtn('Lock power', 'primary', lockPower);
  animateMeter();
}

function animateMeter() {
  meterVal += meterDir * 2;
  if (meterVal >= 100) { meterVal = 100; meterDir = -1; }
  if (meterVal <= 0)   { meterVal = 0;   meterDir =  1; }
  const h = document.getElementById('meter-outer').offsetHeight;
  const r = Math.round((100 - meterVal) * 2.55);
  const g = Math.round(meterVal * 2.55);
  meterFill.style.height = (meterVal / 100 * h) + 'px';
  meterFill.style.background = `rgb(${r},${g},50)`;
  meterRaf = requestAnimationFrame(animateMeter);
}

function lockPower() {
  cancelAnimationFrame(meterRaf);
  power = Math.round(meterVal);
  startAngle();
}


function startAngle() {
  arrowWrap.style.display = 'block';
  angleVal = 0;
  angleDirUp = 1;
  setBtn('Lock angle', 'primary', lockAngle);
  animateAngle();
}

function animateAngle() {
  angleVal += angleDirUp * 2.5;
  if (angleVal >  45) { angleVal =  45; angleDirUp = -1; }
  if (angleVal < -25) { angleVal = -25; angleDirUp =  1; }
  arrowLine.style.transform = `rotate(${-angleVal}deg)`;
  angleRaf = requestAnimationFrame(animateAngle);
}

function lockAngle() {
  cancelAnimationFrame(angleRaf);
  angle = angleVal;
  doLaunch();
}


function doLaunch() {
  arrowWrap.style.display = 'none';
  actionRow.innerHTML = '';

  const sceneRect = scene.getBoundingClientRect();
  const barEl     = document.getElementById('vol-bar');
  const barRect   = barEl.getBoundingClientRect();
  const barLeft   = barRect.left - sceneRect.left;
  const barTop    = barRect.top  - sceneRect.top;
  const barW      = barRect.width;
  const sceneH    = scene.offsetHeight;

  const usable    = barW - 26;
  const rawX      = (power / 100) * usable * 0.88 + (angle / 45) * usable * 0.14;
  const landX     = Math.max(0, Math.min(usable, rawX));
  const volPctVal = Math.round((landX / usable) * 100);

  const landLeft  = barLeft + landX;
  const landTop   = barTop - 5;

  const startLeft = START_LEFT;
  const startTop  = sceneH - START_BOTTOM - 26;

  let t = 0;
  const dur = 55;

  function animBall() {
    t++;
    const p  = t / dur;
    const cx = startLeft + (landLeft - startLeft) * p;
    const arc = 70 + power * 0.6;
    const cy = startTop + (landTop - startTop) * p - arc * Math.sin(Math.PI * p);

    ballGroup.style.left   = cx + 'px';
    ballGroup.style.top    = cy + 'px';
    ballGroup.style.bottom = 'auto';

    if (t < dur) {
      requestAnimationFrame(animBall);
    } else {
      ballGroup.style.left = landLeft + 'px';
      ballGroup.style.top  = landTop  + 'px';
      ballEl.style.background = '#1D9E75';
      volFill.style.width = volPctVal + '%';
      showResult(volPctVal);
    }
  }

  requestAnimationFrame(animBall);
}


function showResult(pct) {
  resultPct.textContent = pct + '%';
  resultPct.style.display = 'block';
  setTwoBtns(
    'Try again', '', startPower,
    'Accept', 'accept', () => {
      actionRow.innerHTML = '';
      const b = document.createElement('button');
      b.textContent = 'Start over';
      b.onclick = startPower;
      actionRow.appendChild(b);
    }
  );
}

startPower();
