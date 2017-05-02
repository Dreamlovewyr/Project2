/* 雷达图表组件对象 */

var H5ComponentRadar = function(name,cfg){
  var component = new H5ComponentBase(name,cfg);
  
  // 绘制网格线 —— 背景层
  var w = cfg.width;
  var h = cfg.height;

  // 加入一个画布（作网格线背景）
  var cns = document.createElement('canvas');
  var ctx = cns.getContext('2d');
  cns.width = ctx.width = w;
  cns.height = ctx.height = h;
  component.append(cns);

  var r = w/2;
  var step = cfg.data.length;
  var isBlue = false;
  for(var s = 10; s > 0; s--){
    ctx.beginPath();
    for(var i =0; i < step; i++){
      var rad = (2*Math.PI/360)*(360/step)*i;
      var x = r + r*Math.sin(rad)*(s/10);
      var y = r + r*Math.cos(rad)*(s/10);
      ctx.lineTo(x,y);
    }
    ctx.closePath();
    ctx.fillStyle = (isBlue = !isBlue) ? '#99c0ff' : '#f1f9ff';
    ctx.fill();
  };

  // 绘制伞骨
  ctx.beginPath();
  for(var i =0; i < step; i++){
    var rad = (2*Math.PI/360)*(360/step)*i;
    var x = r + r*Math.sin(rad);
    var y = r + r*Math.cos(rad);
    ctx.moveTo(r,r);
    ctx.lineTo(x,y);

    // 显示项目名称
    var text = $('<div class="text">');
    text.text(cfg.data[i][0]);
    text.css('transition','all 1s '+0.2*i+'s');
    if (x > w/2) {
      text.css('left',x/2+5);
    } else {
      text.css('right',(w-x)/2+5);
    };
    if (y > h/2) {
      text.css('top',y/2+5);
    } else {
      text.css('bottom',(h-y)/2+5);
    };
    if (cfg.data[i][2]) {
      text.css('color',cfg.data[i][2]);
    };
    text.css('opacity',0); 
    component.append(text);
  }
  ctx.strokeStyle = '#e0e0e0';
  ctx.stroke();

  // 数据层开发
  // 加入一个画布
  var cns = document.createElement('canvas');
  var ctx = cns.getContext('2d');
  cns.width = ctx.width = w;
  cns.height = ctx.height = h;
  component.append(cns);
  ctx.strokeStyle = '#f00';
  var draw =function(per){

    if (per >= 1) {
      component.find('.text').css('opacity',1);
    };
    if (per <= 1) {
      component.find('.text').css('opacity',0);
    }
    ctx.clearRect(0,0,w,h);
    // 绘制数据的折线    
    for(var i = 0; i < step; i++){
      var rad = (2*Math.PI/360)*(360/step)*i;
      var rate = cfg.data[i][1]*per;
      var x = r + r*Math.sin(rad)*rate;
      var y = r + r*Math.cos(rad)*rate;
      ctx.lineTo(x,y);
    }
    ctx.closePath();
    ctx.stroke();

    // 填充圆点
    ctx.fillStyle = '#ff7676';
    for(var i = 0; i < step; i++){
      var rad = (2*Math.PI/360)*(360/step)*i;
      var rate = cfg.data[i][1]*per;
      var x = r + r*Math.sin(rad)*rate;
      var y = r + r*Math.cos(rad)*rate;
      ctx.beginPath();
      ctx.arc(x,y,5,0,2*Math.PI);
      ctx.fill();
      ctx.closePath();
    }
    ctx.stroke();
  }

  component.on('onLoad',function(){
    var s = 0;
    for( i = 0; i < 100; i++){
      setTimeout(function(){
        s += 0.01;
        draw(s);
      },i*10+500);
    }
  });
  component.on('onLeave',function(){
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