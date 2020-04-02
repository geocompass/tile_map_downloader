module.exports = {
  point_to_bbox(points) {
    if (!points || points.length < 2) {
      return false;
    }

    let [xmin, ymin] = points[0];
    let [xmax, ymax] = points[1];
    for (let point of points) {
      if (xmin > point[0]) {
        xmin = point[0];
      }
      if (ymin > point[1]) {
        ymin = point[1];
      }
      if (xmax < point[0]) {
        xmax = point[0];
      }
      if (ymax < point[1]) {
        ymax = point[1];
      }
    }
    return [xmin, ymin, xmax, ymax];
  }
};
