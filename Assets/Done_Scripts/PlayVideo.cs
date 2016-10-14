using UnityEngine;
using System.Collections;
using UnityEngine.UI;
using UnityEngine.SceneManagement;

[RequireComponent(typeof(AudioSource))]

public class PlayVideo : MonoBehaviour
{

    public MovieTexture movie;
    private AudioSource audio;

    public Transform canvas;
    public string nextScene;

    // Use this for initialization
    void Start()
    {
        GetComponent<RawImage>().texture = movie as MovieTexture;
        audio = GetComponent<AudioSource>();
        audio.clip = movie.audioClip;
        movie.Play();
        audio.Play();
    }

    // Update is called once per frame
    void Update()
    {
        if (Input.GetButtonDown("Pause") && movie.isPlaying)
        {
            movie.Pause();
            canvas.gameObject.SetActive(true);
                  
        }
        else if (Input.GetButtonDown("Pause") && !movie.isPlaying)
        {
            if (Input.GetButtonDown("Submit"))
            {
                SceneManager.LoadScene(nextScene);
            }
            else if (Input.GetButtonDown("Cancel") || (Input.GetButtonDown("Pause")))
            {
                canvas.gameObject.SetActive(false);
                movie.Play();
            }
            //canvas.gameObject.SetActive(false);
            //movie.Play();
        }
    }
}
