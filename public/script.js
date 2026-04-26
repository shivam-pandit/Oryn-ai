document.addEventListener('DOMContentLoaded', () => {
  const chatForm = document.getElementById('chat-form');
  const userInput = document.getElementById('user-input');
  const chatWindow = document.getElementById('chat-window');

  // Function to create and append a message to the UI
  function addMessage(content, isUser = false) {
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('message', isUser ? 'user-message' : 'bot-message', 'slide-in');
    
    const bubble = document.createElement('div');
    bubble.classList.add('message-bubble');
    
    // Simple text-to-html conversion for newlines
    bubble.innerHTML = content.replace(/\n/g, '<br>');
    
    msgDiv.appendChild(bubble);
    chatWindow.appendChild(msgDiv);
    scrollToBottom();
  }

  // Function to show typing indicator
  function showTypingIndicator() {
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('message', 'bot-message', 'slide-in');
    msgDiv.id = 'typing-indicator-msg';
    
    const bubble = document.createElement('div');
    bubble.classList.add('message-bubble');
    
    const indicator = document.createElement('div');
    indicator.classList.add('typing-indicator');
    indicator.innerHTML = '<div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>';
    
    bubble.appendChild(indicator);
    msgDiv.appendChild(bubble);
    chatWindow.appendChild(msgDiv);
    scrollToBottom();
  }

  // Function to remove typing indicator
  function removeTypingIndicator() {
    const indicator = document.getElementById('typing-indicator-msg');
    if (indicator) {
      indicator.remove();
    }
  }

  function scrollToBottom() {
    chatWindow.scrollTop = chatWindow.scrollHeight;
  }

  chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const text = userInput.value.trim();
    if (!text) return;

    // Display user message
    addMessage(text, true);
    userInput.value = '';
    
    showTypingIndicator();

    try {
      // Send to backend
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text })
      });

      const data = await response.json();
      removeTypingIndicator();

      if (response.ok) {
        addMessage(data.reply);
      } else {
        addMessage(`❌ Error: ${data.error}`);
      }
    } catch (error) {
      removeTypingIndicator();
      addMessage(`❌ Connection error: Could not reach the server.`);
      console.error(error);
    }
  });

});
