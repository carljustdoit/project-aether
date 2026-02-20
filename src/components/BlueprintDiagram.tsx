"use client";

import { useRef, useEffect, useState, useCallback } from "react";

/* ─── Types ─── */
interface Annotation {
    label: string;
    x: number;
    y: number;
    value?: string;
    align?: "left" | "right";
}

interface HotspotData {
    id: string;
    label: string;
    desc: string;
    cx: number;
    cy: number;
    radius: number;
}

/* ─── Palette ─── */
const AMBER = "#D4A853";
const AMBER_DIM = "rgba(212,168,83,0.25)";
const AMBER_FILL = "rgba(212,168,83,0.06)";
const STEEL = "rgba(122,133,148,0.5)";
const BG = "#0C1117";
const HULL_FILL = "rgba(20,30,42,0.7)";
const GAS_CELL = "rgba(212,168,83,0.04)";

/* ─── Annotation Data ─── */
const annotations: Annotation[] = [
    { label: "LENGTH", x: 0.5, y: 0.08, value: "800 M" },
    { label: "WINGSPAN", x: 0.82, y: 0.22, value: "200 M", align: "right" },
    { label: "MAX PAYLOAD", x: 0.15, y: 0.72, value: "150 METRIC TONS", align: "left" },
    { label: "BUOYANCY GAS", x: 0.7, y: 0.35, value: "H₂/He HYBRID", align: "right" },
    { label: "CRUISE ALTITUDE", x: 0.18, y: 0.22, value: "3,000 - 6,000 M", align: "left" },
    { label: "PROPULSION", x: 0.85, y: 0.52, value: "SOLAR-ELECTRIC HYBRID", align: "right" },
];

const hotspots: HotspotData[] = [
    { id: "hull", label: "COMPOSITE HULL", desc: "Multi-layer alloy-composite envelope with UV-resistant outer skin. Internal helium cells provide redundant lift chambers.", cx: 0.5, cy: 0.35, radius: 0.06 },
    { id: "gondola", label: "COMMAND GONDOLA", desc: "Pressurized crew module with 360° situational awareness. AI-assisted flight systems with triple-redundant avionics.", cx: 0.42, cy: 0.62, radius: 0.04 },
    { id: "cargo", label: "CARGO BAY", desc: "Modular cradle system accommodates infrastructure payloads up to 150 metric tons. Quick-release mechanism for drone deployment modules.", cx: 0.55, cy: 0.56, radius: 0.04 },
    { id: "tail", label: "TAIL ASSEMBLY", desc: "Four cruciform stabilizer fins with active trim control. Provides yaw/pitch authority in crosswinds up to 40 knots.", cx: 0.12, cy: 0.35, radius: 0.04 },
    { id: "nacelle", label: "PROPULSION NACELLE", desc: "Vectoring electric motors fed by solar array and onboard fuel cells. Each nacelle provides 8,000 N of continuous thrust.", cx: 0.72, cy: 0.52, radius: 0.035 },
    { id: "drones", label: "DRONE MODULES", desc: "8-12 autonomous heavy-lift deployment drones. Force-feedback winches enable sub-centimeter placement accuracy during descent.", cx: 0.55, cy: 0.72, radius: 0.04 },
];

/* ─── Helper: Draw ellipse hull profile ─── */
function getEllipsePoint(cx: number, cy: number, rx: number, ry: number, angle: number): [number, number] {
    return [cx + rx * Math.cos(angle), cy + ry * Math.sin(angle)];
}

/* ─── Canvas Drawing Functions ─── */

function drawGrid(ctx: CanvasRenderingContext2D, w: number, h: number) {
    const spacing = 40;
    ctx.strokeStyle = "rgba(212,168,83,0.03)";
    ctx.lineWidth = 0.5;
    for (let x = 0; x < w; x += spacing) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
    }
    for (let y = 0; y < h; y += spacing) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
    }
    ctx.strokeStyle = "rgba(212,168,83,0.05)";
    ctx.lineWidth = 0.8;
    for (let x = 0; x < w; x += 200) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
    }
    for (let y = 0; y < h; y += 200) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
    }
}

function drawAirship(ctx: CanvasRenderingContext2D, w: number, h: number, time: number) {
    const cx = w * 0.5;
    const cy = h * 0.38;
    const hullW = w * 0.72;
    const hullH = h * 0.28;
    const hullRX = hullW / 2;
    const hullRY = hullH / 2;

    ctx.save();

    // ─── Hull fill (dark with subtle gradient) ───
    const hullGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, hullRX);
    hullGrad.addColorStop(0, "rgba(25,38,55,0.5)");
    hullGrad.addColorStop(0.7, "rgba(18,28,40,0.4)");
    hullGrad.addColorStop(1, "rgba(12,17,23,0.2)");
    ctx.fillStyle = hullGrad;
    ctx.beginPath();
    ctx.ellipse(cx, cy, hullRX, hullRY, 0, 0, Math.PI * 2);
    ctx.fill();

    // ─── Internal gas cells ───
    const cellCount = 5;
    for (let i = 0; i < cellCount; i++) {
        const t = (i / (cellCount - 1)) * 2 - 1; // -1 to 1
        const cellCX = cx + t * hullRX * 0.65;
        const cellRX = hullRX * 0.14;
        const envelopeR = Math.sqrt(Math.max(0, 1 - (t * 0.65) ** 2));
        const cellRY = hullRY * 0.55 * envelopeR;

        const pulse = 0.4 + Math.sin(time * 0.8 + i * 1.3) * 0.15;
        ctx.fillStyle = `rgba(212,168,83,${0.03 * pulse})`;
        ctx.beginPath();
        ctx.ellipse(cellCX, cy, cellRX, cellRY, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = `rgba(212,168,83,${0.08 * pulse})`;
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.ellipse(cellCX, cy, cellRX, cellRY, 0, 0, Math.PI * 2);
        ctx.stroke();
    }

    // ─── Hull outline (main envelope) ───
    ctx.strokeStyle = AMBER;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.ellipse(cx, cy, hullRX, hullRY, 0, 0, Math.PI * 2);
    ctx.stroke();

    // ─── Inner structural ellipse ───
    ctx.strokeStyle = AMBER_DIM;
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.ellipse(cx, cy, hullRX * 0.88, hullRY * 0.85, 0, 0, Math.PI * 2);
    ctx.stroke();

    // ─── Panel seam lines (horizontal) ───
    const seamCount = 5;
    for (let i = 0; i < seamCount; i++) {
        const yFrac = (i + 1) / (seamCount + 1);
        const yOff = (yFrac - 0.5) * hullH * 0.9;

        ctx.strokeStyle = `rgba(212,168,83,${0.06 + yFrac * 0.04})`;
        ctx.lineWidth = 0.4;
        ctx.beginPath();

        for (let j = 0; j <= 80; j++) {
            const t = (j / 80) * 2 - 1;
            const xCurve = cx + t * hullRX * 0.98;
            const envelope = Math.sqrt(Math.max(0, 1 - t * t));
            const yCurve = cy + yOff * envelope;
            if (Math.abs(yOff) < hullRY * envelope) {
                if (j === 0) ctx.moveTo(xCurve, yCurve);
                else ctx.lineTo(xCurve, yCurve);
            }
        }
        ctx.stroke();
    }

    // ─── Structural ribs (vertical) ───
    const ribCount = 14;
    for (let i = 0; i < ribCount; i++) {
        const t = (i / (ribCount - 1)) * 2 - 1;
        const xPos = cx + t * hullRX * 0.95;
        const ribH = Math.sqrt(Math.max(0, 1 - t * t)) * hullRY;

        const pulse = Math.sin(time * 2 + i * 0.5) * 0.02 + 0.98;

        ctx.strokeStyle = `rgba(212,168,83,${0.12 + Math.abs(t) * 0.08})`;
        ctx.lineWidth = 0.6;
        ctx.beginPath();
        ctx.moveTo(xPos, cy - ribH * pulse);
        ctx.lineTo(xPos, cy + ribH * pulse);
        ctx.stroke();
    }

    // ─── Longitudinal stringers ───
    const stringerCount = 8;
    for (let i = 0; i < stringerCount; i++) {
        const frac = (i + 1) / (stringerCount + 1);
        const yOff = (frac - 0.5) * hullH * 0.92;

        ctx.strokeStyle = `rgba(212,168,83,${0.06 + frac * 0.04})`;
        ctx.lineWidth = 0.5;
        ctx.beginPath();

        for (let j = 0; j <= 80; j++) {
            const t = (j / 80) * 2 - 1;
            const xCurve = cx + t * hullRX * 0.98;
            const envelope = Math.sqrt(Math.max(0, 1 - t * t));
            const yCurve = cy + yOff * envelope;
            if (j === 0) ctx.moveTo(xCurve, yCurve);
            else ctx.lineTo(xCurve, yCurve);
        }
        ctx.stroke();
    }

    // ─── Solar panel array (top of hull) ───
    const panelCount = 8;
    for (let i = 0; i < panelCount; i++) {
        const t = (i / (panelCount - 1)) * 1.4 - 0.7;
        const px = cx + t * hullRX;
        const envelopeTop = Math.sqrt(Math.max(0, 1 - (t / 0.98) ** 2)) * hullRY;
        const py = cy - envelopeTop + 2;
        const pw = hullRX * 0.12;
        const ph = 6;

        ctx.fillStyle = "rgba(26,42,69,0.5)";
        ctx.fillRect(px - pw / 2, py - ph / 2, pw, ph);
        ctx.strokeStyle = "rgba(212,168,83,0.15)";
        ctx.lineWidth = 0.5;
        ctx.strokeRect(px - pw / 2, py - ph / 2, pw, ph);
        // Grid lines on panel
        ctx.strokeStyle = "rgba(212,168,83,0.08)";
        ctx.lineWidth = 0.3;
        ctx.beginPath();
        ctx.moveTo(px, py - ph / 2);
        ctx.lineTo(px, py + ph / 2);
        ctx.stroke();
    }

    // ─── Gondola ───
    const gondolaX = cx + hullW * 0.02;
    const gondolaY = cy + hullH * 0.62;
    const gW = hullW * 0.16;
    const gH = hullH * 0.38;

    // Struts (4 of them)
    ctx.strokeStyle = AMBER_DIM;
    ctx.lineWidth = 1;
    [-0.04, -0.015, 0.015, 0.04].forEach(xOff => {
        ctx.beginPath();
        ctx.moveTo(gondolaX + xOff * hullW, cy + hullH * 0.46);
        ctx.lineTo(gondolaX + xOff * hullW, gondolaY - gH / 2);
        ctx.stroke();
    });

    // Gondola body fill
    ctx.fillStyle = "rgba(18,26,38,0.7)";
    ctx.fillRect(gondolaX - gW / 2, gondolaY - gH / 2, gW, gH);

    // Gondola body outline
    ctx.strokeStyle = AMBER;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.rect(gondolaX - gW / 2, gondolaY - gH / 2, gW, gH);
    ctx.stroke();

    // Window strip (2 rows)
    ctx.fillStyle = "rgba(212,168,83,0.08)";
    ctx.fillRect(gondolaX - gW / 2 + 4, gondolaY - gH / 4 - 2, gW - 8, 4);
    ctx.strokeStyle = "rgba(212,168,83,0.2)";
    ctx.lineWidth = 0.6;
    ctx.strokeRect(gondolaX - gW / 2 + 4, gondolaY - gH / 4 - 2, gW - 8, 4);

    // Gondola internal lines
    ctx.strokeStyle = "rgba(212,168,83,0.08)";
    ctx.lineWidth = 0.4;
    for (let j = 1; j < 4; j++) {
        const lx = gondolaX - gW / 2 + (gW / 4) * j;
        ctx.beginPath();
        ctx.moveTo(lx, gondolaY - gH / 2);
        ctx.lineTo(lx, gondolaY + gH / 2);
        ctx.stroke();
    }

    // ─── Cargo Bay ───
    const cargoX = cx - hullW * 0.03;
    const cargoY = cy + hullH * 0.48;
    const cargoW = hullW * 0.2;
    const cargoH = hullH * 0.14;

    ctx.fillStyle = "rgba(15,22,32,0.5)";
    ctx.fillRect(cargoX - cargoW / 2, cargoY, cargoW, cargoH);
    ctx.strokeStyle = "rgba(212,168,83,0.3)";
    ctx.lineWidth = 0.8;
    ctx.strokeRect(cargoX - cargoW / 2, cargoY, cargoW, cargoH);

    // Cargo bay drone docks
    const dockCount = 4;
    for (let i = 0; i < dockCount; i++) {
        const dx = cargoX - cargoW / 2 + cargoW * ((i + 0.5) / dockCount);
        ctx.fillStyle = "rgba(212,168,83,0.1)";
        ctx.fillRect(dx - 4, cargoY + cargoH - 6, 8, 5);
        ctx.strokeStyle = "rgba(212,168,83,0.2)";
        ctx.lineWidth = 0.4;
        ctx.strokeRect(dx - 4, cargoY + cargoH - 6, 8, 5);
    }

    // ─── Tail fins (more detailed) ───
    const tailX = cx - hullRX * 0.92;
    const finLen = hullW * 0.14;

    [[0, -1], [0, 1]].forEach(([, dir]) => {
        // Filled fin
        ctx.fillStyle = "rgba(18,28,40,0.5)";
        ctx.beginPath();
        ctx.moveTo(tailX, cy);
        ctx.lineTo(tailX - finLen * 0.65, cy + dir * finLen * 0.75);
        ctx.lineTo(tailX - finLen * 0.85, cy + dir * finLen * 0.25);
        ctx.lineTo(tailX - finLen * 0.3, cy + dir * finLen * -0.05);
        ctx.closePath();
        ctx.fill();

        // Outline
        ctx.strokeStyle = AMBER;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(tailX, cy);
        ctx.lineTo(tailX - finLen * 0.65, cy + dir * finLen * 0.75);
        ctx.lineTo(tailX - finLen * 0.85, cy + dir * finLen * 0.25);
        ctx.lineTo(tailX - finLen * 0.3, cy + dir * finLen * -0.05);
        ctx.closePath();
        ctx.stroke();

        // Rib line inside fin
        ctx.strokeStyle = AMBER_DIM;
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(tailX - finLen * 0.15, cy + dir * finLen * 0.05);
        ctx.lineTo(tailX - finLen * 0.6, cy + dir * finLen * 0.5);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(tailX - finLen * 0.3, cy + dir * finLen * 0.1);
        ctx.lineTo(tailX - finLen * 0.7, cy + dir * finLen * 0.4);
        ctx.stroke();
    });

    // ─── Propulsion nacelles (more detailed) ───
    const nacelles: [number, number][] = [
        [cx + hullW * 0.22, cy + hullH * 0.42],
        [cx - hullW * 0.15, cy + hullH * 0.38],
        [cx + hullW * 0.37, cy + hullH * 0.28],
    ];

    nacelles.forEach(([nx, ny], i) => {
        // Pylon
        ctx.strokeStyle = AMBER_DIM;
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(nx, cy + hullH * 0.1);
        ctx.lineTo(nx, ny - 10);
        ctx.stroke();

        // Nacelle body fill
        ctx.fillStyle = "rgba(18,26,38,0.6)";
        ctx.beginPath();
        ctx.ellipse(nx, ny, 20, 9, 0, 0, Math.PI * 2);
        ctx.fill();

        // Nacelle outline
        ctx.strokeStyle = AMBER;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.ellipse(nx, ny, 20, 9, 0, 0, Math.PI * 2);
        ctx.stroke();

        // Inner detail line
        ctx.strokeStyle = AMBER_DIM;
        ctx.lineWidth = 0.4;
        ctx.beginPath();
        ctx.moveTo(nx - 12, ny); ctx.lineTo(nx + 12, ny);
        ctx.stroke();

        // Propeller (3-blade, animated)
        const propAngle = time * 4 + i * 1.5;
        ctx.save();
        ctx.translate(nx + 22, ny);
        for (let b = 0; b < 3; b++) {
            ctx.save();
            ctx.rotate(propAngle + (b * Math.PI * 2) / 3);
            ctx.fillStyle = `rgba(212,168,83,${0.2 + Math.sin(time * 3 + i) * 0.08})`;
            ctx.beginPath();
            ctx.ellipse(0, 0, 2, 14, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
        // Hub
        ctx.fillStyle = `rgba(212,168,83,0.4)`;
        ctx.beginPath();
        ctx.arc(0, 0, 3, 0, Math.PI * 2);
        ctx.fill();
        // Prop wash ring
        ctx.strokeStyle = `rgba(212,168,83,0.1)`;
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.arc(0, 0, 15, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
    });

    // ─── Drone modules ───
    const droneBaseY = cargoY + cargoH;
    const droneCount = 4;
    for (let i = 0; i < droneCount; i++) {
        const dx = cargoX - cargoW / 2 + cargoW * ((i + 0.5) / droneCount);
        const driftY = Math.sin(time * 1.5 + i * 0.8) * 3;
        const dy = droneBaseY + 14 + driftY;

        // Body fill
        ctx.fillStyle = `rgba(18,26,38,0.5)`;
        ctx.fillRect(dx - 7, dy, 14, 10);

        ctx.strokeStyle = `rgba(212,168,83,${0.4 + Math.sin(time + i) * 0.1})`;
        ctx.lineWidth = 0.8;
        ctx.strokeRect(dx - 7, dy, 14, 10);

        // Rotors
        [-9, 9].forEach(rOff => {
            ctx.strokeStyle = `rgba(212,168,83,0.3)`;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(dx + rOff - 5, dy - 2);
            ctx.lineTo(dx + rOff + 5, dy - 2);
            ctx.stroke();
            // Rotor dot
            ctx.fillStyle = "rgba(212,168,83,0.3)";
            ctx.beginPath();
            ctx.arc(dx + rOff, dy - 2, 1.5, 0, Math.PI * 2);
            ctx.fill();
        });

        // Cable
        ctx.strokeStyle = `rgba(212,168,83,0.12)`;
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.moveTo(dx, dy);
        ctx.lineTo(dx, dy - 10 - driftY);
        ctx.stroke();
        ctx.setLineDash([]);
    }

    // ─── Hull glow highlight ───
    const glowGrad = ctx.createRadialGradient(cx, cy - hullRY * 0.3, 0, cx, cy, hullRX * 0.8);
    glowGrad.addColorStop(0, "rgba(212,168,83,0.03)");
    glowGrad.addColorStop(1, "rgba(212,168,83,0)");
    ctx.fillStyle = glowGrad;
    ctx.beginPath();
    ctx.ellipse(cx, cy, hullRX * 0.8, hullRY * 0.6, 0, 0, Math.PI * 2);
    ctx.fill();

    // ─── Scan line ───
    const scanX = cx - hullRX + ((time * 0.12) % 1) * hullW;
    ctx.strokeStyle = `rgba(245,197,66,0.05)`;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(scanX, 0);
    ctx.lineTo(scanX, h);
    ctx.stroke();

    ctx.restore();
}

function drawAnnotations(ctx: CanvasRenderingContext2D, w: number, h: number, time: number) {
    ctx.save();

    annotations.forEach((ann, i) => {
        const ax = ann.x * w;
        const ay = ann.y * h;
        const pulse = 0.5 + Math.sin(time * 1.5 + i * 0.7) * 0.2;

        const hullCx = w * 0.5;
        const hullCy = h * 0.38;
        const targetX = ann.align === "right" ? ax - 10 : ann.align === "left" ? ax + 10 : ax;
        const targetY = ay + 24;
        const endX = hullCx + (ann.x - 0.5) * w * 0.3;
        const endY = hullCy + (ann.y - 0.5) * h * 0.2;

        ctx.strokeStyle = `rgba(122,133,148,${pulse * 0.3})`;
        ctx.lineWidth = 0.5;
        ctx.setLineDash([2, 3]);
        ctx.beginPath();
        ctx.moveTo(targetX, targetY);
        ctx.lineTo(endX, endY);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.fillStyle = `rgba(212,168,83,${pulse * 0.4})`;
        ctx.beginPath();
        ctx.arc(endX, endY, 2, 0, Math.PI * 2);
        ctx.fill();

        ctx.font = "bold 10px 'JetBrains Mono', monospace";
        ctx.fillStyle = `rgba(122,133,148,${pulse})`;
        ctx.textAlign = ann.align === "right" ? "right" : ann.align === "left" ? "left" : "center";
        ctx.fillText(ann.label, ax, ay);

        if (ann.value) {
            ctx.fillStyle = `rgba(212,168,83,${pulse + 0.2})`;
            ctx.font = "bold 13px 'JetBrains Mono', monospace";
            ctx.fillText(ann.value, ax, ay + 16);
        }
    });

    ctx.restore();
}

function drawDimensionLines(ctx: CanvasRenderingContext2D, w: number, h: number, time: number) {
    const cx = w * 0.5;
    const hullW = w * 0.72;
    const hullH = h * 0.28;
    const cy = h * 0.38;

    const pulse = 0.25 + Math.sin(time * 1.5) * 0.1;

    ctx.save();
    ctx.strokeStyle = `rgba(122,133,148,${pulse})`;
    ctx.lineWidth = 0.8;
    ctx.setLineDash([4, 4]);

    const dimY = cy - hullH * 0.72;
    ctx.beginPath();
    ctx.moveTo(cx - hullW * 0.48, dimY);
    ctx.lineTo(cx + hullW * 0.48, dimY);
    ctx.stroke();

    ctx.setLineDash([]);
    [cx - hullW * 0.48, cx + hullW * 0.48].forEach(x => {
        ctx.beginPath(); ctx.moveTo(x, dimY - 6); ctx.lineTo(x, dimY + 6); ctx.stroke();
    });

    const hDimX = cx + hullW * 0.52;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(hDimX, cy - hullH * 0.48);
    ctx.lineTo(hDimX, cy + hullH * 0.48);
    ctx.stroke();

    ctx.setLineDash([]);
    [cy - hullH * 0.48, cy + hullH * 0.48].forEach(y => {
        ctx.beginPath(); ctx.moveTo(hDimX - 6, y); ctx.lineTo(hDimX + 6, y); ctx.stroke();
    });

    ctx.restore();
}

function drawHotspots(ctx: CanvasRenderingContext2D, w: number, h: number, time: number, activeId: string | null) {
    hotspots.forEach((hs) => {
        const x = hs.cx * w;
        const y = hs.cy * h;
        const r = hs.radius * Math.min(w, h);
        const isActive = activeId === hs.id;
        const pulse = Math.sin(time * 2 + hotspots.indexOf(hs)) * 0.5 + 0.5;

        ctx.save();

        if (!isActive) {
            ctx.strokeStyle = `rgba(212,168,83,${0.08 + pulse * 0.06})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.arc(x, y, r + pulse * 4, 0, Math.PI * 2);
            ctx.stroke();
        }

        // Glow fill
        if (isActive) {
            ctx.fillStyle = "rgba(212,168,83,0.06)";
            ctx.beginPath();
            ctx.arc(x, y, r, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.strokeStyle = isActive ? AMBER : `rgba(212,168,83,${0.3 + pulse * 0.15})`;
        ctx.lineWidth = isActive ? 2 : 1;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = isActive ? AMBER : `rgba(212,168,83,${0.4 + pulse * 0.2})`;
        ctx.beginPath();
        ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = `rgba(212,168,83,${isActive ? 0.8 : 0.2})`;
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(x - 5, y); ctx.lineTo(x + 5, y);
        ctx.moveTo(x, y - 5); ctx.lineTo(x, y + 5);
        ctx.stroke();

        ctx.restore();
    });
}

function drawTitle(ctx: CanvasRenderingContext2D, w: number) {
    ctx.save();
    ctx.font = "bold 13px 'JetBrains Mono', monospace";
    ctx.fillStyle = `rgba(122,133,148,0.6)`;
    ctx.textAlign = "left";
    ctx.fillText("PROJECT: AETHER — SKY CARRIER DEPLOYMENT SYSTEM V.5", 24, 30);

    ctx.strokeStyle = AMBER_DIM;
    ctx.lineWidth = 1;
    const cornerLen = 20;

    ctx.beginPath();
    ctx.moveTo(10, 10 + cornerLen); ctx.lineTo(10, 10); ctx.lineTo(10 + cornerLen, 10);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(w - 10 - cornerLen, 10); ctx.lineTo(w - 10, 10); ctx.lineTo(w - 10, 10 + cornerLen);
    ctx.stroke();

    ctx.restore();
}

/* ─── Info Panel Overlay ─── */
function InfoPanel({ hotspot, onClose }: { hotspot: HotspotData; onClose: () => void }) {
    return (
        <div
            className="absolute z-30 max-w-sm border border-amber/40 bg-deep-space/95 backdrop-blur-sm p-6"
            style={{
                left: `${Math.min(Math.max(hotspot.cx * 100, 15), 65)}%`,
                top: `${Math.min(Math.max(hotspot.cy * 100, 10), 60)}%`,
            }}
        >
            <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-amber rotate-45" />
                    <span className="text-amber text-xs font-bold tracking-[0.3em] font-mono">{hotspot.label}</span>
                </div>
                <button
                    onClick={onClose}
                    className="text-cold-steel hover:text-amber transition-colors text-xs font-mono tracking-wider"
                >
                    [CLOSE]
                </button>
            </div>
            <p className="text-cold-steel text-sm font-mono leading-relaxed tracking-wide">
                {hotspot.desc}
            </p>
            <div className="mt-3 pt-3 border-t border-border-subtle">
                <span className="text-[10px] text-cold-steel/60 font-mono tracking-widest">
                    COMPONENT ID: {hotspot.id.toUpperCase()}-{Math.floor(Math.random() * 9000 + 1000)}
                </span>
            </div>
        </div>
    );
}

/* ─── Main Component ─── */
export function BlueprintDiagram() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const animRef = useRef<number>(0);
    const [activeHotspot, setActiveHotspot] = useState<string | null>(null);
    const [dims, setDims] = useState({ w: 1200, h: 700 });

    useEffect(() => {
        const handleResize = () => {
            if (containerRef.current) {
                const rect = containerRef.current.getBoundingClientRect();
                setDims({ w: rect.width, h: Math.max(500, rect.width * 0.55) });
            }
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const handleCanvasClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;

        const w = dims.w;
        const h = dims.h;

        for (const hs of hotspots) {
            const hx = hs.cx * w;
            const hy = hs.cy * h;
            const r = hs.radius * Math.min(w, h);
            const dist = Math.sqrt((mx - hx) ** 2 + (my - hy) ** 2);
            if (dist < r + 10) {
                setActiveHotspot(prev => prev === hs.id ? null : hs.id);
                return;
            }
        }
        setActiveHotspot(null);
    }, [dims]);

    const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;

        const w = dims.w;
        const h = dims.h;

        let isOver = false;
        for (const hs of hotspots) {
            const hx = hs.cx * w;
            const hy = hs.cy * h;
            const r = hs.radius * Math.min(w, h);
            if (Math.sqrt((mx - hx) ** 2 + (my - hy) ** 2) < r + 10) {
                isOver = true;
                break;
            }
        }
        canvas.style.cursor = isOver ? "pointer" : "default";
    }, [dims]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const startTime = performance.now();

        const draw = (now: number) => {
            const time = (now - startTime) / 1000;
            const w = dims.w;
            const h = dims.h;

            ctx.save();
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.scale(2, 2);

            ctx.fillStyle = BG;
            ctx.fillRect(0, 0, w, h);

            drawGrid(ctx, w, h);
            drawTitle(ctx, w);
            drawAirship(ctx, w, h, time);
            drawDimensionLines(ctx, w, h, time);
            drawAnnotations(ctx, w, h, time);
            drawHotspots(ctx, w, h, time, activeHotspot);

            // Bottom info strip
            ctx.font = "bold 9px 'JetBrains Mono', monospace";
            ctx.fillStyle = "rgba(122,133,148,0.35)";
            ctx.textAlign = "left";
            ctx.fillText("SCALE: 1:2000  |  REV: 5.2.1  |  CLASSIFICATION: UNRESTRICTED", 24, h - 16);
            ctx.textAlign = "right";
            ctx.fillText("CLICK HOTSPOTS TO INSPECT COMPONENTS →", w - 24, h - 16);

            // Bottom corners
            const cornerLen = 20;
            ctx.strokeStyle = AMBER_DIM;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(10, h - 10 - cornerLen); ctx.lineTo(10, h - 10); ctx.lineTo(10 + cornerLen, h - 10);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(w - 10 - cornerLen, h - 10); ctx.lineTo(w - 10, h - 10); ctx.lineTo(w - 10, h - 10 - cornerLen);
            ctx.stroke();

            ctx.restore();

            animRef.current = requestAnimationFrame(draw);
        };

        animRef.current = requestAnimationFrame(draw);
        return () => cancelAnimationFrame(animRef.current);
    }, [dims, activeHotspot]);

    const activeHS = activeHotspot ? hotspots.find(h => h.id === activeHotspot) : null;

    return (
        <div ref={containerRef} className="w-full relative border border-border-subtle overflow-hidden">
            <canvas
                ref={canvasRef}
                width={dims.w * 2}
                height={dims.h * 2}
                style={{ width: dims.w, height: dims.h }}
                onClick={handleCanvasClick}
                onMouseMove={handleMouseMove}
                className="block"
            />
            {activeHS && (
                <InfoPanel hotspot={activeHS} onClose={() => setActiveHotspot(null)} />
            )}
        </div>
    );
}
