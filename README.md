   C o b r o w s e r 
 
Project Report: Co-Browser using React, Node.js, and Socket.IO
Project Overview
I have been working on a co-browsing extension that allows multiple support agents to join a user's session. The primary goal is to enable screen sharing, DOM transfer, and mouse interaction using WebRTC and Socket.IO. However, the current implementation is not yielding the desired results.
Technologies Used
React: For building the user interface
Node.js: For the backend server
Socket.IO: For real-time communication between clients and server
WebRTC: For peer-to-peer communication, enabling screen sharing and interaction
Current Implementation
Session Management: Using Socket.IO to handle multiple support agents joining a user's session. When an agent joins, the system signals a Tracker with the OpenReplay Assist plugin to enable WebRTC peer channels.
Screen Sharing: Attempting to share the screen using WebRTC. The shared screen is supposed to be interactable, allowing agents to guide users through their actions.
DOM Transfer: Trying to transfer the DOM elements to the agents' browsers for a more interactive experience.
Mouse Interaction: Using WebRTC and Socket.IO to capture and transmit mouse movements and clicks.
Issues Encountered
Despite implementing the above features, the co-browsing extension is not performing as expected. The main challenges include:
Latency:
There is a noticeable delay in screen sharing and mouse interactions, affecting the user experience.
Synchronisation Issues:
Maintaining real-time synchronisation of DOM elements across multiple browsers is challenging.
Scalability:
Efficiently managing multiple peer connections, especially under high load, is problematic.
Interactivity:
Mouse interactions are not accurately captured and transmitted, leading to inconsistencies.

Future Approach
To address the aforementioned challenges, the future approach includes:
Exploring Browser Object Model (BOM):
BOM could provide more precise control over browser windows and elements, potentially improving synchronisation and interaction.
Optimization:
Optimising the existing setup to reduce latency and improve the efficiency of real-time communication.
Advanced Techniques:
Investigating advanced WebRTC and Socket.IO techniques to handle peer connections more effectively.

GitHub Repository
You can find the project repository on GitHub: Github Link 


User Interface
Co browser Login Screen

![Screenshot 2024-07-28 134913](https://github.com/user-attachments/assets/ceb6fd24-13b2-4134-b9e8-698b502e8698)


Co Browser Main UI 
![Screenshot 2024-07-28 135422](https://github.com/user-attachments/assets/9b07ee37-20ae-49ba-bdfc-e6c11395369b)

![Screenshot 2024-07-28 135200](https://github.com/user-attachments/assets/aefb4989-ae2a-4f68-88b7-b2c302c07528)


Co Browser Two windows layout
![image](https://github.com/user-attachments/assets/ea5d2ad1-c0b5-4207-96d6-37b54449bc2c)


Co Browser Video

https://github.com/user-attachments/assets/cd0b3b9f-8729-4f7e-8321-4f72b16bb6f8



Conclusion
The development of a co-browsing extension is an ambitious project with significant potential for enhancing user support. While the current implementation has several hurdles, exploring BOM and optimising the existing technologies could lead to substantial improvements. Continued research, experimentation, and iteration will be key to achieving the desired functionality and performance.

