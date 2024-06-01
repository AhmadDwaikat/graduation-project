import React from 'react';
import { Typography, Card, CardContent } from '@mui/material';
import './Analytics.css';
import analyticsData from '../data.json';

const Analytics = () => {
    const { participationStatistics, engagementMetrics, customReports } = analyticsData.analytics;

    return (
        <div className="analytics-container">
            <Typography variant="h4" className="title">
                Analytics
            </Typography>
            <Card className="statistics-card">
                <CardContent>
                    <Typography variant="h6" className="chart-title">
                        Participation Statistics
                    </Typography>
                    <Typography variant="body2">
                        Total Events: {participationStatistics.totalEvents}
                    </Typography>
                    <Typography variant="body2">
                        Upcoming Events: {participationStatistics.upcomingEvents}
                    </Typography>
                    <Typography variant="body2">
                        Past Events: {participationStatistics.pastEvents}
                    </Typography>
                    {/* Add a chart to visualize these statistics */}
                </CardContent>
            </Card>
            <Card className="engagement-card">
                <CardContent>
                    <Typography variant="h6" className="chart-title">
                        Engagement Metrics
                    </Typography>
                    <Typography variant="body2">
                        Average Participation: {engagementMetrics.averageParticipation}%
                    </Typography>
                    <Typography variant="body2">
                        Feedback Received: {engagementMetrics.feedbackReceived}
                    </Typography>
                    <Typography variant="body2">
                        Positive Feedback: {engagementMetrics.positiveFeedback}
                    </Typography>
                    {/* Add a chart to visualize these metrics */}
                </CardContent>
            </Card>
            <Card className="reports-card">
                <CardContent>
                    <Typography variant="h6" className="chart-title">
                        Custom Reports
                    </Typography>
                    <Typography variant="body2">
                        Report 1: {customReports.report1}
                    </Typography>
                    <Typography variant="body2">
                        Report 2: {customReports.report2}
                    </Typography>
                    {/* Add tools to generate custom reports */}
                </CardContent>
            </Card>
        </div>
    );
};

export default Analytics;
