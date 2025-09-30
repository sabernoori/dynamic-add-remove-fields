# Changelog

All notable changes to the DynamicFields library will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [3.0.0] - 2024-01-XX

### 🎉 Major Release - Complete Rewrite

This is a major release with significant architectural improvements and new features. The library has been completely rewritten to support complex multi-form scenarios while maintaining backward compatibility where possible.

### ✨ Added

#### Core Features
- **Multi-Form Support** - Manage dynamic fields across multiple forms simultaneously
- **Multiple Groups per Form** - Support for different field groups within the same form
- **Enhanced Event System** - Comprehensive event callbacks for field operations
- **Instance Management** - Better handling of multiple library instances
- **Debug Mode** - Configurable logging for development and troubleshooting

#### Configuration Options
- `formId` - Target specific forms by ID
- `groupName` - Support for named field groups (replaces generic grouping)
- `hideRemoveButtonWhenMinReached` - Control remove button visibility
- `enableDebugLogging` - Toggle debug output
- `validateOnAdd` - Optional field validation before adding new fields

#### Event Callbacks
- `onFieldAdded` - Triggered when a field is added
- `onFieldRemoved` - Triggered when a field is removed
- `onMaxFieldsReached` - Triggered when maximum fields limit is reached
- `onMinFieldsReached` - Triggered when minimum fields limit is reached

#### API Methods
- `getFieldCount()` - Get current number of fields
- `getInstanceId()` - Get unique instance identifier
- `updateConfig()` - Update configuration at runtime
- `destroy()` - Clean up instance and event listeners
- `DynamicFields.createMultiple()` - Static method to create multiple instances

### 🔄 Changed

#### Breaking Changes
- **Attribute Names** - Changed from `data-group` to `data-group-name` for better clarity
- **Button Classes** - Changed from `[data-add-btn]` to `.add-field-btn` and `[data-remove-btn]` to `.remove-field-btn`
- **Field Naming** - Enhanced field naming convention with group-aware prefixes
- **Initialization** - Improved initialization process with better error handling

#### Improvements
- **Performance** - Significantly improved performance with better DOM manipulation
- **Memory Management** - Better cleanup and memory usage optimization
- **Error Handling** - Enhanced error reporting and validation
- **Code Organization** - Modular architecture with clear separation of concerns
- **Documentation** - Comprehensive inline documentation and JSDoc comments

### 🐛 Fixed
- Fixed issues with field removal in complex scenarios
- Resolved memory leaks in single-page applications
- Fixed button state management edge cases
- Improved cross-browser compatibility
- Fixed field validation timing issues

### 📁 Project Structure
- Reorganized project with proper directory structure
- Moved main library to `src/dynamic-fields.js`
- Organized usage examples in `snippets/` directory
- Comprehensive test scenarios in `tests/` directory
- Added proper build and development tools

### 🔧 Development
- Added `package.json` with proper metadata and scripts
- Created comprehensive test suite with multiple scenarios
- Added development server for testing
- Implemented proper version control with `.gitignore`
- Added MIT license for open-source usage

---

## [2.0.0] - 2023-XX-XX

### Added
- Enhanced field management capabilities
- Improved animation system
- Better form validation integration
- Cross-browser compatibility improvements

### Changed
- Refactored core architecture for better performance
- Updated API for more intuitive usage
- Improved error handling and logging

### Fixed
- Various bug fixes and stability improvements
- Memory leak fixes
- Cross-browser compatibility issues

---

## [1.0.0] - 2023-XX-XX

### Added
- Initial release of DynamicFields library
- Basic add/remove field functionality
- Simple configuration options
- Event system for field operations
- Basic validation support

### Features
- Dynamic field addition and removal
- Configurable field limits (min/max)
- Animation support
- Basic event callbacks
- Form integration

---

## Migration Guide

### From v2.x to v3.0

#### HTML Changes Required

**Old (v2.x):**
```html
<div data-field-group data-group="education">
    <!-- fields -->
</div>
<button data-add-btn data-group="education">Add</button>
<button data-remove-btn data-group="education">Remove</button>
```

**New (v3.0):**
```html
<div class="field-group" data-group-name="education">
    <!-- fields -->
</div>
<button class="add-field-btn">Add</button>
<button class="remove-field-btn">Remove</button>
```

#### JavaScript Changes Required

**Old (v2.x):**
```javascript
const fields = new DynamicFields({
    maxFields: 5,
    group: 'education'
});
```

**New (v3.0):**
```javascript
const fields = new DynamicFields({
    maxFields: 5,
    groupName: 'education',
    formId: 'my-form'  // Optional: target specific form
});
```

#### Event System Changes

**Old (v2.x):**
```javascript
fields.onFieldAdded = function(count) {
    console.log('Fields:', count);
};
```

**New (v3.0):**
```javascript
fields.on('fieldAdded', function(event) {
    console.log('Field added:', event.totalFields);
});

// Or use configuration callbacks
const fields = new DynamicFields({
    onFieldAdded: function(newField, fieldCount) {
        console.log('Field added:', fieldCount);
    }
});
```

### Benefits of Upgrading

1. **Multi-Form Support** - Manage fields across multiple forms
2. **Better Performance** - Improved DOM manipulation and memory usage
3. **Enhanced Debugging** - Better error reporting and debug tools
4. **More Flexible** - Support for complex form scenarios
5. **Better Documentation** - Comprehensive guides and examples
6. **Active Development** - Regular updates and community support

---

## Support

- 📖 [Documentation](README.md)
- 🐛 [Issue Tracker](https://github.com/yourusername/dynamic-fields/issues)
- 💬 [Discussions](https://github.com/yourusername/dynamic-fields/discussions)

For questions about upgrading or migration, please check our documentation or open an issue on GitHub.