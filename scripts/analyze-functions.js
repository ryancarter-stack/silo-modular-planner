// Analyze Famous functions against Silo's Notion docs and codebase
// Run with: npm run analyze

import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const NOTION_API_KEY = process.env.NOTION_API_KEY;
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

// Paths
const DATA_DIR = path.join(__dirname, '../src/data');
const OUTPUT_FILE = path.join(DATA_DIR, 'analysis-results.json');
const SILO_GO_PATH = '/Users/ryan/Desktop/Silo/silo-go';
const SILO_WEB_PATH = '/Users/ryan/Desktop/Silo/silo-web';

// Rate limiting
const DELAY_MS = 1000; // 1 second between API calls
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Load all customer types and extract Famous functions
async function loadFamousFunctions() {
  const functions = [];
  
  const files = ['origin.js', 'midchain.js', 'demand.js', 'service.js'];
  
  for (const file of files) {
    const filePath = path.join(DATA_DIR, file);
    const module = await import(filePath);
    
    for (const [key, customerType] of Object.entries(module)) {
      if (customerType?.functions) {
        for (const func of customerType.functions) {
          if (func.famousStatus === true) {
            functions.push({
              customerType: customerType.name,
              customerTypeId: customerType.id,
              category: customerType.category,
              functionId: func.id,
              functionName: func.name,
              description: func.description,
              siloStatus: func.siloStatus
            });
          }
        }
      }
    }
  }
  
  return functions;
}

// Search Notion for a query
async function searchNotion(query) {
  try {
    const response = await fetch('https://api.notion.com/v1/search', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${NOTION_API_KEY}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query: query,
        page_size: 10
      })
    });
    
    if (!response.ok) {
      console.error(`Notion search failed for "${query}"`);
      return [];
    }
    
    const data = await response.json();
    
    return data.results.map(result => {
      // Extract title based on result type
      let title = '(untitled)';
      if (result.properties?.title?.title?.[0]?.plain_text) {
        title = result.properties.title.title[0].plain_text;
      } else if (result.properties?.Name?.title?.[0]?.plain_text) {
        title = result.properties.Name.title[0].plain_text;
      } else if (result.title?.[0]?.plain_text) {
        title = result.title[0].plain_text;
      }
      
      return {
        id: result.id,
        type: result.object,
        title: title,
        url: result.url,
        lastEdited: result.last_edited_time
      };
    });
  } catch (err) {
    console.error(`Notion search error for "${query}":`, err.message);
    return [];
  }
}

// Search codebase using grep
async function searchCodebase(query) {
  const { exec } = await import('child_process');
  const { promisify } = await import('util');
  const execAsync = promisify(exec);
  
  const results = { goFiles: [], webFiles: [] };
  
  // Simplify query for grep - use key terms
  const searchTerms = query.toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .split(/\s+/)
    .filter(t => t.length > 3)
    .slice(0, 3);
  
  if (searchTerms.length === 0) return results;
  
  const grepPattern = searchTerms.join('\\|');
  
  // Search silo-go
  try {
    const { stdout } = await execAsync(
      `grep -ril "${grepPattern}" --include="*.go" ${SILO_GO_PATH}/internal ${SILO_GO_PATH}/pkg 2>/dev/null | head -10`,
      { maxBuffer: 1024 * 1024 }
    );
    results.goFiles = stdout.trim().split('\n').filter(Boolean).map(f => f.replace(SILO_GO_PATH + '/', ''));
  } catch (err) {
    // grep returns exit code 1 if no matches
  }
  
  // Search silo-web
  try {
    const { stdout } = await execAsync(
      `grep -ril "${grepPattern}" --include="*.ts" --include="*.tsx" ${SILO_WEB_PATH}/src 2>/dev/null | head -10`,
      { maxBuffer: 1024 * 1024 }
    );
    results.webFiles = stdout.trim().split('\n').filter(Boolean).map(f => f.replace(SILO_WEB_PATH + '/', ''));
  } catch (err) {
    // grep returns exit code 1 if no matches
  }
  
  return results;
}

// Call Claude to synthesize findings
async function synthesizeWithClaude(func, notionResults, codeResults) {
  const prompt = `You are analyzing whether Silo (a produce ERP) can do what Famous Software does for a specific function.

**Function:** ${func.functionName}
**Customer Type:** ${func.customerType}
**Description:** ${func.description}
**Current Silo Status in our data:** ${func.siloStatus ? 'Yes' : 'No'}

**Notion Search Results (Silo's internal docs):**
${notionResults.length > 0 
  ? notionResults.map(r => `- "${r.title}" (${r.type}) - ${r.url}`).join('\n')
  : 'No relevant documentation found.'}

**Codebase Search Results:**
- Go backend files: ${codeResults.goFiles.length > 0 ? codeResults.goFiles.join(', ') : 'None found'}
- Web frontend files: ${codeResults.webFiles.length > 0 ? codeResults.webFiles.join(', ') : 'None found'}

Based on this information, provide a brief analysis (3-5 sentences) covering:
1. Does Silo appear to have this capability? (Yes/Partial/No/Unknown)
2. If there's code, what does it suggest about the implementation?
3. If there's documentation, what does it suggest about planning or status?
4. Any notable gaps or observations?

Keep it concise and factual. Start with the capability assessment.`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 500,
        messages: [{ role: 'user', content: prompt }]
      })
    });
    
    if (!response.ok) {
      const error = await response.json();
      console.error('Claude API error:', error);
      return 'Analysis failed - API error';
    }
    
    const data = await response.json();
    return data.content[0].text;
  } catch (err) {
    console.error('Claude synthesis error:', err.message);
    return 'Analysis failed - ' + err.message;
  }
}

// Main analysis loop
async function analyzeAll() {
  console.log('\n🔍 Loading Famous functions...\n');
  
  const functions = await loadFamousFunctions();
  console.log(`Found ${functions.length} functions with famousStatus: true\n`);
  
  // Load existing results if any
  let results = {};
  if (fs.existsSync(OUTPUT_FILE)) {
    results = JSON.parse(fs.readFileSync(OUTPUT_FILE, 'utf-8'));
    console.log(`Loaded ${Object.keys(results).length} existing results\n`);
  }
  
  const total = functions.length;
  let processed = 0;
  
  for (const func of functions) {
    const key = `${func.customerTypeId}:${func.functionId}`;
    
    // Skip if already analyzed
    if (results[key]) {
      console.log(`⏭️  [${++processed}/${total}] Skipping ${func.functionName} (${func.customerType}) - already analyzed`);
      continue;
    }
    
    console.log(`\n📊 [${++processed}/${total}] Analyzing: ${func.functionName} (${func.customerType})`);
    
    // Search Notion
    console.log('   Searching Notion...');
    const notionResults = await searchNotion(func.functionName);
    await sleep(DELAY_MS);
    
    // Search codebase
    console.log('   Searching codebase...');
    const codeResults = await searchCodebase(func.functionName);
    
    // Synthesize with Claude
    console.log('   Synthesizing with Claude...');
    const analysis = await synthesizeWithClaude(func, notionResults, codeResults);
    await sleep(DELAY_MS);
    
    // Store result
    results[key] = {
      ...func,
      notionResults: notionResults.slice(0, 5), // Keep top 5
      codeResults,
      analysis,
      analyzedAt: new Date().toISOString()
    };
    
    // Save after each to preserve progress
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(results, null, 2));
    console.log('   ✅ Saved');
  }
  
  console.log(`\n✅ Analysis complete! Results saved to ${OUTPUT_FILE}\n`);
  
  // Summary
  const values = Object.values(results);
  console.log('Summary:');
  console.log(`  Total analyzed: ${values.length}`);
  console.log(`  With Notion docs: ${values.filter(r => r.notionResults?.length > 0).length}`);
  console.log(`  With code found: ${values.filter(r => r.codeResults?.goFiles?.length > 0 || r.codeResults?.webFiles?.length > 0).length}`);
}

// Run
analyzeAll().catch(console.error);
