---
title: "EKS Service Accounts Explained"
date: 2020-04-16T10:04:44+02:00
draft: false
author: Jason Smith
thumbnail: images/blog/eks-service-accounts-iam.jpg
description: "EKS Service Accounts and IAM Explained"
tags: ["Kubernetes", "AWS", "EKS", "ServiceAccounts"]
---


A few months ago AWS released The ability to add IAM permissions to pods.
For some, myself included, this was a confusing implementation.
This article will helpfully clear up some of the confusion 
on what AWS is actually doing, and what I believe they did right and what they did wrong.

# How it works
To start we need to forget everything AWS told you about how it works, especially around 
annotations and such.  We will just discuss the fundamentals of what was built and try to 
stay away from any special sauce that isn't crucial to the functionality.
We will start at square one.

## The Tooling
This is the main tooling that is required for these IAM permissions to work.

- [Projected Service Account](https://kubernetes.io/docs/tasks/configure-pod-container/configure-service-account/#service-account-token-volume-projection)
- [OIDC Discovery Endpoint](https://openid.net/specs/openid-connect-discovery-1_0.html)
- [An Updated AWS SDK/CLI](https://docs.aws.amazon.com/eks/latest/userguide/iam-roles-for-service-accounts-minimum-sdk.html)

### The Projected Service Account Token
Projected Service Account Tokens are provided so external audiences can validate their own federated
permissions against Kubernetes provided tokens for Service Accounts.  Currently the only way this 
can be done is with a call to a 
[TokenReview](https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.10/#tokenreview-v1-authentication-k8s-io). 
The entire purpose is to allow pods to have identities that can be validated by Kubernetes 
provided credentials.

### The OIDC Endpoint
The TokenReview does not work with OIDC so I was on the hunt for OIDC for Service Accounts. 
This took me a while to figure out.  AWS has implemented an OIDC provider for the Service Accounts 
but I was yet to find a reference to OIDC endpoints and Kubernetes.  Googling Kubernetes and OIDC just 
brings you a load of references to federated user authentication, but nothing on Service Accounts. 
Eventually I was able to stumble across a few Pull Requests.  The first in 
[early July](https://github.com/kubernetes/kubernetes/pull/80724) was not implemented, 
but there is a follow up [PR](https://github.com/kubernetes/kubernetes/pull/80724) for this to be 
rolled into Kubernetes 1.18!  That is great, but that means at this point AWS has rolled their own 
OIDC provider for Service Accounts.  The actual code being added to Kubernetes seems to be solely 
from Google engineers, which is disappointing.  AWS was involved in the discussion for the first 
declined PR but it does not appear that they contributed anything to the code base, I may just be misinformed about that.

### The AWS SDK
The final tooling needed for this to work was to update the SDKs.
Normally the SDKs look in your .aws folder or in your AWS_* environment variables
to authenticate against the AWS API. 
With these new projected service account tokens the SDK would look for two new environment 
variables AWS_ROLE_ARN and AWS_WEB_IDENTITY_TOKEN_FILE.  These environment variables told the SDK 
to use the provided token file to authenticate and assume the role using "AssumeRoleWithWebIdentity",
Which is pretty clearly explained in the 
[documentation](https://docs.aws.amazon.com/eks/latest/userguide/iam-roles-for-service-accounts-technical-overview.html).

## The Functionality
With all the tools available we can look at the functionality.  Please continue to ignore
the Service Account annotation.

### Add the OIDC identity provider
The docs cover this well and there are plenty of explanations on how to add OIDC identity providers 
to IAM, with or without Kubernetes.  I won't spend a lot of time on this, but you need to [add the 
provider to  IAM](https://docs.aws.amazon.com/eks/latest/userguide/enable-iam-roles-for-service-accounts.html). 

### Create an IAM Role
I am going to give an example of an IAM Role as it would look in Cloudformation
```yaml
S3ReadBuckets:
Type: 'AWS::IAM::Role'
Properties:
AssumeRolePolicyDocument:
!Sub |
    {
      "Version": "2012-10-17",
      "Statement": [
	{
	  "Effect": "Allow",
	  "Principal": {
	    "Federated": "arn:aws:iam::123456789:oidc-provider/oidc.eks.eu-west-1.amazonaws.com/id/LONGSTRINGSOFABC123"
	  },
	  "Action": "sts:AssumeRoleWithWebIdentity",
	  "Condition": {
	    "StringEquals": {
	      "oidc.eks.eu-west-1.amazonaws.com/id/LONGSTRINGSOFABC123:sub":"system:serviceaccount:my-namepace:my-serviceaccount"
	    }
	  }
	}
       ]
    }
Path: /
Policies:
- PolicyName: s3list
  PolicyDocument:
    Version: 2012-10-17
    Statement:
      - Effect: Allow
	Action:
	  - 's3:List*'
	  - 's3:Get*'
	Resource: '*'
	
```

The key take away here the StringEquals clause:
```json
{"oidc.eks.eu-west-1.amazonaws.com/id/LONGSTRINGSOFABC123:sub":
	"system:serviceaccount:my-namepace:my-serviceaccount"}
```

The **sub** indicates a "user identity" in [OIDC](https://connect2id.com/learn/openid-connect#id-token)
The Service Account is the identity.  This is important and I will come back to it later.
This essentially says any OIDC user that identifies as 
```ini
system:serviceaccount:my-namepace:my-serviceaccount
```
can assume this role.

### Create a pod with a role.
Now we will create a pod with the Projected Service Account and let the AWS SDK know how to consume 
it.

```yaml
---
apiVersion: v1
kind: Pod
metadata:
  name: test-pod
  namespace: test-iam
  labels:
    name: test-pod
spec:
  securityContext:
    fsGroup: 1337
  containers:
    - name: s3
      image: ubuntu
      env:
        - name: AWS_ROLE_ARN
          value: # YOUR ROLE ARN HERE
        - name: AWS_DEFAULT_REGION
          value: eu-west-1
        - name: AWS_WEB_IDENTITY_TOKEN_FILE
      	  value: /var/run/secrets/eks.amazonaws.com/serviceaccount/token
      command: ["/bin/bash","-c"]
      args:
        - apt-get update;
          apt-get install -y python3-pip;
          pip3 install --upgrade --user awscli;
          export PATH=$HOME/.local/bin:$PATH;
          aws s3api list-buckets;
          exit
      volumeMounts:
      - mountPath: /var/run/secrets/eks.amazonaws.com/serviceaccount
        name: aws-iam-token
        readOnly: true
  volumes:
  - name: aws-iam-token
    projected:
      defaultMode: 420
      sources:
      - serviceAccountToken:
          audience: sts.amazonaws.com
          expirationSeconds: 86400
          path: token
```

With all the above in place (edited for your system) you should have access to list your AWS buckets.

# The Good and The Bad

## Good
AWS went with OIDC for service account identity.  This was a great approach and seems to be  a future
feature of Kubernetes, so that is fantastic.

## Bad
Well there were several places I feel AWS could have done better.


__A Poorly Designed Webhook__

AWS created a webhook that automated a lot of the tooling I already put in the pod description above.
Essentially you annotate a service account with a role and you only have a pod description that looks
like this
```yaml
---
apiVersion: v1
kind: Pod
metadata:
  name: test-pod
  namespace: test-iam
  labels:
    name: test-pod
spec:
  securityContext:
    fsGroup: 1337
  containers:
    - name: s3
      image: ubuntu
        - name: AWS_DEFAULT_REGION
          value: eu-west-1
      command: ["/bin/bash","-c"]
      args:
        - apt-get update;
          apt-get install -y python3-pip;
          pip3 install --upgrade --user awscli;
          export PATH=$HOME/.local/bin:$PATH;
          aws s3api list-buckets;
          exit
```

The rest is auto injected into the pod description... ***unless*** they exist already.  So if you
had set an environment variable already it would not be overwritten.

This webhook introduces a few problems.

__It binds one IAM Role to a Service Account__

Service Accounts are identities not permissions.  This is why you bind service accounts to roles and
you can bind multiple roles to the same service account.  This is also how AWS IAM permissions work. 
There is a clear separation between authentication and authorization.

__They Confuse Permissions__

They imply that this creates some sort of one to one relationship between Service Accounts and
IAM Roles.
In their [documentation](https://docs.aws.amazon.com/eks/latest/userguide/iam-roles-for-service-accounts.html) 
they state:
> Credential isolation — A container can only retrieve credentials for the IAM role that is associated with the service account to which it belongs. 

You could read that as whatever role you annotated to the service account is the only one the pod 
can assume, but that would be incorrect.

A pods ability to assume an IAM role is ***Solely Determined*** in the IAM Assume role policy.

```json

{
  "Effect": "Allow",
  "Principal": {
    "Federated": "arn:aws:iam::123456789:oidc-provider/oidc.eks.eu-west-1.amazonaws.com/id/LONGSTRINGSOFABC123"
  },
  "Action": "sts:AssumeRoleWithWebIdentity",
  "Condition": {
    "StringEquals": {
      "oidc.eks.eu-west-1.amazonaws.com/id/LONGSTRINGSOFABC123:sub":"system:serviceaccount:my-namepace:my-serviceaccount"
    }
  }

```

Any role can be assumed that has the above Assume Role Policy.  You can just change the AWS_ROLE_ARN
and the SDK will assume whatever role you designate in the environment variable.

The Service Account annotation just works as a flag to load the Projected Service Token and it sets 
the role arn as an environment variable on the pod.

__Giving back to the community__
It would have been nice to see higher engagement with the Kubernetes community through code contribution.
It seems in a rush to provide user features they shot for short term gains, without providing back
to the system that made this all possible.

# In Conclusion
EKS IAM permissions is a good approach, but has a few problems with it's implementation. 
They are using a future feature of Kubernetes but they don't seem to have contributed those 
efforts back to the community (at least from my research), and they confuse AuthN and AuthZ 
with their documentation and tooling.

## Disclaimer
I had submitted a [pull request](https://github.com/aws/amazon-eks-pod-identity-webhook/pull/22)
to the webhook that would change the role ARN placement from the ServiceAccount to
environment variable of the container but ultimately it was rejected for lack of backwards
compatibility.  More discussion can be found on this
[issue](https://github.com/aws/amazon-eks-pod-identity-webhook/issues/20)
and this
[issue](https://github.com/aws/amazon-eks-pod-identity-webhook/issues/32).
