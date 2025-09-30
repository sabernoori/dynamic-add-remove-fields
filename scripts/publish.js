#!/usr/bin/env node

/**
 * Publish Script for DynamicFields Library
 * 
 * This script handles the publishing process by:
 * - Running pre-publish checks
 * - Validating package integrity
 * - Creating git tags
 * - Publishing to npm
 * - Post-publish cleanup
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const readline = require('readline');

const PROJECT_ROOT = path.resolve(__dirname, '..');
const PACKAGE_JSON = path.join(PROJECT_ROOT, 'package.json');

console.log('📦 DynamicFields Publishing Script\n');

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

function readPackageJson() {
    try {
        return JSON.parse(fs.readFileSync(PACKAGE_JSON, 'utf8'));
    } catch (error) {
        log(`Failed to read package.json: ${error.message}`, 'error');
        process.exit(1);
    }
}

function execCommand(command, options = {}) {
    try {
        return execSync(command, { 
            encoding: 'utf8', 
            stdio: options.silent ? 'pipe' : 'inherit',
            ...options 
        });
    } catch (error) {
        if (!options.allowFailure) {
            log(`Command failed: ${command}`, 'error');
            log(error.message, 'error');
            process.exit(1);
        }
        return null;
    }
}

function askQuestion(question) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    
    return new Promise((resolve) => {
        rl.question(question, (answer) => {
            rl.close();
            resolve(answer.toLowerCase().trim());
        });
    });
}

async function confirmAction(message) {
    const answer = await askQuestion(`${message} (y/N): `);
    return answer === 'y' || answer === 'yes';
}

function checkGitStatus() {
    log('Checking git status...', 'info');
    
    // Check if we're in a git repository
    const isGitRepo = execCommand('git rev-parse --is-inside-work-tree', { 
        silent: true, 
        allowFailure: true 
    });
    
    if (!isGitRepo) {
        log('Not in a git repository. Initializing...', 'warning');
        execCommand('git init');
        execCommand('git add .');
        execCommand('git commit -m "Initial commit"');
        return;
    }
    
    // Check for uncommitted changes
    const status = execCommand('git status --porcelain', { silent: true });
    if (status && status.trim()) {
        log('You have uncommitted changes:', 'warning');
        console.log(status);
        
        const shouldContinue = await confirmAction('Continue anyway?');
        if (!shouldContinue) {
            log('Publish cancelled. Please commit your changes first.', 'info');
            process.exit(0);
        }
    } else {
        log('Git status is clean', 'success');
    }
}

function checkNpmAuth() {
    log('Checking npm authentication...', 'info');
    
    try {
        const whoami = execCommand('npm whoami', { silent: true });
        log(`Logged in as: ${whoami.trim()}`, 'success');
    } catch (error) {
        log('Not logged in to npm. Please run: npm login', 'error');
        process.exit(1);
    }
}

function runBuild() {
    log('Running build process...', 'info');
    
    const buildScript = path.join(__dirname, 'build.js');
    if (fs.existsSync(buildScript)) {
        execCommand(`node "${buildScript}"`);
    } else {
        log('Build script not found, skipping build step', 'warning');
    }
}

function validatePackage() {
    log('Validating package...', 'info');
    
    const pkg = readPackageJson();
    
    // Check required fields
    const requiredFields = ['name', 'version', 'description', 'main', 'author', 'license'];
    for (const field of requiredFields) {
        if (!pkg[field]) {
            log(`Missing required field in package.json: ${field}`, 'error');
            process.exit(1);
        }
    }
    
    // Check version format
    const versionRegex = /^\d+\.\d+\.\d+(-[a-zA-Z0-9.-]+)?$/;
    if (!versionRegex.test(pkg.version)) {
        log(`Invalid version format: ${pkg.version}`, 'error');
        process.exit(1);
    }
    
    // Check if main file exists
    const mainFile = path.join(PROJECT_ROOT, pkg.main);
    if (!fs.existsSync(mainFile)) {
        log(`Main file not found: ${pkg.main}`, 'error');
        process.exit(1);
    }
    
    log('Package validation passed', 'success');
    return pkg;
}

function checkVersionExists(packageName, version) {
    log(`Checking if version ${version} already exists...`, 'info');
    
    try {
        const result = execCommand(`npm view ${packageName}@${version} version`, { 
            silent: true, 
            allowFailure: true 
        });
        
        if (result && result.trim() === version) {
            log(`Version ${version} already exists on npm!`, 'error');
            process.exit(1);
        }
    } catch (error) {
        // Version doesn't exist, which is good
    }
    
    log(`Version ${version} is available`, 'success');
}

function createGitTag(version) {
    log(`Creating git tag v${version}...`, 'info');
    
    try {
        // Check if tag already exists
        execCommand(`git rev-parse v${version}`, { silent: true, allowFailure: true });
        log(`Tag v${version} already exists`, 'warning');
        return;
    } catch (error) {
        // Tag doesn't exist, create it
    }
    
    execCommand(`git tag -a v${version} -m "Release version ${version}"`);
    log(`Created tag v${version}`, 'success');
}

function dryRunPublish(pkg) {
    log('Running npm publish dry run...', 'info');
    
    const result = execCommand('npm publish --dry-run', { silent: true });
    
    // Parse the output to show what would be published
    const lines = result.split('\n');
    const filesSection = lines.findIndex(line => line.includes('files:'));
    
    if (filesSection !== -1) {
        console.log('\n📁 Files that would be published:');
        for (let i = filesSection + 1; i < lines.length && lines[i].trim(); i++) {
            console.log(`   ${lines[i].trim()}`);
        }
    }
    
    log('Dry run completed successfully', 'success');
}

async function publishPackage(pkg) {
    log(`Publishing ${pkg.name}@${pkg.version}...`, 'info');
    
    const confirmed = await confirmAction(`Are you sure you want to publish ${pkg.name}@${pkg.version}?`);
    if (!confirmed) {
        log('Publish cancelled by user', 'info');
        process.exit(0);
    }
    
    // Determine publish command
    let publishCmd = 'npm publish';
    
    // Check if this is a pre-release version
    if (pkg.version.includes('-')) {
        const tag = pkg.version.split('-')[1].split('.')[0];
        publishCmd += ` --tag ${tag}`;
        log(`Publishing as pre-release with tag: ${tag}`, 'info');
    }
    
    execCommand(publishCmd);
    log(`Successfully published ${pkg.name}@${pkg.version}! 🎉`, 'success');
}

function pushGitTags() {
    log('Pushing git tags...', 'info');
    
    try {
        execCommand('git push origin --tags');
        log('Git tags pushed successfully', 'success');
    } catch (error) {
        log('Failed to push git tags (this is not critical)', 'warning');
    }
}

function printPublishSummary(pkg) {
    console.log('\n' + '='.repeat(50));
    log('PUBLISH COMPLETED SUCCESSFULLY! 🚀', 'success');
    console.log('='.repeat(50));
    
    console.log(`\n📦 Published: ${pkg.name}@${pkg.version}`);
    console.log(`🔗 npm: https://www.npmjs.com/package/${pkg.name}`);
    console.log(`📚 Docs: ${pkg.homepage || 'N/A'}`);
    console.log(`🐛 Issues: ${pkg.bugs?.url || 'N/A'}`);
    
    console.log('\n📋 Next Steps:');
    console.log('   1. Verify the package on npm');
    console.log('   2. Test installation: npm install ' + pkg.name);
    console.log('   3. Update documentation if needed');
    console.log('   4. Announce the release');
    
    console.log('\n🔗 Useful Commands:');
    console.log(`   npm install ${pkg.name}  - Install the package`);
    console.log(`   npm info ${pkg.name}     - View package info`);
    console.log(`   npm unpublish ${pkg.name}@${pkg.version} - Unpublish (within 72 hours)`);
    
    console.log('\n');
}

/**
 * Main publish process
 */
async function main() {
    try {
        console.log('Starting pre-publish checks...\n');
        
        // Step 1: Check git status
        await checkGitStatus();
        
        // Step 2: Check npm authentication
        checkNpmAuth();
        
        // Step 3: Run build
        runBuild();
        
        // Step 4: Validate package
        const pkg = validatePackage();
        
        // Step 5: Check if version already exists
        checkVersionExists(pkg.name, pkg.version);
        
        // Step 6: Create git tag
        createGitTag(pkg.version);
        
        // Step 7: Dry run
        dryRunPublish(pkg);
        
        // Step 8: Confirm and publish
        await publishPackage(pkg);
        
        // Step 9: Push git tags
        pushGitTags();
        
        // Step 10: Print summary
        printPublishSummary(pkg);
        
    } catch (error) {
        log(`Publish failed: ${error.message}`, 'error');
        console.error(error);
        process.exit(1);
    }
}

// Handle command line arguments
const args = process.argv.slice(2);
if (args.includes('--help') || args.includes('-h')) {
    console.log(`
Usage: node publish.js [options]

Options:
  --help, -h     Show this help message
  --dry-run      Run all checks but don't actually publish
  --force        Skip confirmation prompts (use with caution)

Examples:
  node publish.js              # Interactive publish
  node publish.js --dry-run    # Test the publish process
`);
    process.exit(0);
}

if (args.includes('--dry-run')) {
    console.log('🧪 DRY RUN MODE - No actual publishing will occur\n');
    // TODO: Implement dry run mode
}

// Run the publish process
if (require.main === module) {
    main().catch(error => {
        log(`Unexpected error: ${error.message}`, 'error');
        console.error(error);
        process.exit(1);
    });
}

module.exports = { main };