﻿using UnityEngine;
using System.Collections;

public class ShipCollision : MonoBehaviour {

    public GameObject explosion;
    public GameObject shipDamage;
    public int timeDecrease;
    private Done_GameController gameController;

    void Start()
    {
        GameObject gameControllerObject = GameObject.FindGameObjectWithTag("GameController");
        if (gameControllerObject != null)
        {
            gameController = gameControllerObject.GetComponent<Done_GameController>();
        }
        if (gameController == null)
        {
            Debug.Log("Cannot find 'GameController' script");
        }
    }

    void OnTriggerEnter(Collider other)
    {
        if (other.tag == "Enemy") //mudar a TAG dos aliens para Enemy
        {
            Instantiate(shipDamage, other.transform.position, other.transform.rotation);
            gameController.AddTime(-timeDecrease);
            Destroy(other.gameObject);
        }
       if (other.tag == "Bonus") 
        {
           Destroy(other.gameObject);
        }


    }
}