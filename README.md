# Proxima-Blockchain-Project

Private Blockchain in Banking: Loan Transactions and Unified Document Compliance


Abstract:
A Consortium backed Private Blockchain which provides a platform to resolve major problems faced by the Banking system all around the globe.
- Verifying Loan
- Document Verification
The Blockchain attempts to solve the problem by storing all documents and loans, transaction history, related to individuals on a common blockchain. If an individual is part of a peer bank, then document verification and loan approval can be done in an instant.



### Introduction:

Existing Process:

There is a process called KYC, Know Your Customer process. It is a regulatory requirement; it is a mandatory requirement for many aspects of our daily industrial work.

Why do we have this? It is a regulated requirement to ensure that we have a good
knowledge of every organization has a good knowledge of it is customers and it can help
use that information to help prevent fraud or money laundering.

What is the process? The process really is about collecting personal information. This could be information about your identity, birthplace, Address,Occupation, Workplace Address, Profession, Age, etc. And apart from that they might collect other aspects of financial standing for instance if you are opening a bank account.

The Current system involves a mix of offline (In-Person) and online (Through Web Portal), albeit its time consuming, requires considerable resources from the ends. 


#### Loan Approval

It's not unusual for an individual to wait for weeks at stretch or months in some cases for loan approval. It's arguably the most time consuming task, where every new loan takes the same path, going through a manual process. Even with abundant technology at the fingertips, it's not easy to decide whom to grant a loan and the amount.  The process for Loan granting is rather complicated, involving 100s of document verifications and in-person interviews. 


## Problems and Impact of Current System

KYC verification looks ideal and solves the problems such as money laundering and preventing illegal operations.

However, achieving this is extremely costly for banks, in terms of both Time and Money. They’re losing money for every second they spend on an individual who is not yet a customer, as well as the employee attending to the request. 

If the process takes up a lot of time, then customers could migrate to other banks where it's easier. 

A Survey from Thomson Reuters said 
"While financial firms' average costs to meet their obligations are $60 million, some are spending up to $500 million on compliance with KYC and Customer Due Diligence (CDD).


This process is must and mandatory for banks enforced by Central Bank and LAW. Failure to do so could result in heavy fines. 

The Issue gets complicated when an individual who is part of a bank, wants to open an account in a different account, he has to go through the entire process all over again!

The problem only grows from here, as every time some information becomes outdated, requiring updates. This update needs to be broadcasted to every bank the individual has an account in.

The Loan Approval mechanism works in a similar way, document verification is time consuming and cannot be taken lightly.
At the end, this results in drainage of resources of banks as well as customers.


## Role of Blockchain in current system

Upon a closer inspection, we find that banks and blockchain as a banking technology may look contradictory, stemming from the basis of blockchain, which depends on distributed systems, unlike centralized, more common current banking. It's to be noted that they both have flaws and advantages. It's easier to query on centralised system, and the resulting system is way less complicated than a blockchain system. But they suffer from a single point of failure and not as robust and free from corrupt practices as in a blockchain network.

Blockchain is not a replacement for the current system. 

Blockchain compliments the current banking system. It has the potential to be used upon existing infrastructure to reinforce the system to make it more robust from failure and efficiency. 

## Proposed System

In our case, different banks can come together with a common goal of information transparency, form a consortium.
 Create a common shareable private blockchain. 
In this consortium, all that have come together, agree on sharing information related to individual’s documents, loan transactions and other information. 
It could be a network of 30 banks or 50, from the perspective of the central bank this shouldn’t be a problem since the blockchain is not a replacement but a platform for information sharing.

Revisiting the process
Information about Documents and Transaction is stored in different types of blocks; they're DOCUMENT BLOCK and TRANSACTION BLOCK. Below we examine the functionalities in brief.

When a new individual(client)  joins a bank (say A) that is part of a consortium, the respective bank shares the documents related to the individual over the blockchain network. They are stored in a special block called DOCUMENT BLOCK. It contains only signatures, and checksum. IT DOES NOT STORE ORIGINAL DOCUMENT.
They’re backed by the bank's and client’s signature, to prevent cases of non-repudiation, and ensuring data integrity.

When the same individual decides to open an account in a bank (say B), the bank first searches if the information related to the individual is present over the blockchain network. If yes then, with the Client's signature it requests the blockchain network to share the document. 
The Blockchain network verifies the signature of the client to confirm that the bank is not requesting the information without permission.
Also, verifies the signature of the bank, to prevent non-repudiation cases.
Pushes the document request transaction to the blockchain and returns the node to requestee. 
The Bank(B) then requests the bank owning documents over network (by matching the bank hash against known peers). The bank(A) then handovers the document, with verification status and its checksum. 
The Bank(B) upon arrival of document, verifies the checksum with the one obtained from blockchain. 
This enables seamless data sharing, unaffected by any update to the original document. As we have the record of all the requestee’s inside the Transaction Block, the blockchain network will broadcast the updated document to every bank that has requested the document. 
Loan Transaction: Every transaction related to loan from peer bank to its clients in broadcasted to the blockchain network. 
It has the following subtypes
LOAN_GRANT: Upon approval of loan and collection of the same, the bank broadcasts this type of transaction.
EMI_TRANSACTION: Everytime the client pays his EMI to the peer bank, it gets broadcasted to the blockchain.
EMI_BOUNCE: In case of failure to pay the Timely EMI, the bank broadcast this type of transaction
LOAN_DEFUALT: When Client default on his loan, bank broadcast this type of transaction
LOAN_COMPLETED: On completion of loan, bak broadcast this request.
DOCUMENT_REQUEST: As mentioned above, whenever a peer bank requests  a document, the request is registered against this type.

### Key advantages: 
Immutability: The fundamental property of blockchain. The data that resides within the block cannot be tampered with as doing so will catch the attention of other peer nodes over the network. Banks already enforce extreme security, if the blockchain node owned by the bank is ever declared to be compromised that would imply that the entire infrastructure of the bank has collapsed. Which is a much larger problem.
Transparency and Privacy: Peer banks cannot leech over data provided by other banks as every request to view the block goes through signature verification, even if they’re forged, the request gets logged in the Transaction Block forever. 
Ease of applicability: Since the blockchain is entirely different from current systems, it does not disrupt any existing system, but complements the system. 
Scalability:  There can be ‘N’ number of banks in the network, however high the number may be, it still remains affordable and doesn’t get affected by incoming requests. As we are witness to the scale at which bitcoin could scale. 
No Additional Cost: Since it is a private blockchain, the consensus algorithm can be a simpler algorithm, without heavy computation work. We use CoA for our use case. Only the nodes of the bank part of the blockchain are allowed to broadcast the blocks, the process for adding new processes is manual. Every Node needs to update it’s peer lists.

## Methodology And Implementation:

A small but fully functional blockchain network, code named PROXIMA, having all the features mentioned above, is implemented. 

Prerequisites:

**Authorization** : Only the bank nodes have access to blockchain. In real implementation every request has to be authorized by some system such as JWT, however for the sake of simplicity, this step has been avoided. This has to be done since Peer Bank Node IP can be easily detected, but it should made impossible to forge the credentials, hence using authorization system like JWT is suggested.

**Protocol**: In the current implementation, HTTP is the protocol over which transactions take place. Unlike TCP based custom protocol followed by other blockchain, any protocol can be used here, provided it supports required security arrangements. HTTPS with some added security layer would be ideal, as HTTPS is a tried and tested protocol, with SSL/TLS layer, which is the backbone of the entire internet, serving billions of requests per second. However custom TCP based implementation is also a good choice if the consortium requires more security.

**Blockchain Network Framework** : The choice of server framework and language is immaterial as long the blockchain node performs the required operations without leaking any data.

Important Note: all these transactions are requested from the bank’s server and recieved by the bank’s server. Client has nothing to do with the Blockchain Network. 


## Prototype Implementation details:

### TOOLS AND LANGUAGES:
**KOTLIN**: Language Choice, its relatively new language, based on JVM. Having access to all the libraries in JAVA and features of modern language, like extension functions, sealed classes, shorter syntax etc
**TYPESCRIPT + NODE**: Pure JS lacks type safety which could be a source of numerous bugs and may result in unintended security compromises. Though JavaScript is interoperable with Typescript. Typescript is recommended.
**Ktor**: Is the choice of server implementation, robust framework. Providing all required functions and in a very understandable manner, having excellent documentation. With Abundant available options for serialization and deserialization.
**Express.JS**: Emulates the Bank’s Web Server. Communicates with the blockchain network through its Node. 
REACT.JS: Emulates the front end behaviour, does not represent the actual interface used by clients, but the employees or system. With Tailwind CSS framework.

Libraries:

JCA: Java Cryptography Architecture, Highly robust cryptography library provided by JVM’s implementation. Used with KTOR on Blockchain
CRYPTO: NODE.JS, implementation of cryptography functions. Robust and most used library for cryptography in node environment.
AXIOS: Used on NODE end for making HTTP POST/GET requests.

Working:

Every node has a ‘FAT JAR’ file of the blockchain Node program. Peer bank will execute this application on assigned port and IP. for the sake of simplicity all the IPs/HOST used in the prototype are over 127.0.0.1 or 0.0.0.0. This program has a hardcoded address of its PEERs.

Only a single instance of the web server is running in the background (EXPRESS.JS) that emulates the bank’s backend. All requests to different banks (2 in our case) are routed to port 11111. Based on the request params, it defines the bank’s details. This is only for simplicity and not actual implementation. 

Front End, the user facing, rather employee facing interface, is built with react.js, in our prototype, this is used only to simulate the requests over to the blockchain. Ideally, these requests to blockchain nodes take place automatically without any interference.

The simulation:
Front-End Simulation: 
First allows us to choose the bank, which decides the bank network to use. Note: this is just an abstraction for simplicity.
We then select our operation to perform, it could be creating a new transaction, a client, uploading a document, viewing all transactions, requesting documents, etc.
On confirmation of operation, i.e. after provided all information required for operation (Eg. Transaction type, amount, client name… for transaction) The request is sent to the Bank Web Server (Express.js)
The Web Server Validates the requests, adds its own headers and signatures, calculates checksum incase of document, emulates the storage of the same.
The Bank Server, forwards this request to it’s Blockchain Node (say at port 8080), the request has the params of block, except previous blockhash - this is attached by the blockchain)
Blockchain upon arrival of new block request
Request all peers its copy of blockchain, update its copy of blockchain
Validate the block signatures and all transactions.
Add the block to copy and Broadcast the request to all the peers.

Conclusion
A Private Blockchain can be successfully implemented, and deployed in real life. Not as a replacement but as a complementary information sharing platform for the greater good of everyone. 

We see that embracing blockchain technology could enormously improve the current system. Making it more robust and resource efficient. Those millions of dollars spent on record keeping, KYC, Manual and Laborious tasks can be eliminated to a large extent.

However, The Blockchain does not specifically help in improving the public image of the banking industry, owing to the aftermath of 2008. The Platform is strictly built to be used by and among banks, only those belonging to the consortium. There is always the possibility of 51% attack. 

In Ideal world, every bank(in the consortium) should have equal say, but that is not the reality. Few Larger banks will always dominate. The possibility of larger banks changing the structure of blocks, causing modification as per their requirements, cannot be denied. However, such an event could be easily avoided if every bank keeps a backup of the copy somewhere. As the entire blockchain is quite light in weight, even after billion transactions, size may not exceed 1 GB. 

Another major flaw could be, if some invalid document enters the blockchain, which is also marked as verified by the bank. This could allow the individual to create accounts in other banks based on this false data. Extreme precaution must be taken so as to which data enters the blockchain.


Future Enhancement

We have seen how a consortium of banks can come together and build one solution to eliminate most resources consuming tasks. Such a solution if implemented correctly, could benefit the chain of banks in huge savings, speaking in terms of billions every year. 
However, we have left the consumers out of our equation. Next step should be, to allow people to connect with the blockchain, allow them to keep records, store them, that should improve the general public image, and lead to greater trust between banks and people.
Also, in future, P2P-loan, people-to-people-loan could be made possible i.e. allow people to request loans and allow other people to directly fund them, the blockchain provides them the transaction history, documents and everything they need. In exchange, banks could charge some small % of transactions. Why would banks do this? Simply because, instead of people exchanging loans among themselves offline, they will be using their platform. So the money still remains in their rotation! This could make consortiums as a whole look more lucrative.


Bibliography

Blockchain Concept:
NITI AYOG - Blockchain The India Strategy
Thomson Reuters 2016 Know Your Customer Surveys Reveal Escalating Costs and Complexity | Thomson Reuters
NPTEL: Blockchain Architecture and Use Cases
Blockchain Lecture 32 Notes
Private Blockchain: How it is Different From Public Blockchain? (blockchain-council.org)
Bitcoin's P2P Network (nakamoto.com)
Glossary — Bitcoin
Coinbase Transaction (learnmeabitcoin.com)
Bitcoin - Wikipedia
How the Bitcoin protocol actually works | DDI (michaelnielsen.org)
What is Proof of Authority? | Coinhouse
What's inside a Block on the Blockchain? (learnmeabitcoin.com)

Programming and Frameworks:
Java Cryptography Architecture (JCA) Reference Guide (oracle.com)
Crypto | Node.js v15.11.0 Documentation
KTOR Documentation
Kotlin docs—Kotlin (kotlinlang.org)
React – A JavaScript library for building user interfaces (reactjs.org)
