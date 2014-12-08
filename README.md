The concerning threat of Cross Sites Scripting (XSS) vulnerabilities.
=====================================================================

Abstract
--------
In this report we want to explore the reach of the Cross Sites Scripting (XSS) class of vulnerabilities. Our scope will be their exploitation, excluding their detection, trigger, and prevention. Only the generic mitigations that impact XSS in general, and restrict their exploitation, will be considered.

We will first briefly present the root cause of an XSS, and explore some of the potential actions an attacker could take by leveraging them. Then, we will consider the restrictions applied to these actions by the environment of the Web and Web browser.
Finally we will describe potential attack scenarios that can take place within the bounds of these restrictions, and demonstrate them under realistic conditions.
The steps of our demonstration will be : setting up a vulnerable application, then coordinating attacks against it (Executing actions on behalf of the targeted user ; Stealing private information ; Compromising the target's browser in a Man in the Browser attack).

You will find here :
--------------------
[The appendix](https://github.com/centime/xss-paper/blob/master/appendix.pdf)

[Step by step instructions to reproduce the experiments](https://github.com/centime/xss-paper/blob/master/Exploitations.md)



