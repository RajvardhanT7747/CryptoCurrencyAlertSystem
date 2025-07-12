// Cryptocurrency Dashboard Interactive Features
class CryptoDashboard {
    constructor() {
        this.init();
        this.setupEventListeners();
        this.createParticles();
        this.startAutoRefresh();
    }

    init() {
        // Add animation classes to elements
        this.addAnimations();
        
        // Initialize tooltips and popovers
        this.initTooltips();
        
        // Setup real-time price updates
        this.setupPriceUpdates();
    }

    addAnimations() {
        // Add fade-in animation to cards
        const cards = document.querySelectorAll('.card');
        cards.forEach((card, index) => {
            const animationDelay = card.getAttribute('data-animation-delay') || `${index * 0.1}s`;
            card.style.animationDelay = animationDelay;
            card.classList.add('fade-in');
        });

        // Add slide-up animation to table rows
        const tableRows = document.querySelectorAll('tbody tr');
        tableRows.forEach((row, index) => {
            const animationDelay = row.getAttribute('data-animation-delay') || `${index * 0.05}s`;
            row.style.animationDelay = animationDelay;
            row.classList.add('slide-up');
        });
    }

    createParticles() {
        const particlesContainer = document.querySelector('.particles');
        if (!particlesContainer) return;

        for (let i = 0; i < 50; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 6 + 's';
            particle.style.animationDuration = (Math.random() * 3 + 3) + 's';
            particlesContainer.appendChild(particle);
        }
    }

    setupEventListeners() {
        // Form validation and enhancement
        this.setupFormValidation();
        
        // Button interactions
        this.setupButtonInteractions();
        
        // Table interactions
        this.setupTableInteractions();
        
        // Search functionality
        this.setupSearch();
    }

    setupFormValidation() {
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            form.addEventListener('submit', (e) => {
                this.showLoadingState(e.target);
            });
        });

        // Real-time form validation
        const inputs = document.querySelectorAll('.form-control');
        inputs.forEach(input => {
            input.addEventListener('input', (e) => {
                this.validateInput(e.target);
            });
            
            input.addEventListener('focus', (e) => {
                e.target.parentElement.classList.add('focused');
            });
            
            input.addEventListener('blur', (e) => {
                e.target.parentElement.classList.remove('focused');
            });
        });
    }

    validateInput(input) {
        const value = input.value.trim();
        const errorElement = input.parentElement.querySelector('.text-danger');
        
        if (input.type === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (value && !emailRegex.test(value)) {
                this.showError(input, 'Please enter a valid email address');
            } else {
                this.hideError(input);
            }
        }
        
        if (input.name === 'thresholdPrice') {
            if (value && (isNaN(value) || parseFloat(value) <= 0)) {
                this.showError(input, 'Please enter a valid positive number');
            } else {
                this.hideError(input);
            }
        }
    }

    showError(input, message) {
        let errorElement = input.parentElement.querySelector('.text-danger');
        if (!errorElement) {
            errorElement = document.createElement('small');
            errorElement.className = 'text-danger';
            input.parentElement.appendChild(errorElement);
        }
        errorElement.textContent = message;
        errorElement.style.display = 'block';
        input.classList.add('is-invalid');
    }

    hideError(input) {
        const errorElement = input.parentElement.querySelector('.text-danger');
        if (errorElement) {
            errorElement.style.display = 'none';
        }
        input.classList.remove('is-invalid');
    }

    setupButtonInteractions() {
        const buttons = document.querySelectorAll('.btn');
        buttons.forEach(button => {
            button.addEventListener('click', (e) => {
                this.addRippleEffect(e);
            });
        });
    }

    addRippleEffect(event) {
        const button = event.currentTarget;
        const ripple = document.createElement('span');
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');
        
        button.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

    setupTableInteractions() {
        const tableRows = document.querySelectorAll('tbody tr');
        tableRows.forEach(row => {
            row.addEventListener('click', (e) => {
                if (!e.target.closest('.btn')) {
                    this.highlightRow(row);
                }
            });
        });
    }

    highlightRow(row) {
        // Remove highlight from other rows
        document.querySelectorAll('tbody tr').forEach(r => {
            r.classList.remove('highlighted');
        });
        
        // Add highlight to clicked row
        row.classList.add('highlighted');
        
        // Show crypto details in a modal or sidebar
        this.showCryptoDetails(row);
    }

    showCryptoDetails(row) {
        const cryptoName = row.querySelector('td:first-child').textContent;
        const cryptoSymbol = row.querySelector('td:nth-child(2)').textContent;
        const cryptoPrice = row.querySelector('td:nth-child(3)').textContent;
        
        // Create a toast notification with crypto details
        this.showToast(`Selected: ${cryptoName} (${cryptoSymbol}) - ${cryptoPrice}`, 'info');
    }

    setupSearch() {
        const searchInput = document.querySelector('#searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.filterTable(e.target.value);
            });
        }
    }

    filterTable(searchTerm) {
        const tableRows = document.querySelectorAll('tbody tr');
        const searchLower = searchTerm.toLowerCase();
        
        tableRows.forEach(row => {
            const text = row.textContent.toLowerCase();
            if (text.includes(searchLower)) {
                row.style.display = '';
                row.classList.add('fade-in');
            } else {
                row.style.display = 'none';
            }
        });
    }

    setupPriceUpdates() {
        // Auto-refresh prices every 30 seconds
        setInterval(() => {
            this.updatePrices();
        }, 30000);
    }

    async updatePrices() {
        try {
            const response = await fetch('/update-prices', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            
            if (response.ok) {
                this.showToast('Prices updated successfully!', 'success');
                // Reload the page to show updated prices
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            }
        } catch (error) {
            this.showToast('Failed to update prices', 'error');
        }
    }

    startAutoRefresh() {
        // Refresh the page every 5 minutes to get latest data
        setInterval(() => {
            this.showToast('Refreshing data...', 'info');
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        }, 300000); // 5 minutes
    }

    showLoadingState(form) {
        const submitButton = form.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        
        submitButton.innerHTML = '<span class="loading"></span> Processing...';
        submitButton.disabled = true;
        
        // Re-enable after 3 seconds (in case of error)
        setTimeout(() => {
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        }, 3000);
    }

    showToast(message, type = 'info') {
        const toastContainer = document.getElementById('toastContainer') || this.createToastContainer();
        
        const toast = document.createElement('div');
        toast.className = `toast show bg-${type === 'error' ? 'danger' : type === 'success' ? 'success' : 'info'} text-white`;
        toast.innerHTML = `
            <div class="toast-header">
                <strong class="me-auto">${type.charAt(0).toUpperCase() + type.slice(1)}</strong>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast"></button>
            </div>
            <div class="toast-body">
                ${message}
            </div>
        `;
        
        toastContainer.appendChild(toast);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            toast.remove();
        }, 5000);
    }

    createToastContainer() {
        const container = document.createElement('div');
        container.id = 'toastContainer';
        container.className = 'toast-container position-fixed top-0 end-0 p-3';
        container.style.zIndex = '9999';
        document.body.appendChild(container);
        return container;
    }

    initTooltips() {
        // Initialize Bootstrap tooltips if available
        if (typeof bootstrap !== 'undefined') {
            const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
            tooltipTriggerList.map(function (tooltipTriggerEl) {
                return new bootstrap.Tooltip(tooltipTriggerEl);
            });
        }
    }
}

// Price change animation
function animatePriceChange(element, oldPrice, newPrice) {
    const priceElement = element.querySelector('.price');
    const oldValue = parseFloat(oldPrice.replace(/[^0-9.-]+/g, ''));
    const newValue = parseFloat(newPrice.replace(/[^0-9.-]+/g, ''));
    
    if (newValue > oldValue) {
        priceElement.classList.add('price-up');
        setTimeout(() => priceElement.classList.remove('price-up'), 2000);
    } else if (newValue < oldValue) {
        priceElement.classList.add('price-down');
        setTimeout(() => priceElement.classList.remove('price-down'), 2000);
    }
}

// Chart functionality (if Chart.js is available)
function initializeCharts() {
    if (typeof Chart !== 'undefined') {
        const ctx = document.getElementById('priceChart');
        if (ctx) {
            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: [],
                    datasets: [{
                        label: 'Price',
                        data: [],
                        borderColor: '#6366f1',
                        backgroundColor: 'rgba(99, 102, 241, 0.1)',
                        tension: 0.4
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            labels: {
                                color: '#f8fafc'
                            }
                        }
                    },
                    scales: {
                        y: {
                            ticks: {
                                color: '#94a3b8'
                            },
                            grid: {
                                color: '#334155'
                            }
                        },
                        x: {
                            ticks: {
                                color: '#94a3b8'
                            },
                            grid: {
                                color: '#334155'
                            }
                        }
                    }
                }
            });
        }
    }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    new CryptoDashboard();
    initializeCharts();
    
    // Add CSS for ripple effect
    const style = document.createElement('style');
    style.textContent = `
        .ripple {
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.3);
            transform: scale(0);
            animation: ripple-animation 0.6s linear;
            pointer-events: none;
        }
        
        @keyframes ripple-animation {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
        
        .highlighted {
            background: rgba(99, 102, 241, 0.2) !important;
            transform: scale(1.02);
        }
        
        .focused .form-control {
            border-color: #6366f1;
            box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
        }
        
        .is-invalid {
            border-color: #ef4444 !important;
            box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1) !important;
        }
    `;
    document.head.appendChild(style);
});

// Export for use in other scripts
window.CryptoDashboard = CryptoDashboard; 