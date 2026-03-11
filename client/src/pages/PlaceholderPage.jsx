import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/common/Card';

const PlaceholderPage = ({ title }) => {
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">{title}</h1>
            <Card>
                <CardHeader>
                    <CardTitle>Coming Soon</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-slate-500">This module is currently under development.</p>
                </CardContent>
            </Card>
        </div>
    );
};

export default PlaceholderPage;
