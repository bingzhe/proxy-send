<template>
  <div>
    <canvas id="diy-designer-wrapper"></canvas>
    <!-- style="visibility: hidden;" -->
    <canvas id="canvas_crop"></canvas>
    <img width="200" height="200" src="@/assets/images/login_bg.png" alt>

    <button @click="test">测试</button>
    <button @click="addImg">addImg</button>
    <img :src="imgSrc">
  </div>
</template>

<script>
import { fabric } from 'fabric'

export default {
  data() {
    return {
      height: 400,
      width: 200,
      radius: 30,

      canvas: null,
      rect: null,
      img: null,
      clipPath: null,

      imgSrc: '',
    }
  },
  mounted() {
    const _this = this;
    this.canvas = new fabric.Canvas('diy-designer-wrapper', {
      width: 600,
      height: 600,
    });

    //   var canvas = this.__canvas = new fabric.Canvas('c');
    fabric.Object.prototype.transparentCorners = false;
    this.canvas.controlsAboveOverlay = true;
    var radius = 300;

    // this.rect = new fabric.Rect({
    //   left: 100,
    //   top: 100,
    //   width: _this.width,
    //   height: _this.height,
    //   rx: _this.radius,
    //   ry: _this.radius,
    //   //   selectable: false,
    //   fill: 'green',
    // });


    // this.canvas.add(this.rect)

    this.clipPath = new fabric.Rect({
      left: 100,
      top: 100,
      width: _this.width,
      height: _this.height,
      rx: _this.radius,
      ry: _this.radius,
      //   selectable: false,
      //   absolutePositioned: true,
      fill: 'transparent',
    });
    this.canvas.clipPath = this.clipPath;
  },
  methods: {
    addImg() {
      const _this = this;
      fabric.Image.fromURL(require('@/assets/images/1.jpg'), function (oImg) {
        // oImg.set('width', 200);
        // oImg.set('height', 200);
        // oImg.clipPath = _this.clipPath
        // scale image down, and flip it, before adding it onto canvas
        _this.img = oImg
        _this.canvas.add(oImg);
      });

    },
    test() {
      //   var group = new fabric.Group([this.rect, this.img])

      //   this.canvas.add(group)

      //   this.imgSrc = this.canvas.clipPath.toDataURL('png')
      //   //   this.imgSrc = this.img.toDataURL('png')
      //   const ctx = this.canvas.getContext();
      //   console.log(this.canvas.drawClipPathOnCanvas(ctx))

      //   var rect = new fabric.Rect({
      //     left: 100,
      //     top: 100,
      //     width: this.width,
      //     height: this.height,
      //     rx: this.radius,
      //     ry: this.radius,
      //     //   selectable: false,
      //     //   absolutePositioned: true,
      //     fill: 'transparent',
      //   });


      var canvas_crop = new fabric.Canvas("canvas_crop");
      const _this = this;
      console.log(_this.canvas.toDataURL('png'))
      this.imgSrc = _this.canvas.toDataURL('png')

      fabric.Image.fromURL(_this.canvas.toDataURL('png'), function (img) {
        canvas_crop.add(img)
        canvas_crop.setHeight(_this.height);
        canvas_crop.setWidth(_this.width);

        img.set('top', -100);
        img.set('left', -100);
        // canvas_crop.setTop(-100)
        // canvas_crop.setWidth(-100);
        canvas_crop.renderAll();
        console.log(canvas_crop.toDataURL('png'))
        _this.canvas.clear()
        _this.imgSrc = canvas_crop.toDataURL('png')
        // fabric.Image.fromURL(canvas_crop.toDataURL('png'), function (croppedImg) {
        //   const a = _this.canvas.getContext().drawImage(croppedImg._element, 100, 100, _this.width, _this.height, 100, 100, _this.width, _this.height);
        //   console.log(a)
        //   //   _this.imgSrc = a.toDataURL('png')
        // });
      });

    }
  }
}
</script>

<style lang="scss" scoped>
#diy-designer-wrapper {
  border: 1px solid #ccc;
}
</style>

