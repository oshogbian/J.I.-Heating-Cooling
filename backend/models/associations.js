const Invoice = require('./Invoice');
const InvoiceItem = require('./InvoiceItem');

// Define associations
Invoice.hasMany(InvoiceItem, {
  foreignKey: 'invoice_id',
  as: 'InvoiceItems',
  onDelete: 'CASCADE'
});

InvoiceItem.belongsTo(Invoice, {
  foreignKey: 'invoice_id',
  as: 'Invoice'
});

module.exports = {
  Invoice,
  InvoiceItem
}; 