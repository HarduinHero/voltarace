/**
 * Execution sur exception
 * @param {*} error l'erreur levée
 */
function onError(error) {
    console.error(`Error: ${error}`);
  }

/**
 * Envoie un message pour démarer l'affichage des réponces
 * @param {*} tabs les onglets destinataires
 */
function sendMessageHelpStart(tabs) {
    for (let tab of tabs) {
        browser.tabs.sendMessage(
        tab.id,
        {run: "helpVersion"}
    ).catch(onError);
    }
}

/**
 * Envoie un message pour mettre activer/désactiver les réponces automatiques
 * @param {*} tabs les onglets destinataires
 */
function sendMessageToSetAuto(tabs) {
  for (let tab of tabs) {
    browser.tabs.sendMessage(
      tab.id,
      {
        run: "autoSet",
        autoState: document.getElementById('toggleAuto').checked,
        autoTiming: document.getElementById('timing').value
      }
    ).catch(onError);
  }
}

/**
 * Envoie un message pour récupérer l'état actuel des réponces automatiques
 * @param {*} tabs les onglets destinataires
 */
function sendMessageToGetAuto(tabs) {
  for (let tab of tabs) {
    browser.tabs.sendMessage(
      tab.id,
      {run: "autoGet"}
    ).then(response => {
      let state = response.response.state === "true";
      document.getElementById('toggleAuto').checked = state;
      document.getElementById('timing').value = response.response.timing;
    }).catch(onError);
  }
}

/**
 * Mise en place envoie message si click sur lancement
 */
document.getElementById('launch').addEventListener("click", () => {
    browser.tabs.query({
      currentWindow: true,
      active: true
    }).then(sendMessageHelpStart).catch(onError);
});

/**
 * Mise en place auto mise à jours affichage timing +
 * envoie timing data
 */
document.getElementById('timing').addEventListener('change', (e)=> {
  document.getElementById('timeIndicator').innerHTML = document.getElementById('timing').value;

  browser.tabs.query({
    currentWindow: true,
    active: true
  }).then(sendMessageToSetAuto).catch(onError);
});

/**
 * Mise en place envoie message auto reponces
 */
document.getElementById('toggleAuto').addEventListener("change", () => {
  browser.tabs.query({
    currentWindow: true,
    active: true
  }).then(sendMessageToSetAuto).catch(onError);
});


/**
 * Initialisation
 */

document.getElementById('timeIndicator').style.backgroundColor = "red";

browser.tabs.query({
  currentWindow: true,
  active: true
}).then(sendMessageToGetAuto).catch(onError);

document.getElementById('timeIndicator').innerHTML = document.getElementById('timing').value;