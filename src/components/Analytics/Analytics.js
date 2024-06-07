import React from 'react';
import { Typography, Card, CardContent } from '@mui/material';
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

const StatisticsCard = ({ statistics }) => (
    <Card className="statistics-card">
        <CardContent>
            <Typography variant="h6" className="chart-title">
                Participation Statistics
            </Typography>
            <Typography variant="body2">
                Total Events: {statistics.totalEvents}
            </Typography>
            <Typography variant="body2">
                Upcoming Events: {statistics.upcomingEvents}
            </Typography>
            <Typography variant="body2">
                Past Events: {statistics.pastEvents}
            </Typography>
            {/* Add a chart to visualize these statistics */}
        </CardContent>
    </Card>
);

const EngagementCard = ({ metrics }) => (
    <Card className="engagement-card">
        <CardContent>
            <Typography variant="h6" className="chart-title">
                Engagement Metrics
            </Typography>
            <Typography variant="body2">
                Average Participation: {metrics.averageParticipation}%
            </Typography>
            <Typography variant="body2">
                Feedback Received: {metrics.feedbackReceived}
            </Typography>
            <Typography variant="body2">
                Positive Feedback: {metrics.positiveFeedback}
            </Typography>
            {/* Add a chart to visualize these metrics */}
        </CardContent>
    </Card>
);

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
            {/* Add tools to generate custom reports */}
        </CardContent>
    </Card>
);

export default Analytics;
