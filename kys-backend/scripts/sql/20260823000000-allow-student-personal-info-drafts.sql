BEGIN;
ALTER TABLE student_personal_info
ALTER COLUMN mobile_no DROP NOT NULL,
    ALTER COLUMN personal_email DROP NOT NULL,
    ALTER COLUMN college_email DROP NOT NULL,
    ALTER COLUMN linked_in_id DROP NOT NULL,
    ALTER COLUMN permanent_address DROP NOT NULL,
    ALTER COLUMN dob DROP NOT NULL,
    ALTER COLUMN gender DROP NOT NULL,
    ALTER COLUMN father_name DROP NOT NULL,
    ALTER COLUMN father_mobile_no DROP NOT NULL,
    ALTER COLUMN father_occupation DROP NOT NULL,
    ALTER COLUMN mother_name DROP NOT NULL,
    ALTER COLUMN mother_mobile_no DROP NOT NULL,
    ALTER COLUMN mother_occupation DROP NOT NULL,
    ALTER COLUMN emergency_contact_name DROP NOT NULL,
    ALTER COLUMN emergency_contact_number DROP NOT NULL;
COMMIT;