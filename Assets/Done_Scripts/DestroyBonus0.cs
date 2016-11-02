using UnityEngine;
using System.Collections;

// Bonus de tempo; add tempo para a equipe

public class DestroyBonus0 : MonoBehaviour
{
    public GameObject bonus0Explosion;
    public float timeBonus;
    private Done_GameController game0Controller;

    void Start()
    {
        GameObject gameControllerObject = GameObject.FindGameObjectWithTag("GameController");
        if (gameControllerObject != null)
        {
            game0Controller = gameControllerObject.GetComponent<Done_GameController>();
        }
        if (game0Controller == null)
        {
            Debug.Log("Cannot find 'GameController' script");
        }
    }

    void OnTriggerEnter(Collider other)
    {
        if (other.tag == "Boundary" || other.tag == "Enemy")
        {
            return;
        }

        if (bonus0Explosion != null)
        {
            Instantiate(bonus0Explosion, transform.position, transform.rotation);
        }

        game0Controller.AddTime(timeBonus);
        game0Controller.damageCount++;

        if (game0Controller.damageCount > 4)
            game0Controller.GetComponent<AudioSource>().volume = 10f;

        Destroy(other.gameObject);
        Destroy(gameObject);
    }
}