
Download backup from old server

    cx download -s 'Mo Billing Javascript' -e production --server Canary /var/cloud66/backups/mo_billing_javascript_production_4081 .
    tar xvf mo_billing_javascript_production_4081/2015.08.14.13.00.07/mo_billing_javascript_production_4081.tar
    gunzip mo_billing_javascript_production_4081/databases/PostgreSQL/mo_billing_javascript_production.sql.gz
    cd ..
    vagrant ssh
    dropdb mobilling_development
    rake db:create
    psql mobilling_development < backup/mo_billing_javascript_production_4081/databases/PostgreSQL/mo_billing_javascript_production.sql
    rake db:migrate
    rake db:seed
    cd backup
    pg_dump mobilling_development > v2.sql
    exit
    cd backup
    scp v2.sql sys.mo-billing.ca:mobilling/backup/
    ssh -A sys.mo-billing.ca

    cd mobilling/backup
    source ~/bin/openrc.sh
    swift list mobilling-backup
    swift download mobilling-backup mobilling-2015-08-14-11-28-11-04-00.sql.xz
    unxz mobilling-2015-08-14-11-28-11-04-00.sql.xz
    
    dropdb --host 172.17.0.2 --user postgres mobilling_v2;
    createdb --host 172.17.0.2 --user postgres mobilling_v2;
    psql  --host 172.17.0.2 --user postgres mobilling_v2 < v2.sql

    pg_dump --host 172.17.0.2 --user postgres mobilling_production > backup.sql;

    psql  --host 172.17.0.2 --user postgres mobilling_production
    create extension dblink;

    insert into users select * from dblink('dbname=mobilling_v2', 'select id, name, email, password_digest, authentication_token, created_at, updated_at, agent_id, pin, specialties, provider_number, group_number, office_code, specialty_code, role, default_specialty, token_at from users') as t1(id uuid, name character varying, email character varying, password_digest character varying, authentication_token character varying, created_at timestamp without time zone, updated_at timestamp without time zone, agent_id uuid, pin character varying, specialties character varying[], provider_number integer, group_number character varying(4), office_code character varying(1), specialty_code integer, role integer, default_specialty character varying(255), token_at timestamp without time zone) where not exists (select users.id from users where users.id = t1.id or users.email = t1.email) ;

    insert into claim_items select * from dblink('dbname=mobilling_v2', 'select id,claim_id,day,diagnosis,time_in,time_out,created_at,updated_at from claim_items') as t1(id uuid, claim_id uuid, day date, diagnosis character varying, time_in character varying, time_out character varying,  created_at timestamp without time zone,  updated_at timestamp without time zone) where not exists (select claims.id from claims where claims.id = t1.claim_id);

insert into claim_rows select * from dblink('dbname=mobilling_v2', 'select id,item_id,code,fee,paid,units,message,created_at,updated_at from claim_rows') as t1(id uuid,item_id uuid,code character varying, fee integer, paid integer, units integer, message character varying, created_at timestamp without time zone, updated_at timestamp without time zone) where exists (select claim_items.id from claim_items where claim_items.id = t1.item_id);

    insert into claim_comments select * from dblink('dbname=mobilling_v2', 'select body,user_id,claim_id,created_at,updated_at,read,id from claim_comments') as t1(body text, user_id uuid, claim_id uuid, created_at timestamp, updated_at timestamp, read boolean, id uuid) where not exists (select claim_comments.id from claim_comments where claim_comments.id = t1.id) ;

    insert into photos select * from dblink('dbname=mobilling_v2', 'select id,user_id,file,created_at,updated_at from photos') as t1(id uuid, user_id uuid, file text, created_at timestamp, updated_at timestamp) where not exists (select photos.id from photos where photos.id = t1.id);

    insert into claims select * from dblink('dbname=mobilling_v2', 'select id, user_id, photo_id, status, details, created_at, updated_at, number + 10000, original_id, submitted_fee, paid_fee, specialty , patient_name , patient_number , patient_province , patient_birthday, patient_sex , hospital , referring_physician , most_responsible_physician, admission_on date, first_seen_on date, first_seen_consult, last_seen_on date, last_seen_discharge, icu_transfer, consult_type , consult_time_in , consult_time_out , consult_premium_visit , consult_premium_first, consult_premium_travel, referring_laboratory , payment_program , payee , manual_review_indicator, service_location , last_code_generation , diagnoses from claims') as t1(id uuid, user_id uuid, photo_id uuid, status integer, details json, created_at timestamp without time zone, updated_at timestamp without time zone, number integer, original_id uuid, submitted_fee integer, paid_fee integer, specialty character varying, patient_name character varying, patient_number character varying, patient_province character varying, patient_birthday date, patient_sex character varying, hospital character varying, referring_physician character varying, most_responsible_physician boolean, admission_on date, first_seen_on date, first_seen_consult boolean, last_seen_on date, last_seen_discharge boolean, icu_transfer boolean, consult_type character varying, consult_time_in character varying, consult_time_out character varying, consult_premium_visit character varying, consult_premium_first boolean, consult_premium_travel boolean, referring_laboratory character varying, payment_program character varying, payee character varying, manual_review_indicator boolean, service_location character varying, last_code_generation character varying, diagnoses jsonb) where not exists (select claims.id from claims where claims.id = t1.id) ;

  Ctrl-D
  Ctrl-D

  cd ~/backups/mobilling
  cx download -s Mo Billing Javascript -e production /var/deploy/mo_billing_javascript/web_head/shared/uploads/ .
  cd uploads/photo/
