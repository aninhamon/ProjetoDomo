// Start game when coin hits this trigger
#pragma strict

var titleManager : TitleManager;

function OnTriggerEnter () : IEnumerator {
	GetComponent (AudioSource).Play();
	yield WaitForSeconds (0.75);
	titleManager.StartGame();
}