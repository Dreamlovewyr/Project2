var H5_loading = function(images,firstPage) {
    var id = this.id;
    if (this._images == undefined) {
        this._images = (images || []).length;
        this.loaded = 0;
        window[id] = this;  // 把当前的对象保存在全局对象window中，用来进行某张图片加载完成后的回掉函数
        for (s in images) {
          var item = images[s];
          var img = new Image;
          img.onload= function(){
            window[id].loader();
          }
          img.src = item;
        }
        $('#rate').text('0%');
        return this;
    } else {
      this.loaded++;
      $('#rate').text(((this.loaded/this._images*100) >> 0) + '%');
      if (this.loaded < this._images) {
         return this;
      }
    }
    window[id] = null;
     this.el.fullpage({
      onLeave: function(index,nextIndex,direction){
       $(this).find('.h5_component').trigger('onLeave');
        },
      afterLoad: function(anchorLink,index){
       $(this).find('.h5_component').trigger('onLoad');
        }
    });
     this.el.show();
    if (firstPage) {
      $.fn.fullpage.moveTo(firstPage);
    }
}