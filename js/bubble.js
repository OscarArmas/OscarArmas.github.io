// ===== MESSAGE BUBBLE FUNCTIONALITY =====

// Toggle message bubble visibility
function toggleMessageBubble() {
    const bubble = document.getElementById('messageBubble');
    const quickMessages = document.getElementById('quickMessages');
    
    if (bubble.classList.contains('show')) {
        hideMessageBubble();
    } else {
        bubble.classList.add('show');
        if (quickMessages) {
            quickMessages.classList.remove('show');
        }
    }
}

// Hide message bubble
function hideMessageBubble(event) {
    if (event) event.stopPropagation();
    const bubble = document.getElementById('messageBubble');
    const quickMessages = document.getElementById('quickMessages');
    
    if (bubble) {
        bubble.classList.remove('show');
    }
    if (quickMessages) {
        quickMessages.classList.remove('show');
    }
}

// Edit message functionality
function editMessage(event) {
    event.stopPropagation();
    const messageDiv = document.getElementById('bubbleMessage');
    if (!messageDiv) return;
    
    const currentMessage = messageDiv.textContent;
    
    // Create textarea for editing
    const textarea = document.createElement('textarea');
    textarea.className = 'message-input';
    textarea.value = currentMessage;
    textarea.rows = 3;
    textarea.placeholder = 'Escribe tu mensaje personalizado...';
    
    // Replace message with textarea
    messageDiv.style.display = 'none';
    messageDiv.parentNode.insertBefore(textarea, messageDiv);
    textarea.focus();
    
    // Save on Enter, Cancel on Escape
    textarea.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            saveMessage(textarea.value);
        } else if (e.key === 'Escape') {
            cancelEdit();
        }
    });
    
    // Update buttons
    updateBubbleButtons('edit');
}

// Save edited message
function saveMessage(newMessage) {
    if (!newMessage.trim()) return;
    
    const messageDiv = document.getElementById('bubbleMessage');
    const textarea = document.querySelector('.message-input');
    
    if (messageDiv) {
        // Update message
        messageDiv.textContent = newMessage.trim();
        messageDiv.style.display = 'block';
    }
    
    // Remove textarea
    if (textarea) {
        textarea.remove();
    }
    
    // Restore original buttons
    updateBubbleButtons('normal');
    
    // Save to localStorage
    localStorage.setItem('oscarCustomMessage', newMessage.trim());
    
    // Track event
    if (window.AppUtils && window.AppUtils.trackEvent) {
        window.AppUtils.trackEvent('message_edited', { message: newMessage.trim() });
    }
}

// Cancel edit
function cancelEdit() {
    const messageDiv = document.getElementById('bubbleMessage');
    const textarea = document.querySelector('.message-input');
    
    if (messageDiv) {
        messageDiv.style.display = 'block';
    }
    if (textarea) {
        textarea.remove();
    }
    
    updateBubbleButtons('normal');
}

// Show quick messages panel
function showQuickMessages(event) {
    event.stopPropagation();
    const quickMessages = document.getElementById('quickMessages');
    if (quickMessages) {
        quickMessages.classList.toggle('show');
    }
}

// Set quick message
function setQuickMessage(message) {
    const messageDiv = document.getElementById('bubbleMessage');
    if (messageDiv) {
        messageDiv.textContent = message;
    }
    
    // Hide quick messages
    const quickMessages = document.getElementById('quickMessages');
    if (quickMessages) {
        quickMessages.classList.remove('show');
    }
    
    // Save to localStorage
    localStorage.setItem('oscarCustomMessage', message);
    
    // Track event
    if (window.AppUtils && window.AppUtils.trackEvent) {
        window.AppUtils.trackEvent('quick_message_selected', { message });
    }
}

// Update bubble buttons based on state
function updateBubbleButtons(state) {
    const actions = document.querySelector('.bubble-actions');
    if (!actions) return;
    
    if (state === 'edit') {
        actions.innerHTML = `
            <button class="bubble-btn" onclick="saveMessage(document.querySelector('.message-input').value)">💾 Guardar</button>
            <button class="bubble-btn" onclick="cancelEdit()">✕ Cancelar</button>
        `;
    } else {
        actions.innerHTML = `
            <button class="bubble-btn" onclick="editMessage(event)">✏️</button>
            <button class="bubble-btn" onclick="showQuickMessages(event)">⚡</button>
            <button class="bubble-btn" onclick="hideMessageBubble(event)">✕</button>
        `;
    }
}

// Initialize bubble functionality
function initializeBubble() {
    // Load saved message on page load
    const savedMessage = localStorage.getItem('oscarCustomMessage');
    if (savedMessage) {
        const messageDiv = document.getElementById('bubbleMessage');
        if (messageDiv) {
            messageDiv.textContent = savedMessage;
        }
    }
    
    // Add click handlers for quick message items
    document.querySelectorAll('.quick-message-item').forEach(item => {
        item.addEventListener('click', function() {
            const message = this.getAttribute('data-message');
            if (message) {
                setQuickMessage(message);
            }
        });
    });
}

// Export functions to global scope
window.BubbleManager = {
    toggleMessageBubble,
    hideMessageBubble,
    editMessage,
    saveMessage,
    cancelEdit,
    showQuickMessages,
    setQuickMessage,
    initializeBubble
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeBubble);
} else {
    initializeBubble();
} 