// Interactive Conference Agenda JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the application
    initializeApp();
});

function initializeApp() {
    // Setup tab navigation
    setupTabNavigation();
    
    // Setup interactive elements
    setupInteractiveElements();
    
    // Setup animations
    setupAnimations();
    
    
    // Setup search functionality
    setupSearchFunctionality();
    
    // Setup time tracking
    setupTimeTracking();
    
    // Setup responsive features
    setupResponsiveFeatures();
    
    // Setup attendee features
    setupAttendeeFeatures();
    
    // Load saved notes
    loadNotes();
}

// Tab Navigation
function setupTabNavigation() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            
            // Remove active class from all buttons and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked button and corresponding content
            this.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
            
            // Add visual feedback
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
            
            // Scroll to top of content
            document.getElementById(targetTab).scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start' 
            });
        });
    });
}

// Interactive Elements
function setupInteractiveElements() {
    // Add hover effects to time slots
    const timeSlots = document.querySelectorAll('.time-slot');
    timeSlots.forEach(slot => {
        slot.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px) scale(1.02)';
        });
        
        slot.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
        
        // Add click to expand/collapse details
        slot.addEventListener('click', function() {
            const details = this.querySelector('.event-details');
            if (details) {
                details.classList.toggle('expanded');
            }
        });
    });
    
    // Add interactive outcome items
    const outcomeItems = document.querySelectorAll('.outcome-item');
    outcomeItems.forEach(item => {
        item.addEventListener('click', function() {
            this.classList.toggle('highlighted');
            
            // Add a brief animation
            this.style.transform = 'scale(1.05)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 200);
        });
    });
    
    // Add interactive invitee list
    const inviteeItems = document.querySelectorAll('.invitee-list li');
    inviteeItems.forEach(item => {
        item.addEventListener('click', function() {
            this.classList.toggle('selected');
        });
    });
}

// Animations
function setupAnimations() {
    // Animate elements on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe all sections and time slots
    const elementsToAnimate = document.querySelectorAll('.section, .time-slot, .day-summary');
    elementsToAnimate.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });
}


// Search Functionality
function setupSearchFunctionality() {
    // Add search input
    const searchContainer = document.createElement('div');
    searchContainer.className = 'search-container';
    searchContainer.style.cssText = `
        position: fixed;
        top: 20px;
        left: 20px;
        z-index: 1000;
    `;
    
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Search agenda...';
    searchInput.className = 'search-input';
    
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        searchAgenda(searchTerm);
    });
    
    searchContainer.appendChild(searchInput);
    document.body.appendChild(searchContainer);
}

function searchAgenda(searchTerm) {
    const allElements = document.querySelectorAll('.time-slot, .section, .detail-item');
    
    allElements.forEach(element => {
        const text = element.textContent.toLowerCase();
        const parent = element.closest('.time-slot, .section');
        
        if (text.includes(searchTerm)) {
            element.style.background = 'rgba(52, 152, 219, 0.1)';
            element.style.borderLeft = '4px solid #3498db';
            if (parent) parent.style.display = 'block';
        } else {
            element.style.background = '';
            element.style.borderLeft = '';
            if (searchTerm && parent) {
                parent.style.display = 'none';
            } else {
                parent.style.display = 'block';
            }
        }
    });
    
    // If search term is empty, show all elements
    if (!searchTerm) {
        allElements.forEach(element => {
            element.style.background = '';
            element.style.borderLeft = '';
            element.closest('.time-slot, .section').style.display = 'block';
        });
    }
}

// Time Tracking
function setupTimeTracking() {
    const timeSlots = document.querySelectorAll('.time-slot');
    const currentTime = new Date();
    
    timeSlots.forEach(slot => {
        const timeElement = slot.querySelector('.time');
        if (timeElement) {
            const timeText = timeElement.textContent;
            const slotTime = parseTimeSlot(timeText);
            
            if (slotTime) {
                const timeDiff = slotTime.getTime() - currentTime.getTime();
                const hoursUntil = Math.floor(timeDiff / (1000 * 60 * 60));
                const minutesUntil = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
                
                if (timeDiff > 0 && timeDiff < 24 * 60 * 60 * 1000) { // Within 24 hours
                    const timeIndicator = document.createElement('div');
                    timeIndicator.className = 'time-indicator';
                    timeIndicator.style.cssText = `
                        position: absolute;
                        top: 5px;
                        right: 5px;
                        background: #e74c3c;
                        color: white;
                        padding: 2px 6px;
                        border-radius: 10px;
                        font-size: 10px;
                        font-weight: bold;
                    `;
                    
                    if (hoursUntil > 0) {
                        timeIndicator.textContent = `${hoursUntil}h ${minutesUntil}m`;
                    } else {
                        timeIndicator.textContent = `${minutesUntil}m`;
                    }
                    
                    timeElement.style.position = 'relative';
                    timeElement.appendChild(timeIndicator);
                }
            }
        }
    });
}

function parseTimeSlot(timeText) {
    const today = new Date();
    const [timePart, period] = timeText.split(/(am|pm)/i);
    const [hours, minutes] = timePart.split(':').map(Number);
    
    if (period && (period.toLowerCase() === 'am' || period.toLowerCase() === 'pm')) {
        let adjustedHours = hours;
        if (period.toLowerCase() === 'pm' && hours !== 12) {
            adjustedHours += 12;
        } else if (period.toLowerCase() === 'am' && hours === 12) {
            adjustedHours = 0;
        }
        
        const slotTime = new Date(today);
        slotTime.setHours(adjustedHours, minutes || 0, 0, 0);
        
        return slotTime;
    }
    return null;
}

// Responsive Features
function setupResponsiveFeatures() {
    // Handle window resize
    window.addEventListener('resize', function() {
        const isMobile = window.innerWidth <= 768;
        const navTabs = document.querySelector('.nav-tabs');
        
        if (isMobile) {
            navTabs.style.flexDirection = 'column';
        } else {
            navTabs.style.flexDirection = 'row';
        }
    });
    
    // Add mobile menu toggle with AES styling
    if (window.innerWidth <= 768) {
        const navToggle = document.createElement('button');
        navToggle.innerHTML = '<i class="fas fa-bars"></i>';
        navToggle.className = 'nav-toggle';
        navToggle.style.cssText = `
            position: fixed;
            top: 20px;
            right: 80px;
            background: var(--aes-dark-blue);
            color: white;
            border: none;
            padding: 12px;
            border-radius: 50%;
            cursor: pointer;
            z-index: 1001;
            display: none;
        `;
        
        navToggle.addEventListener('click', function() {
            const navTabs = document.querySelector('.nav-tabs');
            navTabs.classList.toggle('mobile-open');
        });
        
        document.body.appendChild(navToggle);
    }
}

// Attendee Features
function setupAttendeeFeatures() {
    // Setup favorites functionality
    setupFavorites();
    
    // Setup notes functionality
    setupNotes();
    
    // Setup material downloads
    setupMaterialDownloads();
    
    // Setup my schedule section
    setupMySchedule();
}

function setupFavorites() {
    const favoriteButtons = document.querySelectorAll('.favorite-btn');
    
    favoriteButtons.forEach(button => {
        button.addEventListener('click', function() {
            const timeSlot = this.closest('.time-slot');
            const sessionTitle = timeSlot.querySelector('h3').textContent;
            
            if (this.classList.contains('favorited')) {
                // Remove from favorites
                this.classList.remove('favorited');
                this.innerHTML = '<i class="fas fa-star"></i>';
                removeFromFavorites(sessionTitle);
            } else {
                // Add to favorites
                this.classList.add('favorited');
                this.innerHTML = '<i class="fas fa-star"></i>';
                addToFavorites(sessionTitle, timeSlot);
            }
        });
    });
}

function setupNotes() {
    const notesButtons = document.querySelectorAll('.notes-btn');
    
    notesButtons.forEach(button => {
        button.addEventListener('click', function() {
            const timeSlot = this.closest('.time-slot');
            const notesSection = timeSlot.querySelector('.session-notes');
            
            if (notesSection.style.display === 'none') {
                notesSection.style.display = 'block';
                this.innerHTML = '<i class="fas fa-sticky-note"></i>';
                this.style.background = 'var(--aes-green)';
                this.style.color = 'white';
            } else {
                notesSection.style.display = 'none';
                this.innerHTML = '<i class="fas fa-sticky-note"></i>';
                this.style.background = 'transparent';
                this.style.color = 'var(--aes-blue)';
            }
        });
    });
    
    // Setup save notes functionality
    const saveButtons = document.querySelectorAll('.save-notes-btn');
    saveButtons.forEach(button => {
        button.addEventListener('click', function() {
            const textarea = this.previousElementSibling;
            const sessionTitle = this.closest('.time-slot').querySelector('h3').textContent;
            saveNotes(sessionTitle, textarea.value);
            
            // Show confirmation
            const originalText = this.textContent;
            this.textContent = 'Saved!';
            this.style.background = 'var(--aes-green)';
            setTimeout(() => {
                this.textContent = originalText;
                this.style.background = 'var(--aes-dark-blue)';
            }, 2000);
        });
    });
}

function setupMaterialDownloads() {
    const materialLinks = document.querySelectorAll('.material-link');
    
    materialLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const fileName = this.textContent.trim();
            
            // Simulate download
            const originalText = this.innerHTML;
            this.innerHTML = '<i class="fas fa-download"></i> Downloading...';
            this.style.color = 'var(--aes-green)';
            
            setTimeout(() => {
                this.innerHTML = originalText;
                this.style.color = 'var(--aes-blue)';
                
                // Show download notification
                showNotification(`${fileName} downloaded successfully!`);
            }, 1500);
        });
    });
}

function setupMySchedule() {
    // Create my schedule section
    const overviewTab = document.getElementById('overview');
    const myScheduleSection = document.createElement('section');
    myScheduleSection.className = 'section my-schedule';
    myScheduleSection.innerHTML = `
        <h3><i class="fas fa-heart"></i> My Schedule</h3>
        <p>Your favorite sessions and personal notes</p>
        <div id="favorite-sessions-list">
            <p class="no-favorites">No favorite sessions yet. Click the star icon on any session to add it to your schedule.</p>
        </div>
    `;
    
    overviewTab.appendChild(myScheduleSection);
}

function addToFavorites(sessionTitle, timeSlot) {
    const favoritesList = document.getElementById('favorite-sessions-list');
    const noFavoritesMsg = favoritesList.querySelector('.no-favorites');
    
    if (noFavoritesMsg) {
        noFavoritesMsg.remove();
    }
    
    // Check if already exists
    const existingItem = favoritesList.querySelector(`[data-session="${sessionTitle}"]`);
    if (existingItem) return;
    
    const sessionTime = timeSlot.querySelector('.time').textContent;
    const favoriteItem = document.createElement('li');
    favoriteItem.innerHTML = `
        <div>
            <div class="session-time">${sessionTime}</div>
            <div>${sessionTitle}</div>
        </div>
        <button class="remove-favorite-btn" title="Remove from Favorites">
            <i class="fas fa-times"></i>
        </button>
    `;
    favoriteItem.setAttribute('data-session', sessionTitle);
    
    // Add remove functionality
    const removeBtn = favoriteItem.querySelector('.remove-favorite-btn');
    removeBtn.addEventListener('click', function() {
        favoriteItem.remove();
        removeFromFavorites(sessionTitle);
        
        // Show no favorites message if list is empty
        if (favoritesList.children.length === 0) {
            favoritesList.innerHTML = '<p class="no-favorites">No favorite sessions yet. Click the star icon on any session to add it to your schedule.</p>';
        }
    });
    
    favoritesList.appendChild(favoriteItem);
    showNotification(`${sessionTitle} added to your schedule!`);
}

function removeFromFavorites(sessionTitle) {
    // Update the star button in the original session
    const timeSlot = document.querySelector(`[data-session]`);
    if (timeSlot) {
        const favoriteBtn = timeSlot.querySelector('.favorite-btn');
        if (favoriteBtn) {
            favoriteBtn.classList.remove('favorited');
            favoriteBtn.innerHTML = '<i class="fas fa-star"></i>';
        }
    }
    
    showNotification(`${sessionTitle} removed from your schedule`);
}

function saveNotes(sessionTitle, notes) {
    // Save to localStorage
    const savedNotes = JSON.parse(localStorage.getItem('conferenceNotes') || '{}');
    savedNotes[sessionTitle] = notes;
    localStorage.setItem('conferenceNotes', JSON.stringify(savedNotes));
}

function loadNotes() {
    const savedNotes = JSON.parse(localStorage.getItem('conferenceNotes') || '{}');
    
    Object.keys(savedNotes).forEach(sessionTitle => {
        const timeSlot = document.querySelector(`[data-session]`);
        if (timeSlot) {
            const notesTextarea = timeSlot.querySelector('.session-notes textarea');
            if (notesTextarea) {
                notesTextarea.value = savedNotes[sessionTitle];
            }
        }
    });
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--aes-green);
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        z-index: 10000;
        font-family: var(--font-primary);
        font-size: 14px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

// Utility Functions
function addToCalendar(eventData) {
    // Generate ICS format for calendar import
    const icsContent = generateICS(eventData);
    const blob = new Blob([icsContent], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'conference-agenda.ics';
    link.click();
    
    URL.revokeObjectURL(url);
}

function generateICS(eventData) {
    const formatDate = (date) => {
        return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };
    
    let ics = 'BEGIN:VCALENDAR\n';
    ics += 'VERSION:2.0\n';
    ics += 'PRODID:-//AES Engineering//Conference Agenda//EN\n';
    
    eventData.forEach(event => {
        ics += 'BEGIN:VEVENT\n';
        ics += `DTSTART:${formatDate(event.start)}\n`;
        ics += `DTEND:${formatDate(event.end)}\n`;
        ics += `SUMMARY:${event.title}\n`;
        ics += `DESCRIPTION:${event.description}\n`;
        ics += `LOCATION:Oak Bay Beach Hotel, Victoria, BC\n`;
        ics += 'END:VEVENT\n';
    });
    
    ics += 'END:VCALENDAR';
    return ics;
}

// Add keyboard navigation
document.addEventListener('keydown', function(e) {
    if (e.ctrlKey || e.metaKey) {
        switch(e.key) {
            case '1':
                e.preventDefault();
                document.querySelector('[data-tab="overview"]').click();
                break;
            case '2':
                e.preventDefault();
                document.querySelector('[data-tab="wednesday"]').click();
                break;
            case '3':
                e.preventDefault();
                document.querySelector('[data-tab="thursday"]').click();
                break;
            case '4':
                e.preventDefault();
                document.querySelector('[data-tab="friday"]').click();
                break;
            case 'f':
                e.preventDefault();
                document.querySelector('.search-input').focus();
                break;
        }
    }
});

// Add loading animation
window.addEventListener('load', function() {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// Add smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add tooltips for interactive elements
function addTooltip(element, text) {
    element.addEventListener('mouseenter', function() {
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.textContent = text;
        tooltip.style.cssText = `
            position: absolute;
            background: #2c3e50;
            color: white;
            padding: 8px 12px;
            border-radius: 6px;
            font-size: 12px;
            z-index: 1000;
            pointer-events: none;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;
        
        document.body.appendChild(tooltip);
        
        const rect = this.getBoundingClientRect();
        tooltip.style.left = rect.left + rect.width / 2 - tooltip.offsetWidth / 2 + 'px';
        tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + 'px';
        
        setTimeout(() => {
            tooltip.style.opacity = '1';
        }, 10);
        
        this._tooltip = tooltip;
    });
    
    element.addEventListener('mouseleave', function() {
        if (this._tooltip) {
            this._tooltip.remove();
            this._tooltip = null;
        }
    });
}

// Initialize tooltips for key elements
document.addEventListener('DOMContentLoaded', function() {
    const printButton = document.querySelector('.print-button');
    const searchInput = document.querySelector('.search-input');
    
    
    if (searchInput) {
        addTooltip(searchInput, 'Search agenda content (Ctrl+F)');
    }
});

