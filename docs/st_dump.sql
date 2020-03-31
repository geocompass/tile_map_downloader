SELECT
	st_asgeojson (( st_dump ( geom )).geom ) 
FROM
	testgeom



-- delete from tiles_data_1008
select count(*) from tiles_data_1008

update tiles_data_1008 t
set geoma = t.geom
where gid = 1

select st_asgeojson((st_dump(geoma)).geom) from tiles_data_1008 where gid = 1