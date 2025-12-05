-- Update image column to LONGTEXT to handle larger base64 images
ALTER TABLE menu_items MODIFY COLUMN image LONGTEXT;
ALTER TABLE categories MODIFY COLUMN image LONGTEXT;