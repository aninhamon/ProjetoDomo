#pragma strict
import System.Collections.Generic;
import UnityEngine.UI;

var player : PlayerControl;
var playerExplosion : GameObject;
var extraLives = 2;
var bonusLifeScore = 1500;
var playfieldWidth = 61.25;
var playfieldHeight = 61.25;
var boundaryTriggers : GameObject[];
var canvas : Transform;
var scoreText : Text;
var highScoreText : Text;
var pauseText : Text;
var gameOverText : Text;
var extraLifeIcon : GameObject;
var flareImage : Image;
var extraLifeAudio : AudioSource;
var nextLevelAudio : AudioSource;

private var score : int;
private var highScore : int;
private var triggerIndex : int;
private var lifeIcons : List.<GameObject>;
private var gotBonusLife = false;
private var paused = false;
private var m_levelInProgress = false;
function get levelInProgress () : boolean {return m_levelInProgress;}
private var m_didSwitchover = false;
function get didSwitchover () : boolean {return m_didSwitchover;}
private var m_playerHalt = false;
function get playerHalt () : boolean {return m_playerHalt;}

static var use : GameManager;

function Start () : IEnumerator {
	highScore = PlayerPrefs.GetInt ("HighScore", 0);
	score = 0;
	Time.timeScale = 1.0;	// It's set higher on the title screen
	
	use = this;
	GetComponent (InvaderManager).Setup (player.transform);
		
	// Set trigger positions; these are used to reverse direction of the invaders when touched
	boundaryTriggers[0].transform.position.x = -(playfieldWidth / 2) - (boundaryTriggers[0].GetComponent (BoxCollider).size.x / 2) - 2;
	boundaryTriggers[1].transform.position.x = (playfieldWidth / 2) + (boundaryTriggers[1].GetComponent (BoxCollider).size.x / 2) + 2;
	
	// Place extra life icons
	lifeIcons = new List.<GameObject>();
	for (var i = 0; i < extraLives; i++) {
		AddLifeIcon();
	}
	
	// Set up player and deactivate temporarily
	player.SetBoundaries (playfieldWidth, playfieldHeight);
	player.gameObject.SetActive (false);
	
	// Set up bunkers
	//GetComponent (BunkerManager).Setup (playfieldWidth);
		
	// Initialize score, invaders, and player
	AddScore (0);
	m_levelInProgress = true;
	GetComponent (InvaderManager).SetInvaderContainerPosition (playfieldWidth);
	yield GetComponent (InvaderManager).StartInvaders (true, 0.0);
	StartPlayer (1.5);
	GetComponent (UFOManager).UFOLoop();
}

function InitializeBoundaryTriggers () {
	boundaryTriggers[0].SetActive (false);
	boundaryTriggers[1].SetActive (true);
	triggerIndex = 1;
}

function FlipBoundaryTriggers () {
	// Deactivate boundary trigger and activate opposite boundary trigger
	boundaryTriggers[triggerIndex].SetActive (false);
	triggerIndex = 1 - triggerIndex;
	boundaryTriggers[triggerIndex].SetActive (true);	
}

function StartPlayer (waitTime : float) : IEnumerator {
	player.transform.position.x = -(playfieldWidth / 2);
	yield WaitForSeconds (waitTime);
	player.gameObject.SetActive (true);
	playerExplosion.SetActive (false);
	player.canMove = true;
	//player.canFire = true;
	GetComponent (InvaderManager).invadersCanMove = true;
	m_playerHalt = false;
}

function NextLevel () : IEnumerator {
	m_playerHalt = true;
	m_levelInProgress = false;
	// If the player got blown up and is waiting to respawn, or an invader or bomb is falling, wait until that stuff is done
	while (!player.canMove || GetComponent (InvaderManager).invaderFalling || GetComponent (InvaderManager).bombCount > 0) {
		yield;
	}
	GetComponent (InvaderManager).invadersCanMove = false;
	//player.canFire = false;
	yield WaitForSeconds (1.5);
	nextLevelAudio.Play();
	GetComponent (InvaderManager).LowerStartHeight();

	// Lerp 640 units forward (exactly 2 ground meshes)
	var t = 0.0;
	var startPos = transform.position.z;
	while (t < 1.0) {
		t += Time.deltaTime * 0.3;
		transform.position.z = startPos + Mathf.Lerp (0, 640, Mathf.SmoothStep (0.0, 1.0, t));	// Apply smoothing to the lerp so it eases in and out
		// After moving a little ways, so the old playfield is out of sight, do a switchover where we set up the player and stuff again
		if (t > 0.4 && !m_didSwitchover) {
			m_didSwitchover = true;
			// Reset player
			player.canMove = false;
			player.gameObject.SetActive (false);
			StartPlayer (2.25);
			// Reset invaders and bunkers
			GetComponent (InvaderManager).SetInvaderContainerPosition (playfieldWidth);
			GetComponent (InvaderManager).StartInvaders (false, 1.0);
			//GetComponent (BunkerManager).SetBunkers();
			// Move back 640 units...the ground meshes are all identical so it looks like the terrain is endless
			startPos -= 640.0;
		}
		yield;
	}
	
	m_didSwitchover = false;	
	m_levelInProgress = true;
}

function AddScore (points : int) {
	score += points;
	if (score > highScore) {
		highScore = score;
	}
	
	scoreText.text = "Score   " + score;
	highScoreText.text = "High   " + highScore;
	
	if (score >= bonusLifeScore && !gotBonusLife) {
		gotBonusLife = true;
		ExtraLife();
	}
}

function ExtraLife () : IEnumerator {
	extraLives++;
	AddLifeIcon();
	extraLifeAudio.Play();
	// Make a sparkle effect behind the bonus life 
	flareImage.gameObject.SetActive (true);
	SetIconPos (flareImage.GetComponent (RectTransform), lifeIcons.Count-1);
	var t = 1.0;
	while (t > 0.0) {
		t -= Time.deltaTime * 0.5;
		flareImage.transform.Rotate (Vector3.forward * Time.deltaTime * 50.0);
		flareImage.transform.localScale = Vector3(t * 1.25, t * 1.25, 1.0);
		yield;
	}
	flareImage.gameObject.SetActive (false);
}

function AddLifeIcon () {
	lifeIcons.Add (Instantiate (extraLifeIcon));
	var i = lifeIcons.Count - 1;
	lifeIcons[i].transform.SetParent (canvas, false);
	SetIconPos (lifeIcons[i].GetComponent (RectTransform), i);
}

function SetIconPos (rectTransform : RectTransform, i : int) {
	rectTransform.anchoredPosition = Vector2(24 + i*26, 19);
}

function ExplodePlayer () {
	// Deactivate player temporarily and activate the player explosion
	player.gameObject.SetActive (false);
	player.canMove = false;
	m_playerHalt = true;
	playerExplosion.transform.position = player.transform.position;
	playerExplosion.SetActive (true);
	GetComponent (InvaderManager).invadersCanMove = false;
	GetComponent (CameraShake).Shake();
	SubtractLife();
}

function SubtractLife () : IEnumerator {
	// Remove a life
	if (lifeIcons.Count > 0) {
		Destroy (lifeIcons[lifeIcons.Count-1]);
		lifeIcons.RemoveAt (lifeIcons.Count-1);
	}

	yield WaitForSeconds (3.0);
	if (--extraLives < 0) {
		GameOver (0.0);
	}
	else {
		player.canMove = true;
		// If the level is in progress, respawn player
		// But if the player got blown up after destroying the last invader, let the NextLevel function handle respawn instead
		if (m_levelInProgress) {
			StartPlayer (0.0);
			GetComponent (InvaderManager).BombControl (0.5);
		}
	}
}

function GameOver (delay : float) : IEnumerator {
	player.gameObject.SetActive (false);	// Deactivate in case invaders landed
	PlayerPrefs.SetInt ("HighScore", highScore);
	yield WaitForSeconds (delay);
	
	// Display "game over" text one letter at a time
	gameOverText.gameObject.SetActive (true);
	gameOverText.text = "";
	var message = "Game Over";
	
	for (var i = 0; i < message.Length; i++) {
		gameOverText.text += message[i] + " ";
		yield WaitForSeconds (0.15);
	}
	
	yield WaitForSeconds (2.0);
	Application.LoadLevel ("Title");
}

function Update () {
	if (Input.GetButtonDown ("Reset")) {
		Application.LoadLevel ("MainGame");
	}
	if (Input.GetButtonDown ("Pause")) {
		paused = !paused;
		Time.timeScale = paused? 0.0 : 1.0;
		pauseText.gameObject.SetActive (paused);
	}
}