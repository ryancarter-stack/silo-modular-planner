// DEMAND SIDE - Consumption customer types

export const retailer = {
  id: 'retailer',
  name: 'Retailer',
  category: 'demand',
  liteTypes: ['buyer'],
  description: 'Grocery stores, supermarkets, and other retail operations selling produce directly to consumers. Retailers range from independent grocers to large chains with centralized procurement and distribution. They manage produce departments focused on quality, freshness, shrink reduction, and margin optimization. Retailers increasingly demand traceability, sustainability documentation, and category management support from their suppliers.',
  functions: [
    { id: 'vendor-mgmt', name: 'Vendor Management', description: 'Supplier qualification and performance management. Tracks vendor certifications, quality history, and compliance status. Manages vendor scorecards and business reviews. Coordinates vendor setup and maintenance for procurement systems.' },
    { id: 'purchasing', name: 'Purchase Orders', description: 'Procurement for retail produce needs. Generates purchase orders based on demand forecasts and inventory position. Manages standing orders and promotional buys. Coordinates with vendors on delivery schedules and quantities.' },
    { id: 'receiving', name: 'Receiving', description: 'Store or distribution center receiving. Verifies deliveries against orders, checks quality and temperature. Documents discrepancies and quality issues. Processes receiving for inventory and payables.' },
    { id: 'inventory-mgmt', name: 'Inventory Management', description: 'Produce inventory management focused on freshness and availability. Tracks inventory levels, rotation, and shrink. Supports perpetual inventory and cycle counting. Provides data for ordering and merchandising decisions.' },
    { id: 'shrink-tracking', name: 'Shrink Tracking', description: 'Detailed shrink measurement and analysis. Categorizes shrink by cause (spoilage, damage, theft, markdown). Tracks shrink by item, department, and store. Supports shrink reduction initiatives and vendor quality feedback.' },
    { id: 'pricing-retail', name: 'Pricing (Retail)', description: 'Retail pricing management including everyday prices, promotions, and markdowns. Manages price changes and ensures compliance. Supports promotional pricing and ad planning. Integrates with POS systems for price updates.' },
    { id: 'ap-billpay', name: 'AP / Bill Pay', description: 'Vendor invoice processing and payment. Matches invoices to receiving and purchase orders. Manages payment terms and deductions. Processes payments according to vendor agreements.' },
    { id: 'compliance', name: 'Compliance (Food Safety, Certifications)', description: 'Food safety and regulatory compliance for retail produce. Manages product recalls, temperature monitoring, and safe handling. Tracks certifications (organic, Fair Trade) for labeling compliance. Maintains records for health inspections.' },
    { id: 'traceability', name: 'Traceability', description: 'Product traceability for recall management and consumer inquiries. Links product to suppliers through lot codes. Supports rapid recall response and affected product identification. Maintains records meeting FDA requirements.' },
    { id: 'ordering', name: 'Ordering', description: 'Store-level ordering for produce replenishment. Generates orders based on movement, forecasts, and planned promotions. Supports automated replenishment and manual adjustments. Coordinates with distribution for delivery scheduling.' },
    { id: 'category-mgmt', name: 'Category Management', description: 'Produce category performance analysis and optimization. Manages assortment, space allocation, and merchandising. Tracks category sales, margins, and trends. Supports vendor collaboration on category growth initiatives.' },
    { id: 'pos-integration', name: 'POS Integration', description: 'Integration with point-of-sale systems for inventory and sales data. Receives sales transactions, processes price updates, and manages PLU codes. Supports inventory accuracy and movement reporting.' },
    { id: 'edi', name: 'EDI', description: 'Electronic data interchange with vendors. Supports EDI 850 (PO), 856 (ASN), 810 (Invoice), and other transaction sets. Manages EDI setup, testing, and ongoing support. Enables automated ordering and invoicing workflows.' },
  ],
};

export const restaurant = {
  id: 'restaurant',
  name: 'Restaurant/Foodservice',
  category: 'demand',
  liteTypes: ['buyer'],
  description: 'Restaurants, cafes, catering operations, and foodservice establishments that purchase produce for meal preparation. These operations range from independent restaurants to large chains with central procurement. They focus on product quality, consistency, portion control, and food cost management. Restaurants require reliable delivery, flexible ordering, and responsiveness to menu changes and seasonal availability.',
  functions: [
    { id: 'vendor-mgmt', name: 'Vendor Management', description: 'Supplier relationship management for produce procurement. Evaluates vendor quality, reliability, and pricing. Manages vendor contacts and ordering information. Tracks vendor performance for sourcing decisions.' },
    { id: 'menu-planning', name: 'Menu Planning', description: 'Menu development with produce requirements. Plans menus based on seasonal availability and costs. Calculates produce quantities for menu items. Coordinates menu changes with purchasing and operations.' },
    { id: 'purchasing', name: 'Purchasing', description: 'Produce procurement for restaurant operations. Places orders with vendors based on menu needs and par levels. Manages standing orders and special requests. Coordinates delivery timing with restaurant hours.' },
    { id: 'receiving', name: 'Receiving', description: 'Delivery receiving and verification. Checks quality, quantities, and temperatures on receipt. Documents any issues for vendor follow-up. Processes receiving for inventory and payment.' },
    { id: 'inventory-mgmt', name: 'Inventory Management', description: 'Kitchen inventory management for produce items. Tracks on-hand quantities, usage, and waste. Supports FIFO rotation and freshness management. Provides data for ordering and food cost control.' },
    { id: 'recipe-costing', name: 'Recipe Costing', description: 'Menu item costing including produce ingredients. Calculates theoretical food costs based on recipes and current prices. Tracks cost changes and their impact on margins. Supports pricing decisions and menu engineering.' },
    { id: 'ap-billpay', name: 'AP / Bill Pay', description: 'Vendor invoice processing and payment management. Reconciles invoices with receipts and orders. Manages payment terms and timing. Processes payments to maintain vendor relationships.' },
    { id: 'waste-tracking', name: 'Waste Tracking', description: 'Food waste monitoring for produce items. Tracks waste by cause (spoilage, overproduction, trim). Calculates waste costs and trends. Supports waste reduction initiatives and sustainability reporting.' },
    { id: 'ordering', name: 'Ordering', description: 'Regular ordering to maintain produce inventory. Generates orders based on par levels, usage, and upcoming needs. Supports order guides and standing orders. Coordinates with vendors on delivery schedules.' },
    { id: 'quality-standards', name: 'Quality Standards', description: 'Produce quality specifications for consistent menu execution. Defines quality requirements by item and use. Communicates standards to vendors. Evaluates received product against specifications.' },
  ],
};

export const institution = {
  id: 'institution',
  name: 'Institution',
  category: 'demand',
  liteTypes: ['buyer'],
  description: 'Large-scale foodservice operations in hospitals, schools, universities, corporate cafeterias, and correctional facilities. Institutions typically operate under strict procurement policies, often with bid requirements and compliance obligations. They manage high volumes with budget constraints, nutritional requirements, and specific sourcing mandates (local, sustainable, minority-owned). Institutional buyers require detailed documentation and often operate on long-term contracts.',
  functions: [
    { id: 'vendor-mgmt', name: 'Vendor Management', description: 'Supplier qualification within institutional procurement requirements. Manages vendor registrations, certifications, and compliance documentation. Tracks vendor performance against contract terms. Supports vendor diversity and local sourcing initiatives.' },
    { id: 'purchasing-bids', name: 'Purchasing (Bid-based)', description: 'Formal procurement through bid and contract processes. Manages RFP/RFQ processes for produce contracts. Evaluates bids and makes award recommendations. Ensures compliance with institutional purchasing policies.' },
    { id: 'contract-mgmt', name: 'Contract Management', description: 'Long-term contract administration for produce supply. Tracks contract terms, pricing, and performance requirements. Manages contract amendments and renewals. Ensures compliance with contracted terms and conditions.' },
    { id: 'receiving', name: 'Receiving', description: 'Institutional receiving with documentation requirements. Verifies deliveries against contracts and orders. Maintains receiving records for audit compliance. Documents quality and delivery performance.' },
    { id: 'inventory-mgmt', name: 'Inventory Management', description: 'Large-scale inventory management for institutional operations. Tracks inventory across multiple storage locations. Supports FIFO rotation and usage tracking. Provides data for ordering and cost control.' },
    { id: 'compliance-sourcing', name: 'Compliance (Sourcing Requirements)', description: 'Compliance with institutional sourcing mandates. Tracks local sourcing percentages, sustainability certifications, and diversity spend. Generates compliance reports for stakeholders. Manages documentation for grants and programs.' },
    { id: 'nutritional', name: 'Nutritional Tracking', description: 'Nutritional information management for institutional menus. Maintains produce nutrition data for menu planning. Supports dietary requirements and allergen management. Generates nutritional reports for regulatory compliance.' },
    { id: 'ap-billpay', name: 'AP / Bill Pay', description: 'Institutional payables processing with approval workflows. Manages invoice verification and approval routing. Processes payments according to contract terms. Maintains audit trail for financial compliance.' },
    { id: 'reporting', name: 'Reporting', description: 'Operational and compliance reporting for institutional stakeholders. Generates spend analysis, vendor performance, and compliance reports. Supports budget tracking and cost analysis. Provides data for management decision-making.' },
  ],
};

export const manufacturer = {
  id: 'manufacturer',
  name: 'Manufacturer/CPG',
  category: 'demand',
  liteTypes: ['buyer'],
  description: 'Consumer packaged goods companies and food manufacturers that use produce as ingredients in their products. This includes frozen food manufacturers, juice companies, soup makers, baby food producers, and snack food companies. These buyers require consistent quality, food safety compliance, and reliable supply to support continuous manufacturing operations. They operate under stringent specifications and often have long-term supply agreements.',
  functions: [
    { id: 'supplier-mgmt', name: 'Supplier Management', description: 'Comprehensive supplier qualification and management. Evaluates supplier capabilities, certifications, and quality systems. Manages supplier audits and corrective actions. Maintains approved supplier list and performance ratings.' },
    { id: 'purchasing', name: 'Purchasing', description: 'Raw material procurement for manufacturing operations. Manages purchase orders, contracts, and scheduling. Coordinates supply with production requirements. Supports both spot buying and program purchasing.' },
    { id: 'specifications', name: 'Specification Management', description: 'Detailed product specifications for ingredient procurement. Defines quality parameters, acceptable ranges, and testing requirements. Manages specification versions and approvals. Communicates specifications to suppliers.' },
    { id: 'receiving', name: 'Receiving', description: 'Incoming material receiving with quality protocols. Verifies shipments against orders and specifications. Samples for quality testing and records receipt data. Manages hold-and-release procedures for raw materials.' },
    { id: 'quality-inbound', name: 'Quality Inspection', description: 'Raw material quality verification before production use. Performs specified tests and inspections. Documents quality results and maintains records. Manages non-conforming material and supplier feedback.' },
    { id: 'inventory-raw', name: 'Inventory (Raw Materials)', description: 'Raw material inventory management for production support. Tracks ingredient inventory, lot numbers, and expiration. Supports production scheduling and material planning. Manages storage conditions and rotation.' },
    { id: 'lot-traceability', name: 'Lot Traceability', description: 'Ingredient traceability through manufacturing. Links raw material lots to finished products. Supports recall readiness and regulatory compliance. Generates traceability documentation for audits and customer requests.' },
    { id: 'ap-billpay', name: 'AP / Bill Pay', description: 'Supplier invoice processing and payment. Manages invoice verification, approval workflows, and payment processing. Tracks payables by supplier and commodity. Supports early payment programs and vendor terms management.' },
    { id: 'forecasting', name: 'Forecasting / Demand Planning', description: 'Raw material demand forecasting for procurement planning. Develops forecasts based on production schedules and finished goods demand. Communicates forecasts to suppliers for capacity planning. Supports seasonal and promotional demand planning.' },
  ],
};

// Export all demand customer types as array
export const demandCustomerTypes = [retailer, restaurant, institution, manufacturer];
