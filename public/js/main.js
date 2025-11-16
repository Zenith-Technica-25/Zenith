// main.js

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// *** FIX: Import Firestore SDK components ***
import { getFirestore, collection, getDocs, addDoc, query, where } from "firebase/firestore";
import { 
    getAuth, 
    onAuthStateChanged, // <-- NEW: To monitor user login status
    signInWithEmailAndPassword, // <-- NEW: To handle login
    signOut
    // You might also want createUserWithEmailAndPassword for signup
} from "firebase/auth"; // <-- NEW: Authentication SDK
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAifOlVyvMDCgo4BfzKQrPaWFKYGVVzmCA",
  authDomain: "zenith-baa6a.firebaseapp.com",
  projectId: "zenith-baa6a",
  storageBucket: "zenith-baa6a.firebasestorage.app",
  messagingSenderId: "797414825328",
  appId: "1:797414825328:web:4fccf66cca26411c0803b5"
};

// Initialize Firebase and Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app); // Initialize Firestore
const authh = getAuth(app);

// --- 2. GLOBAL STATE AND CONSTANTS ---

let currentUserId = null; // Stores the UID of the logged-in user
const phasePoints = [100, 200, 300, 400];
const launchPoints = 400;

// --- 3. DOM elements (Defined outside the function for scope accessibility)

// Login Elements
const loginSection = document.querySelector(".login"); 
const loginForm = document.getElementById("login-form");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");

// Task List Elements
const taskList = document.getElementById("tasklist");
const calculateBtn = document.querySelector(".calculate-points");

// Point Display Elements
const totalPointsEl = document.querySelector(".total_points h3");
const pointsTillNextPhaseEl = document.querySelector(".points_till_next_phase h3");
const pointsTillLaunchEl = document.querySelector(".points_till_launch h3");
const progressBarEl = document.querySelector(".progress-bar");
const rocketSpace = document.querySelector(".rocket_space");
let rocketPhases;

// Assuming launchBtn and launchMessage are defined in your HTML and accessible
const launchBtn = document.querySelector(".launch_btn"); 
const launchMessage = document.querySelector(".launch_message"); 

// Add Task Elements
const newTaskTextEl = document.getElementById("newTaskText");
const newTaskPointsEl = document.getElementById("newTaskPoints");
const addTaskBtn = document.getElementById("addTaskBtn");

const logoutBtn = document.getElementById("logoutBtn");

// --- Core Function to Build Task List from Data ---
const buildTaskList = (tasks) => {
    // Clear the existing list before building (important if called multiple times)
    taskList.innerHTML = ''; 

    // Build task list
    tasks.forEach((task, index) => {
        const li = document.createElement("li");
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.id = `task-${task.id || index}`;

        // Ensure points is an integer before setting dataset
        checkbox.dataset.points = parseInt(task.points); 

        const label = document.createElement("label");
        label.htmlFor = checkbox.id;
        label.textContent = task.text;

        const pointsSpan = document.createElement("span");
        pointsSpan.textContent = ` (${task.points} pts)`;
        pointsSpan.style.color = "#888";
        pointsSpan.style.fontSize = "0.9em";
        label.appendChild(pointsSpan);

        checkbox.addEventListener("change", () => {
            li.classList.toggle("completed", checkbox.checked);
            // Re-sort logic (moved to a timeout)
            setTimeout(() => {
                if (checkbox.checked) taskList.appendChild(li);
                else {
                    const firstCompleted = taskList.querySelector(".completed");
                    if (firstCompleted) taskList.insertBefore(li, firstCompleted);
                    else taskList.appendChild(li);
                }
            }, 500);
        });

        li.appendChild(checkbox);
        li.appendChild(label);
        taskList.appendChild(li);
    });

};

// --- NEW: Asynchronous Function to Fetch Data ---
const fetchTasks = async () => {
  if (!currentUserId) {
        taskList.innerHTML = '<li>Please sign in to view your tasks.</li>';
        // Reset points display when logged out
        totalPointsEl.textContent = `Total Points: 0`;
        return;
    }
    try {
        // Reference the 'tasks' collection in Firestore
        const tasksCollection = collection(db, "tasks"); 

        // Query: Select documents where the 'userId' field equals the current user's ID
        const q = query(tasksCollectionRef, where("userId", "==", currentUserId));
        
        
        // Fetch all documents from the collection
        const taskSnapshot = await getDocs(q);
        
        // Map the documents to a simple array of task objects
        const tasks = taskSnapshot.docs.map(doc => ({ 
            id: doc.id,
            text: doc.data().text, 
            points: doc.data().points // Assuming points is stored as a number
        })); 

        // Call the function to display the fetched tasks
        buildTaskList(tasks);

    } catch (error) {
        console.error("Error fetching tasks from Firestore: ", error);
        // Display an error message to the user or load a fallback array if needed
        taskList.innerHTML = "<li>Error loading tasks. Check the console for details.</li>";
    }
};


/**
 * Adds a new task entered by the user to the Firestore database.
 */
const addTask = async () => {
    const text = newTaskTextEl.value.trim();
    // Ensure points is read as an integer
    const points = parseInt(newTaskPointsEl.value); 

    // Basic validation
    if (text === "" || isNaN(points) || points <= 0) {
        // Use a custom message box instead of alert()
        console.error("Invalid input: Task text cannot be empty and points must be a positive number.");
        return;
    }

    if (!currentUserId) {
        // Use a custom message box instead of alert()
        console.error("You must be signed in to add tasks.");
        return;
    }

    try {
        const tasksCollectionRef = collection(db, "tasks");

        await addDoc(tasksCollectionRef, {
            text: text,
            points: points,
            userId: currentUserId, // MANDATORY: Links the task to the user
            completed: false
        });

        // Clear the form fields
        newTaskTextEl.value = "";
        newTaskPointsEl.value = "100";

        // Re-fetch and display the tasks, including the new one
        await fetchTasks();
        
        console.log("Task saved successfully!");

    } catch (error) {
        console.error("Error adding task to Firestore: ", error);
    }
};

// --- 5. UI UPDATE LOGIC ---

/**
 * Recalculates points and updates all UI elements (progress bar, rocket phase).
 */
const calculatePointsAndDisplay = () => {
    let totalPoints = 0;
    document.querySelectorAll("#tasklist li input[type='checkbox']").forEach(checkbox => {
        const points = parseInt(checkbox.dataset.points);
        if (checkbox.checked && !isNaN(points)) {
             totalPoints += points;
        }
    });

    totalPointsEl.textContent = `Total Points: ${totalPoints}`;

    // Determine rocket phase
    let currentPhase = 0;
    for (let i = 0; i < phasePoints.length; i++) {
        if (totalPoints >= phasePoints[i]) currentPhase = i + 1;
    }

    // Hide/show rocket phases
    if (rocketPhases) { // Check if rocketPhases is initialized
        rocketPhases.forEach((phase, idx) => {
            phase.style.display = (idx === currentPhase - 1) ? "block" : "none";
        });
    }

    // Points till next phase
    if (currentPhase < phasePoints.length) {
        pointsTillNextPhaseEl.textContent = `Points until next phase: ${phasePoints[currentPhase] - totalPoints}`;
    } else {
        pointsTillNextPhaseEl.textContent = `Points until next phase: 0`;
    }

    // Points till launch
    const pointsToLaunch = Math.max(0, launchPoints - totalPoints);
    pointsTillLaunchEl.textContent = `Points until launch: ${pointsToLaunch}`;

    // Update progress bar
    const progressPercent = Math.min((totalPoints / launchPoints) * 100, 100);
    progressBarEl.style.width = progressPercent + "%";

    // Update launch button color
    if (totalPoints >= launchPoints) {
        launchBtn.classList.remove("grey");
        launchBtn.classList.add("red");
    } else {
        launchBtn.classList.remove("red");
        launchBtn.classList.add("grey");
    }
    
    return totalPoints;
};


document.addEventListener("DOMContentLoaded", () => {
    // Get rocket phases once the DOM is ready
    rocketPhases = rocketSpace.querySelectorAll("div"); 
    
    // Initial display reset
    rocketPhases.forEach(phase => phase.style.display = "none");

    
    // A. Login Listener
    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const email = usernameInput.value;
        const password = passwordInput.value;

        try {
            // Sign in with email and password
            await signInWithEmailAndPassword(auth, email, password);
            // State change observer will handle UI update
        } catch (error) {
            console.error("Login failed:", error.message);
            // Display message instead of alert
            launchMessage.textContent = "Login Failed: " + error.message;
            launchMessage.style.display = "block";
            setTimeout(() => { launchMessage.style.display = "none"; }, 5000);
        }
    });


    
    // B. Add Task Listener
    addTaskBtn.addEventListener("click", addTask);

    // C. Calculate Points Listener
    calculateBtn.addEventListener("click", calculatePointsAndDisplay);
    
    // D. Launch Button Listener
    launchBtn.onclick = () => {
        const totalPoints = calculatePointsAndDisplay();

        if (totalPoints < launchPoints) {
            launchMessage.textContent = "You do not have enough points to launch!";
            launchMessage.style.display = "block";
            setTimeout(() => { launchMessage.style.display = "none"; }, 3000);
        } else {
            launchMessage.textContent = "🚀 Launch Successful! Resetting Mission.";
            launchMessage.style.display = "block";
            
            // In a real app, you might archive the completed tasks here
            
            // Reset points and tasks (Local UI Reset)
            document.querySelectorAll("#tasklist li input[type='checkbox']").forEach(checkbox => {
                checkbox.checked = false;
                checkbox.parentElement.classList.remove("completed");
            });

            // Re-run calculations to update the display
            calculatePointsAndDisplay(); 
            
            setTimeout(() => { 
                launchMessage.style.display = "none"; 
                // Optionally re-fetch tasks to get a clean slate if reset logic is server-side
                // fetchTasks(); 
            }, 3000);
        }
    };

    // E. Logout Listener
logoutBtn.addEventListener("click", async () => {
    try {
        await signOut(auth);
        // onAuthStateChanged will detect this and show the login screen
    } catch (error) {
        console.error("Logout failed:", error);
    }
});

});


// --- 7. AUTHENTICATION STATE OBSERVER ---

onAuthStateChanged(auth, (user) => {
    if (user) {
        // User is signed in
        currentUserId = user.uid;
        console.log("User logged in:", currentUserId);
        
        // Hide the login overlay and show the main app
        loginSection.style.display = 'none';
        
        // Load the user's tasks
        fetchTasks();
        
    } else {
        // User is signed out
        currentUserId = null;
        console.log("User logged out.");
        
        // Show the login overlay (assuming CSS sets default to hidden or flex)
        loginSection.style.display = 'flex'; 
        
        // Clear task list and reset display
        taskList.innerHTML = '<li>Please sign in to view your tasks.</li>';
        calculatePointsAndDisplay(); // Reset all UI elements
    }
});