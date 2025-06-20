/**
 * Simple Chart Component for visualizing numbers and average
 * Uses SVG for lightweight, responsive charts
 */
export class Chart {
  constructor(container, options = {}) {
    this.container = container;
    this.options = {
      width: 400,
      height: 200,
      margin: { top: 20, right: 20, bottom: 40, left: 40 },
      barColor: '#3b82f6',
      averageLineColor: '#ef4444',
      animationDuration: 800,
      ...options,
    };

    this.svg = null;
    this.data = [];
  }

  render(numbers, average) {
    this.data = numbers.map((value, index) => ({ index, value }));
    this.average = average;

    // Clear previous chart
    this.container.innerHTML = '';

    // Create SVG
    this.svg = this.createSVG();
    this.container.appendChild(this.svg);

    // Calculate scales - always start from 0
    const maxValue = Math.max(...numbers, average);
    const padding = maxValue * 0.1 + 5;
    const yMax = maxValue + padding;
    const yMin = 0;

    this.yScale = value => {
      const chartHeight =
        this.options.height -
        this.options.margin.top -
        this.options.margin.bottom;
      return chartHeight - ((value - yMin) / (yMax - yMin)) * chartHeight;
    };

    this.xScale = index => {
      const chartWidth =
        this.options.width -
        this.options.margin.left -
        this.options.margin.right;
      const barWidth = chartWidth / numbers.length;
      return index * barWidth + barWidth / 2;
    };

    // Draw chart elements
    this.drawAxes(yMin, yMax);
    this.drawBars();
    this.drawAverageLine();
    this.drawLabels();
  }

  createSVG() {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', this.options.width);
    svg.setAttribute('height', this.options.height);
    svg.setAttribute(
      'viewBox',
      `0 0 ${this.options.width} ${this.options.height}`
    );
    svg.setAttribute('class', 'chart-svg');
    svg.style.overflow = 'visible';

    // Add multiple vertical gradients for diamond tier bars
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');

    // Check if we're in diamond tier
    const isDiamondTier = document.body.classList.contains('tier-diamond');

    if (isDiamondTier) {
      const gradientConfigs = [
        { id: 'diamond-gradient-1', colors: ['#8B0045', '#A0306E'] },
        { id: 'diamond-gradient-2', colors: ['#006B7A', '#008B98'] },
        { id: 'diamond-gradient-3', colors: ['#B8860B', '#D4A00D'] },
        { id: 'diamond-gradient-4', colors: ['#CC5500', '#E66A00'] },
        { id: 'diamond-gradient-5', colors: ['#4B0082', '#6A0DAD'] },
        { id: 'diamond-gradient-6', colors: ['#006400', '#228B22'] },
        { id: 'diamond-gradient-7', colors: ['#8B0000', '#B22222'] },
        { id: 'diamond-gradient-8', colors: ['#191970', '#4169E1'] },
        { id: 'diamond-gradient-9', colors: ['#556B2F', '#6B8E23'] },
        { id: 'diamond-gradient-10', colors: ['#A0522D', '#CD853F'] },
      ];

      gradientConfigs.forEach(config => {
        const gradient = document.createElementNS(
          'http://www.w3.org/2000/svg',
          'linearGradient'
        );
        gradient.setAttribute('id', config.id);
        gradient.setAttribute('x1', '0%');
        gradient.setAttribute('y1', '0%');
        gradient.setAttribute('x2', '0%');
        gradient.setAttribute('y2', '100%'); // Vertical gradient

        const stop1 = document.createElementNS(
          'http://www.w3.org/2000/svg',
          'stop'
        );
        stop1.setAttribute('offset', '0%');
        stop1.setAttribute('stop-color', config.colors[0]);

        const stop2 = document.createElementNS(
          'http://www.w3.org/2000/svg',
          'stop'
        );
        stop2.setAttribute('offset', '100%');
        stop2.setAttribute('stop-color', config.colors[1]);

        gradient.appendChild(stop1);
        gradient.appendChild(stop2);
        defs.appendChild(gradient);
      });
    }

    svg.appendChild(defs);

    return svg;
  }

  drawAxes(yMin, yMax) {
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.setAttribute('class', 'axes');

    // Y-axis
    const yAxis = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'line'
    );
    yAxis.setAttribute('x1', this.options.margin.left);
    yAxis.setAttribute('y1', this.options.margin.top);
    yAxis.setAttribute('x2', this.options.margin.left);
    yAxis.setAttribute('y2', this.options.height - this.options.margin.bottom);
    yAxis.setAttribute('stroke', 'currentColor');
    yAxis.setAttribute('stroke-width', '1');
    yAxis.setAttribute('opacity', '0.3');
    g.appendChild(yAxis);

    // X-axis
    const xAxis = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'line'
    );
    xAxis.setAttribute('x1', this.options.margin.left);
    xAxis.setAttribute('y1', this.options.height - this.options.margin.bottom);
    xAxis.setAttribute('x2', this.options.width - this.options.margin.right);
    xAxis.setAttribute('y2', this.options.height - this.options.margin.bottom);
    xAxis.setAttribute('stroke', 'currentColor');
    xAxis.setAttribute('stroke-width', '1');
    xAxis.setAttribute('opacity', '0.3');
    g.appendChild(xAxis);

    // Y-axis labels
    const labelCount = 5;
    for (let i = 0; i <= labelCount; i++) {
      const value = yMin + (yMax - yMin) * (i / labelCount);
      const y = this.options.margin.top + this.yScale(value);

      const label = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'text'
      );
      label.setAttribute('x', this.options.margin.left - 10);
      label.setAttribute('y', y + 4);
      label.setAttribute('text-anchor', 'end');
      label.setAttribute('class', 'text-xs fill-current opacity-60');
      label.textContent = value.toFixed(1);
      g.appendChild(label);

      // Grid line
      const gridLine = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'line'
      );
      gridLine.setAttribute('x1', this.options.margin.left);
      gridLine.setAttribute('y1', y);
      gridLine.setAttribute(
        'x2',
        this.options.width - this.options.margin.right
      );
      gridLine.setAttribute('y2', y);
      gridLine.setAttribute('stroke', 'currentColor');
      gridLine.setAttribute('stroke-width', '0.5');
      gridLine.setAttribute('opacity', '0.1');
      g.appendChild(gridLine);
    }

    this.svg.appendChild(g);
  }

  drawBars() {
    const chartWidth =
      this.options.width - this.options.margin.left - this.options.margin.right;
    const barWidth = Math.max(20, (chartWidth / this.data.length) * 0.8);

    this.data.forEach((item, index) => {
      const x = this.options.margin.left + this.xScale(index) - barWidth / 2;
      const y = this.options.margin.top + this.yScale(item.value);
      const height = this.options.height - this.options.margin.bottom - y;

      const bar = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'rect'
      );
      bar.setAttribute('x', x);
      bar.setAttribute('y', this.options.height - this.options.margin.bottom); // Start from bottom
      bar.setAttribute('width', barWidth);
      bar.setAttribute('height', 0); // Start with 0 height
      // Use gradient fill for diamond tier, regular color for others
      const isDiamondTier = document.body.classList.contains('tier-diamond');
      if (isDiamondTier) {
        const gradientId = `diamond-gradient-${(index % 10) + 1}`;
        bar.setAttribute('fill', `url(#${gradientId})`);
      } else {
        bar.setAttribute('fill', this.options.barColor);
      }
      bar.setAttribute('rx', '2');
      bar.setAttribute('class', 'bar chart-bar');

      // Add hover effect
      bar.addEventListener('mouseenter', () => {
        bar.setAttribute('opacity', '0.8');
      });
      bar.addEventListener('mouseleave', () => {
        bar.setAttribute('opacity', '1');
      });

      this.svg.appendChild(bar);

      // Animate bar growth
      setTimeout(() => {
        bar.style.transition = `height ${this.options.animationDuration}ms ease-out, y ${this.options.animationDuration}ms ease-out`;
        bar.setAttribute('y', y);
        bar.setAttribute('height', height);
      }, index * 100);

      // Add value label on top of bar
      const label = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'text'
      );
      label.setAttribute('x', x + barWidth / 2);
      label.setAttribute('y', y - 5);
      label.setAttribute('text-anchor', 'middle');
      label.setAttribute('class', 'text-xs fill-current font-medium');
      label.setAttribute('opacity', '0');
      label.textContent = item.value;

      this.svg.appendChild(label);

      // Animate label appearance
      setTimeout(
        () => {
          label.style.transition = `opacity ${this.options.animationDuration / 2}ms ease-out`;
          label.setAttribute('opacity', '0.8');
        },
        index * 100 + this.options.animationDuration / 2
      );
    });
  }

  drawAverageLine() {
    const y = this.options.margin.top + this.yScale(this.average);

    // Average line
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', this.options.margin.left);
    line.setAttribute('y1', y);
    line.setAttribute('x2', this.options.width - this.options.margin.right);
    line.setAttribute('y2', y);
    line.setAttribute('stroke', this.options.averageLineColor);
    line.setAttribute('stroke-width', '2');
    line.setAttribute('stroke-dasharray', '5,5');
    line.setAttribute('opacity', '0');
    line.setAttribute('class', 'average-line chart-line');

    this.svg.appendChild(line);

    // Animate line appearance
    setTimeout(
      () => {
        line.style.transition = `opacity ${this.options.animationDuration}ms ease-out`;
        line.setAttribute('opacity', '0.8');
      },
      this.data.length * 100 + this.options.animationDuration
    );

    // Average label
    const label = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'text'
    );
    label.setAttribute('x', this.options.width - this.options.margin.right + 5);
    label.setAttribute('y', y + 4);
    label.setAttribute('class', 'text-xs fill-current font-semibold');
    label.setAttribute('opacity', '0');
    label.style.fill = this.options.averageLineColor;
    label.textContent = `Avg: ${this.average.toFixed(2)}`;

    this.svg.appendChild(label);

    // Animate label
    setTimeout(
      () => {
        label.style.transition = `opacity ${this.options.animationDuration}ms ease-out`;
        label.setAttribute('opacity', '1');
      },
      this.data.length * 100 + this.options.animationDuration + 200
    );
  }

  drawLabels() {
    // X-axis labels (index numbers)
    this.data.forEach((item, index) => {
      const x = this.options.margin.left + this.xScale(index);
      const y = this.options.height - this.options.margin.bottom + 20;

      const label = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'text'
      );
      label.setAttribute('x', x);
      label.setAttribute('y', y);
      label.setAttribute('text-anchor', 'middle');
      label.setAttribute('class', 'text-xs fill-current opacity-60');
      label.textContent = `#${index + 1}`;

      this.svg.appendChild(label);
    });
  }

  destroy() {
    if (this.container) {
      this.container.innerHTML = '';
    }
  }
}
