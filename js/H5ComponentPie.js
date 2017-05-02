/* 饼图表组件对象 */

var H5ComponentPie = function(name,cfg){
  var component = new H5ComponentBase(name,cfg);
  
  // 绘制网格线 —— 背景层
  var w = cfg.width;
  var h = cfg.height;

  // 加入一个底图层
  var cns = document.createElement('canvas');
  var ctx = cns.getContext('2d');
  cns.width = ctx.width = w;
  cns.height = ctx.height = h;
  $(cns).css('zIndex',1);
  component.append(cns);
  var r = w/2;

  ctx.beginPath();
  ctx.fillStyle = "#eee";
  ctx.strokeStyle = "#eee";
  ctx.lineWidth = 1;
  ctx.arc(r,r,r,0,2*Math.PI);
  ctx.fill();
  ctx.stroke();

  // 加入一个数据层
  var cns = document.createElement('canvas');
  var ctx = cns.getContext('2d');
  cns.width = ctx.width = w;
  cns.height = ctx.height = h;
  $(cns).css('zIndex',2);
  component.append(cns);
  var r = w/2;
  var sAngle = 1.5*Math.PI;
  var eAngle = 0;
  var aAngle = 2*Math.PI;
  var colors = ['red','yellow','#a00','green','orange'];

  var step = cfg.data.length;
  for(var i = 0; i < step; i++){
    item = cfg.data[i];
    var color = item[2] || (item[2] = colors.pop());
  
    eAngle = sAngle + aAngle*item[1];
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.strokeStyle = color;
    ctx.lineWidth = 0.1;
    ctx.moveTo(r,r);
    ctx.arc(r,r,r,sAngle,eAngle);
    ctx.fill();
    ctx.stroke();
    sAngle = eAngle;

    var text = $('<div class="text">');
    text.text(item[0]);
    var per = $('<div class="per">');
    per.text(item[1]*100 + '%');
    text.append(per);

    var x = r + r * Math.cos(sAngle);
    var y = r + r * Math.sin(sAngle);
    if (x > w/2) {
      text.css('left',x/2+8);
    } else {
      text.css('right',(w-x)/2+8);
    };
    if (y > h/2) {
      text.css('top',y/2+10);
    } else {
      text.css('bottom',(h-y)/2+18);
    }
    if (cfg.data[i][2]) {
      text.css('color',cfg.data[i][2]);
    }
    per.css('font-size','10px')
    text.css('opacity',0).css('font-size','14px');
    component.append(text);
  }

  // 加入一个蒙板层
  var cns = document.createElement('canvas');
  var ctx = cns.getContext('2d');
  cns.width = ctx.width = w;
  cns.height = ctx.height = h;
  $(cns).css('zIndex',3);
  component.append(cns);

  ctx.fillStyle = "#eee";
  ctx.strokeStyle = "#eee";
  ctx.lineWidth = 1;
  var draw =function(per){
    ctx.clearRect(0,0,w,h);
    ctx.beginPath();
    ctx.moveTo(r,r);
    if (per <= 0) {
      ctx.arc(r,r,r,0,2*Math.PI);
      component.find('.text').css('opacity',0);
    } else{
      ctx.arc(r,r,r,sAngle,sAngle+2*Math.PI*per,true);
    };
    if (per >= 1) {
      component.find('.text').css('opacity',1);
    };
    ctx.fill();
    ctx.stroke();
  }
  draw(0);
  component.on('onLoad',function(){
    // 饼图生长动画
    var s = 0;
    for( i = 0; i < 100; i++){
      setTimeout(function(){
        s += 0.01;
        draw(s);
      },i*10+500);
    }
  });
  component.on('onLeave',function(){
    // 饼图退场动画
    var s = 1;
    for( i = 0; i < 100; i++){
      setTimeout(function(){
        s -= 0.01;
        draw(s);
      },i*10);
    }
  })
  return component;
}