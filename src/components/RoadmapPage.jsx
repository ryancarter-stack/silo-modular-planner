import { useState, useEffect, useRef, useCallback } from 'react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import './RoadmapPage.css'

// Default paths (fallback only)
const defaultPaths = [
  {
    id: 'personnel-labor',
    name: 'Personnel & Labor',
    color: '#4A90A4',
    initiatives: [
      {
        id: 'pet-tiger',
        name: 'Pet Tiger Integration',
        modules: [
          { id: 'pt-1', name: 'Systems Understanding', target: 'Q1 2026', notes: 'Document current architecture' },
        ]
      }
    ]
  }
]

// Sortable Module Item
function SortableModule({ module, onEdit, onDelete }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: module.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`roadmap-module ${isDragging ? 'dragging' : ''}`}
    >
      <div className="module-drag-handle" {...attributes} {...listeners}>
        ⋮⋮
      </div>
      <div className="module-content" onClick={() => onEdit(module)}>
        <div className="module-name">{module.name}</div>
        {module.target && <div className="module-target">{module.target}</div>}
        {module.notes && <div className="module-notes">{module.notes}</div>}
      </div>
      <button className="module-delete" onClick={(e) => { e.stopPropagation(); onDelete(module.id); }}>×</button>
    </div>
  )
}

// Sortable Initiative Block (contains modules)
function SortableInitiativeBlock({ initiative, pathId, onEditInitiative, onDeleteInitiative, onAddModule, onEditModule, onDeleteModule, onReorderModules }) {
  const [isCollapsed, setIsCollapsed] = useState(false)

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: initiative.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const moduleSensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleModuleDragEnd = (event) => {
    const { active, over } = event
    if (active.id !== over?.id) {
      const oldIndex = initiative.modules.findIndex(m => m.id === active.id)
      const newIndex = initiative.modules.findIndex(m => m.id === over.id)
      const newModules = arrayMove(initiative.modules, oldIndex, newIndex)
      onReorderModules(pathId, initiative.id, newModules)
    }
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`initiative-block ${isDragging ? 'dragging' : ''}`}
    >
      <div className="initiative-header">
        <div className="initiative-drag-handle" {...attributes} {...listeners}>
          ⋮⋮
        </div>
        <button 
          className="collapse-btn"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? '▶' : '▼'}
        </button>
        <h4 onClick={() => onEditInitiative(initiative)}>{initiative.name}</h4>
        <div className="initiative-actions">
          <span className="module-count">{initiative.modules.length}</span>
          <button 
            className="delete-initiative-btn" 
            onClick={() => onDeleteInitiative(pathId, initiative.id)}
            title="Delete initiative"
          >
            ×
          </button>
        </div>
      </div>

      {!isCollapsed && (
        <div className="initiative-modules">
          <DndContext
            sensors={moduleSensors}
            collisionDetection={closestCenter}
            onDragEnd={handleModuleDragEnd}
          >
            <SortableContext
              items={initiative.modules.map(m => m.id)}
              strategy={verticalListSortingStrategy}
            >
              {initiative.modules.map((module) => (
                <SortableModule
                  key={module.id}
                  module={module}
                  onEdit={(mod) => onEditModule(pathId, initiative.id, mod)}
                  onDelete={(moduleId) => onDeleteModule(pathId, initiative.id, moduleId)}
                />
              ))}
            </SortableContext>
          </DndContext>

          <button
            className="add-module-btn"
            onClick={() => onAddModule(pathId, initiative.id)}
          >
            + Add Module
          </button>
        </div>
      )}
    </div>
  )
}

// Path Lane (contains initiatives)
function PathLane({ path, onUpdatePath, onDeletePath, onAddInitiative, onEditInitiative, onDeleteInitiative, onAddModule, onEditModule, onDeleteModule, onReorderModules, onReorderInitiatives }) {
  const [isEditingName, setIsEditingName] = useState(false)
  const [editName, setEditName] = useState(path.name)

  const initiativeSensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleInitiativeDragEnd = (event) => {
    const { active, over } = event
    if (active.id !== over?.id) {
      const oldIndex = path.initiatives.findIndex(i => i.id === active.id)
      const newIndex = path.initiatives.findIndex(i => i.id === over.id)
      const newInitiatives = arrayMove(path.initiatives, oldIndex, newIndex)
      onReorderInitiatives(path.id, newInitiatives)
    }
  }

  const handleNameSave = () => {
    onUpdatePath(path.id, { name: editName })
    setIsEditingName(false)
  }

  const totalModules = path.initiatives.reduce((sum, init) => sum + init.modules.length, 0)

  return (
    <div className="path-lane" style={{ '--lane-color': path.color }}>
      <div className="lane-header">
        {isEditingName ? (
          <div className="lane-name-edit">
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleNameSave()}
              autoFocus
            />
            <button onClick={handleNameSave}>✓</button>
            <button onClick={() => setIsEditingName(false)}>✗</button>
          </div>
        ) : (
          <h3 onClick={() => setIsEditingName(true)}>{path.name}</h3>
        )}
        <div className="lane-actions">
          <span className="lane-stats">{path.initiatives.length} initiatives · {totalModules} modules</span>
          <input
            type="color"
            value={path.color}
            onChange={(e) => onUpdatePath(path.id, { color: e.target.value })}
            title="Change color"
          />
          <button onClick={() => onDeletePath(path.id)} title="Delete path">🗑</button>
        </div>
      </div>

      <div className="lane-content">
        <DndContext
          sensors={initiativeSensors}
          collisionDetection={closestCenter}
          onDragEnd={handleInitiativeDragEnd}
        >
          <SortableContext
            items={path.initiatives.map(i => i.id)}
            strategy={verticalListSortingStrategy}
          >
            {path.initiatives.map((initiative) => (
              <SortableInitiativeBlock
                key={initiative.id}
                initiative={initiative}
                pathId={path.id}
                onEditInitiative={onEditInitiative}
                onDeleteInitiative={onDeleteInitiative}
                onAddModule={onAddModule}
                onEditModule={onEditModule}
                onDeleteModule={onDeleteModule}
                onReorderModules={onReorderModules}
              />
            ))}
          </SortableContext>
        </DndContext>

        <button
          className="add-initiative-btn"
          onClick={() => onAddInitiative(path.id)}
        >
          + Add Initiative
        </button>
      </div>

      <div className="lane-line" />
    </div>
  )
}

// Module Edit Modal
function ModuleModal({ module, onSave, onClose }) {
  const [name, setName] = useState(module?.name || '')
  const [target, setTarget] = useState(module?.target || '')
  const [notes, setNotes] = useState(module?.notes || '')

  const handleSave = () => {
    onSave({ ...module, name, target, notes })
    onClose()
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal roadmap-modal" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        <h2>{module?.id ? 'Edit Module' : 'Add Module'}</h2>
        
        <div className="form-group">
          <label>Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Module name"
            autoFocus
          />
        </div>

        <div className="form-group">
          <label>Target</label>
          <input
            type="text"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            placeholder="Q1 2026"
          />
        </div>

        <div className="form-group">
          <label>Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Additional details..."
            rows={3}
          />
        </div>

        <div className="modal-actions">
          <button className="btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={handleSave} disabled={!name.trim()}>
            Save
          </button>
        </div>
      </div>
    </div>
  )
}

// Initiative Edit Modal
function InitiativeModal({ initiative, onSave, onClose }) {
  const [name, setName] = useState(initiative?.name || '')

  const handleSave = () => {
    onSave({ ...initiative, name })
    onClose()
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal roadmap-modal" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        <h2>{initiative?.id ? 'Edit Initiative' : 'Add Initiative'}</h2>
        
        <div className="form-group">
          <label>Initiative Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Pet Tiger Integration"
            autoFocus
          />
        </div>

        <div className="modal-actions">
          <button className="btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={handleSave} disabled={!name.trim()}>
            Save
          </button>
        </div>
      </div>
    </div>
  )
}

// Main Roadmap Page
export default function RoadmapPage() {
  const [paths, setPaths] = useState(() => {
    // Start with localStorage cache if available
    const saved = localStorage.getItem('silo-roadmap-paths-v3')
    return saved ? JSON.parse(saved) : defaultPaths
  })
  
  const [isLoading, setIsLoading] = useState(true)
  const [saveStatus, setSaveStatus] = useState('saved') // 'saved', 'saving', 'error'
  const saveTimeoutRef = useRef(null)

  // Modal states
  const [editingModule, setEditingModule] = useState(null)
  const [moduleContext, setModuleContext] = useState(null)
  const [editingInitiative, setEditingInitiative] = useState(null)
  const [initiativeContext, setInitiativeContext] = useState(null)

  // Load from JSONBin on mount
  useEffect(() => {
    async function loadFromServer() {
      try {
        const response = await fetch('/.netlify/functions/load-roadmap')
        if (response.ok) {
          const data = await response.json()
          if (Array.isArray(data) && data.length > 0) {
            setPaths(data)
            localStorage.setItem('silo-roadmap-paths-v3', JSON.stringify(data))
          }
        }
      } catch (error) {
        console.log('Using cached data:', error.message)
      } finally {
        setIsLoading(false)
      }
    }
    loadFromServer()
  }, [])

  // Debounced save to JSONBin
  const saveToServer = useCallback(async (data) => {
    setSaveStatus('saving')
    try {
      const response = await fetch('/.netlify/functions/save-roadmap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      if (response.ok) {
        setSaveStatus('saved')
      } else {
        setSaveStatus('error')
      }
    } catch (error) {
      console.error('Save failed:', error)
      setSaveStatus('error')
    }
  }, [])

  // Save when paths change (debounced)
  useEffect(() => {
    // Always save to localStorage immediately
    localStorage.setItem('silo-roadmap-paths-v3', JSON.stringify(paths))
    
    // Debounce server save
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current)
    }
    
    if (!isLoading) {
      setSaveStatus('saving')
      saveTimeoutRef.current = setTimeout(() => {
        saveToServer(paths)
      }, 1000) // Wait 1 second after last change
    }
    
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }
    }
  }, [paths, isLoading, saveToServer])

  // Path CRUD
  const addPath = () => {
    const newPath = {
      id: `path-${Date.now()}`,
      name: 'New Path',
      color: '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0'),
      initiatives: []
    }
    setPaths([...paths, newPath])
  }

  const updatePath = (id, updates) => {
    setPaths(paths.map(p =>
      p.id === id ? { ...p, ...updates } : p
    ))
  }

  const deletePath = (id) => {
    if (confirm('Delete this path and all its initiatives?')) {
      setPaths(paths.filter(p => p.id !== id))
    }
  }

  // Initiative CRUD
  const addInitiative = (pathId) => {
    setInitiativeContext({ pathId })
    setEditingInitiative({ name: '', modules: [] })
  }

  const saveInitiative = (initiative) => {
    if (initiativeContext) {
      const newInitiative = { ...initiative, id: `init-${Date.now()}`, modules: initiative.modules || [] }
      setPaths(paths.map(p =>
        p.id === initiativeContext.pathId
          ? { ...p, initiatives: [...p.initiatives, newInitiative] }
          : p
      ))
      setInitiativeContext(null)
    } else {
      setPaths(paths.map(p => ({
        ...p,
        initiatives: p.initiatives.map(init =>
          init.id === initiative.id ? { ...init, name: initiative.name } : init
        )
      })))
    }
    setEditingInitiative(null)
  }

  const editInitiative = (initiative) => {
    setInitiativeContext(null)
    setEditingInitiative(initiative)
  }

  const deleteInitiative = (pathId, initiativeId) => {
    if (confirm('Delete this initiative and all its modules?')) {
      setPaths(paths.map(p =>
        p.id === pathId
          ? { ...p, initiatives: p.initiatives.filter(init => init.id !== initiativeId) }
          : p
      ))
    }
  }

  const reorderInitiatives = (pathId, newInitiatives) => {
    setPaths(paths.map(p =>
      p.id === pathId ? { ...p, initiatives: newInitiatives } : p
    ))
  }

  // Module CRUD
  const addModule = (pathId, initiativeId) => {
    setModuleContext({ pathId, initiativeId })
    setEditingModule({ name: '', target: '', notes: '' })
  }

  const saveModule = (module) => {
    if (moduleContext) {
      const newModule = { ...module, id: `mod-${Date.now()}` }
      setPaths(paths.map(p =>
        p.id === moduleContext.pathId
          ? {
              ...p,
              initiatives: p.initiatives.map(init =>
                init.id === moduleContext.initiativeId
                  ? { ...init, modules: [...init.modules, newModule] }
                  : init
              )
            }
          : p
      ))
      setModuleContext(null)
    } else {
      setPaths(paths.map(p => ({
        ...p,
        initiatives: p.initiatives.map(init => ({
          ...init,
          modules: init.modules.map(m =>
            m.id === module.id ? module : m
          )
        }))
      })))
    }
    setEditingModule(null)
  }

  const editModule = (pathId, initiativeId, module) => {
    setModuleContext(null)
    setEditingModule(module)
  }

  const deleteModule = (pathId, initiativeId, moduleId) => {
    setPaths(paths.map(p =>
      p.id === pathId
        ? {
            ...p,
            initiatives: p.initiatives.map(init =>
              init.id === initiativeId
                ? { ...init, modules: init.modules.filter(m => m.id !== moduleId) }
                : init
            )
          }
        : p
    ))
  }

  const reorderModules = (pathId, initiativeId, newModules) => {
    setPaths(paths.map(p =>
      p.id === pathId
        ? {
            ...p,
            initiatives: p.initiatives.map(init =>
              init.id === initiativeId ? { ...init, modules: newModules } : init
            )
          }
        : p
    ))
  }

  return (
    <div className="roadmap-page">
      <div className="roadmap-header">
        <div>
          <h1>Silo Evolution Roadmap</h1>
          <p className="subtitle">Paths → Initiatives → Modules • Drag to reorder • Click to edit</p>
        </div>
        <div className="roadmap-actions">
          <span className={`save-status ${saveStatus}`}>
            {saveStatus === 'saving' && '⏳ Saving...'}
            {saveStatus === 'saved' && '✓ Saved'}
            {saveStatus === 'error' && '⚠ Save failed'}
          </span>
          <button onClick={addPath} className="btn-primary">+ Add Path</button>
        </div>
      </div>

      <div className="roadmap-start">
        <div className="state-box current-state">
          <span>Current State</span>
          <strong>Silo Today</strong>
        </div>
      </div>

      {isLoading ? (
        <div className="loading-state">Loading roadmap...</div>
      ) : (
        <div className="roadmap-lanes">
          {paths.map(path => (
            <PathLane
              key={path.id}
              path={path}
              onUpdatePath={updatePath}
              onDeletePath={deletePath}
              onAddInitiative={addInitiative}
              onEditInitiative={editInitiative}
              onDeleteInitiative={deleteInitiative}
              onAddModule={addModule}
              onEditModule={editModule}
              onDeleteModule={deleteModule}
              onReorderModules={reorderModules}
              onReorderInitiatives={reorderInitiatives}
            />
          ))}
        </div>
      )}

      <div className="roadmap-end">
        <div className="state-box future-state">
          <span>Future State</span>
          <strong>Unified Platform</strong>
        </div>
      </div>

      {editingModule && (
        <ModuleModal
          module={editingModule}
          onSave={saveModule}
          onClose={() => {
            setEditingModule(null)
            setModuleContext(null)
          }}
        />
      )}

      {editingInitiative && (
        <InitiativeModal
          initiative={editingInitiative}
          onSave={saveInitiative}
          onClose={() => {
            setEditingInitiative(null)
            setInitiativeContext(null)
          }}
        />
      )}
    </div>
  )
}
