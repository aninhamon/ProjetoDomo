﻿using UnityEngine;
using System.Collections;

public class Bolt_Mover : MonoBehaviour {

    public float speed;
    // Use this for initialization
    void Start () {
	
	}
	
	// Update is called once per frame
	void Update () {
        GetComponent<Rigidbody>().velocity = (transform.up * speed);
        Destroy(gameObject, 10);
    }
}