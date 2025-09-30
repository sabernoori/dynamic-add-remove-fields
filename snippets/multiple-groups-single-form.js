/**
 * Multiple Groups Single Form - Minimal Setup
 * Use this for forms with multiple different field groups (e.g., education + work experience)
 * 
 * Requirements:
 * - Each group needs unique data-group-name values
 * - Add data-field-group="" and data-group-name="group-name" to each field container
 * - Add data-add-btn="" and data-group-name="group-name" to each add button
 * - Add data-remove-btn="" and data-group-name="group-name" to each remove button
 */

// Education group
const educationFields = new DynamicFields({
    maxFields: 3,
    minFields: 1,
    groupName: 'education',
    fieldPrefix: 'education'
});

// Work experience group  
const workFields = new DynamicFields({
    maxFields: 5,
    minFields: 1,
    groupName: 'work',
    fieldPrefix: 'work'
});

// Optional: Add event listeners
educationFields.on('fieldAdded', function(data) {
    console.log('Education field added, total: ' + data.totalFields);
});

workFields.on('fieldAdded', function(data) {
    console.log('Work field added, total: ' + data.totalFields);
});