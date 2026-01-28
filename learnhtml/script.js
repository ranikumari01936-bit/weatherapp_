// Show a welcome message when the page loads
window.onload = function()
 {
  alert("Hello! Welcome to my webpage");
};

// Attach event listener to the button
document.getElementById("boldBtn").addEventListener("click", function()
 {
  document.getElementById("demo").style.fontWeight = "bold";
});