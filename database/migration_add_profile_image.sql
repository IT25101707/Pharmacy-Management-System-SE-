USE pharmacy_management;

ALTER TABLE users
ADD COLUMN profile_image MEDIUMTEXT NULL AFTER password_hash;
