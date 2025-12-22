// Test script to verify API connections
// Run with: node scripts/test-connections.js

import 'dotenv/config';

const NOTION_API_KEY = process.env.NOTION_API_KEY;
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

async function testNotion() {
  console.log('Testing Notion API...');
  
  try {
    const response = await fetch('https://api.notion.com/v1/users/me', {
      headers: {
        'Authorization': `Bearer ${NOTION_API_KEY}`,
        'Notion-Version': '2022-06-28'
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Notion connected:', data.name || data.type);
      return true;
    } else {
      const error = await response.json();
      console.log('❌ Notion error:', error.message);
      return false;
    }
  } catch (err) {
    console.log('❌ Notion error:', err.message);
    return false;
  }
}

async function testClaude() {
  console.log('Testing Claude API...');
  
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
        max_tokens: 100,
        messages: [{ role: 'user', content: 'Say "connected" and nothing else.' }]
      })
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Claude connected:', data.content[0].text);
      return true;
    } else {
      const error = await response.json();
      console.log('❌ Claude error:', error.error?.message || JSON.stringify(error));
      return false;
    }
  } catch (err) {
    console.log('❌ Claude error:', err.message);
    return false;
  }
}

async function testNotionSearch() {
  console.log('Testing Notion search...');
  
  try {
    const response = await fetch('https://api.notion.com/v1/search', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${NOTION_API_KEY}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query: 'inventory',
        page_size: 5
      })
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log(`✅ Notion search found ${data.results.length} results`);
      if (data.results.length > 0) {
        data.results.forEach((r, i) => {
          const title = r.properties?.title?.title?.[0]?.plain_text 
            || r.properties?.Name?.title?.[0]?.plain_text
            || r.title?.[0]?.plain_text
            || '(untitled)';
          console.log(`   ${i + 1}. ${title}`);
        });
      } else {
        console.log('   ⚠️  No results - make sure pages are shared with "Silo Analysis" integration');
      }
      return true;
    } else {
      const error = await response.json();
      console.log('❌ Notion search error:', error.message);
      return false;
    }
  } catch (err) {
    console.log('❌ Notion search error:', err.message);
    return false;
  }
}

async function main() {
  console.log('\n🔌 Testing API Connections\n');
  console.log('─'.repeat(40));
  
  await testNotion();
  console.log('');
  await testNotionSearch();
  console.log('');
  await testClaude();
  
  console.log('─'.repeat(40));
  console.log('\nDone!\n');
}

main();
