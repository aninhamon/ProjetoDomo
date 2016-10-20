using UnityEngine;

public class CamRotate : MonoBehaviour
{
    public float rotateSpeed = 1f, scrollSpeed = 200f;
    public Transform pivot;

    public SphericalCoordinates sc;

    private void Start()
    {
        sc = new SphericalCoordinates(transform.position, 3f, 10f, 0f, Mathf.PI * 2f, 0f, Mathf.PI / 4f);
        // Initialize position
        transform.position = sc.toCartesian + pivot.position;
    }

    void Update()
    {
        float kh, kv, mh, mv, h, v;
        kh = Input.GetAxis("Horizontal");
        kv = Input.GetAxis("Vertical");

        bool anyMouseButton = Input.GetMouseButton(0) | Input.GetMouseButton(1) | Input.GetMouseButton(2);
        mh = anyMouseButton ? Input.GetAxis("Mouse X") : 0f;
        mv = anyMouseButton ? Input.GetAxis("Mouse Y") : 0f;

        h = kh * kh > mh * mh ? kh : mh;
        v = kv * kv > mv * mv ? kv : mv;

        if (h * h > .1f || v * v > .1f)
            transform.position = sc.Rotate(h * rotateSpeed * Time.deltaTime, v * rotateSpeed * Time.deltaTime).toCartesian + pivot.position;

        float sw = -Input.GetAxis("Mouse ScrollWheel");
        if (sw * sw > Mathf.Epsilon)
            transform.position = sc.TranslateRadius(sw * Time.deltaTime * scrollSpeed).toCartesian + pivot.position;

        transform.LookAt(pivot.position);
    }
}
