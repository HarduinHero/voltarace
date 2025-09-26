





/**
 * Indique/clique les réponces celon les variables d'environnement initialisé pour les exercices phrase.
 * les réponces sont enregistrées dans le json tel :
 *      {
 *          <String> question : (<Int> IndexPremierMotReponse, <Int> longueurReponce),
 *          ...
 *      }
 * @param {*} data : données de réponces
 */
function repStnsIndicator(data) {
    //On récupère la phrase et tous ses mots
    var divMots = []
    var phrase = [];
    document.querySelectorAll('span.pointAndClickSpan').forEach((mot) => {
        phrase.push(mot.innerText);
        divMots.push(mot);
    });
    phrase = phrase.join('');

    //on vérifie si on connais la question
    var qtExist = data[phrase] != undefined;

    // Si on a une réponce enregistré
    if (qtExist) {
        if (data[phrase] != []) {
            //Si la réponse est une faute
            //pour tous les mots dont l'index appartient à la réponce
            for (let i = data[phrase][0]; i < data[phrase][1]; i++) {
                //On leur donne un fond vert
                divMots[i].setAttribute('style', 'background-color: #a2d417;');
            }
            
            if (autorun === true){
                //Si l'autorun est actif on place un timer sur la réponce
                putTimer(repsbt.item(0), autorunTimeToRep, simulateClick, '#ff8f1f', 5, 5);
            }


        } else {
            //Si la réponse est qu'il n'y a pas de faute
            putTimer(document.querySelectorAll('button.noMistakeButton'), autorunTimeToRep, simulateClick, '#ff8f1f', 5, 5);
        }
    } else if (autorun === true){
        //Si l'autorun est actif on place un timer sur le bouton il n'y a pas de faute
        putTimer(document.querySelectorAll('button.noMistakeButton'), autorunTimeToRep, simulateClick, '#ff8f1f', 5, 5);
    }
          
    document.querySelectorAll('button.noMistakeButton, div.sentence').forEach(el => el.addEventListener('click', (e) => {
        //S'il n'éxistait pas de réponce 
        if (!qtExist) {
            //On récupère les données de réponce
            let correctedSentens = document.querySelector('div.sentence').childNodes;
            var corrBegin = null;
            var corrLen = null;
            let cpt = 0;

            console.log(correctedSentens);

            correctedSentens.forEach(el => {
                if (el.className == "answerWord") {
                    corrBegin = cpt;
                    corrLen = el.childNodes.length;
                    break;
                }
                cpt++;

            console.log(corrBegin);
            console.log(corrLen);

            });

        }
    }));

    /*
            //On crée l'url d'enregistrement distant
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
    */

}




