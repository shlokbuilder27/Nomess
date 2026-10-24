const fs = require('fs');
const path = require('path');

console.log('=== RUNNING HOMEWORKNUKE VERIFICATION SUITE ===\n');

let passed = 0;
let failed = 0;

function assert(condition, testName) {
  if (condition) {
    console.log(`[PASS] ${testName}`);
    passed++;
  } else {
    console.error(`[FAIL] ${testName}`);
    failed++;
  }
}

// 1. Check Dist files
assert(fs.existsSync(path.join(__dirname, 'dist/main/main.js')), 'Main process compiled');
assert(fs.existsSync(path.join(__dirname, 'dist/main/preload.js')), 'Preload compiled');
assert(fs.existsSync(path.join(__dirname, 'dist/main/database.js')), 'Database compiled');
assert(fs.existsSync(path.join(__dirname, 'dist/main/gemini-service.js')), 'Gemini service compiled');

// 2. Check Renderer files
assert(fs.existsSync(path.join(__dirname, 'src/renderer/index.html')), 'Renderer index.html exists');
assert(fs.existsSync(path.join(__dirname, 'src/renderer/styles/globals.css')), 'globals.css exists');
assert(fs.existsSync(path.join(__dirname, 'src/renderer/styles/components.css')), 'components.css exists');
assert(fs.existsSync(path.join(__dirname, 'src/renderer/styles/space-bg.css')), 'space-bg.css exists');
assert(fs.existsSync(path.join(__dirname, 'src/renderer/styles/timer.css')), 'timer.css exists');
assert(fs.existsSync(path.join(__dirname, 'src/renderer/scripts/app.js')), 'app.js exists');
assert(fs.existsSync(path.join(__dirname, 'src/renderer/scripts/timer.js')), 'timer.js exists');
assert(fs.existsSync(path.join(__dirname, 'src/renderer/scripts/audio.js')), 'audio.js exists');
assert(fs.existsSync(path.join(__dirname, 'src/renderer/scripts/space-animation.js')), 'space-animation.js exists');

// 3. Check Assets
assert(fs.existsSync(path.join(__dirname, 'assets/icons/app-icon.svg')), '2D Astronaut SVG icon exists');
assert(fs.existsSync(path.join(__dirname, 'assets/icons/app-icon.png')), 'app-icon.png exists');
assert(fs.existsSync(path.join(__dirname, 'assets/icons/tray-icon.png')), 'tray-icon.png exists');
assert(fs.existsSync(path.join(__dirname, 'assets/space/astronaut.svg')), 'astronaut.svg exists');
assert(fs.existsSync(path.join(__dirname, 'assets/space/planet-1.svg')), 'planet-1.svg exists');
assert(fs.existsSync(path.join(__dirname, 'assets/space/asteroid.svg')), 'asteroid.svg exists');
assert(fs.existsSync(path.join(__dirname, 'assets/fonts/SpaceGrotesk-VariableFont_wght.ttf')), 'Space Grotesk font exists');
assert(fs.existsSync(path.join(__dirname, 'assets/fonts/Cagliostro-Regular.ttf')), 'Cagliostro font exists');

// 4. Test Gemini Service Heuristic Scheduling
const { GeminiService } = require('./dist/main/gemini-service');
const gemini = new GeminiService(process.env.GEMINI_API_KEY);

const dummyTasks = [
  { id: '1', subject: 'Mathematics', description: 'Exercise 4.2 Q1-15', taskType: 'problem-solving', estMinutes: 45, priority: 1, status: 'pending', createdAt: new Date().toISOString() },
  { id: '2', subject: 'Science', description: 'Life processes notes revision', taskType: 'memorization', estMinutes: 20, priority: 0, status: 'pending', createdAt: new Date().toISOString() },
  { id: '3', subject: 'English', description: 'Write 250-word essay on Technology', taskType: 'written', estMinutes: 30, priority: 0, status: 'pending', createdAt: new Date().toISOString() },
];

gemini.generateSchedule(dummyTasks).then((result) => {
  assert(Array.isArray(result.schedule) && result.schedule.length > 0, 'Schedule generator produces scheduled blocks');
  assert(result.totalWorkMinutes > 0, 'Total work minutes calculated correctly');
  assert(typeof result.aiBriefing === 'string' && result.aiBriefing.length > 0, 'AI tactical briefing present');
  console.log('\nAI Strategic Briefing Sample:\n"' + result.aiBriefing + '"\n');
  console.log(`Summary: ${passed} passed, ${failed} failed.`);
  if (failed > 0) process.exit(1);
  else process.exit(0);
}).catch((err) => {
  console.error('Gemini test error:', err);
  process.exit(1);
});
