-- pg_dump -h localhost -p 5432 -U postgres -W postgres -d tdt2018 -t tiles_data_1008 | gzip > tdt2018_buildings.gz

-- 大数据量的备份数据库
pg_dump tdt2018 -t tiles_data_1008 | gzip > tdt2018_buildings.gz

-- 还原数据库
gunzip -c tdt2018_buildings.gz | psql tdt2018