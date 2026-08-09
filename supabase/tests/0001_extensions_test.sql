-- FND-007 pgTAP test: foundation extensions are available.
begin;

select plan(2);

select has_extension('pgmq', 'pgmq extension is enabled');
select has_extension('pg_cron', 'pg_cron extension is enabled');

select * from finish();

rollback;
