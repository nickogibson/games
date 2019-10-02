using UnityEngine;
using System.Collections;
using System.Collections.Generic;
using Cinemachine;


public class LongboardController : Driveable {
  //  public List<AxleInfo> axleInfos;  // the information about each individual axle
	//public List<AxleInfo> axleInfosRear;
  //  public float maxMotorTorque; // maximum torque the motor can apply to wheel

	//public float steeringStrength =0.6f;
   // public float maxSteeringAngle; // maximum steer angle the wheel can have

	public Animator anim;
	public GameObject armature;
    public GameObject skeleton;
    public Transform[] limbs;
    public CinemachineFreeLook vcam;
    private Transform currentVcamTarget;
    private Rigidbody boardRigidbody;
    public Rigidbody playerRigidbody;
    [Range(0, 1)] public float leaning;
    public bool addDownforce; [SerializeField] private float downforce =100;
	public float _Torque;
    private Vector3 rVelocity;
    private Vector3 rAngVelocity;
    public float jumpForce;
	private float steering;
    public GameObject attachTo;  //vehicle
	private bool isAttached;
	private float interact;
	private Vector3 safePos; private Vector3 armatureSafePos;
	private Quaternion safeRot; private Quaternion armatureSafeRot;
	public float timeSinceSafePos;
	public float fallingTime;
	public bool falling;
	private float DisstanceToTheGround;
    private bool IsGrounded;

	[SerializeField] private float airSpinning = 4000f;
    [SerializeField] private float airFlipping = 4000f;
    public ConfigurableJoint skateJoint; 
	private float _breakForce, _breakTorque, _connectedMassScale, _massScale;
    private ConfigurableJointMotion _xMotion, _yMotion, _zMotion, _angularXMotion, _angularYMotion, _angularZMotion;
    private bool _enablePreprocessing;

    void Start(){
        //anim = GetComponentInChildren(typeof(Animator)) as Animator;
        //anim = GetComponentInChildren<Animator>();
        currentVcamTarget = vcam.Follow;
       // armature.transform.position = new Vector3(0,-0.179f,0);
		DisstanceToTheGround = GetComponent<Collider>().bounds.extents.y;
	
		

	//armature.transform.rotation = new Vector3(0,-90,0);
	}
	void OnEnable(){
        limbs = skeleton.gameObject.GetComponentsInChildren<Transform>();
        safePos = transform.position;
		armatureSafePos= armature.transform.position;
        boardRigidbody = GetComponent<Rigidbody>();
        
		skateJoint = this.GetComponent<ConfigurableJoint>();
		//save the old settings;
		_breakForce = skateJoint.breakForce; _breakTorque = skateJoint.breakTorque;
        _enablePreprocessing = skateJoint.enablePreprocessing;

		_connectedMassScale= skateJoint.connectedMassScale; _massScale = skateJoint.massScale;

        
    }

	    // finds the corresponding visual wheel
    // correctly applies the transform
    public void ApplyLocalPositionToVisuals(WheelCollider collider)
    {
        if (collider.transform.childCount == 0) {
            return;
        }
     
        Transform visualWheel = collider.transform.GetChild(0);
     
        Vector3 position;
        Quaternion rotation;
        collider.GetWorldPose(out position, out rotation);
     
        visualWheel.transform.position = position;
        visualWheel.transform.rotation = rotation;
    }



    public void FixedUpdate()
    {
 
        float vertInput = Input.GetAxis("Vertical");
        float horizInput = Input.GetAxis("Horizontal");
        IsGrounded = Physics.Raycast(transform.position, Vector3.down, DisstanceToTheGround + 0.3f);
        rVelocity = armature.GetComponent<Rigidbody>().velocity;
        rAngVelocity = armature.GetComponent<Rigidbody>().angularVelocity;

        if (!falling && IsGrounded)
		{

            _Torque = maxMotorTorque * vertInput;
			steering = (maxSteeringAngle) * horizInput;

			interact = Input.GetAxis("Interact");
			leaning = vertInput;
            if (Input.GetButtonDown("Jump")){
                boardRigidbody.AddForce(new Vector3(0, jumpForce, 0), ForceMode.Impulse);
            }


			if(interact > 0 && attachTo != null){
                if (attachTo.GetComponent<ConfigurableJoint>() == null)
                {
                    attachTo.GetComponent<UnityStandardAssets.Vehicles.Car.CarAIControl>().CreateAttachmentJoint(boardRigidbody);
                    //attachTo.GetComponent<ConfigurableJoint>().connectedBody = boardRigidbody;

                }
                else {
                    attachTo.GetComponent<UnityStandardAssets.Vehicles.Car.CarAIControl>().DestroyJoint();
                }
            }
		}

		if(!IsGrounded && !falling){
			float horiz = (horizInput * airSpinning) * Time.deltaTime;
			float vert = (vertInput  * airFlipping) * Time.deltaTime;
            boardRigidbody.AddTorque(transform.up *horiz);
            boardRigidbody.AddTorque(transform.right *vert);
		}

		//looking for safe respawn ground
		timeSinceSafePos += Time.deltaTime;
		if (timeSinceSafePos > 3 && !falling){
			 if (IsGrounded && safePos != transform.position)
            {
		 		 safePos = transform.position;
				 armatureSafePos= armature.transform.position;
				 safeRot = transform.rotation;
				 armatureSafeRot = armature.transform.rotation;

				Vector3 fixedPos = new Vector3(safePos.x, safePos.y + 0.2f, safePos.z);
				Vector3 playerFixedPos = new Vector3(armatureSafePos.x, armatureSafePos.y + 0.2f, armatureSafePos.z);
				safePos = fixedPos;
				armatureSafePos = playerFixedPos;
				
				timeSinceSafePos = 0;
			 }
			 else{ timeSinceSafePos-= 1.5f; }

		}

		//waiting to respawn
		if (fallingTime > 0)
		{
			if(Time.time > fallingTime +3)
			{				
				 if (playerRigidbody.velocity.magnitude  < 2.5f ){

                    if (boardRigidbody.velocity.magnitude > 10 && Time.time < fallingTime + 10 && !Input.GetButtonDown("Respawn"))
                    {
                        vcam.Follow = transform;
                        vcam.LookAt = transform;
                    }
                    else
                    {
                        PlayerRespawn();
                    }
                  //  CameraControl playerCam = GetComponentInChildren<CameraControl>();
                  //  playerCam.TrailCam = false;
                 }
			}
		}

        //camera recentering fix
            if(playerRigidbody.velocity.magnitude < 1)
            {
                vcam.m_RecenterToTargetHeading.m_enabled = false;
            }
            else
            {
                vcam.m_RecenterToTargetHeading.m_enabled = true ;
            }


        foreach (AxleInfo axleInfo in axleInfos) {
            if (axleInfo.steering) {
                axleInfo.leftWheel.steerAngle = steering*0.6f;
                axleInfo.rightWheel.steerAngle = steering*0.6f;
            }
            if (axleInfo.motor) {
                axleInfo.leftWheel.motorTorque = _Torque;
                axleInfo.rightWheel.motorTorque = _Torque;
            }

            if (addDownforce)
            {
			 axleInfo.leftWheel.attachedRigidbody.AddForce(-transform.up*downforce*
                                                         ( 1+ axleInfo.leftWheel.attachedRigidbody.velocity.magnitude));
			axleInfo.rightWheel.attachedRigidbody.AddForce(-transform.up*downforce*
            (1+ axleInfo.rightWheel.attachedRigidbody.velocity.magnitude));

            }
        }

		foreach (AxleInfo axleInfo in axleInfosRear) {
            if (axleInfo.steering) {
                axleInfo.leftWheel.steerAngle = -steering;
                axleInfo.rightWheel.steerAngle = -steering;
            }
            if (axleInfo.motor) {
                axleInfo.leftWheel.motorTorque = _Torque;
                axleInfo.rightWheel.motorTorque = _Torque;
            }

            if (addDownforce)
            {
                axleInfo.leftWheel.attachedRigidbody.AddForce(-transform.up * downforce *
                                                    (1 + axleInfo.leftWheel.attachedRigidbody.velocity.magnitude));
                axleInfo.rightWheel.attachedRigidbody.AddForce(-transform.up * downforce *
                (1 + axleInfo.rightWheel.attachedRigidbody.velocity.magnitude));
            }
        }

		

		if (leaning > 0.1f && !falling)
		{
			anim.SetBool("isLeaning",true);
			
		}else {
			anim.SetBool("isLeaning",false);
			//anim.SetBool("isSkating", true);
		}


    }
    //end fixed update

	void OnJointBreak(float _Force)
	{     
        skateJoint.massScale = skateJoint.connectedBody.mass / boardRigidbody.mass;
        skateJoint.connectedMassScale = 1f;
        Debug.Log("Fell off board, breakForce: " + _Force);
		fallingTime = Time.time;
		falling = true;

        if (attachTo != null && attachTo.GetComponent<ConfigurableJoint>() != null)
        {
            attachTo.GetComponent<UnityStandardAssets.Vehicles.Car.CarAIControl>().DestroyJoint();
          
        }

        //Transform[] limbs = skeleton.gameObject.GetComponentsInChildren<Transform>();
       // skeleton.transform.parent = armature.transform.parent;
        foreach (Transform limb in limbs)
        {
            if (limb.GetComponent<Rigidbody>() != null)
            {
                limb.GetComponent<Rigidbody>().isKinematic = false;
                limb.GetComponent<Rigidbody>().velocity = rVelocity;
                limb.GetComponent<Rigidbody>().angularVelocity = rAngVelocity;
            }
        }
        armature.GetComponent<Rigidbody>().isKinematic = true;
        armature.GetComponent<CapsuleCollider>().enabled = false;
        anim.enabled = false;
        //CameraControl playerCam = GetComponentInChildren<CameraControl>();
        //  playerCam.TrailCam = true;


    }

    void PlayerRespawn() {
        foreach (Transform limb in limbs)
        {
            if (limb.GetComponent<Rigidbody>() != null)
            {

                limb.GetComponent<Rigidbody>().isKinematic = true;
                limb.GetComponent<Rigidbody>().velocity = Vector3.zero;
                limb.GetComponent<Rigidbody>().angularVelocity = Vector3.zero;
            }
        }
        playerRigidbody.velocity = Vector3.zero;
        boardRigidbody.velocity = Vector3.zero;
        playerRigidbody.angularVelocity = Vector3.zero;
        boardRigidbody.angularVelocity = Vector3.zero;
        //	 boardRigidbody.isKinematic = true;
        //	 GetComponent<Rigidbody>().isKinematic = true;

        transform.position = safePos;
        transform.rotation = safeRot;

        armature.transform.position = armatureSafePos;
        armature.transform.rotation = armatureSafeRot;
        armature.GetComponent<CapsuleCollider>().enabled = true;
        armature.GetComponent<Rigidbody>().isKinematic = false;
        anim.enabled = true;

        // Transform[] limbs = skeleton.gameObject.GetComponentsInChildren<Transform>();
     //   skeleton.transform.parent = armature.transform;

        vcam.Follow = currentVcamTarget;
        vcam.LookAt = currentVcamTarget;

        skateJoint = gameObject.AddComponent<ConfigurableJoint>();

        skateJoint.enablePreprocessing = _enablePreprocessing;

        skateJoint.breakForce = _breakForce;
        skateJoint.breakTorque = _breakTorque;
        skateJoint.connectedMassScale = _connectedMassScale;
        skateJoint.massScale = _massScale;
        skateJoint.xMotion = _xMotion;
        skateJoint.yMotion = _yMotion;
        skateJoint.zMotion = _zMotion;
        skateJoint.angularXMotion = _angularXMotion;
        skateJoint.angularYMotion = _angularYMotion;
        skateJoint.angularZMotion = _angularZMotion;


        skateJoint.connectedBody = playerRigidbody;
        //	  GetComponent<Rigidbody>().isKinematic = false;
        // boardRigidbody.isKinematic = false;

        fallingTime = 0;
        falling = false;
    }

}
    
//[System.Serializable]
//public class AxleInfo {
  //  public WheelCollider leftWheel;
   // public WheelCollider rightWheel;
   // public bool motor; // is this wheel attached to motor?
   // public bool steering; // does this wheel apply steer angle?
//}