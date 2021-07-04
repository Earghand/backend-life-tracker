\echo "Delete and recreate life_Tracker db?"
\prompt "Return for yes or control-C to cancel > " answer

DROP DATABASE life_tracker;
CREATE DATABASE life_tracker;
\connect life_tracker;


\i life-tracker-schema.sql