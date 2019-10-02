using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class RigidDisabler : MonoBehaviour
{

	public Rigidbody[] rbd;
	public Collider mainCollider;
	public Collider[] allColliders;
	public Collider exceptionCol;
	public Animator anim;


	void Awake(){
	mainCollider = GetComponent<Collider>();
	allColliders = GetComponentsInChildren<Collider>(true);
	anim.enabled = true;
	DoRagdoll(false);

	}

	public void DoRagdoll(bool isRagdoll){
		foreach(var col in allColliders){
			//mainCollider.enabled = !isRagdoll;
			//GetComponent<Animator>().enabled = !isRagdoll;
			anim.enabled = !isRagdoll;
			col.enabled = isRagdoll;

			exceptionCol.enabled = !isRagdoll;

				rbd = GetComponentsInChildren<Rigidbody>();
		  //  col.gameObject.GetComponent<Rigidbody>().useGravity = isRagdoll;

		   foreach(Rigidbody rig in rbd){
		
			rig.isKinematic = !isRagdoll;
			rig.useGravity = isRagdoll;

			exceptionCol.gameObject.GetComponent<Rigidbody>().isKinematic = false;

			exceptionCol.gameObject.GetComponent<Rigidbody>().useGravity = true;
			}
		}
	}

	void OnEnable()
	{

	}
    // Start is called before the first frame update
    void Start()
    {
    }

    // Update is called once per frame
    void Update()
    {
        
    }
}
