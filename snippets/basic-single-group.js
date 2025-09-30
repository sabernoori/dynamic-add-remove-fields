/**
 * Basic Single Group - Minimal Setup
 * Use this for simple forms with one field group that can be added/removed
 * 
 * Requirements:
 * - Add data-field-group="" and data-group-name="your-group-name" to your field container
 * - Add data-add-btn="" and data-group-name="your-group-name" to your add button
 * - Add data-remove-btn="" and data-group-name="your-group-name" to your remove button
 */

const dynamicFields = new DynamicFields({
    maxFields: 5,               // Max number of field groups
    minFields: 1,               // Min number of field groups  
    groupName: 'education',     // Unique identifier for this group
    fieldPrefix: 'education'    // Prefix for field names
});

// Optional: Add event listeners
dynamicFields.on('fieldAdded', function(data) {
    console.log('Field added, total: ' + data.totalFields);
});

dynamicFields.on('fieldRemoved', function(data) {
    console.log('Field removed, total: ' + data.totalFields);
});