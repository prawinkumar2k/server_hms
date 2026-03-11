const db = require('../config/db');

/**
 * Log an audit event
 * @param {string} actionType - e.g., 'APPROVE', 'REJECT', 'MODIFY', 'EXECUTE'
 * @param {string} entityType - e.g., 'LAB_REQUEST', 'PHARMA_REQUEST'
 * @param {string|number} entityId - ID of the entity
 * @param {number} userId - ID of the user performing action
 * @param {string} prevStatus - Previous status (optional)
 * @param {string} newStatus - New status (optional)
 * @param {string} details - JSON string or text details
 */
const logAudit = async (actionType, entityType, entityId, userId, prevStatus, newStatus, details) => {
    try {
        const query = `
            INSERT INTO audit_logs 
            (action_type, entity_type, entity_id, performed_by, previous_status, new_status, details)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        await db.execute(query, [actionType, entityType, entityId, userId, prevStatus, newStatus, details]);
    } catch (error) {
        console.error('Audit Log Error:', error);
        // We don't throw here to avoid failing the main transaction, but we log strictly
    }
};

module.exports = logAudit;
