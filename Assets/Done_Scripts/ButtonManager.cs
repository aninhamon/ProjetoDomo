using UnityEngine;
using System.Collections;
using UnityEngine.SceneManagement;

public class ButtonManager : MonoBehaviour {

    public string nextScene;

    //public string newGameLevel;

	/*public void StartGameBtn (string newGameLevel)
    {
        SceneManager.LoadScene(newGameLevel);
    }*/

    void Update()
    {
        if (Input.GetButtonDown("Start"))
        {
            SceneManager.LoadScene(nextScene);
        }

        if (Input.GetButtonDown("Exit"))
        {
            Application.Quit();
        }
    }
}
