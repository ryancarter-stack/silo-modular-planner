// Famous Software ERP Module Pricing (April 2020)
// Source: Famous Software, LLC - 8080 N. Palm Ave., Suite 210, Fresno, CA 93711

export const famousModules = {
  // Financial and Banking Management
  'general-ledger': { name: 'General Ledger and Banking', price: 1500, requires: ['System Manager'] },
  'consolidated-financials': { name: 'General Ledger - Consolidated Financials', price: 750, requires: ['General Ledger and Banking'] },
  'multiple-currency': { name: 'Multiple Currency', price: 2000, requires: ['Invoicing & AR or AP'] },
  
  // Cost Accounting
  'cost-accounting': { name: 'Cost Accounting', price: 1200, requires: ['General Ledger'] },
  
  // Accounts Payable and Purchasing
  'accounts-payable': { name: 'Accounts Payable', price: 1000, requires: ['General Ledger and Banking'] },
  'purchase-orders': { name: 'Purchase Orders', price: 1500, requires: ['Invoicing & AR', 'Accounts Payable'] },
  
  // Payroll Management
  'payroll': { name: 'Payroll', price: 3000, requires: ['General Ledger and Banking'] },
  'payroll-crew-entry': { name: 'Payroll - Crew Entry/Data Import', price: 1000, requires: ['Payroll'] },
  'payroll-multi-state': { name: 'Payroll - Multi-State', price: 1000, requires: ['Payroll'], note: 'Per state' },
  'payroll-direct-deposit': { name: 'Payroll - Direct Deposit', price: 1500, requires: ['Payroll'] },
  
  // Billing (Charge Tags)
  'charge-tags': { name: 'Charge Tags', price: 2000, requires: ['Cost Accounting', 'Invoicing & AR'] },
  'charge-tags-inventory': { name: 'Charge Tags from Inventory', price: 1000, requires: ['Charge Tags', 'Inventory'] },
  'charge-tags-payroll': { name: 'Charge Tags from Payroll', price: 1000, requires: ['Charge Tags', 'Payroll'] },
  'charge-tags-ap': { name: 'Charge Tags from Accounts Payable', price: 1000, requires: ['Charge Tags', 'AP'] },
  
  // Order Management
  'sales-orders': { name: 'Sales Orders', price: 2000, requires: ['Invoicing & AR'] },
  'sales-office-inquiry': { name: 'Sales Office Inquiry', price: 1000, requires: ['Sales Orders'] },
  'sales-loads': { name: 'Sales Loads', price: 1000, requires: ['Sales Orders'] },
  'price-list': { name: 'Price List', price: 1000, requires: ['Invoicing & AR'] },
  'brokerage-system': { name: 'Brokerage System', price: 1000, requires: ['Invoicing & AR'] },
  'blockchain': { name: 'Blockchain', price: 2000, requires: ['Invoicing & AR', 'Famous Integration Service'] },
  
  // Inventory and Warehouse Management
  'inventory': { name: 'Inventory', price: 1000, requires: ['Purchase Orders or Grower Accounting'] },
  'inventory-room-row': { name: 'Inventory Room/Row', price: 750, requires: ['Inventory'] },
  'inventory-transfers': { name: 'Inventory Transfers', price: 750, requires: ['Inventory', 'Sales Orders', 'Shipping'] },
  'repacking': { name: 'Repacking', price: 1000, requires: ['Inventory'] },
  'advanced-repacking': { name: 'Advanced Repacking', price: 1000, requires: ['Repacking'] },
  'pallet-consolidation': { name: 'Pallet Consolidation', price: 1000, requires: ['Inventory'] },
  'work-orders': { name: 'Work Orders', price: 2000, requires: ['Sales Orders', 'Inventory', 'Repacking'] },
  
  // Shipping Management
  'shipping': { name: 'Shipping', price: 1500, requires: ['Sales Orders', 'Inventory'] },
  'canadian-confirmation': { name: 'Canadian Confirmation of Sale', price: 750, requires: ['Invoicing & AR'] },
  
  // Invoicing and Accounts Receivable
  'invoicing-ar': { name: 'Invoicing & Accounts Receivable', price: 3000, requires: ['General Ledger and Banking'] },
  
  // Grower Accounting
  'grower-accounting': { name: 'Grower Accounting', price: 3000, requires: ['Invoicing & AR'] },
  'grower-lots': { name: 'Grower Lots', price: 1000, requires: ['Grower Accounting', 'Inventory'] },
  'pooling': { name: 'Pooling', price: 2000, requires: ['Grower Accounting', 'Inventory'] },
  
  // Famous Administration
  'system-manager': { name: 'System Manager', price: 1000, requires: [], note: 'Required for all installations' },
  'report-administration': { name: 'Report Administration', price: 1000, requires: [] },
  'infomaker': { name: 'InfoMaker', price: 195, requires: [] },
  
  // Add-Ons
  'auto-bank-reconciliation': { name: 'Auto Bank Reconciliation', price: 1500, requires: ['FAPI Banking'] },
  'cold-storage-billing': { name: 'Cold Storage Billing Routine', price: 3000, requires: [] },
  'chep-reporting': { name: 'CHEP Reporting', price: 1500, requires: [] },
};

// Map function IDs to Famous module keys
export const functionToFamousMap = {
  // Base/Universal
  'auth': 'system-manager',
  'profile': 'system-manager',
  'account': 'system-manager',
  'settings': 'system-manager',
  'audit-log': 'system-manager',
  
  // Core Operations
  'receiving': 'inventory',
  'inventory-mgmt': 'inventory',
  'inventory-raw': 'inventory',
  'inventory-wip': 'inventory',
  'inventory-finished': 'inventory',
  'inventory-3pl': 'inventory',
  'warehouse-mgmt': 'inventory',
  'lot-traceability': 'grower-lots',
  'batch-tracking': 'grower-lots',
  
  // Quality
  'quality-inspection': 'inventory',
  'quality-inbound': 'inventory',
  'quality-grading': 'inventory',
  'qc-production': 'inventory',
  'quality-export': 'inventory',
  
  // Purchasing & AP
  'purchasing': 'purchase-orders',
  'ap-billpay': 'accounts-payable',
  'po-intl': 'purchase-orders',
  
  // Sales & AR
  'sales-orders': 'sales-orders',
  'so-intl': 'sales-orders',
  'invoicing': 'invoicing-ar',
  'invoicing-commission': 'invoicing-ar',
  'ar-collections': 'invoicing-ar',
  'pricing': 'price-list',
  'customer-credit': 'invoicing-ar',
  
  // Shipping & Logistics
  'shipping': 'shipping',
  'shipping-logistics': 'shipping',
  'logistics': 'shipping',
  'shipping-coordination': 'shipping',
  'intl-logistics': 'shipping',
  'order-fulfillment': 'shipping',
  
  // Repacking & Production
  'repack-operations': 'repacking',
  'repacking': 'repacking',
  'repack-breakbulk': 'repacking',
  'packout-recording': 'repacking',
  'labeling': 'repacking',
  'packaging-labeling': 'repacking',
  'bom-recipes': 'work-orders',
  'production-runs': 'work-orders',
  'work-orders': 'work-orders',
  'yield-tracking': 'repacking',
  'waste-shrink': 'inventory',
  
  // Grower/Consignment
  'grower-settlements': 'grower-accounting',
  'consignment-tracking': 'grower-accounting',
  'cost-tracking': 'cost-accounting',
  'cost-accounting': 'cost-accounting',
  'cost-allocation': 'cost-accounting',
  'harvest-recording': 'grower-accounting',
  
  // Labor
  'labor-scheduling': 'payroll-crew-entry',
  'labor-mgmt': 'payroll-crew-entry',
  
  // Broker/Commission
  'deal-entry': 'brokerage-system',
  'commission-tracking': 'brokerage-system',
  
  // Cold Storage / 3PL
  'billing-storage': 'cold-storage-billing',
  'temp-monitoring': 'inventory',
  'cold-storage': 'inventory',
  
  // Currency
  'fx-hedging': 'multiple-currency',
  'fx-pricing': 'multiple-currency',
  
  // Landed Cost
  'landed-cost': 'cost-accounting',
  
  // Compliance & Docs
  'export-docs': 'shipping',
  
  // Reporting
  'reporting': 'report-administration',
  'reporting-analytics': 'sales-office-inquiry',
  'customer-reporting': 'report-administration',
  
  // Returns/Credits
  'claims-returns': 'invoicing-ar',
  'returns-credits': 'invoicing-ar',
  
  // QC/Inspection Service
  'billing-inspection': 'invoicing-ar',
  'grading': 'inventory',
};

// Helper function to get Famous pricing for a function
export function getFamousPricing(functionId) {
  const moduleKey = functionToFamousMap[functionId];
  if (!moduleKey) return null;
  
  const module = famousModules[moduleKey];
  if (!module) return null;
  
  return {
    famousModule: module.name,
    famousPrice: module.price,
    famousRequires: module.requires,
    famousNote: module.note || null
  };
}

export default { famousModules, functionToFamousMap, getFamousPricing };
