// GitHub Comments API helper

const API_BASE = '/.netlify/functions'

// Fetch all comments from GitHub Issues
export async function fetchComments() {
  try {
    const response = await fetch(`${API_BASE}/get-comments`)
    if (!response.ok) {
      throw new Error(`Failed to fetch comments: ${response.status}`)
    }
    return await response.json()
  } catch (error) {
    console.error('Error fetching comments:', error)
    return {}
  }
}

// Add a new comment
export async function addComment({ key, name, text, issueNumber }) {
  try {
    const response = await fetch(`${API_BASE}/add-comment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ key, name, text, issueNumber })
    })
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || `Failed to add comment: ${response.status}`)
    }
    
    return await response.json()
  } catch (error) {
    console.error('Error adding comment:', error)
    throw error
  }
}
