// Fetch all comments (GitHub Issues) from the repo
export async function handler(event) {
  const REPO_OWNER = 'ryancarter-stack'
  const REPO_NAME = 'silo-modular-planner'
  
  try {
    // Fetch open issues with the 'comment' label
    const issuesResponse = await fetch(
      `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/issues?state=open&labels=comment&per_page=100`,
      {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'silo-modular-planner'
        }
      }
    )
    
    if (!issuesResponse.ok) {
      throw new Error(`GitHub API error: ${issuesResponse.status}`)
    }
    
    const issues = await issuesResponse.json()
    
    // Transform issues into our comment format
    // Issue title format: "type:id" (e.g., "function:receiving")
    // Issue body format: "**From:** Name\n\nComment text"
    const comments = {}
    
    for (const issue of issues) {
      const key = issue.title // e.g., "function:receiving"
      
      // Parse the main issue body
      const mainComment = parseCommentBody(issue.body, issue.created_at)
      
      // Initialize array if needed
      if (!comments[key]) {
        comments[key] = []
      }
      
      // Add main comment
      if (mainComment) {
        comments[key].push({
          ...mainComment,
          issueNumber: issue.number
        })
      }
      
      // Fetch replies (issue comments) if there are any
      if (issue.comments > 0) {
        const repliesResponse = await fetch(
          `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/issues/${issue.number}/comments`,
          {
            headers: {
              'Accept': 'application/vnd.github.v3+json',
              'User-Agent': 'silo-modular-planner'
            }
          }
        )
        
        if (repliesResponse.ok) {
          const replies = await repliesResponse.json()
          for (const reply of replies) {
            const replyComment = parseCommentBody(reply.body, reply.created_at)
            if (replyComment) {
              comments[key].push({
                ...replyComment,
                issueNumber: issue.number,
                isReply: true
              })
            }
          }
        }
      }
    }
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(comments)
    }
  } catch (error) {
    console.error('Error fetching comments:', error)
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ error: error.message })
    }
  }
}

// Parse comment body to extract name and text
// Format: "**From:** Name\n\nComment text"
function parseCommentBody(body, createdAt) {
  if (!body) return null
  
  const lines = body.split('\n')
  let name = 'Anonymous'
  let text = body
  
  // Check for "**From:** Name" format
  if (lines[0] && lines[0].startsWith('**From:**')) {
    name = lines[0].replace('**From:**', '').trim()
    text = lines.slice(2).join('\n').trim() // Skip the empty line after name
  }
  
  return {
    name,
    text,
    timestamp: new Date(createdAt).getTime()
  }
}
