// SERVICE PROVIDERS - Customer types

export const coldStorage = {
  id: 'cold-storage',
  name: 'Cold Storage / 3PL',
  category: 'service',
  liteTypes: ['service'],
  description: 'Third-party warehousing operations providing temperature-controlled storage services for produce. Cold storage providers manage inventory on behalf of depositors (product owners), handling receiving, storage, order fulfillment, and shipping. They operate complex facilities with multiple temperature zones, maintain food safety compliance, and provide inventory visibility to customers. Revenue is based on storage fees, handling charges, and value-added services.',
  functions: [
    { id: 'depositor-mgmt', name: 'Customer (Depositor) Management', description: 'Management of customer accounts and relationships. Tracks customer information, contacts, and billing details. Manages service agreements and rate structures. Supports customer onboarding and account maintenance.' },
    { id: 'receiving', name: 'Receiving', description: 'Inbound receiving on behalf of depositors. Processes appointments, inspects loads, and documents receipt details. Creates inventory records linked to depositor accounts. Manages receiving labor and dock scheduling.' },
    { id: 'quality-inspection', name: 'Quality Inspection (Receiving)', description: 'Quality assessment on receipt for depositor accountability. Documents product condition, temperature, and any damage or quality issues. Captures photos and detailed notes. Provides inspection reports to depositors for supplier claims and inventory valuation.' },
    { id: 'inventory-3pl', name: 'Inventory Management (Multi-owner)', description: 'Multi-customer inventory tracking within the facility. Maintains accurate inventory by depositor, lot, and location. Supports customer inventory inquiries and reporting. Manages inventory accuracy through cycle counting.' },
    { id: 'warehouse-mgmt', name: 'Warehouse Operations', description: 'Facility operations including putaway, storage, picking, and shipping. Optimizes space utilization and labor efficiency. Manages temperature zones and product segregation. Tracks operational productivity and costs.' },
    { id: 'temp-monitoring', name: 'Temperature Monitoring', description: 'Continuous temperature monitoring and recording. Maintains temperature logs for food safety compliance. Alerts for temperature excursions. Provides temperature documentation to customers and regulators.' },
    { id: 'order-fulfillment', name: 'Order Fulfillment', description: 'Customer order processing and fulfillment. Receives orders from depositors, picks inventory, and prepares shipments. Manages order priorities and shipping schedules. Tracks fulfillment accuracy and timeliness.' },
    { id: 'shipping', name: 'Shipping', description: 'Outbound shipping coordination and execution. Manages carrier appointments, load building, and BOL generation. Coordinates with carriers and tracks shipments. Provides shipping documentation to depositors.' },
    { id: 'billing-storage', name: 'Billing (Storage & Handling)', description: 'Service billing for storage, handling, and value-added services. Calculates charges based on rate agreements and activity. Generates detailed invoices with transaction support. Manages billing cycles and customer-specific requirements.' },
    { id: 'ar-collections', name: 'AR / Collections', description: 'Service fee receivables management. Tracks customer payments and manages collection activities. Coordinates with customers on billing questions. Maintains cash flow visibility for the facility.' },
    { id: 'food-safety', name: 'Food Safety / Compliance', description: 'Facility food safety and regulatory compliance. Maintains certifications (SQF, BRC), manages inspections, and documents compliance activities. Supports customer audit requirements. Ensures safe food storage practices.' },
    { id: 'customer-reporting', name: 'Customer Reporting', description: 'Inventory and activity reporting for depositors. Provides real-time inventory visibility, transaction history, and aging reports. Supports customer-specific reporting requirements. Enables customer self-service access to their data.' },
    { id: 'lot-traceability', name: 'Lot Traceability', description: 'Product traceability through cold storage operations. Maintains lot identity from receiving through shipping. Supports customer recall requirements and regulatory compliance. Generates traceability documentation.' },
  ],
};

export const trucking = {
  id: 'trucking',
  name: 'Trucking / Logistics',
  category: 'service',
  liteTypes: ['service'],
  description: 'Transportation providers specializing in moving produce with temperature control requirements. This includes long-haul refrigerated carriers, local delivery fleets, and freight brokers. Trucking companies manage complex logistics including route optimization, driver scheduling, regulatory compliance (DOT, FMCSA), and temperature monitoring. They balance capacity utilization with service commitments and manage the challenges of perishable freight.',
  functions: [
    { id: 'customer-mgmt', name: 'Customer Management', description: 'Shipper and broker relationship management. Tracks customer information, contacts, and shipping preferences. Manages rate agreements and service requirements. Supports customer onboarding and account maintenance.' },
    { id: 'rates', name: 'Rate / Tariff Management', description: 'Freight rate management including contract rates, spot rates, and accessorial charges. Maintains rate tables by lane and customer. Manages fuel surcharges and rate adjustments. Supports rate quoting and agreement documentation.' },
    { id: 'load-planning', name: 'Load Planning', description: 'Load optimization and planning. Assigns loads to equipment and drivers. Optimizes routes and schedules. Balances capacity utilization with service commitments. Coordinates multi-stop and relay operations.' },
    { id: 'dispatch', name: 'Dispatch', description: 'Real-time load dispatch and driver communication. Assigns drivers to loads, communicates instructions, and tracks execution. Manages load changes and exceptions. Coordinates with shippers and receivers on pickup and delivery.' },
    { id: 'driver-mgmt', name: 'Driver Management', description: 'Driver workforce management including scheduling, qualification tracking, and performance monitoring. Manages driver assignments, hours of service, and compliance documentation. Tracks driver productivity and safety metrics.' },
    { id: 'equipment-tracking', name: 'Equipment Tracking', description: 'Trailer and tractor tracking and management. Monitors equipment location and status. Manages equipment availability and utilization. Coordinates maintenance scheduling and compliance inspections.' },
    { id: 'temp-monitoring', name: 'Temperature Monitoring', description: 'Reefer temperature monitoring and documentation. Tracks setpoints and actual temperatures throughout transit. Alerts for temperature excursions. Provides temperature records for food safety and claims documentation.' },
    { id: 'delivery-tracking', name: 'Delivery Tracking', description: 'Shipment tracking from pickup through delivery. Provides real-time visibility to customers. Documents pickup and delivery events. Manages proof of delivery capture and distribution.' },
    { id: 'pod-capture', name: 'POD Capture', description: 'Proof of delivery documentation. Captures signatures, photos, and delivery notes. Documents exceptions and delivery conditions. Provides POD documentation to customers for payment release.' },
    { id: 'billing-freight', name: 'Billing (Freight)', description: 'Freight billing including line haul, accessorials, and adjustments. Generates invoices from completed loads. Manages billing corrections and dispute resolution. Supports EDI invoicing for large customers.' },
    { id: 'ar-collections', name: 'AR / Collections', description: 'Freight receivables management. Tracks customer payments and manages collection activities. Handles billing disputes and deduction management. Maintains cash flow visibility for the trucking operation.' },
    { id: 'claims-mgmt', name: 'Claims Management', description: 'Freight claim processing for damaged or delayed shipments. Documents claim details and supporting evidence. Manages claim investigation and resolution. Tracks claim trends and carrier liability.' },
    { id: 'dot-compliance', name: 'DOT / FMCSA Compliance', description: 'Regulatory compliance for transportation operations. Manages driver qualifications, hours of service, vehicle inspections, and safety ratings. Maintains compliance documentation for audits. Tracks compliance metrics and corrective actions.' },
    { id: 'fuel-mgmt', name: 'Fuel Management', description: 'Fuel purchasing and consumption tracking. Manages fuel card programs and purchasing authorization. Tracks fuel efficiency and costs by vehicle and driver. Supports fuel tax reporting (IFTA).' },
    { id: 'maintenance', name: 'Maintenance Scheduling', description: 'Vehicle maintenance scheduling and tracking. Manages preventive maintenance schedules, repairs, and inspections. Tracks maintenance costs by vehicle. Ensures equipment reliability and compliance.' },
  ],
};

export const qcInspection = {
  id: 'qc-inspection',
  name: 'QC / Inspection',
  category: 'service',
  liteTypes: ['service'],
  description: 'Third-party quality inspection services providing independent product evaluation for buyers, sellers, and other supply chain participants. QC companies perform inspections at shipping points, receiving docks, and cold storage facilities. They provide unbiased quality assessments, detailed reports, and photographs to support commercial transactions and dispute resolution. Inspectors may be USDA-licensed or operate under company certification.',
  functions: [
    { id: 'client-mgmt', name: 'Client Management', description: 'Customer relationship management for inspection clients. Tracks client information, billing details, and inspection preferences. Manages client contacts and communication. Supports client onboarding and service customization.' },
    { id: 'scheduling', name: 'Inspection Scheduling', description: 'Inspection appointment scheduling and coordination. Manages inspector availability and geographic coverage. Coordinates with locations for access and timing. Balances workload across inspector network.' },
    { id: 'inspection-exec', name: 'Inspection Execution', description: 'Field inspection execution according to specifications. Follows inspection protocols and sampling procedures. Documents findings with detailed notes and photographs. Captures data on mobile devices for real-time reporting.' },
    { id: 'grading', name: 'Grading (USDA, customer specs)', description: 'Product grading according to USDA standards or customer specifications. Evaluates quality factors (size, color, defects, condition). Assigns grades and documents grade-out results. Supports both official USDA grading and commercial inspections.' },
    { id: 'reporting', name: 'Report Generation', description: 'Inspection report creation and distribution. Generates detailed reports with findings, grades, and photos. Delivers reports to clients in required formats. Maintains report archives for future reference.' },
    { id: 'photo-docs', name: 'Photo Documentation', description: 'Photographic documentation of inspected product. Captures representative photos and defect documentation. Manages photo organization and report integration. Provides visual evidence for quality assessment.' },
    { id: 'cert-issuance', name: 'Certificate Issuance', description: 'Inspection certificate generation for official inspections. Issues certificates meeting regulatory and commercial requirements. Manages certificate numbering and authentication. Provides certificates in required formats for shipping and payment.' },
    { id: 'billing-inspection', name: 'Billing (Inspection Services)', description: 'Service billing for inspections and related services. Calculates charges based on inspection type, volume, and location. Generates invoices and manages billing cycles. Supports various billing arrangements and client-specific requirements.' },
    { id: 'ar-collections', name: 'AR / Collections', description: 'Inspection fee receivables management. Tracks client payments and manages collection activities. Handles billing inquiries and disputes. Maintains cash flow visibility for the inspection business.' },
  ],
};

// Export all service customer types as array
export const serviceCustomerTypes = [coldStorage, trucking, qcInspection];
