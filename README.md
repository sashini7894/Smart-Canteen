Smart Canteen - Mobile Application

Student Name:T.M.Sashini Gayathri  
Student ID: PE/2022/019  
Course Code: COST 32152 (Mobile Application Development)  
University: University of Kelaniya  

 1. What is the application, and what problem does it solve?
         Smart Canteen is a cross-platform mobile application designed for university students and staff to browse daily canteen menus, check food preparation times, view prices, filter meal categories (Rice, Short Eats, Beverages), and bookmark favorite items seamlessly. It solves long queue wait times by providing pre-selection, live meal details, and instant notification alerts.

2. Screens Overview
     * Canteen Menu Screen ('index.tsx'): Displays realistic hard-coded canteen menu items using a performant 'FlatList'. Includes a filtering Modal.
     * Item Detail Stack Screen ('item/[id].tsx'): Shows detailed info, high-res images, pricing, and prep times for any selected item.
     * Favorites Screen ('favorites.tsx'): Manages shared state items bookmarked by the user.
     * Profile & AppState Screen ('profile.tsx'): Tracks student credentials and implements the React Native 'AppState' lifecycle listener.

3. Core React Native Components Used
    * 'View' & 'Text': Container layouts and typography styling.
    * 'Image': Renders food illustrations via network URLs.
    * 'Pressable': Interactive touch controls for navigation, buttons, and favoriting items.
    * 'FlatList': High-performance scrolling list for menu items.
    * 'Modal': Popup dialog component implemented for filtering food categories.

4. Expo Router File-Based Navigation Structure
      The app uses Expo Router file-based routing inside the `app/` directory:
   * 'app/_layout.tsx': Root stack layout.
   * 'app/(tabs)/_layout.tsx': Bottom tab navigator layout housing the three main tabs.
   * 'app/item/[id].tsx': Dynamic stack route handling individual item detail parameters.

5. Local Notifications Research & Implementation
    Local notifications were implemented using 'expo-notifications'. When a user bookmarks a canteen meal item as a favorite, an immediate local notification is triggered (`expo-notifications` API) to confirm the bookmark action with a custom title and alert message.

6. Setup & Local Execution Commands
     To run this project locally, execute the following commands in your terminal:

Clone the repository
git clone [https://github.com/sashini7894/smart-canteen.git](https://github.com/sashini7894/smart-canteen.git)

 Navigate to project directory
     cd smart-canteen

 Install dependencies
     npm install

 Run the project using Expo
     npx expo start

7. Demonstration Video Link:  https://drive.google.com/file/d/1ywbdSfLodbZCVBQBhMb0-bSv65r_D-yh/view?usp=drivesdk
