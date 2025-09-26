console.log('firstline');

//==================== Initialisation ====================

const urlBase = "http://cheatvolt.abp.lescigales.org";

if (localStorage.getItem('autorun') == null) {
    localStorage.setItem('autorun', false);
}
if (localStorage.getItem('autorunTime') == null) {
    localStorage.setItem('autorunTime', 3);
}

var autorun = localStorage.getItem('autorun');
var autorunTimeToRep = localStorage.getItem('autorunTime');
var autorunTimeToNext = (localStorage.getItem('autorunTime')/2).toFixed(1);

//========================================================

/**
 * comptage d'un pas de timer.
 * @param {*} timer : la représentation html du timer
 * @param {*} time : temps restant
 * @param {*} secLen : taille d'une seconde en html en %
 * @param {*} trigger : fonction éxécutée à la fin du timer sur le parent du timer
 */
 function step(timer, time, secLen, trigger) {
    setTimeout(()=>
        {
            timer.style.width = (time*secLen).toFixed(2) + '%';
            time = (time - 0.01).toFixed(2);
            if (time > 0) {
                step(timer, time, secLen, trigger);
            } else {
                timer.setAttribute('style', 'visibility: hidden;');
                trigger(timer.parentNode);
            }
        },
    10);
}

/**
 * Simule un click sur un élément elem.
 * @param {*} elem élément à cliquer
 */
var simulateClick = function (elem) {
	// Create our event (with options)
	var evt = new MouseEvent('click', {
		bubbles: true,
		cancelable: true,
		view: window
	});
	// If cancelled, don't dispatch our event
	var canceled = !elem.dispatchEvent(evt);
};

/**
 * Met en place un timer sur un objet.
 * @param {Node} timedObject : objet sur lequel déclarer un timer
 * @param {Float, Integer} time : temps d'éxécution du timer en secondes
 * @param {function} trigger : fonction éxécutée à la fin du timer sur le parent du timer 
 * @param {String} color : couleur html du timer
 * @param {Integer} h : hauteur du timer
 * @param {Integer} r : rayon de borture du timer
 */
function putTimer(timedObject, time, trigger, color = 'black', h = 1, r = 0) {
    const secLen = 100/time;
    var chld = document.createElement('div');
    let chldID = 'timer' + Date.now().toString().substring(9, + Date.now().toString().length);
    chld.setAttribute('id', chldID);
    chld.setAttribute('style', 'height: '+h+'px; background-color: '+color+';border-radius: '+r+'px;');
    timedObject.appendChild(chld);

    step(chld, time, secLen, trigger)
}

/**
 * Indique/clique les réponces celon les variables d'environnement initialisé pour les exercices QCM.
 * @param {*} data : données de réponces
 */
 var repQCMIndicator = function(data) {

    //on récupère la question
    var question = document.querySelector('.qccv-question');
    //on récupère les propositions
    var repsbt = document.querySelectorAll('.qc-proposal-button');
    //on vérifie si on connais la question
    var qtExist = data[question.innerHTML] != undefined;

    console.log(question.innerHTML+' - '+data[question.innerHTML]);

    // Si on a une réponce enregistré
    if (qtExist) {
        repsbt.forEach((rep) => {
            if (rep.innerHTML != data[question.innerHTML]) {
                //on grise tous les boutons qui ne sont pas la réponse
                rep.setAttribute('style', 'background-color: lightgrey; color: grey;');
            } else {
                if (autorun === true){
                    //Si l'autorun est actif on place un timer sur la bonne réponce
                    putTimer(rep, autorunTimeToRep, simulateClick, '#ff8f1f', 5, 5);
                }
            }
        });
    } else if (autorun === true){
        //Si l'autorun est actif on place un timer sur la première bonne réponce
        putTimer(repsbt.item(0), autorunTimeToRep, simulateClick, '#ff8f1f', 5, 5);
    }

    //Pour chaque bouton de réponce
    repsbt.forEach((rep) => {
        //On place un évenement au click
        rep.addEventListener('click', (e) => {
            //S'il n'éxistait pas de réponce 
            if (!qtExist) {
                //On récupère l'objet qui contient la réponce
                let corr = document.querySelector('div.correct.qc-proposal').innerText.split('\n')[0];
                //On crée l'url d'nregistrement distant
                let setRestUrl = urlBase+'/index.php?qt='+question.innerHTML+'&rep='+corr+'&type=qcm';
                //On éxécute l'enregistrement
                fetch(setRestUrl, {
                    method: "GET",
                    headers: {"Content-type": "application/json;charset=UTF-8"}
                })
                .catch(err => console.log(err));
                console.log(corr);
                data[question.innerHTML] = corr;
            }
            //Pour le bouton suivant
            var nexBt = document.getElementById('btn_question_suivante');
            //Si l'autorun est actif on place un timer sur le bouton suivant
            if (autorun) {
                putTimer(nexBt, autorunTimeToNext, simulateClick, 'white', 2);
            }
            
            //On place un évenement qui relance le l'affichege des réponces sur la prochaine question
            nexBt.addEventListener('click', (e) => {
                repQCMIndicator(data);
            });
        });
    });
}

//========================= Launch ==========================
/**
 * lance l'affichage des réponces, query les données distantes.
 */
 var launcher = function() {
    //On récupère l'énnoncé
    let instruction = document.querySelector('.qccv-instructions');
    let sentenseDiv = document.querySelector('div.sentence');

    if (instruction == null && sentenseDiv != null) {
        console.log('phrase');
        fetch(urlBase+'/dataStns.json', {
            method: "GET",
            headers: {"Content-type": "application/json;charset=UTF-8"}
        })
        .then(response => response.json())
        .then(data => repStnsIndicator(data))
        .catch(err => console.log(err));

    } else if (instruction.innerHTML == 'Cliquer sur le mot ou le groupe de mots dont le sens est le plus proche dans un contexte professionnel.') { //Si l'énnoncé correspond
        console.log('qcm');
        fetch(urlBase+'/dataQCM.json', {
            method: "GET",
            headers: {"Content-type": "application/json;charset=UTF-8"}
        })
        .then(response => response.json())
        .then(data => repQCMIndicator(data))
        .catch(err => console.log(err));
    }
}


//========================= Run ==========================

/**
 * Mise à jours des informations celon les messages reçus.
 */
 console.log('ok');
 browser.runtime.onMessage.addListener(request => {
     console.log('run : '+request.run);
     switch (request.run) {
         case "helpVersion":
             launcher();
             break;
         
         case "autoSet":
             localStorage.setItem("autorun", request.autoState);
             localStorage.setItem("autorunTime", request.autoTiming);
             autorun = request.autoState;
             autorunTimeToRep = request.autoTiming;
             autorunTimeToNext = (localStorage.getItem('autorunTime')/2).toFixed(1);
             break;
 
         case "autoGet":
             return Promise.resolve(
                 {
                     response: {
                         state : localStorage.getItem("autorun"),
                         timing : localStorage.getItem("autorunTime")
                     }
                 });
 
         default:
             break;
     }
 });
 
 //========================================================