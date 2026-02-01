/**
 * InterestMap - A D3.js library for rendering network maps of interests
 * Adapted from Vilinsky's implementation for Samhith's portfolio
 */

class InterestMap {
    constructor(container, data, options = {}) {
        this.container = typeof container === 'string'
            ? document.querySelector(container)
            : container;

        this.data = data;
        this.options = {
            width: options.width || 1200,
            height: options.height || 800,
            centerLabel: options.centerLabel || data.name,
            avatarSize: options.avatarSize || 56,
            orbitalRings: options.orbitalRings !== false,
            ringCount: options.ringCount || 5,
            levelDistances: options.levelDistances || [0, 160, 280, 380],
            nodeRadius: options.nodeRadius || { level1: 2.5, level2: 2, level3: 1.5 },
            colors: options.colors || this.defaultColors(),
            forceStrength: options.forceStrength || 0.03,
            radialStrength: options.radialStrength || 0.6,
            collisionRadius: options.collisionRadius || 45,
            labelScale: options.labelScale || 1.0,
            alphaDecay: options.alphaDecay || 0.015,
            ...options
        };

        this.svg = null;
        this.simulation = null;
        this.nodes = [];
        this.links = [];
        this.centerX = this.options.width / 2;
        this.centerY = this.options.height / 2;
        this.darkMode = false;

        this.randomSeed = Date.now();

        this.init();
    }

    seededRandom() {
        this.randomSeed = (this.randomSeed * 9301 + 49297) % 233280;
        return this.randomSeed / 233280;
    }

    defaultColors() {
        return [
            '#8B5CF6', // purple
            '#3B82F6', // blue
            '#10B981', // green
            '#F59E0B', // orange
            '#EC4899', // pink
            '#EF4444', // red
            '#06B6D4', // cyan
            '#84CC16', // lime
            '#F97316', // orange-red
            '#6366F1'  // indigo
        ];
    }

    init() {
        this.svg = d3.select(this.container)
            .append('svg')
            .attr('class', 'interest-map-container')
            .attr('width', this.options.width)
            .attr('height', this.options.height);

        this.mainGroup = this.svg.append('g')
            .attr('class', 'main-group')
            .attr('transform', `translate(${this.centerX}, ${this.centerY})`);

        this.drawOrbitalRings();
        this.startRingPulse();
        this.processData();
        this.createSimulation();
        this.drawVisualization();
        this.drawCenterNode();
    }

    drawOrbitalRings() {
        if (!this.options.orbitalRings) return;

        const ringGroup = this.mainGroup.append('g').attr('class', 'orbital-rings');

        const maxDist = Math.max(...this.options.levelDistances);
        const totalRings = 5;
        const ringSpacing = (maxDist + 120) / totalRings;

        for (let i = 1; i <= totalRings; i++) {
            ringGroup.append('circle')
                .attr('class', 'orbital-ring')
                .attr('cx', 0)
                .attr('cy', 0)
                .attr('r', ringSpacing * i);
        }
    }

    startRingPulse() {
        const self = this;

        const pulseRings = () => {
            const rings = this.mainGroup.selectAll('.orbital-ring');
            const ringNodes = rings.nodes();

            if (ringNodes.length === 0) return;

            const pulseColor = 'rgba(50, 64, 79, 0.16)';
            const idleColor = 'rgba(50, 64, 79, 0.08)';

            ringNodes.sort((a, b) => {
                return parseFloat(a.getAttribute('r')) - parseFloat(b.getAttribute('r'));
            });

            ringNodes.forEach((ring, index) => {
                const d3Ring = d3.select(ring);

                setTimeout(() => {
                    d3Ring
                        .transition()
                        .duration(150)
                        .style('stroke', pulseColor)
                        .style('stroke-width', '2px')
                        .transition()
                        .duration(150)
                        .style('stroke', idleColor)
                        .style('stroke-width', '1px');
                }, index * 100);
            });

            this.pulseDots();
        };

        setTimeout(pulseRings, 1000);
        this.pulseInterval = setInterval(pulseRings, 5000);
    }

    pulseDots() {
        const self = this;

        [1, 2, 3].forEach((level, levelIndex) => {
            setTimeout(() => {
                const levelNodes = this.mainGroup.selectAll(`.node-group.level-${level}`);

                levelNodes.each(function(d) {
                    const group = d3.select(this);
                    const dot = group.select('.node-dot');

                    if (dot.empty()) return;

                    const r = parseFloat(dot.attr('r'));
                    const color = dot.attr('fill');

                    const pulseDot = group.insert('circle', '.node-dot')
                        .attr('class', 'pulse-dot')
                        .attr('r', r)
                        .attr('fill', color)
                        .style('opacity', 1);

                    pulseDot
                        .transition()
                        .duration(300)
                        .attr('r', r * 2)
                        .style('opacity', 0)
                        .remove();
                });
            }, levelIndex * 100);
        });
    }

    processData() {
        const children = this.data.children || [];
        const numChildren = children.length;

        const childrenWithCounts = children.map((child, originalIndex) => {
            const countDescendants = (node) => {
                if (!node.children) return 0;
                return node.children.length + node.children.reduce((sum, c) => sum + countDescendants(c), 0);
            };
            return { child, originalIndex, descendantCount: countDescendants(child) };
        });

        childrenWithCounts.sort((a, b) => b.descendantCount - a.descendantCount);

        const globalRotation = (this.seededRandom() - 0.5) * Math.PI * 0.5;

        const angleSlots = [];
        const angleStep = (2 * Math.PI) / numChildren;

        for (let i = 0; i < numChildren; i++) {
            let angle;
            if (i === 0) angle = 0;
            else if (i === 1) angle = Math.PI;
            else if (i === 2) angle = -Math.PI / 6;
            else if (i === 3) angle = Math.PI + Math.PI / 6;
            else if (i === 4) angle = Math.PI / 6;
            else if (i === 5) angle = Math.PI - Math.PI / 6;
            else if (i === 6) angle = -Math.PI / 3;
            else if (i === 7) angle = Math.PI + Math.PI / 3;
            else if (i === 8) angle = Math.PI / 3;
            else angle = -Math.PI / 2 + angleStep * i;

            const slotRandomness = (this.seededRandom() - 0.5) * 0.3;
            angleSlots.push(angle + globalRotation + slotRandomness);
        }

        const shuffleRange = (arr, start, end) => {
            for (let i = end - 1; i > start; i--) {
                const j = start + Math.floor(this.seededRandom() * (i - start + 1));
                [arr[i], arr[j]] = [arr[j], arr[i]];
            }
        };
        if (numChildren >= 2) shuffleRange(angleSlots, 0, Math.min(2, numChildren));
        if (numChildren >= 6) shuffleRange(angleSlots, 2, Math.min(6, numChildren));
        if (numChildren >= 9) shuffleRange(angleSlots, 6, numChildren);

        const childAngles = new Array(numChildren);
        childrenWithCounts.forEach((item, rank) => {
            childAngles[item.originalIndex] = angleSlots[rank];
        });

        this.nodes.push({
            id: 'center',
            name: this.data.name,
            level: 0,
            fx: 0,
            fy: 0,
            color: '#3B82F6'
        });

        children.forEach((child, i) => {
            const color = child.color || this.options.colors[i % this.options.colors.length];
            const baseAngle = childAngles[i];
            const l1Distance = this.options.levelDistances[1];

            const sectorHalfWidth = angleStep * 0.45;
            const sectorMin = baseAngle - sectorHalfWidth;
            const sectorMax = baseAngle + sectorHalfWidth;

            const l1Id = `l1_${i}`;
            const l1InitialRadius = l1Distance + (this.seededRandom() - 0.5) * 50;
            const l1InitialAngle = baseAngle + (this.seededRandom() - 0.5) * 0.3;
            const l1Node = {
                id: l1Id,
                name: child.name,
                level: 1,
                targetRadius: l1Distance,
                angle: baseAngle,
                sectorMin: sectorMin,
                sectorMax: sectorMax,
                sectorCenter: baseAngle,
                x: Math.cos(l1InitialAngle) * l1InitialRadius,
                y: Math.sin(l1InitialAngle) * l1InitialRadius,
                color: color,
                parentId: 'center',
                rootId: l1Id
            };
            this.nodes.push(l1Node);
            this.links.push({ source: 'center', target: l1Id, color });

            if (child.children && child.children.length > 0) {
                const l2Children = child.children;
                const l2Count = l2Children.length;
                const spreadAngle = Math.min(sectorHalfWidth * 1.8, (Math.PI / 3) * Math.max(1, l2Count / 2));
                const l2AngleStep = l2Count > 1 ? spreadAngle / (l2Count - 1) : 0;
                const l2StartAngle = baseAngle - spreadAngle / 2;

                const l2Order = l2Children.map((_, idx) => idx);
                for (let k = l2Order.length - 1; k > 0; k--) {
                    const j = Math.floor(this.seededRandom() * (k + 1));
                    [l2Order[k], l2Order[j]] = [l2Order[j], l2Order[k]];
                }

                l2Children.forEach((l2Child, j) => {
                    const shuffledJ = l2Order[j];
                    const l2AngleBase = l2Count === 1 ? baseAngle : l2StartAngle + l2AngleStep * shuffledJ;
                    const l2Angle = l2AngleBase + (this.seededRandom() - 0.5) * 0.2;
                    const l2Distance = this.options.levelDistances[2] + (this.seededRandom() - 0.5) * 45;
                    const l2Id = `l2_${i}_${j}`;

                    const l2Node = {
                        id: l2Id,
                        name: l2Child.name,
                        level: 2,
                        targetRadius: l2Distance,
                        angle: l2Angle,
                        sectorMin: sectorMin,
                        sectorMax: sectorMax,
                        sectorCenter: baseAngle,
                        x: Math.cos(l2Angle) * l2Distance,
                        y: Math.sin(l2Angle) * l2Distance,
                        color: color,
                        parentId: l1Id,
                        rootId: l1Id
                    };
                    this.nodes.push(l2Node);
                    this.links.push({ source: l1Id, target: l2Id, color });
                });
            }
        });
    }

    createSimulation() {
        const self = this;
        const minRadius = (this.options.avatarSize / 2) + 50;

        const radialForce = () => {
            let nodes;

            function force(alpha) {
                for (let i = 0; i < nodes.length; i++) {
                    const node = nodes[i];
                    if (node.level === 0) continue;

                    const targetRadius = node.targetRadius;
                    const currentRadius = Math.sqrt(node.x * node.x + node.y * node.y);

                    if (currentRadius < 1) {
                        node.x = Math.cos(node.angle) * 10;
                        node.y = Math.sin(node.angle) * 10;
                        continue;
                    }

                    const effectiveTarget = Math.max(targetRadius, minRadius);
                    const levelMultiplier = node.level === 1 ? 1.5 : 1.0;
                    const k = (effectiveTarget - currentRadius) / currentRadius * self.options.radialStrength * alpha * levelMultiplier;

                    node.vx += node.x * k;
                    node.vy += node.y * k;
                }
            }

            force.initialize = (_nodes) => {
                nodes = _nodes;
            };

            return force;
        };

        const angularForce = () => {
            let nodes;

            function force(alpha) {
                for (let i = 0; i < nodes.length; i++) {
                    const node = nodes[i];
                    if (node.level === 0 || node.angle === undefined) continue;

                    const currentAngle = Math.atan2(node.y, node.x);
                    let angleDiff = node.angle - currentAngle;

                    while (angleDiff > Math.PI) angleDiff -= 2 * Math.PI;
                    while (angleDiff < -Math.PI) angleDiff += 2 * Math.PI;

                    const currentRadius = Math.sqrt(node.x * node.x + node.y * node.y);
                    const levelStrength = node.level === 1 ? 0.15 : 0.05;
                    const strength = levelStrength * alpha;

                    node.vx += -Math.sin(currentAngle) * angleDiff * currentRadius * strength;
                    node.vy += Math.cos(currentAngle) * angleDiff * currentRadius * strength;
                }
            }

            force.initialize = (_nodes) => {
                nodes = _nodes;
            };

            return force;
        };

        const sectorForce = () => {
            let nodes;

            function normalizeAngle(angle) {
                while (angle > Math.PI) angle -= 2 * Math.PI;
                while (angle < -Math.PI) angle += 2 * Math.PI;
                return angle;
            }

            function force(alpha) {
                for (let i = 0; i < nodes.length; i++) {
                    const node = nodes[i];
                    if (node.level === 0) continue;
                    if (node.sectorMin === undefined) continue;

                    const currentAngle = Math.atan2(node.y, node.x);
                    const currentRadius = Math.sqrt(node.x * node.x + node.y * node.y);

                    if (currentRadius < 1) continue;

                    let angleDiff = normalizeAngle(currentAngle - node.sectorCenter);
                    const halfWidth = normalizeAngle(node.sectorMax - node.sectorCenter);

                    if (Math.abs(angleDiff) > Math.abs(halfWidth)) {
                        const targetAngle = angleDiff > 0 ? node.sectorMax : node.sectorMin;
                        const pushAngle = normalizeAngle(targetAngle - currentAngle);

                        const levelStrength = node.level === 1 ? 0.4 : 0.15;
                        const strength = levelStrength * alpha;
                        node.vx += -Math.sin(currentAngle) * pushAngle * currentRadius * strength;
                        node.vy += Math.cos(currentAngle) * pushAngle * currentRadius * strength;
                    }
                }
            }

            force.initialize = (_nodes) => {
                nodes = _nodes;
            };

            return force;
        };

        const siblingForce = () => {
            let nodes;

            function force(alpha) {
                const parentGroups = {};
                for (let i = 0; i < nodes.length; i++) {
                    const node = nodes[i];
                    if (node.level === 0 || !node.parentId) continue;

                    if (!parentGroups[node.parentId]) {
                        parentGroups[node.parentId] = [];
                    }
                    parentGroups[node.parentId].push(node);
                }

                Object.values(parentGroups).forEach(siblings => {
                    if (siblings.length < 2) return;

                    const parentNode = nodes.find(n => n.id === siblings[0].parentId);

                    let centroidX = 0, centroidY = 0;
                    siblings.forEach(s => {
                        centroidX += s.x;
                        centroidY += s.y;
                    });
                    centroidX /= siblings.length;
                    centroidY /= siblings.length;

                    if (parentNode && parentNode.level > 0) {
                        const parentAngle = Math.atan2(parentNode.y, parentNode.x);
                        const parentRadius = Math.sqrt(parentNode.x * parentNode.x + parentNode.y * parentNode.y);
                        const targetRadius = parentRadius * 1.8;
                        centroidX = centroidX * 0.5 + Math.cos(parentAngle) * targetRadius * 0.5;
                        centroidY = centroidY * 0.5 + Math.sin(parentAngle) * targetRadius * 0.5;
                    }

                    const strength = 0.12 * alpha;
                    siblings.forEach(node => {
                        const dx = centroidX - node.x;
                        const dy = centroidY - node.y;
                        node.vx += dx * strength;
                        node.vy += dy * strength;
                    });
                });
            }

            force.initialize = (_nodes) => {
                nodes = _nodes;
            };

            return force;
        };

        const floatingForce = () => {
            let nodes;
            let time = 0;

            function force(alpha) {
                time += 0.008;

                for (let i = 0; i < nodes.length; i++) {
                    const node = nodes[i];
                    if (node.level === 0) continue;

                    const phase = i * 0.7;
                    const noiseX = Math.sin(time + phase) * Math.cos(time * 0.5 + phase * 1.3);
                    const noiseY = Math.cos(time * 0.6 + phase) * Math.sin(time * 0.4 + phase * 0.9);

                    const strength = 0.2 * alpha * 10;
                    node.vx += noiseX * strength;
                    node.vy += noiseY * strength;
                }
            }

            force.initialize = (_nodes) => {
                nodes = _nodes;
            };

            return force;
        };

        const level1RepulsionForce = () => {
            let nodes;
            const minDistance = 120;

            function force(alpha) {
                const level1Nodes = nodes.filter(n => n.level === 1);

                for (let i = 0; i < level1Nodes.length; i++) {
                    for (let j = i + 1; j < level1Nodes.length; j++) {
                        const nodeA = level1Nodes[i];
                        const nodeB = level1Nodes[j];

                        const dx = nodeB.x - nodeA.x;
                        const dy = nodeB.y - nodeA.y;
                        const distance = Math.sqrt(dx * dx + dy * dy);

                        if (distance < minDistance && distance > 0) {
                            const force = (minDistance - distance) / distance * alpha * 0.8;
                            const fx = dx * force;
                            const fy = dy * force;

                            nodeA.vx -= fx;
                            nodeA.vy -= fy;
                            nodeB.vx += fx;
                            nodeB.vy += fy;
                        }
                    }
                }
            }

            force.initialize = (_nodes) => {
                nodes = _nodes;
            };

            return force;
        };

        this.simulation = d3.forceSimulation(this.nodes)
            .alphaDecay(0.005)
            .alphaTarget(0.008)
            .alphaMin(0.008)
            .velocityDecay(0.7)
            .force('link', d3.forceLink(this.links)
                .id(d => d.id)
                .distance(d => {
                    const source = this.nodes.find(n => n.id === d.source.id || n.id === d.source);
                    const target = this.nodes.find(n => n.id === d.target.id || n.id === d.target);
                    if (!source || !target) return 70;
                    return Math.abs(target.targetRadius - (source.targetRadius || 0)) * 0.6;
                })
                .strength(0.5)
            )
            .force('collision', d3.forceCollide()
                .radius(this.options.collisionRadius)
                .strength(0.5)
                .iterations(2)
            )
            .force('radial', radialForce())
            .force('angular', angularForce())
            .force('sector', sectorForce())
            .force('sibling', siblingForce())
            .force('floating', floatingForce())
            .force('level1Repulsion', level1RepulsionForce())
            .on('tick', () => this.ticked());

        this.simulation.alpha(0.3);
    }

    drawVisualization() {
        this.linkElements = this.mainGroup.append('g')
            .attr('class', 'links')
            .selectAll('line')
            .data(this.links)
            .enter()
            .append('line')
            .attr('stroke', d => d.color)
            .attr('stroke-width', 1)
            .attr('opacity', d => {
                const target = this.nodes.find(n => n.id === d.target.id || n.id === d.target);
                return target ? (target.level === 1 ? 0.7 : target.level === 2 ? 0.5 : 0.4) : 0.4;
            });

        const drag = d3.drag()
            .on('start', (event, d) => {
                if (!event.active) this.simulation.alphaTarget(0.3).restart();
                d.fx = d.x;
                d.fy = d.y;
                this.hideGlowCircles(d);
            })
            .on('drag', (event, d) => {
                d.fx = event.x;
                d.fy = event.y;
            })
            .on('end', (event, d) => {
                if (!event.active) this.simulation.alphaTarget(0.02);
                d.fx = null;
                d.fy = null;
            });

        this.nodeGroups = this.mainGroup.append('g')
            .attr('class', 'nodes')
            .selectAll('g')
            .data(this.nodes.filter(n => n.level > 0))
            .enter()
            .append('g')
            .attr('class', d => `node-group level-${d.level}`)
            .attr('data-id', d => d.id)
            .call(drag);

        const self = this;

        this.nodeGroups.append('circle')
            .attr('class', 'node-glow')
            .attr('r', 0)
            .attr('fill', d => d.color)
            .attr('opacity', 0.05)
            .style('pointer-events', 'none')
            .style('transition', 'r 200ms cubic-bezier(0.34, 1.56, 0.64, 1)');

        this.nodeGroups.append('circle')
            .attr('class', d => `node-dot level-${d.level}`)
            .attr('r', d => d.level === 1 ? 3 : d.level === 2 ? 2.5 : 2)
            .attr('fill', d => d.color);

        this.nodeGroups
            .on('mouseenter', function(event, d) {
                self.showGlowCircles(d);
            })
            .on('mouseleave', function(event, d) {
                self.hideGlowCircles(d);
            });

        this.nodeGroups.append('rect')
            .attr('class', 'hit-zone')
            .attr('fill', 'transparent')
            .attr('x', 0)
            .attr('y', -12)
            .attr('width', 10)
            .attr('height', 24)
            .style('cursor', 'grab');

        this.nodeGroups.each(function(d) {
            const group = d3.select(this);
            const words = d.name.split(' ');
            const shouldWrap = words.length > 1 && d.name.length > 12;
            const labelScale = self.options.labelScale;

            const labelGroup = group.append('g').attr('class', 'label-group');

            labelGroup.append('rect')
                .attr('class', 'label-bg')
                .attr('rx', 3)
                .attr('ry', 3);

            let text;
            if (shouldWrap) {
                text = labelGroup.append('text')
                    .attr('class', `node-label level-${d.level}`);

                words.forEach((word, i) => {
                    text.append('tspan')
                        .attr('x', 0)
                        .attr('dy', i === 0 ? 0 : 13)
                        .text(word);
                });
            } else {
                text = labelGroup.append('text')
                    .attr('class', `node-label level-${d.level}`)
                    .text(d.name);
            }

            if (labelScale !== 1.0) {
                text.style('font-size', `${labelScale * 100}%`);
            }
        });

        this.nodeGroups.each(function() {
            const group = d3.select(this);
            const labelGroup = group.select('.label-group');
            const text = labelGroup.select('text');
            const bg = labelGroup.select('.label-bg');

            const textNode = text.node();
            if (textNode) {
                const bbox = textNode.getBBox();
                const padding = 4;
                bg.attr('x', bbox.x - padding)
                    .attr('y', bbox.y - padding / 2)
                    .attr('width', bbox.width + padding * 2)
                    .attr('height', bbox.height + padding);
            }
        });
    }

    ticked() {
        this.linkElements
            .attr('x1', d => d.source.x.toFixed(2))
            .attr('y1', d => d.source.y.toFixed(2))
            .attr('x2', d => d.target.x.toFixed(2))
            .attr('y2', d => d.target.y.toFixed(2));

        this.nodeGroups
            .attr('transform', d => `translate(${d.x.toFixed(2)}, ${d.y.toFixed(2)})`);

        this.nodeGroups.each(function(d) {
            const group = d3.select(this);
            const angle = Math.atan2(d.y, d.x);
            let normAngle = angle;
            if (normAngle < 0) normAngle += 2 * Math.PI;

            const labelGap = 10;
            let textAnchor, labelX, labelY;

            if (normAngle < Math.PI / 4 || normAngle > 7 * Math.PI / 4) {
                textAnchor = 'start';
                labelX = labelGap;
                labelY = 4;
            } else if (normAngle >= Math.PI / 4 && normAngle < 3 * Math.PI / 4) {
                textAnchor = 'middle';
                labelX = 0;
                labelY = labelGap + 14;
            } else if (normAngle >= 3 * Math.PI / 4 && normAngle < 5 * Math.PI / 4) {
                textAnchor = 'end';
                labelX = -labelGap;
                labelY = 4;
            } else {
                textAnchor = 'middle';
                labelX = 0;
                labelY = -labelGap - 4;
            }

            const labelGroup = group.select('.label-group');
            const label = labelGroup.select('text.node-label');
            const bg = labelGroup.select('.label-bg');

            label.attr('text-anchor', textAnchor);

            const tspans = label.selectAll('tspan');
            if (tspans.size() > 0) {
                let startY = labelY;
                if (textAnchor === 'middle' && labelY < 0) {
                    startY = labelY - (tspans.size() - 1) * 6;
                }
                tspans.each(function(_, i) {
                    d3.select(this)
                        .attr('x', labelX)
                        .attr('dy', i === 0 ? startY : 13);
                });
            } else {
                label.attr('x', labelX).attr('y', labelY);
            }

            const textNode = label.node();
            if (textNode && bg.node()) {
                const bbox = textNode.getBBox();
                const padding = 4;
                bg.attr('x', bbox.x - padding)
                    .attr('y', bbox.y - padding / 2)
                    .attr('width', bbox.width + padding * 2)
                    .attr('height', bbox.height + padding);
            }

            const hitZone = group.select('.hit-zone');
            if (hitZone.node() && textNode) {
                const bbox = textNode.getBBox();
                const hitPadding = 8;

                if (textAnchor === 'start') {
                    hitZone
                        .attr('x', -hitPadding)
                        .attr('y', Math.min(-hitPadding, bbox.y - hitPadding))
                        .attr('width', bbox.x + bbox.width + hitPadding * 2)
                        .attr('height', Math.max(hitPadding * 2, bbox.height + hitPadding * 2));
                } else if (textAnchor === 'end') {
                    hitZone
                        .attr('x', bbox.x - hitPadding)
                        .attr('y', Math.min(-hitPadding, bbox.y - hitPadding))
                        .attr('width', -bbox.x + hitPadding * 2)
                        .attr('height', Math.max(hitPadding * 2, bbox.height + hitPadding * 2));
                } else if (labelY > 0) {
                    hitZone
                        .attr('x', bbox.x - hitPadding)
                        .attr('y', -hitPadding)
                        .attr('width', bbox.width + hitPadding * 2)
                        .attr('height', bbox.y + bbox.height + hitPadding * 2);
                } else {
                    hitZone
                        .attr('x', bbox.x - hitPadding)
                        .attr('y', bbox.y - hitPadding)
                        .attr('width', bbox.width + hitPadding * 2)
                        .attr('height', -bbox.y + hitPadding * 2);
                }
            }
        });
    }

    drawCenterNode() {
        const self = this;
        const centerGroup = this.mainGroup.append('g')
            .attr('class', 'center-node-group')
            .style('cursor', 'pointer')
            .on('click', function() {
                self.redraw();
            });

        const avatarSize = this.options.avatarSize;
        const avatarRadius = avatarSize / 2;

        const defs = this.svg.append('defs');

        const filter = defs.append('filter')
            .attr('id', 'glow')
            .attr('x', '-50%').attr('y', '-50%')
            .attr('width', '200%').attr('height', '200%');
        filter.append('feGaussianBlur')
            .attr('stdDeviation', '3')
            .attr('result', 'coloredBlur');
        const feMerge = filter.append('feMerge');
        feMerge.append('feMergeNode').attr('in', 'coloredBlur');
        feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

        centerGroup.append('circle')
            .attr('cx', 0).attr('cy', 0)
            .attr('r', avatarRadius + 4)
            .attr('fill', 'rgba(59, 130, 246, 0.1)')
            .attr('filter', 'url(#glow)');

        const clipId = 'avatar-clip';
        defs.append('clipPath')
            .attr('id', clipId)
            .append('circle')
            .attr('cx', 0).attr('cy', 0).attr('r', avatarRadius);

        const avatarHref = this.data.avatar || 'images/about.png';

        centerGroup.append('image')
            .attr('class', 'center-node-avatar')
            .attr('x', -avatarRadius)
            .attr('y', -avatarRadius)
            .attr('width', avatarSize)
            .attr('height', avatarSize)
            .attr('href', avatarHref)
            .attr('preserveAspectRatio', 'xMidYMid slice')
            .attr('clip-path', `url(#${clipId})`);

        centerGroup.append('circle')
            .attr('cx', 0).attr('cy', 0).attr('r', avatarRadius)
            .attr('fill', 'none')
            .attr('stroke', '#3B82F6')
            .attr('stroke-width', 2);
    }

    resize(width, height) {
        this.options.width = width;
        this.options.height = height;
        this.centerX = width / 2;
        this.centerY = height / 2;
        this.svg.attr('width', width).attr('height', height);
        this.mainGroup.attr('transform', `translate(${this.centerX}, ${this.centerY})`);
    }

    redraw() {
        if (this.simulation) this.simulation.stop();

        this.randomSeed = Date.now();

        this.nodes.forEach(node => {
            if (node.level === 0) return;

            const angleVariation = (this.seededRandom() - 0.5) * 0.3;
            const newAngle = node.angle + angleVariation;
            const radiusVariation = (this.seededRandom() - 0.5) * 30;
            const newRadius = node.targetRadius + radiusVariation;

            node.x = Math.cos(newAngle) * newRadius;
            node.y = Math.sin(newAngle) * newRadius;
            node.vx = (this.seededRandom() - 0.5) * 2;
            node.vy = (this.seededRandom() - 0.5) * 2;
        });

        this.simulation.alpha(1).restart();
    }

    getDescendantIds(nodeId) {
        const descendants = [];
        const findChildren = (parentId) => {
            this.nodes.forEach(node => {
                if (node.parentId === parentId) {
                    descendants.push(node.id);
                    findChildren(node.id);
                }
            });
        };
        findChildren(nodeId);
        return descendants;
    }

    showGlowCircles(hoveredNode) {
        const nodeIds = [hoveredNode.id, ...this.getDescendantIds(hoveredNode.id)];

        nodeIds.forEach(id => {
            const group = this.mainGroup.select(`.node-group[data-id="${id}"]`);
            const glow = group.select('.node-glow');
            if (!glow.empty()) {
                glow.transition()
                    .duration(200)
                    .ease(d3.easeCubicOut)
                    .attr('r', 40);
            }
        });
    }

    hideGlowCircles(hoveredNode) {
        const nodeIds = [hoveredNode.id, ...this.getDescendantIds(hoveredNode.id)];

        nodeIds.forEach(id => {
            const group = this.mainGroup.select(`.node-group[data-id="${id}"]`);
            const glow = group.select('.node-glow');
            if (!glow.empty()) {
                glow.transition()
                    .duration(150)
                    .ease(d3.easeCubicIn)
                    .attr('r', 0);
            }
        });
    }

    destroy() {
        if (this.pulseInterval) clearInterval(this.pulseInterval);
        if (this.simulation) this.simulation.stop();
        if (this.svg) this.svg.remove();
    }
}

window.InterestMap = InterestMap;
