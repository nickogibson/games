using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Driveable : MonoBehaviour
{
	public List<AxleInfo> axleInfos;  // the information about each individual axle
	public List<AxleInfo> axleInfosRear;
    public float maxMotorTorque; // maximum torque the motor can apply to wheel

	public float steeringStrength =0.6f;
    public float maxSteeringAngle; // maximum steer angle the wheel can have
    // Start is called before the first frame update
    void Start()
    {
        
    }

    // Update is called once per frame
    void Update()
    {
        
    }
}
[System.Serializable]
public class AxleInfo {
    public WheelCollider leftWheel;
    public WheelCollider rightWheel;
    public bool motor; // is this wheel attached to motor?
    public bool steering; // does this wheel apply steer angle?
}