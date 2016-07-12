#pragma strict
import UnityEngine.UI;

var ufoScoreText : Text;
@HideInInspector
var exploded = false;

function OnCollisionEnter () : IEnumerator {
	ExplosionManager.use.Explode (ExplosionType.Invader, transform.position);
	exploded = true;
	gameObject.layer = LayerMask.NameToLayer ("Ignore Raycast");	// So the missile can't hit it again, since we don't deactivate right away
	GetComponent (Renderer).enabled = false;
	
	// Choose random point value of 50, 100, 150, or 300 (unlike the real Space Invaders, where this depends on the number of missiles fired)
	var points = Random.Range (1, 5) * 50;
	if (points == 200) {
		points = 300;
	}
	GameManager.use.AddScore (points);
	
	ShowScoreText (points);
	
	// Increase pitch over time, while decreasing volume
	while (GetComponent (AudioSource).pitch < 3.0) {
		GetComponent (AudioSource).pitch += Time.deltaTime * 1.5;
		GetComponent (AudioSource).volume -= Time.deltaTime * 0.4;
		yield;
	}
}

function ShowScoreText (points : int) : IEnumerator {
	ufoScoreText.gameObject.SetActive (true);
	ufoScoreText.text = points.ToString();
	var screenPos = Camera.main.WorldToScreenPoint (transform.position);
	ufoScoreText.transform.position = screenPos;
	yield WaitForSeconds (2.0);
	ufoScoreText.gameObject.SetActive (false);
	gameObject.SetActive (false);
}