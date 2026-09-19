import * as PIXI from 'pixi.js'
import { View } from './view';
import { Grid } from '../models/grid';
import { Measurement } from 'src/app/shared/models/measurement';
import { HexGrid } from '../models/hex-grid';
import { formatMeasurementDistance, measurementDistance } from 'src/app/shared/measurement-tools';

export class MeasurementView extends View {
    shape: PIXI.Graphics
    handles: PIXI.Graphics
    cells: PIXI.Graphics
    distanceText: PIXI.Text

    constructor(public measurement: Measurement, private grid: Grid) {
        super()

        this.cells = new PIXI.Graphics()
        this.shape = new PIXI.Graphics()
        this.handles = new PIXI.Graphics()
        this.distanceText = new PIXI.Text({
            text: '',
            style: {
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                fontSize: Math.max(14, this.grid.size / 3),
                fontWeight: 'bold',
                fill: 0xffffff,
                dropShadow: { color: '#000000', blur: 5, distance: 1, alpha: 1, angle: 0 }
            }
        })
        this.distanceText.anchor.set(0, 0.5)
        this.distanceText.resolution = 2

        this.addChild(this.cells)
        this.addChild(this.shape)
        this.addChild(this.handles)
        this.addChild(this.distanceText)
    }

    getPolygon(points: Array<number>): Array<PIXI.Point> {
        var result: Array<PIXI.Point> = []

        for (let i = 0; i < points.length - 1; i = i + 2) {
            result.push(new PIXI.Point(Math.abs(points[i]), Math.abs(points[i+1])))
        }

        return result
    }


    private gridPath(): Array<number> {
        const result: Array<number> = []
        const seen = new Set<string>()
        const stepSize = Math.max(1, Math.min(this.grid.adjustedSize.width, this.grid.adjustedSize.height) / 5)

        for (let i = 2; i + 1 < this.measurement.data.length; i += 2) {
            const startX = this.measurement.data[i - 2]
            const startY = this.measurement.data[i - 1]
            const endX = this.measurement.data[i]
            const endY = this.measurement.data[i + 1]
            const segmentLength = Math.hypot(endX - startX, endY - startY)
            const steps = Math.max(1, Math.ceil(segmentLength / stepSize))

            for (let step = 0; step <= steps; step++) {
                const amount = step / steps
                let x = startX + ((endX - startX) * amount)
                let y = startY + ((endY - startY) * amount)
                let key: string

                if (this.grid instanceof HexGrid) {
                    const hex = this.grid.hex(new PIXI.Point(x, y)).round()
                    key = `${hex.q}:${hex.r}:${hex.s}`
                    const center = this.grid.center(hex)
                    x = center.x
                    y = center.y
                } else {
                    const position = this.grid.position(x, y)
                    key = `${position.x}:${position.y}`
                }

                if (!seen.has(key)) {
                    seen.add(key)
                    result.push(x, y)
                }
            }
        }

        return result
    }

    async draw() {
        this.clear()

        this.visible = !this.measurement.hidden

        const color = new PIXI.Color(this.measurement.color || '#2f8cff')

        const path = this.gridPath()
        if (path.length > 0) {
            this.grid.pathGraphics(path, { width: 1, height: 1 }, color.toNumber(), this.cells)
            this.cells.alpha = 0.2
        }

        for(let i = 0; i < this.measurement.data.length; i = i + 2) {
            if (i == 0) {
                this.shape.moveTo(this.measurement.data[i], this.measurement.data[i + 1])
            } else {
                this.shape.lineTo(this.measurement.data[i], this.measurement.data[i + 1])
            }

            this.handles.circle(this.measurement.data[i], this.measurement.data[i + 1], Math.max(4, Math.round(this.grid.size / 12))).fill(color)
        }
        this.shape.stroke({ width: Math.max(3, this.grid.size / 12), color, alpha: 0.95 })

        if (this.measurement.data.length >= 4) {
            const end = this.measurement.data.length - 2
            const distance = measurementDistance(this.measurement.data, this.grid.pixelRatio)
            this.distanceText.text = formatMeasurementDistance(distance, this.grid.units)
            this.distanceText.style.fontSize = Math.max(14, this.grid.size / 3)
            this.distanceText.position.set(
                this.measurement.data[end] + Math.max(8, this.grid.size / 6),
                this.measurement.data[end + 1] - Math.max(8, this.grid.size / 6)
            )
        }

        return this;
    }

    clear() {
        this.shape?.clear()
        this.handles?.clear()
        this.cells?.clear()
        if (this.distanceText) this.distanceText.text = ''
    }
}
