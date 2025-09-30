/**
 * Dynamic Form Fields Library - Core v3.0
 * 
 * A lightweight, flexible library for adding/removing form field groups.
 * Supports multiple field groups within single forms, single groups across multiple forms,
 * and multiple groups across multiple forms.
 * 
 * @version 3.0.0
 * @author Sab Nouri // https://desigmbysab.webflow.io
 * @license MIT
 */
console.log('Dynamic Form Fields v3.0 loaded properly.');

(function(global) {
    'use strict';

    /**
     * Main DynamicFields Class
     */
    class DynamicFields {
        
        constructor(options = {}) {
            // Default configuration
            this.config = {
                maxFields: options.maxFields || 5,
                minFields: options.minFields || 1,
                fieldPrefix: options.fieldPrefix || 'field',
                animationSpeed: options.animationSpeed || 300,
                validateOnAdd: options.validateOnAdd !== undefined ? options.validateOnAdd : false,
                autoInit: options.autoInit !== false,
                container: options.container || document,
                enableErrorLogging: options.enableErrorLogging !== false,
                enableDebugLogging: options.enableDebugLogging !== undefined ? options.enableDebugLogging : false,
                groupName: options.groupName || 'default', // New: Support for multiple groups
                formId: options.formId || null, // New: Support for multiple forms
                hideRemoveButtonWhenMinReached: options.hideRemoveButtonWhenMinReached !== undefined ? options.hideRemoveButtonWhenMinReached : true,
                ...options
            };
            
            // Event system and state
            this.events = {};
            this.fieldCounter = 0;
            this.elements = {};
            this.isInitialized = false;
            
            // Generate unique instance ID for multi-instance support
            this.instanceId = this.generateInstanceId();
            
            if (this.config.autoInit) {
                // Delay initialization to ensure DOM is ready
                if (document.readyState === 'loading') {
                    document.addEventListener('DOMContentLoaded', () => this.init());
                } else {
                    this.init();
                }
            }
        }
        
        /**
         * Generate unique instance ID
         */
        generateInstanceId() {
            return `df_${this.config.groupName}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        }
        
        /**
         * Logging methods for configurable error and debug output
         */
        logError(message, ...args) {
            if (this.config.enableErrorLogging) {
                console.error(`[DynamicFields-${this.instanceId}] ${message}`, ...args);
            }
        }

        logDebug(message, ...args) {
            if (this.config.enableDebugLogging) {
                console.log(`[DynamicFields-${this.instanceId}] ${message}`, ...args);
            }
        }
        
        /**
         * Initialize the library
         */
        init() {
            if (this.isInitialized) {
                this.logDebug('Already initialized, skipping...');
                return this;
            }
            
            this.logDebug('Starting initialization...', { config: this.config });
            
            this.findElements();
            if (this.validateSetup()) {
                this.setupInitialState();
                this.bindEvents();
                this.updateButtonStates();
                this.isInitialized = true;
                
                this.logDebug('Initialization completed successfully', {
                    instanceId: this.instanceId,
                    initialFieldCount: this.getCurrentFieldCount()
                });
                
                this.emit('initialized', { 
                    config: this.config,
                    instanceId: this.instanceId
                });
            } else {
                this.logError('Initialization failed - setup validation failed');
            }
            return this;
        }
        
        /**
         * Find all required elements using attributes
         */
        findElements() {
            const container = typeof this.config.container === 'string' 
                ? document.querySelector(this.config.container) 
                : this.config.container;
                
            if (!container) {
                this.logError('Container not found');
                return;
            }
            
            // Support for form-specific targeting
            let searchScope = container;
            if (this.config.formId) {
                const targetForm = container.querySelector(`#${this.config.formId}`) || 
                                 document.querySelector(`#${this.config.formId}`);
                if (targetForm) {
                    searchScope = targetForm;
                    this.logDebug('Targeting specific form', { formId: this.config.formId });
                }
            }
            
            const groupContainer = searchScope.querySelector('[data-form-container]') || searchScope;
            
            // Support for group-specific targeting
            let sourceField = groupContainer.querySelector('[data-field-group]');
            if (this.config.groupName !== 'default') {
                const groupSpecificField = groupContainer.querySelector(`[data-field-group][data-group-name="${this.config.groupName}"]`);
                if (groupSpecificField) {
                    sourceField = groupSpecificField;
                    this.logDebug('Found group-specific field', { groupName: this.config.groupName });
                }
            }
            
            this.elements = {
                container: container,
                searchScope: searchScope,
                sourceField: sourceField,
                fieldsContainer: searchScope.querySelector('[data-fields-container]') || groupContainer || searchScope,
                addButton: this.findButton(searchScope, '[data-add-btn]'),
                removeButton: this.findButton(searchScope, '[data-remove-btn]')
            };
            
            this.logDebug('Elements found', {
                hasSourceField: !!this.elements.sourceField,
                hasAddButton: !!this.elements.addButton,
                hasRemoveButton: !!this.elements.removeButton,
                fieldsContainer: !!this.elements.fieldsContainer
            });
        }
        
        /**
         * Find button with group-specific support
         */
        findButton(scope, selector) {
            // First try to find group-specific button
            if (this.config.groupName !== 'default') {
                const groupSpecificButton = scope.querySelector(`${selector}[data-group-name="${this.config.groupName}"]`);
                if (groupSpecificButton) {
                    return groupSpecificButton;
                }
            }
            
            // Fallback to general button
            return scope.querySelector(selector);
        }
        
        /**
         * Validate setup
         */
        validateSetup() {
            if (!this.elements.sourceField) {
                this.logError('Source field element with [data-field-group] not found');
                return false;
            }
            if (!this.elements.addButton) {
                this.logError('Add button with [data-add-btn] not found');
                return false;
            }
            if (!this.elements.fieldsContainer) {
                this.logError('Fields container not found');
                return false;
            }
            return true;
        }
        
        /**
         * Setup initial state
         */
        setupInitialState() {
            this.fieldCounter = this.getCurrentFieldCount();
            this.logDebug('Setting up initial state', {
                currentFieldCount: this.fieldCounter,
                minFields: this.config.minFields
            });
            
            // Hide remove button initially if at minimum
            if (this.elements.removeButton && this.config.hideRemoveButtonWhenMinReached) {
                if (this.fieldCounter <= this.config.minFields) {
                    this.elements.removeButton.style.display = 'none';
                }
            }
            
            if (this.fieldCounter === 1) {
                this.logDebug('Converting existing field to working field');
                this.convertSourceToWorkingField();
            } else {
                this.hideSourceField();
                if (this.fieldCounter === 0) {
                    this.logDebug('No fields found, creating minimum required fields');
                    this.createMinimumFields();
                }
            }
            
            this.logDebug('Initial state setup completed', {
                finalFieldCount: this.getCurrentFieldCount()
            });
        }
        
        /**
         * Convert source field to working field
         */
        convertSourceToWorkingField() {
            this.elements.sourceField.setAttribute('data-field-group', '1');
            if (this.config.groupName !== 'default') {
                this.elements.sourceField.setAttribute('data-group-name', this.config.groupName);
            }
            this.fieldCounter = 1;
            
            // Update form elements in the converted field
            const formElements = this.elements.sourceField.querySelectorAll('input, textarea, select, label, [id], [name], [for], [data-name]');
            formElements.forEach(element => this.updateFieldElement(element, 1));
            
            // Create new hidden source field
            const newSourceField = this.createHiddenSourceField();
            this.elements.fieldsContainer.appendChild(newSourceField);
            this.elements.sourceField = newSourceField;
        }
        
        /**
         * Create hidden source field for cloning
         */
        createHiddenSourceField() {
            const newSourceField = this.elements.sourceField.cloneNode(true);
            newSourceField.removeAttribute('data-field-group');
            newSourceField.removeAttribute('data-group-name');
            this.hideElement(newSourceField);
            
            // Clear values and reset attributes
            this.clearFieldValues(newSourceField);
            this.resetFieldAttributes(newSourceField);
            
            return newSourceField;
        }
        
        /**
         * Hide source field
         */
        hideSourceField() {
            this.hideElement(this.elements.sourceField);
        }
        
        /**
         * Hide element completely
         */
        hideElement(element) {
            Object.assign(element.style, {
                display: 'none',
                visibility: 'hidden',
                position: 'absolute',
                left: '-9999px'
            });
        }
        
        /**
         * Create minimum required fields
         */
        createMinimumFields() {
            for (let i = 0; i < this.config.minFields; i++) {
                this.addField(false);
            }
        }
        
        /**
         * Reset field attributes to original values
         */
        resetFieldAttributes(field) {
            const formElements = field.querySelectorAll('input, textarea, select, label, [id], [name], [for], [data-name]');
            formElements.forEach(element => {
                const attributesToReset = ['name', 'id', 'for', 'data-name'];
                attributesToReset.forEach(attr => {
                    const currentValue = element.getAttribute(attr);
                    if (currentValue && currentValue.includes(`${this.config.fieldPrefix}-1-`)) {
                        const originalValue = currentValue.replace(`${this.config.fieldPrefix}-1-`, '');
                        element.setAttribute(attr, originalValue);
                    }
                });
            });
        }
        
        /**
         * Bind events
         */
        bindEvents() {
            // Prevent multiple bindings
            if (this.elements.addButton.hasAttribute('data-df-bound')) {
                return;
            }
            
            this.elements.addButton.addEventListener('click', (e) => {
                e.preventDefault();
                this.addField();
            });
            this.elements.addButton.setAttribute('data-df-bound', 'true');
            
            if (this.elements.removeButton) {
                if (!this.elements.removeButton.hasAttribute('data-df-bound')) {
                    this.elements.removeButton.addEventListener('click', (e) => {
                        e.preventDefault();
                        this.removeField();
                    });
                    this.elements.removeButton.setAttribute('data-df-bound', 'true');
                }
            }
            
            // Individual remove buttons
            this.elements.fieldsContainer.addEventListener('click', (e) => {
                const removeButton = e.target.matches('[data-remove-this-field]') 
                    ? e.target 
                    : e.target.closest('[data-remove-this-field]');
                    
                if (removeButton) {
                    e.preventDefault();
                    const fieldGroup = removeButton.closest('[data-field-group]');
                    if (fieldGroup) {
                        // Check if this field belongs to our group
                        const fieldGroupName = fieldGroup.getAttribute('data-group-name');
                if (!fieldGroupName || fieldGroupName === this.config.groupName) {
                            this.removeSpecificField(fieldGroup);
                        }
                    }
                }
            });
        }
        
        /**
         * Add a new field
         */
        addField(animate = true) {
            const currentCount = this.getCurrentFieldCount();
            this.logDebug('Attempting to add field', {
                currentCount: currentCount,
                maxFields: this.config.maxFields,
                animate: animate
            });

            if (currentCount >= this.config.maxFields) {
                this.logDebug('Cannot add field - maximum limit reached', {
                    currentCount: currentCount,
                    maxFields: this.config.maxFields
                });
                this.emit('maxFieldsReached', { 
                    currentCount: currentCount,
                    maxFields: this.config.maxFields 
                });
                return false;
            }
            
            if (this.config.validateOnAdd && !this.validateExistingFields()) {
                this.logDebug('Cannot add field - validation failed');
                this.emit('validationFailed', { 
                    message: 'Please fill out existing fields before adding new ones' 
                });
                return false;
            }
            
            this.fieldCounter++;
            const newField = this.createNewField(this.fieldCounter);
            this.insertField(newField, animate);
            
            const newCount = this.getCurrentFieldCount();
            this.logDebug('Field added successfully', {
                fieldIndex: this.fieldCounter,
                previousCount: currentCount,
                newCount: newCount,
                animated: animate && this.config.animationSpeed > 0
            });
            
            this.updateButtonStates();
            this.emit('fieldAdded', {
                fieldGroup: newField,
                fieldIndex: this.fieldCounter,
                totalFields: newCount,
                instanceId: this.instanceId
            });
            
            return newField;
        }
        
        /**
         * Insert field into DOM
         */
        insertField(newField, animate) {
            const existingFields = this.getOwnFieldGroups();
            const lastField = existingFields[existingFields.length - 1];
            
            // Insert after the last field group
            if (lastField && lastField.nextSibling) {
                this.elements.fieldsContainer.insertBefore(newField, lastField.nextSibling);
            } else {
                this.elements.fieldsContainer.appendChild(newField);
            }
            
            if (animate && this.config.animationSpeed > 0) {
                this.animateFieldIn(newField);
            }
        }
        
        /**
         * Get field groups that belong to this instance
         */
        getOwnFieldGroups() {
            const allFields = this.elements.fieldsContainer.querySelectorAll('[data-field-group]');
            return Array.from(allFields).filter(field => {
                const fieldGroupName = field.getAttribute('data-group-name');
            return !fieldGroupName || fieldGroupName === this.config.groupName;
            });
        }
        
        /**
         * Animate field in
         */
        animateFieldIn(field) {
            field.style.opacity = '0';
            field.style.transform = 'translateY(-10px)';
            
            requestAnimationFrame(() => {
                field.style.transition = `opacity ${this.config.animationSpeed}ms ease, transform ${this.config.animationSpeed}ms ease`;
                field.style.opacity = '1';
                field.style.transform = 'translateY(0)';
            });
        }
        
        /**
         * Remove last field
         */
        removeField() {
            const fields = this.getOwnFieldGroups();
            const currentCount = fields.length;
            
            this.logDebug('Attempting to remove last field', {
                currentCount: currentCount,
                minFields: this.config.minFields
            });

            if (currentCount <= this.config.minFields) {
                this.logDebug('Cannot remove field - minimum limit reached', {
                    currentCount: currentCount,
                    minFields: this.config.minFields
                });
                this.emit('minFieldsReached', {
                    currentCount: currentCount,
                    minFields: this.config.minFields
                });
                return false;
            }
            
            const lastField = fields[fields.length - 1];
            const fieldIndex = lastField.getAttribute('data-field-group');
            this.logDebug('Removing field', {
                fieldIndex: fieldIndex,
                beforeCount: currentCount
            });
            
            this.removeSpecificField(lastField);
            return true;
        }
        
        /**
         * Remove specific field
         */
        removeSpecificField(fieldElement) {
            const currentCount = this.getCurrentFieldCount();
            const fieldIndex = fieldElement.getAttribute('data-field-group');
            
            this.logDebug('Attempting to remove specific field', {
                fieldIndex: fieldIndex,
                currentCount: currentCount,
                minFields: this.config.minFields
            });

            if (currentCount <= this.config.minFields) {
                this.logDebug('Cannot remove field - minimum limit reached', {
                    fieldIndex: fieldIndex,
                    currentCount: currentCount,
                    minFields: this.config.minFields
                });
                this.emit('minFieldsReached', {
                    currentCount: currentCount,
                    minFields: this.config.minFields
                });
                return false;
            }
            
            if (this.config.animationSpeed > 0) {
                this.logDebug('Animating field removal', {
                    fieldIndex: fieldIndex,
                    animationSpeed: this.config.animationSpeed
                });
                this.animateFieldOut(fieldElement);
            } else {
                this.logDebug('Removing field immediately (no animation)', {
                    fieldIndex: fieldIndex
                });
                this.removeFieldElement(fieldElement);
            }
            
            return true;
        }
        
        /**
         * Animate field out
         */
        animateFieldOut(fieldElement) {
            fieldElement.style.transition = `opacity ${this.config.animationSpeed}ms ease, transform ${this.config.animationSpeed}ms ease`;
            fieldElement.style.opacity = '0';
            fieldElement.style.transform = 'translateY(-10px)';
            
            requestAnimationFrame(() => {
                setTimeout(() => {
                    this.removeFieldElement(fieldElement);
                }, this.config.animationSpeed);
            });
        }
        
        /**
         * Remove field element from DOM
         */
        removeFieldElement(fieldElement) {
            if (fieldElement.parentNode) {
                const fieldIndex = fieldElement.getAttribute('data-field-group');
                const beforeCount = this.getCurrentFieldCount();
                
                fieldElement.parentNode.removeChild(fieldElement);
                const afterCount = this.getCurrentFieldCount();
                
                this.logDebug('Field removed from DOM', {
                    fieldIndex: fieldIndex,
                    beforeCount: beforeCount,
                    afterCount: afterCount
                });
                
                this.updateButtonStates();
                this.emit('fieldRemoved', { 
                    totalFields: afterCount,
                    instanceId: this.instanceId
                });
            }
        }
        
        /**
         * Create new field from source
         */
        createNewField(index) {
            const newField = this.elements.sourceField.cloneNode(true);
            
            newField.removeAttribute('data-form-container');
            newField.setAttribute('data-field-group', index);
            
            // Set group ID for multi-group support
            if (this.config.groupName !== 'default') {
                newField.setAttribute('data-group-name', this.config.groupName);
            }
            
            // Reset display styles
            newField.style.display = '';
            newField.style.visibility = '';
            newField.style.position = '';
            newField.style.left = '';
            
            // Update form elements and clear values
            const formElements = newField.querySelectorAll('input, textarea, select, label, [id], [name], [for], [data-name]');
            formElements.forEach(element => this.updateFieldElement(element, index));
            
            this.clearFieldValues(newField);
            
            return newField;
        }
        
        /**
         * Clear field values
         */
        clearFieldValues(field) {
            const inputs = field.querySelectorAll('input, textarea, select');
            inputs.forEach(input => {
                if (input.type !== 'radio' && input.type !== 'checkbox') {
                    input.value = '';
                } else {
                    input.checked = false;
                }
            });
        }
        
        /**
         * Update field element attributes
         */
        updateFieldElement(element, index) {
            const attributesToUpdate = ['name', 'id', 'for', 'data-name'];
            
            attributesToUpdate.forEach(attr => {
                const currentValue = element.getAttribute(attr);
                if (currentValue) {
                    const newValue = `${this.config.fieldPrefix}-${index}-${currentValue}`;
                    element.setAttribute(attr, newValue);
                }
            });
            
            // Handle labels
            if (element.tagName.toLowerCase() === 'label') {
                const associatedInput = element.querySelector('input, textarea, select') || 
                                      element.parentElement.querySelector('input, textarea, select');
                if (associatedInput) {
                    element.setAttribute('for', associatedInput.getAttribute('id'));
                }
            }
        }
        
        /**
         * Get current field count (only for this instance's group)
         */
        getCurrentFieldCount() {
            return this.getOwnFieldGroups().length;
        }
        
        /**
         * Update button states with improved logic
         */
        updateButtonStates() {
            const currentCount = this.getCurrentFieldCount();
            const addButtonDisabled = currentCount >= this.config.maxFields;
            const removeButtonDisabled = currentCount <= this.config.minFields;
            
            this.logDebug('Updating button states', {
                currentCount: currentCount,
                maxFields: this.config.maxFields,
                minFields: this.config.minFields,
                addButtonDisabled: addButtonDisabled,
                removeButtonDisabled: removeButtonDisabled
            });
            
            // Add button
            this.updateButtonState(this.elements.addButton, addButtonDisabled);
            
            // Remove button - improved visibility logic
            if (this.elements.removeButton) {
                this.updateButtonState(this.elements.removeButton, removeButtonDisabled);
                
                if (this.config.hideRemoveButtonWhenMinReached) {
                    if (removeButtonDisabled) {
                        this.elements.removeButton.style.display = 'none';
                    } else {
                        this.elements.removeButton.style.display = '';
                    }
                }
            }
            
            this.emit('buttonStatesUpdated', {
                currentCount,
                addButtonDisabled: addButtonDisabled,
                removeButtonDisabled: removeButtonDisabled,
                instanceId: this.instanceId
            });
        }
        
        /**
         * Update individual button state
         */
        updateButtonState(button, disabled) {
            if (!button) return;
            
            if (disabled) {
                button.classList.add('is-disabled');
                button.disabled = true;
                button.setAttribute('aria-disabled', 'true');
            } else {
                button.classList.remove('is-disabled');
                button.disabled = false;
                button.setAttribute('aria-disabled', 'false');
            }
        }
        
        /**
         * Validate existing fields
         */
        validateExistingFields() {
            const ownFields = this.getOwnFieldGroups();
            const requiredInputs = [];
            
            ownFields.forEach(field => {
                const inputs = field.querySelectorAll('input[required], textarea[required], select[required]');
                requiredInputs.push(...inputs);
            });
            
            for (let input of requiredInputs) {
                if (!input.value.trim()) {
                    return false;
                }
            }
            return true;
        }
        
        /**
         * Event system - Register event listener
         */
        on(eventName, callback) {
            if (!this.events[eventName]) {
                this.events[eventName] = [];
            }
            this.events[eventName].push(callback);
            return this;
        }
        
        /**
         * Event system - Remove event listener
         */
        off(eventName, callback) {
            if (!this.events[eventName]) return this;
            
            if (callback) {
                this.events[eventName] = this.events[eventName].filter(cb => cb !== callback);
            } else {
                this.events[eventName] = [];
            }
            return this;
        }
        
        /**
         * Event system - Emit event
         */
        emit(eventName, data = {}) {
            if (!this.events[eventName]) return this;
            
            this.events[eventName].forEach(callback => {
                try {
                    callback.call(this, { type: eventName, ...data });
                } catch (error) {
                    this.logError(`Error in event handler for ${eventName}:`, error);
                }
            });
            return this;
        }
        
        /**
         * Get current configuration
         */
        getConfig() {
            return { ...this.config };
        }
        
        /**
         * Update configuration
         */
        updateConfig(newConfig) {
            this.config = { ...this.config, ...newConfig };
            this.updateButtonStates();
            return this;
        }
        
        /**
         * Get current field count (alias for getCurrentFieldCount)
         */
        getFieldCount() {
            return this.getCurrentFieldCount();
        }
        
        /**
         * Get instance ID
         */
        getInstanceId() {
            return this.instanceId;
        }
        
        /**
         * Destroy instance
         */
        destroy() {
            this.logDebug('Destroying instance', { instanceId: this.instanceId });
            
            // Remove event listeners
            if (this.elements.addButton) {
                this.elements.addButton.removeAttribute('data-df-bound');
            }
            if (this.elements.removeButton) {
                this.elements.removeButton.removeAttribute('data-df-bound');
            }
            
            this.events = {};
            this.isInitialized = false;
            this.emit('destroyed', { instanceId: this.instanceId });
            return this;
        }
    }
    
    // Static method to create multiple instances
    DynamicFields.createMultiple = function(configs) {
        return configs.map(config => new DynamicFields(config));
    };
    
    // Export to global scope
    global.DynamicFields = DynamicFields;
    
    // AMD support
    if (typeof define === 'function' && define.amd) {
        define(function() { return DynamicFields; });
    }
    
    // CommonJS support
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = DynamicFields;
    }
    
})(typeof window !== 'undefined' ? window : this);