declare const fabric: any;
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  imageUrl = 'assets/waves.jpg';

  canvas: any;
  activeCid = 'c1';
  selectedColor = '#f44336';

  ngOnInit(): void {
    fabric.Object.prototype.objectCaching = false;

    this.canvas = new fabric.Canvas('image-editor');

    fabric.Image.fromURL(this.imageUrl, image => {
      this.canvas.setBackgroundImage(
        image,
        this.canvas.renderAll.bind(this.canvas),
        {
          scaleX: this.canvas.width / image.width,
          scaleY: this.canvas.height / image.height
        }
      );
    });
  }

  onAddRectangle() {
    const rectangle = new fabric.Rect({
      top: 100,
      left: 100,
      width: 60,
      height: 70,
      stroke: this.selectedColor,
      strokeWidth: 3,
      fill: 'transparent',
      transparentCorners: false
    });

    this.canvas.add(rectangle);
    this.canvas.setActiveObject(rectangle);
  }

  onAddCircle() {
    const circle = new fabric.Circle({
      top: 100,
      left: 100,
      radius: 30,
      stroke: this.selectedColor,
      strokeWidth: 3,
      fill: 'transparent',
      transparentCorners: false
    });

    this.canvas.add(circle);
    this.canvas.setActiveObject(circle);
  }

  onAddText() {
    const text = new fabric.IText('Tap and Type', {
      top: 100,
      left: 100,
      fontFamily: 'arial black',
      fill: this.selectedColor,
      fontSize: 20,
      transparentCorners: false
    });

    this.canvas.add(text);
    this.canvas.setActiveObject(text);
  }

  onAddBrush() {
    this.canvas.freeDrawingBrush = new fabric.PencilBrush(this.canvas);
    this.canvas.freeDrawingBrush.color = this.selectedColor;
    this.canvas.freeDrawingBrush.width = 20;
    this.canvas.isDrawingMode = true;

    this.canvas.on('mouse:up', opt => {
      if (this.canvas.isDrawingMode) {
        const c = fabric.util.copyCanvasElement(this.canvas.upperCanvasEl);
        this.canvas.contextTopDirty = true;
        this.canvas.isDrawingMode = false;
        this.canvas.selectable = false;
      }
    });
  }

  onAddLine() {
    const line = new fabric.Line([50, 50, 200, 200], {
      left: 100,
      top: 100,
      stroke: this.selectedColor,
      strokeWidth: 3
    });

    this.canvas.add(line);
    this.canvas.setActiveObject(line);
  }

  onDelete() {
    this.canvas.remove(this.canvas.getActiveObject());
  }

  onSelectColor(cid: string, selectedColor: string) {
    this.activeCid = cid;
    this.selectedColor = selectedColor;

    const activeObject = this.canvas.getActiveObject();
    if (activeObject) {
      activeObject.stroke = this.selectedColor;

      // this.canvas.building.dirty = true;
      this.canvas.renderAll();
    }
  }
}
