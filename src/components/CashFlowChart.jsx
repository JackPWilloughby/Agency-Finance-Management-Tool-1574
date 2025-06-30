import React from 'react';
import ReactECharts from 'echarts-for-react';
import { useFinance } from '../context/FinanceContext';

const CashFlowChart = () => {
  const { state, calculateMetrics } = useFinance();
  const metrics = calculateMetrics();

  // Generate 6 months of forecast data
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  const currentMonth = new Date().getMonth();
  
  const forecastData = months.map((month, index) => {
    const monthlyRevenue = metrics.totalRevenue / 12;
    const monthlyCosts = metrics.totalCosts / 12;
    const variation = (Math.random() - 0.5) * 0.2; // ±10% variation
    
    return {
      month,
      revenue: monthlyRevenue * (1 + variation),
      costs: monthlyCosts * (1 + variation),
      profit: (monthlyRevenue - monthlyCosts) * (1 + variation)
    };
  });

  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross'
      },
      textStyle: {
        fontSize: 12
      }
    },
    legend: {
      data: ['Revenue', 'Costs', 'Profit'],
      textStyle: {
        color: '#94a3b8',
        fontSize: 12
      }
    },
    grid: {
      left: '5%',
      right: '5%',
      bottom: '10%',
      top: '15%',
      containLabel: true
    },
    xAxis: [
      {
        type: 'category',
        boundaryGap: false,
        data: months,
        axisLine: {
          lineStyle: { color: '#475569' }
        },
        axisLabel: {
          color: '#94a3b8',
          fontSize: 11
        }
      }
    ],
    yAxis: [
      {
        type: 'value',
        axisLine: {
          lineStyle: { color: '#475569' }
        },
        axisLabel: {
          color: '#94a3b8',
          formatter: '£{value}',
          fontSize: 11
        },
        splitLine: {
          lineStyle: { color: '#374151' }
        }
      }
    ],
    series: [
      {
        name: 'Revenue',
        type: 'line',
        data: forecastData.map(d => d.revenue),
        itemStyle: { color: '#10b981' },
        areaStyle: { opacity: 0.3 },
        smooth: true
      },
      {
        name: 'Costs',
        type: 'line',
        data: forecastData.map(d => d.costs),
        itemStyle: { color: '#ef4444' },
        areaStyle: { opacity: 0.3 },
        smooth: true
      },
      {
        name: 'Profit',
        type: 'line',
        data: forecastData.map(d => d.profit),
        itemStyle: { color: '#3b82f6' },
        lineStyle: { width: 2 },
        smooth: true
      }
    ]
  };

  return <ReactECharts option={option} style={{ height: '100%', width: '100%' }} />;
};

export default CashFlowChart;