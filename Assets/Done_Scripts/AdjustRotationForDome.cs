using UnityEngine;
using System.Collections;
using System;

public class AdjustRotationForDome : MonoBehaviour {

    //ainda vai usar:
    // Vector3 alienCenter
    // Vector3 alienTop
    public Transform centro;

    // Use this for initialization
    void Start()
    {
        transform.LookAt(centro.position);       
        transform.eulerAngles = new Vector3(transform.eulerAngles.x,transform.eulerAngles.y + 180,transform.eulerAngles.z);
    }

    // Update is called once per frame
    void Update () {
	
	}
    
}
