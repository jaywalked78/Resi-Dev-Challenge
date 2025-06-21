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

    // Add vertical gradients for all tier bars
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');

    // Define tier gradient configurations based on current active tier
    const isDarkMode = document.documentElement.classList.contains('dark');
    const opacity = isDarkMode ? '0.85' : '0.35';

    // Detect current tier from body classes
    const body = document.body;
    let currentTierColors;

    if (body.classList.contains('tier-bronze')) {
      currentTierColors = [
        `rgba(205, 127, 50, ${opacity})`,
        `rgba(184, 134, 11, ${opacity})`,
      ];
    } else if (body.classList.contains('tier-silver')) {
      currentTierColors = [
        `rgba(192, 192, 192, ${opacity})`,
        `rgba(160, 160, 160, ${opacity})`,
      ];
    } else if (body.classList.contains('tier-gold')) {
      currentTierColors = [
        `rgba(218, 165, 32, ${opacity})`,
        `rgba(255, 179, 71, ${opacity})`,
      ];
    } else if (body.classList.contains('tier-platinum')) {
      currentTierColors = [
        `rgba(229, 231, 235, ${opacity})`,
        `rgba(255, 255, 255, ${opacity})`,
      ];
    } else if (body.classList.contains('tier-diamond')) {
      // For diamond tier, use multiple colors cycling through diamond theme
      const diamondColors = [
        [`rgba(255, 0, 128, ${opacity})`, `rgba(160, 48, 110, ${opacity})`],
        [`rgba(0, 255, 255, ${opacity})`, `rgba(0, 139, 152, ${opacity})`],
        [`rgba(255, 255, 0, ${opacity})`, `rgba(212, 160, 13, ${opacity})`],
        [`rgba(204, 85, 0, ${opacity})`, `rgba(230, 106, 0, ${opacity})`],
        [`rgba(75, 0, 130, ${opacity})`, `rgba(106, 13, 173, ${opacity})`],
      ];

      // Create multiple diamond gradients
      diamondColors.forEach((colors, index) => {
        const gradient = document.createElementNS(
          'http://www.w3.org/2000/svg',
          'linearGradient'
        );
        gradient.setAttribute('id', `tier-gradient-${index + 1}`);
        gradient.setAttribute('x1', '0%');
        gradient.setAttribute('y1', '0%');
        gradient.setAttribute('x2', '0%');
        gradient.setAttribute('y2', '100%');

        const stop1 = document.createElementNS(
          'http://www.w3.org/2000/svg',
          'stop'
        );
        stop1.setAttribute('offset', '0%');
        stop1.setAttribute('stop-color', colors[0]);

        const stop2 = document.createElementNS(
          'http://www.w3.org/2000/svg',
          'stop'
        );
        stop2.setAttribute('offset', '100%');
        stop2.setAttribute('stop-color', colors[1]);

        gradient.appendChild(stop1);
        gradient.appendChild(stop2);
        defs.appendChild(gradient);
      });
    } else {
      // Default to blue for no tier
      currentTierColors = [
        `rgba(59, 130, 246, ${opacity})`,
        `rgba(37, 99, 235, ${opacity})`,
      ];
    }

    // For non-diamond tiers, create a single gradient that all bars will use
    if (!body.classList.contains('tier-diamond')) {
      const gradient = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'linearGradient'
      );
      gradient.setAttribute('id', 'tier-gradient-single');
      gradient.setAttribute('x1', '0%');
      gradient.setAttribute('y1', '0%');
      gradient.setAttribute('x2', '0%');
      gradient.setAttribute('y2', '100%');

      const stop1 = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'stop'
      );
      stop1.setAttribute('offset', '0%');
      stop1.setAttribute('stop-color', currentTierColors[0]);

      const stop2 = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'stop'
      );
      stop2.setAttribute('offset', '100%');
      stop2.setAttribute('stop-color', currentTierColors[1]);

      gradient.appendChild(stop1);
      gradient.appendChild(stop2);
      defs.appendChild(gradient);
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

      // Use appropriate gradient based on tier
      if (document.body.classList.contains('tier-diamond')) {
        // For diamond tier, cycle through the diamond gradients
        const gradientId = `tier-gradient-${(index % 5) + 1}`;
        bar.setAttribute('fill', `url(#${gradientId})`);
      } else {
        // For all other tiers, use the single tier gradient
        bar.setAttribute('fill', `url(#tier-gradient-single)`);
      }

      // Add dark gray text color as stroke for better definition
      bar.setAttribute('stroke', 'rgba(75, 85, 99, 0.3)'); // text-gray-600 with opacity
      bar.setAttribute('stroke-width', '0.5');
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
