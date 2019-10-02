using UnityEngine;
using UnityEngine.AI;
using System.Collections;
using System.Collections.Generic;
using UMA;
using UMA.CharacterSystem;
using UMA.PoseTools;
using UMA.Dynamics;
 
	public class NPC : MonoBehaviour {
    
		[SerializeField] private GameObject armature;
		[SerializeField] private List<Transform> wayPoints;
		private int destPoint = 0;
		[SerializeField] private UnityEngine.AI.NavMeshAgent agent;
		[SerializeField] private bool randomPosition;
		//animation
		[SerializeField] private Animator anim;
        [SerializeField] private float animTimer;
        [SerializeField] private float animRandom = 1;
		[SerializeField] private bool jogger;
		[SerializeField] private bool isMoving, isWalking;
		[SerializeField] private bool isRunning;
		[SerializeField] private bool isIdle;
        [SerializeField] private bool isKO;
        [SerializeField] private bool isDead;

        public enum collisionLayers { Ragdoll =8, Player=9, Npc=10, pRagdoll=11};
        //public string animState;
        private DynamicCharacterAvatar avatar;
		private UMAPhysicsAvatar p_Avatar;
		private ExpressionPlayer expression;
		public enum Mood{ Neutral, Happy, Smiley, Sad, Surprised, Angry}
		public Mood mood = Mood.Neutral;
		private Mood lastMood = Mood.Neutral;


		private bool connected;
       // private bool ready;  private float readyTimer;
		private bool enabled;
		//Random rnd;

		private bool female;
        private bool male;
        //public NPC(bool randomPos)
        //{
        //    randomPosition = randomPos;
        //}

        void OnEnable()
		{
            avatar = GetComponent<DynamicCharacterAvatar>();
			avatar.CharacterCreated.AddListener(OnCreated);
		}
		void OnDisable()
		{
			avatar.CharacterCreated.RemoveListener(OnCreated);
		}
		void Start(){

		}

        void RandomMood(int _rnd)
        {
            switch (_rnd)
            {
                case 0:
                    mood = Mood.Neutral;
                    break;
                case 1:
                    mood = Mood.Happy;
                    break;
                case 2:
                    mood = Mood.Smiley;
                    break;
                case 3:
                    mood = Mood.Sad;
                    break;
                case 4:
                    mood = Mood.Angry;
                    break;
                case 5:
                    mood = Mood.Surprised;
                    break;
            }
        }
        void OnCreated(UMAData data)
        {
        expression = GetComponent<ExpressionPlayer>();
        expression.enableBlinking = true;
        expression.enableSaccades = true;
   //     gameObject.AddComponent<NPC>();
        connected = true;
            int rnd = Random.Range(0, 4);
            RandomMood(rnd);
        }    


		void StateSwitch(string animState){
		
			switch (animState)
			{
				case "moving":
					anim.SetBool("Idle",false);
					if(isRunning)
					{ 
						anim.SetInteger("Running",1); isRunning = true; 
					}
					else
					{
						anim.SetBool("Walking",true); isWalking = true; 
					}
					isIdle = false;
				//	agent.isStopped = false;
					
					break;
				case "idle":
					anim.SetBool("Idle",true); 	anim.SetBool("Walking",false);
					isWalking = false; isMoving = false;
					isIdle = true;
				break;

                case "KO":
                    anim.SetBool("Idle", false); anim.SetBool("Walking", false);
                    isWalking = false;
                    agent.isStopped = true;
                    isIdle = false;
                    int rnd = Random.Range(3, 5);
                    RandomMood(rnd);
                break;
            }

 
		    //	agent.speed = (anim.deltaPosition / Time.deltaTime).magnitude;
 
		
		}

		void Update () {
			
            if (connected && lastMood != mood)
            {
            lastMood = mood;
                switch (mood)
                {
                     case Mood.Neutral:
                    expression.leftMouthSmile_Frown = 0;
                    expression.rightMouthSmile_Frown = 0;
                    expression.leftEyeOpen_Close = 0;
                    expression.rightEyeOpen_Close = 0;
                    expression.midBrowUp_Down = 0;
                    expression.leftBrowUp_Down = 0;
                    expression.rightBrowUp_Down = 0;
                    expression.rightUpperLipUp_Down = 0;
                    expression.leftUpperLipUp_Down = 0;
                    expression.rightLowerLipUp_Down = 0;
                    expression.leftLowerLipUp_Down = 0;
                    expression.mouthNarrow_Pucker = 0;
                    expression.jawOpen_Close = 0;
                    expression.noseSneer = 0;

                    break;
                case Mood.Happy:
                    expression.leftMouthSmile_Frown = 0.7f;
                    expression.rightMouthSmile_Frown = 0.7f;
                    expression.leftEyeOpen_Close = 0.3f;
                    expression.rightEyeOpen_Close = 0.3f;
                    expression.midBrowUp_Down = 0.4f;
                    break;
                case Mood.Smiley:
                    expression.leftMouthSmile_Frown = 0.7f;
                    expression.rightMouthSmile_Frown = 0.7f;
                    expression.leftEyeOpen_Close = 0.3f;
                    expression.rightEyeOpen_Close = 0.3f;
                    expression.midBrowUp_Down = 0.4f;
                    expression.leftLowerLipUp_Down = -0.6f;
                    expression.rightLowerLipUp_Down = -0.6f;
                    expression.leftUpperLipUp_Down = -0.6f;
                    expression.rightUpperLipUp_Down = -0.6f;
                    break;
                case Mood.Sad:
                    expression.leftMouthSmile_Frown = -0.7f;
                    expression.rightMouthSmile_Frown = -0.7f;
                    expression.leftEyeOpen_Close = -0.3f;
                    expression.rightEyeOpen_Close = -0.3f;
                    expression.midBrowUp_Down = -0.4f;
                    break;
                case Mood.Surprised:
                    expression.leftMouthSmile_Frown = 0f;
                    expression.rightMouthSmile_Frown = 0f;
                    expression.midBrowUp_Down = 1f;
                    expression.leftBrowUp_Down = 1f;
                    expression.rightBrowUp_Down = 1f;
                    expression.rightUpperLipUp_Down = 0;
                    expression.leftUpperLipUp_Down = 0;
                    expression.rightLowerLipUp_Down = 0;
                    expression.leftLowerLipUp_Down = 0;
                    expression.mouthNarrow_Pucker = -1f;
                    expression.jawOpen_Close = 0.8f;
                    expression.noseSneer = -0.3f;
                    expression.leftEyeOpen_Close = 1f;
                    expression.rightEyeOpen_Close = 1f;
                    break;
                case Mood.Angry:
                    expression.leftMouthSmile_Frown = -0.3f;
                    expression.rightMouthSmile_Frown = -0.3f;
                    expression.midBrowUp_Down = -1f;
                    expression.leftBrowUp_Down = 1f;
                    expression.rightBrowUp_Down = 1f;
                    expression.rightUpperLipUp_Down = 0.7f;
                    expression.leftUpperLipUp_Down = 0.7f;
                    expression.rightLowerLipUp_Down = -0.7f;
                    expression.leftLowerLipUp_Down = -0.7f;
                    expression.mouthNarrow_Pucker = 0.7f;
                    expression.jawOpen_Close = -0.3f;
                    expression.noseSneer = 0.3f;
                    expression.leftEyeOpen_Close = -0.2f;
                    expression.rightEyeOpen_Close = -0.2f;
                    break;
                }
            }
            
			//if(!enabled && !ready && Time.time < 30){
			//	readyTimer += Time.deltaTime;
			//	if(readyTimer >=5){
			//		ready = true;
			//	}
		 //	}

			if(connected && !enabled){
              //  Debug.Log("NPC is Looking  to connect");
                if (wayPoints == null || wayPoints.Count <= 0){
					    wayPoints = new List<Transform>();
				//	    Debug.Log("NPC is Looking for waypoints");
					    foreach(Transform wp in transform.parent.GetChild(0))
					    {
						    wayPoints.Add(wp);
					    }
				    }

				if (randomPosition){
                    int randomCount = Random.Range(0, wayPoints.Count);
                    Vector3 newPos = wayPoints[randomCount].position;
				//	Debug.Log("Npc spawed at "+ newPos);
					newPos.x += transform.localPosition.x;
					newPos.z += transform.localPosition.z;
					gameObject.transform.position = newPos;

                    Debug.Log(gameObject + " spawned at"+ wayPoints[randomCount].gameObject);
                    Random.seed = System.DateTime.Now.Millisecond;
                }

                if(agent != null)
                {
	   				    agent = GetComponent<UnityEngine.AI.NavMeshAgent>();
                }
				if (agent == null)
                {
						agent = gameObject.AddComponent<UnityEngine.AI.NavMeshAgent>();
                }
            agent.transform.position = gameObject.transform.position;
            agent.speed = 0f;
			agent.autoBraking = false;
            //agent.angularSpeed = 100f;
            // agent.updatePosition = false;
            //    agent.updateRotation = true;
                agent.stoppingDistance = 1;

                anim = GetComponent<Animator>();
				//anim.applyRootMotion =true;

				avatar = GetComponent<DynamicCharacterAvatar>();
				p_Avatar = GetComponent<UMAPhysicsAvatar>();
                switch (avatar.umaRecipe.name)
                {
                    case "HumanFemale Base Recipe":
                        bool female = true;
                        anim.SetBool("Female", true);
                        break;
                    case "HumanMale Base Recipe":
                       bool male = true;
                    break;
                }
            
				armature = gameObject;

				// Disabling auto-braking allows for continuous movement
				// between points (ie, the agent doesn't slow down as it
				// approaches a destination point).

				enabled = true;

		   	    GotoNextPoint();


			}

			if(isIdle) {
			animTimer += Time.deltaTime;
						
			}
            if (enabled)
            {
                if (agent.remainingDistance < 6f && !agent.pathPending)
                {
                    // Agent has reached a waypoint Choose the next destination point when the agent gets
                    // close to the current one.
                    //!agent.pathPending && agent.remainingDistance < 6f

                    if (animRandom == 1)
                    {
                            animRandom = Random.Range(3, 20);
					        StateSwitch("idle");
                            Debug.Log(this.gameObject + " reached destination.");
                            agent.Stop();
					        //agent.isStopped = true;
                    }

				    if (animRandom != 1 && animTimer > animRandom)
				    {
				    animTimer = 0;
                    animRandom = 1;
				    GotoNextPoint();
				    }	    
					    
				}

                if(!isMoving && !agent.pathPending && agent.hasPath){
			        StateSwitch("moving");
                    isMoving = true;
                    Debug.Log(this.gameObject + " is going to " + wayPoints[destPoint]);                
                    }
            }

		}

	void GotoNextPoint() {
			// Returns if no points have been set up
			if (wayPoints.Count == 0)
				return;

			destPoint = Random.Range(0,wayPoints.Count);

			// Set the agent to go to the currently selected destination.
			agent.destination = wayPoints[destPoint].position;
			// Choose the next point in the array as the destination,
			// cycling to the start if necessary.
			//destPoint = (destPoint + 1) % wayPoints.Length;
		}
    void OnAnimatorMove()
    {
        if (isWalking && !agent.pathPending)
        {

            agent.speed = (anim.deltaPosition / Time.deltaTime).magnitude;
        }
    }

		void OnCollisionEnter(Collision col){
            if (isDead || isKO) { return; }
			//float force = KineticEnergy(col.collider.attachedRigidbody);
			float force = col.impulse.magnitude / Time.fixedDeltaTime;
            if(force > 5000 && col.relativeVelocity.magnitude >= 2)
            {
                if (!System.Enum.IsDefined(typeof(collisionLayers), col.gameObject.layer))
                {
                
                    //Debug.Log("NPC ignored collision with " + col.gameObject + " on layer "+ col.gameObject.layer);
                return; }

			    if (force > 32000 && col.relativeVelocity.magnitude >= 7){
			
			        p_Avatar.ragdolled = true;
                    // Rigidbody rb = GetComponent<Rigidbody>();
                    //  rb.isKinematic = false;
                    Transform[] limbs = GetComponentsInChildren<Transform>();
                    //foreach (Transform limb in limbs)
                    //{
                    //    limb.gameObject.layer = 10;
                    //}
                    isKO = true;
                    StateSwitch("KO");
                    //Physics.IgnoreLayerCollision(9, 8, false);
			    }
                else
                {
                    // Calculate Angle Between the collision point and the player
                    Vector3 dir = col.contacts[0].point - transform.position;
                    // We then get the opposite (-Vector3) and normalize it
                    dir = -dir.normalized;
                    Debug.Log("Direction:" + dir);
                }

                Debug.Log("Impact, "+this.transform+" was hit. "+ force +" by "+col.transform+ ". Velocity: " +col.relativeVelocity.magnitude );

            }
		}
        //void setRagdollLayers(GameObject gameobject, int layernum, int ignorenum = 1)
        //{
        //    if (gameobject.gameObject.layer != ignorenum)
        //    { gameobject.gameObject.layer = layernum; }

        //    foreach (Transform r_limb in gameobject.transform.GetChild(0))
        //    {
        //        if (r_limb != ignorenum) { r_limb.gameObject.layer = 9; }
        //        child.gameObject.setRagdollLayer;
        //    }
        //}    

        public static float KineticEnergy(Rigidbody rb){
            // mass in kg, velocity in meters per second, result is joules
            return 0.5f*rb.mass*Mathf.Pow(rb.velocity.magnitude,2);
        }
 
    
	}


    
