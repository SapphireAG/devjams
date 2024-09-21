// document.addEventListener("DOMContentLoaded", () => {
//     // Load saved prompts from Chrome storage when the popup loads
//     chrome.storage.local.get(["savedPrompts"], (result) => {
//       const savedPrompts = result.savedPrompts || [];
//       displayPrompts(savedPrompts);
//     });
//   });
  
//   document.getElementById("sendPrompt").addEventListener("click", async () => {
//     const prompt = document.getElementById("prompt").value;
  
//     // Retrieve existing prompts and add the new prompt to the list
//     chrome.storage.local.get(["savedPrompts"], (result) => {
//       const savedPrompts = result.savedPrompts || [];
//       savedPrompts.push(prompt);
  
//       // Save the updated list of prompts to Chrome's local storage
//       chrome.storage.local.set({ savedPrompts: savedPrompts }, () => {
//         console.log("Prompt saved to Chrome storage.");
//         displayPrompts(savedPrompts); // Display updated prompts
//       });
//     });
  
    
//     const geminiApiKey = "AIzaSyB_Q7STnMR74cWMyWg3hb8VDGt8UWsmJKc"; // Update with Gemini API key or authentication token
  
//     try {
//       // Call the Gemini API (replace with Gemini's actual API URL and request structure)
//       const response = await fetch("https://generativelanguage.googleapis.com",mode='no_cors', { // Update with Gemini endpoint
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           "Authorization": `Bearer ${geminiApiKey}`, // Update as per Gemini's requirements
//         },
//         body: JSON.stringify({
//           model: "gemini-1.5-flash", // Replace with Gemini model if needed
//           messages: [{ role: "user", content: prompt }],
//           max_tokens: 150, // Adjust based on Gemini's API constraints
//         }),
//       });
  
//       const data = await response.json();
  
//       // Display the response in the extension's popup
//       if (data.choices && data.choices.length > 0) {
//         document.getElementById("response").textContent = data.choices[0].message.content; // Update based on Gemini's response structure
//       } else {
//         document.getElementById("response").textContent = "No response received.";
//       }
//     } catch (error) {
//       console.error("Error fetching response:", error);
//       console.error("Error message:", error.message); // Logs the error message
//       console.error("Error stack:", error.stack); // Logs the stack trace
//       document.getElementById("response").textContent = "Error fetching response. Please try again.";
//     }
//   });
  
//   // Function to display prompts stored in Chrome storage
//   function displayPrompts(prompts) {
//     const promptList = document.getElementById("promptList");
  
//     // Clear the list before adding new items
//     promptList.innerHTML = "";
  
//     // Display each saved prompt in the list
//     prompts.forEach((prompt, index) => {
//       const listItem = document.createElement("li");
//       listItem.textContent = `${index + 1}. ${prompt}`;
//       promptList.appendChild(listItem);
//     });
//   }

var corsAttr = new EnableCorsAttribute("*", "*", "*");
config.EnableCors(corsAttr); 
document.addEventListener("DOMContentLoaded", () => {
  // Load saved prompts from Chrome storage when the popup loads
  chrome.storage.local.get(["savedPrompts"], (result) => {
    const savedPrompts = result.savedPrompts || [];
    displayPrompts(savedPrompts);
  });
});

document.getElementById("sendPrompt").addEventListener("click", async () => {
  const prompt = document.getElementById("prompt").value;

  // Retrieve existing prompts and add the new prompt to the list
  chrome.storage.local.get(["savedPrompts"], (result) => {
    const savedPrompts = result.savedPrompts || [];
    savedPrompts.push(prompt);

    // Save the updated list of prompts to Chrome's local storage
    chrome.storage.local.set({ savedPrompts: savedPrompts }, () => {
      console.log("Prompt saved to Chrome storage.");
      displayPrompts(savedPrompts); // Display updated prompts
    });
  });

  // Replace the following line with your Gemini API key or authentication details
  const geminiApiKey = "AIzaSyB_Q7STnMR74cWMyWg3hb8VDGt8UWsmJKc"; // Update with Gemini API key or authentication token

  try {
    // Corrected fetch call structure
    const response = await fetch("https://generativelanguage.googleapis.com", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${geminiApiKey}`, // Update as per Gemini's requirements
      },
      body: JSON.stringify({
        model: "gemini-1.5-flash", // Replace with Gemini model if needed
        messages: [{ role: "user", content: prompt }],
        max_tokens: 150, // Adjust based on Gemini's API constraints
      }),
      mode: "cors", // Correct placement of the mode property if needed
    });

    const data = await response.json();

    // Display the response in the extension's popup
    if (data.choices && data.choices.length > 0) {
      document.getElementById("response").textContent = data.choices[0].message.content; // Update based on Gemini's response structure
    } else {
      document.getElementById("response").textContent = "No response received.";
    }
  } catch (error) {
    console.error("Error fetching response:", error);
    console.error("Error message:", error.message); // Logs the error message
    console.error("Error stack:", error.stack); // Logs the stack trace
    document.getElementById("response").textContent = "Error fetching response. Please try again.";
  }
});

// Function to display prompts stored in Chrome storage
function displayPrompts(prompts) {
  const promptList = document.getElementById("promptList");

  // Clear the list before adding new items
  promptList.innerHTML = "";

  // Display each saved prompt in the list
  prompts.forEach((prompt, index) => {
    const listItem = document.createElement("li");
    listItem.textContent = `${index + 1}. ${prompt}`;
    promptList.appendChild(listItem);
  });
}
