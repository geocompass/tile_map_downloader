const UTILS = require("./utils");

let points = [
  [102.064647525, 33.2015042630001],
  [102.074826, 33.2017080000001]
];

let bbox = UTILS.point_to_bbox(points);

console.log(bbox);
