/**
 * Single Groups Multiple Forms - Minimal Setup
 * Use this when you have the same field group type across different forms
 * 
 * Requirements:
 * - Each form needs a unique ID (e.g., id="form1", id="form2")
 * - Add data-field-group="" and data-group-name="group-name" to field containers
 * - Add data-add-btn="" and data-group-name="group-name" to add buttons
 * - Add data-remove-btn="" and data-group-name="group-name" to remove buttons
 */

// Education fields in Form 1
const educationForm1 = new DynamicFields({
    maxFields: 3,
    minFields: 1,
    groupName: 'education',
    formId: 'form1',
    fieldPrefix: 'education'
});

// Education fields in Form 2
const educationForm2 = new DynamicFields({
    maxFields: 3,
    minFields: 1,
    groupName: 'education', 
    formId: 'form2',
    fieldPrefix: 'education'
});

// Optional: Add event listeners
educationForm1.on('fieldAdded', function(data) {
    console.log('Form1 education field added, total: ' + data.totalFields);
});

educationForm2.on('fieldAdded', function(data) {
    console.log('Form2 education field added, total: ' + data.totalFields);
});