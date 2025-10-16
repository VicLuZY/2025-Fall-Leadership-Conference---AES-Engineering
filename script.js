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

// Session data for modal content
const SessionData = {
    checkin: {
        title: "Check-in & Welcome",
        time: "11:00 AM - Wednesday",
        details: `
            <p><strong>Purpose:</strong> Welcome and registration for all conference participants</p>
            <p><strong>Activities:</strong> Badge pickup, conference materials distribution, networking with colleagues</p>
            <p><strong>Duration:</strong> 30 minutes</p>
            <h4>Materials Available:</h4>
            <ul>
                <li>Conference Welcome Packet</li>
                <li>Hotel Map & Facilities Guide</li>
                <li>Name badges and lanyards</li>
            </ul>
        `
    },
    introductions: {
        title: "Introductions & Working Lunch",
        time: "11:30 AM - Wednesday",
        details: `
            <p><strong>Purpose:</strong> Facilitate team introductions and build relationships while enjoying lunch</p>
            <p><strong>Activities:</strong> Personal introductions, icebreaker activities, discussion of conference objectives</p>
            <p><strong>Format:</strong> Casual networking with guided introductions</p>
            <h4>Key Objectives:</h4>
            <ul>
                <li>Break the ice and create comfortable atmosphere</li>
                <li>Establish connections between team members</li>
                <li>Set expectations for the conference</li>
                <li>Begin building trust and rapport</li>
            </ul>
        `
    },
    financials: {
        title: "Financial Review & Analysis",
        time: "1:00 PM - Wednesday",
        details: `
            <h4>1. Factual Financial Review</h4>
            <p><strong>Objective:</strong> Create transparency and accountability around financial performance</p>
            <p><strong>Format:</strong> Open dialogue and Q&A session about current financial status</p>
            <p><strong>Outcome:</strong> Increased awareness and ownership of financial metrics across all leadership levels</p>
            
            <h4>2. Review Overall Company Performance</h4>
            <p><strong>Scope:</strong> Comprehensive analysis of company-wide financial performance</p>
            <p><strong>Breakdown:</strong> Individual office performance metrics and comparative analysis</p>
            <p><strong>Focus:</strong> Identifying trends, strengths, and areas for improvement</p>
            
            <h4>3. Forward Looking Tools</h4>
            <p><strong>Tools Covered:</strong> Revenue forecasting models, cash flow projections, P&L analysis</p>
            <p><strong>Pipeline Review:</strong> Current and projected business opportunities</p>
            <p><strong>Purpose:</strong> Strategic planning and resource allocation for future growth</p>
            
            <h4>4. Shareholder Ownership</h4>
            <p><strong>Review:</strong> Current shareholder structure and ownership percentages</p>
            <p><strong>Discussion:</strong> New shareholder opportunities and existing shareholder updates</p>
            <p><strong>Financial Impact:</strong> Overall earnings distribution and shareholder value creation</p>
        `
    },
    "personal-time-wed": {
        title: "Personal Time",
        time: "5:15 PM - Wednesday",
        details: `
            <p><strong>Purpose:</strong> Free time for participants to rest, network, or explore</p>
            <h4>Suggested Activities:</h4>
            <ul>
                <li>Rest and recharge for evening activities</li>
                <li>Explore Victoria's historic downtown</li>
                <li>Network with colleagues informally</li>
                <li>Prepare for team dinner</li>
            </ul>
            <p><em>This time is yours to use as you see fit to maximize your conference experience.</em></p>
        `
    },
    "dinner-wed": {
        title: "Team Dinner",
        time: "6:30 PM - Wednesday",
        details: `
            <p><strong>Location:</strong> Vis-a-vis Restaurant</p>
            <p><strong>Purpose:</strong> Team building and relationship strengthening through shared dining experience</p>
            <h4>Objectives:</h4>
            <ul>
                <li>Continue building relationships in relaxed setting</li>
                <li>Discuss first day experiences and insights</li>
                <li>Prepare for main conference sessions tomorrow</li>
                <li>Enjoy Victoria's culinary offerings</li>
            </ul>
            <p><strong>Transportation:</strong> Group coordination from hotel</p>
        `
    },
    "breakfast-thu": {
        title: "Breakfast",
        time: "7:15 AM - Thursday",
        details: `
            <p><strong>Location:</strong> Palos Verdes Terrace</p>
            <p><strong>Purpose:</strong> Morning meal to start the main conference day</p>
            <h4>Pre-Session Preparation:</h4>
            <ul>
                <li>Fuel up for intensive morning session</li>
                <li>Review materials and prepare questions</li>
                <li>Connect with colleagues before main activities</li>
                <li>Set intentions for the day</li>
            </ul>
        `
    },
    "main-session": {
        title: "FLC 2025 Main Session",
        time: "8:00 AM - 12:00 PM - Thursday",
        details: `
            <h4>1. Team Review of 5 Dysfunctions</h4>
            <p><strong>Framework:</strong> Based on Patrick Lencioni's "Five Dysfunctions of a Team" model</p>
            <p><strong>Purpose:</strong> Assess team effectiveness and identify areas for improvement</p>
            
            <h5>The Five Dysfunctions Framework:</h5>
            <ul>
                <li><strong>Absence of Trust:</strong> Team members don't feel comfortable being vulnerable</li>
                <li><strong>Fear of Conflict:</strong> Avoiding productive conflict leads to artificial harmony</li>
                <li><strong>Lack of Commitment:</strong> Without buy-in, team members don't commit to decisions</li>
                <li><strong>Avoidance of Accountability:</strong> Team members avoid calling out poor performance</li>
                <li><strong>Inattention to Results:</strong> Team members focus on individual goals over team success</li>
            </ul>
            
            <h4>2. Team Trust Building</h4>
            <p><strong>Purpose:</strong> Strengthen interpersonal relationships and psychological safety within the team</p>
            <p><strong>Activities:</strong> Trust-building exercises, vulnerability-based leadership discussions, team bonding activities</p>
            
            <h4>3. Rockefeller Habits Book Review</h4>
            <p><strong>Framework:</strong> Based on Verne Harnish's "Scaling Up" methodology for business growth</p>
            <p><strong>Purpose:</strong> Develop a clear 1-year strategic plan and establish organizational themes</p>
            
            <h5>Key Concepts:</h5>
            <ul>
                <li><strong>Priorities:</strong> Focus on the One Page Strategic Plan (OPSP)</li>
                <li><strong>Data:</strong> Establish key performance indicators (KPIs)</li>
                <li><strong>Rhythm:</strong> Implement consistent meeting cadence</li>
            </ul>
            
            <h5>OPSP (One Page Strategic Plan):</h5>
            <ul>
                <li>Create single-page strategic document that aligns entire organization</li>
                <li>Cascade implementation from corporate to office to Practice Area level</li>
                <li>Ensure all levels aligned with corporate objectives</li>
            </ul>
        `
    },
    "lunch-thu": {
        title: "Lunch Break",
        time: "12:00 PM - Thursday",
        details: `
            <p><strong>Purpose:</strong> Midday meal and networking opportunity</p>
            <h4>Activities During Lunch:</h4>
            <ul>
                <li>Reflect on morning session insights</li>
                <li>Discuss key takeaways with colleagues</li>
                <li>Prepare questions for afternoon session</li>
                <li>Network and build relationships</li>
            </ul>
        `
    },
    "commitments-review": {
        title: "Review Commitments & Initiatives",
        time: "12:45 PM - Thursday",
        details: `
            <p><strong>Scope:</strong> Comprehensive review of commitments made during Spring Leadership Conference 2025</p>
            
            <h4>a. Performance Assessment: How did we do?</h4>
            <p><strong>Purpose:</strong> Evaluate overall performance against commitments and goals</p>
            <p><strong>Method:</strong> Data-driven analysis of progress metrics and qualitative feedback</p>
            
            <h4>b. Deliverables Review: What has been delivered?</h4>
            <p><strong>Focus:</strong> Document and celebrate completed initiatives and milestones</p>
            <p><strong>Recognition:</strong> Acknowledge teams and individuals who delivered on commitments</p>
            
            <h4>c. Gap Analysis: What hasn't been delivered?</h4>
            <p><strong>Purpose:</strong> Identify and analyze unmet commitments or delayed initiatives</p>
            <p><strong>Action Planning:</strong> Develop strategies to address gaps and prevent future delays</p>
            
            <h4>d. Accountability Framework: Short vs Long Term Goals</h4>
            <p><strong>Reality Check:</strong> Honest discussion about aspirational vs achievable goals</p>
            <p><strong>Accountability:</strong> Establish clear ownership for future commitments</p>
            
            <h4>e. Learning and Adaptation: What are we learning?</h4>
            <p><strong>Focus:</strong> Extract key insights and lessons learned from the past period</p>
            <p><strong>Future Application:</strong> Apply learnings to improve future planning and execution</p>
        `
    },
    "personal-time-thu": {
        title: "Personal Time",
        time: "2:30 PM - Thursday",
        details: `
            <p><strong>Purpose:</strong> Free time for participants before the team activity</p>
            <h4>Suggested Activities:</h4>
            <ul>
                <li>Rest and recharge after intensive sessions</li>
                <li>Prepare for team activity</li>
                <li>Network with colleagues</li>
                <li>Explore hotel amenities</li>
            </ul>
        `
    },
    "team-activity": {
        title: "Team Activity",
        time: "4:00 PM - Thursday",
        details: `
            <p><strong>Location:</strong> Meet in hotel lobby to travel into Victoria</p>
            <p><strong>Activity:</strong> Clue Solvers "After the Goldrush"</p>
            
            <h4>Team Building Experience</h4>
            <p><strong>Purpose:</strong> Strengthen team bonds through collaborative problem-solving</p>
            <p><strong>Format:</strong> Interactive mystery-solving adventure set in Victoria's historic context</p>
            <p><strong>Benefits:</strong> Develop communication, critical thinking, and teamwork skills in a fun, engaging environment</p>
            <p><strong>Theme:</strong> "After the Goldrush" - explores Victoria's rich history while challenging teams to work together</p>
            
            <h4>Learning Objectives:</h4>
            <ul>
                <li>Practice collaborative problem-solving</li>
                <li>Develop communication skills under pressure</li>
                <li>Build trust through shared challenges</li>
                <li>Learn about Victoria's history and culture</li>
            </ul>
        `
    },
    "dinner-thu": {
        title: "Team Dinner",
        time: "6:30 PM - Thursday",
        details: `
            <p><strong>Location:</strong> Bard and Banker Restaurant</p>
            <p><strong>Purpose:</strong> Group dinner following the team activity</p>
            
            <h4>Objectives:</h4>
            <ul>
                <li>Debrief on team activity experience</li>
                <li>Share insights and learnings from the day</li>
                <li>Continue relationship building</li>
                <li>Prepare for final day of conference</li>
            </ul>
            
            <p><strong>Note:</strong> Meet at the restaurant after the activity</p>
        `
    },
    "breakfast-fri": {
        title: "Breakfast",
        time: "7:15 AM - Friday",
        details: `
            <p><strong>Purpose:</strong> Morning meal to start the final conference day</p>
            <h4>Final Day Preparation:</h4>
            <ul>
                <li>Fuel up for strategic planning session</li>
                <li>Review insights from previous days</li>
                <li>Prepare for priority setting discussions</li>
                <li>Connect with colleagues before intensive planning</li>
            </ul>
        `
    },
    "strategic-planning": {
        title: "Strategic Planning Session",
        time: "8:00 AM - 12:00 PM - Friday",
        details: `
            <h4>1. Priority Setting: Top 5 and Top 1 of 5 Priorities for 2026</h4>
            <p><strong>Purpose:</strong> Establish clear strategic focus for the upcoming year</p>
            <p><strong>Process:</strong> Collaborative discussion to identify and prioritize the most critical initiatives</p>
            <p><strong>Outcome:</strong> Consensus on the top 5 strategic priorities, with clear identification of the #1 priority</p>
            
            <h5>Focus Areas:</h5>
            <ul>
                <li>Revenue growth and market expansion</li>
                <li>Operational excellence and efficiency</li>
                <li>Innovation and technology advancement</li>
                <li>Talent development and retention</li>
                <li>Client satisfaction and service delivery</li>
            </ul>
            
            <h4>2. Action Planning: Q1 2026 and Q2 2026 Actions</h4>
            <p><strong>Purpose:</strong> Translate strategic priorities into specific, actionable initiatives</p>
            <p><strong>Process:</strong> Break down annual priorities into quarterly milestones and specific actions</p>
            <p><strong>Ownership:</strong> Assign clear accountability for each action item and establish success metrics</p>
            <p><strong>Timeline:</strong> Create detailed implementation schedules for the first two quarters of 2026</p>
        `
    },
    "lunch-fri": {
        title: "Lunch Break",
        time: "12:00 PM - Friday",
        details: `
            <p><strong>Purpose:</strong> Final lunch together before the closing session</p>
            <h4>Pre-Closing Activities:</h4>
            <ul>
                <li>Reflect on strategic planning outcomes</li>
                <li>Discuss implementation strategies</li>
                <li>Prepare for final session</li>
                <li>Celebrate conference achievements</li>
            </ul>
        `
    },
    "final-session": {
        title: "Final Session",
        time: "12:45 PM - Friday",
        details: `
            <h4>1. Leadership Effectiveness: Doing the Right Things</h4>
            <p><strong>Purpose:</strong> Optimize leadership focus and effectiveness across all Practice Areas</p>
            <p><strong>Process:</strong> Individual self-evaluation of current activities against ideal and required activities</p>
            <p><strong>Analysis:</strong> Compare current time allocation with strategic priorities and goals</p>
            <p><strong>Action Planning:</strong> Identify specific changes needed to align activities with objectives</p>
            
            <h4>2. Organizational Theme Setting</h4>
            <p><strong>Purpose:</strong> Establish a unifying theme that will guide the organization for the next 6 months</p>
            <p><strong>Process:</strong> Collaborative discussion to identify a theme that captures the organization's focus and energy</p>
            <p><strong>Criteria:</strong> Theme should be memorable, inspiring, and actionable across all levels</p>
            <p><strong>Implementation:</strong> Develop communication strategy to cascade the theme throughout the organization</p>
            
            <h5>Example Themes:</h5>
            <ul>
                <li>"Excellence in Action"</li>
                <li>"Growth Through Innovation"</li>
                <li>"Building Bridges"</li>
                <li>"Collaborative Excellence"</li>
            </ul>
        `
    },
    "conference-close": {
        title: "Conference Close & Departure",
        time: "2:30 PM - Friday",
        details: `
            <p><strong>END OF FLC</strong></p>
            <h4>Conference Wrap-up:</h4>
            <ul>
                <li>Final reflections and key takeaways</li>
                <li>Next steps and follow-up actions</li>
                <li>Contact exchange and networking</li>
                <li>Thank you and safe travels</li>
            </ul>
            
            <h4>Post-Conference Actions:</h4>
            <ul>
                <li>Implement agreed-upon strategies</li>
                <li>Follow up on commitments made</li>
                <li>Share insights with teams back home</li>
                <li>Prepare for next leadership conference</li>
            </ul>
            
            <p><strong>Thank you for participating in the 2025 Fall Leadership Conference!</strong></p>
        `
    }
};

// Main application class using modern ES6+ features
class ConferenceApp {
    constructor() {
        this.searchInput = null;
        this.favorites = new Set();
        this.notes = new Map();
        this.currentModal = null;
        
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
        this.setupFlashcardInteractions();
        this.setupSearchFunctionality();
        this.setupModalControls();
        this.setupKeyboardShortcuts();
        this.setupResponsiveFeatures();
    }
    
    // Setup flashcard click interactions
    setupFlashcardInteractions() {
        const flashcards = document.querySelectorAll('.flashcard');
        
        flashcards.forEach(card => {
            // Main card click opens modal
            card.addEventListener('click', (e) => {
                // Don't open modal if clicking on action buttons
                if (e.target.closest('.flashcard-actions')) {
                    return;
                }
                
                const sessionId = card.getAttribute('data-session');
                this.openModal(sessionId);
            });
            
            // Setup action buttons
            this.setupFlashcardActions(card);
        });
    }
    
    setupFlashcardActions(card) {
        const favoriteBtn = card.querySelector('.favorite-btn');
        const notesBtn = card.querySelector('.notes-btn');
        
        if (favoriteBtn) {
            favoriteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleFavorite(card);
            });
        }
        
        if (notesBtn) {
            notesBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.openNotesModal(card);
            });
        }
    }
    
    toggleFavorite(card) {
        const sessionId = card.getAttribute('data-session');
        const favoriteBtn = card.querySelector('.favorite-btn');
        
        if (this.favorites.has(sessionId)) {
            this.favorites.delete(sessionId);
            favoriteBtn.classList.remove('favorited');
            this.showToast(`${SessionData[sessionId]?.title || 'Session'} removed from favorites`, 'info');
        } else {
            this.favorites.add(sessionId);
            favoriteBtn.classList.add('favorited');
            this.showToast(`${SessionData[sessionId]?.title || 'Session'} added to favorites`, 'success');
        }
        
        this.saveFavorites();
    }
    
    openNotesModal(card) {
        const sessionId = card.getAttribute('data-session');
        const sessionTitle = SessionData[sessionId]?.title || 'Session';
        const existingNotes = this.notes.get(sessionId) || '';
        
        // Create a simple notes modal
        const notesModal = document.createElement('div');
        notesModal.className = 'modal-overlay active';
        notesModal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Notes - ${sessionTitle}</h2>
                    <button class="modal-close">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <textarea id="notesTextarea" placeholder="Add your notes for this session..." style="width: 100%; height: 200px; padding: 1rem; border: 2px solid #e9ecef; border-radius: 8px; font-family: inherit; resize: vertical;">${existingNotes}</textarea>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-primary" id="saveNotes">
                        <i class="fas fa-save"></i> Save Notes
                    </button>
                    <button class="btn btn-secondary" id="cancelNotes">
                        <i class="fas fa-times"></i> Cancel
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(notesModal);
        
        // Setup event listeners
        notesModal.querySelector('.modal-close').addEventListener('click', () => {
            notesModal.remove();
        });
        
        notesModal.querySelector('#cancelNotes').addEventListener('click', () => {
            notesModal.remove();
        });
        
        notesModal.querySelector('#saveNotes').addEventListener('click', () => {
            const notes = notesModal.querySelector('#notesTextarea').value;
            this.notes.set(sessionId, notes);
            this.saveNotes();
            notesModal.remove();
            this.showToast('Notes saved successfully!', 'success');
        });
        
        // Close on overlay click
        notesModal.addEventListener('click', (e) => {
            if (e.target === notesModal) {
                notesModal.remove();
            }
        });
    }
    
    // Setup modal controls
    setupModalControls() {
        const modal = document.getElementById('detailModal');
        const modalClose = document.getElementById('modalClose');
        const modalFavorite = document.getElementById('modalFavorite');
        const modalNotes = document.getElementById('modalNotes');
        
        if (modalClose) {
            modalClose.addEventListener('click', () => this.closeModal());
        }
        
        if (modalFavorite) {
            modalFavorite.addEventListener('click', () => {
                if (this.currentModal) {
                    this.toggleFavoriteFromModal(this.currentModal);
                }
            });
        }
        
        if (modalNotes) {
            modalNotes.addEventListener('click', () => {
                if (this.currentModal) {
                    this.openNotesFromModal(this.currentModal);
                }
            });
        }
        
        // Close modal on overlay click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeModal();
            }
        });
    }
    
    openModal(sessionId) {
        const sessionData = SessionData[sessionId];
        if (!sessionData) return;
        
        const modal = document.getElementById('detailModal');
        const modalTitle = document.getElementById('modalTitle');
        const modalBody = document.getElementById('modalBody');
        const modalFavorite = document.getElementById('modalFavorite');
        
        this.currentModal = sessionId;
        
        modalTitle.textContent = sessionData.title;
        modalBody.innerHTML = `
            <div style="margin-bottom: 1.5rem; padding: 1rem; background: #f8f9fa; border-radius: 8px; border-left: 4px solid var(--aes-blue);">
                <strong>${sessionData.time}</strong>
            </div>
            ${sessionData.details}
        `;
        
        // Update favorite button state
        const isFavorited = this.favorites.has(sessionId);
        const favoriteIcon = modalFavorite.querySelector('i');
        const favoriteText = modalFavorite.querySelector('span') || modalFavorite.childNodes[2];
        
        if (isFavorited) {
            favoriteIcon.className = 'fas fa-star';
            modalFavorite.innerHTML = '<i class="fas fa-star"></i> Remove from Favorites';
            modalFavorite.classList.add('favorited');
        } else {
            favoriteIcon.className = 'far fa-star';
            modalFavorite.innerHTML = '<i class="far fa-star"></i> Add to Favorites';
            modalFavorite.classList.remove('favorited');
        }
        
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    closeModal() {
        const modal = document.getElementById('detailModal');
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
        this.currentModal = null;
    }
    
    toggleFavoriteFromModal(sessionId) {
        const modalFavorite = document.getElementById('modalFavorite');
        const isFavorited = this.favorites.has(sessionId);
        
        if (isFavorited) {
            this.favorites.delete(sessionId);
            modalFavorite.innerHTML = '<i class="far fa-star"></i> Add to Favorites';
            modalFavorite.classList.remove('favorited');
            this.showToast(`${SessionData[sessionId]?.title || 'Session'} removed from favorites`, 'info');
        } else {
            this.favorites.add(sessionId);
            modalFavorite.innerHTML = '<i class="fas fa-star"></i> Remove from Favorites';
            modalFavorite.classList.add('favorited');
            this.showToast(`${SessionData[sessionId]?.title || 'Session'} added to favorites`, 'success');
        }
        
        this.saveFavorites();
        
        // Update the corresponding flashcard
        const flashcard = document.querySelector(`[data-session="${sessionId}"]`);
        if (flashcard) {
            const favoriteBtn = flashcard.querySelector('.favorite-btn');
            if (favoriteBtn) {
                favoriteBtn.classList.toggle('favorited', this.favorites.has(sessionId));
            }
        }
    }
    
    openNotesFromModal(sessionId) {
        const sessionTitle = SessionData[sessionId]?.title || 'Session';
        const existingNotes = this.notes.get(sessionId) || '';
        
        // Create a simple notes modal
        const notesModal = document.createElement('div');
        notesModal.className = 'modal-overlay active';
        notesModal.style.zIndex = '1001';
        notesModal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Notes - ${sessionTitle}</h2>
                    <button class="modal-close">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <textarea id="notesTextarea" placeholder="Add your notes for this session..." style="width: 100%; height: 200px; padding: 1rem; border: 2px solid #e9ecef; border-radius: 8px; font-family: inherit; resize: vertical;">${existingNotes}</textarea>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-primary" id="saveNotes">
                        <i class="fas fa-save"></i> Save Notes
                    </button>
                    <button class="btn btn-secondary" id="cancelNotes">
                        <i class="fas fa-times"></i> Cancel
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(notesModal);
        
        // Setup event listeners
        notesModal.querySelector('.modal-close').addEventListener('click', () => {
            notesModal.remove();
        });
        
        notesModal.querySelector('#cancelNotes').addEventListener('click', () => {
            notesModal.remove();
        });
        
        notesModal.querySelector('#saveNotes').addEventListener('click', () => {
            const notes = notesModal.querySelector('#notesTextarea').value;
            this.notes.set(sessionId, notes);
            this.saveNotes();
            notesModal.remove();
            this.showToast('Notes saved successfully!', 'success');
        });
        
        // Close on overlay click
        notesModal.addEventListener('click', (e) => {
            if (e.target === notesModal) {
                notesModal.remove();
            }
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
        const searchableElements = document.querySelectorAll('.flashcard');
        let matchCount = 0;
        
        searchableElements.forEach(card => {
            const text = card.textContent.toLowerCase();
            const hasMatch = text.includes(searchTerm);
            
            if (hasMatch) {
                matchCount++;
                card.classList.add('search-highlight');
                card.style.display = 'block';
            } else {
                card.classList.remove('search-highlight');
                if (searchTerm) {
                    card.style.display = 'none';
                } else {
                    card.style.display = 'block';
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
            element.style.display = 'block';
        });
    }
    
    showSearchResults(count) {
        // Use Bootstrap toast for search results
        if (typeof bootstrap !== 'undefined') {
            this.showToast(`${count} sessions found`, 'info');
        }
    }
    
    // Setup animations using AOS library
    setupAnimations() {
        // Add AOS attributes to elements
        const animateElements = document.querySelectorAll('.flashcard, .info-card');
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
                    case 'f':
                        e.preventDefault();
                        this.searchInput?.focus();
                        break;
                }
            }
            
            // Close modal on Escape
            if (e.key === 'Escape') {
                this.closeModal();
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
    
    // Load and save data methods
    loadPersistedData() {
        this.loadNotes();
        this.loadFavorites();
    }
    
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
                
                // Update UI to reflect saved favorites
                this.favorites.forEach(sessionId => {
                    const flashcard = document.querySelector(`[data-session="${sessionId}"]`);
                    if (flashcard) {
                        const favoriteBtn = flashcard.querySelector('.favorite-btn');
                        if (favoriteBtn) {
                            favoriteBtn.classList.add('favorited');
                        }
                    }
                });
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

// Initialize the application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.conferenceApp = new ConferenceApp();
});

// Add CSS for search highlighting
const style = document.createElement('style');
style.textContent = `
    .search-highlight {
        background: rgba(0, 173, 220, 0.1) !important;
        border-left: 4px solid var(--aes-blue) !important;
    }
    
    .modal-footer .btn.favorited {
        background: var(--aes-green) !important;
        color: white !important;
    }
`;
document.head.appendChild(style);