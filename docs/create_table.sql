CREATE TABLE "public"."buildings" (
  "gid" serial NOT NULL,
  "osm_id" varchar(11) COLLATE "pg_catalog"."default",
  "name" varchar(48) COLLATE "pg_catalog"."default",
  "type" varchar(16) COLLATE "pg_catalog"."default",
  "geom" "public"."geometry",
  CONSTRAINT "buildings_pkey" PRIMARY KEY ("gid")
)
;

ALTER TABLE "public"."buildings" 
  OWNER TO "postgres";

CREATE INDEX "buildings_geom_idx" ON "public"."buildings" USING gist (
  "geom" "public"."gist_geometry_ops_2d"
);

CREATE INDEX "buildings_gid_idx" ON "public"."buildings" USING btree (
  "gid" "pg_catalog"."int4_ops" ASC NULLS LAST
);