Attacks
=======
Given a vulnerable application, we will try to devellop some realistic attack scenarios. The focus is really not on triggering the XSS, but rather demonstrating ways to fully exploit it.
First we will setup a vulnerable application, then propose 3 different attacks :

    - execute actions on behalf of user
    - steal private information
    - Man In the Browser attack : interactive session hijacking, keylogger, browser exploits...
        
I. Setup the vulnerable application : a forum.
----------------------------------------------
In an attempt to be as realistic as possible, we decided to start with a real full-fledged application. We choose flaskbb[0], a forum developped in python using flask.

First step is to add our extra XSS "feature". We kept it simple by adding a new route to the project, where you can provide base64-encoded javascript to be executed. For example, executing "alert(1)" will look like this :

    localhost:8080/xss/YWxlcnQoMSkK

The base64 is a handy way to avoid conflicts between our payloads and flask's route matching rules, and more important allows us to bypass flask's parameters sanitizing before template generation. Implementation steps are provided here[1]

Bonus : flaskbb is kind enough to come in the dev version with a test function to populate it with dummy users, topics and posts.

II. Post a message on behalf of a user.
---------------------------------------
First, let's introduce two tools that we will use : 

    burp[2] : an http proxy, often used in web penetration tests because it is awesome. We will just scratch the surface here, using it to log our http traffic.
    xssless[3] : a python script to generate XSS payloads from burp's logs. Best part is that it takes care of crsf tokens (nonces) !

The procedure is as follow : 

    -log in with a user we control.
    -start burp's interception
    -post a new message.
    -export burp's logs
    -list the csrf tokens
    -run xssless
    -modify the payload with our malicious message
    -deploy the payload


III. Read a user's private conversations.
-----------------------------------------

IV. Steal a user's password, and beyond ! Man In the Browser.
-------------------------------------------------------------

V. Going further.
-----------------
    xssless : worms !

Refs
----
    [0] https://github.com/sh4nks/flaskbb
    [1] The following modifications have been made to flaskbb[0] :
            forum/views.py (l35-66)
                @forum.route("/xss/<payload>")
                [...]
                return( [...],
                    payload=payload)

            templates/forum/index.html (l4)
                <script>eval(atob("{{ payload }}"))</script>
    [2]
    [3] https://github.com/mandatoryprogrammer/xssless
