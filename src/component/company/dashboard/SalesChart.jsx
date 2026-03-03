import React, { useState, useMemo, useEffect, useRef } from "react";
import { TrendingUp, Calendar, ArrowUpRight } from "lucide-react";

const SalesChart = () => {
  const [range, setRange] = useState("weekly");
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    setAnimated(false);
    const t = setTimeout(() => setAnimated(true), 50);
    return () => clearTimeout(t);
  }, [range]);

  const chartDataset = {
    weekly: {
      total: 386000,
      growth: "+12.5%",
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      data: [45000, 52000, 48000, 61000, 58000, 43000, 39000],
    },
    monthly: {
      total: 1486000,
      growth: "+8.2%",
      labels: ["W1", "W2", "W3", "W4"],
      data: [320000, 410000, 360000, 396000],
    },
    yearly: {
      total: 18260000,
      growth: "+18.1%",
      labels: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
      data: [1200000,1350000,1420000,1380000,1500000,1620000,1580000,1700000,1680000,1750000,1820000,1900000],
    },
  };

  const current = useMemo(() => chartDataset[range], [range]);
  const maxAmount = Math.max(...current.data);
  const minAmount = Math.min(...current.data);
  const avgAmount = current.data.reduce((a, b) => a + b, 0) / current.data.length;

  const formatCurrency = (val) => {
    if (val >= 1000000) return `₹${(val / 1000000).toFixed(1)}M`;
    if (val >= 1000) return `₹${(val / 1000).toFixed(0)}K`;
    return `₹${val}`;
  };

  const gridLines = [0, 25, 50, 75, 100];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

        .sc-wrap * { box-sizing: border-box; }

        .sc-wrap {
          font-family: 'DM Sans', sans-serif;
          background: #fff;
          border-radius: 24px;
          padding: 28px 32px 24px;
          border: 1px solid #e8ecf3;
          box-shadow:
            0 1px 3px rgba(0,0,0,0.04),
            0 8px 32px rgba(37,99,235,0.06),
            0 0 0 1px rgba(255,255,255,0.9) inset;
          max-width: 680px;
          position: relative;
          overflow: hidden;
        }

        .sc-wrap::before {
          content: '';
          position: absolute;
          top: -80px; right: -80px;
          width: 240px; height: 240px;
          background: radial-gradient(circle, rgba(37,99,235,0.06) 0%, transparent 70%);
          pointer-events: none;
        }

        /* HEADER */
        .sc-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 28px;
          gap: 16px;
        }

        .sc-title-block {}

        .sc-eyebrow {
          font-size: 10px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #94a3b8;
          font-weight: 500;
          margin-bottom: 4px;
        }

        .sc-title {
          font-family: 'Syne', sans-serif;
          font-size: 18px;
          font-weight: 700;
          color: #0f172a;
          display: flex;
          align-items: center;
          gap: 8px;
          margin: 0;
        }

        .sc-title-icon {
          width: 32px; height: 32px;
          background: linear-gradient(135deg, #2563eb, #3b82f6);
          border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }

        /* FILTER TABS */
        .sc-tabs {
          display: flex;
          background: #f1f5f9;
          border-radius: 10px;
          padding: 3px;
          gap: 2px;
        }

        .sc-tab {
          font-family: 'DM Sans', sans-serif;
          font-size: 12px;
          font-weight: 500;
          padding: 6px 14px;
          border-radius: 7px;
          border: none;
          background: transparent;
          color: #64748b;
          cursor: pointer;
          transition: all 0.2s ease;
          letter-spacing: 0.01em;
        }

        .sc-tab:hover { color: #334155; }

        .sc-tab.active {
          background: #fff;
          color: #1e40af;
          box-shadow: 0 1px 4px rgba(0,0,0,0.1), 0 0 0 1px rgba(37,99,235,0.08);
        }

        /* METRICS ROW */
        .sc-metrics {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          margin-bottom: 28px;
        }

        .sc-metric {
          background: #f8fafc;
          border: 1px solid #f1f5f9;
          border-radius: 14px;
          padding: 14px 16px;
          position: relative;
          overflow: hidden;
          transition: border-color 0.2s;
        }

        .sc-metric:first-child {
          background: linear-gradient(135deg, #1e40af 0%, #2563eb 60%, #3b82f6 100%);
          border-color: transparent;
        }

        .sc-metric:first-child .sc-metric-label { color: rgba(255,255,255,0.65); }
        .sc-metric:first-child .sc-metric-value { color: #fff; }
        .sc-metric:first-child .sc-metric-badge {
          background: rgba(255,255,255,0.2);
          color: #bfdbfe;
        }

        .sc-metric-label {
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #94a3b8;
          font-weight: 500;
          margin-bottom: 6px;
        }

        .sc-metric-value {
          font-family: 'Syne', sans-serif;
          font-size: 20px;
          font-weight: 700;
          color: #0f172a;
          line-height: 1;
        }

        .sc-metric-badge {
          display: inline-flex;
          align-items: center;
          gap: 3px;
          margin-top: 6px;
          font-size: 11px;
          font-weight: 500;
          padding: 2px 7px;
          border-radius: 20px;
          background: #dcfce7;
          color: #166534;
        }

        /* CHART AREA */
        .sc-chart-container {
          position: relative;
        }

        .sc-grid-lines {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }

        .sc-grid-line {
          position: absolute;
          left: 0; right: 0;
          height: 1px;
          background: #f1f5f9;
        }

        .sc-grid-label {
          position: absolute;
          right: calc(100% + 8px);
          transform: translateY(-50%);
          font-size: 10px;
          color: #cbd5e1;
          font-weight: 500;
          white-space: nowrap;
          font-family: 'DM Sans', sans-serif;
        }

        .sc-bars {
          display: flex;
          align-items: flex-end;
          gap: 6px;
          height: 200px;
          padding: 0 0 0 0;
          position: relative;
        }

        .sc-bar-col {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          position: relative;
        }

        .sc-bar-track {
          width: 100%;
          height: 180px;
          display: flex;
          align-items: flex-end;
          position: relative;
        }

        .sc-bar {
          width: 100%;
          border-radius: 6px 6px 0 0;
          background: linear-gradient(to top, #2563eb, #60a5fa);
          transition: height 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
          position: relative;
          min-height: 4px;
        }

        .sc-bar.dimmed {
          background: linear-gradient(to top, #bfdbfe, #dbeafe);
        }

        .sc-bar.hovered {
          background: linear-gradient(to top, #1d4ed8, #3b82f6);
          box-shadow: 0 -4px 20px rgba(37,99,235,0.35);
        }

        .sc-tooltip {
          position: absolute;
          bottom: calc(100% + 10px);
          left: 50%;
          transform: translateX(-50%);
          background: #0f172a;
          color: #fff;
          padding: 6px 10px;
          border-radius: 8px;
          font-size: 11px;
          font-weight: 500;
          white-space: nowrap;
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.15s;
          font-family: 'Syne', sans-serif;
          letter-spacing: 0.02em;
          z-index: 10;
        }

        .sc-tooltip::after {
          content: '';
          position: absolute;
          top: 100%;
          left: 50%;
          transform: translateX(-50%);
          border: 4px solid transparent;
          border-top-color: #0f172a;
        }

        .sc-bar-col:hover .sc-tooltip { opacity: 1; }

        .sc-bar-label {
          font-size: 11px;
          color: #94a3b8;
          font-weight: 500;
          transition: color 0.2s;
          letter-spacing: 0.01em;
        }

        .sc-bar-col.hovered .sc-bar-label { color: #2563eb; font-weight: 600; }

        /* AVG LINE */
        .sc-avg-line {
          position: absolute;
          left: 0; right: 0;
          height: 1px;
          border-top: 1.5px dashed #bfdbfe;
          pointer-events: none;
          transition: bottom 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .sc-avg-label {
          position: absolute;
          right: 8px;
          top: -18px;
          font-size: 10px;
          color: #93c5fd;
          font-weight: 600;
          letter-spacing: 0.04em;
          background: #fff;
          padding: 0 4px;
          font-family: 'DM Sans', sans-serif;
        }
      `}</style>

      <div className="sc-wrap">
        {/* HEADER */}
        <div className="sc-header">
          <div className="sc-title-block">
            <p className="sc-eyebrow">Revenue Analytics</p>
            <h3 className="sc-title">
              <span className="sc-title-icon">
                <TrendingUp size={15} color="#fff" />
              </span>
              Sales Overview
            </h3>
          </div>

          <div className="sc-tabs">
            {["weekly","monthly","yearly"].map(r => (
              <button
                key={r}
                className={`sc-tab${range === r ? " active" : ""}`}
                onClick={() => setRange(r)}
              >
                {r.charAt(0).toUpperCase() + r.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* METRICS */}
        <div className="sc-metrics">
          <div className="sc-metric">
            <p className="sc-metric-label">Total Revenue</p>
            <p className="sc-metric-value">{formatCurrency(current.total)}</p>
            <div className="sc-metric-badge">
              <ArrowUpRight size={10} />
              {current.growth}
            </div>
          </div>
          <div className="sc-metric">
            <p className="sc-metric-label">Peak</p>
            <p className="sc-metric-value">{formatCurrency(maxAmount)}</p>
          </div>
          <div className="sc-metric">
            <p className="sc-metric-label">Average</p>
            <p className="sc-metric-value">{formatCurrency(Math.round(avgAmount))}</p>
          </div>
        </div>

        {/* CHART */}
        <div className="sc-chart-container">
          <div className="sc-bars">
            {/* Avg line */}
            <div
              className="sc-avg-line"
              style={{ bottom: `${(avgAmount / maxAmount) * 180}px` }}
            >
              <span className="sc-avg-label">AVG</span>
            </div>

            {current.data.map((amount, i) => {
              const barH = animated ? (amount / maxAmount) * 180 : 0;
              const isHov = hoveredIndex === i;
              const isDim = hoveredIndex !== null && !isHov;

              return (
                <div
                  key={`${range}-${i}`}
                  className={`sc-bar-col${isHov ? " hovered" : ""}`}
                  onMouseEnter={() => setHoveredIndex(i)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <div className="sc-bar-track">
                    <div
                      className={`sc-bar${isDim ? " dimmed" : ""}${isHov ? " hovered" : ""}`}
                      style={{
                        height: `${barH}px`,
                        transitionDelay: `${i * 40}ms`,
                      }}
                    >
                      <div className="sc-tooltip">
                        {formatCurrency(amount)}
                      </div>
                    </div>
                  </div>
                  <span className="sc-bar-label">{current.labels[i]}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default SalesChart;