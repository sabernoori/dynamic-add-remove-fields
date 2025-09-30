# Contributing to DynamicFields

Thank you for your interest in contributing to DynamicFields! This document provides guidelines and information for contributors.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Making Changes](#making-changes)
- [Testing](#testing)
- [Submitting Changes](#submitting-changes)
- [Coding Standards](#coding-standards)
- [Release Process](#release-process)

## Code of Conduct

By participating in this project, you agree to abide by our Code of Conduct:

- Be respectful and inclusive
- Focus on constructive feedback
- Help others learn and grow
- Maintain a professional and welcoming environment

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- Git
- A modern web browser for testing

### Fork and Clone

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/your-username/dynamic-fields.git
   cd dynamic-fields
   ```

3. Add the original repository as upstream:
   ```bash
   git remote add upstream https://github.com/original-owner/dynamic-fields.git
   ```

## Development Setup

1. Install dependencies (if any):
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run serve
   ```

3. Open your browser to `http://localhost:8000` to view test scenarios

## Making Changes

### Branch Naming

Create descriptive branch names:
- `feature/add-validation-support`
- `bugfix/fix-memory-leak`
- `docs/update-readme`
- `refactor/improve-performance`

### Commit Messages

Follow conventional commit format:
```
type(scope): description

[optional body]

[optional footer]
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

Examples:
```
feat(core): add support for custom validation rules
fix(events): resolve memory leak in event listeners
docs(readme): update installation instructions
```

## Testing

### Manual Testing

1. Start the development server:
   ```bash
   npm run serve
   ```

2. Test all scenarios in the `tests/` directory:
   - Basic single group functionality
   - Multiple groups on single form
   - Single groups on multiple forms
   - Multiple groups on multiple forms

3. Test in different browsers:
   - Chrome/Chromium
   - Firefox
   - Safari
   - Edge

### Test Checklist

Before submitting changes, ensure:

- [ ] All existing functionality works
- [ ] New features work as expected
- [ ] No console errors or warnings
- [ ] Code works in supported browsers
- [ ] Performance is not degraded
- [ ] Memory leaks are avoided

### Adding New Tests

When adding new features:

1. Create test HTML files in the `tests/` directory
2. Follow existing naming convention: `scenario{N}-{description}.html`
3. Include comprehensive test cases
4. Document expected behavior

## Submitting Changes

### Pull Request Process

1. Ensure your branch is up to date:
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. Run the build process:
   ```bash
   npm run build
   ```

3. Create a pull request with:
   - Clear title and description
   - Reference to related issues
   - Screenshots/GIFs for UI changes
   - Test results

### Pull Request Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Manual testing completed
- [ ] All scenarios tested
- [ ] Cross-browser testing done

## Checklist
- [ ] Code follows project standards
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No breaking changes (or documented)
```

## Coding Standards

### JavaScript Style

- Use ES6+ features appropriately
- Follow existing code style and patterns
- Use meaningful variable and function names
- Add JSDoc comments for public methods
- Avoid global variables
- Handle errors gracefully

### Code Organization

- Keep functions focused and small
- Use consistent indentation (2 spaces)
- Group related functionality
- Maintain backward compatibility when possible

### Documentation

- Update README.md for new features
- Add JSDoc comments for public APIs
- Update CHANGELOG.md
- Include code examples where helpful

### Performance Considerations

- Minimize DOM manipulations
- Use event delegation when appropriate
- Avoid memory leaks
- Consider performance impact of changes

## Release Process

### Version Numbering

We follow [Semantic Versioning](https://semver.org/):

- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes (backward compatible)

### Release Checklist

1. Update version in `package.json`
2. Update `CHANGELOG.md`
3. Run full test suite
4. Create release branch
5. Submit pull request
6. Tag release after merge
7. Publish to npm

## Getting Help

### Communication Channels

- GitHub Issues: Bug reports and feature requests
- GitHub Discussions: General questions and ideas
- Pull Request Comments: Code-specific discussions

### Documentation

- [README.md](README.md): Main documentation
- [CHANGELOG.md](CHANGELOG.md): Version history
- [API Documentation](README.md#api-reference): Detailed API reference

### Common Issues

**Build Failures:**
- Ensure Node.js version compatibility
- Check for syntax errors
- Verify all dependencies are installed

**Test Failures:**
- Start development server
- Check browser console for errors
- Verify test file paths are correct

**Performance Issues:**
- Profile code changes
- Check for memory leaks
- Test with large datasets

## Recognition

Contributors will be recognized in:
- CHANGELOG.md for significant contributions
- GitHub contributors list
- Release notes for major contributions

Thank you for contributing to DynamicFields! 🎉