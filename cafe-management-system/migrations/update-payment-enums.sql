-- Update Payment table to support new payment methods and statuses
-- Run this script if you have existing data and need to update the enum values

-- Add new payment methods
ALTER TABLE payments MODIFY COLUMN paymentMethod ENUM('cash', 'card', 'upi', 'netbanking', 'pay_at_counter');

-- Add new payment statuses  
ALTER TABLE payments MODIFY COLUMN paymentStatus ENUM('pending', 'processing', 'completed', 'failed', 'refunded', 'unpaid', 'requested', 'done');

-- Update existing records if needed
-- UPDATE payments SET paymentMethod = 'pay_at_counter' WHERE paymentMethod = 'cash' AND notes LIKE '%counter%';
-- UPDATE payments SET paymentStatus = 'unpaid' WHERE paymentMethod = 'pay_at_counter' AND paymentStatus = 'pending';