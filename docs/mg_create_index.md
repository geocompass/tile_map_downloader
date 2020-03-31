```sql
# 创建索引
db.getCollection('tiles_data_1010').createIndex({"tile_column":1})


#通过索引查询
db.getCollection('tiles_data_1008').find({
    tile_column: {
        $gt: 10100000
    }
}).limit(10)

```
