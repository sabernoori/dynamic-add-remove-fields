# DynamicFields

A lightweight, flexible JavaScript library for dynamically adding and removing form fields with support for multiple groups and forms.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Version](https://img.shields.io/badge/version-3.0.0-blue.svg)](https://github.com/sabernoori/dynamic-add-remove-fields)

## 🚀 Perfect for Webflow Users!

This library is specifically designed to work seamlessly with **Webflow** without any build process or dependencies. Simply add the script and start using dynamic fields in your Webflow projects!

### Quick Webflow Setup (3 Steps)

1. **Add the Script**: In your Webflow project settings → Custom Code → Footer Code:
```html
<script src="https://cdn.jsdelivr.net/gh/sabernoori/dynamic-add-remove-fields@v3.0.0/src/dynamic-fields.js"></script>
```

2. **Structure Your Form**: Use Webflow's form builder and add these classes/attributes:
   - Form: Give it an ID (e.g., `contact-form`)
   - Container div: Add class `field-group` and attribute `data-group-name="your-group-name"`
   - Add button: Add class `add-field-btn`
   - Remove button: Add class `remove-field-btn`

3. **Initialize**: Add this script after the library:
```html
<script>
document.addEventListener('DOMContentLoaded', function() {
    new DynamicFields({
        formId: 'contact-form',        // Your Webflow form ID
        groupName: 'your-group-name',  // Match your data-group-name
        fieldPrefix: 'field'           // Prefix for field names
    });
});
</script>
```

### Webflow-Specific Benefits
- ✅ **No Build Process** - Works directly in Webflow
- ✅ **No Dependencies** - Pure vanilla JavaScript
- ✅ **Designer Friendly** - Use Webflow's visual form builder
- ✅ **Responsive** - Inherits your Webflow responsive design
- ✅ **Form Submissions** - Works with Webflow's native form handling

---

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

### Option 1: CDN (Recommended)
```html
<script src="https://cdn.jsdelivr.net/gh/sabernoori/dynamic-add-remove-fields@v3.0.0/src/dynamic-fields.js"></script>
```

### Option 2: Direct Download
Download the `dynamic-fields.js` file from the [GitHub repository](https://github.com/sabernoori/dynamic-add-remove-fields) and include it in your project:

```html
<script src="path/to/dynamic-fields.js"></script>
```

### Option 3: NPM
```bash
npm install dynamic-add-remove-fields
```

## Quick Start

### HTML Structure with Comments
```html
<form id="my-form">
    <!-- Main container for the dynamic field group -->
    <div class="field-group" data-group-name="education">
        <!-- Initial fields (these will be cloned when adding new fields) -->
        <input type="text" name="education-degree-1" placeholder="Degree">
        <input type="text" name="education-school-1" placeholder="School">
        
        <!-- Button to add more field sets (required class: add-field-btn) -->
        <button type="button" class="add-field-btn">Add Education</button>
        
        <!-- Button to remove current field set (required class: remove-field-btn) -->
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