import { spawn } from 'child_process';
import path from 'path';

console.log('🚀 Starting CareerTrack Full-Stack Application...');

// Start Backend Server
const server = spawn('npm', ['run', 'start'], {
  cwd: path.resolve('server'),
  stdio: 'inherit',
  shell: true,
});

// Start Frontend Client
const client = spawn('npm', ['run', 'dev'], {
  cwd: path.resolve('client'),
  stdio: 'inherit',
  shell: true,
});

const handleExit = (code) => {
  console.log(`Child process exited with code ${code}`);
  server.kill();
  client.kill();
  process.exit();
};

server.on('close', handleExit);
client.on('close', handleExit);
