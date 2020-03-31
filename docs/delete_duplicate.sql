DELETE 
-- SELECT *

FROM
	tiles_data_1008 A 
WHERE
	A.ID <> ( SELECT MIN ( B.ID ) FROM tiles_data_1008 B WHERE A.gid = B.gid 
    -- and B.gid < 10000000
	) 
    -- and A.gid < 10000000
	;