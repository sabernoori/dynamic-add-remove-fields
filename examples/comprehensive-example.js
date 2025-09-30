/**
 * Dynamic Fields Library v3.0 - Configuration Snippet
 * 
 * This file contains configuration examples for different scenarios:
 * 1. Single field group in single form (basic usage)
 * 2. Multiple field groups in single form
 * 3. Single field groups across multiple forms
 * 4. Multiple field groups across multiple forms
 */

// ===== BASIC CONFIGURATION (Single Group, Single Form) =====
const basicConfig = {
    maxFields: 10,              // Maximum number of field groups allowed
    minFields: 1,               // Minimum number of field groups required
    fieldPrefix: 'education',   // Prefix for field names (e.g., education-1-school)
    animationSpeed: 300,        // Animation duration in milliseconds
    validateOnAdd: false,       // Validate existing fields before adding new ones
    autoInit: true,             // Automatically initialize when DOM is ready
    container: document,        // Container element or selector
    enableErrorLogging: true,   // Show error messages in console
    enableDebugLogging: false,  // Show debug messages in console (set to true for development)
    hideRemoveButtonWhenMinReached: true // Hide remove button when minimum fields reached
};

// ===== SCENARIO 1: BASIC USAGE (Single Group) =====
// Use this for simple forms with one type of repeating field group
const educationFields = new DynamicFields(basicConfig);

// ===== SCENARIO 2: MULTIPLE GROUPS IN SINGLE FORM =====
// Use this when you have different types of field groups in the same form
// Example: Education history AND Work experience in the same form

const educationGroup = new DynamicFields({
    ...basicConfig,
    groupName: 'education',           // Unique identifier for this group
    fieldPrefix: 'education',       // Prefix for education fields
    container: '#main-form',        // Target specific form
    maxFields: 5,
    enableDebugLogging: true        // Enable for testing
});

const workExperienceGroup = new DynamicFields({
    ...basicConfig,
    groupName: 'work',               // Different group ID
    fieldPrefix: 'work',           // Different prefix for work fields
    container: '#main-form',       // Same form, different group
    maxFields: 8,
    enableDebugLogging: true
});

// ===== SCENARIO 3: SINGLE GROUPS ACROSS MULTIPLE FORMS =====
// Use this when you have the same type of field group in different forms
// Example: Contact information in both registration and profile forms

const registrationContacts = new DynamicFields({
    ...basicConfig,
    formId: 'registration-form',    // Target specific form by ID
    fieldPrefix: 'contact',
    maxFields: 3,
    enableDebugLogging: true
});

const profileContacts = new DynamicFields({
    ...basicConfig,
    formId: 'profile-form',         // Different form, same field type
    fieldPrefix: 'contact',
    maxFields: 5,
    enableDebugLogging: true
});

// ===== SCENARIO 4: MULTIPLE GROUPS ACROSS MULTIPLE FORMS =====
// Use this for complex applications with multiple forms and multiple field types
// Example: Registration form with education + work, Profile form with contacts + skills

// Registration form groups
const regEducation = new DynamicFields({
    ...basicConfig,
    formId: 'registration-form',
    groupName: 'education',
    fieldPrefix: 'reg-education',
    maxFields: 5,
    enableDebugLogging: true
});

const regWork = new DynamicFields({
    ...basicConfig,
    formId: 'registration-form',
    groupName: 'work',
    fieldPrefix: 'reg-work',
    maxFields: 8,
    enableDebugLogging: true
});

// Profile form groups
const profileContacts = new DynamicFields({
    ...basicConfig,
    formId: 'profile-form',
    groupName: 'contacts',
    fieldPrefix: 'profile-contact',
    maxFields: 3,
    enableDebugLogging: true
});

const profileSkills = new DynamicFields({
    ...basicConfig,
    formId: 'profile-form',
    groupName: 'skills',
    fieldPrefix: 'profile-skill',
    maxFields: 10,
    enableDebugLogging: true
});

// ===== BULK CREATION USING STATIC METHOD =====
// Alternative approach for creating multiple instances at once
const multipleInstances = DynamicFields.createMultiple([
    {
        ...basicConfig,
        groupName: 'education',
        fieldPrefix: 'education',
        maxFields: 5
    },
    {
        ...basicConfig,
        groupName: 'work',
        fieldPrefix: 'work',
        maxFields: 8
    },
    {
        ...basicConfig,
        groupName: 'skills',
        fieldPrefix: 'skills',
        maxFields: 10
    }
]);

// ===== EVENT HANDLING EXAMPLES =====
// Listen to events for user feedback and debugging

// Basic event listeners
educationFields.on('initialized', function(data) {
    console.log('Education fields initialized:', data);
});

educationFields.on('fieldAdded', function(data) {
    console.log('Education field added:', data.totalFields);
    // You can show user feedback here
});

educationFields.on('fieldRemoved', function(data) {
    console.log('Education field removed:', data.totalFields);
});

educationFields.on('maxFieldsReached', function(data) {
    console.log('Maximum education entries reached:', data.maxFields);
    // Show user notification
});

educationFields.on('minFieldsReached', function(data) {
    console.log('Cannot remove more education entries');
    // Show user notification
});

educationFields.on('validationFailed', function(data) {
    console.log('Validation failed:', data.message);
    // Show validation error to user
});

// ===== HTML ATTRIBUTE REQUIREMENTS =====
/*
For the library to work properly, add these attributes to your HTML:

REQUIRED ATTRIBUTES:
1. [data-field-group] - Add to the field group container (this becomes your template)
2. [data-add-btn] - Add to the "Add" button
3. [data-remove-btn] - Add to the "Remove" button (optional, for removing last field)

OPTIONAL ATTRIBUTES FOR MULTI-GROUP SUPPORT:
4. [data-group-name="groupName"] - Add to field groups and buttons for specific group targeting
5. [data-remove-this-field] - Add to individual remove buttons within field groups
6. [data-form-container] - Add to form container if needed
7. [data-fields-container] - Add to specify where new fields should be inserted

EXAMPLE HTML STRUCTURE:

<!-- Single Group Example -->
<form id="education-form">
    <div data-field-group class="field-group">
        <input name="school" placeholder="School Name">
        <input name="degree" placeholder="Degree">
    </div>
    <button data-add-btn>Add Education</button>
    <button data-remove-btn>Remove Education</button>
</form>

<!-- Multiple Groups Example -->
<form id="main-form">
    <!-- Education Group -->
    <div data-field-group data-group-name="education" class="field-group">
        <input name="school" placeholder="School Name">
        <input name="degree" placeholder="Degree">
        <button data-remove-this-field>Remove This</button>
    </div>
    <button data-add-btn data-group-name="education">Add Education</button>
    <button data-remove-btn data-group-name="education">Remove Last Education</button>
    
    <!-- Work Group -->
    <div data-field-group data-group-name="work" class="field-group">
        <input name="company" placeholder="Company Name">
        <input name="position" placeholder="Position">
        <button data-remove-this-field>Remove This</button>
    </div>
    <button data-add-btn data-group-name="work">Add Work Experience</button>
    <button data-remove-btn data-group-name="work">Remove Last Work</button>
</form>
*/

// ===== DEBUGGING TIPS =====
/*
1. Set enableDebugLogging: true to see detailed console logs
2. Check that all required HTML attributes are present
3. Ensure unique groupName values for multiple groups
4. Verify that fieldPrefix values don't conflict
5. Use browser dev tools to inspect generated field names
6. Check console for initialization and event messages
*/