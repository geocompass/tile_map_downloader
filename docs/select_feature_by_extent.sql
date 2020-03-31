SELECT
	jsonb_build_object ( 'type', 'FeatureCollection', 'features', jsonb_agg ( features.feature ) ) 
FROM
	(
	SELECT
		jsonb_build_object ( 'type', 'Feature', 'id', gid, 'geometry', ST_AsGeoJSON ( geom ) :: jsonb, 'properties', to_jsonb ( inputs ) - 'gid' - 'geom' ) AS feature 
	FROM
		(
		SELECT
			gid,
			"CNAME",
			geomb AS geom 
		FROM
			tiles_data_1008 
		WHERE
			geomb 
			-- && -- intersects,  gets more rows  -- CHOOSE ONLY THE
			@-- contained by, gets fewer rows -- ONE YOU NEED!
		ST_MakeEnvelope ( 116.31890773773195, 39.9014896594113, 116.32216930389403, 39.90361312394224, 4326 )) inputs 
	) features;