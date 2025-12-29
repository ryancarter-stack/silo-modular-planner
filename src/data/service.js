// SERVICE PROVIDERS - Customer types

export const coldStorage = {
  id: 'cold-storage',
  name: 'Cold Storage / 3PL',
  category: 'service',
  liteTypes: ['service'],
  description: 'Third-party warehousing operations providing temperature-controlled storage services for produce. Cold storage providers manage inventory on behalf of depositors (product owners), handling receiving, storage, order fulfillment, and shipping. They operate complex facilities with multiple temperature zones, maintain food safety compliance, and provide inventory visibility to customers. Revenue is based on storage fees, handling charges, and value-added services.',
  inputs: [
    { id: 'in-receiving-data', name: 'Receiving Data', description: 'Data entry of inbound depositor shipments including quantities, lot numbers, temperatures, and condition notes.' },
    { id: 'in-release-orders', name: 'Release Orders', description: 'Customer instructions entered or received electronically specifying inventory to ship, destination, and timing.' },
    { id: 'in-rate-agreements', name: 'Rate Agreements', description: 'Customer service contracts entered defining storage rates, handling charges, and billing terms.' },
    { id: 'in-carrier-appointments', name: 'Appointment Data', description: 'Carrier pickup/delivery appointments entered for dock scheduling and labor planning.' },
  ],
  outputs: [
    { id: 'out-shipping-docs', name: 'Shipping Documents', description: 'Generated BOLs, pallet tags, and temperature documentation for outbound shipments.' },
    { id: 'out-storage-invoices', name: 'Storage Invoices', description: 'Generated bills to depositors for storage, handling, and value-added services based on activity.' },
    { id: 'out-inventory-reports', name: 'Inventory Reports', description: 'Customer inventory visibility reports showing on-hand, aging, lot details, and transaction history.' },
    { id: 'out-receiving-reports', name: 'Receiving Reports', description: 'Generated documentation of inbound receipts with quantities, condition, and any discrepancies.' },
    { id: 'out-temp-logs', name: 'Temperature Logs', description: 'Generated continuous temperature monitoring records for food safety and customer documentation.' },
  ],
  functions: [
    { id: 'depositor-mgmt', name: 'Customer (Depositor) Management', siloStatus: false, famousStatus: false, description: 'Management of customer accounts and relationships. Tracks customer information, contacts, and billing details. Manages service agreements and rate structures. Supports customer onboarding and account maintenance.' },
    { id: 'receiving', name: 'Receiving', siloStatus: true, famousStatus: true, famousModule: 'Inventory', famousPrice: 1000, description: 'Inbound receiving on behalf of depositors. Processes appointments, inspects loads, and documents receipt details. Creates inventory records linked to depositor accounts. Manages receiving labor and dock scheduling.' },
    { id: 'quality-inspection', name: 'Quality Inspection (Receiving)', siloStatus: false, famousStatus: true, famousModule: 'Inventory', famousPrice: 1000, description: 'Quality assessment on receipt for depositor accountability. Documents product condition, temperature, and any damage or quality issues. Captures photos and detailed notes. Provides inspection reports to depositors for supplier claims and inventory valuation.' },
    { id: 'inventory-3pl', name: 'Inventory Management (Multi-owner)', siloStatus: true, famousStatus: true, famousModule: 'Inventory', famousPrice: 1000, description: 'Multi-customer inventory tracking within the facility. Maintains accurate inventory by depositor, lot, and location. Supports customer inventory inquiries and reporting. Manages inventory accuracy through cycle counting.' },
    { id: 'warehouse-mgmt', name: 'Warehouse Operations', siloStatus: true, famousStatus: true, famousModule: 'Room/Row Inventory', famousPrice: 750, description: 'Facility operations including putaway, storage, picking, and shipping. Optimizes space utilization and labor efficiency. Manages temperature zones and product segregation. Tracks operational productivity and costs.' },
    { id: 'temp-monitoring', name: 'Temperature Monitoring', siloStatus: false, famousStatus: false, description: 'Continuous temperature monitoring and recording. Maintains temperature logs for food safety compliance. Alerts for temperature excursions. Provides temperature documentation to customers and regulators.' },
    { id: 'order-fulfillment', name: 'Order Fulfillment', siloStatus: true, famousStatus: true, famousModule: 'Sales Orders', famousPrice: 2000, description: 'Customer order processing and fulfillment. Receives orders from depositors, picks inventory, and prepares shipments. Manages order priorities and shipping schedules. Tracks fulfillment accuracy and timeliness.' },
    { id: 'shipping', name: 'Shipping', siloStatus: true, famousStatus: true, famousModule: 'Shipping', famousPrice: 1500, description: 'Outbound shipping coordination and execution. Manages carrier appointments, load building, and BOL generation. Coordinates with carriers and tracks shipments. Provides shipping documentation to depositors.' },
    { id: 'billing-storage', name: 'Billing (Storage & Handling)', siloStatus: false, famousStatus: true, famousModule: 'Cold Storage Billing', famousPrice: 3000, description: 'Service billing for storage, handling, and value-added services. Calculates charges based on rate agreements and activity. Generates detailed invoices with transaction support. Manages billing cycles and customer-specific requirements.' },
    { id: 'ar-collections', name: 'AR / Collections', siloStatus: true, famousStatus: true, famousModule: 'Invoicing & Accounts Receivable', famousPrice: 3000, description: 'Service fee receivables management. Tracks customer payments and manages collection activities. Coordinates with customers on billing questions. Maintains cash flow visibility for the facility.' },
    { id: 'food-safety', name: 'Food Safety / Compliance', siloStatus: false, famousStatus: false, description: 'Facility food safety and regulatory compliance. Maintains certifications (SQF, BRC), manages inspections, and documents compliance activities. Supports customer audit requirements. Ensures safe food storage practices.' },
    { id: 'customer-reporting', name: 'Customer Reporting', siloStatus: false, famousStatus: true, famousModule: 'Report Administration', famousPrice: 1000, description: 'Inventory and activity reporting for depositors. Provides real-time inventory visibility, transaction history, and aging reports. Supports customer-specific reporting requirements. Enables customer self-service access to their data.' },
    { id: 'lot-traceability', name: 'Lot Traceability', siloStatus: true, famousStatus: true, famousModule: 'Grower Lots', famousPrice: 1000, description: 'Product traceability through cold storage operations. Maintains lot identity from receiving through shipping. Supports customer recall requirements and regulatory compliance. Generates traceability documentation.' },
  ],
};

export const trucking = {
  id: 'trucking',
  name: 'Trucking / Logistics',
  category: 'service',
  liteTypes: ['service'],
  description: 'Transportation providers specializing in moving produce with temperature control requirements. This includes long-haul refrigerated carriers, local delivery fleets, and freight brokers. Trucking companies manage complex logistics including route optimization, driver scheduling, regulatory compliance (DOT, FMCSA), and temperature monitoring. They balance capacity utilization with service commitments and manage the challenges of perishable freight.',
  inputs: [
    { id: 'in-load-tenders', name: 'Load Tenders', description: 'Shipment requests entered or received via EDI from shippers and brokers with origin, destination, timing, and freight details.' },
    { id: 'in-rate-requests', name: 'Rate Requests', description: 'Customer quote requests entered for pricing. Used for spot quotes and lane development.' },
    { id: 'in-pickup-data', name: 'Pickup Confirmations', description: 'Driver check-calls and pickup data entered confirming freight picked up with counts and condition.' },
    { id: 'in-customer-payments', name: 'Payment Receipts', description: 'Customer payment data from checks, ACH, or factoring applied against freight invoices.' },
  ],
  outputs: [
    { id: 'out-load-confirmations', name: 'Load Confirmations', description: 'Generated rate confirmations sent to customers accepting load tenders with pricing and terms.' },
    { id: 'out-freight-invoices', name: 'Freight Invoices', description: 'Generated bills for completed shipments including line haul, fuel surcharge, and accessorials.' },
    { id: 'out-pod', name: 'Proof of Delivery', description: 'Generated or captured delivery confirmation with signatures, timestamps, and condition notes.' },
    { id: 'out-temp-records', name: 'Temperature Records', description: 'Generated reefer temperature logs documenting transit conditions for food safety.' },
    { id: 'out-tracking-updates', name: 'Tracking Updates', description: 'Generated status updates showing shipment location, status, and ETAs sent to customers.' },
  ],
  functions: [
    { id: 'customer-mgmt', name: 'Customer Management', siloStatus: false, famousStatus: false, description: 'Shipper and broker relationship management. Tracks customer information, contacts, and shipping preferences. Manages rate agreements and service requirements. Supports customer onboarding and account maintenance.' },
    { id: 'rates', name: 'Rate / Tariff Management', siloStatus: false, famousStatus: false, description: 'Freight rate management including contract rates, spot rates, and accessorial charges. Maintains rate tables by lane and customer. Manages fuel surcharges and rate adjustments. Supports rate quoting and agreement documentation.' },
    { id: 'load-planning', name: 'Load Planning', siloStatus: false, famousStatus: false, description: 'Load optimization and planning. Assigns loads to equipment and drivers. Optimizes routes and schedules. Balances capacity utilization with service commitments. Coordinates multi-stop and relay operations.' },
    { id: 'dispatch', name: 'Dispatch', siloStatus: false, famousStatus: false, description: 'Real-time load dispatch and driver communication. Assigns drivers to loads, communicates instructions, and tracks execution. Manages load changes and exceptions. Coordinates with shippers and receivers on pickup and delivery.' },
    { id: 'driver-mgmt', name: 'Driver Management', siloStatus: false, famousStatus: false, description: 'Driver workforce management including scheduling, qualification tracking, and performance monitoring. Manages driver assignments, hours of service, and compliance documentation. Tracks driver productivity and safety metrics.' },
    { id: 'equipment-tracking', name: 'Equipment Tracking', siloStatus: false, famousStatus: false, description: 'Trailer and tractor tracking and management. Monitors equipment location and status. Manages equipment availability and utilization. Coordinates maintenance scheduling and compliance inspections.' },
    { id: 'temp-monitoring', name: 'Temperature Monitoring', siloStatus: false, famousStatus: false, description: 'Reefer temperature monitoring and documentation. Tracks setpoints and actual temperatures throughout transit. Alerts for temperature excursions. Provides temperature records for food safety and claims documentation.' },
    { id: 'delivery-tracking', name: 'Delivery Tracking', siloStatus: false, famousStatus: false, description: 'Shipment tracking from pickup through delivery. Provides real-time visibility to customers. Documents pickup and delivery events. Manages proof of delivery capture and distribution.' },
    { id: 'pod-capture', name: 'POD Capture', siloStatus: false, famousStatus: false, description: 'Proof of delivery documentation. Captures signatures, photos, and delivery notes. Documents exceptions and delivery conditions. Provides POD documentation to customers for payment release.' },
    { id: 'billing-freight', name: 'Billing (Freight)', siloStatus: false, famousStatus: false, description: 'Freight billing including line haul, accessorials, and adjustments. Generates invoices from completed loads. Manages billing corrections and dispute resolution. Supports EDI invoicing for large customers.' },
    { id: 'ar-collections', name: 'AR / Collections', siloStatus: true, famousStatus: true, famousModule: 'Invoicing & Accounts Receivable', famousPrice: 3000, description: 'Freight receivables management. Tracks customer payments and manages collection activities. Handles billing disputes and deduction management. Maintains cash flow visibility for the trucking operation.' },
    { id: 'claims-mgmt', name: 'Claims Management', siloStatus: false, famousStatus: false, description: 'Freight claim processing for damaged or delayed shipments. Documents claim details and supporting evidence. Manages claim investigation and resolution. Tracks claim trends and carrier liability.' },
    { id: 'dot-compliance', name: 'DOT / FMCSA Compliance', siloStatus: false, famousStatus: false, description: 'Regulatory compliance for transportation operations. Manages driver qualifications, hours of service, vehicle inspections, and safety ratings. Maintains compliance documentation for audits. Tracks compliance metrics and corrective actions.' },
    { id: 'fuel-mgmt', name: 'Fuel Management', siloStatus: false, famousStatus: false, description: 'Fuel purchasing and consumption tracking. Manages fuel card programs and purchasing authorization. Tracks fuel efficiency and costs by vehicle and driver. Supports fuel tax reporting (IFTA).' },
    { id: 'maintenance', name: 'Maintenance Scheduling', siloStatus: false, famousStatus: false, description: 'Vehicle maintenance scheduling and tracking. Manages preventive maintenance schedules, repairs, and inspections. Tracks maintenance costs by vehicle. Ensures equipment reliability and compliance.' },
  ],
};

export const qcInspection = {
  id: 'qc-inspection',
  name: 'QC / Inspection',
  category: 'service',
  liteTypes: ['service'],
  description: 'Third-party quality inspection services providing independent product evaluation for buyers, sellers, and other supply chain participants. QC companies perform inspections at shipping points, receiving docks, and cold storage facilities. They provide unbiased quality assessments, detailed reports, and photographs to support commercial transactions and dispute resolution. Inspectors may be USDA-licensed or operate under company certification.',
  inputs: [
    { id: 'in-inspection-requests', name: 'Inspection Requests', description: 'Client requests entered or received specifying location, timing, product details, and inspection requirements.' },
    { id: 'in-inspection-data', name: 'Inspection Data Entry', description: 'Field inspector findings entered via mobile device including grades, defects, temperatures, and observations.' },
    { id: 'in-grade-standards', name: 'Grade Standards', description: 'USDA standards and customer specifications loaded as reference for grading criteria.' },
    { id: 'in-client-payments', name: 'Payment Receipts', description: 'Client payment data applied against outstanding inspection invoices.' },
  ],
  outputs: [
    { id: 'out-inspection-reports', name: 'Inspection Reports', description: 'Generated quality assessment reports with findings, grades, defect percentages, and recommendations.' },
    { id: 'out-photos', name: 'Photo Documentation', description: 'Captured and organized photos of product condition, defects, and representative samples.' },
    { id: 'out-certificates', name: 'Inspection Certificates', description: 'Generated official certificates (USDA or commercial) documenting inspection results.' },
    { id: 'out-service-invoices', name: 'Service Invoices', description: 'Generated bills to clients for inspection services based on volume and service type.' },
  ],
  functions: [
    { id: 'client-mgmt', name: 'Client Management', siloStatus: false, famousStatus: false, description: 'Customer relationship management for inspection clients. Tracks client information, billing details, and inspection preferences. Manages client contacts and communication. Supports client onboarding and service customization.' },
    { id: 'scheduling', name: 'Inspection Scheduling', siloStatus: false, famousStatus: false, description: 'Inspection appointment scheduling and coordination. Manages inspector availability and geographic coverage. Coordinates with locations for access and timing. Balances workload across inspector network.' },
    { id: 'inspection-exec', name: 'Inspection Execution', siloStatus: false, famousStatus: false, description: 'Field inspection execution according to specifications. Follows inspection protocols and sampling procedures. Documents findings with detailed notes and photographs. Captures data on mobile devices for real-time reporting.' },
    { id: 'grading', name: 'Grading (USDA, customer specs)', siloStatus: false, famousStatus: false, description: 'Product grading according to USDA standards or customer specifications. Evaluates quality factors (size, color, defects, condition). Assigns grades and documents grade-out results. Supports both official USDA grading and commercial inspections.' },
    { id: 'reporting', name: 'Report Generation', siloStatus: false, famousStatus: true, famousModule: 'Report Administration', famousPrice: 1000, description: 'Inspection report creation and distribution. Generates detailed reports with findings, grades, and photos. Delivers reports to clients in required formats. Maintains report archives for future reference.' },
    { id: 'photo-docs', name: 'Photo Documentation', siloStatus: false, famousStatus: false, description: 'Photographic documentation of inspected product. Captures representative photos and defect documentation. Manages photo organization and report integration. Provides visual evidence for quality assessment.' },
    { id: 'cert-issuance', name: 'Certificate Issuance', siloStatus: false, famousStatus: false, description: 'Inspection certificate generation for official inspections. Issues certificates meeting regulatory and commercial requirements. Manages certificate numbering and authentication. Provides certificates in required formats for shipping and payment.' },
    { id: 'billing-inspection', name: 'Billing (Inspection Services)', siloStatus: false, famousStatus: true, famousModule: 'Invoicing & Accounts Receivable', famousPrice: 3000, description: 'Service billing for inspections and related services. Calculates charges based on inspection type, volume, and location. Generates invoices and manages billing cycles. Supports various billing arrangements and client-specific requirements.' },
    { id: 'ar-collections', name: 'AR / Collections', siloStatus: true, famousStatus: true, famousModule: 'Invoicing & Accounts Receivable', famousPrice: 3000, description: 'Inspection fee receivables management. Tracks client payments and manages collection activities. Handles billing inquiries and disputes. Maintains cash flow visibility for the inspection business.' },
  ],
};

// Export all service customer types as array
export const serviceCustomerTypes = [coldStorage, trucking, qcInspection];
