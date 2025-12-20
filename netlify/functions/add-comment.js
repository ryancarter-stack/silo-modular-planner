// Add a new comment (create GitHub Issue or add reply)
export async function handler(event) {
  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    }
  }

  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      }
    }
  }

  const GITHUB_TOKEN = process.env.GITHUB_TOKEN
  const REPO_OWNER = 'ryancarter-stack'
  const REPO_NAME = 'silo-modular-planner'

  if (!GITHUB_TOKEN) {
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ error: 'GitHub token not configured' })
    }
  }

  try {
    const { key, name, text, issueNumber } = JSON.parse(event.body)

    if (!key || !name || !text) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ error: 'Missing required fields: key, name, text' })
      }
    }

    const commentBody = `**From:** ${name}\n\n${text}`

    let response

    if (issueNumber) {
      // Add reply to existing issue
      response = await fetch(
        `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/issues/${issueNumber}/comments`,
        {
          method: 'POST',
          headers: {
            'Accept': 'application/vnd.github.v3+json',
            'Authorization': `token ${GITHUB_TOKEN}`,
            'User-Agent': 'silo-modular-planner',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            body: commentBody
          })
        }
      )
    } else {
      // Check if an issue already exists for this key
      const searchResponse = await fetch(
        `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/issues?state=open&labels=comment&per_page=100`,
        {
          headers: {
            'Accept': 'application/vnd.github.v3+json',
            'Authorization': `token ${GITHUB_TOKEN}`,
            'User-Agent': 'silo-modular-planner'
          }
        }
      )

      const existingIssues = await searchResponse.json()
      const existingIssue = existingIssues.find(issue => issue.title === key)

      if (existingIssue) {
        // Add as a reply to existing issue
        response = await fetch(
          `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/issues/${existingIssue.number}/comments`,
          {
            method: 'POST',
            headers: {
              'Accept': 'application/vnd.github.v3+json',
              'Authorization': `token ${GITHUB_TOKEN}`,
              'User-Agent': 'silo-modular-planner',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              body: commentBody
            })
          }
        )
      } else {
        // Create new issue
        response = await fetch(
          `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/issues`,
          {
            method: 'POST',
            headers: {
              'Accept': 'application/vnd.github.v3+json',
              'Authorization': `token ${GITHUB_TOKEN}`,
              'User-Agent': 'silo-modular-planner',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              title: key,
              body: commentBody,
              labels: ['comment']
            })
          }
        )
      }
    }

    if (!response.ok) {
      const errorData = await response.text()
      throw new Error(`GitHub API error: ${response.status} - ${errorData}`)
    }

    const result = await response.json()

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        success: true,
        issueNumber: result.number || issueNumber,
        id: result.id
      })
    }
  } catch (error) {
    console.error('Error adding comment:', error)
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
