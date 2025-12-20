// Lite relationship types
export const liteTypes = [
  { id: 'supplier', name: 'Lite Supplier', description: 'Sells product TO a Silo Core customer', color: '#22c55e' },
  { id: 'buyer', name: 'Lite Buyer', description: 'Buys product FROM a Silo Core customer', color: '#f59e0b' },
  { id: 'service', name: 'Lite Service Provider', description: 'Provides services TO a Silo Core customer', color: '#8b5cf6' },
];

// Lite functions by relationship type
export const liteFunctions = {
  supplier: [
    { id: 'view-pos', name: 'View Purchase Orders', description: 'See POs from Silo customers' },
    { id: 'confirm-orders', name: 'Confirm / Acknowledge Orders', description: 'Accept or reject orders' },
    { id: 'view-settlements', name: 'View Settlements / Liquidation', description: 'See settlement reports and pooling' },
    { id: 'view-payment-status', name: 'View Payment Status', description: 'Track payment progress' },
    { id: 'submit-invoices', name: 'Submit Invoices', description: 'Send invoices to customers' },
    { id: 'attach-docs', name: 'Attach Documents', description: 'Upload BOLs, certs, etc.' },
    { id: 'view-bol', name: 'View BOL Confirmations', description: 'See shipping confirmations' },
  ],
  buyer: [
    { id: 'view-invoices', name: 'View Invoices', description: 'See invoices from Silo suppliers' },
    { id: 'view-statements', name: 'View Statements', description: 'See account statements' },
    { id: 'make-payments', name: 'Make Payments', description: 'Pay invoices online' },
    { id: 'view-order-history', name: 'View Order History', description: 'See past orders' },
    { id: 'download-docs', name: 'Download Documents', description: 'Get invoices, BOLs, certs' },
    { id: 'request-credits', name: 'Request Credits / Report Issues', description: 'Submit claims' },
    { id: 'edi-ack', name: 'EDI Acknowledgments', description: 'Confirm EDI transactions' },
  ],
  service: [
    { id: 'view-requests', name: 'View Work Requests', description: 'See service requests from customers' },
    { id: 'update-status', name: 'Update Status', description: 'Mark progress on work' },
    { id: 'submit-deliverables', name: 'Submit Deliverables', description: 'Upload reports, certs, PODs' },
    { id: 'submit-invoices', name: 'Submit Invoices', description: 'Bill for services' },
    { id: 'view-inventory-readonly', name: 'View Inventory (Read-only)', description: 'See depositor inventory (3PL)' },
    { id: 'log-handling', name: 'Log Handling Activity', description: 'Record in/out, handling' },
    { id: 'submit-claims', name: 'Submit Accessorial Claims', description: 'Bill for extras' },
  ],
};
