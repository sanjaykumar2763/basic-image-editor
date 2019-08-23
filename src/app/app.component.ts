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

  cornerProperties = {
    transparentCorners: false,
    cornerStyle: 'circle',
    cornerColor: '#1b95e0'
  };

  ngOnInit(): void {
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

    fabric.Object.prototype._renderStroke = function(ctx) {
      if (!this.stroke || this.strokeWidth === 0) {
        return;
      }
      if (this.shadow && !this.shadow.affectStroke) {
        this._removeShadow(ctx);
      }
      ctx.save();
      ctx.scale(1 / this.scaleX, 1 / this.scaleY);
      this._setLineDash(ctx, this.strokeDashArray, this._renderDashedStroke);
      this._applyPatternGradientTransform(ctx, this.stroke);
      ctx.stroke();
      ctx.restore();
    };

    this.onAddArrow();
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
      ...this.cornerProperties
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
      ...this.cornerProperties
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
      transparentCorners: false,
      ...this.cornerProperties
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

  onAddArrow() {
    const points = this.getArrowPoints(100, 150, 150, 150);
    const arrow = new fabric.Polyline(points, {
      fill: this.selectedColor,
      strokeWidth: 0,
      originX: 'left',
      originY: 'top',
      ...this.cornerProperties
    });
    arrow.setControlVisible('tl', false);
    arrow.setControlVisible('tr', false);
    arrow.setControlVisible('bl', false);
    arrow.setControlVisible('br', false);
    arrow.setControlVisible('mt', false);
    arrow.setControlVisible('mb', false);

    this.canvas.add(arrow);

    this.canvas.setActiveObject(arrow);
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

      if (activeObject.get('type') === 'polyline') {
        activeObject.fill = this.selectedColor;
      }

      activeObject.dirty = true;
      this.canvas.renderAll();
    }
  }

  private getArrowPoints(fromx, fromy, tox, toy) {
    const angle = Math.atan2(toy - fromy, tox - fromx);

    const headLength = 10; // arrow head size

    // bring the line end back some to account for arrow head.
    tox = tox - headLength * Math.cos(angle);
    toy = toy - headLength * Math.sin(angle);

    // calculate the points.
    const points = [
      {
        x: fromx, // start point
        y: fromy
      },
      {
        x: fromx - (headLength / 4) * Math.cos(angle - Math.PI / 2),
        y: fromy - (headLength / 4) * Math.sin(angle - Math.PI / 2)
      },
      {
        x: tox - (headLength / 4) * Math.cos(angle - Math.PI / 2),
        y: toy - (headLength / 4) * Math.sin(angle - Math.PI / 2)
      },
      {
        x: tox - headLength * Math.cos(angle - Math.PI / 2),
        y: toy - headLength * Math.sin(angle - Math.PI / 2)
      },
      {
        x: tox + headLength * Math.cos(angle), // tip
        y: toy + headLength * Math.sin(angle)
      },
      {
        x: tox - headLength * Math.cos(angle + Math.PI / 2),
        y: toy - headLength * Math.sin(angle + Math.PI / 2)
      },
      {
        x: tox - (headLength / 4) * Math.cos(angle + Math.PI / 2),
        y: toy - (headLength / 4) * Math.sin(angle + Math.PI / 2)
      },
      {
        x: fromx - (headLength / 4) * Math.cos(angle + Math.PI / 2),
        y: fromy - (headLength / 4) * Math.sin(angle + Math.PI / 2)
      },
      {
        x: fromx,
        y: fromy
      }
    ];

    return points;
  }
}
