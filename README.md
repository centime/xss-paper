XSS : severity of the most overlooked web vulnerability in the wild
====================================================================
(all code and files used in examples are at https://github.com/centime/xss-paper)

Abstract
--------
Cross Site Scripting (XSS) is the most common web vulnerability. Because of the explosion of web apps in the past few years, but also because their severity is often underestimated.
Here we want to explain in details this class of vulnerabilities, how it intricates with other technologies in the complex context of the web, and its reach.

Headlines
---------
Abstract
[Introduction](https://github.com/centime/xss-paper/blob/master/0.Introduction.md)  
I. What is a XSS attack ?  
[II. The attack surface.](https://github.com/centime/xss-paper/blob/master/1.Attack_surface.md)  
[III. Mitigations](https://github.com/centime/xss-paper/blob/master/3.Mitigations.md)  
[IV. Attack scenarios](https://github.com/centime/xss-paper/blob/master/attacks.md)  
Conclusion   
Appendix  
references  

The Goal
--------
Expose the ins and outs of XSS vulnerabilites, and sensibilize about how serious they are.

What will we do ?
-----------------
    explain how it works, why it works, and what it can do
    demonstrate their potential with a realistic scenario demonstration 
       create a target using an open source project and adding a vulnerability of our own
       craft a sophisticated payload to execute valuable operations on behalf of the user
       set up a good vector for our payload to the targeted user
       profit

Detailled plan :
----------------


[Introduction](https://github.com/centime/xss-paper/blob/master/0.Introduction.md)  

I. What is a XSS attack ?

    How to trigger ?
    Reflected, Stored, DOM-based.
    Vectors

[II. The attack surface.](https://github.com/centime/xss-paper/blob/master/1.Attack_surface.md)

    Global : so many potential targets.
    Local : so many ways for a target to be vulnerable.


[III. Mitigations](https://github.com/centime/xss-paper/blob/master/3.Mitigations.md)

    HTTP
    Developer
    Server admin
    Browser

[IV. Attack scenarios](https://github.com/centime/xss-paper/blob/master/attacks.md)

    impact
        any action on behalf of the user
        sometimes the user is the admin
        cookies
        rich environment, lots of techs -> huge capabilities
            +websockets, +WebRTC, ...

    exploitation tool kits
        Beef
        xssless
        audit frameworks
            genetic algorithms (cf paper)

    attack scenario
        targeted

Tools :
-------
    burpsuite
    xssless
    Beef

papers :
--------
    http://escape.alf.nu
    http://www.google.com/about/appsecurity/learning/xss/

    https://www.usenix.org/system/files/conference/usenixsecurity14/sec14-paper-stock.pdf
    https://www.sba-research.org/wp-content/uploads/publications/Wurzinger_SWAPMitigatingXSS_2009.pdf
    http://www.adambarth.com/papers/2009/barth-caballero-song.pdf
    file:///home/centime/Downloads/Arshan%20Dabirsiaghi%20-%20Towards%20Malicious%20Code%20Detection%20and%20Removal.PDF
    http://www.cs.uic.edu/~venkat/research/papers/blueprint-oakland09.pdf
    http://car-online.fr/files/publications/2012-04-SecTest-ICST/2012-XSS%20Vulnerability%20Detection%20Using%20Model%20Inference%20Assisted%20Evolutionary%20Fuzzing-Fabien_Duchene,Roland_Groz,Sanjay_Rawat,Jean-Luc_Richier-paper1276316782123.pdf
    https://www.blackhat.com/docs/us-14/materials/us-14-Johns-Call-To-Arms-A-Tale-Of-The-Weaknesses-Of-Current-Client-Side-XSS-Filtering-WP.pdf
    http://www.ijsr.net/archive/v3i7/MDIwMTQ5ODc=.pdf

    Statistics :
    http://sitic.org/wp-content/uploads/Web-Application-Vulnerability-Statistics-2013.pdf
    http://www.cenzic.com/downloads/Cenzic_Vulnerability_Report_2014.pdf
    http://info.whitehatsec.com/rs/whitehatsecurity/images/statsreport2014-20140410.pdfhttp://info.whitehatsec.com/rs/whitehatsecurity/images/statsreport2014-20140410.pdf


Annette Winge, Vincent Delaunay
