# DynamicFields

A lightweight, flexible JavaScript library for dynamically adding and removing form fields with support for multiple groups and forms.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Version](https://img.shields.io/badge/version-3.0.0-blue.svg)](https://github.com/yourusername/dynamic-fields)

## Features

- ✨ **Zero Dependencies** - Pure vanilla JavaScript
- 🎯 **Multiple Groups** - Support for different field groups within the same form
- 📝 **Multiple Forms** - Manage fields across multiple forms simultaneously
- 🔧 **Highly Configurable** - Extensive customization options
- 🎨 **CSS Framework Agnostic** - Works with any CSS framework
- 📱 **Responsive** - Mobile-friendly design
- 🔍 **Built-in Validation** - Optional field validation support
- 🐛 **Debug Mode** - Comprehensive logging for development

## Installation

### Option 1: Direct Download
Download the `dynamic-fields.js` file from the `src/` directory and include it in your project:

```html
<script src="path/to/dynamic-fields.js"></script>
```

### Option 2: NPM (Coming Soon)
```bash
npm install dynamic-fields
```

### Option 3: CDN (Coming Soon)
```html
<script src="https://cdn.jsdelivr.net/npm/dynamic-fields@3.0.0/src/dynamic-fields.js"></script>
```

## Quick Start

### Basic HTML Structure
```html
<form id="my-form">
    <div class="field-group" data-group-name="education">
        <input type="text" name="education-degree-1" placeholder="Degree">
        <input type="text" name="education-school-1" placeholder="School">
        <button type="button" class="add-field-btn">Add Education</button>
        <button type="button" class="remove-field-btn">Remove</button>
    </div>
</form>
```

### Basic JavaScript Usage
```javascript
const dynamicFields = new DynamicFields({
    formId: 'my-form',
    groupName: 'education',
    fieldPrefix: 'education',
    maxFields: 5,
    minFields: 1
});
```

## Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `formId` | string | `'default-form'` | ID of the target form |
| `groupName` | string | `'default'` | Name of the field group |
| `fieldPrefix` | string | `'field'` | Prefix for new field names |
| `maxFields` | number | `10` | Maximum number of fields allowed |
| `minFields` | number | `1` | Minimum number of fields required |
| `hideRemoveButtonWhenMinReached` | boolean | `true` | Hide remove button when at minimum |
| `validateOnAdd` | boolean | `false` | Validate fields before adding new ones |
| `enableDebugLogging` | boolean | `false` | Enable console logging for debugging |

## Usage Examples

### 1. Basic Single Group
Perfect for simple scenarios like adding multiple education entries:

```javascript
const education = new DynamicFields({
    formId: 'registration-form',
    groupName: 'education',
    fieldPrefix: 'education',
    maxFields: 5,
    minFields: 1
});
```

### 2. Multiple Groups in Single Form
Handle different types of fields in the same form:

```javascript
// Education fields
const education = new DynamicFields({
    formId: 'profile-form',
    groupName: 'education',
    fieldPrefix: 'education',
    maxFields: 5
});

// Work experience fields
const work = new DynamicFields({
    formId: 'profile-form',
    groupName: 'work',
    fieldPrefix: 'work-experience',
    maxFields: 10
});
```

### 3. Single Groups Across Multiple Forms
Same field type across different forms:

```javascript
// Education in registration form
const regEducation = new DynamicFields({
    formId: 'registration-form',
    groupName: 'education',
    fieldPrefix: 'reg-education',
    maxFields: 3
});

// Education in profile form
const profileEducation = new DynamicFields({
    formId: 'profile-form',
    groupName: 'education',
    fieldPrefix: 'profile-education',
    maxFields: 5
});
```

### 4. Multiple Groups Across Multiple Forms
Complex scenarios with different field types across multiple forms:

```javascript
// Registration form - Education
const regEducation = new DynamicFields({
    formId: 'registration-form',
    groupName: 'education',
    fieldPrefix: 'reg-education',
    maxFields: 3
});

// Registration form - Work
const regWork = new DynamicFields({
    formId: 'registration-form',
    groupName: 'work',
    fieldPrefix: 'reg-work',
    maxFields: 5
});

// Profile form - Contacts
const profileContacts = new DynamicFields({
    formId: 'profile-form',
    groupName: 'contacts',
    fieldPrefix: 'profile-contact',
    maxFields: 3
});

// Profile form - Skills
const profileSkills = new DynamicFields({
    formId: 'profile-form',
    groupName: 'skills',
    fieldPrefix: 'profile-skill',
    maxFields: 10
});
```

## Event Handling

DynamicFields provides event callbacks for field operations:

```javascript
const dynamicFields = new DynamicFields({
    formId: 'my-form',
    groupName: 'education',
    fieldPrefix: 'education',
    
    // Event callbacks
    onFieldAdded: function(newField, fieldCount) {
        console.log('Field added:', newField);
        console.log('Total fields:', fieldCount);
    },
    
    onFieldRemoved: function(removedField, fieldCount) {
        console.log('Field removed:', removedField);
        console.log('Remaining fields:', fieldCount);
    },
    
    onMaxFieldsReached: function(maxFields) {
        alert(`Maximum of ${maxFields} fields allowed`);
    },
    
    onMinFieldsReached: function(minFields) {
        console.log(`Minimum of ${minFields} fields required`);
    }
});
```

## HTML Structure Requirements

### Required Attributes
- Form must have an `id` attribute
- Field groups must have `data-group-name` attribute
- Add buttons must have class `add-field-btn`
- Remove buttons must have class `remove-field-btn`

### Example Structure
```html
<form id="my-form">
    <div class="field-group" data-group-name="education">
        <!-- Source fields (will be cloned) -->
        <input type="text" name="education-degree-1" placeholder="Degree">
        <input type="text" name="education-school-1" placeholder="School">
        
        <!-- Control buttons -->
        <button type="button" class="add-field-btn">Add Education</button>
        <button type="button" class="remove-field-btn">Remove</button>
    </div>
</form>
```

## CSS Styling

DynamicFields is CSS framework agnostic. Here's a basic styling example:

```css
.field-group {
    margin-bottom: 20px;
    padding: 15px;
    border: 1px solid #ddd;
    border-radius: 5px;
}

.field-group input {
    margin: 5px;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 3px;
}

.add-field-btn {
    background-color: #28a745;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 3px;
    cursor: pointer;
}

.remove-field-btn {
    background-color: #dc3545;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 3px;
    cursor: pointer;
}

.remove-field-btn:disabled {
    background-color: #6c757d;
    cursor: not-allowed;
}
```

## API Reference

### Constructor
```javascript
new DynamicFields(options)
```

### Methods
- `addField()` - Manually add a new field
- `removeField(fieldElement)` - Remove a specific field
- `getFieldCount()` - Get current number of fields
- `validateFields()` - Validate all fields in the group
- `destroy()` - Clean up event listeners and references

### Static Methods
- `DynamicFields.createMultiple(configs)` - Create multiple instances at once

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+
- Internet Explorer 11+ (with polyfills)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Testing

Run the test server to see examples in action:

```bash
npm run serve
```

Then visit:
- `http://localhost:8000/tests/scenario0-basic-single-group.html`
- `http://localhost:8000/tests/scenario1-multiple-groups-single-form.html`
- `http://localhost:8000/tests/scenario2-single-groups-multiple-forms.html`
- `http://localhost:8000/tests/scenario3-multiple-groups-multiple-forms.html`

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for version history and changes.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

- 📖 [Documentation](https://github.com/yourusername/dynamic-fields/wiki)
- 🐛 [Issue Tracker](https://github.com/yourusername/dynamic-fields/issues)
- 💬 [Discussions](https://github.com/yourusername/dynamic-fields/discussions)

---

Made with ❤️ by the DynamicFields team