// Lets player control the base by moving and shooting, and manages missile pool
#pragma strict

var moveSpeed = 14.0;
var missile : GameObject;

private var leftBoundary : float;
private var rightBoundary : float;
private var topBoundary : float;
private var downBoundary : float;
private var missileIndex : int;
private var missiles : MissileControl[];
private var m_canMove = true;
function get canMove () : boolean {return m_canMove;}
function set canMove (value : boolean) {m_canMove = value;}
private var m_canFire = true;
//function get canFire () : boolean {return m_canFire;}
//function set canFire (value : boolean) {m_canFire = value;}

function Start () {
	// Instantiate a pool of missiles. We cycle through these, instead of using the same one over and over,
	// in order to give the missile trail some time to shut down properly when a missile is destroyed.
	// Unfortunately the TrailRenderer component has limited control and can be finicky.
	missiles = new MissileControl[10];
	for (var i = 0; i < missiles.Length; i++) {
		missiles[i] = Instantiate (missile).GetComponent (MissileControl);
		missiles[i].Setup (this);
	}
	missileIndex = 0;
}

function SetBoundaries (playfieldWidth : float, playfieldHeight : float) {
	leftBoundary = -playfieldWidth;
	rightBoundary = playfieldWidth;
	topBoundary = playfieldHeight;
	downBoundary = -playfieldHeight/20;
}

function Update () {
	if (!m_canMove) return;
	
	var move = Input.GetAxis ("Horizontal") * Time.deltaTime * moveSpeed;
	transform.position.x = Mathf.Clamp (transform.position.x + move, leftBoundary, rightBoundary);

	var moveY = Input.GetAxis ("Vertical") * Time.deltaTime * moveSpeed;
	transform.position.y = Mathf.Clamp (transform.position.y + moveY, downBoundary, topBoundary);
	
	if (Input.GetButtonDown ("Fire") && m_canFire) {
		FireMissile();
	}
}

function FireMissile () {
	missiles[missileIndex].transform.position = transform.position;
	missiles[missileIndex].Launch();
	missileIndex = ++missileIndex % missiles.Length;	// Cycle through missile pool
	//m_canFire = false;	// Prevent player from firing more missiles (canFire is restored when the missile hits something)
}

/*function OnCollisionEnter () {
	GameManager.use.ExplodePlayer();
}*/