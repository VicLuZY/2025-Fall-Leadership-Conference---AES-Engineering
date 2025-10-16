// Interactive Conference Agenda JavaScript
// Using external libraries for better maintainability

// Configuration object for the application
const AppConfig = {
    animationDuration: 300,
    notificationDuration: 3000,
    searchDebounceDelay: 300,
    localStorageKeys: {
        notes: 'conferenceNotes',
        favorites: 'conferenceFavorites'
    }
};

// Prezi-Style Conference Application
class PreziConferenceApp {
    constructor() {
        this.searchInput = null;
        this.favorites = new Set();
        this.notes = new Map();
        this.currentSection = 'overview';
        
        // Prezi-specific properties
        this.zoomLevel = 1;
        this.panX = 0;
        this.panY = 0;
        this.isDragging = false;
        this.dragStart = { x: 0, y: 0 };
        this.canvas = null;
        this.canvasContent = null;
        
        this.init();
    }
    
    async init() {
        try {
            await this.initializeLibraries();
            this.setupEventListeners();
            this.loadPersistedData();
            this.setupAnimations();
            this.showWelcomeMessage();
        } catch (error) {
            console.error('Failed to initialize application:', error);
            this.showError('Failed to load application. Please refresh the page.');
        }
    }
    
    async initializeLibraries() {
        // Initialize AOS (Animate On Scroll)
        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: AppConfig.animationDuration,
                once: true,
                offset: 100
            });
        }
        
        // Initialize Bootstrap tooltips
        if (typeof bootstrap !== 'undefined') {
            const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
            tooltipTriggerList.map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
        }
    }
    
    setupEventListeners() {
        this.setupPreziCanvas();
        this.setupOrbNavigation();
        this.setupZoomControls();
        this.setupSearchFunctionality();
        this.setupAttendeeFeatures();
        this.setupKeyboardShortcuts();
        this.setupResponsiveFeatures();
    }
    
    // Prezi Canvas Setup
    setupPreziCanvas() {
        this.canvas = document.getElementById('preziCanvas');
        this.canvasContent = document.getElementById('canvasContent');
        
        if (!this.canvas || !this.canvasContent) return;
        
        // Mouse events for dragging
        this.canvas.addEventListener('mousedown', this.handleMouseDown.bind(this));
        this.canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));
        this.canvas.addEventListener('mouseup', this.handleMouseUp.bind(this));
        this.canvas.addEventListener('mouseleave', this.handleMouseUp.bind(this));
        
        // Touch events for mobile
        this.canvas.addEventListener('touchstart', this.handleTouchStart.bind(this));
        this.canvas.addEventListener('touchmove', this.handleTouchMove.bind(this));
        this.canvas.addEventListener('touchend', this.handleTouchEnd.bind(this));
        
        // Wheel events for zooming
        this.canvas.addEventListener('wheel', this.handleWheel.bind(this));
        
        this.updateCanvasTransform();
    }
    
    handleMouseDown(e) {
        this.isDragging = true;
        this.dragStart.x = e.clientX - this.panX;
        this.dragStart.y = e.clientY - this.panY;
        this.canvas.style.cursor = 'grabbing';
    }
    
    handleMouseMove(e) {
        if (!this.isDragging) return;
        
        this.panX = e.clientX - this.dragStart.x;
        this.panY = e.clientY - this.dragStart.y;
        this.updateCanvasTransform();
    }
    
    handleMouseUp(e) {
        this.isDragging = false;
        this.canvas.style.cursor = 'grab';
    }
    
    handleTouchStart(e) {
        if (e.touches.length === 1) {
            this.isDragging = true;
            this.dragStart.x = e.touches[0].clientX - this.panX;
            this.dragStart.y = e.touches[0].clientY - this.panY;
        }
    }
    
    handleTouchMove(e) {
        if (!this.isDragging || e.touches.length !== 1) return;
        
        this.panX = e.touches[0].clientX - this.dragStart.x;
        this.panY = e.touches[0].clientY - this.dragStart.y;
        this.updateCanvasTransform();
    }
    
    handleTouchEnd(e) {
        this.isDragging = false;
    }
    
    handleWheel(e) {
        e.preventDefault();
        const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
        this.zoomTo(this.zoomLevel * zoomFactor, e.clientX, e.clientY);
    }
    
    // Zoom Controls Setup
    setupZoomControls() {
        const zoomIn = document.getElementById('zoomIn');
        const zoomOut = document.getElementById('zoomOut');
        const resetZoom = document.getElementById('resetZoom');
        
        if (zoomIn) {
            zoomIn.addEventListener('click', () => this.zoomTo(this.zoomLevel * 1.2));
        }
        
        if (zoomOut) {
            zoomOut.addEventListener('click', () => this.zoomTo(this.zoomLevel * 0.8));
        }
        
        if (resetZoom) {
            resetZoom.addEventListener('click', () => this.resetView());
        }
    }
    
    zoomTo(level, centerX = window.innerWidth / 2, centerY = window.innerHeight / 2) {
        const minZoom = 0.3;
        const maxZoom = 3;
        
        this.zoomLevel = Math.max(minZoom, Math.min(maxZoom, level));
        
        // Adjust pan to zoom towards cursor
        const rect = this.canvas.getBoundingClientRect();
        const relativeX = centerX - rect.left;
        const relativeY = centerY - rect.top;
        
        this.panX = relativeX - (relativeX - this.panX) * (this.zoomLevel / (level / 1.2 || 1));
        this.panY = relativeY - (relativeY - this.panY) * (this.zoomLevel / (level / 1.2 || 1));
        
        this.updateCanvasTransform();
        this.updateZoomIndicator();
    }
    
    resetView() {
        this.zoomLevel = 1;
        this.panX = 0;
        this.panY = 0;
        this.updateCanvasTransform();
        this.updateZoomIndicator();
    }
    
    updateCanvasTransform() {
        if (!this.canvasContent) return;
        
        this.canvasContent.style.transform = `translate(${this.panX}px, ${this.panY}px) scale(${this.zoomLevel})`;
    }
    
    updateZoomIndicator() {
        const indicator = document.getElementById('zoomLevel');
        if (indicator) {
            indicator.textContent = `${Math.round(this.zoomLevel * 100)}%`;
        }
    }
    
    // Orb Navigation Setup
    setupOrbNavigation() {
        const orbs = document.querySelectorAll('.nav-orb');
        const hubCenter = document.getElementById('hubCenter');
        
        orbs.forEach(orb => {
            orb.addEventListener('click', (e) => {
                e.preventDefault();
                const section = orb.getAttribute('data-section');
                this.navigateToSection(section);
            });
        });
        
        if (hubCenter) {
            hubCenter.addEventListener('click', () => {
                this.resetView();
                this.showAllSections();
            });
        }
    }
    
    navigateToSection(sectionName) {
        // Hide all sections
        const sections = document.querySelectorAll('.content-section');
        sections.forEach(section => {
            section.classList.remove('active', 'focus');
        });
        
        // Show target section
        const targetSection = document.getElementById(sectionName);
        if (targetSection) {
            targetSection.classList.add('active', 'focus');
            
            // Calculate position to center the section
            const rect = targetSection.getBoundingClientRect();
            const canvasRect = this.canvas.getBoundingClientRect();
            
            const targetX = -(rect.left - canvasRect.left) + (window.innerWidth / 2) - (rect.width / 2);
            const targetY = -(rect.top - canvasRect.top) + (window.innerHeight / 2) - (rect.height / 2);
            
            // Animate to section
            this.animateToPosition(targetX, targetY, 1.5);
            this.currentSection = sectionName;
            
            this.showToast(`Navigating to ${sectionName.charAt(0).toUpperCase() + sectionName.slice(1)}`, 'info');
        }
    }
    
    showAllSections() {
        const sections = document.querySelectorAll('.content-section');
        sections.forEach(section => {
            section.classList.add('active');
            section.classList.remove('focus');
        });
    }
    
    animateToPosition(targetX, targetY, targetZoom = 1) {
        const startX = this.panX;
        const startY = this.panY;
        const startZoom = this.zoomLevel;
        
        const duration = 1000;
        const startTime = performance.now();
        
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            
            this.panX = startX + (targetX - startX) * easeProgress;
            this.panY = startY + (targetY - startY) * easeProgress;
            this.zoomLevel = startZoom + (targetZoom - startZoom) * easeProgress;
            
            this.updateCanvasTransform();
            this.updateZoomIndicator();
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    }
    
    // Tab Navigation using Bootstrap patterns
    setupTabNavigation() {
        const tabButtons = document.querySelectorAll('.tab-button');
        const tabContents = document.querySelectorAll('.tab-content');
        
        tabButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const targetTab = button.getAttribute('data-tab');
                
                // Use Bootstrap-like tab switching
                this.switchTab(targetTab, button, tabButtons, tabContents);
            });
        });
    }
    
    switchTab(targetTab, activeButton, allButtons, allContents) {
        // Remove active classes
        allButtons.forEach(btn => btn.classList.remove('active'));
        allContents.forEach(content => content.classList.remove('active'));
        
        // Add active classes with animation
        activeButton.classList.add('active');
        const targetContent = document.getElementById(targetTab);
        if (targetContent) {
            targetContent.classList.add('active');
            
            // Add AOS animation if available
            if (typeof AOS !== 'undefined') {
                AOS.refresh();
            }
        }
        
        this.currentTab = targetTab;
        
        // Smooth scroll to content
        targetContent?.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
        });
    }
    
    // Search Functionality using lodash debounce
    setupSearchFunctionality() {
        this.createSearchInterface();
        this.setupSearchHandlers();
    }
    
    createSearchInterface() {
        const searchContainer = document.createElement('div');
        searchContainer.className = 'search-container';
        searchContainer.innerHTML = `
            <div class="input-group">
                <span class="input-group-text">
                    <i class="fas fa-search"></i>
                </span>
                <input type="text" class="form-control search-input" 
                       placeholder="Search agenda..." 
                       data-bs-toggle="tooltip" 
                       data-bs-placement="bottom" 
                       title="Search through agenda content (Ctrl+F)">
            </div>
        `;
        
        searchContainer.style.cssText = `
            position: fixed;
            top: 20px;
            left: 20px;
            z-index: 1000;
            max-width: 300px;
        `;
        
        this.searchInput = searchContainer.querySelector('.search-input');
        document.body.appendChild(searchContainer);
    }
    
    setupSearchHandlers() {
        // Use lodash debounce for better performance
        const debouncedSearch = typeof _ !== 'undefined' 
            ? _.debounce(this.searchAgenda.bind(this), AppConfig.searchDebounceDelay)
            : this.searchAgenda.bind(this);
            
        this.searchInput.addEventListener('input', (e) => {
            debouncedSearch(e.target.value.toLowerCase());
        });
        
        // Clear search on escape
        this.searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                e.target.value = '';
                this.clearSearch();
            }
        });
    }
    
    searchAgenda(searchTerm) {
        const searchableElements = document.querySelectorAll('.time-slot, .section, .detail-item');
        let matchCount = 0;
        
        searchableElements.forEach(element => {
            const text = element.textContent.toLowerCase();
            const parent = element.closest('.time-slot, .section');
            const hasMatch = text.includes(searchTerm);
            
            if (hasMatch) {
                matchCount++;
                element.classList.add('search-highlight');
                if (parent) parent.style.display = 'block';
            } else {
                element.classList.remove('search-highlight');
                if (searchTerm && parent) {
                    parent.style.display = 'none';
                } else {
                    parent.style.display = 'block';
                }
            }
        });
        
        // Show search results count
        if (searchTerm) {
            this.showSearchResults(matchCount);
        } else {
            this.clearSearch();
        }
    }
    
    clearSearch() {
        const highlightedElements = document.querySelectorAll('.search-highlight');
        highlightedElements.forEach(element => {
            element.classList.remove('search-highlight');
            const parent = element.closest('.time-slot, .section');
            if (parent) parent.style.display = 'block';
        });
    }
    
    showSearchResults(count) {
        // Use Bootstrap toast for search results
        if (typeof bootstrap !== 'undefined') {
            this.showToast(`${count} results found`, 'info');
        }
    }
    
    // Setup attendee features (favorites, notes, materials)
    setupAttendeeFeatures() {
        this.setupFavorites();
        this.setupNotes();
        this.setupMaterialDownloads();
        this.setupMySchedule();
    }
    
    setupFavorites() {
        const favoriteButtons = document.querySelectorAll('.favorite-btn');
        
        favoriteButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const timeSlot = e.target.closest('.time-slot');
                const sessionTitle = timeSlot.querySelector('h3').textContent;
                
                if (button.classList.contains('favorited')) {
                    this.removeFromFavorites(sessionTitle, button);
                } else {
                    this.addToFavorites(sessionTitle, timeSlot, button);
                }
            });
        });
    }
    
    addToFavorites(sessionTitle, timeSlot, button) {
        this.favorites.add(sessionTitle);
        button.classList.add('favorited');
        this.saveFavorites();
        this.showToast(`${sessionTitle} added to your schedule!`, 'success');
    }
    
    removeFromFavorites(sessionTitle, button) {
        this.favorites.delete(sessionTitle);
        button.classList.remove('favorited');
        this.saveFavorites();
        this.showToast(`${sessionTitle} removed from your schedule`, 'info');
    }
    
    setupNotes() {
        const notesButtons = document.querySelectorAll('.notes-btn');
        
        notesButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const timeSlot = e.target.closest('.time-slot');
                const notesSection = timeSlot.querySelector('.session-notes');
                
                if (notesSection.style.display === 'none') {
                    notesSection.style.display = 'block';
                    button.style.background = 'var(--aes-green)';
                    button.style.color = 'white';
                } else {
                    notesSection.style.display = 'none';
                    button.style.background = 'transparent';
                    button.style.color = 'var(--aes-blue)';
                }
            });
        });
        
        // Setup save notes functionality
        const saveButtons = document.querySelectorAll('.save-notes-btn');
        saveButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const timeSlot = e.target.closest('.time-slot');
                const textarea = timeSlot.querySelector('.session-notes textarea');
                const sessionTitle = timeSlot.querySelector('h3').textContent;
                
                this.saveSessionNotes(sessionTitle, textarea.value);
                
                // Show confirmation
                const originalText = button.textContent;
                button.textContent = 'Saved!';
                button.style.background = 'var(--aes-green)';
                setTimeout(() => {
                    button.textContent = originalText;
                    button.style.background = 'var(--aes-dark-blue)';
                }, 2000);
            });
        });
    }
    
    saveSessionNotes(sessionTitle, notes) {
        this.notes.set(sessionTitle, notes);
        this.saveNotes();
    }
    
    setupMaterialDownloads() {
        const materialLinks = document.querySelectorAll('.material-link');
        
        materialLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const fileName = link.textContent.trim();
                
                // Simulate download with animation
                const originalText = link.innerHTML;
                link.innerHTML = '<i class="fas fa-download"></i> Downloading...';
                link.style.color = 'var(--aes-green)';
                
                setTimeout(() => {
                    link.innerHTML = originalText;
                    link.style.color = 'var(--aes-blue)';
                    this.showToast(`${fileName} downloaded successfully!`, 'success');
                }, 1500);
            });
        });
    }
    
    setupMySchedule() {
        // Create my schedule section
        const overviewTab = document.getElementById('overview');
        if (overviewTab && !document.querySelector('.my-schedule')) {
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
    }
    
    loadPersistedData() {
        this.loadNotes();
        this.loadFavorites();
    }
    
    // Modern notification system using Bootstrap toasts
    showToast(message, type = 'success') {
        if (typeof bootstrap !== 'undefined') {
            this.createBootstrapToast(message, type);
        } else {
            this.showFallbackNotification(message);
        }
    }
    
    createBootstrapToast(message, type) {
        const toastContainer = this.getOrCreateToastContainer();
        
        const toastId = `toast-${Date.now()}`;
        const toastHtml = `
            <div class="toast" id="${toastId}" role="alert" aria-live="assertive" aria-atomic="true">
                <div class="toast-header bg-${type} text-white">
                    <i class="fas fa-${this.getToastIcon(type)} me-2"></i>
                    <strong class="me-auto">Conference Agenda</strong>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast"></button>
                </div>
                <div class="toast-body">
                    ${message}
                </div>
            </div>
        `;
        
        toastContainer.insertAdjacentHTML('beforeend', toastHtml);
        
        const toastElement = document.getElementById(toastId);
        const toast = new bootstrap.Toast(toastElement, {
            autohide: true,
            delay: AppConfig.notificationDuration
        });
        
        toast.show();
        
        // Clean up after toast is hidden
        toastElement.addEventListener('hidden.bs.toast', () => {
            toastElement.remove();
        });
    }
    
    getOrCreateToastContainer() {
        let container = document.querySelector('.toast-container');
        if (!container) {
            container = document.createElement('div');
            container.className = 'toast-container position-fixed top-0 end-0 p-3';
            container.style.zIndex = '1055';
            document.body.appendChild(container);
        }
        return container;
    }
    
    getToastIcon(type) {
        const icons = {
            success: 'check-circle',
            error: 'exclamation-circle',
            warning: 'exclamation-triangle',
            info: 'info-circle'
        };
        return icons[type] || 'info-circle';
    }
    
    showFallbackNotification(message) {
        // Fallback for when Bootstrap is not available
        const notification = document.createElement('div');
        notification.className = 'alert alert-success alert-dismissible fade show';
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 1055;
            min-width: 300px;
        `;
        notification.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, AppConfig.notificationDuration);
    }
    
    showError(message) {
        this.showToast(message, 'error');
    }
    
    showWelcomeMessage() {
        setTimeout(() => {
            this.showToast('Welcome to the 2025 Fall Leadership Conference Agenda!', 'info');
        }, 1000);
    }
    
    // Setup animations using AOS library
    setupAnimations() {
        // Add AOS attributes to elements
        const animateElements = document.querySelectorAll('.section, .time-slot, .day-summary');
        animateElements.forEach((element, index) => {
            element.setAttribute('data-aos', 'fade-up');
            element.setAttribute('data-aos-delay', (index * 50).toString());
        });
        
        // Refresh AOS if available
        if (typeof AOS !== 'undefined') {
            AOS.refresh();
        }
    }
    
    // Setup keyboard shortcuts
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch(e.key) {
                    case '1':
                        e.preventDefault();
                        this.navigateToSection('overview');
                        break;
                    case '2':
                        e.preventDefault();
                        this.navigateToSection('wednesday');
                        break;
                    case '3':
                        e.preventDefault();
                        this.navigateToSection('thursday');
                        break;
                    case '4':
                        e.preventDefault();
                        this.navigateToSection('friday');
                        break;
                    case 'f':
                        e.preventDefault();
                        this.searchInput?.focus();
                        break;
                    case '0':
                        e.preventDefault();
                        this.resetView();
                        this.showAllSections();
                        break;
                }
            }
            
            // Arrow keys for navigation
            switch(e.key) {
                case 'ArrowUp':
                    e.preventDefault();
                    this.zoomTo(this.zoomLevel * 1.1);
                    break;
                case 'ArrowDown':
                    e.preventDefault();
                    this.zoomTo(this.zoomLevel * 0.9);
                    break;
                case 'Escape':
                    this.resetView();
                    this.showAllSections();
                    break;
            }
        });
    }
    
    // Setup responsive features
    setupResponsiveFeatures() {
        window.addEventListener('resize', () => {
            // Refresh AOS on resize
            if (typeof AOS !== 'undefined') {
                AOS.refresh();
            }
        });
    }
    
    // Load and save data methods
    loadNotes() {
        try {
            const savedNotes = localStorage.getItem(AppConfig.localStorageKeys.notes);
            if (savedNotes) {
                this.notes = new Map(Object.entries(JSON.parse(savedNotes)));
            }
        } catch (error) {
            console.error('Failed to load notes:', error);
        }
    }
    
    loadFavorites() {
        try {
            const savedFavorites = localStorage.getItem(AppConfig.localStorageKeys.favorites);
            if (savedFavorites) {
                this.favorites = new Set(JSON.parse(savedFavorites));
            }
        } catch (error) {
            console.error('Failed to load favorites:', error);
        }
    }
    
    saveNotes() {
        try {
            const notesObj = Object.fromEntries(this.notes);
            localStorage.setItem(AppConfig.localStorageKeys.notes, JSON.stringify(notesObj));
        } catch (error) {
            console.error('Failed to save notes:', error);
        }
    }
    
    saveFavorites() {
        try {
            localStorage.setItem(AppConfig.localStorageKeys.favorites, JSON.stringify([...this.favorites]));
        } catch (error) {
            console.error('Failed to save favorites:', error);
        }
    }
}

// Initialize the Prezi-style application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.preziApp = new PreziConferenceApp();
});

// Add CSS for search highlighting
const style = document.createElement('style');
style.textContent = `
    .search-highlight {
        background: rgba(0, 173, 220, 0.1) !important;
        border-left: 4px solid var(--aes-blue) !important;
    }
`;
document.head.appendChild(style);