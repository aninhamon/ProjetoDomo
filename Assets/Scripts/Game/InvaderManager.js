#pragma strict
import System.Collections.Generic;

var columns = 11;
var startHeight = 57.3;
var minHeight = 36.3;
var spacing = Vector2(5, 6);
var initialSpeed = 1.6;
var speedup = 1.625;
var invaderInfo : Invader[];
var invaderContainer : Transform;
var invaderAudio : AudioSource;
var landedAudio : AudioSource;
var dudChance = 0.15;
var smokeTrail : GameObject;
var bombs : GameObject[];
var bombMaterial : Material;
var bombSpeed = 25.0;
var accurateBombChance = 0.42;

private var playerTransform : Transform;
private var invaders : GameObject[,];
private var invaderMaterials : Material[];
private var direction : int;
private var animateTimer : float;
private var animateInterval : float;
private var invaderCount : int;
private var speedupCount : int;
private var speed : float;
private var pitchCount = 0;
private var animFrame = 0;
private var bombAnimFrame = 0;
private var landed = false;
private var sharedBombMaterial : Material;
private var rows : int;
private var activeColumns : List.<int>;
private var activeLayer : int;
private var inactiveLayer : int;
private var columnCount : int[];
private var bombIndex = 0;
private var twoBombs = false;
private var m_invaderFalling : boolean;
function get invaderFalling () : boolean {return m_invaderFalling;}
private var m_invadersCanMove : boolean;
function get invadersCanMove () : boolean {return m_invadersCanMove;}
function set invadersCanMove (value : boolean) {m_invadersCanMove = value;}
private var m_bombCount : int;
function get bombCount () : int {return m_bombCount;}

static var use : InvaderManager;

function Setup (playerTransform : Transform) {	// Called by GameManager in order to initialize in the correct order
	use = this;
	this.playerTransform = playerTransform;

	// Get row count, and while we're at it, instantiate materials to use with .sharedMaterial
	// That way we can alter the materials at runtime without affecting the materials in the project
	invaderMaterials = new Material[invaderInfo.Length];
	rows = 0;
	for (var i = 0; i < invaderInfo.Length; i++) {
		rows += invaderInfo[i].rows;
		invaderMaterials[i] = Instantiate (invaderInfo[i].material);
	}
	invaders = new GameObject[columns, rows];
	
	sharedBombMaterial = Instantiate (bombMaterial);
	for (i = 0; i < bombs.Length; i++) {
		bombs[i].GetComponent (Renderer).sharedMaterial = sharedBombMaterial;
	}
	
	// Instantiate all invaders, and assign ID and sharedMaterial to each one
	// The number of rows for each invader type, and the score, is defined in the invaderInfo array
	var typeIndex = 0;
	var indexCount = 0;
	for (var y = 0; y < rows; y++) {
		for (var x = 0; x < columns; x++) {
			invaders[x, y] = Instantiate (invaderInfo[typeIndex].prefab);
			invaders[x, y].GetComponent (InvaderControl).SetID (x, y, typeIndex);
			invaders[x, y].GetComponent (Renderer).sharedMaterial = invaderMaterials[typeIndex];
			// Parent invaders to container, so moving the container will move all invaders at once
			invaders[x, y].transform.SetParent (invaderContainer, false);
			invaders[x, y].SetActive (false);
		}
		if (++indexCount == invaderInfo[typeIndex].rows) {
			++typeIndex;
			indexCount = 0;
		}
	}
	
	InvokeRepeating ("AnimateBombs", 0.1, 0.1);
	
	// Initialize list of active invader columns, used when dropping bombs to select which column to use
	activeColumns = new List.<int>(columns);
	columnCount = new int[columns];
	// Store layer used by dead invaders
	inactiveLayer = LayerMask.NameToLayer ("Ground");
}

function SetInvaderContainerPosition (width : float) {
	invaderContainer.position.x = -(width / 2);
	invaderContainer.position.y = startHeight;
}

function StartInvaders (startAnim : boolean, delay : float) : IEnumerator {
	// Set up bunkers, unless the start height is too low in which case disable them
	/*if (startHeight > minHeight + 6) {
		GetComponent (BunkerManager).SetBunkers();
	}
	else {
		GetComponent (BunkerManager).DisableBunkers();
	}*/

	m_invadersCanMove = false;
	m_invaderFalling = false;
	// Activate invaders...if using startAnim, do one at a time
	for (var y = invaders.GetLength(1) - 1; y >= 0; y--) {
		for (var x = 0; x < invaders.GetLength(0); x++) {
			invaders[x, y].SetActive (true);
			invaders[x, y].GetComponent (InvaderControl).Setup();
			invaders[x, y].transform.localPosition = Vector3(x*spacing.x, -y*spacing.y, 0);
			if (startAnim) {
				yield WaitForSeconds (.01);
			}
		}
	}
	invaderCount = invaders.GetLength(0) * invaders.GetLength(1);
	speedupCount = invaderCount * 0.6;
	
	// Initialize stuff so invaders start off moving to the right
	direction = 1;
	GameManager.use.InitializeBoundaryTriggers();
	
	// Set up column list...each entry in activeColumns is indexed by the column number
	for (var i = 0; i < columns; i++) {
		activeColumns.Add (i);
		columnCount[i] = rows;
	}
	
	yield WaitForSeconds (delay);
	m_invadersCanMove = true;
	m_bombCount = 0;
	animateInterval = 0.95;
	animateTimer = animateInterval;
	speed = initialSpeed;
	pitchCount = 0;
	animFrame = 0;
	
	BombControl (2.5);
}

function BombControl (startDelay : float) : IEnumerator {
	yield WaitForSeconds (startDelay);
	
	// Continue dropping bombs as long as the player isn't halted (killed or finished the level)
	// This routine will be restarted when the player respawns or starts the next level
	while (!GameManager.use.playerHalt) {
		if (twoBombs) {
			DropBomb (0.1);
			yield DropBomb (0.65);
		}
		else {
			yield DropBomb (0.1);
		}
	}
}

function DropBomb (delay : float) : IEnumerator {
	yield WaitForSeconds (delay);
	if (invaderCount == 0) return;
	
	// Sometimes, choose column that's closest to the player
	if (Random.value < accurateBombChance) {
		var column = 0;
		var closestDistance = 99999.0;
		for (var x = 0; x < activeColumns.Count; x++) {
			var thisDistance = Mathf.Abs (invaders[activeColumns[x], GetLowest (x)].transform.position.x - playerTransform.position.x);
			if (thisDistance < closestDistance) {
				closestDistance = thisDistance;
				column = activeColumns[x];
			}
		}
	}
	// Otherwise choose random column from whatever columns are active now
	else {
		column = activeColumns[Random.Range (0, activeColumns.Count)];
	}

	var row = GetLowest (column);
	bombIndex = ++bombIndex % bombs.Length;
	bombs[bombIndex].SetActive (true);
	bombs[bombIndex].transform.position = invaders[column, row].transform.position - Vector3.up*3;
	bombs[bombIndex].GetComponent (Rigidbody).velocity.y = -bombSpeed;
	m_bombCount++;
	
	// Wait until the bomb hits something and is deactivated
	while (bombs[bombIndex].activeInHierarchy) {
		yield;
	}
	m_bombCount--;
}

// Find lowest active alien in the column
function GetLowest (x : int) : int {
	for (var y = rows-1; y > 0; y--) {
		if (invaders[x, y].gameObject.layer != inactiveLayer) {
			return y;
		}
	}
	return 0;
}

function AnimateBombs () {
	bombAnimFrame = 1 - bombAnimFrame;
	sharedBombMaterial.mainTextureOffset = Vector2(bombAnimFrame * 0.5, 0.0);
}

function Update () {
	if (!m_invadersCanMove) return;
	
	invaderContainer.Translate (Vector3.right * (speed * direction * Time.deltaTime) );
	animateTimer += Time.deltaTime;
	if (animateTimer > animateInterval) {
		// Play invader march sound and change pitch
		animateTimer = 0.0;
		pitchCount = ++pitchCount % 4;
		invaderAudio.pitch = 1.0 - (pitchCount * 0.1);
		invaderAudio.Play();
		// Alternate animFrame between 1 and 0 to animate frames by offsetting materials
		animFrame = 1 - animFrame;
		for (var i = 0; i < invaderMaterials.Length; i++) {
			invaderMaterials[i].mainTextureOffset = Vector2(animFrame * 0.5, 0.0);
		}
	}
}

function ReverseMovement () {
	if (!m_invadersCanMove) return;	// Prevent this function from potentially being called again while invaders are moving down
	
	direction = -direction;
	GameManager.use.FlipBoundaryTriggers();
	MoveInvadersDown();
}

function MoveInvadersDown () : IEnumerator {
	m_invadersCanMove = false;
	
	// Move down a row
	var startPos = invaderContainer.position.y;
	var endPos = startPos - spacing.y/2;
	var t = 0.0;
	while (t < 1.0) {
		yield;
		t += Time.deltaTime * speed * 1.26;
		invaderContainer.position.y = Mathf.Lerp (startPos, endPos, t);
	}
	// If player got blown up while we were moving down, wait until he's going again (hey, it's only fair)
	while (GameManager.use.playerHalt) {
		yield;
	}
	
	if (!landed) {
		m_invadersCanMove = true;
		animateTimer = animateInterval;	// So the frame animation happens right after moving down
	}
}

function Landed () : IEnumerator {
	landed = true;
	m_invadersCanMove = false;
	landedAudio.Play();
	GameManager.use.GameOver (1.0);
}

function RemoveInvader (x : int, y : int, type : int, fall : boolean) {
	if (fall) {
		InvaderFall (invaders[x, y], type);
	}
	else {
		invaders[x, y].layer = inactiveLayer;
		invaders[x, y].SetActive (false);
	}
	GameManager.use.AddScore (invaderInfo[type].points);
	
	// Speed up when the number of invaders has been reduced enough
	if (--invaderCount <= speedupCount) {
		twoBombs = true;	// Invaders drop only one bomb at a time until the first speedup occurs, then they always drop two
		speedupCount = invaderCount * 0.6;
		animateInterval *= 0.66;
		speed *= speedup;
	}
	
	// If there are no more invaders in the relevant column, remove corresponding element in activeColumns
	if (--columnCount[x] == 0) {
		activeColumns.RemoveAt (activeColumns.IndexOf (x));
	}
	
	// No more invaders = time for next level!
	if (invaderCount == 0) {
		GameManager.use.NextLevel();
	}
}

function InvaderFall (invader : GameObject, type : int) {
	m_invaderFalling = true;
	smokeTrail.transform.position = invader.transform.position + Vector3.forward*0.1;
	smokeTrail.transform.SetParent (invader.transform, true);
	smokeTrail.SetActive (true);
	smokeTrail.GetComponent (AudioSource).Play();
	
	invader.GetComponent (Renderer).sharedMaterial = invaderInfo[type].destroyedMaterial;
	// If falling, change layer to ground (which is set to ignore other layers in the physics settings), so we can't get hit by a missile again
	invader.layer = inactiveLayer;
	// Rotate randomly so we're pointing down, and add some force, while getting rid of constraints so the force will work
	invader.transform.Rotate (-5.0, 0.0, Random.Range (135.0, 225.0));
	invader.GetComponent (Rigidbody).constraints = RigidbodyConstraints.None;
	invader.GetComponent (Rigidbody).AddRelativeForce (Vector3.up * 25.0, ForceMode.VelocityChange);
}

function HitGround (x : int, y : int, type : int) {
	invaders[x, y].GetComponent (Renderer).sharedMaterial = invaderMaterials[type];
	DetachSmoke();
	invaders[x, y].SetActive (false);
}

function DetachSmoke () : IEnumerator {
	smokeTrail.GetComponent (ParticleSystem).Stop();
	smokeTrail.transform.parent = null;
	yield WaitForSeconds (smokeTrail.GetComponent (ParticleSystem).startLifetime);
	smokeTrail.SetActive (false);
	m_invaderFalling = false;
}

function LowerStartHeight () {
	startHeight = Mathf.Max (startHeight - spacing.y/2, minHeight);	// Have the invaders start down a row next level (up to a point)
}