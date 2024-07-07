import React from 'react';
import { Typography, Card, CardContent, Button } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useEvent } from '../../context/EventContext';
import './Analytics.css';

const Analytics = () => {
    const { state } = useEvent();
    const {
        participationStatistics = { totalEvents: 0, upcomingEvents: 0, pastEvents: 0 },
        engagementMetrics = { averageParticipation: 0, feedbackReceived: 0, positiveFeedback: 0 },
        customReports = { report1: '', report2: '' }
    } = state.analytics || {};

    return (
        <div className="analytics-container">
            <Typography variant="h4" className="title">
                Analytics
            </Typography>
            <StatisticsCard statistics={participationStatistics} />
            <EngagementCard metrics={engagementMetrics} />
            <ReportsCard reports={customReports} />
        </div>
    );
};

const StatisticsCard = ({ statistics }) => {
    const data = [
        { name: 'Total Events', value: statistics.totalEvents },
        { name: 'Upcoming Events', value: statistics.upcomingEvents },
        { name: 'Past Events', value: statistics.pastEvents }
    ];

    return (
        <Card className="statistics-card">
            <CardContent>
                <Typography variant="h6" className="chart-title">
                    Participation Statistics
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="value" fill="#8884d8" />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
};

const EngagementCard = ({ metrics }) => {
    const data = [
        { name: 'Average Participation', value: metrics.averageParticipation },
        { name: 'Feedback Received', value: metrics.feedbackReceived },
        { name: 'Positive Feedback', value: metrics.positiveFeedback }
    ];

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

    return (
        <Card className="engagement-card">
            <CardContent>
                <Typography variant="h6" className="chart-title">
                    Engagement Metrics
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie
                            data={data}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={100}
                            fill="#8884d8"
                            label
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                    </PieChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
};

const ReportsCard = ({ reports }) => (
    <Card className="reports-card">
        <CardContent>
            <Typography variant="h6" className="chart-title">
                Custom Reports
            </Typography>
            <Typography variant="body2">
                Report 1: {reports.report1}
            </Typography>
            <Typography variant="body2">
                Report 2: {reports.report2}
            </Typography>
            <Button variant="contained" color="primary" className="generate-report-button">
                Generate Report
            </Button>
        </CardContent>
    </Card>
);

export default Analytics;
