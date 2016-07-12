// A class for explosion pools, where each type has an array of game objects and a delay value (for how long it's on-screen when activated)
#pragma strict

class ExplosionPool {
	var pool : GameObject[];
	var deactivateDelay : float;
	
	function ExplosionPool (prefab : GameObject, poolSize : int, deactivateDelay : float) {
		pool = new GameObject[poolSize];
		for (var i = 0; i < poolSize; i++) {
			pool[i] = MonoBehaviour.Instantiate (prefab);
			pool[i].SetActive (false);
		}
		this.deactivateDelay = deactivateDelay;
	}
}