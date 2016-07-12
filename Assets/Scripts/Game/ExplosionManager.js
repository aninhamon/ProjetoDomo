// Object pooling for explosions...more efficient than constantly instantiating and destroying GameObjects
#pragma strict

// Use an enum to avoid magic numbers, so we can do things like "Explode (ExplosionType.Invader)" instead of "Explode (0)", which is kind of meaningless
enum ExplosionType {Invader, Dud, Bomb, Bunker}

var invaderExplosionPrefab : GameObject;
var dudExplosionPrefab : GameObject;
var bombExplosionPrefab : GameObject;
var bunkerExplosionPrefab : GameObject;

private var explosionPools : ExplosionPool[];

static var use : ExplosionManager;

function Awake () {
	use = this;
	
	// Set up all explosion pools, using the number of items in the ExplosionType enum
	explosionPools = new ExplosionPool[System.Enum.GetValues (ExplosionType).Length];
	
	var deactivateDelay = invaderExplosionPrefab.transform.Find ("ExplosionSparks").GetComponent (ParticleSystem).startLifetime;
	explosionPools[ExplosionType.Invader] = new ExplosionPool(invaderExplosionPrefab, 10, deactivateDelay);
	
	deactivateDelay = dudExplosionPrefab.GetComponent (ParticleSystem).startLifetime;
	explosionPools[ExplosionType.Dud] = new ExplosionPool(dudExplosionPrefab, 5, deactivateDelay);

	deactivateDelay = dudExplosionPrefab.GetComponent (ParticleSystem).startLifetime;
	explosionPools[ExplosionType.Bomb] = new ExplosionPool(bombExplosionPrefab, 10, deactivateDelay);

	//deactivateDelay = bunkerExplosionPrefab.GetComponent (ParticleSystem).startLifetime;
	//explosionPools[ExplosionType.Bunker] = new ExplosionPool(bunkerExplosionPrefab, GetComponent (BunkerManager).numberOfBunkers, deactivateDelay);
}

function Explode (type : ExplosionType, position : Vector3) {
	var thisPool = explosionPools[type];	// Points to the specified pool, so we don't have to keep saying "explosionPools[type]" all the time
	// Find the first object in the pool that's not active, and use that for an index value
	var index = 0;
	for (var i = 0; i < thisPool.pool.Length; i++) {
		if (!thisPool.pool[i].activeInHierarchy) {
			index = i;
			break;
		}
	}
	var poolObject = thisPool.pool[index];	// Points to a particular object in the appropriate pool array
	poolObject.SetActive (true);
	poolObject.transform.position = position;
	DeactivateExplosion (thisPool.deactivateDelay, poolObject);
}

function DeactivateExplosion (delay : float, poolObject : GameObject) : IEnumerator {
	yield WaitForSeconds (delay);
	poolObject.SetActive (false);
}