// 定义自定义覆盖物的构造函数

function save(){
  alert('l');
}
function ImageOverlay(center, length, image, clickCallback){
  this._center = center;
  this._length = length;
  this._image = image;
  this._clickCallback = clickCallback;
}
// 继承API的BMap.Overlay
ImageOverlay.prototype = new BMap.Overlay();
// 实现初始化方法

ImageOverlay.prototype.initialize = function(map){
// 保存map对象实例
  this._map = map;
  // 创建div元素，作为自定义覆盖物的容器
  var div = $("<div class='imageOverlayDiv' style='width: " + this._length + "px;height: " + this._length + "px;'></div>");
  var div2 = $("<div class='imageOverlayDiv1' style='width: " + this._length + "px;height: " + this._length + "px;background-image: url("+this._image+");'></div>");
  var div3 = $("<div class='imageOverlayDivShadow1' style='width: " + this._length + "px;height: " + this._length + "px;'></div>");
  var div4 = $("<div class='imageOverlayDivShadow2' style='width: " + this._length + "px;height: " + this._length + "px;'></div>");
  div.append(div2);
  div.append(div3);
  div.append(div4);

  div2.click(this._clickCallback);

  div = div[0];

// 将div添加到覆盖物容器中
  map.getPanes().markerPane.appendChild(div);

// 保存div实例
  this._div = div;

// 需要将div元素作为方法的返回值，当调用该覆盖物的show、
// hide方法，或者对覆盖物进行移除时，API都将操作此元素。
  return div;
};
// 实现绘制方法
ImageOverlay.prototype.draw = function(){
// 根据地理坐标转换为像素坐标，并设置给容器
  var position = this._map.pointToOverlayPixel(this._center);
  this._div.style.left = position.x - this._length / 2 + "px";
  this._div.style.top = position.y - this._length - 10 + "px";
};
// 实现显示方法
ImageOverlay.prototype.show = function(){
  if (this._div){
    this._div.style.display = "";
  }
};
// 实现隐藏方法
ImageOverlay.prototype.hide = function(){
  if (this._div){
    this._div.style.display = "none";
  }
};
module.exports = save;
module.exports = ImageOverlay;