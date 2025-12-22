// Extract all Famous functions into a task list
// Run with: node scripts/extract-tasks.js

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, '../src/data');

async function extractTasks() {
  const tasks = [];
  const files = ['origin.js', 'midchain.js', 'demand.js', 'service.js'];
  
  for (const file of files) {
    const filePath = path.join(DATA_DIR, file);
    const module = await import(filePath);
    
    for (const [key, customerType] of Object.entries(module)) {
      if (customerType?.functions) {
        for (const func of customerType.functions) {
          if (func.famousStatus === true) {
            tasks.push({
              id: `${customerType.id}:${func.id}`,
              customerType: customerType.name,
              customerTypeId: customerType.id,
              category: customerType.category,
              functionId: func.id,
              functionName: func.name,
              description: func.description,
              siloStatus: func.siloStatus,
              analyzed: false
            });
          }
        }
      }
    }
  }
  
  // Save tasks
  const outputPath = path.join(DATA_DIR, 'analysis-tasks.json');
  fs.writeFileSync(outputPath, JSON.stringify(tasks, null, 2));
  console.log(`✅ Extracted ${tasks.length} Famous functions to ${outputPath}`);
  
  // Create empty results file if doesn't exist
  const resultsPath = path.join(DATA_DIR, 'analysis-results.json');
  if (!fs.existsSync(resultsPath)) {
    fs.writeFileSync(resultsPath, '{}');
    console.log(`✅ Created empty results file at ${resultsPath}`);
  }
  
  // Group by category for reference
  const byCategory = {};
  tasks.forEach(t => {
    byCategory[t.category] = byCategory[t.category] || [];
    byCategory[t.category].push(`${t.customerType}: ${t.functionName}`);
  });
  
  console.log('\nBy category:');
  Object.entries(byCategory).forEach(([cat, funcs]) => {
    console.log(`  ${cat}: ${funcs.length} functions`);
  });
}

extractTasks();
