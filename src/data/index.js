// Main data index - re-exports all data modules

export { siloBase } from './siloBase.js';
export { categories } from './categories.js';
export { liteTypes, liteFunctions } from './liteTypes.js';

// Individual customer type exports (for direct access)
export { grower, originCustomerTypes } from './origin.js';
export { 
  processor, 
  packer, 
  shipper, 
  broker, 
  importer, 
  exporter, 
  wholesaler, 
  distributor, 
  repacker,
  midchainCustomerTypes 
} from './midchain.js';
export { 
  retailer, 
  restaurant, 
  institution, 
  manufacturer,
  demandCustomerTypes 
} from './demand.js';
export { 
  coldStorage, 
  trucking, 
  qcInspection,
  serviceCustomerTypes 
} from './service.js';

// Combined customer types array (maintains original order)
import { originCustomerTypes } from './origin.js';
import { midchainCustomerTypes } from './midchain.js';
import { demandCustomerTypes } from './demand.js';
import { serviceCustomerTypes } from './service.js';

export const customerTypes = [
  ...originCustomerTypes,
  ...midchainCustomerTypes,
  ...demandCustomerTypes,
  ...serviceCustomerTypes,
];
