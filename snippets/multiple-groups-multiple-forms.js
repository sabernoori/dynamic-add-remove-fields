/**
 * Multiple Groups Multiple Forms - Minimal Setup
 * Use this for complex scenarios with different field groups across different forms
 * 
 * Requirements:
 * - Each form needs a unique ID (e.g., id="form1", id="form2")
 * - Each group needs unique data-group-name values
 * - Add data-field-group="" and data-group-name="group-name" to field containers
 * - Add data-add-btn="" and data-group-name="group-name" to add buttons
 * - Add data-remove-btn="" and data-group-name="group-name" to remove buttons
 */

// Form 1: Education and Work groups
const educationForm1 = new DynamicFields({
    maxFields: 3,
    minFields: 1,
    groupName: 'education',
    formId: 'form1',
    fieldPrefix: 'education'
});

const workForm1 = new DynamicFields({
    maxFields: 5,
    minFields: 1,
    groupName: 'work',
    formId: 'form1',
    fieldPrefix: 'work'
});

// Form 2: Contacts and Skills groups
const contactsForm2 = new DynamicFields({
    maxFields: 4,
    minFields: 1,
    groupName: 'contacts',
    formId: 'form2',
    fieldPrefix: 'contacts'
});

const skillsForm2 = new DynamicFields({
    maxFields: 6,
    minFields: 1,
    groupName: 'skills',
    formId: 'form2',
    fieldPrefix: 'skills'
});

// Optional: Add event listeners
educationForm1.on('fieldAdded', function(data) {
    console.log('Form1 education field added, total: ' + data.totalFields);
});

workForm1.on('fieldAdded', function(data) {
    console.log('Form1 work field added, total: ' + data.totalFields);
});