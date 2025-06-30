import React from 'react';
import ReactECharts from 'echarts-for-react';
import { useFinance } from '../context/FinanceContext';

const RevenueChart = () => {
  const { state } = useFinance();

  const retainerRevenue = state.clients
    .filter(c => c.type === 'retainer')
    .reduce((sum, c) => sum + (c.amount || 0), 0);

  const projectRevenue = state.projects
    .reduce((sum, p) => sum + (p.amount || 0), 0);

  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: £{c} ({d}%)',
      textStyle: {
        fontSize: 12
      }
    },
    legend: {
      orient: 'vertical',
      left: 10,
      textStyle: {
        color: '#94a3b8',
        fontSize: 12
      }
    },
    series: [
      {
        name: 'Revenue',
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['60%', '50%'],
        avoidLabelOverlap: false,
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: '14',
            fontWeight: 'bold',
            color: '#ffffff'
          }
        },
        labelLine: {
          show: false
        },
        data: [
          {
            value: retainerRevenue,
            name: 'Retainer Clients',
            itemStyle: { color: '#3b82f6' }
          },
          {
            value: projectRevenue,
            name: 'One-off Projects',
            itemStyle: { color: '#10b981' }
          }
        ]
      }
    ]
  };

  return <ReactECharts option={option} style={{ height: '100%', width: '100%' }} />;
};

export default RevenueChart;