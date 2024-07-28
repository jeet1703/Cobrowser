# Project Report: Co-Browser using React, Node.js, and Socket.IO

## Project Overview
I have been working on a co-browsing extension that allows multiple support agents to join a user's session. The primary goal is to enable screen sharing, DOM transfer, and mouse interaction using WebRTC and Socket.IO. However, the current implementation is not yielding the desired results.

## Technologies Used
- **React**: For building the user interface
- **Node.js**: For the backend server
- **Socket.IO**: For real-time communication between clients and server
- **WebRTC**: For peer-to-peer communication, enabling screen sharing and interaction

## Current Implementation
1. **Session Management**:
   - Using Socket.IO to handle multiple support agents joining a user's session.
   - When an agent joins, the system signals a Tracker with the OpenReplay Assist plugin to enable WebRTC peer channels.

2. **Screen Sharing**:
   - Attempting to share the screen using WebRTC. The shared screen is supposed to be interactable, allowing agents to guide users through their actions.

3. **DOM Transfer**:
   - Trying to transfer the DOM elements to the agents' browsers for a more interactive experience.

4. **Mouse Interaction**:
   - Using WebRTC and Socket.IO to capture and transmit mouse movements and clicks.

## Issues Encountered
Despite implementing the above features, the co-browsing extension is not performing as expected. The main challenges include:

1. **Latency**:
   - There is a noticeable delay in screen sharing and mouse interactions, affecting the user experience.

2. **Synchronization Issues**:
   - Maintaining real-time synchronization of DOM elements across multiple browsers is challenging.

3. **Scalability**:
   - Efficiently managing multiple peer connections, especially under high load, is problematic.

4. **Interactivity**:
   - Mouse interactions are not accurately captured and transmitted, leading to inconsistencies.

## Future Approach
To address the aforementioned challenges, the future approach includes:

1. **Exploring Browser Object Model (BOM)**:
   - BOM could provide more precise control over browser windows and elements, potentially improving synchronization and interaction.

2. **Optimization**:
   - Optimizing the existing setup to reduce latency and improve the efficiency of real-time communication.

3. **Advanced Techniques**:
   - Investigating advanced WebRTC and Socket.IO techniques to handle peer connections more effectively.

## GitHub Repository
You can find the project repository on GitHub: [GitHub Project Link](https://github.com/jeet1703/Cobrowser)

## User Interface

### Co-Browser Login Screen
![Screenshot 2024-07-28 134913](https://github.com/user-attachments/assets/e76d4d3a-76f3-4e33-a67e-9eb2f3d23a9f)


### Co-Browser Main UI
![Screenshot 2024-07-28 135011](https://github.com/user-attachments/assets/7884afeb-e0c8-4834-9122-0c90a3823967)
![Screenshot 2024-07-28 135200](https://github.com/user-attachments/assets/ff93b84f-67cb-44b8-b7ad-32eac32d0b2b)


### Co-Browser Two Windows Layout
![Screenshot 2024-07-28 135422](https://github.com/user-attachments/assets/4bc55ad1-f37e-4433-8db0-491f9946d75f)


### Co-Browser Video


https://github.com/user-attachments/assets/bba21496-4b57-4545-bb69-53c4a5073de9



## Conclusion
The development of a co-browsing extension is an ambitious project with significant potential for enhancing user support. While the current implementation has several hurdles, exploring BOM and optimizing the existing technologies could lead to substantial improvements. Continued research, experimentation, and iteration will be key to achieving the desired functionality and performance.
