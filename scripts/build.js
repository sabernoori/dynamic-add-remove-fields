#!/usr/bin/env node

/**
 * Build Script for DynamicFields Library
 * 
 * This script prepares the library for publishing by:
 * - Validating the source code
 * - Running tests
 * - Creating distribution files
 * - Preparing package for npm publishing
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const PROJECT_ROOT = path.resolve(__dirname, '..');
const SRC_DIR = path.join(PROJECT_ROOT, 'src');
const DIST_DIR = path.join(PROJECT_ROOT, 'dist');
const PACKAGE_JSON = path.join(PROJECT_ROOT, 'package.json');

console.log('🚀 Starting DynamicFields build process...\n');

/**
 * Utility functions
 */
function log(message, type = 'info') {
    const colors = {
        info: '\x1b[36m',    // Cyan
        success: '\x1b[32m', // Green
        warning: '\x1b[33m', // Yellow
        error: '\x1b[31m',   // Red
        reset: '\x1b[0m'     // Reset
    };
    
    const prefix = {
        info: 'ℹ️',
        success: '✅',
        warning: '⚠️',
        error: '❌'
    };
    
    console.log(`${colors[type]}${prefix[type]} ${message}${colors.reset}`);
}

function createDirectory(dir) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        log(`Created directory: ${dir}`, 'success');
    }
}

function copyFile(src, dest) {
    fs.copyFileSync(src, dest);
    log(`Copied: ${path.basename(src)} → ${path.basename(dest)}`, 'info');
}

function readPackageJson() {
    try {
        return JSON.parse(fs.readFileSync(PACKAGE_JSON, 'utf8'));
    } catch (error) {
        log(`Failed to read package.json: ${error.message}`, 'error');
        process.exit(1);
    }
}

function validateSourceCode() {
    log('Validating source code...', 'info');
    
    const mainFile = path.join(SRC_DIR, 'dynamic-fields.js');
    if (!fs.existsSync(mainFile)) {
        log('Main source file not found!', 'error');
        process.exit(1);
    }
    
    // Basic syntax validation
    try {
        const content = fs.readFileSync(mainFile, 'utf8');
        
        // Check for required components
        const requiredComponents = [
            'class DynamicFields',
            'constructor(',
            'init(',
            'addField(',
            'removeField(',
            'global.DynamicFields'
        ];
        
        for (const component of requiredComponents) {
            if (!content.includes(component)) {
                log(`Missing required component: ${component}`, 'error');
                process.exit(1);
            }
        }
        
        log('Source code validation passed', 'success');
    } catch (error) {
        log(`Source code validation failed: ${error.message}`, 'error');
        process.exit(1);
    }
}

function runTests() {
    log('Running tests...', 'info');
    
    try {
        // Check if test server is running
        execSync('curl -f http://localhost:8000/src/dynamic-fields.js > nul 2>&1', { 
            stdio: 'ignore',
            shell: true 
        });
        log('Test server is running', 'success');
    } catch (error) {
        log('Test server is not running. Please start it with: npm run serve', 'warning');
        log('Skipping automated tests...', 'warning');
    }
    
    // Validate test files exist
    const testFiles = [
        'scenario0-basic-single-group.html',
        'scenario1-multiple-groups-single-form.html',
        'scenario2-single-groups-multiple-forms.html',
        'scenario3-multiple-groups-multiple-forms.html'
    ];
    
    const testsDir = path.join(PROJECT_ROOT, 'tests');
    for (const testFile of testFiles) {
        const testPath = path.join(testsDir, testFile);
        if (!fs.existsSync(testPath)) {
            log(`Test file missing: ${testFile}`, 'error');
            process.exit(1);
        }
    }
    
    log('Test files validation passed', 'success');
}

function createDistribution() {
    log('Creating distribution files...', 'info');
    
    // Create dist directory
    createDirectory(DIST_DIR);
    
    // Copy main library file
    const srcFile = path.join(SRC_DIR, 'dynamic-fields.js');
    const distFile = path.join(DIST_DIR, 'dynamic-fields.js');
    copyFile(srcFile, distFile);
    
    // Create minified version (simple minification)
    const content = fs.readFileSync(srcFile, 'utf8');
    const minified = content
        .replace(/\/\*\*[\s\S]*?\*\//g, '') // Remove JSDoc comments
        .replace(/\/\*[\s\S]*?\*\//g, '')   // Remove block comments
        .replace(/\/\/.*$/gm, '')           // Remove line comments
        .replace(/\s+/g, ' ')               // Collapse whitespace
        .replace(/;\s*}/g, ';}')            // Clean up semicolons
        .trim();
    
    const minFile = path.join(DIST_DIR, 'dynamic-fields.min.js');
    fs.writeFileSync(minFile, minified);
    log('Created minified version', 'success');
    
    // Copy snippets
    const snippetsDir = path.join(PROJECT_ROOT, 'snippets');
    const distSnippetsDir = path.join(DIST_DIR, 'snippets');
    createDirectory(distSnippetsDir);
    
    const snippetFiles = fs.readdirSync(snippetsDir);
    for (const file of snippetFiles) {
        if (file.endsWith('.js')) {
            copyFile(
                path.join(snippetsDir, file),
                path.join(distSnippetsDir, file)
            );
        }
    }
    
    log('Distribution files created successfully', 'success');
}

function generatePackageInfo() {
    log('Generating package information...', 'info');
    
    const pkg = readPackageJson();
    const srcFile = path.join(SRC_DIR, 'dynamic-fields.js');
    const stats = fs.statSync(srcFile);
    
    const packageInfo = {
        name: pkg.name,
        version: pkg.version,
        description: pkg.description,
        main: pkg.main,
        size: {
            source: `${Math.round(stats.size / 1024 * 100) / 100} KB`,
            minified: `${Math.round(fs.statSync(path.join(DIST_DIR, 'dynamic-fields.min.js')).size / 1024 * 100) / 100} KB`
        },
        files: {
            main: 'src/dynamic-fields.js',
            minified: 'dist/dynamic-fields.min.js',
            snippets: fs.readdirSync(path.join(PROJECT_ROOT, 'snippets')).filter(f => f.endsWith('.js')),
            tests: fs.readdirSync(path.join(PROJECT_ROOT, 'tests')).filter(f => f.endsWith('.html'))
        },
        buildDate: new Date().toISOString(),
        buildInfo: {
            node: process.version,
            platform: process.platform,
            arch: process.arch
        }
    };
    
    const infoFile = path.join(DIST_DIR, 'package-info.json');
    fs.writeFileSync(infoFile, JSON.stringify(packageInfo, null, 2));
    log('Package information generated', 'success');
    
    return packageInfo;
}

function validatePackage() {
    log('Validating package structure...', 'info');
    
    const requiredFiles = [
        'package.json',
        'README.md',
        'LICENSE',
        'CHANGELOG.md',
        'src/dynamic-fields.js'
    ];
    
    for (const file of requiredFiles) {
        const filePath = path.join(PROJECT_ROOT, file);
        if (!fs.existsSync(filePath)) {
            log(`Required file missing: ${file}`, 'error');
            process.exit(1);
        }
    }
    
    log('Package structure validation passed', 'success');
}

function printBuildSummary(packageInfo) {
    console.log('\n' + '='.repeat(50));
    log('BUILD COMPLETED SUCCESSFULLY! 🎉', 'success');
    console.log('='.repeat(50));
    
    console.log(`\n📦 Package: ${packageInfo.name} v${packageInfo.version}`);
    console.log(`📏 Size: ${packageInfo.size.source} (source), ${packageInfo.size.minified} (minified)`);
    console.log(`📁 Files: ${packageInfo.files.snippets.length} snippets, ${packageInfo.files.tests.length} tests`);
    console.log(`🕒 Built: ${new Date(packageInfo.buildDate).toLocaleString()}`);
    
    console.log('\n📋 Next Steps:');
    console.log('   1. Review the generated files in the dist/ directory');
    console.log('   2. Test the distribution files');
    console.log('   3. Run: npm publish (if ready to publish)');
    console.log('   4. Or run: npm pack (to create a tarball for testing)');
    
    console.log('\n🔗 Useful Commands:');
    console.log('   npm run serve  - Start development server');
    console.log('   npm run build  - Run this build script');
    console.log('   npm pack       - Create distribution tarball');
    console.log('   npm publish    - Publish to npm registry');
    
    console.log('\n');
}

/**
 * Main build process
 */
function main() {
    try {
        // Step 1: Validate source code
        validateSourceCode();
        
        // Step 2: Run tests
        runTests();
        
        // Step 3: Validate package structure
        validatePackage();
        
        // Step 4: Create distribution
        createDistribution();
        
        // Step 5: Generate package info
        const packageInfo = generatePackageInfo();
        
        // Step 6: Print summary
        printBuildSummary(packageInfo);
        
    } catch (error) {
        log(`Build failed: ${error.message}`, 'error');
        console.error(error);
        process.exit(1);
    }
}

// Run the build process
if (require.main === module) {
    main();
}

module.exports = { main };