XSS : severity of the most underlooked web vulnerability in the wild

Abstract
    Cross Site Scripting (XSS) vulnerabilities is the most common web vulnerability. Because of the explosion of web apps in the past few years, but also because their severity is often underestimated.
    Here we want to explain in details this class of vulnerabilities, how it intricates with other technologies in the complex context of the web, and its reach.

Headlines
    Abstract
    Inctroduction 
    How to trigger an xss
    The web techno stack : complex and subtle, prone to vulnerabilities
    From trigger to exploit : attack scenarios
    Mitigations and best practices
    Conclusion 
    Appendix
    references

The Goal
    Expose the ins and outs of XSS vulnerabilites, and sensibilize about how serious they are.

What will we do ?
    explain how it works, why it works, and what it can do
    demonstrate their potential with a realistic scenario demonstration 
      create a target using an open source project and adding a vulnerability of our own
       craft a sophisticated payload to execute valuable operations on behalf of the user
       set up a good vector for our payload to the targeted user
       profit

Tools :
    burpsuite
    xssless
    Beef

Detailled plan :

Introduction
    injection
    client-side
    overlooked
        
I. How to trigger an xss
    examples

II. The web techno stack : complex and subtle, prone to vulnerabilities
    attack surface
        global
            more and more client-side, web apps
        local
            multiple parsers
                so many ways to execute js from html
                more layers -> more complex semantic rules.
            js
                so permissive !
            flash

    attack vectors
        stored
            rest  api
        reflected
            mail
            corrupted content

III. From trigger to exploit : attack scenarios
    impact
        any action on behalf of the user
        sometimes the user is the admin
        cookies

    exploitation tool kits
        Beef
        xssless
        audit frameworks
            genetic algorithms (cf paper)

    attack scenario
        targeted

IV. Mitigations and best practices
    counter measures
        dev
            sanitize inputs : html special chars
            frameworks
                angularJS fail
        ecosystem (leads)
            reverse proxy (cf paper)
            monitoring (cf paper)
        user
            browser policies
            browser extensions
                noscript
                ~adblock

papers :
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

Annette Winge
Vincent Delaunay
