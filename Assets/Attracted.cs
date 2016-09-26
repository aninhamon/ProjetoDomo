using UnityEngine;
using System.Collections;

public class Attracted : MonoBehaviour {
    public GameObject attractedTo;
    public float strengthOfAttraction;

    // Use this for initialization
    void Start () {
	
	}
	
	// Update is called once per frame
	void Update () {
        Vector3 direction = attractedTo.transform.position - transform.position;
        GetComponent<Rigidbody>().AddForce(strengthOfAttraction * direction);
    }

}
