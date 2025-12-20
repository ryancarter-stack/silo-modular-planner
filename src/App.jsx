import { useState, useEffect } from 'react'
import { siloBase, categories, customerTypes, liteTypes, liteFunctions } from './data'
import { fetchComments, addComment as apiAddComment } from './github'
import './App.css'

// Helper function to format relative time
function formatTimeAgo(timestamp) {
  const seconds = Math.floor((Date.now() - timestamp) / 1000)
  
  if (seconds < 60) return 'just now'
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`
  
  return new Date(timestamp).toLocaleDateString()
}

function App() {
  const [viewMode, setViewMode] = useState('all') // 'all', 'core', or 'lite'
  const [activeCustomers, setActiveCustomers] = useState(new Set(['distributor']))
  const [selectedItem, setSelectedItem] = useState(null)
  const [modalType, setModalType] = useState(null)
  
  // Comments: { 'function:receiving': [{ name: 'Todd', text: 'comment', timestamp: 123, issueNumber: 1 }] }
  const [comments, setComments] = useState({})
  const [isLoadingComments, setIsLoadingComments] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Commenter name (persisted to localStorage)
  const [commenterName, setCommenterName] = useState('')
  
  // Current comment being typed
  const [newCommentText, setNewCommentText] = useState('')

  // Load comments from GitHub on mount
  useEffect(() => {
    loadComments()
  }, [])

  const loadComments = async () => {
    setIsLoadingComments(true)
    try {
      const data = await fetchComments()
      setComments(data)
    } catch (error) {
      console.error('Failed to load comments:', error)
    } finally {
      setIsLoadingComments(false)
    }
  }

  // Load commenter name from localStorage on mount
  useEffect(() => {
    const savedName = localStorage.getItem('silo-planner-name')
    if (savedName) {
      setCommenterName(savedName)
    }
  }, [])

  // Save commenter name to localStorage when it changes
  useEffect(() => {
    if (commenterName) {
      localStorage.setItem('silo-planner-name', commenterName)
    }
  }, [commenterName])

  const toggleCustomer = (customerId) => {
    setActiveCustomers(prev => {
      const next = new Set(prev)
      if (next.has(customerId)) {
        next.delete(customerId)
      } else {
        next.add(customerId)
      }
      return next
    })
  }

  const openModal = (item, type) => {
    setSelectedItem(item)
    setModalType(type)
    setNewCommentText('') // Clear comment input when opening new modal
  }

  const closeModal = () => {
    setSelectedItem(null)
    setModalType(null)
    setNewCommentText('')
  }

  // Generate comment key for current item
  const getCommentKey = () => {
    if (!selectedItem || !modalType) return null
    return `${modalType}:${selectedItem.id || selectedItem.name}`
  }

  // Add a new comment
  const addComment = async () => {
    const key = getCommentKey()
    if (!key || !newCommentText.trim() || !commenterName.trim()) return
    
    const commentText = newCommentText.trim()
    const name = commenterName.trim()
    
    // Optimistically update local state FIRST (instant feedback)
    const newComment = {
      name,
      text: commentText,
      timestamp: Date.now()
    }
    
    setComments(prev => ({
      ...prev,
      [key]: [...(prev[key] || []), newComment]
    }))
    
    setNewCommentText('')
    setIsSubmitting(true)
    
    try {
      // Get existing issue number if there's already a comment thread
      const existingComments = comments[key] || []
      const issueNumber = existingComments[0]?.issueNumber
      
      await apiAddComment({
        key,
        name,
        text: commentText,
        issueNumber
      })
      
      // Refresh comments from server to get accurate data (issue numbers, etc)
      setTimeout(loadComments, 1500)
    } catch (error) {
      // Roll back optimistic update on error
      setComments(prev => ({
        ...prev,
        [key]: (prev[key] || []).filter(c => c.timestamp !== newComment.timestamp)
      }))
      alert('Failed to add comment: ' + error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Get comments for current item
  const getCurrentComments = () => {
    const key = getCommentKey()
    return key ? (comments[key] || []) : []
  }

  // Count total comments
  const getCommentCount = () => {
    return Object.values(comments).reduce((sum, arr) => sum + arr.length, 0)
  }

  // Check if item has comments
  const hasComments = (type, id) => {
    const key = `${type}:${id}`
    return comments[key] && comments[key].length > 0
  }

  // Export comments as downloadable file
  const exportComments = () => {
    const timestamp = new Date().toISOString().split('T')[0]
    const commentEntries = Object.entries(comments).filter(([_, arr]) => arr && arr.length > 0)
    
    if (commentEntries.length === 0) {
      alert('No comments to export yet!')
      return
    }

    // Organize comments by type
    const organized = {
      base: [],
      customer: [],
      function: [],
      liteType: []
    }

    commentEntries.forEach(([key, commentArray]) => {
      const [type, id] = key.split(':')
      let name = id
      
      // Look up friendly names
      if (type === 'customer') {
        const ct = customerTypes.find(c => c.id === id)
        name = ct?.name || id
      } else if (type === 'function') {
        // Search all customer types for this function
        for (const ct of customerTypes) {
          const fn = ct.functions.find(f => f.id === id)
          if (fn) {
            name = fn.name
            break
          }
        }
        // Also check siloBase
        const baseFn = siloBase.functions.find(f => f.id === id)
        if (baseFn) name = baseFn.name
      } else if (type === 'liteType') {
        const lt = liteTypes.find(l => l.id === id)
        name = lt?.name || id
      }

      organized[type]?.push({ id, name, comments: commentArray })
    })

    // Generate formatted output
    let output = `SILO MODULAR ARCHITECTURE FEEDBACK\n`
    output += `Generated: ${timestamp}\n`
    output += `Total Comments: ${getCommentCount()}\n`
    output += `${'='.repeat(50)}\n\n`

    const formatSection = (title, items) => {
      if (items.length === 0) return ''
      let section = `${title}\n${'-'.repeat(30)}\n`
      items.forEach(({ name, comments: cmts }) => {
        section += `\n${name}:\n`
        cmts.forEach(c => {
          section += `  [${c.name} - ${new Date(c.timestamp).toLocaleString()}]\n`
          section += `  ${c.text}\n\n`
        })
      })
      return section
    }

    output += formatSection('SILO BASE', organized.base)
    output += formatSection('CUSTOMER SEGMENTS', organized.customer)
    output += formatSection('FUNCTIONS', organized.function)
    output += formatSection('LITE PORTAL TYPES', organized.liteType)

    // Create and download file
    const blob = new Blob([output], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `silo-architecture-feedback-${timestamp}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // Get lite type info for selected customers
  const getActiveLiteTypes = () => {
    const types = new Set()
    customerTypes
      .filter(ct => activeCustomers.has(ct.id))
      .forEach(ct => {
        ct.liteTypes?.forEach(lt => types.add(lt))
      })
    return Array.from(types).map(id => liteTypes.find(lt => lt.id === id))
  }

  // Get all Lite function IDs for comparison
  const getLiteFunctionIds = () => {
    const ids = new Set()
    const activeLiteTypeIds = getActiveLiteTypes().map(lt => lt?.id).filter(Boolean)
    activeLiteTypeIds.forEach(ltId => {
      liteFunctions[ltId]?.forEach(fn => ids.add(fn.id))
    })
    return ids
  }

  // Always get Core functions (for consistent layout)
  const getCoreFunctions = () => {
    const functions = new Map()
    customerTypes
      .filter(ct => activeCustomers.has(ct.id))
      .forEach(ct => {
        ct.functions.forEach(fn => {
          if (!functions.has(fn.id)) {
            functions.set(fn.id, { ...fn, customers: [ct.name] })
          } else {
            functions.get(fn.id).customers.push(ct.name)
          }
        })
      })
    return functions
  }

  const coreFunctions = getCoreFunctions()
  const liteFunctionIds = getLiteFunctionIds()

  // Check if a function is available in Lite mode
  const isAvailableInLite = (fnId) => {
    const liteFnNames = new Set()
    getActiveLiteTypes().forEach(lt => {
      if (lt) {
        liteFunctions[lt.id]?.forEach(fn => {
          liteFnNames.add(fn.name.toLowerCase())
        })
      }
    })
    
    const liteAvailableFunctions = new Set([
      'invoicing', 'ar-collections', 'ap-billpay', 'sales-orders', 'purchasing',
      'view-pos', 'view-invoices', 'view-statements', 'make-payments'
    ])
    
    return liteAvailableFunctions.has(fnId) || liteFunctionIds.has(fnId)
  }

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <div>
            <h1>Silo Modular Architecture Planner</h1>
            <p className="subtitle">Toggle customer types to see required functions</p>
          </div>
          <div className="header-actions">
            {isLoadingComments && <span className="loading-indicator">Loading comments...</span>}
            {getCommentCount() > 0 && (
              <button className="export-btn" onClick={exportComments}>
                📥 Export Feedback ({getCommentCount()})
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Silo Base - Always visible at top */}
      <section className="silo-base">
        <div 
          className="base-header"
          onClick={() => openModal(siloBase, 'base')}
        >
          <h2>🏗️ Silo Base</h2>
          <span className="badge">{siloBase.functions.length} functions</span>
          <span className="base-note">Foundation for all users</span>
        </div>
        <div className="base-functions">
          {siloBase.functions.map(fn => (
            <span 
              key={fn.id} 
              className={`function-chip base-chip ${hasComments('function', fn.id) ? 'has-comment' : ''}`}
              onClick={() => openModal(fn, 'function')}
            >
              {fn.name}
              {hasComments('function', fn.id) && <span className="comment-dot">💬</span>}
            </span>
          ))}
        </div>
      </section>

      {/* View Mode Toggle Bar */}
      <section className="mode-bar">
        <div className="view-toggle">
          <button 
            className={`toggle-btn ${viewMode === 'all' ? 'active' : ''}`}
            onClick={() => setViewMode('all')}
          >
            All
          </button>
          <button 
            className={`toggle-btn ${viewMode === 'core' ? 'active' : ''}`}
            onClick={() => setViewMode('core')}
          >
            <span className="toggle-icon">🏢</span>
            Silo Customer
          </button>
          <button 
            className={`toggle-btn ${viewMode === 'lite' ? 'active' : ''}`}
            onClick={() => setViewMode('lite')}
          >
            <span className="toggle-icon">🌐</span>
            Silo Lite
          </button>
        </div>
      </section>

      <div className="main-content">
        {/* Customer Type Toggles - Left Side */}
        <aside className="customer-panel">
          <h2>Customer Types</h2>
          {categories.map(cat => (
            <div key={cat.id} className="category-group">
              <h3 style={{ borderLeftColor: cat.color }}>{cat.name}</h3>
              {customerTypes
                .filter(ct => ct.category === cat.id)
                .map(ct => (
                  <label key={ct.id} className="customer-toggle">
                    <input
                      type="checkbox"
                      checked={activeCustomers.has(ct.id)}
                      onChange={() => toggleCustomer(ct.id)}
                    />
                    <span 
                      className={`customer-name ${hasComments('customer', ct.id) ? 'has-comment' : ''}`}
                      onClick={(e) => {
                        e.preventDefault()
                        openModal(ct, 'customer')
                      }}
                    >
                      {ct.name}
                      {hasComments('customer', ct.id) && <span className="comment-indicator">💬</span>}
                    </span>
                    <span className="function-count">
                      {ct.functions.length}
                    </span>
                  </label>
                ))}
            </div>
          ))}
        </aside>

        {/* Active Functions - Center */}
        <main className="functions-panel">
          <h2>
            {viewMode === 'all' && 'All Functions'}
            {viewMode === 'core' && 'Silo Customer Functions'}
            {viewMode === 'lite' && 'Silo Lite Functions'}
            <span className="badge">{coreFunctions.size} unique</span>
          </h2>
          
          {activeCustomers.size === 0 ? (
            <p className="empty-state">Select customer types to see required functions</p>
          ) : (
            <div className="functions-grid">
              {Array.from(coreFunctions.values())
                .sort((a, b) => (b.customers?.length || 0) - (a.customers?.length || 0))
                .map(fn => {
                  const availableInLite = isAvailableInLite(fn.id)
                  const itemHasComments = hasComments('function', fn.id)
                  
                  // Determine if greyed out based on view mode
                  let isGreyedOut = false
                  if (viewMode === 'core' && !fn.siloStatus) {
                    isGreyedOut = true
                  } else if (viewMode === 'lite' && !availableInLite) {
                    isGreyedOut = true
                  }
                  
                  return (
                    <div 
                      key={fn.id} 
                      className={`function-card ${isGreyedOut ? 'greyed-out' : ''} ${itemHasComments ? 'has-comment' : ''} ${viewMode !== 'all' ? (fn.siloStatus ? 'silo-does' : 'silo-doesnt') : ''}`}
                      onClick={() => openModal(fn, 'function')}
                    >
                      <div className="function-name">
                        {viewMode !== 'all' && (
                          <span className="silo-status-icon">{fn.siloStatus ? '✓' : '✗'}</span>
                        )}
                        {fn.name}
                        {itemHasComments && <span className="comment-dot">💬</span>}
                      </div>
                      <div className="function-customers">
                        {fn.customers?.length > 1 
                          ? `${fn.customers.length} customer types`
                          : fn.customers?.[0]
                        }
                      </div>
                    </div>
                  )
                })}
            </div>
          )}
        </main>

        {/* Stats Panel - Right Side */}
        <aside className="stats-panel">
          <h2>Summary</h2>
          <div className="stat">
            <div className="stat-value">{activeCustomers.size}</div>
            <div className="stat-label">Active Customer Types</div>
          </div>
          <div className="stat">
            <div className="stat-value">{coreFunctions.size}</div>
            <div className="stat-label">Core Functions</div>
          </div>
          <div className="stat">
            <div className="stat-value">{siloBase.functions.length}</div>
            <div className="stat-label">Base Functions</div>
          </div>
          <div className="stat">
            <div className="stat-value">{coreFunctions.size + siloBase.functions.length}</div>
            <div className="stat-label">Total Functions</div>
          </div>

          {coreFunctions.size > 0 && (
            <>
              <h3>Most Common Functions</h3>
              <div className="common-functions">
                {Array.from(coreFunctions.values())
                  .sort((a, b) => (b.customers?.length || 0) - (a.customers?.length || 0))
                  .slice(0, 5)
                  .map(fn => (
                    <div key={fn.id} className="common-function">
                      <span>{fn.name}</span>
                      <span className="count">{fn.customers?.length || 0}</span>
                    </div>
                  ))}
              </div>
            </>
          )}

          {getCommentCount() > 0 && (
            <>
              <h3>Feedback</h3>
              <div className="feedback-summary">
                <div className="feedback-count">{getCommentCount()} comments</div>
                <button className="export-btn-small" onClick={exportComments}>
                  Export
                </button>
              </div>
            </>
          )}
        </aside>
      </div>

      {/* Modal */}
      {selectedItem && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>×</button>
            
            {modalType === 'base' && (
              <>
                <h2>{selectedItem.name}</h2>
                <p className="modal-description">{selectedItem.description}</p>
                <h3>Functions</h3>
                <ul className="modal-list">
                  {selectedItem.functions.map(fn => (
                    <li key={fn.id}>
                      <strong>{fn.name}</strong>
                      <span>{fn.description}</span>
                    </li>
                  ))}
                </ul>
              </>
            )}

            {modalType === 'customer' && (
              <>
                <h2>{selectedItem.name}</h2>
                <p className="modal-description">{selectedItem.description}</p>
                <p className="modal-category">
                  Category: {categories.find(c => c.id === selectedItem.category)?.name}
                </p>
                <p className="modal-stat">
                  Core Functions: {selectedItem.functions.length}
                </p>
              </>
            )}

            {modalType === 'function' && (
              <>
                <h2>{selectedItem.name}</h2>
                <p className="modal-description">{selectedItem.description}</p>
              </>
            )}

            {modalType === 'liteType' && (
              <>
                <h2>{selectedItem.name}</h2>
                <p className="modal-description">{selectedItem.description}</p>
                <h3>Generic Lite Functions ({liteFunctions[selectedItem.id]?.length || 0})</h3>
                <p className="modal-note">
                  Note: These are generic portal functions. Actual availability may vary by segment.
                </p>
                <ul className="modal-list">
                  {liteFunctions[selectedItem.id]?.map(fn => (
                    <li key={fn.id}>
                      <strong>{fn.name}</strong>
                      <span>{fn.description}</span>
                    </li>
                  ))}
                </ul>
              </>
            )}

            {/* Comment Section - shown on all modals */}
            <div className="comment-section">
              <h3>💬 Feedback</h3>
              
              {/* Existing comments */}
              {getCurrentComments().length > 0 && (
                <div className="comments-list">
                  {getCurrentComments().map((comment, idx) => (
                    <div key={idx} className="comment-item">
                      <div className="comment-header">
                        <span className="comment-author">{comment.name}</span>
                        <span className="comment-time">{formatTimeAgo(comment.timestamp)}</span>
                      </div>
                      <div className="comment-text">{comment.text}</div>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Add new comment */}
              <div className="add-comment">
                <input
                  type="text"
                  className="name-input"
                  placeholder="Your name"
                  value={commenterName}
                  onChange={(e) => setCommenterName(e.target.value)}
                />
                <textarea
                  className="comment-input"
                  placeholder="Add your thoughts, questions, or suggestions..."
                  value={newCommentText}
                  onChange={(e) => setNewCommentText(e.target.value)}
                  rows={3}
                />
                <button 
                  className="add-comment-btn"
                  onClick={addComment}
                  disabled={!newCommentText.trim() || !commenterName.trim() || isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : 'Add Comment'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
