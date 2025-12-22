// Silo Base - Universal functions for ALL users
export const siloBase = {
  name: 'Silo Base',
  description: 'Core platform capabilities shared by all Silo users regardless of customer type. These foundational features enable secure access, identity management, and platform-wide functionality.',
  functions: [
    { id: 'auth', name: 'Authentication', famousStatus: true, description: 'Secure login system with support for email/password, SSO integrations, multi-factor authentication (MFA), password reset flows, and session management. Includes brute-force protection and audit logging of all authentication events.' },
    { id: 'profile', name: 'User Profile', famousStatus: true, description: 'Personal user information management including name, email, phone number, profile photo, communication preferences, and notification settings. Users can update their contact details and manage how they receive alerts from the system.' },
    { id: 'account', name: 'Account', famousStatus: true, description: 'Company-level identity and configuration including legal business name, DBA names, physical addresses, tax IDs (EIN/SSN), business licenses, and organizational hierarchy. Serves as the root entity for all business operations in Silo.' },
    { id: 'notifications', name: 'Notifications', famousStatus: false, description: 'Configurable alert system delivering real-time updates via email, SMS, and in-app notifications. Users can set preferences for order updates, payment alerts, inventory warnings, and system announcements. Supports digest mode and quiet hours.' },
    { id: 'settings', name: 'Settings', famousStatus: true, description: 'Platform preferences including timezone, locale, currency display, date/number formatting, theme preferences, and feature toggles. Administrators can configure account-wide defaults while users can override with personal preferences.' },
    { id: 'audit-log', name: 'Audit Log', famousStatus: true, description: 'Comprehensive activity history tracking all user actions, system events, and data changes. Supports compliance requirements (SOC 2, food safety) with immutable records, timestamps, IP addresses, and user attribution. Searchable and exportable.' },
    { id: 'support', name: 'Support/Help', famousStatus: false, description: 'Integrated help system with searchable documentation, contextual tooltips, video tutorials, and direct support channels. Includes in-app chat, ticket submission, and knowledge base access. Support team can view user context for faster resolution.' },
  ],
};
