import { useState, useEffect } from 'react'
import { siloBase, categories, customerTypes, liteTypes, liteFunctions } from './data'
import { fetchComments, addComment as apiAddComment } from './github'
import analysisResults from './data/analysis-results.json'
import './App.css'

// Mapping from app function IDs to analysis result keys
// This handles cases where Famous module names differ from our function IDs
const analysisKeyMap = {
  // Direct matches (function ID matches analysis key suffix)
  'labor-scheduling': 'grower:labor-scheduling',
  'harvest-recording': 'grower:harvest-recording',
  'cost-tracking': 'grower:cost-tracking',
  'sales-orders': 'grower:sales-orders',
  'invoicing': 'grower:invoicing',
  'ar-collections': 'grower:ar-collections',
  
  // Mapped from app function IDs to Famous module analysis keys
  'inventory-mgmt': 'grower:inventory',
  'inventory-raw': 'grower:inventory',
  'inventory-finished': 'grower:inventory',
  'purchasing': 'grower:purchase-orders',
  'ap-billpay': 'grower:accounts-payable',
  'shipping': 'grower:shipping',
  'shipping-logistics': 'grower:shipping',
  'logistics': 'grower:shipping',
  'repack-operations': 'grower:repacking',
  'repacking': 'grower:repacking',
  'pricing': 'grower:price-list',
  'grower-settlements': 'grower:grower-accounting',
  'lot-traceability': 'grower:grower-lots',
  'batch-tracking': 'grower:grower-lots',
  'receiving': 'grower:inventory',
  'waste-shrink': 'grower:inventory',
  'bom-recipes': 'grower:work-orders',
  'production-runs': 'grower:work-orders',
  'fx-hedging': 'grower:multiple-currency',
  'intl-logistics': 'grower:shipping',
  'cold-storage': 'grower:cold-storage-billing',
  'quality-inspection': 'grower:sales-office-inquiry',
  'quality-inbound': 'grower:sales-office-inquiry',
  'quality-grading': 'grower:sales-office-inquiry',
  'consignment-tracking': 'grower:grower-accounting',
  'labeling': 'grower:repacking',
  'packaging-labeling': 'grower:repacking',
  'cost-accounting': 'grower:cost-tracking',
  'cost-allocation': 'grower:cost-tracking',
  'claims-returns': 'grower:ar-collections',
  'customer-credit': 'grower:ar-collections',
  'reporting-analytics': 'grower:sales-office-inquiry',
  'deal-entry': 'grower:brokerage-system',
  'commission-tracking': 'grower:brokerage-system',
  'invoicing-commission': 'grower:brokerage-system',
}

// Helper to find analysis for a function
function findAnalysisForFunction(functionId, functionName) {
  // First try direct mapping
  if (analysisKeyMap[functionId]) {
    return analysisResults[analysisKeyMap[functionId]]
  }
  
  // Then try finding by exact function ID suffix match
  const exactKey = Object.keys(analysisResults).find(key => 
    key.endsWith(`:${functionId}`)
  )
  if (exactKey) {
    return analysisResults[exactKey]
  }
  
  // Finally try fuzzy match by function name
  const normalizedName = functionName?.toLowerCase().replace(/[^a-z]/g, '')
  const fuzzyKey = Object.keys(analysisResults).find(key => {
    const analysis = analysisResults[key]
    const analysisName = analysis.functionName?.toLowerCase().replace(/[^a-z]/g, '')
    return analysisName === normalizedName
  })
  if (fuzzyKey) {
    return analysisResults[fuzzyKey]
  }
  
  return null
}

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
  const [viewModes, setViewModes] = useState(new Set(['all'])) // Can select multiple: 'all', 'core', 'lite', 'famous'
  const [activeCustomers, setActiveCustomers] = useState(new Set(['distributor']))
  const [selectedItem, setSelectedItem] = useState(null)
  const [modalType, setModalType] = useState(null)
  const [showCustomerPanel, setShowCustomerPanel] = useState(false) // Mobile toggle
  
  // Comments
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

  const toggleViewMode = (mode) => {
    setViewModes(prev => {
      const next = new Set(prev)
      
      // 'all' clears everything else
      if (mode === 'all') {
        return new Set(['all'])
      }
      
      // Remove 'all' when selecting specific modes
      next.delete('all')
      
      // Toggle the mode
      if (next.has(mode)) {
        next.delete(mode)
        // If nothing selected, go back to 'all'
        if (next.size === 0) {
          return new Set(['all'])
        }
      } else {
        next.add(mode)
      }
      
      return next
    })
  }

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
    setNewCommentText('')
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
      const existingComments = comments[key] || []
      const issueNumber = existingComments[0]?.issueNumber
      
      await apiAddComment({
        key,
        name,
        text: commentText,
        issueNumber
      })
      
      setTimeout(loadComments, 1500)
    } catch (error) {
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

  // Check if item has comments
  const hasComments = (type, id) => {
    const key = `${type}:${id}`
    return comments[key] && comments[key].length > 0
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

  // Get Core functions with category info
  const getCoreFunctions = () => {
    const functions = new Map()
    customerTypes
      .filter(ct => activeCustomers.has(ct.id))
      .forEach(ct => {
        const category = categories.find(c => c.id === ct.category)
        ct.functions.forEach(fn => {
          if (!functions.has(fn.id)) {
            functions.set(fn.id, { 
              ...fn, 
              customers: [ct.name],
              customerIds: [ct.id],
              categories: [{ id: ct.category, color: category?.color, name: category?.name }]
            })
          } else {
            const existing = functions.get(fn.id)
            existing.customers.push(ct.name)
            existing.customerIds.push(ct.id)
            // Add category if not already present
            if (!existing.categories.find(c => c.id === ct.category)) {
              existing.categories.push({ id: ct.category, color: category?.color, name: category?.name })
            }
          }
        })
      })
    return functions
  }

  // Get Inputs from active customer types with category info
  const getInputs = () => {
    const inputs = new Map()
    customerTypes
      .filter(ct => activeCustomers.has(ct.id))
      .forEach(ct => {
        const category = categories.find(c => c.id === ct.category)
        ct.inputs?.forEach(inp => {
          if (!inputs.has(inp.id)) {
            inputs.set(inp.id, { 
              ...inp, 
              customers: [ct.name],
              categories: [{ id: ct.category, color: category?.color, name: category?.name }]
            })
          } else {
            const existing = inputs.get(inp.id)
            existing.customers.push(ct.name)
            if (!existing.categories.find(c => c.id === ct.category)) {
              existing.categories.push({ id: ct.category, color: category?.color, name: category?.name })
            }
          }
        })
      })
    return inputs
  }

  // Get Outputs from active customer types with category info
  const getOutputs = () => {
    const outputs = new Map()
    customerTypes
      .filter(ct => activeCustomers.has(ct.id))
      .forEach(ct => {
        const category = categories.find(c => c.id === ct.category)
        ct.outputs?.forEach(out => {
          if (!outputs.has(out.id)) {
            outputs.set(out.id, { 
              ...out, 
              customers: [ct.name],
              categories: [{ id: ct.category, color: category?.color, name: category?.name }]
            })
          } else {
            const existing = outputs.get(out.id)
            existing.customers.push(ct.name)
            if (!existing.categories.find(c => c.id === ct.category)) {
              existing.categories.push({ id: ct.category, color: category?.color, name: category?.name })
            }
          }
        })
      })
    return outputs
  }

  const coreFunctions = getCoreFunctions()
  const inputs = getInputs()
  const outputs = getOutputs()
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
            <h1>Silo Modular Architecture</h1>
            <p className="subtitle">Toggle customer types to see required functions</p>
          </div>
          {isLoadingComments && <span className="loading-indicator">Loading...</span>}
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
        </div>
        <div className="base-functions">
          {siloBase.functions.map(fn => {
            let chipClass = 'function-chip base-chip'
            if (hasComments('function', fn.id)) chipClass += ' has-comment'
            
            // Apply status styling based on view modes
            const showCore = viewModes.has('core')
            const showFamous = viewModes.has('famous')
            const showLite = viewModes.has('lite')
            
            if (showCore || showFamous || showLite) {
              if (showCore && fn.siloStatus) chipClass += ' has-silo'
              if (showFamous && fn.famousStatus) chipClass += ' has-famous'
              if (showLite) chipClass += ' has-lite' // Base functions assumed available in lite
              
              const matchesAny = 
                (showCore && fn.siloStatus) || 
                (showFamous && fn.famousStatus) || 
                showLite
              if (!matchesAny) chipClass += ' greyed-out'
            }
            
            return (
              <span 
                key={fn.id} 
                className={chipClass}
                onClick={() => openModal(fn, 'function')}
              >
                {fn.name}
                {hasComments('function', fn.id) && <span className="comment-dot">💬</span>}
              </span>
            )
          })}
        </div>
      </section>

      {/* View Mode Toggle Bar */}
      <section className="mode-bar">
        <div className="view-toggle">
          <button 
            className={`toggle-btn ${viewModes.has('all') ? 'active' : ''}`}
            onClick={() => toggleViewMode('all')}
          >
            All
          </button>
          <button 
            className={`toggle-btn ${viewModes.has('core') ? 'active' : ''}`}
            onClick={() => toggleViewMode('core')}
          >
            <span className="toggle-icon">🏢</span>
            <span className="toggle-text">Silo</span>
          </button>
          <button 
            className={`toggle-btn ${viewModes.has('famous') ? 'active' : ''}`}
            onClick={() => toggleViewMode('famous')}
          >
            <span className="toggle-icon">🏆</span>
            <span className="toggle-text">Famous</span>
          </button>
          <button 
            className={`toggle-btn ${viewModes.has('lite') ? 'active' : ''}`}
            onClick={() => toggleViewMode('lite')}
          >
            <span className="toggle-icon">🌐</span>
            <span className="toggle-text">Lite</span>
          </button>
        </div>
        
        {/* Mobile toggle for customer panel */}
        <button 
          className="mobile-menu-btn"
          onClick={() => setShowCustomerPanel(!showCustomerPanel)}
        >
          {showCustomerPanel ? '✕ Close' : '☰ Segments'} ({activeCustomers.size})
        </button>
      </section>

      <div className="main-content">
        {/* Customer Type Toggles - Left Side */}
        <aside className={`customer-panel ${showCustomerPanel ? 'show' : ''}`}>
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

        {/* Overlay for mobile */}
        {showCustomerPanel && (
          <div className="mobile-overlay" onClick={() => setShowCustomerPanel(false)} />
        )}

        {/* Active Functions - Center/Main */}
        <main className="functions-panel">
          {/* Inputs Section */}
          <section className="flow-section inputs-section">
            <h2>
              <span className="flow-icon">→</span>
              Inputs
              {inputs.size > 0 && <span className="badge">{inputs.size}</span>}
            </h2>
            <div className="flow-content">
              {activeCustomers.size === 0 || inputs.size === 0 ? (
                <p className="placeholder-text">Select customer types to see inputs</p>
              ) : (
                <div className="flow-chips">
                  {Array.from(inputs.values()).map(inp => (
                    <span
                      key={inp.id}
                      className={`flow-chip input-chip ${hasComments('input', inp.id) ? 'has-comment' : ''}`}
                      onClick={() => openModal(inp, 'input')}
                    >
                      {inp.name}
                      {hasComments('input', inp.id) && <span className="comment-dot">💬</span>}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* Functions Section */}
          <section className="flow-section functions-section">
            <h2>
              <span className="flow-icon">⚙️</span>
              Functions
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
                  
                  let isGreyedOut = false
                  let statusClasses = []
                  
                  // Multi-select logic for view modes
                  const showCore = viewModes.has('core')
                  const showFamous = viewModes.has('famous')
                  const showLite = viewModes.has('lite')
                  
                  if (showCore || showFamous || showLite) {
                    const hasSilo = fn.siloStatus
                    const hasFamous = fn.famousStatus
                    const hasLite = availableInLite
                    
                    // Build status classes based on what's selected
                    if (showCore && hasSilo) statusClasses.push('has-silo')
                    if (showFamous && hasFamous) statusClasses.push('has-famous')
                    if (showLite && hasLite) statusClasses.push('has-lite')
                    
                    // Grey out if none of the selected modes match
                    const matchesAny = 
                      (showCore && hasSilo) || 
                      (showFamous && hasFamous) || 
                      (showLite && hasLite)
                    isGreyedOut = !matchesAny
                  }
                  
                  return (
                    <div 
                      key={fn.id} 
                      className={`function-card ${isGreyedOut ? 'greyed-out' : ''} ${itemHasComments ? 'has-comment' : ''} ${statusClasses.join(' ')}`}
                      onClick={() => openModal(fn, 'function')}
                    >
                      <div className="function-name">
                        {fn.name}
                        {itemHasComments && <span className="comment-dot">💬</span>}
                      </div>
                      <div className="function-meta">
                        <span className="function-customers">
                          {fn.customers?.length > 1 
                            ? `${fn.customers.length} types`
                            : fn.customers?.[0]
                          }
                        </span>
                      </div>
                    </div>
                  )
                })}
            </div>
          )}
          </section>

          {/* Outputs Section */}
          <section className="flow-section outputs-section">
            <h2>
              <span className="flow-icon">←</span>
              Outputs
              {outputs.size > 0 && <span className="badge">{outputs.size}</span>}
            </h2>
            <div className="flow-content">
              {activeCustomers.size === 0 || outputs.size === 0 ? (
                <p className="placeholder-text">Select customer types to see outputs</p>
              ) : (
                <div className="flow-chips">
                  {Array.from(outputs.values()).map(out => (
                    <span
                      key={out.id}
                      className={`flow-chip output-chip ${hasComments('output', out.id) ? 'has-comment' : ''}`}
                      onClick={() => openModal(out, 'output')}
                    >
                      {out.name}
                      {hasComments('output', out.id) && <span className="comment-dot">💬</span>}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </section>
        </main>
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
                
                {/* Status indicators */}
                <div className="status-badges">
                  <span className={`status-badge silo ${selectedItem.siloStatus ? 'available' : 'unavailable'}`}>
                    {selectedItem.siloStatus ? '✓' : '✗'} Silo
                  </span>
                  <span className={`status-badge famous ${selectedItem.famousStatus ? 'available' : 'unavailable'}`}>
                    {selectedItem.famousStatus ? '✓' : '✗'} Famous
                  </span>
                  <span className={`status-badge lite ${isAvailableInLite(selectedItem.id) ? 'available' : 'unavailable'}`}>
                    {isAvailableInLite(selectedItem.id) ? '✓' : '✗'} Lite
                  </span>
                </div>

                {/* Analysis Section */}
                {(() => {
                  // Find analysis using helper that tries multiple matching strategies
                  const analysis = findAnalysisForFunction(selectedItem.id, selectedItem.name)
                  
                  if (!analysis) return null
                  
                  return (
                    <div className="analysis-section">
                      <h3 className="analysis-header">
                        🔍 Analysis
                        <span className={`capability-badge capability-${analysis.capability.toLowerCase()}`}>
                          {analysis.capability}
                        </span>
                      </h3>
                      
                      <div className="analysis-content">
                        <p className="analysis-summary">{analysis.summary}</p>
                        
                        {analysis.notionFindings && (
                          <details className="analysis-details">
                            <summary>📄 Notion Findings</summary>
                            <p>{analysis.notionFindings}</p>
                            {analysis.notionLinks?.length > 0 && (
                              <ul className="notion-links">
                                {analysis.notionLinks.map((link, i) => (
                                  <li key={i}>
                                    <a href={link.url} target="_blank" rel="noopener noreferrer">
                                      {link.title}
                                    </a>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </details>
                        )}
                        
                        {analysis.codeFindings && (
                          <details className="analysis-details">
                            <summary>💻 Code Findings</summary>
                            <p>{analysis.codeFindings}</p>
                            {analysis.codeLocations?.length > 0 && (
                              <ul className="code-locations">
                                {analysis.codeLocations.map((loc, i) => (
                                  <li key={i}><code>{loc}</code></li>
                                ))}
                              </ul>
                            )}
                          </details>
                        )}
                      </div>
                    </div>
                  )
                })()}
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

            {modalType === 'input' && (
              <>
                <h2 className="modal-title-input">→ {selectedItem.name}</h2>
                <p className="modal-type-badge input">Input</p>
                <p className="modal-description">{selectedItem.description}</p>
                {selectedItem.customers?.length > 0 && (
                  <p className="modal-customers">
                    Used by: {selectedItem.customers.join(', ')}
                  </p>
                )}
              </>
            )}

            {modalType === 'output' && (
              <>
                <h2 className="modal-title-output">← {selectedItem.name}</h2>
                <p className="modal-type-badge output">Output</p>
                <p className="modal-description">{selectedItem.description}</p>
                {selectedItem.customers?.length > 0 && (
                  <p className="modal-customers">
                    Used by: {selectedItem.customers.join(', ')}
                  </p>
                )}
              </>
            )}

            {/* Comment Section */}
            <div className="comment-section">
              <h3>💬 Feedback</h3>
              
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
