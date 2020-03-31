CREATE TABLE "public"."tiles_data_1008" (
  "gid" int4 NOT NULL,
  "CNAME" varchar(48) COLLATE "pg_catalog"."default",
  "LEVEL" varchar(16) COLLATE "pg_catalog"."default",
  "geoma" "public"."geometry",
  "geom" text COLLATE "pg_catalog"."default"
)
;

ALTER TABLE "public"."tiles_data_1008" 
  OWNER TO "postgres";

CREATE INDEX "buildings_geom_idx" ON "public"."tiles_data_1008" USING gist (
  "geoma" "public"."gist_geometry_ops_2d"
);

CREATE INDEX "buildings_gid_idx" ON "public"."tiles_data_1008" USING btree (
  "gid" "pg_catalog"."int4_ops" ASC NULLS LAST
);