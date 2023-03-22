// Blockly canary publish script.
'use strict';

const fs = require('fs');
const path = require('path');
const {execSync} = require('child_process');

async function publish(){
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const originalPackageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  if(!packageJson.name.endsWith('-canary')){
    console.error('This script should only be run on canary packages')
    return;
  }
  const version = packageJson.version;
  packageJson.version = version + '-canary.' + Date.now()
  fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2))
  try{
    execSync('yarn publish --access public', {stdio: 'inherit'});
  }catch (e){
    console.error('Publish failed, reverting package.json')
  }
  fs.writeFileSync('package.json', JSON.stringify(originalPackageJson, null, 2))
}

setTimeout(publish,0)
