document.addEventListener('DOMContentLoaded', () => {
  // Sidebar Navigation
  const sidebarItems = document.querySelectorAll('.sidebar-menu li');
  const contentPanels = document.querySelectorAll('.content-panel');
  
  // Dialog Elements
  const addBookDialog = document.getElementById('add-book-dialog');
  const addBookBtn = document.getElementById('add-book-btn');
  const closeDialogBtn = document.querySelector('.close-dialog');
  const cancelBtn = document.querySelector('.cancel-btn');
  const addBookForm = document.getElementById('add-book-form');
  
  // Handle Sidebar Navigation
  sidebarItems.forEach(item => {
    item.addEventListener('click', () => {
      // Get the panel ID from the clicked item
      const panelId = item.getAttribute('data-panel');
      if (!panelId) return;
      
      // Remove active class from all sidebar items
      sidebarItems.forEach(menuItem => {
        menuItem.classList.remove('active');
      });
      
      // Add active class to clicked item
      item.classList.add('active');
      
      // Hide all content panels
      contentPanels.forEach(panel => {
        panel.classList.remove('active');
      });
      
      // Show the corresponding panel
      const targetPanel = document.getElementById(panelId);
      if (targetPanel) {
        targetPanel.classList.add('active');
      }
      
      console.log(`Switched to panel: ${panelId}`);
    });
  });
  
  // Handle Dialog Open/Close
  if (addBookBtn) {
    addBookBtn.addEventListener('click', () => {
      addBookDialog.classList.add('open');
      console.log('Add book dialog opened');
    });
  }
  
  if (closeDialogBtn) {
    closeDialogBtn.addEventListener('click', () => {
      addBookDialog.classList.remove('open');
      console.log('Add book dialog closed via X button');
    });
  }
  
  if (cancelBtn) {
    cancelBtn.addEventListener('click', () => {
      addBookDialog.classList.remove('open');
      console.log('Add book dialog closed via Cancel button');
    });
  }
  
  // Close dialog when clicking outside
  window.addEventListener('click', (e) => {
    if (e.target === addBookDialog) {
      addBookDialog.classList.remove('open');
      console.log('Add book dialog closed by clicking outside');
    }
  });
  
  // Handle Form Submission
  if (addBookForm) {
    addBookForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Get form values
      const title = document.getElementById('book-title').value;
      const author = document.getElementById('book-author').value;
      const isbn = document.getElementById('book-isbn').value;
      const category = document.getElementById('book-category').value;
      const copies = document.getElementById('book-copies').value;
      const description = document.getElementById('book-description').value;
      
      // Here you would typically send this data to your backend
      console.log('Adding new book:', { title, author, isbn, category, copies, description });
      
      // For demonstration, we'll add the book to the table
      addBookToTable(title, author, category);
      
      // Close the dialog and reset form
      addBookDialog.classList.remove('open');
      addBookForm.reset();
    });
  }
  
  // Search functionality
  const globalSearch = document.getElementById('global-search');
  if (globalSearch) {
    globalSearch.addEventListener('input', (e) => {
      const searchTerm = e.target.value.toLowerCase();
      
      // Simple search implementation - can be expanded based on active panel
      const activePanel = document.querySelector('.content-panel.active');
      if (activePanel) {
        const tableRows = activePanel.querySelectorAll('tbody tr');
        
        tableRows.forEach(row => {
          const text = row.textContent.toLowerCase() || '';
          if (text.includes(searchTerm)) {
            row.style.display = '';
          } else {
            row.style.display = 'none';
          }
        });
      }
    });
  }
  
  // Functions
  function addBookToTable(title, author, category) {
    const booksTable = document.querySelector('.books-table tbody');
    if (!booksTable) return;
    
    // Generate a new book ID (in a real app, this would come from the backend)
    const lastBookId = 'BK003'; // This would be dynamically determined
    const newBookId = 'BK' + (parseInt(lastBookId.slice(2)) + 1).toString().padStart(3, '0');
    
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
      <td>${newBookId}</td>
      <td>${title}</td>
      <td>${author}</td>
      <td>${category}</td>
      <td><span class="status-available">Available</span></td>
      <td>
        <button class="action-btn edit-btn"><i class="fas fa-edit"></i></button>
        <button class="action-btn delete-btn"><i class="fas fa-trash"></i></button>
      </td>
    `;
    
    booksTable.appendChild(newRow);
    
    // Add event listeners to new buttons
    const editBtn = newRow.querySelector('.edit-btn');
    const deleteBtn = newRow.querySelector('.delete-btn');
    
    if (editBtn) {
      editBtn.addEventListener('click', () => {
        // Edit book functionality would go here
        console.log(`Editing book: ${title}`);
      });
    }
    
    if (deleteBtn) {
      deleteBtn.addEventListener('click', () => {
        // Delete book functionality would go here
        if (confirm(`Are you sure you want to delete "${title}"?`)) {
          newRow.remove();
          console.log(`Deleted book: ${title}`);
        }
      });
    }
  }
  
  // Initialize approval and rejection functionality for borrow requests
  function initializeBorrowingRequestButtons() {
    const approveButtons = document.querySelectorAll('.approve-btn');
    const rejectButtons = document.querySelectorAll('.reject-btn');
    
    approveButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        const row = e.target.closest('tr');
        const userName = row ? row.querySelector('td:nth-child(2)').textContent : null;
        const bookTitle = row ? row.querySelector('td:nth-child(3)').textContent : null;
        
        if (userName && bookTitle && confirm(`Approve request for "${bookTitle}" by ${userName}?`)) {
          // Here you would call your backend API
          console.log(`Approved request: ${bookTitle} for ${userName}`);
          
          // Update UI to show approved status
          if (row) {
            const statusCell = row.querySelector('td:nth-child(5)');
            if (statusCell) {
              statusCell.innerHTML = '<span class="status-available">Approved</span>';
            }
            
            // Remove action buttons
            const actionsCell = row.querySelector('td:nth-child(6)');
            if (actionsCell) {
              actionsCell.innerHTML = 'Approved on ' + new Date().toLocaleDateString();
            }
          }
        }
      });
    });
    
    rejectButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        const row = e.target.closest('tr');
        const userName = row ? row.querySelector('td:nth-child(2)').textContent : null;
        const bookTitle = row ? row.querySelector('td:nth-child(3)').textContent : null;
        
        if (userName && bookTitle && confirm(`Reject request for "${bookTitle}" by ${userName}?`)) {
          // Here you would call your backend API
          console.log(`Rejected request: ${bookTitle} for ${userName}`);
          
          // Update UI to show rejected status
          if (row) {
            const statusCell = row.querySelector('td:nth-child(5)');
            if (statusCell) {
              statusCell.innerHTML = '<span class="status-borrowed">Rejected</span>';
            }
            
            // Remove action buttons
            const actionsCell = row.querySelector('td:nth-child(6)');
            if (actionsCell) {
              actionsCell.innerHTML = 'Rejected on ' + new Date().toLocaleDateString();
            }
          }
        }
      });
    });
  }
  
  // Initialize the borrow request buttons
  initializeBorrowingRequestButtons();
  
  //============ SETTINGS FUNCTIONALITY =============//
  
  // Get theme preference from localStorage
  const savedTheme = localStorage.getItem('theme') || 'light';
  
  // Set initial theme
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode');
    const darkModeRadio = document.getElementById('dark-mode');
    if (darkModeRadio) darkModeRadio.checked = true;
  } else {
    const lightModeRadio = document.getElementById('light-mode');
    if (lightModeRadio) lightModeRadio.checked = true;
  }
  
  // Theme toggle event listeners
  const lightModeRadio = document.getElementById('light-mode');
  const darkModeRadio = document.getElementById('dark-mode');
  
  if (lightModeRadio) {
    lightModeRadio.addEventListener('change', function() {
      if (this.checked) {
        document.body.classList.remove('dark-mode');
        localStorage.setItem('theme', 'light');
      }
    });
  }
  
  if (darkModeRadio) {
    darkModeRadio.addEventListener('change', function() {
      if (this.checked) {
        document.body.classList.add('dark-mode');
        localStorage.setItem('theme', 'dark');
      }
    });
  }
  
  // Font size slider
  const fontSizeSlider = document.getElementById('font-size');
  const fontSizeValue = document.querySelector('.slider-value');
  
  if (fontSizeSlider && fontSizeValue) {
    fontSizeSlider.addEventListener('input', function() {
      const newSize = this.value;
      fontSizeValue.textContent = `${newSize}px`;
      document.documentElement.style.fontSize = `${newSize}px`;
      localStorage.setItem('fontSize', newSize);
    });
    
    // Load saved font size
    const savedFontSize = localStorage.getItem('fontSize');
    if (savedFontSize) {
      fontSizeSlider.value = savedFontSize;
      fontSizeValue.textContent = `${savedFontSize}px`;
      document.documentElement.style.fontSize = `${savedFontSize}px`;
    }
  }
  
  // Profile picture upload
  const profilePicture = document.querySelector('.profile-picture');
  const profilePictureUpload = document.getElementById('profile-picture-upload');
  const uploadPictureBtn = document.querySelector('.upload-picture-btn');
  
  if (profilePicture && profilePictureUpload && uploadPictureBtn) {
    profilePicture.addEventListener('click', function() {
      profilePictureUpload.click();
    });
    
    uploadPictureBtn.addEventListener('click', function() {
      profilePictureUpload.click();
    });
    
    profilePictureUpload.addEventListener('change', function() {
      if (this.files && this.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
          const profileImg = profilePicture.querySelector('img');
          if (profileImg) {
            profileImg.src = e.target.result;
            // In a real application, you would upload this file to the server
            localStorage.setItem('profilePicture', e.target.result);
          }
        };
        reader.readAsDataURL(this.files[0]);
      }
    });
    
    // Load saved profile picture
    const savedProfilePicture = localStorage.getItem('profilePicture');
    if (savedProfilePicture) {
      const profileImg = profilePicture.querySelector('img');
      if (profileImg) {
        profileImg.src = savedProfilePicture;
      }
    }
  }
  
  // Save settings button
  const saveSettingsBtn = document.querySelector('.save-settings-btn');
  if (saveSettingsBtn) {
    saveSettingsBtn.addEventListener('click', function() {
      // Get form values
      const librarianName = document.getElementById('librarian-name')?.value || '';
      const librarianEmail = document.getElementById('librarian-email')?.value || '';
      const librarianPhone = document.getElementById('librarian-phone')?.value || '';
      
      // Save to localStorage
      localStorage.setItem('librarianName', librarianName);
      localStorage.setItem('librarianEmail', librarianEmail);
      localStorage.setItem('librarianPhone', librarianPhone);
      
      // Save notification settings
      const emailNotifications = document.getElementById('email-notifications')?.checked || false;
      const desktopNotifications = document.getElementById('desktop-notifications')?.checked || false;
      const overdueReminders = document.getElementById('overdue-reminders')?.checked || false;
      
      localStorage.setItem('emailNotifications', emailNotifications);
      localStorage.setItem('desktopNotifications', desktopNotifications);
      localStorage.setItem('overdueReminders', overdueReminders);
      
      // Show success message
      alert('Settings saved successfully!');
      
      // Update displayed name in the navbar
      const navbarName = document.querySelector('.librarian-name');
      if (navbarName && librarianName) {
        navbarName.textContent = `Welcome, ${librarianName.split(' ')[0]}`;
      }
    });
  }
  
  // Load saved form values
  const savedLibrarianName = localStorage.getItem('librarianName');
  const savedLibrarianEmail = localStorage.getItem('librarianEmail');
  const savedLibrarianPhone = localStorage.getItem('librarianPhone');
  
  const nameInput = document.getElementById('librarian-name');
  const emailInput = document.getElementById('librarian-email');
  const phoneInput = document.getElementById('librarian-phone');
  
  if (nameInput && savedLibrarianName) nameInput.value = savedLibrarianName;
  if (emailInput && savedLibrarianEmail) emailInput.value = savedLibrarianEmail;
  if (phoneInput && savedLibrarianPhone) phoneInput.value = savedLibrarianPhone;
  
  // Load saved notification settings
  const savedEmailNotifications = localStorage.getItem('emailNotifications');
  const savedDesktopNotifications = localStorage.getItem('desktopNotifications');
  const savedOverdueReminders = localStorage.getItem('overdueReminders');
  
  const emailNotificationsInput = document.getElementById('email-notifications');
  const desktopNotificationsInput = document.getElementById('desktop-notifications');
  const overdueRemindersInput = document.getElementById('overdue-reminders');
  
  if (emailNotificationsInput && savedEmailNotifications !== null) 
    emailNotificationsInput.checked = savedEmailNotifications === 'true';
  if (desktopNotificationsInput && savedDesktopNotifications !== null) 
    desktopNotificationsInput.checked = savedDesktopNotifications === 'true';
  if (overdueRemindersInput && savedOverdueReminders !== null) 
    overdueRemindersInput.checked = savedOverdueReminders === 'true';
  
  // Update displayed name in the navbar
  if (savedLibrarianName) {
    const navbarName = document.querySelector('.librarian-name');
    if (navbarName) {
      navbarName.textContent = `Welcome, ${savedLibrarianName.split(' ')[0]}`;
    }
  }
  
  // Debug helper
  console.log('eLibrary Dashboard loaded successfully');
  console.log('Available panels:', Array.from(contentPanels).map(panel => panel.id));
  console.log('Available sidebar items:', Array.from(sidebarItems).map(item => item.getAttribute('data-panel')));
});