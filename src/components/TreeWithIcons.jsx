// TreeWithIcons.jsx
import React, { useState } from 'react';

const getIconByType = (type) => {
  switch (type) {
    case 'folder':
      return '📁';
    case 'pdf':
      return '📄📕';
    case 'excel':
      return '📄📗';
    case 'image':
      return '🖼️';
    case 'file':
    default:
      return '📄';
  }
};

// 👇 تأكد إن البيانات فيها id
const data = {
  company: {
    id: 'company',
    name: "Company",
    type: 'folder',
    children: ['engineering', 'marketing', 'operations'],
  },
  engineering: {
    id: 'engineering',
    name: "Engineering",
    type: 'folder',
    children: ['frontend', 'backend', 'platform-team'],
  },
  frontend: {
    id: 'frontend',
    name: "Frontend",
    type: 'folder',
    children: ['design-system', 'web-platform'],
  },
  "design-system": {
    id: 'design-system',
    name: "Design System",
    type: 'folder',
    children: ['components', 'tokens', 'guidelines'],
  },
  components: { id: 'components', name: "Components", type: 'file' },
  tokens: { id: 'tokens', name: "Tokens", type: 'file' },
  guidelines: { id: 'guidelines', name: "Guidelines", type: 'file' },
  "web-platform": { id: 'web-platform', name: "Web Platform", type: 'file' },
  backend: {
    id: 'backend',
    name: "Backend",
    type: 'folder',
    children: ['apis', 'infrastructure'],
  },
  apis: { id: 'apis', name: "APIs", type: 'file' },
  infrastructure: { id: 'infrastructure', name: "Infrastructure", type: 'file' },
  "platform-team": { id: 'platform-team', name: "Platform Team", type: 'file' },
  marketing: {
    id: 'marketing',
    name: "Marketing",
    type: 'folder',
    children: ['content', 'seo'],
  },
  content: { id: 'content', name: "Content", type: 'file' },
  seo: { id: 'seo', name: "SEO", type: 'file' },
  operations: {
    id: 'operations',
    name: "Operations",
    type: 'folder',
    children: ['hr', 'finance'],
  },
  hr: { id: 'hr', name: "HR", type: 'file' },
  finance: { id: 'finance', name: "Finance", type: 'file' },
};

// 👇 TreeNode component
const TreeNode = ({ node, onNodeClick }) => {
  const [expanded, setExpanded] = useState(false);
  const hasChildren = node.children && node.children.length > 0;
  const icon = getIconByType(node.type);

  const handleClick = () => {
    onNodeClick(node.id); // ← ترجع الـ id
    if (hasChildren) setExpanded(!expanded);
  };

  return (
    <div className="ml-4">
      <div
        onClick={handleClick}
        className="flex items-center gap-2 cursor-pointer hover:text-primary"
      >
        <span>{hasChildren ? (expanded ? '➖' : '➕') : ''}</span>
        <span>{icon}</span>
        <span>{node.name}</span>
      </div>

      {hasChildren && expanded && (
        <div className="pl-4 border-r border-gray-300 dark:border-darkBorder">
          {node.children.map((childId) => (
            <TreeNode
              key={childId}
              node={data[childId]}
              onNodeClick={onNodeClick}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// 👇 TreeView component
const TreeView = ({ rootIds = ['company'], onNodeClick }) => {
  return (
    <div className="text-right p-4 bg-white dark:bg-darkCard rounded shadow">
      <h3 className="mb-2 font-bold text-lg border-b pb-2 border-primary">
        هيكلية الوحدات
      </h3>
      {rootIds.map((rootId) => (
        <TreeNode
          key={rootId}
          node={data[rootId]}
          onNodeClick={onNodeClick}
        />
      ))}
    </div>
  );
};

export default TreeView;
