function step(timer, time, secLen, trigger) {
    setTimeout(()=>
        {
            console.log(time);
            timer.style.width = (time*secLen).toFixed(2) + '%';
            time = (time - 0.01).toFixed(2);
            if (time > 0) {
                step(timer, time, secLen, trigger);
            } else {
                timer.setAttribute('style', 'visibility: hidden;');
                trigger();
            }
        },
    10);
}

function putTimer(timedObject, time, trigger, color = 'black', h = 1, r = 0) {
    const secLen = 100/time;
    var chld = document.createElement('div');
    let chldID = 'timer' + Date.now().toString().substring(9, + Date.now().toString().length);
    chld.setAttribute('id', chldID);
    chld.setAttribute('style', 'height: '+h+'px; background-color: '+color+';border-radius: '+r+'px;');
    timedObject.appendChild(chld);
    

    step(chld, time, secLen, trigger)
}

var target = document.querySelector('.target');
putTimer(target, 3, function(){console.log('ok')});